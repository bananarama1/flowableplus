var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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

// node_modules/cmmn-moddle/node_modules/min-dash/dist/index.js
var require_dist = __commonJS({
  "node_modules/cmmn-moddle/node_modules/min-dash/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function flatten(arr) {
      return Array.prototype.concat.apply([], arr);
    }
    var nativeToString4 = Object.prototype.toString;
    var nativeHasOwnProperty3 = Object.prototype.hasOwnProperty;
    function isUndefined5(obj) {
      return obj === void 0;
    }
    function isDefined2(obj) {
      return obj !== void 0;
    }
    function isNil3(obj) {
      return obj == null;
    }
    function isArray3(obj) {
      return nativeToString4.call(obj) === "[object Array]";
    }
    function isObject3(obj) {
      return nativeToString4.call(obj) === "[object Object]";
    }
    function isNumber(obj) {
      return nativeToString4.call(obj) === "[object Number]";
    }
    function isFunction3(obj) {
      var tag = nativeToString4.call(obj);
      return tag === "[object Function]" || tag === "[object AsyncFunction]" || tag === "[object GeneratorFunction]" || tag === "[object AsyncGeneratorFunction]" || tag === "[object Proxy]";
    }
    function isString7(obj) {
      return nativeToString4.call(obj) === "[object String]";
    }
    function ensureArray(obj) {
      if (isArray3(obj)) {
        return;
      }
      throw new Error("must supply array");
    }
    function has3(target, key) {
      return nativeHasOwnProperty3.call(target, key);
    }
    function find3(collection, matcher) {
      matcher = toMatcher2(matcher);
      var match;
      forEach9(collection, function(val, key) {
        if (matcher(val, key)) {
          match = val;
          return false;
        }
      });
      return match;
    }
    function findIndex2(collection, matcher) {
      matcher = toMatcher2(matcher);
      var idx = isArray3(collection) ? -1 : void 0;
      forEach9(collection, function(val, key) {
        if (matcher(val, key)) {
          idx = key;
          return false;
        }
      });
      return idx;
    }
    function filter3(collection, matcher) {
      var result = [];
      forEach9(collection, function(val, key) {
        if (matcher(val, key)) {
          result.push(val);
        }
      });
      return result;
    }
    function forEach9(collection, iterator) {
      var val, result;
      if (isUndefined5(collection)) {
        return;
      }
      var convertKey = isArray3(collection) ? toNum3 : identity3;
      for (var key in collection) {
        if (has3(collection, key)) {
          val = collection[key];
          result = iterator(val, convertKey(key));
          if (result === false) {
            return val;
          }
        }
      }
    }
    function without(arr, matcher) {
      if (isUndefined5(arr)) {
        return [];
      }
      ensureArray(arr);
      matcher = toMatcher2(matcher);
      return arr.filter(function(el, idx) {
        return !matcher(el, idx);
      });
    }
    function reduce(collection, iterator, result) {
      forEach9(collection, function(value, idx) {
        result = iterator(result, value, idx);
      });
      return result;
    }
    function every(collection, matcher) {
      return !!reduce(collection, function(matches, val, key) {
        return matches && matcher(val, key);
      }, true);
    }
    function some(collection, matcher) {
      return !!find3(collection, matcher);
    }
    function map2(collection, fn) {
      var result = [];
      forEach9(collection, function(val, key) {
        result.push(fn(val, key));
      });
      return result;
    }
    function keys(collection) {
      return collection && Object.keys(collection) || [];
    }
    function size(collection) {
      return keys(collection).length;
    }
    function values(collection) {
      return map2(collection, function(val) {
        return val;
      });
    }
    function groupBy(collection, extractor) {
      var grouped = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      extractor = toExtractor(extractor);
      forEach9(collection, function(val) {
        var discriminator = extractor(val) || "_";
        var group = grouped[discriminator];
        if (!group) {
          group = grouped[discriminator] = [];
        }
        group.push(val);
      });
      return grouped;
    }
    function uniqueBy(extractor) {
      extractor = toExtractor(extractor);
      var grouped = {};
      for (var _len = arguments.length, collections = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        collections[_key - 1] = arguments[_key];
      }
      forEach9(collections, function(c) {
        return groupBy(c, extractor, grouped);
      });
      var result = map2(grouped, function(val, key) {
        return val[0];
      });
      return result;
    }
    var unionBy = uniqueBy;
    function sortBy(collection, extractor) {
      extractor = toExtractor(extractor);
      var sorted = [];
      forEach9(collection, function(value, key) {
        var disc = extractor(value, key);
        var entry = {
          d: disc,
          v: value
        };
        for (var idx = 0; idx < sorted.length; idx++) {
          var d = sorted[idx].d;
          if (disc < d) {
            sorted.splice(idx, 0, entry);
            return;
          }
        }
        sorted.push(entry);
      });
      return map2(sorted, function(e) {
        return e.v;
      });
    }
    function matchPattern(pattern) {
      return function(el) {
        return every(pattern, function(val, key) {
          return el[key] === val;
        });
      };
    }
    function toExtractor(extractor) {
      return isFunction3(extractor) ? extractor : function(e) {
        return e[extractor];
      };
    }
    function toMatcher2(matcher) {
      return isFunction3(matcher) ? matcher : function(e) {
        return e === matcher;
      };
    }
    function identity3(arg) {
      return arg;
    }
    function toNum3(arg) {
      return Number(arg);
    }
    function debounce(fn, timeout) {
      var timer;
      var lastArgs;
      var lastThis;
      var lastNow;
      function fire(force) {
        var now = Date.now();
        var scheduledDiff = force ? 0 : lastNow + timeout - now;
        if (scheduledDiff > 0) {
          return schedule(scheduledDiff);
        }
        fn.apply(lastThis, lastArgs);
        clear();
      }
      function schedule(timeout2) {
        timer = setTimeout(fire, timeout2);
      }
      function clear() {
        if (timer) {
          clearTimeout(timer);
        }
        timer = lastNow = lastArgs = lastThis = void 0;
      }
      function flush() {
        if (timer) {
          fire(true);
        }
        clear();
      }
      function callback() {
        lastNow = Date.now();
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        lastArgs = args;
        lastThis = this;
        if (!timer) {
          schedule(timeout);
        }
      }
      callback.flush = flush;
      callback.cancel = clear;
      return callback;
    }
    function throttle(fn, interval) {
      var throttling = false;
      return function() {
        if (throttling) {
          return;
        }
        fn.apply(void 0, arguments);
        throttling = true;
        setTimeout(function() {
          throttling = false;
        }, interval);
      };
    }
    function bind5(fn, target) {
      return fn.bind(target);
    }
    function _typeof(obj) {
      "@babel/helpers - typeof";
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    function assign10(target) {
      for (var _len = arguments.length, others = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        others[_key - 1] = arguments[_key];
      }
      return _extends.apply(void 0, [target].concat(others));
    }
    function set2(target, path, value) {
      var currentTarget = target;
      forEach9(path, function(key, idx) {
        if (typeof key !== "number" && typeof key !== "string") {
          throw new Error("illegal key type: " + _typeof(key) + ". Key should be of type number or string.");
        }
        if (key === "constructor") {
          throw new Error("illegal key: constructor");
        }
        if (key === "__proto__") {
          throw new Error("illegal key: __proto__");
        }
        var nextKey = path[idx + 1];
        var nextTarget = currentTarget[key];
        if (isDefined2(nextKey) && isNil3(nextTarget)) {
          nextTarget = currentTarget[key] = isNaN(+nextKey) ? {} : [];
        }
        if (isUndefined5(nextKey)) {
          if (isUndefined5(value)) {
            delete currentTarget[key];
          } else {
            currentTarget[key] = value;
          }
        } else {
          currentTarget = nextTarget;
        }
      });
      return target;
    }
    function get(target, path, defaultValue) {
      var currentTarget = target;
      forEach9(path, function(key) {
        if (isNil3(currentTarget)) {
          currentTarget = void 0;
          return false;
        }
        currentTarget = currentTarget[key];
      });
      return isUndefined5(currentTarget) ? defaultValue : currentTarget;
    }
    function pick3(target, properties) {
      var result = {};
      var obj = Object(target);
      forEach9(properties, function(prop) {
        if (prop in obj) {
          result[prop] = target[prop];
        }
      });
      return result;
    }
    function omit(target, properties) {
      var result = {};
      var obj = Object(target);
      forEach9(obj, function(prop, key) {
        if (properties.indexOf(key) === -1) {
          result[key] = prop;
        }
      });
      return result;
    }
    function merge(target) {
      for (var _len2 = arguments.length, sources = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        sources[_key2 - 1] = arguments[_key2];
      }
      if (!sources.length) {
        return target;
      }
      forEach9(sources, function(source) {
        if (!source || !isObject3(source)) {
          return;
        }
        forEach9(source, function(sourceVal, key) {
          if (key === "__proto__") {
            return;
          }
          var targetVal = target[key];
          if (isObject3(sourceVal)) {
            if (!isObject3(targetVal)) {
              targetVal = {};
            }
            target[key] = merge(targetVal, sourceVal);
          } else {
            target[key] = sourceVal;
          }
        });
      });
      return target;
    }
    exports.assign = assign10;
    exports.bind = bind5;
    exports.debounce = debounce;
    exports.ensureArray = ensureArray;
    exports.every = every;
    exports.filter = filter3;
    exports.find = find3;
    exports.findIndex = findIndex2;
    exports.flatten = flatten;
    exports.forEach = forEach9;
    exports.get = get;
    exports.groupBy = groupBy;
    exports.has = has3;
    exports.isArray = isArray3;
    exports.isDefined = isDefined2;
    exports.isFunction = isFunction3;
    exports.isNil = isNil3;
    exports.isNumber = isNumber;
    exports.isObject = isObject3;
    exports.isString = isString7;
    exports.isUndefined = isUndefined5;
    exports.keys = keys;
    exports.map = map2;
    exports.matchPattern = matchPattern;
    exports.merge = merge;
    exports.omit = omit;
    exports.pick = pick3;
    exports.reduce = reduce;
    exports.set = set2;
    exports.size = size;
    exports.some = some;
    exports.sortBy = sortBy;
    exports.throttle = throttle;
    exports.unionBy = unionBy;
    exports.uniqueBy = uniqueBy;
    exports.values = values;
    exports.without = without;
  }
});

// node_modules/cmmn-moddle/node_modules/saxen/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/cmmn-moddle/node_modules/saxen/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var fromCharCode2 = String.fromCharCode;
    var hasOwnProperty2 = Object.prototype.hasOwnProperty;
    var ENTITY_PATTERN2 = /&#(\d+);|&#x([0-9a-f]+);|&(\w+);/ig;
    var ENTITY_MAPPING2 = {
      "amp": "&",
      "apos": "'",
      "gt": ">",
      "lt": "<",
      "quot": '"'
    };
    Object.keys(ENTITY_MAPPING2).forEach(function(k) {
      ENTITY_MAPPING2[k.toUpperCase()] = ENTITY_MAPPING2[k];
    });
    function replaceEntities2(_, d, x, z) {
      if (z) {
        if (hasOwnProperty2.call(ENTITY_MAPPING2, z)) {
          return ENTITY_MAPPING2[z];
        } else {
          return "&" + z + ";";
        }
      }
      if (d) {
        return fromCharCode2(d);
      }
      return fromCharCode2(parseInt(x, 16));
    }
    function decodeEntities2(s) {
      if (s.length > 3 && s.indexOf("&") !== -1) {
        return s.replace(ENTITY_PATTERN2, replaceEntities2);
      }
      return s;
    }
    var XSI_URI = "http://www.w3.org/2001/XMLSchema-instance";
    var XSI_PREFIX = "xsi";
    var XSI_TYPE2 = "xsi:type";
    var NON_WHITESPACE_OUTSIDE_ROOT_NODE2 = "non-whitespace outside of root node";
    function error4(msg) {
      return new Error(msg);
    }
    function missingNamespaceForPrefix2(prefix2) {
      return "missing namespace for prefix <" + prefix2 + ">";
    }
    function getter2(getFn) {
      return {
        "get": getFn,
        "enumerable": true
      };
    }
    function cloneNsMatrix2(nsMatrix) {
      var clone = {}, key;
      for (key in nsMatrix) {
        clone[key] = nsMatrix[key];
      }
      return clone;
    }
    function uriPrefix2(prefix2) {
      return prefix2 + "$uri";
    }
    function buildNsMatrix2(nsUriToPrefix) {
      var nsMatrix = {}, uri2, prefix2;
      for (uri2 in nsUriToPrefix) {
        prefix2 = nsUriToPrefix[uri2];
        nsMatrix[prefix2] = prefix2;
        nsMatrix[uriPrefix2(prefix2)] = uri2;
      }
      return nsMatrix;
    }
    function noopGetContext2() {
      return { "line": 0, "column": 0 };
    }
    function throwFunc2(err) {
      throw err;
    }
    function Parser2(options) {
      if (!this) {
        return new Parser2(options);
      }
      var proxy = options && options["proxy"];
      var onText, onOpenTag, onCloseTag, onCDATA, onError = throwFunc2, onWarning, onComment, onQuestion, onAttention;
      var getContext = noopGetContext2;
      var maybeNS = false;
      var isNamespace = false;
      var returnError = null;
      var parseStop = false;
      var nsUriToPrefix;
      function handleError(err) {
        if (!(err instanceof Error)) {
          err = error4(err);
        }
        returnError = err;
        onError(err, getContext);
      }
      function handleWarning(err) {
        if (!onWarning) {
          return;
        }
        if (!(err instanceof Error)) {
          err = error4(err);
        }
        onWarning(err, getContext);
      }
      this["on"] = function(name2, cb) {
        if (typeof cb !== "function") {
          throw error4("required args <name, cb>");
        }
        switch (name2) {
          case "openTag":
            onOpenTag = cb;
            break;
          case "text":
            onText = cb;
            break;
          case "closeTag":
            onCloseTag = cb;
            break;
          case "error":
            onError = cb;
            break;
          case "warn":
            onWarning = cb;
            break;
          case "cdata":
            onCDATA = cb;
            break;
          case "attention":
            onAttention = cb;
            break;
          // <!XXXXX zzzz="eeee">
          case "question":
            onQuestion = cb;
            break;
          // <? ....  ?>
          case "comment":
            onComment = cb;
            break;
          default:
            throw error4("unsupported event: " + name2);
        }
        return this;
      };
      this["ns"] = function(nsMap) {
        if (typeof nsMap === "undefined") {
          nsMap = {};
        }
        if (typeof nsMap !== "object") {
          throw error4("required args <nsMap={}>");
        }
        var _nsUriToPrefix = {}, k;
        for (k in nsMap) {
          _nsUriToPrefix[k] = nsMap[k];
        }
        _nsUriToPrefix[XSI_URI] = XSI_PREFIX;
        isNamespace = true;
        nsUriToPrefix = _nsUriToPrefix;
        return this;
      };
      this["parse"] = function(xml2) {
        if (typeof xml2 !== "string") {
          throw error4("required args <xml=string>");
        }
        returnError = null;
        parse(xml2);
        getContext = noopGetContext2;
        parseStop = false;
        return returnError;
      };
      this["stop"] = function() {
        parseStop = true;
      };
      function parse(xml2) {
        var nsMatrixStack = isNamespace ? [] : null, nsMatrix = isNamespace ? buildNsMatrix2(nsUriToPrefix) : null, _nsMatrix, nodeStack = [], anonymousNsCount = 0, tagStart = false, tagEnd = false, i = 0, j = 0, x, y, q, w, v, xmlns, elementName, _elementName, elementProxy;
        var attrsString = "", attrsStart = 0, cachedAttrs;
        function getAttrs() {
          if (cachedAttrs !== null) {
            return cachedAttrs;
          }
          var nsUri, nsUriPrefix, nsName3, defaultAlias = isNamespace && nsMatrix["xmlns"], attrList = isNamespace && maybeNS ? [] : null, i2 = attrsStart, s = attrsString, l = s.length, hasNewMatrix, newalias, value, alias, name2, attrs = {}, seenAttrs = {}, skipAttr, w2, j2;
          parseAttr:
            for (; i2 < l; i2++) {
              skipAttr = false;
              w2 = s.charCodeAt(i2);
              if (w2 === 32 || w2 < 14 && w2 > 8) {
                continue;
              }
              if (w2 < 65 || w2 > 122 || w2 > 90 && w2 < 97) {
                if (w2 !== 95 && w2 !== 58) {
                  handleWarning("illegal first char attribute name");
                  skipAttr = true;
                }
              }
              for (j2 = i2 + 1; j2 < l; j2++) {
                w2 = s.charCodeAt(j2);
                if (w2 > 96 && w2 < 123 || w2 > 64 && w2 < 91 || w2 > 47 && w2 < 59 || w2 === 46 || // '.'
                w2 === 45 || // '-'
                w2 === 95) {
                  continue;
                }
                if (w2 === 32 || w2 < 14 && w2 > 8) {
                  handleWarning("missing attribute value");
                  i2 = j2;
                  continue parseAttr;
                }
                if (w2 === 61) {
                  break;
                }
                handleWarning("illegal attribute name char");
                skipAttr = true;
              }
              name2 = s.substring(i2, j2);
              if (name2 === "xmlns:xmlns") {
                handleWarning("illegal declaration of xmlns");
                skipAttr = true;
              }
              w2 = s.charCodeAt(j2 + 1);
              if (w2 === 34) {
                j2 = s.indexOf('"', i2 = j2 + 2);
                if (j2 === -1) {
                  j2 = s.indexOf("'", i2);
                  if (j2 !== -1) {
                    handleWarning("attribute value quote missmatch");
                    skipAttr = true;
                  }
                }
              } else if (w2 === 39) {
                j2 = s.indexOf("'", i2 = j2 + 2);
                if (j2 === -1) {
                  j2 = s.indexOf('"', i2);
                  if (j2 !== -1) {
                    handleWarning("attribute value quote missmatch");
                    skipAttr = true;
                  }
                }
              } else {
                handleWarning("missing attribute value quotes");
                skipAttr = true;
                for (j2 = j2 + 1; j2 < l; j2++) {
                  w2 = s.charCodeAt(j2 + 1);
                  if (w2 === 32 || w2 < 14 && w2 > 8) {
                    break;
                  }
                }
              }
              if (j2 === -1) {
                handleWarning("missing closing quotes");
                j2 = l;
                skipAttr = true;
              }
              if (!skipAttr) {
                value = s.substring(i2, j2);
              }
              i2 = j2;
              for (; j2 + 1 < l; j2++) {
                w2 = s.charCodeAt(j2 + 1);
                if (w2 === 32 || w2 < 14 && w2 > 8) {
                  break;
                }
                if (i2 === j2) {
                  handleWarning("illegal character after attribute end");
                  skipAttr = true;
                }
              }
              i2 = j2 + 1;
              if (skipAttr) {
                continue parseAttr;
              }
              if (name2 in seenAttrs) {
                handleWarning("attribute <" + name2 + "> already defined");
                continue;
              }
              seenAttrs[name2] = true;
              if (!isNamespace) {
                attrs[name2] = value;
                continue;
              }
              if (maybeNS) {
                newalias = name2 === "xmlns" ? "xmlns" : name2.charCodeAt(0) === 120 && name2.substr(0, 6) === "xmlns:" ? name2.substr(6) : null;
                if (newalias !== null) {
                  nsUri = decodeEntities2(value);
                  nsUriPrefix = uriPrefix2(newalias);
                  alias = nsUriToPrefix[nsUri];
                  if (!alias) {
                    if (newalias === "xmlns" || nsUriPrefix in nsMatrix && nsMatrix[nsUriPrefix] !== nsUri) {
                      do {
                        alias = "ns" + anonymousNsCount++;
                      } while (typeof nsMatrix[alias] !== "undefined");
                    } else {
                      alias = newalias;
                    }
                    nsUriToPrefix[nsUri] = alias;
                  }
                  if (nsMatrix[newalias] !== alias) {
                    if (!hasNewMatrix) {
                      nsMatrix = cloneNsMatrix2(nsMatrix);
                      hasNewMatrix = true;
                    }
                    nsMatrix[newalias] = alias;
                    if (newalias === "xmlns") {
                      nsMatrix[uriPrefix2(alias)] = nsUri;
                      defaultAlias = alias;
                    }
                    nsMatrix[nsUriPrefix] = nsUri;
                  }
                  attrs[name2] = value;
                  continue;
                }
                attrList.push(name2, value);
                continue;
              }
              w2 = name2.indexOf(":");
              if (w2 === -1) {
                attrs[name2] = value;
                continue;
              }
              if (!(nsName3 = nsMatrix[name2.substring(0, w2)])) {
                handleWarning(missingNamespaceForPrefix2(name2.substring(0, w2)));
                continue;
              }
              name2 = defaultAlias === nsName3 ? name2.substr(w2 + 1) : nsName3 + name2.substr(w2);
              if (name2 === XSI_TYPE2) {
                w2 = value.indexOf(":");
                if (w2 !== -1) {
                  nsName3 = value.substring(0, w2);
                  nsName3 = nsMatrix[nsName3] || nsName3;
                  value = nsName3 + value.substring(w2);
                } else {
                  value = defaultAlias + ":" + value;
                }
              }
              attrs[name2] = value;
            }
          if (maybeNS) {
            for (i2 = 0, l = attrList.length; i2 < l; i2++) {
              name2 = attrList[i2++];
              value = attrList[i2];
              w2 = name2.indexOf(":");
              if (w2 !== -1) {
                if (!(nsName3 = nsMatrix[name2.substring(0, w2)])) {
                  handleWarning(missingNamespaceForPrefix2(name2.substring(0, w2)));
                  continue;
                }
                name2 = defaultAlias === nsName3 ? name2.substr(w2 + 1) : nsName3 + name2.substr(w2);
                if (name2 === XSI_TYPE2) {
                  w2 = value.indexOf(":");
                  if (w2 !== -1) {
                    nsName3 = value.substring(0, w2);
                    nsName3 = nsMatrix[nsName3] || nsName3;
                    value = nsName3 + value.substring(w2);
                  } else {
                    value = defaultAlias + ":" + value;
                  }
                }
              }
              attrs[name2] = value;
            }
          }
          return cachedAttrs = attrs;
        }
        function getParseContext() {
          var splitsRe = /(\r\n|\r|\n)/g;
          var line = 0;
          var column = 0;
          var startOfLine = 0;
          var endOfLine = j;
          var match;
          var data;
          while (i >= startOfLine) {
            match = splitsRe.exec(xml2);
            if (!match) {
              break;
            }
            endOfLine = match[0].length + match.index;
            if (endOfLine > i) {
              break;
            }
            line += 1;
            startOfLine = endOfLine;
          }
          if (i == -1) {
            column = endOfLine;
            data = xml2.substring(j);
          } else if (j === 0) {
            data = xml2.substring(j, i);
          } else {
            column = i - startOfLine;
            data = j == -1 ? xml2.substring(i) : xml2.substring(i, j + 1);
          }
          return {
            "data": data,
            "line": line,
            "column": column
          };
        }
        getContext = getParseContext;
        if (proxy) {
          elementProxy = Object.create({}, {
            "name": getter2(function() {
              return elementName;
            }),
            "originalName": getter2(function() {
              return _elementName;
            }),
            "attrs": getter2(getAttrs),
            "ns": getter2(function() {
              return nsMatrix;
            })
          });
        }
        while (j !== -1) {
          if (xml2.charCodeAt(j) === 60) {
            i = j;
          } else {
            i = xml2.indexOf("<", j);
          }
          if (i === -1) {
            if (nodeStack.length) {
              return handleError("unexpected end of file");
            }
            if (j === 0) {
              return handleError("missing start tag");
            }
            if (j < xml2.length) {
              if (xml2.substring(j).trim()) {
                handleWarning(NON_WHITESPACE_OUTSIDE_ROOT_NODE2);
              }
            }
            return;
          }
          if (j !== i) {
            if (nodeStack.length) {
              if (onText) {
                onText(xml2.substring(j, i), decodeEntities2, getContext);
                if (parseStop) {
                  return;
                }
              }
            } else {
              if (xml2.substring(j, i).trim()) {
                handleWarning(NON_WHITESPACE_OUTSIDE_ROOT_NODE2);
                if (parseStop) {
                  return;
                }
              }
            }
          }
          w = xml2.charCodeAt(i + 1);
          if (w === 33) {
            q = xml2.charCodeAt(i + 2);
            if (q === 91 && xml2.substr(i + 3, 6) === "CDATA[") {
              j = xml2.indexOf("]]>", i);
              if (j === -1) {
                return handleError("unclosed cdata");
              }
              if (onCDATA) {
                onCDATA(xml2.substring(i + 9, j), getContext);
                if (parseStop) {
                  return;
                }
              }
              j += 3;
              continue;
            }
            if (q === 45 && xml2.charCodeAt(i + 3) === 45) {
              j = xml2.indexOf("-->", i);
              if (j === -1) {
                return handleError("unclosed comment");
              }
              if (onComment) {
                onComment(xml2.substring(i + 4, j), decodeEntities2, getContext);
                if (parseStop) {
                  return;
                }
              }
              j += 3;
              continue;
            }
          }
          if (w === 63) {
            j = xml2.indexOf("?>", i);
            if (j === -1) {
              return handleError("unclosed question");
            }
            if (onQuestion) {
              onQuestion(xml2.substring(i, j + 2), getContext);
              if (parseStop) {
                return;
              }
            }
            j += 2;
            continue;
          }
          for (x = i + 1; ; x++) {
            v = xml2.charCodeAt(x);
            if (isNaN(v)) {
              j = -1;
              return handleError("unclosed tag");
            }
            if (v === 34) {
              q = xml2.indexOf('"', x + 1);
              x = q !== -1 ? q : x;
            } else if (v === 39) {
              q = xml2.indexOf("'", x + 1);
              x = q !== -1 ? q : x;
            } else if (v === 62) {
              j = x;
              break;
            }
          }
          if (w === 33) {
            if (onAttention) {
              onAttention(xml2.substring(i, j + 1), decodeEntities2, getContext);
              if (parseStop) {
                return;
              }
            }
            j += 1;
            continue;
          }
          cachedAttrs = {};
          if (w === 47) {
            tagStart = false;
            tagEnd = true;
            if (!nodeStack.length) {
              return handleError("missing open tag");
            }
            x = elementName = nodeStack.pop();
            q = i + 2 + x.length;
            if (xml2.substring(i + 2, q) !== x) {
              return handleError("closing tag mismatch");
            }
            for (; q < j; q++) {
              w = xml2.charCodeAt(q);
              if (w === 32 || w > 8 && w < 14) {
                continue;
              }
              return handleError("close tag");
            }
          } else {
            if (xml2.charCodeAt(j - 1) === 47) {
              x = elementName = xml2.substring(i + 1, j - 1);
              tagStart = true;
              tagEnd = true;
            } else {
              x = elementName = xml2.substring(i + 1, j);
              tagStart = true;
              tagEnd = false;
            }
            if (!(w > 96 && w < 123 || w > 64 && w < 91 || w === 95 || w === 58)) {
              return handleError("illegal first char nodeName");
            }
            for (q = 1, y = x.length; q < y; q++) {
              w = x.charCodeAt(q);
              if (w > 96 && w < 123 || w > 64 && w < 91 || w > 47 && w < 59 || w === 45 || w === 95 || w == 46) {
                continue;
              }
              if (w === 32 || w < 14 && w > 8) {
                elementName = x.substring(0, q);
                cachedAttrs = null;
                break;
              }
              return handleError("invalid nodeName");
            }
            if (!tagEnd) {
              nodeStack.push(elementName);
            }
          }
          if (isNamespace) {
            _nsMatrix = nsMatrix;
            if (tagStart) {
              if (!tagEnd) {
                nsMatrixStack.push(_nsMatrix);
              }
              if (cachedAttrs === null) {
                if (maybeNS = x.indexOf("xmlns", q) !== -1) {
                  attrsStart = q;
                  attrsString = x;
                  getAttrs();
                  maybeNS = false;
                }
              }
            }
            _elementName = elementName;
            w = elementName.indexOf(":");
            if (w !== -1) {
              xmlns = nsMatrix[elementName.substring(0, w)];
              if (!xmlns) {
                return handleError("missing namespace on <" + _elementName + ">");
              }
              elementName = elementName.substr(w + 1);
            } else {
              xmlns = nsMatrix["xmlns"];
            }
            if (xmlns) {
              elementName = xmlns + ":" + elementName;
            }
          }
          if (tagStart) {
            attrsStart = q;
            attrsString = x;
            if (onOpenTag) {
              if (proxy) {
                onOpenTag(elementProxy, decodeEntities2, tagEnd, getContext);
              } else {
                onOpenTag(elementName, getAttrs, decodeEntities2, tagEnd, getContext);
              }
              if (parseStop) {
                return;
              }
            }
          }
          if (tagEnd) {
            if (onCloseTag) {
              onCloseTag(proxy ? elementProxy : elementName, decodeEntities2, tagStart, getContext);
              if (parseStop) {
                return;
              }
            }
            if (isNamespace) {
              if (!tagStart) {
                nsMatrix = nsMatrixStack.pop();
              } else {
                nsMatrix = _nsMatrix;
              }
            }
          }
          j += 1;
        }
      }
    }
    exports.Parser = Parser2;
    exports.decode = decodeEntities2;
  }
});

// test/editor-roundtrip.test.js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// node_modules/bpmn-moddle/node_modules/min-dash/dist/index.esm.js
var nativeToString = Object.prototype.toString;
function isString(obj) {
  return nativeToString.call(obj) === "[object String]";
}
function assign(target, ...others) {
  return Object.assign(target, ...others);
}

