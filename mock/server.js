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

  var LOG = { enabled: true, unhandled: [] };

  /** 请求频率统计：msgId -> { n, last }，用于定位「刷屏」消息 */
  var REQ_STATS = {};

  /** 最近 100141 请求详情（用于诊断刷屏） */
  var LAST_QUERIES = [];

  /** 对局参数：可用 URL 查询串覆盖，也可在控制台改 __mj.config 后重进对局。
   *    ?mjPlayers=3   三麻（摸到北自动拔北）
   *    ?mjSeed=12345  固定牌山随机种子，便于复现
   *    ?mjSpeed=0.4   AI 思考延迟倍率，0 = 瞬间
   */
  var CONFIG = MJ.config || (MJ.config = {
    players: 4, akaCount: 1, speed: 1, seed: undefined, autoHuman: false
  });
  (function readQuery() {
    try {
      var q = new URLSearchParams(global.location ? global.location.search : '');
      if (q.get('mjPlayers')) {
        CONFIG.players = parseInt(q.get('mjPlayers'), 10);
        CONFIG.playersExplicit = true;   // 显式指定时忽略匹配请求里的 gameType
      }
      if (q.get('mjMatchDelay')) CONFIG.matchDelay = parseInt(q.get('mjMatchDelay'), 10);
      if (q.get('mjSeed')) CONFIG.seed = parseInt(q.get('mjSeed'), 10);
      if (q.get('mjSpeed')) CONFIG.speed = parseFloat(q.get('mjSpeed'));
      if (q.get('mjAka')) CONFIG.akaCount = parseInt(q.get('mjAka'), 10);
      if (q.get('mjAutoHuman')) CONFIG.autoHuman = parseInt(q.get('mjAutoHuman'), 10) !== 0;
    } catch (e) { /* 非浏览器环境 */ }
  })();

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

  /* ================================================================== *
   * 100141 刷屏的真正根因：DT39(Task) 的「刷新点」是时间戳，快照里已过期
   * ------------------------------------------------------------------
   * schema（protos/src/user_info/user_info.proto）：
   *   TaskInfo{1:ResidentTask} -> ResidentTask{3:map<int32,SingleTaskRecycleData>}
   *   SingleTaskRecycleData{1:recycleType(1=每日,2=每周), 2:score,
   *                         3:refreshTime(下次刷新点), 4:realRefreshTime(上次实际刷新)}
   *
   * 客户端逻辑是「now >= refreshTime -> 本地任务数据过期 -> 发 100141 查 DT39」。
   * mock 回「版本相同 + 0 行」，客户端本地的 refreshTime 仍是过去时间，于是
   * 立刻再查 —— 这就是 43B 请求 / 27B 响应的死循环刷屏（与模块存不存在无关）。
   * 真实服在刷新点到来时会重算任务、bump 版本、下发「未来的 refreshTime」，
   * 客户端一轮就收敛，所以真实抓包里 DT39 只是偶发轮询而非刷屏。
   *
   * 修复：启动时（以及每次查询 DT39 时）把过期的刷新点推到下一个刷新点，
   * 并 bump 模块版本 —— 客户端 cliVer < srvVer 会拿到整模块 + 未来刷新点，
   * 于是不再重复请求这个接口。幂等：未过期时不做任何改动。
   * ================================================================== */
  var TZ_OFFSET = 8 * 3600;                 // 刷新点按 UTC+8 的 00:00 计算

  function dayIndex(ts) { return Math.floor((ts + TZ_OFFSET) / 86400); }
  function dayStart(d) { return d * 86400 - TZ_OFFSET; }
  function dayOfWeek(d) { return (d + 4) % 7; }      // 0=周日（1970-01-01 是周四）

  /** 下一个刷新点：type 2=每周(下周一 00:00)，其余按每日(次日 00:00) */
  function nextRefreshPoint(rtype, now) {
    var d = dayIndex(now);
    if (Number(rtype) === 2) {
      var dow = dayOfWeek(d) || 7;                   // 1..7，7=周日
      return dayStart(d + (8 - dow));
    }
    return dayStart(d + 1);
  }

  /** 当前周期起点（写入 realRefreshTime：上一次实际刷新时刻） */
  function curPeriodStart(rtype, now) {
    var d = dayIndex(now);
    if (Number(rtype) === 2) {
      var dow = dayOfWeek(d) || 7;
      return dayStart(d - (dow - 1));
    }
    return dayStart(d);
  }

  function tsText(ts) {
    try { return new Date(Number(ts) * 1000).toLocaleString(); }
    catch (e) { return String(ts); }
  }

  /** 改写一条 SingleTaskRecycleData；未过期返回 null（不改动） */
  function fixRecycleValue(valBytes, mapKey, now) {
    var d = P.dict(valBytes);
    var rtype = Number(d[1] != null ? d[1] : mapKey) || 1;
    var old = Number(d[3] || 0);
    if (old > now) return null;                      // 刷新点还在未来 -> 无需处理
    var to = nextRefreshPoint(rtype, now);
    var nb = P.setVarint(valBytes, 3, to);           // refreshTime -> 下一个刷新点
    nb = P.setVarint(nb, 4, curPeriodStart(rtype, now));  // realRefreshTime -> 本周期起点
    return { bytes: nb, rtype: rtype, from: old, to: to };
  }

  /** 遍历 ResidentTask.f3(recycles map entry)，过期的改写；无改动返回 null */
  function fixResidentTask(bytes, now, report) {
    var fs = P.parse(bytes), w = P.W(), changed = false;
    for (var i = 0; i < fs.length; i++) {
      var fn = fs[i][0], wt = fs[i][1], val = fs[i][2];
      if (fn === 3 && wt === 2) {
        var mapKey = Number(P.dict(val)[1] || 0);
        var ent = P.parse(val), ew = P.W(), entChanged = false;
        for (var j = 0; j < ent.length; j++) {
          var efn = ent[j][0], ewt = ent[j][1], ev = ent[j][2];
          if (efn === 2 && ewt === 2) {
            var r = fixRecycleValue(ev, mapKey, now);
            if (r) {
              ew.s(2, r.bytes);
              entChanged = true;
              r.key = mapKey;
              report.push(r);
              continue;
            }
          }
          P.reencode(ew, efn, ewt, ev);
        }
        if (entChanged) { w.s(3, ew.bytes()); changed = true; continue; }
      }
      P.reencode(w, fn, wt, val);
    }
    return changed ? w.bytes() : null;
  }

  /** DT39 Task：把过期刷新点推到未来并 bump 版本。返回是否有改动（幂等） */
  function fixTaskRefreshTime(why) {
    var mod = USERDATA.modules[39];
    if (!mod || !mod.order || !mod.order.length) return false;
    var now = nowS(), report = [], changed = false;
    for (var oi = 0; oi < mod.order.length; oi++) {
      var key = mod.order[oi], data = mod.rows[key];
      if (!data || !data.length) continue;
      var fs = P.parse(data), w = P.W(), rowChanged = false;
      for (var i = 0; i < fs.length; i++) {
        var fn = fs[i][0], wt = fs[i][1], val = fs[i][2];
        if (fn === 1 && wt === 2) {                  // TaskInfo.residentTask
          var nb = fixResidentTask(val, now, report);
          if (nb) { w.s(1, nb); rowChanged = true; continue; }
        }
        P.reencode(w, fn, wt, val);
      }
      if (rowChanged) { mod.rows[key] = w.bytes(); changed = true; }
    }
    if (changed) {
      // 版本必须「随天数单调递增」：每次重载都从快照基线(21530)开始修，
      // 若固定只 +1，则第二天重载后版本仍是 21531 —— 客户端缓存里也是 21531，
      // 于是拿不到新数据、但本地刷新点已过期 -> 又开始刷屏。
      // 这里按「已跨过的天数」加权，保证隔天重载版本一定比客户端缓存更高。
      var gap = 0;
      for (var g = 0; g < report.length; g++) {
        if (report[g].from > 0) {
          gap = Math.max(gap, dayIndex(now) - dayIndex(report[g].from));
        }
      }
      mod.version = (mod.version || 0) + 1 + Math.max(0, gap);
      for (var r = 0; r < report.length; r++) {
        log('[mock] DT39 刷新点修正(%s)：key=%s %s  refreshTime %s -> %s  (DT39 v%d)',
          why, report[r].key, Number(report[r].rtype) === 2 ? '每周' : '每日',
          tsText(report[r].from), tsText(report[r].to), mod.version);
      }
    }
    return changed;
  }
  fixTaskRefreshTime('启动');

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
    this.socket = null;         // 绑定的 FakeWebSocket，服务端主动下推时用
    this.lastSeq = 0;           // 最近一次请求的 seq，主动推送时沿用
    this.riichi = null;         // 立直麻将对局会话（惰性创建）
    // 断线重连恢复用（见 HANDLERS[20162]）：
    this.table = null;          // 牌桌快照 { sanma, self, robots }，20403 匹配成型时写入
    this.handFrames = [];       // 本局已下发的 20018 通知帧，重连后按序重放以重建局面
  }

  /** 服务端主动下推一帧（不由某个请求触发，比如 AI 摸打产生的对局事件）。
   *  异步投递：同步回调会在客户端的 send() 调用栈里重入，打乱 Unity 的消息队列。 */
  Session.prototype.push = function (msgId, payload, ptype, extra, seq) {
    var sock = this.socket;
    if (!sock || sock.readyState !== OPEN) return;
    // 默认 seq=null（通知帧，不写 f11）；对局引擎的 Rsp* 响应帧会显式传入请求 seq
    var frame = this.wrap(msgId, payload, seq === undefined ? null : seq, ptype || 1, extra);
    setTimeout(function () {
      if (sock.readyState === OPEN) sock._deliver(frame);
    }, 0);
  };

  /** 连接断开时释放附属资源 */
  Session.prototype.destroy = function () {
    if (this.riichi) {
      try { this.riichi.stop(); } catch (e) { /* ignore */ }
      this.riichi = null;
    }
    this.socket = null;
  };

  /** 暂停会话（保留引擎，供重连后复用） */
  Session.prototype.suspend = function () {
    this.socket = null;  // 断开 WS 绑定，但保留 riichi 引擎
  };

  /** 重连时把旧会话的引擎接到新 WS 上 */
  Session.prototype.resume = function (socket) {
    var self = this;
    this.socket = socket;
    this.replaying = false;
    this._replayStarted = false;
    if (this._resyncTimer) { clearTimeout(this._resyncTimer); this._resyncTimer = null; }

    // 重连后客户端要先登录、拉用户数据，才会发 20162 问「我还在局里吗」，
    // 抓包里这中间隔了约 4 秒。这段时间引擎照旧在摸打，如果实时下推，客户端会
    // 先看到「当前这一巡」、再看到重放的「本局开头」，牌局直接错乱。
    // 所以一重连就先把下推挂起攒着，等 20162 触发重放时按序补齐。
    if (this.tableId && this.riichi && !this.riichi.matchOver) {
      this.replaying = true;
      // 兜底：客户端始终没来问 20162（例如它压根不打算恢复对局），到点就恢复
      // 实时下推，不能把帧无限期扣在缓存里。
      this._resyncTimer = setTimeout(function () {
        self._resyncTimer = null;
        if (!self.replaying) return;
        self.replaying = false; self._replayStarted = false;
        log('[mock] 重连后 10s 未收到 20162，恢复实时下推');
      }, 10000);
    }
    if (this.riichi) {
      // 引擎的 emit 需要能推到新 WS。riichi 引擎用的是 emit 回调，需要重建引擎
      // 这里只保留 riichi 引用，Server.prototype.push 走 socket 下发即可。
    }
  };

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
    // f11 = RPC 请求序列号：只有「响应帧」才回显客户端请求的 seq（传数字，含0）。
    // 服务器主动推送的通知（20408/NtfToPrepare/...）传 null，不写 f11，
    // 否则客户端会把这些通知误当成「匹配的迟到响应」而忽略，导致卡在匹配界面。
    if (seq !== null && seq !== undefined) w.v(11, seq);
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
    var pkt = USERDATA.changeNotify(changes);
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
    // 进行中对局标记：真实服在客户端「还坐在一局没打完的牌里」时回 f22=1，
    // 客户端据此发 20162（Offline2OnlineRequest）来恢复对局；缺了这一位，客户端会
    // 判定「牌局已不存在」→ 直接发 20102 退回大厅（见 capture/dongfeng1 帧 10-12）。
    // 仅当本会话确有未结束的对局(tableId 存在)时才置位，避免干扰正常登录/大厅。
    if (sess.tableId) w.v(22, 1);
    return [[20002, w.bytes(), 1, null]];
  };

  /** 20019 KGameServerKeepAlive -> 同 id 返回服务器毫秒时间戳 */
  HANDLERS[20019] = function (sess) {
    var body = P.W().v(1, nowMs()).bytes();
    return [[20019, body, 2, { 6: 2, 12: 4001, 29: sess.version }]];
  };

  /** 100141 QueryUserDataRequest -> 100142
   *
   *  增量协议（与真实服一致，参考 proto/user_info/user_data.proto 的
   *  QueryUserDataSingleTypeResponse.version）：
   *    · 未带版本 / uint64-max「全部」哨兵 -> 返回整模块（含服务端当前 version）
   *    · 带具体版本 Vc：
   *        - Vc >= 服务端版本 -> 回头部 0 行，version 用「服务端权威值」
   *                              （不是回显客户端版本，否则客户端永远学不到真实版本）
   *        - Vc <  服务端版本 -> 直接回整模块，让客户端一轮就拿到最新数据+版本，收敛
   *
   *  旧实现把客户端版本原样回显且永远回 0 行，IndexedDB 旧缓存与快照版本不一致时
   *  客户端永远收不到最新数据 → 重查死循环，只能用断 WebSocket 来「重置」。
   *  现在按服务端权威版本收敛，单次查询即同步，无需断线。
   */
  HANDLERS[100141] = function (sess, payload) {
    var queries = [];
    try {
      var fs = P.parse(payload);
      for (var i = 0; i < fs.length; i++) {
        if (fs[i][0] !== 2 || fs[i][1] !== 2) continue;
        var q = P.dict(fs[i][2]);
        if (q[1] == null) continue;
        queries.push([q[1], q[2] == null ? -1 : q[2]]);
      }
    } catch (e) { /* 解析失败时退化为全量 */ }

    // 时间自愈：涉及 DT39 时先把过期刷新点推到未来（幂等）。这样本次响应就带上
    // 「未来的 refreshTime」+ 更高版本，客户端一轮即收敛；挂机跨天后也能自愈。
    var touchTask = !queries.length;
    for (var qi = 0; qi < queries.length; qi++) {
      if (Number(queries[qi][0]) === 39) touchTask = true;
    }
    if (touchTask) fixTaskRefreshTime('100141');

    if (!queries.length) return [[100142, USERDATA.serialize(), 1, null]];

    var w = P.W();
    for (var h = 0; h < USERDATA.headParts.length; h++) {
      P.reencode(w, USERDATA.headParts[h][0], USERDATA.headParts[h][1], USERDATA.headParts[h][2]);
    }
    var dataCount = 0, missCount = 0, details = [];
    for (var k = 0; k < queries.length; k++) {
      var dt = queries[k][0];
      // cliVer 可能是 BigInt（uint64 全量哨兵），统一转 number 避免比较/编码抛错
      var raw = queries[k][1];
      var cliVer = (typeof raw === 'bigint') ? Number(raw) : (raw == null ? -1 : Number(raw));
      var mod = USERDATA.modules[dt];

      if (mod == null) {
        // 模块在 mock 快照里不存在（例：dt=3 不在 userdataB64 中）。
        // 旧实现返回「无版本头部」，客户端永远无法判定已同步 -> 反复重查死循环（刷屏）。
        // 修复：回显客户端版本（或 0），让客户端能正常收敛、停止轮询。
        var hv = (cliVer > 0 && cliVer < 1e18) ? cliVer : 0;
        w.s(3, P.W().v(1, dt).v(2, hv).bytes());
        missCount++;
        details.push(dt + '(缺失)cli=' + cliVer + '->' + hv);
        continue;
      }

      var isFull = (cliVer < 0) || (cliVer >= 1e18);   // 未带版本 / uint64-max 全量哨兵
      if (isFull) {
        w.s(3, mod.serialize());                        // 整模块（带服务端当前版本）
        dataCount++;
        details.push(dt + ':全量->v' + mod.version);
      } else if (cliVer < mod.version) {
        w.s(3, mod.serialize());                        // 客户端落后 -> 给整模块，一次同步
        dataCount++;
        details.push(dt + ':cli=' + cliVer + '<srv=' + mod.version + '->下发整模块');
      } else {
        // 已最新/超前：回显「客户端版本」，0 行（与真实服一致——真实服即回显客户端版本）
        w.s(3, P.W().v(1, dt).v(2, cliVer).bytes());
        details.push(dt + ':cli=' + cliVer + '=srv->0行');
      }
    }
    var mode = (queries.length && (queries[0][1] >= 1e18 || queries[0][1] < 0))
      ? '全量' : '增量';
    if (queries.length <= 4) {
      log('  [100141] %s：%s', mode, details.join('  '));
    } else {
      log('  [100141] %s：%d 个 dt 请求，%d 个带数据下发，缺失=%d',
        mode, queries.length, dataCount, missCount);
    }
    return [[100142, w.bytes(), 1, null]];
  };

  /** 100903 KtaskClientEventRequest -> 100904 */
  HANDLERS[100903] = function (sess, payload) {
    var d = P.dict(payload);
    var evtType = d[1] || 0;
    var changes = USERDATA.bumpModule(39);   // DT39 Task version+1
    log('     [task] clientEvent type=' + evtType + ' -> DT39 ver bump');
    return withChange(100904, changes);
  };

  /** 100003 KClientLobbyModifyGameSettingRequest -> 100004 */
  HANDLERS[100003] = function (sess, payload) {
    var d = P.dict(payload);
    var gs = (d[2] instanceof Uint8Array) ? d[2] : null;
    var changes = gs ? USERDATA.updateGameSetting(gs) : null;
    log('     [setting] ModifyGameSetting -> DT2 %s',
      changes ? 'OK v' + USERDATA.modules[2].version : '（无 GameSetting 字段）');
    return withChange(100004, changes);
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

  /** 100011 SelectEquipmentInUseRequest { 1: repeated Entry{1:DataType,2:Value} } -> 100012
   *  换头像 / 换出战雀士 / 换皮肤 / 切场景(背景+内景) 全都走这个。
   *
   *  对照正式服抓包（capture/live4）确认的真实回包形态：
   *    body = SelectEquipmentInUseResponse { 2: <原样回显请求 payload> }
   *    f24  = DataChangeNotify { 1: UserDataChange{ DT1 整行, ct=MODIFY, ver+N } }
   *  之前 body 为空 + f24 少套一层 f1，客户端认不了，所以 UI 切不动。 */
  HANDLERS[100011] = function (sess, payload) {
    var pairs = [];
    var fs = P.parse(payload);
    for (var i = 0; i < fs.length; i++) {
      if (fs[i][0] !== 1 || fs[i][1] !== 2) continue;
      var inner = P.parse(fs[i][2]);
      var dt = null, val = 0;
      for (var k = 0; k < inner.length; k++) {
        if (inner[k][0] === 1) dt = inner[k][2];
        else if (inner[k][0] === 2) val = inner[k][2];
      }
      if (dt !== null) pairs.push([dt, val]);
    }
    log('     使用中装备 -> %s', pairs.map(function (p) {
      return (U.DT_NAMES[p[0]] || '?') + '(' + p[0] + ')=' + p[1];
    }).join(', '));

    var changes = USERDATA.selectEquipment(pairs);
    // 回显：把请求 payload 原封不动塞进 f2（与正式服字节级一致）
    var body = payload && payload.length
      ? P.W().s(2, payload).bytes()
      : new Uint8Array(0);
    return withChange(100012, changes, body);
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

  /** 100620 KclientSignInReq -> 100621 */
  HANDLERS[100620] = function (sess, payload) {
    var changes = USERDATA.dailySignIn();
    log('     跨日签到 -> SignIn 时间戳刷新%s', changes ? ' OK' : '（无 SignIn 模块）');
    return withChange(100621, changes);
  };

  // ------------------------------------------- 立直麻将对局通道 (20018)
  // 20018 (kGameServerLogicData) 的 payload 是 KRiichiMsg（riichi.proto）：
  //   f1   = msgType（RiichiMsg 枚举）
  //   f3   = 服务器毫秒时间戳
  //   f100 = payload（具体 Req*/Rsp*/Ntf* 消息的序列化字节）
  // 这里只负责拆信封 → 交给浏览器内的对局引擎（mock/riichi.js）→ 把引擎回推的
  // 事件重新封成 KRiichiMsg 经 20018 下发。整局逻辑（发牌/摸打/副露/立直/和牌/
  // 流局/连庄/点棒）和 AI 全在浏览器里跑，不需要任何本地服务。
  var RIICHI_NAMES = {
    1: 'ReqPrepare', 2: 'RspPrepare', 3: 'ReqPlayCard', 4: 'RspPlayCard',
    5: 'ReqQiangCard', 6: 'RspQiangCard', 7: 'ReqSetInternalState', 8: 'RspSetInternalState',
    9: 'ReqCloseOfflineTip', 10: 'RspCloseOfflineTip', 11: 'ReqClickUI', 12: 'RspClickUI',
    1001: 'NtfToPrepare', 1002: 'NtfPrepare', 1003: 'NtfGameStart', 1004: 'NtfSendCard',
    1005: 'NtfPlayCard', 1006: 'NtfQiangCard', 1007: 'NtfQiangCardEnd', 1008: 'NtfGameStop',
    1009: 'NtfOfflineToolTip'
  };

  function riichiName(mt) { return RIICHI_NAMES[mt] || String(mt); }

  var RIICHI_NTF_TO_PREPARE = 1001;   // 每局第一帧，断线重放缓存以它为分界
  var RIICHI_NTF_GAME_START = 1003;   // 开牌帧，用来判断本局是否已经开始

  /** 打包 KRiichiMsg 信封（字段顺序与正式服一致：1, 3, 100） */
  function encodeKRiichi(msgType, inner) {
    return P.W().v(1, msgType).v(3, nowMs())
      .s(100, inner || new Uint8Array(0)).bytes();
  }

  /** 惰性建立本连接的对局会话 */
  function getRiichi(sess) {
    if (sess.riichi) return sess.riichi;
    var R = MJ.riichi;
    if (!R || !R.RiichiSession) {
      console.error('[mock] 未加载 mock/riichi.js，20018 对局通道不可用');
      return null;
    }
    // 座位 -> uid，必须和 20408 TableInfo / 20014 EnterSeatBc 下发的完全一致：
    // 客户端是按 userID 在 NtfToPrepare 的名单里找自己的，对不上就整局丢弃。
    var uids = [sess.uid];
    for (var i = 0; i + 1 < CONFIG.players; i++) uids.push(ROBOTS[i].uid);

    sess.riichi = new R.RiichiSession({
      players: CONFIG.players,
      // 三麻起点 35000（抓包 NtfGameStart 里 score/initScore 就是 35000）
      startScore: CONFIG.players === 3 ? 35000 : 25000,
      akaCount: CONFIG.akaCount,
      speed: CONFIG.speed,
      seed: CONFIG.seed,
      uids: uids,
      autoHuman: CONFIG.autoHuman,
      log: function (s) { log(s); },
      onFrame: function (ev, bytes) {
        log('  => 20018 %s %dB', riichiName(ev), bytes.length);
        // Rsp*（偶数 msgType 且 <1000）是对客户端 Req* 的响应，需回显请求 seq；
        // Ntf*（>=1000）是主动通知，不带 seq。
        var isRsp = (ev < 1000 && ev % 2 === 0);
        // 断线重连恢复：缓存本局的通知帧。NtfToPrepare(1001) 是每局的第一帧，
        // 到它就翻页。Rsp* 是对上行的应答，重放没有意义，不缓存。
        // 注意这里与 sess.push 相互独立：断线期间 push 会因 socket 关闭而丢帧，
        // 但缓存照记，这样重连后能把「断线这段时间 AI 摸打的过程」一并补给客户端。
        if (ev >= 1000) {
          if (ev === RIICHI_NTF_TO_PREPARE) sess.handFrames = [];
          sess.handFrames.push([ev, bytes]);
          if (!sess.replaying && sess.handFrames.length > 600) sess.handFrames.shift();
          // 重放进行中：新帧只入队，由 replayHand 顺着下标追上来一起发，
          // 免得历史帧和新帧交错把客户端的牌局搅乱。
          if (sess.replaying) return;
        }
        sess.push(20018, encodeKRiichi(ev, bytes), 1, null, isRsp ? (sess._reqSeq || 0) : null);
      }
    });
    return sess.riichi;
  }

  /** 20162 KGameServerOffline2OnlineRequest -> 20163
   *  客户端在登录响应(20002)带 f22=1（进行中对局标记）时，连上后会发一次，
   *  问「我是不是还在一局没打完的牌里」。mock 的 20002 必须补 f22=1 才会触发本分支
   *  （见 HANDLERS[20001]）；缺了它，客户端判定牌局已不存在，直接发 20102 退大厅。
   *
   *  ★ 这是「Bye! 之后直接退出对局」的根因所在。
   *  客户端用的 BestHTTP，WebSocket.Close() 无参时的默认 reason 就是 "Bye!"；
   *  发起者是 BH_NetworkManager.ForceCloseWhenTimeout —— UpdateNetTimes 靠
   *  Time.unscaledDeltaTime 累加判超时，只要 Unity 主线程卡顿一段时间，恢复后
   *  这段时间会被一次性补进计时器，立刻判定网络超时并主动关连接。
   *  这在连正式服的抓包里同样出现过（capture/dongfeng1 帧 108→109：客户端发完
   *  心跳后整整 11.7s 一帧未发，随后重连），属于客户端自我保护，服务端无法根治。
   *
   *  能治的是「重连之后」：真实服在这里回 f4=TableInfo，客户端于是知道自己还在
   *  局内、继续等服务器同步牌局；而这里原先无条件回「无对局」，客户端就认定牌局
   *  已经不存在，随即发 20102 FinishGameStop 退回大厅——也就是用户看到的
   *  「Bye! → 重连 → 直接退出对局」。
   *
   *  注意 f3 恒为 -1：抓包里有对局时它也是 -1，判据是 f4 在不在，不是 f3。 */
  HANDLERS[20162] = function (sess) {
    var live = !!(sess.tableId && sess.table && sess.riichi && !sess.riichi.matchOver);

    var w = P.W();
    w.v(1, sess.uid);
    w.tag(3, 0);
    w.raw([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01]);
    if (live) w.s(4, encTableInfo(sess, true));   // 有进行中对局：带上完整牌桌
    w.v(5, 3);                                    // 游戏状态

    if (live && !sess._replayStarted) {
      sess._replayStarted = true;
      log('  [resync] 有进行中对局，回 TableInfo 并准备重放本局 %d 帧',
        sess.handFrames.length);
      // 真实服在 20163 之后主动推 NtfPrepare/NtfGameStart 把牌局同步回来。
      // 我们没有「任意局面快照」，改用等价做法：把本局从 NtfToPrepare 起的所有
      // 通知帧按序重放一遍，客户端顺着这串帧自己走回当前局面。
      // 断线期间 AI 摸打产生的帧也在缓存里（onFrame 记账与 push 相互独立），一并补上。
      //
      // 这里必须【立刻】挂起实时下推，不能等到 replayHand 真正开跑：中间这段
      // 等客户端切回牌桌的时间里引擎还在摸打，那些新帧会抢在重放之前发出去，
      // 客户端就会先看到「当前这一巡」再看到「本局开头」，牌局直接错乱。
      sess.replaying = true;
      if (sess._resyncTimer) { clearTimeout(sess._resyncTimer); sess._resyncTimer = null; }
      setTimeout(function () { replayHand(sess); }, 150);
    } else if (!live) {
      log('  [resync] 无进行中对局');
    }
    return [[20163, w.bytes(), 1, null]];
  };

  /** 断线重连：把本局缓存的 20018 通知帧按序重发，让客户端重建局面。
   *
   *  重放期间 onFrame 只记账不实时下推（sess.replaying），新帧统一排在队尾，
   *  否则「正在回放的历史帧」和「引擎刚产生的新帧」会交错，客户端牌局直接错乱。
   *  这里直接按下标遍历活数组 sess.handFrames，引擎边跑边追加，追平即收工。 */
  function replayHand(sess) {
    var frames = sess.handFrames || [];
    if (!frames.length || !sess.socket || sess.socket.readyState !== OPEN) {
      sess.replaying = false; sess._replayStarted = false;
      return;
    }

    // 本局是否已经开牌。已开牌就跳过 NtfToPrepare —— 客户端收到它会再回一次
    // ReqPrepare，把引擎的 _prepared 预置成 true，害得下一局不等客户端就发牌。
    // 还停在准备阶段（没有 NtfGameStart）则要原样重放，让客户端补回 ReqPrepare。
    var skipToPrepare = false;
    for (var k = 0; k < frames.length; k++) {
      if (frames[k][0] === RIICHI_NTF_GAME_START) { skipToPrepare = true; break; }
    }

    log('  [resync] 开始重放（已开牌=%s）', skipToPrepare);
    // 批处理下推：每批发 BATCH 帧、批间留 BATCH_GAP 毫秒。客户端在主线程 Update 里
    // 排队消费，单 tick 只处理几帧不会卡到再次超时（Bye!）；同时批处理把整局重放耗时
    // 从「逐帧 8ms」压到接近真实服（真实服发的是 20163 里的局面快照 f100，几乎瞬时）。
    var BATCH = 6, BATCH_GAP = 6;
    var i = 0;
    (function next() {
      if (!sess.socket || sess.socket.readyState !== OPEN) { sess.replaying = false; sess._replayStarted = false; return; }
      var sent = 0;
      while (i < sess.handFrames.length && sent < BATCH) {
        var f = sess.handFrames[i];
        i++;
        if (!(skipToPrepare && f[0] === RIICHI_NTF_TO_PREPARE)) {
          sess.push(20018, encodeKRiichi(f[0], f[1]), 1, null, null);
        }
        sent++;
      }
      if (i >= sess.handFrames.length) {
        sess.replaying = false; sess._replayStarted = false;
        log('  [resync] 重放完成，共 %d 帧，恢复实时下推', i);
        return;
      }
      setTimeout(next, BATCH_GAP);
    })();
  }

  // ------------------------------------------- 排位匹配 → 开局 (20403)
  // 抓包里真实的开局链路（capture/dongfeng1/ws.jsonl 行 616-631）：
  //   C->S 20403 RankingMatchRequest{ srm{ gameType, roomType, roomID, matchSource } }
  //   S->C 20404 RankingMatchResponse{}                    ← 空包，只是 ack
  //   ...约 1.5-2.4s 匹配等待...
  //   S->C 20408 RankingMatchResultNotify{ tableInfo }      ← 房间成型，只含自己
  //   S->C 20164 UserOfflineNotify{ userID }  ┐ 每个对手一组，
  //   S->C 20014 EnterSeatBC{ tableUserInfo } ┘ 表示「该玩家离线托管并入座」
  //   S->C 20018 NtfToPrepare → 客户端才回 ReqPrepare，对局开始
  // 关键：客户端必须先收到 20408 + 20014 建好牌桌，才会切到对局场景。
  // 少了这两步，后面的 20018 帧会被直接丢弃（客户端还在大厅场景）。

  var GAME_TYPE = { SANMA: 4002, YONMA: 4001 };
  // 只处理立直麻将的匹配请求，其他游戏类型（斗地主4101/掼蛋4111/广东推倒胡5001等）忽略
  var RIICHI_GAME_TYPES = { 4001: true, 4002: true };

  /** 离线对手档案，warrior/skin 会在匹配时随机分配。 */
  var ROBOTS = [
    {
      uid: 10000, nick: '赤木茂', frame: 2001, title: 3001, level: 6, pt: 14
    },
    {
      uid: 10001, nick: '鹫巢岩', frame: 2001, title: 3001, level: 8, pt: 92
    },
    {
      uid: 10002, nick: '天贵史', frame: 2001, title: 3001, level: 4, pt: 0
    }
  ];

  var BANG_POOL = [140001, 140002, 140003, 140004, 140006, 140007, 140009];

  /** 雀士 → 皮肤/头像 对应关系（皮肤与头像成对，随机抽一组）。
   *  数据来源：角色,皮肤,头像 对应表。键即为可用雀士 ID 池。 */
  var WARRIOR_TABLE = {
    1:  [{ skin: 1001, head: 1001 }, { skin: 3701002, head: 1009 }],
    2:  [{ skin: 2001, head: 1002 }, { skin: 3702002, head: 1007 }],
    3:  [{ skin: 3001, head: 1003 }, { skin: 3703002, head: 1008 }],
    4:  [{ skin: 4001, head: 1004 }, { skin: 3704002, head: 1010 }],
    5:  [{ skin: 5001, head: 1005 }, { skin: 3705002, head: 1012 }],
    6:  [{ skin: 6001, head: 1006 }, { skin: 3706002, head: 1013 }],
    7:  [{ skin: 7001, head: 1015 }, { skin: 3707002, head: 1016 }],
    8:  [{ skin: 8001, head: 1017 }, { skin: 3708002, head: 1017 }],
    9:  [{ skin: 9001, head: 1011 }, { skin: 3709002, head: 1014 }],
    10: [{ skin: 10001, head: 1019 }]
  };

  /** 从 USERDATA 读取本机玩家当前选中的装备，组装成 SimpleInGameSummaryInfo。
   *  每次匹配时动态读取，确保用户在大厅换角色/皮肤后下一局能生效。 */
  function getSelfProfile() {
    var profile = {
      uid: UID, nick: 'Mayx', head: 1009, frame: 2001, title: 3001,
      bang: 140009, warrior: 1, skin: 1001, level: 16, likability: 6, pt: 2605
    };
    try {
      var row = USERDATA.row(1, '0');         // DT_BASIC_INFO
      if (row) {
        var equip = P.get(row, 2);             // UserBasicEquipment map
        if (equip && equip.length) {
          var fs = P.parse(equip);
          var map = {};
          for (var i = 0; i < fs.length; i++) {
            if (fs[i][0] !== 1 || fs[i][1] !== 2) continue;
            var e = P.dict(fs[i][2]);
            map[e[1]] = e[2] || 0;
          }
          if (map[11]) profile.head = map[11];        // DT_HEAD
          if (map[12]) profile.frame = map[12];       // DT_HEAD_FRAME
          if (map[13]) profile.title = map[13];       // DT_TITLE
          if (map[14]) profile.bang = map[14];        // DT_LIZHI
          if (map[26]) profile.warrior = map[26];     // DT_MAHJONG_WARRIOR
        }
      }
      // 从雀士数据行读取当前皮肤（sculptId）
      var wRow = USERDATA.row(26, profile.warrior);
      if (wRow) {
        var inner = P.get(wRow, 3);                   // MahjongWarriorData
        if (inner) {
          var sculptId = P.get(inner, 3);             // SculptId
          if (sculptId) profile.skin = sculptId;
        }
      }
    } catch (e) {
      log('  [profile] 读取用户装备失败，使用默认值: ' + e.message);
    }
    return profile;
  }

  /** 给 AI 机器人随机分配一个雀士及其皮肤/头像 */
  function makeRobot(idx, humanWarrior) {
    var base = ROBOTS[idx];
    var ids = Object.keys(WARRIOR_TABLE);
    var w = parseInt(ids[Math.floor(Math.random() * ids.length)], 10);
    var pair = WARRIOR_TABLE[w];
    var pick = pair[Math.floor(Math.random() * pair.length)];
    var b = BANG_POOL[Math.floor(Math.random() * BANG_POOL.length)];
    return {
      uid: base.uid, nick: base.nick, head: pick.head, frame: base.frame,
      title: base.title, bang: b,
      warrior: w, skin: pick.skin,
      level: base.level, pt: base.pt
    };
  }

  /** SimpleInGameSummaryInfo */
  function encProfile(p) {
    var w = P.W();
    w.v(1, p.uid);
    w.s(2, p.nick);
    w.v(3, p.head);
    w.v(4, p.frame);
    w.v(5, p.title);
    w.v(6, p.bang);
    w.v(7, p.warrior);
    w.v(8, p.skin);
    if (p.level) w.v(9, p.level);
    if (p.likability) w.v(10, p.likability);
    if (p.pt) w.v(13, p.pt);
    return w.bytes();
  }

  /** TableUserInfo */
  function encTableUser(seat, p, isRobot) {
    var w = P.W();
    if (seat) w.v(1, seat);                 // seat 0 走 proto 默认值，与抓包一致
    w.s(2, encProfile(p));
    w.v(3, p.uid);
    if (isRobot) w.v(7, 1);
    return w.bytes();
  }

  /** FriendGameSetting —— 东风战设置，数值照抄抓包 */
  function encGameSetting(sanma) {
    var adv = P.W()
      .v(1, sanma ? 3 : 1)      // StartingPoint
      .v(3, sanma ? 7 : 6)      // RequiredPoint
      .v(5, sanma ? 11 : 12)    // RedTreasureCards
      .v(6, 15)                 // Eclipse
      .v(9, 2)                  // useZiMoSunNew
      .bytes();
    return P.W()
      .v(1, sanma ? 1 : 2)      // Mode
      .v(3, 3)                  // PonderTime
      .s(4, adv)
      .v(14, 2)                 // useEmotionNew
      .v(15, 2)                 // useDiffHandOrDrawNew
      .bytes();
  }

  /** 随机 20 字符牌局 ID，形如 d9s4grlhjab6eqidh2jg */
  function randGameId() {
    var cs = 'abcdefghijklmnopqrstuvwxyz0123456789', s = '';
    for (var i = 0; i < 20; i++) s += cs.charAt(Math.floor(Math.random() * cs.length));
    return s;
  }

  /** TableInfo —— 数据全部取自 sess.table（20403 匹配成型时写入的牌桌快照）。
   *  本机玩家档案从 USERDATA 动态读取，确保用户在大厅换角色/皮肤后下一局生效。
   *
   *  withRobots=false（20403 匹配）：只含本机玩家，对手随后由 20014 逐个入座。
   *  withRobots=true （20163 断线恢复）：一次性含齐所有席位——重连时客户端不会再走
   *  一遍入座流程，抓包里真实服的 20163.f4 就是四个 TableUserInfo 全带上的。 */
  function encTableInfo(sess, withRobots) {
    var t = sess.table;
    var w = P.W()
      .v(1, t.sanma ? GAME_TYPE.SANMA : GAME_TYPE.YONMA)
      .v(2, sess.tableId || 1)
      .v(3, t.sanma ? 3 : 4)                     // seatCount
      .s(4, encTableUser(0, t.self, false));
    if (withRobots) {
      for (var i = 0; i < t.robots.length; i++) {
        w.s(4, encTableUser(i + 1, t.robots[i], true));
      }
    }
    return w
      .v(6, 7)                                   // roomType
      .s(7, encGameSetting(t.sanma))
      .v(8, 3)                                   // roomID
      .s(11, t.logId)                            // gameLogID
      .s(12, t.gameId)
      .bytes();
  }

  /** 20403 KgameServerRankingMatchRequest -> 20404，随后异步完成组桌并开局 */
  HANDLERS[20403] = function (sess, payload) {
    var srm = {};
    try {
      var d = P.dict(payload);
      if (d[1] instanceof Uint8Array) srm = P.dict(d[1]);
    } catch (e) { /* 用默认值 */ }

    // 非立直麻将游戏类型：忽略，只回 20404 空包
    if (!RIICHI_GAME_TYPES[srm[1]]) {
      log('  [match] gameType=%s 非立直，忽略', srm[1]);
      return [[20404, new Uint8Array(0), 1, null]];
    }

    // 请求里的 gameType 决定三麻/四麻，URL 参数 ?mjPlayers 优先
    var sanma = srm[1] === GAME_TYPE.SANMA;
    if (CONFIG.playersExplicit) sanma = CONFIG.players === 3;
    else CONFIG.players = sanma ? 3 : 4;

    log('  [match] gameType=%s roomType=%s roomID=%s -> %s麻',
      srm[1], srm[3], srm[4], sanma ? '三' : '四');

    sess.tableId = 1;
    sess.seat = 0;

    // 重新匹配（取消后再点、或上一局残留）时必须丢掉旧会话，
    // 否则 ensureEngine 拿到的是上一局的引擎，不会再推 NtfToPrepare。
    if (sess.riichi) {
      try { sess.riichi.stop(); } catch (e) { /* ignore */ }
      sess.riichi = null;
    }

    var delay = CONFIG.matchDelay != null ? CONFIG.matchDelay : 1500;
    setTimeout(function () {
      if (!sess.socket || sess.socket.readyState !== OPEN) return;

      // 1) 房间成型 —— 动态读取本机玩家装备
      var selfProfile = getSelfProfile();
      // 牌桌快照：断线重连时 20162 要用它原样复述牌桌（房间号/对手/装备都不能变）
      sess.table = {
        sanma: sanma,
        self: selfProfile,
        robots: [],
        logId: String(5118685 + Math.floor(Math.random() * 1000)),
        gameId: randGameId()
      };
      sess.handFrames = [];
      log('  [match] => 20408 RankingMatchResultNotify (warrior=%s skin=%s)',
        selfProfile.warrior, selfProfile.skin);
      sess.push(20408, P.W().s(2, encTableInfo(sess, false)).bytes(), 1, null);

      // 2) 对手逐个「离线托管 + 入座」—— 随机分配雀士
      var n = (sanma ? 3 : 4) - 1;
      for (var i = 0; i < n; i++) {
        var r = makeRobot(i, selfProfile.warrior);
        var seat = i + 1;
        sess.table.robots.push(r);
        log('  [match] => 20164/20014 seat%d %s(%d) warrior=%s', seat, r.nick, r.uid, r.warrior);
        sess.push(20164, P.W().v(1, r.uid).bytes(), 1, null);
        sess.push(20014, P.W().s(1, encTableUser(seat, r, true)).v(2, 7).bytes(), 1, null);
      }

      // 3) 牌桌就绪，拉起引擎 —— 它会主动推 NtfToPrepare(1001)
      setTimeout(function () {
        if (!sess.socket || sess.socket.readyState !== OPEN) return;
        var g = getRiichi(sess);
        if (g && g.ensureEngine) g.ensureEngine();
      }, 200);
    }, delay);

    return [[20404, new Uint8Array(0), 1, null]];
  };

  /** 20405 取消匹配 -> 20406 */
  HANDLERS[20405] = function (sess) {
    log('  [match] 取消匹配');
    return [[20406, new Uint8Array(0), 1, null]];
  };

  /** 20025 LeaveTable -> 20026：对局中或结算界面点「回到大厅」 */
  HANDLERS[20025] = function (sess) {
    log('  [leave] 离桌');
    sess.tableId = 0; sess.seat = -1;
    sess.table = null; sess.handFrames = []; sess.replaying = false; sess._replayStarted = false;
    if (sess.riichi) { try { sess.riichi.stop(); } catch (e) {} sess.riichi = null; }
    return [[20026, new Uint8Array(0), 1, null]];
  };

  /** 20102 ClientFinishGameStopRequest -> 20103
   *  真实抓包：isFinal 结算后客户端发此消息确认退出，服务器回 20103 后回到大厅 */
  HANDLERS[20102] = function (sess) {
    log('  [finish] 客户端确认结算完成，退出对局');
    sess.tableId = 0; sess.seat = -1;
    sess.table = null; sess.handFrames = []; sess.replaying = false; sess._replayStarted = false;
    if (sess.riichi) { try { sess.riichi.stop(); } catch (e) {} sess.riichi = null; }
    return [[20103, P.W().v(1, 0).bytes(), 1, null]];
  };

  /** 20018 上行：交给引擎，所有回帧都走 sess.push 异步下推 */
  HANDLERS[20018] = function (sess, payload, seq) {
    // 已离桌（20102 结算确认 / 20025 回大厅后 tableId=0）就不要再惰性建会话了，
    // 否则客户端结算界面残留的 ReqPrepare 会凭空拉起一局新对局。
    // 真实服在这种状态下对 20018 上行零响应（见 capture/dongfeng1/ws.jsonl 终局段）。
    if (!sess.tableId) { log('  <riichi> 已离桌，忽略 20018 上行'); return []; }
    var r = getRiichi(sess);
    if (!r) return [];
    var d = P.dict(payload);
    var msgType = d[1] || 0;
    var inner = (d[100] instanceof Uint8Array) ? d[100] : new Uint8Array(0);
    log('  <riichi> %s %dB', riichiName(msgType), inner.length);
    // 记录本次请求 seq，供引擎同步回推的 Rsp* 帧回显（如 ReqPrepare -> RspPrepare）
    sess._reqSeq = seq || 0;
    r.handleClient(msgType, inner);
    return [];
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
    sess.lastSeq = seq;

    var st = REQ_STATS[mid];
    if (!st) st = REQ_STATS[mid] = { n: 0, last: 0, prev: 0 };
    var _now = nowMs();
    st.prev = st.last;
    st.last = _now;
    st.n++;

    var fn = HANDLERS[mid];
    var out, tag;
    if (!fn) {
      if (REPLAY[mid + 1]) {
        out = [[mid + 1, REPLAY[mid + 1], 1, null]];
        tag = 'replay';
      } else {
        out = [[mid + 1, new Uint8Array(0), 1, null]];
        tag = 'auto-ok';
        LOG.unhandled.push({
          msgId: mid, name: nameOf(mid), seq: seq,
          payload: payload, t: nowMs()
        });
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

  // 上一个对局会话（断线重连时复用，避免对局因客户端主动关 WS 而丢失）
  var _lastSession = null;

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
    // 重连复用旧的 riichi 对局会话
    if (_lastSession && _lastSession.riichi) {
      this._session = _lastSession;
      this._session.resume(this);
      _lastSession = null;
      log('[mock] 重连复用旧会话（保留对局引擎） %s', this.url);
    } else {
      if (_lastSession) { _lastSession.destroy(); _lastSession = null; }
      this._session = new Session();
    }
    this._session.socket = this;

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
    var self = this;
    var activeGame = !!(
      self._session && self._session.tableId &&
      self._session.riichi && !self._session.riichi.matchOver
    );
    if (!activeGame) {
      // 非对局中：正常优雅关闭（回 1000 或客户端给的码，关帧握手照常完成）
      this.readyState = CLOSING;
      setTimeout(function () {
        self.readyState = CLOSED;
        // 不销毁会话：保留 riichi 引擎，客户端重连时复用（避免对局中断）
        _lastSession = self._session;
        self._session.suspend();
        self._emit('close', {
          type: 'close', code: code || 1000, reason: reason || '',
          wasClean: true, target: self
        });
        log('[mock] 虚拟连接已关闭 code=%s reason=%s', code || 1000, reason || '');
      }, 0);
      return;
    }
    // 对局进行中：模拟「网络掉线」。真实服断网时不回关帧，BestHTTP 检测到连接异常
    // （onError）→ 以异常码 onClose(1006, wasClean=false) 收尾 → 客户端保留在局状态并
    // 自动重连 → 重连后发 20162 询问并恢复对局（见 capture/dongfeng1）。
    // 只发 error 客户端不会判定连接已结束、也就不重连；真实 WebSocket 掉线是 error 之后
    // 再补一个 wasClean=false 的 close，这里照此补上，客户端才会触发重连。
    // 关键在于：这是【服务端侧】发起的断开（客户端并未调用 ws.close），所以客户端的
    // 在局状态不会被清空——重连后才会发 20162 而不是 20102。引擎始终保留在 _lastSession。
    this.readyState = CLOSED;
    _lastSession = self._session;
    self._session.suspend();
    self._emit('error', { type: 'error', message: 'simulated network drop', target: self });
    self._emit('close', { type: 'close', code: 1006, reason: '', wasClean: false, target: self });
    log('[mock] 虚拟连接已关闭（对局中·模拟掉线）code=1006 wasClean=false（引擎已保留）');
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
    config: CONFIG,
    encodeKRiichi: encodeKRiichi,
    riichiNames: RIICHI_NAMES,

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
