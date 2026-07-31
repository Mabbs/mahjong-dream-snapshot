/* 大厅用户数据（100142）的可变状态模型 —— userdata.py 的 JS 版
 *
 * 协议结构（还原自 IL2CPP global-metadata）：
 *   QueryUserDataResponse      { 1:Result, 2:UserId, 3:repeated UserDataSingleTypeResponse }
 *   UserDataSingleTypeResponse { 1:DataType, 2:Version, 3:repeated UserDataSingleRow }
 *   UserDataSingleRow          { 1:DataId(string), 2:Data(bytes) }
 *
 * 服务端在任意响应帧的 wrapper f24（DataChangeFieldNumber）里回推增量：
 *   UserDataChange             { 1:UserId, 2:repeated UserDataSingleTypeChange }
 *   UserDataSingleTypeChange   { 1:DataType, 2:Version, 3:repeated UserDataSingleRowChange }
 *   UserDataSingleRowChange    { 1:DataId, 2:Data, 3:ChangeType }
 *
 * 客户端「保存」类操作不改本地缓存，只等这个增量；收不到就判定失败并回滚 UI。
 */
(function (global) {
  'use strict';

  var MJ = global.__mj || (global.__mj = {});
  var P = MJ.proto;

  var MODIFY = 0, ADD = 1, DELETE = 2;

  var DT_BASIC_INFO = 1;
  var DT_HEAD = 11;
  var DT_MAHJONG_WARRIOR = 26;
  var DT_MAHJONG_WARRIOR_SKIN = 37;

  var DT_NAMES = {
    1: 'BasicInfo', 2: 'GameSetting', 3: 'RankingMatchInfo', 4: 'HighlightRecord',
    5: 'OrnamentScheme', 6: 'KnapsackItem', 7: 'KnapsackGift', 8: 'KnapsackMaterial',
    9: 'FriendList', 10: 'FriendData', 11: 'Head', 12: 'HeadFrame', 13: 'Title',
    14: 'LiZhi', 15: 'MahjongTablecloth', 16: 'MahjongCard', 17: 'TableRack',
    18: 'SpecialEffects', 19: 'Bgm', 20: 'Scene', 21: 'SpecialEffects1', 22: 'Bgm1',
    23: 'Bgm2', 24: 'Scene1', 25: 'MahjongCard1', 26: 'MahjongWarrior', 27: 'RedDot',
    28: 'GuideInfo', 29: 'PayInfo', 30: 'ShopInfo', 31: 'ActInfo', 32: 'MailInfo',
    33: 'Notice', 34: 'SignIn', 35: 'RankingMatchCommon', 36: 'OneGameInfo',
    37: 'MahjongWarriorSkin', 38: 'Achievement', 39: 'Task', 40: 'Bp',
    41: 'RankingMatch2Info', 42: 'UserProfile', 43: 'UserGiftInfo', 44: 'NewSignIn',
    45: 'InnerScene', 46: 'InnerChair', 47: 'InnerTable', 48: 'AbTest',
    49: 'FunctionSwitch'
  };

  // -------------------------------------------------------------- Module
  function Module(dtype, version, rows, order, extra) {
    this.dtype = dtype;
    this.version = version;
    this.rows = rows;      // { key(string): Uint8Array }
    this.order = order;    // 保持原始行顺序
    this.extra = extra;    // 其它未知字段的原始编码
  }

  Module.prototype.serialize = function () {
    // proto3：默认值（0 / 空 bytes）不编码，否则字节数对不上原版
    var w = P.W();
    w.v(1, this.dtype);
    if (this.version) w.v(2, this.version);
    if (this.extra && this.extra.length) w.raw(this.extra);
    for (var i = 0; i < this.order.length; i++) {
      var key = this.order[i];
      var data = this.rows[key];
      var row = P.W();
      if (key.length) row.s(1, key);
      if (data && data.length) row.s(2, data);
      w.s(3, row.bytes());
    }
    return w.bytes();
  };

  // ------------------------------------------------------------ UserData
  function UserData(blob, uid) {
    this.uid = uid || 0;
    this.headParts = [];      // 顶层非 f3 字段（Result / UserId 等）
    this.modules = {};
    this.moduleOrder = [];

    var top = P.parse(blob);
    for (var i = 0; i < top.length; i++) {
      var fn = top[i][0], wt = top[i][1], val = top[i][2];
      if (fn !== 3 || wt !== 2) {
        this.headParts.push([fn, wt, val]);
        continue;
      }
      var dtype = null, version = 0, rows = {}, order = [];
      var extraW = P.W();
      var fs = P.parse(val);
      for (var j = 0; j < fs.length; j++) {
        var f = fs[j][0], w = fs[j][1], v = fs[j][2];
        if (f === 1 && w === 0) dtype = v;
        else if (f === 2 && w === 0) version = v;
        else if (f === 3 && w === 2) {
          var rf = P.dict(v);
          var key = rf[1] ? P.fromUtf8(rf[1]) : '';
          rows[key] = rf[2] || new Uint8Array(0);
          order.push(key);
        } else {
          P.reencode(extraW, f, w, v);
        }
      }
      if (dtype === null) continue;
      this.modules[dtype] = new Module(dtype, version, rows, order, extraW.bytes());
      this.moduleOrder.push(dtype);
    }
  }

  UserData.prototype.serialize = function () {
    var w = P.W();
    for (var i = 0; i < this.headParts.length; i++) {
      var h = this.headParts[i];
      P.reencode(w, h[0], h[1], h[2]);
    }
    for (var j = 0; j < this.moduleOrder.length; j++) {
      w.s(3, this.modules[this.moduleOrder[j]].serialize());
    }
    return w.bytes();
  };

  UserData.prototype.row = function (dtype, key) {
    var m = this.modules[dtype];
    if (!m) return null;
    return m.rows[String(key)] || null;
  };

  /** 写入一行并给模块版本 +1，返回 [key, data, changeType]。 */
  UserData.prototype.setRow = function (dtype, key, data) {
    key = String(key);
    var m = this.modules[dtype];
    if (!m) {
      m = this.modules[dtype] = new Module(dtype, 0, {}, [], new Uint8Array(0));
      this.moduleOrder.push(dtype);
    }
    var ct = (key in m.rows) ? MODIFY : ADD;
    if (ct === ADD) m.order.push(key);
    m.rows[key] = data;
    m.version += 1;
    return [key, data, ct];
  };

  /** changes: { dtype: [[key, data, changeType], ...] } -> UserDataChange bytes */
  UserData.prototype.changePacket = function (changes) {
    var w = P.W();
    w.v(1, this.uid);
    for (var dt in changes) {
      if (!Object.prototype.hasOwnProperty.call(changes, dt)) continue;
      var st = P.W();
      st.v(1, Number(dt));
      st.v(2, this.modules[dt].version);
      var rows = changes[dt];
      for (var i = 0; i < rows.length; i++) {
        var rc = P.W();
        rc.s(1, rows[i][0]);
        rc.s(2, rows[i][1]);
        if (rows[i][2]) rc.v(3, rows[i][2]);
        st.s(3, rc.bytes());
      }
      w.s(2, st.bytes());
    }
    return w.bytes();
  };

  // ---------------------------------------------------------- 业务操作
  /** 换皮肤：MahjongWarrior row[warriorId].Data.f3(MahjongWarriorData).f3 = sculptId */
  UserData.prototype.wearSculpt = function (warriorId, sculptId) {
    var row = this.row(DT_MAHJONG_WARRIOR, warriorId);
    if (!row) return null;
    var inner = P.get(row, 3);
    if (!inner) return null;
    inner = P.setVarint(inner, 3, sculptId);      // SculptId
    row = P.setBytes(row, 3, inner);
    var ch = this.setRow(DT_MAHJONG_WARRIOR, warriorId, row);
    var out = {};
    out[DT_MAHJONG_WARRIOR] = [ch];
    return out;
  };

  /** 换使用中装备：UserBasic.f2(UserBasicEquipment).f1 = map<DataType, int> */
  UserData.prototype.selectEquipment = function (pairs) {
    var row = this.row(DT_BASIC_INFO, '0');
    if (!row) return null;
    var equip = P.get(row, 2) || new Uint8Array(0);
    var keys = [], map = {};
    var fs = P.parse(equip);
    for (var i = 0; i < fs.length; i++) {
      if (fs[i][0] !== 1 || fs[i][1] !== 2) continue;
      var e = P.dict(fs[i][2]);
      var k = e[1];
      if (!(k in map)) keys.push(k);
      map[k] = e[2] || 0;
    }
    for (var j = 0; j < pairs.length; j++) {
      var pk = pairs[j][0];
      if (!(pk in map)) keys.push(pk);
      map[pk] = pairs[j][1];
    }
    var w = P.W();
    for (var n = 0; n < keys.length; n++) {
      var entry = P.W();
      entry.v(1, keys[n]);
      entry.v(2, map[keys[n]]);
      w.s(1, entry.bytes());
    }
    row = P.setBytes(row, 2, w.bytes());
    var ch = this.setRow(DT_BASIC_INFO, '0', row);
    var out = {};
    out[DT_BASIC_INFO] = [ch];
    return out;
  };

  MJ.userdata = {
    UserData: UserData, Module: Module,
    DT_NAMES: DT_NAMES,
    MODIFY: MODIFY, ADD: ADD, DELETE: DELETE,
    DT_BASIC_INFO: DT_BASIC_INFO, DT_HEAD: DT_HEAD,
    DT_MAHJONG_WARRIOR: DT_MAHJONG_WARRIOR,
    DT_MAHJONG_WARRIOR_SKIN: DT_MAHJONG_WARRIOR_SKIN
  };
})(typeof window !== 'undefined' ? window : globalThis);
