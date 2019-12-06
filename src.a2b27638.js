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
})({"node_modules/parcel/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel/src/builtins/bundle-url.js"}],"src/styles.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel/src/builtins/css-loader.js"}],"src/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildHeatmapDencity = buildHeatmapDencity;
exports.throttle = exports.debounce = exports.zip = void 0;

var _constants = require("./constants");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var zip = function zip() {
  for (var _len = arguments.length, arrays = new Array(_len), _key = 0; _key < _len; _key++) {
    arrays[_key] = arguments[_key];
  }

  var maxLength = Math.max.apply(Math, _toConsumableArray(arrays.map(function (x) {
    return x.length;
  })));
  return Array.from({
    length: maxLength
  }).map(function (_, i) {
    return Array.from({
      length: arrays.length
    }, function (_, k) {
      return arrays[k][i];
    });
  });
};

exports.zip = zip;

function buildHeatmapDencity() {
  var palete = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _constants.PALETES.red1;
  var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var result = _constants.HEATMAP_ZERO.concat(zip(_constants.HEATMAP_SHADES, reverse ? palete.slice().reverse() : palete));

  return result.flat();
}

var debounce = function debounce(fn) {
  var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var timeoutId;
  return function () {
    var _this = this;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      return fn.apply(_this, args);
    }, ms);
  };
};

exports.debounce = debounce;