// node_modules/moddle/node_modules/min-dash/dist/index.esm.js
var nativeToString2 = Object.prototype.toString;
var nativeHasOwnProperty = Object.prototype.hasOwnProperty;
function isUndefined(obj) {
  return obj === void 0;
}
function isDefined(obj) {
  return obj !== void 0;
}
function isNil(obj) {
  return obj == null;
}
function isArray(obj) {
  return nativeToString2.call(obj) === "[object Array]";
}
function isObject(obj) {
  return nativeToString2.call(obj) === "[object Object]";
}
function isString2(obj) {
  return nativeToString2.call(obj) === "[object String]";
}
function has(target, key) {
  return !isNil(target) && nativeHasOwnProperty.call(target, key);
}
function forEach(collection, iterator) {
  let val, result;
  if (isUndefined(collection)) {
    return;
  }
  const convertKey = isArray(collection) ? toNum : identity;
  for (let key in collection) {
    if (has(collection, key)) {
      val = collection[key];
      result = iterator(val, convertKey(key));
      if (result === false) {
        return val;
      }
    }
  }
}
function identity(arg) {
  return arg;
}
function toNum(arg) {
  return Number(arg);
}
function bind(fn, target) {
  return fn.bind(target);
}
function assign2(target, ...others) {
  return Object.assign(target, ...others);
}
function set(target, path, value) {
  let currentTarget = target;
  forEach(path, function(key, idx) {
    if (typeof key !== "number" && typeof key !== "string") {
      throw new Error("illegal key type: " + typeof key + ". Key should be of type number or string.");
    }
    if (key === "constructor") {
      throw new Error("illegal key: constructor");
    }
    if (key === "__proto__") {
      throw new Error("illegal key: __proto__");
    }
    let nextKey = path[idx + 1];
    let nextTarget = currentTarget[key];
    if (isDefined(nextKey) && isNil(nextTarget)) {
      nextTarget = currentTarget[key] = isNaN(+nextKey) ? {} : [];
    }
    if (isUndefined(nextKey)) {
      if (isUndefined(value)) {
        delete currentTarget[key];
      } else {
        currentTarget[key] = value;
      }
    } else {
      currentTarget = nextTarget;
    }
  });
  return target;
}
function pick(target, properties) {
  let result = {};
  let obj = Object(target);
  forEach(properties, function(prop) {
    if (prop in obj) {
      result[prop] = target[prop];
    }
  });
  return result;
}

// node_modules/moddle/dist/index.js
function Base() {
}
Base.prototype.get = function(name2) {
  return this.$model.properties.get(this, name2);
};
Base.prototype.set = function(name2, value) {
  this.$model.properties.set(this, name2, value);
};
function Factory(model, properties) {
  this.model = model;
  this.properties = properties;
}
Factory.prototype.createType = function(descriptor) {
  var model = this.model;
  var props = this.properties, prototype = Object.create(Base.prototype);
  forEach(descriptor.properties, function(p) {
    if (!p.isMany && p.default !== void 0) {
      prototype[p.name] = p.default;
    }
  });
  props.defineModel(prototype, model);
  props.defineDescriptor(prototype, descriptor);
  var name2 = descriptor.ns.name;
  function ModdleElement(attrs) {
    props.define(this, "$type", { value: name2, enumerable: true });
    props.define(this, "$attrs", { value: {} });
    props.define(this, "$parent", { writable: true });
    forEach(attrs, bind(function(val, key) {
      this.set(key, val);
    }, this));
  }
  ModdleElement.prototype = prototype;
  ModdleElement.hasType = prototype.$instanceOf = this.model.hasType;
  props.defineModel(ModdleElement, model);
  props.defineDescriptor(ModdleElement, descriptor);
  return ModdleElement;
};
var BUILTINS = {
  String: true,
  Boolean: true,
  Integer: true,
  Real: true,
  Element: true
};
var TYPE_CONVERTERS = {
  String: function(s) {
    return s;
  },
  Boolean: function(s) {
    return s === "true";
  },
  Integer: function(s) {
    return parseInt(s, 10);
  },
  Real: function(s) {
    return parseFloat(s);
  }
};
function coerceType(type, value) {
  var converter = TYPE_CONVERTERS[type];
  if (converter) {
    return converter(value);
  } else {
    return value;
  }
}
function isBuiltIn(type) {
  return !!BUILTINS[type];
}
function isSimple(type) {
  return !!TYPE_CONVERTERS[type];
}
function parseName(name2, defaultPrefix) {
  var parts = name2.split(/:/), localName, prefix2;
  if (parts.length === 1) {
    localName = name2;
    prefix2 = defaultPrefix;
  } else if (parts.length === 2) {
    localName = parts[1];
    prefix2 = parts[0];
  } else {
    throw new Error("expected <prefix:localName> or <localName>, got " + name2);
  }
  name2 = (prefix2 ? prefix2 + ":" : "") + localName;
  return {
    name: name2,
    prefix: prefix2,
    localName
  };
}
function DescriptorBuilder(nameNs) {
  this.ns = nameNs;
  this.name = nameNs.name;
  this.allTypes = [];
  this.allTypesByName = {};
  this.properties = [];
  this.propertiesByName = {};
}
DescriptorBuilder.prototype.build = function() {
  return pick(this, [
    "ns",
    "name",
    "allTypes",
    "allTypesByName",
    "properties",
    "propertiesByName",
    "bodyProperty",
    "idProperty"
  ]);
};
DescriptorBuilder.prototype.addProperty = function(p, idx, validate) {
  if (typeof idx === "boolean") {
    validate = idx;
    idx = void 0;
  }
  this.addNamedProperty(p, validate !== false);
  var properties = this.properties;
  if (idx !== void 0) {
    properties.splice(idx, 0, p);
  } else {
    properties.push(p);
  }
};
DescriptorBuilder.prototype.replaceProperty = function(oldProperty, newProperty, replace) {
  var oldNameNs = oldProperty.ns;
  var props = this.properties, propertiesByName = this.propertiesByName, rename = oldProperty.name !== newProperty.name;
  if (oldProperty.isId) {
    if (!newProperty.isId) {
      throw new Error(
        "property <" + newProperty.ns.name + "> must be id property to refine <" + oldProperty.ns.name + ">"
      );
    }
    this.setIdProperty(newProperty, false);
  }
  if (oldProperty.isBody) {
    if (!newProperty.isBody) {
      throw new Error(
        "property <" + newProperty.ns.name + "> must be body property to refine <" + oldProperty.ns.name + ">"
      );
    }
    this.setBodyProperty(newProperty, false);
  }
  var idx = props.indexOf(oldProperty);
  if (idx === -1) {
    throw new Error("property <" + oldNameNs.name + "> not found in property list");
  }
  props.splice(idx, 1);
  this.addProperty(newProperty, replace ? void 0 : idx, rename);
  propertiesByName[oldNameNs.name] = propertiesByName[oldNameNs.localName] = newProperty;
};
DescriptorBuilder.prototype.redefineProperty = function(p, targetPropertyName, replace) {
  var nsPrefix = p.ns.prefix;
  var parts = targetPropertyName.split("#");
  var name2 = parseName(parts[0], nsPrefix);
  var attrName = parseName(parts[1], name2.prefix).name;
  var redefinedProperty = this.propertiesByName[attrName];
  if (!redefinedProperty) {
    throw new Error("refined property <" + attrName + "> not found");
  } else {
    this.replaceProperty(redefinedProperty, p, replace);
  }
  delete p.redefines;
};
DescriptorBuilder.prototype.addNamedProperty = function(p, validate) {
  var ns = p.ns, propsByName = this.propertiesByName;
  if (validate) {
    this.assertNotDefined(p, ns.name);
    this.assertNotDefined(p, ns.localName);
  }
  propsByName[ns.name] = propsByName[ns.localName] = p;
};
DescriptorBuilder.prototype.removeNamedProperty = function(p) {
  var ns = p.ns, propsByName = this.propertiesByName;
  delete propsByName[ns.name];
  delete propsByName[ns.localName];
};
DescriptorBuilder.prototype.setBodyProperty = function(p, validate) {
  if (validate && this.bodyProperty) {
    throw new Error(
      "body property defined multiple times (<" + this.bodyProperty.ns.name + ">, <" + p.ns.name + ">)"
    );
  }
  this.bodyProperty = p;
};
DescriptorBuilder.prototype.setIdProperty = function(p, validate) {
  if (validate && this.idProperty) {
    throw new Error(
      "id property defined multiple times (<" + this.idProperty.ns.name + ">, <" + p.ns.name + ">)"
    );
  }
  this.idProperty = p;
};
DescriptorBuilder.prototype.assertNotTrait = function(typeDescriptor) {
  const _extends = typeDescriptor.extends || [];
  if (_extends.length) {
    throw new Error(
      `cannot create <${typeDescriptor.name}> extending <${typeDescriptor.extends}>`
    );
  }
};
DescriptorBuilder.prototype.assertNotDefined = function(p, name2) {
  var propertyName = p.name, definedProperty = this.propertiesByName[propertyName];
  if (definedProperty) {
    throw new Error(
      "property <" + propertyName + "> already defined; override of <" + definedProperty.definedBy.ns.name + "#" + definedProperty.ns.name + "> by <" + p.definedBy.ns.name + "#" + p.ns.name + "> not allowed without redefines"
    );
  }
};
DescriptorBuilder.prototype.hasProperty = function(name2) {
  return this.propertiesByName[name2];
};
DescriptorBuilder.prototype.addTrait = function(t, inherited) {
  if (inherited) {
    this.assertNotTrait(t);
  }
  var typesByName = this.allTypesByName, types2 = this.allTypes;
  var typeName = t.name;
  if (typeName in typesByName) {
    return;
  }
  forEach(t.properties, bind(function(p) {
    p = assign2({}, p, {
      name: p.ns.localName,
      inherited
    });
    Object.defineProperty(p, "definedBy", {
      value: t
    });
    var replaces = p.replaces, redefines = p.redefines;
    if (replaces || redefines) {
      this.redefineProperty(p, replaces || redefines, replaces);
    } else {
      if (p.isBody) {
        this.setBodyProperty(p);
      }
      if (p.isId) {
        this.setIdProperty(p);
      }
      this.addProperty(p);
    }
  }, this));
  types2.push(t);
  typesByName[typeName] = t;
};
function Registry(packages3, properties) {
  this.packageMap = {};
  this.typeMap = {};
  this.packages = [];
  this.properties = properties;
  forEach(packages3, bind(this.registerPackage, this));
}
Registry.prototype.getPackage = function(uriOrPrefix) {
  return this.packageMap[uriOrPrefix];
};
Registry.prototype.getPackages = function() {
  return this.packages;
};
Registry.prototype.registerPackage = function(pkg) {
  pkg = assign2({}, pkg);
  var pkgMap = this.packageMap;
  ensureAvailable(pkgMap, pkg, "prefix");
  ensureAvailable(pkgMap, pkg, "uri");
  forEach(pkg.types, bind(function(descriptor) {
    this.registerType(descriptor, pkg);
  }, this));
  pkgMap[pkg.uri] = pkgMap[pkg.prefix] = pkg;
  this.packages.push(pkg);
};
Registry.prototype.registerType = function(type, pkg) {
  type = assign2({}, type, {
    superClass: (type.superClass || []).slice(),
    extends: (type.extends || []).slice(),
    properties: (type.properties || []).slice(),
    meta: assign2(type.meta || {})
  });
  var ns = parseName(type.name, pkg.prefix), name2 = ns.name, propertiesByName = {};
  forEach(type.properties, bind(function(p) {
    var propertyNs = parseName(p.name, ns.prefix), propertyName = propertyNs.name;
    if (!isBuiltIn(p.type)) {
      p.type = parseName(p.type, propertyNs.prefix).name;
    }
    assign2(p, {
      ns: propertyNs,
      name: propertyName
    });
    propertiesByName[propertyName] = p;
  }, this));
  assign2(type, {
    ns,
    name: name2,
    propertiesByName
  });
  forEach(type.extends, bind(function(extendsName) {
    var extendsNameNs = parseName(extendsName, ns.prefix);
    var extended = this.typeMap[extendsNameNs.name];
    extended.traits = extended.traits || [];
    extended.traits.push(name2);
  }, this));
  this.definePackage(type, pkg);
  this.typeMap[name2] = type;
};
Registry.prototype.mapTypes = function(nsName3, iterator, trait) {
  var type = isBuiltIn(nsName3.name) ? { name: nsName3.name } : this.typeMap[nsName3.name];
  var self = this;
  function traverse(cls, trait2) {
    var parentNs = parseName(cls, isBuiltIn(cls) ? "" : nsName3.prefix);
    self.mapTypes(parentNs, iterator, trait2);
  }
  function traverseTrait(cls) {
    return traverse(cls, true);
  }
  function traverseSuper(cls) {
    return traverse(cls, false);
  }
  if (!type) {
    throw new Error("unknown type <" + nsName3.name + ">");
  }
  forEach(type.superClass, trait ? traverseTrait : traverseSuper);
  iterator(type, !trait);
  forEach(type.traits, traverseTrait);
};
Registry.prototype.getEffectiveDescriptor = function(name2) {
  var nsName3 = parseName(name2);
  var builder = new DescriptorBuilder(nsName3);
  this.mapTypes(nsName3, function(type, inherited) {
    builder.addTrait(type, inherited);
  });
  var descriptor = builder.build();
  this.definePackage(descriptor, descriptor.allTypes[descriptor.allTypes.length - 1].$pkg);
  return descriptor;
};
Registry.prototype.definePackage = function(target, pkg) {
  this.properties.define(target, "$pkg", { value: pkg });
};
function ensureAvailable(packageMap, pkg, identifierKey) {
  var value = pkg[identifierKey];
  if (value in packageMap) {
    throw new Error("package with " + identifierKey + " <" + value + "> already defined");
  }
}
function Properties(model) {
  this.model = model;
}
Properties.prototype.set = function(target, name2, value) {
  if (!isString2(name2) || !name2.length) {
    throw new TypeError("property name must be a non-empty string");
  }
  var property = this.getProperty(target, name2);
  var propertyName = property && property.name;
  if (isUndefined2(value)) {
    if (property) {
      delete target[propertyName];
    } else {
      delete target.$attrs[stripGlobal(name2)];
    }
  } else {
    if (property) {
      if (propertyName in target) {
        target[propertyName] = value;
      } else {
        defineProperty(target, property, value);
      }
    } else {
      target.$attrs[stripGlobal(name2)] = value;
    }
  }
};
Properties.prototype.get = function(target, name2) {
  var property = this.getProperty(target, name2);
  if (!property) {
    return target.$attrs[stripGlobal(name2)];
  }
  var propertyName = property.name;
  if (!target[propertyName] && property.isMany) {
    defineProperty(target, property, []);
  }
  return target[propertyName];
};
Properties.prototype.define = function(target, name2, options) {
  if (!options.writable) {
    var value = options.value;
    options = assign2({}, options, {
      get: function() {
        return value;
      }
    });
    delete options.value;
  }
  Object.defineProperty(target, name2, options);
};
Properties.prototype.defineDescriptor = function(target, descriptor) {
  this.define(target, "$descriptor", { value: descriptor });
};
Properties.prototype.defineModel = function(target, model) {
  this.define(target, "$model", { value: model });
};
Properties.prototype.getProperty = function(target, name2) {
  var model = this.model;
  var property = model.getPropertyDescriptor(target, name2);
  if (property) {
    return property;
  }
  if (name2.includes(":")) {
    return null;
  }
  const strict = model.config.strict;
  if (typeof strict !== "undefined") {
    const error4 = new TypeError(`unknown property <${name2}> on <${target.$type}>`);
    if (strict) {
      throw error4;
    } else {
      typeof console !== "undefined" && console.warn(error4);
    }
  }
  return null;
};
function isUndefined2(val) {
  return typeof val === "undefined";
}
function defineProperty(target, property, value) {
  Object.defineProperty(target, property.name, {
    enumerable: !property.isReference,
    writable: true,
    value,
    configurable: true
  });
}
function stripGlobal(name2) {
  return name2.replace(/^:/, "");
}
function Moddle(packages3, config = {}) {
  this.properties = new Properties(this);
  this.factory = new Factory(this, this.properties);
  this.registry = new Registry(packages3, this.properties);
  this.typeCache = {};
  this.config = config;
}
Moddle.prototype.create = function(descriptor, attrs) {
  var Type = this.getType(descriptor);
  if (!Type) {
    throw new Error("unknown type <" + descriptor + ">");
  }
  return new Type(attrs);
};
Moddle.prototype.getType = function(descriptor) {
  var cache = this.typeCache;
  var name2 = isString2(descriptor) ? descriptor : descriptor.ns.name;
  var type = cache[name2];
  if (!type) {
    descriptor = this.registry.getEffectiveDescriptor(name2);
    type = cache[name2] = this.factory.createType(descriptor);
  }
  return type;
};
Moddle.prototype.createAny = function(name2, nsUri, properties) {
  var nameNs = parseName(name2);
  var element = {
    $type: name2,
    $instanceOf: function(type) {
      return type === this.$type;
    },
    get: function(key) {
      return this[key];
    },
    set: function(key, value) {
      set(this, [key], value);
    }
  };
  var descriptor = {
    name: name2,
    isGeneric: true,
    ns: {
      prefix: nameNs.prefix,
      localName: nameNs.localName,
      uri: nsUri
    }
  };
  this.properties.defineDescriptor(element, descriptor);
  this.properties.defineModel(element, this);
  this.properties.define(element, "get", { enumerable: false, writable: true });
  this.properties.define(element, "set", { enumerable: false, writable: true });
  this.properties.define(element, "$parent", { enumerable: false, writable: true });
  this.properties.define(element, "$instanceOf", { enumerable: false, writable: true });
  forEach(properties, function(a, key) {
    if (isObject(a) && a.value !== void 0) {
      element[a.name] = a.value;
    } else {
      element[key] = a;
    }
  });
  return element;
};
Moddle.prototype.getPackage = function(uriOrPrefix) {
  return this.registry.getPackage(uriOrPrefix);
};
Moddle.prototype.getPackages = function() {
  return this.registry.getPackages();
};
Moddle.prototype.getElementDescriptor = function(element) {
  return element.$descriptor;
};
Moddle.prototype.hasType = function(element, type) {
  if (type === void 0) {
    type = element;
    element = this;
  }
  var descriptor = element.$model.getElementDescriptor(element);
  return type in descriptor.allTypesByName;
};
Moddle.prototype.getPropertyDescriptor = function(element, property) {
  return this.getElementDescriptor(element).propertiesByName[property];
};
Moddle.prototype.getTypeDescriptor = function(type) {
  return this.registry.typeMap[type];
};

// node_modules/moddle-xml/node_modules/min-dash/dist/index.esm.js
var nativeToString3 = Object.prototype.toString;
var nativeHasOwnProperty2 = Object.prototype.hasOwnProperty;
function isUndefined3(obj) {
  return obj === void 0;
}
function isNil2(obj) {
  return obj == null;
}
function isArray2(obj) {
  return nativeToString3.call(obj) === "[object Array]";
}
function isFunction(obj) {
  const tag = nativeToString3.call(obj);
  return tag === "[object Function]" || tag === "[object AsyncFunction]" || tag === "[object GeneratorFunction]" || tag === "[object AsyncGeneratorFunction]" || tag === "[object Proxy]";
}
function isString3(obj) {
  return nativeToString3.call(obj) === "[object String]";
}
function has2(target, key) {
  return !isNil2(target) && nativeHasOwnProperty2.call(target, key);
}
function find(collection, matcher) {
  const matchFn = toMatcher(matcher);
  let match;
  forEach2(collection, function(val, key) {
    if (matchFn(val, key)) {
      match = val;
      return false;
    }
  });
  return match;
}
function findIndex(collection, matcher) {
  const matchFn = toMatcher(matcher);
  let idx = isArray2(collection) ? -1 : void 0;
  forEach2(collection, function(val, key) {
    if (matchFn(val, key)) {
      idx = key;
      return false;
    }
  });
  return idx;
}
function filter(collection, matcher) {
  const matchFn = toMatcher(matcher);
  let result = [];
  forEach2(collection, function(val, key) {
    if (matchFn(val, key)) {
      result.push(val);
    }
  });
  return result;
}
function forEach2(collection, iterator) {
  let val, result;
  if (isUndefined3(collection)) {
    return;
  }
  const convertKey = isArray2(collection) ? toNum2 : identity2;
  for (let key in collection) {
    if (has2(collection, key)) {
      val = collection[key];
      result = iterator(val, convertKey(key));
      if (result === false) {
        return val;
      }
    }
  }
}
function toMatcher(matcher) {
  return isFunction(matcher) ? matcher : (e) => {
    return e === matcher;
  };
}
function identity2(arg) {
  return arg;
}
function toNum2(arg) {
  return Number(arg);
}
function assign3(target, ...others) {
  return Object.assign(target, ...others);
}

