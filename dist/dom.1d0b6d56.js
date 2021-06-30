// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"dom.js":[function(require,module,exports) {
window.dom = {
  //create(tagName) {
  //  return document.createElement(tagName);
  //dom.create = function(){}
  create: function create(string) {
    var container = document.createElement('template'); // 因为这个容器是div，div里面是不能放td的，
    //有什么标签是可以放任意元素，而不出错：template:容纳任何内容，不会在页面中显示

    container.innerHTML = string.trim(); //字符串要trim一下，不然有空格

    return container.content.firstChild;
  },
  after: function after(node, node2) {
    //node.parentNode.insertBefore(node.node2) //这样是可以把node2插到node前面，但是我们要做的是插到后面
    node.parentNode.insertBefore(node2, node.nextSibling);
  },
  //在一个节点后面插入一个节点node2，新增弟弟节点
  before: function before(node, node2) {
    node.parentNode.insertBefore(node2, node);
  },
  //做一个接口，就是在前一个节点，这是默认支持的接口，新增哥哥节点
  append: function append(parent, node) {
    parent.appendChild(node);
  },
  //新增加孩子
  wrap: function wrap(node, parent) {
    dom.before(node, parent); //把parent放到node前面，eg：在div1和div2中间插入div3

    dom.append(parent, node); //在把node放到parent里面，eg: 把div2删掉，放到div3里面
  },
  remove: function remove(node) {
    node.parentNode.removeChild(node); //从爸爸这个节点删除这个儿子

    return node; //删的人还可以保持这个节点的引用
  },
  empty: function empty(node) {
    //给一个节点，把这个节点所有的儿子给干掉
    // node.innerHTML = "" 但是没办法获取节点的引用  
    // const {childNodes} = node
    var array = [];
    var x = node.firstChild;

    while (x) {
      array.push(dom.remove(node.firstChild));
      x = node.firstChild; //这里的firstchild是之前第二个节点递阶上去，变成第一个儿子
    }

    return array;
  },
  attr: function attr(node, name, value) {
    //过程叫做重载；接受一个节点，属性名，属性值
    if (arguments.length === 3) {
      node.setAttribute(name, value);
    } else if (arguments.length === 2) {
      return node.getAttribute(name);
    }
  },
  text: function text(node, string) {
    //这种写代码的方式叫适配，用于读写文本内容
    // console.log('innerText' in node) //检测innerText在不在Node里面，答：在
    if (arguments.length === 2) {
      if ('innerText' in node) {
        node.innerText = string; //ie
      } else {
        node.innerContent = string; //firefox /chrome
      }
    } else if (arguments.length === 1) {
      if ('innerText' in node) {
        return node.innerText; //ie
      } else {
        return node.innerContent; //firefox /chrome
      }
    }
  },
  html: function html(node, string) {
    //改html;text和html完成了即可读，也可以写
    if (arguments.length === 2) {
      //如果参数长度为2，设置
      node.innerHTML = string;
    } else if (arguments.length === 1) {
      //如果参数长度为1
      return node.innerHTML;
    }
  },
  style: function style(node, name, value) {
    //如果name等于字符串
    if (arguments.length === 3) {
      //dom.style(div, 'color', 'red') 把div的颜色改成红色;dom style三个参数
      node.style[name] = value;
    } else if (arguments.length === 2) {
      if (typeof name === 'string') {
        //dome.style(div, 'color') 想获取div里面的color;dom style两个参数
        return node.style[name];
      } else if (name instanceof Object) {
        //dom.style(div,{color:'red'}) dom style后面接一个对象
        var _Object = name;

        for (var key in _Object) {
          //因为key可能是等于border,也可能是color
          // node.style.border = ...
          // node.style.color = ... 正常来说应该是这两行写的，但是因为border和color是变量，
          //所以下一行代码的key要放在[]里面，没加[]，key会变成字符串
          node.style[key] = _Object[key]; //原本Object改成了name，name就是Object的对象
        }
      }
    }
  },
  class: {
    //class是个对象
    add: function add(node, className) {
      node.classList.add(className);
    },
    remove: function remove(node, className) {
      node.classList.remove(className);
    },
    has: function has(node, className) {
      //node里面有没有className，有的话就调用它
      return node.classList.contains(className);
    } //检查元素的类属性种是否存在指定的类值

  },
  on: function on(node, eventName, fn) {
    node.addEventListener(eventName, fn);
  },
  off: function off(node, eventName, fn) {
    node.addEventListener(eventName, fn);
  },
  find: function find(selector, scope) {
    //给一个选择器;scope是范围的意思
    return (scope || document).querySelectorAll(selector); //如果有scope，就在里面查找，如果没有就再doc里面调用querySelectorAll
  },
  parent: function parent(node) {
    //获取爸爸元素
    return node.parentNode;
  },
  children: function children(node) {
    //获取子元素
    return node.children;
  },
  siblings: function siblings(node) {
    //获取兄弟姐妹，不能返回自己的
    return Array.from(node.parentNode.children).filter(function (n) {
      return n !== node;
    }); //children是伪数组，所以要变成数组要加array.from;
    //filter+数组,filter对应每个节点，不等于传给我这个节点,这样就可以获取所有的兄弟姐们节点
  },
  next: function next(node) {
    //获取s2的下一个节点
    var x = node.nextSibling;

    while (x && x.nodeType === 3) {
      //如果x存在，且，x节点等于3,3是文本
      x = x.nextSibling; //让x等于s的下一个文本节点，一直这么循环，直到找到下一个节点不是文本
    }

    return x;
  },
  previous: function previous(node) {
    //查找上一个节点
    var x = node.previousSibling;

    while (x && x.nodeType === 3) {
      //如果x存在，且，x节点等于3,3是文本
      x = x.previousSibling; //让x等于s的下一个文本节点，一直这么循环，直到找到下一个节点不是文本
    }

    return x;
  },
  each: function each(nodeList, fn) {
    //给一个节点的列表，给一个函数
    for (var i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i]); //调用fn，传的是this，没有this，this不传，传的第一个参数就是列表的第i个
    } //对节点的每一个函数进行调用

  },
  index: function index(node) {
    //获取这个节点排行第几
    var list = dom.children(node.parentNode); //让列表等于获取爸爸的所有的儿子

    var i; //这样i的声明作用域就作用到return i了，i就可以拿到值了

    for (i = 0; i < list.length; i++) {
      //遍历这个列表
      if (list[i] === node) {
        //让列表的i跟节点匹配，如果等于这个节点，就停下来
        break;
      }
    }

    return i;
  }
};
},{}],"C:/Users/keiko/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "14093" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/keiko/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js","dom.js"], null)
//# sourceMappingURL=/dom.1d0b6d56.js.map