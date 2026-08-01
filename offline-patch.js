/* 激情麻将 离线补丁
 * 1) 把游戏内硬编码的 wss://riichiproxy1.mahjongdreamone.com:443 接到「浏览器内的」
 *    JS Mock 服务端（mock/server.js 的 FakeWebSocket），不再需要任何外部进程；
 *    如果 mock 脚本没加载上，则退化为重定向到本地 wss://host:9443（Python 版）
 * 2) 把所有外网 HTTP 请求（埋点 / SDK / CDN）拦下来，避免离线环境下卡住
 * 3) 提供 window.__mjmock 便于在控制台观察收发帧
 */
(function () {
  'use strict';

  // 浏览器内 Mock（mock/server.js）。
  var INPROC = window.__mj && window.__mj.server && window.__mj.server.FakeWebSocket;

  // 本地允许直连的 host（静态资源）
  var LOCAL = [location.host];

  // 需要拦截并返回空响应的外部域
  var BLOCK = /(qsdkapi-q\.ggbak\.com|kfapi\.quickapi\.net|playgame\.quickjoy\.com|tb16888-\d\.mahjongdreamone\.com|dumplog\.mahjongdreamone\.com|aso\.mahjongdreamone\.com|mjdream\.com)/;

  // 需要改写到本地镜像的外部资源域
  var REWRITE = [
    [/^https?:\/\/example\.com\/(.*)$/,
      location.origin + location.pathname.replace(/[^/]+$/, '') + '$1']
  ];

  function rewriteUrl(u) {
    if (typeof u !== 'string') return u;
    for (var i = 0; i < REWRITE.length; i++) {
      if (REWRITE[i][0].test(u)) return u.replace(REWRITE[i][0], REWRITE[i][1]);
    }
    return u;
  }

  var stats = { sent: 0, recv: 0, frames: [] };
  window.__mjmock = {
    stats: stats,
    url: INPROC,
    inproc: !!INPROC,
    server: INPROC ? window.__mj.server : null,
    dump: function (n) { return stats.frames.slice(-(n || 20)); }
  };

  // ---------------- WebSocket 劫持 ----------------
  var NativeWS = window.WebSocket;
  function PatchedWS(url, protocols) {
    var orig = url;
    var isGame = /riichiproxy|mahjongproxy|riichi_proxy/i.test(String(url));
    var ws;
    if (isGame && INPROC) {
      // 完全在浏览器内应答，不产生任何真实网络连接
      ws = new INPROC(orig, protocols);
      console.log('[offline] WS 交给内置 JS Mock:', orig);
    } else {
      ws = protocols === undefined ? new NativeWS(url)
        : new NativeWS(url, protocols);
    }
    ws.binaryType = 'arraybuffer';
    var _send = ws.send.bind(ws);
    ws.send = function (d) {
      stats.sent++;
      stats.frames.push({ dir: 'send', len: d && d.byteLength || 0, t: Date.now() });
      return _send(d);
    };
    ws.addEventListener('message', function (e) {
      stats.recv++;
      stats.frames.push({ dir: 'recv', len: e.data && e.data.byteLength || 0, t: Date.now() });
    });
    ws.addEventListener('open', function () { console.log('[offline] WS 已连接', url); });
    ws.addEventListener('error', function (e) { console.warn('[offline] WS 错误', e); });
    return ws;
  }
  PatchedWS.prototype = NativeWS.prototype;
  PatchedWS.CONNECTING = 0; PatchedWS.OPEN = 1;
  PatchedWS.CLOSING = 2; PatchedWS.CLOSED = 3;
  // FakeWebSocket 不是原生 WebSocket 的实例，这里让 instanceof 依然成立
  try {
    Object.defineProperty(PatchedWS, Symbol.hasInstance, {
      value: function (o) {
        return o instanceof NativeWS || (!!INPROC && o instanceof INPROC);
      }
    });
  } catch (e) { /* 老浏览器忽略 */ }
  window.WebSocket = PatchedWS;

  // ---------------- fetch 劫持 ----------------
  var nativeFetch = window.fetch && window.fetch.bind(window);
  if (nativeFetch) {
    window.fetch = function (input, init) {
      var u = (typeof input === 'string') ? input : (input && input.url) || '';
      if (BLOCK.test(u)) {
        console.log('[offline] 拦截 fetch:', u);
        return Promise.resolve(new Response('{}', {
          status: 200, headers: { 'Content-Type': 'application/json' }
        }));
      }
      var nu = rewriteUrl(u);
      if (nu !== u) {
        console.log('[offline] 重写 fetch:', u, '->', nu);
        return nativeFetch(nu, init);
      }
      return nativeFetch(input, init);
    };
  }

  // ---------------- XHR 劫持 ----------------
  var open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, u) {
    var args = Array.prototype.slice.call(arguments);
    if (typeof u === 'string') {
      if (BLOCK.test(u)) {
        console.log('[offline] 拦截 XHR:', u);
        args[1] = 'data:application/json,{}';
      } else {
        var nu = rewriteUrl(u);
        if (nu !== u) {
          console.log('[offline] 重写 XHR:', u, '->', nu);
          args[1] = nu;
        }
      }
    }
    return open.apply(this, args);
  };

  // ---------------- 外部 <script> 拦截 ----------------
  var setAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (k, v) {
    if (this.tagName === 'SCRIPT' && k === 'src' && BLOCK.test(String(v))) {
      console.log('[offline] 拦截 script:', v);
      return;
    }
    return setAttr.apply(this, arguments);
  };
  var srcDesc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
  if (srcDesc && srcDesc.set) {
    Object.defineProperty(HTMLScriptElement.prototype, 'src', {
      get: srcDesc.get,
      set: function (v) {
        if (BLOCK.test(String(v))) {
          console.log('[offline] 拦截 script.src:', v);
          return;
        }
        srcDesc.set.call(this, rewriteUrl(v));
      },
      configurable: true
    });
  }

  console.log('[offline] 补丁已加载');

  // ---------------- webGLPluginHelper.getUrlParams 安全覆盖 ----------------
  // framework.js 的实现当 URL 没有 ? 时会 split('?')[1] 拿到 undefined，再 split('&') 炸
  // 我们用 URLSearchParams 重新实现一份，覆盖到所有可能的挂载点
  function safeGetUrlParams() {
    try {
      var qs = window.location.search;
      var u = new URLSearchParams(qs);
      var obj = {};
      u.forEach(function (v, k) { obj[k] = v; });
      // 也吃 hash 里的参数
      var h = window.location.hash || '';
      if (h.indexOf('?') >= 0) {
        new URLSearchParams(h.split('?')[1]).forEach(function (v, k) {
          if (!(k in obj)) obj[k] = v;
        });
      }
      return obj;
    } catch (e) {
      console.warn('[offline] safeGetUrlParams 失败', e);
      return {};
    }
  }
  function patchHelper(helper) {
    if (!helper || !helper.getUrlParams) return;
    if (helper.__patched) return;
    helper.__patched = true;
    helper.getUrlParams = safeGetUrlParams;
    console.log('[offline] 已 patch webGLPluginHelper.getUrlParams');
  }
  // 轮询：framework.js 是 async 加载，等 Module/webGLPluginHelper 出现
  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    var done = false;
    // 几个常见挂载点
    var candidates = [window, window.Module, window.unityInstance, window.QuickService];
    for (var i = 0; i < candidates.length; i++) {
      var c = candidates[i];
      if (c && c.webGLPluginHelper) {
        patchHelper(c.webGLPluginHelper);
        done = true;
      }
    }
    if (done || tries > 600) clearInterval(timer);  // 最多 60 秒
  }, 100);
})();