var throttle = function throttle(fn, wait) {
  var inThrottle, lastFn, lastTime;
  return function () {
    var context = this,
        args = arguments;

    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(function () {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};

exports.throttle = throttle;
},{"./constants":"src/constants.js"}],"src/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heatmapOpacity = exports.heatmapRadius = exports.heatmapIntensity = exports.h = exports.getHeatColors = exports.getCircleColor = exports.circlesBlur = exports.circlesLayout = exports.circleRadius = exports.circleOpacity = exports.pointSqrtCount = exports.HEATMAP_SHADES = exports.HEATMAP_ZERO = exports.PALETES = void 0;

var _utils = require("./utils");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var PALETES = {
  red1: ["#FFC940", "#E9A133", "#D27B27", "#B9541A", "#9E2B0E"],
  red2: ["#FFE39F", "#EEB46C", "#D78742", "#BC5B22", "#9E2B0E"],
  purple: ["#FFEEC5", "#F1AEA4", "#D37387", "#A3416E", "#5C255C"],
  blue1: ["#FFE39F", "#ABC4A2", "#6B9FA1", "#3E769E", "#1F4B99"],
  blue2: ["#CFF3D2", "#8BCDBC", "#59A3AC", "#3878A1", "#1F4B99"],
  green1: ["#FFE39F", "#B2CB9A", "#6FB084", "#3B925D", "#1D7324"],
  green2: ["#E8F8B6", "#A4D8A8", "#68B78C", "#399561", "#1D7324"],
  magenta1: ["#D1E1FF", "#B4B4F2", "#918ADF", "#6565C5", "#1F4B99"],
  magenta2: ["#D1E1FF", "#B2ADED", "#927CCF", "#764EA2", "#5C255C"],
  pink: ["#E1BAE1", "#DD86AF", "#C35989", "#98366D", "#5C255C"],
  redBlue: ["rgb(103,169,207)", "rgb(209,229,240)", "rgb(253,219,199)", "rgb(239,138,98)", "rgb(178,24,43)"],
  custom1: ["#3A405A", "#F9DEC9", "#99B2DD", "#E9AFA3", "#685044"],
  custom2: ["#A4303F", "#C8D6AF", "#FFECCC", "#F2D0A4", "#870058"],
  custom3: ["#41D3BD", "#EBF5EE", "#F0D3F7", "#407899", "#791E94"],
  custom4: ["#031D44", "#04395E", "#70A288", "#DAB785", "#D5896F"],
  custom5: ["#5B5F97", "#B8B8D1", "#FFFFFB", "#FFC145", "#FF6B6C"],
  d1: ["#1D7324", "#96BA61", "#FFFFFF", "#6CACB9", "#1F4B99"],
  d2: ["#1D7324", "#8BAE44", "#FFE39F", "#6B9FA1", "#1F4B99"],
  d3: ["#1F4B99", "#6CACB9", "#FFFFFF", "#DF9563", "#9E2B0E"],
  d4: ["#1F4B99", "#6B9FA1", "#FFE39F", "#D78742", "#9E2B0E"],
  n1: ["#FFD402", "#FFA81E", "#FFFFFB", "#945A96", "#791E94"],
  n2: ["#FFE157", "#FFB644", "#B57EB6", "#AD65AF", "#9044A5"],
  n3: ["#FFF517", "#FFE40F", "#FFF712", "#AE6654", "#9044A5"],
  n4: ["#FFE40F", "#FFE40F", "#FFF517", "#AD65AF", "#9044A5"],
  l1: ["#FAE26B", "#DC4942", "#EA5C33", "#A82D4A", "#4E136C"],
  l13: ["#FAE26B", "#DC4942", "#EA5C33", "#A82D4A", "#4E136C"],
  l2: ["rgba(253, 221, 111, 1)", "rgba(241, 135, 49, 1)", "rgba(102, 55, 123, 1)", "rgba(167, 44, 74, 1)", "rgba(116, 19, 98, 1)"],
  l3: ["rgba(244, 233, 104, 1)", "rgba(173, 81, 101, 1)", "rgba(203, 56, 61, 1)", "rgba(102, 55, 123, 1)", "rgba(64, 30, 97, 1)"]
};
exports.PALETES = PALETES;
var HEATMAP_ZERO = [0, "rgba(33,102,172,0)"];
exports.HEATMAP_ZERO = HEATMAP_ZERO;
var HEATMAP_SHADES = [0.2, 0.4, 0.6, 0.8, 1];
exports.HEATMAP_SHADES = HEATMAP_SHADES;
var pointSqrtCount = ["case", ["has", "sqrt_point_count"], ["get", "sqrt_point_count"], 1];
exports.pointSqrtCount = pointSqrtCount;
var circleOpacity = ["interpolate", ["linear"], ["zoom"], 6, 0, 15, 1];
exports.circleOpacity = circleOpacity;
var circleRadius = ["interpolate", ["linear"], ["zoom"], 10, 2, 22, 4];
exports.circleRadius = circleRadius;
var circlesLayout = {
  "circle-sort-key": ["get", "sqrt_point_count"]
};
exports.circlesLayout = circlesLayout;
var circlesBlur = ["interpolate", ["linear"], ["zoom"], 0, 1, 15, 0.5];
exports.circlesBlur = circlesBlur;

var getCircleColor = function getCircleColor(colorSteps) {
  return ["interpolate", ["linear"], pointSqrtCount].concat(_toConsumableArray(colorSteps));
};

exports.getCircleColor = getCircleColor;

var getHeatColors = function getHeatColors(palette) {
  return ["interpolate", ["linear"], ["heatmap-density"]].concat(_toConsumableArray((0, _utils.buildHeatmapDencity)(palette, true)));
};

exports.getHeatColors = getHeatColors;
var h = 9; // heatmapDissapearingZoom

exports.h = h;
var heatmapIntensity = ["interpolate", ["linear"], ["zoom"], 0, 2, h, 4];
exports.heatmapIntensity = heatmapIntensity;
var heatmapRadius = ["interpolate", ["linear"], ["zoom"], 0, 2, h, 20];
exports.heatmapRadius = heatmapRadius;
var heatmapOpacity = ["interpolate", ["linear"], ["zoom"], 7, 1, h, 0];
exports.heatmapOpacity = heatmapOpacity;
},{"./utils":"src/utils.js"}],"src/resize-observer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setWindowHeight = setWindowHeight;

