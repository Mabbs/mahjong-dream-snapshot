/* 立直麻将对局引擎（浏览器版）—— 由 mockjs/build_browser.mjs 打包生成，请勿手改。
 * 源码见 mockjs/{engine,ai,shanten,tiles,yaku_map,pb}.mjs + npm 包 riichi/protobufjs。
 * 挂载点：window.__mj.riichi */
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/agari/index.js
  var require_agari = __commonJS({
    "node_modules/agari/index.js"(exports2, module2) {
      (() => {
        "use strict";
        const sum = (arr) => {
          let s = 0;
          for (let i = 0; i < arr.length; i++)
            s += arr[i];
          return s;
        };
        const check7 = (hai_arr) => {
          let arr = [...hai_arr[0], ...hai_arr[1], ...hai_arr[2], ...hai_arr[3]];
          let s = 0;
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] && arr[i] != 2) return false;
            s += arr[i];
          }
          return s == 14;
        };
        const check13 = (hai_arr) => {
          let arr = [hai_arr[0][0], hai_arr[0][8], hai_arr[1][0], hai_arr[1][8], hai_arr[2][0], hai_arr[2][8], ...hai_arr[3]];
          return !arr.includes(0) && sum(arr) == 14;
        };
        const _check = (arr, is_jihai = false) => {
          arr = [...arr];
          let s = sum(arr);
          if (s === 0)
            return true;
          if (s % 3 == 2) {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i] >= 2)
                arr[i] -= 2;
              else
                continue;
              if (!_check(arr, is_jihai))
                arr[i] += 2;
              else
                return true;
            }
            return false;
          }
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === 0) {
              continue;
            } else if (arr[i] === 3) {
              delete arr[i];
              continue;
            } else {
              if (is_jihai || i >= 7)
                return false;
              if (arr[i] === 4)
                arr[i] -= 3;
              arr[i + 1] -= arr[i];
              arr[i + 2] -= arr[i];
              if (arr[i + 1] < 0 || arr[i + 2] < 0)
                return false;
              arr[i] = 0;
            }
          }
          return true;
        };
        const check = (hai_arr) => {
          let j = 0;
          for (let i = 0; i < hai_arr.length; i++) {
            if (sum(hai_arr[i]) % 3 === 1)
              return false;
            j += sum(hai_arr[i]) % 3 === 2;
          }
          return j === 1 && _check(hai_arr[3], true) && _check(hai_arr[0]) && _check(hai_arr[1]) && _check(hai_arr[2]);
        };
        const checkAll = (hai_arr) => {
          return check7(hai_arr) || check13(hai_arr) || check(hai_arr);
        };
        const MPSZ2 = ["m", "p", "s", "z"];
        const sumAll = (hai_arr) => {
          let s = 0;
          for (let arr of hai_arr)
            s += sum(arr);
          return s;
        };
        const findKotsu = (hai_arr) => {
          let res2 = [];
          for (let i = 0; i < hai_arr.length; i++) {
            for (let ii = 0; ii < hai_arr[i].length; ii++) {
              if (hai_arr[i][ii] >= 3) {
                hai_arr[i][ii] -= 3;
                if (check(hai_arr)) {
                  res2.push([ii + 1 + MPSZ2[i]]);
                } else {
                  hai_arr[i][ii] += 3;
                }
              }
            }
          }
          return res2;
        };
        const findJyuntsu = (hai_arr) => {
          let res2 = [];
          for (let i = 0; i < hai_arr.length; i++) {
            if (i === 3)
              break;
            for (let ii = 0; ii < hai_arr[i].length; ii++) {
              while (hai_arr[i][ii] >= 1 && hai_arr[i][ii + 1] >= 1 && hai_arr[i][ii + 2] >= 1) {
                hai_arr[i][ii]--;
                hai_arr[i][ii + 1]--;
                hai_arr[i][ii + 2]--;
                if (check(hai_arr)) {
                  res2.push([ii + 1 + MPSZ2[i], ii + 2 + MPSZ2[i], ii + 3 + MPSZ2[i]]);
                } else {
                  hai_arr[i][ii]++;
                  hai_arr[i][ii + 1]++;
                  hai_arr[i][ii + 2]++;
                  break;
                }
              }
            }
          }
          return res2;
        };
        const findJyanto = (hai_arr) => {
          for (let i = 0; i < hai_arr.length; i++) {
            for (let ii = 0; ii < hai_arr[i].length; ii++) {
              if (hai_arr[i][ii] >= 2) {
                return ii + 1 + MPSZ2[i];
              }
            }
          }
        };
        let res = [];
        const calc = (hai_arr, j) => {
          let tmp_hai_arr = [[...hai_arr[0]], [...hai_arr[1]], [...hai_arr[2]], [...hai_arr[3]]];
          let first_res = findKotsu(tmp_hai_arr).concat(j);
          if (sumAll(tmp_hai_arr) === 2) {
            res.push(first_res.sort());
          } else if (first_res.length > 0) {
            first_res = first_res.concat(findJyuntsu(tmp_hai_arr));
            res.push(first_res.sort());
          }
          tmp_hai_arr = [[...hai_arr[0]], [...hai_arr[1]], [...hai_arr[2]], [...hai_arr[3]]];
          let second_res = findJyuntsu(tmp_hai_arr).concat(j);
          if (sumAll(tmp_hai_arr) === 2) {
            res.push(second_res.sort());
          } else {
            second_res = second_res.concat(findKotsu(tmp_hai_arr));
            res.push(second_res.sort());
          }
        };
        const findAllAgariPatterns = (hai_arr) => {
          hai_arr = [[...hai_arr[0]], [...hai_arr[1]], [...hai_arr[2]], [...hai_arr[3]]];
          res = [];
          if (!check(hai_arr)) {
            return res;
          }
          if (sumAll(hai_arr) === 2) {
            res.push([findJyanto(hai_arr)]);
            return res;
          }
          let j;
          for (let i = 0; i < hai_arr[3].length; i++) {
            if (hai_arr[3][i] === 0) {
              hai_arr[3][i] += 2;
              j = i;
              break;
            }
          }
          for (let i = 0; i < hai_arr.length; i++) {
            for (let ii = 0; ii < hai_arr[i].length; ii++) {
              if (i === 3 && ii === j)
                continue;
              if (hai_arr[i][ii] >= 2) {
                hai_arr[i][ii] -= 2;
                if (check(hai_arr))
                  calc(hai_arr, ii + 1 + MPSZ2[i]);
                hai_arr[i][ii] += 2;
              }
            }
          }
          let final_res = [];
          for (let v of res) {
            let is_duplicate = false;
            for (let vv of final_res) {
              if (JSON.stringify(v) === JSON.stringify(vv))
                is_duplicate = true;
            }
            if (!is_duplicate)
              final_res.push(v);
          }
          return final_res;
        };
        const exports3 = findAllAgariPatterns;
        exports3.check = check;
        exports3.check7 = check7;
        exports3.check13 = check13;
        exports3.checkAll = checkAll;
        if (typeof module2 === "object" && module2 && module2.exports) {
          module2.exports = exports3;
        } else if (typeof define === "function" && define.amd) {
          define(() => {
            return exports3;
          });
        } else if (typeof self === "object" && self) {
          self.agari = exports3;
        }
      })();
    }
  });

  // node_modules/syanten/index.js
  var require_syanten = __commonJS({
    "node_modules/syanten/index.js"(exports2, module2) {
      (() => {
        "use strict";
        const sum = (arr) => {
          let s = 0;
          for (let i = 0; i < arr.length; i++)
            s += arr[i];
          return s;
        };
        const syanten2 = (hai_arr) => {
          let res = 9;
          let mentsu, tatsu, alone, furo;
          mentsu = tatsu = alone = furo = 0;
          const search = (arr2, is_jihai = false) => {
            const searchHelper = (arr3, index, is_jihai2 = false, mentsu2, tatsu2, alone2) => {
              let tmp2 = [0, 0, 0];
              let max = [mentsu2, tatsu2, alone2];
              if (index === (is_jihai2 ? 7 : 9)) {
                return max;
              }
              if (arr3[index] === 0) {
                tmp2 = searchHelper(arr3, index + 1, is_jihai2, mentsu2, tatsu2, alone2);
                if (tmp2 > max) {
                  max = tmp2;
                }
              }
              if (arr3[index] >= 3) {
                arr3[index] -= 3;
                tmp2 = searchHelper(arr3, index, is_jihai2, mentsu2 + 1, tatsu2, alone2);
                if (tmp2 > max) {
                  max = tmp2;
                }
                arr3[index] += 3;
              }
              if (arr3[index] >= 2) {
                arr3[index] -= 2;
                tmp2 = searchHelper(arr3, index, is_jihai2, mentsu2, tatsu2 + 1, alone2);
                if (tmp2 > max) {
                  max = tmp2;
                }
                arr3[index] += 2;
              }
              if (arr3[index] >= 1) {
                arr3[index] -= 1;
                tmp2 = searchHelper(arr3, index, is_jihai2, mentsu2, tatsu2, alone2 + 1);
                if (tmp2 > max) {
                  max = tmp2;
                }
                arr3[index] += 1;
              }
              if (!is_jihai2) {
                if (arr3[index] > 0 && arr3[index + 1] > 0 && arr3[index + 2] > 0) {
                  arr3[index]--, arr3[index + 1]--, arr3[index + 2]--;
                  tmp2 = searchHelper(arr3, index, is_jihai2, mentsu2 + 1, tatsu2, alone2);
                  if (tmp2 > max) {
                    max = tmp2;
                  }
                  arr3[index]++, arr3[index + 1]++, arr3[index + 2]++;
                }
                if (arr3[index] > 0 && arr3[index + 2] > 0) {
                  arr3[index]--, arr3[index + 2]--;
                  tmp2 = searchHelper(arr3, index, is_jihai2, mentsu2, tatsu2 + 1, alone2);
                  if (tmp2 > max) {
                    max = tmp2;
                  }
                  arr3[index]++, arr3[index + 2]++;
                }
                if (arr3[index] > 0 && arr3[index + 1] > 0) {
                  arr3[index]--, arr3[index + 1]--;
                  tmp2 = searchHelper(arr3, index, is_jihai2, mentsu2, tatsu2 + 1, alone2);
                  if (tmp2 > max) {
                    max = tmp2;
                  }
                  arr3[index]++, arr3[index + 1]++;
                }
              }
              return max;
            };
            let tmp = searchHelper(arr2, 0, is_jihai, 0, 0, 0);
            mentsu += tmp[0], tatsu += tmp[1], alone += tmp[2];
          };
          const calc = () => {
            let tmp_res = -1;
            while (mentsu < 4 - furo) {
              if (tatsu && alone) {
                tatsu--, alone--, mentsu++, tmp_res++;
                continue;
              }
              if (tatsu && !alone) {
                tatsu--, alone++, mentsu++, tmp_res++;
                continue;
              }
              if (!tatsu && alone) {
                alone -= 2, mentsu++, tmp_res += 2;
              }
            }
            if (alone > 0) tmp_res++;
            res = tmp_res < res ? tmp_res : res;
            mentsu = tatsu = alone = 0;
          };
          hai_arr = [[...hai_arr[0]], [...hai_arr[1]], [...hai_arr[2]], [...hai_arr[3]]];
          let arr = [...hai_arr[0], ...hai_arr[1], ...hai_arr[2], ...hai_arr[3]];
          let s = sum(arr);
          if (s > 14 || s % 3 === 0)
            return -2;
          furo = Math.round((14 - s) / 3);
          if (s % 3 === 1) {
            for (let i = 33; ; i--) {
              if (!arr[i]) {
                arr[i]++;
                hai_arr[Math.floor(i / 9)][i % 9]++;
                break;
              }
            }
          }
          for (let i = 0; i < 34; i++) {
            if (arr[i] === 0)
              continue;
            let t = [];
            t[0] = [...hai_arr[0]], t[1] = [...hai_arr[1]], t[2] = [...hai_arr[2]], t[3] = [...hai_arr[3]];
            t[Math.floor(i / 9)][i % 9] -= arr[i] >= 2 ? 2 : arr[i];
            search(t[0]);
            search(t[1]);
            search(t[2]);
            search(t[3], true);
            calc();
          }
          return res;
        };
        const syanten7 = (hai_arr) => {
          let cnt = sum(hai_arr[0]) + sum(hai_arr[1]) + sum(hai_arr[2]) + sum(hai_arr[3]);
          if (cnt < 13 || cnt > 14)
            return -2;
          let arr = [...hai_arr[0], ...hai_arr[1], ...hai_arr[2], ...hai_arr[3]];
          let s = 0, t = 0;
          for (let i = 0; i < 34; i++) {
            if (arr[i] >= 2) s++;
            if (arr[i] === 1) t++;
          }
          if (s + t >= 7)
            return 6 - s;
          else
            return 6 - s + (7 - s - t);
        };
        const syanten13 = (hai_arr) => {
          let cnt = sum(hai_arr[0]) + sum(hai_arr[1]) + sum(hai_arr[2]) + sum(hai_arr[3]);
          if (cnt < 13 || cnt > 14)
            return -2;
          let arr = [hai_arr[0][0], hai_arr[0][8], hai_arr[1][0], hai_arr[1][8], hai_arr[2][0], hai_arr[2][8], ...hai_arr[3]];
          let s = 0, t = 0;
          for (let i = 0; i < 13; i++) {
            if (arr[i]) s++;
            if (arr[i] > 1) t = 1;
          }
          return 13 - s - t;
        };
        const syantenAll = (hai_arr) => {
          let s7 = syanten7(hai_arr);
          let s13 = syanten13(hai_arr);
          if (s7 === -2 || s13 === -2)
            return syanten2(hai_arr);
          else
            return Math.min(syanten2(hai_arr), s7, s13);
        };
        const MPSZ2 = ["m", "p", "s", "z"];
        const hairi = (hai_arr, is7or13 = false) => {
          let syantenCalc = !is7or13 ? syanten2 : (haiArr) => {
            return Math.min(syanten7(haiArr), syanten13(haiArr));
          };
          let sht = syantenCalc(hai_arr);
          let res = { now: sht };
          if (sht < 0)
            return res;
          let self2 = [];
          const calcHairi = () => {
            let map = {};
            for (let i = 0; i < 4; i++) {
              for (let ii = 0; ii < 9; ii++) {
                if (hai_arr[i][ii] === void 0)
                  continue;
                if (i === self2[0] && ii === self2[1])
                  continue;
                if (!is7or13 && i == 3 && hai_arr[i][ii] === 0)
                  continue;
                if (!is7or13 && i < 3 && (hai_arr[i][ii] === 0 && !hai_arr[i][ii - 1] === 0 && !hai_arr[i][ii - 2] === 0 && !hai_arr[i][ii + 1] === 0 && !hai_arr[i][ii + 1] === 0))
                  continue;
                hai_arr[i][ii]++;
                if (syantenCalc(hai_arr) < sht) {
                  map[ii + 1 + MPSZ2[i]] = 5 - hai_arr[i][ii];
                }
                hai_arr[i][ii]--;
              }
            }
            return map;
          };
          if ((sum(hai_arr[0]) + sum(hai_arr[1]) + sum(hai_arr[2]) + sum(hai_arr[3])) % 3 === 1) {
            res.wait = calcHairi();
            return res;
          }
          for (let i = 0; i < 4; i++) {
            for (let ii = 0; ii < 9; ii++) {
              if (hai_arr[i][ii] === 0 || hai_arr[i][ii] === void 0)
                continue;
              hai_arr[i][ii]--;
              if (syantenCalc(hai_arr) === sht) {
                self2 = [i, ii];
                res[ii + 1 + MPSZ2[i]] = calcHairi();
              }
              hai_arr[i][ii]++;
            }
          }
          return res;
        };
        const exports3 = syantenAll;
        exports3.syanten = syanten2;
        exports3.syanten7 = syanten7;
        exports3.syanten13 = syanten13;
        exports3.syantenAll = syantenAll;
        exports3.hairi = hairi;
        if (typeof module2 === "object" && module2 && module2.exports) {
          module2.exports = exports3;
        } else if (typeof define === "function" && define.amd) {
          define(() => {
            return exports3;
          });
        } else if (typeof self === "object" && self) {
          self.syanten = exports3;
        }
      })();
    }
  });

  // shims/assert.js
  var require_assert = __commonJS({
    "shims/assert.js"(exports2, module2) {
      function deepEqual(a, b) {
        if (a === b) return true;
        if (typeof a !== typeof b) return false;
        if (a === null || b === null || a === void 0 || b === void 0) return false;
        if (typeof a !== "object") return a !== a && b !== b;
        if (Array.isArray(a) !== Array.isArray(b)) return false;
        if (Array.isArray(a)) {
          if (a.length !== b.length) return false;
          for (var i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
          return true;
        }
        var ka = Object.keys(a), kb = Object.keys(b);
        if (ka.length !== kb.length) return false;
        for (var j = 0; j < ka.length; j++) {
          if (!Object.prototype.hasOwnProperty.call(b, ka[j])) return false;
          if (!deepEqual(a[ka[j]], b[ka[j]])) return false;
        }
        return true;
      }
      function fail(msg) {
        var e = new Error(msg);
        e.name = "AssertionError";
        throw e;
      }
      function deepStrictEqual(actual, expected, message) {
        if (!deepEqual(actual, expected)) fail(message || "Expected values to be strictly deep-equal");
      }
      function strictEqual(actual, expected, message) {
        if (actual !== expected) fail(message || "Expected values to be strictly equal");
      }
      function ok(value, message) {
        if (!value) fail(message || "The expression evaluated to a falsy value");
      }
      var assert = ok;
      assert.ok = ok;
      assert.equal = strictEqual;
      assert.strictEqual = strictEqual;
      assert.deepEqual = deepStrictEqual;
      assert.deepStrictEqual = deepStrictEqual;
      assert.notDeepStrictEqual = function(a, b, m) {
        if (deepEqual(a, b)) fail(m || "Expected values not to be strictly deep-equal");
      };
      assert.fail = function(m) {
        fail(m || "Failed");
      };
      module2.exports = assert;
      module2.exports.default = assert;
    }
  });

  // node_modules/riichi/yaku.js
  var require_yaku = __commonJS({
    "node_modules/riichi/yaku.js"(exports2, module2) {
      "use strict";
      var assert = require_assert();
      var agari2 = require_agari();
      var MPSZ2 = ["m", "p", "s", "z"];
      var checkAllowed = (o, allowed) => {
        for (let v of o.hai)
          if (!allowed.includes(v))
            return false;
        for (let v of o.furo)
          for (let vv of v)
            if (!allowed.includes(vv))
              return false;
        return true;
      };
      var checkChanta = (o, allow) => {
        let hasJyuntsu = false;
        for (let v of o.currentPattern) {
          if (typeof v === "string") {
            if (!allow.includes(v))
              return false;
          } else if (v.length <= 2 || v[0] === v[1]) {
            if (!allow.includes(v[0]))
              return false;
          } else {
            hasJyuntsu = true;
            let add = parseInt(v[0]) + parseInt(v[1]) + parseInt(v[2]);
            if (add > 6 && add < 24)
              return false;
          }
        }
        return hasJyuntsu;
      };
      var checkYakuhai = (o, pos) => {
        for (let v of o.currentPattern) {
          if (typeof v !== "string" && v[0] === pos + "z")
            return true;
        }
        return false;
      };
      var YAKU2 = {
        "\u56FD\u58EB\u7121\u53CC\u5341\u4E09\u9762\u5F85\u3061": { "yakuman": 2, "isMenzenOnly": true, "check": (o) => {
          return agari2.check13(o.haiArray) && o.hai.reduce((total, v) => {
            return v === o.agari ? ++total : total;
          }, 0) === 2;
        } },
        "\u56FD\u58EB\u7121\u53CC": { "yakuman": 1, "isMenzenOnly": true, "check": (o) => {
          return agari2.check13(o.haiArray) && o.hai.reduce((total, v) => {
            return v === o.agari ? ++total : total;
          }, 0) === 1;
        } },
        "\u7D14\u6B63\u4E5D\u84EE\u5B9D\u71C8": { "yakuman": 2, "isMenzenOnly": true, "check": (o) => {
          let i = MPSZ2.indexOf(o.agari[1]);
          let arr = o.haiArray[i].concat();
          if (arr[0] < 3 || arr[8] < 3 || arr.includes(0))
            return false;
          return [2, 4].includes(arr[parseInt(o.agari) - 1]);
        } },
        "\u4E5D\u84EE\u5B9D\u71C8": { "yakuman": 1, "isMenzenOnly": true, "check": (o) => {
          let i = MPSZ2.indexOf(o.agari[1]);
          let arr = o.haiArray[i].concat();
          if (arr[0] < 3 || arr[8] < 3 || arr.includes(0))
            return false;
          return [1, 3].includes(arr[parseInt(o.agari) - 1]);
        } },
        "\u56DB\u6697\u523B\u5358\u9A0E\u5F85\u3061": { "yakuman": 2, "isMenzenOnly": true, "check": (o) => {
          let res = 0;
          for (let v of o.currentPattern) {
            if (typeof v === "string" && v !== o.agari)
              return false;
            if (typeof v !== "string" && v.length <= 2)
              res++;
          }
          return res === 4;
        } },
        "\u56DB\u6697\u523B": { "yakuman": 1, "isMenzenOnly": true, "check": (o) => {
          let res = 0;
          for (let v of o.currentPattern) {
            if (typeof v === "string" && v === o.agari)
              return false;
            if (typeof v !== "string" && v.length <= 2)
              res++;
          }
          return res === 4;
        } },
        "\u5927\u56DB\u559C": { "yakuman": 2, "check": (o) => {
          let need = ["1z", "2z", "3z", "4z"];
          let res = 0;
          for (let v of o.currentPattern) {
            if (typeof v === "object" && need.includes(v[0]))
              res++;
          }
          return res === 4;
        } },
        "\u5C0F\u56DB\u559C": { "yakuman": 1, "check": (o) => {
          let need = ["1z", "2z", "3z", "4z"];
          let res = 0;
          for (let v of o.currentPattern) {
            if (typeof v === "string" && !need.includes(v))
              return false;
            if (typeof v === "object" && need.includes(v[0]))
              res++;
          }
          return res === 3;
        } },
        "\u5927\u4E09\u5143": { "yakuman": 1, "check": (o) => {
          let need = ["5z", "6z", "7z"];
          let res = 0;
          for (let v of o.currentPattern) {
            if (typeof v === "object" && need.includes(v[0]))
              res++;
          }
          return res === 3;
        } },
        "\u5B57\u4E00\u8272": { "yakuman": 1, "check": (o) => {
          let allow = ["1z", "2z", "3z", "4z", "5z", "6z", "7z"];
          return checkAllowed(o, allow);
        } },
        "\u7DD1\u4E00\u8272": { "yakuman": 1, "check": (o) => {
          let allow = ["2s", "3s", "4s", "6s", "8s", "6z"];
          return checkAllowed(o, allow);
        } },
        "\u6E05\u8001\u982D": { "yakuman": 1, "check": (o) => {
          let allow = ["1m", "9m", "1p", "9p", "1s", "9s"];
          return checkAllowed(o, allow);
        } },
        "\u56DB\u69D3\u5B50": { "yakuman": 1, "check": (o) => {
          let res = 0;
          for (let v of o.currentPattern)
            if (typeof v !== "string" && (v.length === 2 || v.length === 4))
              res++;
          return res === 4;
        } },
        "\u5929\u548C": { "yakuman": 1, "isMenzenOnly": true, "check": (o) => {
          return o.extra.includes("t") && o.isTsumo && o.isOya && !o.furo.length;
        } },
        "\u5730\u548C": { "yakuman": 1, "isMenzenOnly": true, "check": (o) => {
          return o.extra.includes("t") && o.isTsumo && !o.isOya && !o.furo.length;
        } },
        "\u4EBA\u548C": { "yakuman": 1, "isMenzenOnly": true, "isLocal": true, "check": (o) => {
          return o.extra.includes("t") && !o.isTsumo && !o.isOya && !o.furo.length;
        } },
        "\u5927\u4E03\u661F": { "yakuman": 1, "isMenzenOnly": true, "isLocal": true, "check": (o) => {
          let allow = ["1z", "2z", "3z", "4z", "5z", "6z", "7z"];
          return checkAllowed(o, allow) && YAKU2["\u4E03\u5BFE\u5B50"].check(o);
        } },
        "\u6E05\u4E00\u8272": { "han": 6, "isFuroMinus": true, "check": (o) => {
          let must = o.agari[1];
          let allow = [];
          for (let i = 1; i <= 9; i++)
            allow.push(i + must);
          return checkAllowed(o, allow);
        } },
        "\u6DF7\u4E00\u8272": { "han": 3, "isFuroMinus": true, "check": (o) => {
          let allow = ["1z", "2z", "3z", "4z", "5z", "6z", "7z"];
          let d = "";
          for (let v of o.hai) {
            if (["m", "p", "s"].includes(v[1])) {
              d = v[1];
              break;
            }
          }
          if (!d) {
            for (let v of o.furo) {
              for (let vv of v) {
                if (["m", "p", "s"].includes(vv[1])) {
                  d = vv[1];
                  break;
                }
              }
            }
          }
          if (!d)
            return false;
          for (let i = 1; i <= 9; i++)
            allow.push(i + d);
          return checkAllowed(o, allow) && !YAKU2["\u6E05\u4E00\u8272"].check(o);
        } },
        "\u4E8C\u76C3\u53E3": { "han": 3, "isMenzenOnly": true, "check": (o) => {
          let arr = [];
          for (let v of o.currentPattern) {
            if (typeof v === "string")
              continue;
            if (v.length !== 3 || v[0] === v[1])
              return false;
            arr.push(v[0]);
          }
          return arr[0] + arr[2] === arr[1] + arr[3];
        } },
        "\u7D14\u5168\u5E2F\u4E48\u4E5D": { "han": 3, "isFuroMinus": true, "check": (o) => {
          let allow = ["1m", "9m", "1p", "9p", "1s", "9s"];
          return checkChanta(o, allow);
        } },
        "\u6DF7\u5168\u5E2F\u4E48\u4E5D": { "han": 2, "isFuroMinus": true, "check": (o) => {
          let allow = ["1m", "9m", "1p", "9p", "1s", "9s", "1z", "2z", "3z", "4z", "5z", "6z", "7z"];
          return checkChanta(o, allow) && !YAKU2["\u7D14\u5168\u5E2F\u4E48\u4E5D"].check(o);
        } },
        "\u5BFE\u3005\u548C": { "han": 2, "check": (o) => {
          let res = 0;
          for (let v of o.currentPattern)
            if (v.length === 1 || v[0] === v[1])
              res++;
          return res === 4;
        } },
        "\u6DF7\u8001\u982D": { "han": 2, "check": (o) => {
          let allow = ["1m", "9m", "1p", "9p", "1s", "9s", "1z", "2z", "3z", "4z", "5z", "6z", "7z"];
          return checkAllowed(o, allow);
        } },
        "\u4E09\u69D3\u5B50": { "han": 2, "check": (o) => {
          let res = 0;
          for (let v of o.currentPattern)
            if (typeof v !== "string" && (v.length === 2 || v.length === 4))
              res++;
          return res === 3;
        } },
        "\u5C0F\u4E09\u5143": { "han": 2, "check": (o) => {
          let need = ["5z", "6z", "7z"];
          let res = 0;
          for (let v of o.currentPattern) {
            if (typeof v === "string" && !need.includes(v))
              return false;
            if (typeof v === "object" && need.includes(v[0]))
              res++;
          }
          return res === 2;
        } },
        "\u4E09\u8272\u540C\u523B": { "han": 2, "check": (o) => {
          let res = [0, 0, 0, 0, 0, 0, 0, 0, 0];
          for (let v of o.currentPattern) {
            if ((v.length === 1 || v[0] === v[1]) && !v[0].includes("z"))
              res[parseInt(v[0]) - 1]++;
            else
              continue;
          }
          return res.includes(3);
        } },
        "\u4E09\u6697\u523B": { "han": 2, "check": (o) => {
          let res = 0;
          for (let v of o.currentPattern)
            if (typeof v !== "string" && v.length <= 2)
              res++;
          return res === 3;
        } },
        "\u4E03\u5BFE\u5B50": { "han": 2, "isMenzenOnly": true, "check": (o) => {
          return agari2.check7(o.haiArray) && !YAKU2["\u4E8C\u76C3\u53E3"].check(o);
        } },
        "\u30C0\u30D6\u30EB\u7ACB\u76F4": { "han": 2, "isMenzenOnly": true, "check": (o) => {
          return o.extra.includes("w") && !o.furo.length;
        } },
        "\u4E00\u6C17\u901A\u8CAB": { "han": 2, "isFuroMinus": true, "check": (o) => {
          let res = [0, 0, 0, 0, 0, 0, 0, 0, 0];
          for (let v of o.currentPattern) {
            if (v.length <= 2 || v[0] === v[1])
              continue;
            if ([1, 4, 7].includes(parseInt(v[0]))) {
              let i = MPSZ2.indexOf(v[0][1]) * 3 + (parseInt(v[0]) - 1) / 3;
              res[i]++;
            }
          }
          return res[0] && res[1] && res[2] || res[3] && res[4] && res[5] || res[6] && res[7] && res[8];
        } },
        "\u4E09\u8272\u540C\u9806": { "han": 2, "isFuroMinus": true, "check": (o) => {
          let res = [];
          for (let v of o.currentPattern) {
            if (v.length <= 2 || v[0] === v[1] || v[0].includes("z")) continue;
            let value = parseInt(v[0]);
            res[value] = res[value] ? res[value] : /* @__PURE__ */ new Set();
            res[value].add(v[0][1]);
          }
          return res.some((value) => value.size === 3);
        } },
        "\u65AD\u4E48\u4E5D": { "han": 1, "check": (o) => {
          for (let v of o.furo)
            if (!o.allowKuitan && v.length !== 2)
              return false;
          let allow = ["2m", "3m", "4m", "5m", "6m", "7m", "8m", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "2s", "3s", "4s", "5s", "6s", "7s", "8s"];
          return checkAllowed(o, allow);
        } },
        "\u5E73\u548C": { "han": 1, "isMenzenOnly": true, "check": (o) => {
          let hasAgariFu = true;
          for (let v of o.currentPattern) {
            if (typeof v === "string") {
              if (v.includes("z") && [o.bakaze, o.jikaze, 5, 6, 7].includes(parseInt(v)))
                return false;
            } else if (v.length !== 3 || v[0] === v[1]) {
              return false;
            } else if (v[0] === o.agari && parseInt(v[2]) !== 9 || v[2] === o.agari && parseInt(v[0]) !== 1) {
              hasAgariFu = false;
            }
          }
          return !hasAgariFu;
        } },
        "\u4E00\u76C3\u53E3": { "han": 1, "isMenzenOnly": true, "check": (o) => {
          if (YAKU2["\u4E8C\u76C3\u53E3"].check(o))
            return false;
          for (let i in o.currentPattern) {
            i = parseInt(i);
            let v = o.currentPattern[i];
            if (v.length === 3 && v[0] != v[1]) {
              while (i < 4) {
                i++;
                try {
                  assert.deepStrictEqual(v, o.currentPattern[i]);
                  return true;
                } catch (e) {
                }
              }
            }
          }
          return false;
        } },
        "\u9580\u524D\u6E05\u81EA\u6478\u548C": { "han": 1, "isMenzenOnly": true, "check": (o) => {
          return o.isTsumo;
        } },
        "\u7ACB\u76F4": { "han": 1, "isMenzenOnly": true, "check": (o) => {
          return (YAKU2["\u4E00\u767A"].check(o) || (o.extra.includes("r") || o.extra.includes("l"))) && !YAKU2["\u30C0\u30D6\u30EB\u7ACB\u76F4"].check(o);
        } },
        "\u4E00\u767A": { "han": 1, "isMenzenOnly": true, "check": (o) => {
          return o.extra.includes("i") || o.extra.includes("y");
        } },
        "\u5DBA\u4E0A\u958B\u82B1": { "han": 1, "check": (o) => {
          let hasKantsu = false;
          for (let v of o.furo) {
            if (v.length === 2 || v.length === 4) {
              hasKantsu = true;
              break;
            }
          }
          return hasKantsu && o.extra.includes("k") && !o.extra.includes("h") && o.isTsumo && !YAKU2["\u4E00\u767A"].check(o);
        } },
        "\u6436\u69D3": { "han": 1, "check": (o) => {
          return o.extra.includes("k") && !o.extra.includes("h") && !o.isTsumo;
        } },
        "\u6D77\u5E95\u6478\u6708": { "han": 1, "check": (o) => {
          return o.extra.includes("h") && o.isTsumo;
        } },
        "\u6CB3\u5E95\u6488\u9B5A": { "han": 1, "check": (o) => {
          return o.extra.includes("h") && !o.isTsumo && !YAKU2["\u4E00\u767A"].check(o);
        } },
        "\u5834\u98A8\u6771": { "han": 1, "check": (o) => {
          return o.bakaze === 1 && checkYakuhai(o, 1);
        } },
        "\u5834\u98A8\u5357": { "han": 1, "check": (o) => {
          return o.bakaze === 2 && checkYakuhai(o, 2);
        } },
        "\u5834\u98A8\u897F": { "han": 1, "check": (o) => {
          return o.bakaze === 3 && checkYakuhai(o, 3);
        } },
        "\u5834\u98A8\u5317": { "han": 1, "check": (o) => {
          return o.bakaze === 4 && checkYakuhai(o, 4);
        } },
        "\u81EA\u98A8\u6771": { "han": 1, "check": (o) => {
          return o.jikaze === 1 && checkYakuhai(o, 1);
        } },
        "\u81EA\u98A8\u5357": { "han": 1, "check": (o) => {
          return o.jikaze === 2 && checkYakuhai(o, 2);
        } },
        "\u81EA\u98A8\u897F": { "han": 1, "check": (o) => {
          return o.jikaze === 3 && checkYakuhai(o, 3);
        } },
        "\u81EA\u98A8\u5317": { "han": 1, "check": (o) => {
          return o.jikaze === 4 && checkYakuhai(o, 4);
        } },
        "\u5F79\u724C\u767D": { "han": 1, "check": (o) => {
          return checkYakuhai(o, 5);
        } },
        "\u5F79\u724C\u767A": { "han": 1, "check": (o) => {
          return checkYakuhai(o, 6);
        } },
        "\u5F79\u724C\u4E2D": { "han": 1, "check": (o) => {
          return checkYakuhai(o, 7);
        } }
      };
      module2.exports = YAKU2;
    }
  });

  // node_modules/riichi/index.js
  var require_riichi = __commonJS({
    "node_modules/riichi/index.js"(exports, module) {
      "use strict";
      var agari = require_agari();
      var syanten = require_syanten();
      var YAKU = require_yaku();
      var MPSZ = ["m", "p", "s", "z"];
      var KAZE = [void 0, "\u6771", "\u5357", "\u897F", "\u5317", "\u767D", "\u767C", "\u4E2D"];
      var ceil10 = (num) => {
        return Math.ceil(num / 10) * 10;
      };
      var ceil100 = (num) => {
        return Math.ceil(num / 100) * 100;
      };
      var isHai = (text) => {
        return typeof text === "string" && text.length === 2 && !isNaN(text[0]) && MPSZ.includes(text[1]);
      };
      var is19 = (text) => {
        return isHai(text) && (text.includes("1") || text.includes("9") || text.includes("z"));
      };
      var isFuro = (arr) => {
        if (arr instanceof Array !== true || arr.length > 4 || arr.length < 2)
          return false;
        let set = new Set(arr);
        if (set.size === 1)
          return isHai(arr[0]);
        else {
          if (set.size !== 3)
            return false;
          let minus1 = parseInt(arr[1]) - parseInt(arr[0]);
          let minus2 = parseInt(arr[2]) - parseInt(arr[1]);
          if (minus1 !== minus2 || minus1 !== 1)
            return false;
        }
        return true;
      };
      var parse = (text) => {
        let tmp = [];
        let aka = 0;
        for (let v of text) {
          if (!isNaN(v)) {
            if (v === "0")
              v = "5", aka++;
            tmp.push(v);
          }
          if (MPSZ.includes(v)) {
            for (let k in tmp)
              if (!isNaN(tmp[k]))
                tmp[k] += v;
          }
        }
        let res = [];
        for (let v of tmp)
          if (isNaN(v))
            res.push(v);
        return { "res": tmp, "aka": aka };
      };
      var Riichi = class {
        /**
         * @param string data
         */
        constructor(data) {
          this.hai = [];
          this.haiArray = [
            // 複合array型手牌(和了牌含)
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
          ];
          this.furo = [];
          this.agari = "";
          this.dora = [];
          this.extra = "";
          this.isTsumo = true;
          this.isOya = false;
          this.bakaze = 1;
          this.jikaze = 2;
          this.aka = 0;
          this.agariPatterns = [];
          this.currentPattern;
          this.tmpResult = {
            //臨時計算結果
            "isAgari": false,
            //和了?
            "yakuman": 0,
            //役満倍数
            "yaku": {},
            //手役 例:{'天和':'役満','大四喜':'ダブル役満'} 例:{'立直':'1飜','清一色':'6飜'}
            "han": 0,
            //飜数
            "fu": 0,
            //符数
            "ten": 0,
            //点数(this.isOya=undefined場合，計算不能)
            "name": "",
            //例:'満貫'、'跳満'、'倍満'、'三倍満'、'数え役満'
            "text": "",
            //結果text 例:'30符4飜'、'40符4飜 満貫'、'6倍役満'
            "oya": [0, 0, 0],
            //親家得点 例:[2600,2600,2600]、[7700]
            "ko": [0, 0, 0],
            //子家得点 例:[3900,2000,2000]、[7700]
            "error": true
            //input error
          };
          this.finalResult;
          this.allLocalEnabled = false;
          this.localEnabled = [];
          this.disabled = [];
          this.allowWyakuman = true;
          this.allowKuitan = true;
          this.allowAka = true;
          this.hairi = true;
          if (typeof data !== "string")
            return;
          data = data.toLowerCase();
          let arr = data.split("+");
          let hai = arr.shift();
          for (let v of arr) {
            if (!v.includes("m") && !v.includes("p") && !v.includes("s") && !v.includes("z"))
              this.extra = v;
            else if (v[0] === "d")
              this.dora = parse(v.substr(1)).res;
            else if (isHai(v)) {
              hai += v;
              this.isTsumo = false;
            } else {
              let tmp2 = [];
              for (let vv of v) {
                if (MPSZ.includes(vv)) {
                  for (let k in tmp2)
                    tmp2[k] += vv;
                  if (isFuro(tmp2))
                    this.furo.push(tmp2.sort());
                  tmp2 = [];
                } else {
                  if (vv === "0")
                    vv = "5", this.aka++;
                  tmp2.push(vv);
                }
              }
            }
          }
          let tmp = parse(hai);
          this.hai = tmp.res;
          this.aka += tmp.aka;
          this.agari = this.hai.slice(-1)[0];
          if (this.hai.length % 3 === 0)
            return;
          if (this.hai.length + this.furo.length * 3 > 14)
            return;
          for (let v of this.hai) {
            let n = parseInt(v);
            let i = MPSZ.indexOf(v.replace(n, ""));
            this.haiArray[i][n - 1]++;
          }
          let kaze = this.extra.replace(/[a-z]/g, "");
          if (kaze.length === 1)
            this.jikaze = parseInt(kaze);
          if (kaze.length > 1) {
            this.bakaze = parseInt(kaze[0]);
            this.jikaze = parseInt(kaze[1]);
          }
          if (this.jikaze === 1)
            this.isOya = true;
          else
            this.isOya = false;
          this.tmpResult.error = false;
          this.finalResult = JSON.parse(JSON.stringify(this.tmpResult));
        }
        /**
         * 門前判定
         */
        isMenzen() {
          for (let v of this.furo)
            if (v.length > 2)
              return false;
          return true;
        }
        /**
         * dora枚数計算
         */
        calcDora() {
          if (!this.tmpResult.han)
            return;
          let dora = 0;
          for (let v of this.hai) {
            for (let vv of this.dora) {
              if (v === vv)
                dora++;
            }
          }
          for (let v of this.furo) {
            if (v.length === 2)
              v = v.concat(v);
            for (let vv of v) {
              for (let vvv of this.dora) {
                if (vvv === vv)
                  dora++;
              }
            }
          }
          if (dora) {
            this.tmpResult.han += dora;
            this.tmpResult.yaku["\u30C9\u30E9"] = dora + "\u98DC";
          }
          if (this.allowAka && this.aka) {
            this.tmpResult.han += this.aka;
            this.tmpResult.yaku["\u8D64\u30C9\u30E9"] = this.aka + "\u98DC";
          }
        }
        /**
         * 符計算
         */
        calcFu() {
          let fu = 0;
          if (this.tmpResult.yaku["\u4E03\u5BFE\u5B50"]) {
            fu = 25;
          } else if (this.tmpResult.yaku["\u5E73\u548C"]) {
            fu = this.isTsumo ? 20 : 30;
          } else {
            fu = 20;
            let hasAgariFu = false;
            if (!this.isTsumo && this.isMenzen())
              fu += 10;
            for (let v of this.currentPattern) {
              if (typeof v === "string") {
                if (v.includes("z")) {
                  for (let vv of [this.bakaze, this.jikaze, 5, 6, 7])
                    if (parseInt(v) === vv)
                      fu += 2;
                }
                if (this.agari === v)
                  hasAgariFu = true;
              } else {
                if (v.length === 4)
                  fu += is19(v[0]) ? 16 : 8;
                else if (v.length === 2)
                  fu += is19(v[0]) ? 32 : 16;
                else if (v.length === 1)
                  fu += is19(v[0]) ? 8 : 4;
                else if (v.length === 3 && v[0] === v[1])
                  fu += is19(v[0]) ? 4 : 2;
                else if (!hasAgariFu) {
                  if (v[1] === this.agari)
                    hasAgariFu = true;
                  else if (v[0] === hasAgariFu && parseInt(v[2]) === 9)
                    hasAgariFu = true;
                  else if (v[2] === hasAgariFu && parseInt(v[0]) === 1)
                    hasAgariFu = true;
                }
              }
            }
            if (hasAgariFu)
              fu += 2;
            if (this.isTsumo)
              fu += 2;
            fu = ceil10(fu);
            if (fu < 30)
              fu = 30;
          }
          this.tmpResult.fu = fu;
        }
        /**
         * 点数計算
         */
        calcTen() {
          this.tmpResult.name = "";
          let base;
          this.tmpResult.text = `(${KAZE[this.bakaze]}\u5834`;
          this.tmpResult.text += KAZE[this.jikaze] + "\u5BB6)";
          this.tmpResult.text += this.isTsumo ? "\u81EA\u6478" : "\u6804\u548C";
          if (this.tmpResult.yakuman) {
            base = 8e3 * this.tmpResult.yakuman;
            this.tmpResult.name = this.tmpResult.yakuman > 1 ? this.tmpResult.yakuman + "\u500D\u5F79\u6E80" : "\u5F79\u6E80";
          } else {
            if (!this.tmpResult.han)
              return;
            base = this.tmpResult.fu * Math.pow(2, this.tmpResult.han + 2);
            this.tmpResult.text += " " + this.tmpResult.fu + "\u7B26" + this.tmpResult.han + "\u98DC";
            if (base > 2e3) {
              if (this.tmpResult.han >= 13) {
                base = 8e3;
                this.tmpResult.name = "\u6570\u3048\u5F79\u6E80";
              } else if (this.tmpResult.han >= 11) {
                base = 6e3;
                this.tmpResult.name = "\u4E09\u500D\u6E80";
              } else if (this.tmpResult.han >= 8) {
                base = 4e3;
                this.tmpResult.name = "\u500D\u6E80";
              } else if (this.tmpResult.han >= 6) {
                base = 3e3;
                this.tmpResult.name = "\u8DF3\u6E80";
              } else {
                base = 2e3;
                this.tmpResult.name = "\u6E80\u8CAB";
              }
            }
          }
          this.tmpResult.text += (this.tmpResult.name ? " " : "") + this.tmpResult.name;
          if (this.isTsumo) {
            this.tmpResult.oya = [ceil100(base * 2), ceil100(base * 2), ceil100(base * 2)];
            this.tmpResult.ko = [ceil100(base * 2), ceil100(base), ceil100(base)];
          } else {
            this.tmpResult.oya = [ceil100(base * 6)];
            this.tmpResult.ko = [ceil100(base * 4)];
          }
          this.tmpResult.ten = this.isOya ? eval(this.tmpResult.oya.join("+")) : eval(this.tmpResult.ko.join("+"));
          this.tmpResult.text += " " + this.tmpResult.ten + "\u70B9";
          if (this.isTsumo) {
            this.tmpResult.text += "(";
            if (this.isOya)
              this.tmpResult.text += this.tmpResult.oya[0] + "all";
            else
              this.tmpResult.text += this.tmpResult.ko[0] + "," + this.tmpResult.ko[1];
            this.tmpResult.text += ")";
          }
        }
        /**
         * 手役計算
         */
        calcYaku() {
          this.tmpResult.yaku = {};
          this.tmpResult.yakuman = 0;
          this.tmpResult.han = 0;
          for (let k in YAKU) {
            let v = YAKU[k];
            if (this.disabled.includes(k))
              continue;
            if (v.isLocal && !this.allLocalEnabled && !this.localEnabled.includes(k))
              continue;
            if (this.tmpResult.yakuman && !v.yakuman)
              continue;
            if (v.isMenzenOnly && !this.isMenzen())
              continue;
            if (v.check(this)) {
              if (v.yakuman) {
                let n = this.allowWyakuman ? v.yakuman : 1;
                this.tmpResult.yakuman += n;
                this.tmpResult.yaku[k] = n > 1 ? "\u30C0\u30D6\u30EB\u5F79\u6E80" : "\u5F79\u6E80";
              } else {
                let n = v.han;
                if (v.isFuroMinus && !this.isMenzen())
                  n--;
                this.tmpResult.yaku[k] = n + "\u98DC";
                this.tmpResult.han += n;
              }
            }
          }
        }
        // api exports ↓ ----------------------------------------------------------------------------------------------------
        disableWyakuman() {
          this.allowWyakuman = false;
        }
        disableKuitan() {
          this.allowKuitan = false;
        }
        disableAka() {
          this.allowAka = false;
        }
        enableLocalYaku(name) {
          this.localEnabled.push(name);
        }
        disableYaku(name) {
          this.disabled.push(name);
        }
        // supported local yaku list
        // 大七星 役満(字一色別)
        // 人和 役満
        // 
        disableHairi() {
          this.hairi = false;
        }
        /**
         * main
         */
        calc() {
          if (this.tmpResult.error) {
            return this.tmpResult;
          }
          this.tmpResult.isAgari = agari.checkAll(this.haiArray);
          if (!this.tmpResult.isAgari || this.hai.length + this.furo.length * 3 !== 14) {
            if (this.hairi) {
              this.tmpResult.hairi = syanten.hairi(this.haiArray);
              this.tmpResult.hairi7and13 = syanten.hairi(this.haiArray, true);
            }
            return this.tmpResult;
          }
          this.finalResult.isAgari = true;
          if (this.extra.includes("o"))
            this.allLocalEnabled = true;
          this.agariPatterns = agari(this.haiArray);
          if (!this.agariPatterns.length)
            this.agariPatterns.push([]);
          for (let v of this.agariPatterns) {
            if (!this.isTsumo) {
              for (let k in v) {
                let vv = v[k];
                if (vv.length === 1 && vv[0] === this.agari) {
                  let i = MPSZ.indexOf(this.agari[1]);
                  if (this.haiArray[i][parseInt(this.agari) - 1] < 4)
                    v[k] = [vv[0], vv[0], vv[0]];
                }
              }
            }
            this.currentPattern = v.concat(this.furo);
            this.calcYaku();
            if (!this.tmpResult.yakuman && !this.tmpResult.han)
              continue;
            if (this.tmpResult.han) {
              this.calcDora();
              this.calcFu();
            }
            this.calcTen();
            if (this.tmpResult.ten > this.finalResult.ten)
              this.finalResult = JSON.parse(JSON.stringify(this.tmpResult));
            else if (this.tmpResult.ten === this.finalResult.ten && this.tmpResult.han > this.finalResult.han)
              this.finalResult = JSON.parse(JSON.stringify(this.tmpResult));
          }
          if (!this.finalResult.ten)
            this.finalResult.text = "\u7121\u5F79";
          return this.finalResult;
        }
      };
      module.exports = Riichi;
    }
  });

  // node_modules/protobufjs/src/util/aspromise.js
  var require_aspromise = __commonJS({
    "node_modules/protobufjs/src/util/aspromise.js"(exports2, module2) {
      "use strict";
      module2.exports = asPromise;
      function asPromise(fn, ctx) {
        var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
        while (index < arguments.length)
          params[offset++] = arguments[index++];
        return new Promise(function executor(resolve, reject) {
          params[offset] = function callback(err) {
            if (pending) {
              pending = false;
              if (err)
                reject(err);
              else {
                var params2 = new Array(arguments.length - 1), offset2 = 0;
                while (offset2 < params2.length)
                  params2[offset2++] = arguments[offset2];
                resolve.apply(null, params2);
              }
            }
          };
          try {
            fn.apply(ctx || null, params);
          } catch (err) {
            if (pending) {
              pending = false;
              reject(err);
            }
          }
        });
      }
    }
  });

  // node_modules/protobufjs/src/util/base64.js
  var require_base64 = __commonJS({
    "node_modules/protobufjs/src/util/base64.js"(exports2) {
      "use strict";
      var base64 = exports2;
      base64.length = function length(string) {
        var p = string.length;
        if (!p)
          return 0;
        while (p > 0 && string.charAt(p - 1) === "=")
          --p;
        return Math.floor(p * 3 / 4);
      };
      var b64 = new Array(64);
      var s64 = new Array(123);
      for (i = 0; i < 64; )
        s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
      var i;
      s64[45] = 62;
      s64[95] = 63;
      base64.encode = function encode(buffer, start, end) {
        var parts = null, chunk = [];
        var i2 = 0, j = 0, t;
        while (start < end) {
          var b = buffer[start++];
          switch (j) {
            case 0:
              chunk[i2++] = b64[b >> 2];
              t = (b & 3) << 4;
              j = 1;
              break;
            case 1:
              chunk[i2++] = b64[t | b >> 4];
              t = (b & 15) << 2;
              j = 2;
              break;
            case 2:
              chunk[i2++] = b64[t | b >> 6];
              chunk[i2++] = b64[b & 63];
              j = 0;
              break;
          }
          if (i2 > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i2 = 0;
          }
        }
        if (j) {
          chunk[i2++] = b64[t];
          chunk[i2++] = 61;
          if (j === 1)
            chunk[i2++] = 61;
        }
        if (parts) {
          if (i2)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)));
          return parts.join("");
        }
        return String.fromCharCode.apply(String, chunk.slice(0, i2));
      };
      var invalidEncoding = "invalid encoding";
      base64.decode = function decode(string, buffer, offset) {
        var start = offset;
        var j = 0, t;
        for (var i2 = 0; i2 < string.length; ) {
          var c = string.charCodeAt(i2++);
          if (c === 61 && j > 1)
            break;
          if ((c = s64[c]) === void 0)
            throw Error(invalidEncoding);
          switch (j) {
            case 0:
              t = c;
              j = 1;
              break;
            case 1:
              buffer[offset++] = t << 2 | (c & 48) >> 4;
              t = c;
              j = 2;
              break;
            case 2:
              buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
              t = c;
              j = 3;
              break;
            case 3:
              buffer[offset++] = (t & 3) << 6 | c;
              j = 0;
              break;
          }
        }
        if (j === 1)
          throw Error(invalidEncoding);
        return offset - start;
      };
      var base64Re = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
      var base64UrlRe = /[-_]/;
      var base64UrlNoPaddingRe = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2}(?:==)?|[A-Za-z0-9_-]{3}=?)?$/;
      base64.test = function test(string) {
        return base64Re.test(string) || base64UrlRe.test(string) && base64UrlNoPaddingRe.test(string);
      };
    }
  });

  // node_modules/protobufjs/src/util/eventemitter.js
  var require_eventemitter = __commonJS({
    "node_modules/protobufjs/src/util/eventemitter.js"(exports2, module2) {
      "use strict";
      module2.exports = EventEmitter;
      function EventEmitter() {
        this._listeners = /* @__PURE__ */ Object.create(null);
      }
      EventEmitter.prototype.on = function on(evt, fn, ctx) {
        (this._listeners[evt] || (this._listeners[evt] = [])).push({
          fn,
          ctx: ctx || this
        });
        return this;
      };
      EventEmitter.prototype.off = function off(evt, fn) {
        if (evt === void 0)
          this._listeners = /* @__PURE__ */ Object.create(null);
        else {
          if (fn === void 0)
            this._listeners[evt] = [];
          else {
            var listeners = this._listeners[evt];
            if (!listeners)
              return this;
            for (var i = 0; i < listeners.length; )
              if (listeners[i].fn === fn)
                listeners.splice(i, 1);
              else
                ++i;
          }
        }
        return this;
      };
      EventEmitter.prototype.emit = function emit(evt) {
        var listeners = this._listeners[evt];
        if (listeners) {
          var args = [], i = 1;
          for (; i < arguments.length; )
            args.push(arguments[i++]);
          for (i = 0; i < listeners.length; )
            listeners[i].fn.apply(listeners[i++].ctx, args);
        }
        return this;
      };
    }
  });

  // node_modules/protobufjs/src/util/float.js
  var require_float = __commonJS({
    "node_modules/protobufjs/src/util/float.js"(exports2, module2) {
      "use strict";
      module2.exports = factory(factory);
      function factory(exports3) {
        if (typeof Float32Array !== "undefined") (function() {
          var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
          function writeFloat_f32_cpy(val, buf, pos) {
            f32[0] = val;
            buf[pos] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
          }
          function writeFloat_f32_rev(val, buf, pos) {
            f32[0] = val;
            buf[pos] = f8b[3];
            buf[pos + 1] = f8b[2];
            buf[pos + 2] = f8b[1];
            buf[pos + 3] = f8b[0];
          }
          exports3.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
          exports3.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
          function readFloat_f32_cpy(buf, pos) {
            f8b[0] = buf[pos];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            return f32[0];
          }
          function readFloat_f32_rev(buf, pos) {
            f8b[3] = buf[pos];
            f8b[2] = buf[pos + 1];
            f8b[1] = buf[pos + 2];
            f8b[0] = buf[pos + 3];
            return f32[0];
          }
          exports3.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
          exports3.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
        })();
        else (function() {
          function writeFloat_ieee754(writeUint, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
              val = -val;
            if (val === 0)
              writeUint(1 / val > 0 ? (
                /* positive */
                0
              ) : (
                /* negative 0 */
                2147483648
              ), buf, pos);
            else if (isNaN(val))
              writeUint(2143289344, buf, pos);
            else if (val > 34028234663852886e22)
              writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
            else if (val < 11754943508222875e-54)
              writeUint((sign << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf, pos);
            else {
              var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
              writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
            }
          }
          exports3.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
          exports3.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
          function readFloat_ieee754(readUint, buf, pos) {
            var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
            return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
          }
          exports3.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
          exports3.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
        })();
        if (typeof Float64Array !== "undefined") (function() {
          var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
          function writeDouble_f64_cpy(val, buf, pos) {
            f64[0] = val;
            buf[pos] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
            buf[pos + 4] = f8b[4];
            buf[pos + 5] = f8b[5];
            buf[pos + 6] = f8b[6];
            buf[pos + 7] = f8b[7];
          }
          function writeDouble_f64_rev(val, buf, pos) {
            f64[0] = val;
            buf[pos] = f8b[7];
            buf[pos + 1] = f8b[6];
            buf[pos + 2] = f8b[5];
            buf[pos + 3] = f8b[4];
            buf[pos + 4] = f8b[3];
            buf[pos + 5] = f8b[2];
            buf[pos + 6] = f8b[1];
            buf[pos + 7] = f8b[0];
          }
          exports3.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
          exports3.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
          function readDouble_f64_cpy(buf, pos) {
            f8b[0] = buf[pos];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            f8b[4] = buf[pos + 4];
            f8b[5] = buf[pos + 5];
            f8b[6] = buf[pos + 6];
            f8b[7] = buf[pos + 7];
            return f64[0];
          }
          function readDouble_f64_rev(buf, pos) {
            f8b[7] = buf[pos];
            f8b[6] = buf[pos + 1];
            f8b[5] = buf[pos + 2];
            f8b[4] = buf[pos + 3];
            f8b[3] = buf[pos + 4];
            f8b[2] = buf[pos + 5];
            f8b[1] = buf[pos + 6];
            f8b[0] = buf[pos + 7];
            return f64[0];
          }
          exports3.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
          exports3.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
        })();
        else (function() {
          function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
              val = -val;
            if (val === 0) {
              writeUint(0, buf, pos + off0);
              writeUint(1 / val > 0 ? (
                /* positive */
                0
              ) : (
                /* negative 0 */
                2147483648
              ), buf, pos + off1);
            } else if (isNaN(val)) {
              writeUint(0, buf, pos + off0);
              writeUint(2146959360, buf, pos + off1);
            } else if (val > 17976931348623157e292) {
              writeUint(0, buf, pos + off0);
              writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
            } else {
              var mantissa;
              if (val < 22250738585072014e-324) {
                mantissa = val / 5e-324;
                writeUint(mantissa >>> 0, buf, pos + off0);
                writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
              } else {
                var exponent = Math.floor(Math.log(val) / Math.LN2);
                if (exponent === 1024)
                  exponent = 1023;
                mantissa = val * Math.pow(2, -exponent);
                writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
              }
            }
          }
          exports3.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
          exports3.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
          function readDouble_ieee754(readUint, off0, off1, buf, pos) {
            var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
            var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
            return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
          }
          exports3.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
          exports3.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
        })();
        return exports3;
      }
      function writeUintLE(val, buf, pos) {
        buf[pos] = val & 255;
        buf[pos + 1] = val >>> 8 & 255;
        buf[pos + 2] = val >>> 16 & 255;
        buf[pos + 3] = val >>> 24;
      }
      function writeUintBE(val, buf, pos) {
        buf[pos] = val >>> 24;
        buf[pos + 1] = val >>> 16 & 255;
        buf[pos + 2] = val >>> 8 & 255;
        buf[pos + 3] = val & 255;
      }
      function readUintLE(buf, pos) {
        return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
      }
      function readUintBE(buf, pos) {
        return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
      }
    }
  });

  // node_modules/protobufjs/src/util/utf8.js
  var require_utf8 = __commonJS({
    "node_modules/protobufjs/src/util/utf8.js"(exports2) {
      "use strict";
      var utf8 = exports2;
      var looseDecoder = new TextDecoder("utf-8", { ignoreBOM: true });
      var strictDecoder;
      var TEXT_DECODER_MIN_LENGTH = 64;
      try {
        strictDecoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
      } catch (err) {
        strictDecoder = looseDecoder;
      }
      utf8.length = function utf8_length(string) {
        var len = 0, c = 0;
        for (var i = 0; i < string.length; ++i) {
          c = string.charCodeAt(i);
          if (c < 128)
            len += 1;
          else if (c < 2048)
            len += 2;
          else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
            ++i;
            len += 4;
          } else
            len += 3;
        }
        return len;
      };
      function utf8_read_decoder(decoder, buffer, start, end) {
        var source = start === 0 && end === buffer.length ? buffer : buffer.subarray(start, end);
        return decoder.decode(source);
      }
      utf8.read = function utf8_read_loose(buffer, start, end) {
        if (end - start < 1)
          return "";
        if (end - start >= TEXT_DECODER_MIN_LENGTH)
          return utf8_read_decoder(looseDecoder, buffer, start, end);
        var str = "", i = start, c1, c2, c3, c4, c5, c6, c7, c8;
        for (; i + 7 < end; i += 8) {
          c1 = buffer[i];
          c2 = buffer[i + 1];
          c3 = buffer[i + 2];
          c4 = buffer[i + 3];
          c5 = buffer[i + 4];
          c6 = buffer[i + 5];
          c7 = buffer[i + 6];
          c8 = buffer[i + 7];
          if ((c1 | c2 | c3 | c4 | c5 | c6 | c7 | c8) & 128)
            return str + utf8_read_decoder(looseDecoder, buffer, i, end);
          str += String.fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8);
        }
        for (; i < end; ++i) {
          c1 = buffer[i];
          if (c1 & 128)
            return str + utf8_read_decoder(looseDecoder, buffer, i, end);
          str += String.fromCharCode(c1);
        }
        return str;
      };
      utf8.readStrict = function utf8_read_strict(buffer, start, end) {
        if (end - start < 1)
          return "";
        if (end - start >= TEXT_DECODER_MIN_LENGTH)
          return utf8_read_decoder(strictDecoder, buffer, start, end);
        var str = "", i = start, c1, c2, c3, c4, c5, c6, c7, c8;
        for (; i + 7 < end; i += 8) {
          c1 = buffer[i];
          c2 = buffer[i + 1];
          c3 = buffer[i + 2];
          c4 = buffer[i + 3];
          c5 = buffer[i + 4];
          c6 = buffer[i + 5];
          c7 = buffer[i + 6];
          c8 = buffer[i + 7];
          if ((c1 | c2 | c3 | c4 | c5 | c6 | c7 | c8) & 128)
            return str + utf8_read_decoder(strictDecoder, buffer, i, end);
          str += String.fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8);
        }
        for (; i < end; ++i) {
          c1 = buffer[i];
          if (c1 & 128)
            return str + utf8_read_decoder(strictDecoder, buffer, i, end);
          str += String.fromCharCode(c1);
        }
        return str;
      };
      utf8.write = function utf8_write(string, buffer, offset) {
        var start = offset, c1, c2;
        for (var i = 0; i < string.length; ++i) {
          c1 = string.charCodeAt(i);
          if (c1 < 128) {
            buffer[offset++] = c1;
          } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6 | 192;
            buffer[offset++] = c1 & 63 | 128;
          } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
            c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
            ++i;
            buffer[offset++] = c1 >> 18 | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6 & 63 | 128;
            buffer[offset++] = c1 & 63 | 128;
          } else {
            buffer[offset++] = c1 >> 12 | 224;
            buffer[offset++] = c1 >> 6 & 63 | 128;
            buffer[offset++] = c1 & 63 | 128;
          }
        }
        return offset - start;
      };
    }
  });

  // node_modules/protobufjs/src/util/pool.js
  var require_pool = __commonJS({
    "node_modules/protobufjs/src/util/pool.js"(exports2, module2) {
      "use strict";
      module2.exports = pool;
      function pool(alloc, slice, size) {
        var SIZE = size || 8192;
        var MAX = SIZE >>> 1;
        var slab = null;
        var offset = SIZE;
        return function pool_alloc(size2) {
          if (size2 < 1 || size2 > MAX)
            return alloc(size2);
          if (offset + size2 > SIZE) {
            slab = alloc(SIZE);
            offset = 0;
          }
          var buf = slice.call(slab, offset, offset += size2);
          if (offset & 7)
            offset = (offset | 7) + 1;
          return buf;
        };
      }
    }
  });

  // node_modules/protobufjs/src/util/longbits.js
  var require_longbits = __commonJS({
    "node_modules/protobufjs/src/util/longbits.js"(exports2, module2) {
      "use strict";
      module2.exports = LongBits;
      var Long;
      function LongBits(lo, hi) {
        this.lo = lo >>> 0;
        this.hi = hi >>> 0;
      }
      var zero = LongBits.zero = new LongBits(0, 0);
      zero.toNumber = function() {
        return 0;
      };
      zero.zzEncode = zero.zzDecode = function() {
        return this;
      };
      zero.length = function() {
        return 1;
      };
      var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
      LongBits.fromNumber = function fromNumber(value) {
        if (value === 0)
          return zero;
        var sign = value < 0;
        if (sign)
          value = -value;
        var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
        if (sign) {
          hi = ~hi >>> 0;
          lo = ~lo >>> 0;
          if (++lo > 4294967295) {
            lo = 0;
            if (++hi > 4294967295)
              hi = 0;
          }
        }
        return new LongBits(lo, hi);
      };
      LongBits.from = function from(value) {
        if (typeof value === "number")
          return LongBits.fromNumber(value);
        if (typeof value === "string" || value instanceof String) {
          if (Long)
            value = Long.fromString(value);
          else
            return LongBits.fromNumber(parseInt(value, 10));
        }
        return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
      };
      LongBits.prototype.toNumber = function toNumber(unsigned) {
        if (!unsigned && this.hi >>> 31) {
          var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
          if (!lo)
            hi = hi + 1 >>> 0;
          return -(lo + hi * 4294967296);
        }
        return this.lo + this.hi * 4294967296;
      };
      LongBits.prototype.toLong = function toLong(unsigned) {
        return Long ? new Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
      };
      var charCodeAt = String.prototype.charCodeAt;
      LongBits.fromHash = function fromHash(hash) {
        if (hash === zeroHash)
          return zero;
        return new LongBits(
          (charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0,
          (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0
        );
      };
      LongBits.prototype.toHash = function toHash() {
        return String.fromCharCode(
          this.lo & 255,
          this.lo >>> 8 & 255,
          this.lo >>> 16 & 255,
          this.lo >>> 24,
          this.hi & 255,
          this.hi >>> 8 & 255,
          this.hi >>> 16 & 255,
          this.hi >>> 24
        );
      };
      LongBits.prototype.zzEncode = function zzEncode() {
        var mask = this.hi >> 31;
        this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
        this.lo = (this.lo << 1 ^ mask) >>> 0;
        return this;
      };
      LongBits.prototype.zzDecode = function zzDecode() {
        var mask = -(this.lo & 1);
        this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
        this.hi = (this.hi >>> 1 ^ mask) >>> 0;
        return this;
      };
      LongBits.prototype.length = function length() {
        var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
        return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
      };
      LongBits._configure = function(Long_) {
        Long = Long_;
      };
    }
  });

  // node_modules/long/umd/index.js
  var require_umd = __commonJS({
    "node_modules/long/umd/index.js"(exports2, module2) {
      (function(global2, factory) {
        function preferDefault(exports3) {
          return exports3.default || exports3;
        }
        if (typeof define === "function" && define.amd) {
          define([], function() {
            var exports3 = {};
            factory(exports3);
            return preferDefault(exports3);
          });
        } else if (typeof exports2 === "object") {
          factory(exports2);
          if (typeof module2 === "object") module2.exports = preferDefault(exports2);
        } else {
          (function() {
            var exports3 = {};
            factory(exports3);
            global2.Long = preferDefault(exports3);
          })();
        }
      })(
        typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports2,
        function(_exports) {
          "use strict";
          Object.defineProperty(_exports, "__esModule", {
            value: true
          });
          _exports.default = void 0;
          var wasm = null;
          try {
            wasm = new WebAssembly.Instance(
              new WebAssembly.Module(
                new Uint8Array([
                  // \0asm
                  0,
                  97,
                  115,
                  109,
                  // version 1
                  1,
                  0,
                  0,
                  0,
                  // section "type"
                  1,
                  13,
                  2,
                  // 0, () => i32
                  96,
                  0,
                  1,
                  127,
                  // 1, (i32, i32, i32, i32) => i32
                  96,
                  4,
                  127,
                  127,
                  127,
                  127,
                  1,
                  127,
                  // section "function"
                  3,
                  7,
                  6,
                  // 0, type 0
                  0,
                  // 1, type 1
                  1,
                  // 2, type 1
                  1,
                  // 3, type 1
                  1,
                  // 4, type 1
                  1,
                  // 5, type 1
                  1,
                  // section "global"
                  6,
                  6,
                  1,
                  // 0, "high", mutable i32
                  127,
                  1,
                  65,
                  0,
                  11,
                  // section "export"
                  7,
                  50,
                  6,
                  // 0, "mul"
                  3,
                  109,
                  117,
                  108,
                  0,
                  1,
                  // 1, "div_s"
                  5,
                  100,
                  105,
                  118,
                  95,
                  115,
                  0,
                  2,
                  // 2, "div_u"
                  5,
                  100,
                  105,
                  118,
                  95,
                  117,
                  0,
                  3,
                  // 3, "rem_s"
                  5,
                  114,
                  101,
                  109,
                  95,
                  115,
                  0,
                  4,
                  // 4, "rem_u"
                  5,
                  114,
                  101,
                  109,
                  95,
                  117,
                  0,
                  5,
                  // 5, "get_high"
                  8,
                  103,
                  101,
                  116,
                  95,
                  104,
                  105,
                  103,
                  104,
                  0,
                  0,
                  // section "code"
                  10,
                  191,
                  1,
                  6,
                  // 0, "get_high"
                  4,
                  0,
                  35,
                  0,
                  11,
                  // 1, "mul"
                  36,
                  1,
                  1,
                  126,
                  32,
                  0,
                  173,
                  32,
                  1,
                  173,
                  66,
                  32,
                  134,
                  132,
                  32,
                  2,
                  173,
                  32,
                  3,
                  173,
                  66,
                  32,
                  134,
                  132,
                  126,
                  34,
                  4,
                  66,
                  32,
                  135,
                  167,
                  36,
                  0,
                  32,
                  4,
                  167,
                  11,
                  // 2, "div_s"
                  36,
                  1,
                  1,
                  126,
                  32,
                  0,
                  173,
                  32,
                  1,
                  173,
                  66,
                  32,
                  134,
                  132,
                  32,
                  2,
                  173,
                  32,
                  3,
                  173,
                  66,
                  32,
                  134,
                  132,
                  127,
                  34,
                  4,
                  66,
                  32,
                  135,
                  167,
                  36,
                  0,
                  32,
                  4,
                  167,
                  11,
                  // 3, "div_u"
                  36,
                  1,
                  1,
                  126,
                  32,
                  0,
                  173,
                  32,
                  1,
                  173,
                  66,
                  32,
                  134,
                  132,
                  32,
                  2,
                  173,
                  32,
                  3,
                  173,
                  66,
                  32,
                  134,
                  132,
                  128,
                  34,
                  4,
                  66,
                  32,
                  135,
                  167,
                  36,
                  0,
                  32,
                  4,
                  167,
                  11,
                  // 4, "rem_s"
                  36,
                  1,
                  1,
                  126,
                  32,
                  0,
                  173,
                  32,
                  1,
                  173,
                  66,
                  32,
                  134,
                  132,
                  32,
                  2,
                  173,
                  32,
                  3,
                  173,
                  66,
                  32,
                  134,
                  132,
                  129,
                  34,
                  4,
                  66,
                  32,
                  135,
                  167,
                  36,
                  0,
                  32,
                  4,
                  167,
                  11,
                  // 5, "rem_u"
                  36,
                  1,
                  1,
                  126,
                  32,
                  0,
                  173,
                  32,
                  1,
                  173,
                  66,
                  32,
                  134,
                  132,
                  32,
                  2,
                  173,
                  32,
                  3,
                  173,
                  66,
                  32,
                  134,
                  132,
                  130,
                  34,
                  4,
                  66,
                  32,
                  135,
                  167,
                  36,
                  0,
                  32,
                  4,
                  167,
                  11
                ])
              ),
              {}
            ).exports;
          } catch (e) {
          }
          function Long(low, high, unsigned) {
            this.low = low | 0;
            this.high = high | 0;
            this.unsigned = !!unsigned;
          }
          Long.prototype.__isLong__;
          Object.defineProperty(Long.prototype, "__isLong__", {
            value: true
          });
          function isLong(obj) {
            return (obj && obj["__isLong__"]) === true;
          }
          function ctz32(value) {
            var c = Math.clz32(value & -value);
            return value ? 31 - c : c;
          }
          Long.isLong = isLong;
          var INT_CACHE = {};
          var UINT_CACHE = {};
          function fromInt(value, unsigned) {
            var obj, cachedObj, cache;
            if (unsigned) {
              value >>>= 0;
              if (cache = 0 <= value && value < 256) {
                cachedObj = UINT_CACHE[value];
                if (cachedObj) return cachedObj;
              }
              obj = fromBits(value, 0, true);
              if (cache) UINT_CACHE[value] = obj;
              return obj;
            } else {
              value |= 0;
              if (cache = -128 <= value && value < 128) {
                cachedObj = INT_CACHE[value];
                if (cachedObj) return cachedObj;
              }
              obj = fromBits(value, value < 0 ? -1 : 0, false);
              if (cache) INT_CACHE[value] = obj;
              return obj;
            }
          }
          Long.fromInt = fromInt;
          function fromNumber(value, unsigned) {
            if (isNaN(value)) return unsigned ? UZERO : ZERO;
            if (unsigned) {
              if (value < 0) return UZERO;
              if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
            } else {
              if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
              if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
            }
            if (value < 0) return fromNumber(-value, unsigned).neg();
            return fromBits(
              value % TWO_PWR_32_DBL | 0,
              value / TWO_PWR_32_DBL | 0,
              unsigned
            );
          }
          Long.fromNumber = fromNumber;
          function fromBits(lowBits, highBits, unsigned) {
            return new Long(lowBits, highBits, unsigned);
          }
          Long.fromBits = fromBits;
          var pow_dbl = Math.pow;
          function fromString(str, unsigned, radix) {
            if (str.length === 0) throw Error("empty string");
            if (typeof unsigned === "number") {
              radix = unsigned;
              unsigned = false;
            } else {
              unsigned = !!unsigned;
            }
            if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
              return unsigned ? UZERO : ZERO;
            radix = radix || 10;
            if (radix < 2 || 36 < radix) throw RangeError("radix");
            var p;
            if ((p = str.indexOf("-")) > 0) throw Error("interior hyphen");
            else if (p === 0) {
              return fromString(str.substring(1), unsigned, radix).neg();
            }
            var radixToPower = fromNumber(pow_dbl(radix, 8));
            var result = ZERO;
            for (var i = 0; i < str.length; i += 8) {
              var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
              if (size < 8) {
                var power = fromNumber(pow_dbl(radix, size));
                result = result.mul(power).add(fromNumber(value));
              } else {
                result = result.mul(radixToPower);
                result = result.add(fromNumber(value));
              }
            }
            result.unsigned = unsigned;
            return result;
          }
          Long.fromString = fromString;
          function fromValue(val, unsigned) {
            if (typeof val === "number") return fromNumber(val, unsigned);
            if (typeof val === "string") return fromString(val, unsigned);
            return fromBits(
              val.low,
              val.high,
              typeof unsigned === "boolean" ? unsigned : val.unsigned
            );
          }
          Long.fromValue = fromValue;
          var TWO_PWR_16_DBL = 1 << 16;
          var TWO_PWR_24_DBL = 1 << 24;
          var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
          var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
          var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
          var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
          var ZERO = fromInt(0);
          Long.ZERO = ZERO;
          var UZERO = fromInt(0, true);
          Long.UZERO = UZERO;
          var ONE = fromInt(1);
          Long.ONE = ONE;
          var UONE = fromInt(1, true);
          Long.UONE = UONE;
          var NEG_ONE = fromInt(-1);
          Long.NEG_ONE = NEG_ONE;
          var MAX_VALUE = fromBits(4294967295 | 0, 2147483647 | 0, false);
          Long.MAX_VALUE = MAX_VALUE;
          var MAX_UNSIGNED_VALUE = fromBits(4294967295 | 0, 4294967295 | 0, true);
          Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
          var MIN_VALUE = fromBits(0, 2147483648 | 0, false);
          Long.MIN_VALUE = MIN_VALUE;
          var LongPrototype = Long.prototype;
          LongPrototype.toInt = function toInt() {
            return this.unsigned ? this.low >>> 0 : this.low;
          };
          LongPrototype.toNumber = function toNumber() {
            if (this.unsigned)
              return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
            return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
          };
          LongPrototype.toString = function toString(radix) {
            radix = radix || 10;
            if (radix < 2 || 36 < radix) throw RangeError("radix");
            if (this.isZero()) return "0";
            if (this.isNegative()) {
              if (this.eq(MIN_VALUE)) {
                var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
                return div.toString(radix) + rem1.toInt().toString(radix);
              } else return "-" + this.neg().toString(radix);
            }
            var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
            var result = "";
            while (true) {
              var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
              rem = remDiv;
              if (rem.isZero()) return digits + result;
              else {
                while (digits.length < 6) digits = "0" + digits;
                result = "" + digits + result;
              }
            }
          };
          LongPrototype.getHighBits = function getHighBits() {
            return this.high;
          };
          LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
            return this.high >>> 0;
          };
          LongPrototype.getLowBits = function getLowBits() {
            return this.low;
          };
          LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
            return this.low >>> 0;
          };
          LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
            if (this.isNegative())
              return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
            var val = this.high != 0 ? this.high : this.low;
            for (var bit = 31; bit > 0; bit--) if ((val & 1 << bit) != 0) break;
            return this.high != 0 ? bit + 33 : bit + 1;
          };
          LongPrototype.isSafeInteger = function isSafeInteger() {
            var top11Bits = this.high >> 21;
            if (!top11Bits) return true;
            if (this.unsigned) return false;
            return top11Bits === -1 && !(this.low === 0 && this.high === -2097152);
          };
          LongPrototype.isZero = function isZero() {
            return this.high === 0 && this.low === 0;
          };
          LongPrototype.eqz = LongPrototype.isZero;
          LongPrototype.isNegative = function isNegative() {
            return !this.unsigned && this.high < 0;
          };
          LongPrototype.isPositive = function isPositive() {
            return this.unsigned || this.high >= 0;
          };
          LongPrototype.isOdd = function isOdd() {
            return (this.low & 1) === 1;
          };
          LongPrototype.isEven = function isEven() {
            return (this.low & 1) === 0;
          };
          LongPrototype.equals = function equals(other) {
            if (!isLong(other)) other = fromValue(other);
            if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
              return false;
            return this.high === other.high && this.low === other.low;
          };
          LongPrototype.eq = LongPrototype.equals;
          LongPrototype.notEquals = function notEquals(other) {
            return !this.eq(
              /* validates */
              other
            );
          };
          LongPrototype.neq = LongPrototype.notEquals;
          LongPrototype.ne = LongPrototype.notEquals;
          LongPrototype.lessThan = function lessThan(other) {
            return this.comp(
              /* validates */
              other
            ) < 0;
          };
          LongPrototype.lt = LongPrototype.lessThan;
          LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
            return this.comp(
              /* validates */
              other
            ) <= 0;
          };
          LongPrototype.lte = LongPrototype.lessThanOrEqual;
          LongPrototype.le = LongPrototype.lessThanOrEqual;
          LongPrototype.greaterThan = function greaterThan(other) {
            return this.comp(
              /* validates */
              other
            ) > 0;
          };
          LongPrototype.gt = LongPrototype.greaterThan;
          LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
            return this.comp(
              /* validates */
              other
            ) >= 0;
          };
          LongPrototype.gte = LongPrototype.greaterThanOrEqual;
          LongPrototype.ge = LongPrototype.greaterThanOrEqual;
          LongPrototype.compare = function compare(other) {
            if (!isLong(other)) other = fromValue(other);
            if (this.eq(other)) return 0;
            var thisNeg = this.isNegative(), otherNeg = other.isNegative();
            if (thisNeg && !otherNeg) return -1;
            if (!thisNeg && otherNeg) return 1;
            if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1;
            return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
          };
          LongPrototype.comp = LongPrototype.compare;
          LongPrototype.negate = function negate() {
            if (!this.unsigned && this.eq(MIN_VALUE)) return MIN_VALUE;
            return this.not().add(ONE);
          };
          LongPrototype.neg = LongPrototype.negate;
          LongPrototype.add = function add(addend) {
            if (!isLong(addend)) addend = fromValue(addend);
            var a48 = this.high >>> 16;
            var a32 = this.high & 65535;
            var a16 = this.low >>> 16;
            var a00 = this.low & 65535;
            var b48 = addend.high >>> 16;
            var b32 = addend.high & 65535;
            var b16 = addend.low >>> 16;
            var b00 = addend.low & 65535;
            var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
            c00 += a00 + b00;
            c16 += c00 >>> 16;
            c00 &= 65535;
            c16 += a16 + b16;
            c32 += c16 >>> 16;
            c16 &= 65535;
            c32 += a32 + b32;
            c48 += c32 >>> 16;
            c32 &= 65535;
            c48 += a48 + b48;
            c48 &= 65535;
            return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
          };
          LongPrototype.subtract = function subtract(subtrahend) {
            if (!isLong(subtrahend)) subtrahend = fromValue(subtrahend);
            return this.add(subtrahend.neg());
          };
          LongPrototype.sub = LongPrototype.subtract;
          LongPrototype.multiply = function multiply(multiplier) {
            if (this.isZero()) return this;
            if (!isLong(multiplier)) multiplier = fromValue(multiplier);
            if (wasm) {
              var low = wasm["mul"](
                this.low,
                this.high,
                multiplier.low,
                multiplier.high
              );
              return fromBits(low, wasm["get_high"](), this.unsigned);
            }
            if (multiplier.isZero()) return this.unsigned ? UZERO : ZERO;
            if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
            if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
            if (this.isNegative()) {
              if (multiplier.isNegative()) return this.neg().mul(multiplier.neg());
              else return this.neg().mul(multiplier).neg();
            } else if (multiplier.isNegative())
              return this.mul(multiplier.neg()).neg();
            if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
              return fromNumber(
                this.toNumber() * multiplier.toNumber(),
                this.unsigned
              );
            var a48 = this.high >>> 16;
            var a32 = this.high & 65535;
            var a16 = this.low >>> 16;
            var a00 = this.low & 65535;
            var b48 = multiplier.high >>> 16;
            var b32 = multiplier.high & 65535;
            var b16 = multiplier.low >>> 16;
            var b00 = multiplier.low & 65535;
            var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
            c00 += a00 * b00;
            c16 += c00 >>> 16;
            c00 &= 65535;
            c16 += a16 * b00;
            c32 += c16 >>> 16;
            c16 &= 65535;
            c16 += a00 * b16;
            c32 += c16 >>> 16;
            c16 &= 65535;
            c32 += a32 * b00;
            c48 += c32 >>> 16;
            c32 &= 65535;
            c32 += a16 * b16;
            c48 += c32 >>> 16;
            c32 &= 65535;
            c32 += a00 * b32;
            c48 += c32 >>> 16;
            c32 &= 65535;
            c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
            c48 &= 65535;
            return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
          };
          LongPrototype.mul = LongPrototype.multiply;
          LongPrototype.divide = function divide(divisor) {
            if (!isLong(divisor)) divisor = fromValue(divisor);
            if (divisor.isZero()) throw Error("division by zero");
            if (wasm) {
              if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
                return this;
              }
              var low = (this.unsigned ? wasm["div_u"] : wasm["div_s"])(
                this.low,
                this.high,
                divisor.low,
                divisor.high
              );
              return fromBits(low, wasm["get_high"](), this.unsigned);
            }
            if (this.isZero()) return this.unsigned ? UZERO : ZERO;
            var approx, rem, res;
            if (!this.unsigned) {
              if (this.eq(MIN_VALUE)) {
                if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                  return MIN_VALUE;
                else if (divisor.eq(MIN_VALUE)) return ONE;
                else {
                  var halfThis = this.shr(1);
                  approx = halfThis.div(divisor).shl(1);
                  if (approx.eq(ZERO)) {
                    return divisor.isNegative() ? ONE : NEG_ONE;
                  } else {
                    rem = this.sub(divisor.mul(approx));
                    res = approx.add(rem.div(divisor));
                    return res;
                  }
                }
              } else if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
              if (this.isNegative()) {
                if (divisor.isNegative()) return this.neg().div(divisor.neg());
                return this.neg().div(divisor).neg();
              } else if (divisor.isNegative()) return this.div(divisor.neg()).neg();
              res = ZERO;
            } else {
              if (!divisor.unsigned) divisor = divisor.toUnsigned();
              if (divisor.gt(this)) return UZERO;
              if (divisor.gt(this.shru(1)))
                return UONE;
              res = UZERO;
            }
            rem = this;
            while (rem.gte(divisor)) {
              approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
              var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
              while (approxRem.isNegative() || approxRem.gt(rem)) {
                approx -= delta;
                approxRes = fromNumber(approx, this.unsigned);
                approxRem = approxRes.mul(divisor);
              }
              if (approxRes.isZero()) approxRes = ONE;
              res = res.add(approxRes);
              rem = rem.sub(approxRem);
            }
            return res;
          };
          LongPrototype.div = LongPrototype.divide;
          LongPrototype.modulo = function modulo(divisor) {
            if (!isLong(divisor)) divisor = fromValue(divisor);
            if (wasm) {
              var low = (this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(
                this.low,
                this.high,
                divisor.low,
                divisor.high
              );
              return fromBits(low, wasm["get_high"](), this.unsigned);
            }
            return this.sub(this.div(divisor).mul(divisor));
          };
          LongPrototype.mod = LongPrototype.modulo;
          LongPrototype.rem = LongPrototype.modulo;
          LongPrototype.not = function not() {
            return fromBits(~this.low, ~this.high, this.unsigned);
          };
          LongPrototype.countLeadingZeros = function countLeadingZeros() {
            return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
          };
          LongPrototype.clz = LongPrototype.countLeadingZeros;
          LongPrototype.countTrailingZeros = function countTrailingZeros() {
            return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
          };
          LongPrototype.ctz = LongPrototype.countTrailingZeros;
          LongPrototype.and = function and(other) {
            if (!isLong(other)) other = fromValue(other);
            return fromBits(
              this.low & other.low,
              this.high & other.high,
              this.unsigned
            );
          };
          LongPrototype.or = function or(other) {
            if (!isLong(other)) other = fromValue(other);
            return fromBits(
              this.low | other.low,
              this.high | other.high,
              this.unsigned
            );
          };
          LongPrototype.xor = function xor(other) {
            if (!isLong(other)) other = fromValue(other);
            return fromBits(
              this.low ^ other.low,
              this.high ^ other.high,
              this.unsigned
            );
          };
          LongPrototype.shiftLeft = function shiftLeft(numBits) {
            if (isLong(numBits)) numBits = numBits.toInt();
            if ((numBits &= 63) === 0) return this;
            else if (numBits < 32)
              return fromBits(
                this.low << numBits,
                this.high << numBits | this.low >>> 32 - numBits,
                this.unsigned
              );
            else return fromBits(0, this.low << numBits - 32, this.unsigned);
          };
          LongPrototype.shl = LongPrototype.shiftLeft;
          LongPrototype.shiftRight = function shiftRight(numBits) {
            if (isLong(numBits)) numBits = numBits.toInt();
            if ((numBits &= 63) === 0) return this;
            else if (numBits < 32)
              return fromBits(
                this.low >>> numBits | this.high << 32 - numBits,
                this.high >> numBits,
                this.unsigned
              );
            else
              return fromBits(
                this.high >> numBits - 32,
                this.high >= 0 ? 0 : -1,
                this.unsigned
              );
          };
          LongPrototype.shr = LongPrototype.shiftRight;
          LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
            if (isLong(numBits)) numBits = numBits.toInt();
            if ((numBits &= 63) === 0) return this;
            if (numBits < 32)
              return fromBits(
                this.low >>> numBits | this.high << 32 - numBits,
                this.high >>> numBits,
                this.unsigned
              );
            if (numBits === 32) return fromBits(this.high, 0, this.unsigned);
            return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
          };
          LongPrototype.shru = LongPrototype.shiftRightUnsigned;
          LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
          LongPrototype.rotateLeft = function rotateLeft(numBits) {
            var b;
            if (isLong(numBits)) numBits = numBits.toInt();
            if ((numBits &= 63) === 0) return this;
            if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
            if (numBits < 32) {
              b = 32 - numBits;
              return fromBits(
                this.low << numBits | this.high >>> b,
                this.high << numBits | this.low >>> b,
                this.unsigned
              );
            }
            numBits -= 32;
            b = 32 - numBits;
            return fromBits(
              this.high << numBits | this.low >>> b,
              this.low << numBits | this.high >>> b,
              this.unsigned
            );
          };
          LongPrototype.rotl = LongPrototype.rotateLeft;
          LongPrototype.rotateRight = function rotateRight(numBits) {
            var b;
            if (isLong(numBits)) numBits = numBits.toInt();
            if ((numBits &= 63) === 0) return this;
            if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
            if (numBits < 32) {
              b = 32 - numBits;
              return fromBits(
                this.high << b | this.low >>> numBits,
                this.low << b | this.high >>> numBits,
                this.unsigned
              );
            }
            numBits -= 32;
            b = 32 - numBits;
            return fromBits(
              this.low << b | this.high >>> numBits,
              this.high << b | this.low >>> numBits,
              this.unsigned
            );
          };
          LongPrototype.rotr = LongPrototype.rotateRight;
          LongPrototype.toSigned = function toSigned() {
            if (!this.unsigned) return this;
            return fromBits(this.low, this.high, false);
          };
          LongPrototype.toUnsigned = function toUnsigned() {
            if (this.unsigned) return this;
            return fromBits(this.low, this.high, true);
          };
          LongPrototype.toBytes = function toBytes(le) {
            return le ? this.toBytesLE() : this.toBytesBE();
          };
          LongPrototype.toBytesLE = function toBytesLE() {
            var hi = this.high, lo = this.low;
            return [
              lo & 255,
              lo >>> 8 & 255,
              lo >>> 16 & 255,
              lo >>> 24,
              hi & 255,
              hi >>> 8 & 255,
              hi >>> 16 & 255,
              hi >>> 24
            ];
          };
          LongPrototype.toBytesBE = function toBytesBE() {
            var hi = this.high, lo = this.low;
            return [
              hi >>> 24,
              hi >>> 16 & 255,
              hi >>> 8 & 255,
              hi & 255,
              lo >>> 24,
              lo >>> 16 & 255,
              lo >>> 8 & 255,
              lo & 255
            ];
          };
          Long.fromBytes = function fromBytes(bytes, unsigned, le) {
            return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
          };
          Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
            return new Long(
              bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24,
              bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24,
              unsigned
            );
          };
          Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
            return new Long(
              bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7],
              bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3],
              unsigned
            );
          };
          if (typeof BigInt === "function") {
            Long.fromBigInt = function fromBigInt(value, unsigned) {
              var lowBits = Number(BigInt.asIntN(32, value));
              var highBits = Number(BigInt.asIntN(32, value >> BigInt(32)));
              return fromBits(lowBits, highBits, unsigned);
            };
            Long.fromValue = function fromValueWithBigInt(value, unsigned) {
              if (typeof value === "bigint") return Long.fromBigInt(value, unsigned);
              return fromValue(value, unsigned);
            };
            LongPrototype.toBigInt = function toBigInt() {
              var lowBigInt = BigInt(this.low >>> 0);
              var highBigInt = BigInt(this.unsigned ? this.high >>> 0 : this.high);
              return highBigInt << BigInt(32) | lowBigInt;
            };
          }
          var _default = _exports.default = Long;
        }
      );
    }
  });

  // node_modules/protobufjs/src/util/minimal.js
  var require_minimal = __commonJS({
    "node_modules/protobufjs/src/util/minimal.js"(exports2) {
      "use strict";
      var util = exports2;
      util.asPromise = require_aspromise();
      util.base64 = require_base64();
      util.EventEmitter = require_eventemitter();
      util.float = require_float();
      util.utf8 = require_utf8();
      util.pool = require_pool();
      util.LongBits = require_longbits();
      function isUnsafeProperty(key) {
        return key === "__proto__" || key === "prototype" || key === "constructor";
      }
      util.isUnsafeProperty = isUnsafeProperty;
      util.isNode = Boolean(typeof global !== "undefined" && global && global.process && global.process.versions && global.process.versions.node);
      util.global = util.isNode && global || typeof window !== "undefined" && window || typeof self !== "undefined" && self || typeof globalThis !== "undefined" && globalThis || exports2;
      util.emptyArray = Object.freeze ? Object.freeze([]) : (
        /* istanbul ignore next */
        []
      );
      util.emptyObject = Object.freeze ? Object.freeze({}) : (
        /* istanbul ignore next */
        {}
      );
      util.isInteger = Number.isInteger || /* istanbul ignore next */
      function isInteger(value) {
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
      };
      util.isString = function isString(value) {
        return typeof value === "string" || value instanceof String;
      };
      util.isObject = function isObject(value) {
        return value && typeof value === "object";
      };
      util.isset = /**
       * Checks if a property on a message is considered to be present.
       * @param {Object} obj Plain object or message instance
       * @param {string} prop Property name
       * @returns {boolean} `true` if considered to be present, otherwise `false`
       */
      util.isSet = function isSet(obj, prop) {
        var value = obj[prop];
        if (value != null && Object.hasOwnProperty.call(obj, prop))
          return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
        return false;
      };
      util.Buffer = (function() {
        try {
          var Buffer2 = util.global.Buffer;
          return Buffer2.prototype.utf8Write || util.isNode ? Buffer2 : (
            /* istanbul ignore next */
            null
          );
        } catch (e) {
          return null;
        }
      })();
      util.newBuffer = function newBuffer(sizeOrArray) {
        var Buffer2 = util.Buffer;
        return typeof sizeOrArray === "number" ? Buffer2 ? Buffer2.allocUnsafe(sizeOrArray) : new Uint8Array(sizeOrArray) : Buffer2 ? Buffer2.from(sizeOrArray) : new Uint8Array(sizeOrArray);
      };
      util.rawField = function rawField(id, wireType, data) {
        var out = [], tag = id << 3 | wireType;
        tag >>>= 0;
        while (tag > 127) {
          out.push(tag & 127 | 128);
          tag >>>= 7;
        }
        out.push(tag);
        for (var i = 0; i < data.length; ++i)
          out.push(data[i]);
        return util.newBuffer(out);
      };
      util.Array = Uint8Array;
      util.Long = /* istanbul ignore next */
      util.global.dcodeIO && /* istanbul ignore next */
      util.global.dcodeIO.Long || /* istanbul ignore next */
      util.global.Long || (function() {
        try {
          var Long = require_umd();
          return Long && Long.isLong ? Long : null;
        } catch (e) {
          return null;
        }
      })();
      util.key2Re = /^(?:true|false|0|1)$/;
      util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
      util.key64Re = /^(?:[\x00-\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
      util.longToHash = function longToHash(value) {
        return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
      };
      util.longFromHash = function longFromHash(hash, unsigned) {
        var bits = util.LongBits.fromHash(hash);
        if (util.Long)
          return util.Long.fromBits(bits.lo, bits.hi, unsigned);
        return bits.toNumber(Boolean(unsigned));
      };
      util.longFromKey = function longFromKey(key, unsigned) {
        return util.key64Re.test(key) && !util.key32Re.test(key) ? util.longFromHash(key, unsigned) : key;
      };
      util.boolFromKey = function boolFromKey(key) {
        return key === "true" || key === "1";
      };
      function merge(dst) {
        var ifNotSet = typeof arguments[arguments.length - 1] === "boolean", limit = ifNotSet ? arguments.length - 1 : arguments.length;
        ifNotSet = ifNotSet && arguments[arguments.length - 1];
        for (var a = 1; a < limit; ++a) {
          var src = arguments[a];
          if (!src)
            continue;
          for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
            if (!isUnsafeProperty(keys[i]) && (!ifNotSet || !Object.prototype.hasOwnProperty.call(dst, keys[i]) || dst[keys[i]] === void 0))
              dst[keys[i]] = src[keys[i]];
        }
        return dst;
      }
      util.merge = merge;
      util.nestingLimit = 32;
      util.recursionLimit = 100;
      util.makeProp = function makeProp(obj, key, enumerable) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
          return;
        Object.defineProperty(obj, key, {
          enumerable: enumerable === void 0 ? true : enumerable,
          configurable: true,
          writable: true
        });
      };
      util.lcFirst = function lcFirst(str) {
        return str.charAt(0).toLowerCase() + str.substring(1);
      };
      function newError(name) {
        function CustomError(message, properties) {
          if (!(this instanceof CustomError))
            return new CustomError(message, properties);
          Object.defineProperty(this, "message", { get: function() {
            return message;
          } });
          if (Error.captureStackTrace)
            Error.captureStackTrace(this, CustomError);
          else
            Object.defineProperty(this, "stack", { value: new Error().stack || "" });
          if (properties)
            merge(this, properties);
        }
        CustomError.prototype = Object.create(Error.prototype, {
          constructor: {
            value: CustomError,
            writable: true,
            enumerable: false,
            configurable: true
          },
          name: {
            get: function get() {
              return name;
            },
            set: void 0,
            enumerable: false,
            // configurable: false would accurately preserve the behavior of
            // the original, but I'm guessing that was not intentional.
            // For an actual error subclass, this property would
            // be configurable.
            configurable: true
          },
          toString: {
            value: function value() {
              return this.name + ": " + this.message;
            },
            writable: true,
            enumerable: false,
            configurable: true
          }
        });
        return CustomError;
      }
      util.newError = newError;
      util.ProtocolError = newError("ProtocolError");
      util.oneOfGetter = function getOneOf(fieldNames) {
        var fieldMap = {};
        for (var i = 0; i < fieldNames.length; ++i)
          fieldMap[fieldNames[i]] = 1;
        return function() {
          for (var keys = Object.keys(this), i2 = keys.length - 1; i2 > -1; --i2)
            if (fieldMap[keys[i2]] === 1 && this[keys[i2]] !== void 0 && this[keys[i2]] !== null)
              return keys[i2];
        };
      };
      util.oneOfSetter = function setOneOf(fieldNames) {
        return function(name) {
          for (var i = 0; i < fieldNames.length; ++i)
            if (fieldNames[i] !== name)
              delete this[fieldNames[i]];
        };
      };
      util.toJSONOptions = {
        longs: String,
        enums: String,
        bytes: String,
        json: true
      };
    }
  });

  // node_modules/protobufjs/src/writer.js
  var require_writer = __commonJS({
    "node_modules/protobufjs/src/writer.js"(exports2, module2) {
      "use strict";
      module2.exports = Writer;
      var util = require_minimal();
      var BufferWriter;
      var LongBits = util.LongBits;
      var base64 = util.base64;
      var utf8 = util.utf8;
      function Writer() {
        this.pos = 0;
        this.buf = this.constructor.alloc(Writer.initialBufferSize);
        this.view = null;
        this.states = null;
      }
      Writer.initialBufferSize = 128;
      Object.defineProperty(Writer.prototype, "len", {
        configurable: true,
        enumerable: true,
        get: function get_len() {
          return this.pos;
        }
      });
      var create = function create2() {
        return util.Buffer ? function create_buffer_setup() {
          return (Writer.create = function create_buffer() {
            return new BufferWriter();
          })();
        } : function create_array() {
          return new Writer();
        };
      };
      Writer.create = create();
      Writer.alloc = function alloc(size) {
        return new Uint8Array(size);
      };
      Writer.alloc = util.pool(Writer.alloc, Uint8Array.prototype.subarray);
      function sizeVarint32(value) {
        return value < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5;
      }
      Writer.prototype._reserve = function _reserve(n) {
        var need = this.pos + n;
        if (need > this.buf.length) {
          var size = this.buf.length << 1;
          if (size < need)
            size = need;
          var buf = this.constructor.alloc(size);
          buf.set(this.buf.subarray(0, this.pos), 0);
          this.buf = buf;
          this.view = null;
        }
      };
      function writeStringAscii(val, buf, pos) {
        for (var i = 0; i < val.length; )
          buf[pos++] = val.charCodeAt(i++);
      }
      function writeVarint32(val, buf, pos) {
        while (val > 127) {
          buf[pos++] = val & 127 | 128;
          val >>>= 7;
        }
        buf[pos] = val;
        return pos + 1;
      }
      Writer.prototype.uint32 = function write_uint32(value) {
        value = value >>> 0;
        this._reserve(5);
        var pos = this.pos;
        this.pos = writeVarint32(value, this.buf, pos);
        return this;
      };
      Writer.prototype.int32 = function write_int32(value) {
        if ((value |= 0) < 0) {
          this._reserve(10);
          writeVarint64(LongBits.fromNumber(value), this.buf, this.pos);
          this.pos += 10;
          return this;
        }
        return this.uint32(value);
      };
      Writer.prototype.sint32 = function write_sint32(value) {
        return this.uint32((value << 1 ^ value >> 31) >>> 0);
      };
      function writeVarint64(val, buf, pos) {
        var lo = val.lo, hi = val.hi;
        while (hi) {
          buf[pos++] = lo & 127 | 128;
          lo = (lo >>> 7 | hi << 25) >>> 0;
          hi >>>= 7;
        }
        while (lo > 127) {
          buf[pos++] = lo & 127 | 128;
          lo = lo >>> 7;
        }
        buf[pos] = lo;
        return pos + 1;
      }
      Writer.prototype.uint64 = function write_uint64(value) {
        var bits = LongBits.from(value);
        this._reserve(10);
        var pos = this.pos;
        this.pos = writeVarint64(bits, this.buf, pos);
        return this;
      };
      Writer.prototype.int64 = Writer.prototype.uint64;
      Writer.prototype.sint64 = function write_sint64(value) {
        var bits = LongBits.from(value).zzEncode();
        this._reserve(10);
        var pos = this.pos;
        this.pos = writeVarint64(bits, this.buf, pos);
        return this;
      };
      Writer.prototype.bool = function write_bool(value) {
        this._reserve(1);
        this.buf[this.pos++] = value ? 1 : 0;
        return this;
      };
      function writeFixed32(val, buf, pos) {
        buf[pos] = val & 255;
        buf[pos + 1] = val >>> 8 & 255;
        buf[pos + 2] = val >>> 16 & 255;
        buf[pos + 3] = val >>> 24;
      }
      Writer.prototype.fixed32 = function write_fixed32(value) {
        this._reserve(4);
        writeFixed32(value >>> 0, this.buf, this.pos);
        this.pos += 4;
        return this;
      };
      Writer.prototype.sfixed32 = Writer.prototype.fixed32;
      Writer.prototype.fixed64 = function write_fixed64(value) {
        var bits = LongBits.from(value);
        this._reserve(8);
        writeFixed32(bits.lo, this.buf, this.pos);
        writeFixed32(bits.hi, this.buf, this.pos + 4);
        this.pos += 8;
        return this;
      };
      Writer.prototype.sfixed64 = Writer.prototype.fixed64;
      Writer.prototype.float = function write_float(value) {
        this._reserve(4);
        util.float.writeFloatLE(value, this.buf, this.pos);
        this.pos += 4;
        return this;
      };
      Writer.prototype.double = function write_double(value) {
        this._reserve(8);
        util.float.writeDoubleLE(value, this.buf, this.pos);
        this.pos += 8;
        return this;
      };
      Writer.prototype.bytes = function write_bytes(value) {
        var len = value.length >>> 0;
        if (!len) {
          this._reserve(1);
          this.buf[this.pos++] = 0;
          return this;
        }
        if (util.isString(value)) {
          var buf = Writer.alloc(len = base64.length(value));
          base64.decode(value, buf, 0);
          value = buf;
        }
        this.uint32(len);
        this._reserve(len);
        this.buf.set(value, this.pos);
        this.pos += len;
        return this;
      };
      Writer.prototype.raw = function write_raw(value) {
        var len = value.length >>> 0;
        if (!len)
          return this;
        this._reserve(len);
        this.buf.set(value, this.pos);
        this.pos += len;
        return this;
      };
      Writer.prototype._delim = function _delim(pos, len) {
        var n = sizeVarint32(len);
        if (n > 1)
          this.buf.copyWithin(pos + n, pos + 1, pos + 1 + len);
        writeVarint32(len, this.buf, pos);
        this.pos = pos + n + len;
        return this;
      };
      Writer.prototype.string = function write_string(value) {
        var n = value.length;
        if (!n) {
          this._reserve(1);
          this.buf[this.pos++] = 0;
          return this;
        }
        if (n < 128) {
          this._reserve(n * 3 + 5);
          var lenPos = this.pos;
          return this._delim(lenPos, utf8.write(value, this.buf, lenPos + 1));
        }
        var len = utf8.length(value);
        this.uint32(len);
        this._reserve(len);
        if (len === value.length)
          writeStringAscii(value, this.buf, this.pos);
        else
          utf8.write(value, this.buf, this.pos);
        this.pos += len;
        return this;
      };
      Writer.prototype.uint32s = function write_uint32s(value) {
        var n = value.length;
        this._reserve(n * 5 + 5);
        var buf = this.buf, lenPos = this.pos, p = lenPos + 1;
        for (var i = 0; i < n; ++i)
          p = writeVarint32(value[i] >>> 0, buf, p);
        return this._delim(lenPos, p - lenPos - 1);
      };
      Writer.prototype.int32s = function write_int32s(value) {
        var n = value.length;
        this._reserve(n * 10 + 5);
        var buf = this.buf, lenPos = this.pos, pos = lenPos + 1, val;
        for (var i = 0; i < n; ++i) {
          if ((val = value[i] | 0) < 0) {
            pos = writeVarint64(LongBits.fromNumber(val), buf, pos);
          } else {
            pos = writeVarint32(val, buf, pos);
          }
        }
        return this._delim(lenPos, pos - lenPos - 1);
      };
      Writer.prototype.sint32s = function write_sint32s(value) {
        var n = value.length;
        this._reserve(n * 5 + 5);
        var buf = this.buf, lenPos = this.pos, pos = lenPos + 1;
        for (var i = 0; i < n; ++i)
          pos = writeVarint32((value[i] << 1 ^ value[i] >> 31) >>> 0, buf, pos);
        return this._delim(lenPos, pos - lenPos - 1);
      };
      Writer.prototype.uint64s = function write_uint64s(value) {
        var n = value.length;
        this._reserve(n * 10 + 5);
        var buf = this.buf, lenPos = this.pos, pos = lenPos + 1;
        for (var i = 0; i < n; ++i) {
          pos = writeVarint64(LongBits.from(value[i]), buf, pos);
        }
        return this._delim(lenPos, pos - lenPos - 1);
      };
      Writer.prototype.int64s = Writer.prototype.uint64s;
      Writer.prototype.sint64s = function write_sint64s(value) {
        var n = value.length;
        this._reserve(n * 10 + 5);
        var buf = this.buf, lenPos = this.pos, pos = lenPos + 1;
        for (var i = 0; i < n; ++i) {
          pos = writeVarint64(LongBits.from(value[i]).zzEncode(), buf, pos);
        }
        return this._delim(lenPos, pos - lenPos - 1);
      };
      Writer.prototype.bools = function write_bools(value) {
        var n = value.length;
        this.uint32(n);
        this._reserve(n);
        var buf = this.buf, p = this.pos;
        for (var i = 0; i < n; ++i)
          buf[p++] = value[i] ? 1 : 0;
        this.pos += n;
        return this;
      };
      var VIEW_THRESHOLD_FLOAT = 16;
      var VIEW_THRESHOLD_INT = 128;
      function getLazyView(writer, count, threshold) {
        var view = writer.view;
        if (view || count < threshold)
          return view;
        var buf = writer.buf;
        return writer.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
      }
      Writer.prototype.fixed32s = function write_fixed32s(value) {
        var n = value.length, bytes = n * 4;
        this.uint32(bytes);
        this._reserve(bytes);
        var p = this.pos, i, dv = getLazyView(this, n, VIEW_THRESHOLD_INT);
        if (dv)
          for (i = 0; i < n; ++i) {
            dv.setUint32(p, value[i] >>> 0, true);
            p += 4;
          }
        else {
          var buf = this.buf;
          for (i = 0; i < n; ++i) {
            writeFixed32(value[i] >>> 0, buf, p);
            p += 4;
          }
        }
        this.pos += bytes;
        return this;
      };
      Writer.prototype.sfixed32s = Writer.prototype.fixed32s;
      Writer.prototype.fixed64s = function write_fixed64s(value) {
        var n = value.length, bytes = n * 8;
        this.uint32(bytes);
        this._reserve(bytes);
        var p = this.pos, i, bits, dv = getLazyView(this, n, VIEW_THRESHOLD_INT);
        if (dv)
          for (i = 0; i < n; ++i) {
            bits = LongBits.from(value[i]);
            dv.setUint32(p, bits.lo, true);
            dv.setUint32(p + 4, bits.hi, true);
            p += 8;
          }
        else {
          var buf = this.buf;
          for (i = 0; i < n; ++i) {
            bits = LongBits.from(value[i]);
            writeFixed32(bits.lo, buf, p);
            writeFixed32(bits.hi, buf, p + 4);
            p += 8;
          }
        }
        this.pos += bytes;
        return this;
      };
      Writer.prototype.sfixed64s = Writer.prototype.fixed64s;
      Writer.prototype.floats = function write_floats(value) {
        var n = value.length, bytes = n * 4;
        this.uint32(bytes);
        this._reserve(bytes);
        var p = this.pos, i, dv = getLazyView(this, n, VIEW_THRESHOLD_FLOAT);
        if (dv)
          for (i = 0; i < n; ++i) {
            dv.setFloat32(p, value[i], true);
            p += 4;
          }
        else {
          var buf = this.buf;
          for (i = 0; i < n; ++i) {
            util.float.writeFloatLE(value[i], buf, p);
            p += 4;
          }
        }
        this.pos += bytes;
        return this;
      };
      Writer.prototype.doubles = function write_doubles(value) {
        var n = value.length, bytes = n * 8;
        this.uint32(bytes);
        this._reserve(bytes);
        var p = this.pos, i, dv = getLazyView(this, n, VIEW_THRESHOLD_FLOAT);
        if (dv)
          for (i = 0; i < n; ++i) {
            dv.setFloat64(p, value[i], true);
            p += 8;
          }
        else {
          var buf = this.buf;
          for (i = 0; i < n; ++i) {
            util.float.writeDoubleLE(value[i], buf, p);
            p += 8;
          }
        }
        this.pos += bytes;
        return this;
      };
      Writer.prototype.fork = function fork() {
        this._reserve(1);
        (this.states || (this.states = [])).push(this.pos);
        this.pos += 1;
        return this;
      };
      Writer.prototype.reset = function reset() {
        var states = this.states;
        if (states && states.length) {
          this.pos = states.pop();
        } else {
          this.pos = 0;
        }
        return this;
      };
      Writer.prototype.ldelim = function ldelim() {
        var states = this.states, len, vlen;
        if (states && states.length) {
          var lenPos = states.pop();
          len = this.pos - lenPos - 1;
          vlen = sizeVarint32(len);
          if (vlen > 1) {
            this._reserve(vlen - 1);
            this.buf.copyWithin(lenPos + vlen, lenPos + 1, lenPos + 1 + len);
            this.pos += vlen - 1;
            writeVarint32(len, this.buf, lenPos);
          } else {
            this.buf[lenPos] = len;
          }
        } else {
          len = this.pos;
          vlen = sizeVarint32(len);
          this._reserve(vlen);
          this.buf.copyWithin(vlen, 0, len);
          writeVarint32(len, this.buf, 0);
          this.pos += vlen;
        }
        return this;
      };
      Writer.prototype.finish = function finish(shared) {
        if (shared)
          return this.buf.subarray(0, this.pos);
        var buf = this.constructor.alloc(this.pos);
        buf.set(this.buf.subarray(0, this.pos), 0);
        return buf;
      };
      Writer.prototype.finishInto = function finishInto(buf, offset) {
        if (offset === void 0)
          offset = 0;
        buf.set(this.buf.subarray(0, this.pos), offset);
        return buf;
      };
      Writer._configure = function(BufferWriter_) {
        BufferWriter = BufferWriter_;
        Writer.create = create();
        BufferWriter._configure();
      };
    }
  });

  // node_modules/protobufjs/src/writer_buffer.js
  var require_writer_buffer = __commonJS({
    "node_modules/protobufjs/src/writer_buffer.js"(exports2, module2) {
      "use strict";
      module2.exports = BufferWriter;
      var Writer = require_writer();
      BufferWriter.prototype = Object.create(Writer.prototype, {
        constructor: {
          value: BufferWriter,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      var util = require_minimal();
      function BufferWriter() {
        Writer.call(this);
      }
      var writeStringBuffer;
      BufferWriter._configure = function() {
        BufferWriter.alloc = util.Buffer && util.Buffer.allocUnsafe;
        writeStringBuffer = util.Buffer && util.Buffer.prototype.utf8Write ? function writeStringBuffer_utf8Write(val, buf, pos) {
          return buf.utf8Write(val, pos);
        } : function writeStringBuffer_write(val, buf, pos) {
          return buf.write(val, pos);
        };
      };
      BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
        if (util.isString(value))
          value = util.Buffer.from(value, "base64");
        var len = value.length >>> 0;
        this.uint32(len);
        if (len) {
          this._reserve(len);
          this.buf.set(value, this.pos);
          this.pos += len;
        }
        return this;
      };
      BufferWriter.prototype.string = function write_string_buffer(value) {
        var n = value.length;
        if (!n) {
          this._reserve(1);
          this.buf[this.pos++] = 0;
          return this;
        }
        if (n < 128) {
          this._reserve(n * 3 + 5);
          var pos = this.pos, buf = this.buf;
          return this._delim(
            pos,
            n < 40 ? util.utf8.write(value, buf, pos + 1) : writeStringBuffer(value, buf, pos + 1)
          );
        }
        var len = util.Buffer.byteLength(value);
        this.uint32(len);
        this._reserve(len);
        writeStringBuffer(value, this.buf, this.pos);
        this.pos += len;
        return this;
      };
      BufferWriter._configure();
    }
  });

  // node_modules/protobufjs/src/reader.js
  var require_reader = __commonJS({
    "node_modules/protobufjs/src/reader.js"(exports2, module2) {
      "use strict";
      module2.exports = Reader;
      var util = require_minimal();
      var BufferReader;
      var LongBits = util.LongBits;
      var utf8 = util.utf8;
      function indexOutOfRange(reader, writeLength) {
        return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
      }
      function Reader(buffer) {
        this.buf = buffer;
        this.pos = 0;
        this.len = buffer.length;
        this.view = null;
        this.discardUnknown = Reader.discardUnknown;
      }
      function create_array(buffer) {
        if (Array.isArray(buffer))
          buffer = new Uint8Array(buffer);
        if (buffer instanceof Uint8Array)
          return new Reader(buffer);
        throw Error("illegal buffer");
      }
      var create = function create2() {
        return util.Buffer ? function create_buffer_setup(buffer) {
          return (Reader.create = function create_buffer(buffer2) {
            return util.Buffer.isBuffer(buffer2) ? new BufferReader(buffer2) : create_array(buffer2);
          })(buffer);
        } : create_array;
      };
      Reader.create = create();
      Reader.prototype.raw = function read_raw(start, end) {
        return this.buf.subarray(start, end);
      };
      Reader.prototype.uint32 = function read_uint32() {
        var buf = this.buf, pos = this.pos, value = (buf[pos] & 127) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        value = (value | (buf[pos] & 127) << 7) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        value = (value | (buf[pos] & 127) << 14) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        value = (value | (buf[pos] & 127) << 21) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        value = (value | (buf[pos] & 15) << 28) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        for (var i = 0; i < 5; ++i) {
          if (pos >= this.len) {
            this.pos = pos;
            throw indexOutOfRange(this);
          }
          if (buf[pos++] < 128) {
            this.pos = pos;
            return value;
          }
        }
        this.pos = pos;
        throw Error("invalid varint encoding");
      };
      Reader.prototype.tag = function read_tag() {
        var buf = this.buf, pos = this.pos, value = (buf[pos] & 127) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        value = (value | (buf[pos] & 127) << 7) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        value = (value | (buf[pos] & 127) << 14) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        value = (value | (buf[pos] & 127) << 21) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        value = (value | (buf[pos] & 15) << 28) >>> 0;
        if (buf[pos] < 128 && (buf[pos] & 112) === 0) {
          this.pos = pos + 1;
          return value;
        }
        this.pos = pos + 1;
        throw Error("invalid tag encoding");
      };
      Reader.prototype.int32 = function read_int32() {
        return this.uint32() | 0;
      };
      Reader.prototype.sint32 = function read_sint32() {
        var value = this.uint32();
        return value >>> 1 ^ -(value & 1) | 0;
      };
      function readLongVarint() {
        var bits = new LongBits(0, 0);
        var i = 0;
        if (this.len - this.pos > 4) {
          for (; i < 4; ++i) {
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits;
          }
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
          i = 0;
        } else {
          for (; i < 4; ++i) {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits;
          }
          throw indexOutOfRange(this);
        }
        if (this.len - this.pos > 4) {
          for (; i < 5; ++i) {
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits;
          }
        } else {
          for (; i < 5; ++i) {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits;
          }
        }
        throw Error("invalid varint encoding");
      }
      Reader.prototype.bool = function read_bool() {
        var value = false, b;
        for (var i = 0; i < 10; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          b = this.buf[this.pos++];
          if (b & 127)
            value = true;
          if (b < 128)
            return value;
        }
        throw Error("invalid varint encoding");
      };
      function readFixed32_end(buf, end) {
        return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
      }
      Reader.prototype.fixed32 = function read_fixed32() {
        if (this.pos + 4 > this.len)
          throw indexOutOfRange(this, 4);
        return readFixed32_end(this.buf, this.pos += 4);
      };
      Reader.prototype.sfixed32 = function read_sfixed32() {
        if (this.pos + 4 > this.len)
          throw indexOutOfRange(this, 4);
        return readFixed32_end(this.buf, this.pos += 4) | 0;
      };
      function readFixed64() {
        if (this.pos + 8 > this.len)
          throw indexOutOfRange(this, 8);
        return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
      }
      Reader.prototype.float = function read_float() {
        if (this.pos + 4 > this.len)
          throw indexOutOfRange(this, 4);
        var value = util.float.readFloatLE(this.buf, this.pos);
        this.pos += 4;
        return value;
      };
      Reader.prototype.double = function read_double() {
        if (this.pos + 8 > this.len)
          throw indexOutOfRange(this, 4);
        var value = util.float.readDoubleLE(this.buf, this.pos);
        this.pos += 8;
        return value;
      };
      Reader.prototype.uint32s = function read_uint32s(array) {
        if (array === void 0) array = [];
        var end = this.uint32() + this.pos, buf = this.buf, pos = this.pos, value;
        while (pos < end) {
          value = buf[pos++];
          if (value < 128)
            array.push(value);
          else {
            this.pos = pos - 1;
            array.push(this.uint32());
            pos = this.pos;
          }
        }
        this.pos = pos;
        return array;
      };
      Reader.prototype.int32s = function read_int32s(array) {
        if (array === void 0) array = [];
        var end = this.uint32() + this.pos, buf = this.buf, pos = this.pos, value;
        while (pos < end) {
          value = buf[pos++];
          if (value < 128)
            array.push(value);
          else {
            this.pos = pos - 1;
            array.push(this.int32());
            pos = this.pos;
          }
        }
        this.pos = pos;
        return array;
      };
      Reader.prototype.sint32s = function read_sint32s(array) {
        if (array === void 0) array = [];
        var end = this.uint32() + this.pos;
        while (this.pos < end)
          array.push(this.sint32());
        return array;
      };
      Reader.prototype.bools = function read_bools(array) {
        if (array === void 0) array = [];
        var end = this.uint32() + this.pos, buf = this.buf, pos = this.pos, value;
        while (pos < end) {
          value = buf[pos++];
          if (value < 128)
            array.push(value !== 0);
          else {
            this.pos = pos - 1;
            array.push(this.bool());
            pos = this.pos;
          }
        }
        this.pos = pos;
        return array;
      };
      var VIEW_THRESHOLD_FLOAT = 8;
      var VIEW_THRESHOLD_INT = 128;
      function getLazyView(reader, count, threshold) {
        var view = reader.view;
        if (view || count < threshold)
          return view;
        var buf = reader.buf;
        return reader.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
      }
      Reader.prototype.fixed32s = function read_fixed32s(array) {
        if (array === void 0) array = [];
        var len = this.uint32(), end = this.pos + len;
        if (end > this.len) throw indexOutOfRange(this, len);
        var count = len >>> 2, i = array.length, pos = this.pos;
        array.length = i + count;
        var dv = getLazyView(this, count, VIEW_THRESHOLD_INT);
        if (dv)
          for (var k = 0; k < count; ++k, pos += 4) array[i++] = dv.getUint32(pos, true);
        else {
          var buf = this.buf;
          for (var j = 0; j < count; ++j, pos += 4) array[i++] = readFixed32_end(buf, pos + 4);
        }
        this.pos = pos;
        if (pos !== end) throw indexOutOfRange(this, 4);
        return array;
      };
      Reader.prototype.sfixed32s = function read_sfixed32s(array) {
        if (array === void 0) array = [];
        var len = this.uint32(), end = this.pos + len;
        if (end > this.len) throw indexOutOfRange(this, len);
        var count = len >>> 2, i = array.length, pos = this.pos;
        array.length = i + count;
        var dv = getLazyView(this, count, VIEW_THRESHOLD_INT);
        if (dv)
          for (var k = 0; k < count; ++k, pos += 4) array[i++] = dv.getInt32(pos, true);
        else {
          var buf = this.buf;
          for (var j = 0; j < count; ++j, pos += 4) array[i++] = readFixed32_end(buf, pos + 4) | 0;
        }
        this.pos = pos;
        if (pos !== end) throw indexOutOfRange(this, 4);
        return array;
      };
      Reader.prototype.floats = function read_floats(array) {
        if (array === void 0) array = [];
        var len = this.uint32(), end = this.pos + len;
        if (end > this.len) throw indexOutOfRange(this, len);
        var count = len >>> 2, i = array.length, pos = this.pos;
        array.length = i + count;
        var dv = getLazyView(this, count, VIEW_THRESHOLD_FLOAT);
        if (dv)
          for (var k = 0; k < count; ++k, pos += 4) array[i++] = dv.getFloat32(pos, true);
        else {
          var buf = this.buf;
          for (var j = 0; j < count; ++j, pos += 4) array[i++] = util.float.readFloatLE(buf, pos);
        }
        this.pos = pos;
        if (pos !== end) throw indexOutOfRange(this, 4);
        return array;
      };
      Reader.prototype.doubles = function read_doubles(array) {
        if (array === void 0) array = [];
        var len = this.uint32(), end = this.pos + len;
        if (end > this.len) throw indexOutOfRange(this, len);
        var count = len >>> 3, i = array.length, pos = this.pos;
        array.length = i + count;
        var dv = getLazyView(this, count, VIEW_THRESHOLD_FLOAT);
        if (dv)
          for (var k = 0; k < count; ++k, pos += 8) array[i++] = dv.getFloat64(pos, true);
        else {
          var buf = this.buf;
          for (var j = 0; j < count; ++j, pos += 8) array[i++] = util.float.readDoubleLE(buf, pos);
        }
        this.pos = pos;
        if (pos !== end) throw indexOutOfRange(this, 8);
        return array;
      };
      Reader.prototype.uint64s = function read_uint64s(array) {
        if (array === void 0) array = [];
        var end = this.uint32() + this.pos;
        while (this.pos < end)
          array.push(this.uint64());
        return array;
      };
      Reader.prototype.int64s = function read_int64s(array) {
        if (array === void 0) array = [];
        var end = this.uint32() + this.pos;
        while (this.pos < end)
          array.push(this.int64());
        return array;
      };
      Reader.prototype.sint64s = function read_sint64s(array) {
        if (array === void 0) array = [];
        var end = this.uint32() + this.pos;
        while (this.pos < end)
          array.push(this.sint64());
        return array;
      };
      Reader.prototype.fixed64s = function read_fixed64s(array) {
        if (array === void 0) array = [];
        var len = this.uint32(), end = this.pos + len, i = array.length;
        if (end > this.len) throw indexOutOfRange(this, len);
        var count = len >>> 3;
        array.length = i + count;
        for (var j = 0; j < count; ++j)
          array[i++] = this.fixed64();
        if (this.pos !== end) throw indexOutOfRange(this, 8);
        return array;
      };
      Reader.prototype.sfixed64s = function read_sfixed64s(array) {
        if (array === void 0) array = [];
        var len = this.uint32(), end = this.pos + len, i = array.length;
        if (end > this.len) throw indexOutOfRange(this, len);
        var count = len >>> 3;
        array.length = i + count;
        for (var j = 0; j < count; ++j)
          array[i++] = this.sfixed64();
        if (this.pos !== end) throw indexOutOfRange(this, 8);
        return array;
      };
      Reader.prototype.bytes = function read_bytes() {
        var length = this.uint32(), start = this.pos, end = this.pos + length;
        if (end > this.len)
          throw indexOutOfRange(this, length);
        this.pos = end;
        return this.raw(start, end);
      };
      Reader.prototype.string = function read_string() {
        var length = this.uint32(), start = this.pos, end = this.pos + length;
        if (end > this.len)
          throw indexOutOfRange(this, length);
        this.pos = end;
        return utf8.read(this.buf, start, end);
      };
      Reader.prototype.stringVerify = function read_string_verify() {
        var length = this.uint32(), start = this.pos, end = this.pos + length;
        if (end > this.len)
          throw indexOutOfRange(this, length);
        this.pos = end;
        return utf8.readStrict(this.buf, start, end);
      };
      Reader.prototype.skip = function skip(length) {
        if (typeof length === "number") {
          if (this.pos + length > this.len)
            throw indexOutOfRange(this, length);
          this.pos += length;
        } else {
          do {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
          } while (this.buf[this.pos++] & 128);
        }
        return this;
      };
      Reader.recursionLimit = util.recursionLimit;
      Reader.discardUnknown = true;
      Reader.prototype.skipType = function(wireType, depth, fieldNumber) {
        if (depth === void 0) depth = 0;
        if (depth > Reader.recursionLimit)
          throw Error("max depth exceeded");
        if (fieldNumber === 0)
          throw Error("illegal tag: field number 0");
        switch (wireType) {
          case 0:
            this.skip();
            break;
          case 1:
            this.skip(8);
            break;
          case 2:
            this.skip(this.uint32());
            break;
          case 3:
            while (true) {
              var tag = this.tag();
              var nestedField = tag >>> 3;
              wireType = tag & 7;
              if (!nestedField)
                throw Error("illegal tag: field number 0");
              if (wireType === 4) {
                if (fieldNumber !== void 0 && nestedField !== fieldNumber)
                  throw Error("invalid end group tag");
                break;
              }
              this.skipType(wireType, depth + 1, nestedField);
            }
            break;
          case 5:
            this.skip(4);
            break;
          /* istanbul ignore next */
          default:
            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
        }
        return this;
      };
      Reader._configure = function(BufferReader_) {
        BufferReader = BufferReader_;
        Reader.create = create();
        BufferReader._configure();
        var fn = util.Long ? "toLong" : (
          /* istanbul ignore next */
          "toNumber"
        );
        util.merge(Reader.prototype, {
          int64: function read_int64() {
            return readLongVarint.call(this)[fn](false);
          },
          uint64: function read_uint64() {
            return readLongVarint.call(this)[fn](true);
          },
          sint64: function read_sint64() {
            return readLongVarint.call(this).zzDecode()[fn](false);
          },
          fixed64: function read_fixed64() {
            return readFixed64.call(this)[fn](true);
          },
          sfixed64: function read_sfixed64() {
            return readFixed64.call(this)[fn](false);
          }
        });
      };
    }
  });

  // node_modules/protobufjs/src/reader_buffer.js
  var require_reader_buffer = __commonJS({
    "node_modules/protobufjs/src/reader_buffer.js"(exports2, module2) {
      "use strict";
      module2.exports = BufferReader;
      var Reader = require_reader();
      BufferReader.prototype = Object.create(Reader.prototype, {
        constructor: {
          value: BufferReader,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      var util = require_minimal();
      function BufferReader(buffer) {
        Reader.call(this, buffer);
      }
      BufferReader._configure = function() {
        if (util.Buffer)
          BufferReader.prototype._slice = util.Buffer.prototype.slice;
      };
      BufferReader.prototype.raw = function read_raw_buffer(start, end) {
        return this._slice.call(this.buf, start, end);
      };
      BufferReader.prototype.string = function read_string_buffer() {
        var len = this.uint32(), start = this.pos, end = this.pos + len;
        if (end > this.len)
          throw RangeError("index out of range: " + this.pos + " + " + len + " > " + this.len);
        this.pos = end;
        return this.buf.utf8Slice ? this.buf.utf8Slice(start, end) : this.buf.toString("utf-8", start, end);
      };
      BufferReader._configure();
    }
  });

  // node_modules/protobufjs/src/rpc/service.js
  var require_service = __commonJS({
    "node_modules/protobufjs/src/rpc/service.js"(exports2, module2) {
      "use strict";
      module2.exports = Service;
      var util = require_minimal();
      Service.prototype = Object.create(util.EventEmitter.prototype, {
        constructor: {
          value: Service,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      function Service(rpcImpl, requestDelimited, responseDelimited) {
        if (typeof rpcImpl !== "function")
          throw TypeError("rpcImpl must be a function");
        util.EventEmitter.call(this);
        this.rpcImpl = rpcImpl;
        this.requestDelimited = Boolean(requestDelimited);
        this.responseDelimited = Boolean(responseDelimited);
      }
      Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
        if (!request)
          throw TypeError("request must be specified");
        var self2 = this;
        if (!callback)
          return util.asPromise(rpcCall, self2, method, requestCtor, responseCtor, request);
        if (!self2.rpcImpl) {
          setTimeout(function() {
            callback(Error("already ended"));
          }, 0);
          return void 0;
        }
        try {
          return self2.rpcImpl(
            method,
            requestCtor[self2.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
            function rpcCallback(err, response) {
              if (err) {
                self2.emit("error", err, method);
                return callback(err);
              }
              if (response === null) {
                self2.end(
                  /* endedByRPC */
                  true
                );
                return void 0;
              }
              if (!(response instanceof responseCtor)) {
                try {
                  response = responseCtor[self2.responseDelimited ? "decodeDelimited" : "decode"](response);
                } catch (err2) {
                  self2.emit("error", err2, method);
                  return callback(err2);
                }
              }
              self2.emit("data", response, method);
              return callback(null, response);
            }
          );
        } catch (err) {
          self2.emit("error", err, method);
          setTimeout(function() {
            callback(err);
          }, 0);
          return void 0;
        }
      };
      Service.prototype.end = function end(endedByRPC) {
        if (this.rpcImpl) {
          if (!endedByRPC)
            this.rpcImpl(null, null, null);
          this.rpcImpl = null;
          this.emit("end").off();
        }
        return this;
      };
    }
  });

  // node_modules/protobufjs/src/rpc.js
  var require_rpc = __commonJS({
    "node_modules/protobufjs/src/rpc.js"(exports2) {
      "use strict";
      var rpc = exports2;
      rpc.Service = require_service();
    }
  });

  // node_modules/protobufjs/src/roots.js
  var require_roots = __commonJS({
    "node_modules/protobufjs/src/roots.js"(exports2, module2) {
      "use strict";
      module2.exports = /* @__PURE__ */ Object.create(null);
    }
  });

  // node_modules/protobufjs/src/index-minimal.js
  var require_index_minimal = __commonJS({
    "node_modules/protobufjs/src/index-minimal.js"(exports2) {
      "use strict";
      exports2.build = "minimal";
      exports2.Writer = require_writer();
      exports2.BufferWriter = require_writer_buffer();
      exports2.Reader = require_reader();
      exports2.BufferReader = require_reader_buffer();
      exports2.util = require_minimal();
      exports2.rpc = require_rpc();
      exports2.roots = require_roots();
      exports2.configure = configure;
      function configure() {
        exports2.util.LongBits._configure(exports2.util.Long);
        exports2.Writer._configure(exports2.BufferWriter);
        exports2.Reader._configure(exports2.BufferReader);
      }
      configure();
    }
  });

  // node_modules/protobufjs/src/util/patterns.js
  var require_patterns = __commonJS({
    "node_modules/protobufjs/src/util/patterns.js"(exports2) {
      "use strict";
      var patterns = exports2;
      patterns.numberRe = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/;
      patterns.typeRefRe = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)(?:\.[a-zA-Z_][a-zA-Z_0-9]*)*$/;
      patterns.reservedRe = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/;
    }
  });

  // node_modules/protobufjs/src/util/codegen.js
  var require_codegen = __commonJS({
    "node_modules/protobufjs/src/util/codegen.js"(exports2, module2) {
      "use strict";
      module2.exports = codegen;
      var patterns = require_patterns();
      var reservedRe = patterns.reservedRe;
      function codegen(functionParams, functionName) {
        if (typeof functionParams === "string") {
          functionName = functionParams;
          functionParams = void 0;
        }
        var body = [];
        function Codegen(formatStringOrScope) {
          if (typeof formatStringOrScope !== "string") {
            var source = toString();
            if (codegen.verbose)
              console.log("codegen: " + source);
            source = "return " + source;
            if (formatStringOrScope) {
              var scopeKeys = Object.keys(formatStringOrScope), scopeParams = new Array(scopeKeys.length + 1), scopeValues = new Array(scopeKeys.length), scopeOffset = 0;
              while (scopeOffset < scopeKeys.length) {
                scopeParams[scopeOffset] = scopeKeys[scopeOffset];
                scopeValues[scopeOffset] = formatStringOrScope[scopeKeys[scopeOffset++]];
              }
              scopeParams[scopeOffset] = source;
              return Function.apply(null, scopeParams).apply(null, scopeValues);
            }
            return Function(source)();
          }
          var formatParams = new Array(arguments.length - 1), formatOffset = 0;
          while (formatOffset < formatParams.length)
            formatParams[formatOffset] = arguments[++formatOffset];
          formatOffset = 0;
          formatStringOrScope = formatStringOrScope.replace(/%([%dfijs])/g, function replace($0, $1) {
            var value = formatParams[formatOffset++];
            switch ($1) {
              case "d":
              case "f":
                value = Number(value);
                return Object.is(value, -0) ? "-0" : String(value);
              case "i":
                return String(Math.floor(value));
              case "j":
                return JSON.stringify(value);
              case "s":
                return String(value);
            }
            return "%";
          });
          if (formatOffset !== formatParams.length)
            throw Error("parameter count mismatch");
          body.push(formatStringOrScope);
          return Codegen;
        }
        function toString(functionNameOverride) {
          return "function " + safeFunctionName(functionNameOverride || functionName) + "(" + (functionParams && functionParams.join(",") || "") + "){\n  " + body.join("\n  ") + "\n}";
        }
        Object.defineProperty(Codegen, "toString", {
          value: toString,
          writable: true,
          enumerable: true,
          configurable: true
        });
        return Codegen;
      }
      codegen.verbose = false;
      function safeFunctionName(name) {
        if (!name)
          return "";
        name = String(name).replace(/[^\w$]/g, "");
        if (!name)
          return "";
        if (/^\d/.test(name))
          name = "_" + name;
        return reservedRe.test(name) ? name + "_" : name;
      }
    }
  });

  // (disabled):fs
  var require_fs = __commonJS({
    "(disabled):fs"() {
    }
  });

  // node_modules/protobufjs/src/util/fs.js
  var require_fs2 = __commonJS({
    "node_modules/protobufjs/src/util/fs.js"(exports2, module2) {
      "use strict";
      var fs = null;
      try {
        fs = require_fs();
        if (!fs || !fs.readFile || !fs.readFileSync)
          fs = null;
      } catch (e) {
      }
      module2.exports = fs;
    }
  });

  // node_modules/protobufjs/src/util/fetch.js
  var require_fetch = __commonJS({
    "node_modules/protobufjs/src/util/fetch.js"(exports2, module2) {
      "use strict";
      module2.exports = fetch;
      var asPromise = require_aspromise();
      var fs = require_fs2();
      function fetch(filename, options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = {};
        } else if (!options)
          options = {};
        if (!callback)
          return asPromise(fetch, this, filename, options);
        if (!options.xhr && fs && fs.readFile)
          return fs.readFile(filename, function fetchReadFileCallback(err, contents) {
            return err && typeof XMLHttpRequest !== "undefined" ? fetch.xhr(filename, options, callback) : err ? callback(err) : callback(null, options.binary ? contents : contents.toString("utf8"));
          });
        return fetch.xhr(filename, options, callback);
      }
      fetch.xhr = function fetch_xhr(filename, options, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function fetchOnReadyStateChange() {
          if (xhr.readyState !== 4)
            return void 0;
          if (xhr.status !== 0 && xhr.status !== 200)
            return callback(Error("status " + xhr.status));
          if (options.binary) {
            var buffer = xhr.response;
            if (!buffer) {
              buffer = [];
              for (var i = 0; i < xhr.responseText.length; ++i)
                buffer.push(xhr.responseText.charCodeAt(i) & 255);
            }
            return callback(null, typeof Uint8Array !== "undefined" ? new Uint8Array(buffer) : buffer);
          }
          return callback(null, xhr.responseText);
        };
        if (options.binary) {
          if ("overrideMimeType" in xhr)
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          xhr.responseType = "arraybuffer";
        }
        xhr.open("GET", filename);
        xhr.send();
      };
    }
  });

  // node_modules/protobufjs/src/util/path.js
  var require_path = __commonJS({
    "node_modules/protobufjs/src/util/path.js"(exports2) {
      "use strict";
      var path = exports2;
      var urlRe = /^[a-zA-Z][a-zA-Z0-9+.-]+:\/\//;
      function normalizeUrl(path2) {
        if (typeof URL === "undefined" || !urlRe.test(path2))
          return null;
        try {
          return new URL(path2).href;
        } catch (e) {
          return null;
        }
      }
      function resolveUrl(originPath, includePath) {
        if (typeof URL === "undefined" || !urlRe.test(originPath) || urlRe.test(includePath))
          return null;
        try {
          return new URL(includePath, originPath).href;
        } catch (e) {
          return null;
        }
      }
      var isAbsolute = (
        /**
         * Tests if the specified path is absolute.
         * @param {string} path Path to test
         * @returns {boolean} `true` if path is absolute
         */
        path.isAbsolute = function isAbsolute2(path2) {
          return /^(?:\/|\w+:|\\\\\w+)/.test(path2);
        }
      );
      var normalize = (
        /**
         * Normalizes the specified path.
         * @param {string} path Path to normalize
         * @returns {string} Normalized path
         */
        path.normalize = function normalize2(path2) {
          var normalizedUrl = normalizeUrl(path2);
          if (normalizedUrl)
            return normalizedUrl;
          var firstTwoCharacters = path2.substring(0, 2);
          var uncPrefix = "";
          if (firstTwoCharacters === "\\\\") {
            uncPrefix = firstTwoCharacters;
            path2 = path2.substring(2);
          }
          path2 = path2.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
          var parts = path2.split("/"), absolute = isAbsolute(path2), prefix = "";
          if (absolute)
            prefix = parts.shift() + "/";
          for (var i = 0; i < parts.length; ) {
            if (parts[i] === "..") {
              if (i > 0 && parts[i - 1] !== "..")
                parts.splice(--i, 2);
              else if (absolute)
                parts.splice(i, 1);
              else
                ++i;
            } else if (parts[i] === ".")
              parts.splice(i, 1);
            else
              ++i;
          }
          return uncPrefix + prefix + parts.join("/");
        }
      );
      path.resolve = function resolve(originPath, includePath, alreadyNormalized) {
        var resolvedUrl = resolveUrl(originPath, includePath);
        if (resolvedUrl)
          return resolvedUrl;
        if (!alreadyNormalized)
          includePath = normalize(includePath);
        if (isAbsolute(includePath))
          return includePath;
        if (!alreadyNormalized)
          originPath = normalize(originPath);
        return (originPath = originPath.replace(/(?:\/|^)[^/]+$/, "")).length ? normalize(originPath + "/" + includePath) : includePath;
      };
    }
  });

  // node_modules/protobufjs/src/namespace.js
  var require_namespace = __commonJS({
    "node_modules/protobufjs/src/namespace.js"(exports2, module2) {
      "use strict";
      module2.exports = Namespace;
      var ReflectionObject = require_object();
      Namespace.prototype = Object.create(ReflectionObject.prototype, {
        constructor: {
          value: Namespace,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      Namespace.className = "Namespace";
      var Field = require_field();
      var util = require_util();
      var OneOf = require_oneof();
      var Type;
      var Service;
      var Enum;
      Namespace.fromJSON = function fromJSON(name, json, depth) {
        if (depth === void 0)
          depth = 0;
        if (depth > util.recursionLimit)
          throw Error("max depth exceeded");
        return new Namespace(name, json.options).addJSON(json.nested, depth);
      };
      function arrayToJSON(array, toJSONOptions) {
        if (!(array && array.length))
          return void 0;
        var obj = {};
        for (var i = 0; i < array.length; ++i)
          obj[array[i].name] = array[i].toJSON(toJSONOptions);
        return obj;
      }
      Namespace.arrayToJSON = arrayToJSON;
      Namespace.isReservedId = function isReservedId(reserved, id) {
        if (reserved) {
          for (var i = 0; i < reserved.length; ++i)
            if (typeof reserved[i] !== "string" && reserved[i][0] <= id && reserved[i][1] >= id)
              return true;
        }
        return false;
      };
      Namespace.isReservedName = function isReservedName(reserved, name) {
        if (reserved) {
          for (var i = 0; i < reserved.length; ++i)
            if (reserved[i] === name)
              return true;
        }
        return false;
      };
      function Namespace(name, options) {
        ReflectionObject.call(this, name, options);
        this.nested = void 0;
        this._nestedArray = null;
        this._lookupCache = /* @__PURE__ */ Object.create(null);
        this._needsRecursiveFeatureResolution = true;
        this._needsRecursiveResolve = true;
      }
      function clearCache(namespace) {
        namespace._nestedArray = null;
        namespace._lookupCache = /* @__PURE__ */ Object.create(null);
        var parent = namespace;
        while (parent = parent.parent) {
          parent._lookupCache = /* @__PURE__ */ Object.create(null);
        }
        return namespace;
      }
      Object.defineProperty(Namespace.prototype, "nestedArray", {
        get: function() {
          return this._nestedArray || (this._nestedArray = util.toArray(this.nested));
        }
      });
      Namespace.prototype.toJSON = function toJSON(toJSONOptions) {
        return util.toObject([
          "options",
          this.options,
          "nested",
          arrayToJSON(this.nestedArray, toJSONOptions)
        ]);
      };
      Namespace.prototype.addJSON = function addJSON(nestedJson, depth) {
        if (depth === void 0)
          depth = 0;
        if (depth > util.recursionLimit)
          throw Error("max depth exceeded");
        var ns = this;
        if (nestedJson) {
          for (var names = Object.keys(nestedJson), i = 0, nested; i < names.length; ++i) {
            nested = nestedJson[names[i]];
            ns.add(
              // most to least likely
              (nested.fields !== void 0 ? Type.fromJSON : nested.values !== void 0 ? Enum.fromJSON : nested.methods !== void 0 ? Service.fromJSON : nested.id !== void 0 ? Field.fromJSON : Namespace.fromJSON)(names[i], nested, depth + 1)
            );
          }
        }
        return this;
      };
      Namespace.prototype.get = function get(name) {
        return this.nested && Object.prototype.hasOwnProperty.call(this.nested, name) ? this.nested[name] : null;
      };
      Namespace.prototype.getEnum = function getEnum(name) {
        if (this.nested && Object.prototype.hasOwnProperty.call(this.nested, name) && this.nested[name] instanceof Enum)
          return this.nested[name].values;
        throw Error("no such enum: " + name);
      };
      Namespace.prototype.add = function add(object) {
        if (!(object instanceof Field && object.extend !== void 0 || object instanceof Type || object instanceof OneOf || object instanceof Enum || object instanceof Service || object instanceof Namespace))
          throw TypeError("object must be a valid nested object");
        if (object.name === "__proto__")
          return this;
        if (!this.nested)
          this.nested = {};
        else {
          var prev = this.get(object.name);
          if (prev) {
            if (prev instanceof Namespace && object instanceof Namespace && !(prev instanceof Type || prev instanceof Service)) {
              var nested = prev.nestedArray;
              for (var i = 0; i < nested.length; ++i)
                object.add(nested[i]);
              this.remove(prev);
              if (!this.nested)
                this.nested = {};
              object.setOptions(prev.options, true);
            } else
              throw Error("duplicate name '" + object.name + "' in " + this);
          }
        }
        this.nested[object.name] = object;
        if (!(this instanceof Type || this instanceof Service || this instanceof Enum || this instanceof Field)) {
          if (!object._edition) {
            object._edition = object._defaultEdition;
          }
        }
        this._needsRecursiveFeatureResolution = true;
        this._needsRecursiveResolve = true;
        var parent = this;
        while (parent = parent.parent) {
          parent._needsRecursiveFeatureResolution = true;
          parent._needsRecursiveResolve = true;
        }
        object.onAdd(this);
        return clearCache(this);
      };
      Namespace.prototype.remove = function remove(object) {
        if (!(object instanceof ReflectionObject))
          throw TypeError("object must be a ReflectionObject");
        if (object.parent !== this)
          throw Error(object + " is not a member of " + this);
        if (!util.remove(this.nested, object, object.name))
          throw Error(object + " is not a member of " + this);
        if (!Object.keys(this.nested).length)
          this.nested = void 0;
        object.onRemove(this);
        return clearCache(this);
      };
      Namespace.prototype.define = function define2(path, json) {
        if (util.isString(path))
          path = path.split(".");
        else if (!Array.isArray(path))
          throw TypeError("illegal path");
        if (path && path.length && path[0] === "")
          throw Error("path must be relative");
        if (path.length > util.recursionLimit)
          throw Error("max depth exceeded");
        var ptr = this;
        while (path.length > 0) {
          var part = path.shift();
          if (ptr.nested && ptr.nested[part]) {
            ptr = ptr.nested[part];
            if (!(ptr instanceof Namespace))
              throw Error("path conflicts with non-namespace objects");
          } else
            ptr.add(ptr = new Namespace(part));
        }
        if (json)
          ptr.addJSON(json);
        return ptr;
      };
      Namespace.prototype.resolveAll = function resolveAll() {
        if (!this._needsRecursiveResolve) return this;
        if (this._needsRecursiveFeatureResolution)
          this._resolveFeaturesRecursive(this._edition);
        var nested = this.nestedArray, i = 0;
        this.resolve();
        while (i < nested.length)
          if (nested[i] instanceof Namespace)
            nested[i++].resolveAll();
          else
            nested[i++].resolve();
        this._needsRecursiveResolve = false;
        return this;
      };
      Namespace.prototype._resolveFeaturesRecursive = function _resolveFeaturesRecursive(edition) {
        if (!this._needsRecursiveFeatureResolution) return this;
        this._needsRecursiveFeatureResolution = false;
        edition = this._edition || edition;
        ReflectionObject.prototype._resolveFeaturesRecursive.call(this, edition);
        this.nestedArray.forEach((nested) => {
          nested._resolveFeaturesRecursive(edition);
        });
        return this;
      };
      Namespace.prototype.lookup = function lookup(path, filterTypes, parentAlreadyChecked) {
        if (typeof filterTypes === "boolean") {
          parentAlreadyChecked = filterTypes;
          filterTypes = void 0;
        } else if (filterTypes && !Array.isArray(filterTypes))
          filterTypes = [filterTypes];
        if (util.isString(path) && path.length) {
          if (path === ".")
            return this.root;
          path = path.split(".");
        } else if (!path.length)
          return this;
        var flatPath = path.join(".");
        if (path[0] === "")
          return this.root.lookup(path.slice(1), filterTypes);
        var found = this._lookupImpl(path, flatPath);
        if (found && (!filterTypes || filterTypes.indexOf(found.constructor) > -1)) {
          return found;
        }
        found = this.root._fullyQualifiedObjects && this.root._fullyQualifiedObjects["." + flatPath];
        if (found && (!filterTypes || filterTypes.indexOf(found.constructor) > -1)) {
          return found;
        }
        if (parentAlreadyChecked)
          return null;
        var current = this;
        while (current.parent) {
          found = current.parent._lookupImpl(path, flatPath);
          if (found && (!filterTypes || filterTypes.indexOf(found.constructor) > -1)) {
            return found;
          }
          current = current.parent;
        }
        return null;
      };
      Namespace.prototype._lookupImpl = function lookup(path, flatPath) {
        if (Object.prototype.hasOwnProperty.call(this._lookupCache, flatPath)) {
          return this._lookupCache[flatPath];
        }
        var found = this.get(path[0]);
        var exact = null;
        if (found) {
          if (path.length === 1) {
            exact = found;
          } else if (found instanceof Namespace) {
            path = path.slice(1);
            exact = found._lookupImpl(path, path.join("."));
          }
        } else {
          for (var i = 0; i < this.nestedArray.length; ++i)
            if (this._nestedArray[i] instanceof Namespace && (found = this._nestedArray[i]._lookupImpl(path, flatPath))) {
              exact = found;
              break;
            }
        }
        this._lookupCache[flatPath] = exact;
        return exact;
      };
      Namespace.prototype.lookupType = function lookupType(path) {
        var found = this.lookup(path, [Type]);
        if (!found)
          throw Error("no such type: " + path);
        return found;
      };
      Namespace.prototype.lookupEnum = function lookupEnum(path) {
        var found = this.lookup(path, [Enum]);
        if (!found)
          throw Error("no such Enum '" + path + "' in " + this);
        return found;
      };
      Namespace.prototype.lookupTypeOrEnum = function lookupTypeOrEnum(path) {
        var found = this.lookup(path, [Type, Enum]);
        if (!found)
          throw Error("no such Type or Enum '" + path + "' in " + this);
        return found;
      };
      Namespace.prototype.lookupService = function lookupService(path) {
        var found = this.lookup(path, [Service]);
        if (!found)
          throw Error("no such Service '" + path + "' in " + this);
        return found;
      };
      Namespace._configure = function(Type_, Service_, Enum_) {
        Type = Type_;
        Service = Service_;
        Enum = Enum_;
      };
    }
  });

  // node_modules/protobufjs/src/mapfield.js
  var require_mapfield = __commonJS({
    "node_modules/protobufjs/src/mapfield.js"(exports2, module2) {
      "use strict";
      module2.exports = MapField;
      var Field = require_field();
      MapField.prototype = Object.create(Field.prototype, {
        constructor: {
          value: MapField,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      MapField.className = "MapField";
      var types = require_types();
      var util = require_util();
      function MapField(name, id, keyType, type, options, comment) {
        Field.call(this, name, id, type, void 0, void 0, options, comment);
        if (!util.isString(keyType))
          throw TypeError("keyType must be a string");
        this.keyType = keyType;
        this.resolvedKeyType = null;
        this.map = true;
      }
      MapField.fromJSON = function fromJSON(name, json) {
        var field = new MapField(name, json.id, json.keyType, json.type, json.options, json.comment);
        if (json.protoName)
          field.protoName = json.protoName;
        if (json.jsonName !== void 0)
          field.jsonName = json.jsonName;
        else if (json.options && json.options.json_name !== void 0)
          field.jsonName = json.options.json_name;
        return field;
      };
      MapField.prototype.toJSON = function toJSON(toJSONOptions) {
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "keyType",
          this.keyType,
          "type",
          this.type,
          "id",
          this.id,
          "extend",
          this.extend,
          "protoName",
          this.protoName !== this.name ? this.protoName : void 0,
          "jsonName",
          this.jsonName !== util.jsonName(this.protoName || this.name) ? this.jsonName : void 0,
          "options",
          this.options,
          "comment",
          keepComments ? this.comment : void 0
        ]);
      };
      MapField.prototype.resolve = function resolve() {
        if (this.resolved)
          return this;
        if (types.mapKey[this.keyType] === void 0)
          throw Error("invalid key type: " + this.keyType);
        return Field.prototype.resolve.call(this);
      };
      MapField.d = function decorateMapField(fieldId, fieldKeyType, fieldValueType) {
        if (typeof fieldValueType === "function")
          fieldValueType = util.decorateType(fieldValueType).name;
        else if (fieldValueType && typeof fieldValueType === "object")
          fieldValueType = util.decorateEnum(fieldValueType).name;
        return function mapFieldDecorator(prototype, fieldName) {
          util.decorateType(prototype.constructor).add(new MapField(fieldName, fieldId, fieldKeyType, fieldValueType));
        };
      };
    }
  });

  // node_modules/protobufjs/src/method.js
  var require_method = __commonJS({
    "node_modules/protobufjs/src/method.js"(exports2, module2) {
      "use strict";
      module2.exports = Method;
      var ReflectionObject = require_object();
      Method.prototype = Object.create(ReflectionObject.prototype, {
        constructor: {
          value: Method,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      Method.className = "Method";
      var util = require_util();
      function Method(name, type, requestType, responseType, requestStream, responseStream, options, comment, parsedOptions) {
        if (util.isObject(requestStream)) {
          options = requestStream;
          requestStream = responseStream = void 0;
        } else if (util.isObject(responseStream)) {
          options = responseStream;
          responseStream = void 0;
        }
        if (!(type === void 0 || util.isString(type)))
          throw TypeError("type must be a string");
        if (!util.isString(requestType))
          throw TypeError("requestType must be a string");
        if (!util.isString(responseType))
          throw TypeError("responseType must be a string");
        ReflectionObject.call(this, name, options);
        this.type = type || "rpc";
        this.requestType = requestType;
        this.requestStream = requestStream ? true : void 0;
        this.responseType = responseType;
        this.responseStream = responseStream ? true : void 0;
        this.path = "/" + this.name;
        this.resolvedRequestType = null;
        this.resolvedResponseType = null;
        this.comment = comment;
        this.parsedOptions = parsedOptions;
      }
      Method.fromJSON = function fromJSON(name, json) {
        return new Method(name, json.type, json.requestType, json.responseType, json.requestStream, json.responseStream, json.options, json.comment, json.parsedOptions);
      };
      Method.prototype.toJSON = function toJSON(toJSONOptions) {
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "type",
          this.type !== "rpc" && /* istanbul ignore next */
          this.type || void 0,
          "requestType",
          this.requestType,
          "requestStream",
          this.requestStream,
          "responseType",
          this.responseType,
          "responseStream",
          this.responseStream,
          "options",
          this.options,
          "comment",
          keepComments ? this.comment : void 0,
          "parsedOptions",
          this.parsedOptions
        ]);
      };
      Method.prototype.resolve = function resolve() {
        if (this.resolved)
          return this;
        if (this.parent) {
          var serviceName = this.parent.fullName;
          if (serviceName.charAt(0) === ".")
            serviceName = serviceName.substring(1);
          this.path = "/" + serviceName + "/" + this.name;
        } else
          this.path = "/" + this.name;
        this.resolvedRequestType = this.parent.lookupType(this.requestType);
        this.resolvedResponseType = this.parent.lookupType(this.responseType);
        return ReflectionObject.prototype.resolve.call(this);
      };
    }
  });

  // node_modules/protobufjs/src/service.js
  var require_service2 = __commonJS({
    "node_modules/protobufjs/src/service.js"(exports2, module2) {
      "use strict";
      module2.exports = Service;
      var Namespace = require_namespace();
      Service.prototype = Object.create(Namespace.prototype, {
        constructor: {
          value: Service,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      Service.className = "Service";
      var Method = require_method();
      var util = require_util();
      var rpc = require_rpc();
      function Service(name, options) {
        Namespace.call(this, name, options);
        this.methods = {};
        this._methodsArray = null;
      }
      Service.fromJSON = function fromJSON(name, json, depth) {
        if (depth === void 0)
          depth = 0;
        if (depth > util.recursionLimit)
          throw Error("max depth exceeded");
        var service = new Service(name, json.options);
        if (json.methods)
          for (var names = Object.keys(json.methods), i = 0; i < names.length; ++i)
            service.add(Method.fromJSON(names[i], json.methods[names[i]]));
        if (json.nested)
          service.addJSON(json.nested, depth);
        if (json.edition)
          service._edition = json.edition;
        service.comment = json.comment;
        service._defaultEdition = "proto3";
        return service;
      };
      Service.prototype.toJSON = function toJSON(toJSONOptions) {
        var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "edition",
          this._editionToJSON(),
          "options",
          inherited && inherited.options || void 0,
          "methods",
          Namespace.arrayToJSON(this.methodsArray, toJSONOptions) || /* istanbul ignore next */
          {},
          "nested",
          inherited && inherited.nested || void 0,
          "comment",
          keepComments ? this.comment : void 0
        ]);
      };
      Object.defineProperty(Service.prototype, "methodsArray", {
        get: function() {
          return this._methodsArray || (this._methodsArray = util.toArray(this.methods));
        }
      });
      function clearCache(service) {
        service._methodsArray = null;
        return service;
      }
      Service.prototype.get = function get(name) {
        return Object.prototype.hasOwnProperty.call(this.methods, name) ? this.methods[name] : Namespace.prototype.get.call(this, name);
      };
      Service.prototype.resolveAll = function resolveAll() {
        if (!this._needsRecursiveResolve) return this;
        Namespace.prototype.resolve.call(this);
        var methods = this.methodsArray;
        for (var i = 0; i < methods.length; ++i)
          methods[i].resolve();
        return this;
      };
      Service.prototype._resolveFeaturesRecursive = function _resolveFeaturesRecursive(edition) {
        if (!this._needsRecursiveFeatureResolution) return this;
        edition = this._edition || edition;
        Namespace.prototype._resolveFeaturesRecursive.call(this, edition);
        this.methodsArray.forEach((method) => {
          method._resolveFeaturesRecursive(edition);
        });
        return this;
      };
      Service.prototype.add = function add(object) {
        if (this.get(object.name))
          throw Error("duplicate name '" + object.name + "' in " + this);
        if (object instanceof Method) {
          if (object.name === "__proto__")
            return this;
          this.methods[object.name] = object;
          object.parent = this;
          return clearCache(this);
        }
        return Namespace.prototype.add.call(this, object);
      };
      Service.prototype.remove = function remove(object) {
        if (object instanceof Method) {
          if (this.methods[object.name] !== object)
            throw Error(object + " is not a member of " + this);
          delete this.methods[object.name];
          object.parent = null;
          return clearCache(this);
        }
        return Namespace.prototype.remove.call(this, object);
      };
      Service.prototype.create = function create(rpcImpl, requestDelimited, responseDelimited) {
        var rpcService = new rpc.Service(rpcImpl, requestDelimited, responseDelimited);
        for (var i = 0, method; i < /* initializes */
        this.methodsArray.length; ++i) {
          var methodName = util.lcFirst((method = this._methodsArray[i]).resolve().name).replace(/[^$\w_]/g, "");
          rpcService[methodName] = /* @__PURE__ */ (function(method2, requestType, responseType) {
            return function rpcMethod(request, callback) {
              return rpc.Service.prototype.rpcCall.call(this, method2, requestType, responseType, request, callback);
            };
          })(method, method.resolvedRequestType.ctor, method.resolvedResponseType.ctor);
        }
        return rpcService;
      };
    }
  });

  // node_modules/protobufjs/src/message.js
  var require_message = __commonJS({
    "node_modules/protobufjs/src/message.js"(exports2, module2) {
      "use strict";
      module2.exports = Message;
      var util = require_minimal();
      function Message(properties) {
        if (properties) {
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null && keys[i] !== "__proto__")
              this[keys[i]] = properties[keys[i]];
        }
      }
      Message.create = function create(properties) {
        return this.$type.create(properties);
      };
      Message.encode = function encode(message, writer) {
        return this.$type.encode(message, writer);
      };
      Message.encodeDelimited = function encodeDelimited(message, writer) {
        return this.$type.encodeDelimited(message, writer);
      };
      Message.decode = function decode(reader) {
        return this.$type.decode(reader);
      };
      Message.decodeDelimited = function decodeDelimited(reader) {
        return this.$type.decodeDelimited(reader);
      };
      Message.verify = function verify(message) {
        return this.$type.verify(message);
      };
      Message.fromObject = function fromObject(object) {
        return this.$type.fromObject(object);
      };
      Message.toObject = function toObject(message, options) {
        return this.$type.toObject(message, options);
      };
      Message.prototype.toJSON = function toJSON() {
        return this.$type.toObject(this, util.toJSONOptions);
      };
    }
  });

  // node_modules/protobufjs/src/decoder.js
  var require_decoder = __commonJS({
    "node_modules/protobufjs/src/decoder.js"(exports2, module2) {
      "use strict";
      module2.exports = decoder;
      var Enum = require_enum();
      var types = require_types();
      var util = require_util();
      function missing(field) {
        return "missing required '" + field.name + "'";
      }
      function stringMethod(field) {
        return field._features.utf8_validation === "VERIFY" ? "stringVerify" : "string";
      }
      function genPreserveUnknown(gen, ref) {
        return gen("if(!r.discardUnknown){")('util.makeProp(m,"$unknowns",false);')("(m.$unknowns||(m.$unknowns=[])).push(%s)", ref)("}");
      }
      function decoder(mtype) {
        var hasMapField = false, needsValueVar = false, i = 0;
        for (; i < mtype.fieldsArray.length; ++i) {
          var pfield = mtype._fieldsArray[i];
          if (pfield.map)
            hasMapField = true;
          if (pfield.resolvedType instanceof Enum || !pfield.repeated && !pfield.map && !pfield.hasPresence)
            needsValueVar = true;
        }
        var gen = util.codegen(["r", "l", "z", "q", "g"])("if(!(r instanceof Reader))")("r=Reader.create(r)")("if(q===undefined)q=0")("if(q>Reader.recursionLimit)")('throw Error("max depth exceeded")')("var c=l===undefined?r.len:r.pos+l,m=g||new C" + (hasMapField ? ",k,v" : needsValueVar ? ",v" : ""))("while(r.pos<c){")("var s=r.pos")("var t=r.tag()")("if(t===z){")("z=undefined")("break")("}");
        if (mtype.fieldsArray.length) gen("var u=t&7")("switch(t>>>=3){");
        for (i = 0; i < /* initializes */
        mtype.fieldsArray.length; ++i) {
          var field = mtype._fieldsArray[i].resolve(), type = field.resolvedType instanceof Enum ? "int32" : field.type, ref = "m" + util.safeProp(field.name), closed = field.resolvedType instanceof Enum && field.resolvedType._features.enum_type === "CLOSED";
          if (field.map) {
            gen("case %i:{", field.id)("if(u!==2)")("break");
            if (!closed) gen("if(%s===util.emptyObject)", ref)("%s={}", ref);
            gen("var c2=r.uint32()+r.pos");
            if (types.defaults[field.keyType] !== void 0) gen("k=%j", types.defaults[field.keyType]);
            else gen("k=null");
            if (types.long[type] !== void 0) gen("v=util.Long?util.Long.fromNumber(0,%j):0", type === "uint64" || type === "fixed64");
            else if (types.defaults[type] !== void 0) gen("v=%j", types.defaults[type]);
            else gen("v=null");
            gen("while(r.pos<c2){")("var t2=r.tag()")("u=t2&7")("switch(t2>>>=3){")("case 1:")("if(u!==%i)", types.mapKey[field.keyType])("break")("k=r.%s()", field.keyType === "string" ? stringMethod(field) : field.keyType)("continue")("case 2:")("if(u!==%i)", types.basic[type] === void 0 ? 2 : types.basic[type])("break");
            if (types.basic[type] === void 0) gen("v=types[%i].decode(r,r.uint32(),undefined,q+1,v)", i);
            else gen("v=r.%s()", type === "string" ? stringMethod(field) : type);
            gen("continue")("}")("r.skipType(u,q,t2)")("}");
            if (closed) {
              gen("if(types[%i].valuesById[v]===undefined){", i);
              genPreserveUnknown(gen, "r.raw(s,r.pos)")("continue")("}")("if(%s===util.emptyObject)", ref)("%s={}", ref);
            }
            var val = types.basic[type] === void 0 ? "v||new types[" + i + "].ctor" : "v";
            if (types.long[field.keyType] !== void 0) gen('%s[typeof k==="object"?util.longToHash(k):k]=%s', ref, val);
            else {
              if (field.keyType === "string") gen('if(k==="__proto__")')("util.makeProp(%s,k)", ref);
              gen("%s[k]=%s", ref, val);
            }
          } else if (field.repeated) {
            gen("case %i:", field.id)("{");
            if (types.packed[type] !== void 0) {
              gen("if(u===2){");
              if (closed) {
                gen("var c2=r.uint32()+r.pos")("while(r.pos<c2){")("s=r.pos")("v=r.%s()", type)("if(types[%i].valuesById[v]!==undefined){", i)("if(!(%s&&%s.length))", ref, ref)("%s=[]", ref)("%s.push(v)", ref)("}else");
                genPreserveUnknown(gen, "util.rawField(" + field.id + ",0,r.raw(s,r.pos))")("}");
              } else gen("if(!(%s&&%s.length))", ref, ref)("%s=[]", ref)("r.%ss(%s)", type, ref);
              gen("continue")("}");
            }
            gen("if(u!==%i)", types.basic[type] === void 0 ? field.delimited ? 3 : 2 : types.basic[type])("break");
            if (!closed) gen("if(!(%s&&%s.length))", ref, ref)("%s=[]", ref);
            if (types.basic[type] === void 0) {
              if (field.delimited) gen("%s.push(types[%i].decode(r,undefined,%i,q+1))", ref, i, field.id * 8 + 4);
              else gen("%s.push(types[%i].decode(r,r.uint32(),undefined,q+1))", ref, i);
            } else if (closed) {
              gen("v=r.%s()", type)("if(types[%i].valuesById[v]!==undefined){", i)("if(!(%s&&%s.length))", ref, ref)("%s=[]", ref)("%s.push(v)", ref)("}else");
              genPreserveUnknown(gen, "r.raw(s,r.pos)");
            } else gen("%s.push(r.%s())", ref, type === "string" ? stringMethod(field) : type);
          } else if (types.basic[type] === void 0) {
            gen("case %i:{", field.id)("if(u!==%i)", field.delimited ? 3 : 2)("break");
            if (field.delimited) gen("%s=types[%i].decode(r,undefined,%i,q+1,%s)", ref, i, field.id * 8 + 4, ref);
            else gen("%s=types[%i].decode(r,r.uint32(),undefined,q+1,%s)", ref, i, ref);
          } else if (field.hasPresence) {
            gen("case %i:{", field.id)("if(u!==%i)", types.basic[type])("break");
            if (closed) {
              gen("v=r.%s()", type)("if(types[%i].valuesById[v]!==undefined){", i)("%s=v", ref);
              if (field.partOf) gen("m%s=%j", util.safeProp(field.partOf.name), field.name);
              gen("}else");
              genPreserveUnknown(gen, "r.raw(s,r.pos)");
            } else gen("%s=r.%s()", ref, type === "string" ? stringMethod(field) : type);
          } else {
            gen("case %i:{", field.id)("if(u!==%i)", types.basic[type])("break");
            if (closed) {
              gen("v=r.%s()", type)("if(types[%i].valuesById[v]!==undefined){", i)("if(v!==%j)", field.typeDefault)("%s=v", ref)("else")("delete %s", ref)("}else{");
              genPreserveUnknown(gen, "r.raw(s,r.pos)")("}");
            } else {
              if (field.resolvedType instanceof Enum && field.typeDefault !== 0) gen("if((v=r.%s())!==%j)", type, field.typeDefault);
              else if (type === "string") gen("if((v=r.%s()).length)", stringMethod(field));
              else if (type === "bytes") gen("if((v=r.%s()).length)", type);
              else if (types.long[type] !== void 0) gen('if(typeof(v=r.%s())==="object"?v.low||v.high:v!==0)', type);
              else if (type === "double" || type === "float") gen("if(!Object.is(v=r.%s(),0))", type);
              else gen("if(v=r.%s())", type);
              gen("%s=v", ref)("else")("delete %s", ref);
            }
          }
          if (field.partOf && !closed) gen("m%s=%j", util.safeProp(field.partOf.name), field.name);
          gen("continue")("}");
        }
        if (i) gen("}");
        gen("r.skipType(%s,q,t)", i ? "u" : "t&7");
        genPreserveUnknown(gen, "r.raw(s,r.pos)")("}")("if(z!==undefined)")('throw Error("missing end group")');
        for (i = 0; i < mtype._fieldsArray.length; ++i) {
          var rfield = mtype._fieldsArray[i];
          if (rfield.required) gen("if(!Object.hasOwnProperty.call(m,%j))", rfield.name)("throw util.ProtocolError(%j,{instance:m})", missing(rfield));
        }
        return gen("return m");
      }
    }
  });

  // node_modules/protobufjs/src/verifier.js
  var require_verifier = __commonJS({
    "node_modules/protobufjs/src/verifier.js"(exports2, module2) {
      "use strict";
      module2.exports = verifier;
      var Enum = require_enum();
      var util = require_util();
      function invalid(field, expected) {
        return field.name + ": " + expected + (field.repeated && expected !== "array" ? "[]" : field.map && expected !== "object" ? "{k:" + field.keyType + "}" : "") + " expected";
      }
      function genVerifyValue(gen, field, fieldIndex, ref) {
        var resolvedType = field.resolvedType;
        if (resolvedType) {
          if (resolvedType instanceof Enum) {
            if (resolvedType._features.enum_type === "CLOSED") {
              gen("switch(%s){", ref)("default:")("return%j", invalid(field, "enum value"));
              for (var keys = Object.keys(resolvedType.values), j = 0; j < keys.length; ++j) gen("case %i:", resolvedType.values[keys[j]]);
              gen("break")("}");
            } else gen('if(typeof %s!=="number"||(%s|0)!==%s)', ref, ref, ref)("return%j", invalid(field, "enum value"));
          } else {
            gen("{")("var e=types[%i].verify(%s,q+1);", fieldIndex, ref)("if(e)")("return%j+e", field.name + ".")("}");
          }
        } else {
          switch (field.type) {
            case "int32":
            case "uint32":
            case "sint32":
            case "fixed32":
            case "sfixed32":
              gen("if(!util.isInteger(%s))", ref)("return%j", invalid(field, "integer"));
              break;
            case "int64":
            case "uint64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
              gen("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", ref, ref, ref, ref)("return%j", invalid(field, "integer|Long"));
              break;
            case "float":
            case "double":
              gen('if(typeof %s!=="number")', ref)("return%j", invalid(field, "number"));
              break;
            case "bool":
              gen('if(typeof %s!=="boolean")', ref)("return%j", invalid(field, "boolean"));
              break;
            case "string":
              gen("if(!util.isString(%s))", ref)("return%j", invalid(field, "string"));
              break;
            case "bytes":
              gen('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))', ref, ref, ref)("return%j", invalid(field, "buffer"));
              break;
          }
        }
        return gen;
      }
      function genVerifyKey(gen, field, ref) {
        switch (field.keyType) {
          case "int32":
          case "uint32":
          case "sint32":
          case "fixed32":
          case "sfixed32":
            gen("if(!util.key32Re.test(%s))", ref)("return%j", invalid(field, "integer key"));
            break;
          case "int64":
          case "uint64":
          case "sint64":
          case "fixed64":
          case "sfixed64":
            gen("if(!util.key64Re.test(%s))", ref)("return%j", invalid(field, "integer|Long key"));
            break;
          case "bool":
            gen("if(!util.key2Re.test(%s))", ref)("return%j", invalid(field, "boolean key"));
            break;
        }
        return gen;
      }
      function verifier(mtype) {
        var gen = util.codegen(["m", "q"])('if(typeof m!=="object"||m===null)')("return%j", "object expected")("if(q===undefined)q=0")("if(q>util.recursionLimit)")("return%j", "max depth exceeded");
        var oneofs = mtype.oneofsArray, seenFirstField = {};
        if (oneofs.length) gen("var p={}");
        for (var i = 0; i < /* initializes */
        mtype.fieldsArray.length; ++i) {
          var field = mtype._fieldsArray[i].resolve(), ref = "m" + util.safeProp(field.name);
          if (field.optional) gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", ref, field.name);
          if (field.map) {
            gen("if(!util.isObject(%s))", ref)("return%j", invalid(field, "object"))("var k=Object.keys(%s)", ref)("for(var i=0;i<k.length;++i){");
            genVerifyKey(gen, field, "k[i]");
            genVerifyValue(gen, field, i, ref + "[k[i]]")("}");
          } else if (field.repeated) {
            gen("if(!Array.isArray(%s))", ref)("return%j", invalid(field, "array"))("for(var i=0;i<%s.length;++i){", ref);
            genVerifyValue(gen, field, i, ref + "[i]")("}");
          } else {
            if (field.partOf) {
              var oneofProp = util.safeProp(field.partOf.name);
              if (seenFirstField[field.partOf.name] === 1) gen("if(p%s===1)", oneofProp)("return%j", field.partOf.name + ": multiple values");
              seenFirstField[field.partOf.name] = 1;
              gen("p%s=1", oneofProp);
            }
            genVerifyValue(gen, field, i, ref);
          }
          if (field.optional) gen("}");
        }
        return gen("return null");
      }
    }
  });

  // node_modules/protobufjs/src/converter.js
  var require_converter = __commonJS({
    "node_modules/protobufjs/src/converter.js"(exports2) {
      "use strict";
      var converter = exports2;
      var Enum = require_enum();
      var types = require_types();
      var util = require_util();
      function genValuePartial_fromObject(gen, field, fieldIndex, prop, dstProp) {
        if (field.resolvedType) {
          if (field.resolvedType instanceof Enum) {
            var dst = dstProp ? "m" + dstProp + "[m" + dstProp + ".length]" : "m" + prop;
            gen("switch(d%s){", prop);
            for (var values = field.resolvedType.values, keys = Object.keys(values), i = 0; i < keys.length; ++i) {
              gen("case%j:", keys[i])("case %i:", values[keys[i]])("%s=%j", dst, values[keys[i]])("break");
            }
            gen("default:");
            if (field.resolvedType._features.enum_type !== "CLOSED") {
              gen('if(typeof d%s==="number"&&(d%s|0)===d%s)', prop, prop, prop)("%s=d%s", dst, prop);
            }
            gen("}");
          } else gen("if(!util.isObject(d%s))", prop)("throw TypeError(%j)", field.fullName + ": object expected")("m%s=types[%i].fromObject(d%s,q+1)", prop, fieldIndex, prop);
        } else {
          var isUnsigned = false;
          switch (field.type) {
            case "double":
            case "float":
              gen("m%s=Number(d%s)", prop, prop);
              break;
            case "uint32":
            case "fixed32":
              gen("m%s=d%s>>>0", prop, prop);
              break;
            case "int32":
            case "sint32":
            case "sfixed32":
              gen("m%s=d%s|0", prop, prop);
              break;
            case "uint64":
            case "fixed64":
              isUnsigned = true;
            // eslint-disable-next-line no-fallthrough
            case "int64":
            case "sint64":
            case "sfixed64":
              gen("if(util.Long)")("m%s=util.Long.fromValue(d%s,%j)", prop, prop, isUnsigned)('else if(typeof d%s==="string")', prop)("m%s=parseInt(d%s,10)", prop, prop)('else if(typeof d%s==="number")', prop)("m%s=d%s", prop, prop)('else if(typeof d%s==="object")', prop)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", prop, prop, prop, isUnsigned ? "true" : "");
              break;
            case "bytes":
              gen('if(typeof d%s==="string")', prop)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", prop, prop, prop)("else if(d%s.length>=0)", prop)("m%s=d%s", prop, prop);
              break;
            case "string":
              gen("m%s=String(d%s)", prop, prop);
              break;
            case "bool":
              gen("m%s=Boolean(d%s)", prop, prop);
              break;
          }
        }
        return gen;
      }
      converter.fromObject = function fromObject(mtype) {
        var fields = mtype.fieldsArray;
        var gen = util.codegen(["d", "q"])("if(d instanceof C)")("return d")("if(!util.isObject(d))")("throw TypeError(%j)", mtype.fullName + ": object expected")("if(q===undefined)q=0")("if(q>util.recursionLimit)")('throw Error("max depth exceeded")');
        if (!fields.length) return gen("return new C");
        gen("var m=new C");
        for (var i = 0; i < fields.length; ++i) {
          var field = fields[i].resolve(), prop = util.safeProp(field.name), implicitPresence = !field.hasPresence && !field.repeated && !field.map && (field.resolvedType instanceof Enum || types.basic[field.type] !== void 0);
          if (field.map) {
            gen("if(d%s){", prop)("if(!util.isObject(d%s))", prop)("throw TypeError(%j)", field.fullName + ": object expected")("m%s={}", prop)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", prop);
            gen('if(ks[i]==="__proto__")')("util.makeProp(m%s,ks[i])", prop);
            genValuePartial_fromObject(
              gen,
              field,
              /* not sorted */
              i,
              prop + "[ks[i]]"
            )("}")("}");
          } else if (field.repeated) {
            gen("if(d%s){", prop)("if(!Array.isArray(d%s))", prop)("throw TypeError(%j)", field.fullName + ": array expected");
            if (field.resolvedType instanceof Enum) gen("m%s=[]", prop);
            else gen("m%s=Array(d%s.length)", prop, prop);
            gen("for(var i=0;i<d%s.length;++i){", prop);
            genValuePartial_fromObject(
              gen,
              field,
              /* not sorted */
              i,
              prop + "[i]",
              field.resolvedType instanceof Enum ? prop : void 0
            )("}")("}");
          } else {
            if (!(field.resolvedType instanceof Enum)) gen("if(d%s!=null){", prop);
            if (implicitPresence) {
              if (field.resolvedType instanceof Enum) gen('if(d%s!==%j&&(typeof d%s!=="string"||types[%i].values[d%s]!==%j)){', prop, field.typeDefault, prop, i, prop, field.typeDefault);
              else if (field.type === "string") gen('if(typeof d%s!=="string"||d%s.length){', prop, prop);
              else if (field.type === "bytes") gen("if(d%s.length){", prop);
              else if (field.type === "bool") gen("if(d%s){", prop);
              else if (field.type === "double" || field.type === "float") gen("if(!Object.is(Number(d%s),0)){", prop);
              else if (types.long[field.type] !== void 0) gen('if(typeof d%s==="object"?d%s.low||d%s.high:Number(d%s)!==0){', prop, prop, prop, prop);
              else gen("if(Number(d%s)!==0){", prop);
            }
            genValuePartial_fromObject(
              gen,
              field,
              /* not sorted */
              i,
              prop
            );
            if (implicitPresence) gen("}");
            if (!(field.resolvedType instanceof Enum)) gen("}");
          }
        }
        return gen("return m");
      };
      function genValuePartial_toObject(gen, field, fieldIndex, dstProp, srcProp) {
        if (!srcProp)
          srcProp = dstProp;
        if (field.resolvedType) {
          if (field.resolvedType instanceof Enum) gen("d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s", dstProp, fieldIndex, srcProp, srcProp, fieldIndex, srcProp, srcProp);
          else gen("d%s=types[%i].toObject(m%s,o,q+1)", dstProp, fieldIndex, srcProp);
        } else {
          var isUnsigned = false;
          switch (field.type) {
            case "double":
            case "float":
              gen("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", dstProp, srcProp, srcProp, srcProp);
              break;
            case "uint64":
            case "fixed64":
              isUnsigned = true;
            // eslint-disable-next-line no-fallthrough
            case "int64":
            case "sint64":
            case "sfixed64":
              gen('if(typeof BigInt!=="undefined"&&o.longs===BigInt)')('d%s=typeof m%s==="number"?BigInt(m%s):util.Long.fromBits(m%s.low>>>0,m%s.high>>>0,%j).toBigInt()', dstProp, srcProp, srcProp, srcProp, srcProp, isUnsigned)('else if(typeof m%s==="number")', srcProp)("d%s=o.longs===String?String(m%s):m%s", dstProp, srcProp, srcProp)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s", dstProp, srcProp, srcProp, srcProp, isUnsigned ? "true" : "", srcProp);
              break;
            case "bytes":
              gen("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s", dstProp, srcProp, srcProp, srcProp, srcProp);
              break;
            default:
              gen("d%s=m%s", dstProp, srcProp);
              break;
          }
        }
        return gen;
      }
      converter.toObject = function toObject(mtype) {
        var fields = mtype.fieldsArray.slice().sort(util.compareFieldsById);
        if (!fields.length)
          return util.codegen()("return {}");
        var gen = util.codegen(["m", "o", "q"])("if(!o)")("o={}")("if(q===undefined)q=0")("if(q>util.recursionLimit)")('throw Error("max depth exceeded")')("var d={}");
        var repeatedFields = [], mapFields = [], normalFields = [], i = 0;
        for (; i < fields.length; ++i)
          if (!fields[i].partOf)
            (fields[i].resolve().repeated ? repeatedFields : fields[i].map ? mapFields : normalFields).push(fields[i]);
        if (repeatedFields.length) {
          gen("if(o.arrays||o.defaults){");
          for (i = 0; i < repeatedFields.length; ++i) gen("d%s=[]", util.safeProp(repeatedFields[i].name));
          gen("}");
        }
        if (mapFields.length) {
          gen("if(o.objects||o.defaults){");
          for (i = 0; i < mapFields.length; ++i) gen("d%s={}", util.safeProp(mapFields[i].name));
          gen("}");
        }
        if (normalFields.length) {
          gen("if(o.defaults){");
          for (i = 0; i < normalFields.length; ++i) {
            var field = normalFields[i], prop = util.safeProp(field.name);
            if (field.resolvedType instanceof Enum) gen("d%s=o.enums===String?%j:%j", prop, field.resolvedType.valuesById[field.typeDefault], field.typeDefault);
            else if (field.long) gen("if(util.Long){")("var n=new util.Long(%i,%i,%j)", field.typeDefault.low, field.typeDefault.high, field.typeDefault.unsigned)('d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():typeof BigInt!=="undefined"&&o.longs===BigInt?n.toBigInt():n', prop)("}else")('d%s=o.longs===String?%j:typeof BigInt!=="undefined"&&o.longs===BigInt?BigInt(%j):%i', prop, field.typeDefault.toString(), field.typeDefault.toString(), field.typeDefault.toNumber());
            else if (field.bytes) {
              var arrayDefault = Array.prototype.slice.call(field.typeDefault);
              gen("if(o.bytes===String)d%s=%j", prop, util.base64.encode(field.typeDefault, 0, field.typeDefault.length))("else{")("d%s=%j", prop, arrayDefault)("if(o.bytes!==Array)d%s=util.newBuffer(d%s)", prop, prop)("}");
            } else if ((field.type === "double" || field.type === "float") && typeof field.typeDefault === "number" && (!isFinite(field.typeDefault) || Object.is(field.typeDefault, -0))) gen("d%s=%f", prop, field.typeDefault)("if(o.json&&!isFinite(d%s))d%s=String(d%s)", prop, prop, prop);
            else gen("d%s=%j", prop, field.typeDefault);
          }
          gen("}");
        }
        var hasKs2 = false;
        for (i = 0; i < fields.length; ++i) {
          var field = fields[i], index = mtype._fieldsArray.indexOf(field), prop = util.safeProp(field.name);
          if (field.map) {
            if (!hasKs2) {
              hasKs2 = true;
              gen("var ks2");
            }
            gen("if(m%s&&(ks2=Object.keys(m%s)).length){", prop, prop)("d%s={}", prop);
            var longKey = types.long[field.keyType] !== void 0, srcProp = prop + "[ks2[j]]";
            gen("for(var j=0;j<ks2.length;++j){");
            if (longKey) gen("var k2=util.longFromKey(ks2[j],%j).toString()", field.keyType === "uint64" || field.keyType === "fixed64");
            gen('if(ks2[j]==="__proto__")')("util.makeProp(d%s,ks2[j])", prop);
            genValuePartial_toObject(
              gen,
              field,
              /* sorted */
              index,
              longKey ? prop + "[k2]" : srcProp,
              srcProp
            )("}");
          } else if (field.repeated) {
            gen("if(m%s&&m%s.length){", prop, prop)("d%s=Array(m%s.length)", prop, prop)("for(var j=0;j<m%s.length;++j){", prop);
            genValuePartial_toObject(
              gen,
              field,
              /* sorted */
              index,
              prop + "[j]"
            )("}");
          } else {
            gen("if(m%s!=null&&Object.hasOwnProperty.call(m,%j)){", prop, field.name);
            genValuePartial_toObject(
              gen,
              field,
              /* sorted */
              index,
              prop
            );
            if (field.partOf && !field.partOf.isProto3Optional) gen("if(o.oneofs)")("d%s=%j", util.safeProp(field.partOf.name), field.name);
          }
          gen("}");
        }
        return gen("return d");
      };
    }
  });

  // node_modules/protobufjs/src/wrappers.js
  var require_wrappers = __commonJS({
    "node_modules/protobufjs/src/wrappers.js"(exports2) {
      "use strict";
      var wrappers = exports2;
      var Message = require_message();
      var util = require_minimal();
      wrappers[".google.protobuf.Any"] = {
        fromObject: function(object, depth) {
          if (object && object["@type"]) {
            var name = object["@type"].substring(object["@type"].lastIndexOf("/") + 1);
            var type = this.lookup(name, [this.constructor]);
            if (type) {
              var type_url = object["@type"].charAt(0) === "." ? object["@type"].slice(1) : object["@type"];
              if (type_url.indexOf("/") === -1) {
                type_url = "/" + type_url;
              }
              return this.create({
                type_url,
                value: type.encode(type.fromObject(object, depth === void 0 ? 1 : depth + 1)).finish()
              });
            }
          }
          return this.fromObject(object, depth);
        },
        toObject: function(message, options, depth) {
          if (depth === void 0)
            depth = 0;
          if (depth > util.recursionLimit)
            throw Error("max depth exceeded");
          var googleApi = "type.googleapis.com/";
          var prefix = "";
          var name = "";
          if (options && options.json && message.type_url && message.value) {
            name = message.type_url.substring(message.type_url.lastIndexOf("/") + 1);
            prefix = message.type_url.substring(0, message.type_url.lastIndexOf("/") + 1);
            var type = this.lookup(name, [this.constructor]);
            if (type)
              message = type.decode(message.value, void 0, void 0, depth + 1);
          }
          if (!(message instanceof this.ctor) && message instanceof Message) {
            var object = message.$type.toObject(message, options, depth + 1);
            var messageName = message.$type.fullName[0] === "." ? message.$type.fullName.slice(1) : message.$type.fullName;
            if (prefix === "") {
              prefix = googleApi;
            }
            name = prefix + messageName;
            object["@type"] = name;
            return object;
          }
          return this.toObject(message, options, depth);
        }
      };
    }
  });

  // node_modules/protobufjs/src/type.js
  var require_type = __commonJS({
    "node_modules/protobufjs/src/type.js"(exports2, module2) {
      "use strict";
      module2.exports = Type;
      var Namespace = require_namespace();
      Type.prototype = Object.create(Namespace.prototype, {
        constructor: {
          value: Type,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      Type.className = "Type";
      var Enum = require_enum();
      var OneOf = require_oneof();
      var Field = require_field();
      var MapField = require_mapfield();
      var Service = require_service2();
      var Message = require_message();
      var Reader = require_reader();
      var Writer = require_writer();
      var util = require_util();
      var encoder = require_encoder();
      var decoder = require_decoder();
      var verifier = require_verifier();
      var converter = require_converter();
      var wrappers = require_wrappers();
      function Type(name, options) {
        name = name.replace(/\W/g, "");
        Namespace.call(this, name, options);
        this.fields = {};
        this.oneofs = void 0;
        this.extensions = void 0;
        this.reserved = void 0;
        this.group = void 0;
        this._fieldsById = null;
        this._fieldsArray = null;
        this._oneofsArray = null;
        this._ctor = null;
        this._fieldsByJsonName = null;
      }
      Object.defineProperties(Type.prototype, {
        /**
         * Message fields by id.
         * @name Type#fieldsById
         * @type {Object.<number,Field>}
         * @readonly
         */
        fieldsById: {
          get: function() {
            if (this._fieldsById)
              return this._fieldsById;
            this._fieldsById = {};
            for (var names = Object.keys(this.fields), i = 0; i < names.length; ++i) {
              var field = this.fields[names[i]], id = field.id;
              if (this._fieldsById[id])
                throw Error("duplicate id " + id + " in " + this);
              this._fieldsById[id] = field;
            }
            return this._fieldsById;
          }
        },
        /**
         * Fields of this message as an array for iteration.
         * @name Type#fieldsArray
         * @type {Field[]}
         * @readonly
         */
        fieldsArray: {
          get: function() {
            return this._fieldsArray || (this._fieldsArray = util.toArray(this.fields));
          }
        },
        /**
         * Oneofs of this message as an array for iteration.
         * @name Type#oneofsArray
         * @type {OneOf[]}
         * @readonly
         */
        oneofsArray: {
          get: function() {
            return this._oneofsArray || (this._oneofsArray = util.toArray(this.oneofs));
          }
        },
        /**
         * The registered constructor, if any registered, otherwise a generic constructor.
         * Assigning a function replaces the internal constructor. If the function does not extend {@link Message} yet, its prototype will be setup accordingly and static methods will be populated. If it already extends {@link Message}, it will just replace the internal constructor.
         * When assigning manually, add the type to its parent namespace/root first if fields reference other reflected types, because constructor setup resolves field defaults.
         * @name Type#ctor
         * @type {Constructor<{}>}
         */
        ctor: {
          get: function() {
            return this._ctor || (this.ctor = Type.generateConstructor(this)());
          },
          set: function(ctor) {
            var prototype = ctor.prototype;
            if (!(prototype instanceof Message)) {
              ctor.prototype = new Message();
              Object.defineProperty(ctor.prototype, "constructor", {
                value: ctor,
                writable: true,
                enumerable: false,
                configurable: true
              });
              util.merge(ctor.prototype, prototype);
            }
            ctor.$type = ctor.prototype.$type = this;
            util.merge(ctor, Message, true);
            this._ctor = ctor;
            delete this.decode;
            delete this.fromObject;
            var i = 0;
            for (var field; i < /* initializes */
            this.fieldsArray.length; ++i) {
              field = this._fieldsArray[i].resolve();
              ctor.prototype[field.name] = field.defaultValue;
            }
            var ctorProperties = {};
            for (i = 0; i < /* initializes */
            this.oneofsArray.length; ++i)
              ctorProperties[this._oneofsArray[i].resolve().name] = {
                get: util.oneOfGetter(this._oneofsArray[i].oneof),
                set: util.oneOfSetter(this._oneofsArray[i].oneof)
              };
            if (i)
              Object.defineProperties(ctor.prototype, ctorProperties);
          }
        }
      });
      Type.generateConstructor = function generateConstructor(mtype) {
        var gen = util.codegen(["p"]);
        for (var i = 0, field; i < mtype.fieldsArray.length; ++i)
          if ((field = mtype._fieldsArray[i]).map) gen("this%s={}", util.safeProp(field.name));
          else if (field.repeated) gen("this%s=[]", util.safeProp(field.name));
        return gen('if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null&&ks[i]!=="__proto__")')("this[ks[i]]=p[ks[i]]");
      };
      function clearCache(type) {
        type._fieldsById = type._fieldsArray = type._oneofsArray = type._fieldsByJsonName = null;
        delete type.encode;
        delete type.decode;
        delete type.verify;
        return type;
      }
      Type.fromJSON = function fromJSON(name, json, depth) {
        if (depth === void 0)
          depth = 0;
        if (depth > util.nestingLimit)
          throw Error("max depth exceeded");
        var type = new Type(name, json.options);
        type.extensions = json.extensions;
        type.reserved = json.reserved;
        var names = Object.keys(json.fields), i = 0;
        for (; i < names.length; ++i)
          type.add(
            (typeof json.fields[names[i]].keyType !== "undefined" ? MapField.fromJSON : Field.fromJSON)(names[i], json.fields[names[i]])
          );
        if (json.oneofs)
          for (names = Object.keys(json.oneofs), i = 0; i < names.length; ++i)
            type.add(OneOf.fromJSON(names[i], json.oneofs[names[i]]));
        if (json.nested)
          for (names = Object.keys(json.nested), i = 0; i < names.length; ++i) {
            var nested = json.nested[names[i]];
            type.add(
              // most to least likely
              (nested.id !== void 0 ? Field.fromJSON : nested.fields !== void 0 ? Type.fromJSON : nested.values !== void 0 ? Enum.fromJSON : nested.methods !== void 0 ? Service.fromJSON : Namespace.fromJSON)(names[i], nested, depth + 1)
            );
          }
        if (json.extensions && json.extensions.length)
          type.extensions = json.extensions;
        if (json.reserved && json.reserved.length)
          type.reserved = json.reserved;
        if (json.group)
          type.group = true;
        if (json.comment)
          type.comment = json.comment;
        if (json.edition)
          type._edition = json.edition;
        type._defaultEdition = "proto3";
        return type;
      };
      Type.prototype.toJSON = function toJSON(toJSONOptions) {
        var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "edition",
          this._editionToJSON(),
          "options",
          inherited && inherited.options || void 0,
          "oneofs",
          Namespace.arrayToJSON(this.oneofsArray, toJSONOptions),
          "fields",
          Namespace.arrayToJSON(this.fieldsArray.filter(function(obj) {
            return !obj.declaringField;
          }), toJSONOptions) || {},
          "extensions",
          this.extensions && this.extensions.length ? this.extensions : void 0,
          "reserved",
          this.reserved && this.reserved.length ? this.reserved : void 0,
          "group",
          this.group || void 0,
          "nested",
          inherited && inherited.nested || void 0,
          "comment",
          keepComments ? this.comment : void 0
        ]);
      };
      Type.prototype.resolveAll = function resolveAll() {
        if (!this._needsRecursiveResolve) return this;
        Namespace.prototype.resolveAll.call(this);
        var oneofs = this.oneofsArray;
        i = 0;
        while (i < oneofs.length)
          oneofs[i++].resolve();
        var fields = this.fieldsArray, i = 0;
        while (i < fields.length)
          fields[i++].resolve();
        return this;
      };
      Type.prototype._resolveFeaturesRecursive = function _resolveFeaturesRecursive(edition) {
        if (!this._needsRecursiveFeatureResolution) return this;
        edition = this._edition || edition;
        Namespace.prototype._resolveFeaturesRecursive.call(this, edition);
        this.oneofsArray.forEach((oneof) => {
          oneof._resolveFeatures(edition);
        });
        this.fieldsArray.forEach((field) => {
          field._resolveFeatures(edition);
        });
        return this;
      };
      Type.prototype.get = function get(name) {
        if (Object.prototype.hasOwnProperty.call(this.fields, name))
          return this.fields[name];
        if (this.oneofs && Object.prototype.hasOwnProperty.call(this.oneofs, name))
          return this.oneofs[name];
        if (this.nested && Object.prototype.hasOwnProperty.call(this.nested, name))
          return this.nested[name];
        return null;
      };
      Type.prototype.add = function add(object) {
        if (this.get(object.name))
          throw Error("duplicate name '" + object.name + "' in " + this);
        if (object instanceof Field && object.extend === void 0) {
          if (this._fieldsById ? (
            /* istanbul ignore next */
            this._fieldsById[object.id]
          ) : this.fieldsById[object.id])
            throw Error("duplicate id " + object.id + " in " + this);
          if (this.isReservedId(object.id))
            throw Error("id " + object.id + " is reserved in " + this);
          if (this.isReservedName(object.name) || object.name.charAt(0) === "$")
            throw Error("name '" + object.name + "' is reserved in " + this);
          if (object.name === "__proto__")
            return this;
          if (object.parent)
            object.parent.remove(object);
          this.fields[object.name] = object;
          object.message = this;
          object.onAdd(this);
          return clearCache(this);
        }
        if (object instanceof OneOf) {
          if (object.name.charAt(0) === "$")
            throw Error("name '" + object.name + "' is reserved in " + this);
          if (object.name === "__proto__")
            return this;
          if (!this.oneofs)
            this.oneofs = {};
          this.oneofs[object.name] = object;
          object.onAdd(this);
          return clearCache(this);
        }
        return Namespace.prototype.add.call(this, object);
      };
      Type.prototype.remove = function remove(object) {
        if (object instanceof Field && object.extend === void 0) {
          if (!util.remove(this.fields, object, object.name))
            throw Error(object + " is not a member of " + this);
          object.parent = null;
          object.onRemove(this);
          return clearCache(this);
        }
        if (object instanceof OneOf) {
          if (!util.remove(this.oneofs, object, object.name))
            throw Error(object + " is not a member of " + this);
          object.parent = null;
          object.onRemove(this);
          return clearCache(this);
        }
        return Namespace.prototype.remove.call(this, object);
      };
      Type.prototype.isReservedId = function isReservedId(id) {
        return Namespace.isReservedId(this.reserved, id);
      };
      Type.prototype.isReservedName = function isReservedName(name) {
        return Namespace.isReservedName(this.reserved, name);
      };
      Type.prototype.create = function create(properties) {
        return new this.ctor(properties);
      };
      Type.prototype.setup = function setup() {
        var root2 = this.root;
        if (root2 && root2._needsRecursiveFeatureResolution) {
          var edition = root2._edition || this._edition;
          if (edition)
            root2._resolveFeaturesRecursive(edition);
        }
        var fullName = this.fullName, types = [];
        for (var i = 0; i < /* initializes */
        this.fieldsArray.length; ++i)
          types.push(this._fieldsArray[i].resolve().resolvedType);
        this.encode = encoder(this)({
          Writer,
          types,
          util
        });
        this.decode = decoder(this)({
          Reader,
          types,
          util,
          C: this.ctor
        });
        this.verify = verifier(this)({
          types,
          util
        });
        this.fromObject = converter.fromObject(this)({
          types,
          util,
          C: this.ctor
        });
        this.toObject = converter.toObject(this)({
          types,
          util
        });
        var wrapper = wrappers[fullName];
        if (wrapper) {
          var wrapperThis = Object.create(this);
          wrapperThis._ctor = this.ctor;
          wrapperThis.fromObject = this.fromObject;
          this.fromObject = wrapper.fromObject.bind(wrapperThis);
          wrapperThis.toObject = this.toObject;
          this.toObject = wrapper.toObject.bind(wrapperThis);
        }
        return this;
      };
      Type.prototype.encode = function encode_setup(message, writer) {
        return this.setup().encode.apply(this, arguments);
      };
      Type.prototype.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, (writer || Writer.create()).fork()).ldelim();
      };
      Type.prototype.decode = function decode_setup(reader, length) {
        return this.setup().decode.apply(this, arguments);
      };
      Type.prototype.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof Reader))
          reader = Reader.create(reader);
        return this.decode(reader, reader.uint32());
      };
      Type.prototype.verify = function verify_setup(message) {
        return this.setup().verify.apply(this, arguments);
      };
      Type.prototype.fromObject = function fromObject(object) {
        return this.setup().fromObject.apply(this, arguments);
      };
      Type.prototype.toObject = function toObject(message, options) {
        return this.setup().toObject.apply(this, arguments);
      };
      Type.prototype.getTypeUrl = function getTypeUrl(prefix) {
        if (prefix === void 0)
          prefix = "type.googleapis.com";
        var fullName = this.fullName;
        return prefix + "/" + (fullName.charAt(0) === "." ? fullName.substring(1) : fullName);
      };
      Type.d = function decorateType(typeName) {
        return function typeDecorator(target) {
          util.decorateType(target, typeName);
        };
      };
    }
  });

  // node_modules/protobufjs/src/root.js
  var require_root = __commonJS({
    "node_modules/protobufjs/src/root.js"(exports2, module2) {
      "use strict";
      module2.exports = Root;
      var Namespace = require_namespace();
      Root.prototype = Object.create(Namespace.prototype, {
        constructor: {
          value: Root,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      Root.className = "Root";
      var Field = require_field();
      var Enum = require_enum();
      var OneOf = require_oneof();
      var util = require_util();
      var Type;
      var parse2;
      var common;
      function Root(options) {
        Namespace.call(this, "", options);
        this.deferred = [];
        this.files = [];
        this._edition = "proto2";
        this._fullyQualifiedObjects = {};
      }
      Root.fromJSON = function fromJSON(json, root2, depth) {
        if (depth === void 0)
          depth = 0;
        if (depth > util.recursionLimit)
          throw Error("max depth exceeded");
        if (!root2)
          root2 = new Root();
        if (json.options)
          root2.setOptions(json.options);
        return root2.addJSON(json.nested, depth).resolveAll();
      };
      Root.prototype.resolvePath = util.path.resolve;
      Root.prototype.fetch = util.fetch;
      function SYNC() {
      }
      Root.prototype.load = function load(filename, options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = void 0;
        }
        var self2 = this;
        if (!callback) {
          return util.asPromise(load, self2, filename, options);
        }
        var sync = callback === SYNC;
        function finish(err, root2) {
          if (!callback) {
            return;
          }
          if (sync) {
            throw err;
          }
          if (root2) {
            root2.resolveAll();
          }
          var cb = callback;
          callback = null;
          cb(err, root2);
        }
        function getBundledFileName(filename2) {
          var idx = filename2.lastIndexOf("google/protobuf/");
          if (idx > -1) {
            var altname = filename2.substring(idx);
            if (Object.prototype.hasOwnProperty.call(common, altname)) return altname;
          }
          if (Object.prototype.hasOwnProperty.call(common, filename2)) return filename2;
          return null;
        }
        function process(filename2, source, depth) {
          if (depth === void 0)
            depth = 0;
          try {
            if (depth > util.recursionLimit)
              throw Error("max depth exceeded");
            if (util.isString(source) && source.charAt(0) === "{")
              source = JSON.parse(source);
            if (!util.isString(source))
              self2.setOptions(source.options).addJSON(source.nested);
            else {
              parse2.filename = filename2;
              var parsed = parse2(source, self2, options), resolved2, i2 = 0;
              if (parsed.imports) {
                for (; i2 < parsed.imports.length; ++i2)
                  if (resolved2 = getBundledFileName(parsed.imports[i2]) || self2.resolvePath(filename2, parsed.imports[i2]))
                    fetch(resolved2, false, depth + 1);
              }
              if (parsed.weakImports) {
                for (i2 = 0; i2 < parsed.weakImports.length; ++i2)
                  if (resolved2 = getBundledFileName(parsed.weakImports[i2]) || self2.resolvePath(filename2, parsed.weakImports[i2]))
                    fetch(resolved2, true, depth + 1);
              }
            }
          } catch (err) {
            finish(err);
          }
          if (!sync && !queued) {
            finish(null, self2);
          }
        }
        function fetch(filename2, weak, depth) {
          if (depth === void 0)
            depth = 0;
          filename2 = getBundledFileName(filename2) || filename2;
          if (self2.files.indexOf(filename2) > -1) {
            return;
          }
          self2.files.push(filename2);
          if (Object.prototype.hasOwnProperty.call(common, filename2)) {
            if (sync) {
              process(filename2, common[filename2], depth);
            } else {
              ++queued;
              setTimeout(function() {
                --queued;
                process(filename2, common[filename2], depth);
              });
            }
            return;
          }
          if (sync) {
            var source;
            try {
              source = util.fs.readFileSync(filename2).toString("utf8");
            } catch (err) {
              if (!weak)
                finish(err);
              return;
            }
            process(filename2, source, depth);
          } else {
            ++queued;
            self2.fetch(filename2, function(err, source2) {
              --queued;
              if (!callback) {
                return;
              }
              if (err) {
                if (!weak)
                  finish(err);
                else if (!queued)
                  finish(null, self2);
                return;
              }
              process(filename2, source2, depth);
            });
          }
        }
        var queued = 0;
        if (util.isString(filename)) {
          filename = [filename];
        }
        for (var i = 0, resolved; i < filename.length; ++i)
          if (resolved = self2.resolvePath("", filename[i]))
            fetch(resolved);
        if (sync) {
          self2.resolveAll();
          return self2;
        }
        if (!queued) {
          finish(null, self2);
        }
        return self2;
      };
      Root.prototype.loadSync = function loadSync(filename, options) {
        if (!util.isNode)
          throw Error("not supported");
        return this.load(filename, options, SYNC);
      };
      Root.prototype.resolveAll = function resolveAll() {
        if (!this._needsRecursiveResolve) return this;
        if (this.deferred.length)
          throw Error("unresolvable extensions: " + this.deferred.map(function(field) {
            return "'extend " + field.extend + "' in " + field.parent.fullName;
          }).join(", "));
        return Namespace.prototype.resolveAll.call(this);
      };
      var exposeRe = /^[A-Z]/;
      function tryHandleExtension(root2, field) {
        var extendedType = field.parent.lookup(field.extend);
        if (extendedType) {
          var sisterField = new Field(field.fullName, field.id, field.type, field.rule, void 0, field.options);
          if (extendedType.get(sisterField.name)) {
            return true;
          }
          sisterField.declaringField = field;
          field.extensionField = sisterField;
          extendedType.add(sisterField);
          return true;
        }
        return false;
      }
      Root.prototype._handleAdd = function _handleAdd(object) {
        if (object instanceof Field) {
          if (
            /* an extension field (implies not part of a oneof) */
            object.extend !== void 0 && /* not already handled */
            !object.extensionField
          ) {
            if (!tryHandleExtension(this, object))
              this.deferred.push(object);
          }
        } else if (object instanceof Enum) {
          if (exposeRe.test(object.name))
            object.parent[object.name] = object.values;
        } else if (!(object instanceof OneOf)) {
          if (object instanceof Type)
            for (var i = 0; i < this.deferred.length; )
              if (tryHandleExtension(this, this.deferred[i]))
                this.deferred.splice(i, 1);
              else
                ++i;
          for (var j = 0; j < /* initializes */
          object.nestedArray.length; ++j)
            this._handleAdd(object._nestedArray[j]);
          if (exposeRe.test(object.name))
            object.parent[object.name] = object;
        }
        if (object instanceof Type || object instanceof Enum || object instanceof Field) {
          this._fullyQualifiedObjects[object.fullName] = object;
        }
      };
      Root.prototype._handleRemove = function _handleRemove(object) {
        if (object instanceof Field) {
          if (
            /* an extension field */
            object.extend !== void 0
          ) {
            if (
              /* already handled */
              object.extensionField
            ) {
              object.extensionField.parent.remove(object.extensionField);
              object.extensionField = null;
            } else {
              var index = this.deferred.indexOf(object);
              if (index > -1)
                this.deferred.splice(index, 1);
            }
          }
        } else if (object instanceof Enum) {
          if (exposeRe.test(object.name))
            delete object.parent[object.name];
        } else if (object instanceof Namespace) {
          for (var i = 0; i < /* initializes */
          object.nestedArray.length; ++i)
            this._handleRemove(object._nestedArray[i]);
          if (exposeRe.test(object.name))
            delete object.parent[object.name];
        }
        delete this._fullyQualifiedObjects[object.fullName];
      };
      Root._configure = function(Type_, parse_, common_) {
        Type = Type_;
        parse2 = parse_;
        common = common_;
      };
    }
  });

  // node_modules/protobufjs/src/util.js
  var require_util = __commonJS({
    "node_modules/protobufjs/src/util.js"(exports2, module2) {
      "use strict";
      var util = module2.exports = require_minimal();
      var roots = require_roots();
      var Type;
      var Enum;
      util.codegen = require_codegen();
      util.fetch = require_fetch();
      util.path = require_path();
      util.patterns = require_patterns();
      var reservedRe = util.patterns.reservedRe;
      util.fs = require_fs2();
      util.toArray = function toArray(object) {
        if (object) {
          var keys = Object.keys(object), array = new Array(keys.length), index = 0;
          while (index < keys.length)
            array[index] = object[keys[index++]];
          return array;
        }
        return [];
      };
      util.toObject = function toObject(array) {
        var object = {}, index = 0;
        while (index < array.length) {
          var key = array[index++], val = array[index++];
          if (val !== void 0)
            object[key] = val;
        }
        return object;
      };
      util.remove = function remove(object, value, key) {
        if (!object)
          return false;
        if (key !== void 0 && Object.prototype.hasOwnProperty.call(object, key) && object[key] === value) {
          delete object[key];
          return true;
        }
        for (var names = Object.keys(object), i = 0; i < names.length; ++i)
          if (object[names[i]] === value) {
            delete object[names[i]];
            return true;
          }
        return false;
      };
      util.isReserved = function isReserved(name) {
        return reservedRe.test(name);
      };
      util.safeProp = function safeProp(prop) {
        if (!/^[$\w_]+$/.test(prop) || reservedRe.test(prop))
          return "[" + JSON.stringify(prop) + "]";
        return "." + prop;
      };
      util.ucFirst = function ucFirst(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
      };
      var camelCaseRe = /_([a-z])/g;
      util.camelCase = function camelCase(str) {
        return str.substring(0, 1) + str.substring(1).replace(camelCaseRe, function($0, $1) {
          return $1.toUpperCase();
        });
      };
      util.jsonName = function jsonName(str) {
        var result = "", upperNext = false, i = 0;
        for (; i < str.length; ++i) {
          var ch = str.charAt(i);
          if (ch === "_")
            upperNext = true;
          else if (upperNext) {
            result += ch.toUpperCase();
            upperNext = false;
          } else
            result += ch;
        }
        return result;
      };
      util.compareFieldsById = function compareFieldsById(a, b) {
        return a.id - b.id;
      };
      util.decorateType = function decorateType(ctor, typeName) {
        if (ctor.$type) {
          if (typeName && ctor.$type.name !== typeName) {
            util.decorateRoot.remove(ctor.$type);
            ctor.$type.name = typeName;
            util.decorateRoot.add(ctor.$type);
          }
          return ctor.$type;
        }
        if (!Type)
          Type = require_type();
        var type = new Type(typeName || ctor.name);
        util.decorateRoot.add(type);
        type.ctor = ctor;
        Object.defineProperty(ctor, "$type", { value: type, enumerable: false });
        Object.defineProperty(ctor.prototype, "$type", { value: type, enumerable: false });
        return type;
      };
      var decorateEnumIndex = 0;
      util.decorateEnum = function decorateEnum(object) {
        if (object.$type)
          return object.$type;
        if (!Enum)
          Enum = require_enum();
        var enm = new Enum("Enum" + decorateEnumIndex++, object);
        util.decorateRoot.add(enm);
        Object.defineProperty(object, "$type", { value: enm, enumerable: false });
        return enm;
      };
      util.setProperty = function setProperty(dst, path, value, ifNotSet) {
        function setProp(dst2, path2, value2) {
          var part = path2.shift();
          if (util.isUnsafeProperty(part))
            return dst2;
          if (path2.length > 0) {
            dst2[part] = setProp(dst2[part] || {}, path2, value2);
          } else {
            var prevValue = dst2[part];
            if (prevValue && ifNotSet)
              return dst2;
            if (prevValue)
              value2 = [].concat(prevValue).concat(value2);
            dst2[part] = value2;
          }
          return dst2;
        }
        if (typeof dst !== "object")
          throw TypeError("dst must be an object");
        if (!path)
          throw TypeError("path must be specified");
        path = path.split(".");
        if (path.length > util.recursionLimit)
          throw Error("max depth exceeded");
        return setProp(dst, path, value);
      };
      Object.defineProperty(util, "decorateRoot", {
        get: function() {
          return roots["decorated"] || (roots["decorated"] = new (require_root())());
        }
      });
    }
  });

  // node_modules/protobufjs/src/types.js
  var require_types = __commonJS({
    "node_modules/protobufjs/src/types.js"(exports2) {
      "use strict";
      var types = exports2;
      var util = require_util();
      var s = [
        "double",
        // 0
        "float",
        // 1
        "int32",
        // 2
        "uint32",
        // 3
        "sint32",
        // 4
        "fixed32",
        // 5
        "sfixed32",
        // 6
        "int64",
        // 7
        "uint64",
        // 8
        "sint64",
        // 9
        "fixed64",
        // 10
        "sfixed64",
        // 11
        "bool",
        // 12
        "string",
        // 13
        "bytes"
        // 14
      ];
      function bake(values, offset) {
        var i = 0, o = /* @__PURE__ */ Object.create(null);
        offset |= 0;
        while (i < values.length) o[s[i + offset]] = values[i++];
        return o;
      }
      types.basic = bake([
        /* double   */
        1,
        /* float    */
        5,
        /* int32    */
        0,
        /* uint32   */
        0,
        /* sint32   */
        0,
        /* fixed32  */
        5,
        /* sfixed32 */
        5,
        /* int64    */
        0,
        /* uint64   */
        0,
        /* sint64   */
        0,
        /* fixed64  */
        1,
        /* sfixed64 */
        1,
        /* bool     */
        0,
        /* string   */
        2,
        /* bytes    */
        2
      ]);
      types.defaults = bake([
        /* double   */
        0,
        /* float    */
        0,
        /* int32    */
        0,
        /* uint32   */
        0,
        /* sint32   */
        0,
        /* fixed32  */
        0,
        /* sfixed32 */
        0,
        /* int64    */
        0,
        /* uint64   */
        0,
        /* sint64   */
        0,
        /* fixed64  */
        0,
        /* sfixed64 */
        0,
        /* bool     */
        false,
        /* string   */
        "",
        /* bytes    */
        util.emptyArray,
        /* message  */
        null
      ]);
      types.long = bake([
        /* int64    */
        0,
        /* uint64   */
        0,
        /* sint64   */
        0,
        /* fixed64  */
        1,
        /* sfixed64 */
        1
      ], 7);
      types.mapKey = bake([
        /* int32    */
        0,
        /* uint32   */
        0,
        /* sint32   */
        0,
        /* fixed32  */
        5,
        /* sfixed32 */
        5,
        /* int64    */
        0,
        /* uint64   */
        0,
        /* sint64   */
        0,
        /* fixed64  */
        1,
        /* sfixed64 */
        1,
        /* bool     */
        0,
        /* string   */
        2
      ], 2);
      types.packed = bake([
        /* double   */
        1,
        /* float    */
        5,
        /* int32    */
        0,
        /* uint32   */
        0,
        /* sint32   */
        0,
        /* fixed32  */
        5,
        /* sfixed32 */
        5,
        /* int64    */
        0,
        /* uint64   */
        0,
        /* sint64   */
        0,
        /* fixed64  */
        1,
        /* sfixed64 */
        1,
        /* bool     */
        0
      ]);
    }
  });

  // node_modules/protobufjs/src/field.js
  var require_field = __commonJS({
    "node_modules/protobufjs/src/field.js"(exports2, module2) {
      "use strict";
      module2.exports = Field;
      var ReflectionObject = require_object();
      Field.prototype = Object.create(ReflectionObject.prototype, {
        constructor: {
          value: Field,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      Field.className = "Field";
      var Enum = require_enum();
      var types = require_types();
      var util = require_util();
      var Type;
      var ruleRe = /^(?:required|optional|repeated)$/;
      Field.fromJSON = function fromJSON(name, json) {
        var field = new Field(name, json.id, json.type, json.rule, json.extend, json.options, json.comment);
        if (json.edition)
          field._edition = json.edition;
        if (json.protoName)
          field.protoName = json.protoName;
        if (json.jsonName !== void 0)
          field.jsonName = json.jsonName;
        else if (json.options && json.options.json_name !== void 0)
          field.jsonName = json.options.json_name;
        field._defaultEdition = "proto3";
        return field;
      };
      function Field(name, id, type, rule, extend, options, comment) {
        if (util.isObject(rule)) {
          comment = extend;
          options = rule;
          rule = extend = void 0;
        } else if (util.isObject(extend)) {
          comment = options;
          options = extend;
          extend = void 0;
        }
        ReflectionObject.call(this, name, options);
        if (!util.isInteger(id) || id < 0)
          throw TypeError("id must be a non-negative integer");
        if (!util.isString(type))
          throw TypeError("type must be a string");
        if (rule !== void 0 && !ruleRe.test(rule = rule.toString().toLowerCase()))
          throw TypeError("rule must be a string rule");
        if (extend !== void 0 && !util.isString(extend))
          throw TypeError("extend must be a string");
        this.rule = rule && rule !== "optional" ? rule : void 0;
        this.type = type;
        this.id = id;
        this.extend = extend || void 0;
        this.repeated = rule === "repeated";
        this.map = false;
        this.message = null;
        this.partOf = null;
        this.typeDefault = null;
        this.defaultValue = null;
        this.long = util.Long ? types.long[type] !== void 0 : (
          /* istanbul ignore next */
          false
        );
        this.bytes = type === "bytes";
        this.resolvedType = null;
        this.extensionField = null;
        this.declaringField = null;
        this.comment = comment;
        this.protoName = void 0;
        this.jsonName = void 0;
      }
      Object.defineProperty(Field.prototype, "required", {
        get: function() {
          return this._features.field_presence === "LEGACY_REQUIRED";
        }
      });
      Object.defineProperty(Field.prototype, "optional", {
        get: function() {
          return !this.required;
        }
      });
      Object.defineProperty(Field.prototype, "delimited", {
        get: function() {
          return this.resolvedType instanceof Type && this._features.message_encoding === "DELIMITED";
        }
      });
      Object.defineProperty(Field.prototype, "packed", {
        get: function() {
          return this._features.repeated_field_encoding === "PACKED";
        }
      });
      Object.defineProperty(Field.prototype, "hasPresence", {
        get: function() {
          if (this.repeated || this.map) {
            return false;
          }
          return this.partOf || // oneofs
          this.declaringField || this.extensionField || // extensions
          this._features.field_presence !== "IMPLICIT";
        }
      });
      Field.prototype.setOption = function setOption(name, value, ifNotSet) {
        return ReflectionObject.prototype.setOption.call(this, name, value, ifNotSet);
      };
      Field.prototype.toJSON = function toJSON(toJSONOptions) {
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "edition",
          this._editionToJSON(),
          "rule",
          this.rule !== "optional" && this.rule || void 0,
          "type",
          this.type,
          "id",
          this.id,
          "extend",
          this.extend,
          "protoName",
          this.protoName !== this.name ? this.protoName : void 0,
          "jsonName",
          this.jsonName !== util.jsonName(this.protoName || this.name) ? this.jsonName : void 0,
          "options",
          this.options,
          "comment",
          keepComments ? this.comment : void 0
        ]);
      };
      Field.prototype.resolve = function resolve() {
        if (this.resolved)
          return this;
        if ((this.typeDefault = types.defaults[this.type]) === void 0) {
          this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type);
          if (this.resolvedType instanceof Type)
            this.typeDefault = null;
          else
            this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]];
        } else if (this.options && this.options.proto3_optional) {
          this.typeDefault = null;
        }
        if (this.options && this.options["default"] != null) {
          this.typeDefault = this.options["default"];
          if (this.resolvedType instanceof Enum && typeof this.typeDefault === "string")
            this.typeDefault = this.resolvedType.values[this.typeDefault];
        }
        if (this.options) {
          if (this.options.packed !== void 0 && this.resolvedType && !(this.resolvedType instanceof Enum))
            delete this.options.packed;
          if (!Object.keys(this.options).length)
            this.options = void 0;
        }
        if (this.long) {
          var unsigned = this.type === "uint64" || this.type === "fixed64";
          this.typeDefault = typeof this.typeDefault === "string" ? util.Long.fromString(this.typeDefault, unsigned) : util.Long.fromNumber(this.typeDefault, unsigned);
          if (Object.freeze)
            Object.freeze(this.typeDefault);
        } else if (types.long[this.type] !== void 0 && typeof this.typeDefault === "string") {
          this.typeDefault = parseInt(this.typeDefault, 10);
        } else if (this.bytes && typeof this.typeDefault === "string") {
          var buf;
          if (util.base64.test(this.typeDefault))
            util.base64.decode(this.typeDefault, buf = util.newBuffer(util.base64.length(this.typeDefault)), 0);
          else
            util.utf8.write(this.typeDefault, buf = util.newBuffer(util.utf8.length(this.typeDefault)), 0);
          this.typeDefault = buf;
        }
        if (this.map)
          this.defaultValue = util.emptyObject;
        else if (this.repeated)
          this.defaultValue = util.emptyArray;
        else
          this.defaultValue = this.typeDefault;
        if (this.parent instanceof Type && this.parent._ctor)
          this.parent._ctor.prototype[this.name] = this.defaultValue;
        if (this.protoName === void 0)
          this.protoName = this.name;
        if (this.jsonName === void 0)
          this.jsonName = util.jsonName(this.protoName);
        return ReflectionObject.prototype.resolve.call(this);
      };
      Field.prototype._inferLegacyProtoFeatures = function _inferLegacyProtoFeatures(edition) {
        if (edition !== "proto2" && edition !== "proto3") {
          return {};
        }
        var features = {};
        if (this.rule === "required") {
          features.field_presence = "LEGACY_REQUIRED";
        }
        if (this.parent && types.defaults[this.type] === void 0) {
          var type = this.parent.get(this.type.split(".").pop());
          if (type && type instanceof Type && type.group) {
            features.message_encoding = "DELIMITED";
          }
        }
        if (this.getOption("packed") === true) {
          features.repeated_field_encoding = "PACKED";
        } else if (this.getOption("packed") === false) {
          features.repeated_field_encoding = "EXPANDED";
        }
        return features;
      };
      Field.prototype._resolveFeatures = function _resolveFeatures(edition) {
        return ReflectionObject.prototype._resolveFeatures.call(this, this._edition || edition);
      };
      Field.d = function decorateField(fieldId, fieldType, fieldRule, defaultValue) {
        if (typeof fieldType === "function")
          fieldType = util.decorateType(fieldType).name;
        else if (fieldType && typeof fieldType === "object")
          fieldType = util.decorateEnum(fieldType).name;
        return function fieldDecorator(prototype, fieldName) {
          util.decorateType(prototype.constructor).add(new Field(fieldName, fieldId, fieldType, fieldRule, { "default": defaultValue }));
        };
      };
      Field._configure = function configure(Type_) {
        Type = Type_;
      };
    }
  });

  // node_modules/protobufjs/src/oneof.js
  var require_oneof = __commonJS({
    "node_modules/protobufjs/src/oneof.js"(exports2, module2) {
      "use strict";
      module2.exports = OneOf;
      var ReflectionObject = require_object();
      OneOf.prototype = Object.create(ReflectionObject.prototype, {
        constructor: {
          value: OneOf,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      OneOf.className = "OneOf";
      var Field = require_field();
      var util = require_util();
      function OneOf(name, fieldNames, options, comment) {
        if (!Array.isArray(fieldNames)) {
          options = fieldNames;
          fieldNames = void 0;
        }
        ReflectionObject.call(this, name, options);
        if (!(fieldNames === void 0 || Array.isArray(fieldNames)))
          throw TypeError("fieldNames must be an Array");
        this.oneof = fieldNames || [];
        this.fieldsArray = [];
        this.comment = comment;
      }
      OneOf.fromJSON = function fromJSON(name, json) {
        return new OneOf(name, json.oneof, json.options, json.comment);
      };
      OneOf.prototype.toJSON = function toJSON(toJSONOptions) {
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "options",
          this.options,
          "oneof",
          this.oneof,
          "comment",
          keepComments ? this.comment : void 0
        ]);
      };
      function addFieldsToParent(oneof) {
        if (oneof.parent) {
          for (var i = 0; i < oneof.fieldsArray.length; ++i)
            if (!oneof.fieldsArray[i].parent)
              oneof.parent.add(oneof.fieldsArray[i]);
        }
      }
      OneOf.prototype.add = function add(field) {
        if (!(field instanceof Field))
          throw TypeError("field must be a Field");
        if (field.parent && field.parent !== this.parent)
          field.parent.remove(field);
        this.oneof.push(field.name);
        this.fieldsArray.push(field);
        field.partOf = this;
        addFieldsToParent(this);
        return this;
      };
      OneOf.prototype.remove = function remove(field) {
        if (!(field instanceof Field))
          throw TypeError("field must be a Field");
        var index = this.fieldsArray.indexOf(field);
        if (index < 0)
          throw Error(field + " is not a member of " + this);
        this.fieldsArray.splice(index, 1);
        index = this.oneof.indexOf(field.name);
        if (index > -1)
          this.oneof.splice(index, 1);
        field.partOf = null;
        return this;
      };
      OneOf.prototype.onAdd = function onAdd(parent) {
        ReflectionObject.prototype.onAdd.call(this, parent);
        var self2 = this;
        for (var i = 0; i < this.oneof.length; ++i) {
          var field = parent.get(this.oneof[i]);
          if (field && !field.partOf) {
            field.partOf = self2;
            self2.fieldsArray.push(field);
          }
        }
        addFieldsToParent(this);
      };
      OneOf.prototype.onRemove = function onRemove(parent) {
        for (var i = 0, field; i < this.fieldsArray.length; ++i)
          if ((field = this.fieldsArray[i]).parent)
            field.parent.remove(field);
        ReflectionObject.prototype.onRemove.call(this, parent);
      };
      Object.defineProperty(OneOf.prototype, "isProto3Optional", {
        get: function() {
          if (this.fieldsArray == null || this.fieldsArray.length !== 1) {
            return false;
          }
          var field = this.fieldsArray[0];
          return field.options != null && field.options["proto3_optional"] === true;
        }
      });
      OneOf.d = function decorateOneOf() {
        var fieldNames = new Array(arguments.length), index = 0;
        while (index < arguments.length)
          fieldNames[index] = arguments[index++];
        return function oneOfDecorator(prototype, oneofName) {
          util.decorateType(prototype.constructor).add(new OneOf(oneofName, fieldNames));
          Object.defineProperty(prototype, oneofName, {
            get: util.oneOfGetter(fieldNames),
            set: util.oneOfSetter(fieldNames)
          });
        };
      };
    }
  });

  // node_modules/protobufjs/src/object.js
  var require_object = __commonJS({
    "node_modules/protobufjs/src/object.js"(exports2, module2) {
      "use strict";
      module2.exports = ReflectionObject;
      ReflectionObject.className = "ReflectionObject";
      var OneOf = require_oneof();
      var util = require_util();
      var Root;
      var editions2024Defaults = { enum_type: "OPEN", field_presence: "EXPLICIT", json_format: "ALLOW", message_encoding: "LENGTH_PREFIXED", repeated_field_encoding: "PACKED", utf8_validation: "VERIFY", enforce_naming_style: "STYLE2024", default_symbol_visibility: "EXPORT_TOP_LEVEL" };
      var editions2023Defaults = { enum_type: "OPEN", field_presence: "EXPLICIT", json_format: "ALLOW", message_encoding: "LENGTH_PREFIXED", repeated_field_encoding: "PACKED", utf8_validation: "VERIFY", enforce_naming_style: "STYLE_LEGACY", default_symbol_visibility: "EXPORT_ALL" };
      var proto2Defaults = { enum_type: "CLOSED", field_presence: "EXPLICIT", json_format: "LEGACY_BEST_EFFORT", message_encoding: "LENGTH_PREFIXED", repeated_field_encoding: "EXPANDED", utf8_validation: "NONE", enforce_naming_style: "STYLE_LEGACY", default_symbol_visibility: "EXPORT_ALL" };
      var proto3Defaults = { enum_type: "OPEN", field_presence: "IMPLICIT", json_format: "ALLOW", message_encoding: "LENGTH_PREFIXED", repeated_field_encoding: "PACKED", utf8_validation: "VERIFY", enforce_naming_style: "STYLE_LEGACY", default_symbol_visibility: "EXPORT_ALL" };
      function ReflectionObject(name, options) {
        if (!util.isString(name))
          throw TypeError("name must be a string");
        if (options && !util.isObject(options))
          throw TypeError("options must be an object");
        this.options = options;
        this.parsedOptions = null;
        this.name = name;
        this._edition = null;
        this._defaultEdition = "proto2";
        this._features = {};
        this._featuresResolved = false;
        this.parent = null;
        this.resolved = false;
        this.comment = null;
        this.filename = null;
      }
      Object.defineProperties(ReflectionObject.prototype, {
        /**
         * Reference to the root namespace.
         * @name ReflectionObject#root
         * @type {Root}
         * @readonly
         */
        root: {
          get: function() {
            var ptr = this;
            while (ptr.parent !== null)
              ptr = ptr.parent;
            return ptr;
          }
        },
        /**
         * Full name including leading dot.
         * @name ReflectionObject#fullName
         * @type {string}
         * @readonly
         */
        fullName: {
          get: function() {
            var path = [this.name], ptr = this.parent;
            while (ptr) {
              path.unshift(ptr.name);
              ptr = ptr.parent;
            }
            return path.join(".");
          }
        }
      });
      ReflectionObject.prototype.toJSON = /* istanbul ignore next */
      function toJSON() {
        throw Error();
      };
      ReflectionObject.prototype.onAdd = function onAdd(parent) {
        if (this.parent && this.parent !== parent)
          this.parent.remove(this);
        this.parent = parent;
        this.resolved = false;
        var root2 = parent.root;
        if (root2 instanceof Root)
          root2._handleAdd(this);
      };
      ReflectionObject.prototype.onRemove = function onRemove(parent) {
        var root2 = parent.root;
        if (root2 instanceof Root)
          root2._handleRemove(this);
        this.parent = null;
        this.resolved = false;
      };
      ReflectionObject.prototype.resolve = function resolve() {
        if (this.resolved)
          return this;
        if (this.root instanceof Root)
          this.resolved = true;
        return this;
      };
      ReflectionObject.prototype._resolveFeaturesRecursive = function _resolveFeaturesRecursive(edition) {
        return this._resolveFeatures(this._edition || edition);
      };
      ReflectionObject.prototype._resolveFeatures = function _resolveFeatures(edition) {
        if (this._featuresResolved) {
          return;
        }
        var defaults = {};
        if (!edition) {
          throw new Error("Unknown edition for " + this.fullName);
        }
        var protoFeatures = util.merge(
          {},
          this.options && this.options.features,
          this._inferLegacyProtoFeatures(edition)
        );
        if (this._edition) {
          if (edition === "proto2") {
            defaults = Object.assign({}, proto2Defaults);
          } else if (edition === "proto3") {
            defaults = Object.assign({}, proto3Defaults);
          } else if (edition === "2023") {
            defaults = Object.assign({}, editions2023Defaults);
          } else if (edition === "2024") {
            defaults = Object.assign({}, editions2024Defaults);
          } else {
            throw new Error("Unknown edition: " + edition);
          }
          this._features = util.merge(defaults, protoFeatures);
        } else {
          if (this.partOf instanceof OneOf) {
            var lexicalParentFeaturesCopy = util.merge({}, this.partOf._features);
            this._features = util.merge(lexicalParentFeaturesCopy, protoFeatures);
          } else if (this.declaringField) {
          } else if (this.parent) {
            var parentFeaturesCopy = util.merge({}, this.parent._features);
            this._features = util.merge(parentFeaturesCopy, protoFeatures);
          } else {
            throw new Error("Unable to find a parent for " + this.fullName);
          }
        }
        if (this.extensionField) {
          this.extensionField._features = this._features;
        }
        this._featuresResolved = true;
      };
      ReflectionObject.prototype._inferLegacyProtoFeatures = function _inferLegacyProtoFeatures() {
        return {};
      };
      ReflectionObject.prototype.getOption = function getOption(name) {
        if (this.options && Object.prototype.hasOwnProperty.call(this.options, name))
          return this.options[name];
        return void 0;
      };
      ReflectionObject.prototype.setOption = function setOption(name, value, ifNotSet) {
        if (name === "__proto__")
          return this;
        if (!this.options)
          this.options = {};
        if (/^features\./.test(name)) {
          util.setProperty(this.options, name, value, ifNotSet);
        } else {
          var prev = this.getOption(name);
          if (!ifNotSet || prev === void 0) {
            if (prev !== value) this.resolved = false;
            this.options[name] = value;
          }
        }
        return this;
      };
      ReflectionObject.prototype.setParsedOption = function setParsedOption(name, value, propName) {
        if (name === "__proto__")
          return this;
        if (!this.parsedOptions) {
          this.parsedOptions = [];
        }
        var parsedOptions = this.parsedOptions;
        if (propName) {
          var opt = parsedOptions.find(function(opt2) {
            return Object.prototype.hasOwnProperty.call(opt2, name);
          });
          if (opt) {
            var newValue = opt[name];
            util.setProperty(newValue, propName, value);
          } else {
            opt = {};
            opt[name] = util.setProperty({}, propName, value);
            parsedOptions.push(opt);
          }
        } else {
          var newOpt = {};
          newOpt[name] = value;
          parsedOptions.push(newOpt);
        }
        return this;
      };
      ReflectionObject.prototype.setOptions = function setOptions(options, ifNotSet) {
        if (options)
          for (var keys = Object.keys(options), i = 0; i < keys.length; ++i)
            this.setOption(keys[i], options[keys[i]], ifNotSet);
        return this;
      };
      Object.defineProperty(ReflectionObject.prototype, "toString", {
        value: function toString() {
          var className = this.constructor.className, fullName = this.fullName;
          if (fullName.length)
            return className + " " + fullName;
          return className;
        },
        writable: true,
        enumerable: false,
        configurable: true
      });
      ReflectionObject.prototype._editionToJSON = function _editionToJSON() {
        if (!this._edition || this._edition === "proto3") {
          return void 0;
        }
        return this._edition;
      };
      ReflectionObject._configure = function(Root_) {
        Root = Root_;
      };
    }
  });

  // node_modules/protobufjs/src/enum.js
  var require_enum = __commonJS({
    "node_modules/protobufjs/src/enum.js"(exports2, module2) {
      "use strict";
      module2.exports = Enum;
      var ReflectionObject = require_object();
      Enum.prototype = Object.create(ReflectionObject.prototype, {
        constructor: {
          value: Enum,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      Enum.className = "Enum";
      var Namespace = require_namespace();
      var util = require_util();
      function Enum(name, values, options, comment, comments, valuesOptions) {
        ReflectionObject.call(this, name, options);
        if (values && typeof values !== "object")
          throw TypeError("values must be an object");
        this.valuesById = /* @__PURE__ */ Object.create(null);
        this.values = Object.create(this.valuesById);
        this.comment = comment;
        this.comments = comments || {};
        this.valuesOptions = valuesOptions;
        this._valuesFeatures = {};
        this.reserved = void 0;
        if (values) {
          for (var keys = Object.keys(values), i = 0; i < keys.length; ++i)
            if (keys[i] !== "__proto__" && typeof values[keys[i]] === "number") {
              this.values[keys[i]] = values[keys[i]];
              if (this.valuesById[values[keys[i]]] === void 0)
                this.valuesById[values[keys[i]]] = keys[i];
            }
        }
      }
      Enum.prototype._resolveFeatures = function _resolveFeatures(edition) {
        edition = this._edition || edition;
        ReflectionObject.prototype._resolveFeatures.call(this, edition);
        Object.keys(this.values).forEach((key) => {
          var parentFeaturesCopy = util.merge({}, this._features);
          this._valuesFeatures[key] = util.merge(parentFeaturesCopy, this.valuesOptions && this.valuesOptions[key] && this.valuesOptions[key].features || {});
        });
        return this;
      };
      Enum.fromJSON = function fromJSON(name, json) {
        var enm = new Enum(name, json.values, json.options, json.comment, json.comments, json.valuesOptions);
        enm.reserved = json.reserved;
        if (json.edition)
          enm._edition = json.edition;
        enm._defaultEdition = "proto3";
        return enm;
      };
      Enum.prototype.toJSON = function toJSON(toJSONOptions) {
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "edition",
          this._editionToJSON(),
          "options",
          this.options,
          "valuesOptions",
          this.valuesOptions,
          "values",
          this.values,
          "reserved",
          this.reserved && this.reserved.length ? this.reserved : void 0,
          "comment",
          keepComments ? this.comment : void 0,
          "comments",
          keepComments ? this.comments : void 0
        ]);
      };
      Enum.prototype.add = function add(name, id, comment, options) {
        if (!util.isString(name))
          throw TypeError("name must be a string");
        if (!util.isInteger(id))
          throw TypeError("id must be an integer");
        if (name === "__proto__")
          return this;
        if (this.values[name] !== void 0)
          throw Error("duplicate name '" + name + "' in " + this);
        if (this.isReservedId(id))
          throw Error("id " + id + " is reserved in " + this);
        if (this.isReservedName(name))
          throw Error("name '" + name + "' is reserved in " + this);
        if (this.valuesById[id] !== void 0) {
          if (!(this.options && this.options.allow_alias))
            throw Error("duplicate id " + id + " in " + this);
          this.values[name] = id;
        } else
          this.valuesById[this.values[name] = id] = name;
        if (options) {
          if (this.valuesOptions === void 0)
            this.valuesOptions = {};
          this.valuesOptions[name] = options || null;
        }
        this.comments[name] = comment || null;
        return this;
      };
      Enum.prototype.remove = function remove(name) {
        if (!util.isString(name))
          throw TypeError("name must be a string");
        var val = this.values[name];
        if (val == null)
          throw Error("name '" + name + "' does not exist in " + this);
        delete this.valuesById[val];
        delete this.values[name];
        delete this.comments[name];
        if (this.valuesOptions)
          delete this.valuesOptions[name];
        return this;
      };
      Enum.prototype.isReservedId = function isReservedId(id) {
        return Namespace.isReservedId(this.reserved, id);
      };
      Enum.prototype.isReservedName = function isReservedName(name) {
        return Namespace.isReservedName(this.reserved, name);
      };
    }
  });

  // node_modules/protobufjs/src/encoder.js
  var require_encoder = __commonJS({
    "node_modules/protobufjs/src/encoder.js"(exports2, module2) {
      "use strict";
      module2.exports = encoder;
      var Enum = require_enum();
      var types = require_types();
      var util = require_util();
      function genTypePartial(gen, field, fieldIndex, ref) {
        return field.delimited ? gen("types[%i].encode(%s,w.uint32(%i),q+1).uint32(%i)", fieldIndex, ref, (field.id << 3 | 3) >>> 0, (field.id << 3 | 4) >>> 0) : gen("types[%i].encode(%s,w.uint32(%i).fork(),q+1).ldelim()", fieldIndex, ref, (field.id << 3 | 2) >>> 0);
      }
      function encoder(mtype) {
        var gen = util.codegen(["m", "w", "q"])("if(!w)")("w=Writer.create()")("if(q===undefined)q=0")("if(q>util.recursionLimit)")('throw Error("max depth exceeded")');
        var i, ref;
        var fields = (
          /* initializes */
          mtype.fieldsArray.slice().sort(util.compareFieldsById)
        );
        for (var i = 0; i < fields.length; ++i) {
          var field = fields[i].resolve(), index = mtype._fieldsArray.indexOf(field), type = field.resolvedType instanceof Enum ? "int32" : field.type, wireType = types.basic[type];
          ref = "m" + util.safeProp(field.name);
          if (field.map) {
            gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", ref, field.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", ref);
            if (field.keyType === "bool") gen("w.uint32(%i).fork().uint32(%i).bool(util.boolFromKey(ks[i]))", (field.id << 3 | 2) >>> 0, 8 | types.mapKey[field.keyType]);
            else if (types.long[field.keyType] !== void 0) gen("w.uint32(%i).fork().uint32(%i).%s(util.longFromKey(ks[i],%j))", (field.id << 3 | 2) >>> 0, 8 | types.mapKey[field.keyType], field.keyType, field.keyType === "uint64" || field.keyType === "fixed64");
            else gen("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (field.id << 3 | 2) >>> 0, 8 | types.mapKey[field.keyType], field.keyType);
            if (wireType === void 0) gen("types[%i].encode(%s[ks[i]],w.uint32(18).fork(),q+1).ldelim().ldelim()", index, ref);
            else gen(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | wireType, type, ref);
            gen("}")("}");
          } else if (field.repeated) {
            gen("if(%s!=null&&%s.length){", ref, ref);
            if (field.packed && types.packed[type] !== void 0) {
              gen("w.uint32(%i).%ss(%s)", (field.id << 3 | 2) >>> 0, type, ref);
            } else {
              gen("for(var i=0;i<%s.length;++i)", ref);
              if (wireType === void 0)
                genTypePartial(gen, field, index, ref + "[i]");
              else gen("w.uint32(%i).%s(%s[i])", (field.id << 3 | wireType) >>> 0, type, ref);
            }
            gen("}");
          } else {
            if (!field.required)
              if (field.hasPresence || !(field.resolvedType instanceof Enum || types.basic[type] !== void 0)) gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j))", ref, field.name);
              else if (field.resolvedType instanceof Enum) gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&%s!==%j)", ref, field.name, ref, field.typeDefault);
              else if (type === "bool") gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&%s!==false)", ref, field.name, ref);
              else if (type === "string") gen('if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&%s!=="")', ref, field.name, ref);
              else if (type === "bytes") gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&%s.length)", ref, field.name, ref);
              else if (type === "double" || type === "float") gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&!Object.is(%s,0))", ref, field.name, ref);
              else if (types.long[type] !== void 0) gen('if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&(typeof %s==="object"?%s.low||%s.high:%s!==0))', ref, field.name, ref, ref, ref, ref);
              else gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&%s!==0)", ref, field.name, ref);
            if (wireType === void 0)
              genTypePartial(gen, field, index, ref);
            else gen("w.uint32(%i).%s(%s)", (field.id << 3 | wireType) >>> 0, type, ref);
          }
        }
        return gen('if(m.$unknowns!=null&&Object.hasOwnProperty.call(m,"$unknowns"))')("for(var i=0;i<m.$unknowns.length;++i)")("w.raw(m.$unknowns[i])")("return w");
      }
    }
  });

  // node_modules/protobufjs/src/index-light.js
  var require_index_light = __commonJS({
    "node_modules/protobufjs/src/index-light.js"(exports2, module2) {
      "use strict";
      exports2 = module2.exports = require_index_minimal();
      exports2.build = "light";
      function load(filename, root2, callback) {
        if (typeof root2 === "function") {
          callback = root2;
          root2 = new exports2.Root();
        } else if (!root2)
          root2 = new exports2.Root();
        return root2.load(filename, callback);
      }
      exports2.load = load;
      function loadSync(filename, root2) {
        if (!root2)
          root2 = new exports2.Root();
        return root2.loadSync(filename);
      }
      exports2.loadSync = loadSync;
      exports2.encoder = require_encoder();
      exports2.decoder = require_decoder();
      exports2.verifier = require_verifier();
      exports2.converter = require_converter();
      exports2.ReflectionObject = require_object();
      exports2.Namespace = require_namespace();
      exports2.Root = require_root();
      exports2.Enum = require_enum();
      exports2.Type = require_type();
      exports2.Field = require_field();
      exports2.OneOf = require_oneof();
      exports2.MapField = require_mapfield();
      exports2.Service = require_service2();
      exports2.Method = require_method();
      exports2.Message = require_message();
      exports2.wrappers = require_wrappers();
      exports2.types = require_types();
      exports2.util = require_util();
      exports2.ReflectionObject._configure(exports2.Root);
      exports2.Namespace._configure(exports2.Type, exports2.Service, exports2.Enum);
      exports2.Root._configure(exports2.Type, void 0, {});
      exports2.Field._configure(exports2.Type);
    }
  });

  // node_modules/protobufjs/light.js
  var require_light = __commonJS({
    "node_modules/protobufjs/light.js"(exports2, module2) {
      "use strict";
      module2.exports = require_index_light();
    }
  });

  // tiles.mjs
  var SUIT_CHAR = { 1: "m", 2: "p", 3: "s", 4: "z" };
  function tileId(suit, rank, copy) {
    return suit * 100 + rank * 10 + copy;
  }
  function decodeId(id) {
    const suit = Math.floor(id / 100);
    const rank = Math.floor(id % 100 / 10);
    const copy = id % 10;
    return { suit, rank, copy };
  }
  function toRiichi(id, aka = false) {
    const { suit, rank } = decodeId(id);
    const ch = SUIT_CHAR[suit];
    if (!ch) return null;
    if (aka && suit !== 4 && rank === 5) return "0" + ch;
    return rank + ch;
  }
  function doraFromIndicator(id, sanma = false) {
    const { suit, rank } = decodeId(id);
    if (suit === 4) {
      const next2 = rank <= 4 ? rank === 4 ? 1 : rank + 1 : rank === 7 ? 5 : rank + 1;
      return tileId(4, next2, 1);
    }
    if (sanma && suit === 1) return tileId(1, rank === 9 ? 1 : 9, 1);
    const next = rank === 9 ? 1 : rank + 1;
    return tileId(suit, next, 1);
  }
  function buildWall({ sanma = false, akaCount = 1 } = {}) {
    const tiles = [];
    const akaSet = /* @__PURE__ */ new Set();
    for (let suit = 1; suit <= 4; suit++) {
      const maxRank = suit === 4 ? 7 : 9;
      for (let rank = 1; rank <= maxRank; rank++) {
        if (sanma && suit === 1 && rank >= 2 && rank <= 8) continue;
        for (let copy = 1; copy <= 4; copy++) {
          tiles.push(tileId(suit, rank, copy));
        }
      }
    }
    for (const suit of [1, 2, 3]) {
      if (akaCount > 0) {
        akaSet.add(tileId(suit, 5, 1));
        if (akaCount > 1) akaSet.add(tileId(suit, 5, 2));
      }
    }
    return { tiles, akaSet };
  }
  function shuffle(arr, rng = Math.random) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  var HAN_ZI = {
    1: "\u4E07",
    2: "\u7B52",
    3: "\u7D22",
    4: "\u5B57"
  };
  var ZI_NAME = { 1: "\u4E1C", 2: "\u5357", 3: "\u897F", 4: "\u5317", 5: "\u767D", 6: "\u53D1", 7: "\u4E2D" };
  function tileName(id) {
    const { suit, rank } = decodeId(id);
    if (suit === 4) return ZI_NAME[rank];
    return rank + HAN_ZI[suit];
  }

  // ai.mjs
  var import_riichi = __toESM(require_riichi(), 1);

  // shanten.mjs
  function tileIndex(id) {
    const { suit, rank } = decodeId(id);
    if (suit >= 1 && suit <= 3) return (suit - 1) * 9 + (rank - 1);
    if (suit === 4) return 27 + (rank - 1);
    return -1;
  }
  function indexToTileId(idx, copy = 1) {
    if (idx < 27) return tileId(Math.floor(idx / 9) + 1, idx % 9 + 1, copy);
    return tileId(4, idx - 27 + 1, copy);
  }
  function countsOf(ids) {
    const c = new Array(34).fill(0);
    for (const id of ids) {
      const i = tileIndex(id);
      if (i >= 0) c[i]++;
    }
    return c;
  }
  var YAOCHU = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];
  var suitCache = /* @__PURE__ */ new Map();
  function analyzeGroup(c, allowRuns) {
    const n = c.length;
    let code = 0;
    for (let i = 0; i < n; i++) code = code * 5 + c[i];
    const key = code * 2 + (allowRuns ? 0 : 1);
    const hit = suitCache.get(key);
    if (hit) return hit;
    const res = [];
    for (let i = 0; i < 5; i++) res.push({ p: -1, pp: -1 });
    const rec = (i, sets, partials, hasPair) => {
      if (sets + partials > 5) return;
      if (i >= n) {
        const s = sets > 4 ? 4 : sets;
        const r = res[s];
        if (partials > r.p) r.p = partials;
        if (hasPair && partials > r.pp) r.pp = partials;
        return;
      }
      if (c[i] === 0) {
        rec(i + 1, sets, partials, hasPair);
        return;
      }
      if (c[i] >= 3) {
        c[i] -= 3;
        rec(i, sets + 1, partials, hasPair);
        c[i] += 3;
      }
      if (allowRuns && i + 2 < n && c[i + 1] > 0 && c[i + 2] > 0) {
        c[i]--;
        c[i + 1]--;
        c[i + 2]--;
        rec(i, sets + 1, partials, hasPair);
        c[i]++;
        c[i + 1]++;
        c[i + 2]++;
      }
      if (c[i] >= 2) {
        c[i] -= 2;
        rec(i, sets, partials + 1, true);
        c[i] += 2;
      }
      if (allowRuns && i + 1 < n && c[i + 1] > 0) {
        c[i]--;
        c[i + 1]--;
        rec(i, sets, partials + 1, hasPair);
        c[i]++;
        c[i + 1]++;
      }
      if (allowRuns && i + 2 < n && c[i + 2] > 0) {
        c[i]--;
        c[i + 2]--;
        rec(i, sets, partials + 1, hasPair);
        c[i]++;
        c[i + 2]++;
      }
      c[i]--;
      rec(i, sets, partials, hasPair);
      c[i]++;
    };
    rec(0, 0, 0, false);
    suitCache.set(key, res);
    return res;
  }
  var G0 = new Array(9);
  var G1 = new Array(9);
  var G2 = new Array(9);
  var G3 = new Array(7);
  function stdShanten(t, fixedMelds) {
    for (let i = 0; i < 9; i++) {
      G0[i] = t[i];
      G1[i] = t[9 + i];
      G2[i] = t[18 + i];
    }
    for (let i = 0; i < 7; i++) G3[i] = t[27 + i];
    const groups = [
      analyzeGroup(G0, true),
      analyzeGroup(G1, true),
      analyzeGroup(G2, true),
      analyzeGroup(G3, false)
    ];
    let cur = new Uint8Array(5 * 6 * 2);
    cur[0] = 1;
    for (const g of groups) {
      const next = new Uint8Array(5 * 6 * 2);
      for (let s = 0; s <= 4; s++) {
        for (let p = 0; p <= 5; p++) {
          for (let h = 0; h <= 1; h++) {
            if (!cur[(s * 6 + p) * 2 + h]) continue;
            for (let gs = 0; gs <= 4; gs++) {
              const r = g[gs];
              if (r.p < 0) continue;
              const ns = s + gs;
              if (ns > 4) continue;
              for (const [gp, gh] of [[r.p, h], [r.pp, 1]]) {
                if (gp < 0) continue;
                let np = p + gp;
                if (np > 5) np = 5;
                next[(ns * 6 + np) * 2 + gh] = 1;
              }
            }
          }
        }
      }
      cur = next;
    }
    let best = 99;
    for (let s = 0; s <= 4; s++) {
      for (let p = 0; p <= 5; p++) {
        for (let h = 0; h <= 1; h++) {
          if (!cur[(s * 6 + p) * 2 + h]) continue;
          let total = s + fixedMelds;
          if (total > 4) total = 4;
          let pp = p;
          if (total + pp > 5) pp = 5 - total;
          if (pp < 0) pp = 0;
          let sh = 8 - 2 * total - pp;
          if (total + pp === 5 && !h) sh += 1;
          if (sh < best) best = sh;
        }
      }
    }
    return best;
  }
  function chiitoiShanten(t) {
    let pairs = 0, kinds = 0;
    for (let i = 0; i < 34; i++) {
      if (t[i] > 0) kinds++;
      if (t[i] >= 2) pairs++;
    }
    let sh = 6 - pairs;
    if (kinds < 7) sh += 7 - kinds;
    return sh;
  }
  function kokushiShanten(t) {
    let kinds = 0, hasPair = 0;
    for (const i of YAOCHU) {
      if (t[i] > 0) kinds++;
      if (t[i] >= 2) hasPair = 1;
    }
    return 13 - kinds - hasPair;
  }
  function shantenOfCounts(counts, meldCount = 0) {
    let sh = stdShanten(counts, meldCount);
    if (meldCount === 0) {
      const c = chiitoiShanten(counts);
      if (c < sh) sh = c;
      const k = kokushiShanten(counts);
      if (k < sh) sh = k;
    }
    return sh;
  }
  function waitsOfCounts(counts, meldCount = 0, remainOf = null) {
    const base2 = shantenOfCounts(counts, meldCount);
    const waits = [];
    let ukeire = 0;
    for (let i = 0; i < 34; i++) {
      if (counts[i] >= 4) continue;
      counts[i]++;
      const sh = shantenOfCounts(counts, meldCount);
      counts[i]--;
      if (sh < base2) {
        waits.push(i);
        ukeire += remainOf ? Math.max(0, remainOf(i)) : 4 - counts[i];
      }
    }
    return { shanten: base2, waits, ukeire };
  }
  function discardOptionsOfCounts(counts, meldCount = 0, remainOf = null) {
    let bestSh = 99;
    const raw = [];
    for (let i = 0; i < 34; i++) {
      if (counts[i] === 0) continue;
      counts[i]--;
      const sh = shantenOfCounts(counts, meldCount);
      counts[i]++;
      raw.push({ idx: i, shanten: sh });
      if (sh < bestSh) bestSh = sh;
    }
    const options = [];
    for (const r of raw) {
      if (r.shanten !== bestSh) continue;
      counts[r.idx]--;
      const w = waitsOfCounts(counts, meldCount, remainOf);
      counts[r.idx]++;
      options.push({ idx: r.idx, waits: w.waits, ukeire: w.ukeire });
    }
    return { shanten: bestSh, options };
  }

  // ai.mjs
  var SUIT_CHAR2 = { 1: "m", 2: "p", 3: "s", 4: "z" };
  var kindOf = (id) => {
    const d = decodeId(id);
    return d.suit * 10 + d.rank;
  };
  var kindOfIndex = (idx) => kindOf(indexToTileId(idx));
  function tileDigit(id, akaSet) {
    const { suit, rank } = decodeId(id);
    if (akaSet && akaSet.has(id) && suit !== 4 && rank === 5) return "0";
    return String(rank);
  }
  function concealedStr(ids, akaSet) {
    return ids.map((id) => tileDigit(id, akaSet) + SUIT_CHAR2[decodeId(id).suit]).join("");
  }
  function realMelds(melds) {
    return (melds || []).filter((m) => m.type !== "babei");
  }
  function furoGroupStr(meld, akaSet) {
    const suit = decodeId(meld.tiles[0]).suit;
    return meld.tiles.map((id) => tileDigit(id, akaSet)).join("") + SUIT_CHAR2[suit];
  }
  function furoStr(melds, akaSet) {
    return realMelds(melds).map((m) => furoGroupStr(m, akaSet)).join("+");
  }
  function handStr(concealedIds, melds, akaSet, opts = {}) {
    let s = concealedStr(concealedIds, akaSet);
    if (opts.ronTile != null) s += "+" + toRiichi(opts.ronTile, akaSet && akaSet.has(opts.ronTile));
    const fs = furoStr(melds, akaSet);
    if (fs) s += "+" + fs;
    let ex = "";
    if (opts.riichi) ex += "r";
    if (opts.ippatsu) ex += "i";
    if (opts.rinshan || opts.chankan) ex += "k";
    if (opts.haidi) ex += "h";
    if (opts.tenho) ex += "t";
    ex += "" + (opts.roundWind || 1) + (opts.seatWind || 1);
    s += "+" + ex;
    if (opts.doraTiles && opts.doraTiles.length) {
      s += "+d" + opts.doraTiles.map((id) => toRiichi(id, false)).join("");
    }
    return s;
  }
  function calcWin(concealedIds, melds, akaSet, opts = {}) {
    const all = concealedIds.concat(opts.ronTile != null ? [opts.ronTile] : []);
    if (shantenOfCounts(countsOf(all), realMelds(melds).length) !== -1) {
      return { isAgari: false, hasYaku: false, han: 0, fu: 0, ten: 0, yakuman: 0, yaku: {}, name: "", oya: [0], ko: [0] };
    }
    const str = handStr(concealedIds, melds, akaSet, opts);
    let res;
    try {
      res = new import_riichi.default(str.toLowerCase()).calc();
    } catch (e) {
      return { isAgari: false, hasYaku: false, han: 0, fu: 0, ten: 0, yakuman: 0, yaku: {}, name: "", oya: [0], ko: [0], error: true };
    }
    const han = res.han || 0;
    const yakuman = res.yakuman || 0;
    return {
      str,
      isAgari: !!res.isAgari && !res.error,
      hasYaku: !!res.isAgari && (han > 0 || yakuman > 0),
      han,
      fu: res.fu || 0,
      ten: res.ten || 0,
      yakuman,
      yaku: res.yaku || {},
      name: res.name || "",
      oya: res.oya || [0, 0, 0],
      ko: res.ko || [0, 0, 0],
      error: !!res.error
    };
  }
  function handShanten(concealedIds, melds) {
    return shantenOfCounts(countsOf(concealedIds), realMelds(melds).length);
  }
  function handWaits(concealedIds, melds, remainOf = null) {
    const r = waitsOfCounts(countsOf(concealedIds), realMelds(melds).length, remainOf);
    return {
      shanten: r.shanten,
      waits: r.waits.map((i) => indexToTileId(i)),
      waitKinds: r.waits.map(kindOfIndex),
      ukeire: r.ukeire
    };
  }
  function chooseDiscard(concealedIds, melds, opts = {}) {
    const {
      drawnTile = null,
      doraKinds = null,
      akaSet = null,
      dangerKinds = null,
      forced = null,
      remainOf = null
    } = opts;
    const meldCount = realMelds(melds).length;
    const counts = countsOf(concealedIds);
    if (forced != null && concealedIds.includes(forced)) {
      const c2 = counts.slice();
      c2[tileIndex(forced)]--;
      const w = waitsOfCounts(c2, meldCount, remainOf);
      return {
        discardId: forced,
        shanten: w.shanten,
        ukeire: w.ukeire,
        waits: w.waits.map((i) => indexToTileId(i)),
        score: 0
      };
    }
    const { shanten: sh, options } = discardOptionsOfCounts(counts, meldCount, remainOf);
    let best = null;
    for (const o of options) {
      const id = pickIdFromHand(concealedIds, o.idx, akaSet);
      if (id == null) continue;
      const score = discardSecondaryScore(id, concealedIds, { drawnTile, doraKinds, akaSet, dangerKinds });
      const cand = {
        discardId: id,
        shanten: sh,
        ukeire: o.ukeire,
        score,
        waits: o.waits.map((i) => indexToTileId(i))
      };
      if (!best || cand.ukeire > best.ukeire || cand.ukeire === best.ukeire && cand.score > best.score) best = cand;
    }
    if (!best) {
      const id = drawnTile != null && concealedIds.includes(drawnTile) ? drawnTile : concealedIds[concealedIds.length - 1];
      return { discardId: id, shanten: sh, ukeire: 0, score: 0, waits: [] };
    }
    return best;
  }
  function pickIdFromHand(handIds, idx, akaSet) {
    let plain = null, any = null;
    for (const id of handIds) {
      if (tileIndex(id) !== idx) continue;
      any = any == null ? id : any;
      if (!(akaSet && akaSet.has(id))) {
        plain = id;
        break;
      }
    }
    return plain != null ? plain : any;
  }
  function discardSecondaryScore(tile, handIds, { drawnTile, doraKinds, akaSet, dangerKinds }) {
    let s = 0;
    const { suit, rank } = decodeId(tile);
    const kind = suit * 10 + rank;
    if (doraKinds && doraKinds.has(kind)) s -= 100;
    if (akaSet && akaSet.has(tile)) s -= 120;
    const cnt = handIds.filter((x) => kindOf(x) === kind).length;
    if (suit === 4 && cnt === 1) s += 30;
    if (suit !== 4 && (rank === 1 || rank === 9) && cnt === 1) s += 15;
    if (suit !== 4 && (rank === 2 || rank === 8) && cnt === 1) s += 5;
    if (drawnTile != null && tile === drawnTile) s += 10;
    if (dangerKinds) {
      if (dangerKinds.safe && dangerKinds.safe.has(kind)) s += 60;
      if (dangerKinds.risky && dangerKinds.risky.has(kind)) s -= 80;
    }
    return s;
  }

  // proto_enum.mjs
  var RiichiMsg = {
    ENone: 0,
    EReqPrepare: 1,
    ERspPrepare: 2,
    EReqPlayCard: 3,
    ERspPlayCard: 4,
    EReqQiangCard: 5,
    ERspQiangCard: 6,
    EReqSetInternalState: 7,
    ERspSetInternalState: 8,
    EReqCloseOfflineTip: 9,
    ERspCloseOfflineTip: 10,
    EReqClickUI: 11,
    ERspClickUI: 12,
    ENtfToPrepare: 1001,
    ENtfPrepare: 1002,
    ENtfGameStart: 1003,
    ENtfSendCard: 1004,
    ENtfPlayCard: 1005,
    ENtfQiangCard: 1006,
    ENtfQiangCardEnd: 1007,
    ENtfGameStop: 1008,
    ENtfOfflineTip: 1009
  };
  var PlayAction = {
    Normal: 0,
    Guo: 1,
    Chi: 2,
    Peng: 3,
    MingGang: 4,
    PengGang: 5,
    AnGang: 6,
    Riichi: 7,
    Hu: 8,
    JiuZhongJiuLiuJu: 9,
    BaBei: 10
  };
  var ManType = {
    NoMan: 0,
    ManGuan: 1,
    TiaoMan: 2,
    BeiMan: 3,
    SanBeiMan: 4,
    YiMan: 5
  };
  var YiType = {
    NoYi: 0,
    RedBao: 101,
    Bao: 102,
    LiBao: 103,
    BaBeiBao: 104,
    LiZhi: 1101,
    YiFa: 1102,
    MengQianQingZiMoHu: 1103,
    PingHu: 1104,
    YiBeiKou: 1105,
    DuanYaoJiu: 1301,
    YiPaiZiFeng: 1302,
    YiPaiChangFeng: 1303,
    YiPaiSanYuanBai: 1304,
    YiPaiSanYuanFa: 1305,
    YiPaiSanYuanZhong: 1306,
    LingShangKaiHua: 1307,
    HaiDiLaoYue: 1308,
    HeDiMoYu: 1309,
    QiangGang: 1310,
    YiPaiBeiFeng: 1311,
    ShuangLiZi: 2101,
    QiDuiZi: 2102,
    HunQuanDaiYaoJiu: 2201,
    YiQiTongGuan: 2202,
    SanSeTongShun: 2203,
    SanSeTongKe: 2301,
    SanAnKe: 2302,
    SanGangZi: 2303,
    DuiDuiHu: 2304,
    HunLaoTou: 2305,
    XiaoSanYuan: 2306,
    ErBeiKou: 3101,
    ChunQuanDaiYaoJiu: 3201,
    HunYiSe: 3202,
    LiuJuManGuan: 5301,
    QingYiSe: 6201,
    TianHu: 91101,
    DiHu: 91102,
    GuoShiWuShuang: 91103,
    JiuLianBaoDeng: 91104,
    SiAnKe: 91105,
    SiGangZi: 91301,
    QingLaoTou: 91302,
    ZiYiSe: 91303,
    XiaoSiXi: 91304,
    DaSanYuan: 91305,
    LvYiSe: 91306,
    GuoShiWuShuangShiSanMian: 92101,
    ChunZhengJiuLianBaoDeng: 92102,
    SiAnKeDanQi: 92103,
    DaSiXi: 92301
  };
  var LiuJuType = {
    HuangPai: 0,
    SiFengLianDa: 1,
    SiGang: 2,
    JiuZhongJiuPai: 3,
    SiJiaLiZhi: 4
  };

  // yaku_map.mjs
  var DIRECT = {
    "\u7ACB\u76F4": YiType.LiZhi,
    "\u30C0\u30D6\u30EB\u7ACB\u76F4": YiType.ShuangLiZi,
    // 2101 双立直
    "\u4E00\u767A": YiType.YiFa,
    "\u9580\u524D\u6E05\u81EA\u6478\u548C": YiType.MengQianQingZiMoHu,
    "\u5E73\u548C": YiType.PingHu,
    "\u4E00\u76C3\u53E3": YiType.YiBeiKou,
    "\u4E8C\u76C3\u53E3": YiType.ErBeiKou,
    // 3101
    "\u65AD\u4E48\u4E5D": YiType.DuanYaoJiu,
    "\u5F79\u724C\u767D": YiType.YiPaiSanYuanBai,
    "\u5F79\u724C\u767A": YiType.YiPaiSanYuanFa,
    "\u5F79\u724C\u4E2D": YiType.YiPaiSanYuanZhong,
    "\u4E00\u6C17\u901A\u8CAB": YiType.YiQiTongGuan,
    "\u4E09\u8272\u540C\u9806": YiType.SanSeTongShun,
    "\u4E09\u8272\u540C\u523B": YiType.SanSeTongKe,
    "\u4E09\u6697\u523B": YiType.SanAnKe,
    "\u4E09\u69D3\u5B50": YiType.SanGangZi,
    "\u5BFE\u3005\u548C": YiType.DuiDuiHu,
    "\u6DF7\u8001\u982D": YiType.HunLaoTou,
    "\u5C0F\u4E09\u5143": YiType.XiaoSanYuan,
    "\u7D14\u5168\u5E2F\u4E48\u4E5D": YiType.ChunQuanDaiYaoJiu,
    "\u6DF7\u5168\u5E2F\u4E48\u4E5D": YiType.HunQuanDaiYaoJiu,
    "\u6DF7\u4E00\u8272": YiType.HunYiSe,
    "\u6E05\u4E00\u8272": YiType.QingYiSe,
    "\u4E03\u5BFE\u5B50": YiType.QiDuiZi,
    "\u5DBA\u4E0A\u958B\u82B1": YiType.LingShangKaiHua,
    "\u6436\u69D3": YiType.QiangGang,
    "\u6D77\u5E95\u6478\u6708": YiType.HaiDiLaoYue,
    "\u6CB3\u5E95\u6488\u9B5A": YiType.HeDiMoYu,
    "\u56FD\u58EB\u7121\u53CC": YiType.GuoShiWuShuang,
    "\u56FD\u58EB\u7121\u53CC\u5341\u4E09\u9762\u5F85\u3061": YiType.GuoShiWuShuangShiSanMian,
    "\u4E5D\u84EE\u5B9D\u71C8": YiType.JiuLianBaoDeng,
    "\u7D14\u6B63\u4E5D\u84EE\u5B9D\u71C8": YiType.ChunZhengJiuLianBaoDeng,
    "\u56DB\u6697\u523B": YiType.SiAnKe,
    "\u56DB\u6697\u523B\u5358\u9A0E\u5F85\u3061": YiType.SiAnKeDanQi,
    "\u5927\u56DB\u559C": YiType.DaSiXi,
    "\u5C0F\u56DB\u559C": YiType.XiaoSiXi,
    "\u5927\u4E09\u5143": YiType.DaSanYuan,
    "\u5B57\u4E00\u8272": YiType.ZiYiSe,
    "\u7DD1\u4E00\u8272": YiType.LvYiSe,
    "\u6E05\u8001\u982D": YiType.QingLaoTou,
    "\u56DB\u69D3\u5B50": YiType.SiGangZi,
    "\u5929\u548C": YiType.TianHu,
    "\u5730\u548C": YiType.DiHu,
    "\u30C9\u30E9": YiType.Bao,
    // 宝（表宝牌）
    "\u8D64\u30C9\u30E9": YiType.RedBao
    // 赤宝（赤5 dora）
  };
  function windYiType(key, roundWind, seatWind) {
    const m = key.match(/^(場風|自風)([東南西北])$/);
    if (!m) return null;
    const kind = m[1];
    const wind = m[2];
    if (kind === "\u5834\u98A8") return YiType.YiPaiChangFeng;
    if (wind === "\u5317") return YiType.YiPaiBeiFeng;
    return YiType.YiPaiZiFeng;
  }
  function parseFan(val) {
    if (typeof val === "string") {
      if (val.includes("\u5F79\u6E80")) {
        return val.includes("\u30C0\u30D6\u30EB") ? 26 : 13;
      }
      const n = parseInt(val, 10);
      return isNaN(n) ? 0 : n;
    }
    return typeof val === "number" ? val : 0;
  }
  function mapYaku(yakuObj, { roundWind = 1, seatWind = 1 } = {}) {
    const yiFans = [];
    let isYiMan = false;
    let baoFan = 0, liBaoFan = 0, redBaoFan = 0;
    for (const [key, val] of Object.entries(yakuObj)) {
      let yiType = DIRECT[key];
      if (yiType === void 0) yiType = windYiType(key, roundWind, seatWind);
      if (yiType === void 0 || yiType === null) continue;
      const fan = parseFan(val);
      const ym = typeof val === "string" && val.includes("\u5F79\u6E80");
      if (ym) isYiMan = true;
      yiFans.push({ yiType, fan, isYiMan: ym, isFuLuMinus: false });
      if (key === "\u30C9\u30E9") baoFan += fan;
      else if (key === "\u8D64\u30C9\u30E9") redBaoFan += fan;
    }
    return { yiFans, isYiMan, baoFan, liBaoFan, redBaoFan };
  }
  function manTypeFromResult({ han, yakuman, name }) {
    if (yakuman > 0 || /役満/.test(name || "")) return ManType.YiMan;
    if (han >= 13) return ManType.YiMan;
    if (han >= 11) return ManType.SanBeiMan;
    if (han >= 8) return ManType.BeiMan;
    if (han >= 6) return ManType.TiaoMan;
    if (han >= 5) return ManType.ManGuan;
    return ManType.NoMan;
  }

  // engine.mjs
  var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  var kindOf2 = (id) => {
    const d = decodeId(id);
    return d.suit * 10 + d.rank;
  };
  var GameEngine = class {
    constructor(opts = {}) {
      const {
        players = 4,
        akaCount = 1,
        startScore = 25e3,
        emit,
        seed
      } = opts;
      this.playersN = players;
      this.sanma = players === 3;
      this.akaCount = akaCount;
      this.startScore = startScore;
      this.emit = emit || (() => {
      });
      this.autoHuman = !!opts.autoHuman;
      this.speed = opts.speed != null ? opts.speed : 1;
      this.rng = seed != null ? mulberry32(seed) : Math.random;
      this.handIndex = 0;
      this.juNum = 0;
      this.maxHands = opts.maxHands != null ? opts.maxHands : 16;
      this.roundWind = 1;
      this.honba = 0;
      this.riichiSticks = 0;
      this.dealerSeat = 0;
      this.scores = null;
      this.xunNum = 0;
      this._pending = null;
      this._processing = false; // 动作执行中标记（防重复包重放）
      this._bufferedDraw = null;
      this._bufferedClaim = null;
      this._prepareWaiter = null;
      this._prepared = false;
      this.matchOver = false;
      this.finished = false;
      this.onFinish = opts.onFinish || null;
      this.uids = opts.uids && opts.uids.length >= players ? opts.uids.slice(0, players) : Array.from({ length: players }, (_, s) => 1e4 + s);
    }
    uidOf(seat) {
      return this.uids[seat];
    }
    /** 客户端上行 ReqPrepare：解开 runHand 里的等待 */
    submitPrepare() {
      this._prepared = true;
      const w = this._prepareWaiter;
      this._prepareWaiter = null;
      if (w) w();
    }
    /** 等客户端点「准备」。抓包规律（dongfeng1 完整包）：
     *  局间（含连庄，isFinal=false）服务器先发 NtfToPrepare/NtfPrepare(机器人)，客户端发
     *  ReqPrepare，服务器再发 NtfPrepare(自己)/NtfGameStart —— 每局等一次 ReqPrepare。
     *  终局（isFinal=true）后引擎直接停，不存在“续场再等一次 ReqPrepare”的两段式握手；
     *  新一场是重新匹配出的新房间、新引擎（见 finishHand）。
     *  autoHuman（自测无客户端）直接跳过；真人模式留一个兜底超时防止卡死。 */
    waitPrepare(timeoutMs = 15e3) {
      if (this.autoHuman) return Promise.resolve();
      if (this._prepared) {
        this._prepared = false;
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        let done = false;
        const fin = () => {
          if (done) return;
          done = true;
          this._prepared = false;
          resolve();
        };
        this._prepareWaiter = fin;
        setTimeout(() => {
          if (done) return;
          this.log && this.log("[riichi] \u7B49 ReqPrepare \u8D85\u65F6\uFF0C\u81EA\u884C\u5F00\u5C40");
          fin();
        }, timeoutMs);
      });
    }
    _d(ms) {
      return this.speed > 0 ? sleep(ms * this.speed) : Promise.resolve();
    }
    // 各阶段延迟（毫秒，乘以 speed）
    get T() {
      return { think: 550, claim: 350, step: 250, hand: 2500 };
    }
    // ================= 入口 =================
    async start() {
      await this._d(400);
      while (!this.finished) {
        await this.runHand();
      }
      if (this.onFinish) this.onFinish(this.scores);
    }
    // ================= 一局 =================
    async runHand() {
      this.handEnded = false;
      this.xunNum = 0;
      this.kanCount = 0;
      this.firstGoAround = true;
      this.lastDiscard = null;
      const { tiles, akaSet } = buildWall({ sanma: this.sanma, akaCount: this.akaCount });
      this.akaSet = akaSet;
      const wall = shuffle(tiles, this.rng);
      const dead = wall.splice(wall.length - 14, 14);
      this.deadWall = dead;
      // 岭上牌数量：四麻4张、三麻8张（三麻拔北/杠共需8张岭上牌，王牌总数仍14张）
      const rinLen = this.sanma ? 8 : 4;
      this.replacements = dead.slice(0, rinLen);
      // 初始宝牌指示牌位置：四麻 dead[4]；三麻前8张是岭上，故 dead[8]
      const baoBase = this.sanma ? rinLen : 4;
      this.doraIndicators = [dead[baoBase]];
      this.uraIndicators = [dead[baoBase + 1]];
      this._pendingBaoPreCard = 0;
      this.wall = wall;
      this.remain = wall.length;
      const players = [];
      for (let s = 0; s < this.playersN; s++) {
        const score = this.scores ? this.scores[s] : this.startScore;
        players.push({
          seat: s,
          isHuman: s === 0,
          score,
          scoreAtStart: score,
          hand: wall.splice(0, 13).sort((a, b) => a - b),
          melds: [],
          discards: [],
          discardKinds: /* @__PURE__ */ new Set(),
          riichi: false,
          riichiTurn: -1,
          ippatsu: false,
          menzen: true,
          waits: [],
          drawnTile: null,
          rinshan: false
        });
      }
      this.players = players;
      for (const p of players) this.updateWaits(p);
      const emptyInfos = players.map(() => ({}));
      this.emit(RiichiMsg.ENtfToPrepare, {
        userInfos: players.map((p) => ({ seat: p.seat, userID: this.uidOf(p.seat) }))
      });
      for (let s = 1; s < this.playersN; s++) {
        this.emit(RiichiMsg.ENtfPrepare, { seat: s, userInfos: emptyInfos });
      }
      await this.waitPrepare();
      if (this.finished) return;
      this.emit(RiichiMsg.ENtfPrepare, { seat: 0, userInfos: emptyInfos });
      await this._d(this.T.step);
      const dealer = players[this.dealerSeat];
      const firstTile = this.wall.shift();
      this.remain = this.wall.length;
      dealer.hand.push(firstTile);
      dealer.drawnTile = firstTile;
      dealer.rinshan = false;
      this.xunNum = 1;
      const dealerActions = this.turnActions(this.dealerSeat, true);
      this.emit(RiichiMsg.ENtfGameStart, {
        changWind: this.roundWind - 1,
        juNum: this.juNum + 1,
        // 实机是 1 基（东1=1），内部保持 0 基
        benChangNum: this.honba,
        zhuangSeat: this.dealerSeat,
        baoPreCard: this.doraIndicators[0],
        remainDuiCardNum: this.remain,
        userInfos: players.map((p) => {
          const own = p.isHuman || this.autoHuman;
          const isDealer = p.seat === this.dealerSeat;
          return {
            seat: p.seat,
            score: p.score,
            initScore: this.startScore,
            handCards: own ? p.hand.slice() : [],
            tingInfos: [],
            canPlayActions: own && isDealer ? dealerActions : [],
            xunNum: isDealer ? 1 : 0
          };
        }),
        leftTimer: 20,
        defaultMinTimeout: 8,
        riichiBangNum: this.riichiSticks,
        isAllLast: this.juNum >= this.playersN - 1 || this.roundWind >= 2,
        gameID: "mock-" + Date.now() + "-" + this.handIndex,
        duiCardsStrEncode: "",
        duiCardsStrSaltEncode: "",
        ServerRedundantTimeOut: 3,
        FirstGameStartRedundantTimeOut: 8
      });
      await this._d(this.T.step);
      await this.awaitTurn(this.dealerSeat, true, true);
    }
    nextSeat(s) {
      return (s + 1) % this.playersN;
    }
    seatWindOf(seat) {
      return ((seat - this.dealerSeat) % this.playersN + this.playersN) % this.playersN + 1;
    }
    // ================= 摸牌 =================
    async turnDraw(seat) {
      if (this.handEnded) return;
      if (this.remain <= 0) {
        await this.exhaustiveDraw();
        return;
      }
      const p = this.players[seat];
      const tile = this.wall.shift();
      this.remain = this.wall.length;
      p.hand.push(tile);
      p.drawnTile = tile;
      p.rinshan = false;
      this.xunNum++;
      await this.awaitTurn(seat, true);
    }
    // 岭上摸牌（杠后）
    async drawReplacement(seat) {
      const p = this.players[seat];
      if (!this.replacements.length || this.remain <= 0) {
        await this.exhaustiveDraw();
        return false;
      }
      const tile = this.replacements.pop();
      this.wall.pop();
      this.remain = this.wall.length;
      p.hand.push(tile);
      p.drawnTile = tile;
      p.rinshan = true;
      this.xunNum++;
      return true;
    }
    async doBaBei(seat, tile) {
      const p = this.players[seat];
      const i = p.hand.lastIndexOf(tile);
      if (i >= 0) p.hand.splice(i, 1);
      p.melds.push({ type: "babei", tiles: [tile] });
      for (const q of this.players) q.ippatsu = false;
      this.firstGoAround = false;
      this.emit(RiichiMsg.ENtfPlayCard, this.buildPlayCard(seat, tile, PlayAction.BaBei, false, this.emptyClaims()));
      await this._d(this.T.claim);
      if (!await this.drawReplacement(seat)) return;
      await this.awaitTurn(seat, true);
    }
    // ================= 轮到某家行动（手上 14 张） =================
    async awaitTurn(seat, drew, skipNotify) {
      if (this.handEnded) return;
      const p = this.players[seat];
      const aiControlled = this.isAiSeat(p);
      if (drew && aiControlled && this.canJiuZhongJiuPai(p)) {
        await this.abortiveDraw(LiuJuType.JiuZhongJiuPai, seat);
        return;
      }
      const can = this.turnActions(seat, drew);
      if (drew && !skipNotify) {
        const newBao = this._pendingBaoPreCard || 0;
        this._pendingBaoPreCard = 0;
        this.emit(RiichiMsg.ENtfSendCard, {
          seat,
          baoPreCard: newBao,
          userInfos: this.players.map((q) => ({
            seat: q.seat,
            card: q.seat === seat && (q.isHuman || this.autoHuman) ? p.drawnTile : 0,
            tingInfos: q.seat === seat ? this.buildTingInfos(p) : [],
            canPlayActions: q.seat === seat ? can : [],
            leftTimer: q.isHuman ? 20 : 0,
            // 真实抓包：人类(seat0)始终 20，AI 为 0
            isZhenTing: this.isFuriten(q),
            xunNum: this.xunNum,
            zhenTingTypes: []
          }))
        });
        await this._d(this.T.think);
      }
      let action, card;
      if (!aiControlled) {
        this._processing = false; // 即将等待人类输入，允许缓存合法早到响应
        const payload = await this.waitHuman("draw");
        action = payload.action != null ? payload.action : PlayAction.Normal;
        card = payload.card != null ? payload.card : p.drawnTile;
      } else {
        const d = this.aiTurn(seat, drew, can);
        action = d.action;
        card = d.card;
        await this._d(this.T.think);
      }
      await this.processTurnAction(seat, action, card, drew);
    }
    // 手牌 14 张时的可选动作
    turnActions(seat, drew) {
      const p = this.players[seat];
      const acts = [PlayAction.Normal];
      if (drew && this.canTsumo(p)) acts.push(PlayAction.Hu);
      if (!p.riichi && p.menzen && this.canRiichi(p)) acts.push(PlayAction.Riichi);
      if (drew && this.kanCount < 4 && this.remain > 1) {
        if (this.concealedQuadTile(p) != null) acts.push(PlayAction.AnGang);
        if (!p.riichi && this.addedKanTile(p) != null) acts.push(PlayAction.PengGang);
      }
      if (drew && !this.isAiSeat(p) && this.canJiuZhongJiuPai(p)) acts.push(PlayAction.JiuZhongJiuLiuJu);
      if (this.sanma && this.northInHand(p) != null && this.replacements.length && this.remain > 1) {
        acts.push(PlayAction.BaBei);
      }
      return acts;
    }
    // 手里的北（三麻拔北用），没有则返回 null
    northInHand(p) {
      for (const t of p.hand) {
        const d = decodeId(t);
        if (d.suit === 4 && d.rank === 4) return t;
      }
      return null;
    }
    countYaoJiuKinds(p) {
      const s = /* @__PURE__ */ new Set();
      for (const t of p.hand) {
        const { suit, rank } = decodeId(t);
        if (suit === 4 || rank === 1 || rank === 9) s.add(suit * 10 + rank);
      }
      return s.size;
    }
    // 该席位是否由 AI 操作（autoHuman 为测试用：把 0 号真人席位也交给 AI 代打）
    isAiSeat(p) {
      return !p.isHuman || this.autoHuman;
    }
    // 九种九牌成立条件：仍在首巡（任何鸣牌——含吃碰杠与拔北——都会把 firstGoAround 置 false）
    // 且刚摸完牌的手牌里有 ≥9 种幺九。成立时人类可选、AI 自动。
    canJiuZhongJiuPai(p) {
      return this.firstGoAround && this.countYaoJiuKinds(p) >= 9;
    }
    canRiichi(p) {
      if (!p.menzen || p.riichi) return false;
      if (p.score < 1e3) return false;
      if (this.remain < this.playersN) return false;
      return this.bestDiscard(p).shanten === 0;
    }
    canTsumo(p) {
      const w = calcWin(p.hand, p.melds, this.akaSet, this.winOpts(p, false));
      return w.isAgari && w.hasYaku;
    }
    concealedQuadTile(p) {
      const cnt = {};
      for (const t of p.hand) cnt[kindOf2(t)] = (cnt[kindOf2(t)] || 0) + 1;
      for (const [k, c] of Object.entries(cnt)) {
        if (c >= 4) {
          if (p.riichi) return null;
          return p.hand.find((t) => kindOf2(t) === Number(k));
        }
      }
      return null;
    }
    // 加杠：手上有与已碰的刻子同种的牌
    addedKanTile(p) {
      for (const m of p.melds) {
        if (m.type !== "pon") continue;
        const k = kindOf2(m.tiles[0]);
        const t = p.hand.find((x) => kindOf2(x) === k);
        if (t != null) return t;
      }
      return null;
    }
    // 表宝牌的「牌种」集合（供 AI 保留宝牌用）
    doraKinds() {
      const s = /* @__PURE__ */ new Set();
      for (const ind of this.doraIndicators) s.add(kindOf2(doraFromIndicator(ind, this.sanma)));
      return s;
    }
    // 场上已公开的牌（牌河 + 副露 + 宝牌指示牌）
    visibleCounts() {
      const c = new Array(34).fill(0);
      const add = (id) => {
        const i = tileIndex(id);
        if (i >= 0) c[i]++;
      };
      for (const q of this.players) {
        for (const t of q.discards) add(t);
        for (const m of q.melds) for (const t of m.tiles) add(t);
      }
      for (const t of this.doraIndicators) add(t);
      return c;
    }
    // 某家视角下「某牌种还剩几张」（用于受入枚数）
    remainOfFor(p) {
      const vis = this.visibleCounts();
      const own = countsOf(p.hand);
      const total = (idx) => this.sanma && idx === 30 ? 0 : 4;
      return (idx) => total(idx) - vis[idx] - own[idx];
    }
    // 统一的弃牌评估入口
    bestDiscard(p, extra = {}) {
      return chooseDiscard(p.hand, p.melds, __spreadValues({
        drawnTile: p.drawnTile,
        doraKinds: this.doraKinds(),
        akaSet: this.akaSet,
        remainOf: this.remainOfFor(p)
      }, extra));
    }
    doraTilesFor(p) {
      const out = this.doraIndicators.map((i) => doraFromIndicator(i, this.sanma));
      if (p.riichi) out.push(...this.uraIndicators.map((i) => doraFromIndicator(i, this.sanma)));
      return out;
    }
    winOpts(p, isRon, ronTile = null) {
      return {
        ronTile: isRon ? ronTile : null,
        riichi: p.riichi,
        ippatsu: p.riichi && p.ippatsu,
        rinshan: !isRon && p.rinshan,
        haidi: this.remain <= 0,
        doraTiles: this.doraTilesFor(p),
        roundWind: this.roundWind,
        seatWind: this.seatWindOf(p.seat)
      };
    }
    // 13 张形时更新听牌信息（waits 存牌种码）
    updateWaits(p) {
      if (p.hand.length % 3 !== 1) return;
      const info = handWaits(p.hand, p.melds);
      p.shanten = info.shanten;
      p.waits = info.shanten === 0 ? info.waitKinds : [];
      p.waitTiles = info.shanten === 0 ? info.waits : [];
    }
    isTenpai(p) {
      if (p.hand.length % 3 === 1) return handShanten(p.hand, p.melds) === 0;
      return this.bestDiscard(p).shanten === 0;
    }
    isFuriten(p) {
      if (!p.waits || !p.waits.length) return false;
      return p.waits.some((k) => p.discardKinds.has(k));
    }
    // 14 张形的听牌提示：打哪张 -> 听哪些
    //
    // 编码陷阱：tingInfos.play / ting 用的是「牌种」编码（copy 位固定为 0），
    // 实机样本 play=380(3索) ting=210(1筒)、play=110(1万)，全部以 0 结尾。
    // 其余字段（handCards / NtfPlayCard.card / baoPreCard …）才是带 copy 的完整牌 ID。
    // 之前这里发的是 copy=1 的完整 ID（381/211），客户端按牌种查表匹配不上，
    // 结果就是「听了牌但不显示听牌、也没有听牌提示」。
    buildTingInfos(p) {
      if (p.hand.length % 3 !== 2) return [];
      const { shanten: sh, options } = discardOptionsOfCounts(
        countsOf(p.hand),
        realMelds(p.melds).length,
        this.remainOfFor(p)
      );
      if (sh !== 0) return [];
      const out = [];
      for (const o of options) {
        const playTile = p.hand.find((t) => tileIndex(t) === o.idx);
        if (!playTile) continue;
        const play = indexToTileId(o.idx, 0);
        const hand13 = p.hand.slice();
        hand13.splice(hand13.indexOf(playTile), 1);
        for (const wIdx of o.waits) {
          const tingTile = indexToTileId(wIdx, 0);
          const hand14 = hand13.concat([tingTile]);
          const wMo = calcWin(hand14, p.melds, this.akaSet, this.winOpts(p, false));
          const wRong = calcWin(hand13, p.melds, this.akaSet, this.winOpts(p, true, tingTile));
          out.push({
            play,
            ting: tingTile,
            hasYiWhenMo: wMo.hasYaku,
            yiManChance: 0,
            fanFuTypeWhenMo: 0,
            hasYiWhenRong: wRong.hasYaku,
            manType: 0
          });
        }
      }
      return out.slice(0, 60);
    }
    // ================= 处理行动 =================
    async processTurnAction(seat, action, card, drew) {
      const p = this.players[seat];
      this._processing = true; // 动作执行中：此期间到达的包视为重复包丢弃
      this._bufferedDraw = null; this._bufferedClaim = null; // 清空上一动作的残留缓冲（防重复包重放）
      if (action === PlayAction.Hu) {
        await this.winTsumo(seat);
        return;
      }
      if (action === PlayAction.JiuZhongJiuLiuJu) {
        await this.abortiveDraw(LiuJuType.JiuZhongJiuPai, seat);
        return;
      }
      if (action === PlayAction.AnGang) {
        // 校验动作合法性，拒绝重复包/非法动作（不进 doKan，落到下方弃牌兜底）
        if (this.turnActions(seat, drew).includes(PlayAction.AnGang)) {
          await this.doKan(seat, card, "ankan");
        }
        return;
      }
      if (action === PlayAction.PengGang) {
        if (this.turnActions(seat, drew).includes(PlayAction.PengGang)) {
          await this.doKan(seat, card, "kakan");
        }
        return;
      }
      if (action === PlayAction.BaBei) {
        const d = card != null ? decodeId(card) : null;
        const north = d && d.suit === 4 && d.rank === 4 && p.hand.includes(card) ? card : this.northInHand(p);
        if (north != null && this.turnActions(seat, drew).includes(PlayAction.BaBei)) {
          await this.doBaBei(seat, north);
          return;
        }
      }
      if (action === PlayAction.Riichi) {
        p.riichi = true;
        p.riichiTurn = this.xunNum;
        p.ippatsu = true;
        p.score -= 1e3;
        this.riichiSticks += 1;
      }
      if (p.riichi && p.riichiTurn !== this.xunNum && p.drawnTile != null) card = p.drawnTile;
      if (card == null || !p.hand.includes(card)) card = this.bestDiscard(p).discardId;
      const idx = p.hand.lastIndexOf(card);
      if (idx >= 0) p.hand.splice(idx, 1);
      p.hand.sort((a, b) => a - b);
      p.discards.push(card);
      p.discardKinds.add(kindOf2(card));
      this.updateWaits(p);
      this.lastDiscard = { seat, card };
      if (p.ippatsu && p.riichiTurn !== this.xunNum) p.ippatsu = false;
      await this.discard(seat, card, action);
    }
    emptyClaims() {
      return this.players.map(() => []);
    }
    async discard(seat, card, action) {
      const p = this.players[seat];
      const isMoQie = p.drawnTile === card;
      p.drawnTile = null;
      const canQiang = this.players.map((q) => q.seat === seat ? [] : this.claimActions(q.seat, seat, card));
      this.emit(RiichiMsg.ENtfPlayCard, this.buildPlayCard(seat, card, action, isMoQie, canQiang));
      await this._d(this.T.claim);
      if (this.playersN === 4 && this.players.every((q) => q.riichi)) {
        await this.abortiveDraw(LiuJuType.SiJiaLiZhi, seat);
        return;
      }
      if (this.checkSiFengLianDa()) {
        await this.abortiveDraw(LiuJuType.SiFengLianDa, seat);
        return;
      }
      await this.resolveClaims(seat, card, canQiang);
    }
    checkSiFengLianDa() {
      if (!this.firstGoAround) return false;
      const n = this.playersN;
      if (n !== 4) return false;
      const firsts = this.players.map((p) => p.discards[0]);
      if (firsts.some((t) => t == null)) return false;
      if (this.players.some((p) => p.discards.length !== 1 || p.melds.length)) return false;
      const kinds = firsts.map(kindOf2);
      return kinds.every((k) => k >= 41 && k <= 44 && k === kinds[0]);
    }
    buildPlayCard(seat, card, action, isMoQie, canQiang) {
      return {
        seat,
        card,
        action,
        isMoQie,
        userInfos: this.players.map((q) => ({
          seat: q.seat,
          canQiangActions: canQiang[q.seat] || [],
          isZhenTing: this.isFuriten(q),
          leftTimer: q.isHuman ? 20 : 0,
          canAnGangNoNumCardsAfterRiichi: [],
          zhenTingTypes: []
        }))
      };
    }
    // ================= 鸣牌 =================
    claimActions(seat, discarderSeat, card) {
      const p = this.players[seat];
      const acts = [];
      if (this.canRon(p, card)) acts.push(PlayAction.Hu);
      if (!p.riichi) {
        const cnt = p.hand.filter((t) => kindOf2(t) === kindOf2(card)).length;
        if (cnt >= 3 && this.kanCount < 4 && this.remain > 1) acts.push(PlayAction.MingGang);
        if (cnt >= 2 && this.remain > 0) acts.push(PlayAction.Peng);
        if (!this.sanma && seat === this.nextSeat(discarderSeat) && this.remain > 0) {
          if (this.chiTiles(p, card)) acts.push(PlayAction.Chi);
        }
      }
      if (acts.length) acts.push(PlayAction.Guo);
      return acts;
    }
    canRon(p, card) {
      if (!p.waits || !p.waits.includes(kindOf2(card))) return false;
      if (this.isFuriten(p)) return false;
      if (p.tempFuriten) return false;
      const w = calcWin(p.hand, p.melds, this.akaSet, this.winOpts(p, true, card));
      return w.isAgari && w.hasYaku;
    }
    chiTiles(p, card) {
      const { suit, rank } = decodeId(card);
      if (suit === 4) return null;
      const pick = (r, exclude) => {
        for (const t of p.hand) {
          const d = decodeId(t);
          if (d.suit === suit && d.rank === r && t !== exclude) return t;
        }
        return null;
      };
      const combos = [[rank - 2, rank - 1], [rank - 1, rank + 1], [rank + 1, rank + 2]];
      for (const [a, b] of combos) {
        if (a < 1 || a > 9 || b < 1 || b > 9) continue;
        const ta = pick(a, null);
        if (ta == null) continue;
        const tb = pick(b, ta);
        if (tb == null) continue;
        return [ta, tb];
      }
      return null;
    }
    async resolveClaims(discarderSeat, card, canQiang) {
      const all = [];
      if (!this.autoHuman && this.players[0].isHuman && canQiang[0] && canQiang[0].length) {
        this._processing = false; // 即将等待人类鸣牌输入，允许缓存合法早到响应
        const payload = await this.waitHuman("claim");
        if (payload && payload.action != null && payload.action !== PlayAction.Guo) {
          all.push({ seat: 0, action: payload.action, otherCards: payload.otherCards || [] });
        } else if (canQiang[0].includes(PlayAction.Hu)) {
          this.players[0].tempFuriten = true;
        }
      }
      for (let s = 0; s < this.playersN; s++) {
        if (s === 0 && !this.autoHuman) continue;
        if (!canQiang[s] || !canQiang[s].length) continue;
        const c = this.aiClaim(s, discarderSeat, card, canQiang[s]);
        if (c) all.push(__spreadValues({ seat: s }, c));
        else if (canQiang[s].includes(PlayAction.Hu)) this.players[s].tempFuriten = true;
      }
      if (!all.length) {
        for (const q of this.players) {
          q.tempFuriten = false;
        }
        const next = this.nextSeat(discarderSeat);
        if (next === this.dealerSeat) this.firstGoAround = false;
        await this.turnDraw(next);
        return;
      }
      const prio = (a) => a.action === PlayAction.Hu ? 4 : a.action === PlayAction.MingGang ? 3 : a.action === PlayAction.Peng ? 2 : 1;
      all.sort((x, y) => prio(y) - prio(x));
      const win = all[0];
      await this.executeClaim(win.seat, win.action, card, discarderSeat, win.otherCards || []);
    }
    async executeClaim(seat, action, card, discarderSeat, otherCards) {
      const p = this.players[seat];
      this._processing = true; // 鸣牌执行中：此期间到达的包视为重复包丢弃
      this._bufferedDraw = null; this._bufferedClaim = null; // 清空上一动作的残留缓冲（防重复包重放）
      const donor = this.players[discarderSeat];
      if (action === PlayAction.Hu) {
        await this.winRon(seat, discarderSeat, card);
        return;
      }
      donor.discards.pop();
      for (const q of this.players) q.ippatsu = false;
      this.firstGoAround = false;
      for (const q of this.players) q.tempFuriten = false;
      if (action === PlayAction.MingGang) {
        // 校验合法性，拒绝重复包/非法动作（不进 doKan）
        if (!this.claimActions(seat, discarderSeat, card).includes(PlayAction.MingGang)) return;
        const used2 = this.takeTiles(p, card, 3);
        p.melds.push({ type: "kan", tiles: [...used2, card], from: discarderSeat });
        p.menzen = false;
        this.kanCount++;
        this.emit(RiichiMsg.ENtfQiangCard, this.buildQiang(seat, action, used2));
        await this._d(this.T.claim);
        this.revealKanDora();
        if (!await this.drawReplacement(seat)) return;
        this.emit(RiichiMsg.ENtfQiangCardEnd, this.buildQiangEnd(seat, action, used2, [...used2, card]));
        await this._d(this.T.claim);
        await this.awaitTurn(seat, true);
        return;
      }
      const isChi = action === PlayAction.Chi;
      let used;
      if (isChi) {
        const valid = otherCards && otherCards.length === 2 && otherCards.every((t) => p.hand.includes(t));
        used = valid ? otherCards : this.chiTiles(p, card);
        for (const t of used) {
          const i = p.hand.indexOf(t);
          if (i >= 0) p.hand.splice(i, 1);
        }
      } else {
        used = this.takeTiles(p, card, 2);
      }
      const meldTiles = [...used, card].sort((a, b) => a - b);
      p.melds.push({ type: isChi ? "chi" : "pon", tiles: meldTiles, from: discarderSeat });
      p.menzen = false;
      p.drawnTile = null;
      p.rinshan = false;
      this.emit(RiichiMsg.ENtfQiangCard, this.buildQiang(seat, action, used));
      await this._d(this.T.claim);
      this.emit(RiichiMsg.ENtfQiangCardEnd, this.buildQiangEnd(seat, action, used, meldTiles));
      await this._d(this.T.claim);
      await this.awaitTurn(seat, false);
    }
    async doKan(seat, card, kind) {
      const p = this.players[seat];
      let tiles;
      let kanCard = card;
      if (kind === "ankan") {
        tiles = this.takeTilesByKind(p, kindOf2(card), 4);
        p.melds.push({ type: "ankan", tiles });
        this.kanCount++;
      } else {
        const m = p.melds.find((x) => x.type === "pon" && kindOf2(x.tiles[0]) === kindOf2(card));
        const i = p.hand.findIndex((t2) => kindOf2(t2) === kindOf2(card));
        const t = p.hand.splice(i, 1)[0];
        m.type = "kan";
        m.tiles = [...m.tiles, t];
        tiles = m.tiles;
        this.kanCount++;
        kanCard = t;
        const robbed = this.checkChanKan(seat, t);
        if (robbed != null) {
          this.emit(RiichiMsg.ENtfPlayCard, this.buildPlayCard(
            seat,
            t,
            PlayAction.PengGang,
            false,
            this.players.map((q) => q.seat === robbed ? [PlayAction.Hu] : [])
          ));
          await this._d(this.T.claim);
          await this.winRon(robbed, seat, t, { chankan: true });
          return;
        }
      }
      for (const q of this.players) q.ippatsu = false;
      this.firstGoAround = false;
      this.emit(RiichiMsg.ENtfPlayCard, this.buildPlayCard(
        seat,
        kanCard,
        kind === "ankan" ? PlayAction.AnGang : PlayAction.PengGang,
        false,
        this.emptyClaims()
      ));
      await this._d(this.T.claim);
      this.revealKanDora();
      if (this.kanCount >= 4 && !this.players.some((q) => q.melds.filter((m) => m.type === "kan" || m.type === "ankan").length >= 4)) {
        await this.abortiveDraw(LiuJuType.SiGang, seat);
        return;
      }
      if (!await this.drawReplacement(seat)) return;
      await this.awaitTurn(seat, true);
    }
    checkChanKan(kanSeat, tile) {
      for (let i = 1; i < this.playersN; i++) {
        const s = (kanSeat + i) % this.playersN;
        const q = this.players[s];
        if (!q.waits || !q.waits.includes(kindOf2(tile))) continue;
        if (this.isFuriten(q)) continue;
        const w = calcWin(
          q.hand,
          q.melds,
          this.akaSet,
          __spreadProps(__spreadValues({}, this.winOpts(q, true, tile)), { chankan: true })
        );
        if (w.isAgari && w.hasYaku) return s;
      }
      return null;
    }
    revealKanDora() {
      const i = this.kanCount;
      const baoBase = this.sanma ? 8 : 4;
      const maxI = this.sanma ? 2 : 4;
      if (i >= 1 && i <= maxI && this.deadWall[baoBase + 2 * i] != null) {
        const ind = this.deadWall[baoBase + 2 * i];
        this.doraIndicators.push(ind);
        this.uraIndicators.push(this.deadWall[baoBase + 1 + 2 * i]);
        this._pendingBaoPreCard = ind;
      }
    }
    takeTiles(p, card, n) {
      return this.takeTilesByKind(p, kindOf2(card), n);
    }
    takeTilesByKind(p, kind, n) {
      const used = [];
      for (let i = 0; i < n; i++) {
        const idx = p.hand.findIndex((t) => kindOf2(t) === kind);
        if (idx >= 0) used.push(p.hand.splice(idx, 1)[0]);
      }
      return used;
    }
    // otherCards 是「自己手里贡献的牌」，**不含**被鸣的那张（实机抓包：
    // Chi/Peng 均为 2 张、MingGang 为 3 张，被鸣牌只由 NtfPlayCard.card 给出）。
    // 若把被鸣牌也塞进来，客户端会按 otherCards.length+1 判定副露类型：
    // 碰(3)→显示成明杠、吃(3)→UI 拼不出顺子而卡死。
    buildQiang(seat, action, otherCards) {
      return {
        seat,
        action,
        otherCards: otherCards || [],
        userInfos: this.players.map((q) => ({ seat: q.seat }))
      };
    }
    // otherCards = 发给客户端的「自己手里贡献的牌」（不含被鸣的那张）
    // meldTiles   = 完整面子（含被鸣牌），仅内部用于算食替禁止牌
    buildQiangEnd(seat, action, otherCards, meldTiles) {
      const p = this.players[seat];
      return {
        seats: [seat],
        action,
        otherCards: otherCards || [],
        userInfos: this.players.map((q) => ({
          seat: q.seat,
          tingInfos: q.seat === seat ? this.buildTingInfos(p) : [],
          // 实机 NtfQiangCardEnd 的 canPlayActions 只能是 []（他家）或 [0]（鸣牌者，
          // 即「仅可打牌」），绝不带 6/7/8/9/10。完整可选项由紧随其后的 NtfSendCard 下发。
          canPlayActions: q.seat === seat ? [PlayAction.Normal] : [],
          isZhenTing: this.isFuriten(q),
          cantPlays: q.seat === seat ? this.cantPlays(p, action, meldTiles || otherCards || []) : [],
          leftTimer: q.isHuman ? 20 : 0,
          xunNum: this.xunNum,
          zhenTingTypes: []
        }))
      };
    }
    // 吃碰后的食替禁止牌（同样是牌种编码 copy=0，实机样本 [440,310,280,380,320]）
    cantPlays(p, action, meldTiles) {
      if (action !== PlayAction.Chi && action !== PlayAction.Peng) return [];
      const out = /* @__PURE__ */ new Set();
      const claimed = this.lastDiscard ? this.lastDiscard.card : null;
      if (claimed != null) out.add(kindOf2(claimed));
      if (action === PlayAction.Chi && meldTiles.length === 3) {
        const ranks = meldTiles.map((t) => decodeId(t).rank).sort((a, b) => a - b);
        const suit = decodeId(meldTiles[0]).suit;
        if (ranks[2] - ranks[0] === 2) {
          if (ranks[0] > 1) out.add(suit * 10 + (ranks[0] - 1));
          if (ranks[2] < 9) out.add(suit * 10 + (ranks[2] + 1));
        }
      }
      return [...out].filter((k) => p.hand.some((t) => kindOf2(t) === k)).map((k) => k * 10);
    }
    // ================= 和牌 / 流局 =================
    async winTsumo(seat) {
      const p = this.players[seat];
      const w = calcWin(p.hand, p.melds, this.akaSet, this.winOpts(p, false));
      await this.endHand({ type: "tsumo", winner: seat, loser: null, card: p.drawnTile, win: w });
    }
    async winRon(seat, loser, card, extra = {}) {
      const p = this.players[seat];
      const w = calcWin(
        p.hand,
        p.melds,
        this.akaSet,
        __spreadValues(__spreadValues({}, this.winOpts(p, true, card)), extra)
      );
      await this.endHand({ type: "ron", winner: seat, loser, card, win: w });
    }
    async exhaustiveDraw() {
      const tenpai = this.players.map((p) => this.isTenpai(p));
      await this.endHand({ type: "draw", liuJuType: LiuJuType.HuangPai, tenpai });
    }
    async abortiveDraw(liuJuType, seat) {
      await this.endHand({
        type: "draw",
        liuJuType,
        liuJuSeat: seat,
        tenpai: this.players.map(() => false),
        noPenalty: true
      });
    }
    // ================= 结算 =================
    async endHand(res) {
      if (this.handEnded) return;
      this.handEnded = true;
      const n = this.playersN;
      const scores = this.players.map((p) => p.score);
      let dealerContinues = false;
      let ui = [];
      if (res.type === "draw") {
        if (!res.noPenalty) {
          const tenpaiSeats = res.tenpai.map((t, i) => t ? i : -1).filter((i) => i >= 0);
          const notenSeats = res.tenpai.map((t, i) => t ? -1 : i).filter((i) => i >= 0);
          if (tenpaiSeats.length && notenSeats.length) {
            const per = Math.floor(3e3 / tenpaiSeats.length);
            const pay2 = Math.floor(3e3 / notenSeats.length);
            for (const s of tenpaiSeats) scores[s] += per;
            for (const s of notenSeats) scores[s] -= pay2;
          }
        }
        dealerContinues = res.noPenalty ? true : !!res.tenpai[this.dealerSeat];
        const gameOver2 = this.decideGameOver(dealerContinues, scores);
        ui = this.buildStopUserInfos(scores, null, null, res.tenpai, gameOver2);
        this.emit(RiichiMsg.ENtfGameStop, {
          huSeats: [],
          huCardSeat: -1,
          huCard: 0,
          liBaoPreCards: [],
          isFinal: gameOver2,
          userInfos: ui,
          baoPreCards: this.doraIndicators.slice(),
          liuJuManGuanSeats: [],
          liuJuType: res.liuJuType,
          liuJuSeat: res.liuJuSeat != null ? res.liuJuSeat : -1,
          duiCards: [],
          duiCardsStr: "",
          duiCardsStrSalt: "",
          stopType: 0,
          winningStreak: 0
        });
        await this.finishHand(gameOver2, dealerContinues, scores);
        return;
      }
      const winner = res.winner;
      const winP = this.players[winner];
      const isDealerWin = winner === this.dealerSeat;
      const doraBreak = this.countDora(winP, res.type === "ron" ? res.card : null);
      const w = this.applyExtraFan(res.win, doraBreak.babei + doraBreak.babeiAsDora, isDealerWin);
      const pay = new Array(n).fill(0);
      let gain = 0;
      if (res.type === "tsumo") {
        for (let s = 0; s < n; s++) {
          if (s === winner) continue;
          let amt;
          if (isDealerWin) amt = w.oya[0] || 0;
          else amt = s === this.dealerSeat ? w.ko[0] || 0 : w.ko[1] || 0;
          amt += this.honba * 100;
          pay[s] = amt;
          gain += amt;
        }
      } else {
        const amt = (w.ten || 0) + this.honba * 300;
        pay[res.loser] = amt;
        gain = amt;
      }
      const stickBonus = this.riichiSticks * 1e3;
      gain += stickBonus;
      for (let s = 0; s < n; s++) scores[s] -= pay[s];
      scores[winner] += gain;
      const yakuInfo = mapYaku(w.yaku, {
        roundWind: this.roundWind,
        seatWind: this.seatWindOf(winner)
      });
      const detail = {
        yiFans: this.rebuildYiFans(yakuInfo.yiFans),
        isYiMan: yakuInfo.isYiMan || w.yakuman > 0,
        manType: manTypeFromResult({ han: w.han, yakuman: w.yakuman, name: w.name }),
        baoFan: doraBreak.omote,
        liBaoFan: doraBreak.ura,
        redBaoFan: doraBreak.aka,
        baBeiFan: doraBreak.babei,
        fu: w.fu,
        totalFan: w.han
      };
      dealerContinues = isDealerWin;
      this.riichiSticks = 0;
      const gameOver = this.decideGameOver(dealerContinues, scores);
      const huDelta = pay.map((v) => -v);
      huDelta[winner] = gain - stickBonus;
      ui = this.buildStopUserInfos(scores, winner, detail, null, gameOver, huDelta);
      this.emit(RiichiMsg.ENtfGameStop, {
        huSeats: [winner],
        huCardSeat: res.type === "ron" ? res.loser : winner,
        huCard: res.card || 0,
        liBaoPreCards: winP.riichi ? this.uraIndicators.slice() : [],
        isFinal: gameOver,
        userInfos: ui,
        baoPreCards: this.doraIndicators.slice(),
        liuJuManGuanSeats: [],
        liuJuType: 0,
        liuJuSeat: -1,
        duiCards: [],
        duiCardsStr: "",
        duiCardsStrSalt: "",
        stopType: 0,
        winningStreak: 0
      });
      await this.finishHand(gameOver, dealerContinues, scores);
    }
    // 给 riichi 库的结果补上库里没有的番数（目前只有拔北），并按标准公式重算点数。
    // 役满不受宝牌影响，原样返回。
    applyExtraFan(w, extraFan, isDealerWin) {
      if (!extraFan || !w || !w.isAgari || w.yakuman > 0) return w;
      const han = (w.han || 0) + extraFan;
      const fu = w.fu || 20;
      let base2;
      if (han >= 13) base2 = 8e3;
      else if (han >= 11) base2 = 6e3;
      else if (han >= 8) base2 = 4e3;
      else if (han >= 6) base2 = 3e3;
      else if (han === 5) base2 = 2e3;
      else base2 = Math.min(fu * 2 ** (2 + han), 2e3);
      const c = (x) => Math.ceil(x / 100) * 100;
      return __spreadProps(__spreadValues({}, w), {
        han,
        ten: c(base2 * (isDealerWin ? 6 : 4)),
        oya: [c(base2 * 2)],
        // 庄家自摸：每家付 base×2
        ko: [c(base2 * 2), c(base2)]
        // 闲家自摸：庄家付 base×2，其他闲家付 base
      });
    }
    // 宝牌拆分统计（表 / 里 / 赤 / 拔北）
    countDora(p, ronTile) {
      const tiles = p.hand.concat(ronTile != null ? [ronTile] : []);
      for (const m of p.melds) if (m.type !== "babei") tiles.push(...m.tiles);
      const babeiTiles = [];
      for (const m of p.melds) if (m.type === "babei") babeiTiles.push(...m.tiles);
      const count = (indList, list) => {
        let n = 0;
        for (const ind of indList) {
          const k = kindOf2(doraFromIndicator(ind, this.sanma));
          n += list.filter((t) => kindOf2(t) === k).length;
        }
        return n;
      };
      const babeiAsDora = count(this.doraIndicators, babeiTiles) + (p.riichi ? count(this.uraIndicators, babeiTiles) : 0);
      return {
        omote: count(this.doraIndicators, tiles) + count(this.doraIndicators, babeiTiles),
        ura: p.riichi ? count(this.uraIndicators, tiles) + count(this.uraIndicators, babeiTiles) : 0,
        aka: tiles.filter((t) => this.akaSet.has(t)).length,
        babei: babeiTiles.length,
        babeiAsDora
      };
    }
    // 剔除库合并出来的「ドラ」条目。
    //
    // 实机 15/15 例证明：宝牌**不进** yiFans，只走 baoFan / liBaoFan / redBaoFan / baBeiFan
    // 四个专用字段，且 totalFan = Σ(yiFans.fan) + 四项宝牌之和。
    // 之前这里把宝牌又 push 回 yiFans，客户端结算界面按
    // 「役列表 + 宝牌行」渲染时宝牌被算了两遍。
    rebuildYiFans(yiFans) {
      return yiFans.filter((y) => y.yiType !== YiType.Bao && y.yiType !== YiType.RedBao && y.yiType !== YiType.LiBao && y.yiType !== YiType.BaBeiBao);
    }
    buildStopUserInfos(scores, winner, detail, tenpai, isFinal, huDelta) {
      const out = [];
      const order = this.players.map((_, s) => s).sort((a, b) => scores[b] - scores[a] || a - b);
      const rankOf = [];
      order.forEach((s, i) => {
        rankOf[s] = i + 1;
      });
      const uma = this.playersN === 3 ? [15, 0, -15] : [35, 5, -15, -25];
      for (let s = 0; s < this.playersN; s++) {
        const p = this.players[s];
        const isWinner = winner === s;
        const change = scores[s] - p.scoreAtStart;
        const rank = rankOf[s];
        const jing = isFinal ? (scores[s] - this.startScore) / 1e3 + uma[rank - 1] : 0;
        out.push({
          seat: s,
          score: scores[s],
          handCards: p.hand.slice(),
          changeScore: change,
          yiFans: isWinner && detail ? detail.yiFans : [],
          baoFan: isWinner && detail ? detail.baoFan : 0,
          liBaoFan: isWinner && detail ? detail.liBaoFan : 0,
          redBaoFan: isWinner && detail ? detail.redBaoFan : 0,
          fu: isWinner && detail ? detail.fu : 0,
          totalFan: isWinner && detail ? detail.totalFan : 0,
          isYiMan: isWinner && detail ? detail.isYiMan : false,
          manType: isWinner && detail ? detail.manType : 0,
          baBeiFan: isWinner && detail ? detail.baBeiFan : 0,
          doorCardsInfos: p.melds.filter((m) => m.type !== "babei").map((m) => ({
            cards: m.tiles.slice(),
            action: m.type === "chi" ? PlayAction.Chi : m.type === "pon" ? PlayAction.Peng : m.type === "ankan" ? PlayAction.AnGang : PlayAction.MingGang,
            qiangSeat: m.from != null ? m.from : s
          })),
          // tings 同样是牌种编码（copy=0）：实机流局样本 [230]/[260,230]/[160,130]
          tings: tenpai ? tenpai[s] ? (p.waits || []).map((k) => k * 10) : [] : [],
          alreadyRiichi: p.riichi,
          baBeiCards: p.melds.filter((m) => m.type === "babei").map((m) => m.tiles[0]),
          rank,
          // 因和牌役番产生的点数变化。流局的听牌罚符不计入（实机流局局该字段缺省）。
          yiFanChangeDian: huDelta ? huDelta[s] || 0 : 0,
          jingSuanScore: jing,
          jieBi: Math.round(jing * 100),
          changePT: 0,
          isBaoPai: false,
          matchingScore: 0,
          isMatchingAward: false,
          lianZhuang: this.honba,
          maxFan: isWinner && detail ? detail.totalFan : 0,
          realJieBi: 0,
          finalBi: 0,
          level: 0,
          loveValue: 0,
          oldLevel: 0,
          oldLoveValue: 0,
          // 实机每人必带 oldPTLevel/oldPTPoint（段位与 PT），缺失会让结算界面段位区显示异常
          ptLevel: 0,
          ptPoint: 0,
          oldPTLevel: this.ptLevel || 16,
          oldPTPoint: this.ptPoint || 2605,
          itemRewardLevel: 0,
          itemRewards: []
        });
      }
      return out;
    }
    decideGameOver(dealerContinues, scores) {
      if (scores.some((s) => s < 0)) return true;
      if (this.handIndex + 1 >= this.maxHands) return true;
      // 1位必要点数：四麻 30000 / 三麻 40000
      const necessary = this.playersN === 3 ? 40000 : 30000;
      const top = Math.max.apply(null, scores);
      const topMeets = top >= necessary;
      const isAllLast = this.juNum + 1 >= this.playersN;
      const wind = ["", "\u4E1C", "\u5357"][this.roundWind] || "?";
      const ju = this.juNum + 1;
      // 南场（roundWind>=2）非末局：只要顶部达成必要点即结算
      if (this.roundWind >= 2 && !isAllLast && topMeets) {
        console.log("[riichi] decideGameOver: " + wind + ju + " 顶部=" + top + ">=必要点" + necessary + " → 南场达成条件，结算");
        return true;
      }
      if (!isAllLast) return false;
      // 末局
      if (!dealerContinues) {
        console.log("[riichi] decideGameOver: " + wind + ju + " 庄家未连庄 → 终局");
        return true;
      }
      if (this.roundWind >= 2) {
        console.log("[riichi] decideGameOver: " + wind + ju + " 南4末局 → 强行结算");
        return true;
      }
      // 东 All Last：达成必要点则终局，否则南入（连庄进南场）
      console.log("[riichi] decideGameOver: " + wind + ju + " 庄家=seat" + this.dealerSeat + " 顶部=" + top + " 必要点=" + necessary + " 达成=" + topMeets + " → " + (topMeets ? "\u7EC8\u5C40" : "\u5357\u5165"));
      return topMeets;
    }
    async finishHand(gameOver, dealerContinues, scores) {
      this.scores = scores.slice();
      this.handIndex += 1;
      if (dealerContinues) {
        this.honba += 1;
        if (!gameOver && this.roundWind === 1 && this.juNum + 1 >= this.playersN) {
          this.roundWind = 2;
          this.juNum = 0;
          this.honba = 0;
          // 南入：本场 All Last 庄家未登顶才延长，且 dealerContinues=true（连庄），
          // 故庄家必须保持（连庄进南场），不能重置为 0，否则会变成下家坐庄。
        }
      } else {
        this.honba = 0;
        this.juNum += 1;
        this.dealerSeat = this.nextSeat(this.dealerSeat);
      }
      if (gameOver) {
        this.matchOver = true;
        this.finished = true;
        return;
      }
      await this._d(this.T.hand);
    }
    /** 重置为一局全新东风战（分数归位、局号/本场/庄家清零）。
     *  注意：终局【不】走这里——真实服终局后引擎就停了，新一场是重新匹配出来的新房间、
     *  由 20403 链路 new 一个 GameEngine（见 finishHand 的注释）。此方法仅留给外部复用。 */
    resetMatch() {
      this.scores = new Array(this.playersN).fill(this.startScore);
      this.handIndex = 0;
      this.juNum = 0;
      this.honba = 0;
      this.dealerSeat = 0;
    }
    // ================= AI =================
    aiTurn(seat, drew, can) {
      const p = this.players[seat];
      if (can.includes(PlayAction.Hu)) return { action: PlayAction.Hu, card: p.drawnTile };
      if (can.includes(PlayAction.BaBei)) {
        const north = this.northInHand(p);
        if (north != null) return { action: PlayAction.BaBei, card: north };
      }
      if (can.includes(PlayAction.Riichi)) {
        const best2 = this.bestDiscard(p);
        if (best2.shanten === 0) return { action: PlayAction.Riichi, card: best2.discardId };
      }
      if (can.includes(PlayAction.AnGang) && this.aiWantsKan(p)) {
        return { action: PlayAction.AnGang, card: this.concealedQuadTile(p) };
      }
      if (can.includes(PlayAction.PengGang) && this.aiWantsKan(p)) {
        return { action: PlayAction.PengGang, card: this.addedKanTile(p) };
      }
      const best = this.bestDiscard(p, {
        dangerKinds: this.dangerKinds(seat),
        forced: p.riichi && p.riichiTurn !== this.xunNum ? p.drawnTile : null
      });
      return { action: PlayAction.Normal, card: best.discardId };
    }
    // 他家立直时的安全度参考
    dangerKinds(seat) {
      const riichiOthers = this.players.filter((q) => q.seat !== seat && q.riichi);
      if (!riichiOthers.length) return null;
      const safe = /* @__PURE__ */ new Set();
      const risky = /* @__PURE__ */ new Set();
      for (const q of riichiOthers) for (const k of q.discardKinds) safe.add(k);
      for (const q of riichiOthers) {
        for (const k of Array.from(safe)) if (!q.discardKinds.has(k)) safe.delete(k);
      }
      for (let suit = 1; suit <= 3; suit++) {
        for (let rank = 3; rank <= 7; rank++) {
          const k = suit * 10 + rank;
          if (!safe.has(k)) risky.add(k);
        }
      }
      return { safe, risky };
    }
    aiWantsKan(p) {
      if (p.riichi) return false;
      return this.bestDiscard(p).shanten > 1;
    }
    aiClaim(seat, discarderSeat, card, can) {
      const p = this.players[seat];
      if (can.includes(PlayAction.Hu)) return { action: PlayAction.Hu };
      const cur = this.currentShanten(p);
      if (can.includes(PlayAction.MingGang)) {
        if (cur > 1) return { action: PlayAction.MingGang };
      }
      if (can.includes(PlayAction.Peng)) {
        const after = this.shantenAfterClaim(p, card, "pon");
        if (after < cur && this.worthOpening(p, card, "pon")) {
          return { action: PlayAction.Peng, otherCards: this.previewTiles(p, card, 2) };
        }
      }
      if (can.includes(PlayAction.Chi)) {
        const chi = this.chiTiles(p, card);
        if (chi) {
          const after = this.shantenAfterClaim(p, card, "chi", chi);
          if (after < cur && this.worthOpening(p, card, "chi")) {
            return { action: PlayAction.Chi, otherCards: chi };
          }
        }
      }
      return null;
    }
    currentShanten(p) {
      return handShanten(p.hand, p.melds);
    }
    // 副露价值：已副露 / 碰到役牌 / 已接近听牌 / 宝牌够多才鸣
    worthOpening(p, card, kind) {
      if (!p.menzen) return true;
      const { suit, rank } = decodeId(card);
      const isYakuhai = suit === 4 && (rank >= 5 || rank === this.roundWind || rank === this.seatWindOf(p.seat));
      if (kind === "pon" && isYakuhai) return true;
      const cur = this.currentShanten(p);
      if (cur <= 1) return true;
      const dk = this.doraKinds();
      const doraN = p.hand.filter((t) => dk.has(kindOf2(t)) || this.akaSet.has(t)).length;
      return doraN >= 2 && cur <= 2;
    }
    shantenAfterClaim(p, card, kind, chiTiles = null) {
      const hand = p.hand.slice();
      let meld;
      if (kind === "pon") {
        const used = [];
        for (let i = 0; i < 2; i++) {
          const idx = hand.findIndex((t) => kindOf2(t) === kindOf2(card));
          if (idx >= 0) used.push(hand.splice(idx, 1)[0]);
        }
        if (used.length < 2) return 99;
        meld = { type: "pon", tiles: [...used, card] };
      } else {
        if (!chiTiles) return 99;
        for (const t of chiTiles) {
          const i = hand.indexOf(t);
          if (i >= 0) hand.splice(i, 1);
        }
        meld = { type: "chi", tiles: [...chiTiles, card] };
      }
      return chooseDiscard(hand, p.melds.concat([meld]), {
        doraKinds: this.doraKinds(),
        akaSet: this.akaSet
      }).shanten;
    }
    previewTiles(p, card, n) {
      const out = [];
      const seen = /* @__PURE__ */ new Set();
      for (const t of p.hand) {
        if (kindOf2(t) === kindOf2(card) && !seen.has(t)) {
          out.push(t);
          seen.add(t);
        }
        if (out.length >= n) break;
      }
      return out;
    }
    // ================= 人类输入 =================
    // 注意竞态：awaitTurn 先 emit(NtfSendCard) 再 await waitHuman('draw') 设置 _pending。
    // 客户端在收到 NtfSendCard 的瞬间就可能调用 submitDraw，此时 _pending 尚未就绪，
    // 直接调用会成 no-op 导致引擎永久等待。因此 submitDraw/submitClaim 在未就绪时
    // 缓存请求，waitHuman 进入等待时立即消费缓冲，避免死锁。
    waitHuman(kind) {
      return new Promise((resolve) => {
        this._pending = { kind, resolve };
        if (kind === "draw" && this._bufferedDraw != null) {
          const p = this._bufferedDraw;
          this._bufferedDraw = null;
          this._pending = null;
          resolve(p || {});
        } else if (kind === "claim" && this._bufferedClaim != null) {
          const p = this._bufferedClaim;
          this._bufferedClaim = null;
          this._pending = null;
          resolve(p || {});
        }
      });
    }
    submitDraw(payload) {
      if (this._pending && this._pending.kind === "draw") {
        const r = this._pending.resolve;
        this._pending = null;
        r(payload || {});
      } else if (!this._processing) {
        // 仅在「非动作执行中」缓冲（合法早到响应）；动作执行中的包视为重复包直接丢弃
        this._bufferedDraw = payload || {};
      }
    }
    submitClaim(payload) {
      if (this._pending && this._pending.kind === "claim") {
        const r = this._pending.resolve;
        this._pending = null;
        r(payload || {});
      } else if (!this._processing) {
        this._bufferedClaim = payload || {};
      }
    }
    // 调试快照
    snapshot() {
      return {
        ju: this.juNum,
        honba: this.honba,
        dealer: this.dealerSeat,
        remain: this.remain,
        dora: this.doraIndicators.map(tileName),
        players: this.players.map((p) => ({
          seat: p.seat,
          score: p.score,
          riichi: p.riichi,
          hand: p.hand.map(tileName).join(" "),
          melds: p.melds.map((m) => m.type + ":" + m.tiles.map(tileName).join("")).join(" ")
        }))
      };
    }
  };
  function mulberry32(a) {
    return function() {
      a |= 0;
      a = a + 1831565813 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // pb.mjs
  var import_light = __toESM(require_light(), 1);

  // riichi_desc.mjs
  var riichi_desc_default = { "nested": { "riichi": { "options": { "optimize_for": "SPEED", "go_package": "gitlab.gg.com/riichi_mahjong/proto/go/client/game_logic/riichi", "csharp_namespace": "Com.Framework.Protocol" }, "nested": { "CardType": { "values": { "None": 0, "Wan": 1, "Tong": 2, "Tiao": 3, "Zi": 4, "Hua": 5 } }, "Result": { "values": { "Succ": 0, "Fail_InternalError": 1, "Fail_InvalidParam": 2, "Fail_InvalidSequence": 3, "Fail_ActionNotInCanPlayActions": 101, "Fail_CardInCantPlays": 102, "Fail_RiichiPlayCardWrong": 103, "Fail_CardNotInHand": 104, "Fail_CardNotMatchAction": 105, "Fail_ActionNotInCanQiangActions": 201, "Fail_InvalidOtherCards": 202 } }, "Wind": { "values": { "East": 0, "South": 1, "West": 2, "North": 3 } }, "RiichiMsg": { "values": { "ENone": 0, "EReqPrepare": 1, "ERspPrepare": 2, "EReqPlayCard": 3, "ERspPlayCard": 4, "EReqQiangCard": 5, "ERspQiangCard": 6, "EReqSetInternalState": 7, "ERspSetInternalState": 8, "EReqCloseOfflineTip": 9, "ERspCloseOfflineTip": 10, "EReqClickUI": 11, "ERspClickUI": 12, "ENtfToPrepare": 1001, "ENtfPrepare": 1002, "ENtfGameStart": 1003, "ENtfSendCard": 1004, "ENtfPlayCard": 1005, "ENtfQiangCard": 1006, "ENtfQiangCardEnd": 1007, "ENtfGameStop": 1008, "ENtfOfflineTip": 1009, "EGmBegin": 5e4, "EGmReqStopGame": 50001, "EGmRspStopGame": 50002, "EGmReqInitCard": 50003, "EGmRspInitCard": 50004, "EGmReqSetRobotConfig": 50005, "EGmRspSetRobotConfig": 50006, "EGmEnd": 6e4 } }, "PlayAction": { "values": { "Normal": 0, "Guo": 1, "Chi": 2, "Peng": 3, "MingGang": 4, "PengGang": 5, "AnGang": 6, "Riichi": 7, "Hu": 8, "JiuZhongJiuLiuJu": 9, "BaBei": 10 } }, "FanFuType": { "values": { "NoFanFu": 0, "FanFuNormal": 1 } }, "YiType": { "values": { "NoYi": 0, "RedBao": 101, "Bao": 102, "LiBao": 103, "BaBeiBao": 104, "LiZhi": 1101, "YiFa": 1102, "MengQianQingZiMoHu": 1103, "PingHu": 1104, "YiBeiKou": 1105, "DuanYaoJiu": 1301, "YiPaiZiFeng": 1302, "YiPaiChangFeng": 1303, "YiPaiSanYuanBai": 1304, "YiPaiSanYuanFa": 1305, "YiPaiSanYuanZhong": 1306, "LingShangKaiHua": 1307, "HaiDiLaoYue": 1308, "HeDiMoYu": 1309, "QiangGang": 1310, "YiPaiBeiFeng": 1311, "ShuangLiZi": 2101, "QiDuiZi": 2102, "HunQuanDaiYaoJiu": 2201, "YiQiTongGuan": 2202, "SanSeTongShun": 2203, "SanSeTongKe": 2301, "SanAnKe": 2302, "SanGangZi": 2303, "DuiDuiHu": 2304, "HunLaoTou": 2305, "XiaoSanYuan": 2306, "ErBeiKou": 3101, "ChunQuanDaiYaoJiu": 3201, "HunYiSe": 3202, "LiuJuManGuan": 5301, "QingYiSe": 6201, "TianHu": 91101, "DiHu": 91102, "GuoShiWuShuang": 91103, "JiuLianBaoDeng": 91104, "SiAnKe": 91105, "SiGangZi": 91301, "QingLaoTou": 91302, "ZiYiSe": 91303, "XiaoSiXi": 91304, "DaSanYuan": 91305, "LvYiSe": 91306, "GuoShiWuShuangShiSanMian": 92101, "ChunZhengJiuLianBaoDeng": 92102, "SiAnKeDanQi": 92103, "DaSiXi": 92301 } }, "LiuJuType": { "values": { "HuangPai": 0, "SiFengLianDa": 1, "SiGang": 2, "JiuZhongJiuPai": 3, "SiJiaLiZhi": 4 } }, "ManType": { "values": { "NoMan": 0, "ManGuan": 1, "TiaoMan": 2, "BeiMan": 3, "SanBeiMan": 4, "YiMan": 5 } }, "InternalStateType": { "values": { "LiPai": 0, "HuPai": 1, "PengGangChi": 2, "MoQie": 3, "LiZhiGang": 4, "LiZhiBoBei": 5 } }, "ZhenTingType": { "values": { "ZhenTingType_RiichiFuriten": 0, "ZhenTingType_TemporaryFuriten": 1, "ZhenTingType_SelfFuriten": 2 } }, "ClickUIType": { "values": { "ClickUITypeUnknown": 0, "ClickUITypeNoYiTip": 1 } }, "EnumItemRewardLevel": { "values": { "enumItemRewardLevelNo": 0, "enumItemRewardLevelOneHan": 1, "enumItemRewardLevelTwoHan": 2, "enumItemRewardLevelThreeHan": 3, "enumItemRewardLevelFourHan": 4, "enumItemRewardLevelMangan": 5, "enumItemRewardLevelJumpFullHan": 6, "enumItemRewardLevelDoubleFullHan": 7, "enumItemRewardLevelTripleFullHan": 8, "enumItemRewardLevelYakuman": 9, "enumItemRewardLevelDoubleYakuman": 10 } }, "TingInfo": { "fields": { "play": { "type": "int32", "id": 1 }, "ting": { "type": "int32", "id": 2 }, "hasYiWhenMo": { "type": "bool", "id": 3 }, "yiManChance": { "type": "int32", "id": 4 }, "fanFuTypeWhenMo": { "type": "int32", "id": 5 }, "hasYiWhenRong": { "type": "bool", "id": 6 }, "manType": { "type": "ManType", "id": 7 } } }, "YiFan": { "fields": { "yiType": { "type": "int32", "id": 1 }, "fan": { "type": "int32", "id": 2 }, "isYiMan": { "type": "bool", "id": 3 }, "isFuLuMinus": { "type": "bool", "id": 4 } } }, "ToPrepareUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 }, "userID": { "type": "uint64", "id": 2 } } }, "NtfToPrepare": { "fields": { "userInfos": { "rule": "repeated", "type": "ToPrepareUserInfo", "id": 1 } } }, "PrepareUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 } } }, "NtfPrepare": { "fields": { "seat": { "type": "int32", "id": 1 }, "userInfos": { "rule": "repeated", "type": "PrepareUserInfo", "id": 2 } } }, "GameStartUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 }, "score": { "type": "int64", "id": 2 }, "initScore": { "type": "int64", "id": 3 }, "handCards": { "rule": "repeated", "type": "int32", "id": 4 }, "tingInfos": { "rule": "repeated", "type": "TingInfo", "id": 5 }, "canPlayActions": { "rule": "repeated", "type": "int32", "id": 6 }, "xunNum": { "type": "int32", "id": 7 } } }, "NtfGameStart": { "fields": { "changWind": { "type": "int32", "id": 1 }, "juNum": { "type": "int32", "id": 2 }, "benChangNum": { "type": "int32", "id": 3 }, "zhuangSeat": { "type": "int32", "id": 4 }, "baoPreCard": { "type": "int32", "id": 6 }, "remainDuiCardNum": { "type": "int32", "id": 7 }, "userInfos": { "rule": "repeated", "type": "GameStartUserInfo", "id": 9 }, "leftTimer": { "type": "int32", "id": 11 }, "defaultMinTimeout": { "type": "int32", "id": 12 }, "riichiBangNum": { "type": "int32", "id": 13 }, "isAllLast": { "type": "bool", "id": 14 }, "gameID": { "type": "string", "id": 15 }, "duiCardsStrEncode": { "type": "string", "id": 16 }, "duiCardsStrSaltEncode": { "type": "string", "id": 17 }, "ServerRedundantTimeOut": { "type": "int32", "id": 23 }, "FirstGameStartRedundantTimeOut": { "type": "int32", "id": 24 } } }, "SendCardUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 }, "card": { "type": "int32", "id": 2 }, "tingInfos": { "rule": "repeated", "type": "TingInfo", "id": 3 }, "canPlayActions": { "rule": "repeated", "type": "int32", "id": 4 }, "leftTimer": { "type": "int32", "id": 5 }, "isZhenTing": { "type": "bool", "id": 6 }, "xunNum": { "type": "int32", "id": 7 }, "zhenTingTypes": { "rule": "repeated", "type": "int32", "id": 8 } } }, "NtfSendCard": { "fields": { "seat": { "type": "int32", "id": 1 }, "baoPreCard": { "type": "int32", "id": 3 }, "userInfos": { "rule": "repeated", "type": "SendCardUserInfo", "id": 4 } } }, "PlayCardUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 }, "canQiangActions": { "rule": "repeated", "type": "int32", "id": 2 }, "isZhenTing": { "type": "bool", "id": 6 }, "leftTimer": { "type": "int32", "id": 7 }, "canAnGangNoNumCardsAfterRiichi": { "rule": "repeated", "type": "int32", "id": 8 }, "zhenTingTypes": { "rule": "repeated", "type": "int32", "id": 9 } } }, "NtfPlayCard": { "fields": { "seat": { "type": "int32", "id": 1 }, "card": { "type": "int32", "id": 2 }, "action": { "type": "int32", "id": 3 }, "isMoQie": { "type": "bool", "id": 5 }, "userInfos": { "rule": "repeated", "type": "PlayCardUserInfo", "id": 6 } } }, "QiangCardUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 } } }, "NtfQiangCard": { "fields": { "seat": { "type": "int32", "id": 1 }, "action": { "type": "int32", "id": 2 }, "otherCards": { "rule": "repeated", "type": "int32", "id": 3 }, "userInfos": { "rule": "repeated", "type": "QiangCardUserInfo", "id": 4 } } }, "QiangCardEndUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 }, "tingInfos": { "rule": "repeated", "type": "TingInfo", "id": 2 }, "canPlayActions": { "rule": "repeated", "type": "int32", "id": 3 }, "isZhenTing": { "type": "bool", "id": 4 }, "cantPlays": { "rule": "repeated", "type": "int32", "id": 5 }, "leftTimer": { "type": "int32", "id": 6 }, "xunNum": { "type": "int32", "id": 7 }, "zhenTingTypes": { "rule": "repeated", "type": "int32", "id": 8 } } }, "NtfQiangCardEnd": { "fields": { "seats": { "rule": "repeated", "type": "int32", "id": 1 }, "action": { "type": "int32", "id": 2 }, "otherCards": { "rule": "repeated", "type": "int32", "id": 3 }, "userInfos": { "rule": "repeated", "type": "QiangCardEndUserInfo", "id": 4 } } }, "GameStopUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 }, "score": { "type": "int64", "id": 2 }, "handCards": { "rule": "repeated", "type": "int32", "id": 3 }, "changeScore": { "type": "int64", "id": 4 }, "yiFans": { "rule": "repeated", "type": "YiFan", "id": 5 }, "baoFan": { "type": "int32", "id": 6 }, "liBaoFan": { "type": "int32", "id": 7 }, "redBaoFan": { "type": "int32", "id": 8 }, "fu": { "type": "int32", "id": 9 }, "totalFan": { "type": "int32", "id": 10 }, "isYiMan": { "type": "bool", "id": 11 }, "jingSuanScore": { "type": "float", "id": 12 }, "changePT": { "type": "int64", "id": 13 }, "rank": { "type": "int32", "id": 14 }, "doorCardsInfos": { "rule": "repeated", "type": "DoorCardsInfo", "id": 15 }, "tings": { "rule": "repeated", "type": "int32", "id": 16 }, "manType": { "type": "int32", "id": 17 }, "alreadyRiichi": { "type": "bool", "id": 18 }, "baBeiCards": { "rule": "repeated", "type": "int32", "id": 19 }, "baBeiFan": { "type": "int32", "id": 20 }, "yiFanChangeDian": { "type": "int64", "id": 21 }, "isBaoPai": { "type": "bool", "id": 22 }, "jieBi": { "type": "int64", "id": 23 }, "matchingScore": { "type": "int32", "id": 24 }, "isMatchingAward": { "type": "bool", "id": 25 }, "lianZhuang": { "type": "int32", "id": 26 }, "maxFan": { "type": "int32", "id": 27 }, "realJieBi": { "type": "int64", "id": 28 }, "finalBi": { "type": "int64", "id": 29 }, "level": { "type": "int64", "id": 103 }, "loveValue": { "type": "int64", "id": 104 }, "oldLevel": { "type": "int64", "id": 105 }, "oldLoveValue": { "type": "int64", "id": 106 }, "ptLevel": { "type": "int32", "id": 107 }, "ptPoint": { "type": "int32", "id": 108 }, "oldPTLevel": { "type": "int32", "id": 109 }, "oldPTPoint": { "type": "int32", "id": 110 }, "itemRewardLevel": { "type": "int32", "id": 111 }, "itemRewards": { "rule": "repeated", "type": "ItemReward", "id": 112 } } }, "ItemReward": { "fields": { "itemId": { "type": "int64", "id": 1 }, "itemCount": { "type": "int64", "id": 2 } } }, "NtfGameStop": { "fields": { "huSeats": { "rule": "repeated", "type": "int32", "id": 1 }, "huCardSeat": { "type": "int32", "id": 2 }, "huCard": { "type": "int32", "id": 3 }, "liBaoPreCards": { "rule": "repeated", "type": "int32", "id": 4 }, "isFinal": { "type": "bool", "id": 5 }, "userInfos": { "rule": "repeated", "type": "GameStopUserInfo", "id": 6 }, "baoPreCards": { "rule": "repeated", "type": "int32", "id": 7 }, "liuJuManGuanSeats": { "rule": "repeated", "type": "int32", "id": 8 }, "liuJuType": { "type": "int32", "id": 9 }, "liuJuSeat": { "type": "int32", "id": 10 }, "duiCards": { "rule": "repeated", "type": "int32", "id": 11 }, "duiCardsStr": { "type": "string", "id": 12 }, "duiCardsStrSalt": { "type": "string", "id": 13 }, "stopType": { "type": "int32", "id": 14 }, "winningStreak": { "type": "int32", "id": 15 } } }, "ReqPrepare": { "fields": {} }, "RspPrepare": { "fields": { "result": { "type": "int32", "id": 1 } } }, "ReqPlayCard": { "fields": { "card": { "type": "int32", "id": 1 }, "action": { "type": "int32", "id": 2 }, "isTimeout": { "type": "bool", "id": 3 } } }, "RspPlayCard": { "fields": { "result": { "type": "int32", "id": 1 } } }, "ReqQiangCard": { "fields": { "action": { "type": "int32", "id": 1 }, "otherCards": { "rule": "repeated", "type": "int32", "id": 2 }, "isTimeout": { "type": "bool", "id": 3 } } }, "RspQiangCard": { "fields": { "result": { "type": "int32", "id": 1 } } }, "DoorCardsInfo": { "fields": { "cards": { "rule": "repeated", "type": "int32", "id": 1 }, "action": { "type": "int32", "id": 2 }, "qiangSeat": { "type": "int32", "id": 3 } } }, "Offline2OnlineUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 }, "handCardsNum": { "type": "int32", "id": 2 }, "doorCardsInfos": { "rule": "repeated", "type": "DoorCardsInfo", "id": 3 }, "handCards": { "rule": "repeated", "type": "int32", "id": 4 }, "playedCards": { "rule": "repeated", "type": "int32", "id": 5 }, "PlayedCardsOtherTake": { "rule": "repeated", "type": "int32", "id": 6 }, "riichiTagCard": { "type": "int32", "id": 7 }, "alreadyRiichi": { "type": "bool", "id": 8 }, "tingInfos": { "rule": "repeated", "type": "TingInfo", "id": 9 }, "score": { "type": "int64", "id": 10 }, "canPlayActions": { "rule": "repeated", "type": "int32", "id": 11 }, "isZhenTing": { "type": "bool", "id": 12 }, "moQieMap": { "keyType": "int32", "type": "bool", "id": 14 }, "leftTimer": { "type": "int32", "id": 15 }, "cantPlays": { "rule": "repeated", "type": "int32", "id": 16 }, "changeScore": { "type": "int64", "id": 17 }, "baBeiCards": { "rule": "repeated", "type": "int32", "id": 18 }, "internalState": { "keyType": "int32", "type": "int32", "id": 19 }, "initScore": { "type": "int64", "id": 20 }, "canAnGangNoNumCardsAfterRiichi": { "rule": "repeated", "type": "int32", "id": 21 }, "DefaultMinTimeout": { "type": "int32", "id": 22 }, "ServerRedundantTimeOut": { "type": "int32", "id": 23 }, "zhenTingTypes": { "rule": "repeated", "type": "int32", "id": 24 }, "zhenTingTypesGuo": { "rule": "repeated", "type": "int32", "id": 25 } } }, "QiangInfo": { "fields": { "seat": { "type": "int32", "id": 1 }, "action": { "type": "int32", "id": 2 }, "otherCards": { "rule": "repeated", "type": "int32", "id": 3 } } }, "Offline2OnlineGameScene": { "fields": { "seat": { "type": "int32", "id": 1 }, "changWind": { "type": "int32", "id": 2 }, "juNum": { "type": "int32", "id": 3 }, "benChangNum": { "type": "int32", "id": 4 }, "zhuangSeat": { "type": "int32", "id": 5 }, "openBaoPreCards": { "rule": "repeated", "type": "int32", "id": 6 }, "remainDuiCardNum": { "type": "int32", "id": 7 }, "currentSeat": { "type": "int32", "id": 8 }, "currentPlayCard": { "type": "int32", "id": 9 }, "currentAction": { "type": "int32", "id": 10 }, "canQiangActions": { "rule": "repeated", "type": "int32", "id": 11 }, "qiangInfos": { "rule": "repeated", "type": "QiangInfo", "id": 12 }, "offline2OnlineUserInfos": { "rule": "repeated", "type": "Offline2OnlineUserInfo", "id": 13 }, "currentPlayEndTime": { "type": "int64", "id": 14 }, "currentQiangEndTime": { "type": "int64", "id": 15 }, "defaultMinTimeout": { "type": "int32", "id": 16 }, "ServerRedundantTimeOut": { "type": "int32", "id": 25 }, "riichiBangNum": { "type": "int32", "id": 17 }, "gameID": { "type": "string", "id": 18 }, "preSeat": { "type": "int32", "id": 19 }, "prePlayCard": { "type": "int32", "id": 20 }, "preAction": { "type": "int32", "id": 21 }, "preQiangInfos": { "rule": "repeated", "type": "QiangInfo", "id": 22 }, "duiCardsStrEncode": { "type": "string", "id": 23 }, "duiCardsStrSaltEncode": { "type": "string", "id": 24 }, "MapFriendPoll": { "keyType": "int32", "type": "bool", "id": 26 }, "FriendOutTime": { "type": "int64", "id": 27 } } }, "NtfOfflineToolTip": { "fields": { "isTempBlock": { "type": "bool", "id": 1 } } }, "SendBackOnlineReq": { "fields": {} }, "SendBackOnlineRsp": { "fields": { "result": { "type": "int32", "id": 1 } } }, "ReqSetInternalState": { "fields": { "InternalState": { "keyType": "int32", "type": "int32", "id": 1 } } }, "RspSetInternalState": { "fields": { "result": { "type": "int32", "id": 1 } } }, "ReqCloseOfflineTip": { "fields": {} }, "RspCloseOfflineTip": { "fields": { "result": { "type": "int32", "id": 1 } } }, "ReqClickUI": { "fields": { "tp": { "type": "int32", "id": 1 } } }, "RspClickUI": { "fields": { "result": { "type": "int32", "id": 1 } } }, "GmReqStopGame": { "fields": {} }, "GmRspStopGame": { "fields": {} }, "GmReqInitCard": { "fields": { "cardId": { "type": "int32", "id": 1 }, "isZimo": { "type": "bool", "id": 2 }, "isForbidRobotHu": { "type": "bool", "id": 3 } } }, "GmRspInitCard": { "fields": {} }, "GmReqSetRobotConfig": { "fields": { "robotSpeedLevel": { "type": "int32", "id": 1 } }, "nested": { "RobotSpeed": { "values": { "Normal": 0, "HalfTime": 1, "Fast": 2 } } } }, "GmRspSetRobotConfig": { "fields": {} }, "KRiichiMsg": { "fields": { "msgType": { "type": "RiichiMsg", "id": 1 }, "time": { "type": "int64", "id": 3 }, "payload": { "type": "bytes", "id": 100 } } } } } } };

  // pb.mjs
  var root = import_light.default.Root.fromJSON(riichi_desc_default);
  function encodeMsg(typeName, obj) {
    const T = root.lookupType("riichi." + typeName);
    const err = T.verify(obj);
    if (err) throw new Error("protobuf verify " + typeName + ": " + err);
    const msg = T.fromObject(obj);
    const buf = T.encode(msg).finish();
    return buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  }
  function decodeMsg(typeName, buf) {
    const T = root.lookupType("riichi." + typeName);
    const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    const m = T.decode(u8);
    return T.toObject(m, { defaults: true, arrays: true, objects: true, enums: Number });
  }

  // browser_entry.mjs
  var MSG_NAME = {
    1: "ReqPrepare",
    2: "RspPrepare",
    3: "ReqPlayCard",
    4: "RspPlayCard",
    5: "ReqQiangCard",
    6: "RspQiangCard",
    7: "ReqSetInternalState",
    8: "RspSetInternalState",
    9: "ReqCloseOfflineTip",
    10: "RspCloseOfflineTip",
    11: "ReqClickUI",
    12: "RspClickUI",
    1001: "NtfToPrepare",
    1002: "NtfPrepare",
    1003: "NtfGameStart",
    1004: "NtfSendCard",
    1005: "NtfPlayCard",
    1006: "NtfQiangCard",
    1007: "NtfQiangCardEnd",
    1008: "NtfGameStop",
    1009: "NtfOfflineToolTip"
  };
  var RiichiSession = class {
    constructor(opts = {}) {
      this.opts = {
        players: opts.players != null ? opts.players : 4,
        akaCount: opts.akaCount != null ? opts.akaCount : 1,
        startScore: opts.startScore != null ? opts.startScore : 25e3,
        // 一局东风战的手数上限：三麻 12、四麻 16（含连庄）
        maxHands: opts.maxHands != null ? opts.maxHands : opts.players === 3 ? 12 : 16,
        // AI 思考延迟倍率。0 = 瞬间（自测用），1 = 正常观感
        speed: opts.speed != null ? opts.speed : 1,
        seed: opts.seed,
        autoHuman: opts.autoHuman != null ? opts.autoHuman : false,
        // 座位 -> 真实 userID，必须与 20408/20014 下发的牌桌 uid 完全一致
        uids: opts.uids || null
      };
      this.onFrame = opts.onFrame || (() => {
      });
      this.log = opts.log || (() => {
      });
      this.engine = null;
      this.stopped = false;
      this.matchOver = false;
    }
    /** 编码并回推一个服务端事件 */
    send(ev, payload) {
      if (this.stopped) return;
      const name = MSG_NAME[ev];
      if (!name) {
        this.log("[riichi] \u672A\u77E5\u4E8B\u4EF6\u53F7 " + ev);
        return;
      }
      let bytes;
      try {
        bytes = encodeMsg(name, payload);
      } catch (e) {
        this.log("[riichi] \u7F16\u7801\u5931\u8D25 " + name + ": " + e.message);
        return;
      }
      this.onFrame(ev, bytes);
    }
    /** 惰性创建引擎。一场（东风战）打完 = 本会话结束：引擎停、matchOver 置位，
     *  之后【绝不】在同一会话里重建引擎——新一场必须由客户端重新走 20403 匹配，
     *  server.js 的 20403 handler 会 stop 旧 session 并 new 一个新的 RiichiSession。 */
    ensureEngine() {
      if (this.matchOver) return null;
      if (this.engine) return this.engine;
      const o = this.opts;
      const seed = o.seed != null ? o.seed : Math.random() * 2147483647 | 0;
      const eng = new GameEngine({
        players: o.players,
        akaCount: o.akaCount,
        startScore: o.startScore,
        maxHands: o.maxHands,
        speed: o.speed,
        seed,
        uids: o.uids,
        autoHuman: o.autoHuman,
        // false=0号位真人，true=AI代打（测试用）
        emit: (ev, payload) => this.send(ev, payload),
        onFinish: () => {
          this.matchOver = true;
          this.log("[riichi] \u7EC8\u5C40\uFF0C\u5F15\u64CE\u505C\u6B62\uFF1B\u7B49\u5BA2\u6237\u7AEF 20102 \u6536\u573A\u6216 20403 \u91CD\u65B0\u5339\u914D");
        }
      });
      this.engine = eng;
      this.log("[riichi] \u65B0\u5BF9\u5C40 players=" + o.players + " seed=" + seed + " maxHands=" + o.maxHands);
      eng.start().catch((e) => this.log("[riichi] \u5F15\u64CE\u5F02\u5E38: " + (e && e.stack || e)));
      return eng;
    }
    /** 处理一条客户端上行的内层消息 */
    handleClient(msgType, innerBytes) {
      if (this.matchOver) {
        if (!this._mutedLogged) {
          this._mutedLogged = true;
          this.log("[riichi] \u7EC8\u5C40\u540E\u5FFD\u7565\u5BA2\u6237\u7AEF\u4E0A\u884C\uFF08\u5BF9\u9F50\u771F\u5B9E\u670D\uFF1A\u96F6\u54CD\u5E94\uFF09\uFF0C\u7B49 20102/20403");
        }
        return;
      }
      const name = MSG_NAME[msgType];
      let payload = {};
      if (name && innerBytes && innerBytes.length) {
        try {
          payload = decodeMsg(name, innerBytes);
        } catch (e) {
          this.log("[riichi] \u89E3\u7801\u5931\u8D25 mt=" + msgType + ": " + e.message);
        }
      }
      switch (msgType) {
        case RiichiMsg.EReqPrepare: {
          const e = this.ensureEngine();
          if (!e) return;
          this.send(RiichiMsg.ERspPrepare, { result: 0 });
          e.submitPrepare();
          break;
        }
        case RiichiMsg.EReqPlayCard: {
          const e = this.ensureEngine();
          if (!e) return;
          this.send(RiichiMsg.ERspPlayCard, { result: 0 });
          e.submitDraw(payload);
          break;
        }
        case RiichiMsg.EReqQiangCard: {
          const e = this.ensureEngine();
          if (!e) return;
          this.send(RiichiMsg.ERspQiangCard, { result: 0 });
          e.submitClaim(payload);
          break;
        }
        case RiichiMsg.EReqSetInternalState:
          this.send(RiichiMsg.ERspSetInternalState, { result: 0 });
          break;
        case RiichiMsg.EReqCloseOfflineTip:
          this.send(RiichiMsg.ERspCloseOfflineTip, { result: 0 });
          break;
        case RiichiMsg.EReqClickUI:
          this.send(RiichiMsg.ERspClickUI, { result: 0 });
          break;
        default:
          this.log("[riichi] \u672A\u5904\u7406\u7684\u5BA2\u6237\u7AEF\u6D88\u606F mt=" + msgType);
      }
    }
    /** 连接断开：让引擎自然停下并不再回推 */
    stop() {
      this.stopped = true;
      const eng = this.engine;
      this.engine = null;
      if (!eng) return;
      eng.emit = () => {
      };
      eng.finished = true;
      eng.handEnded = true;
      try {
        eng.submitPrepare();
      } catch (e) {
      }
      try {
        eng.submitDraw({});
      } catch (e) {
      }
      try {
        eng.submitClaim({});
      } catch (e) {
      }
    }
  };
  var _g = typeof window !== "undefined" ? window : globalThis;
  var _MJ = _g.__mj || (_g.__mj = {});
  _MJ.riichi = {
    RiichiSession,
    GameEngine,
    MSG_NAME,
    encodeMsg,
    decodeMsg,
    RiichiMsg,
    PlayAction,
    ManType,
    LiuJuType,
    YiType,
    tileName,
    decodeId,
    tileId
  };
})();
/*! Bundled license information:

long/umd/index.js:
  (**
   * @license
   * Copyright 2009 The Closure Library Authors
   * Copyright 2020 Daniel Wirtz / The long.js Authors.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
