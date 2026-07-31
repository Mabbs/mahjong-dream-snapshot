/* 无 schema 的 protobuf wire-format 编解码（pbdec.py / pbenc.py 的 JS 版）
 *
 * 解析结果统一表示为三元组数组： [[fieldNumber, wireType, value], ...]
 *   wireType 0 (varint)  -> value: number
 *   wireType 1 (64bit)   -> value: number（小端读为无符号）
 *   wireType 2 (bytes)   -> value: Uint8Array
 *   wireType 5 (32bit)   -> value: number
 *
 * 注意：JS 位运算是 32 位的，varint 超过 31 位必须用乘法累加。
 */
(function (global) {
  'use strict';

  var MJ = global.__mj || (global.__mj = {});

  // ---------------------------------------------------------------- 解码
  function readVarint(buf, pos) {
    var result = 0;
    var shiftMul = 1;
    while (pos < buf.length) {
      var b = buf[pos++];
      result += (b & 0x7f) * shiftMul;
      if ((b & 0x80) === 0) return [result, pos];
      shiftMul *= 128;
      if (shiftMul > 1e19) throw new Error('varint 过长');
    }
    throw new Error('varint 截断');
  }

  /** 解析一段 protobuf，返回 [[fn, wt, value], ...]；失败抛异常。 */
  function parse(buf) {
    if (buf instanceof ArrayBuffer) buf = new Uint8Array(buf);
    var out = [];
    var pos = 0;
    while (pos < buf.length) {
      var r = readVarint(buf, pos);
      var key = r[0];
      pos = r[1];
      var fn = Math.floor(key / 8);
      var wt = key & 7;
      if (fn === 0) throw new Error('字段号 0');
      if (wt === 0) {
        r = readVarint(buf, pos);
        out.push([fn, 0, r[0]]);
        pos = r[1];
      } else if (wt === 2) {
        r = readVarint(buf, pos);
        var len = r[0];
        pos = r[1];
        if (pos + len > buf.length) throw new Error('长度越界');
        out.push([fn, 2, buf.subarray(pos, pos + len)]);
        pos += len;
      } else if (wt === 5) {
        if (pos + 4 > buf.length) throw new Error('fixed32 越界');
        out.push([fn, 5, buf[pos] | (buf[pos + 1] << 8) |
                          (buf[pos + 2] << 16) | (buf[pos + 3] * 0x1000000)]);
        pos += 4;
      } else if (wt === 1) {
        if (pos + 8 > buf.length) throw new Error('fixed64 越界');
        var lo = buf[pos] + buf[pos + 1] * 256 + buf[pos + 2] * 65536 + buf[pos + 3] * 16777216;
        var hi = buf[pos + 4] + buf[pos + 5] * 256 + buf[pos + 6] * 65536 + buf[pos + 7] * 16777216;
        out.push([fn, 1, lo + hi * 4294967296]);
        pos += 8;
      } else {
        throw new Error('不支持的 wire type ' + wt);
      }
    }
    return out;
  }

  /** 只取第一个匹配字段的值，没有则返回 undefined。 */
  function get(buf, fn) {
    var fs = parse(buf);
    for (var i = 0; i < fs.length; i++) if (fs[i][0] === fn) return fs[i][2];
    return undefined;
  }

  /** 转成 {fn: value} 字典（同名字段取最后一个）。 */
  function dict(buf) {
    var d = {};
    var fs = parse(buf);
    for (var i = 0; i < fs.length; i++) d[fs[i][0]] = fs[i][2];
    return d;
  }

  /** 解 packed varint 数组。 */
  function unpack(buf) {
    var out = [];
    var pos = 0;
    while (pos < buf.length) {
      var r = readVarint(buf, pos);
      out.push(r[0]);
      pos = r[1];
    }
    return out;
  }

  // ---------------------------------------------------------------- 编码
  function varintBytes(n) {
    if (n < 0) n += 18446744073709551616; // 2^64
    var out = [];
    while (true) {
      var b = n % 128;
      n = Math.floor(n / 128);
      if (n) out.push(b | 0x80);
      else { out.push(b); break; }
    }
    return out;
  }

  /** 累积式写入器。 */
  function Writer() { this.parts = []; this.len = 0; }
  Writer.prototype.raw = function (arr) {
    this.parts.push(arr);
    this.len += arr.length;
    return this;
  };
  Writer.prototype.tag = function (fn, wt) {
    return this.raw(varintBytes(fn * 8 + wt));
  };
  /** varint 字段 */
  Writer.prototype.v = function (fn, n) {
    this.tag(fn, 0);
    return this.raw(varintBytes(n));
  };
  /** length-delimited 字段（bytes / 子消息 / string） */
  Writer.prototype.s = function (fn, val) {
    if (typeof val === 'string') val = utf8(val);
    if (val instanceof Writer) val = val.bytes();
    this.tag(fn, 2);
    this.raw(varintBytes(val.length));
    return this.raw(val);
  };
  Writer.prototype.f32 = function (fn, n) {
    this.tag(fn, 5);
    return this.raw([n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]);
  };
  Writer.prototype.f64 = function (fn, n) {
    this.tag(fn, 1);
    var lo = n % 4294967296, hi = Math.floor(n / 4294967296);
    return this.raw([lo & 0xff, (lo >>> 8) & 0xff, (lo >>> 16) & 0xff, (lo >>> 24) & 0xff,
                     hi & 0xff, (hi >>> 8) & 0xff, (hi >>> 16) & 0xff, (hi >>> 24) & 0xff]);
  };
  /** packed repeated varint（即使单元素也用 packed，匹配原版 wire） */
  Writer.prototype.packed = function (fn, list) {
    var body = [];
    for (var i = 0; i < list.length; i++) body = body.concat(varintBytes(list[i]));
    this.tag(fn, 2);
    this.raw(varintBytes(body.length));
    return this.raw(body);
  };
  Writer.prototype.bytes = function () {
    var out = new Uint8Array(this.len);
    var off = 0;
    for (var i = 0; i < this.parts.length; i++) {
      var p = this.parts[i];
      if (p instanceof Uint8Array) out.set(p, off);
      else for (var j = 0; j < p.length; j++) out[off + j] = p[j];
      off += p.length;
    }
    return out;
  };

  function W() { return new Writer(); }

  /** 按原 wire type 重新编码一个字段（保序改写时用）。 */
  function reencode(w, fn, wt, val) {
    if (wt === 0) return w.v(fn, val);
    if (wt === 2) return w.s(fn, val);
    if (wt === 5) return w.f32(fn, val);
    if (wt === 1) return w.f64(fn, val);
    throw new Error('不支持的 wire type ' + wt);
  }

  /** 把 blob 里字段 fn 的 varint 值改成 value（保持字段顺序），不存在则追加。 */
  function setVarint(blob, fn, value) {
    var w = W(), done = false;
    var fs = parse(blob);
    for (var i = 0; i < fs.length; i++) {
      var f = fs[i];
      if (f[0] === fn && f[1] === 0 && !done) { w.v(fn, value); done = true; }
      else reencode(w, f[0], f[1], f[2]);
    }
    if (!done) w.v(fn, value);
    return w.bytes();
  }

  /** 把 blob 里字段 fn 的 bytes 值改成 value（保持字段顺序），不存在则追加。 */
  function setBytes(blob, fn, value) {
    var w = W(), done = false;
    var fs = parse(blob);
    for (var i = 0; i < fs.length; i++) {
      var f = fs[i];
      if (f[0] === fn && f[1] === 2 && !done) { w.s(fn, value); done = true; }
      else reencode(w, f[0], f[1], f[2]);
    }
    if (!done) w.s(fn, value);
    return w.bytes();
  }

  // ---------------------------------------------------------------- 工具
  function utf8(str) {
    if (global.TextEncoder) return new TextEncoder().encode(str);
    var out = [];
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return new Uint8Array(out);
  }

  function fromUtf8(buf) {
    if (global.TextDecoder) return new TextDecoder().decode(buf);
    var s = '';
    for (var i = 0; i < buf.length; i++) s += String.fromCharCode(buf[i]);
    return s;
  }

  function b64decode(s) {
    var bin = global.atob(s);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function eq(a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }

  MJ.proto = {
    parse: parse, get: get, dict: dict, unpack: unpack,
    W: W, Writer: Writer, reencode: reencode,
    setVarint: setVarint, setBytes: setBytes,
    utf8: utf8, fromUtf8: fromUtf8, b64decode: b64decode, eq: eq
  };
})(typeof window !== 'undefined' ? window : globalThis);