function setWindowHeight() {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  var vh = window.innerHeight * 0.01; // Then we set the value in the --vh custom property to the root of the document

  document.documentElement.style.setProperty("--vh", "".concat(vh, "px"));
} // if (ResizeObserver) {
//   const body = document.querySelector("body > div");
//   const resizeObserver = new ResizeObserver(entries => {
//     console.log(entries);
//     // for (let entry of entries) if (entry.contentBoxSize) setWindowHeight();
//   });
//   resizeObserver.observe(body);
// }
},{}],"src/index.js":[function(require,module,exports) {
"use strict";

require("./styles.scss");

var _constants = require("./constants");

var _utils = require("./utils");

var _resizeObserver = require("./resize-observer");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(0, _resizeObserver.setWindowHeight)();
var modal = document.getElementById("modal");

var closeModal = function closeModal() {
  return modal.classList.remove("is-active");
};

var openModal = function openModal() {
  return modal.classList.add("is-active");
};

document.getElementsByClassName("modal-background").onclick = closeModal;
document.getElementById("modal-bg").addEventListener("click", closeModal);
document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("about-large").addEventListener("click", openModal);
document.getElementById("about-small").addEventListener("click", openModal);
mapboxgl.accessToken = "pk.eyJ1IjoiZHF1bmJwIiwiYSI6ImNrM3U5bGJhazBhZmUza29wNHljdmZ4cDMifQ.2X-FQcNV7_P4ajnk6EDrcg";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  zoom: 2.33,
  center: [102, 60],
  minZoom: 2,
  hash: true
});
var layerList = document.getElementById("layers-menu");
var links = layerList.getElementsByTagName("a");

function getLabelsLayer() {
  var layers = map.getStyle().layers;
  var firstSymbolId = null;

  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === "symbol") {
      firstSymbolId = layers[i].id;
      break;
    }
  }

  return firstSymbolId;
}

var createLayersKeeper = function createLayersKeeper(map) {
  var keepLayers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var layerIds = [],
      sourceIds = [],
      before = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keepLayers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var l = _step.value;
      layerIds.push(l.id);
      sourceIds.push(l.source || l.id);
      if (l.before) before[l.id] = l.before;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var filterLayers = function filterLayers(_ref) {
    var id = _ref.id;
    return layerIds.some(function (l) {
      return id.startsWith(l);
    });
  };

  var filterSources = function filterSources(id) {
    return sourceIds.some(function (s) {
      return id.startsWith(s);
    });
  }; // const filterLayers = l => layerIds.indexOf(l.id) !== -1;
  // const filterSources = id => sourceIds.indexOf(id) !== -1;


  return function (nextStyle, onStyleChanged) {
    var currentStyle = map.getStyle();
    var dataLayers = currentStyle.layers.filter(filterLayers);
    var dataSources = Object.keys(currentStyle.sources).filter(filterSources).reduce(function (acc, s) {
      return _objectSpread({}, acc, _defineProperty({}, s, currentStyle.sources[s]));
    }, {});
    map.setStyle(nextStyle);
    map.once("styledata", function () {
      var style = map.getStyle();
      onStyleChanged(style);
      var layers = style.layers;
      var nextLayerIds = layers.map(function (_ref2) {
        var id = _ref2.id;
        return id;
      });
      Object.keys(dataSources).forEach(function (s) {
        return map.addSource(s, dataSources[s]);
      });
      dataLayers.forEach(function (l) {
        var boforeIndex = nextLayerIds.indexOf(before[l.id]);
        map.addLayer(l, boforeIndex !== -1 ? before[l.id] : undefined);
        layers.splice(boforeIndex, 0);
      });
    });
  };
};

function loadSources() {
  map.addSource("gt-points", {
    type: "vector",
    url: "https://demo.geoalert.io/data/GT_cluster_densest_as_needed_max25K_features_max100Kbytes.json"
  });
  map.addSource("osm-points", {
    type: "vector",
    url: "https://demo.geoalert.io/data/OSM_cluster_densest_as_needed_max25K_features_max100Kbytes.json"
  });
}

var removeDelay = 150;

