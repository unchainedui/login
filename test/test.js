(function () {
  'use strict';

  const rxQuery = /^\s*([>+~])?\s*([*\w-]+)?(?:#([\w-]+))?(?:\.([\w.-]+))?\s*/;
  const rxClassOnly = /^\.([-\w]+)$/;
  const rxIdOnly = /^#([-\w]+)$/;

  function get(selector, root = document) {
    const id = selector.match(rxIdOnly);
    if (id) {
      return document.getElementById(id[1]);
    }

    const className = selector.match(rxClassOnly);
    if (className) {
      return root.getElementsByClassName(className[1]);
    }

    return root.querySelectorAll(selector);
  }

  function query(selector) {
    let f;
    const out = [];
    if (typeof selector === 'string') {
      while (selector) {
        f = selector.match(rxQuery);
        if (f[0] === '') {
          break;
        }

        out.push({
          rel: f[1],
          tag: (f[2] || '').toUpperCase(),
          id: f[3],
          classes: (f[4]) ? f[4].split('.') : undefined
        });
        selector = selector.substring(f[0].length);
      }
    }
    return out;
  }

  function createNs(namespaceURI, selector) {
    const s = query(selector)[0];
    const tag = s.tag;
    if (!tag) {
      return null;
    }

    const el = document.createElementNs(namespaceURI, tag);
    const id = s.id;
    if (id) {
      el.id = id;
    }

    const classes = s.classes;
    if (classes) {
      el.className = classes.join(' ');
    }

    return el;
  }

  function create(selector, content) {
    const s = query(selector)[0];
    const tag = s.tag;
    if (!tag) {
      return null;
    }

    const el = document.createElement(tag);
    const id = s.id;
    if (id) {
      el.id = id;
    }

    const classes = s.classes;
    if (classes) {
      el.className = classes.join(' ');
    }

    if (content) {
      el.innerHTML = content;
    }

    return el;
  }

  function closest(el, selector) {
    while (!el.matches(selector) && (el = el.parentElement));
    return el;
  }

  function attr(el, name, value) {
    if (value === undefined) {
      return el.getAttribute(name);
    }

    el.setAttribute(name, value);
  }

  function append(parent, el) {
    parent.appendChild(el);
    return parent;
  }

  function prepend(parent, el) {
    parent.insertBefore(el, parent.firstChild);
    return parent;
  }

  function appendTo(el, parent) {
    parent.appendChild(el);
    return el;
  }

  function prependTo(el, parent) {
    parent.insertBefore(el, parent.firstChild);
    return el;
  }

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function on(el, event, selector, handler, options) {
    if (typeof selector !== 'string') {
      handler = selector;
      selector = undefined;
    }

    if (!selector) {
      el.addEventListener(event, handler, options);
      return handler;
    }

    return on(el, event, e => {
      const target = closest(e.target, selector);
      if (target) {
        handler.call(target, e);
      }
    }, options);
  }

  function off(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
    return handler;
  }

  function once(el, event, handler, options) {
    const _handler = (...args) => {
      handler(...args);
      off(el, event, handler);
    };

    el.addEventListener(event, handler, options);
    return _handler;
  }

  const ALL_EVENTS = '__events';
  function onEvents(ctx, events) {
    if (!ctx[ALL_EVENTS]) {
      ctx[ALL_EVENTS] = {};
    }

    for (const event in events) {
      ctx[ALL_EVENTS][event] = on(ctx.el, event, events[event]);
    }
  }

  function offEvents(ctx) {
    const events = ctx[ALL_EVENTS];
    for (const event in events) {
      off(ctx.el, event, events[event]);
    }
    delete ctx[ALL_EVENTS];
  }

  function addClass(el, ...cls) {
    return el.classList.add(...cls);
  }

  function removeClass(el, ...cls) {
    return el.classList.remove(...cls);
  }

  function toggleClass(el, cls, force) {
    return el.classList.toggle(cls, force);
  }

  function addDelayRemoveClass(el, cls, delay, cb) {
    addClass(el, cls);
    return setTimeout(() => {
      removeClass(el, cls);
      cb && cb();
    }, delay);
  }

  function replaceClass(el, rx, newClass) {
    const newClasses = [];
    attr(el, 'class').split(' ').forEach(function(cls) {
      const c = rx.test(cls) ? newClass : cls;

      if (newClasses.indexOf(c) === -1) {
        newClasses.push(c);
      }
    });

    attr(el, 'class', newClasses.join(' '));
    return newClasses.length;
  }

  function insertBefore(el, node) {
    return node.parentNode.insertBefore(el, node);
  }

  function insertAfter(el, node) {
    return node.parentNode.insertBefore(el, node.nextSibling);
  }

  function remove(el) {
    return el.parentNode.removeChild(el);
  }

  var dom = /*#__PURE__*/Object.freeze({
    get: get,
    query: query,
    createNs: createNs,
    create: create,
    closest: closest,
    attr: attr,
    append: append,
    prepend: prepend,
    appendTo: appendTo,
    prependTo: prependTo,
    ready: ready,
    on: on,
    off: off,
    once: once,
    ALL_EVENTS: ALL_EVENTS,
    onEvents: onEvents,
    offEvents: offEvents,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    addDelayRemoveClass: addDelayRemoveClass,
    replaceClass: replaceClass,
    insertBefore: insertBefore,
    insertAfter: insertAfter,
    remove: remove
  });

  function compose(...args) {
    let newObject = true;

    if (args[args.length - 1] === true) {
      args.pop();
      newObject = false;
    }

    newObject && args.unshift({});
    return Object.assign.apply(Object, args);
  }

  const rxQuery$1 = /^\s*([>+~])?\s*([*\w-]+)?(?:#([\w-]+))?(?:\.([\w.-]+))?\s*/;
  const rxClassOnly$1 = /^\.([-\w]+)$/;
  const rxIdOnly$1 = /^#([-\w]+)$/;

  function get$1(selector, root = document) {
    const id = selector.match(rxIdOnly$1);
    if (id) {
      return document.getElementById(id[1]);
    }

    const className = selector.match(rxClassOnly$1);
    if (className) {
      return root.getElementsByClassName(className[1]);
    }

    return root.querySelectorAll(selector);
  }

  function query$1(selector) {
    let f;
    const out = [];
    if (typeof selector === 'string') {
      while (selector) {
        f = selector.match(rxQuery$1);
        if (f[0] === '') {
          break;
        }

        out.push({
          rel: f[1],
          tag: (f[2] || '').toUpperCase(),
          id: f[3],
          classes: (f[4]) ? f[4].split('.') : undefined
        });
        selector = selector.substring(f[0].length);
      }
    }
    return out;
  }

  function createNs$1(namespaceURI, selector) {
    const s = query$1(selector)[0];
    const tag = s.tag;
    if (!tag) {
      return null;
    }

    const el = document.createElementNs(namespaceURI, tag);
    const id = s.id;
    if (id) {
      el.id = id;
    }

    const classes = s.classes;
    if (classes) {
      el.className = classes.join(' ');
    }

    return el;
  }

  function create$1(selector, content) {
    const s = query$1(selector)[0];
    const tag = s.tag;
    if (!tag) {
      return null;
    }

    const el = document.createElement(tag);
    const id = s.id;
    if (id) {
      el.id = id;
    }

    const classes = s.classes;
    if (classes) {
      el.className = classes.join(' ');
    }

    if (content) {
      el.innerHTML = content;
    }

    return el;
  }

  function closest$1(el, selector) {
    while (!el.matches(selector) && (el = el.parentElement));
    return el;
  }

  function attr$1(el, name, value) {
    if (value === undefined) {
      return el.getAttribute(name);
    }

    el.setAttribute(name, value);
  }

  function append$1(parent, el) {
    parent.appendChild(el);
    return parent;
  }

  function prepend$1(parent, el) {
    parent.insertBefore(el, parent.firstChild);
    return parent;
  }

  function appendTo$1(el, parent) {
    parent.appendChild(el);
    return el;
  }

  function prependTo$1(el, parent) {
    parent.insertBefore(el, parent.firstChild);
    return el;
  }

  function ready$1(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function on$1(el, event, selector, handler, options) {
    if (typeof selector !== 'string') {
      handler = selector;
      selector = undefined;
    }

    if (!selector) {
      el.addEventListener(event, handler, options);
      return handler;
    }

    return on$1(el, event, e => {
      const target = closest$1(e.target, selector);
      if (target) {
        handler.call(target, e);
      }
    }, options);
  }

  function off$1(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
    return handler;
  }

  function once$1(el, event, handler, options) {
    const _handler = (...args) => {
      handler(...args);
      off$1(el, event, handler);
    };

    el.addEventListener(event, handler, options);
    return _handler;
  }

  const ALL_EVENTS$1 = '__events';
  function onEvents$1(ctx, events) {
    if (!ctx[ALL_EVENTS$1]) {
      ctx[ALL_EVENTS$1] = {};
    }

    for (const event in events) {
      ctx[ALL_EVENTS$1][event] = on$1(ctx.el, event, events[event]);
    }
  }

  function offEvents$1(ctx) {
    const events = ctx[ALL_EVENTS$1];
    for (const event in events) {
      off$1(ctx.el, event, events[event]);
    }
    delete ctx[ALL_EVENTS$1];
  }

  function addClass$1(el, ...cls) {
    return el.classList.add(...cls);
  }

  function removeClass$1(el, ...cls) {
    return el.classList.remove(...cls);
  }

  function toggleClass$1(el, cls, force) {
    return el.classList.toggle(cls, force);
  }

  function addDelayRemoveClass$1(el, cls, delay) {
    addClass$1(el, cls);
    return setTimeout(() => removeClass$1(el, cls), delay);
  }

  function replaceClass$1(el, rx, newClass) {
    const newClasses = [];
    attr$1(el, 'class').split(' ').forEach(function(cls) {
      const c = rx.test(cls) ? newClass : cls;

      if (newClasses.indexOf(c) === -1) {
        newClasses.push(c);
      }
    });

    attr$1(el, 'class', newClasses.join(' '));
    return newClasses.length;
  }

  function insertBefore$1(el, node) {
    return node.parentNode.insertBefore(el, node);
  }

  function insertAfter$1(el, node) {
    return node.parentNode.insertBefore(el, node.nextSibling);
  }

  function remove$1(el) {
    return el.parentNode.removeChild(el);
  }

  var dom$1 = /*#__PURE__*/Object.freeze({
    get: get$1,
    query: query$1,
    createNs: createNs$1,
    create: create$1,
    closest: closest$1,
    attr: attr$1,
    append: append$1,
    prepend: prepend$1,
    appendTo: appendTo$1,
    prependTo: prependTo$1,
    ready: ready$1,
    on: on$1,
    off: off$1,
    once: once$1,
    ALL_EVENTS: ALL_EVENTS$1,
    onEvents: onEvents$1,
    offEvents: offEvents$1,
    addClass: addClass$1,
    removeClass: removeClass$1,
    toggleClass: toggleClass$1,
    addDelayRemoveClass: addDelayRemoveClass$1,
    replaceClass: replaceClass$1,
    insertBefore: insertBefore$1,
    insertAfter: insertAfter$1,
    remove: remove$1
  });

  /*eslint-disable strict */

  const html = [
    'addClass',
    'removeClass',
    'toggleClass',
    'replaceClass',
    'appendTo',
    'prependTo',
    'insertBefore',
    'insertAfter'
  ].reduce((obj, method) => {
    obj[method] = function(...args) {
      dom$1[method].apply(null, [ this.el ].concat(args));
      return this;
    };
    return obj;
  }, {});

  html.attr = function(name, value) {
    if (value === undefined) {
      return this.el.getAttribute(name);
    }

    this.el.setAttribute(name, value);
    return this
  };

  html.find = function(selector) {
    return get$1(selector, this.el);
  };

  function get$2(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  function set(name, value, expires) {
    let cookie = name + '=' + encodeURIComponent(value);

    if (expires instanceof Date) {
      cookie += ';expires=' + expires.toUTCString();
    }

    cookie += ';path=/';
    document.cookie = cookie;
  }

  function remove$2(name) {
    set(name, '', new Date(0));
  }

  var cookie = {
    get: get$2, set, remove: remove$2
  };

  const LOG_LEVEL = {
    NONE: 0,
    ALERT: 1,
    CRITICAL: 2,
    ERROR: 3,
    WARNING: 4,
    NOTICE: 5,
    INFO: 6,
    DEBUG: 7,
    ALL: 255
  };

  const log = {
    log: function(level, ...args) {
      if (level > this.logLevel) {
        return;
      }

      if (this.logName) {
        args.unshift(`%c${this.logName} %s`, 'color:#666;');
      }

      console[level === 1 ? 'error' : 'log'].apply(console, args);
    }
  };

  function indexOfHandler(handlers, h) {
    let i = handlers.length;

    while (i--) {
      const hh = handlers[i];
      if (hh.h === h.h) {
        if ((hh.c && hh.c === h.c) || (h.c && h.c === hh.c) || (!hh.c && !h.c)) {
          return i;
        }
      }
    }

    return -1;
  }

  var events = {
    on: function(event, handler, context) {
      const h = {
        h: handler
      };

      if (context) {
        h.c = context;
      }

      let handlers = this.events[event];
      if (!handlers) {
        handlers = this.events[event] = [];
      }

      if (indexOfHandler(handlers, h) === -1) {
        handlers.push(h);
      }

      this.log && this.log(LOG_LEVEL.INFO, h.once ? 'once' : 'on', event);
      return this;
    },

    off: function(event, handler, context) {
      this.log && this.log(LOG_LEVEL.INFO, 'off', event);

      const handlers = this.events[event];
      if (!handlers) {
        return this;
      }

      const h = {
        h: handler
      };

      if (context) {
        h.c = context;
      }

      const index = indexOfHandler(handlers, h);
      if (index !== -1) {
        handlers.splice(index, 1);
      }

      if (handlers.length === 0) {
        delete this.events[event];
      }

      return this;
    },

    once: function(event, handler, context) {
      const once = (...args) => {
        this.off(event, once);
        handler.apply(context, args);
      };

      this.on(event, once);
      return this;
    },

    emit: function(event, ...args) {
      this.log && this.log(LOG_LEVEL.INFO, 'emit', event, ...args);
      const handlers = this.events[event];
      if (!handlers || !handlers.length) {
        return this;
      }

      handlers.slice().forEach(ctx => {
        ctx.h.apply(ctx.c, args);
      });
      return this;
    }
  };

  const history_ = window.history;
  const location_ = window.location;

  const rxTrailingSlash = /\/$/;
  function getLocationWithHash() {
    let loc = location_.pathname;
    const hash = location_.hash;

    if (hash) {
      loc = loc.replace(rxTrailingSlash, '') + '/' + hash;
    }

    return loc;
  }

  const Historian = function(cb) {
    this.cb = cb;
    this.url = getLocationWithHash();
    this.prevState = {};

    this.onPopState = on$1(window, 'popstate', e => {
      const loc = getLocationWithHash();
      if (this.url !== loc) {
        this.url = loc;
        this.cb(this.url, e.state);
      }
    });
  };

  Historian.prototype = {
    getState: function() {
      return {
        url: this.url,
        state: history_.state
      };
    },

    pushState: function(state, url) {
      if (this.url !== url) {
        this.prevState = this.getState();
        this.url = url;
        history_.pushState(state, null, url);
        this.cb(url, state);
      }
    },

    replaceState: function(state, url) {
      if (this.url !== url) {
        history_.replaceState(state, null, url);
        this.url = url;
      }
    },

    back: function(replace) {
      if (replace) {
        this.replaceState(this.prevState.state, this.prevState.url);
      } else {
        history_.back();
      }
    },

    remove: function() {
      off$1(window, 'popstate', this.onPopState);
    }
  };

  const makeObject = (arr, names) => arr.reduce((a, b, i) => {
    if (b) {
      a[names[i]] = b;
    }
    return a;
  }, {});

  const rxOptionalParam = /\((.*?)\)/g;
  const rxNamedParam = /(\(\?)?:\w+/g;
  const rxSplatParam = /\*\w+/g;
  const rxEscapeRegExp = /[-{}\[\]+?.,\\\^$|#\s]/g;

  const Router = function(onRoute) {
    this.onRoute = onRoute;
    this.counter = 0;
    this.routes = {};
    this.route = [];
    this.historian = new Historian((url, state) => this.check(url, state));
  };

  Router.prototype = {
    add: function(name, rx) {
      const names = [];
      rx = rx
        .replace(rxEscapeRegExp, '\\$&')
        .replace(rxOptionalParam, '(?:$1)?')
        .replace(rxNamedParam, (match, optional) => {
          names.push(match.substr(1));
          return optional ? match : '([^/?]+)';
        })
        .replace(rxSplatParam, '([^?]*?)');

      this.routes[name] = new RegExp('^' + rx);
      this.routes[name].names = names;
      return this;
    },

    delete: function(name) {
      delete this.routes[name];
      return this;
    },

    check: function(url, state) {
      const routes = this.routes;
      this.counter++;
      for (const r in routes) {
        const rx = routes[r];
        if (rx.test(url)) {
          const urlOpts = Object.assign(
            makeObject(rx.exec(url).slice(1), rx.names),
            state
          );

          this.route = [ r, urlOpts ];
          this.onRoute(r, urlOpts);
          return;
        }
      }
    },

    start: function() {
      this.check(this.historian.url);
    },

    get: function() {
      return this.historian.getState();
    },

    go: function(url, state) {
      if (url[0] === '!') {
        url = url.substr(1);
        if (this.get().url === url) {
          return this.check(url, { force: true })
        }
      }
      this.historian.pushState(state, url);
    },

    replace: function(url, state) {
      this.historian.replaceState(state, url);
    },

    back: function(path, replace) {
      if (this.counter > 1) {
        this.historian.back(replace);
      } else {
        this.go(path);
      }
    },

    remove: function() {
      this.historian.remove();
    }
  };

  const storageWrapper = storage => {
    try {
      const key = '__test__';
      storage.setItem(key, key);
      storage.removeItem(key);
      return storage
    } catch (e) {
      let cache = {};
      return {
        getItem(key) {
          return cache[key]
        },
        setItem(key, val) {
          cache[key] = val;
        },
        removeItem(key) {
          delete cache[key];
        },
        clear() {
          cache = {};
        }
      }
    }
  };

  const localStorage = storageWrapper(window.localStorage);
  const sessionStorage = storageWrapper(window.sessionStorage);

  const JSONStorage = storage => ({
    get(key) {
      const str = storage.getItem(key);
      try {
        return JSON.parse(str)
      } catch (e) {
        return null
      }
    },

    set(key, obj) {
      const str = JSON.stringify(obj);
      storage.setItem(key, str);
    },

    remove(key) {
      storage.removeItem(key);
    }
  });

  const App = function() {
    this.events = {};
    this.router = new Router((name, params) => {
      this.emit(`app.route.${name}`, params);
      this.emit('app.route', name, params);
    });
  };

  App.prototype = compose(
    html,
    events,
    log,
    {
      logName: 'app',
      logLevel: LOG_LEVEL.NONE,

      storage: JSONStorage(localStorage),
      cookie: cookie,

      init: function(settings = {}, cb) {
        if (settings.logLevel) {
          this.logLevel = settings.logLevel;
        }

        if (settings.logName) {
          this.logName = settings.logName;
        }

        this.container(settings.container);

        if (this.api) {
          this.api.init(() => this.didInit(cb));
        } else {
          this.didInit(cb);
        }

        return this;
      },

      didInit: function(cb) {
        setTimeout(() => {
          cb && cb();
          this.emit('app.ready');
        }, 0);
      },

      setAPI: function(api) {
        this.api = api;
        this.call = (...args) => api.call(...args);
        this.host = () => api.host;
        api.log = (...args) => this.log(...args);
        api.emit = (...args) => this.emit(...args);
        api.app(this);
        return this;
      },

      routes: function(routes) {
        for (const route in routes) {
          this.router.add(route, routes[route]);
        }
        return this;
      },

      start: function() {
        this.router.start();
      },

      go: function(...args) {
        this.router.go(...args);
      },

      container: function(container) {
        if (typeof container === 'string') {
          const el = get$1(container);
          // if it is HTMLCollection or NodeList;
          this.el = el.forEach ? el.item(0) : el;
        } else {
          this.el = container;
        }

        const router = this.router;
        this.onclick = on$1(this.el, 'click', '[soft]', function(e) {
          e.preventDefault();
          router.go(this.pathname);
        });
      },

      remove: function() {
        off$1(this.el, 'click', this.onclick);
        delete this.el;
        this.router.remove();
      }
    }
  );

  var app = new App();

  /**
   * Constants.
   */

  const IS_MAC = (
    typeof window != 'undefined' &&
    /Mac|iPod|iPhone|iPad/.test(window.navigator.platform)
  );

  const MODIFIERS = {
    alt: 'altKey',
    control: 'ctrlKey',
    meta: 'metaKey',
    shift: 'shiftKey',
  };

  const ALIASES = {
    add: '+',
    break: 'pause',
    cmd: 'meta',
    command: 'meta',
    ctl: 'control',
    ctrl: 'control',
    del: 'delete',
    down: 'arrowdown',
    esc: 'escape',
    ins: 'insert',
    left: 'arrowleft',
    mod: IS_MAC ? 'meta' : 'control',
    opt: 'alt',
    option: 'alt',
    return: 'enter',
    right: 'arrowright',
    space: ' ',
    spacebar: ' ',
    up: 'arrowup',
    win: 'meta',
    windows: 'meta',
  };

  const CODES = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    control: 17,
    alt: 18,
    pause: 19,
    capslock: 20,
    escape: 27,
    ' ': 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    arrowleft: 37,
    arrowup: 38,
    arrowright: 39,
    arrowdown: 40,
    insert: 45,
    delete: 46,
    meta: 91,
    numlock: 144,
    scrolllock: 145,
    ';': 186,
    '=': 187,
    ',': 188,
    '-': 189,
    '.': 190,
    '/': 191,
    '`': 192,
    '[': 219,
    '\\': 220,
    ']': 221,
    '\'': 222,
  };

  for (var f = 1; f < 20; f++) {
    CODES['f' + f] = 111 + f;
  }

  /**
   * Is hotkey?
   */

  function isHotkey(hotkey, options, event) {
    if (options && !('byKey' in options)) {
      event = options;
      options = null;
    }

    if (!Array.isArray(hotkey)) {
      hotkey = [hotkey];
    }

    const array = hotkey.map(string => parseHotkey(string, options));
    const check = e => array.some(object => compareHotkey(object, e));
    const ret = event == null ? check : check(event);
    return ret
  }

  /**
   * Parse.
   */

  function parseHotkey(hotkey, options) {
    const byKey = options && options.byKey;
    const ret = {};

    // Special case to handle the `+` key since we use it as a separator.
    hotkey = hotkey.replace('++', '+add');
    const values = hotkey.split('+');
    const { length } = values;

    // Ensure that all the modifiers are set to false unless the hotkey has them.
    for (const k in MODIFIERS) {
      ret[MODIFIERS[k]] = false;
    }

    for (let value of values) {
      const optional = value.endsWith('?');

      if (optional) {
        value = value.slice(0, -1);
      }

      const name = toKeyName(value);
      const modifier = MODIFIERS[name];

      if (length == 1 || !modifier) {
        if (byKey) {
          ret.key = name;
        } else {
          ret.which = toKeyCode(value);
        }
      }

      if (modifier) {
        ret[modifier] = optional ? null : true;
      }

      // If there's only one key, and it's not a modifier, ignore the shift key
      // because it will already be taken into accout by the `event.key` value.
      if (length == 1 && !modifier && byKey) {
        ret.shiftKey = null;
      }
    }

    return ret
  }

  /**
   * Compare.
   */

  function compareHotkey(object, event) {
    for (const key in object) {
      const expected = object[key];
      let actual;

      if (expected == null) {
        continue
      }

      if (key === 'key') {
        actual = event.key.toLowerCase();
      } else if (key == 'which') {
        actual = expected == 91 && event.which == 93 ? 91 : event.which;
      } else {
        actual = event[key];
      }

      if (actual == null && expected === false) {
        continue
      }

      if (actual !== expected) {
        return false
      }
    }

    return true
  }

  /**
   * Utils.
   */

  function toKeyCode(name) {
    name = toKeyName(name);
    const code = CODES[name] || name.toUpperCase().charCodeAt(0);
    return code
  }

  function toKeyName(name) {
    name = name.toLowerCase();
    name = ALIASES[name] || name;
    return name
  }

  function compose$1(...args) {
    let newObject = true;

    if (args[args.length - 1] === true) {
      args.pop();
      newObject = false;
    }

    newObject && args.unshift({});
    return Object.assign.apply(Object, args);
  }

  function closest$2(el, selector) {
    while (!el.matches(selector) && (el = el.parentElement));
    return el;
  }

  function on$2(el, event, selector, handler, options) {
    if (typeof selector !== 'string') {
      handler = selector;
      selector = undefined;
    }

    if (!selector) {
      el.addEventListener(event, handler, options);
      return handler;
    }

    return on$2(el, event, e => {
      const target = closest$2(e.target, selector);
      if (target) {
        handler.call(target, e);
      }
    }, options);
  }

  function off$2(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
    return handler;
  }

  function toCamelCase(str) {
    return str.replace(/[-_](\w)/g, (matches, letter) => letter.toUpperCase());
  }

  function debounce(func, wait, immediate) {
    let timeout;
    const fn = function(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) {
          func.apply(this, args);
        }
      };

      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) {
        func.apply(this, args);
      }
    };

    fn.cancel = function() {
      clearTimeout(timeout);
    };

    return fn;
  }

  function getTabActiveEl(els, isPrev) {
    let index = 0;
    const l = els.length;
    for (; index < l; index++) {
      if (els.item(index) === document.activeElement) {
        break;
      }
    }

    if (index === l) {
      index = 0;
    } else if (isPrev) {
      if (index === 0) {
        index = els.item[els.length - 1];
      } else {
        index--;
      }
    } else if (index === els.length - 1) {
      index = 0;
    } else {
      index++;
    }

    return els.item(index);
  }

  var form = {
    addForm: function() {
      if (!this.on) {
        this.on = {};
      }

      this.on._formClick = on$2(this.el, 'click', 'a', e => {
        if (this.hash) {
          e.preventDefault();
        }
      });

      const self = this;
      this.on._formAClickDebounced = on$2(this.el, 'click', 'a', debounce(function() {
        if (this.hash) {
          const cmd = toCamelCase(this.hash.split('/')[1]);
          self[cmd]();
        }
      }, 500, true));

      this.on._formButtonClickDebounced = on$2(this.el, 'click', 'button', debounce(function() {
        if (this.value) {
          self[this.value]();
        }
      }, 500, true));

      this.on._formGlobalKey = e => {
        const key = e.keyCode;
        const aEl = document.activeElement;

        if ((key === 13 || key === 32) &&
          aEl &&
          (aEl.tagName === 'A' || aEl.tagName === 'BUTTON')) {
          aEl.click();
          return;
        }

        if (this[key]) {
          return this[key](e);
        }

        //note: tabs doesnt work properly on mac and safari
        if (key === 9) {
          e.preventDefault();
          const tabs = this.find('[tabindex]');
          const el = getTabActiveEl(tabs, !!e.shiftKey);

          if (el.type === 'radio') {
            el.checked = true;
          }

          el.focus();
        }

      };

      on$2(document, 'keydown', this.on._formGlobalKey);
    },

    removeForm: function() {
      off$2(this.el, 'click', this.on._formClick);
      off$2(this.el, 'click', this.on._formAClickDebounced);
      off$2(this.el, 'click', this.on._formButtonClickDebounced);
      off$2(document, 'keydown', this.on._formGlobalKey);
    }
  };

  /*eslint-disable strict */

  const html$1 = [
    'addClass',
    'removeClass',
    'toggleClass',
    'replaceClass',
    'appendTo',
    'prependTo',
    'insertBefore',
    'insertAfter'
  ].reduce((obj, method) => {
    obj[method] = function(...args) {
      dom[method].apply(null, [ this.el ].concat(args));
      return this;
    };
    return obj;
  }, {});

  html$1.attr = function(name, value) {
    if (value === undefined) {
      return this.el.getAttribute(name);
    }

    this.el.setAttribute(name, value);
    return this
  };

  html$1.find = function(selector) {
    return get(selector, this.el);
  };

  function debounce$1(func, wait, immediate) {
    let timeout;
    const fn = function(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) {
          func.apply(this, args);
        }
      };

      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) {
        func.apply(this, args);
      }
    };

    fn.cancel = function() {
      clearTimeout(timeout);
    };

    return fn;
  }

  var charMap$1 = {
    // latin
    'À': 'A',
    'Á': 'A',
    'Â': 'A',
    'Ã': 'A',
    'Ä': 'Ae',
    'Å': 'A',
    'Æ': 'AE',
    'Ç': 'C',
    'È': 'E',
    'É': 'E',
    'Ê': 'E',
    'Ë': 'E',
    'Ì': 'I',
    'Í': 'I',
    'Î': 'I',
    'Ï': 'I',
    'Ð': 'D',
    'Ñ': 'N',
    'Ò': 'O',
    'Ó': 'O',
    'Ô': 'O',
    'Õ': 'O',
    'Ö': 'Oe',
    'Ő': 'O',
    'Ø': 'O',
    'Ù': 'U',
    'Ú': 'U',
    'Û': 'U',
    'Ü': 'Ue',
    'Ű': 'U',
    'Ý': 'Y',
    'Þ': 'TH',
    'ß': 'ss',
    'à': 'a',
    'á': 'a',
    'â': 'a',
    'ã': 'a',
    'ä': 'ae',
    'å': 'a',
    'æ': 'ae',
    'ç': 'c',
    'è': 'e',
    'é': 'e',
    'ê': 'e',
    'ë': 'e',
    'ì': 'i',
    'í': 'i',
    'î': 'i',
    'ï': 'i',
    'ð': 'd',
    'ñ': 'n',
    'ò': 'o',
    'ó': 'o',
    'ô': 'o',
    'õ': 'o',
    'ö': 'oe',
    'ő': 'o',
    'ø': 'o',
    'ù': 'u',
    'ú': 'u',
    'û': 'u',
    'ü': 'ue',
    'ű': 'u',
    'ý': 'y',
    'þ': 'th',
    'ÿ': 'y',
    'ẞ': 'SS',
    // greek
    'α': 'a',
    'β': 'b',
    'γ': 'g',
    'δ': 'd',
    'ε': 'e',
    'ζ': 'z',
    'η': 'h',
    'θ': '8',
    'ι': 'i',
    'κ': 'k',
    'λ': 'l',
    'μ': 'm',
    'ν': 'n',
    'ξ': '3',
    'ο': 'o',
    'π': 'p',
    'ρ': 'r',
    'σ': 's',
    'τ': 't',
    'υ': 'y',
    'φ': 'f',
    'χ': 'x',
    'ψ': 'ps',
    'ω': 'w',
    'ά': 'a',
    'έ': 'e',
    'ί': 'i',
    'ό': 'o',
    'ύ': 'y',
    'ή': 'h',
    'ώ': 'w',
    'ς': 's',
    'ϊ': 'i',
    'ΰ': 'y',
    'ϋ': 'y',
    'ΐ': 'i',
    'Α': 'A',
    'Β': 'B',
    'Γ': 'G',
    'Δ': 'D',
    'Ε': 'E',
    'Ζ': 'Z',
    'Η': 'H',
    'Θ': '8',
    'Ι': 'I',
    'Κ': 'K',
    'Λ': 'L',
    'Μ': 'M',
    'Ν': 'N',
    'Ξ': '3',
    'Ο': 'O',
    'Π': 'P',
    'Ρ': 'R',
    'Σ': 'S',
    'Τ': 'T',
    'Υ': 'Y',
    'Φ': 'F',
    'Χ': 'X',
    'Ψ': 'PS',
    'Ω': 'W',
    'Ά': 'A',
    'Έ': 'E',
    'Ί': 'I',
    'Ό': 'O',
    'Ύ': 'Y',
    'Ή': 'H',
    'Ώ': 'W',
    'Ϊ': 'I',
    'Ϋ': 'Y',
    // turkish
    'ş': 's',
    'Ş': 'S',
    'ı': 'i',
    'İ': 'I',
    // 'ç': 'c', // duplicate
    // 'Ç': 'C', // duplicate
    // 'ü': 'ue', // duplicate
    // 'Ü': 'Ue', // duplicate
    // 'ö': 'oe', // duplicate
    // 'Ö': 'Oe', // duplicate
    'ğ': 'g',
    'Ğ': 'G',
    // macedonian
    'Ќ': 'Kj',
    'ќ': 'kj',
    'Љ': 'Lj',
    'љ': 'lj',
    'Њ': 'Nj',
    'њ': 'nj',
    'Тс': 'Ts',
    'тс': 'ts',
    // russian */
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'g',
    'д': 'd',
    'е': 'e',
    'ё': 'yo',
    'ж': 'zh',
    'з': 'z',
    'и': 'i',
    'й': 'y',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'h',
    'ц': 'c',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'sch',
    'ъ': '',
    'ы': 'y',
    'ь': '',
    'э': 'e',
    'ю': 'yu',
    'я': 'ya',
    'А': 'A',
    'Б': 'B',
    'В': 'V',
    'Г': 'G',
    'Д': 'D',
    'Е': 'E',
    'Ё': 'Yo',
    'Ж': 'Zh',
    'З': 'Z',
    'И': 'I',
    'Й': 'J',
    'К': 'K',
    'Л': 'L',
    'М': 'M',
    'Н': 'N',
    'О': 'O',
    'П': 'P',
    'Р': 'R',
    'С': 'S',
    'Т': 'T',
    'У': 'U',
    'Ф': 'F',
    'Х': 'H',
    'Ц': 'C',
    'Ч': 'Ch',
    'Ш': 'Sh',
    'Щ': 'Sh',
    'Ъ': '',
    'Ы': 'Y',
    'Ь': '',
    'Э': 'E',
    'Ю': 'Yu',
    'Я': 'Ya',
    // ukranian
    'Є': 'Ye',
    'І': 'I',
    'Ї': 'Yi',
    'Ґ': 'G',
    'є': 'ye',
    'і': 'i',
    'ї': 'yi',
    'ґ': 'g',
    // czech
    'č': 'c',
    'ď': 'd',
    'ě': 'e',
    'ň': 'n',
    'ř': 'r',
    'š': 's',
    'ť': 't',
    'ů': 'u',
    'ž': 'z',
    'Č': 'C',
    'Ď': 'D',
    'Ě': 'E',
    'Ň': 'N',
    'Ř': 'R',
    'Š': 'S',
    'Ť': 'T',
    'Ů': 'U',
    'Ž': 'Z',
    // polish
    'ą': 'a',
    'ć': 'c',
    'ę': 'e',
    'ł': 'l',
    'ń': 'n',
    // 'ó': 'o', // duplicate
    'ś': 's',
    'ź': 'z',
    'ż': 'z',
    'Ą': 'A',
    'Ć': 'C',
    'Ę': 'E',
    'Ł': 'L',
    'Ń': 'N',
    'Ś': 'S',
    'Ź': 'Z',
    'Ż': 'Z',
    // latvian
    'ā': 'a',
    // 'č': 'c', // duplicate
    'ē': 'e',
    'ģ': 'g',
    'ī': 'i',
    'ķ': 'k',
    'ļ': 'l',
    'ņ': 'n',
    // 'š': 's', // duplicate
    'ū': 'u',
    // 'ž': 'z', // duplicate
    'Ā': 'A',
    // 'Č': 'C', // duplicate
    'Ē': 'E',
    'Ģ': 'G',
    'Ī': 'I',
    'Ķ': 'k',
    'Ļ': 'L',
    'Ņ': 'N',
    // 'Š': 'S', // duplicate
    'Ū': 'U',
    // 'Ž': 'Z', // duplicate
    // Arabic
    'ا': 'a',
    'أ': 'a',
    'إ': 'i',
    'آ': 'aa',
    'ؤ': 'u',
    'ئ': 'e',
    'ء': 'a',
    'ب': 'b',
    'ت': 't',
    'ث': 'th',
    'ج': 'j',
    'ح': 'h',
    'خ': 'kh',
    'د': 'd',
    'ذ': 'th',
    'ر': 'r',
    'ز': 'z',
    'س': 's',
    'ش': 'sh',
    'ص': 's',
    'ض': 'dh',
    'ط': 't',
    'ظ': 'z',
    'ع': 'a',
    'غ': 'gh',
    'ف': 'f',
    'ق': 'q',
    'ك': 'k',
    'ل': 'l',
    'م': 'm',
    'ن': 'n',
    'ه': 'h',
    'و': 'w',
    'ي': 'y',
    'ى': 'a',
    'ة': 'h',
    'ﻻ': 'la',
    'ﻷ': 'laa',
    'ﻹ': 'lai',
    'ﻵ': 'laa',
    // Arabic diactrics
    'َ': 'a',
    'ً': 'an',
    'ِ': 'e',
    'ٍ': 'en',
    'ُ': 'u',
    'ٌ': 'on',
    'ْ': '',

    // Arabic numbers
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    // symbols
    '“': '"',
    '”': '"',
    '‘': '\'',
    '’': '\'',
    '∂': 'd',
    'ƒ': 'f',
    '™': '(TM)',
    '©': '(C)',
    'œ': 'oe',
    'Œ': 'OE',
    '®': '(R)',
    '†': '+',
    '℠': '(SM)',
    '…': '...',
    '˚': 'o',
    'º': 'o',
    'ª': 'a',
    '•': '*',
    // currency
    '$': 'USD',
    '€': 'EUR',
    '₢': 'BRN',
    '₣': 'FRF',
    '£': 'GBP',
    '₤': 'ITL',
    '₦': 'NGN',
    '₧': 'ESP',
    '₩': 'KRW',
    '₪': 'ILS',
    '₫': 'VND',
    '₭': 'LAK',
    '₮': 'MNT',
    '₯': 'GRD',
    '₱': 'ARS',
    '₲': 'PYG',
    '₳': 'ARA',
    '₴': 'UAH',
    '₵': 'GHS',
    '¢': 'cent',
    '¥': 'CNY',
    '元': 'CNY',
    '円': 'YEN',
    '﷼': 'IRR',
    '₠': 'EWE',
    '฿': 'THB',
    '₨': 'INR',
    '₹': 'INR',
    '₰': 'PF'
  };

  const rxAstralRange$1 = /&nbsp;|\ud83c[\udffb-\udfff](?=\ud83c[\udffb-\udfff])|(?:[^\ud800-\udfff][\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]?|[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g;

  function length$1(str) {
    const match = str.match(rxAstralRange$1);
    return (match === null) ? 0 : match.length;
  }

  function substring$1(str, begin, end) {
    return str.match(rxAstralRange$1).slice(begin, end).join('')
  }

  function slugify$1(str) {
    return str
      .toLowerCase()
      .split('')
      .map(char => charMap$1[char] || char)
      .join('')
      .replace(' ', '-')
      .replace(/[^-a-z0-9]{1,60}/, '');
  }

  var input = {
    setValue: function() {
      // interface, implement this in your class
    },

    getValue: function() {
      // interface, implement this in your class
    },

    setPlaceholder: function() {
      // interface, implement this in your class
    },

    removePlaceholder: function() {
      // interface, implement this in your class
    },

    setCarret: function() {
      // interface, implement this in your class
    },

    getCarret: function() {
      // interface, implement this in your class
    },

    resetCarret: function() {
      // interface, implement this in your class
    },

    setup: function(opts) {
      this.debouncedUpdate = debounce$1(this.update, opts.debounce || 500);

      let isMeta = false;
      this._value = this.getValue();
      this.limit = opts.limit;
      this.events = {};
      this.events.click = on(this.el, 'click', e => e.stopPropagation());
      this.events.focus = on(this.input, 'focus', () => this.removeClass('input-message'));
      this.events.blur = on(this.input, 'blur', () => {
        isMeta = false;
        this.toggleClass('input-value', this.getValue() !== '');
        this.onKeyUp();
      });
      this.events.paste = on(this.input, 'paste', e => this.onPaste(e));
      this.events.keydown = on(this.input, 'keydown', e => {
        isMeta = e.altKey || e.ctrlKey || e.metaKey;
      });
      this.events.keyup = on(this.input, 'keyup', e => {
        if (isMeta || !e.keyCode) {
          return;
        }
        this.onKeyUp();
      });

      opts.placeholder && this.setPlaceholder(opts.placeholder);
      this.toggleClass('input-value', this.getValue() !== '');
    },

    onKeyUp: function() {
      const pos = this.getCarret();
      const limit = this.limit;
      let val = this.transform(this.getValue(), true);
      let needUpdate = false;

      if (limit && length$1(val) > limit) {
        val = substring$1(val, 0, limit);
        needUpdate = true;
      }

      if (val !== this._value || needUpdate) {
        this._value = val;
        this.setValue(val);
        this.setCarret(pos);
        this.debouncedUpdate(val);
      }
    },

    onPaste: function(e) {
      const str = e.originalEvent.clipboardData.getData('text/plain');
      const pos = this.getCarret();
      document.execCommand('insertText', false, str);
      e.preventDefault();
      e.stopPropagation();

      setTimeout(() => {
        const val = this.transform(this.getValue());
        this.setValue(val);
        this.setCarret(pos + str.length);
        this.update(val);
      }, 100);
    },

    update: function(val, silent) {
      this.removeClass('error');
      !silent && this.didUpdate && this.didUpdate(val);
    },

    focus: function() {
      this.input.focus();
      this.resetCarret();
      return this;
    },

    blur: function() {
      this.input.blur();
      return this;
    },

    value: function(val, dontUpdate) {
      if (val === undefined) {
        return this.getValue();
      }

      const value = this.getValue();
      val = this.transform(val);

      if (val !== value) {
        this.setValue(val);
        if (dontUpdate) {
          this.toggleClass('input-value', val !== '');
        } else {
          this.update(val);
        }
      }
      return this;
    },

    on: function(...args) {
      return on.apply(null, [ this.input ].concat(args));
    },

    off: function(...args) {
      return off.apply(null, [ this.input ].concat(args));
    },

    destroy: function() {
      this.removePlaceholder && this.removePlaceholder();
      this.removeClass('input-msg', 'input-value');

      const events = this.events;
      off(this.el, 'click', events.click);
      off(this.input, 'focus', events.focus);
      off(this.input, 'blur', events.blur);
      off(this.input, 'paste', events.paste);
      off(this.input, 'keydown', events.keydown);
      off(this.input, 'keyup', events.keyup);

      delete this.input;
      delete this.events;
    }
  };

  const rxGt = /&gt;/g;
  const rxNoTags = /<[^>]*>/ig;
  const rxMultipleSpaces = /\s{2,}/g;

  const transforms = {
    slugify: slugify$1,

    noHtml: str => str.replace(rxNoTags, ''),

    fix: str => str
      .replace(rxGt, '>')
      .replace(rxMultipleSpaces, ' '),

    trim: (str, stopper) => {
      if (stopper) {
        return str;
      }

      return str.trim();
    }
  };

  function apply(arr, fn, push) {
    const order = push ? 'push' : 'unshift';

    switch (typeof fn) {
      case 'string':
        arr[order](transforms[fn]);
        break;

      case 'function':
        arr[order](fn);
        break;

      case 'object':
        for (const prop in transforms) {
          if (fn[prop]) {
            arr[order](transforms[prop]);
          }
        }
        break;
    }
  }

  var transform = {
    unshiftTransform: function(fn) {
      apply(this.transforms, fn, false);
    },

    pushTransform: function(fn) {
      apply(this.transforms, fn, true);
    },

    transform: function(val, stopper) {
      if (!this.transforms.length) {
        return val;
      }

      const transforms = this.transforms;
      for (const i in transforms) {
        if (!val) {
          break;
        }

        val = transforms[i](val, stopper);
      }

      return val;
    }
  };

  const Input = function(opts) {
    this.didUpdate = opts.onChange;
    this.el = opts.el || this.render(opts);
    this.input = this.find('input').item(0);
    this.setup(opts);

    this.transforms = [];
    this.pushTransform(opts);
  };

  Input.prototype = compose$1(
    html$1,
    transform,
    input,
    {
      setValue: function(val) {
        this.input.value = val;
      },

      getValue: function() {
        return this.input.value;
      },

      render: function(opts) {
        return create('label.input', `
        <input
          type="${opts.type || 'text'}"
          ${(opts.name ? `name="${opts.name}" ` : '')}
          ${(opts.value ? `value="${opts.value}" ` : '')}
        >
        <span>${opts.title}</span>
        <em></em>`
        );
      },

      getCarret: function() {
        return this.input.selectionEnd;
      },

      setCarret: function(pos) {
        this.input.setSelectionRange(pos, pos);
      },

      resetCarret: function(toBegin) {
        this.input.focus();
        const pos = toBegin ? 0 : this.input.value.length;
        this.input.setSelectionRange(pos, pos);
      },

      error: function(msg) {
        if (msg) {
          this.addClass('input-message')
            .find('em')
            .item(0)
            .textContent = msg;
        }

        this.errorTimeout = addDelayRemoveClass(this.el, 'error', 600);
      },

      active: function(state) {
        this.input.disabled = !state;
      },

      remove: function() {
        clearTimeout(this.errorTimeout);
        this.destroy();
        remove(this.el);
        delete this.el;
      }
    }
  );

  var icon = name => `<svg><use xlink:href="#icon-${name}"></use></svg>`;

  var template = () => create('div.login.login-s-login', `
  <a class="login-close" href="#/done">${icon('close')}</a>
  <div class="login-login">
    <label class="input">
      <input tabindex=0 id="login-email" type="text">
      <span>Email</span>
      <em></em>
    </label>
    <a tabindex=1 href="#/login" class="login-button">Login</a>
  </div>
  <div class="login-done">
    <h2>Check your email for a login link</h2>
    <a href="#/done" class="login-button">Ok</a>
  </div>
`);

  const Login = function(opts = {}) {
    if (!app.api.auth) {
      throw new Error('No auth controller defined')
    }

    this.elContainer = opts.container || document.body;
    this.isHotkey = isHotkey(opts.hotkey || 'ctrl+l');

    app.on('app.route.login', this.onToken, this);
    const authName = app.api.auth.name;
    app.on(`${authName}.in`, this.onLogin, this);
    app.on(`${authName}.out`, this.onLogout, this);
  };

  Login.prototype = compose$1(
    html$1,
    form,
    {
      onToken: function(state) {
        app.api.auth.token(state.token, err => {
          if (err) {
            this.show(err);

            return;
          }
        });
      },

      show: function(err) {
        if (this.isActive) {
          return;
        }

        this.isActive = true;
        this.el = template();
        this.addForm();
        this.input = new Input({
          el: this.find('.input').item(0)
        });

        if (err) {
          this.input.error(err.message);
        }

        this.appendTo(this.elContainer);
        setTimeout(() => {
          this.addClass('active');
          this.input.focus();
        }, 32);
      },

      hide: function() {
        if (!this.isActive) {
          return;
        }

        this.isActive = false;
        this.removeClass('active');
        setTimeout(() => {
          this.removeForm();
          this.input.remove();
          this.input = null;
          this.el.remove();
          this.el = null;
        }, 600);
      },

      remove: function() {
        this.hide();
        off(document, 'keydown', this.on.hotkey);
        app.off('app.route.login', this.onToken, this);
        const authName = app.api.auth.name;
        app.off(`${authName}.in`, this.onLogin, this);
        app.off(`${authName}.out`, this.onLogout, this);
      },

      onLogin: function() {
        off(document, 'keydown', this.on.hotkey);
        this.hide();
      },

      onLogout: function() {
        this.on.hotkey = on(document, 'keydown', e => this.isHotkey(e) && this.show());
      },

      login: function() {
        if (this.request) {
          return;
        }

        this.addClass('login-s-progress');
        this.request = app.api.auth.login({
          email: this.input.value(),
          data: {
            redirect: window.location.href
          }
        }, err => {
          this.request = null;
          this.removeClass('login-s-progress', 'login-s-login', 'login-s-done');
          if (err) {
            this.input.error(err.message);
            this.addClass('login-s-login');
            return;
          }

          this.input.value('');
          this.addClass('login-s-done');
        });
      },

      done: function() {
        this.hide();
      },

      // keys
      '13': function() {
        this.login();
      },

      '27': function() {
        this.isActive && this.hide();
      }
    }
  );

  ready(() => {
    app.setAPI({
      app: app$$1 => console.log('Set App', app$$1),
      auth: {
        name: 'user',
        login: (req, cb) => {
          console.log('Auth request', req);
          setTimeout(() => cb(new Error('No no no')), 1000);
        },
        token: token => console.log('Auth token', token)
      }
    });

    const body = get('body').item(0);
    const login = new Login({
      container: body,
      hotkey: 'ctrl+l'
    });

    on(get('#click'), 'click', () => login.show());
    // setTimeout(() => input.remove(), 5000);
  });

}());