// node_modules/saxen/dist/index.js
var fromCharCode = String.fromCharCode;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var ENTITY_PATTERN = /&#(\d+);|&#x([0-9a-f]+);|&(\w+);/ig;
var ENTITY_MAPPING = {
  "amp": "&",
  "apos": "'",
  "gt": ">",
  "lt": "<",
  "quot": '"'
};
Object.keys(ENTITY_MAPPING).forEach(function(k) {
  ENTITY_MAPPING[k.toUpperCase()] = ENTITY_MAPPING[k];
});
function replaceEntities(_, d, x, z) {
  if (z) {
    if (hasOwnProperty.call(ENTITY_MAPPING, z)) {
      return ENTITY_MAPPING[z];
    } else {
      return "&" + z + ";";
    }
  }
  if (d) {
    return fromCharCode(d);
  }
  return fromCharCode(parseInt(x, 16));
}
function decodeEntities(s) {
  if (s.length > 3 && s.indexOf("&") !== -1) {
    return s.replace(ENTITY_PATTERN, replaceEntities);
  }
  return s;
}
var NON_WHITESPACE_OUTSIDE_ROOT_NODE = "non-whitespace outside of root node";
function error(msg) {
  return new Error(msg);
}
function missingNamespaceForPrefix(prefix2) {
  return "missing namespace for prefix <" + prefix2 + ">";
}
function getter(getFn) {
  return {
    "get": getFn,
    "enumerable": true
  };
}
function cloneNsMatrix(nsMatrix) {
  var clone = {}, key;
  for (key in nsMatrix) {
    clone[key] = nsMatrix[key];
  }
  return clone;
}
function uriPrefix(prefix2) {
  return prefix2 + "$uri";
}
function buildNsMatrix(nsUriToPrefix) {
  var nsMatrix = {}, uri2, prefix2;
  for (uri2 in nsUriToPrefix) {
    prefix2 = nsUriToPrefix[uri2];
    nsMatrix[prefix2] = prefix2;
    nsMatrix[uriPrefix(prefix2)] = uri2;
  }
  return nsMatrix;
}
function noopGetContext() {
  return { line: 0, column: 0 };
}
function throwFunc(err) {
  throw err;
}
function Parser(options) {
  if (!this) {
    return new Parser(options);
  }
  var proxy = options && options["proxy"];
  var onText, onOpenTag, onCloseTag, onCDATA, onError = throwFunc, onWarning, onComment, onQuestion, onAttention;
  var getContext = noopGetContext;
  var maybeNS = false;
  var isNamespace = false;
  var returnError = null;
  var parseStop = false;
  var nsUriToPrefix;
  function handleError(err) {
    if (!(err instanceof Error)) {
      err = error(err);
    }
    returnError = err;
    onError(err, getContext);
  }
  function handleWarning(err) {
    if (!onWarning) {
      return;
    }
    if (!(err instanceof Error)) {
      err = error(err);
    }
    onWarning(err, getContext);
  }
  this["on"] = function(name2, cb) {
    if (typeof cb !== "function") {
      throw error("required args <name, cb>");
    }
    switch (name2) {
      case "openTag":
        onOpenTag = cb;
        break;
      case "text":
        onText = cb;
        break;
      case "closeTag":
        onCloseTag = cb;
        break;
      case "error":
        onError = cb;
        break;
      case "warn":
        onWarning = cb;
        break;
      case "cdata":
        onCDATA = cb;
        break;
      case "attention":
        onAttention = cb;
        break;
      // <!XXXXX zzzz="eeee">
      case "question":
        onQuestion = cb;
        break;
      // <? ....  ?>
      case "comment":
        onComment = cb;
        break;
      default:
        throw error("unsupported event: " + name2);
    }
    return this;
  };
  this["ns"] = function(nsMap) {
    if (typeof nsMap === "undefined") {
      nsMap = {};
    }
    if (typeof nsMap !== "object") {
      throw error("required args <nsMap={}>");
    }
    var _nsUriToPrefix = {}, k;
    for (k in nsMap) {
      _nsUriToPrefix[k] = nsMap[k];
    }
    isNamespace = true;
    nsUriToPrefix = _nsUriToPrefix;
    return this;
  };
  this["parse"] = function(xml2) {
    if (typeof xml2 !== "string") {
      throw error("required args <xml=string>");
    }
    returnError = null;
    parse(xml2);
    getContext = noopGetContext;
    parseStop = false;
    return returnError;
  };
  this["stop"] = function() {
    parseStop = true;
  };
  function parse(xml2) {
    var nsMatrixStack = isNamespace ? [] : null, nsMatrix = isNamespace ? buildNsMatrix(nsUriToPrefix) : null, _nsMatrix, nodeStack = [], anonymousNsCount = 0, tagStart = false, tagEnd = false, i = 0, j = 0, x, y, q, w, v, xmlns, elementName, _elementName, elementProxy;
    var attrsString = "", attrsStart = 0, cachedAttrs;
    function getAttrs() {
      if (cachedAttrs !== null) {
        return cachedAttrs;
      }
      var nsUri, nsUriPrefix, nsName3, defaultAlias = isNamespace && nsMatrix["xmlns"], attrList = isNamespace && maybeNS ? [] : null, i2 = attrsStart, s = attrsString, l = s.length, hasNewMatrix, newalias, value, alias, name2, attrs = {}, seenAttrs = {}, skipAttr, w2, j2;
      parseAttr:
        for (; i2 < l; i2++) {
          skipAttr = false;
          w2 = s.charCodeAt(i2);
          if (w2 === 32 || w2 < 14 && w2 > 8) {
            continue;
          }
          if (w2 < 65 || w2 > 122 || w2 > 90 && w2 < 97) {
            if (w2 !== 95 && w2 !== 58) {
              handleWarning("illegal first char attribute name");
              skipAttr = true;
            }
          }
          for (j2 = i2 + 1; j2 < l; j2++) {
            w2 = s.charCodeAt(j2);
            if (w2 > 96 && w2 < 123 || w2 > 64 && w2 < 91 || w2 > 47 && w2 < 59 || w2 === 46 || // '.'
            w2 === 45 || // '-'
            w2 === 95) {
              continue;
            }
            if (w2 === 32 || w2 < 14 && w2 > 8) {
              handleWarning("missing attribute value");
              i2 = j2;
              continue parseAttr;
            }
            if (w2 === 61) {
              break;
            }
            handleWarning("illegal attribute name char");
            skipAttr = true;
          }
          name2 = s.substring(i2, j2);
          if (name2 === "xmlns:xmlns") {
            handleWarning("illegal declaration of xmlns");
            skipAttr = true;
          }
          w2 = s.charCodeAt(j2 + 1);
          if (w2 === 34) {
            j2 = s.indexOf('"', i2 = j2 + 2);
            if (j2 === -1) {
              j2 = s.indexOf("'", i2);
              if (j2 !== -1) {
                handleWarning("attribute value quote missmatch");
                skipAttr = true;
              }
            }
          } else if (w2 === 39) {
            j2 = s.indexOf("'", i2 = j2 + 2);
            if (j2 === -1) {
              j2 = s.indexOf('"', i2);
              if (j2 !== -1) {
                handleWarning("attribute value quote missmatch");
                skipAttr = true;
              }
            }
          } else {
            handleWarning("missing attribute value quotes");
            skipAttr = true;
            for (j2 = j2 + 1; j2 < l; j2++) {
              w2 = s.charCodeAt(j2 + 1);
              if (w2 === 32 || w2 < 14 && w2 > 8) {
                break;
              }
            }
          }
          if (j2 === -1) {
            handleWarning("missing closing quotes");
            j2 = l;
            skipAttr = true;
          }
          if (!skipAttr) {
            value = s.substring(i2, j2);
          }
          i2 = j2;
          for (; j2 + 1 < l; j2++) {
            w2 = s.charCodeAt(j2 + 1);
            if (w2 === 32 || w2 < 14 && w2 > 8) {
              break;
            }
            if (i2 === j2) {
              handleWarning("illegal character after attribute end");
              skipAttr = true;
            }
          }
          i2 = j2 + 1;
          if (skipAttr) {
            continue parseAttr;
          }
          if (name2 in seenAttrs) {
            handleWarning("attribute <" + name2 + "> already defined");
            continue;
          }
          seenAttrs[name2] = true;
          if (!isNamespace) {
            attrs[name2] = value;
            continue;
          }
          if (maybeNS) {
            newalias = name2 === "xmlns" ? "xmlns" : name2.charCodeAt(0) === 120 && name2.substr(0, 6) === "xmlns:" ? name2.substr(6) : null;
            if (newalias !== null) {
              nsUri = decodeEntities(value);
              nsUriPrefix = uriPrefix(newalias);
              alias = nsUriToPrefix[nsUri];
              if (!alias) {
                if (newalias === "xmlns" || nsUriPrefix in nsMatrix && nsMatrix[nsUriPrefix] !== nsUri) {
                  do {
                    alias = "ns" + anonymousNsCount++;
                  } while (typeof nsMatrix[alias] !== "undefined");
                } else {
                  alias = newalias;
                }
                nsUriToPrefix[nsUri] = alias;
              }
              if (nsMatrix[newalias] !== alias) {
                if (!hasNewMatrix) {
                  nsMatrix = cloneNsMatrix(nsMatrix);
                  hasNewMatrix = true;
                }
                nsMatrix[newalias] = alias;
                if (newalias === "xmlns") {
                  nsMatrix[uriPrefix(alias)] = nsUri;
                  defaultAlias = alias;
                }
                nsMatrix[nsUriPrefix] = nsUri;
              }
              attrs[name2] = value;
              continue;
            }
            attrList.push(name2, value);
            continue;
          }
          w2 = name2.indexOf(":");
          if (w2 === -1) {
            attrs[name2] = value;
            continue;
          }
          if (!(nsName3 = nsMatrix[name2.substring(0, w2)])) {
            handleWarning(missingNamespaceForPrefix(name2.substring(0, w2)));
            continue;
          }
          name2 = defaultAlias === nsName3 ? name2.substr(w2 + 1) : nsName3 + name2.substr(w2);
          attrs[name2] = value;
        }
      if (maybeNS) {
        for (i2 = 0, l = attrList.length; i2 < l; i2++) {
          name2 = attrList[i2++];
          value = attrList[i2];
          w2 = name2.indexOf(":");
          if (w2 !== -1) {
            if (!(nsName3 = nsMatrix[name2.substring(0, w2)])) {
              handleWarning(missingNamespaceForPrefix(name2.substring(0, w2)));
              continue;
            }
            name2 = defaultAlias === nsName3 ? name2.substr(w2 + 1) : nsName3 + name2.substr(w2);
          }
          attrs[name2] = value;
        }
      }
      return cachedAttrs = attrs;
    }
    function getParseContext() {
      var splitsRe = /(\r\n|\r|\n)/g;
      var line = 0;
      var column = 0;
      var startOfLine = 0;
      var endOfLine = j;
      var match;
      var data;
      while (i >= startOfLine) {
        match = splitsRe.exec(xml2);
        if (!match) {
          break;
        }
        endOfLine = match[0].length + match.index;
        if (endOfLine > i) {
          break;
        }
        line += 1;
        startOfLine = endOfLine;
      }
      if (i == -1) {
        column = endOfLine;
        data = xml2.substring(j);
      } else if (j === 0) {
        data = xml2.substring(j, i);
      } else {
        column = i - startOfLine;
        data = j == -1 ? xml2.substring(i) : xml2.substring(i, j + 1);
      }
      return {
        "data": data,
        "line": line,
        "column": column
      };
    }
    getContext = getParseContext;
    if (proxy) {
      elementProxy = Object.create({}, {
        "name": getter(function() {
          return elementName;
        }),
        "originalName": getter(function() {
          return _elementName;
        }),
        "attrs": getter(getAttrs),
        "ns": getter(function() {
          return nsMatrix;
        })
      });
    }
    while (j !== -1) {
      if (xml2.charCodeAt(j) === 60) {
        i = j;
      } else {
        i = xml2.indexOf("<", j);
      }
      if (i === -1) {
        if (nodeStack.length) {
          return handleError("unexpected end of file");
        }
        if (j === 0) {
          return handleError("missing start tag");
        }
        if (j < xml2.length) {
          if (xml2.substring(j).trim()) {
            handleWarning(NON_WHITESPACE_OUTSIDE_ROOT_NODE);
          }
        }
        return;
      }
      if (j !== i) {
        if (nodeStack.length) {
          if (onText) {
            onText(xml2.substring(j, i), decodeEntities, getContext);
            if (parseStop) {
              return;
            }
          }
        } else {
          if (xml2.substring(j, i).trim()) {
            handleWarning(NON_WHITESPACE_OUTSIDE_ROOT_NODE);
            if (parseStop) {
              return;
            }
          }
        }
      }
      w = xml2.charCodeAt(i + 1);
      if (w === 33) {
        q = xml2.charCodeAt(i + 2);
        if (q === 91 && xml2.substr(i + 3, 6) === "CDATA[") {
          j = xml2.indexOf("]]>", i);
          if (j === -1) {
            return handleError("unclosed cdata");
          }
          if (onCDATA) {
            onCDATA(xml2.substring(i + 9, j), getContext);
            if (parseStop) {
              return;
            }
          }
          j += 3;
          continue;
        }
        if (q === 45 && xml2.charCodeAt(i + 3) === 45) {
          j = xml2.indexOf("-->", i);
          if (j === -1) {
            return handleError("unclosed comment");
          }
          if (onComment) {
            onComment(xml2.substring(i + 4, j), decodeEntities, getContext);
            if (parseStop) {
              return;
            }
          }
          j += 3;
          continue;
        }
      }
      if (w === 63) {
        j = xml2.indexOf("?>", i);
        if (j === -1) {
          return handleError("unclosed question");
        }
        if (onQuestion) {
          onQuestion(xml2.substring(i, j + 2), getContext);
          if (parseStop) {
            return;
          }
        }
        j += 2;
        continue;
      }
      for (x = i + 1; ; x++) {
        v = xml2.charCodeAt(x);
        if (isNaN(v)) {
          j = -1;
          return handleError("unclosed tag");
        }
        if (v === 34) {
          q = xml2.indexOf('"', x + 1);
          x = q !== -1 ? q : x;
        } else if (v === 39) {
          q = xml2.indexOf("'", x + 1);
          x = q !== -1 ? q : x;
        } else if (v === 62) {
          j = x;
          break;
        }
      }
      if (w === 33) {
        if (onAttention) {
          onAttention(xml2.substring(i, j + 1), decodeEntities, getContext);
          if (parseStop) {
            return;
          }
        }
        j += 1;
        continue;
      }
      cachedAttrs = {};
      if (w === 47) {
        tagStart = false;
        tagEnd = true;
        if (!nodeStack.length) {
          return handleError("missing open tag");
        }
        x = elementName = nodeStack.pop();
        q = i + 2 + x.length;
        if (xml2.substring(i + 2, q) !== x) {
          return handleError("closing tag mismatch");
        }
        for (; q < j; q++) {
          w = xml2.charCodeAt(q);
          if (w === 32 || w > 8 && w < 14) {
            continue;
          }
          return handleError("close tag");
        }
      } else {
        if (xml2.charCodeAt(j - 1) === 47) {
          x = elementName = xml2.substring(i + 1, j - 1);
          tagStart = true;
          tagEnd = true;
        } else {
          x = elementName = xml2.substring(i + 1, j);
          tagStart = true;
          tagEnd = false;
        }
        if (!(w > 96 && w < 123 || w > 64 && w < 91 || w === 95 || w === 58)) {
          return handleError("illegal first char nodeName");
        }
        for (q = 1, y = x.length; q < y; q++) {
          w = x.charCodeAt(q);
          if (w > 96 && w < 123 || w > 64 && w < 91 || w > 47 && w < 59 || w === 45 || w === 95 || w == 46) {
            continue;
          }
          if (w === 32 || w < 14 && w > 8) {
            elementName = x.substring(0, q);
            cachedAttrs = null;
            break;
          }
          return handleError("invalid nodeName");
        }
        if (!tagEnd) {
          nodeStack.push(elementName);
        }
      }
      if (isNamespace) {
        _nsMatrix = nsMatrix;
        if (tagStart) {
          if (!tagEnd) {
            nsMatrixStack.push(_nsMatrix);
          }
          if (cachedAttrs === null) {
            if (maybeNS = x.indexOf("xmlns", q) !== -1) {
              attrsStart = q;
              attrsString = x;
              getAttrs();
              maybeNS = false;
            }
          }
        }
        _elementName = elementName;
        w = elementName.indexOf(":");
        if (w !== -1) {
          xmlns = nsMatrix[elementName.substring(0, w)];
          if (!xmlns) {
            return handleError("missing namespace on <" + _elementName + ">");
          }
          elementName = elementName.substr(w + 1);
        } else {
          xmlns = nsMatrix["xmlns"];
        }
        if (xmlns) {
          elementName = xmlns + ":" + elementName;
        }
      }
      if (tagStart) {
        attrsStart = q;
        attrsString = x;
        if (onOpenTag) {
          if (proxy) {
            onOpenTag(elementProxy, decodeEntities, tagEnd, getContext);
          } else {
            onOpenTag(elementName, getAttrs, decodeEntities, tagEnd, getContext);
          }
          if (parseStop) {
            return;
          }
        }
      }
      if (tagEnd) {
        if (onCloseTag) {
          onCloseTag(proxy ? elementProxy : elementName, decodeEntities, tagStart, getContext);
          if (parseStop) {
            return;
          }
        }
        if (isNamespace) {
          if (!tagStart) {
            nsMatrix = nsMatrixStack.pop();
          } else {
            nsMatrix = _nsMatrix;
          }
        }
      }
      j += 1;
    }
  }
}

// node_modules/moddle-xml/dist/index.js
function hasLowerCaseAlias(pkg) {
  return pkg.xml && pkg.xml.tagAlias === "lowerCase";
}
var DEFAULT_NS_MAP = {
  "xsi": "http://www.w3.org/2001/XMLSchema-instance",
  "xml": "http://www.w3.org/XML/1998/namespace"
};
var SERIALIZE_PROPERTY = "property";
function getSerialization(element) {
  return element.xml && element.xml.serialize;
}
function getSerializationType(element) {
  const type = getSerialization(element);
  return type !== SERIALIZE_PROPERTY && (type || null);
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function aliasToName(aliasNs, pkg) {
  if (!hasLowerCaseAlias(pkg)) {
    return aliasNs.name;
  }
  return aliasNs.prefix + ":" + capitalize(aliasNs.localName);
}
function prefixedToName(nameNs, pkg) {
  var name2 = nameNs.name, localName = nameNs.localName;
  var typePrefix = pkg && pkg.xml && pkg.xml.typePrefix;
  if (typePrefix && localName.indexOf(typePrefix) === 0) {
    return nameNs.prefix + ":" + localName.slice(typePrefix.length);
  } else {
    return name2;
  }
}
function normalizeTypeName(name2, nsMap, model) {
  const nameNs = parseName(name2, nsMap.xmlns);
  const normalizedName = `${nsMap[nameNs.prefix] || nameNs.prefix}:${nameNs.localName}`;
  const normalizedNameNs = parseName(normalizedName);
  var pkg = model.getPackage(normalizedNameNs.prefix);
  return prefixedToName(normalizedNameNs, pkg);
}
function error2(message) {
  return new Error(message);
}
function getModdleDescriptor(element) {
  return element.$descriptor;
}
function Context(options) {
  assign3(this, options);
  this.elementsById = {};
  this.references = [];
  this.warnings = [];
  this.addReference = function(reference) {
    this.references.push(reference);
  };
  this.addElement = function(element) {
    if (!element) {
      throw error2("expected element");
    }
    var elementsById = this.elementsById;
    var descriptor = getModdleDescriptor(element);
    var idProperty = descriptor.idProperty, id;
    if (idProperty) {
      id = element.get(idProperty.name);
      if (id) {
        if (!/^([a-z][\w-.]*:)?[a-z_][\w-.]*$/i.test(id)) {
          throw new Error("illegal ID <" + id + ">");
        }
        if (elementsById[id]) {
          throw error2("duplicate ID <" + id + ">");
        }
        elementsById[id] = element;
      }
    }
  };
  this.addWarning = function(warning) {
    this.warnings.push(warning);
  };
}
function BaseHandler() {
}
BaseHandler.prototype.handleEnd = function() {
};
BaseHandler.prototype.handleText = function() {
};
BaseHandler.prototype.handleNode = function() {
};
function NoopHandler() {
}
NoopHandler.prototype = Object.create(BaseHandler.prototype);
NoopHandler.prototype.handleNode = function() {
  return this;
};
function BodyHandler() {
}
BodyHandler.prototype = Object.create(BaseHandler.prototype);
BodyHandler.prototype.handleText = function(text) {
  this.body = (this.body || "") + text;
};
function ReferenceHandler(property, context) {
  this.property = property;
  this.context = context;
}
ReferenceHandler.prototype = Object.create(BodyHandler.prototype);
ReferenceHandler.prototype.handleNode = function(node) {
  if (this.element) {
    throw error2("expected no sub nodes");
  } else {
    this.element = this.createReference(node);
  }
  return this;
};
ReferenceHandler.prototype.handleEnd = function() {
  this.element.id = this.body;
};
ReferenceHandler.prototype.createReference = function(node) {
  return {
    property: this.property.ns.name,
    id: ""
  };
};
function ValueHandler(propertyDesc, element) {
  this.element = element;
  this.propertyDesc = propertyDesc;
}
ValueHandler.prototype = Object.create(BodyHandler.prototype);
ValueHandler.prototype.handleEnd = function() {
  var value = this.body || "", element = this.element, propertyDesc = this.propertyDesc;
  value = coerceType(propertyDesc.type, value);
  if (propertyDesc.isMany) {
    element.get(propertyDesc.name).push(value);
  } else {
    element.set(propertyDesc.name, value);
  }
};
function BaseElementHandler() {
}
BaseElementHandler.prototype = Object.create(BodyHandler.prototype);
BaseElementHandler.prototype.handleNode = function(node) {
  var parser = this, element = this.element;
  if (!element) {
    element = this.element = this.createElement(node);
    this.context.addElement(element);
  } else {
    parser = this.handleChild(node);
  }
  return parser;
};
function ElementHandler(model, typeName, context) {
  this.model = model;
  this.type = model.getType(typeName);
  this.context = context;
}
ElementHandler.prototype = Object.create(BaseElementHandler.prototype);
ElementHandler.prototype.addReference = function(reference) {
  this.context.addReference(reference);
};
ElementHandler.prototype.handleText = function(text) {
  var element = this.element, descriptor = getModdleDescriptor(element), bodyProperty = descriptor.bodyProperty;
  if (!bodyProperty) {
    throw error2("unexpected body text <" + text + ">");
  }
  BodyHandler.prototype.handleText.call(this, text);
};
ElementHandler.prototype.handleEnd = function() {
  var value = this.body, element = this.element, descriptor = getModdleDescriptor(element), bodyProperty = descriptor.bodyProperty;
  if (bodyProperty && value !== void 0) {
    value = coerceType(bodyProperty.type, value);
    element.set(bodyProperty.name, value);
  }
};
ElementHandler.prototype.createElement = function(node) {
  var attributes = node.attributes, Type = this.type, descriptor = getModdleDescriptor(Type), context = this.context, instance = new Type({}), model = this.model, propNameNs;
  forEach2(attributes, function(value, name2) {
    var prop = descriptor.propertiesByName[name2], values;
    if (prop && prop.isReference) {
      if (!prop.isMany) {
        context.addReference({
          element: instance,
          property: prop.ns.name,
          id: value
        });
      } else {
        values = value.split(" ");
        forEach2(values, function(v) {
          context.addReference({
            element: instance,
            property: prop.ns.name,
            id: v
          });
        });
      }
    } else {
      if (prop) {
        value = coerceType(prop.type, value);
      } else if (name2 === "xmlns") {
        name2 = ":" + name2;
      } else {
        propNameNs = parseName(name2, descriptor.ns.prefix);
        if (model.getPackage(propNameNs.prefix)) {
          context.addWarning({
            message: "unknown attribute <" + name2 + ">",
            element: instance,
            property: name2,
            value
          });
        }
      }
      instance.set(name2, value);
    }
  });
  return instance;
};
ElementHandler.prototype.getPropertyForNode = function(node) {
  var name2 = node.name;
  var nameNs = parseName(name2);
  var type = this.type, model = this.model, descriptor = getModdleDescriptor(type);
  var propertyName = nameNs.name, property = descriptor.propertiesByName[propertyName];
  if (property && !property.isAttr) {
    const serializationType = getSerializationType(property);
    if (serializationType) {
      const elementTypeName = node.attributes[serializationType];
      if (elementTypeName) {
        const normalizedTypeName = normalizeTypeName(elementTypeName, node.ns, model);
        const elementType = model.getType(normalizedTypeName);
        return assign3({}, property, {
          effectiveType: getModdleDescriptor(elementType).name
        });
      }
    }
    return property;
  }
  var pkg = model.getPackage(nameNs.prefix);
  if (pkg) {
    const elementTypeName = aliasToName(nameNs, pkg);
    const elementType = model.getType(elementTypeName);
    property = find(descriptor.properties, function(p) {
      return !p.isVirtual && !p.isReference && !p.isAttribute && elementType.hasType(p.type);
    });
    if (property) {
      return assign3({}, property, {
        effectiveType: getModdleDescriptor(elementType).name
      });
    }
  } else {
    property = find(descriptor.properties, function(p) {
      return !p.isReference && !p.isAttribute && p.type === "Element";
    });
    if (property) {
      return property;
    }
  }
  throw error2("unrecognized element <" + nameNs.name + ">");
};
ElementHandler.prototype.toString = function() {
  return "ElementDescriptor[" + getModdleDescriptor(this.type).name + "]";
};
ElementHandler.prototype.valueHandler = function(propertyDesc, element) {
  return new ValueHandler(propertyDesc, element);
};
ElementHandler.prototype.referenceHandler = function(propertyDesc) {
  return new ReferenceHandler(propertyDesc, this.context);
};
ElementHandler.prototype.handler = function(type) {
  if (type === "Element") {
    return new GenericElementHandler(this.model, type, this.context);
  } else {
    return new ElementHandler(this.model, type, this.context);
  }
};
ElementHandler.prototype.handleChild = function(node) {
  var propertyDesc, type, element, childHandler;
  propertyDesc = this.getPropertyForNode(node);
  element = this.element;
  type = propertyDesc.effectiveType || propertyDesc.type;
  if (isSimple(type)) {
    return this.valueHandler(propertyDesc, element);
  }
  if (propertyDesc.isReference) {
    childHandler = this.referenceHandler(propertyDesc).handleNode(node);
  } else {
    childHandler = this.handler(type).handleNode(node);
  }
  var newElement = childHandler.element;
  if (newElement !== void 0) {
    if (propertyDesc.isMany) {
      element.get(propertyDesc.name).push(newElement);
    } else {
      element.set(propertyDesc.name, newElement);
    }
    if (propertyDesc.isReference) {
      assign3(newElement, {
        element
      });
      this.context.addReference(newElement);
    } else {
      newElement.$parent = element;
    }
  }
  return childHandler;
};
function RootElementHandler(model, typeName, context) {
  ElementHandler.call(this, model, typeName, context);
}
RootElementHandler.prototype = Object.create(ElementHandler.prototype);
RootElementHandler.prototype.createElement = function(node) {
  var name2 = node.name, nameNs = parseName(name2), model = this.model, type = this.type, pkg = model.getPackage(nameNs.prefix), typeName = pkg && aliasToName(nameNs, pkg) || name2;
  if (!type.hasType(typeName)) {
    throw error2("unexpected element <" + node.originalName + ">");
  }
  return ElementHandler.prototype.createElement.call(this, node);
};
function GenericElementHandler(model, typeName, context) {
  this.model = model;
  this.context = context;
}
GenericElementHandler.prototype = Object.create(BaseElementHandler.prototype);
GenericElementHandler.prototype.createElement = function(node) {
  var name2 = node.name, ns = parseName(name2), prefix2 = ns.prefix, uri2 = node.ns[prefix2 + "$uri"], attributes = node.attributes;
  return this.model.createAny(name2, uri2, attributes);
};
GenericElementHandler.prototype.handleChild = function(node) {
  var handler = new GenericElementHandler(this.model, "Element", this.context).handleNode(node), element = this.element;
  var newElement = handler.element, children;
  if (newElement !== void 0) {
    children = element.$children = element.$children || [];
    children.push(newElement);
    newElement.$parent = element;
  }
  return handler;
};
GenericElementHandler.prototype.handleEnd = function() {
  if (this.body) {
    this.element.$body = this.body;
  }
};
function Reader(options) {
  if (options instanceof Moddle) {
    options = {
      model: options
    };
  }
  assign3(this, { lax: false }, options);
}
Reader.prototype.fromXML = function(xml2, options, done) {
  var rootHandler = options.rootHandler;
  if (options instanceof ElementHandler) {
    rootHandler = options;
    options = {};
  } else {
    if (typeof options === "string") {
      rootHandler = this.handler(options);
      options = {};
    } else if (typeof rootHandler === "string") {
      rootHandler = this.handler(rootHandler);
    }
  }
  var model = this.model, lax = this.lax;
  var context = new Context(assign3({}, options, { rootHandler })), parser = new Parser({ proxy: true }), stack = createStack();
  rootHandler.context = context;
  stack.push(rootHandler);
  function handleError(err, getContext, lax2) {
    var ctx = getContext();
    var line = ctx.line, column = ctx.column, data = ctx.data;
    if (data.charAt(0) === "<" && data.indexOf(" ") !== -1) {
      data = data.slice(0, data.indexOf(" ")) + ">";
    }
    var message = "unparsable content " + (data ? data + " " : "") + "detected\n	line: " + line + "\n	column: " + column + "\n	nested error: " + err.message;
    if (lax2) {
      context.addWarning({
        message,
        error: err
      });
      return true;
    } else {
      throw error2(message);
    }
  }
  function handleWarning(err, getContext) {
    return handleError(err, getContext, true);
  }
  function resolveReferences() {
    var elementsById = context.elementsById;
    var references = context.references;
    var i, r;
    for (i = 0; r = references[i]; i++) {
      var element = r.element;
      var reference = elementsById[r.id];
      var property = getModdleDescriptor(element).propertiesByName[r.property];
      if (!reference) {
        context.addWarning({
          message: "unresolved reference <" + r.id + ">",
          element: r.element,
          property: r.property,
          value: r.id
        });
      }
      if (property.isMany) {
        var collection = element.get(property.name), idx = collection.indexOf(r);
        if (idx === -1) {
          idx = collection.length;
        }
        if (!reference) {
          collection.splice(idx, 1);
        } else {
          collection[idx] = reference;
        }
      } else {
        element.set(property.name, reference);
      }
    }
  }
  function handleClose() {
    stack.pop().handleEnd();
  }
  var PREAMBLE_START_PATTERN = /^<\?xml /i;
  var ENCODING_PATTERN = / encoding="([^"]+)"/i;
  var UTF_8_PATTERN = /^utf-8$/i;
  function handleQuestion(question) {
    if (!PREAMBLE_START_PATTERN.test(question)) {
      return;
    }
    var match = ENCODING_PATTERN.exec(question);
    var encoding = match && match[1];
    if (!encoding || UTF_8_PATTERN.test(encoding)) {
      return;
    }
    context.addWarning({
      message: "unsupported document encoding <" + encoding + ">, falling back to UTF-8"
    });
  }
  function handleOpen(node, getContext) {
    var handler = stack.peek();
    try {
      stack.push(handler.handleNode(node));
    } catch (err) {
      if (handleError(err, getContext, lax)) {
        stack.push(new NoopHandler());
      }
    }
  }
  function handleCData(text, getContext) {
    try {
      stack.peek().handleText(text);
    } catch (err) {
      handleWarning(err, getContext);
    }
  }
  function handleText(text, getContext) {
    if (!text.trim()) {
      return;
    }
    handleCData(text, getContext);
  }
  var uriMap = model.getPackages().reduce(function(uriMap2, p) {
    uriMap2[p.uri] = p.prefix;
    return uriMap2;
  }, Object.entries(DEFAULT_NS_MAP).reduce(function(map2, [prefix2, url]) {
    map2[url] = prefix2;
    return map2;
  }, model.config && model.config.nsMap || {}));
  parser.ns(uriMap).on("openTag", function(obj, decodeStr, selfClosing, getContext) {
    var attrs = obj.attrs || {};
    var decodedAttrs = Object.keys(attrs).reduce(function(d, key) {
      var value = decodeStr(attrs[key]);
      d[key] = value;
      return d;
    }, {});
    var node = {
      name: obj.name,
      originalName: obj.originalName,
      attributes: decodedAttrs,
      ns: obj.ns
    };
    handleOpen(node, getContext);
  }).on("question", handleQuestion).on("closeTag", handleClose).on("cdata", handleCData).on("text", function(text, decodeEntities2, getContext) {
    handleText(decodeEntities2(text), getContext);
  }).on("error", handleError).on("warn", handleWarning);
  return new Promise(function(resolve, reject) {
    var err;
    try {
      parser.parse(xml2);
      resolveReferences();
    } catch (e) {
      err = e;
    }
    var rootElement = rootHandler.element;
    if (!err && !rootElement) {
      err = error2("failed to parse document as <" + rootHandler.type.$descriptor.name + ">");
    }
    var warnings = context.warnings;
    var references = context.references;
    var elementsById = context.elementsById;
    if (err) {
      err.warnings = warnings;
      return reject(err);
    } else {
      return resolve({
        rootElement,
        elementsById,
        references,
        warnings
      });
    }
  });
};
Reader.prototype.handler = function(name2) {
  return new RootElementHandler(this.model, name2);
};
function createStack() {
  var stack = [];
  Object.defineProperty(stack, "peek", {
    value: function() {
      return this[this.length - 1];
    }
  });
  return stack;
}
var XML_PREAMBLE = '<?xml version="1.0" encoding="UTF-8"?>\n';
var ESCAPE_ATTR_CHARS = /<|>|'|"|&|\n\r|\n/g;
var ESCAPE_CHARS = /<|>|&/g;
function Namespaces(parent) {
  this.prefixMap = {};
  this.uriMap = {};
  this.used = {};
  this.wellknown = [];
  this.custom = [];
  this.parent = parent;
  this.defaultPrefixMap = parent && parent.defaultPrefixMap || {};
}
Namespaces.prototype.mapDefaultPrefixes = function(defaultPrefixMap) {
  this.defaultPrefixMap = defaultPrefixMap;
};
Namespaces.prototype.defaultUriByPrefix = function(prefix2) {
  return this.defaultPrefixMap[prefix2];
};
Namespaces.prototype.byUri = function(uri2) {
  return this.uriMap[uri2] || this.parent && this.parent.byUri(uri2);
};
Namespaces.prototype.add = function(ns, isWellknown) {
  this.uriMap[ns.uri] = ns;
  if (isWellknown) {
    this.wellknown.push(ns);
  } else {
    this.custom.push(ns);
  }
  this.mapPrefix(ns.prefix, ns.uri);
};
Namespaces.prototype.uriByPrefix = function(prefix2) {
  return this.prefixMap[prefix2 || "xmlns"] || this.parent && this.parent.uriByPrefix(prefix2);
};
Namespaces.prototype.mapPrefix = function(prefix2, uri2) {
  this.prefixMap[prefix2 || "xmlns"] = uri2;
};
Namespaces.prototype.getNSKey = function(ns) {
  return ns.prefix !== void 0 ? ns.uri + "|" + ns.prefix : ns.uri;
};
Namespaces.prototype.logUsed = function(ns) {
  var uri2 = ns.uri;
  var nsKey = this.getNSKey(ns);
  this.used[nsKey] = this.byUri(uri2);
  if (this.parent) {
    this.parent.logUsed(ns);
  }
};
Namespaces.prototype.getUsed = function(ns) {
  var allNs = [].concat(this.wellknown, this.custom);
  return allNs.filter((ns2) => {
    var nsKey = this.getNSKey(ns2);
    return this.used[nsKey];
  });
};
function lower(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}
function nameToAlias(name2, pkg) {
  if (hasLowerCaseAlias(pkg)) {
    return lower(name2);
  } else {
    return name2;
  }
}
function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}
function nsName(ns) {
  if (isString3(ns)) {
    return ns;
  } else {
    return (ns.prefix ? ns.prefix + ":" : "") + ns.localName;
  }
}
function getNsAttrs(namespaces) {
  return namespaces.getUsed().filter(function(ns) {
    return ns.prefix !== "xml";
  }).map(function(ns) {
    var name2 = "xmlns" + (ns.prefix ? ":" + ns.prefix : "");
    return { name: name2, value: ns.uri };
  });
}
function getElementNs(ns, descriptor) {
  if (descriptor.isGeneric) {
    return assign3({ localName: descriptor.ns.localName }, ns);
  } else {
    return assign3({ localName: nameToAlias(descriptor.ns.localName, descriptor.$pkg) }, ns);
  }
}
function getPropertyNs(ns, descriptor) {
  return assign3({ localName: descriptor.ns.localName }, ns);
}
function getSerializableProperties(element) {
  var descriptor = element.$descriptor;
  return filter(descriptor.properties, function(p) {
    var name2 = p.name;
    if (p.isVirtual) {
      return false;
    }
    if (!has2(element, name2)) {
      return false;
    }
    var value = element[name2];
    if (value === p.default) {
      return false;
    }
    if (value === null) {
      return false;
    }
    return p.isMany ? value.length : true;
  });
}
var ESCAPE_ATTR_MAP = {
  "\n": "#10",
  "\n\r": "#10",
  '"': "#34",
  "'": "#39",
  "<": "#60",
  ">": "#62",
  "&": "#38"
};
var ESCAPE_MAP = {
  "<": "lt",
  ">": "gt",
  "&": "amp"
};
function escape(str, charPattern, replaceMap) {
  str = isString3(str) ? str : "" + str;
  return str.replace(charPattern, function(s) {
    return "&" + replaceMap[s] + ";";
  });
}
function escapeAttr(str) {
  return escape(str, ESCAPE_ATTR_CHARS, ESCAPE_ATTR_MAP);
}
function escapeBody(str) {
  return escape(str, ESCAPE_CHARS, ESCAPE_MAP);
}
function filterAttributes(props) {
  return filter(props, function(p) {
    return p.isAttr;
  });
}
function filterContained(props) {
  return filter(props, function(p) {
    return !p.isAttr;
  });
}
function ReferenceSerializer(tagName) {
  this.tagName = tagName;
}
ReferenceSerializer.prototype.build = function(element) {
  this.element = element;
  return this;
};
ReferenceSerializer.prototype.serializeTo = function(writer) {
  writer.appendIndent().append("<" + this.tagName + ">" + this.element.id + "</" + this.tagName + ">").appendNewLine();
};
function BodySerializer() {
}
BodySerializer.prototype.serializeValue = BodySerializer.prototype.serializeTo = function(writer) {
  writer.append(
    this.escape ? escapeBody(this.value) : this.value
  );
};
BodySerializer.prototype.build = function(prop, value) {
  this.value = value;
  if (prop.type === "String" && value.search(ESCAPE_CHARS) !== -1) {
    this.escape = true;
  }
  return this;
};
function ValueSerializer(tagName) {
  this.tagName = tagName;
}
inherits(ValueSerializer, BodySerializer);
ValueSerializer.prototype.serializeTo = function(writer) {
  writer.appendIndent().append("<" + this.tagName + ">");
  this.serializeValue(writer);
  writer.append("</" + this.tagName + ">").appendNewLine();
};
function ElementSerializer(parent, propertyDescriptor) {
  this.body = [];
  this.attrs = [];
  this.parent = parent;
  this.propertyDescriptor = propertyDescriptor;
}
ElementSerializer.prototype.build = function(element) {
  this.element = element;
  var elementDescriptor = element.$descriptor, propertyDescriptor = this.propertyDescriptor;
  var otherAttrs, properties;
  var isGeneric = elementDescriptor.isGeneric;
  if (isGeneric) {
    otherAttrs = this.parseGenericNsAttributes(element);
  } else {
    otherAttrs = this.parseNsAttributes(element);
  }
  if (propertyDescriptor) {
    this.ns = this.nsPropertyTagName(propertyDescriptor);
  } else {
    this.ns = this.nsTagName(elementDescriptor);
  }
  this.tagName = this.addTagName(this.ns);
  if (isGeneric) {
    this.parseGenericContainments(element);
  } else {
    properties = getSerializableProperties(element);
    this.parseAttributes(filterAttributes(properties));
    this.parseContainments(filterContained(properties));
  }
  this.parseGenericAttributes(element, otherAttrs);
  return this;
};
ElementSerializer.prototype.nsTagName = function(descriptor) {
  var effectiveNs = this.logNamespaceUsed(descriptor.ns);
  return getElementNs(effectiveNs, descriptor);
};
ElementSerializer.prototype.nsPropertyTagName = function(descriptor) {
  var effectiveNs = this.logNamespaceUsed(descriptor.ns);
  return getPropertyNs(effectiveNs, descriptor);
};
ElementSerializer.prototype.isLocalNs = function(ns) {
  return ns.uri === this.ns.uri;
};
ElementSerializer.prototype.nsAttributeName = function(element) {
  var ns;
  if (isString3(element)) {
    ns = parseName(element);
  } else {
    ns = element.ns;
  }
  if (element.inherited) {
    return { localName: ns.localName };
  }
  var effectiveNs = this.logNamespaceUsed(ns);
  this.getNamespaces().logUsed(effectiveNs);
  if (this.isLocalNs(effectiveNs)) {
    return { localName: ns.localName };
  } else {
    return assign3({ localName: ns.localName }, effectiveNs);
  }
};
ElementSerializer.prototype.parseGenericNsAttributes = function(element) {
  return Object.entries(element).filter(
    ([key, value]) => !key.startsWith("$") && this.parseNsAttribute(element, key, value)
  ).map(
    ([key, value]) => ({ name: key, value })
  );
};
ElementSerializer.prototype.parseGenericContainments = function(element) {
  var body = element.$body;
  if (body) {
    this.body.push(new BodySerializer().build({ type: "String" }, body));
  }
  var children = element.$children;
  if (children) {
    forEach2(children, (child) => {
      this.body.push(new ElementSerializer(this).build(child));
    });
  }
};
ElementSerializer.prototype.parseNsAttribute = function(element, name2, value) {
  var model = element.$model;
  var nameNs = parseName(name2);
  var ns;
  if (nameNs.prefix === "xmlns") {
    ns = { prefix: nameNs.localName, uri: value };
  }
  if (!nameNs.prefix && nameNs.localName === "xmlns") {
    ns = { uri: value };
  }
  if (!ns) {
    return {
      name: name2,
      value
    };
  }
  if (model && model.getPackage(value)) {
    this.logNamespace(ns, true, true);
  } else {
    var actualNs = this.logNamespaceUsed(ns, true);
    this.getNamespaces().logUsed(actualNs);
  }
};
ElementSerializer.prototype.parseNsAttributes = function(element) {
  var self = this;
  var genericAttrs = element.$attrs;
  var attributes = [];
  forEach2(genericAttrs, function(value, name2) {
    var nonNsAttr = self.parseNsAttribute(element, name2, value);
    if (nonNsAttr) {
      attributes.push(nonNsAttr);
    }
  });
  return attributes;
};
ElementSerializer.prototype.parseGenericAttributes = function(element, attributes) {
  var self = this;
  forEach2(attributes, function(attr) {
    try {
      self.addAttribute(self.nsAttributeName(attr.name), attr.value);
    } catch (e) {
      typeof console !== "undefined" && console.warn(
        `missing namespace information for <${attr.name}=${attr.value}> on`,
        element,
        e
      );
    }
  });
};
ElementSerializer.prototype.parseContainments = function(properties) {
  var self = this, body = this.body, element = this.element;
  forEach2(properties, function(p) {
    var value = element.get(p.name), isReference = p.isReference, isMany = p.isMany;
    if (!isMany) {
      value = [value];
    }
    if (p.isBody) {
      body.push(new BodySerializer().build(p, value[0]));
    } else if (isSimple(p.type)) {
      forEach2(value, function(v) {
        body.push(new ValueSerializer(self.addTagName(self.nsPropertyTagName(p))).build(p, v));
      });
    } else if (isReference) {
      forEach2(value, function(v) {
        body.push(new ReferenceSerializer(self.addTagName(self.nsPropertyTagName(p))).build(v));
      });
    } else {
      var serialization = getSerialization(p);
      forEach2(value, function(v) {
        var serializer;
        if (serialization) {
          if (serialization === SERIALIZE_PROPERTY) {
            serializer = new ElementSerializer(self, p);
          } else {
            serializer = new TypeSerializer(self, p, serialization);
          }
        } else {
          serializer = new ElementSerializer(self);
        }
        body.push(serializer.build(v));
      });
    }
  });
};
ElementSerializer.prototype.getNamespaces = function(local) {
  var namespaces = this.namespaces, parent = this.parent, parentNamespaces;
  if (!namespaces) {
    parentNamespaces = parent && parent.getNamespaces();
    if (local || !parentNamespaces) {
      this.namespaces = namespaces = new Namespaces(parentNamespaces);
    } else {
      namespaces = parentNamespaces;
    }
  }
  return namespaces;
};
ElementSerializer.prototype.logNamespace = function(ns, wellknown, local) {
  var namespaces = this.getNamespaces(local);
  var nsUri = ns.uri, nsPrefix = ns.prefix;
  var existing = namespaces.byUri(nsUri);
  if (!existing || local) {
    namespaces.add(ns, wellknown);
  }
  namespaces.mapPrefix(nsPrefix, nsUri);
  return ns;
};
ElementSerializer.prototype.logNamespaceUsed = function(ns, local) {
  var namespaces = this.getNamespaces(local);
  var prefix2 = ns.prefix, uri2 = ns.uri, newPrefix, idx, wellknownUri;
  if (!prefix2 && !uri2) {
    return { localName: ns.localName };
  }
  wellknownUri = namespaces.defaultUriByPrefix(prefix2);
  uri2 = uri2 || wellknownUri || namespaces.uriByPrefix(prefix2);
  if (!uri2) {
    throw new Error("no namespace uri given for prefix <" + prefix2 + ">");
  }
  ns = namespaces.byUri(uri2);
  if (!ns && !prefix2) {
    ns = this.logNamespace({ uri: uri2 }, wellknownUri === uri2, true);
  }
  if (!ns) {
    newPrefix = prefix2;
    idx = 1;
    while (namespaces.uriByPrefix(newPrefix)) {
      newPrefix = prefix2 + "_" + idx++;
    }
    ns = this.logNamespace({ prefix: newPrefix, uri: uri2 }, wellknownUri === uri2);
  }
  if (prefix2) {
    namespaces.mapPrefix(prefix2, uri2);
  }
  return ns;
};
ElementSerializer.prototype.parseAttributes = function(properties) {
  var self = this, element = this.element;
  forEach2(properties, function(p) {
    var value = element.get(p.name);
    if (p.isReference) {
      if (!p.isMany) {
        value = value.id;
      } else {
        var values = [];
        forEach2(value, function(v) {
          values.push(v.id);
        });
        value = values.join(" ");
      }
    }
    self.addAttribute(self.nsAttributeName(p), value);
  });
};
ElementSerializer.prototype.addTagName = function(nsTagName) {
  var actualNs = this.logNamespaceUsed(nsTagName);
  this.getNamespaces().logUsed(actualNs);
  return nsName(nsTagName);
};
ElementSerializer.prototype.addAttribute = function(name2, value) {
  var attrs = this.attrs;
  if (isString3(value)) {
    value = escapeAttr(value);
  }
  var idx = findIndex(attrs, function(element) {
    return element.name.localName === name2.localName && element.name.uri === name2.uri && element.name.prefix === name2.prefix;
  });
  var attr = { name: name2, value };
  if (idx !== -1) {
    attrs.splice(idx, 1, attr);
  } else {
    attrs.push(attr);
  }
};
ElementSerializer.prototype.serializeAttributes = function(writer) {
  var attrs = this.attrs, namespaces = this.namespaces;
  if (namespaces) {
    attrs = getNsAttrs(namespaces).concat(attrs);
  }
  forEach2(attrs, function(a) {
    writer.append(" ").append(nsName(a.name)).append('="').append(a.value).append('"');
  });
};
ElementSerializer.prototype.serializeTo = function(writer) {
  var firstBody = this.body[0], indent = firstBody && firstBody.constructor !== BodySerializer;
  writer.appendIndent().append("<" + this.tagName);
  this.serializeAttributes(writer);
  writer.append(firstBody ? ">" : " />");
  if (firstBody) {
    if (indent) {
      writer.appendNewLine().indent();
    }
    forEach2(this.body, function(b) {
      b.serializeTo(writer);
    });
    if (indent) {
      writer.unindent().appendIndent();
    }
    writer.append("</" + this.tagName + ">");
  }
  writer.appendNewLine();
};
function TypeSerializer(parent, propertyDescriptor, serialization) {
  ElementSerializer.call(this, parent, propertyDescriptor);
  this.serialization = serialization;
}
inherits(TypeSerializer, ElementSerializer);
TypeSerializer.prototype.parseNsAttributes = function(element) {
  var attributes = ElementSerializer.prototype.parseNsAttributes.call(this, element).filter(
    (attr) => attr.name !== this.serialization
  );
  var descriptor = element.$descriptor;
  if (descriptor.name === this.propertyDescriptor.type) {
    return attributes;
  }
  var typeNs = this.typeNs = this.nsTagName(descriptor);
  this.getNamespaces().logUsed(this.typeNs);
  var pkg = element.$model.getPackage(typeNs.uri), typePrefix = pkg.xml && pkg.xml.typePrefix || "";
  this.addAttribute(
    this.nsAttributeName(this.serialization),
    (typeNs.prefix ? typeNs.prefix + ":" : "") + typePrefix + descriptor.ns.localName
  );
  return attributes;
};
TypeSerializer.prototype.isLocalNs = function(ns) {
  return ns.uri === (this.typeNs || this.ns).uri;
};
function SavingWriter() {
  this.value = "";
  this.write = function(str) {
    this.value += str;
  };
}
function FormatingWriter(out, format) {
  var indent = [""];
  this.append = function(str) {
    out.write(str);
    return this;
  };
  this.appendNewLine = function() {
    if (format) {
      out.write("\n");
    }
    return this;
  };
  this.appendIndent = function() {
    if (format) {
      out.write(indent.join("  "));
    }
    return this;
  };
  this.indent = function() {
    indent.push("");
    return this;
  };
  this.unindent = function() {
    indent.pop();
    return this;
  };
}
function Writer(options) {
  options = assign3({ format: false, preamble: true }, options || {});
  function toXML(tree, writer) {
    var internalWriter = writer || new SavingWriter();
    var formatingWriter = new FormatingWriter(internalWriter, options.format);
    if (options.preamble) {
      formatingWriter.append(XML_PREAMBLE);
    }
    var serializer = new ElementSerializer();
    var model = tree.$model;
    serializer.getNamespaces().mapDefaultPrefixes(getDefaultPrefixMappings(model));
    serializer.build(tree).serializeTo(formatingWriter);
    if (!writer) {
      return internalWriter.value;
    }
  }
  return {
    toXML
  };
}
function getDefaultPrefixMappings(model) {
  const nsMap = model.config && model.config.nsMap || {};
  const prefixMap = {};
  for (const prefix2 in DEFAULT_NS_MAP) {
    prefixMap[prefix2] = DEFAULT_NS_MAP[prefix2];
  }
  for (const uri2 in nsMap) {
    const prefix2 = nsMap[uri2];
    prefixMap[prefix2] = uri2;
  }
  for (const pkg of model.getPackages()) {
    prefixMap[pkg.prefix] = pkg.uri;
  }
  return prefixMap;
}