function loadHeat(before) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "gt-heat";
  var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "gt-points";
  var palette = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _constants.PALETES.red1;
  map.addLayer({
    id: id,
    type: "heatmap",
    source: source,
    "source-layer": "points",
    maxzoom: _constants.h,
    paint: {
      // Increase the heatmap weight based on frequency and property magnitude
      "heatmap-weight": ["interpolate", ["linear"], _constants.pointSqrtCount, 0, 0, 500, 1],
      // Increase the heatmap color weight weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      "heatmap-intensity": _constants.heatmapIntensity,
      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      "heatmap-color": (0, _constants.getHeatColors)(palette),
      // Adjust the heatmap radius by zoom level
      "heatmap-radius": _constants.heatmapRadius,
      // Transition from heatmap to circle layer by zoom level
      "heatmap-opacity": 0
    }
  }, before);
  map.setPaintProperty(id, "heatmap-opacity", _constants.heatmapOpacity);
  return function () {
    map.setPaintProperty(id, "heatmap-opacity", 0);
    setTimeout(function () {
      return map.removeLayer(id);
    }, removeDelay);
  };
}

function loadCircles(before) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "gt-points";
  var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "gt-points";
  var palette = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _constants.PALETES.red1;
  map.addLayer({
    id: id,
    type: "circle",
    source: source,
    "source-layer": "points",
    minzoom: 8,
    layout: _constants.circlesLayout,
    paint: {
      "circle-radius": _constants.circleRadius,
      "circle-color": palette[0],
      "circle-stroke-width": 0.4,
      "circle-stroke-color": palette[4],
      "circle-opacity": 0,
      "circle-stroke-opacity": 0
    }
  }, before);
  map.setPaintProperty(id, "circle-stroke-opacity", _constants.circleOpacity);
  map.setPaintProperty(id, "circle-opacity", _constants.circleOpacity);
  return function () {
    map.setPaintProperty(id, "circle-opacity", 0);
    setTimeout(function () {
      return map.removeLayer(id);
    }, removeDelay);
  };
}

var mapPaletes = {
  gt: _constants.PALETES.l13,
  osm: _constants.PALETES.l13
};
map.on("load", function () {
  loadSources(); // Find the index of the first symbol layer in the map style

  var firstSymbolId = getLabelsLayer();
  var setStyle = createLayersKeeper(map, [{
    id: "gt-",
    before: firstSymbolId
  }, {
    id: "osm-",
    before: firstSymbolId
  }]);

  function switchLayer(layer) {
    var layerId = layer.target.id;

    for (var l = 0; l < links.length; l++) {
      links[l].classList.remove("is-active");
    }

    layer.target.classList.add("is-active");
    setStyle("mapbox://styles/mapbox/" + layerId, function () {
      firstSymbolId = getLabelsLayer();
    });
  }

  for (var i = 0; i < links.length; i++) {
    links[i].onclick = switchLayer;
  }

  var toUnload = [];

  function eventFire(el, etype) {
    if (el.fireEvent) {
      el.fireEvent("on" + etype);
    } else {
      var evObj = document.createEvent("Events");
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }

  var unloadCurrent = function unloadCurrent() {
    for (var _i = 0; _i <= toUnload.length; _i++) {
      if (toUnload.length > 0) setTimeout(toUnload.pop(), removeDelay);
    }
  };

  var countButtons = document.querySelectorAll("nav");
  setTimeout(function () {
    // countButtons[0].click();
    eventFire(countButtons[0], "click");
  }, 100);

  function switchPointsLayer(e) {
    if (e.classList.contains("active")) return;
    var id = e.id;

    for (var l = 0; l < countButtons.length; l++) {
      countButtons[l].classList.remove("active");
    }

    unloadCurrent();
    var palette = mapPaletes[id];
    var unloadCircles = loadCircles(firstSymbolId, "".concat(id, "-points"), "".concat(id, "-points"), palette);
    var unloadHeat = loadHeat(firstSymbolId, "".concat(id, "-heat"), "".concat(id, "-points"), palette);
    toUnload.push(unloadCircles);
    toUnload.push(unloadHeat);
    e.classList.add("active");
  }

  var throttleSwitch = (0, _utils.throttle)(switchPointsLayer, 1000);

  var _loop = function _loop(l) {
    countButtons[l].onclick = function () {
      throttleSwitch(countButtons[l]);
    };
  };

  for (var l = 0; l < countButtons.length; l++) {
    _loop(l);
  }
});
},{"./styles.scss":"src/styles.scss","./constants":"src/constants.js","./utils":"src/utils.js","./resize-observer":"src/resize-observer.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59821" + '/');

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
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map