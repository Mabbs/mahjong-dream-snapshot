/* 纯浏览器端的 Mock 服务端 —— mock_server.py 的 JS 版
 *
 * 外层 wrapper（packet.proto）
 *   f1  packet_type   1 = Response, 2 = Request / KeepAlive
 *   f2  msg_id
 *   f3  payload（具体业务 proto）
 *   f6  ? 服务端在 KeepAlive 回包里填 2
 *   f7  uid（服务端分配的内部 uid）
 *   f8  ? 固定 1
 *   f11 seq（回显请求里的 seq）
 *   f12 ? 客户端固定填 4001
 *   f24 DataChange —— 用户数据增量回推（保存类操作靠它才算成功）
 *   f27 服务端下行计数器
 *   f29 客户端版本号
 *
 * 约定：响应 msg_id = 请求 msg_id + 1，KeepAlive(20019) 例外，原样返回。
 */
(function (global) {
  'use strict';

  var MJ = global.__mj || (global.__mj = {});
  var P = MJ.proto;
  var U = MJ.userdata;
  var DATA = MJ.data;

  var UID = 349804;                 // 服务端内部 uid（抓包里服务端返回的）
  var CLIENT_VERSION = '1.1.107241726.0';

  var LOG = { enabled: false, unhandled: [] };

  function nameOf(mid) { return (DATA.names && DATA.names[mid]) || '?'; }
  function nowS() { return Math.floor(Date.now() / 1000); }
  function nowMs() { return Date.now(); }

  function log() {
    if (!LOG.enabled) return;
    console.log.apply(console, arguments);
  }

  // 录制回放库：msg_id -> payload
  var REPLAY = {};
  for (var k in DATA.replayB64) {
    if (Object.prototype.hasOwnProperty.call(DATA.replayB64, k)) {
      REPLAY[k] = P.b64decode(DATA.replayB64[k]);
    }
  }

  // 可变的大厅用户数据：保存类操作直接改这里，并通过 wrapper f24 回推增量
  var USERDATA = new U.UserData(P.b64decode(DATA.userdataB64), UID);

  function uuid4() {
    if (global.crypto && global.crypto.randomUUID) return global.crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  // ---------------------------------------------------------------- Session
  function Session() {
    this.counter = 0;           // f27
    this.uid = UID;
    this.version = CLIENT_VERSION;
    this.sessionId = uuid4();
    this.loggedIn = false;
    this.tableId = 0;
    this.seat = -1;
  }

  /** 打包一个下行帧。extra: 额外 wrapper 字段 { fn: value } */
  Session.prototype.wrap = function (msgId, payload, seq, ptype, extra) {
    this.counter += 1;
    var w = P.W();
    w.v(1, ptype || 1);
    w.v(2, msgId);
    if (payload && payload.length) w.s(3, payload);
    if (extra && extra[6] !== undefined) w.v(6, extra[6]);
    w.v(7, this.uid);
    w.v(8, 1);
    w.v(11, seq || 0);
    if (extra && extra[12] !== undefined) w.v(12, extra[12]);
    if (extra && extra[24] !== undefined) w.s(24, extra[24]);
    w.v(27, this.counter);
    if (extra && extra[29] !== undefined) w.s(29, extra[29]);
    return w.bytes();
  };

  // ---------------------------------------------------------- 通用工具
  /** 把数据变更增量塞进响应帧的 wrapper f24。 */
  function withChange(midRsp, changes, body) {
    if (!changes) return [[midRsp, body || new Uint8Array(0), 1, null]];
    var pkt = USERDATA.changePacket(changes);
    for (var dt in changes) {
      if (!Object.prototype.hasOwnProperty.call(changes, dt)) continue;
      log('     [DataChange] %s(%s) v=%d %d 行',
          U.DT_NAMES[dt] || '?', dt, USERDATA.modules[dt].version, changes[dt].length);
    }
    return [[midRsp, body || new Uint8Array(0), 1, { 24: pkt }]];
  }

  // ---------------------------------------------------------- 各消息处理器
  var HANDLERS = {};

  /** 20001 KGameServerLoginRequest -> 20002 */
  HANDLERS[20001] = function (sess) {
    sess.loggedIn = true;
    var w = P.W();
    w.s(2, P.W().v(1, sess.uid).bytes());   // user { uid }
    w.v(63, nowS());                        // server time
    w.s(65, sess.sessionId);                // session uuid
    return [[20002, w.bytes(), 1, null]];
  };

  /** 20019 KGameServerKeepAlive -> 同 id 返回服务器毫秒时间戳 */
  HANDLERS[20019] = function (sess) {
    var body = P.W().v(1, nowMs()).bytes();
    return [[20019, body, 2, { 6: 2, 12: 4001, 29: sess.version }]];
  };

  /** 100141 QueryUserDataRequest -> 100142，下发当前（可变的）大厅数据 */
  HANDLERS[100141] = function () {
    return [[100142, USERDATA.serialize(), 1, null]];
  };

  /** 100204 WearMahjongWarriorSculptRequest { 1:SculptId, 2:WarriorId } -> 100205
   *  Response 本身是空消息，真正让客户端认账的是 wrapper f24 的增量。 */
  HANDLERS[100204] = function (sess, payload) {
    var d = P.dict(payload);
    var sculptId = d[1] || 0, warriorId = d[2] || 0;
    var changes = USERDATA.wearSculpt(warriorId, sculptId);
    log('     雀士 %s 换皮肤 -> %s %s', warriorId, sculptId,
        changes ? 'OK' : '（找不到该雀士）');
    return withChange(100205, changes);
  };

  /** 100011 SelectEquipmentInUseRequest { 1: map<DataType,int> } -> 100012
   *  换头像 / 换出战雀士 / 换牌桌装扮都走这个。 */
  HANDLERS[100011] = function (sess, payload) {
    var pairs = [];
    var fs = P.parse(payload);
    for (var i = 0; i < fs.length; i++) {
      if (fs[i][0] !== 1 || fs[i][1] !== 2) continue;
      var e = P.dict(fs[i][2]);
      if (e[1] !== undefined) pairs.push([e[1], e[2] || 0]);
    }
    var changes = USERDATA.selectEquipment(pairs);
    var desc = pairs.map(function (p) {
      return (U.DT_NAMES[p[0]] || '?') + '(' + p[0] + ')=' + p[1];
    }).join(', ');
    log('     使用中装备 -> %s', desc);
    return withChange(100012, changes);
  };

  /** 20007 GetTableList -> 20008 空牌桌列表（离线下没有真实房间） */
  HANDLERS[20007] = function () {
    return [[20008, P.W().v(1, 0).bytes(), 1, null]];
  };

  /** 20009 EnterTable -> 20010 + 20011 广播 */
  HANDLERS[20009] = function (sess) {
    sess.tableId = 100001;
    var body = P.W().v(1, 0).v(2, sess.tableId).bytes();
    var bc = P.W().v(1, sess.tableId).v(2, sess.uid).bytes();
    return [[20010, body, 1, null], [20011, bc, 1, null]];
  };

  /** 20012 EnterSeat -> 20013 + 20014 广播 */
  HANDLERS[20012] = function (sess) {
    sess.seat = 0;
    var body = P.W().v(1, 0).v(2, sess.seat).bytes();
    var bc = P.W().v(1, sess.tableId).v(2, sess.uid).v(3, sess.seat).bytes();
    return [[20013, body, 1, null], [20014, bc, 1, null]];
  };

  /** 21401 -> 21402 直接回放录制到的响应 */
  HANDLERS[21401] = function () {
    return [[21402, REPLAY[21402] || new Uint8Array(0), 1, null]];
  };

  // ------------------------------------------------------------ 请求派发
  function dispatch(sess, raw) {
    var fields;
    try {
      fields = P.parse(raw);
    } catch (e) {
      console.warn('[mock] 无法解析的帧 %dB: %s', raw.length, e.message);
      return [];
    }
    var d = {};
    for (var i = 0; i < fields.length; i++) d[fields[i][0]] = fields[i][2];
    var mid = d[2];
    var seq = d[11] || 0;
    var payload = (d[3] instanceof Uint8Array) ? d[3] : new Uint8Array(0);
    if (d[29] instanceof Uint8Array) sess.version = P.fromUtf8(d[29]);

    var fn = HANDLERS[mid];
    var out, tag;
    if (!fn) {
      if (REPLAY[mid + 1]) {
        out = [[mid + 1, REPLAY[mid + 1], 1, null]];
        tag = 'replay';
      } else {
        out = [[mid + 1, new Uint8Array(0), 1, null]];
        tag = 'auto-ok';
        LOG.unhandled.push({ msgId: mid, name: nameOf(mid), seq: seq,
                             payload: payload, t: nowMs() });
      }
    } else {
      try {
        out = fn(sess, payload, seq);
        tag = 'handled';
      } catch (e) {
        console.error('[mock] handler 异常 (mid=%s):', mid, e);
        out = [[mid + 1, new Uint8Array(0), 1, null]];
        tag = 'error';
      }
    }
    log('  <- %s %s seq=%s %dB [%s]', mid, nameOf(mid), seq, raw.length, tag);

    var frames = [];
    for (var j = 0; j < out.length; j++) {
      var frame = sess.wrap(out[j][0], out[j][1], seq, out[j][2], out[j][3]);
      frames.push(frame);
      log('  -> %s %s %dB', out[j][0], nameOf(out[j][0]), frame.length);
    }
    return frames;
  }

  // ------------------------------------------------------- FakeWebSocket
  var CONNECTING = 0, OPEN = 1, CLOSING = 2, CLOSED = 3;

  function FakeWebSocket(url, protocols) {
    var self = this;
    this.url = String(url);
    this.protocol = Array.isArray(protocols) ? (protocols[0] || '') : (protocols || '');
    this.extensions = '';
    this.readyState = CONNECTING;
    this.bufferedAmount = 0;
    this.binaryType = 'blob';
    this.onopen = null;
    this.onmessage = null;
    this.onerror = null;
    this.onclose = null;
    this._listeners = {};
    this._session = new Session();

    log('[mock] 建立虚拟连接 %s', this.url);
    // 异步触发 open，模拟真实握手时序（同步触发会让调用方还没绑上 onopen）
    setTimeout(function () {
      if (self.readyState !== CONNECTING) return;
      self.readyState = OPEN;
      self._emit('open', { type: 'open', target: self });
    }, 0);
  }

  FakeWebSocket.prototype.addEventListener = function (type, fn) {
    (this._listeners[type] || (this._listeners[type] = [])).push(fn);
  };

  FakeWebSocket.prototype.removeEventListener = function (type, fn) {
    var arr = this._listeners[type];
    if (!arr) return;
    var i = arr.indexOf(fn);
    if (i >= 0) arr.splice(i, 1);
  };

  FakeWebSocket.prototype.dispatchEvent = function (ev) {
    this._emit(ev.type, ev);
    return true;
  };

  FakeWebSocket.prototype._emit = function (type, ev) {
    var on = this['on' + type];
    if (typeof on === 'function') {
      try { on.call(this, ev); } catch (e) { console.error('[mock] on' + type, e); }
    }
    var arr = this._listeners[type];
    if (!arr) return;
    for (var i = 0; i < arr.slice().length; i++) {
      try { arr[i].call(this, ev); } catch (e) { console.error('[mock] listener ' + type, e); }
    }
  };

  /** 按 binaryType 把响应包装成客户端期望的形态。 */
  FakeWebSocket.prototype._deliver = function (bytes) {
    var self = this;
    var data;
    if (this.binaryType === 'arraybuffer') {
      // 复制一份独立的 ArrayBuffer，避免调用方持有我们的内部视图
      data = bytes.slice().buffer;
    } else {
      data = new Blob([bytes]);
    }
    self._emit('message', {
      type: 'message', data: data, target: self,
      origin: self.url, lastEventId: '', source: null, ports: []
    });
  };

  FakeWebSocket.prototype.send = function (payload) {
    if (this.readyState !== OPEN) {
      throw new DOMException('WebSocket is not open', 'InvalidStateError');
    }
    var bytes;
    if (payload instanceof ArrayBuffer) bytes = new Uint8Array(payload);
    else if (ArrayBuffer.isView(payload)) {
      bytes = new Uint8Array(payload.buffer, payload.byteOffset, payload.byteLength);
    } else if (typeof payload === 'string') bytes = P.utf8(payload);
    else {
      console.warn('[mock] 不支持的发送类型', payload);
      return;
    }
    // 复制一份，防止调用方复用同一块 buffer 导致后续解析读到脏数据
    bytes = bytes.slice();

    var self = this;
    var frames = dispatch(this._session, bytes);
    if (!frames.length) return;
    // 异步投递，模拟网络往返；同步回调会打乱 Unity 的消息队列
    setTimeout(function () {
      if (self.readyState !== OPEN) return;
      for (var i = 0; i < frames.length; i++) self._deliver(frames[i]);
    }, 0);
  };

  FakeWebSocket.prototype.close = function (code, reason) {
    if (this.readyState === CLOSED || this.readyState === CLOSING) return;
    this.readyState = CLOSING;
    var self = this;
    setTimeout(function () {
      self.readyState = CLOSED;
      self._emit('close', {
        type: 'close', code: code || 1000, reason: reason || '',
        wasClean: true, target: self
      });
      log('[mock] 虚拟连接已关闭');
    }, 0);
  };

  FakeWebSocket.CONNECTING = CONNECTING;
  FakeWebSocket.OPEN = OPEN;
  FakeWebSocket.CLOSING = CLOSING;
  FakeWebSocket.CLOSED = CLOSED;
  FakeWebSocket.prototype.CONNECTING = CONNECTING;
  FakeWebSocket.prototype.OPEN = OPEN;
  FakeWebSocket.prototype.CLOSING = CLOSING;
  FakeWebSocket.prototype.CLOSED = CLOSED;

  // ------------------------------------------------------------------ 导出
  MJ.server = {
    FakeWebSocket: FakeWebSocket,
    Session: Session,
    handlers: HANDLERS,
    replay: REPLAY,
    log: LOG,
    uid: UID,

    /** 当前大厅数据状态（可在控制台直接改） */
    get userdata() { return USERDATA; },

    /** 恢复到初始快照 */
    reset: function () {
      USERDATA = new U.UserData(P.b64decode(DATA.userdataB64), UID);
      console.log('[mock] 用户数据已重置');
    },

    /** 关掉刷屏日志 */
    quiet: function (on) { LOG.enabled = (on === false); },

    /** 查看被 auto-ok 兜底的请求（说明还没实现对应 handler） */
    unhandled: function () {
      var seen = {};
      LOG.unhandled.forEach(function (r) {
        var key = r.msgId + ' ' + r.name;
        seen[key] = (seen[key] || 0) + 1;
      });
      return seen;
    },

    /** 导出当前大厅数据，方便存成新的 patch */
    dump: function () {
      var b = USERDATA.serialize();
      var s = '';
      for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
      return global.btoa(s);
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