// node_modules/bpmn-moddle/dist/index.js
function BpmnModdle(packages3, options) {
  Moddle.call(this, packages3, options);
}
BpmnModdle.prototype = Object.create(Moddle.prototype);
BpmnModdle.prototype.fromXML = function(xmlStr, typeName, options) {
  if (!isString(typeName)) {
    options = typeName;
    typeName = "bpmn:Definitions";
  }
  var reader = new Reader(assign({ model: this, lax: true }, options));
  var rootHandler = reader.handler(typeName);
  return reader.fromXML(xmlStr, rootHandler);
};
BpmnModdle.prototype.toXML = function(element, options) {
  var writer = new Writer(options);
  return new Promise(function(resolve, reject) {
    try {
      var result = writer.toXML(element);
      return resolve({
        xml: result
      });
    } catch (err) {
      return reject(err);
    }
  });
};
var name$5 = "BPMN20";
var uri$5 = "http://www.omg.org/spec/BPMN/20100524/MODEL";
var prefix$5 = "bpmn";
var associations$5 = [];
var types$5 = [
  {
    name: "Interface",
    superClass: [
      "RootElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "operations",
        type: "Operation",
        isMany: true
      },
      {
        name: "implementationRef",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "Operation",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "inMessageRef",
        type: "Message",
        isReference: true
      },
      {
        name: "outMessageRef",
        type: "Message",
        isReference: true
      },
      {
        name: "errorRef",
        type: "Error",
        isMany: true,
        isReference: true
      },
      {
        name: "implementationRef",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "EndPoint",
    superClass: [
      "RootElement"
    ]
  },
  {
    name: "Auditing",
    superClass: [
      "BaseElement"
    ]
  },
  {
    name: "GlobalTask",
    superClass: [
      "CallableElement"
    ],
    properties: [
      {
        name: "resources",
        type: "ResourceRole",
        isMany: true
      }
    ]
  },
  {
    name: "Monitoring",
    superClass: [
      "BaseElement"
    ]
  },
  {
    name: "Performer",
    superClass: [
      "ResourceRole"
    ]
  },
  {
    name: "Process",
    superClass: [
      "FlowElementsContainer",
      "CallableElement"
    ],
    properties: [
      {
        name: "processType",
        type: "ProcessType",
        isAttr: true
      },
      {
        name: "isClosed",
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "auditing",
        type: "Auditing"
      },
      {
        name: "monitoring",
        type: "Monitoring"
      },
      {
        name: "properties",
        type: "Property",
        isMany: true
      },
      {
        name: "laneSets",
        isMany: true,
        replaces: "FlowElementsContainer#laneSets",
        type: "LaneSet"
      },
      {
        name: "flowElements",
        isMany: true,
        replaces: "FlowElementsContainer#flowElements",
        type: "FlowElement"
      },
      {
        name: "artifacts",
        type: "Artifact",
        isMany: true
      },
      {
        name: "resources",
        type: "ResourceRole",
        isMany: true
      },
      {
        name: "correlationSubscriptions",
        type: "CorrelationSubscription",
        isMany: true
      },
      {
        name: "supports",
        type: "Process",
        isMany: true,
        isReference: true
      },
      {
        name: "definitionalCollaborationRef",
        type: "Collaboration",
        isAttr: true,
        isReference: true
      },
      {
        name: "isExecutable",
        isAttr: true,
        type: "Boolean"
      }
    ]
  },
  {
    name: "LaneSet",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "lanes",
        type: "Lane",
        isMany: true
      },
      {
        name: "name",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "Lane",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "partitionElementRef",
        type: "BaseElement",
        isAttr: true,
        isReference: true
      },
      {
        name: "partitionElement",
        type: "BaseElement"
      },
      {
        name: "flowNodeRef",
        type: "FlowNode",
        isMany: true,
        isReference: true
      },
      {
        name: "childLaneSet",
        type: "LaneSet",
        xml: {
          serialize: "xsi:type"
        }
      }
    ]
  },
  {
    name: "GlobalManualTask",
    superClass: [
      "GlobalTask"
    ]
  },
  {
    name: "ManualTask",
    superClass: [
      "Task"
    ]
  },
  {
    name: "UserTask",
    superClass: [
      "Task"
    ],
    properties: [
      {
        name: "renderings",
        type: "Rendering",
        isMany: true
      },
      {
        name: "implementation",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "Rendering",
    superClass: [
      "BaseElement"
    ]
  },
  {
    name: "HumanPerformer",
    superClass: [
      "Performer"
    ]
  },
  {
    name: "PotentialOwner",
    superClass: [
      "HumanPerformer"
    ]
  },
  {
    name: "GlobalUserTask",
    superClass: [
      "GlobalTask"
    ],
    properties: [
      {
        name: "implementation",
        isAttr: true,
        type: "String"
      },
      {
        name: "renderings",
        type: "Rendering",
        isMany: true
      }
    ]
  },
  {
    name: "Gateway",
    isAbstract: true,
    superClass: [
      "FlowNode"
    ],
    properties: [
      {
        name: "gatewayDirection",
        type: "GatewayDirection",
        "default": "Unspecified",
        isAttr: true
      }
    ]
  },
  {
    name: "EventBasedGateway",
    superClass: [
      "Gateway"
    ],
    properties: [
      {
        name: "instantiate",
        "default": false,
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "eventGatewayType",
        type: "EventBasedGatewayType",
        isAttr: true,
        "default": "Exclusive"
      }
    ]
  },
  {
    name: "ComplexGateway",
    superClass: [
      "Gateway"
    ],
    properties: [
      {
        name: "activationCondition",
        type: "Expression",
        xml: {
          serialize: "xsi:type"
        }
      },
      {
        name: "default",
        type: "SequenceFlow",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "ExclusiveGateway",
    superClass: [
      "Gateway"
    ],
    properties: [
      {
        name: "default",
        type: "SequenceFlow",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "InclusiveGateway",
    superClass: [
      "Gateway"
    ],
    properties: [
      {
        name: "default",
        type: "SequenceFlow",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "ParallelGateway",
    superClass: [
      "Gateway"
    ]
  },
  {
    name: "RootElement",
    isAbstract: true,
    superClass: [
      "BaseElement"
    ]
  },
  {
    name: "Relationship",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "type",
        isAttr: true,
        type: "String"
      },
      {
        name: "direction",
        type: "RelationshipDirection",
        isAttr: true
      },
      {
        name: "source",
        isMany: true,
        isReference: true,
        type: "Element"
      },
      {
        name: "target",
        isMany: true,
        isReference: true,
        type: "Element"
      }
    ]
  },
  {
    name: "BaseElement",
    isAbstract: true,
    properties: [
      {
        name: "id",
        isAttr: true,
        type: "String",
        isId: true
      },
      {
        name: "documentation",
        type: "Documentation",
        isMany: true
      },
      {
        name: "extensionDefinitions",
        type: "ExtensionDefinition",
        isMany: true,
        isReference: true
      },
      {
        name: "extensionElements",
        type: "ExtensionElements"
      }
    ]
  },
  {
    name: "Extension",
    properties: [
      {
        name: "mustUnderstand",
        "default": false,
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "definition",
        type: "ExtensionDefinition",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "ExtensionDefinition",
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "extensionAttributeDefinitions",
        type: "ExtensionAttributeDefinition",
        isMany: true
      }
    ]
  },
  {
    name: "ExtensionAttributeDefinition",
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "type",
        isAttr: true,
        type: "String"
      },
      {
        name: "isReference",
        "default": false,
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "extensionDefinition",
        type: "ExtensionDefinition",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "ExtensionElements",
    properties: [
      {
        name: "valueRef",
        isAttr: true,
        isReference: true,
        type: "Element"
      },
      {
        name: "values",
        type: "Element",
        isMany: true
      },
      {
        name: "extensionAttributeDefinition",
        type: "ExtensionAttributeDefinition",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "Documentation",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "text",
        type: "String",
        isBody: true
      },
      {
        name: "textFormat",
        "default": "text/plain",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "Event",
    isAbstract: true,
    superClass: [
      "FlowNode",
      "InteractionNode"
    ],
    properties: [
      {
        name: "properties",
        type: "Property",
        isMany: true
      }
    ]
  },
  {
    name: "IntermediateCatchEvent",
    superClass: [
      "CatchEvent"
    ]
  },
  {
    name: "IntermediateThrowEvent",
    superClass: [
      "ThrowEvent"
    ]
  },
  {
    name: "EndEvent",
    superClass: [
      "ThrowEvent"
    ]
  },
  {
    name: "StartEvent",
    superClass: [
      "CatchEvent"
    ],
    properties: [
      {
        name: "isInterrupting",
        "default": true,
        isAttr: true,
        type: "Boolean"
      }
    ]
  },
  {
    name: "ThrowEvent",
    isAbstract: true,
    superClass: [
      "Event"
    ],
    properties: [
      {
        name: "dataInputs",
        type: "DataInput",
        isMany: true
      },
      {
        name: "dataInputAssociations",
        type: "DataInputAssociation",
        isMany: true
      },
      {
        name: "inputSet",
        type: "InputSet"
      },
      {
        name: "eventDefinitions",
        type: "EventDefinition",
        isMany: true
      },
      {
        name: "eventDefinitionRef",
        type: "EventDefinition",
        isMany: true,
        isReference: true
      }
    ]
  },
  {
    name: "CatchEvent",
    isAbstract: true,
    superClass: [
      "Event"
    ],
    properties: [
      {
        name: "parallelMultiple",
        isAttr: true,
        type: "Boolean",
        "default": false
      },
      {
        name: "dataOutputs",
        type: "DataOutput",
        isMany: true
      },
      {
        name: "dataOutputAssociations",
        type: "DataOutputAssociation",
        isMany: true
      },
      {
        name: "outputSet",
        type: "OutputSet"
      },
      {
        name: "eventDefinitions",
        type: "EventDefinition",
        isMany: true
      },
      {
        name: "eventDefinitionRef",
        type: "EventDefinition",
        isMany: true,
        isReference: true
      }
    ]
  },
  {
    name: "BoundaryEvent",
    superClass: [
      "CatchEvent"
    ],
    properties: [
      {
        name: "cancelActivity",
        "default": true,
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "attachedToRef",
        type: "Activity",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "EventDefinition",
    isAbstract: true,
    superClass: [
      "RootElement"
    ]
  },
  {
    name: "CancelEventDefinition",
    superClass: [
      "EventDefinition"
    ]
  },
  {
    name: "ErrorEventDefinition",
    superClass: [
      "EventDefinition"
    ],
    properties: [
      {
        name: "errorRef",
        type: "Error",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "TerminateEventDefinition",
    superClass: [
      "EventDefinition"
    ]
  },
  {
    name: "EscalationEventDefinition",
    superClass: [
      "EventDefinition"
    ],
    properties: [
      {
        name: "escalationRef",
        type: "Escalation",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "Escalation",
    properties: [
      {
        name: "structureRef",
        type: "ItemDefinition",
        isAttr: true,
        isReference: true
      },
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "escalationCode",
        isAttr: true,
        type: "String"
      }
    ],
    superClass: [
      "RootElement"
    ]
  },
  {
    name: "CompensateEventDefinition",
    superClass: [
      "EventDefinition"
    ],
    properties: [
      {
        name: "waitForCompletion",
        isAttr: true,
        type: "Boolean",
        "default": true
      },
      {
        name: "activityRef",
        type: "Activity",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "TimerEventDefinition",
    superClass: [
      "EventDefinition"
    ],
    properties: [
      {
        name: "timeDate",
        type: "Expression",
        xml: {
          serialize: "xsi:type"
        }
      },
      {
        name: "timeCycle",
        type: "Expression",
        xml: {
          serialize: "xsi:type"
        }
      },
      {
        name: "timeDuration",
        type: "Expression",
        xml: {
          serialize: "xsi:type"
        }
      }
    ]
  },
  {
    name: "LinkEventDefinition",
    superClass: [
      "EventDefinition"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "target",
        type: "LinkEventDefinition",
        isReference: true
      },
      {
        name: "source",
        type: "LinkEventDefinition",
        isMany: true,
        isReference: true
      }
    ]
  },
  {
    name: "MessageEventDefinition",
    superClass: [
      "EventDefinition"
    ],
    properties: [
      {
        name: "messageRef",
        type: "Message",
        isAttr: true,
        isReference: true
      },
      {
        name: "operationRef",
        type: "Operation",
        isReference: true
      }
    ]
  },
  {
    name: "ConditionalEventDefinition",
    superClass: [
      "EventDefinition"
    ],
    properties: [
      {
        name: "condition",
        type: "Expression",
        xml: {
          serialize: "xsi:type"
        }
      }
    ]
  },
  {
    name: "SignalEventDefinition",
    superClass: [
      "EventDefinition"
    ],
    properties: [
      {
        name: "signalRef",
        type: "Signal",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "Signal",
    superClass: [
      "RootElement"
    ],
    properties: [
      {
        name: "structureRef",
        type: "ItemDefinition",
        isAttr: true,
        isReference: true
      },
      {
        name: "name",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "ImplicitThrowEvent",
    superClass: [
      "ThrowEvent"
    ]
  },
  {
    name: "DataState",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "ItemAwareElement",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "itemSubjectRef",
        type: "ItemDefinition",
        isAttr: true,
        isReference: true
      },
      {
        name: "dataState",
        type: "DataState"
      }
    ]
  },
  {
    name: "DataAssociation",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "sourceRef",
        type: "ItemAwareElement",
        isMany: true,
        isReference: true
      },
      {
        name: "targetRef",
        type: "ItemAwareElement",
        isReference: true
      },
      {
        name: "transformation",
        type: "FormalExpression",
        xml: {
          serialize: "property"
        }
      },
      {
        name: "assignment",
        type: "Assignment",
        isMany: true
      }
    ]
  },
  {
    name: "DataInput",
    superClass: [
      "ItemAwareElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "isCollection",
        "default": false,
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "inputSetRef",
        type: "InputSet",
        isMany: true,
        isVirtual: true,
        isReference: true
      },
      {
        name: "inputSetWithOptional",
        type: "InputSet",
        isMany: true,
        isVirtual: true,
        isReference: true
      },
      {
        name: "inputSetWithWhileExecuting",
        type: "InputSet",
        isMany: true,
        isVirtual: true,
        isReference: true
      }
    ]
  },
  {
    name: "DataOutput",
    superClass: [
      "ItemAwareElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "isCollection",
        "default": false,
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "outputSetRef",
        type: "OutputSet",
        isMany: true,
        isVirtual: true,
        isReference: true
      },
      {
        name: "outputSetWithOptional",
        type: "OutputSet",
        isMany: true,
        isVirtual: true,
        isReference: true
      },
      {
        name: "outputSetWithWhileExecuting",
        type: "OutputSet",
        isMany: true,
        isVirtual: true,
        isReference: true
      }
    ]
  },
  {
    name: "InputSet",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "dataInputRefs",
        type: "DataInput",
        isMany: true,
        isReference: true
      },
      {
        name: "optionalInputRefs",
        type: "DataInput",
        isMany: true,
        isReference: true
      },
      {
        name: "whileExecutingInputRefs",
        type: "DataInput",
        isMany: true,
        isReference: true
      },
      {
        name: "outputSetRefs",
        type: "OutputSet",
        isMany: true,
        isReference: true
      }
    ]
  },
  {
    name: "OutputSet",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "dataOutputRefs",
        type: "DataOutput",
        isMany: true,
        isReference: true
      },
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "inputSetRefs",
        type: "InputSet",
        isMany: true,
        isReference: true
      },
      {
        name: "optionalOutputRefs",
        type: "DataOutput",
        isMany: true,
        isReference: true
      },
      {
        name: "whileExecutingOutputRefs",
        type: "DataOutput",
        isMany: true,
        isReference: true
      }
    ]
  },
  {
    name: "Property",
    superClass: [
      "ItemAwareElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "DataInputAssociation",
    superClass: [
      "DataAssociation"
    ]
  },
  {
    name: "DataOutputAssociation",
    superClass: [
      "DataAssociation"
    ]
  },
  {
    name: "InputOutputSpecification",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "dataInputs",
        type: "DataInput",
        isMany: true
      },
      {
        name: "dataOutputs",
        type: "DataOutput",
        isMany: true
      },
      {
        name: "inputSets",
        type: "InputSet",
        isMany: true
      },
      {
        name: "outputSets",
        type: "OutputSet",
        isMany: true
      }
    ]
  },
  {
    name: "DataObject",
    superClass: [
      "FlowElement",
      "ItemAwareElement"
    ],
    properties: [
      {
        name: "isCollection",
        "default": false,
        isAttr: true,
        type: "Boolean"
      }
    ]
  },
  {
    name: "InputOutputBinding",
    properties: [
      {
        name: "inputDataRef",
        type: "InputSet",
        isAttr: true,
        isReference: true
      },
      {
        name: "outputDataRef",
        type: "OutputSet",
        isAttr: true,
        isReference: true
      },
      {
        name: "operationRef",
        type: "Operation",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "Assignment",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "from",
        type: "Expression",
        xml: {
          serialize: "xsi:type"
        }
      },
      {
        name: "to",
        type: "Expression",
        xml: {
          serialize: "xsi:type"
        }
      }
    ]
  },
  {
    name: "DataStore",
    superClass: [
      "RootElement",
      "ItemAwareElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "capacity",
        isAttr: true,
        type: "Integer"
      },
      {
        name: "isUnlimited",
        "default": true,
        isAttr: true,
        type: "Boolean"
      }
    ]
  },
  {
    name: "DataStoreReference",
    superClass: [
      "ItemAwareElement",
      "FlowElement"
    ],
    properties: [
      {
        name: "dataStoreRef",
        type: "DataStore",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "DataObjectReference",
    superClass: [
      "ItemAwareElement",
      "FlowElement"
    ],
    properties: [
      {
        name: "dataObjectRef",
        type: "DataObject",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "ConversationLink",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "sourceRef",
        type: "InteractionNode",
        isAttr: true,
        isReference: true
      },
      {
        name: "targetRef",
        type: "InteractionNode",
        isAttr: true,
        isReference: true
      },
      {
        name: "name",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "ConversationAssociation",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "innerConversationNodeRef",
        type: "ConversationNode",
        isAttr: true,
        isReference: true
      },
      {
        name: "outerConversationNodeRef",
        type: "ConversationNode",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "CallConversation",
    superClass: [
      "ConversationNode"
    ],
    properties: [
      {
        name: "calledCollaborationRef",
        type: "Collaboration",
        isAttr: true,
        isReference: true
      },
      {
        name: "participantAssociations",
        type: "ParticipantAssociation",
        isMany: true
      }
    ]
  },
  {
    name: "Conversation",
    superClass: [
      "ConversationNode"
    ]
  },
  {
    name: "SubConversation",
    superClass: [
      "ConversationNode"
    ],
    properties: [
      {
        name: "conversationNodes",
        type: "ConversationNode",
        isMany: true
      }
    ]
  },
  {
    name: "ConversationNode",
    isAbstract: true,
    superClass: [
      "InteractionNode",
      "BaseElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "participantRef",
        type: "Participant",
        isMany: true,
        isReference: true
      },
      {
        name: "messageFlowRefs",
        type: "MessageFlow",
        isMany: true,
        isReference: true
      },
      {
        name: "correlationKeys",
        type: "CorrelationKey",
        isMany: true
      }
    ]
  },
  {
    name: "GlobalConversation",
    superClass: [
      "Collaboration"
    ]
  },
  {
    name: "PartnerEntity",
    superClass: [
      "RootElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "participantRef",
        type: "Participant",
        isMany: true,
        isReference: true
      }
    ]
  },
  {
    name: "PartnerRole",
    superClass: [
      "RootElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "participantRef",
        type: "Participant",
        isMany: true,
        isReference: true
      }
    ]
  },
  {
    name: "CorrelationProperty",
    superClass: [
      "RootElement"
    ],
    properties: [
      {
        name: "correlationPropertyRetrievalExpression",
        type: "CorrelationPropertyRetrievalExpression",
        isMany: true
      },
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "type",
        type: "ItemDefinition",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "Error",
    superClass: [
      "RootElement"
    ],
    properties: [
      {
        name: "structureRef",
        type: "ItemDefinition",
        isAttr: true,
        isReference: true
      },
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "errorCode",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "CorrelationKey",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "correlationPropertyRef",
        type: "CorrelationProperty",
        isMany: true,
        isReference: true
      },
      {
        name: "name",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "Expression",
    superClass: [
      "BaseElement"
    ],
    isAbstract: false,
    properties: [
      {
        name: "body",
        isBody: true,
        type: "String"
      }
    ]
  },
  {
    name: "FormalExpression",
    superClass: [
      "Expression"
    ],
    properties: [
      {
        name: "language",
        isAttr: true,
        type: "String"
      },
      {
        name: "evaluatesToTypeRef",
        type: "ItemDefinition",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "Message",
    superClass: [
      "RootElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "itemRef",
        type: "ItemDefinition",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "ItemDefinition",
    superClass: [
      "RootElement"
    ],
    properties: [
      {
        name: "itemKind",
        type: "ItemKind",
        isAttr: true
      },
      {
        name: "structureRef",
        isAttr: true,
        type: "String"
      },
      {
        name: "isCollection",
        "default": false,
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "import",
        type: "Import",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "FlowElement",
    isAbstract: true,
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "auditing",
        type: "Auditing"
      },
      {
        name: "monitoring",
        type: "Monitoring"
      },
      {
        name: "categoryValueRef",
        type: "CategoryValue",
        isMany: true,
        isReference: true
      }
    ]
  },
  {
    name: "SequenceFlow",
    superClass: [
      "FlowElement"
    ],
    properties: [
      {
        name: "isImmediate",
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "conditionExpression",
        type: "Expression",
        xml: {
          serialize: "xsi:type"
        }
      },
      {
        name: "sourceRef",
        type: "FlowNode",
        isAttr: true,
        isReference: true
      },
      {
        name: "targetRef",
        type: "FlowNode",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "FlowElementsContainer",
    isAbstract: true,
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "laneSets",
        type: "LaneSet",
        isMany: true
      },
      {
        name: "flowElements",
        type: "FlowElement",
        isMany: true
      }
    ]
  },
  {
    name: "CallableElement",
    isAbstract: true,
    superClass: [
      "RootElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "ioSpecification",
        type: "InputOutputSpecification",
        xml: {
          serialize: "property"
        }
      },
      {
        name: "supportedInterfaceRef",
        type: "Interface",
        isMany: true,
        isReference: true
      },
      {
        name: "ioBinding",
        type: "InputOutputBinding",
        isMany: true,
        xml: {
          serialize: "property"
        }
      }
    ]
  },
  {
    name: "FlowNode",
    isAbstract: true,
    superClass: [
      "FlowElement"
    ],
    properties: [
      {
        name: "incoming",
        type: "SequenceFlow",
        isMany: true,
        isReference: true
      },
      {
        name: "outgoing",
        type: "SequenceFlow",
        isMany: true,
        isReference: true
      },
      {
        name: "lanes",
        type: "Lane",
        isMany: true,
        isVirtual: true,
        isReference: true
      }
    ]
  },
  {
    name: "CorrelationPropertyRetrievalExpression",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "messagePath",
        type: "FormalExpression"
      },
      {
        name: "messageRef",
        type: "Message",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "CorrelationPropertyBinding",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "dataPath",
        type: "FormalExpression"
      },
      {
        name: "correlationPropertyRef",
        type: "CorrelationProperty",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "Resource",
    superClass: [
      "RootElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "resourceParameters",
        type: "ResourceParameter",
        isMany: true
      }
    ]
  },
  {
    name: "ResourceParameter",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "isRequired",
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "type",
        type: "ItemDefinition",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "CorrelationSubscription",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "correlationKeyRef",
        type: "CorrelationKey",
        isAttr: true,
        isReference: true
      },
      {
        name: "correlationPropertyBinding",
        type: "CorrelationPropertyBinding",
        isMany: true
      }
    ]
  },
  {
    name: "MessageFlow",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "sourceRef",
        type: "InteractionNode",
        isAttr: true,
        isReference: true
      },
      {
        name: "targetRef",
        type: "InteractionNode",
        isAttr: true,
        isReference: true
      },
      {
        name: "messageRef",
        type: "Message",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "MessageFlowAssociation",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "innerMessageFlowRef",
        type: "MessageFlow",
        isAttr: true,
        isReference: true
      },
      {
        name: "outerMessageFlowRef",
        type: "MessageFlow",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "InteractionNode",
    isAbstract: true,
    properties: [
      {
        name: "incomingConversationLinks",
        type: "ConversationLink",
        isMany: true,
        isVirtual: true,
        isReference: true
      },
      {
        name: "outgoingConversationLinks",
        type: "ConversationLink",
        isMany: true,
        isVirtual: true,
        isReference: true
      }
    ]
  },
  {
    name: "Participant",
    superClass: [
      "InteractionNode",
      "BaseElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "interfaceRef",
        type: "Interface",
        isMany: true,
        isReference: true
      },
      {
        name: "participantMultiplicity",
        type: "ParticipantMultiplicity"
      },
      {
        name: "endPointRefs",
        type: "EndPoint",
        isMany: true,
        isReference: true
      },
      {
        name: "processRef",
        type: "Process",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "ParticipantAssociation",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "innerParticipantRef",
        type: "Participant",
        isAttr: true,
        isReference: true
      },
      {
        name: "outerParticipantRef",
        type: "Participant",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "ParticipantMultiplicity",
    properties: [
      {
        name: "minimum",
        "default": 0,
        isAttr: true,
        type: "Integer"
      },
      {
        name: "maximum",
        "default": 1,
        isAttr: true,
        type: "Integer"
      }
    ],
    superClass: [
      "BaseElement"
    ]
  },
  {
    name: "Collaboration",
    superClass: [
      "RootElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "isClosed",
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "participants",
        type: "Participant",
        isMany: true
      },
      {
        name: "messageFlows",
        type: "MessageFlow",
        isMany: true
      },
      {
        name: "artifacts",
        type: "Artifact",
        isMany: true
      },
      {
        name: "conversations",
        type: "ConversationNode",
        isMany: true
      },
      {
        name: "conversationAssociations",
        type: "ConversationAssociation"
      },
      {
        name: "participantAssociations",
        type: "ParticipantAssociation",
        isMany: true
      },
      {
        name: "messageFlowAssociations",
        type: "MessageFlowAssociation",
        isMany: true
      },
      {
        name: "correlationKeys",
        type: "CorrelationKey",
        isMany: true
      },
      {
        name: "choreographyRef",
        type: "Choreography",
        isMany: true,
        isReference: true
      },
      {
        name: "conversationLinks",
        type: "ConversationLink",
        isMany: true
      }
    ]
  },
  {
    name: "ChoreographyActivity",
    isAbstract: true,
    superClass: [
      "FlowNode"
    ],
    properties: [
      {
        name: "participantRef",
        type: "Participant",
        isMany: true,
        isReference: true
      },
      {
        name: "initiatingParticipantRef",
        type: "Participant",
        isAttr: true,
        isReference: true
      },
      {
        name: "correlationKeys",
        type: "CorrelationKey",
        isMany: true
      },
      {
        name: "loopType",
        type: "ChoreographyLoopType",
        "default": "None",
        isAttr: true
      }
    ]
  },
  {
    name: "CallChoreography",
    superClass: [
      "ChoreographyActivity"
    ],
    properties: [
      {
        name: "calledChoreographyRef",
        type: "Choreography",
        isAttr: true,
        isReference: true
      },
      {
        name: "participantAssociations",
        type: "ParticipantAssociation",
        isMany: true
      }
    ]
  },
  {
    name: "SubChoreography",
    superClass: [
      "ChoreographyActivity",
      "FlowElementsContainer"
    ],
    properties: [
      {
        name: "artifacts",
        type: "Artifact",
        isMany: true
      }
    ]
  },
  {
    name: "ChoreographyTask",
    superClass: [
      "ChoreographyActivity"
    ],
    properties: [
      {
        name: "messageFlowRef",
        type: "MessageFlow",
        isMany: true,
        isReference: true
      }
    ]
  },
  {
    name: "Choreography",
    superClass: [
      "Collaboration",
      "FlowElementsContainer"
    ]
  },
  {
    name: "GlobalChoreographyTask",
    superClass: [
      "Choreography"
    ],
    properties: [
      {
        name: "initiatingParticipantRef",
        type: "Participant",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "TextAnnotation",
    superClass: [
      "Artifact"
    ],
    properties: [
      {
        name: "text",
        type: "String"
      },
      {
        name: "textFormat",
        "default": "text/plain",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "Group",
    superClass: [
      "Artifact"
    ],
    properties: [
      {
        name: "categoryValueRef",
        type: "CategoryValue",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "Association",
    superClass: [
      "Artifact"
    ],
    properties: [
      {
        name: "associationDirection",
        type: "AssociationDirection",
        isAttr: true
      },
      {
        name: "sourceRef",
        type: "BaseElement",
        isAttr: true,
        isReference: true
      },
      {
        name: "targetRef",
        type: "BaseElement",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "Category",
    superClass: [
      "RootElement"
    ],
    properties: [
      {
        name: "categoryValue",
        type: "CategoryValue",
        isMany: true
      },
      {
        name: "name",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "Artifact",
    isAbstract: true,
    superClass: [
      "BaseElement"
    ]
  },
  {
    name: "CategoryValue",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "categorizedFlowElements",
        type: "FlowElement",
        isMany: true,
        isVirtual: true,
        isReference: true
      },
      {
        name: "value",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "Activity",
    isAbstract: true,
    superClass: [
      "FlowNode"
    ],
    properties: [
      {
        name: "isForCompensation",
        "default": false,
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "default",
        type: "SequenceFlow",
        isAttr: true,
        isReference: true
      },
      {
        name: "ioSpecification",
        type: "InputOutputSpecification",
        xml: {
          serialize: "property"
        }
      },
      {
        name: "boundaryEventRefs",
        type: "BoundaryEvent",
        isMany: true,
        isReference: true
      },
      {
        name: "properties",
        type: "Property",
        isMany: true
      },
      {
        name: "dataInputAssociations",
        type: "DataInputAssociation",
        isMany: true
      },
      {
        name: "dataOutputAssociations",
        type: "DataOutputAssociation",
        isMany: true
      },
      {
        name: "startQuantity",
        "default": 1,
        isAttr: true,
        type: "Integer"
      },
      {
        name: "resources",
        type: "ResourceRole",
        isMany: true
      },
      {
        name: "completionQuantity",
        "default": 1,
        isAttr: true,
        type: "Integer"
      },
      {
        name: "loopCharacteristics",
        type: "LoopCharacteristics"
      }
    ]
  },
  {
    name: "ServiceTask",
    superClass: [
      "Task"
    ],
    properties: [
      {
        name: "implementation",
        isAttr: true,
        type: "String"
      },
      {
        name: "operationRef",
        type: "Operation",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "SubProcess",
    superClass: [
      "Activity",
      "FlowElementsContainer",
      "InteractionNode"
    ],
    properties: [
      {
        name: "triggeredByEvent",
        "default": false,
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "artifacts",
        type: "Artifact",
        isMany: true
      }
    ]
  },
  {
    name: "LoopCharacteristics",
    isAbstract: true,
    superClass: [
      "BaseElement"
    ]
  },
  {
    name: "MultiInstanceLoopCharacteristics",
    superClass: [
      "LoopCharacteristics"
    ],
    properties: [
      {
        name: "isSequential",
        "default": false,
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "behavior",
        type: "MultiInstanceBehavior",
        "default": "All",
        isAttr: true
      },
      {
        name: "loopCardinality",
        type: "Expression",
        xml: {
          serialize: "xsi:type"
        }
      },
      {
        name: "loopDataInputRef",
        type: "ItemAwareElement",
        isReference: true
      },
      {
        name: "loopDataOutputRef",
        type: "ItemAwareElement",
        isReference: true
      },
      {
        name: "inputDataItem",
        type: "DataInput",
        xml: {
          serialize: "property"
        }
      },
      {
        name: "outputDataItem",
        type: "DataOutput",
        xml: {
          serialize: "property"
        }
      },
      {
        name: "complexBehaviorDefinition",
        type: "ComplexBehaviorDefinition",
        isMany: true
      },
      {
        name: "completionCondition",
        type: "Expression",
        xml: {
          serialize: "xsi:type"
        }
      },
      {
        name: "oneBehaviorEventRef",
        type: "EventDefinition",
        isAttr: true,
        isReference: true
      },
      {
        name: "noneBehaviorEventRef",
        type: "EventDefinition",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "StandardLoopCharacteristics",
    superClass: [
      "LoopCharacteristics"
    ],
    properties: [
      {
        name: "testBefore",
        "default": false,
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "loopCondition",
        type: "Expression",
        xml: {
          serialize: "xsi:type"
        }
      },
      {
        name: "loopMaximum",
        type: "Integer",
        isAttr: true
      }
    ]
  },
  {
    name: "CallActivity",
    superClass: [
      "Activity",
      "InteractionNode"
    ],
    properties: [
      {
        name: "calledElement",
        type: "String",
        isAttr: true
      }
    ]
  },
  {
    name: "Task",
    superClass: [
      "Activity",
      "InteractionNode"
    ]
  },
  {
    name: "SendTask",
    superClass: [
      "Task"
    ],
    properties: [
      {
        name: "implementation",
        isAttr: true,
        type: "String"
      },
      {
        name: "operationRef",
        type: "Operation",
        isAttr: true,
        isReference: true
      },
      {
        name: "messageRef",
        type: "Message",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "ReceiveTask",
    superClass: [
      "Task"
    ],
    properties: [
      {
        name: "implementation",
        isAttr: true,
        type: "String"
      },
      {
        name: "instantiate",
        "default": false,
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "operationRef",
        type: "Operation",
        isAttr: true,
        isReference: true
      },
      {
        name: "messageRef",
        type: "Message",
        isAttr: true,
        isReference: true
      }
    ]
  },
  {
    name: "ScriptTask",
    superClass: [
      "Task"
    ],
    properties: [
      {
        name: "scriptFormat",
        isAttr: true,
        type: "String"
      },
      {
        name: "script",
        type: "String"
      }
    ]
  },
  {
    name: "BusinessRuleTask",
    superClass: [
      "Task"
    ],
    properties: [
      {
        name: "implementation",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "AdHocSubProcess",
    superClass: [
      "SubProcess"
    ],
    properties: [
      {
        name: "completionCondition",
        type: "Expression",
        xml: {
          serialize: "xsi:type"
        }
      },
      {
        name: "ordering",
        type: "AdHocOrdering",
        isAttr: true
      },
      {
        name: "cancelRemainingInstances",
        "default": true,
        isAttr: true,
        type: "Boolean"
      }
    ]
  },
  {
    name: "Transaction",
    superClass: [
      "SubProcess"
    ],
    properties: [
      {
        name: "protocol",
        isAttr: true,
        type: "String"
      },
      {
        name: "method",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "GlobalScriptTask",
    superClass: [
      "GlobalTask"
    ],
    properties: [
      {
        name: "scriptLanguage",
        isAttr: true,
        type: "String"
      },
      {
        name: "script",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "GlobalBusinessRuleTask",
    superClass: [
      "GlobalTask"
    ],
    properties: [
      {
        name: "implementation",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "ComplexBehaviorDefinition",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "condition",
        type: "FormalExpression"
      },
      {
        name: "event",
        type: "ImplicitThrowEvent"
      }
    ]
  },
  {
    name: "ResourceRole",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "resourceRef",
        type: "Resource",
        isReference: true
      },
      {
        name: "resourceParameterBindings",
        type: "ResourceParameterBinding",
        isMany: true
      },
      {
        name: "resourceAssignmentExpression",
        type: "ResourceAssignmentExpression"
      },
      {
        name: "name",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "ResourceParameterBinding",
    properties: [
      {
        name: "expression",
        type: "Expression",
        xml: {
          serialize: "xsi:type"
        }
      },
      {
        name: "parameterRef",
        type: "ResourceParameter",
        isAttr: true,
        isReference: true
      }
    ],
    superClass: [
      "BaseElement"
    ]
  },
  {
    name: "ResourceAssignmentExpression",
    properties: [
      {
        name: "expression",
        type: "Expression",
        xml: {
          serialize: "xsi:type"
        }
      }
    ],
    superClass: [
      "BaseElement"
    ]
  },
  {
    name: "Import",
    properties: [
      {
        name: "importType",
        isAttr: true,
        type: "String"
      },
      {
        name: "location",
        isAttr: true,
        type: "String"
      },
      {
        name: "namespace",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "Definitions",
    superClass: [
      "BaseElement"
    ],
    properties: [
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "targetNamespace",
        isAttr: true,
        type: "String"
      },
      {
        name: "expressionLanguage",
        "default": "http://www.w3.org/1999/XPath",
        isAttr: true,
        type: "String"
      },
      {
        name: "typeLanguage",
        "default": "http://www.w3.org/2001/XMLSchema",
        isAttr: true,
        type: "String"
      },
      {
        name: "imports",
        type: "Import",
        isMany: true
      },
      {
        name: "extensions",
        type: "Extension",
        isMany: true
      },
      {
        name: "rootElements",
        type: "RootElement",
        isMany: true
      },
      {
        name: "diagrams",
        isMany: true,
        type: "bpmndi:BPMNDiagram"
      },
      {
        name: "exporter",
        isAttr: true,
        type: "String"
      },
      {
        name: "relationships",
        type: "Relationship",
        isMany: true
      },
      {
        name: "exporterVersion",
        isAttr: true,
        type: "String"
      }
    ]
  }
];
var enumerations$3 = [
  {
    name: "ProcessType",
    literalValues: [
      {
        name: "None"
      },
      {
        name: "Public"
      },
      {
        name: "Private"
      }
    ]
  },
  {
    name: "GatewayDirection",
    literalValues: [
      {
        name: "Unspecified"
      },
      {
        name: "Converging"
      },
      {
        name: "Diverging"
      },
      {
        name: "Mixed"
      }
    ]
  },
  {
    name: "EventBasedGatewayType",
    literalValues: [
      {
        name: "Parallel"
      },
      {
        name: "Exclusive"
      }
    ]
  },
  {
    name: "RelationshipDirection",
    literalValues: [
      {
        name: "None"
      },
      {
        name: "Forward"
      },
      {
        name: "Backward"
      },
      {
        name: "Both"
      }
    ]
  },
  {
    name: "ItemKind",
    literalValues: [
      {
        name: "Physical"
      },
      {
        name: "Information"
      }
    ]
  },
  {
    name: "ChoreographyLoopType",
    literalValues: [
      {
        name: "None"
      },
      {
        name: "Standard"
      },
      {
        name: "MultiInstanceSequential"
      },
      {
        name: "MultiInstanceParallel"
      }
    ]
  },
  {
    name: "AssociationDirection",
    literalValues: [
      {
        name: "None"
      },
      {
        name: "One"
      },
      {
        name: "Both"
      }
    ]
  },
  {
    name: "MultiInstanceBehavior",
    literalValues: [
      {
        name: "None"
      },
      {
        name: "One"
      },
      {
        name: "All"
      },
      {
        name: "Complex"
      }
    ]
  },
  {
    name: "AdHocOrdering",
    literalValues: [
      {
        name: "Parallel"
      },
      {
        name: "Sequential"
      }
    ]
  }
];
var xml$1 = {
  tagAlias: "lowerCase",
  typePrefix: "t"
};
var BpmnPackage = {
  name: name$5,
  uri: uri$5,
  prefix: prefix$5,
  associations: associations$5,
  types: types$5,
  enumerations: enumerations$3,
  xml: xml$1
};
var name$4 = "BPMNDI";
var uri$4 = "http://www.omg.org/spec/BPMN/20100524/DI";
var prefix$4 = "bpmndi";
var types$4 = [
  {
    name: "BPMNDiagram",
    properties: [
      {
        name: "plane",
        type: "BPMNPlane",
        redefines: "di:Diagram#rootElement"
      },
      {
        name: "labelStyle",
        type: "BPMNLabelStyle",
        isMany: true
      }
    ],
    superClass: [
      "di:Diagram"
    ]
  },
  {
    name: "BPMNPlane",
    properties: [
      {
        name: "bpmnElement",
        isAttr: true,
        isReference: true,
        type: "bpmn:BaseElement",
        redefines: "di:DiagramElement#modelElement"
      }
    ],
    superClass: [
      "di:Plane"
    ]
  },
  {
    name: "BPMNShape",
    properties: [
      {
        name: "bpmnElement",
        isAttr: true,
        isReference: true,
        type: "bpmn:BaseElement",
        redefines: "di:DiagramElement#modelElement"
      },
      {
        name: "isHorizontal",
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "isExpanded",
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "isMarkerVisible",
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "label",
        type: "BPMNLabel"
      },
      {
        name: "isMessageVisible",
        isAttr: true,
        type: "Boolean"
      },
      {
        name: "participantBandKind",
        type: "ParticipantBandKind",
        isAttr: true
      },
      {
        name: "choreographyActivityShape",
        type: "BPMNShape",
        isAttr: true,
        isReference: true
      }
    ],
    superClass: [
      "di:LabeledShape"
    ]
  },
  {
    name: "BPMNEdge",
    properties: [
      {
        name: "label",
        type: "BPMNLabel"
      },
      {
        name: "bpmnElement",
        isAttr: true,
        isReference: true,
        type: "bpmn:BaseElement",
        redefines: "di:DiagramElement#modelElement"
      },
      {
        name: "sourceElement",
        isAttr: true,
        isReference: true,
        type: "di:DiagramElement",
        redefines: "di:Edge#source"
      },
      {
        name: "targetElement",
        isAttr: true,
        isReference: true,
        type: "di:DiagramElement",
        redefines: "di:Edge#target"
      },
      {
        name: "messageVisibleKind",
        type: "MessageVisibleKind",
        isAttr: true,
        "default": "initiating"
      }
    ],
    superClass: [
      "di:LabeledEdge"
    ]
  },
  {
    name: "BPMNLabel",
    properties: [
      {
        name: "labelStyle",
        type: "BPMNLabelStyle",
        isAttr: true,
        isReference: true,
        redefines: "di:DiagramElement#style"
      }
    ],
    superClass: [
      "di:Label"
    ]
  },
  {
    name: "BPMNLabelStyle",
    properties: [
      {
        name: "font",
        type: "dc:Font"
      }
    ],
    superClass: [
      "di:Style"
    ]
  }
];
var enumerations$2 = [
  {
    name: "ParticipantBandKind",
    literalValues: [
      {
        name: "top_initiating"
      },
      {
        name: "middle_initiating"
      },
      {
        name: "bottom_initiating"
      },
      {
        name: "top_non_initiating"
      },
      {
        name: "middle_non_initiating"
      },
      {
        name: "bottom_non_initiating"
      }
    ]
  },
  {
    name: "MessageVisibleKind",
    literalValues: [
      {
        name: "initiating"
      },
      {
        name: "non_initiating"
      }
    ]
  }
];
var associations$4 = [];
var BpmnDiPackage = {
  name: name$4,
  uri: uri$4,
  prefix: prefix$4,
  types: types$4,
  enumerations: enumerations$2,
  associations: associations$4
};
var name$3 = "DC";
var uri$3 = "http://www.omg.org/spec/DD/20100524/DC";
var prefix$3 = "dc";
var types$3 = [
  {
    name: "Boolean"
  },
  {
    name: "Integer"
  },
  {
    name: "Real"
  },
  {
    name: "String"
  },
  {
    name: "Font",
    properties: [
      {
        name: "name",
        type: "String",
        isAttr: true
      },
      {
        name: "size",
        type: "Real",
        isAttr: true
      },
      {
        name: "isBold",
        type: "Boolean",
        isAttr: true
      },
      {
        name: "isItalic",
        type: "Boolean",
        isAttr: true
      },
      {
        name: "isUnderline",
        type: "Boolean",
        isAttr: true
      },
      {
        name: "isStrikeThrough",
        type: "Boolean",
        isAttr: true
      }
    ]
  },
  {
    name: "Point",
    properties: [
      {
        name: "x",
        type: "Real",
        "default": "0",
        isAttr: true
      },
      {
        name: "y",
        type: "Real",
        "default": "0",
        isAttr: true
      }
    ]
  },
  {
    name: "Bounds",
    properties: [
      {
        name: "x",
        type: "Real",
        "default": "0",
        isAttr: true
      },
      {
        name: "y",
        type: "Real",
        "default": "0",
        isAttr: true
      },
      {
        name: "width",
        type: "Real",
        isAttr: true
      },
      {
        name: "height",
        type: "Real",
        isAttr: true
      }
    ]
  }
];
var associations$3 = [];
var DcPackage = {
  name: name$3,
  uri: uri$3,
  prefix: prefix$3,
  types: types$3,
  associations: associations$3
};
var name$2 = "DI";
var uri$2 = "http://www.omg.org/spec/DD/20100524/DI";
var prefix$2 = "di";
var types$2 = [
  {
    name: "DiagramElement",
    isAbstract: true,
    properties: [
      {
        name: "id",
        isAttr: true,
        isId: true,
        type: "String"
      },
      {
        name: "extension",
        type: "Extension"
      },
      {
        name: "owningDiagram",
        type: "Diagram",
        isReadOnly: true,
        isVirtual: true,
        isReference: true
      },
      {
        name: "owningElement",
        type: "DiagramElement",
        isReadOnly: true,
        isVirtual: true,
        isReference: true
      },
      {
        name: "modelElement",
        isReadOnly: true,
        isVirtual: true,
        isReference: true,
        type: "Element"
      },
      {
        name: "style",
        type: "Style",
        isReadOnly: true,
        isVirtual: true,
        isReference: true
      },
      {
        name: "ownedElement",
        type: "DiagramElement",
        isReadOnly: true,
        isMany: true,
        isVirtual: true
      }
    ]
  },
  {
    name: "Node",
    isAbstract: true,
    superClass: [
      "DiagramElement"
    ]
  },
  {
    name: "Edge",
    isAbstract: true,
    superClass: [
      "DiagramElement"
    ],
    properties: [
      {
        name: "source",
        type: "DiagramElement",
        isReadOnly: true,
        isVirtual: true,
        isReference: true
      },
      {
        name: "target",
        type: "DiagramElement",
        isReadOnly: true,
        isVirtual: true,
        isReference: true
      },
      {
        name: "waypoint",
        isUnique: false,
        isMany: true,
        type: "dc:Point",
        xml: {
          serialize: "xsi:type"
        }
      }
    ]
  },
  {
    name: "Diagram",
    isAbstract: true,
    properties: [
      {
        name: "id",
        isAttr: true,
        isId: true,
        type: "String"
      },
      {
        name: "rootElement",
        type: "DiagramElement",
        isReadOnly: true,
        isVirtual: true
      },
      {
        name: "name",
        isAttr: true,
        type: "String"
      },
      {
        name: "documentation",
        isAttr: true,
        type: "String"
      },
      {
        name: "resolution",
        isAttr: true,
        type: "Real"
      },
      {
        name: "ownedStyle",
        type: "Style",
        isReadOnly: true,
        isMany: true,
        isVirtual: true
      }
    ]
  },
  {
    name: "Shape",
    isAbstract: true,
    superClass: [
      "Node"
    ],
    properties: [
      {
        name: "bounds",
        type: "dc:Bounds"
      }
    ]
  },
  {
    name: "Plane",
    isAbstract: true,
    superClass: [
      "Node"
    ],
    properties: [
      {
        name: "planeElement",
        type: "DiagramElement",
        subsettedProperty: "DiagramElement-ownedElement",
        isMany: true
      }
    ]
  },
  {
    name: "LabeledEdge",
    isAbstract: true,
    superClass: [
      "Edge"
    ],
    properties: [
      {
        name: "ownedLabel",
        type: "Label",
        isReadOnly: true,
        subsettedProperty: "DiagramElement-ownedElement",
        isMany: true,
        isVirtual: true
      }
    ]
  },
  {
    name: "LabeledShape",
    isAbstract: true,
    superClass: [
      "Shape"
    ],
    properties: [
      {
        name: "ownedLabel",
        type: "Label",
        isReadOnly: true,
        subsettedProperty: "DiagramElement-ownedElement",
        isMany: true,
        isVirtual: true
      }
    ]
  },
  {
    name: "Label",
    isAbstract: true,
    superClass: [
      "Node"
    ],
    properties: [
      {
        name: "bounds",
        type: "dc:Bounds"
      }
    ]
  },
  {
    name: "Style",
    isAbstract: true,
    properties: [
      {
        name: "id",
        isAttr: true,
        isId: true,
        type: "String"
      }
    ]
  },
  {
    name: "Extension",
    properties: [
      {
        name: "values",
        isMany: true,
        type: "Element"
      }
    ]
  }
];
var associations$2 = [];
var xml = {
  tagAlias: "lowerCase"
};
var DiPackage = {
  name: name$2,
  uri: uri$2,
  prefix: prefix$2,
  types: types$2,
  associations: associations$2,
  xml
};
var name$1 = "bpmn.io colors for BPMN";
var uri$1 = "http://bpmn.io/schema/bpmn/biocolor/1.0";
var prefix$1 = "bioc";
var types$1 = [
  {
    name: "ColoredShape",
    "extends": [
      "bpmndi:BPMNShape"
    ],
    properties: [
      {
        name: "stroke",
        isAttr: true,
        type: "String"
      },
      {
        name: "fill",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "ColoredEdge",
    "extends": [
      "bpmndi:BPMNEdge"
    ],
    properties: [
      {
        name: "stroke",
        isAttr: true,
        type: "String"
      },
      {
        name: "fill",
        isAttr: true,
        type: "String"
      }
    ]
  }
];
var enumerations$1 = [];
var associations$1 = [];
var BiocPackage = {
  name: name$1,
  uri: uri$1,
  prefix: prefix$1,
  types: types$1,
  enumerations: enumerations$1,
  associations: associations$1
};
var name = "BPMN in Color";
var uri = "http://www.omg.org/spec/BPMN/non-normative/color/1.0";
var prefix = "color";
var types = [
  {
    name: "ColoredLabel",
    "extends": [
      "bpmndi:BPMNLabel"
    ],
    properties: [
      {
        name: "color",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "ColoredShape",
    "extends": [
      "bpmndi:BPMNShape"
    ],
    properties: [
      {
        name: "background-color",
        isAttr: true,
        type: "String"
      },
      {
        name: "border-color",
        isAttr: true,
        type: "String"
      }
    ]
  },
  {
    name: "ColoredEdge",
    "extends": [
      "bpmndi:BPMNEdge"
    ],
    properties: [
      {
        name: "border-color",
        isAttr: true,
        type: "String"
      }
    ]
  }
];
var enumerations = [];
var associations = [];
var BpmnInColorPackage = {
  name,
  uri,
  prefix,
  types,
  enumerations,
  associations
};
var packages = {
  bpmn: BpmnPackage,
  bpmndi: BpmnDiPackage,
  dc: DcPackage,
  di: DiPackage,
  bioc: BiocPackage,
  color: BpmnInColorPackage
};
function SimpleBpmnModdle(additionalPackages, options) {
  const pks = assign({}, packages, additionalPackages);
  return new BpmnModdle(pks, options);
}

// node_modules/cmmn-moddle/lib/simple.js
var import_min_dash11 = __toESM(require_dist());

// node_modules/cmmn-moddle/lib/cmmn-moddle.js
var import_min_dash10 = __toESM(require_dist());

// node_modules/cmmn-moddle/node_modules/moddle/lib/moddle.js
var import_min_dash7 = __toESM(require_dist());

// node_modules/cmmn-moddle/node_modules/moddle/lib/factory.js
var import_min_dash4 = __toESM(require_dist());

// node_modules/cmmn-moddle/node_modules/moddle/lib/base.js
function Base2() {
}
Base2.prototype.get = function(name2) {
  return this.$model.properties.get(this, name2);
};
Base2.prototype.set = function(name2, value) {
  this.$model.properties.set(this, name2, value);
};

// node_modules/cmmn-moddle/node_modules/moddle/lib/factory.js
function Factory2(model, properties) {
  this.model = model;
  this.properties = properties;
}
Factory2.prototype.createType = function(descriptor) {
  var model = this.model;
  var props = this.properties, prototype = Object.create(Base2.prototype);
  (0, import_min_dash4.forEach)(descriptor.properties, function(p) {
    if (!p.isMany && p.default !== void 0) {
      prototype[p.name] = p.default;
    }
  });
  props.defineModel(prototype, model);
  props.defineDescriptor(prototype, descriptor);
  var name2 = descriptor.ns.name;
  function ModdleElement(attrs) {
    props.define(this, "$type", { value: name2, enumerable: true });
    props.define(this, "$attrs", { value: {} });
    props.define(this, "$parent", { writable: true });
    (0, import_min_dash4.forEach)(attrs, (0, import_min_dash4.bind)(function(val, key) {
      this.set(key, val);
    }, this));
  }
  ModdleElement.prototype = prototype;
  ModdleElement.hasType = prototype.$instanceOf = this.model.hasType;
  props.defineModel(ModdleElement, model);
  props.defineDescriptor(ModdleElement, descriptor);
  return ModdleElement;
};

// node_modules/cmmn-moddle/node_modules/moddle/lib/registry.js
var import_min_dash6 = __toESM(require_dist());

// node_modules/cmmn-moddle/node_modules/moddle/lib/types.js
var BUILTINS2 = {
  String: true,
  Boolean: true,
  Integer: true,
  Real: true,
  Element: true
};
var TYPE_CONVERTERS2 = {
  String: function(s) {
    return s;
  },
  Boolean: function(s) {
    return s === "true";
  },
  Integer: function(s) {
    return parseInt(s, 10);
  },
  Real: function(s) {
    return parseFloat(s, 10);
  }
};
function coerceType2(type, value) {
  var converter = TYPE_CONVERTERS2[type];
  if (converter) {
    return converter(value);
  } else {
    return value;
  }
}
function isBuiltIn2(type) {
  return !!BUILTINS2[type];
}
function isSimple2(type) {
  return !!TYPE_CONVERTERS2[type];
}

// node_modules/cmmn-moddle/node_modules/moddle/lib/descriptor-builder.js
var import_min_dash5 = __toESM(require_dist());

// node_modules/cmmn-moddle/node_modules/moddle/lib/ns.js
function parseName2(name2, defaultPrefix) {
  var parts = name2.split(/:/), localName, prefix2;
  if (parts.length === 1) {
    localName = name2;
    prefix2 = defaultPrefix;
  } else if (parts.length === 2) {
    localName = parts[1];
    prefix2 = parts[0];
  } else {
    throw new Error("expected <prefix:localName> or <localName>, got " + name2);
  }
  name2 = (prefix2 ? prefix2 + ":" : "") + localName;
  return {
    name: name2,
    prefix: prefix2,
    localName
  };
}

// node_modules/cmmn-moddle/node_modules/moddle/lib/descriptor-builder.js
function DescriptorBuilder2(nameNs) {
  this.ns = nameNs;
  this.name = nameNs.name;
  this.allTypes = [];
  this.allTypesByName = {};
  this.properties = [];
  this.propertiesByName = {};
}
DescriptorBuilder2.prototype.build = function() {
  return (0, import_min_dash5.pick)(this, [
    "ns",
    "name",
    "allTypes",
    "allTypesByName",
    "properties",
    "propertiesByName",
    "bodyProperty",
    "idProperty"
  ]);
};
DescriptorBuilder2.prototype.addProperty = function(p, idx, validate) {
  if (typeof idx === "boolean") {
    validate = idx;
    idx = void 0;
  }
  this.addNamedProperty(p, validate !== false);
  var properties = this.properties;
  if (idx !== void 0) {
    properties.splice(idx, 0, p);
  } else {
    properties.push(p);
  }
};
DescriptorBuilder2.prototype.replaceProperty = function(oldProperty, newProperty, replace) {
  var oldNameNs = oldProperty.ns;
  var props = this.properties, propertiesByName = this.propertiesByName, rename = oldProperty.name !== newProperty.name;
  if (oldProperty.isId) {
    if (!newProperty.isId) {
      throw new Error(
        "property <" + newProperty.ns.name + "> must be id property to refine <" + oldProperty.ns.name + ">"
      );
    }
    this.setIdProperty(newProperty, false);
  }
  if (oldProperty.isBody) {
    if (!newProperty.isBody) {
      throw new Error(
        "property <" + newProperty.ns.name + "> must be body property to refine <" + oldProperty.ns.name + ">"
      );
    }
    this.setBodyProperty(newProperty, false);
  }
  var idx = props.indexOf(oldProperty);
  if (idx === -1) {
    throw new Error("property <" + oldNameNs.name + "> not found in property list");
  }
  props.splice(idx, 1);
  this.addProperty(newProperty, replace ? void 0 : idx, rename);
  propertiesByName[oldNameNs.name] = propertiesByName[oldNameNs.localName] = newProperty;
};
DescriptorBuilder2.prototype.redefineProperty = function(p, targetPropertyName, replace) {
  var nsPrefix = p.ns.prefix;
  var parts = targetPropertyName.split("#");
  var name2 = parseName2(parts[0], nsPrefix);
  var attrName = parseName2(parts[1], name2.prefix).name;
  var redefinedProperty = this.propertiesByName[attrName];
  if (!redefinedProperty) {
    throw new Error("refined property <" + attrName + "> not found");
  } else {
    this.replaceProperty(redefinedProperty, p, replace);
  }
  delete p.redefines;
};
DescriptorBuilder2.prototype.addNamedProperty = function(p, validate) {
  var ns = p.ns, propsByName = this.propertiesByName;
  if (validate) {
    this.assertNotDefined(p, ns.name);
    this.assertNotDefined(p, ns.localName);
  }
  propsByName[ns.name] = propsByName[ns.localName] = p;
};
DescriptorBuilder2.prototype.removeNamedProperty = function(p) {
  var ns = p.ns, propsByName = this.propertiesByName;
  delete propsByName[ns.name];
  delete propsByName[ns.localName];
};
DescriptorBuilder2.prototype.setBodyProperty = function(p, validate) {
  if (validate && this.bodyProperty) {
    throw new Error(
      "body property defined multiple times (<" + this.bodyProperty.ns.name + ">, <" + p.ns.name + ">)"
    );
  }
  this.bodyProperty = p;
};
DescriptorBuilder2.prototype.setIdProperty = function(p, validate) {
  if (validate && this.idProperty) {
    throw new Error(
      "id property defined multiple times (<" + this.idProperty.ns.name + ">, <" + p.ns.name + ">)"
    );
  }
  this.idProperty = p;
};
DescriptorBuilder2.prototype.assertNotDefined = function(p, name2) {
  var propertyName = p.name, definedProperty = this.propertiesByName[propertyName];
  if (definedProperty) {
    throw new Error(
      "property <" + propertyName + "> already defined; override of <" + definedProperty.definedBy.ns.name + "#" + definedProperty.ns.name + "> by <" + p.definedBy.ns.name + "#" + p.ns.name + "> not allowed without redefines"
    );
  }
};
DescriptorBuilder2.prototype.hasProperty = function(name2) {
  return this.propertiesByName[name2];
};
DescriptorBuilder2.prototype.addTrait = function(t, inherited) {
  var typesByName = this.allTypesByName, types2 = this.allTypes;
  var typeName = t.name;
  if (typeName in typesByName) {
    return;
  }
  (0, import_min_dash5.forEach)(t.properties, (0, import_min_dash5.bind)(function(p) {
    p = (0, import_min_dash5.assign)({}, p, {
      name: p.ns.localName,
      inherited
    });
    Object.defineProperty(p, "definedBy", {
      value: t
    });
    var replaces = p.replaces, redefines = p.redefines;
    if (replaces || redefines) {
      this.redefineProperty(p, replaces || redefines, replaces);
    } else {
      if (p.isBody) {
        this.setBodyProperty(p);
      }
      if (p.isId) {
        this.setIdProperty(p);
      }
      this.addProperty(p);
    }
  }, this));
  types2.push(t);
  typesByName[typeName] = t;
};

// node_modules/cmmn-moddle/node_modules/moddle/lib/registry.js
function Registry2(packages3, properties) {
  this.packageMap = {};
  this.typeMap = {};
  this.packages = [];
  this.properties = properties;
  (0, import_min_dash6.forEach)(packages3, (0, import_min_dash6.bind)(this.registerPackage, this));
}
Registry2.prototype.getPackage = function(uriOrPrefix) {
  return this.packageMap[uriOrPrefix];
};
Registry2.prototype.getPackages = function() {
  return this.packages;
};
Registry2.prototype.registerPackage = function(pkg) {
  pkg = (0, import_min_dash6.assign)({}, pkg);
  var pkgMap = this.packageMap;
  ensureAvailable2(pkgMap, pkg, "prefix");
  ensureAvailable2(pkgMap, pkg, "uri");
  (0, import_min_dash6.forEach)(pkg.types, (0, import_min_dash6.bind)(function(descriptor) {
    this.registerType(descriptor, pkg);
  }, this));
  pkgMap[pkg.uri] = pkgMap[pkg.prefix] = pkg;
  this.packages.push(pkg);
};
Registry2.prototype.registerType = function(type, pkg) {
  type = (0, import_min_dash6.assign)({}, type, {
    superClass: (type.superClass || []).slice(),
    extends: (type.extends || []).slice(),
    properties: (type.properties || []).slice(),
    meta: (0, import_min_dash6.assign)(({}, type.meta || {}))
  });
  var ns = parseName2(type.name, pkg.prefix), name2 = ns.name, propertiesByName = {};
  (0, import_min_dash6.forEach)(type.properties, (0, import_min_dash6.bind)(function(p) {
    var propertyNs = parseName2(p.name, ns.prefix), propertyName = propertyNs.name;
    if (!isBuiltIn2(p.type)) {
      p.type = parseName2(p.type, propertyNs.prefix).name;
    }
    (0, import_min_dash6.assign)(p, {
      ns: propertyNs,
      name: propertyName
    });
    propertiesByName[propertyName] = p;
  }, this));
  (0, import_min_dash6.assign)(type, {
    ns,
    name: name2,
    propertiesByName
  });
  (0, import_min_dash6.forEach)(type.extends, (0, import_min_dash6.bind)(function(extendsName) {
    var extended = this.typeMap[extendsName];
    extended.traits = extended.traits || [];
    extended.traits.push(name2);
  }, this));
  this.definePackage(type, pkg);
  this.typeMap[name2] = type;
};
Registry2.prototype.mapTypes = function(nsName3, iterator, trait) {
  var type = isBuiltIn2(nsName3.name) ? { name: nsName3.name } : this.typeMap[nsName3.name];
  var self = this;
  function traverseTrait(cls) {
    return traverseSuper(cls, true);
  }
  function traverseSuper(cls, trait2) {
    var parentNs = parseName2(cls, isBuiltIn2(cls) ? "" : nsName3.prefix);
    self.mapTypes(parentNs, iterator, trait2);
  }
  if (!type) {
    throw new Error("unknown type <" + nsName3.name + ">");
  }
  (0, import_min_dash6.forEach)(type.superClass, trait ? traverseTrait : traverseSuper);
  iterator(type, !trait);
  (0, import_min_dash6.forEach)(type.traits, traverseTrait);
};
Registry2.prototype.getEffectiveDescriptor = function(name2) {
  var nsName3 = parseName2(name2);
  var builder = new DescriptorBuilder2(nsName3);
  this.mapTypes(nsName3, function(type, inherited) {
    builder.addTrait(type, inherited);
  });
  var descriptor = builder.build();
  this.definePackage(descriptor, descriptor.allTypes[descriptor.allTypes.length - 1].$pkg);
  return descriptor;
};
Registry2.prototype.definePackage = function(target, pkg) {
  this.properties.define(target, "$pkg", { value: pkg });
};
function ensureAvailable2(packageMap, pkg, identifierKey) {
  var value = pkg[identifierKey];
  if (value in packageMap) {
    throw new Error("package with " + identifierKey + " <" + value + "> already defined");
  }
}

// node_modules/cmmn-moddle/node_modules/moddle/lib/properties.js
function Properties2(model) {
  this.model = model;
}
Properties2.prototype.set = function(target, name2, value) {
  var property = this.model.getPropertyDescriptor(target, name2);
  var propertyName = property && property.name;
  if (isUndefined4(value)) {
    if (property) {
      delete target[propertyName];
    } else {
      delete target.$attrs[name2];
    }
  } else {
    if (property) {
      if (propertyName in target) {
        target[propertyName] = value;
      } else {
        defineProperty2(target, property, value);
      }
    } else {
      target.$attrs[name2] = value;
    }
  }
};
Properties2.prototype.get = function(target, name2) {
  var property = this.model.getPropertyDescriptor(target, name2);
  if (!property) {
    return target.$attrs[name2];
  }
  var propertyName = property.name;
  if (!target[propertyName] && property.isMany) {
    defineProperty2(target, property, []);
  }
  return target[propertyName];
};
Properties2.prototype.define = function(target, name2, options) {
  Object.defineProperty(target, name2, options);
};
Properties2.prototype.defineDescriptor = function(target, descriptor) {
  this.define(target, "$descriptor", { value: descriptor });
};
Properties2.prototype.defineModel = function(target, model) {
  this.define(target, "$model", { value: model });
};
function isUndefined4(val) {
  return typeof val === "undefined";
}
function defineProperty2(target, property, value) {
  Object.defineProperty(target, property.name, {
    enumerable: !property.isReference,
    writable: true,
    value,
    configurable: true
  });
}

// node_modules/cmmn-moddle/node_modules/moddle/lib/moddle.js
function Moddle2(packages3) {
  this.properties = new Properties2(this);
  this.factory = new Factory2(this, this.properties);
  this.registry = new Registry2(packages3, this.properties);
  this.typeCache = {};
}
Moddle2.prototype.create = function(descriptor, attrs) {
  var Type = this.getType(descriptor);
  if (!Type) {
    throw new Error("unknown type <" + descriptor + ">");
  }
  return new Type(attrs);
};
Moddle2.prototype.getType = function(descriptor) {
  var cache = this.typeCache;
  var name2 = (0, import_min_dash7.isString)(descriptor) ? descriptor : descriptor.ns.name;
  var type = cache[name2];
  if (!type) {
    descriptor = this.registry.getEffectiveDescriptor(name2);
    type = cache[name2] = this.factory.createType(descriptor);
  }
  return type;
};
Moddle2.prototype.createAny = function(name2, nsUri, properties) {
  var nameNs = parseName2(name2);
  var element = {
    $type: name2,
    $instanceOf: function(type) {
      return type === this.$type;
    }
  };
  var descriptor = {
    name: name2,
    isGeneric: true,
    ns: {
      prefix: nameNs.prefix,
      localName: nameNs.localName,
      uri: nsUri
    }
  };
  this.properties.defineDescriptor(element, descriptor);
  this.properties.defineModel(element, this);
  this.properties.define(element, "$parent", { enumerable: false, writable: true });
  (0, import_min_dash7.forEach)(properties, function(a, key) {
    if ((0, import_min_dash7.isObject)(a) && a.value !== void 0) {
      element[a.name] = a.value;
    } else {
      element[key] = a;
    }
  });
  return element;
};
Moddle2.prototype.getPackage = function(uriOrPrefix) {
  return this.registry.getPackage(uriOrPrefix);
};
Moddle2.prototype.getPackages = function() {
  return this.registry.getPackages();
};
Moddle2.prototype.getElementDescriptor = function(element) {
  return element.$descriptor;
};
Moddle2.prototype.hasType = function(element, type) {
  if (type === void 0) {
    type = element;
    element = this;
  }
  var descriptor = element.$model.getElementDescriptor(element);
  return type in descriptor.allTypesByName;
};
Moddle2.prototype.getPropertyDescriptor = function(element, property) {
  return this.getElementDescriptor(element).propertiesByName[property];
};
Moddle2.prototype.getTypeDescriptor = function(type) {
  return this.registry.typeMap[type];
};

// node_modules/cmmn-moddle/node_modules/moddle-xml/lib/read.js
var import_min_dash8 = __toESM(require_dist());
var import_saxen2 = __toESM(require_dist2());

// node_modules/cmmn-moddle/node_modules/moddle-xml/lib/common.js
function hasLowerCaseAlias2(pkg) {
  return pkg.xml && pkg.xml.tagAlias === "lowerCase";
}
var DEFAULT_NS_MAP2 = {
  "xsi": "http://www.w3.org/2001/XMLSchema-instance"
};
var XSI_TYPE = "xsi:type";
function serializeFormat(element) {
  return element.xml && element.xml.serialize;
}
function serializeAsType(element) {
  return serializeFormat(element) === XSI_TYPE;
}
function serializeAsProperty(element) {
  return serializeFormat(element) === "property";
}

// node_modules/cmmn-moddle/node_modules/moddle-xml/lib/read.js
function capitalize2(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function aliasToName2(aliasNs, pkg) {
  if (!hasLowerCaseAlias2(pkg)) {
    return aliasNs.name;
  }
  return aliasNs.prefix + ":" + capitalize2(aliasNs.localName);
}
function prefixedToName2(nameNs, pkg) {
  var name2 = nameNs.name, localName = nameNs.localName;
  var typePrefix = pkg.xml && pkg.xml.typePrefix;
  if (typePrefix && localName.indexOf(typePrefix) === 0) {
    return nameNs.prefix + ":" + localName.slice(typePrefix.length);
  } else {
    return name2;
  }
}
function normalizeXsiTypeName(name2, model) {
  var nameNs = parseName2(name2);
  var pkg = model.getPackage(nameNs.prefix);
  return prefixedToName2(nameNs, pkg);
}
function error3(message) {
  return new Error(message);
}
function getModdleDescriptor2(element) {
  return element.$descriptor;
}
function defer(fn) {
  setTimeout(fn, 0);
}
function Context2(options) {
  (0, import_min_dash8.assign)(this, options);
  this.elementsById = {};
  this.references = [];
  this.warnings = [];
  this.addReference = function(reference) {
    this.references.push(reference);
  };
  this.addElement = function(element) {
    if (!element) {
      throw error3("expected element");
    }
    var elementsById = this.elementsById;
    var descriptor = getModdleDescriptor2(element);
    var idProperty = descriptor.idProperty, id;
    if (idProperty) {
      id = element.get(idProperty.name);
      if (id) {
        if (!/^([a-z][\w-.]*:)?[a-z_][\w-.]*$/i.test(id)) {
          throw new Error("illegal ID <" + id + ">");
        }
        if (elementsById[id]) {
          throw error3("duplicate ID <" + id + ">");
        }
        elementsById[id] = element;
      }
    }
  };
  this.addWarning = function(warning) {
    this.warnings.push(warning);
  };
}
function BaseHandler2() {
}
BaseHandler2.prototype.handleEnd = function() {
};
BaseHandler2.prototype.handleText = function() {
};
BaseHandler2.prototype.handleNode = function() {
};
function NoopHandler2() {
}
NoopHandler2.prototype = Object.create(BaseHandler2.prototype);
NoopHandler2.prototype.handleNode = function() {
  return this;
};
function BodyHandler2() {
}
BodyHandler2.prototype = Object.create(BaseHandler2.prototype);
BodyHandler2.prototype.handleText = function(text) {
  this.body = (this.body || "") + text;
};
function ReferenceHandler2(property, context) {
  this.property = property;
  this.context = context;
}
ReferenceHandler2.prototype = Object.create(BodyHandler2.prototype);
ReferenceHandler2.prototype.handleNode = function(node) {
  if (this.element) {
    throw error3("expected no sub nodes");
  } else {
    this.element = this.createReference(node);
  }
  return this;
};
ReferenceHandler2.prototype.handleEnd = function() {
  this.element.id = this.body;
};
ReferenceHandler2.prototype.createReference = function(node) {
  return {
    property: this.property.ns.name,
    id: ""
  };
};
function ValueHandler2(propertyDesc, element) {
  this.element = element;
  this.propertyDesc = propertyDesc;
}
ValueHandler2.prototype = Object.create(BodyHandler2.prototype);
ValueHandler2.prototype.handleEnd = function() {
  var value = this.body || "", element = this.element, propertyDesc = this.propertyDesc;
  value = coerceType2(propertyDesc.type, value);
  if (propertyDesc.isMany) {
    element.get(propertyDesc.name).push(value);
  } else {
    element.set(propertyDesc.name, value);
  }
};
function BaseElementHandler2() {
}
BaseElementHandler2.prototype = Object.create(BodyHandler2.prototype);
BaseElementHandler2.prototype.handleNode = function(node) {
  var parser = this, element = this.element;
  if (!element) {
    element = this.element = this.createElement(node);
    this.context.addElement(element);
  } else {
    parser = this.handleChild(node);
  }
  return parser;
};
function ElementHandler2(model, typeName, context) {
  this.model = model;
  this.type = model.getType(typeName);
  this.context = context;
}
ElementHandler2.prototype = Object.create(BaseElementHandler2.prototype);
ElementHandler2.prototype.addReference = function(reference) {
  this.context.addReference(reference);
};
ElementHandler2.prototype.handleText = function(text) {
  var element = this.element, descriptor = getModdleDescriptor2(element), bodyProperty = descriptor.bodyProperty;
  if (!bodyProperty) {
    throw error3("unexpected body text <" + text + ">");
  }
  BodyHandler2.prototype.handleText.call(this, text);
};
ElementHandler2.prototype.handleEnd = function() {
  var value = this.body, element = this.element, descriptor = getModdleDescriptor2(element), bodyProperty = descriptor.bodyProperty;
  if (bodyProperty && value !== void 0) {
    value = coerceType2(bodyProperty.type, value);
    element.set(bodyProperty.name, value);
  }
};
ElementHandler2.prototype.createElement = function(node) {
  var attributes = node.attributes, Type = this.type, descriptor = getModdleDescriptor2(Type), context = this.context, instance = new Type({}), model = this.model, propNameNs;
  (0, import_min_dash8.forEach)(attributes, function(value, name2) {
    var prop = descriptor.propertiesByName[name2], values;
    if (prop && prop.isReference) {
      if (!prop.isMany) {
        context.addReference({
          element: instance,
          property: prop.ns.name,
          id: value
        });
      } else {
        values = value.split(" ");
        (0, import_min_dash8.forEach)(values, function(v) {
          context.addReference({
            element: instance,
            property: prop.ns.name,
            id: v
          });
        });
      }
    } else {
      if (prop) {
        value = coerceType2(prop.type, value);
      } else if (name2 !== "xmlns") {
        propNameNs = parseName2(name2, descriptor.ns.prefix);
        if (model.getPackage(propNameNs.prefix)) {
          context.addWarning({
            message: "unknown attribute <" + name2 + ">",
            element: instance,
            property: name2,
            value
          });
        }
      }
      instance.set(name2, value);
    }
  });
  return instance;
};
ElementHandler2.prototype.getPropertyForNode = function(node) {
  var name2 = node.name;
  var nameNs = parseName2(name2);
  var type = this.type, model = this.model, descriptor = getModdleDescriptor2(type);
  var propertyName = nameNs.name, property = descriptor.propertiesByName[propertyName], elementTypeName, elementType;
  if (property) {
    if (serializeAsType(property)) {
      elementTypeName = node.attributes[XSI_TYPE];
      if (elementTypeName) {
        elementTypeName = normalizeXsiTypeName(elementTypeName, model);
        elementType = model.getType(elementTypeName);
        return (0, import_min_dash8.assign)({}, property, {
          effectiveType: getModdleDescriptor2(elementType).name
        });
      }
    }
    return property;
  }
  var pkg = model.getPackage(nameNs.prefix);
  if (pkg) {
    elementTypeName = aliasToName2(nameNs, pkg);
    elementType = model.getType(elementTypeName);
    property = (0, import_min_dash8.find)(descriptor.properties, function(p) {
      return !p.isVirtual && !p.isReference && !p.isAttribute && elementType.hasType(p.type);
    });
    if (property) {
      return (0, import_min_dash8.assign)({}, property, {
        effectiveType: getModdleDescriptor2(elementType).name
      });
    }
  } else {
    property = (0, import_min_dash8.find)(descriptor.properties, function(p) {
      return !p.isReference && !p.isAttribute && p.type === "Element";
    });
    if (property) {
      return property;
    }
  }
  throw error3("unrecognized element <" + nameNs.name + ">");
};
ElementHandler2.prototype.toString = function() {
  return "ElementDescriptor[" + getModdleDescriptor2(this.type).name + "]";
};
ElementHandler2.prototype.valueHandler = function(propertyDesc, element) {
  return new ValueHandler2(propertyDesc, element);
};
ElementHandler2.prototype.referenceHandler = function(propertyDesc) {
  return new ReferenceHandler2(propertyDesc, this.context);
};
ElementHandler2.prototype.handler = function(type) {
  if (type === "Element") {
    return new GenericElementHandler2(this.model, type, this.context);
  } else {
    return new ElementHandler2(this.model, type, this.context);
  }
};
ElementHandler2.prototype.handleChild = function(node) {
  var propertyDesc, type, element, childHandler;
  propertyDesc = this.getPropertyForNode(node);
  element = this.element;
  type = propertyDesc.effectiveType || propertyDesc.type;
  if (isSimple2(type)) {
    return this.valueHandler(propertyDesc, element);
  }
  if (propertyDesc.isReference) {
    childHandler = this.referenceHandler(propertyDesc).handleNode(node);
  } else {
    childHandler = this.handler(type).handleNode(node);
  }
  var newElement = childHandler.element;
  if (newElement !== void 0) {
    if (propertyDesc.isMany) {
      element.get(propertyDesc.name).push(newElement);
    } else {
      element.set(propertyDesc.name, newElement);
    }
    if (propertyDesc.isReference) {
      (0, import_min_dash8.assign)(newElement, {
        element
      });
      this.context.addReference(newElement);
    } else {
      newElement.$parent = element;
    }
  }
  return childHandler;
};
function RootElementHandler2(model, typeName, context) {
  ElementHandler2.call(this, model, typeName, context);
}
RootElementHandler2.prototype = Object.create(ElementHandler2.prototype);
RootElementHandler2.prototype.createElement = function(node) {
  var name2 = node.name, nameNs = parseName2(name2), model = this.model, type = this.type, pkg = model.getPackage(nameNs.prefix), typeName = pkg && aliasToName2(nameNs, pkg) || name2;
  if (!type.hasType(typeName)) {
    throw error3("unexpected element <" + node.originalName + ">");
  }
  return ElementHandler2.prototype.createElement.call(this, node);
};
function GenericElementHandler2(model, typeName, context) {
  this.model = model;
  this.context = context;
}
GenericElementHandler2.prototype = Object.create(BaseElementHandler2.prototype);
GenericElementHandler2.prototype.createElement = function(node) {
  var name2 = node.name, ns = parseName2(name2), prefix2 = ns.prefix, uri2 = node.ns[prefix2 + "$uri"], attributes = node.attributes;
  return this.model.createAny(name2, uri2, attributes);
};
GenericElementHandler2.prototype.handleChild = function(node) {
  var handler = new GenericElementHandler2(this.model, "Element", this.context).handleNode(node), element = this.element;
  var newElement = handler.element, children;
  if (newElement !== void 0) {
    children = element.$children = element.$children || [];
    children.push(newElement);
    newElement.$parent = element;
  }
  return handler;
};
GenericElementHandler2.prototype.handleEnd = function() {
  if (this.body) {
    this.element.$body = this.body;
  }
};
function Reader2(options) {
  if (options instanceof Moddle2) {
    options = {
      model: options
    };
  }
  (0, import_min_dash8.assign)(this, { lax: false }, options);
}
Reader2.prototype.fromXML = function(xml2, options, done) {
  var rootHandler = options.rootHandler;
  if (options instanceof ElementHandler2) {
    rootHandler = options;
    options = {};
  } else {
    if (typeof options === "string") {
      rootHandler = this.handler(options);
      options = {};
    } else if (typeof rootHandler === "string") {
      rootHandler = this.handler(rootHandler);
    }
  }
  var model = this.model, lax = this.lax;
  var context = new Context2((0, import_min_dash8.assign)({}, options, { rootHandler })), parser = new import_saxen2.Parser({ proxy: true }), stack = createStack2();
  rootHandler.context = context;
  stack.push(rootHandler);
  function handleError(err, getContext, lax2) {
    var ctx = getContext();
    var line = ctx.line, column = ctx.column, data = ctx.data;
    if (data.charAt(0) === "<" && data.indexOf(" ") !== -1) {
      data = data.slice(0, data.indexOf(" ")) + ">";
    }
    var message = "unparsable content " + (data ? data + " " : "") + "detected\n	line: " + line + "\n	column: " + column + "\n	nested error: " + err.message;
    if (lax2) {
      context.addWarning({
        message,
        error: err
      });
      return true;
    } else {
      throw error3(message);
    }
  }
  function handleWarning(err, getContext) {
    return handleError(err, getContext, true);
  }
  function resolveReferences() {
    var elementsById = context.elementsById;
    var references = context.references;
    var i, r;
    for (i = 0; r = references[i]; i++) {
      var element = r.element;
      var reference = elementsById[r.id];
      var property = getModdleDescriptor2(element).propertiesByName[r.property];
      if (!reference) {
        context.addWarning({
          message: "unresolved reference <" + r.id + ">",
          element: r.element,
          property: r.property,
          value: r.id
        });
      }
      if (property.isMany) {
        var collection = element.get(property.name), idx = collection.indexOf(r);
        if (idx === -1) {
          idx = collection.length;
        }
        if (!reference) {
          collection.splice(idx, 1);
        } else {
          collection[idx] = reference;
        }
      } else {
        element.set(property.name, reference);
      }
    }
  }
  function handleClose() {
    stack.pop().handleEnd();
  }
  var PREAMBLE_START_PATTERN = /^<\?xml /i;
  var ENCODING_PATTERN = / encoding="([^"]+)"/i;
  var UTF_8_PATTERN = /^utf-8$/i;
  function handleQuestion(question) {
    if (!PREAMBLE_START_PATTERN.test(question)) {
      return;
    }
    var match = ENCODING_PATTERN.exec(question);
    var encoding = match && match[1];
    if (!encoding || UTF_8_PATTERN.test(encoding)) {
      return;
    }
    context.addWarning({
      message: "unsupported document encoding <" + encoding + ">, falling back to UTF-8"
    });
  }
  function handleOpen(node, getContext) {
    var handler = stack.peek();
    try {
      stack.push(handler.handleNode(node));
    } catch (err) {
      if (handleError(err, getContext, lax)) {
        stack.push(new NoopHandler2());
      }
    }
  }
  function handleCData(text, getContext) {
    try {
      stack.peek().handleText(text);
    } catch (err) {
      handleWarning(err, getContext);
    }
  }
  function handleText(text, getContext) {
    text = text.trim();
    if (!text) {
      return;
    }
    handleCData(text, getContext);
  }
  var uriMap = model.getPackages().reduce(function(uriMap2, p) {
    uriMap2[p.uri] = p.prefix;
    return uriMap2;
  }, {});
  parser.ns(uriMap).on("openTag", function(obj, decodeStr, selfClosing, getContext) {
    var attrs = obj.attrs || {};
    var decodedAttrs = Object.keys(attrs).reduce(function(d, key) {
      var value = decodeStr(attrs[key]);
      d[key] = value;
      return d;
    }, {});
    var node = {
      name: obj.name,
      originalName: obj.originalName,
      attributes: decodedAttrs,
      ns: obj.ns
    };
    handleOpen(node, getContext);
  }).on("question", handleQuestion).on("closeTag", handleClose).on("cdata", handleCData).on("text", function(text, decodeEntities2, getContext) {
    handleText(decodeEntities2(text), getContext);
  }).on("error", handleError).on("warn", handleWarning);
  defer(function() {
    var err;
    try {
      parser.parse(xml2);
      resolveReferences();
    } catch (e) {
      err = e;
    }
    var element = rootHandler.element;
    if (!err && !element) {
      err = error3("failed to parse document as <" + rootHandler.type.$descriptor.name + ">");
    }
    done(err, err ? void 0 : element, context);
  });
};
Reader2.prototype.handler = function(name2) {
  return new RootElementHandler2(this.model, name2);
};
function createStack2() {
  var stack = [];
  Object.defineProperty(stack, "peek", {
    value: function() {
      return this[this.length - 1];
    }
  });
  return stack;
}

// node_modules/cmmn-moddle/node_modules/moddle-xml/lib/write.js
var import_min_dash9 = __toESM(require_dist());
var XML_PREAMBLE2 = '<?xml version="1.0" encoding="UTF-8"?>\n';
var ESCAPE_ATTR_CHARS2 = /<|>|'|"|&|\n\r|\n/g;
var ESCAPE_CHARS2 = /<|>|&/g;
function Namespaces2(parent) {
  var prefixMap = {};
  var uriMap = {};
  var used = {};
  var wellknown = [];
  var custom = [];
  this.byUri = function(uri2) {
    return uriMap[uri2] || parent && parent.byUri(uri2);
  };
  this.add = function(ns, isWellknown) {
    uriMap[ns.uri] = ns;
    if (isWellknown) {
      wellknown.push(ns);
    } else {
      custom.push(ns);
    }
    this.mapPrefix(ns.prefix, ns.uri);
  };
  this.uriByPrefix = function(prefix2) {
    return prefixMap[prefix2 || "xmlns"];
  };
  this.mapPrefix = function(prefix2, uri2) {
    prefixMap[prefix2 || "xmlns"] = uri2;
  };
  this.logUsed = function(ns) {
    var uri2 = ns.uri;
    used[uri2] = this.byUri(uri2);
  };
  this.getUsed = function(ns) {
    function isUsed(ns2) {
      return used[ns2.uri];
    }
    var allNs = [].concat(wellknown, custom);
    return allNs.filter(isUsed);
  };
}
function lower2(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}
function nameToAlias2(name2, pkg) {
  if (hasLowerCaseAlias2(pkg)) {
    return lower2(name2);
  } else {
    return name2;
  }
}
function inherits2(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}
function nsName2(ns) {
  if ((0, import_min_dash9.isString)(ns)) {
    return ns;
  } else {
    return (ns.prefix ? ns.prefix + ":" : "") + ns.localName;
  }
}
function getNsAttrs2(namespaces) {
  return (0, import_min_dash9.map)(namespaces.getUsed(), function(ns) {
    var name2 = "xmlns" + (ns.prefix ? ":" + ns.prefix : "");
    return { name: name2, value: ns.uri };
  });
}
function getElementNs2(ns, descriptor) {
  if (descriptor.isGeneric) {
    return (0, import_min_dash9.assign)({ localName: descriptor.ns.localName }, ns);
  } else {
    return (0, import_min_dash9.assign)({ localName: nameToAlias2(descriptor.ns.localName, descriptor.$pkg) }, ns);
  }
}
function getPropertyNs2(ns, descriptor) {
  return (0, import_min_dash9.assign)({ localName: descriptor.ns.localName }, ns);
}
function getSerializableProperties2(element) {
  var descriptor = element.$descriptor;
  return (0, import_min_dash9.filter)(descriptor.properties, function(p) {
    var name2 = p.name;
    if (p.isVirtual) {
      return false;
    }
    if (!element.hasOwnProperty(name2)) {
      return false;
    }
    var value = element[name2];
    if (value === p.default) {
      return false;
    }
    if (value === null) {
      return false;
    }
    return p.isMany ? value.length : true;
  });
}
var ESCAPE_ATTR_MAP2 = {
  "\n": "#10",
  "\n\r": "#10",
  '"': "#34",
  "'": "#39",
  "<": "#60",
  ">": "#62",
  "&": "#38"
};
var ESCAPE_MAP2 = {
  "<": "lt",
  ">": "gt",
  "&": "amp"
};
function escape2(str, charPattern, replaceMap) {
  str = (0, import_min_dash9.isString)(str) ? str : "" + str;
  return str.replace(charPattern, function(s) {
    return "&" + replaceMap[s] + ";";
  });
}
function escapeAttr2(str) {
  return escape2(str, ESCAPE_ATTR_CHARS2, ESCAPE_ATTR_MAP2);
}
function escapeBody2(str) {
  return escape2(str, ESCAPE_CHARS2, ESCAPE_MAP2);
}
function filterAttributes2(props) {
  return (0, import_min_dash9.filter)(props, function(p) {
    return p.isAttr;
  });
}
function filterContained2(props) {
  return (0, import_min_dash9.filter)(props, function(p) {
    return !p.isAttr;
  });
}
function ReferenceSerializer2(tagName) {
  this.tagName = tagName;
}
ReferenceSerializer2.prototype.build = function(element) {
  this.element = element;
  return this;
};
ReferenceSerializer2.prototype.serializeTo = function(writer) {
  writer.appendIndent().append("<" + this.tagName + ">" + this.element.id + "</" + this.tagName + ">").appendNewLine();
};
function BodySerializer2() {
}
BodySerializer2.prototype.serializeValue = BodySerializer2.prototype.serializeTo = function(writer) {
  writer.append(
    this.escape ? escapeBody2(this.value) : this.value
  );
};
BodySerializer2.prototype.build = function(prop, value) {
  this.value = value;
  if (prop.type === "String" && value.search(ESCAPE_CHARS2) !== -1) {
    this.escape = true;
  }
  return this;
};
function ValueSerializer2(tagName) {
  this.tagName = tagName;
}
inherits2(ValueSerializer2, BodySerializer2);
ValueSerializer2.prototype.serializeTo = function(writer) {
  writer.appendIndent().append("<" + this.tagName + ">");
  this.serializeValue(writer);
  writer.append("</" + this.tagName + ">").appendNewLine();
};
function ElementSerializer2(parent, propertyDescriptor) {
  this.body = [];
  this.attrs = [];
  this.parent = parent;
  this.propertyDescriptor = propertyDescriptor;
}
ElementSerializer2.prototype.build = function(element) {
  this.element = element;
  var elementDescriptor = element.$descriptor, propertyDescriptor = this.propertyDescriptor;
  var otherAttrs, properties;
  var isGeneric = elementDescriptor.isGeneric;
  if (isGeneric) {
    otherAttrs = this.parseGeneric(element);
  } else {
    otherAttrs = this.parseNsAttributes(element);
  }
  if (propertyDescriptor) {
    this.ns = this.nsPropertyTagName(propertyDescriptor);
  } else {
    this.ns = this.nsTagName(elementDescriptor);
  }
  this.tagName = this.addTagName(this.ns);
  if (!isGeneric) {
    properties = getSerializableProperties2(element);
    this.parseAttributes(filterAttributes2(properties));
    this.parseContainments(filterContained2(properties));
  }
  this.parseGenericAttributes(element, otherAttrs);
  return this;
};
ElementSerializer2.prototype.nsTagName = function(descriptor) {
  var effectiveNs = this.logNamespaceUsed(descriptor.ns);
  return getElementNs2(effectiveNs, descriptor);
};
ElementSerializer2.prototype.nsPropertyTagName = function(descriptor) {
  var effectiveNs = this.logNamespaceUsed(descriptor.ns);
  return getPropertyNs2(effectiveNs, descriptor);
};
ElementSerializer2.prototype.isLocalNs = function(ns) {
  return ns.uri === this.ns.uri;
};
ElementSerializer2.prototype.nsAttributeName = function(element) {
  var ns;
  if ((0, import_min_dash9.isString)(element)) {
    ns = parseName2(element);
  } else {
    ns = element.ns;
  }
  if (element.inherited) {
    return { localName: ns.localName };
  }
  var effectiveNs = this.logNamespaceUsed(ns);
  this.getNamespaces().logUsed(effectiveNs);
  if (this.isLocalNs(effectiveNs)) {
    return { localName: ns.localName };
  } else {
    return (0, import_min_dash9.assign)({ localName: ns.localName }, effectiveNs);
  }
};
ElementSerializer2.prototype.parseGeneric = function(element) {
  var self = this, body = this.body;
  var attributes = [];
  (0, import_min_dash9.forEach)(element, function(val, key) {
    var nonNsAttr;
    if (key === "$body") {
      body.push(new BodySerializer2().build({ type: "String" }, val));
    } else if (key === "$children") {
      (0, import_min_dash9.forEach)(val, function(child) {
        body.push(new ElementSerializer2(self).build(child));
      });
    } else if (key.indexOf("$") !== 0) {
      nonNsAttr = self.parseNsAttribute(element, key, val);
      if (nonNsAttr) {
        attributes.push({ name: key, value: val });
      }
    }
  });
  return attributes;
};
ElementSerializer2.prototype.parseNsAttribute = function(element, name2, value) {
  var model = element.$model;
  var nameNs = parseName2(name2);
  var ns;
  if (nameNs.prefix === "xmlns") {
    ns = { prefix: nameNs.localName, uri: value };
  }
  if (!nameNs.prefix && nameNs.localName === "xmlns") {
    ns = { uri: value };
  }
  if (!ns) {
    return {
      name: name2,
      value
    };
  }
  if (model && model.getPackage(value)) {
    this.logNamespace(ns, true, true);
  } else {
    var actualNs = this.logNamespaceUsed(ns, true);
    this.getNamespaces().logUsed(actualNs);
  }
};
ElementSerializer2.prototype.parseNsAttributes = function(element, attrs) {
  var self = this;
  var genericAttrs = element.$attrs;
  var attributes = [];
  (0, import_min_dash9.forEach)(genericAttrs, function(value, name2) {
    var nonNsAttr = self.parseNsAttribute(element, name2, value);
    if (nonNsAttr) {
      attributes.push(nonNsAttr);
    }
  });
  return attributes;
};
ElementSerializer2.prototype.parseGenericAttributes = function(element, attributes) {
  var self = this;
  (0, import_min_dash9.forEach)(attributes, function(attr) {
    if (attr.name === XSI_TYPE) {
      return;
    }
    try {
      self.addAttribute(self.nsAttributeName(attr.name), attr.value);
    } catch (e) {
      console.warn(
        "missing namespace information for ",
        attr.name,
        "=",
        attr.value,
        "on",
        element,
        e
      );
    }
  });
};
ElementSerializer2.prototype.parseContainments = function(properties) {
  var self = this, body = this.body, element = this.element;
  (0, import_min_dash9.forEach)(properties, function(p) {
    var value = element.get(p.name), isReference = p.isReference, isMany = p.isMany;
    if (!isMany) {
      value = [value];
    }
    if (p.isBody) {
      body.push(new BodySerializer2().build(p, value[0]));
    } else if (isSimple2(p.type)) {
      (0, import_min_dash9.forEach)(value, function(v) {
        body.push(new ValueSerializer2(self.addTagName(self.nsPropertyTagName(p))).build(p, v));
      });
    } else if (isReference) {
      (0, import_min_dash9.forEach)(value, function(v) {
        body.push(new ReferenceSerializer2(self.addTagName(self.nsPropertyTagName(p))).build(v));
      });
    } else {
      var asType = serializeAsType(p), asProperty = serializeAsProperty(p);
      (0, import_min_dash9.forEach)(value, function(v) {
        var serializer;
        if (asType) {
          serializer = new TypeSerializer2(self, p);
        } else if (asProperty) {
          serializer = new ElementSerializer2(self, p);
        } else {
          serializer = new ElementSerializer2(self);
        }
        body.push(serializer.build(v));
      });
    }
  });
};
ElementSerializer2.prototype.getNamespaces = function(local) {
  var namespaces = this.namespaces, parent = this.parent, parentNamespaces;
  if (!namespaces) {
    parentNamespaces = parent && parent.getNamespaces();
    if (local || !parentNamespaces) {
      this.namespaces = namespaces = new Namespaces2(parentNamespaces);
    } else {
      namespaces = parentNamespaces;
    }
  }
  return namespaces;
};
ElementSerializer2.prototype.logNamespace = function(ns, wellknown, local) {
  var namespaces = this.getNamespaces(local);
  var nsUri = ns.uri, nsPrefix = ns.prefix;
  var existing = namespaces.byUri(nsUri);
  if (!existing) {
    namespaces.add(ns, wellknown);
  }
  namespaces.mapPrefix(nsPrefix, nsUri);
  return ns;
};
ElementSerializer2.prototype.logNamespaceUsed = function(ns, local) {
  var element = this.element, model = element.$model, namespaces = this.getNamespaces(local);
  var prefix2 = ns.prefix, uri2 = ns.uri, newPrefix, idx, wellknownUri;
  if (!prefix2 && !uri2) {
    return { localName: ns.localName };
  }
  wellknownUri = DEFAULT_NS_MAP2[prefix2] || model && (model.getPackage(prefix2) || {}).uri;
  uri2 = uri2 || wellknownUri || namespaces.uriByPrefix(prefix2);
  if (!uri2) {
    throw new Error("no namespace uri given for prefix <" + prefix2 + ">");
  }
  ns = namespaces.byUri(uri2);
  if (!ns) {
    newPrefix = prefix2;
    idx = 1;
    while (namespaces.uriByPrefix(newPrefix)) {
      newPrefix = prefix2 + "_" + idx++;
    }
    ns = this.logNamespace({ prefix: newPrefix, uri: uri2 }, wellknownUri === uri2);
  }
  if (prefix2) {
    namespaces.mapPrefix(prefix2, uri2);
  }
  return ns;
};
ElementSerializer2.prototype.parseAttributes = function(properties) {
  var self = this, element = this.element;
  (0, import_min_dash9.forEach)(properties, function(p) {
    var value = element.get(p.name);
    if (p.isReference) {
      if (!p.isMany) {
        value = value.id;
      } else {
        var values = [];
        (0, import_min_dash9.forEach)(value, function(v) {
          values.push(v.id);
        });
        value = values.join(" ");
      }
    }
    self.addAttribute(self.nsAttributeName(p), value);
  });
};
ElementSerializer2.prototype.addTagName = function(nsTagName) {
  var actualNs = this.logNamespaceUsed(nsTagName);
  this.getNamespaces().logUsed(actualNs);
  return nsName2(nsTagName);
};
ElementSerializer2.prototype.addAttribute = function(name2, value) {
  var attrs = this.attrs;
  if ((0, import_min_dash9.isString)(value)) {
    value = escapeAttr2(value);
  }
  attrs.push({ name: name2, value });
};
ElementSerializer2.prototype.serializeAttributes = function(writer) {
  var attrs = this.attrs, namespaces = this.namespaces;
  if (namespaces) {
    attrs = getNsAttrs2(namespaces).concat(attrs);
  }
  (0, import_min_dash9.forEach)(attrs, function(a) {
    writer.append(" ").append(nsName2(a.name)).append('="').append(a.value).append('"');
  });
};
ElementSerializer2.prototype.serializeTo = function(writer) {
  var firstBody = this.body[0], indent = firstBody && firstBody.constructor !== BodySerializer2;
  writer.appendIndent().append("<" + this.tagName);
  this.serializeAttributes(writer);
  writer.append(firstBody ? ">" : " />");
  if (firstBody) {
    if (indent) {
      writer.appendNewLine().indent();
    }
    (0, import_min_dash9.forEach)(this.body, function(b) {
      b.serializeTo(writer);
    });
    if (indent) {
      writer.unindent().appendIndent();
    }
    writer.append("</" + this.tagName + ">");
  }
  writer.appendNewLine();
};
function TypeSerializer2(parent, propertyDescriptor) {
  ElementSerializer2.call(this, parent, propertyDescriptor);
}
inherits2(TypeSerializer2, ElementSerializer2);
TypeSerializer2.prototype.parseNsAttributes = function(element) {
  var attributes = ElementSerializer2.prototype.parseNsAttributes.call(this, element);
  var descriptor = element.$descriptor;
  if (descriptor.name === this.propertyDescriptor.type) {
    return attributes;
  }
  var typeNs = this.typeNs = this.nsTagName(descriptor);
  this.getNamespaces().logUsed(this.typeNs);
  var pkg = element.$model.getPackage(typeNs.uri), typePrefix = pkg.xml && pkg.xml.typePrefix || "";
  this.addAttribute(
    this.nsAttributeName(XSI_TYPE),
    (typeNs.prefix ? typeNs.prefix + ":" : "") + typePrefix + descriptor.ns.localName
  );
  return attributes;
};
TypeSerializer2.prototype.isLocalNs = function(ns) {
  return ns.uri === (this.typeNs || this.ns).uri;
};
function SavingWriter2() {
  this.value = "";
  this.write = function(str) {
    this.value += str;
  };
}
function FormatingWriter2(out, format) {
  var indent = [""];
  this.append = function(str) {
    out.write(str);
    return this;
  };
  this.appendNewLine = function() {
    if (format) {
      out.write("\n");
    }
    return this;
  };
  this.appendIndent = function() {
    if (format) {
      out.write(indent.join("  "));
    }
    return this;
  };
  this.indent = function() {
    indent.push("");
    return this;
  };
  this.unindent = function() {
    indent.pop();
    return this;
  };
}
function Writer2(options) {
  options = (0, import_min_dash9.assign)({ format: false, preamble: true }, options || {});
  function toXML(tree, writer) {
    var internalWriter = writer || new SavingWriter2();
    var formatingWriter = new FormatingWriter2(internalWriter, options.format);
    if (options.preamble) {
      formatingWriter.append(XML_PREAMBLE2);
    }
    new ElementSerializer2().build(tree).serializeTo(formatingWriter);
    if (!writer) {
      return internalWriter.value;
    }
  }
  return {
    toXML
  };
}

// node_modules/cmmn-moddle/lib/cmmn-moddle.js
function CmmnModdle(packages3, options) {
  Moddle2.call(this, packages3, options);
}
CmmnModdle.prototype = Object.create(Moddle2.prototype);
CmmnModdle.prototype.fromXML = function(xmlStr, typeName, options, done) {
  if (!(0, import_min_dash10.isString)(typeName)) {
    done = options;
    options = typeName;
    typeName = "cmmn:Definitions";
  }
  if ((0, import_min_dash10.isFunction)(options)) {
    done = options;
    options = {};
  }
  var reader = new Reader2((0, import_min_dash10.assign)({ model: this, lax: true }, options));
  var rootHandler = reader.handler(typeName);
  reader.fromXML(xmlStr, rootHandler, done);
};
CmmnModdle.prototype.toXML = function(element, options, done) {
  if ((0, import_min_dash10.isFunction)(options)) {
    done = options;
    options = {};
  }
  var writer = new Writer2(options);
  var result;
  var err;
  try {
    result = writer.toXML(element);
  } catch (e) {
    err = e;
  }
  return done(err, result);
};

// node_modules/cmmn-moddle/resources/cmmn/json/cmmn.json
var cmmn_default = {
  name: "CMMN",
  uri: "http://www.omg.org/spec/CMMN/20151109/MODEL",
  types: [
    {
      name: "ApplicabilityRule",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "condition",
          type: "Expression",
          xml: {
            serialize: "property"
          }
        },
        {
          name: "contextRef",
          type: "CaseFileItem",
          isAttr: true,
          isReference: true
        },
        {
          name: "name",
          isAttr: true,
          type: "String"
        }
      ]
    },
    {
      name: "Artifact",
      isAbstract: true,
      superClass: [
        "CMMNElement"
      ]
    },
    {
      name: "Association",
      superClass: [
        "Artifact"
      ],
      properties: [
        {
          name: "associationDirection",
          type: "AssociationDirection",
          isAttr: true
        },
        {
          name: "sourceRef",
          type: "CMMNElement",
          isAttr: true,
          isReference: true
        },
        {
          name: "targetRef",
          type: "CMMNElement",
          isAttr: true,
          isReference: true
        }
      ]
    },
    {
      name: "TextAnnotation",
      superClass: [
        "Artifact"
      ],
      properties: [
        {
          name: "text",
          type: "String"
        },
        {
          name: "textFormat",
          default: "text/plain",
          isAttr: true,
          type: "String"
        }
      ]
    },
    {
      name: "ManualActivationRule",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "condition",
          type: "Expression",
          xml: {
            serialize: "property"
          }
        },
        {
          name: "name",
          isAttr: true,
          type: "String"
        },
        {
          name: "contextRef",
          type: "CaseFileItem",
          isAttr: true,
          isReference: true
        }
      ]
    },
    {
      name: "Case",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "name",
          isAttr: true,
          type: "String"
        },
        {
          name: "caseFileModel",
          type: "CaseFile",
          xml: {
            serialize: "property"
          }
        },
        {
          name: "casePlanModel",
          type: "Stage",
          xml: {
            serialize: "property"
          }
        },
        {
          name: "caseRoles",
          type: "CaseRoles"
        },
        {
          name: "input",
          type: "CaseParameter",
          isMany: true,
          xml: {
            serialize: "property"
          }
        },
        {
          name: "output",
          type: "CaseParameter",
          isMany: true,
          xml: {
            serialize: "property"
          }
        }
      ]
    },
    {
      name: "CaseFile",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "caseFileItems",
          type: "CaseFileItem",
          isMany: true
        }
      ]
    },
    {
      name: "CaseFileItem",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "name",
          isAttr: true,
          type: "String"
        },
        {
          name: "multiplicity",
          type: "String",
          isAttr: true,
          default: "Unspecified"
        },
        {
          name: "definitionRef",
          type: "CaseFileItemDefinition",
          isAttr: true,
          isReference: true
        },
        {
          name: "sourceRef",
          type: "CaseFileItem",
          isAttr: true,
          isReference: true
        },
        {
          name: "targetRefs",
          type: "CaseFileItem",
          isAttr: true,
          isReference: true,
          isMany: true
        },
        {
          name: "children",
          type: "Children",
          xml: {
            serialize: "property"
          }
        }
      ]
    },
    {
      name: "CaseFileItemDefinition",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "name",
          isAttr: true,
          type: "String"
        },
        {
          name: "definitionType",
          type: "String",
          default: "http://www.omg.org/spec/CMMN/DefinitionType/Unspecified",
          isAttr: true
        },
        {
          name: "properties",
          type: "Property",
          isMany: true
        },
        {
          name: "structureRef",
          type: "String",
          isAttr: true
        },
        {
          name: "importRef",
          type: "Import",
          isAttr: true,
          isReference: true
        }
      ]
    },
    {
      name: "CaseFileItemOnPart",
      superClass: [
        "OnPart"
      ],
      properties: [
        {
          name: "standardEvent",
          type: "String"
        },
        {
          name: "sourceRef",
          type: "CaseFileItem",
          isAttr: true,
          isReference: true
        }
      ]
    },
    {
      name: "CaseParameter",
      superClass: [
        "Parameter"
      ],
      properties: [
        {
          name: "bindingRef",
          type: "CaseFileItem",
          isAttr: true,
          isReference: true
        },
        {
          name: "bindingRefinement",
          type: "Expression",
          xml: {
            serialize: "property"
          }
        }
      ]
    },
    {
      name: "CaseRoles",
      superClass: [
        "Parameter"
      ],
      properties: [
        {
          name: "role",
          type: "Role",
          isMany: true
        }
      ]
    },
    {
      name: "CaseTask",
      superClass: [
        "Task"
      ],
      properties: [
        {
          name: "parameterMapping",
          type: "ParameterMapping",
          isMany: true
        },
        {
          name: "caseRefExpression",
          type: "Expression",
          xml: {
            serialize: "property"
          }
        },
        {
          name: "caseRef",
          type: "String",
          isAttr: true
        }
      ]
    },
    {
      name: "Children",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "caseFileItems",
          type: "CaseFileItem",
          isMany: true
        }
      ]
    },
    {
      name: "CMMNElement",
      isAbstract: true,
      properties: [
        {
          name: "id",
          isAttr: true,
          type: "String",
          isId: true
        },
        {
          name: "documentation",
          type: "Documentation",
          isMany: true
        },
        {
          name: "extensionElements",
          type: "ExtensionElements"
        },
        {
          name: "extensionDefinitions",
          type: "ExtensionDefinition",
          isReference: true,
          isMany: true
        }
      ]
    },
    {
      name: "Definitions",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "name",
          isAttr: true,
          type: "String"
        },
        {
          name: "targetNamespace",
          type: "String",
          isAttr: true
        },
        {
          name: "expressionLanguage",
          type: "String",
          isAttr: true,
          default: "http://www.w3.org/1999/XPath"
        },
        {
          name: "exporter",
          isAttr: true,
          type: "String"
        },
        {
          name: "exporterVersion",
          isAttr: true,
          type: "String"
        },
        {
          name: "author",
          isAttr: true,
          type: "String"
        },
        {
          name: "creationDate",
          type: "DateTime",
          isAttr: true
        },
        {
          name: "imports",
          type: "Import",
          isMany: true
        },
        {
          name: "caseFileItemDefinitions",
          type: "CaseFileItemDefinition",
          isMany: true
        },
        {
          name: "cases",
          type: "Case",
          isMany: true
        },
        {
          name: "processes",
          type: "Process",
          isMany: true
        },
        {
          name: "decisions",
          type: "Decision",
          isMany: true
        },
        {
          name: "extensions",
          type: "Extension",
          isMany: true
        },
        {
          name: "relationships",
          type: "Relationship",
          isMany: true
        },
        {
          name: "artifacts",
          type: "Artifact",
          isMany: true
        },
        {
          name: "CMMNDI",
          type: "cmmndi:CMMNDI"
        }
      ]
    },
    {
      name: "DiscretionaryItem",
      superClass: [
        "TableItem"
      ],
      properties: [
        {
          name: "itemControl",
          type: "PlanItemControl",
          xml: {
            serialize: "property"
          }
        },
        {
          name: "definitionRef",
          type: "PlanItemDefinition",
          isAttr: true,
          isReference: true
        },
        {
          name: "name",
          isAttr: true,
          type: "String"
        },
        {
          name: "entryCriteria",
          type: "EntryCriterion",
          isMany: true
        },
        {
          name: "exitCriteria",
          type: "ExitCriterion",
          isMany: true
        }
      ]
    },
    {
      name: "EventListener",
      superClass: [
        "PlanItemDefinition"
      ]
    },
    {
      name: "Expression",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "language",
          type: "String",
          isAttr: true
        },
        {
          name: "body",
          isBody: true,
          type: "String"
        }
      ]
    },
    {
      name: "HumanTask",
      superClass: [
        "Task"
      ],
      properties: [
        {
          name: "planningTable",
          type: "PlanningTable"
        },
        {
          name: "performerRef",
          type: "Role",
          isAttr: true,
          isReference: true
        }
      ]
    },
    {
      name: "IfPart",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "contextRef",
          type: "CaseFileItem",
          isAttr: true,
          isReference: true
        },
        {
          name: "condition",
          type: "Expression",
          xml: {
            serialize: "property"
          }
        }
      ]
    },
    {
      name: "Import",
      properties: [
        {
          name: "location",
          isAttr: true,
          type: "String"
        },
        {
          name: "namespace",
          type: "String",
          isAttr: true
        },
        {
          name: "importType",
          isAttr: true,
          type: "String"
        }
      ]
    },
    {
      name: "Milestone",
      superClass: [
        "PlanItemDefinition"
      ]
    },
    {
      name: "On",
      isAbstract: true,
      superClass: [
        "CMMNElement"
      ]
    },
    {
      name: "OnPart",
      isAbstract: true,
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "name",
          isAttr: true,
          type: "String"
        }
      ]
    },
    {
      name: "Parameter",
      isAbstract: true,
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "name",
          isAttr: true,
          type: "String"
        }
      ]
    },
    {
      name: "ParameterMapping",
      properties: [
        {
          name: "sourceRef",
          type: "Parameter",
          isAttr: true,
          isReference: true
        },
        {
          name: "targetRef",
          type: "Parameter",
          isAttr: true,
          isReference: true
        },
        {
          name: "transformation",
          type: "Expression",
          xml: {
            serialize: "property"
          }
        }
      ]
    },
    {
      name: "PlanFragment",
      superClass: [
        "PlanItemDefinition"
      ],
      properties: [
        {
          name: "planItems",
          type: "PlanItem",
          isMany: true
        },
        {
          name: "sentries",
          type: "Sentry",
          isMany: true
        }
      ]
    },
    {
      name: "PlanItem",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "name",
          isAttr: true,
          type: "String"
        },
        {
          name: "definitionRef",
          type: "PlanItemDefinition",
          isAttr: true,
          isReference: true
        },
        {
          name: "itemControl",
          type: "PlanItemControl",
          xml: {
            serialize: "property"
          }
        },
        {
          name: "entryCriteria",
          type: "EntryCriterion",
          isMany: true
        },
        {
          name: "exitCriteria",
          type: "ExitCriterion",
          isMany: true
        }
      ]
    },
    {
      name: "PlanItemControl",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "repetitionRule",
          type: "RepetitionRule"
        },
        {
          name: "requiredRule",
          type: "RequiredRule"
        },
        {
          name: "manualActivationRule",
          type: "ManualActivationRule"
        }
      ]
    },
    {
      name: "PlanItemDefinition",
      isAbstract: true,
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "name",
          isAttr: true,
          type: "String"
        },
        {
          name: "defaultControl",
          type: "PlanItemControl",
          xml: {
            serialize: "property"
          }
        }
      ]
    },
    {
      name: "PlanItemOnPart",
      superClass: [
        "OnPart"
      ],
      properties: [
        {
          name: "standardEvent",
          type: "String"
        },
        {
          name: "sourceRef",
          type: "PlanItem",
          isAttr: true,
          isReference: true
        },
        {
          name: "exitCriterionRef",
          type: "ExitCriterion",
          isAttr: true,
          isReference: true
        }
      ]
    },
    {
      name: "PlanningTable",
      superClass: [
        "TableItem"
      ],
      properties: [
        {
          name: "tableItems",
          type: "TableItem",
          isMany: true
        },
        {
          name: "applicabilityRules",
          type: "ApplicabilityRule",
          isMany: true
        }
      ]
    },
    {
      name: "Process",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "name",
          isAttr: true,
          type: "String"
        },
        {
          name: "implementationType",
          type: "String",
          isAttr: true,
          default: "http://www.omg.org/spec/CMMN/ProcessType/Unspecified"
        },
        {
          name: "externalRef",
          type: "String",
          isAttr: true
        },
        {
          name: "input",
          type: "ProcessParameter",
          isMany: true,
          xml: {
            serialize: "property"
          }
        },
        {
          name: "output",
          type: "ProcessParameter",
          isMany: true,
          xml: {
            serialize: "property"
          }
        }
      ]
    },
    {
      name: "ProcessParameter",
      superClass: [
        "Parameter"
      ]
    },
    {
      name: "ProcessTask",
      superClass: [
        "Task"
      ],
      properties: [
        {
          name: "parameterMapping",
          type: "ParameterMapping",
          isMany: true
        },
        {
          name: "processRefExpression",
          type: "Expression",
          xml: {
            serialize: "property"
          }
        },
        {
          name: "processRef",
          type: "String",
          isAttr: true
        }
      ]
    },
    {
      name: "Property",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "name",
          isAttr: true,
          type: "String"
        },
        {
          name: "type",
          type: "String",
          isAttr: true,
          default: "http://www.omg.org/spec/CMMN/PropertyType/Unspecified"
        }
      ]
    },
    {
      name: "RepetitionRule",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "condition",
          type: "Expression",
          xml: {
            serialize: "property"
          }
        },
        {
          name: "name",
          isAttr: true,
          type: "String"
        },
        {
          name: "contextRef",
          type: "CaseFileItem",
          isAttr: true,
          isReference: true
        }
      ]
    },
    {
      name: "RequiredRule",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "condition",
          type: "Expression",
          xml: {
            serialize: "property"
          }
        },
        {
          name: "name",
          isAttr: true,
          type: "String"
        },
        {
          name: "contextRef",
          type: "CaseFileItem",
          isAttr: true,
          isReference: true
        }
      ]
    },
    {
      name: "Role",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "name",
          isAttr: true,
          type: "String"
        }
      ]
    },
    {
      name: "Sentry",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "onParts",
          type: "OnPart",
          isMany: true
        },
        {
          name: "ifPart",
          type: "IfPart"
        },
        {
          name: "name",
          isAttr: true,
          type: "String"
        }
      ]
    },
    {
      name: "Stage",
      superClass: [
        "PlanFragment"
      ],
      properties: [
        {
          name: "planningTable",
          type: "PlanningTable"
        },
        {
          name: "planItemDefinitions",
          type: "PlanItemDefinition",
          isMany: true
        },
        {
          name: "autoComplete",
          isAttr: true,
          type: "Boolean"
        },
        {
          name: "exitCriteria",
          type: "ExitCriterion",
          isMany: true
        }
      ]
    },
    {
      name: "TableItem",
      isAbstract: true,
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "authorizedRoleRefs",
          type: "Role",
          isAttr: true,
          isReference: true,
          isMany: true
        },
        {
          name: "applicabilityRuleRefs",
          type: "ApplicabilityRule",
          isAttr: true,
          isReference: true,
          isMany: true
        }
      ]
    },
    {
      name: "Task",
      superClass: [
        "PlanItemDefinition"
      ],
      properties: [
        {
          name: "input",
          type: "CaseParameter",
          isMany: true,
          xml: {
            serialize: "property"
          }
        },
        {
          name: "output",
          type: "CaseParameter",
          isMany: true,
          xml: {
            serialize: "property"
          }
        },
        {
          name: "isBlocking",
          isAttr: true,
          default: true,
          type: "Boolean"
        }
      ]
    },
    {
      name: "TimerEventListener",
      superClass: [
        "EventListener"
      ],
      properties: [
        {
          name: "timerExpression",
          type: "Expression",
          xml: {
            serialize: "property"
          }
        },
        {
          name: "timerStart",
          type: "StartTrigger"
        }
      ]
    },
    {
      name: "UserEventListener",
      superClass: [
        "EventListener"
      ],
      properties: [
        {
          name: "authorizedRoleRefs",
          type: "Role",
          isMany: true,
          isAttr: true
        }
      ]
    },
    {
      name: "DateTime",
      superClass: []
    },
    {
      name: "StartTrigger",
      isAbstract: true,
      superClass: [
        "CMMNElement"
      ]
    },
    {
      name: "PlanItemStartTrigger",
      superClass: [
        "StartTrigger"
      ],
      properties: [
        {
          name: "standardEvent",
          type: "String",
          isAttr: true
        },
        {
          name: "sourceRef",
          type: "PlanItem",
          isAttr: true,
          isReference: true
        }
      ]
    },
    {
      name: "CaseFileItemStartTrigger",
      superClass: [
        "StartTrigger"
      ],
      properties: [
        {
          name: "standardEvent",
          type: "String",
          isAttr: true
        },
        {
          name: "sourceRef",
          type: "CaseFileItem",
          isAttr: true,
          isReference: true
        }
      ]
    },
    {
      name: "Extension",
      properties: [
        {
          name: "mustUnderstand",
          default: false,
          isAttr: true,
          type: "Boolean"
        },
        {
          name: "definition",
          type: "ExtensionDefinition"
        }
      ]
    },
    {
      name: "ExtensionDefinition",
      properties: [
        {
          name: "name",
          isAttr: true,
          type: "String"
        },
        {
          name: "extensionAttributeDefinitions",
          type: "ExtensionAttributeDefinition",
          isMany: true
        }
      ]
    },
    {
      name: "ExtensionAttributeDefinition",
      properties: [
        {
          name: "name",
          isAttr: true,
          type: "String"
        },
        {
          name: "type",
          isAttr: true,
          type: "String"
        },
        {
          name: "isReference",
          isAttr: true,
          default: false,
          type: "Boolean"
        }
      ]
    },
    {
      name: "ExtensionElements",
      properties: [
        {
          name: "valueRef",
          isAttr: true,
          isReference: true,
          type: "Element"
        },
        {
          name: "values",
          type: "Element",
          isMany: true
        },
        {
          name: "extensionAttributeDefinition",
          type: "ExtensionAttributeDefinition",
          isAttr: true,
          isReference: true
        }
      ]
    },
    {
      name: "Relationship",
      properties: [
        {
          name: "type",
          isAttr: true,
          type: "String"
        },
        {
          name: "direction",
          type: "RelationshipDirection",
          isAttr: true
        },
        {
          name: "source",
          isMany: true,
          type: "Element"
        },
        {
          name: "target",
          isMany: true,
          type: "Element"
        }
      ]
    },
    {
      name: "Documentation",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "text",
          type: "String",
          isBody: true
        },
        {
          name: "textFormat",
          default: "text/plain",
          isAttr: true,
          type: "String"
        }
      ]
    },
    {
      name: "DecisionTask",
      superClass: [
        "Task"
      ],
      properties: [
        {
          name: "mappings",
          type: "ParameterMapping",
          isMany: true
        },
        {
          name: "decisionRef",
          type: "String",
          isAttr: true
        },
        {
          name: "decisionRefExpression",
          type: "Expression",
          xml: {
            serialize: "property"
          }
        }
      ]
    },
    {
      name: "Decision",
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "name",
          isAttr: true,
          type: "String"
        },
        {
          name: "implementationType",
          type: "String",
          isAttr: true,
          default: "http://www.omg.org/spec/CMMN/DecisionType/Unspecified"
        },
        {
          name: "input",
          type: "DecisionParameter",
          isMany: true,
          xml: {
            serialize: "property"
          }
        },
        {
          name: "output",
          type: "DecisionParameter",
          isMany: true,
          xml: {
            serialize: "property"
          }
        },
        {
          name: "externalRef",
          type: "String",
          isAttr: true
        }
      ]
    },
    {
      name: "DecisionParameter",
      superClass: [
        "Parameter"
      ]
    },
    {
      name: "Criterion",
      isAbstract: true,
      superClass: [
        "CMMNElement"
      ],
      properties: [
        {
          name: "name",
          isAttr: true,
          type: "String"
        },
        {
          name: "sentryRef",
          type: "Sentry",
          isAttr: true,
          isReference: true
        }
      ]
    },
    {
      name: "EntryCriterion",
      superClass: [
        "Criterion"
      ]
    },
    {
      name: "ExitCriterion",
      superClass: [
        "Criterion"
      ]
    }
  ],
  emumerations: [
    {
      name: "AssociationDirection",
      literalValues: [
        {
          name: "None"
        },
        {
          name: "One"
        },
        {
          name: "Both"
        }
      ]
    },
    {
      name: "CaseFileItemTransition",
      literalValues: [
        {
          name: "addChild"
        },
        {
          name: "addReference"
        },
        {
          name: "create"
        },
        {
          name: "delete"
        },
        {
          name: "removeChild"
        },
        {
          name: "removeReference"
        },
        {
          name: "replace"
        },
        {
          name: "update"
        }
      ]
    },
    {
      name: "MultiplicityEnum",
      literalValues: [
        {
          name: "ZeroOrOne"
        },
        {
          name: "ZeroOrMore"
        },
        {
          name: "ExactlyOne"
        },
        {
          name: "OneOrMore"
        },
        {
          name: "Unspecified"
        },
        {
          name: "Unknown"
        }
      ]
    },
    {
      name: "PlanItemTransition",
      literalValues: [
        {
          name: "close"
        },
        {
          name: "complete"
        },
        {
          name: "create"
        },
        {
          name: "disable"
        },
        {
          name: "enable"
        },
        {
          name: "exit"
        },
        {
          name: "fault"
        },
        {
          name: "manualStart"
        },
        {
          name: "occur"
        },
        {
          name: "parentResume"
        },
        {
          name: "parentSuspend"
        },
        {
          name: "reactivate"
        },
        {
          name: "reenable"
        },
        {
          name: "resume"
        },
        {
          name: "start"
        },
        {
          name: "suspend"
        },
        {
          name: "terminate"
        }
      ]
    },
    {
      name: "RelationshipDirection",
      literalValues: [
        {
          name: "None"
        },
        {
          name: "Forward"
        },
        {
          name: "Backward"
        },
        {
          name: "Both"
        }
      ]
    }
  ],
  associations: [],
  xml: {
    tagAlias: "lowerCase",
    typePrefix: "t"
  },
  prefix: "cmmn"
};

// node_modules/cmmn-moddle/resources/cmmn/json/cmmndi.json
var cmmndi_default = {
  name: "CMMNDI",
  uri: "http://www.omg.org/spec/CMMN/20151109/CMMNDI",
  types: [
    {
      name: "CMMNDI",
      properties: [
        {
          name: "diagrams",
          type: "CMMNDiagram",
          isMany: true
        },
        {
          name: "styles",
          type: "CMMNStyle",
          isMany: true
        }
      ]
    },
    {
      name: "CMMNDiagram",
      properties: [
        {
          name: "cmmnElementRef",
          isAttr: true,
          type: "cmmn:CMMNElement",
          isReference: true
        },
        {
          name: "Size",
          type: "dc:Dimension",
          xml: {
            serialize: "xsi:type"
          }
        },
        {
          name: "diagramElements",
          type: "CMMNDiagramElement",
          isMany: true
        }
      ],
      superClass: [
        "di:Diagram"
      ]
    },
    {
      name: "CMMNDiagramElement",
      superClass: [
        "di:DiagramElement"
      ]
    },
    {
      name: "CMMNShape",
      properties: [
        {
          name: "cmmnElementRef",
          isAttr: true,
          isReference: true,
          type: "cmmn:CMMNElement"
        },
        {
          name: "label",
          type: "CMMNLabel"
        },
        {
          name: "isCollapsed",
          isAttr: true,
          type: "Boolean"
        },
        {
          name: "isPlanningTableCollapsed",
          isAttr: true,
          type: "Boolean"
        }
      ],
      superClass: [
        "CMMNDiagramElement",
        "di:Shape"
      ]
    },
    {
      name: "CMMNEdge",
      properties: [
        {
          name: "label",
          type: "CMMNLabel"
        },
        {
          name: "cmmnElementRef",
          isAttr: true,
          isReference: true,
          type: "cmmn:CMMNElement"
        },
        {
          name: "sourceCMMNElementRef",
          isAttr: true,
          isReference: true,
          type: "cmmn:CMMNElement"
        },
        {
          name: "targetCMMNElementRef",
          isAttr: true,
          isReference: true,
          type: "cmmn:CMMNElement"
        },
        {
          name: "isStandardEventVisible",
          type: "Boolean",
          isAttr: true
        }
      ],
      superClass: [
        "CMMNDiagramElement",
        "di:Edge"
      ]
    },
    {
      name: "CMMNLabel",
      superClass: [
        "di:Shape"
      ]
    },
    {
      name: "CMMNStyle",
      properties: [
        {
          name: "FillColor",
          type: "dc:Color",
          xml: {
            serialize: "xsi:type"
          }
        },
        {
          name: "StrokeColor",
          type: "dc:Color",
          xml: {
            serialize: "xsi:type"
          }
        },
        {
          name: "FontColor",
          type: "dc:Color",
          xml: {
            serialize: "xsi:type"
          }
        },
        {
          name: "fontFamily",
          type: "String",
          isAttr: true
        },
        {
          name: "fontSize",
          type: "Real",
          isAttr: true
        },
        {
          name: "fontItalic",
          type: "Boolean",
          isAttr: true
        },
        {
          name: "fontBold",
          type: "Boolean",
          isAttr: true
        },
        {
          name: "fontUnderline",
          type: "Boolean",
          isAttr: true
        },
        {
          name: "fontStrikeThrough",
          type: "Boolean",
          isAttr: true
        }
      ],
      superClass: [
        "di:Style"
      ]
    }
  ],
  associations: [],
  prefix: "cmmndi"
};

// node_modules/cmmn-moddle/resources/cmmn/json/dc.json
var dc_default = {
  name: "DC",
  uri: "http://www.omg.org/spec/CMMN/20151109/DC",
  types: [
    {
      name: "rgb"
    },
    {
      name: "Real"
    },
    {
      name: "Color",
      properties: [
        {
          name: "red",
          type: "rgb",
          isAttr: true
        },
        {
          name: "green",
          type: "rgb",
          isAttr: true
        },
        {
          name: "blue",
          type: "rgb",
          isAttr: true
        }
      ]
    },
    {
      name: "Point",
      properties: [
        {
          name: "x",
          type: "Real",
          isAttr: true
        },
        {
          name: "y",
          type: "Real",
          isAttr: true
        }
      ]
    },
    {
      name: "Dimension",
      properties: [
        {
          name: "width",
          type: "Real",
          isAttr: true
        },
        {
          name: "height",
          type: "Real",
          isAttr: true
        }
      ]
    },
    {
      name: "Bounds",
      properties: [
        {
          name: "x",
          type: "Real",
          isAttr: true
        },
        {
          name: "y",
          type: "Real",
          isAttr: true
        },
        {
          name: "width",
          type: "Real",
          isAttr: true
        },
        {
          name: "height",
          type: "Real",
          isAttr: true
        }
      ]
    }
  ],
  prefix: "dc",
  associations: []
};

// node_modules/cmmn-moddle/resources/cmmn/json/di.json
var di_default = {
  name: "DI",
  uri: "http://www.omg.org/spec/CMMN/20151109/DI",
  types: [
    {
      name: "DiagramElement",
      isAbstract: true,
      properties: [
        {
          name: "extension",
          type: "Extension"
        },
        {
          name: "style",
          type: "Style"
        },
        {
          name: "sharedStyle",
          type: "Style",
          isReference: true,
          isAttr: true
        },
        {
          name: "id",
          type: "String",
          isAttr: true,
          isId: true
        }
      ]
    },
    {
      name: "Edge",
      isAbstract: true,
      superClass: [
        "DiagramElement"
      ],
      properties: [
        {
          name: "waypoint",
          isMany: true,
          type: "dc:Point",
          xml: {
            serialize: "xsi:type"
          }
        }
      ]
    },
    {
      name: "Diagram",
      isAbstract: true,
      superClass: [
        "DiagramElement"
      ],
      properties: [
        {
          name: "name",
          type: "String",
          isAttr: true
        },
        {
          name: "documentation",
          isAttr: true,
          type: "String"
        },
        {
          name: "resolution",
          isAttr: true,
          default: 300,
          type: "double"
        }
      ]
    },
    {
      name: "Shape",
      isAbstract: true,
      superClass: [
        "DiagramElement"
      ],
      properties: [
        {
          name: "bounds",
          type: "dc:Bounds"
        }
      ]
    },
    {
      name: "Style",
      isAbstract: true,
      properties: [
        {
          name: "extension",
          type: "Extension"
        },
        {
          name: "id",
          type: "String",
          isAttr: true,
          isId: true
        }
      ]
    },
    {
      name: "Extension",
      properties: [
        {
          name: "values",
          type: "Element",
          isMany: true
        }
      ]
    }
  ],
  associations: [],
  prefix: "di",
  xml: {
    tagAlias: "lowerCase"
  }
};

// node_modules/cmmn-moddle/lib/simple.js
var packages2 = {
  cmmn: cmmn_default,
  cmmndi: cmmndi_default,
  dc: dc_default,
  di: di_default
};
function simple_default(additionalPackages, options) {
  var pks = (0, import_min_dash11.assign)({}, packages2, additionalPackages);
  return new CmmnModdle(pks, options);
}

// test/editor-roundtrip.test.js
function readCmmn(moddle, xml2) {
  return new Promise((resolve, reject) => moddle.fromXML(xml2, {}, (error4, result) => error4 ? reject(error4) : resolve(result)));
}
function writeCmmn(moddle, element) {
  return new Promise((resolve, reject) => moddle.toXML(element, { format: true }, (error4, result) => error4 ? reject(error4) : resolve(result)));
}
test("BPMN round-trip preserves unknown Flowable extension data", async () => {
  const moddle = new SimpleBpmnModdle();
  const xml2 = '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:flowable="http://flowable.org/bpmn" xmlns:custom="urn:custom" id="definitions"><process id="process" flowable:historyLevel="audit"><extensionElements><custom:preserved value="yes"/></extensionElements><startEvent id="start"/></process></definitions>';
  const parsed = await moddle.fromXML(xml2);
  const output = (await moddle.toXML(parsed.rootElement, { format: true })).xml;
  assert.match(output, /flowable:historyLevel="audit"/);
  assert.match(output, /custom:preserved/);
});
test("CMMN round-trip preserves supported elements and unknown extension data", async () => {
  const moddle = new simple_default();
  const xml2 = '<cmmn:definitions xmlns:cmmn="http://www.omg.org/spec/CMMN/20151109/MODEL" id="definitions"></cmmn:definitions>';
  const parsed = await readCmmn(moddle, xml2);
  const cmmnCase = moddle.create("cmmn:Case", { id: "case" });
  parsed.get("cases").push(cmmnCase);
  const output = await writeCmmn(moddle, parsed);
  assert.match(output, /cmmn:case/);
  assert.match(output, /id="case"/);
});
test("modeler Save draft persists the current model and keeps advanced collaboration out of scope", async () => {
  const html = await readFile(new URL("../../src/main/resources/static/index.html", import.meta.url), "utf8");
  const modeler = await readFile(new URL("../../src/main/resources/static/modeler.js", import.meta.url), "utf8");
  assert.match(html, /id="save-draft"[^>]*>Save draft</);
  assert.match(modeler, /FlowablePlusEditor\.exportCurrent\(\)/);
  assert.match(modeler, /\/versions\?clientId=/);
  assert.match(modeler, /Draft saved/);
  assert.match(modeler, /Draft could not be saved/);
});
test("modeler workspace renders server state without sample project leakage", async () => {
  const html = await readFile(new URL("../../src/main/resources/static/index.html", import.meta.url), "utf8");
  const modeler = await readFile(new URL("../../src/main/resources/static/modeler.js", import.meta.url), "utf8");
  const css = await readFile(new URL("../../src/main/resources/static/modeler.css", import.meta.url), "utf8");
  assert.doesNotMatch(html, /Northstar Operations|Order intake|Customer onboarding/);
  assert.match(modeler, /history\.replaceState/);
  assert.match(modeler, /\/api\/modeler\/projects\?clientId=/);
  assert.match(modeler, /sessionStorage\.getItem\('flowableplus\.accessToken'\)/);
  assert.match(modeler, /method = .*'PUT'/);
  assert.match(modeler, /\/api\/modeler\/versions\/.*\/draft\?clientId=/);
  assert.match(modeler, /state === 'PUBLISHED'/);
  assert.match(css, /@media \(max-width: 640px\)/);
});
