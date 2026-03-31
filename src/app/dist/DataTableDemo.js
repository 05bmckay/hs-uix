(function(React2, react) {
  "use strict";
  const isRunningInWorker = () => typeof self !== "undefined" && self.__HUBSPOT_EXTENSION_WORKER__ === true;
  const fakeWorkerGlobals = {
    logger: {
      debug: (data) => {
        console.log(data);
      },
      info: (data) => {
        console.info(data);
      },
      warn: (data) => {
        console.warn(data);
      },
      error: (data) => {
        console.error(data);
      }
    },
    extend_V2: () => {
    },
    // @ts-expect-error we are not using the worker endpoint in tests env.
    __useExtensionContext: () => {
    }
  };
  const getWorkerGlobals = () => {
    return isRunningInWorker() ? self : fakeWorkerGlobals;
  };
  const extend_V2 = getWorkerGlobals().extend_V2;
  function serverless(name, options) {
    return self.serverless(name, options);
  }
  function fetch(url, options) {
    return self.hsFetch(url, options);
  }
  const hubspot = {
    extend: extend_V2,
    serverless,
    fetch
  };
  var ServerlessExecutionStatus;
  (function(ServerlessExecutionStatus2) {
    ServerlessExecutionStatus2["Success"] = "SUCCESS";
    ServerlessExecutionStatus2["Error"] = "ERROR";
  })(ServerlessExecutionStatus || (ServerlessExecutionStatus = {}));
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_development = {};
  var hasRequiredReactJsxRuntime_development;
  function requireReactJsxRuntime_development() {
    if (hasRequiredReactJsxRuntime_development) return reactJsxRuntime_development;
    hasRequiredReactJsxRuntime_development = 1;
    /**
     * @license React
     * react-jsx-runtime.development.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    {
      (function() {
        var React$1 = React2;
        var REACT_ELEMENT_TYPE = Symbol.for("react.element");
        var REACT_PORTAL_TYPE = Symbol.for("react.portal");
        var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
        var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
        var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
        var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
        var REACT_CONTEXT_TYPE = Symbol.for("react.context");
        var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = Symbol.for("react.memo");
        var REACT_LAZY_TYPE = Symbol.for("react.lazy");
        var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
        var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        var ReactSharedInternals = React$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        var enableScopeAPI = false;
        var enableCacheElement = false;
        var enableTransitionTracing = false;
        var enableLegacyHidden = false;
        var enableDebugTracing = false;
        var REACT_MODULE_REFERENCE;
        {
          REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
        }
        function isValidElementType(type) {
          if (typeof type === "string" || typeof type === "function") {
            return true;
          }
          if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
            return true;
          }
          if (typeof type === "object" && type !== null) {
            if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
            // types supported by any Flight configuration anywhere since
            // we don't know which Flight build this will end up being used
            // with.
            type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
              return true;
            }
          }
          return false;
        }
        function getWrappedName(outerType, innerType, wrapperName) {
          var displayName = outerType.displayName;
          if (displayName) {
            return displayName;
          }
          var functionName = innerType.displayName || innerType.name || "";
          return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
        }
        function getContextName(type) {
          return type.displayName || "Context";
        }
        function getComponentNameFromType(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                var outerName = type.displayName || null;
                if (outerName !== null) {
                  return outerName;
                }
                return getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        var assign = Object.assign;
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {
        }
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
              });
            }
            disabledDepth++;
          }
        }
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true
              };
              Object.defineProperties(console, {
                log: assign({}, props, {
                  value: prevLog
                }),
                info: assign({}, props, {
                  value: prevInfo
                }),
                warn: assign({}, props, {
                  value: prevWarn
                }),
                error: assign({}, props, {
                  value: prevError
                }),
                group: assign({}, props, {
                  value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                  value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                  value: prevGroupEnd
                })
              });
            }
            if (disabledDepth < 0) {
              error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }
          }
        }
        var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name, source, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x) {
                var match = x.stack.trim().match(/\n( *(at )?)/);
                prefix = match && match[1] || "";
              }
            }
            return "\n" + prefix + name;
          }
        }
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn, construct) {
          if (!fn || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher.current;
            ReactCurrentDispatcher.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x) {
                  control = x;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                control = x;
              }
              fn();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s = sampleLines.length - 1;
              var c = controlLines.length - 1;
              while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                c--;
              }
              for (; s >= 1 && c >= 0; s--, c--) {
                if (sampleLines[s] !== controlLines[c]) {
                  if (s !== 1 || c !== 1) {
                    do {
                      s--;
                      c--;
                      if (c < 0 || sampleLines[s] !== controlLines[c]) {
                        var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                        if (fn.displayName && _frame.includes("<anonymous>")) {
                          _frame = _frame.replace("<anonymous>", fn.displayName);
                        }
                        {
                          if (typeof fn === "function") {
                            componentFrameCache.set(fn, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn ? fn.displayName || fn.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn === "function") {
              componentFrameCache.set(fn, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        function describeFunctionComponentFrame(fn, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn, false);
          }
        }
        function shouldConstruct(Component) {
          var prototype = Component.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x) {
                }
              }
            }
          }
          return "";
        }
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame.setExtraStackFrame(null);
            }
          }
        }
        function checkPropTypes(typeSpecs, values, location, componentName, element) {
          {
            var has = Function.call.bind(hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                  setCurrentlyValidatingElement(null);
                }
                if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        function typeName(value) {
          {
            var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
            var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            return type;
          }
        }
        function willCoercionThrow(value) {
          {
            try {
              testStringCoercion(value);
              return false;
            } catch (e) {
              return true;
            }
          }
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          {
            if (willCoercionThrow(value)) {
              error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
        var RESERVED_PROPS = {
          key: true,
          ref: true,
          __self: true,
          __source: true
        };
        var specialPropKeyWarningShown;
        var specialPropRefWarningShown;
        function hasValidRef(config) {
          {
            if (hasOwnProperty.call(config, "ref")) {
              var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.ref !== void 0;
        }
        function hasValidKey(config) {
          {
            if (hasOwnProperty.call(config, "key")) {
              var getter = Object.getOwnPropertyDescriptor(config, "key").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.key !== void 0;
        }
        function warnIfStringRefCannotBeAutoConverted(config, self2) {
          {
            if (typeof config.ref === "string" && ReactCurrentOwner.current && self2) ;
          }
        }
        function defineKeyPropWarningGetter(props, displayName) {
          {
            var warnAboutAccessingKey = function() {
              if (!specialPropKeyWarningShown) {
                specialPropKeyWarningShown = true;
                error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            };
            warnAboutAccessingKey.isReactWarning = true;
            Object.defineProperty(props, "key", {
              get: warnAboutAccessingKey,
              configurable: true
            });
          }
        }
        function defineRefPropWarningGetter(props, displayName) {
          {
            var warnAboutAccessingRef = function() {
              if (!specialPropRefWarningShown) {
                specialPropRefWarningShown = true;
                error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            };
            warnAboutAccessingRef.isReactWarning = true;
            Object.defineProperty(props, "ref", {
              get: warnAboutAccessingRef,
              configurable: true
            });
          }
        }
        var ReactElement = function(type, key, ref, self2, source, owner, props) {
          var element = {
            // This tag allows us to uniquely identify this as a React Element
            $$typeof: REACT_ELEMENT_TYPE,
            // Built-in properties that belong on the element
            type,
            key,
            ref,
            props,
            // Record the component responsible for creating this element.
            _owner: owner
          };
          {
            element._store = {};
            Object.defineProperty(element._store, "validated", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false
            });
            Object.defineProperty(element, "_self", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: self2
            });
            Object.defineProperty(element, "_source", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: source
            });
            if (Object.freeze) {
              Object.freeze(element.props);
              Object.freeze(element);
            }
          }
          return element;
        };
        function jsxDEV(type, config, maybeKey, source, self2) {
          {
            var propName;
            var props = {};
            var key = null;
            var ref = null;
            if (maybeKey !== void 0) {
              {
                checkKeyStringCoercion(maybeKey);
              }
              key = "" + maybeKey;
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            if (hasValidRef(config)) {
              ref = config.ref;
              warnIfStringRefCannotBeAutoConverted(config, self2);
            }
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                props[propName] = config[propName];
              }
            }
            if (type && type.defaultProps) {
              var defaultProps = type.defaultProps;
              for (propName in defaultProps) {
                if (props[propName] === void 0) {
                  props[propName] = defaultProps[propName];
                }
              }
            }
            if (key || ref) {
              var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
              if (key) {
                defineKeyPropWarningGetter(props, displayName);
              }
              if (ref) {
                defineRefPropWarningGetter(props, displayName);
              }
            }
            return ReactElement(type, key, ref, self2, source, ReactCurrentOwner.current, props);
          }
        }
        var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
        var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement$1(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame$1.setExtraStackFrame(null);
            }
          }
        }
        var propTypesMisspellWarningShown;
        {
          propTypesMisspellWarningShown = false;
        }
        function isValidElement(object) {
          {
            return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
          }
        }
        function getDeclarationErrorAddendum() {
          {
            if (ReactCurrentOwner$1.current) {
              var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);
              if (name) {
                return "\n\nCheck the render method of `" + name + "`.";
              }
            }
            return "";
          }
        }
        function getSourceInfoErrorAddendum(source) {
          {
            return "";
          }
        }
        var ownerHasKeyUseWarning = {};
        function getCurrentComponentErrorInfo(parentType) {
          {
            var info = getDeclarationErrorAddendum();
            if (!info) {
              var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
              if (parentName) {
                info = "\n\nCheck the top-level render call using <" + parentName + ">.";
              }
            }
            return info;
          }
        }
        function validateExplicitKey(element, parentType) {
          {
            if (!element._store || element._store.validated || element.key != null) {
              return;
            }
            element._store.validated = true;
            var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
            if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
              return;
            }
            ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
            var childOwner = "";
            if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
              childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
            }
            setCurrentlyValidatingElement$1(element);
            error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
            setCurrentlyValidatingElement$1(null);
          }
        }
        function validateChildKeys(node, parentType) {
          {
            if (typeof node !== "object") {
              return;
            }
            if (isArray(node)) {
              for (var i = 0; i < node.length; i++) {
                var child = node[i];
                if (isValidElement(child)) {
                  validateExplicitKey(child, parentType);
                }
              }
            } else if (isValidElement(node)) {
              if (node._store) {
                node._store.validated = true;
              }
            } else if (node) {
              var iteratorFn = getIteratorFn(node);
              if (typeof iteratorFn === "function") {
                if (iteratorFn !== node.entries) {
                  var iterator = iteratorFn.call(node);
                  var step;
                  while (!(step = iterator.next()).done) {
                    if (isValidElement(step.value)) {
                      validateExplicitKey(step.value, parentType);
                    }
                  }
                }
              }
            }
          }
        }
        function validatePropTypes(element) {
          {
            var type = element.type;
            if (type === null || type === void 0 || typeof type === "string") {
              return;
            }
            var propTypes;
            if (typeof type === "function") {
              propTypes = type.propTypes;
            } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
            // Inner props are checked in the reconciler.
            type.$$typeof === REACT_MEMO_TYPE)) {
              propTypes = type.propTypes;
            } else {
              return;
            }
            if (propTypes) {
              var name = getComponentNameFromType(type);
              checkPropTypes(propTypes, element.props, "prop", name, element);
            } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
              propTypesMisspellWarningShown = true;
              var _name = getComponentNameFromType(type);
              error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
            }
            if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
              error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
            }
          }
        }
        function validateFragmentProps(fragment) {
          {
            var keys = Object.keys(fragment.props);
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              if (key !== "children" && key !== "key") {
                setCurrentlyValidatingElement$1(fragment);
                error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
                setCurrentlyValidatingElement$1(null);
                break;
              }
            }
            if (fragment.ref !== null) {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid attribute `ref` supplied to `React.Fragment`.");
              setCurrentlyValidatingElement$1(null);
            }
          }
        }
        var didWarnAboutKeySpread = {};
        function jsxWithValidation(type, props, key, isStaticChildren, source, self2) {
          {
            var validType = isValidElementType(type);
            if (!validType) {
              var info = "";
              if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
                info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
              }
              var sourceInfo = getSourceInfoErrorAddendum();
              if (sourceInfo) {
                info += sourceInfo;
              } else {
                info += getDeclarationErrorAddendum();
              }
              var typeString;
              if (type === null) {
                typeString = "null";
              } else if (isArray(type)) {
                typeString = "array";
              } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
                typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
                info = " Did you accidentally export a JSX literal instead of a component?";
              } else {
                typeString = typeof type;
              }
              error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
            }
            var element = jsxDEV(type, props, key, source, self2);
            if (element == null) {
              return element;
            }
            if (validType) {
              var children = props.children;
              if (children !== void 0) {
                if (isStaticChildren) {
                  if (isArray(children)) {
                    for (var i = 0; i < children.length; i++) {
                      validateChildKeys(children[i], type);
                    }
                    if (Object.freeze) {
                      Object.freeze(children);
                    }
                  } else {
                    error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
                  }
                } else {
                  validateChildKeys(children, type);
                }
              }
            }
            {
              if (hasOwnProperty.call(props, "key")) {
                var componentName = getComponentNameFromType(type);
                var keys = Object.keys(props).filter(function(k) {
                  return k !== "key";
                });
                var beforeExample = keys.length > 0 ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
                if (!didWarnAboutKeySpread[componentName + beforeExample]) {
                  var afterExample = keys.length > 0 ? "{" + keys.join(": ..., ") + ": ...}" : "{}";
                  error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);
                  didWarnAboutKeySpread[componentName + beforeExample] = true;
                }
              }
            }
            if (type === REACT_FRAGMENT_TYPE) {
              validateFragmentProps(element);
            } else {
              validatePropTypes(element);
            }
            return element;
          }
        }
        function jsxWithValidationStatic(type, props, key) {
          {
            return jsxWithValidation(type, props, key, true);
          }
        }
        function jsxWithValidationDynamic(type, props, key) {
          {
            return jsxWithValidation(type, props, key, false);
          }
        }
        var jsx = jsxWithValidationDynamic;
        var jsxs = jsxWithValidationStatic;
        reactJsxRuntime_development.Fragment = REACT_FRAGMENT_TYPE;
        reactJsxRuntime_development.jsx = jsx;
        reactJsxRuntime_development.jsxs = jsxs;
      })();
    }
    return reactJsxRuntime_development;
  }
  var hasRequiredJsxRuntime;
  function requireJsxRuntime() {
    if (hasRequiredJsxRuntime) return jsxRuntime.exports;
    hasRequiredJsxRuntime = 1;
    {
      jsxRuntime.exports = requireReactJsxRuntime_development();
    }
    return jsxRuntime.exports;
  }
  var jsxRuntimeExports = requireJsxRuntime();
  const createRemoteComponentRegistry = () => {
    const componentMetadataLookup = /* @__PURE__ */ new Map();
    const componentNameByComponentMap = /* @__PURE__ */ new Map();
    const registerComponent = (component, componentName, fragmentProps) => {
      componentNameByComponentMap.set(component, componentName);
      componentMetadataLookup.set(componentName, {
        fragmentPropsSet: new Set(fragmentProps),
        fragmentPropsArray: fragmentProps
      });
      return component;
    };
    return {
      getComponentName: (component) => {
        const componentName = componentNameByComponentMap.get(component);
        if (!componentName) {
          return null;
        }
        return componentName;
      },
      isAllowedComponentName: (componentName) => {
        return componentMetadataLookup.has(componentName);
      },
      isComponentFragmentProp: (componentName, propName) => {
        const componentMetadata = componentMetadataLookup.get(componentName);
        if (!componentMetadata) {
          return false;
        }
        return componentMetadata.fragmentPropsSet.has(propName);
      },
      getComponentFragmentPropNames: (componentName) => {
        const componentMetadata = componentMetadataLookup.get(componentName);
        if (!componentMetadata) {
          return [];
        }
        const { fragmentPropsArray } = componentMetadata;
        return fragmentPropsArray;
      },
      createAndRegisterRemoteReactComponent: (componentName, options = {}) => {
        const { fragmentProps = [] } = options;
        const remoteReactComponent = react.createRemoteReactComponent(componentName, {
          fragmentProps
        });
        return registerComponent(remoteReactComponent, componentName, fragmentProps);
      },
      createAndRegisterRemoteCompoundReactComponent: (componentName, options) => {
        const { fragmentProps = [] } = options;
        const RemoteComponentType = react.createRemoteReactComponent(componentName, {
          fragmentProps
        });
        const CompoundFunctionComponentType = typeof RemoteComponentType === "function" ? RemoteComponentType : (props) => jsxRuntimeExports.jsx(RemoteComponentType, { ...props });
        Object.assign(CompoundFunctionComponentType, options.compoundComponentProperties);
        return registerComponent(CompoundFunctionComponentType, componentName, fragmentProps);
      }
    };
  };
  const __hubSpotComponentRegistry = createRemoteComponentRegistry();
  const { createAndRegisterRemoteReactComponent, createAndRegisterRemoteCompoundReactComponent } = __hubSpotComponentRegistry;
  createAndRegisterRemoteReactComponent("Alert");
  const Button = createAndRegisterRemoteReactComponent("Button", {
    fragmentProps: ["overlay"]
  });
  createAndRegisterRemoteReactComponent("ButtonRow");
  createAndRegisterRemoteReactComponent("Card");
  createAndRegisterRemoteReactComponent("DescriptionList");
  createAndRegisterRemoteReactComponent("DescriptionListItem");
  const Divider = createAndRegisterRemoteReactComponent("Divider");
  createAndRegisterRemoteReactComponent("Spacer");
  const EmptyState = createAndRegisterRemoteReactComponent("EmptyState");
  createAndRegisterRemoteReactComponent("ErrorState");
  createAndRegisterRemoteReactComponent("Form");
  const Heading = createAndRegisterRemoteReactComponent("Heading");
  createAndRegisterRemoteReactComponent("Image", {
    fragmentProps: ["overlay"]
  });
  const Input = createAndRegisterRemoteReactComponent("Input");
  const Link = createAndRegisterRemoteReactComponent("Link", {
    fragmentProps: ["overlay"]
  });
  const TextArea = createAndRegisterRemoteReactComponent("TextArea");
  createAndRegisterRemoteReactComponent("Textarea");
  createAndRegisterRemoteReactComponent("LoadingSpinner");
  createAndRegisterRemoteReactComponent("ProgressBar");
  const Select = createAndRegisterRemoteReactComponent("Select");
  const Tag = createAndRegisterRemoteReactComponent("Tag", {
    fragmentProps: ["overlay"]
  });
  const Text = createAndRegisterRemoteReactComponent("Text");
  createAndRegisterRemoteReactComponent("Tile");
  createAndRegisterRemoteReactComponent("Stack");
  createAndRegisterRemoteReactComponent("ToggleGroup");
  createAndRegisterRemoteReactComponent("StatisticsItem");
  createAndRegisterRemoteReactComponent("Statistics");
  createAndRegisterRemoteReactComponent("StatisticsTrend");
  const Table = createAndRegisterRemoteReactComponent("Table");
  const TableFooter = createAndRegisterRemoteReactComponent("TableFooter");
  const TableCell = createAndRegisterRemoteReactComponent("TableCell");
  const TableRow = createAndRegisterRemoteReactComponent("TableRow");
  const TableBody = createAndRegisterRemoteReactComponent("TableBody");
  const TableHeader = createAndRegisterRemoteReactComponent("TableHeader");
  const TableHead = createAndRegisterRemoteReactComponent("TableHead");
  const NumberInput = createAndRegisterRemoteReactComponent("NumberInput");
  const Box = createAndRegisterRemoteReactComponent("Box");
  createAndRegisterRemoteReactComponent("StepIndicator");
  createAndRegisterRemoteReactComponent("Accordion");
  const MultiSelect = createAndRegisterRemoteReactComponent("MultiSelect");
  const Flex = createAndRegisterRemoteReactComponent("Flex");
  const DateInput = createAndRegisterRemoteReactComponent("DateInput");
  const Checkbox = createAndRegisterRemoteReactComponent("Checkbox");
  createAndRegisterRemoteReactComponent("RadioButton");
  createAndRegisterRemoteReactComponent("List");
  const Toggle = createAndRegisterRemoteReactComponent("Toggle");
  createAndRegisterRemoteCompoundReactComponent("Dropdown", {
    compoundComponentProperties: {
      /**
       * The `Dropdown.ButtonItem` component represents a single option within a `Dropdown` menu. Use this component as a child of the `Dropdown` component.
       *
       * **Links:**
       *
       * - {@link https://developers.hubspot.com/docs/reference/ui-components/standard-components/dropdown Docs}
       */
      ButtonItem: createAndRegisterRemoteReactComponent("DropdownButtonItem", {
        fragmentProps: ["overlay"]
      })
    }
  });
  createAndRegisterRemoteReactComponent("Panel");
  createAndRegisterRemoteReactComponent("PanelFooter");
  createAndRegisterRemoteReactComponent("PanelBody");
  createAndRegisterRemoteReactComponent("PanelSection");
  const StepperInput = createAndRegisterRemoteReactComponent("StepperInput");
  createAndRegisterRemoteReactComponent("Modal");
  createAndRegisterRemoteReactComponent("ModalBody");
  createAndRegisterRemoteReactComponent("ModalFooter");
  const Icon = createAndRegisterRemoteReactComponent("Icon");
  const StatusTag = createAndRegisterRemoteReactComponent("StatusTag");
  createAndRegisterRemoteReactComponent("LoadingButton", {
    fragmentProps: ["overlay"]
  });
  createAndRegisterRemoteReactComponent("BarChart");
  createAndRegisterRemoteReactComponent("LineChart");
  createAndRegisterRemoteReactComponent("ScoreCircle");
  createAndRegisterRemoteReactComponent("Tabs");
  createAndRegisterRemoteReactComponent("Tab");
  createAndRegisterRemoteReactComponent("Illustration");
  createAndRegisterRemoteReactComponent("Tooltip");
  const SearchInput = createAndRegisterRemoteReactComponent("SearchInput");
  createAndRegisterRemoteReactComponent("TimeInput");
  const CurrencyInput = createAndRegisterRemoteReactComponent("CurrencyInput");
  createAndRegisterRemoteReactComponent("Inline");
  createAndRegisterRemoteReactComponent("AutoGrid");
  createAndRegisterRemoteReactComponent("CrmPropertyList");
  createAndRegisterRemoteReactComponent("CrmAssociationTable");
  createAndRegisterRemoteReactComponent("CrmDataHighlight");
  createAndRegisterRemoteReactComponent("CrmReport");
  createAndRegisterRemoteReactComponent("CrmAssociationPivot");
  createAndRegisterRemoteReactComponent("CrmAssociationPropertyList");
  createAndRegisterRemoteReactComponent("CrmAssociationStageTracker");
  createAndRegisterRemoteReactComponent("CrmSimpleDeadline");
  createAndRegisterRemoteReactComponent("CrmStageTracker");
  createAndRegisterRemoteReactComponent("CrmStatistics");
  createAndRegisterRemoteReactComponent("CrmActionButton");
  createAndRegisterRemoteReactComponent("CrmActionLink");
  createAndRegisterRemoteReactComponent("CrmCardActions");
  createAndRegisterRemoteReactComponent("HeaderActions");
  createAndRegisterRemoteReactComponent("PrimaryHeaderActionButton", {
    fragmentProps: ["overlay"]
  });
  createAndRegisterRemoteReactComponent("SecondaryHeaderActionButton", {
    fragmentProps: ["overlay"]
  });
  createAndRegisterRemoteReactComponent("PageLink");
  createAndRegisterRemoteReactComponent("Iframe");
  createAndRegisterRemoteReactComponent("MediaObject", {
    fragmentProps: ["itemRight", "itemLeft"]
  });
  createAndRegisterRemoteReactComponent("Stack2");
  createAndRegisterRemoteReactComponent("Center");
  createAndRegisterRemoteReactComponent("Grid");
  createAndRegisterRemoteReactComponent("GridItem");
  createAndRegisterRemoteReactComponent("SettingsView");
  createAndRegisterRemoteReactComponent("ExpandableText");
  createAndRegisterRemoteReactComponent("Popover");
  createAndRegisterRemoteReactComponent("FileInput");
  const MocksContext = React2.createContext(null);
  MocksContext.Provider;
  const formatDateChip = (dateObj) => {
    if (!dateObj) return "";
    const { year, month, date } = dateObj;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(new Date(year, month, date));
  };
  const dateToTimestamp = (dateObj) => {
    if (!dateObj) return null;
    return new Date(dateObj.year, dateObj.month, dateObj.date).getTime();
  };
  const NARROW_EDIT_TYPES = /* @__PURE__ */ new Set(["checkbox", "toggle"]);
  const DATE_PATTERN = /^\d{4}[-/]\d{2}[-/]\d{2}/;
  const BOOL_VALUES = /* @__PURE__ */ new Set(["true", "false", "yes", "no", "0", "1"]);
  const computeAutoWidths = (columns, data) => {
    if (!data || data.length === 0) return {};
    const sample = data.slice(0, 50);
    const results = {};
    columns.forEach((col) => {
      if (col.width && col.cellWidth) return;
      const values = sample.map((row) => row[col.field]).filter((v) => v != null);
      const strings = values.map((v) => String(v));
      let widthHint = null;
      let cellWidthHint = null;
      if (col.editable && col.editType && NARROW_EDIT_TYPES.has(col.editType)) {
        cellWidthHint = "min";
      }
      if (strings.length > 0) {
        const lengths = strings.map((s) => s.length);
        const maxLen = Math.max(...lengths);
        const uniqueCount = new Set(strings).size;
        if (values.every((v) => typeof v === "boolean") || strings.every((s) => BOOL_VALUES.has(s.toLowerCase()))) {
          widthHint = widthHint || "min";
          cellWidthHint = cellWidthHint || "min";
        } else if (strings.every((s) => DATE_PATTERN.test(s))) {
          widthHint = widthHint || "min";
          cellWidthHint = cellWidthHint || "auto";
        } else if (values.every((v) => typeof v === "number")) {
          widthHint = widthHint || "auto";
          cellWidthHint = cellWidthHint || "auto";
        } else if (uniqueCount <= 5 && maxLen <= 15) {
          widthHint = widthHint || "min";
          cellWidthHint = cellWidthHint || "auto";
        } else {
          widthHint = widthHint || "auto";
          cellWidthHint = cellWidthHint || "auto";
        }
      }
      if (col.editable && !NARROW_EDIT_TYPES.has(col.editType) && widthHint === "min") {
        widthHint = "auto";
      }
      results[col.field] = {
        width: widthHint || "auto",
        cellWidth: cellWidthHint || "auto"
      };
    });
    return results;
  };
  const getEmptyFilterValue = (filter) => {
    const type = filter.type || "select";
    if (type === "multiselect") return [];
    if (type === "dateRange") return { from: null, to: null };
    return "";
  };
  const BOOLEAN_SELECT_OPTIONS = [
    { label: "Yes", value: true },
    { label: "No", value: false }
  ];
  const resolveEditOptions = (col, data) => {
    if (col.editOptions && col.editOptions.length > 0) return col.editOptions;
    const sample = data.find((row) => row[col.field] != null);
    if (sample && typeof sample[col.field] === "boolean") return BOOLEAN_SELECT_OPTIONS;
    return [];
  };
  const isFilterActive = (filter, value) => {
    const type = filter.type || "select";
    if (type === "multiselect") return Array.isArray(value) && value.length > 0;
    if (type === "dateRange") return value && (value.from || value.to);
    return !!value;
  };
  const DataTable = ({
    // Data
    data,
    columns,
    renderRow,
    // Search
    searchFields = [],
    searchPlaceholder = "Search...",
    // Filters
    filters = [],
    // Pagination
    pageSize = 10,
    maxVisiblePageButtons,
    // max page number buttons to show
    showButtonLabels = true,
    // show First/Prev/Next/Last text labels
    showFirstLastButtons,
    // show First/Last page buttons (default: auto when pageCount > 5)
    // Row count
    showRowCount = true,
    // show "X records" / "X of Y records" text
    rowCountBold = false,
    // bold the row count text
    rowCountText,
    // custom formatter: (displayCount, totalCount) => string
    // Table appearance
    bordered = true,
    // show table borders
    flush = true,
    // remove bottom margin
    // Sorting
    defaultSort = {},
    // Grouping
    groupBy,
    // Footer
    footer,
    // Empty state
    emptyTitle = "No results found",
    emptyMessage = "No records match your search or filter criteria.",
    // -----------------------------------------------------------------------
    // Server-side mode
    // -----------------------------------------------------------------------
    serverSide = false,
    totalCount,
    // server total (server-side only)
    page: externalPage,
    // controlled page (server-side only)
    onSearchChange,
    // (searchTerm) => void
    onFilterChange,
    // (filterValues) => void
    onSortChange,
    // (field, direction) => void
    onPageChange,
    // (page) => void
    // -----------------------------------------------------------------------
    // Row selection
    // -----------------------------------------------------------------------
    selectable = false,
    rowIdField = "id",
    // field name used as unique row identifier
    onSelectionChange,
    // (selectedIds[]) => void
    // -----------------------------------------------------------------------
    // Inline editing
    // -----------------------------------------------------------------------
    editMode,
    // "discrete" (click-to-edit) | "inline" (always show inputs)
    onRowEdit,
    // (row, field, newValue) => void
    // -----------------------------------------------------------------------
    // Auto-width
    // -----------------------------------------------------------------------
    autoWidth = true
    // auto-compute column widths from content analysis
  }) => {
    const initialSortState = React2.useMemo(() => {
      const state = {};
      columns.forEach((col) => {
        if (col.sortable) {
          state[col.field] = defaultSort[col.field] || "none";
        }
      });
      return state;
    }, [columns, defaultSort]);
    const [searchTerm, setSearchTerm] = React2.useState("");
    const [filterValues, setFilterValues] = React2.useState(() => {
      const init = {};
      filters.forEach((f) => {
        init[f.name] = getEmptyFilterValue(f);
      });
      return init;
    });
    const [sortState, setSortState] = React2.useState(initialSortState);
    const [currentPage, setCurrentPage] = React2.useState(1);
    const [showMoreFilters, setShowMoreFilters] = React2.useState(false);
    const activePage = serverSide && externalPage != null ? externalPage : currentPage;
    React2.useEffect(() => {
      if (!serverSide) setCurrentPage(1);
    }, [searchTerm, filterValues, sortState, serverSide]);
    const handleSearchChange = React2.useCallback((term) => {
      setSearchTerm(term);
      if (serverSide && onSearchChange) onSearchChange(term);
    }, [serverSide, onSearchChange]);
    const handleFilterChange = React2.useCallback((name, value) => {
      setFilterValues((prev) => {
        const next = { ...prev, [name]: value };
        if (serverSide && onFilterChange) onFilterChange(next);
        return next;
      });
    }, [serverSide, onFilterChange]);
    const handleSortChange = React2.useCallback((field) => {
      const current = sortState[field] || "none";
      const nextDirection = current === "none" ? "ascending" : current === "ascending" ? "descending" : "none";
      const reset = {};
      Object.keys(sortState).forEach((k) => {
        reset[k] = "none";
      });
      const next = { ...reset, [field]: nextDirection };
      setSortState(next);
      if (serverSide && onSortChange) onSortChange(field, nextDirection);
    }, [sortState, serverSide, onSortChange]);
    const handlePageChange = React2.useCallback((page) => {
      setCurrentPage(page);
      if (serverSide && onPageChange) onPageChange(page);
    }, [serverSide, onPageChange]);
    const filteredData = React2.useMemo(() => {
      if (serverSide) return data;
      let result = data;
      filters.forEach((filter) => {
        const value = filterValues[filter.name];
        if (!isFilterActive(filter, value)) return;
        const type = filter.type || "select";
        if (filter.filterFn) {
          result = result.filter((row) => filter.filterFn(row, value));
        } else if (type === "multiselect") {
          result = result.filter((row) => value.includes(row[filter.name]));
        } else if (type === "dateRange") {
          const fromTs = dateToTimestamp(value.from);
          const toTs = value.to ? dateToTimestamp(value.to) + 864e5 - 1 : null;
          result = result.filter((row) => {
            const rowTs = new Date(row[filter.name]).getTime();
            if (fromTs && rowTs < fromTs) return false;
            if (toTs && rowTs > toTs) return false;
            return true;
          });
        } else {
          result = result.filter((row) => row[filter.name] === value);
        }
      });
      if (searchTerm && searchFields.length > 0) {
        const term = searchTerm.toLowerCase();
        result = result.filter(
          (row) => searchFields.some((field) => {
            const val = row[field];
            return val && String(val).toLowerCase().includes(term);
          })
        );
      }
      return result;
    }, [data, filterValues, searchTerm, filters, searchFields, serverSide]);
    const sortedData = React2.useMemo(() => {
      if (serverSide) return filteredData;
      const activeField = Object.keys(sortState).find((k) => sortState[k] !== "none");
      if (!activeField) return filteredData;
      return [...filteredData].sort((a, b) => {
        const dir = sortState[activeField] === "ascending" ? 1 : -1;
        const aVal = a[activeField];
        const bVal = b[activeField];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (aVal < bVal) return -dir;
        if (aVal > bVal) return dir;
        return 0;
      });
    }, [filteredData, sortState, serverSide]);
    const groupedData = React2.useMemo(() => {
      if (!groupBy) return null;
      const source = serverSide ? data : sortedData;
      const groups = {};
      source.forEach((row) => {
        const key = row[groupBy.field] ?? "--";
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
      });
      let groupKeys = Object.keys(groups);
      if (groupBy.sort) {
        if (typeof groupBy.sort === "function") {
          groupKeys.sort(groupBy.sort);
        } else {
          const dir = groupBy.sort === "desc" ? -1 : 1;
          groupKeys.sort((a, b) => a < b ? -dir : a > b ? dir : 0);
        }
      }
      return groupKeys.map((key) => ({
        key,
        label: groupBy.label ? groupBy.label(key, groups[key]) : key,
        rows: groups[key]
      }));
    }, [sortedData, data, groupBy, serverSide]);
    const [expandedGroups, setExpandedGroups] = React2.useState(() => {
      if (!groupBy) return /* @__PURE__ */ new Set();
      const defaultExpanded = groupBy.defaultExpanded !== false;
      if (defaultExpanded && groupedData) {
        return new Set(groupedData.map((g) => g.key));
      }
      return /* @__PURE__ */ new Set();
    });
    React2.useEffect(() => {
      if (!groupedData) return;
      const defaultExpanded = (groupBy == null ? void 0 : groupBy.defaultExpanded) !== false;
      if (defaultExpanded) {
        setExpandedGroups((prev) => {
          const next = new Set(prev);
          groupedData.forEach((g) => next.add(g.key));
          return next;
        });
      }
    }, [groupedData, groupBy]);
    const toggleGroup = React2.useCallback((key) => {
      setExpandedGroups((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
    }, []);
    const flatRows = React2.useMemo(() => {
      if (!groupedData) return (serverSide ? data : sortedData).map((row) => ({ type: "data", row }));
      const flat = [];
      groupedData.forEach((group) => {
        flat.push({ type: "group-header", group });
        if (expandedGroups.has(group.key)) {
          group.rows.forEach((row) => flat.push({ type: "data", row }));
        }
      });
      return flat;
    }, [groupedData, sortedData, data, serverSide, expandedGroups]);
    const totalItems = serverSide ? totalCount || data.length : flatRows.length;
    const pageCount = Math.ceil(totalItems / pageSize);
    let displayRows;
    if (serverSide) {
      displayRows = groupBy ? flatRows : data.map((row) => ({ type: "data", row }));
    } else {
      displayRows = flatRows.slice(
        (activePage - 1) * pageSize,
        activePage * pageSize
      );
    }
    const footerData = serverSide ? data : filteredData;
    const activeChips = React2.useMemo(() => {
      const chips = [];
      filters.forEach((filter) => {
        const value = filterValues[filter.name];
        if (!isFilterActive(filter, value)) return;
        const type = filter.type || "select";
        const prefix = filter.chipLabel || filter.placeholder || filter.name;
        if (type === "multiselect") {
          const labels = value.map((v) => {
            var _a;
            return ((_a = filter.options.find((o) => o.value === v)) == null ? void 0 : _a.label) || v;
          }).join(", ");
          chips.push({ key: filter.name, label: `${prefix}: ${labels}` });
        } else if (type === "dateRange") {
          const parts = [];
          if (value.from) parts.push(`from ${formatDateChip(value.from)}`);
          if (value.to) parts.push(`to ${formatDateChip(value.to)}`);
          chips.push({ key: filter.name, label: `${prefix}: ${parts.join(" ")}` });
        } else {
          const option = filter.options.find((o) => o.value === value);
          chips.push({ key: filter.name, label: `${prefix}: ${(option == null ? void 0 : option.label) || value}` });
        }
      });
      return chips;
    }, [filterValues, filters]);
    const handleFilterRemove = React2.useCallback((key) => {
      if (key === "all") {
        const cleared = {};
        filters.forEach((f) => {
          cleared[f.name] = getEmptyFilterValue(f);
        });
        setFilterValues(cleared);
        if (serverSide && onFilterChange) onFilterChange(cleared);
      } else {
        const filter = filters.find((f) => f.name === key);
        const emptyVal = filter ? getEmptyFilterValue(filter) : "";
        setFilterValues((prev) => {
          const next = { ...prev, [key]: emptyVal };
          if (serverSide && onFilterChange) onFilterChange(next);
          return next;
        });
      }
    }, [filters, serverSide, onFilterChange]);
    const displayCount = serverSide ? totalCount || data.length : filteredData.length;
    const totalDataCount = serverSide ? totalCount || data.length : data.length;
    const recordCountLabel = rowCountText ? rowCountText(displayCount, totalDataCount) : displayCount === totalDataCount ? `${totalDataCount} records` : `${displayCount} of ${totalDataCount} records`;
    const [selectedIds, setSelectedIds] = React2.useState(/* @__PURE__ */ new Set());
    React2.useEffect(() => {
      if (selectable) setSelectedIds(/* @__PURE__ */ new Set());
    }, [searchTerm, filterValues, selectable]);
    const handleSelectRow = React2.useCallback((rowId, checked) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (checked) next.add(rowId);
        else next.delete(rowId);
        if (onSelectionChange) onSelectionChange([...next]);
        return next;
      });
    }, [onSelectionChange]);
    const handleSelectAll = React2.useCallback((checked) => {
      const visibleIds = displayRows.filter((r) => r.type === "data").map((r) => r.row[rowIdField]);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => {
          if (checked) next.add(id);
          else next.delete(id);
        });
        if (onSelectionChange) onSelectionChange([...next]);
        return next;
      });
    }, [displayRows, rowIdField, onSelectionChange]);
    const allVisibleSelected = React2.useMemo(() => {
      const visibleIds = displayRows.filter((r) => r.type === "data").map((r) => r.row[rowIdField]);
      return visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
    }, [displayRows, selectedIds, rowIdField]);
    const [editingCell, setEditingCell] = React2.useState(null);
    const [editValue, setEditValue] = React2.useState(null);
    const [editError, setEditError] = React2.useState(null);
    const startEditing = React2.useCallback((rowId, field, currentValue) => {
      setEditingCell({ rowId, field });
      setEditValue(currentValue);
      setEditError(null);
    }, []);
    React2.useCallback(() => {
      setEditingCell(null);
      setEditValue(null);
      setEditError(null);
    }, []);
    const commitEdit = React2.useCallback((row, field, value) => {
      const col = columns.find((c) => c.field === field);
      if (col == null ? void 0 : col.editValidate) {
        const result = col.editValidate(value, row);
        if (result !== true && result !== void 0 && result !== null) {
          setEditError(typeof result === "string" ? result : "Invalid value");
          return;
        }
      }
      if (onRowEdit) onRowEdit(row, field, value);
      setEditingCell(null);
      setEditValue(null);
      setEditError(null);
    }, [onRowEdit, columns]);
    const renderEditControl = (col, row) => {
      const type = col.editType || "text";
      const rowId = row[rowIdField];
      const fieldName = `edit-${rowId}-${col.field}`;
      const commit = (val) => commitEdit(row, col.field, val);
      const update = (val) => {
        setEditValue(val);
        if (onRowEdit) onRowEdit(row, col.field, val);
      };
      const exitEdit = () => {
        if (editError) return;
        setEditingCell(null);
        setEditValue(null);
      };
      const extra = col.editProps || {};
      const validate = col.editValidate;
      const validationProps = validate && editError ? { error: true, validationMessage: editError } : {};
      const onInputValidate = validate ? (val) => {
        const result = validate(val, row);
        if (result !== true && result !== void 0 && result !== null) {
          setEditError(typeof result === "string" ? result : "Invalid value");
        } else {
          setEditError(null);
        }
      } : void 0;
      switch (type) {
        case "textarea":
          return /* @__PURE__ */ React2.createElement(TextArea, { ...extra, name: fieldName, label: "", value: editValue ?? "", onChange: update, onBlur: exitEdit, ...validationProps, onInput: onInputValidate });
        case "number":
          return /* @__PURE__ */ React2.createElement(NumberInput, { ...extra, name: fieldName, label: "", value: editValue, onChange: update, onBlur: exitEdit, ...validationProps, onInput: onInputValidate });
        case "currency":
          return /* @__PURE__ */ React2.createElement(CurrencyInput, { currencyCode: "USD", ...extra, name: fieldName, label: "", value: editValue, onChange: update, onBlur: exitEdit, ...validationProps, onInput: onInputValidate });
        case "stepper":
          return /* @__PURE__ */ React2.createElement(StepperInput, { ...extra, name: fieldName, label: "", value: editValue, onChange: update, onBlur: exitEdit, ...validationProps, onInput: onInputValidate });
        case "select":
          return /* @__PURE__ */ React2.createElement(Select, { variant: "transparent", ...extra, name: fieldName, label: "", value: editValue, onChange: commit, options: resolveEditOptions(col, data) });
        case "multiselect":
          return /* @__PURE__ */ React2.createElement(MultiSelect, { ...extra, name: fieldName, label: "", value: editValue || [], onChange: commit, options: resolveEditOptions(col, data) });
        case "date":
          return /* @__PURE__ */ React2.createElement(DateInput, { ...extra, name: fieldName, label: "", value: editValue, onChange: commit });
        case "toggle":
          return /* @__PURE__ */ React2.createElement(Toggle, { ...extra, name: fieldName, label: "", checked: !!editValue, onChange: commit });
        case "checkbox":
          return /* @__PURE__ */ React2.createElement(Checkbox, { ...extra, name: fieldName, checked: !!editValue, onChange: commit });
        default:
          return /* @__PURE__ */ React2.createElement(Input, { ...extra, name: fieldName, label: "", value: editValue ?? "", onChange: update, onBlur: exitEdit, ...validationProps, onInput: onInputValidate });
      }
    };
    const resolvedEditMode = editMode || (columns.some((col) => col.editable) ? "discrete" : null);
    const useColumnRendering = selectable || !!resolvedEditMode || !renderRow;
    const autoWidths = React2.useMemo(
      () => autoWidth ? computeAutoWidths(columns, data) : {},
      [columns, data, autoWidth]
    );
    const getHeaderWidth = (col) => {
      var _a;
      return col.width || ((_a = autoWidths[col.field]) == null ? void 0 : _a.width) || "auto";
    };
    const getCellWidth = (col) => {
      var _a;
      return col.cellWidth || col.width || ((_a = autoWidths[col.field]) == null ? void 0 : _a.cellWidth) || "auto";
    };
    const [inlineErrors, setInlineErrors] = React2.useState({});
    const renderInlineControl = (col, row) => {
      const type = col.editType || "text";
      const rowId = row[rowIdField];
      const fieldName = `inline-${rowId}-${col.field}`;
      const cellKey = `${rowId}-${col.field}`;
      const value = row[col.field];
      const validate = col.editValidate;
      const fire = (val) => {
        if (validate) {
          const result = validate(val, row);
          if (result !== true && result !== void 0 && result !== null) {
            setInlineErrors((prev) => ({ ...prev, [cellKey]: typeof result === "string" ? result : "Invalid value" }));
            return;
          }
          setInlineErrors((prev) => {
            const next = { ...prev };
            delete next[cellKey];
            return next;
          });
        }
        if (onRowEdit) onRowEdit(row, col.field, val);
      };
      const extra = col.editProps || {};
      const cellError = inlineErrors[cellKey];
      const validationProps = cellError ? { error: true, validationMessage: cellError } : {};
      const onInputValidate = validate ? (val) => {
        const result = validate(val, row);
        if (result !== true && result !== void 0 && result !== null) {
          setInlineErrors((prev) => ({ ...prev, [cellKey]: typeof result === "string" ? result : "Invalid value" }));
        } else {
          setInlineErrors((prev) => {
            const next = { ...prev };
            delete next[cellKey];
            return next;
          });
        }
      } : void 0;
      switch (type) {
        case "textarea":
          return /* @__PURE__ */ React2.createElement(TextArea, { ...extra, name: fieldName, label: "", value: value ?? "", onChange: fire, ...validationProps, onInput: onInputValidate });
        case "number":
          return /* @__PURE__ */ React2.createElement(NumberInput, { ...extra, name: fieldName, label: "", value, onChange: fire, ...validationProps, onInput: onInputValidate });
        case "currency":
          return /* @__PURE__ */ React2.createElement(CurrencyInput, { currencyCode: "USD", ...extra, name: fieldName, label: "", value, onChange: fire, ...validationProps, onInput: onInputValidate });
        case "stepper":
          return /* @__PURE__ */ React2.createElement(StepperInput, { ...extra, name: fieldName, label: "", value, onChange: fire, ...validationProps, onInput: onInputValidate });
        case "select":
          return /* @__PURE__ */ React2.createElement(Select, { variant: "transparent", ...extra, name: fieldName, label: "", value, onChange: fire, options: resolveEditOptions(col, data) });
        case "multiselect":
          return /* @__PURE__ */ React2.createElement(MultiSelect, { ...extra, name: fieldName, label: "", value: value || [], onChange: fire, options: resolveEditOptions(col, data) });
        case "date":
          return /* @__PURE__ */ React2.createElement(DateInput, { ...extra, name: fieldName, label: "", value, onChange: fire });
        case "toggle":
          return /* @__PURE__ */ React2.createElement(Toggle, { ...extra, name: fieldName, label: "", checked: !!value, onChange: fire });
        case "checkbox":
          return /* @__PURE__ */ React2.createElement(Checkbox, { ...extra, name: fieldName, checked: !!value, onChange: fire });
        default:
          return /* @__PURE__ */ React2.createElement(Input, { ...extra, name: fieldName, label: "", value: value ?? "", onChange: fire, ...validationProps, onInput: onInputValidate });
      }
    };
    const renderCellContent = (row, col) => {
      const rowId = row[rowIdField];
      if (resolvedEditMode === "inline" && col.editable) {
        return renderInlineControl(col, row);
      }
      const isEditing = (editingCell == null ? void 0 : editingCell.rowId) === rowId && (editingCell == null ? void 0 : editingCell.field) === col.field;
      if (isEditing && col.editable) return renderEditControl(col, row);
      const content = col.renderCell ? col.renderCell(row[col.field], row) : row[col.field] ?? "";
      if (col.editable) {
        return /* @__PURE__ */ React2.createElement(
          Link,
          {
            variant: "dark",
            onClick: () => startEditing(rowId, col.field, row[col.field])
          },
          content || "—"
        );
      }
      return content;
    };
    const renderFilterControl = (filter) => {
      const type = filter.type || "select";
      if (type === "multiselect") {
        return /* @__PURE__ */ React2.createElement(
          MultiSelect,
          {
            key: filter.name,
            name: `filter-${filter.name}`,
            label: "",
            placeholder: filter.placeholder || "All",
            value: filterValues[filter.name] || [],
            onChange: (val) => handleFilterChange(filter.name, val),
            options: filter.options
          }
        );
      }
      if (type === "dateRange") {
        const rangeVal = filterValues[filter.name] || { from: null, to: null };
        return /* @__PURE__ */ React2.createElement(Flex, { key: filter.name, direction: "row", align: "end", gap: "xs" }, /* @__PURE__ */ React2.createElement(
          DateInput,
          {
            name: `filter-${filter.name}-from`,
            label: "",
            placeholder: "From",
            format: "medium",
            value: rangeVal.from,
            onChange: (val) => handleFilterChange(filter.name, { ...rangeVal, from: val })
          }
        ), /* @__PURE__ */ React2.createElement(Text, { variant: "microcopy" }, "to"), /* @__PURE__ */ React2.createElement(
          DateInput,
          {
            name: `filter-${filter.name}-to`,
            label: "",
            placeholder: "To",
            format: "medium",
            value: rangeVal.to,
            onChange: (val) => handleFilterChange(filter.name, { ...rangeVal, to: val })
          }
        ));
      }
      return /* @__PURE__ */ React2.createElement(
        Select,
        {
          key: filter.name,
          name: `filter-${filter.name}`,
          variant: "transparent",
          placeholder: filter.placeholder || "All",
          value: filterValues[filter.name],
          onChange: (val) => handleFilterChange(filter.name, val),
          options: [
            { label: filter.placeholder || "All", value: "" },
            ...filter.options
          ]
        }
      );
    };
    return /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "xs" }, /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "sm" }, /* @__PURE__ */ React2.createElement(Flex, { direction: "row", align: "center", gap: "sm", wrap: "wrap" }, searchFields.length > 0 && /* @__PURE__ */ React2.createElement(
      SearchInput,
      {
        name: "datatable-search",
        placeholder: searchPlaceholder,
        value: searchTerm,
        onChange: handleSearchChange
      }
    ), filters.slice(0, 2).map(renderFilterControl), filters.length > 2 && /* @__PURE__ */ React2.createElement(
      Button,
      {
        variant: "transparent",
        size: "small",
        onClick: () => setShowMoreFilters((prev) => !prev)
      },
      /* @__PURE__ */ React2.createElement(Icon, { name: "filter", size: "sm" }),
      " Filters"
    ), showRowCount && activeChips.length === 0 && displayCount > 0 && /* @__PURE__ */ React2.createElement(Box, { flex: 1 }, /* @__PURE__ */ React2.createElement(Flex, { direction: "row", justify: "end" }, /* @__PURE__ */ React2.createElement(Text, { variant: "microcopy", format: rowCountBold ? { fontWeight: "bold" } : void 0 }, recordCountLabel)))), showMoreFilters && filters.length > 2 && /* @__PURE__ */ React2.createElement(Flex, { direction: "row", align: "end", gap: "sm", wrap: "wrap" }, filters.slice(2).map(renderFilterControl)), activeChips.length > 0 && /* @__PURE__ */ React2.createElement(Flex, { direction: "row", align: "center", gap: "sm", wrap: "wrap" }, activeChips.map((chip) => /* @__PURE__ */ React2.createElement(Tag, { key: chip.key, variant: "default", onDelete: () => handleFilterRemove(chip.key) }, chip.label)), /* @__PURE__ */ React2.createElement(
      Button,
      {
        variant: "transparent",
        size: "extra-small",
        onClick: () => handleFilterRemove("all")
      },
      "Clear all"
    ), showRowCount && displayCount > 0 && /* @__PURE__ */ React2.createElement(Box, { flex: 1 }, /* @__PURE__ */ React2.createElement(Flex, { direction: "row", justify: "end" }, /* @__PURE__ */ React2.createElement(Text, { variant: "microcopy", format: rowCountBold ? { fontWeight: "bold" } : void 0 }, recordCountLabel))))), displayRows.length === 0 ? /* @__PURE__ */ React2.createElement(EmptyState, { title: emptyTitle }, /* @__PURE__ */ React2.createElement(Text, null, emptyMessage)) : /* @__PURE__ */ React2.createElement(
      Table,
      {
        bordered,
        flush,
        paginated: pageCount > 1,
        page: activePage,
        pageCount,
        onPageChange: handlePageChange,
        showFirstLastButtons: showFirstLastButtons != null ? showFirstLastButtons : pageCount > 5,
        showButtonLabels,
        ...maxVisiblePageButtons != null ? { maxVisiblePageButtons } : {}
      },
      /* @__PURE__ */ React2.createElement(TableHead, null, /* @__PURE__ */ React2.createElement(TableRow, null, selectable && /* @__PURE__ */ React2.createElement(TableHeader, { width: "min" }, /* @__PURE__ */ React2.createElement(
        Checkbox,
        {
          name: "datatable-select-all",
          "aria-label": "Select all rows",
          checked: allVisibleSelected,
          onChange: handleSelectAll
        }
      )), columns.map((col) => {
        const headerAlign = resolvedEditMode === "inline" && col.editable ? void 0 : col.align;
        return /* @__PURE__ */ React2.createElement(
          TableHeader,
          {
            key: col.field,
            width: getHeaderWidth(col),
            align: headerAlign,
            sortDirection: col.sortable ? sortState[col.field] || "none" : "never",
            onSortChange: col.sortable ? () => handleSortChange(col.field) : void 0
          },
          col.label
        );
      }))),
      /* @__PURE__ */ React2.createElement(TableBody, null, displayRows.map(
        (item, idx) => item.type === "group-header" ? /* @__PURE__ */ React2.createElement(TableRow, { key: `group-${item.group.key}` }, selectable && /* @__PURE__ */ React2.createElement(TableCell, { width: "min" }), columns.map((col, colIdx) => {
          var _a, _b, _c;
          return /* @__PURE__ */ React2.createElement(TableCell, { key: col.field, width: getCellWidth(col), align: colIdx === 0 ? void 0 : col.align }, colIdx === 0 ? /* @__PURE__ */ React2.createElement(
            Link,
            {
              variant: "dark",
              onClick: () => toggleGroup(item.group.key)
            },
            /* @__PURE__ */ React2.createElement(Flex, { direction: "row", align: "center", gap: "xs", wrap: "nowrap" }, /* @__PURE__ */ React2.createElement(Icon, { name: expandedGroups.has(item.group.key) ? "downCarat" : "right" }), /* @__PURE__ */ React2.createElement(Text, { format: { fontWeight: "demibold" } }, item.group.label))
          ) : ((_a = groupBy.aggregations) == null ? void 0 : _a[col.field]) ? groupBy.aggregations[col.field](item.group.rows, item.group.key) : ((_c = (_b = groupBy.groupValues) == null ? void 0 : _b[item.group.key]) == null ? void 0 : _c[col.field]) ?? "");
        })) : useColumnRendering ? /* @__PURE__ */ React2.createElement(TableRow, { key: item.row[rowIdField] ?? idx }, selectable && /* @__PURE__ */ React2.createElement(TableCell, { width: "min" }, /* @__PURE__ */ React2.createElement(
          Checkbox,
          {
            name: `select-${item.row[rowIdField]}`,
            "aria-label": "Select row",
            checked: selectedIds.has(item.row[rowIdField]),
            onChange: (checked) => handleSelectRow(item.row[rowIdField], checked)
          }
        )), columns.map((col) => {
          const rowId = item.row[rowIdField];
          const isDiscreteEditing = resolvedEditMode === "discrete" && (editingCell == null ? void 0 : editingCell.rowId) === rowId && (editingCell == null ? void 0 : editingCell.field) === col.field;
          const isShowingInput = isDiscreteEditing || resolvedEditMode === "inline" && col.editable;
          const cellAlign = isShowingInput ? void 0 : col.align;
          return /* @__PURE__ */ React2.createElement(TableCell, { key: col.field, width: isDiscreteEditing ? "auto" : getCellWidth(col), align: cellAlign }, renderCellContent(item.row, col));
        })) : renderRow(item.row)
      )),
      footer && /* @__PURE__ */ React2.createElement(TableFooter, null, footer(footerData))
    ));
  };
  const SAMPLE_DATA = [
    { id: 1, name: "Acme Corp", contact: "Jane Smith", status: "active", category: "enterprise", amount: 125e3, date: "2026-01-15", priority: true },
    { id: 2, name: "Globex Inc", contact: "Bob Johnson", status: "active", category: "mid-market", amount: 67e3, date: "2026-02-03", priority: false },
    { id: 3, name: "Initech", contact: "Michael Bolton", status: "churned", category: "smb", amount: 12e3, date: "2025-11-20", priority: false },
    { id: 4, name: "Umbrella Corp", contact: "Alice Wesker", status: "at-risk", category: "enterprise", amount: 23e4, date: "2026-03-01", priority: true },
    { id: 5, name: "Stark Industries", contact: "Pepper Potts", status: "active", category: "enterprise", amount: 45e4, date: "2026-01-28", priority: false },
    { id: 6, name: "Wayne Enterprises", contact: "Lucius Fox", status: "active", category: "enterprise", amount: 38e4, date: "2025-12-15", priority: true },
    { id: 7, name: "Wonka Industries", contact: "Charlie Bucket", status: "at-risk", category: "mid-market", amount: 42e3, date: "2026-02-14", priority: false },
    { id: 8, name: "Cyberdyne Systems", contact: "Miles Dyson", status: "churned", category: "mid-market", amount: 89e3, date: "2025-10-05", priority: false },
    { id: 9, name: "Soylent Corp", contact: "Sol Roth", status: "active", category: "smb", amount: 18e3, date: "2026-03-10", priority: false },
    { id: 10, name: "Tyrell Corp", contact: "Eldon Tyrell", status: "active", category: "enterprise", amount: 52e4, date: "2026-01-05", priority: true },
    { id: 11, name: "Pied Piper", contact: "Richard Hendricks", status: "active", category: "smb", amount: 28e3, date: "2026-02-22", priority: false },
    { id: 12, name: "Hooli", contact: "Gavin Belson", status: "at-risk", category: "enterprise", amount: 175e3, date: "2025-12-30", priority: true }
  ];
  const STATUS_COLORS = {
    active: "success",
    "at-risk": "warning",
    churned: "danger"
  };
  const STATUS_LABELS = {
    active: "Active",
    "at-risk": "At Risk",
    churned: "Churned"
  };
  const formatCurrency = (val) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  const FULL_COLUMNS = [
    {
      field: "name",
      label: "Company",
      sortable: true,
      renderCell: (val) => /* @__PURE__ */ React2.createElement(Text, { format: { fontWeight: "demibold" } }, val)
    },
    {
      field: "contact",
      label: "Contact",
      sortable: true,
      renderCell: (val) => val
    },
    {
      field: "status",
      label: "Status",
      sortable: true,
      renderCell: (val) => /* @__PURE__ */ React2.createElement(StatusTag, { variant: STATUS_COLORS[val] }, STATUS_LABELS[val])
    },
    {
      field: "category",
      label: "Segment",
      sortable: true,
      renderCell: (val) => /* @__PURE__ */ React2.createElement(Tag, { variant: "default" }, val)
    },
    {
      field: "amount",
      label: "Amount",
      sortable: true,
      align: "right",
      renderCell: (val) => formatCurrency(val)
    },
    {
      field: "date",
      label: "Close Date",
      sortable: true,
      renderCell: (val) => new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }
  ];
  const FULL_FILTERS = [
    {
      name: "status",
      type: "select",
      placeholder: "All statuses",
      options: [
        { label: "Active", value: "active" },
        { label: "At Risk", value: "at-risk" },
        { label: "Churned", value: "churned" }
      ]
    },
    {
      name: "category",
      type: "select",
      placeholder: "All segments",
      options: [
        { label: "Enterprise", value: "enterprise" },
        { label: "Mid-Market", value: "mid-market" },
        { label: "SMB", value: "smb" }
      ]
    },
    {
      name: "date",
      type: "dateRange",
      placeholder: "Close date"
    }
  ];
  const FullFeaturedDemo = () => /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "sm" }, /* @__PURE__ */ React2.createElement(Heading, null, "Full-Featured DataTable"), /* @__PURE__ */ React2.createElement(Text, { variant: "microcopy" }, "Search, filter, sort, paginate, footer summary. No explicit widths — auto-width sizes columns from content."), /* @__PURE__ */ React2.createElement(
    DataTable,
    {
      data: SAMPLE_DATA,
      columns: FULL_COLUMNS,
      renderRow: (row) => /* @__PURE__ */ React2.createElement(TableRow, { key: row.id }, /* @__PURE__ */ React2.createElement(TableCell, null, /* @__PURE__ */ React2.createElement(Text, { format: { fontWeight: "demibold" } }, row.name)), /* @__PURE__ */ React2.createElement(TableCell, null, row.contact), /* @__PURE__ */ React2.createElement(TableCell, null, /* @__PURE__ */ React2.createElement(StatusTag, { variant: STATUS_COLORS[row.status] }, STATUS_LABELS[row.status])), /* @__PURE__ */ React2.createElement(TableCell, null, /* @__PURE__ */ React2.createElement(Tag, { variant: "default" }, row.category)), /* @__PURE__ */ React2.createElement(TableCell, { align: "right" }, formatCurrency(row.amount)), /* @__PURE__ */ React2.createElement(TableCell, null, new Date(row.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }))),
      searchFields: ["name", "contact"],
      searchPlaceholder: "Search companies or contacts...",
      filters: FULL_FILTERS,
      pageSize: 5,
      defaultSort: { amount: "descending" },
      footer: (filteredData) => /* @__PURE__ */ React2.createElement(TableRow, null, /* @__PURE__ */ React2.createElement(TableHeader, null, "Total"), /* @__PURE__ */ React2.createElement(TableHeader, null), /* @__PURE__ */ React2.createElement(TableHeader, null), /* @__PURE__ */ React2.createElement(TableHeader, null), /* @__PURE__ */ React2.createElement(TableHeader, { align: "right" }, formatCurrency(filteredData.reduce((sum, r) => sum + r.amount, 0))), /* @__PURE__ */ React2.createElement(TableHeader, null))
    }
  ));
  const SELECT_COLUMNS = [
    {
      field: "name",
      label: "Company",
      sortable: true,
      renderCell: (val) => /* @__PURE__ */ React2.createElement(Text, { format: { fontWeight: "demibold" } }, val)
    },
    {
      field: "contact",
      label: "Contact",
      renderCell: (val) => val
    },
    {
      field: "status",
      label: "Status",
      renderCell: (val) => /* @__PURE__ */ React2.createElement(StatusTag, { variant: STATUS_COLORS[val] }, STATUS_LABELS[val])
    },
    {
      field: "amount",
      label: "Amount",
      sortable: true,
      align: "right",
      renderCell: (val) => formatCurrency(val)
    }
  ];
  const SelectableDemo = () => {
    const [selected, setSelected] = React2.useState([]);
    return /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "sm" }, /* @__PURE__ */ React2.createElement(Heading, null, "Row Selection"), /* @__PURE__ */ React2.createElement(Text, { variant: "microcopy" }, "Select individual rows or use the header checkbox to select all.", selected.length > 0 && ` (${selected.length} selected)`), /* @__PURE__ */ React2.createElement(
      DataTable,
      {
        data: SAMPLE_DATA,
        columns: SELECT_COLUMNS,
        selectable: true,
        rowIdField: "id",
        onSelectionChange: setSelected,
        searchFields: ["name"],
        pageSize: 5
      }
    ));
  };
  const EditableDemo = () => {
    const [data, setData] = React2.useState(SAMPLE_DATA);
    const handleEdit = React2.useCallback((row, field, newValue) => {
      setData(
        (prev) => prev.map((r) => r.id === row.id ? { ...r, [field]: newValue } : r)
      );
    }, []);
    const editColumns = [
      {
        field: "name",
        label: "Company",
        sortable: true,
        editable: true,
        editType: "text",
        editValidate: (val) => {
          if (!val || val.trim() === "") return "Company name is required";
          if (val.length < 2) return "Must be at least 2 characters";
          return true;
        },
        renderCell: (val) => /* @__PURE__ */ React2.createElement(Text, { format: { fontWeight: "demibold" } }, val)
      },
      {
        field: "contact",
        label: "Contact",
        editable: true,
        editType: "text",
        renderCell: (val) => val
      },
      {
        field: "status",
        label: "Status",
        editable: true,
        editType: "select",
        editOptions: [
          { label: "Active", value: "active" },
          { label: "At Risk", value: "at-risk" },
          { label: "Churned", value: "churned" }
        ],
        renderCell: (val) => /* @__PURE__ */ React2.createElement(StatusTag, { variant: STATUS_COLORS[val] }, STATUS_LABELS[val])
      },
      {
        field: "amount",
        label: "Amount",
        sortable: true,
        align: "right",
        editable: true,
        editType: "currency",
        editValidate: (val) => {
          if (val === null || val === void 0 || val === "") return "Amount is required";
          if (Number(val) < 0) return "Amount cannot be negative";
          if (Number(val) > 1e6) return "Amount cannot exceed $1,000,000";
          return true;
        },
        renderCell: (val) => formatCurrency(val)
      },
      {
        field: "priority",
        label: "Priority",
        editable: true,
        editType: "select",
        renderCell: (val) => val ? /* @__PURE__ */ React2.createElement(Tag, { variant: "success" }, "Yes") : /* @__PURE__ */ React2.createElement(Tag, { variant: "danger" }, "No")
      }
    ];
    return /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "sm" }, /* @__PURE__ */ React2.createElement(Heading, null, "Inline Editing"), /* @__PURE__ */ React2.createElement(Text, { variant: "microcopy" }, "Click any highlighted cell to edit. Text/number fields show Save/Cancel. Dropdowns and toggles commit instantly."), /* @__PURE__ */ React2.createElement(
      DataTable,
      {
        data,
        columns: editColumns,
        rowIdField: "id",
        onRowEdit: handleEdit,
        searchFields: ["name", "contact"],
        pageSize: 6
      }
    ));
  };
  const InlineEditDemo = () => {
    const [data, setData] = React2.useState(SAMPLE_DATA);
    const handleEdit = React2.useCallback((row, field, newValue) => {
      setData(
        (prev) => prev.map((r) => r.id === row.id ? { ...r, [field]: newValue } : r)
      );
    }, []);
    const inlineColumns = [
      {
        field: "name",
        label: "Company",
        editable: true,
        editType: "text",
        renderCell: (val) => val
      },
      {
        field: "contact",
        label: "Contact",
        editable: true,
        editType: "text",
        renderCell: (val) => val
      },
      {
        field: "status",
        label: "Status",
        editable: true,
        editType: "select",
        editOptions: [
          { label: "Active", value: "active" },
          { label: "At Risk", value: "at-risk" },
          { label: "Churned", value: "churned" }
        ],
        renderCell: (val) => val
      },
      {
        field: "amount",
        label: "Amount",
        align: "right",
        editable: true,
        editType: "currency",
        renderCell: (val) => formatCurrency(val)
      },
      {
        field: "priority",
        label: "Priority",
        editable: true,
        editType: "checkbox",
        renderCell: (val) => val ? "Yes" : "No"
      }
    ];
    return /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "sm" }, /* @__PURE__ */ React2.createElement(Heading, null, "Inline Edit Mode"), /* @__PURE__ */ React2.createElement(Text, { variant: "microcopy" }, "All editable cells always show their input controls. Changes fire immediately."), /* @__PURE__ */ React2.createElement(
      DataTable,
      {
        data,
        columns: inlineColumns,
        rowIdField: "id",
        editMode: "inline",
        onRowEdit: handleEdit,
        pageSize: 5
      }
    ));
  };
  const GROUP_COLUMNS = [
    {
      field: "name",
      label: "Company",
      renderCell: (val) => val
    },
    { field: "contact", label: "Contact", renderCell: (val) => val },
    {
      field: "status",
      label: "Status",
      renderCell: (val) => /* @__PURE__ */ React2.createElement(StatusTag, { variant: STATUS_COLORS[val] }, STATUS_LABELS[val])
    },
    {
      field: "amount",
      label: "Amount",
      align: "right",
      renderCell: (val) => formatCurrency(val)
    }
  ];
  const GroupedDemo = () => /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "sm" }, /* @__PURE__ */ React2.createElement(Heading, null, "Row Grouping"), /* @__PURE__ */ React2.createElement(Text, { variant: "microcopy" }, "Collapsible groups with aggregated totals. Click a group to expand/collapse."), /* @__PURE__ */ React2.createElement(
    DataTable,
    {
      data: SAMPLE_DATA,
      columns: GROUP_COLUMNS,
      groupBy: {
        field: "category",
        label: (value, rows) => `${value.charAt(0).toUpperCase() + value.slice(1)} (${rows.length})`,
        sort: "asc",
        aggregations: {
          amount: (rows) => formatCurrency(rows.reduce((sum, r) => sum + r.amount, 0)),
          status: (rows) => {
            const active = rows.filter((r) => r.status === "active").length;
            return /* @__PURE__ */ React2.createElement(Text, { variant: "microcopy" }, active, " of ", rows.length, " active");
          }
        }
      },
      pageSize: 30
    }
  ));
  hubspot.extend(() => /* @__PURE__ */ React2.createElement(DataTableDemoCard, null));
  const DataTableDemoCard = () => /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "lg" }, /* @__PURE__ */ React2.createElement(FullFeaturedDemo, null), /* @__PURE__ */ React2.createElement(Divider, null), /* @__PURE__ */ React2.createElement(SelectableDemo, null), /* @__PURE__ */ React2.createElement(Divider, null), /* @__PURE__ */ React2.createElement(EditableDemo, null), /* @__PURE__ */ React2.createElement(Divider, null), /* @__PURE__ */ React2.createElement(InlineEditDemo, null), /* @__PURE__ */ React2.createElement(Divider, null), /* @__PURE__ */ React2.createElement(GroupedDemo, null));
})(React, RemoteUI);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YVRhYmxlRGVtby5qcyIsInNvdXJjZXMiOlsiLi4vY2FyZHMvbm9kZV9tb2R1bGVzL0BodWJzcG90L3VpLWV4dGVuc2lvbnMvZGlzdC9pbnRlcm5hbC9nbG9iYWwtdXRpbHMuanMiLCIuLi9jYXJkcy9ub2RlX21vZHVsZXMvQGh1YnNwb3QvdWktZXh0ZW5zaW9ucy9kaXN0L2h1YnNwb3QuanMiLCIuLi9jYXJkcy9ub2RlX21vZHVsZXMvQGh1YnNwb3QvdWktZXh0ZW5zaW9ucy9kaXN0L3NoYXJlZC90eXBlcy9odHRwLXJlcXVlc3RzLmpzIiwiLi4vY2FyZHMvbm9kZV9tb2R1bGVzL3JlYWN0L2Nqcy9yZWFjdC1qc3gtcnVudGltZS5kZXZlbG9wbWVudC5qcyIsIi4uL2NhcmRzL25vZGVfbW9kdWxlcy9yZWFjdC9qc3gtcnVudGltZS5qcyIsIi4uL2NhcmRzL25vZGVfbW9kdWxlcy9AaHVic3BvdC91aS1leHRlbnNpb25zL2Rpc3Qvc2hhcmVkL3V0aWxzL3JlbW90ZS1jb21wb25lbnQtcmVnaXN0cnkuanMiLCIuLi9jYXJkcy9ub2RlX21vZHVsZXMvQGh1YnNwb3QvdWktZXh0ZW5zaW9ucy9kaXN0L3NoYXJlZC9yZW1vdGVDb21wb25lbnRzLmpzIiwiLi4vY2FyZHMvbm9kZV9tb2R1bGVzL0BodWJzcG90L3VpLWV4dGVuc2lvbnMvZGlzdC9pbnRlcm5hbC9ob29rLXV0aWxzLmpzIiwiLi4vY2FyZHMvY29tcG9uZW50cy9EYXRhVGFibGUuanN4IiwiLi4vY2FyZHMvRGF0YVRhYmxlRGVtby5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDaGVja3MgaWYgdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQgaXMgYSBIdWJTcG90IGV4dGVuc2lvbiB3b3JrZXIuXG4gKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBjdXJyZW50IGVudmlyb25tZW50IGlzIGEgSHViU3BvdCBleHRlbnNpb24gd29ya2VyLlxuICovXG5jb25zdCBpc1J1bm5pbmdJbldvcmtlciA9ICgpID0+IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHNlbGYuX19IVUJTUE9UX0VYVEVOU0lPTl9XT1JLRVJfXyA9PT0gdHJ1ZTtcbi8qKlxuICogQSBmYWtlIHdvcmtlciBnbG9iYWxzIG9iamVjdCBmb3IgdXNlIGluIHRlc3QgZW52aXJvbm1lbnRzLlxuICovXG5jb25zdCBmYWtlV29ya2VyR2xvYmFscyA9IHtcbiAgICBsb2dnZXI6IHtcbiAgICAgICAgZGVidWc6IChkYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5mbzogKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhkYXRhKTtcbiAgICAgICAgfSxcbiAgICAgICAgd2FybjogKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihkYXRhKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IChkYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGRhdGEpO1xuICAgICAgICB9LFxuICAgIH0sXG4gICAgZXh0ZW5kX1YyOiAoKSA9PiB7XG4gICAgICAgIC8vIE5vLW9wIGluIHRlc3QgZW52aXJvbm1lbnRcbiAgICB9LFxuICAgIC8vIEB0cy1leHBlY3QtZXJyb3Igd2UgYXJlIG5vdCB1c2luZyB0aGUgd29ya2VyIGVuZHBvaW50IGluIHRlc3RzIGVudi5cbiAgICBfX3VzZUV4dGVuc2lvbkNvbnRleHQ6ICgpID0+IHtcbiAgICAgICAgLy8gTm8tb3AgaW4gdGVzdCBlbnZpcm9ubWVudFxuICAgIH0sXG59O1xuLyoqXG4gKiBHZXRzIHRoZSB3b3JrZXIgZ2xvYmFscyBvYmplY3QgZm9yIHRoZSBjdXJyZW50IGVudmlyb25tZW50LlxuICogQHJldHVybnMgVGhlIHdvcmtlciBnbG9iYWxzIG9iamVjdC5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldFdvcmtlckdsb2JhbHMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGlzUnVubmluZ0luV29ya2VyKClcbiAgICAgICAgPyBzZWxmXG4gICAgICAgIDogZmFrZVdvcmtlckdsb2JhbHM7XG59O1xuIiwiaW1wb3J0IHsgZ2V0V29ya2VyR2xvYmFscyB9IGZyb20gXCIuL2ludGVybmFsL2dsb2JhbC11dGlscy5qc1wiO1xuY29uc3QgZXh0ZW5kX1YyID0gZ2V0V29ya2VyR2xvYmFscygpLmV4dGVuZF9WMjtcbmV4cG9ydCBmdW5jdGlvbiBzZXJ2ZXJsZXNzKG5hbWUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VsZi5zZXJ2ZXJsZXNzKG5hbWUsIG9wdGlvbnMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoKHVybCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZWxmLmhzRmV0Y2godXJsLCBvcHRpb25zKTtcbn1cbmV4cG9ydCBjb25zdCBodWJzcG90ID0ge1xuICAgIGV4dGVuZDogZXh0ZW5kX1YyLFxuICAgIHNlcnZlcmxlc3MsXG4gICAgZmV0Y2gsXG59O1xuIiwiLyoqXG4gKiBAY2F0ZWdvcnkgU2VydmVybGVzc1xuICovXG5leHBvcnQgdmFyIFNlcnZlcmxlc3NFeGVjdXRpb25TdGF0dXM7XG4oZnVuY3Rpb24gKFNlcnZlcmxlc3NFeGVjdXRpb25TdGF0dXMpIHtcbiAgICBTZXJ2ZXJsZXNzRXhlY3V0aW9uU3RhdHVzW1wiU3VjY2Vzc1wiXSA9IFwiU1VDQ0VTU1wiO1xuICAgIFNlcnZlcmxlc3NFeGVjdXRpb25TdGF0dXNbXCJFcnJvclwiXSA9IFwiRVJST1JcIjtcbn0pKFNlcnZlcmxlc3NFeGVjdXRpb25TdGF0dXMgfHwgKFNlcnZlcmxlc3NFeGVjdXRpb25TdGF0dXMgPSB7fSkpO1xuIiwiLyoqXG4gKiBAbGljZW5zZSBSZWFjdFxuICogcmVhY3QtanN4LXJ1bnRpbWUuZGV2ZWxvcG1lbnQuanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgKGZ1bmN0aW9uKCkge1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG4vLyBBVFRFTlRJT05cbi8vIFdoZW4gYWRkaW5nIG5ldyBzeW1ib2xzIHRvIHRoaXMgZmlsZSxcbi8vIFBsZWFzZSBjb25zaWRlciBhbHNvIGFkZGluZyB0byAncmVhY3QtZGV2dG9vbHMtc2hhcmVkL3NyYy9iYWNrZW5kL1JlYWN0U3ltYm9scydcbi8vIFRoZSBTeW1ib2wgdXNlZCB0byB0YWcgdGhlIFJlYWN0RWxlbWVudC1saWtlIHR5cGVzLlxudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKTtcbnZhciBSRUFDVF9QT1JUQUxfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LnBvcnRhbCcpO1xudmFyIFJFQUNUX0ZSQUdNRU5UX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5mcmFnbWVudCcpO1xudmFyIFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5zdHJpY3RfbW9kZScpO1xudmFyIFJFQUNUX1BST0ZJTEVSX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5wcm9maWxlcicpO1xudmFyIFJFQUNUX1BST1ZJREVSX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5wcm92aWRlcicpO1xudmFyIFJFQUNUX0NPTlRFWFRfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LmNvbnRleHQnKTtcbnZhciBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFID0gU3ltYm9sLmZvcigncmVhY3QuZm9yd2FyZF9yZWYnKTtcbnZhciBSRUFDVF9TVVNQRU5TRV9UWVBFID0gU3ltYm9sLmZvcigncmVhY3Quc3VzcGVuc2UnKTtcbnZhciBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5zdXNwZW5zZV9saXN0Jyk7XG52YXIgUkVBQ1RfTUVNT19UWVBFID0gU3ltYm9sLmZvcigncmVhY3QubWVtbycpO1xudmFyIFJFQUNUX0xBWllfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LmxhenknKTtcbnZhciBSRUFDVF9PRkZTQ1JFRU5fVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0Lm9mZnNjcmVlbicpO1xudmFyIE1BWUJFX0lURVJBVE9SX1NZTUJPTCA9IFN5bWJvbC5pdGVyYXRvcjtcbnZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJztcbmZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICBpZiAobWF5YmVJdGVyYWJsZSA9PT0gbnVsbCB8fCB0eXBlb2YgbWF5YmVJdGVyYWJsZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBtYXliZUl0ZXJhdG9yID0gTUFZQkVfSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbTUFZQkVfSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXTtcblxuICBpZiAodHlwZW9mIG1heWJlSXRlcmF0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gbWF5YmVJdGVyYXRvcjtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG52YXIgUmVhY3RTaGFyZWRJbnRlcm5hbHMgPSBSZWFjdC5fX1NFQ1JFVF9JTlRFUk5BTFNfRE9fTk9UX1VTRV9PUl9ZT1VfV0lMTF9CRV9GSVJFRDtcblxuZnVuY3Rpb24gZXJyb3IoZm9ybWF0KSB7XG4gIHtcbiAgICB7XG4gICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBhcmdzW19rZXkyIC0gMV0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICBwcmludFdhcm5pbmcoJ2Vycm9yJywgZm9ybWF0LCBhcmdzKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJpbnRXYXJuaW5nKGxldmVsLCBmb3JtYXQsIGFyZ3MpIHtcbiAgLy8gV2hlbiBjaGFuZ2luZyB0aGlzIGxvZ2ljLCB5b3UgbWlnaHQgd2FudCB0byBhbHNvXG4gIC8vIHVwZGF0ZSBjb25zb2xlV2l0aFN0YWNrRGV2Lnd3dy5qcyBhcyB3ZWxsLlxuICB7XG4gICAgdmFyIFJlYWN0RGVidWdDdXJyZW50RnJhbWUgPSBSZWFjdFNoYXJlZEludGVybmFscy5SZWFjdERlYnVnQ3VycmVudEZyYW1lO1xuICAgIHZhciBzdGFjayA9IFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSgpO1xuXG4gICAgaWYgKHN0YWNrICE9PSAnJykge1xuICAgICAgZm9ybWF0ICs9ICclcyc7XG4gICAgICBhcmdzID0gYXJncy5jb25jYXQoW3N0YWNrXSk7XG4gICAgfSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaW50ZXJuYWwvc2FmZS1zdHJpbmctY29lcmNpb25cblxuXG4gICAgdmFyIGFyZ3NXaXRoRm9ybWF0ID0gYXJncy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBTdHJpbmcoaXRlbSk7XG4gICAgfSk7IC8vIENhcmVmdWw6IFJOIGN1cnJlbnRseSBkZXBlbmRzIG9uIHRoaXMgcHJlZml4XG5cbiAgICBhcmdzV2l0aEZvcm1hdC51bnNoaWZ0KCdXYXJuaW5nOiAnICsgZm9ybWF0KTsgLy8gV2UgaW50ZW50aW9uYWxseSBkb24ndCB1c2Ugc3ByZWFkIChvciAuYXBwbHkpIGRpcmVjdGx5IGJlY2F1c2UgaXRcbiAgICAvLyBicmVha3MgSUU5OiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzEzNjEwXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWludGVybmFsL25vLXByb2R1Y3Rpb24tbG9nZ2luZ1xuXG4gICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZVtsZXZlbF0sIGNvbnNvbGUsIGFyZ3NXaXRoRm9ybWF0KTtcbiAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgZW5hYmxlU2NvcGVBUEkgPSBmYWxzZTsgLy8gRXhwZXJpbWVudGFsIENyZWF0ZSBFdmVudCBIYW5kbGUgQVBJLlxudmFyIGVuYWJsZUNhY2hlRWxlbWVudCA9IGZhbHNlO1xudmFyIGVuYWJsZVRyYW5zaXRpb25UcmFjaW5nID0gZmFsc2U7IC8vIE5vIGtub3duIGJ1Z3MsIGJ1dCBuZWVkcyBwZXJmb3JtYW5jZSB0ZXN0aW5nXG5cbnZhciBlbmFibGVMZWdhY3lIaWRkZW4gPSBmYWxzZTsgLy8gRW5hYmxlcyB1bnN0YWJsZV9hdm9pZFRoaXNGYWxsYmFjayBmZWF0dXJlIGluIEZpYmVyXG4vLyBzdHVmZi4gSW50ZW5kZWQgdG8gZW5hYmxlIFJlYWN0IGNvcmUgbWVtYmVycyB0byBtb3JlIGVhc2lseSBkZWJ1ZyBzY2hlZHVsaW5nXG4vLyBpc3N1ZXMgaW4gREVWIGJ1aWxkcy5cblxudmFyIGVuYWJsZURlYnVnVHJhY2luZyA9IGZhbHNlOyAvLyBUcmFjayB3aGljaCBGaWJlcihzKSBzY2hlZHVsZSByZW5kZXIgd29yay5cblxudmFyIFJFQUNUX01PRFVMRV9SRUZFUkVOQ0U7XG5cbntcbiAgUkVBQ1RfTU9EVUxFX1JFRkVSRU5DRSA9IFN5bWJvbC5mb3IoJ3JlYWN0Lm1vZHVsZS5yZWZlcmVuY2UnKTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpIHtcbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9IC8vIE5vdGU6IHR5cGVvZiBtaWdodCBiZSBvdGhlciB0aGFuICdzeW1ib2wnIG9yICdudW1iZXInIChlLmcuIGlmIGl0J3MgYSBwb2x5ZmlsbCkuXG5cblxuICBpZiAodHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9QUk9GSUxFUl9UWVBFIHx8IGVuYWJsZURlYnVnVHJhY2luZyAgfHwgdHlwZSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSB8fCBlbmFibGVMZWdhY3lIaWRkZW4gIHx8IHR5cGUgPT09IFJFQUNUX09GRlNDUkVFTl9UWVBFIHx8IGVuYWJsZVNjb3BlQVBJICB8fCBlbmFibGVDYWNoZUVsZW1lbnQgIHx8IGVuYWJsZVRyYW5zaXRpb25UcmFjaW5nICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiB0eXBlICE9PSBudWxsKSB7XG4gICAgaWYgKHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0xBWllfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9DT05URVhUX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSB8fCAvLyBUaGlzIG5lZWRzIHRvIGluY2x1ZGUgYWxsIHBvc3NpYmxlIG1vZHVsZSByZWZlcmVuY2Ugb2JqZWN0XG4gICAgLy8gdHlwZXMgc3VwcG9ydGVkIGJ5IGFueSBGbGlnaHQgY29uZmlndXJhdGlvbiBhbnl3aGVyZSBzaW5jZVxuICAgIC8vIHdlIGRvbid0IGtub3cgd2hpY2ggRmxpZ2h0IGJ1aWxkIHRoaXMgd2lsbCBlbmQgdXAgYmVpbmcgdXNlZFxuICAgIC8vIHdpdGguXG4gICAgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTU9EVUxFX1JFRkVSRU5DRSB8fCB0eXBlLmdldE1vZHVsZUlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZ2V0V3JhcHBlZE5hbWUob3V0ZXJUeXBlLCBpbm5lclR5cGUsIHdyYXBwZXJOYW1lKSB7XG4gIHZhciBkaXNwbGF5TmFtZSA9IG91dGVyVHlwZS5kaXNwbGF5TmFtZTtcblxuICBpZiAoZGlzcGxheU5hbWUpIHtcbiAgICByZXR1cm4gZGlzcGxheU5hbWU7XG4gIH1cblxuICB2YXIgZnVuY3Rpb25OYW1lID0gaW5uZXJUeXBlLmRpc3BsYXlOYW1lIHx8IGlubmVyVHlwZS5uYW1lIHx8ICcnO1xuICByZXR1cm4gZnVuY3Rpb25OYW1lICE9PSAnJyA/IHdyYXBwZXJOYW1lICsgXCIoXCIgKyBmdW5jdGlvbk5hbWUgKyBcIilcIiA6IHdyYXBwZXJOYW1lO1xufSAvLyBLZWVwIGluIHN5bmMgd2l0aCByZWFjdC1yZWNvbmNpbGVyL2dldENvbXBvbmVudE5hbWVGcm9tRmliZXJcblxuXG5mdW5jdGlvbiBnZXRDb250ZXh0TmFtZSh0eXBlKSB7XG4gIHJldHVybiB0eXBlLmRpc3BsYXlOYW1lIHx8ICdDb250ZXh0Jztcbn0gLy8gTm90ZSB0aGF0IHRoZSByZWNvbmNpbGVyIHBhY2thZ2Ugc2hvdWxkIGdlbmVyYWxseSBwcmVmZXIgdG8gdXNlIGdldENvbXBvbmVudE5hbWVGcm9tRmliZXIoKSBpbnN0ZWFkLlxuXG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0eXBlKSB7XG4gIGlmICh0eXBlID09IG51bGwpIHtcbiAgICAvLyBIb3N0IHJvb3QsIHRleHQgbm9kZSBvciBqdXN0IGludmFsaWQgdHlwZS5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHtcbiAgICBpZiAodHlwZW9mIHR5cGUudGFnID09PSAnbnVtYmVyJykge1xuICAgICAgZXJyb3IoJ1JlY2VpdmVkIGFuIHVuZXhwZWN0ZWQgb2JqZWN0IGluIGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSgpLiAnICsgJ1RoaXMgaXMgbGlrZWx5IGEgYnVnIGluIFJlYWN0LiBQbGVhc2UgZmlsZSBhbiBpc3N1ZS4nKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgbnVsbDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgUkVBQ1RfRlJBR01FTlRfVFlQRTpcbiAgICAgIHJldHVybiAnRnJhZ21lbnQnO1xuXG4gICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgIHJldHVybiAnUG9ydGFsJztcblxuICAgIGNhc2UgUkVBQ1RfUFJPRklMRVJfVFlQRTpcbiAgICAgIHJldHVybiAnUHJvZmlsZXInO1xuXG4gICAgY2FzZSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFOlxuICAgICAgcmV0dXJuICdTdHJpY3RNb2RlJztcblxuICAgIGNhc2UgUkVBQ1RfU1VTUEVOU0VfVFlQRTpcbiAgICAgIHJldHVybiAnU3VzcGVuc2UnO1xuXG4gICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEU6XG4gICAgICByZXR1cm4gJ1N1c3BlbnNlTGlzdCc7XG5cbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBzd2l0Y2ggKHR5cGUuJCR0eXBlb2YpIHtcbiAgICAgIGNhc2UgUkVBQ1RfQ09OVEVYVF9UWVBFOlxuICAgICAgICB2YXIgY29udGV4dCA9IHR5cGU7XG4gICAgICAgIHJldHVybiBnZXRDb250ZXh0TmFtZShjb250ZXh0KSArICcuQ29uc3VtZXInO1xuXG4gICAgICBjYXNlIFJFQUNUX1BST1ZJREVSX1RZUEU6XG4gICAgICAgIHZhciBwcm92aWRlciA9IHR5cGU7XG4gICAgICAgIHJldHVybiBnZXRDb250ZXh0TmFtZShwcm92aWRlci5fY29udGV4dCkgKyAnLlByb3ZpZGVyJztcblxuICAgICAgY2FzZSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFOlxuICAgICAgICByZXR1cm4gZ2V0V3JhcHBlZE5hbWUodHlwZSwgdHlwZS5yZW5kZXIsICdGb3J3YXJkUmVmJyk7XG5cbiAgICAgIGNhc2UgUkVBQ1RfTUVNT19UWVBFOlxuICAgICAgICB2YXIgb3V0ZXJOYW1lID0gdHlwZS5kaXNwbGF5TmFtZSB8fCBudWxsO1xuXG4gICAgICAgIGlmIChvdXRlck5hbWUgIT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gb3V0ZXJOYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0eXBlLnR5cGUpIHx8ICdNZW1vJztcblxuICAgICAgY2FzZSBSRUFDVF9MQVpZX1RZUEU6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgbGF6eUNvbXBvbmVudCA9IHR5cGU7XG4gICAgICAgICAgdmFyIHBheWxvYWQgPSBsYXp5Q29tcG9uZW50Ll9wYXlsb2FkO1xuICAgICAgICAgIHZhciBpbml0ID0gbGF6eUNvbXBvbmVudC5faW5pdDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0Q29tcG9uZW50TmFtZUZyb21UeXBlKGluaXQocGF5bG9hZCkpO1xuICAgICAgICAgIH0gY2F0Y2ggKHgpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZmFsbHRocm91Z2hcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxudmFyIGFzc2lnbiA9IE9iamVjdC5hc3NpZ247XG5cbi8vIEhlbHBlcnMgdG8gcGF0Y2ggY29uc29sZS5sb2dzIHRvIGF2b2lkIGxvZ2dpbmcgZHVyaW5nIHNpZGUtZWZmZWN0IGZyZWVcbi8vIHJlcGxheWluZyBvbiByZW5kZXIgZnVuY3Rpb24uIFRoaXMgY3VycmVudGx5IG9ubHkgcGF0Y2hlcyB0aGUgb2JqZWN0XG4vLyBsYXppbHkgd2hpY2ggd29uJ3QgY292ZXIgaWYgdGhlIGxvZyBmdW5jdGlvbiB3YXMgZXh0cmFjdGVkIGVhZ2VybHkuXG4vLyBXZSBjb3VsZCBhbHNvIGVhZ2VybHkgcGF0Y2ggdGhlIG1ldGhvZC5cbnZhciBkaXNhYmxlZERlcHRoID0gMDtcbnZhciBwcmV2TG9nO1xudmFyIHByZXZJbmZvO1xudmFyIHByZXZXYXJuO1xudmFyIHByZXZFcnJvcjtcbnZhciBwcmV2R3JvdXA7XG52YXIgcHJldkdyb3VwQ29sbGFwc2VkO1xudmFyIHByZXZHcm91cEVuZDtcblxuZnVuY3Rpb24gZGlzYWJsZWRMb2coKSB7fVxuXG5kaXNhYmxlZExvZy5fX3JlYWN0RGlzYWJsZWRMb2cgPSB0cnVlO1xuZnVuY3Rpb24gZGlzYWJsZUxvZ3MoKSB7XG4gIHtcbiAgICBpZiAoZGlzYWJsZWREZXB0aCA9PT0gMCkge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgcmVhY3QtaW50ZXJuYWwvbm8tcHJvZHVjdGlvbi1sb2dnaW5nICovXG4gICAgICBwcmV2TG9nID0gY29uc29sZS5sb2c7XG4gICAgICBwcmV2SW5mbyA9IGNvbnNvbGUuaW5mbztcbiAgICAgIHByZXZXYXJuID0gY29uc29sZS53YXJuO1xuICAgICAgcHJldkVycm9yID0gY29uc29sZS5lcnJvcjtcbiAgICAgIHByZXZHcm91cCA9IGNvbnNvbGUuZ3JvdXA7XG4gICAgICBwcmV2R3JvdXBDb2xsYXBzZWQgPSBjb25zb2xlLmdyb3VwQ29sbGFwc2VkO1xuICAgICAgcHJldkdyb3VwRW5kID0gY29uc29sZS5ncm91cEVuZDsgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8xOTA5OVxuXG4gICAgICB2YXIgcHJvcHMgPSB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6IGRpc2FibGVkTG9nLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfTsgLy8gJEZsb3dGaXhNZSBGbG93IHRoaW5rcyBjb25zb2xlIGlzIGltbXV0YWJsZS5cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY29uc29sZSwge1xuICAgICAgICBpbmZvOiBwcm9wcyxcbiAgICAgICAgbG9nOiBwcm9wcyxcbiAgICAgICAgd2FybjogcHJvcHMsXG4gICAgICAgIGVycm9yOiBwcm9wcyxcbiAgICAgICAgZ3JvdXA6IHByb3BzLFxuICAgICAgICBncm91cENvbGxhcHNlZDogcHJvcHMsXG4gICAgICAgIGdyb3VwRW5kOiBwcm9wc1xuICAgICAgfSk7XG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIHJlYWN0LWludGVybmFsL25vLXByb2R1Y3Rpb24tbG9nZ2luZyAqL1xuICAgIH1cblxuICAgIGRpc2FibGVkRGVwdGgrKztcbiAgfVxufVxuZnVuY3Rpb24gcmVlbmFibGVMb2dzKCkge1xuICB7XG4gICAgZGlzYWJsZWREZXB0aC0tO1xuXG4gICAgaWYgKGRpc2FibGVkRGVwdGggPT09IDApIHtcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIHJlYWN0LWludGVybmFsL25vLXByb2R1Y3Rpb24tbG9nZ2luZyAqL1xuICAgICAgdmFyIHByb3BzID0ge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9OyAvLyAkRmxvd0ZpeE1lIEZsb3cgdGhpbmtzIGNvbnNvbGUgaXMgaW1tdXRhYmxlLlxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhjb25zb2xlLCB7XG4gICAgICAgIGxvZzogYXNzaWduKHt9LCBwcm9wcywge1xuICAgICAgICAgIHZhbHVlOiBwcmV2TG9nXG4gICAgICAgIH0pLFxuICAgICAgICBpbmZvOiBhc3NpZ24oe30sIHByb3BzLCB7XG4gICAgICAgICAgdmFsdWU6IHByZXZJbmZvXG4gICAgICAgIH0pLFxuICAgICAgICB3YXJuOiBhc3NpZ24oe30sIHByb3BzLCB7XG4gICAgICAgICAgdmFsdWU6IHByZXZXYXJuXG4gICAgICAgIH0pLFxuICAgICAgICBlcnJvcjogYXNzaWduKHt9LCBwcm9wcywge1xuICAgICAgICAgIHZhbHVlOiBwcmV2RXJyb3JcbiAgICAgICAgfSksXG4gICAgICAgIGdyb3VwOiBhc3NpZ24oe30sIHByb3BzLCB7XG4gICAgICAgICAgdmFsdWU6IHByZXZHcm91cFxuICAgICAgICB9KSxcbiAgICAgICAgZ3JvdXBDb2xsYXBzZWQ6IGFzc2lnbih7fSwgcHJvcHMsIHtcbiAgICAgICAgICB2YWx1ZTogcHJldkdyb3VwQ29sbGFwc2VkXG4gICAgICAgIH0pLFxuICAgICAgICBncm91cEVuZDogYXNzaWduKHt9LCBwcm9wcywge1xuICAgICAgICAgIHZhbHVlOiBwcmV2R3JvdXBFbmRcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgICAgLyogZXNsaW50LWVuYWJsZSByZWFjdC1pbnRlcm5hbC9uby1wcm9kdWN0aW9uLWxvZ2dpbmcgKi9cbiAgICB9XG5cbiAgICBpZiAoZGlzYWJsZWREZXB0aCA8IDApIHtcbiAgICAgIGVycm9yKCdkaXNhYmxlZERlcHRoIGZlbGwgYmVsb3cgemVyby4gJyArICdUaGlzIGlzIGEgYnVnIGluIFJlYWN0LiBQbGVhc2UgZmlsZSBhbiBpc3N1ZS4nKTtcbiAgICB9XG4gIH1cbn1cblxudmFyIFJlYWN0Q3VycmVudERpc3BhdGNoZXIgPSBSZWFjdFNoYXJlZEludGVybmFscy5SZWFjdEN1cnJlbnREaXNwYXRjaGVyO1xudmFyIHByZWZpeDtcbmZ1bmN0aW9uIGRlc2NyaWJlQnVpbHRJbkNvbXBvbmVudEZyYW1lKG5hbWUsIHNvdXJjZSwgb3duZXJGbikge1xuICB7XG4gICAgaWYgKHByZWZpeCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBFeHRyYWN0IHRoZSBWTSBzcGVjaWZpYyBwcmVmaXggdXNlZCBieSBlYWNoIGxpbmUuXG4gICAgICB0cnkge1xuICAgICAgICB0aHJvdyBFcnJvcigpO1xuICAgICAgfSBjYXRjaCAoeCkge1xuICAgICAgICB2YXIgbWF0Y2ggPSB4LnN0YWNrLnRyaW0oKS5tYXRjaCgvXFxuKCAqKGF0ICk/KS8pO1xuICAgICAgICBwcmVmaXggPSBtYXRjaCAmJiBtYXRjaFsxXSB8fCAnJztcbiAgICAgIH1cbiAgICB9IC8vIFdlIHVzZSB0aGUgcHJlZml4IHRvIGVuc3VyZSBvdXIgc3RhY2tzIGxpbmUgdXAgd2l0aCBuYXRpdmUgc3RhY2sgZnJhbWVzLlxuXG5cbiAgICByZXR1cm4gJ1xcbicgKyBwcmVmaXggKyBuYW1lO1xuICB9XG59XG52YXIgcmVlbnRyeSA9IGZhbHNlO1xudmFyIGNvbXBvbmVudEZyYW1lQ2FjaGU7XG5cbntcbiAgdmFyIFBvc3NpYmx5V2Vha01hcCA9IHR5cGVvZiBXZWFrTWFwID09PSAnZnVuY3Rpb24nID8gV2Vha01hcCA6IE1hcDtcbiAgY29tcG9uZW50RnJhbWVDYWNoZSA9IG5ldyBQb3NzaWJseVdlYWtNYXAoKTtcbn1cblxuZnVuY3Rpb24gZGVzY3JpYmVOYXRpdmVDb21wb25lbnRGcmFtZShmbiwgY29uc3RydWN0KSB7XG4gIC8vIElmIHNvbWV0aGluZyBhc2tlZCBmb3IgYSBzdGFjayBpbnNpZGUgYSBmYWtlIHJlbmRlciwgaXQgc2hvdWxkIGdldCBpZ25vcmVkLlxuICBpZiAoICFmbiB8fCByZWVudHJ5KSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAge1xuICAgIHZhciBmcmFtZSA9IGNvbXBvbmVudEZyYW1lQ2FjaGUuZ2V0KGZuKTtcblxuICAgIGlmIChmcmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZnJhbWU7XG4gICAgfVxuICB9XG5cbiAgdmFyIGNvbnRyb2w7XG4gIHJlZW50cnkgPSB0cnVlO1xuICB2YXIgcHJldmlvdXNQcmVwYXJlU3RhY2tUcmFjZSA9IEVycm9yLnByZXBhcmVTdGFja1RyYWNlOyAvLyAkRmxvd0ZpeE1lIEl0IGRvZXMgYWNjZXB0IHVuZGVmaW5lZC5cblxuICBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZSA9IHVuZGVmaW5lZDtcbiAgdmFyIHByZXZpb3VzRGlzcGF0Y2hlcjtcblxuICB7XG4gICAgcHJldmlvdXNEaXNwYXRjaGVyID0gUmVhY3RDdXJyZW50RGlzcGF0Y2hlci5jdXJyZW50OyAvLyBTZXQgdGhlIGRpc3BhdGNoZXIgaW4gREVWIGJlY2F1c2UgdGhpcyBtaWdodCBiZSBjYWxsIGluIHRoZSByZW5kZXIgZnVuY3Rpb25cbiAgICAvLyBmb3Igd2FybmluZ3MuXG5cbiAgICBSZWFjdEN1cnJlbnREaXNwYXRjaGVyLmN1cnJlbnQgPSBudWxsO1xuICAgIGRpc2FibGVMb2dzKCk7XG4gIH1cblxuICB0cnkge1xuICAgIC8vIFRoaXMgc2hvdWxkIHRocm93LlxuICAgIGlmIChjb25zdHJ1Y3QpIHtcbiAgICAgIC8vIFNvbWV0aGluZyBzaG91bGQgYmUgc2V0dGluZyB0aGUgcHJvcHMgaW4gdGhlIGNvbnN0cnVjdG9yLlxuICAgICAgdmFyIEZha2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRocm93IEVycm9yKCk7XG4gICAgICB9OyAvLyAkRmxvd0ZpeE1lXG5cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZha2UucHJvdG90eXBlLCAncHJvcHMnLCB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIFdlIHVzZSBhIHRocm93aW5nIHNldHRlciBpbnN0ZWFkIG9mIGZyb3plbiBvciBub24td3JpdGFibGUgcHJvcHNcbiAgICAgICAgICAvLyBiZWNhdXNlIHRoYXQgd29uJ3QgdGhyb3cgaW4gYSBub24tc3RyaWN0IG1vZGUgZnVuY3Rpb24uXG4gICAgICAgICAgdGhyb3cgRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gJ29iamVjdCcgJiYgUmVmbGVjdC5jb25zdHJ1Y3QpIHtcbiAgICAgICAgLy8gV2UgY29uc3RydWN0IGEgZGlmZmVyZW50IGNvbnRyb2wgZm9yIHRoaXMgY2FzZSB0byBpbmNsdWRlIGFueSBleHRyYVxuICAgICAgICAvLyBmcmFtZXMgYWRkZWQgYnkgdGhlIGNvbnN0cnVjdCBjYWxsLlxuICAgICAgICB0cnkge1xuICAgICAgICAgIFJlZmxlY3QuY29uc3RydWN0KEZha2UsIFtdKTtcbiAgICAgICAgfSBjYXRjaCAoeCkge1xuICAgICAgICAgIGNvbnRyb2wgPSB4O1xuICAgICAgICB9XG5cbiAgICAgICAgUmVmbGVjdC5jb25zdHJ1Y3QoZm4sIFtdLCBGYWtlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgRmFrZS5jYWxsKCk7XG4gICAgICAgIH0gY2F0Y2ggKHgpIHtcbiAgICAgICAgICBjb250cm9sID0geDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZuLmNhbGwoRmFrZS5wcm90b3R5cGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aHJvdyBFcnJvcigpO1xuICAgICAgfSBjYXRjaCAoeCkge1xuICAgICAgICBjb250cm9sID0geDtcbiAgICAgIH1cblxuICAgICAgZm4oKTtcbiAgICB9XG4gIH0gY2F0Y2ggKHNhbXBsZSkge1xuICAgIC8vIFRoaXMgaXMgaW5saW5lZCBtYW51YWxseSBiZWNhdXNlIGNsb3N1cmUgZG9lc24ndCBkbyBpdCBmb3IgdXMuXG4gICAgaWYgKHNhbXBsZSAmJiBjb250cm9sICYmIHR5cGVvZiBzYW1wbGUuc3RhY2sgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBUaGlzIGV4dHJhY3RzIHRoZSBmaXJzdCBmcmFtZSBmcm9tIHRoZSBzYW1wbGUgdGhhdCBpc24ndCBhbHNvIGluIHRoZSBjb250cm9sLlxuICAgICAgLy8gU2tpcHBpbmcgb25lIGZyYW1lIHRoYXQgd2UgYXNzdW1lIGlzIHRoZSBmcmFtZSB0aGF0IGNhbGxzIHRoZSB0d28uXG4gICAgICB2YXIgc2FtcGxlTGluZXMgPSBzYW1wbGUuc3RhY2suc3BsaXQoJ1xcbicpO1xuICAgICAgdmFyIGNvbnRyb2xMaW5lcyA9IGNvbnRyb2wuc3RhY2suc3BsaXQoJ1xcbicpO1xuICAgICAgdmFyIHMgPSBzYW1wbGVMaW5lcy5sZW5ndGggLSAxO1xuICAgICAgdmFyIGMgPSBjb250cm9sTGluZXMubGVuZ3RoIC0gMTtcblxuICAgICAgd2hpbGUgKHMgPj0gMSAmJiBjID49IDAgJiYgc2FtcGxlTGluZXNbc10gIT09IGNvbnRyb2xMaW5lc1tjXSkge1xuICAgICAgICAvLyBXZSBleHBlY3QgYXQgbGVhc3Qgb25lIHN0YWNrIGZyYW1lIHRvIGJlIHNoYXJlZC5cbiAgICAgICAgLy8gVHlwaWNhbGx5IHRoaXMgd2lsbCBiZSB0aGUgcm9vdCBtb3N0IG9uZS4gSG93ZXZlciwgc3RhY2sgZnJhbWVzIG1heSBiZVxuICAgICAgICAvLyBjdXQgb2ZmIGR1ZSB0byBtYXhpbXVtIHN0YWNrIGxpbWl0cy4gSW4gdGhpcyBjYXNlLCBvbmUgbWF5YmUgY3V0IG9mZlxuICAgICAgICAvLyBlYXJsaWVyIHRoYW4gdGhlIG90aGVyLiBXZSBhc3N1bWUgdGhhdCB0aGUgc2FtcGxlIGlzIGxvbmdlciBvciB0aGUgc2FtZVxuICAgICAgICAvLyBhbmQgdGhlcmUgZm9yIGN1dCBvZmYgZWFybGllci4gU28gd2Ugc2hvdWxkIGZpbmQgdGhlIHJvb3QgbW9zdCBmcmFtZSBpblxuICAgICAgICAvLyB0aGUgc2FtcGxlIHNvbWV3aGVyZSBpbiB0aGUgY29udHJvbC5cbiAgICAgICAgYy0tO1xuICAgICAgfVxuXG4gICAgICBmb3IgKDsgcyA+PSAxICYmIGMgPj0gMDsgcy0tLCBjLS0pIHtcbiAgICAgICAgLy8gTmV4dCB3ZSBmaW5kIHRoZSBmaXJzdCBvbmUgdGhhdCBpc24ndCB0aGUgc2FtZSB3aGljaCBzaG91bGQgYmUgdGhlXG4gICAgICAgIC8vIGZyYW1lIHRoYXQgY2FsbGVkIG91ciBzYW1wbGUgZnVuY3Rpb24gYW5kIHRoZSBjb250cm9sLlxuICAgICAgICBpZiAoc2FtcGxlTGluZXNbc10gIT09IGNvbnRyb2xMaW5lc1tjXSkge1xuICAgICAgICAgIC8vIEluIFY4LCB0aGUgZmlyc3QgbGluZSBpcyBkZXNjcmliaW5nIHRoZSBtZXNzYWdlIGJ1dCBvdGhlciBWTXMgZG9uJ3QuXG4gICAgICAgICAgLy8gSWYgd2UncmUgYWJvdXQgdG8gcmV0dXJuIHRoZSBmaXJzdCBsaW5lLCBhbmQgdGhlIGNvbnRyb2wgaXMgYWxzbyBvbiB0aGUgc2FtZVxuICAgICAgICAgIC8vIGxpbmUsIHRoYXQncyBhIHByZXR0eSBnb29kIGluZGljYXRvciB0aGF0IG91ciBzYW1wbGUgdGhyZXcgYXQgc2FtZSBsaW5lIGFzXG4gICAgICAgICAgLy8gdGhlIGNvbnRyb2wuIEkuZS4gYmVmb3JlIHdlIGVudGVyZWQgdGhlIHNhbXBsZSBmcmFtZS4gU28gd2UgaWdub3JlIHRoaXMgcmVzdWx0LlxuICAgICAgICAgIC8vIFRoaXMgY2FuIGhhcHBlbiBpZiB5b3UgcGFzc2VkIGEgY2xhc3MgdG8gZnVuY3Rpb24gY29tcG9uZW50LCBvciBub24tZnVuY3Rpb24uXG4gICAgICAgICAgaWYgKHMgIT09IDEgfHwgYyAhPT0gMSkge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICBzLS07XG4gICAgICAgICAgICAgIGMtLTsgLy8gV2UgbWF5IHN0aWxsIGhhdmUgc2ltaWxhciBpbnRlcm1lZGlhdGUgZnJhbWVzIGZyb20gdGhlIGNvbnN0cnVjdCBjYWxsLlxuICAgICAgICAgICAgICAvLyBUaGUgbmV4dCBvbmUgdGhhdCBpc24ndCB0aGUgc2FtZSBzaG91bGQgYmUgb3VyIG1hdGNoIHRob3VnaC5cblxuICAgICAgICAgICAgICBpZiAoYyA8IDAgfHwgc2FtcGxlTGluZXNbc10gIT09IGNvbnRyb2xMaW5lc1tjXSkge1xuICAgICAgICAgICAgICAgIC8vIFY4IGFkZHMgYSBcIm5ld1wiIHByZWZpeCBmb3IgbmF0aXZlIGNsYXNzZXMuIExldCdzIHJlbW92ZSBpdCB0byBtYWtlIGl0IHByZXR0aWVyLlxuICAgICAgICAgICAgICAgIHZhciBfZnJhbWUgPSAnXFxuJyArIHNhbXBsZUxpbmVzW3NdLnJlcGxhY2UoJyBhdCBuZXcgJywgJyBhdCAnKTsgLy8gSWYgb3VyIGNvbXBvbmVudCBmcmFtZSBpcyBsYWJlbGVkIFwiPGFub255bW91cz5cIlxuICAgICAgICAgICAgICAgIC8vIGJ1dCB3ZSBoYXZlIGEgdXNlci1wcm92aWRlZCBcImRpc3BsYXlOYW1lXCJcbiAgICAgICAgICAgICAgICAvLyBzcGxpY2UgaXQgaW4gdG8gbWFrZSB0aGUgc3RhY2sgbW9yZSByZWFkYWJsZS5cblxuXG4gICAgICAgICAgICAgICAgaWYgKGZuLmRpc3BsYXlOYW1lICYmIF9mcmFtZS5pbmNsdWRlcygnPGFub255bW91cz4nKSkge1xuICAgICAgICAgICAgICAgICAgX2ZyYW1lID0gX2ZyYW1lLnJlcGxhY2UoJzxhbm9ueW1vdXM+JywgZm4uZGlzcGxheU5hbWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50RnJhbWVDYWNoZS5zZXQoZm4sIF9mcmFtZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSAvLyBSZXR1cm4gdGhlIGxpbmUgd2UgZm91bmQuXG5cblxuICAgICAgICAgICAgICAgIHJldHVybiBfZnJhbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gd2hpbGUgKHMgPj0gMSAmJiBjID49IDApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIHJlZW50cnkgPSBmYWxzZTtcblxuICAgIHtcbiAgICAgIFJlYWN0Q3VycmVudERpc3BhdGNoZXIuY3VycmVudCA9IHByZXZpb3VzRGlzcGF0Y2hlcjtcbiAgICAgIHJlZW5hYmxlTG9ncygpO1xuICAgIH1cblxuICAgIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gcHJldmlvdXNQcmVwYXJlU3RhY2tUcmFjZTtcbiAgfSAvLyBGYWxsYmFjayB0byBqdXN0IHVzaW5nIHRoZSBuYW1lIGlmIHdlIGNvdWxkbid0IG1ha2UgaXQgdGhyb3cuXG5cblxuICB2YXIgbmFtZSA9IGZuID8gZm4uZGlzcGxheU5hbWUgfHwgZm4ubmFtZSA6ICcnO1xuICB2YXIgc3ludGhldGljRnJhbWUgPSBuYW1lID8gZGVzY3JpYmVCdWlsdEluQ29tcG9uZW50RnJhbWUobmFtZSkgOiAnJztcblxuICB7XG4gICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29tcG9uZW50RnJhbWVDYWNoZS5zZXQoZm4sIHN5bnRoZXRpY0ZyYW1lKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3ludGhldGljRnJhbWU7XG59XG5mdW5jdGlvbiBkZXNjcmliZUZ1bmN0aW9uQ29tcG9uZW50RnJhbWUoZm4sIHNvdXJjZSwgb3duZXJGbikge1xuICB7XG4gICAgcmV0dXJuIGRlc2NyaWJlTmF0aXZlQ29tcG9uZW50RnJhbWUoZm4sIGZhbHNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzaG91bGRDb25zdHJ1Y3QoQ29tcG9uZW50KSB7XG4gIHZhciBwcm90b3R5cGUgPSBDb21wb25lbnQucHJvdG90eXBlO1xuICByZXR1cm4gISEocHJvdG90eXBlICYmIHByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50KTtcbn1cblxuZnVuY3Rpb24gZGVzY3JpYmVVbmtub3duRWxlbWVudFR5cGVGcmFtZUluREVWKHR5cGUsIHNvdXJjZSwgb3duZXJGbikge1xuXG4gIGlmICh0eXBlID09IG51bGwpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB7XG4gICAgICByZXR1cm4gZGVzY3JpYmVOYXRpdmVDb21wb25lbnRGcmFtZSh0eXBlLCBzaG91bGRDb25zdHJ1Y3QodHlwZSkpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZGVzY3JpYmVCdWlsdEluQ29tcG9uZW50RnJhbWUodHlwZSk7XG4gIH1cblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICByZXR1cm4gZGVzY3JpYmVCdWlsdEluQ29tcG9uZW50RnJhbWUoJ1N1c3BlbnNlJyk7XG5cbiAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRTpcbiAgICAgIHJldHVybiBkZXNjcmliZUJ1aWx0SW5Db21wb25lbnRGcmFtZSgnU3VzcGVuc2VMaXN0Jyk7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgc3dpdGNoICh0eXBlLiQkdHlwZW9mKSB7XG4gICAgICBjYXNlIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU6XG4gICAgICAgIHJldHVybiBkZXNjcmliZUZ1bmN0aW9uQ29tcG9uZW50RnJhbWUodHlwZS5yZW5kZXIpO1xuXG4gICAgICBjYXNlIFJFQUNUX01FTU9fVFlQRTpcbiAgICAgICAgLy8gTWVtbyBtYXkgY29udGFpbiBhbnkgY29tcG9uZW50IHR5cGUgc28gd2UgcmVjdXJzaXZlbHkgcmVzb2x2ZSBpdC5cbiAgICAgICAgcmV0dXJuIGRlc2NyaWJlVW5rbm93bkVsZW1lbnRUeXBlRnJhbWVJbkRFVih0eXBlLnR5cGUsIHNvdXJjZSwgb3duZXJGbik7XG5cbiAgICAgIGNhc2UgUkVBQ1RfTEFaWV9UWVBFOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIGxhenlDb21wb25lbnQgPSB0eXBlO1xuICAgICAgICAgIHZhciBwYXlsb2FkID0gbGF6eUNvbXBvbmVudC5fcGF5bG9hZDtcbiAgICAgICAgICB2YXIgaW5pdCA9IGxhenlDb21wb25lbnQuX2luaXQ7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gTGF6eSBtYXkgY29udGFpbiBhbnkgY29tcG9uZW50IHR5cGUgc28gd2UgcmVjdXJzaXZlbHkgcmVzb2x2ZSBpdC5cbiAgICAgICAgICAgIHJldHVybiBkZXNjcmliZVVua25vd25FbGVtZW50VHlwZUZyYW1lSW5ERVYoaW5pdChwYXlsb2FkKSwgc291cmNlLCBvd25lckZuKTtcbiAgICAgICAgICB9IGNhdGNoICh4KSB7fVxuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuICcnO1xufVxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG52YXIgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG52YXIgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlJlYWN0RGVidWdDdXJyZW50RnJhbWU7XG5cbmZ1bmN0aW9uIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpIHtcbiAge1xuICAgIGlmIChlbGVtZW50KSB7XG4gICAgICB2YXIgb3duZXIgPSBlbGVtZW50Ll9vd25lcjtcbiAgICAgIHZhciBzdGFjayA9IGRlc2NyaWJlVW5rbm93bkVsZW1lbnRUeXBlRnJhbWVJbkRFVihlbGVtZW50LnR5cGUsIGVsZW1lbnQuX3NvdXJjZSwgb3duZXIgPyBvd25lci50eXBlIDogbnVsbCk7XG4gICAgICBSZWFjdERlYnVnQ3VycmVudEZyYW1lLnNldEV4dHJhU3RhY2tGcmFtZShzdGFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuc2V0RXh0cmFTdGFja0ZyYW1lKG51bGwpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGNvbXBvbmVudE5hbWUsIGVsZW1lbnQpIHtcbiAge1xuICAgIC8vICRGbG93Rml4TWUgVGhpcyBpcyBva2F5IGJ1dCBGbG93IGRvZXNuJ3Qga25vdyBpdC5cbiAgICB2YXIgaGFzID0gRnVuY3Rpb24uY2FsbC5iaW5kKGhhc093blByb3BlcnR5KTtcblxuICAgIGZvciAodmFyIHR5cGVTcGVjTmFtZSBpbiB0eXBlU3BlY3MpIHtcbiAgICAgIGlmIChoYXModHlwZVNwZWNzLCB0eXBlU3BlY05hbWUpKSB7XG4gICAgICAgIHZhciBlcnJvciQxID0gdm9pZCAwOyAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAvLyBmYWlsIHRoZSByZW5kZXIgcGhhc2Ugd2hlcmUgaXQgZGlkbid0IGZhaWwgYmVmb3JlLiBTbyB3ZSBsb2cgaXQuXG4gICAgICAgIC8vIEFmdGVyIHRoZXNlIGhhdmUgYmVlbiBjbGVhbmVkIHVwLCB3ZSdsbCBsZXQgdGhlbSB0aHJvdy5cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgaW50ZW50aW9uYWxseSBhbiBpbnZhcmlhbnQgdGhhdCBnZXRzIGNhdWdodC4gSXQncyB0aGUgc2FtZVxuICAgICAgICAgIC8vIGJlaGF2aW9yIGFzIHdpdGhvdXQgdGhpcyBzdGF0ZW1lbnQgZXhjZXB0IHdpdGggYSBiZXR0ZXIgbWVzc2FnZS5cbiAgICAgICAgICBpZiAodHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaW50ZXJuYWwvcHJvZC1lcnJvci1jb2Rlc1xuICAgICAgICAgICAgdmFyIGVyciA9IEVycm9yKChjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycpICsgJzogJyArIGxvY2F0aW9uICsgJyB0eXBlIGAnICsgdHlwZVNwZWNOYW1lICsgJ2AgaXMgaW52YWxpZDsgJyArICdpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UsIGJ1dCByZWNlaXZlZCBgJyArIHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSArICdgLicgKyAnVGhpcyBvZnRlbiBoYXBwZW5zIGJlY2F1c2Ugb2YgdHlwb3Mgc3VjaCBhcyBgUHJvcFR5cGVzLmZ1bmN0aW9uYCBpbnN0ZWFkIG9mIGBQcm9wVHlwZXMuZnVuY2AuJyk7XG4gICAgICAgICAgICBlcnIubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBlcnJvciQxID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnKTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBlcnJvciQxID0gZXg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IkMSAmJiAhKGVycm9yJDEgaW5zdGFuY2VvZiBFcnJvcikpIHtcbiAgICAgICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KTtcblxuICAgICAgICAgIGVycm9yKCclczogdHlwZSBzcGVjaWZpY2F0aW9uIG9mICVzJyArICcgYCVzYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgKyAnZnVuY3Rpb24gbXVzdCByZXR1cm4gYG51bGxgIG9yIGFuIGBFcnJvcmAgYnV0IHJldHVybmVkIGEgJXMuICcgKyAnWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgJyArICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgKyAnc2hhcGUgYWxsIHJlcXVpcmUgYW4gYXJndW1lbnQpLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgbG9jYXRpb24sIHR5cGVTcGVjTmFtZSwgdHlwZW9mIGVycm9yJDEpO1xuXG4gICAgICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQobnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IkMSBpbnN0YW5jZW9mIEVycm9yICYmICEoZXJyb3IkMS5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgICAvLyBPbmx5IG1vbml0b3IgdGhpcyBmYWlsdXJlIG9uY2UgYmVjYXVzZSB0aGVyZSB0ZW5kcyB0byBiZSBhIGxvdCBvZiB0aGVcbiAgICAgICAgICAvLyBzYW1lIGVycm9yLlxuICAgICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvciQxLm1lc3NhZ2VdID0gdHJ1ZTtcbiAgICAgICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KTtcblxuICAgICAgICAgIGVycm9yKCdGYWlsZWQgJXMgdHlwZTogJXMnLCBsb2NhdGlvbiwgZXJyb3IkMS5tZXNzYWdlKTtcblxuICAgICAgICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KG51bGwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbnZhciBpc0FycmF5SW1wbCA9IEFycmF5LmlzQXJyYXk7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZWRlY2xhcmVcblxuZnVuY3Rpb24gaXNBcnJheShhKSB7XG4gIHJldHVybiBpc0FycmF5SW1wbChhKTtcbn1cblxuLypcbiAqIFRoZSBgJycgKyB2YWx1ZWAgcGF0dGVybiAodXNlZCBpbiBpbiBwZXJmLXNlbnNpdGl2ZSBjb2RlKSB0aHJvd3MgZm9yIFN5bWJvbFxuICogYW5kIFRlbXBvcmFsLiogdHlwZXMuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvcHVsbC8yMjA2NC5cbiAqXG4gKiBUaGUgZnVuY3Rpb25zIGluIHRoaXMgbW9kdWxlIHdpbGwgdGhyb3cgYW4gZWFzaWVyLXRvLXVuZGVyc3RhbmQsXG4gKiBlYXNpZXItdG8tZGVidWcgZXhjZXB0aW9uIHdpdGggYSBjbGVhciBlcnJvcnMgbWVzc2FnZSBtZXNzYWdlIGV4cGxhaW5pbmcgdGhlXG4gKiBwcm9ibGVtLiAoSW5zdGVhZCBvZiBhIGNvbmZ1c2luZyBleGNlcHRpb24gdGhyb3duIGluc2lkZSB0aGUgaW1wbGVtZW50YXRpb25cbiAqIG9mIHRoZSBgdmFsdWVgIG9iamVjdCkuXG4gKi9cbi8vICRGbG93Rml4TWUgb25seSBjYWxsZWQgaW4gREVWLCBzbyB2b2lkIHJldHVybiBpcyBub3QgcG9zc2libGUuXG5mdW5jdGlvbiB0eXBlTmFtZSh2YWx1ZSkge1xuICB7XG4gICAgLy8gdG9TdHJpbmdUYWcgaXMgbmVlZGVkIGZvciBuYW1lc3BhY2VkIHR5cGVzIGxpa2UgVGVtcG9yYWwuSW5zdGFudFxuICAgIHZhciBoYXNUb1N0cmluZ1RhZyA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLnRvU3RyaW5nVGFnO1xuICAgIHZhciB0eXBlID0gaGFzVG9TdHJpbmdUYWcgJiYgdmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXSB8fCB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lIHx8ICdPYmplY3QnO1xuICAgIHJldHVybiB0eXBlO1xuICB9XG59IC8vICRGbG93Rml4TWUgb25seSBjYWxsZWQgaW4gREVWLCBzbyB2b2lkIHJldHVybiBpcyBub3QgcG9zc2libGUuXG5cblxuZnVuY3Rpb24gd2lsbENvZXJjaW9uVGhyb3codmFsdWUpIHtcbiAge1xuICAgIHRyeSB7XG4gICAgICB0ZXN0U3RyaW5nQ29lcmNpb24odmFsdWUpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB0ZXN0U3RyaW5nQ29lcmNpb24odmFsdWUpIHtcbiAgLy8gSWYgeW91IGVuZGVkIHVwIGhlcmUgYnkgZm9sbG93aW5nIGFuIGV4Y2VwdGlvbiBjYWxsIHN0YWNrLCBoZXJlJ3Mgd2hhdCdzXG4gIC8vIGhhcHBlbmVkOiB5b3Ugc3VwcGxpZWQgYW4gb2JqZWN0IG9yIHN5bWJvbCB2YWx1ZSB0byBSZWFjdCAoYXMgYSBwcm9wLCBrZXksXG4gIC8vIERPTSBhdHRyaWJ1dGUsIENTUyBwcm9wZXJ0eSwgc3RyaW5nIHJlZiwgZXRjLikgYW5kIHdoZW4gUmVhY3QgdHJpZWQgdG9cbiAgLy8gY29lcmNlIGl0IHRvIGEgc3RyaW5nIHVzaW5nIGAnJyArIHZhbHVlYCwgYW4gZXhjZXB0aW9uIHdhcyB0aHJvd24uXG4gIC8vXG4gIC8vIFRoZSBtb3N0IGNvbW1vbiB0eXBlcyB0aGF0IHdpbGwgY2F1c2UgdGhpcyBleGNlcHRpb24gYXJlIGBTeW1ib2xgIGluc3RhbmNlc1xuICAvLyBhbmQgVGVtcG9yYWwgb2JqZWN0cyBsaWtlIGBUZW1wb3JhbC5JbnN0YW50YC4gQnV0IGFueSBvYmplY3QgdGhhdCBoYXMgYVxuICAvLyBgdmFsdWVPZmAgb3IgYFtTeW1ib2wudG9QcmltaXRpdmVdYCBtZXRob2QgdGhhdCB0aHJvd3Mgd2lsbCBhbHNvIGNhdXNlIHRoaXNcbiAgLy8gZXhjZXB0aW9uLiAoTGlicmFyeSBhdXRob3JzIGRvIHRoaXMgdG8gcHJldmVudCB1c2VycyBmcm9tIHVzaW5nIGJ1aWx0LWluXG4gIC8vIG51bWVyaWMgb3BlcmF0b3JzIGxpa2UgYCtgIG9yIGNvbXBhcmlzb24gb3BlcmF0b3JzIGxpa2UgYD49YCBiZWNhdXNlIGN1c3RvbVxuICAvLyBtZXRob2RzIGFyZSBuZWVkZWQgdG8gcGVyZm9ybSBhY2N1cmF0ZSBhcml0aG1ldGljIG9yIGNvbXBhcmlzb24uKVxuICAvL1xuICAvLyBUbyBmaXggdGhlIHByb2JsZW0sIGNvZXJjZSB0aGlzIG9iamVjdCBvciBzeW1ib2wgdmFsdWUgdG8gYSBzdHJpbmcgYmVmb3JlXG4gIC8vIHBhc3NpbmcgaXQgdG8gUmVhY3QuIFRoZSBtb3N0IHJlbGlhYmxlIHdheSBpcyB1c3VhbGx5IGBTdHJpbmcodmFsdWUpYC5cbiAgLy9cbiAgLy8gVG8gZmluZCB3aGljaCB2YWx1ZSBpcyB0aHJvd2luZywgY2hlY2sgdGhlIGJyb3dzZXIgb3IgZGVidWdnZXIgY29uc29sZS5cbiAgLy8gQmVmb3JlIHRoaXMgZXhjZXB0aW9uIHdhcyB0aHJvd24sIHRoZXJlIHNob3VsZCBiZSBgY29uc29sZS5lcnJvcmAgb3V0cHV0XG4gIC8vIHRoYXQgc2hvd3MgdGhlIHR5cGUgKFN5bWJvbCwgVGVtcG9yYWwuUGxhaW5EYXRlLCBldGMuKSB0aGF0IGNhdXNlZCB0aGVcbiAgLy8gcHJvYmxlbSBhbmQgaG93IHRoYXQgdHlwZSB3YXMgdXNlZDoga2V5LCBhdHJyaWJ1dGUsIGlucHV0IHZhbHVlIHByb3AsIGV0Yy5cbiAgLy8gSW4gbW9zdCBjYXNlcywgdGhpcyBjb25zb2xlIG91dHB1dCBhbHNvIHNob3dzIHRoZSBjb21wb25lbnQgYW5kIGl0c1xuICAvLyBhbmNlc3RvciBjb21wb25lbnRzIHdoZXJlIHRoZSBleGNlcHRpb24gaGFwcGVuZWQuXG4gIC8vXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1pbnRlcm5hbC9zYWZlLXN0cmluZy1jb2VyY2lvblxuICByZXR1cm4gJycgKyB2YWx1ZTtcbn1cbmZ1bmN0aW9uIGNoZWNrS2V5U3RyaW5nQ29lcmNpb24odmFsdWUpIHtcbiAge1xuICAgIGlmICh3aWxsQ29lcmNpb25UaHJvdyh2YWx1ZSkpIHtcbiAgICAgIGVycm9yKCdUaGUgcHJvdmlkZWQga2V5IGlzIGFuIHVuc3VwcG9ydGVkIHR5cGUgJXMuJyArICcgVGhpcyB2YWx1ZSBtdXN0IGJlIGNvZXJjZWQgdG8gYSBzdHJpbmcgYmVmb3JlIGJlZm9yZSB1c2luZyBpdCBoZXJlLicsIHR5cGVOYW1lKHZhbHVlKSk7XG5cbiAgICAgIHJldHVybiB0ZXN0U3RyaW5nQ29lcmNpb24odmFsdWUpOyAvLyB0aHJvdyAodG8gaGVscCBjYWxsZXJzIGZpbmQgdHJvdWJsZXNob290aW5nIGNvbW1lbnRzKVxuICAgIH1cbiAgfVxufVxuXG52YXIgUmVhY3RDdXJyZW50T3duZXIgPSBSZWFjdFNoYXJlZEludGVybmFscy5SZWFjdEN1cnJlbnRPd25lcjtcbnZhciBSRVNFUlZFRF9QUk9QUyA9IHtcbiAga2V5OiB0cnVlLFxuICByZWY6IHRydWUsXG4gIF9fc2VsZjogdHJ1ZSxcbiAgX19zb3VyY2U6IHRydWVcbn07XG52YXIgc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd247XG52YXIgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd247XG52YXIgZGlkV2FybkFib3V0U3RyaW5nUmVmcztcblxue1xuICBkaWRXYXJuQWJvdXRTdHJpbmdSZWZzID0ge307XG59XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkUmVmKGNvbmZpZykge1xuICB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCAncmVmJykpIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbmZpZywgJ3JlZicpLmdldDtcblxuICAgICAgaWYgKGdldHRlciAmJiBnZXR0ZXIuaXNSZWFjdFdhcm5pbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb25maWcucmVmICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkS2V5KGNvbmZpZykge1xuICB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCAna2V5JykpIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbmZpZywgJ2tleScpLmdldDtcblxuICAgICAgaWYgKGdldHRlciAmJiBnZXR0ZXIuaXNSZWFjdFdhcm5pbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb25maWcua2V5ICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIHdhcm5JZlN0cmluZ1JlZkNhbm5vdEJlQXV0b0NvbnZlcnRlZChjb25maWcsIHNlbGYpIHtcbiAge1xuICAgIGlmICh0eXBlb2YgY29uZmlnLnJlZiA9PT0gJ3N0cmluZycgJiYgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCAmJiBzZWxmICYmIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQuc3RhdGVOb2RlICE9PSBzZWxmKSB7XG4gICAgICB2YXIgY29tcG9uZW50TmFtZSA9IGdldENvbXBvbmVudE5hbWVGcm9tVHlwZShSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LnR5cGUpO1xuXG4gICAgICBpZiAoIWRpZFdhcm5BYm91dFN0cmluZ1JlZnNbY29tcG9uZW50TmFtZV0pIHtcbiAgICAgICAgZXJyb3IoJ0NvbXBvbmVudCBcIiVzXCIgY29udGFpbnMgdGhlIHN0cmluZyByZWYgXCIlc1wiLiAnICsgJ1N1cHBvcnQgZm9yIHN0cmluZyByZWZzIHdpbGwgYmUgcmVtb3ZlZCBpbiBhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiAnICsgJ1RoaXMgY2FzZSBjYW5ub3QgYmUgYXV0b21hdGljYWxseSBjb252ZXJ0ZWQgdG8gYW4gYXJyb3cgZnVuY3Rpb24uICcgKyAnV2UgYXNrIHlvdSB0byBtYW51YWxseSBmaXggdGhpcyBjYXNlIGJ5IHVzaW5nIHVzZVJlZigpIG9yIGNyZWF0ZVJlZigpIGluc3RlYWQuICcgKyAnTGVhcm4gbW9yZSBhYm91dCB1c2luZyByZWZzIHNhZmVseSBoZXJlOiAnICsgJ2h0dHBzOi8vcmVhY3Rqcy5vcmcvbGluay9zdHJpY3QtbW9kZS1zdHJpbmctcmVmJywgZ2V0Q29tcG9uZW50TmFtZUZyb21UeXBlKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQudHlwZSksIGNvbmZpZy5yZWYpO1xuXG4gICAgICAgIGRpZFdhcm5BYm91dFN0cmluZ1JlZnNbY29tcG9uZW50TmFtZV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpIHtcbiAge1xuICAgIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdLZXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duKSB7XG4gICAgICAgIHNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duID0gdHJ1ZTtcblxuICAgICAgICBlcnJvcignJXM6IGBrZXlgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL3JlYWN0anMub3JnL2xpbmsvc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHdhcm5BYm91dEFjY2Vzc2luZ0tleS5pc1JlYWN0V2FybmluZyA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAna2V5Jywge1xuICAgICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdLZXksXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkZWZpbmVSZWZQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpIHtcbiAge1xuICAgIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duKSB7XG4gICAgICAgIHNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duID0gdHJ1ZTtcblxuICAgICAgICBlcnJvcignJXM6IGByZWZgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL3JlYWN0anMub3JnL2xpbmsvc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHdhcm5BYm91dEFjY2Vzc2luZ1JlZi5pc1JlYWN0V2FybmluZyA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAncmVmJywge1xuICAgICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgfVxufVxuLyoqXG4gKiBGYWN0b3J5IG1ldGhvZCB0byBjcmVhdGUgYSBuZXcgUmVhY3QgZWxlbWVudC4gVGhpcyBubyBsb25nZXIgYWRoZXJlcyB0b1xuICogdGhlIGNsYXNzIHBhdHRlcm4sIHNvIGRvIG5vdCB1c2UgbmV3IHRvIGNhbGwgaXQuIEFsc28sIGluc3RhbmNlb2YgY2hlY2tcbiAqIHdpbGwgbm90IHdvcmsuIEluc3RlYWQgdGVzdCAkJHR5cGVvZiBmaWVsZCBhZ2FpbnN0IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSB0byBjaGVja1xuICogaWYgc29tZXRoaW5nIGlzIGEgUmVhY3QgRWxlbWVudC5cbiAqXG4gKiBAcGFyYW0geyp9IHR5cGVcbiAqIEBwYXJhbSB7Kn0gcHJvcHNcbiAqIEBwYXJhbSB7Kn0ga2V5XG4gKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IHJlZlxuICogQHBhcmFtIHsqfSBvd25lclxuICogQHBhcmFtIHsqfSBzZWxmIEEgKnRlbXBvcmFyeSogaGVscGVyIHRvIGRldGVjdCBwbGFjZXMgd2hlcmUgYHRoaXNgIGlzXG4gKiBkaWZmZXJlbnQgZnJvbSB0aGUgYG93bmVyYCB3aGVuIFJlYWN0LmNyZWF0ZUVsZW1lbnQgaXMgY2FsbGVkLCBzbyB0aGF0IHdlXG4gKiBjYW4gd2Fybi4gV2Ugd2FudCB0byBnZXQgcmlkIG9mIG93bmVyIGFuZCByZXBsYWNlIHN0cmluZyBgcmVmYHMgd2l0aCBhcnJvd1xuICogZnVuY3Rpb25zLCBhbmQgYXMgbG9uZyBhcyBgdGhpc2AgYW5kIG93bmVyIGFyZSB0aGUgc2FtZSwgdGhlcmUgd2lsbCBiZSBub1xuICogY2hhbmdlIGluIGJlaGF2aW9yLlxuICogQHBhcmFtIHsqfSBzb3VyY2UgQW4gYW5ub3RhdGlvbiBvYmplY3QgKGFkZGVkIGJ5IGEgdHJhbnNwaWxlciBvciBvdGhlcndpc2UpXG4gKiBpbmRpY2F0aW5nIGZpbGVuYW1lLCBsaW5lIG51bWJlciwgYW5kL29yIG90aGVyIGluZm9ybWF0aW9uLlxuICogQGludGVybmFsXG4gKi9cblxuXG52YXIgUmVhY3RFbGVtZW50ID0gZnVuY3Rpb24gKHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIG93bmVyLCBwcm9wcykge1xuICB2YXIgZWxlbWVudCA9IHtcbiAgICAvLyBUaGlzIHRhZyBhbGxvd3MgdXMgdG8gdW5pcXVlbHkgaWRlbnRpZnkgdGhpcyBhcyBhIFJlYWN0IEVsZW1lbnRcbiAgICAkJHR5cGVvZjogUkVBQ1RfRUxFTUVOVF9UWVBFLFxuICAgIC8vIEJ1aWx0LWluIHByb3BlcnRpZXMgdGhhdCBiZWxvbmcgb24gdGhlIGVsZW1lbnRcbiAgICB0eXBlOiB0eXBlLFxuICAgIGtleToga2V5LFxuICAgIHJlZjogcmVmLFxuICAgIHByb3BzOiBwcm9wcyxcbiAgICAvLyBSZWNvcmQgdGhlIGNvbXBvbmVudCByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhpcyBlbGVtZW50LlxuICAgIF9vd25lcjogb3duZXJcbiAgfTtcblxuICB7XG4gICAgLy8gVGhlIHZhbGlkYXRpb24gZmxhZyBpcyBjdXJyZW50bHkgbXV0YXRpdmUuIFdlIHB1dCBpdCBvblxuICAgIC8vIGFuIGV4dGVybmFsIGJhY2tpbmcgc3RvcmUgc28gdGhhdCB3ZSBjYW4gZnJlZXplIHRoZSB3aG9sZSBvYmplY3QuXG4gICAgLy8gVGhpcyBjYW4gYmUgcmVwbGFjZWQgd2l0aCBhIFdlYWtNYXAgb25jZSB0aGV5IGFyZSBpbXBsZW1lbnRlZCBpblxuICAgIC8vIGNvbW1vbmx5IHVzZWQgZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzLlxuICAgIGVsZW1lbnQuX3N0b3JlID0ge307IC8vIFRvIG1ha2UgY29tcGFyaW5nIFJlYWN0RWxlbWVudHMgZWFzaWVyIGZvciB0ZXN0aW5nIHB1cnBvc2VzLCB3ZSBtYWtlXG4gICAgLy8gdGhlIHZhbGlkYXRpb24gZmxhZyBub24tZW51bWVyYWJsZSAod2hlcmUgcG9zc2libGUsIHdoaWNoIHNob3VsZFxuICAgIC8vIGluY2x1ZGUgZXZlcnkgZW52aXJvbm1lbnQgd2UgcnVuIHRlc3RzIGluKSwgc28gdGhlIHRlc3QgZnJhbWV3b3JrXG4gICAgLy8gaWdub3JlcyBpdC5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50Ll9zdG9yZSwgJ3ZhbGlkYXRlZCcsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6IGZhbHNlXG4gICAgfSk7IC8vIHNlbGYgYW5kIHNvdXJjZSBhcmUgREVWIG9ubHkgcHJvcGVydGllcy5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCAnX3NlbGYnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogc2VsZlxuICAgIH0pOyAvLyBUd28gZWxlbWVudHMgY3JlYXRlZCBpbiB0d28gZGlmZmVyZW50IHBsYWNlcyBzaG91bGQgYmUgY29uc2lkZXJlZFxuICAgIC8vIGVxdWFsIGZvciB0ZXN0aW5nIHB1cnBvc2VzIGFuZCB0aGVyZWZvcmUgd2UgaGlkZSBpdCBmcm9tIGVudW1lcmF0aW9uLlxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc291cmNlJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHNvdXJjZVxuICAgIH0pO1xuXG4gICAgaWYgKE9iamVjdC5mcmVlemUpIHtcbiAgICAgIE9iamVjdC5mcmVlemUoZWxlbWVudC5wcm9wcyk7XG4gICAgICBPYmplY3QuZnJlZXplKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufTtcbi8qKlxuICogaHR0cHM6Ly9naXRodWIuY29tL3JlYWN0anMvcmZjcy9wdWxsLzEwN1xuICogQHBhcmFtIHsqfSB0eXBlXG4gKiBAcGFyYW0ge29iamVjdH0gcHJvcHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqL1xuXG5mdW5jdGlvbiBqc3hERVYodHlwZSwgY29uZmlnLCBtYXliZUtleSwgc291cmNlLCBzZWxmKSB7XG4gIHtcbiAgICB2YXIgcHJvcE5hbWU7IC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcblxuICAgIHZhciBwcm9wcyA9IHt9O1xuICAgIHZhciBrZXkgPSBudWxsO1xuICAgIHZhciByZWYgPSBudWxsOyAvLyBDdXJyZW50bHksIGtleSBjYW4gYmUgc3ByZWFkIGluIGFzIGEgcHJvcC4gVGhpcyBjYXVzZXMgYSBwb3RlbnRpYWxcbiAgICAvLyBpc3N1ZSBpZiBrZXkgaXMgYWxzbyBleHBsaWNpdGx5IGRlY2xhcmVkIChpZS4gPGRpdiB7Li4ucHJvcHN9IGtleT1cIkhpXCIgLz5cbiAgICAvLyBvciA8ZGl2IGtleT1cIkhpXCIgey4uLnByb3BzfSAvPiApLiBXZSB3YW50IHRvIGRlcHJlY2F0ZSBrZXkgc3ByZWFkLFxuICAgIC8vIGJ1dCBhcyBhbiBpbnRlcm1lZGlhcnkgc3RlcCwgd2Ugd2lsbCB1c2UganN4REVWIGZvciBldmVyeXRoaW5nIGV4Y2VwdFxuICAgIC8vIDxkaXYgey4uLnByb3BzfSBrZXk9XCJIaVwiIC8+LCBiZWNhdXNlIHdlIGFyZW4ndCBjdXJyZW50bHkgYWJsZSB0byB0ZWxsIGlmXG4gICAgLy8ga2V5IGlzIGV4cGxpY2l0bHkgZGVjbGFyZWQgdG8gYmUgdW5kZWZpbmVkIG9yIG5vdC5cblxuICAgIGlmIChtYXliZUtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB7XG4gICAgICAgIGNoZWNrS2V5U3RyaW5nQ29lcmNpb24obWF5YmVLZXkpO1xuICAgICAgfVxuXG4gICAgICBrZXkgPSAnJyArIG1heWJlS2V5O1xuICAgIH1cblxuICAgIGlmIChoYXNWYWxpZEtleShjb25maWcpKSB7XG4gICAgICB7XG4gICAgICAgIGNoZWNrS2V5U3RyaW5nQ29lcmNpb24oY29uZmlnLmtleSk7XG4gICAgICB9XG5cbiAgICAgIGtleSA9ICcnICsgY29uZmlnLmtleTtcbiAgICB9XG5cbiAgICBpZiAoaGFzVmFsaWRSZWYoY29uZmlnKSkge1xuICAgICAgcmVmID0gY29uZmlnLnJlZjtcbiAgICAgIHdhcm5JZlN0cmluZ1JlZkNhbm5vdEJlQXV0b0NvbnZlcnRlZChjb25maWcsIHNlbGYpO1xuICAgIH0gLy8gUmVtYWluaW5nIHByb3BlcnRpZXMgYXJlIGFkZGVkIHRvIGEgbmV3IHByb3BzIG9iamVjdFxuXG5cbiAgICBmb3IgKHByb3BOYW1lIGluIGNvbmZpZykge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCBwcm9wTmFtZSkgJiYgIVJFU0VSVkVEX1BST1BTLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBjb25maWdbcHJvcE5hbWVdO1xuICAgICAgfVxuICAgIH0gLy8gUmVzb2x2ZSBkZWZhdWx0IHByb3BzXG5cblxuICAgIGlmICh0eXBlICYmIHR5cGUuZGVmYXVsdFByb3BzKSB7XG4gICAgICB2YXIgZGVmYXVsdFByb3BzID0gdHlwZS5kZWZhdWx0UHJvcHM7XG5cbiAgICAgIGZvciAocHJvcE5hbWUgaW4gZGVmYXVsdFByb3BzKSB7XG4gICAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGRlZmF1bHRQcm9wc1twcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoa2V5IHx8IHJlZikge1xuICAgICAgdmFyIGRpc3BsYXlOYW1lID0gdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgPyB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSB8fCAnVW5rbm93bicgOiB0eXBlO1xuXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWYpIHtcbiAgICAgICAgZGVmaW5lUmVmUHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUmVhY3RFbGVtZW50KHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQsIHByb3BzKTtcbiAgfVxufVxuXG52YXIgUmVhY3RDdXJyZW50T3duZXIkMSA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlJlYWN0Q3VycmVudE93bmVyO1xudmFyIFJlYWN0RGVidWdDdXJyZW50RnJhbWUkMSA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlJlYWN0RGVidWdDdXJyZW50RnJhbWU7XG5cbmZ1bmN0aW9uIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50JDEoZWxlbWVudCkge1xuICB7XG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIHZhciBvd25lciA9IGVsZW1lbnQuX293bmVyO1xuICAgICAgdmFyIHN0YWNrID0gZGVzY3JpYmVVbmtub3duRWxlbWVudFR5cGVGcmFtZUluREVWKGVsZW1lbnQudHlwZSwgZWxlbWVudC5fc291cmNlLCBvd25lciA/IG93bmVyLnR5cGUgOiBudWxsKTtcbiAgICAgIFJlYWN0RGVidWdDdXJyZW50RnJhbWUkMS5zZXRFeHRyYVN0YWNrRnJhbWUoc3RhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBSZWFjdERlYnVnQ3VycmVudEZyYW1lJDEuc2V0RXh0cmFTdGFja0ZyYW1lKG51bGwpO1xuICAgIH1cbiAgfVxufVxuXG52YXIgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd247XG5cbntcbiAgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24gPSBmYWxzZTtcbn1cbi8qKlxuICogVmVyaWZpZXMgdGhlIG9iamVjdCBpcyBhIFJlYWN0RWxlbWVudC5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjaXN2YWxpZGVsZW1lbnRcbiAqIEBwYXJhbSB7P29iamVjdH0gb2JqZWN0XG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIGBvYmplY3RgIGlzIGEgUmVhY3RFbGVtZW50LlxuICogQGZpbmFsXG4gKi9cblxuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudChvYmplY3QpIHtcbiAge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QgIT09IG51bGwgJiYgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCkge1xuICB7XG4gICAgaWYgKFJlYWN0Q3VycmVudE93bmVyJDEuY3VycmVudCkge1xuICAgICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lRnJvbVR5cGUoUmVhY3RDdXJyZW50T3duZXIkMS5jdXJyZW50LnR5cGUpO1xuXG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICByZXR1cm4gJ1xcblxcbkNoZWNrIHRoZSByZW5kZXIgbWV0aG9kIG9mIGAnICsgbmFtZSArICdgLic7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtKHNvdXJjZSkge1xuICB7XG4gICAgaWYgKHNvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgZmlsZU5hbWUgPSBzb3VyY2UuZmlsZU5hbWUucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgICAgdmFyIGxpbmVOdW1iZXIgPSBzb3VyY2UubGluZU51bWJlcjtcbiAgICAgIHJldHVybiAnXFxuXFxuQ2hlY2sgeW91ciBjb2RlIGF0ICcgKyBmaWxlTmFtZSArICc6JyArIGxpbmVOdW1iZXIgKyAnLic7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG59XG4vKipcbiAqIFdhcm4gaWYgdGhlcmUncyBubyBrZXkgZXhwbGljaXRseSBzZXQgb24gZHluYW1pYyBhcnJheXMgb2YgY2hpbGRyZW4gb3JcbiAqIG9iamVjdCBrZXlzIGFyZSBub3QgdmFsaWQuIFRoaXMgYWxsb3dzIHVzIHRvIGtlZXAgdHJhY2sgb2YgY2hpbGRyZW4gYmV0d2VlblxuICogdXBkYXRlcy5cbiAqL1xuXG5cbnZhciBvd25lckhhc0tleVVzZVdhcm5pbmcgPSB7fTtcblxuZnVuY3Rpb24gZ2V0Q3VycmVudENvbXBvbmVudEVycm9ySW5mbyhwYXJlbnRUeXBlKSB7XG4gIHtcbiAgICB2YXIgaW5mbyA9IGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpO1xuXG4gICAgaWYgKCFpbmZvKSB7XG4gICAgICB2YXIgcGFyZW50TmFtZSA9IHR5cGVvZiBwYXJlbnRUeXBlID09PSAnc3RyaW5nJyA/IHBhcmVudFR5cGUgOiBwYXJlbnRUeXBlLmRpc3BsYXlOYW1lIHx8IHBhcmVudFR5cGUubmFtZTtcblxuICAgICAgaWYgKHBhcmVudE5hbWUpIHtcbiAgICAgICAgaW5mbyA9IFwiXFxuXFxuQ2hlY2sgdGhlIHRvcC1sZXZlbCByZW5kZXIgY2FsbCB1c2luZyA8XCIgKyBwYXJlbnROYW1lICsgXCI+LlwiO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpbmZvO1xuICB9XG59XG4vKipcbiAqIFdhcm4gaWYgdGhlIGVsZW1lbnQgZG9lc24ndCBoYXZlIGFuIGV4cGxpY2l0IGtleSBhc3NpZ25lZCB0byBpdC5cbiAqIFRoaXMgZWxlbWVudCBpcyBpbiBhbiBhcnJheS4gVGhlIGFycmF5IGNvdWxkIGdyb3cgYW5kIHNocmluayBvciBiZVxuICogcmVvcmRlcmVkLiBBbGwgY2hpbGRyZW4gdGhhdCBoYXZlbid0IGFscmVhZHkgYmVlbiB2YWxpZGF0ZWQgYXJlIHJlcXVpcmVkIHRvXG4gKiBoYXZlIGEgXCJrZXlcIiBwcm9wZXJ0eSBhc3NpZ25lZCB0byBpdC4gRXJyb3Igc3RhdHVzZXMgYXJlIGNhY2hlZCBzbyBhIHdhcm5pbmdcbiAqIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB0aGF0IHJlcXVpcmVzIGEga2V5LlxuICogQHBhcmFtIHsqfSBwYXJlbnRUeXBlIGVsZW1lbnQncyBwYXJlbnQncyB0eXBlLlxuICovXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVFeHBsaWNpdEtleShlbGVtZW50LCBwYXJlbnRUeXBlKSB7XG4gIHtcbiAgICBpZiAoIWVsZW1lbnQuX3N0b3JlIHx8IGVsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZCB8fCBlbGVtZW50LmtleSAhPSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZWxlbWVudC5fc3RvcmUudmFsaWRhdGVkID0gdHJ1ZTtcbiAgICB2YXIgY3VycmVudENvbXBvbmVudEVycm9ySW5mbyA9IGdldEN1cnJlbnRDb21wb25lbnRFcnJvckluZm8ocGFyZW50VHlwZSk7XG5cbiAgICBpZiAob3duZXJIYXNLZXlVc2VXYXJuaW5nW2N1cnJlbnRDb21wb25lbnRFcnJvckluZm9dKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb3duZXJIYXNLZXlVc2VXYXJuaW5nW2N1cnJlbnRDb21wb25lbnRFcnJvckluZm9dID0gdHJ1ZTsgLy8gVXN1YWxseSB0aGUgY3VycmVudCBvd25lciBpcyB0aGUgb2ZmZW5kZXIsIGJ1dCBpZiBpdCBhY2NlcHRzIGNoaWxkcmVuIGFzIGFcbiAgICAvLyBwcm9wZXJ0eSwgaXQgbWF5IGJlIHRoZSBjcmVhdG9yIG9mIHRoZSBjaGlsZCB0aGF0J3MgcmVzcG9uc2libGUgZm9yXG4gICAgLy8gYXNzaWduaW5nIGl0IGEga2V5LlxuXG4gICAgdmFyIGNoaWxkT3duZXIgPSAnJztcblxuICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuX293bmVyICYmIGVsZW1lbnQuX293bmVyICE9PSBSZWFjdEN1cnJlbnRPd25lciQxLmN1cnJlbnQpIHtcbiAgICAgIC8vIEdpdmUgdGhlIGNvbXBvbmVudCB0aGF0IG9yaWdpbmFsbHkgY3JlYXRlZCB0aGlzIGNoaWxkLlxuICAgICAgY2hpbGRPd25lciA9IFwiIEl0IHdhcyBwYXNzZWQgYSBjaGlsZCBmcm9tIFwiICsgZ2V0Q29tcG9uZW50TmFtZUZyb21UeXBlKGVsZW1lbnQuX293bmVyLnR5cGUpICsgXCIuXCI7XG4gICAgfVxuXG4gICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQkMShlbGVtZW50KTtcblxuICAgIGVycm9yKCdFYWNoIGNoaWxkIGluIGEgbGlzdCBzaG91bGQgaGF2ZSBhIHVuaXF1ZSBcImtleVwiIHByb3AuJyArICclcyVzIFNlZSBodHRwczovL3JlYWN0anMub3JnL2xpbmsvd2FybmluZy1rZXlzIGZvciBtb3JlIGluZm9ybWF0aW9uLicsIGN1cnJlbnRDb21wb25lbnRFcnJvckluZm8sIGNoaWxkT3duZXIpO1xuXG4gICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQkMShudWxsKTtcbiAgfVxufVxuLyoqXG4gKiBFbnN1cmUgdGhhdCBldmVyeSBlbGVtZW50IGVpdGhlciBpcyBwYXNzZWQgaW4gYSBzdGF0aWMgbG9jYXRpb24sIGluIGFuXG4gKiBhcnJheSB3aXRoIGFuIGV4cGxpY2l0IGtleXMgcHJvcGVydHkgZGVmaW5lZCwgb3IgaW4gYW4gb2JqZWN0IGxpdGVyYWxcbiAqIHdpdGggdmFsaWQga2V5IHByb3BlcnR5LlxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtSZWFjdE5vZGV9IG5vZGUgU3RhdGljYWxseSBwYXNzZWQgY2hpbGQgb2YgYW55IHR5cGUuXG4gKiBAcGFyYW0geyp9IHBhcmVudFR5cGUgbm9kZSdzIHBhcmVudCdzIHR5cGUuXG4gKi9cblxuXG5mdW5jdGlvbiB2YWxpZGF0ZUNoaWxkS2V5cyhub2RlLCBwYXJlbnRUeXBlKSB7XG4gIHtcbiAgICBpZiAodHlwZW9mIG5vZGUgIT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzQXJyYXkobm9kZSkpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hpbGQgPSBub2RlW2ldO1xuXG4gICAgICAgIGlmIChpc1ZhbGlkRWxlbWVudChjaGlsZCkpIHtcbiAgICAgICAgICB2YWxpZGF0ZUV4cGxpY2l0S2V5KGNoaWxkLCBwYXJlbnRUeXBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNWYWxpZEVsZW1lbnQobm9kZSkpIHtcbiAgICAgIC8vIFRoaXMgZWxlbWVudCB3YXMgcGFzc2VkIGluIGEgdmFsaWQgbG9jYXRpb24uXG4gICAgICBpZiAobm9kZS5fc3RvcmUpIHtcbiAgICAgICAgbm9kZS5fc3RvcmUudmFsaWRhdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGUpIHtcbiAgICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihub2RlKTtcblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIEVudHJ5IGl0ZXJhdG9ycyB1c2VkIHRvIHByb3ZpZGUgaW1wbGljaXQga2V5cyxcbiAgICAgICAgLy8gYnV0IG5vdyB3ZSBwcmludCBhIHNlcGFyYXRlIHdhcm5pbmcgZm9yIHRoZW0gbGF0ZXIuXG4gICAgICAgIGlmIChpdGVyYXRvckZuICE9PSBub2RlLmVudHJpZXMpIHtcbiAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwobm9kZSk7XG4gICAgICAgICAgdmFyIHN0ZXA7XG5cbiAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICBpZiAoaXNWYWxpZEVsZW1lbnQoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgdmFsaWRhdGVFeHBsaWNpdEtleShzdGVwLnZhbHVlLCBwYXJlbnRUeXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbi8qKlxuICogR2l2ZW4gYW4gZWxlbWVudCwgdmFsaWRhdGUgdGhhdCBpdHMgcHJvcHMgZm9sbG93IHRoZSBwcm9wVHlwZXMgZGVmaW5pdGlvbixcbiAqIHByb3ZpZGVkIGJ5IHRoZSB0eXBlLlxuICpcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBlbGVtZW50XG4gKi9cblxuXG5mdW5jdGlvbiB2YWxpZGF0ZVByb3BUeXBlcyhlbGVtZW50KSB7XG4gIHtcbiAgICB2YXIgdHlwZSA9IGVsZW1lbnQudHlwZTtcblxuICAgIGlmICh0eXBlID09PSBudWxsIHx8IHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcHJvcFR5cGVzO1xuXG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBwcm9wVHlwZXMgPSB0eXBlLnByb3BUeXBlcztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSB8fCAvLyBOb3RlOiBNZW1vIG9ubHkgY2hlY2tzIG91dGVyIHByb3BzIGhlcmUuXG4gICAgLy8gSW5uZXIgcHJvcHMgYXJlIGNoZWNrZWQgaW4gdGhlIHJlY29uY2lsZXIuXG4gICAgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFKSkge1xuICAgICAgcHJvcFR5cGVzID0gdHlwZS5wcm9wVHlwZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocHJvcFR5cGVzKSB7XG4gICAgICAvLyBJbnRlbnRpb25hbGx5IGluc2lkZSB0byBhdm9pZCB0cmlnZ2VyaW5nIGxhenkgaW5pdGlhbGl6ZXJzOlxuICAgICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lRnJvbVR5cGUodHlwZSk7XG4gICAgICBjaGVja1Byb3BUeXBlcyhwcm9wVHlwZXMsIGVsZW1lbnQucHJvcHMsICdwcm9wJywgbmFtZSwgZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlLlByb3BUeXBlcyAhPT0gdW5kZWZpbmVkICYmICFwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93bikge1xuICAgICAgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24gPSB0cnVlOyAvLyBJbnRlbnRpb25hbGx5IGluc2lkZSB0byBhdm9pZCB0cmlnZ2VyaW5nIGxhenkgaW5pdGlhbGl6ZXJzOlxuXG4gICAgICB2YXIgX25hbWUgPSBnZXRDb21wb25lbnROYW1lRnJvbVR5cGUodHlwZSk7XG5cbiAgICAgIGVycm9yKCdDb21wb25lbnQgJXMgZGVjbGFyZWQgYFByb3BUeXBlc2AgaW5zdGVhZCBvZiBgcHJvcFR5cGVzYC4gRGlkIHlvdSBtaXNzcGVsbCB0aGUgcHJvcGVydHkgYXNzaWdubWVudD8nLCBfbmFtZSB8fCAnVW5rbm93bicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdHlwZS5nZXREZWZhdWx0UHJvcHMgPT09ICdmdW5jdGlvbicgJiYgIXR5cGUuZ2V0RGVmYXVsdFByb3BzLmlzUmVhY3RDbGFzc0FwcHJvdmVkKSB7XG4gICAgICBlcnJvcignZ2V0RGVmYXVsdFByb3BzIGlzIG9ubHkgdXNlZCBvbiBjbGFzc2ljIFJlYWN0LmNyZWF0ZUNsYXNzICcgKyAnZGVmaW5pdGlvbnMuIFVzZSBhIHN0YXRpYyBwcm9wZXJ0eSBuYW1lZCBgZGVmYXVsdFByb3BzYCBpbnN0ZWFkLicpO1xuICAgIH1cbiAgfVxufVxuLyoqXG4gKiBHaXZlbiBhIGZyYWdtZW50LCB2YWxpZGF0ZSB0aGF0IGl0IGNhbiBvbmx5IGJlIHByb3ZpZGVkIHdpdGggZnJhZ21lbnQgcHJvcHNcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBmcmFnbWVudFxuICovXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVGcmFnbWVudFByb3BzKGZyYWdtZW50KSB7XG4gIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGZyYWdtZW50LnByb3BzKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG5cbiAgICAgIGlmIChrZXkgIT09ICdjaGlsZHJlbicgJiYga2V5ICE9PSAna2V5Jykge1xuICAgICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCQxKGZyYWdtZW50KTtcblxuICAgICAgICBlcnJvcignSW52YWxpZCBwcm9wIGAlc2Agc3VwcGxpZWQgdG8gYFJlYWN0LkZyYWdtZW50YC4gJyArICdSZWFjdC5GcmFnbWVudCBjYW4gb25seSBoYXZlIGBrZXlgIGFuZCBgY2hpbGRyZW5gIHByb3BzLicsIGtleSk7XG5cbiAgICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQkMShudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZyYWdtZW50LnJlZiAhPT0gbnVsbCkge1xuICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQkMShmcmFnbWVudCk7XG5cbiAgICAgIGVycm9yKCdJbnZhbGlkIGF0dHJpYnV0ZSBgcmVmYCBzdXBwbGllZCB0byBgUmVhY3QuRnJhZ21lbnRgLicpO1xuXG4gICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCQxKG51bGwpO1xuICAgIH1cbiAgfVxufVxuXG52YXIgZGlkV2FybkFib3V0S2V5U3ByZWFkID0ge307XG5mdW5jdGlvbiBqc3hXaXRoVmFsaWRhdGlvbih0eXBlLCBwcm9wcywga2V5LCBpc1N0YXRpY0NoaWxkcmVuLCBzb3VyY2UsIHNlbGYpIHtcbiAge1xuICAgIHZhciB2YWxpZFR5cGUgPSBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSk7IC8vIFdlIHdhcm4gaW4gdGhpcyBjYXNlIGJ1dCBkb24ndCB0aHJvdy4gV2UgZXhwZWN0IHRoZSBlbGVtZW50IGNyZWF0aW9uIHRvXG4gICAgLy8gc3VjY2VlZCBhbmQgdGhlcmUgd2lsbCBsaWtlbHkgYmUgZXJyb3JzIGluIHJlbmRlci5cblxuICAgIGlmICghdmFsaWRUeXBlKSB7XG4gICAgICB2YXIgaW5mbyA9ICcnO1xuXG4gICAgICBpZiAodHlwZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiB0eXBlICE9PSBudWxsICYmIE9iamVjdC5rZXlzKHR5cGUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpbmZvICs9ICcgWW91IGxpa2VseSBmb3Jnb3QgdG8gZXhwb3J0IHlvdXIgY29tcG9uZW50IGZyb20gdGhlIGZpbGUgJyArIFwiaXQncyBkZWZpbmVkIGluLCBvciB5b3UgbWlnaHQgaGF2ZSBtaXhlZCB1cCBkZWZhdWx0IGFuZCBuYW1lZCBpbXBvcnRzLlwiO1xuICAgICAgfVxuXG4gICAgICB2YXIgc291cmNlSW5mbyA9IGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtKHNvdXJjZSk7XG5cbiAgICAgIGlmIChzb3VyY2VJbmZvKSB7XG4gICAgICAgIGluZm8gKz0gc291cmNlSW5mbztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZm8gKz0gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciB0eXBlU3RyaW5nO1xuXG4gICAgICBpZiAodHlwZSA9PT0gbnVsbCkge1xuICAgICAgICB0eXBlU3RyaW5nID0gJ251bGwnO1xuICAgICAgfSBlbHNlIGlmIChpc0FycmF5KHR5cGUpKSB7XG4gICAgICAgIHR5cGVTdHJpbmcgPSAnYXJyYXknO1xuICAgICAgfSBlbHNlIGlmICh0eXBlICE9PSB1bmRlZmluZWQgJiYgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFKSB7XG4gICAgICAgIHR5cGVTdHJpbmcgPSBcIjxcIiArIChnZXRDb21wb25lbnROYW1lRnJvbVR5cGUodHlwZS50eXBlKSB8fCAnVW5rbm93bicpICsgXCIgLz5cIjtcbiAgICAgICAgaW5mbyA9ICcgRGlkIHlvdSBhY2NpZGVudGFsbHkgZXhwb3J0IGEgSlNYIGxpdGVyYWwgaW5zdGVhZCBvZiBhIGNvbXBvbmVudD8nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHlwZVN0cmluZyA9IHR5cGVvZiB0eXBlO1xuICAgICAgfVxuXG4gICAgICBlcnJvcignUmVhY3QuanN4OiB0eXBlIGlzIGludmFsaWQgLS0gZXhwZWN0ZWQgYSBzdHJpbmcgKGZvciAnICsgJ2J1aWx0LWluIGNvbXBvbmVudHMpIG9yIGEgY2xhc3MvZnVuY3Rpb24gKGZvciBjb21wb3NpdGUgJyArICdjb21wb25lbnRzKSBidXQgZ290OiAlcy4lcycsIHR5cGVTdHJpbmcsIGluZm8pO1xuICAgIH1cblxuICAgIHZhciBlbGVtZW50ID0ganN4REVWKHR5cGUsIHByb3BzLCBrZXksIHNvdXJjZSwgc2VsZik7IC8vIFRoZSByZXN1bHQgY2FuIGJlIG51bGxpc2ggaWYgYSBtb2NrIG9yIGEgY3VzdG9tIGZ1bmN0aW9uIGlzIHVzZWQuXG4gICAgLy8gVE9ETzogRHJvcCB0aGlzIHdoZW4gdGhlc2UgYXJlIG5vIGxvbmdlciBhbGxvd2VkIGFzIHRoZSB0eXBlIGFyZ3VtZW50LlxuXG4gICAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfSAvLyBTa2lwIGtleSB3YXJuaW5nIGlmIHRoZSB0eXBlIGlzbid0IHZhbGlkIHNpbmNlIG91ciBrZXkgdmFsaWRhdGlvbiBsb2dpY1xuICAgIC8vIGRvZXNuJ3QgZXhwZWN0IGEgbm9uLXN0cmluZy9mdW5jdGlvbiB0eXBlIGFuZCBjYW4gdGhyb3cgY29uZnVzaW5nIGVycm9ycy5cbiAgICAvLyBXZSBkb24ndCB3YW50IGV4Y2VwdGlvbiBiZWhhdmlvciB0byBkaWZmZXIgYmV0d2VlbiBkZXYgYW5kIHByb2QuXG4gICAgLy8gKFJlbmRlcmluZyB3aWxsIHRocm93IHdpdGggYSBoZWxwZnVsIG1lc3NhZ2UgYW5kIGFzIHNvb24gYXMgdGhlIHR5cGUgaXNcbiAgICAvLyBmaXhlZCwgdGhlIGtleSB3YXJuaW5ncyB3aWxsIGFwcGVhci4pXG5cblxuICAgIGlmICh2YWxpZFR5cGUpIHtcbiAgICAgIHZhciBjaGlsZHJlbiA9IHByb3BzLmNoaWxkcmVuO1xuXG4gICAgICBpZiAoY2hpbGRyZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoaXNTdGF0aWNDaGlsZHJlbikge1xuICAgICAgICAgIGlmIChpc0FycmF5KGNoaWxkcmVuKSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICB2YWxpZGF0ZUNoaWxkS2V5cyhjaGlsZHJlbltpXSwgdHlwZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChPYmplY3QuZnJlZXplKSB7XG4gICAgICAgICAgICAgIE9iamVjdC5mcmVlemUoY2hpbGRyZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvcignUmVhY3QuanN4OiBTdGF0aWMgY2hpbGRyZW4gc2hvdWxkIGFsd2F5cyBiZSBhbiBhcnJheS4gJyArICdZb3UgYXJlIGxpa2VseSBleHBsaWNpdGx5IGNhbGxpbmcgUmVhY3QuanN4cyBvciBSZWFjdC5qc3hERVYuICcgKyAnVXNlIHRoZSBCYWJlbCB0cmFuc2Zvcm0gaW5zdGVhZC4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsaWRhdGVDaGlsZEtleXMoY2hpbGRyZW4sIHR5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwocHJvcHMsICdrZXknKSkge1xuICAgICAgICB2YXIgY29tcG9uZW50TmFtZSA9IGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0eXBlKTtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wcykuZmlsdGVyKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgcmV0dXJuIGsgIT09ICdrZXknO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGJlZm9yZUV4YW1wbGUgPSBrZXlzLmxlbmd0aCA+IDAgPyAne2tleTogc29tZUtleSwgJyArIGtleXMuam9pbignOiAuLi4sICcpICsgJzogLi4ufScgOiAne2tleTogc29tZUtleX0nO1xuXG4gICAgICAgIGlmICghZGlkV2FybkFib3V0S2V5U3ByZWFkW2NvbXBvbmVudE5hbWUgKyBiZWZvcmVFeGFtcGxlXSkge1xuICAgICAgICAgIHZhciBhZnRlckV4YW1wbGUgPSBrZXlzLmxlbmd0aCA+IDAgPyAneycgKyBrZXlzLmpvaW4oJzogLi4uLCAnKSArICc6IC4uLn0nIDogJ3t9JztcblxuICAgICAgICAgIGVycm9yKCdBIHByb3BzIG9iamVjdCBjb250YWluaW5nIGEgXCJrZXlcIiBwcm9wIGlzIGJlaW5nIHNwcmVhZCBpbnRvIEpTWDpcXG4nICsgJyAgbGV0IHByb3BzID0gJXM7XFxuJyArICcgIDwlcyB7Li4ucHJvcHN9IC8+XFxuJyArICdSZWFjdCBrZXlzIG11c3QgYmUgcGFzc2VkIGRpcmVjdGx5IHRvIEpTWCB3aXRob3V0IHVzaW5nIHNwcmVhZDpcXG4nICsgJyAgbGV0IHByb3BzID0gJXM7XFxuJyArICcgIDwlcyBrZXk9e3NvbWVLZXl9IHsuLi5wcm9wc30gLz4nLCBiZWZvcmVFeGFtcGxlLCBjb21wb25lbnROYW1lLCBhZnRlckV4YW1wbGUsIGNvbXBvbmVudE5hbWUpO1xuXG4gICAgICAgICAgZGlkV2FybkFib3V0S2V5U3ByZWFkW2NvbXBvbmVudE5hbWUgKyBiZWZvcmVFeGFtcGxlXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSkge1xuICAgICAgdmFsaWRhdGVGcmFnbWVudFByb3BzKGVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWxpZGF0ZVByb3BUeXBlcyhlbGVtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxufSAvLyBUaGVzZSB0d28gZnVuY3Rpb25zIGV4aXN0IHRvIHN0aWxsIGdldCBjaGlsZCB3YXJuaW5ncyBpbiBkZXZcbi8vIGV2ZW4gd2l0aCB0aGUgcHJvZCB0cmFuc2Zvcm0uIFRoaXMgbWVhbnMgdGhhdCBqc3hERVYgaXMgcHVyZWx5XG4vLyBvcHQtaW4gYmVoYXZpb3IgZm9yIGJldHRlciBtZXNzYWdlcyBidXQgdGhhdCB3ZSB3b24ndCBzdG9wXG4vLyBnaXZpbmcgeW91IHdhcm5pbmdzIGlmIHlvdSB1c2UgcHJvZHVjdGlvbiBhcGlzLlxuXG5mdW5jdGlvbiBqc3hXaXRoVmFsaWRhdGlvblN0YXRpYyh0eXBlLCBwcm9wcywga2V5KSB7XG4gIHtcbiAgICByZXR1cm4ganN4V2l0aFZhbGlkYXRpb24odHlwZSwgcHJvcHMsIGtleSwgdHJ1ZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIGpzeFdpdGhWYWxpZGF0aW9uRHluYW1pYyh0eXBlLCBwcm9wcywga2V5KSB7XG4gIHtcbiAgICByZXR1cm4ganN4V2l0aFZhbGlkYXRpb24odHlwZSwgcHJvcHMsIGtleSwgZmFsc2UpO1xuICB9XG59XG5cbnZhciBqc3ggPSAganN4V2l0aFZhbGlkYXRpb25EeW5hbWljIDsgLy8gd2UgbWF5IHdhbnQgdG8gc3BlY2lhbCBjYXNlIGpzeHMgaW50ZXJuYWxseSB0byB0YWtlIGFkdmFudGFnZSBvZiBzdGF0aWMgY2hpbGRyZW4uXG4vLyBmb3Igbm93IHdlIGNhbiBzaGlwIGlkZW50aWNhbCBwcm9kIGZ1bmN0aW9uc1xuXG52YXIganN4cyA9ICBqc3hXaXRoVmFsaWRhdGlvblN0YXRpYyA7XG5cbmV4cG9ydHMuRnJhZ21lbnQgPSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xuZXhwb3J0cy5qc3ggPSBqc3g7XG5leHBvcnRzLmpzeHMgPSBqc3hzO1xuICB9KSgpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWpzeC1ydW50aW1lLnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWpzeC1ydW50aW1lLmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCJpbXBvcnQgeyBqc3ggYXMgX2pzeCB9IGZyb20gXCJyZWFjdC9qc3gtcnVudGltZVwiO1xuaW1wb3J0IHsgY3JlYXRlUmVtb3RlUmVhY3RDb21wb25lbnQgfSBmcm9tICdAcmVtb3RlLXVpL3JlYWN0JztcbmV4cG9ydCBjb25zdCBjcmVhdGVSZW1vdGVDb21wb25lbnRSZWdpc3RyeSA9ICgpID0+IHtcbiAgICBjb25zdCBjb21wb25lbnRNZXRhZGF0YUxvb2t1cCA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBjb21wb25lbnROYW1lQnlDb21wb25lbnRNYXAgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgcmVnaXN0ZXJDb21wb25lbnQgPSAoY29tcG9uZW50LCBjb21wb25lbnROYW1lLCBmcmFnbWVudFByb3BzKSA9PiB7XG4gICAgICAgIGNvbXBvbmVudE5hbWVCeUNvbXBvbmVudE1hcC5zZXQoY29tcG9uZW50LCBjb21wb25lbnROYW1lKTtcbiAgICAgICAgY29tcG9uZW50TWV0YWRhdGFMb29rdXAuc2V0KGNvbXBvbmVudE5hbWUsIHtcbiAgICAgICAgICAgIGZyYWdtZW50UHJvcHNTZXQ6IG5ldyBTZXQoZnJhZ21lbnRQcm9wcyksXG4gICAgICAgICAgICBmcmFnbWVudFByb3BzQXJyYXk6IGZyYWdtZW50UHJvcHMsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH07XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0Q29tcG9uZW50TmFtZTogKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudE5hbWVCeUNvbXBvbmVudE1hcC5nZXQoY29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudE5hbWU7XG4gICAgICAgIH0sXG4gICAgICAgIGlzQWxsb3dlZENvbXBvbmVudE5hbWU6IChjb21wb25lbnROYW1lKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50TWV0YWRhdGFMb29rdXAuaGFzKGNvbXBvbmVudE5hbWUpO1xuICAgICAgICB9LFxuICAgICAgICBpc0NvbXBvbmVudEZyYWdtZW50UHJvcDogKGNvbXBvbmVudE5hbWUsIHByb3BOYW1lKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnRNZXRhZGF0YSA9IGNvbXBvbmVudE1ldGFkYXRhTG9va3VwLmdldChjb21wb25lbnROYW1lKTtcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50TWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50TWV0YWRhdGEuZnJhZ21lbnRQcm9wc1NldC5oYXMocHJvcE5hbWUpO1xuICAgICAgICB9LFxuICAgICAgICBnZXRDb21wb25lbnRGcmFnbWVudFByb3BOYW1lczogKGNvbXBvbmVudE5hbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudE1ldGFkYXRhID0gY29tcG9uZW50TWV0YWRhdGFMb29rdXAuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICAgICAgaWYgKCFjb21wb25lbnRNZXRhZGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHsgZnJhZ21lbnRQcm9wc0FycmF5IH0gPSBjb21wb25lbnRNZXRhZGF0YTtcbiAgICAgICAgICAgIHJldHVybiBmcmFnbWVudFByb3BzQXJyYXk7XG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQ6IChjb21wb25lbnROYW1lLCBvcHRpb25zID0ge30pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgZnJhZ21lbnRQcm9wcyA9IFtdIH0gPSBvcHRpb25zO1xuICAgICAgICAgICAgY29uc3QgcmVtb3RlUmVhY3RDb21wb25lbnQgPSBjcmVhdGVSZW1vdGVSZWFjdENvbXBvbmVudChjb21wb25lbnROYW1lLCB7XG4gICAgICAgICAgICAgICAgZnJhZ21lbnRQcm9wczogZnJhZ21lbnRQcm9wcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlZ2lzdGVyQ29tcG9uZW50KHJlbW90ZVJlYWN0Q29tcG9uZW50LCBjb21wb25lbnROYW1lLCBmcmFnbWVudFByb3BzKTtcbiAgICAgICAgfSxcbiAgICAgICAgY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVDb21wb3VuZFJlYWN0Q29tcG9uZW50OiAoY29tcG9uZW50TmFtZSwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBmcmFnbWVudFByb3BzID0gW10gfSA9IG9wdGlvbnM7XG4gICAgICAgICAgICBjb25zdCBSZW1vdGVDb21wb25lbnRUeXBlID0gY3JlYXRlUmVtb3RlUmVhY3RDb21wb25lbnQoY29tcG9uZW50TmFtZSwge1xuICAgICAgICAgICAgICAgIGZyYWdtZW50UHJvcHMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIFdlIGNhbiBvbmx5IGF0dGFjaCBwcm9wZXJ0aWVzIHRvIGEgZnVuY3Rpb24gY29tcG9uZW50IHR5cGUsIHNvIHdlIG5lZWQgdG8gY2hlY2sgaWYgdGhlIHJlbW90ZSBjb21wb25lbnQgdHlwZSBpcyBhIGZ1bmN0aW9uLlxuICAgICAgICAgICAgLy8gSWYgdGhlIHJlbW90ZSBjb21wb25lbnQgdHlwZSBpcyBub3QgYSBmdW5jdGlvbiwgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgZnVuY3Rpb24gY29tcG9uZW50LlxuICAgICAgICAgICAgY29uc3QgQ29tcG91bmRGdW5jdGlvbkNvbXBvbmVudFR5cGUgPSB0eXBlb2YgUmVtb3RlQ29tcG9uZW50VHlwZSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICAgID8gUmVtb3RlQ29tcG9uZW50VHlwZVxuICAgICAgICAgICAgICAgIDogKHByb3BzKSA9PiAoX2pzeChSZW1vdGVDb21wb25lbnRUeXBlLCB7IC4uLnByb3BzIH0pKTtcbiAgICAgICAgICAgIC8vIEF0dGFjaCB0aGUgY29tcG91bmQgY29tcG9uZW50IHByb3BlcnRpZXMgdG8gdGhlIGZ1bmN0aW9uIGNvbXBvbmVudCB0aGF0IHdlIHdpbGwgYmUgcmV0dXJuaW5nLlxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihDb21wb3VuZEZ1bmN0aW9uQ29tcG9uZW50VHlwZSwgb3B0aW9ucy5jb21wb3VuZENvbXBvbmVudFByb3BlcnRpZXMpO1xuICAgICAgICAgICAgLy8gUmVnaXN0ZXIgdGhlIGNvbXBvdW5kIGZ1bmN0aW9uIGNvbXBvbmVudCB3aXRoIHRoZSByZWdpc3RyeSBhbmQgcmV0dXJuIGl0LlxuICAgICAgICAgICAgcmV0dXJuIHJlZ2lzdGVyQ29tcG9uZW50KENvbXBvdW5kRnVuY3Rpb25Db21wb25lbnRUeXBlLCBjb21wb25lbnROYW1lLCBmcmFnbWVudFByb3BzKTtcbiAgICAgICAgfSxcbiAgICB9O1xufTtcbiIsImltcG9ydCB7IGNyZWF0ZVJlbW90ZUNvbXBvbmVudFJlZ2lzdHJ5IH0gZnJvbSBcIi4vdXRpbHMvcmVtb3RlLWNvbXBvbmVudC1yZWdpc3RyeS5qc1wiO1xuLyoqXG4gKiBSZXByZXNlbnRzIGEgcmVnaXN0cnkgb2YgSHViU3BvdC1wcm92aWRlZCBSZWFjdCBjb21wb25lbnRzIHRoYXQgc2hvdWxkIG9ubHkgYmUgdXNlZCAqKmludGVybmFsbHkqKiBieSB0aGUgVUkgZXh0ZW5zaW9uIFNESy5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGNvbnN0IF9faHViU3BvdENvbXBvbmVudFJlZ2lzdHJ5ID0gY3JlYXRlUmVtb3RlQ29tcG9uZW50UmVnaXN0cnkoKTtcbmNvbnN0IHsgY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCwgY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVDb21wb3VuZFJlYWN0Q29tcG9uZW50LCB9ID0gX19odWJTcG90Q29tcG9uZW50UmVnaXN0cnk7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFNUQU5EQVJEIENPTVBPTkVOVFNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLyoqXG4gKiBUaGUgYEFsZXJ0YCBjb21wb25lbnQgcmVuZGVycyBhbiBhbGVydCB3aXRoaW4gYSBjYXJkLiBVc2UgdGhpcyBjb21wb25lbnQgdG8gZ2l2ZSB1c2FnZSBndWlkYW5jZSwgbm90aWZ5IHVzZXJzIG9mIGFjdGlvbiByZXN1bHRzLCBvciB3YXJuIHRoZW0gYWJvdXQgcG90ZW50aWFsIGlzc3VlcyBvciBmYWlsdXJlcy5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9hbGVydCBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9hcHAuaHVic3BvdC5jb20vZG9jcy80ODAwODkxNi9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2FsZXJ0I3ZhcmlhbnRzIFZhcmlhbnRzfVxuICovXG5leHBvcnQgY29uc3QgQWxlcnQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdBbGVydCcpO1xuLyoqXG4gKiBUaGUgYEJ1dHRvbmAgY29tcG9uZW50IHJlbmRlcnMgYSBzaW5nbGUgYnV0dG9uLiBVc2UgdGhpcyBjb21wb25lbnQgdG8gZW5hYmxlIHVzZXJzIHRvIHBlcmZvcm0gYWN0aW9ucywgc3VjaCBhcyBzdWJtaXR0aW5nIGEgZm9ybSwgc2VuZGluZyBkYXRhIHRvIGFuIGV4dGVybmFsIHN5c3RlbSwgb3IgZGVsZXRpbmcgZGF0YS5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9idXR0b24gRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvYnV0dG9uI3VzYWdlLWV4YW1wbGVzIEV4YW1wbGVzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL0h1YlNwb3QvdWktZXh0ZW5zaW9ucy1leGFtcGxlcy90cmVlL21haW4vZGVzaWduLXBhdHRlcm5zI2J1dHRvbiBEZXNpZ24gUGF0dGVybiBFeGFtcGxlc31cbiAqL1xuZXhwb3J0IGNvbnN0IEJ1dHRvbiA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0J1dHRvbicsIHtcbiAgICBmcmFnbWVudFByb3BzOiBbJ292ZXJsYXknXSxcbn0pO1xuLyoqXG4gKiBUaGUgYEJ1dHRvblJvd2AgY29tcG9uZW50IHJlbmRlcnMgYSByb3cgb2Ygc3BlY2lmaWVkIGBCdXR0b25gIGNvbXBvbmVudHMuIFVzZSB0aGlzIGNvbXBvbmVudCB3aGVuIHlvdSB3YW50IHRvIGluY2x1ZGUgbXVsdGlwbGUgYnV0dG9ucyBpbiBhIHJvdy5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9idXR0b24tcm93IERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBCdXR0b25Sb3cgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdCdXR0b25Sb3cnKTtcbmV4cG9ydCBjb25zdCBDYXJkID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQ2FyZCcpO1xuLyoqXG4gKiBUaGUgYERlc2NyaXB0aW9uTGlzdGAgY29tcG9uZW50IHJlbmRlcnMgcGFpcnMgb2YgbGFiZWxzIGFuZCB2YWx1ZXMuIFVzZSB0aGlzIGNvbXBvbmVudCB0byBkaXNwbGF5IHBhaXJzIG9mIGxhYmVscyBhbmQgdmFsdWVzIGluIGEgd2F5IHRoYXQncyBlYXN5IHRvIHJlYWQgYXQgYSBnbGFuY2UuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvZGVzY3JpcHRpb24tbGlzdCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgRGVzY3JpcHRpb25MaXN0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnRGVzY3JpcHRpb25MaXN0Jyk7XG4vKipcbiAqIFRoZSBgRGVzY3JpcHRpb25MaXN0SXRlbWAgY29tcG9uZW50IHJlbmRlcnMgYSBzaW5nbGUgc2V0IG9mIGEgbGFiZWwgYW5kIHZhbHVlLiBVc2UgdGhpcyBjb21wb25lbnQgd2l0aGluIGEgYERlc2NyaXB0aW9uTGlzdGAgY29tcG9uZW50LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2Rlc2NyaXB0aW9uLWxpc3QgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IERlc2NyaXB0aW9uTGlzdEl0ZW0gPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdEZXNjcmlwdGlvbkxpc3RJdGVtJyk7XG4vKipcbiAqIFRoZSBgRGl2aWRlcmAgY29tcG9uZW50IHJlbmRlcnMgYSBncmV5LCBob3Jpem9udGFsIGxpbmUgZm9yIHNwYWNpbmcgb3V0IGNvbXBvbmVudHMgdmVydGljYWxseSBvciBjcmVhdGluZyBzZWN0aW9ucyBpbiBhbiBleHRlbnNpb24uIFVzZSB0aGlzIGNvbXBvbmVudCB0byBzcGFjZSBvdXQgb3RoZXIgY29tcG9uZW50cyB3aGVuIHRoZSBjb250ZW50IG5lZWRzIG1vcmUgc2VwYXJhdGlvbiB0aGFuIHdoaXRlIHNwYWNlLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2RpdmlkZXIgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IERpdmlkZXIgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdEaXZpZGVyJyk7XG4vKipcbiAqIFRoZSBgU3BhY2VyYCBjb21wb25lbnQgcmVuZGVycyB2ZXJ0aWNhbCBzcGFjZSBiZXR3ZWVuIGNvbXBvbmVudHMuIFVzZSB0aGlzIGNvbXBvbmVudFxuICogdG8gYWRkIGNvbnNpc3RlbnQgc3BhY2luZyB3aXRob3V0IHVzaW5nIGVtcHR5IHdyYXBwZXIgY29tcG9uZW50cy5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9zcGFjZXIgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFNwYWNlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1NwYWNlcicpO1xuLyoqXG4gKiBUaGUgYEVtcHR5U3RhdGVgIGNvbXBvbmVudCBzZXRzIHRoZSBjb250ZW50IHRoYXQgYXBwZWFycyB3aGVuIHRoZSBleHRlbnNpb24gaXMgaW4gYW4gZW1wdHkgc3RhdGUuIFVzZSB0aGlzIGNvbXBvbmVudCB3aGVuIHRoZXJlJ3Mgbm8gY29udGVudCBvciBkYXRhIHRvIGhlbHAgZ3VpZGUgdXNlcnMuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvZW1wdHktc3RhdGUgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IEVtcHR5U3RhdGUgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdFbXB0eVN0YXRlJyk7XG4vKipcbiAqIFRoZSBgRXJyb3JTdGF0ZWAgY29tcG9uZW50IHNldHMgdGhlIGNvbnRlbnQgb2YgYW4gZXJyb3JpbmcgZXh0ZW5zaW9uLiBVc2UgdGhpcyBjb21wb25lbnQgdG8gZ3VpZGUgdXNlcnMgdGhyb3VnaCByZXNvbHZpbmcgZXJyb3JzIHRoYXQgeW91ciBleHRlbnNpb24gbWlnaHQgZW5jb3VudGVyLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2Vycm9yLXN0YXRlIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBFcnJvclN0YXRlID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnRXJyb3JTdGF0ZScpO1xuLyoqXG4gKiBUaGUgYEZvcm1gIGNvbXBvbmVudCByZW5kZXJzIGEgZm9ybSB0aGF0IGNhbiBjb250YWluIG90aGVyIHN1YmNvbXBvbmVudHMsIHN1Y2ggYXMgYElucHV0YCwgYFNlbGVjdGAsIGFuZCBgQnV0dG9uYC4gVXNlIHRoaXMgY29tcG9uZW50IHRvIGVuYWJsZSB1c2VycyB0byBzdWJtaXQgZGF0YSB0byBIdWJTcG90IG9yIGFuIGV4dGVybmFsIHN5c3RlbS5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9mb3JtIERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9kZXNpZ24tcGF0dGVybnMjZm9ybSBEZXNpZ24gUGF0dGVybiBFeGFtcGxlc31cbiAqL1xuZXhwb3J0IGNvbnN0IEZvcm0gPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdGb3JtJyk7XG4vKipcbiAqIFRoZSBgSGVhZGluZ2AgY29tcG9uZW50IHJlbmRlcnMgbGFyZ2UgaGVhZGluZyB0ZXh0LiBVc2UgdGhpcyBjb21wb25lbnQgdG8gaW50cm9kdWNlIG9yIGRpZmZlcmVudGlhdGUgc2VjdGlvbnMgb2YgeW91ciBjb21wb25lbnQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvaGVhZGluZyBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgSGVhZGluZyA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0hlYWRpbmcnKTtcbi8qKlxuICogVGhlIGBJbWFnZWAgY29tcG9uZW50IHJlbmRlcnMgYW4gaW1hZ2UuIFVzZSB0aGlzIGNvbXBvbmVudCB0byBhZGQgYSBsb2dvIG9yIG90aGVyIHZpc3VhbCBicmFuZCBpZGVudGl0eSBhc3NldCwgb3IgdG8gYWNjZW50dWF0ZSBvdGhlciBjb250ZW50IGluIHRoZSBleHRlbnNpb24uXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvaW1hZ2UgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IEltYWdlID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnSW1hZ2UnLCB7XG4gICAgZnJhZ21lbnRQcm9wczogWydvdmVybGF5J10sXG59KTtcbi8qKlxuICogVGhlIGBJbnB1dGAgY29tcG9uZW50IHJlbmRlcnMgYSB0ZXh0IGlucHV0IGZpZWxkIHdoZXJlIGEgdXNlciBjYW4gZW50ZXIgYSBjdXN0b20gdGV4dCB2YWx1ZS4gTGlrZSBvdGhlciBpbnB1dHMsIHRoaXMgY29tcG9uZW50IHNob3VsZCBiZSB1c2VkIHdpdGhpbiBhIGBGb3JtYCB0aGF0IGhhcyBhIHN1Ym1pdCBidXR0b24uXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvaW5wdXQgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IElucHV0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnSW5wdXQnKTtcbi8qKlxuICogVGhlIGBMaW5rYCBjb21wb25lbnQgcmVuZGVycyBhIGNsaWNrYWJsZSBoeXBlcmxpbmsuIFVzZSBsaW5rcyB0byBkaXJlY3QgdXNlcnMgdG8gYW4gZXh0ZXJuYWwgd2ViIHBhZ2Ugb3IgYW5vdGhlciBwYXJ0IG9mIHRoZSBIdWJTcG90IGFwcC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9saW5rIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBMaW5rID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnTGluaycsIHtcbiAgICBmcmFnbWVudFByb3BzOiBbJ292ZXJsYXknXSxcbn0pO1xuLyoqXG4gKiBUaGUgYFRleHRBcmVhYCBjb21wb25lbnQgcmVuZGVycyBhIGZpbGxhYmxlIHRleHQgZmllbGQuIExpa2Ugb3RoZXIgaW5wdXRzLCB0aGlzIGNvbXBvbmVudCBzaG91bGQgYmUgdXNlZCB3aXRoaW4gYSBgRm9ybWAgdGhhdCBoYXMgYSBzdWJtaXQgYnV0dG9uLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3RleHQtYXJlYSBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgVGV4dEFyZWEgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUZXh0QXJlYScpO1xuLy8gVGV4dGFyZWEgd2FzIGNoYW5nZWQgdG8gVGV4dEFyZWFcbi8vIEV4cG9ydGluZyBib3RoIGZvciBiYWNrd2FyZHMgY29tcGF0XG4vKiogQGRlcHJlY2F0ZWQgdXNlIFRleHRBcmVhIGluc3RlYWQuIFdpdGggYSBjYXBpdGFsIEEuKi9cbmV4cG9ydCBjb25zdCBUZXh0YXJlYSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RleHRhcmVhJyk7XG4vKipcbiAqIFRoZSBgTG9hZGluZ1NwaW5uZXJgIGNvbXBvbmVudCByZW5kZXJzIGEgdmlzdWFsIGluZGljYXRvciBmb3Igd2hlbiBhbiBleHRlbnNpb24gaXMgbG9hZGluZyBvciBwcm9jZXNzaW5nIGRhdGEuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvbG9hZGluZy1zcGlubmVyIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBMb2FkaW5nU3Bpbm5lciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0xvYWRpbmdTcGlubmVyJyk7XG4vKipcbiAqIFRoZSBgUHJvZ3Jlc3NCYXJgIGNvbXBvbmVudCByZW5kZXJzIGEgdmlzdWFsIGluZGljYXRvciBzaG93aW5nIGEgbnVtZXJpYyBhbmQvb3IgcGVyY2VudGFnZS1iYXNlZCByZXByZXNlbnRhdGlvbiBvZiBwcm9ncmVzcy4gVGhlIHBlcmNlbnRhZ2UgaXMgY2FsY3VsYXRlZCBiYXNlZCBvbiB0aGUgbWF4aW11bSBwb3NzaWJsZSB2YWx1ZSBzcGVjaWZpZWQgaW4gdGhlIGNvbXBvbmVudC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9wcm9ncmVzcy1iYXIgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFByb2dyZXNzQmFyID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnUHJvZ3Jlc3NCYXInKTtcbi8qKlxuICogVGhlIGBTZWxlY3RgIGNvbXBvbmVudCByZW5kZXJzIGEgZHJvcGRvd24gbWVudSBzZWxlY3QgZmllbGQgd2hlcmUgYSB1c2VyIGNhbiBzZWxlY3QgYSBzaW5nbGUgdmFsdWUuIEEgc2VhcmNoIGJhciB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgaW5jbHVkZWQgd2hlbiB0aGVyZSBhcmUgbW9yZSB0aGFuIHNldmVuIG9wdGlvbnMuIExpa2Ugb3RoZXIgaW5wdXRzLCB0aGlzIGNvbXBvbmVudCBzaG91bGQgYmUgdXNlZCB3aXRoaW4gYSBgRm9ybWAgdGhhdCBoYXMgYSBzdWJtaXQgYnV0dG9uLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3NlbGVjdCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgU2VsZWN0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU2VsZWN0Jyk7XG4vKipcbiAqIFRoZSBgVGFnYCBjb21wb25lbnQgcmVuZGVycyBhIHRhZyB0byBsYWJlbCBvciBjYXRlZ29yaXplIGluZm9ybWF0aW9uIG9yIG90aGVyIGNvbXBvbmVudHMuIFRhZ3MgY2FuIGJlIHN0YXRpYyBvciBjbGlja2FibGUgZm9yIGludm9raW5nIGZ1bmN0aW9ucy5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90YWcgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFRhZyA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RhZycsIHtcbiAgICBmcmFnbWVudFByb3BzOiBbJ292ZXJsYXknXSxcbn0pO1xuLyoqXG4gKiBUaGUgYFRleHRgIGNvbXBvbmVudCByZW5kZXJzIHRleHQgd2l0aCBmb3JtYXR0aW5nIG9wdGlvbnMuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdGV4dCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgVGV4dCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RleHQnKTtcbi8qKlxuICogVGhlIGBUaWxlYCBjb21wb25lbnQgcmVuZGVycyBhIHNxdWFyZSB0aWxlIHRoYXQgY2FuIGNvbnRhaW4gb3RoZXIgY29tcG9uZW50cy4gVXNlIHRoaXMgY29tcG9uZW50IHRvIGNyZWF0ZSBncm91cHMgb2YgcmVsYXRlZCBjb21wb25lbnRzLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3RpbGUgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFRpbGUgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUaWxlJyk7XG4vKiogQGRlcHJlY2F0ZWQgdXNlIEZsZXggaW5zdGVhZC4gSXQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IHJlbGVhc2UuICovXG5leHBvcnQgY29uc3QgU3RhY2sgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdTdGFjaycpO1xuLyoqXG4gKiBUaGUgYFRvZ2dsZUdyb3VwYCBjb21wb25lbnQgcmVuZGVycyBhIGxpc3Qgb2Ygc2VsZWN0YWJsZSBvcHRpb25zLCBlaXRoZXIgaW4gcmFkaW8gYnV0dG9uIG9yIGNoZWNrYm94IGZvcm0uXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdG9nZ2xlLWdyb3VwIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBUb2dnbGVHcm91cCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RvZ2dsZUdyb3VwJyk7XG4vKipcbiAqIFRoZSBgU3RhdGlzdGljc0l0ZW1gIGNvbXBvbmVudCByZW5kZXJzIGEgc2luZ2xlIGRhdGEgcG9pbnQgd2l0aGluIGEgYFN0YXRpc3RpY3NgIGNvbXBvbmVudC4gVXNlIHRoaXMgY29tcG9uZW50IHRvIGRpc3BsYXkgYSBzaW5nbGUgZGF0YSBwb2ludCwgc3VjaCBhcyBhIG51bWJlciBvciBwZXJjZW50YWdlLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3N0YXRpc3RpY3MgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFN0YXRpc3RpY3NJdGVtID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU3RhdGlzdGljc0l0ZW0nKTtcbi8qKlxuICogVGhlIGBTdGF0aXN0aWNzYCBjb21wb25lbnQgcmVuZGVycyBhIHZpc3VhbCBzcG90bGlnaHQgb2Ygb25lIG9yIG1vcmUgZGF0YSBwb2ludHMuIEluY2x1ZGVzIHRoZSBgU3RhdGlzdGljc0l0ZW1gIGFuZCBgU3RhdGlzdGljc1RyZW5kYCBzdWJjb21wb25lbnRzLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3N0YXRpc3RpY3MgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFN0YXRpc3RpY3MgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdTdGF0aXN0aWNzJyk7XG4vKipcbiAqIFRoZSBgU3RhdGlzdGljc1RyZW5kYCBjb21wb25lbnQgcmVuZGVycyBhIHBlcmNlbnRhZ2UgdHJlbmQgdmFsdWUgYW5kIGRpcmVjdGlvbiBhbG9uc2lkZSBhIGBTdGF0aXN0aWNzSXRlbWAgY29tcG9uZW50LiBVc2UgdGhpcyBjb21wb25lbnQgd2l0aGluIHRoZSBgU3RhdGlzdGljc0l0ZW1gIGNvbXBvbmVudC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9zdGF0aXN0aWNzIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBTdGF0aXN0aWNzVHJlbmQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdTdGF0aXN0aWNzVHJlbmQnKTtcbi8qKlxuICogVGhlIGBUYWJsZWAgY29tcG9uZW50IHJlbmRlcnMgYSB0YWJsZS4gVG8gZm9ybWF0IHRoZSB0YWJsZSwgdXNlIHRoZSBzdWJjb21wb25lbnRzIGBUYWJsZUhlYWRgLCBgVGFibGVSb3dgLCBgVGFibGVIZWFkZXJgLCBgVGFibGVCb2R5YCwgYFRhYmxlQ2VsbGBhbmQgYFRhYmxlRm9vdGVyYC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90YWJsZSBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL0h1YlNwb3QvdWktZXh0ZW5zaW9ucy1leGFtcGxlcy90cmVlL21haW4vZGVzaWduLXBhdHRlcm5zI3RhYmxlIERlc2lnbiBQYXR0ZXJuIEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBUYWJsZSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RhYmxlJyk7XG4vKipcbiAqIFRoZSBgVGFibGVGb290ZXJgIGNvbXBvbmVudCByZW5kZXJzIGEgZm9vdGVyIHdpdGhpbiBhIGBUYWJsZWAgY29tcG9uZW50LiBVc2UgdGhpcyBjb21wb25lbnQgdG8gZGlzcGxheSB0b3RhbHMgb3Igb3RoZXIgc3VtbWFyeSBpbmZvcm1hdGlvbi5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90YWJsZSBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgVGFibGVGb290ZXIgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUYWJsZUZvb3RlcicpO1xuLyoqXG4gKiBUaGUgYFRhYmxlQ2VsbGAgY29tcG9uZW50IHJlbmRlcnMgaW5kaXZpZHVhbCBjZWxscyB3aXRoaW4gdGhlIGBUYWJsZUJvZHlgIGNvbXBvbmVudC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90YWJsZSBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgVGFibGVDZWxsID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnVGFibGVDZWxsJyk7XG4vKipcbiAqIFRoZSBgVGFibGVSb3dgIGNvbXBvbmVudCByZW5kZXJzIGEgcm93IHdpdGhpbiB0aGUgYFRhYmxlQm9keWAgb3IgYFRhYmxlSGVhZGAgY29tcG9uZW50LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3RhYmxlIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBUYWJsZVJvdyA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RhYmxlUm93Jyk7XG4vKipcbiAqIFRoZSBgVGFibGVCb2R5YCBjb21wb25lbnQgcmVuZGVycyB0aGUgYm9keSAocm93cyBhbmQgY2VsbHMpIG9mIGEgdGFibGUgd2l0aGluIHRoZSBgVGFibGVgIGNvbXBvbmVudC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90YWJsZSBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgVGFibGVCb2R5ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnVGFibGVCb2R5Jyk7XG4vKipcbiAqIFRoZSBgVGFibGVIZWFkZXJgIGNvbXBvbmVudCByZW5kZXJzIGluZGl2aWR1YWwgY2VsbHMgY29udGFpbmluZyBib2xkZWQgY29sdW1uIGxhYmVscywgd2l0aGluIGBUYWJsZUhlYWRgLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3RhYmxlIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBUYWJsZUhlYWRlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RhYmxlSGVhZGVyJyk7XG4vKipcbiAqIFRoZSBgVGFibGVIZWFkYCBjb21wb25lbnQgcmVuZGVycyB0aGUgaGVhZGVyIHNlY3Rpb24gb2YgdGhlIGBUYWJsZWAgY29tcG9uZW50LCBjb250YWluaW5nIGNvbHVtbiBsYWJlbHMuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdGFibGUgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFRhYmxlSGVhZCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RhYmxlSGVhZCcpO1xuLyoqXG4gKiBUaGUgYE51bWJlcklucHV0YCBjb21wb25lbnQgcmVuZGVycyBhIG51bWJlciBpbnB1dCBmaWVsZC4gTGlrZSBvdGhlciBpbnB1dHMsIHRoaXMgY29tcG9uZW50IHNob3VsZCBiZSB1c2VkIHdpdGhpbiBhIGBGb3JtYCB0aGF0IGhhcyBhIHN1Ym1pdCBidXR0b24uXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvbnVtYmVyLWlucHV0IERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBOdW1iZXJJbnB1dCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ051bWJlcklucHV0Jyk7XG4vKipcbiAqIFRoZSBgQm94YCBjb21wb25lbnQgcmVuZGVycyBhbiBlbXB0eSBkaXYgY29udGFpbmVyIGZvciBmaW5lIHR1bmluZyB0aGUgc3BhY2luZyBvZiBjb21wb25lbnRzLiBDb21tb25seSB1c2VkIHdpdGggdGhlIGBGbGV4YCBjb21wb25lbnQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvYm94IERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9mbGV4LWFuZC1ib3ggRmxleCBhbmQgQm94IEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBCb3ggPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdCb3gnKTtcbi8qKlxuICogVGhlIGBTdGVwSW5kaWNhdG9yYCBjb21wb25lbnQgcmVuZGVycyBhbiBpbmRpY2F0b3IgdG8gc2hvdyB0aGUgY3VycmVudCBzdGVwIG9mIGEgbXVsdGktc3RlcCBwcm9jZXNzLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3N0ZXAtaW5kaWNhdG9yIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBTdGVwSW5kaWNhdG9yID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU3RlcEluZGljYXRvcicpO1xuLyoqXG4gKiBUaGUgYEFjY29yZGlvbmAgY29tcG9uZW50IHJlbmRlcnMgYW4gZXhwYW5kYWJsZSBhbmQgY29sbGFwc2FibGUgc2VjdGlvbiB0aGF0IGNhbiBjb250YWluIG90aGVyIGNvbXBvbmVudHMuIFRoaXMgY29tcG9uZW50IGNhbiBiZSBoZWxwZnVsIGZvciBzYXZpbmcgc3BhY2UgYW5kIGJyZWFraW5nIHVwIGV4dGVuc2lvbiBjb250ZW50LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2FjY29yZGlvbiBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgQWNjb3JkaW9uID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQWNjb3JkaW9uJyk7XG4vKipcbiAqIFRoZSBNdWx0aVNlbGVjdCBjb21wb25lbnQgcmVuZGVycyBhIGRyb3Bkb3duIG1lbnUgc2VsZWN0IGZpZWxkIHdoZXJlIGEgdXNlciBjYW4gc2VsZWN0IG11bHRpcGxlIHZhbHVlcy4gQ29tbW9ubHkgdXNlZCB3aXRoaW4gdGhlIGBGb3JtYCBjb21wb25lbnQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvbXVsdGktc2VsZWN0IERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBNdWx0aVNlbGVjdCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ011bHRpU2VsZWN0Jyk7XG4vKipcbiAqIFRoZSBgRmxleGAgY29tcG9uZW50IHJlbmRlcnMgYSBmbGV4IGNvbnRhaW5lciB0aGF0IGNhbiBjb250YWluIG90aGVyIGNvbXBvbmVudHMsIGFuZCBhcnJhbmdlIHRoZW0gd2l0aCBwcm9wcy4gVXNlIHRoaXMgY29tcG9uZW50IHRvIGNyZWF0ZSBhIGZsZXhpYmxlIGFuZCByZXNwb25zaXZlIGxheW91dC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9mbGV4IERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9mbGV4LWFuZC1ib3ggRmxleCBhbmQgQm94IEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBGbGV4ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnRmxleCcpO1xuLyoqXG4gKiBUaGUgYERhdGVJbnB1dGAgY29tcG9uZW50IHJlbmRlcnMgYW4gaW5wdXQgZmllbGQgd2hlcmUgYSB1c2VyIGNhbiBzZWxlY3QgYSBkYXRlLiBDb21tb25seSB1c2VkIHdpdGhpbiB0aGUgYEZvcm1gIGNvbXBvbmVudC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9kYXRlLWlucHV0IERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBEYXRlSW5wdXQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdEYXRlSW5wdXQnKTtcbi8qKlxuICogVGhlIGBDaGVja2JveGAgY29tcG9uZW50IHJlbmRlcnMgYSBzaW5nbGUgY2hlY2tib3ggaW5wdXQuIENvbW1vbmx5IHVzZWQgd2l0aGluIHRoZSBgRm9ybWAgY29tcG9uZW50LiBJZiB5b3Ugd2FudCB0byBkaXNwbGF5IG11bHRpcGxlIGNoZWNrYm94ZXMsIHlvdSBzaG91bGQgdXNlIGBUb2dnbGVHcm91cGAgaW5zdGVhZCwgYXMgaXQgY29tZXMgd2l0aCBleHRyYSBsb2dpYyBmb3IgaGFuZGxpbmcgbXVsdGlwbGUgY2hlY2tib3hlcy5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9jaGVja2JveCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgQ2hlY2tib3ggPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdDaGVja2JveCcpO1xuLyoqXG4gKiBUaGUgYFJhZGlvQnV0dG9uYCBjb21wb25lbnQgcmVuZGVycyBhIHNpbmdsZSByYWRpbyBpbnB1dC4gQ29tbW9ubHkgdXNlZCB3aXRoaW4gdGhlIGBGb3JtYCBjb21wb25lbnQuIElmIHlvdSB3YW50IHRvIGRpc3BsYXkgbXVsdGlwbGUgcmFkaW8gaW5wdXRzLCB5b3Ugc2hvdWxkIHVzZSBgVG9nZ2xlR3JvdXBgIGluc3RlYWQsIGFzIGl0IGNvbWVzIHdpdGggZXh0cmEgbG9naWMgZm9yIGhhbmRsaW5nIG11bHRpcGxlIGlucHV0cy5cbiAqL1xuZXhwb3J0IGNvbnN0IFJhZGlvQnV0dG9uID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnUmFkaW9CdXR0b24nKTtcbi8qKlxuICogVGhlIGBMaXN0YCBjb21wb25lbnQgcmVuZGVycyBhIGxpc3Qgb2YgaXRlbXMuIFVzZSB0aGlzIGNvbXBvbmVudCB0byBkaXNwbGF5IGEgbGlzdCBvZiBpdGVtcywgc3VjaCBhcyBhIGxpc3Qgb2YgY29udGFjdHMsIHRhc2tzLCBvciBvdGhlciBkYXRhLiBBIGxpc3QgY2FuIGJlIHN0eWxlZCBhcyBhIGJ1bGxldGVkIGxpc3Qgb3IgYSBudW1iZXJlZCBsaXN0LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2xpc3QgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IExpc3QgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdMaXN0Jyk7XG4vKipcbiAqIFRoZSBgVG9nZ2xlYCBjb21wb25lbnQgcmVuZGVycyBhIGJvb2xlYW4gdG9nZ2xlIHN3aXRjaCB0aGF0IGNhbiBiZSBjb25maWd1cmVkIHdpdGggc2l6aW5nLCBsYWJlbCBwb3NpdGlvbiwgcmVhZC1vbmx5LCBhbmQgbW9yZS5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90b2dnbGUgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFRvZ2dsZSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RvZ2dsZScpO1xuLyoqXG4gKiBUaGUgYERyb3Bkb3duYCBjb21wb25lbnQgcmVuZGVycyBhIGRyb3Bkb3duIG1lbnUgdGhhdCBjYW4gYXBwZWFyIGFzIGEgYnV0dG9uIG9yIGh5cGVybGluay4gVXNlIHRoaXMgY29tcG9uZW50IHRvIGVuYWJsZSB1c2VycyB0byBzZWxlY3QgZnJvbSBtdWx0aXBsZSBvcHRpb25zIGluIGEgY29tcGFjdCBsaXN0LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2Ryb3Bkb3duIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBEcm9wZG93biA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlQ29tcG91bmRSZWFjdENvbXBvbmVudCgnRHJvcGRvd24nLCB7XG4gICAgY29tcG91bmRDb21wb25lbnRQcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgYERyb3Bkb3duLkJ1dHRvbkl0ZW1gIGNvbXBvbmVudCByZXByZXNlbnRzIGEgc2luZ2xlIG9wdGlvbiB3aXRoaW4gYSBgRHJvcGRvd25gIG1lbnUuIFVzZSB0aGlzIGNvbXBvbmVudCBhcyBhIGNoaWxkIG9mIHRoZSBgRHJvcGRvd25gIGNvbXBvbmVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogKipMaW5rczoqKlxuICAgICAgICAgKlxuICAgICAgICAgKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2Ryb3Bkb3duIERvY3N9XG4gICAgICAgICAqL1xuICAgICAgICBCdXR0b25JdGVtOiBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdEcm9wZG93bkJ1dHRvbkl0ZW0nLCB7XG4gICAgICAgICAgICBmcmFnbWVudFByb3BzOiBbJ292ZXJsYXknXSxcbiAgICAgICAgfSksXG4gICAgfSxcbn0pO1xuLyoqXG4gKiBUaGUgUGFuZWwgY29tcG9uZW50IHJlbmRlcnMgYSBwYW5lbCBvdmVybGF5IG9uIHRoZSByaWdodCBzaWRlIG9mIHRoZSBwYWdlIGFuZCBjb250YWlucyBvdGhlciBjb21wb25lbnRzLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3BhbmVsIERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9vdmVybGF5LWV4YW1wbGUgT3ZlcmxheSBFeGFtcGxlfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL0h1YlNwb3QvdWktZXh0ZW5zaW9ucy1leGFtcGxlcy90cmVlL21haW4vZGVzaWduLXBhdHRlcm5zI3BhbmVsIERlc2lnbiBQYXR0ZXJuIEV4YW1wbGVzfVxuICovXG5leHBvcnQgY29uc3QgUGFuZWwgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdQYW5lbCcpO1xuLyoqXG4gKiBUaGUgYFBhbmVsRm9vdGVyYCBpcyBhIHN0aWNreSBmb290ZXIgY29tcG9uZW50IGRpc3BsYXllZCBhdCB0aGUgYm90dG9tIG9mIGEgYFBhbmVsYCBjb21wb25lbnQuIFVzZSB0aGlzIGNvbXBvbmVudCB0byBkaXNwbGF5IGFjdGlvbnMgb3Igb3RoZXIgY29udGVudCB0aGF0IHNob3VsZCBiZSB2aXNpYmxlIGF0IGFsbCB0aW1lcy4gSW5jbHVkZSBvbmx5IG9uZSBgUGFuZWxGb290ZXJgIGNvbXBvbmVudCBwZXIgYFBhbmVsYC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9wYW5lbC1mb290ZXIgRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9IdWJTcG90L3VpLWV4dGVuc2lvbnMtZXhhbXBsZXMvdHJlZS9tYWluL292ZXJsYXktZXhhbXBsZSBPdmVybGF5IEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBQYW5lbEZvb3RlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1BhbmVsRm9vdGVyJyk7XG4vKipcbiAqIFRoZSBgUGFuZWxCb2R5YCBjb21wb25lbnQgaXMgYSBjb250YWluZXIgdGhhdCB3cmFwcyB0aGUgcGFuZWwncyBjb250ZW50IGFuZCBtYWtlcyBpdCBzY3JvbGxhYmxlLiBJbmNsdWRlIG9ubHkgb25lIGBQYW5lbEJvZHlgIGNvbXBvbmVudCBwZXIgYFBhbmVsYC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9wYW5lbC1mb290ZXIgRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9IdWJTcG90L3VpLWV4dGVuc2lvbnMtZXhhbXBsZXMvdHJlZS9tYWluL292ZXJsYXktZXhhbXBsZSBPdmVybGF5IEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBQYW5lbEJvZHkgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdQYW5lbEJvZHknKTtcbi8qKlxuICogVGhlIGBQYW5lbFNlY3Rpb25gIGNvbXBvbmVudCBpcyBhIGNvbnRhaW5lciB0aGF0IGFkZHMgcGFkZGluZyBhbmQgYm90dG9tIG1hcmdpbiB0byBwcm92aWRlIHNwYWNpbmcgYmV0d2VlbiBjb250ZW50LiBVc2UgdGhlIGBQYW5lbFNlY3Rpb25gIGNvbXBvbmVudCB0byBzZXBhcmF0ZSBjb250ZW50IHdpdGhpbiBhIGBQYW5lbEJvZHlgLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3BhbmVsLWZvb3RlciBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL0h1YlNwb3QvdWktZXh0ZW5zaW9ucy1leGFtcGxlcy90cmVlL21haW4vb3ZlcmxheS1leGFtcGxlIE92ZXJsYXkgRXhhbXBsZX1cbiAqL1xuZXhwb3J0IGNvbnN0IFBhbmVsU2VjdGlvbiA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1BhbmVsU2VjdGlvbicpO1xuLyoqXG4gKiBUaGUgYFN0ZXBwZXJJbnB1dGAgY29tcG9uZW50IHJlbmRlcnMgYSBudW1iZXIgaW5wdXQgZmllbGQgdGhhdCBjYW4gYmUgaW5jcmVhc2VkIG9yIGRlY3JlYXNlZCBieSBhIHNldCBudW1iZXIuIENvbW1vbmx5IHVzZWQgd2l0aGluIHRoZSBgRm9ybWAgY29tcG9uZW50LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3N0ZXBwZXItaW5wdXQgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFN0ZXBwZXJJbnB1dCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1N0ZXBwZXJJbnB1dCcpO1xuLyoqXG4gKiBUaGUgTW9kYWwgY29tcG9uZW50IHJlbmRlcnMgYSBwb3AtdXAgb3ZlcmxheSB0aGF0IGNhbiBjb250YWluIG90aGVyIGNvbXBvbmVudHMuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvbW9kYWwgRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9IdWJTcG90L3VpLWV4dGVuc2lvbnMtZXhhbXBsZXMvdHJlZS9tYWluL292ZXJsYXktZXhhbXBsZSBPdmVybGF5IEV4YW1wbGV9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9kZXNpZ24tcGF0dGVybnMjbW9kYWwgRGVzaWduIFBhdHRlcm4gRXhhbXBsZXN9XG4gKi9cbmV4cG9ydCBjb25zdCBNb2RhbCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ01vZGFsJyk7XG4vKipcbiAqIFRoZSBgTW9kYWxCb2R5YCBjb21wb25lbnQgY29udGFpbnMgdGhlIG1haW4gY29udGVudCBvZiB0aGUgbW9kYWwuIE9uZSBgTW9kYWxCb2R5YCBpcyByZXF1aXJlZCBwZXIgYE1vZGFsYC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9tb2RhbCBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL0h1YlNwb3QvdWktZXh0ZW5zaW9ucy1leGFtcGxlcy90cmVlL21haW4vb3ZlcmxheS1leGFtcGxlIE92ZXJsYXkgRXhhbXBsZX1cbiAqL1xuZXhwb3J0IGNvbnN0IE1vZGFsQm9keSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ01vZGFsQm9keScpO1xuLyoqXG4gKiBUaGUgYE1vZGFsRm9vdGVyYCBjb21wb25lbnQgaXMgYW4gb3B0aW9uYWwgY29tcG9uZW50IHRvIGZvcm1hdCB0aGUgZm9vdGVyIHNlY3Rpb24gb2YgdGhlIG1vZGFsLiBVc2Ugb25lIGBNb2RhbEZvb3RlcmAgcGVyIGBNb2RhbGAuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvbW9kYWwgRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9IdWJTcG90L3VpLWV4dGVuc2lvbnMtZXhhbXBsZXMvdHJlZS9tYWluL292ZXJsYXktZXhhbXBsZSBPdmVybGF5IEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBNb2RhbEZvb3RlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ01vZGFsRm9vdGVyJyk7XG4vKipcbiAqIFVzZSB0aGUgYEljb25gIGNvbXBvbmVudCB0byByZW5kZXIgYSB2aXN1YWwgaWNvbiB3aXRoaW4gb3RoZXIgY29tcG9uZW50cy4gSXQgY2FuIGdlbmVyYWxseSBiZSB1c2VkIGluc2lkZSBtb3N0IGNvbXBvbmVudHMsIGV4Y2x1ZGluZyBvbmVzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBjaGlsZCBjb21wb25lbnRzLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2ljb24gRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IEljb24gPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdJY29uJyk7XG4vKipcbiAqIFRoZSBgU3RhdHVzVGFnYCBjb21wb25lbnQgcmVuZGVycyBhIHZpc3VhbCBpbmRpY2F0b3IgdG8gZGlzcGxheSB0aGUgY3VycmVudCBzdGF0dXMgb2YgYW4gaXRlbS4gU3RhdHVzIHRhZ3MgY2FuIGJlIHN0YXRpYyBvciBjbGlja2FibGUuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvc3RhdHVzLXRhZyBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9zdGF0dXMtdGFnI3ZhcmlhbnRzIFZhcmlhbnRzfVxuICovXG5leHBvcnQgY29uc3QgU3RhdHVzVGFnID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU3RhdHVzVGFnJyk7XG4vKipcbiAqIFRoZSBgTG9hZGluZ0J1dHRvbmAgY29tcG9uZW50IHJlbmRlcnMgYSBidXR0b24gd2l0aCBsb2FkaW5nIHN0YXRlIG9wdGlvbnMuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvbG9hZGluZy1idXR0b24gRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IExvYWRpbmdCdXR0b24gPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdMb2FkaW5nQnV0dG9uJywge1xuICAgIGZyYWdtZW50UHJvcHM6IFsnb3ZlcmxheSddLFxufSk7XG4vKipcbiAqIFRoZSBgQmFyQ2hhcnRgIGNvbXBvbmVudCByZW5kZXJzIGEgYmFyIGNoYXJ0IGZvciB2aXN1YWxpemluZyBkYXRhLiBUaGlzIHR5cGUgb2YgY2hhcnQgaXMgYmVzdCBzdWl0ZWQgZm9yIGNvbXBhcmluZyBjYXRlZ29yaWNhbCBkYXRhLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2Jhci1jaGFydCBCYXJDaGFydCBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9jaGFydHMgQ2hhcnRzIERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9jaGFydHMtZXhhbXBsZSBDaGFydHMgRXhhbXBsZX1cbiAqL1xuZXhwb3J0IGNvbnN0IEJhckNoYXJ0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQmFyQ2hhcnQnKTtcbi8qKlxuICogVGhlIGBMaW5lQ2hhcnRgIGNvbXBvbmVudCByZW5kZXJzIGEgbGluZSBjaGFydCBmb3IgdmlzdWFsaXppbmcgZGF0YS4gVGhpcyB0eXBlIG9mIGNoYXJ0IGlzIGJlc3Qgc3VpdGVkIGZvciB0aW1lIHNlcmllcyBwbG90cyBvciB0cmVuZCBkYXRhLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2xpbmUtY2hhcnQgTGluZUNoYXJ0IERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2NoYXJ0cyBDaGFydHMgRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9IdWJTcG90L3VpLWV4dGVuc2lvbnMtZXhhbXBsZXMvdHJlZS9tYWluL2NoYXJ0cy1leGFtcGxlIENoYXJ0cyBFeGFtcGxlfVxuICovXG5leHBvcnQgY29uc3QgTGluZUNoYXJ0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnTGluZUNoYXJ0Jyk7XG4vKipcbiAqIFRoZSBgU2NvcmVDaXJjbGVgIGNvbXBvbmVudCBkaXNwbGF5cyBhIHNjb3JlIHZhbHVlICgwLTEwMCkgYXMgYSBjaXJjdWxhciBwcm9ncmVzcyBpbmRpY2F0b3Igd2l0aCBjb2xvci1jb2RlZCBiYW5kcy5cbiAqIFNjb3JlcyBhcmUgY29sb3ItY29kZWQ6IDAtMzIgKGFsZXJ0L3JlZCksIDMzLTY1ICh3YXJuaW5nL3llbGxvdyksIDY2LTEwMCAoc3VjY2Vzcy9ncmVlbikuXG4gKiBAZXhhbXBsZVxuICogYGBgdHN4XG4gKiAgIDxTY29yZUNpcmNsZSBzY29yZT17NzV9IC8+XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNvbnN0IFNjb3JlQ2lyY2xlID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU2NvcmVDaXJjbGUnKTtcbi8qKlxuICogYFRhYnNgIGFsbG93IHlvdSB0byBncm91cCByZWxhdGVkIGNvbnRlbnQgaW4gYSBjb21wYWN0IHNwYWNlLCBhbGxvd2luZyB1c2VycyB0byBzd2l0Y2ggYmV0d2VlbiB2aWV3cyB3aXRob3V0IGxlYXZpbmcgdGhlIHBhZ2UuXG4gKiBAZXhhbXBsZVxuICogYGBgdHN4XG4gKiA8VGFicyBkZWZhdWx0U2VsZWN0ZWQ9XCIxXCI+XG4gKiAgIDxUYWIgdGFiSWQ9XCIxXCI+Rmlyc3QgdGFiIGNvbnRlbnQ8L1RhYj5cbiAqICAgPFRhYiB0YWJJZD1cIjJcIj5TZWNvbmQgdGFiIGNvbnRlbnQ8L1RhYj5cbiAqIDwvVGFicz5cbiAqIGBgYFxuICpcbiAqICoqTGlua3M6KipcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdGFicyBEb2N1bWVudGF0aW9ufVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2h1YnNwb3RkZXYvdWllLXRhYmJlZC1wcm9kdWN0LWNhcm91c2VsIFRhYnMgRXhhbXBsZX1cbiAqL1xuZXhwb3J0IGNvbnN0IFRhYnMgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUYWJzJyk7XG4vKipcbiAqIEVhY2ggYFRhYmAgcmVwcmVzZW50cyBhIHNpbmdsZSB0YWIgKG9yIFwidmlld1wiKSB3aXRoaW4gdGhlIHBhcmVudCBgVGFic2AgY29tcG9uZW50LlxuICogQGV4YW1wbGVcbiAqIGBgYHRzeFxuICogPFRhYnMgZGVmYXVsdFNlbGVjdGVkPVwiMVwiPlxuICogICA8VGFiIHRhYklkPVwiMVwiPkZpcnN0IHRhYiBjb250ZW50PC9UYWI+XG4gKiAgIDxUYWIgdGFiSWQ9XCIyXCI+U2Vjb25kIHRhYiBjb250ZW50PC9UYWI+XG4gKiA8L1RhYnM+XG4gKiBgYGBcbiAqXG4gKiAqKkxpbmtzOioqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3RhYnMgRG9jdW1lbnRhdGlvbn1cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9odWJzcG90ZGV2L3VpZS10YWJiZWQtcHJvZHVjdC1jYXJvdXNlbCBUYWJzIEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBUYWIgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUYWInKTtcbi8qKlxuICogVGhlIGBJbGx1c3RyYXRpb25gIGNvbXBvbmVudCByZW5kZXJzIGFuIGlsbHVzdHJhdGlvbi5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9pbGx1c3RyYXRpb24gSWxsdXN0cmF0aW9uIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBJbGx1c3RyYXRpb24gPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdJbGx1c3RyYXRpb24nKTtcbi8qKlxuICogVGhlIGBUb29sdGlwYCBjb21wb25lbnQgcmVuZGVycyBhIHRvb2x0aXAgZm9yIGEgY29tcG9uZW50LlxuICpcbiAqICoqTGlua3M6KipcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdG9vbHRpcCBEb2N1bWVudGF0aW9ufVxuICovXG5leHBvcnQgY29uc3QgVG9vbHRpcCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1Rvb2x0aXAnKTtcbi8qKlxuICogVGhlIGBTZWFyY2hJbnB1dGAgY29tcG9uZW50IHJlbmRlcnMgYSBzZWFyY2ggaW5wdXQgZmllbGQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvc2VhcmNoLWlucHV0IFNlYXJjaElucHV0IERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBTZWFyY2hJbnB1dCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1NlYXJjaElucHV0Jyk7XG4vKipcbiAqIFRoZSBgVGltZUlucHV0YCBjb21wb25lbnQgcmVuZGVycyBhbiBpbnB1dCBmaWVsZCB3aGVyZSBhIHVzZXIgY2FuIHNlbGVjdCBhIHRpbWUuIENvbW1vbmx5IHVzZWQgd2l0aGluIHRoZSBgRm9ybWAgY29tcG9uZW50LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3RpbWUtaW5wdXQgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFRpbWVJbnB1dCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RpbWVJbnB1dCcpO1xuLyoqXG4gKiBUaGUgYEN1cnJlbmN5SW5wdXRgIGNvbXBvbmVudCByZW5kZXJzIGEgY3VycmVuY3kgaW5wdXQgZmllbGQgd2l0aCBwcm9wZXIgZm9ybWF0dGluZyxcbiAqIGN1cnJlbmN5IHN5bWJvbHMsIGFuZCBsb2NhbGUtc3BlY2lmaWMgZGlzcGxheSBwYXR0ZXJucy4gQ29tbW9ubHkgdXNlZCB3aXRoaW4gdGhlIGBGb3JtYCBjb21wb25lbnQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvY3VycmVuY3ktaW5wdXQgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IEN1cnJlbmN5SW5wdXQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdDdXJyZW5jeUlucHV0Jyk7XG4vKipcbiAqIFRoZSBgSW5saW5lYCBjb21wb25lbnQgc3ByZWFkcyBhbGlnbnMgaXRzIGNoaWxkcmVuIGhvcml6b250YWxseSAoYWxvbmcgdGhlIHgtYXhpcykuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvaW5saW5lIERvY3N9XG4gKi8gZXhwb3J0IGNvbnN0IElubGluZSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0lubGluZScpO1xuLyoqXG4gKiBUaGUgYEF1dG9HcmlkYCBjb21wb25lbnQgcmVuZGVycyBhIHJlc3BvbnNpdmUgZ3JpZCBsYXlvdXQgdGhhdCBhdXRvbWF0aWNhbGx5IGFkanVzdHMgdGhlIG51bWJlciBvZiBjb2x1bW5zIGJhc2VkIG9uIGF2YWlsYWJsZSBzcGFjZS4gVXNlIHRoaXMgY29tcG9uZW50IHRvIGNyZWF0ZSBmbGV4aWJsZSBncmlkIGxheW91dHMgZm9yIGNhcmRzLCB0aWxlcywgb3Igb3RoZXIgY29udGVudC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9zaW1wbGUtZ3JpZCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgQXV0b0dyaWQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdBdXRvR3JpZCcpO1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIENSTSBDT01QT05FTlRTXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZXhwb3J0IGNvbnN0IENybVByb3BlcnR5TGlzdCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NybVByb3BlcnR5TGlzdCcpO1xuZXhwb3J0IGNvbnN0IENybUFzc29jaWF0aW9uVGFibGUgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdDcm1Bc3NvY2lhdGlvblRhYmxlJyk7XG5leHBvcnQgY29uc3QgQ3JtRGF0YUhpZ2hsaWdodCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NybURhdGFIaWdobGlnaHQnKTtcbmV4cG9ydCBjb25zdCBDcm1SZXBvcnQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdDcm1SZXBvcnQnKTtcbmV4cG9ydCBjb25zdCBDcm1Bc3NvY2lhdGlvblBpdm90ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQ3JtQXNzb2NpYXRpb25QaXZvdCcpO1xuZXhwb3J0IGNvbnN0IENybUFzc29jaWF0aW9uUHJvcGVydHlMaXN0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQ3JtQXNzb2NpYXRpb25Qcm9wZXJ0eUxpc3QnKTtcbmV4cG9ydCBjb25zdCBDcm1Bc3NvY2lhdGlvblN0YWdlVHJhY2tlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NybUFzc29jaWF0aW9uU3RhZ2VUcmFja2VyJyk7XG5leHBvcnQgY29uc3QgQ3JtU2ltcGxlRGVhZGxpbmUgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdDcm1TaW1wbGVEZWFkbGluZScpO1xuZXhwb3J0IGNvbnN0IENybVN0YWdlVHJhY2tlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NybVN0YWdlVHJhY2tlcicpO1xuZXhwb3J0IGNvbnN0IENybVN0YXRpc3RpY3MgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdDcm1TdGF0aXN0aWNzJyk7XG5leHBvcnQgY29uc3QgQ3JtQWN0aW9uQnV0dG9uID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQ3JtQWN0aW9uQnV0dG9uJyk7XG5leHBvcnQgY29uc3QgQ3JtQWN0aW9uTGluayA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NybUFjdGlvbkxpbmsnKTtcbmV4cG9ydCBjb25zdCBDcm1DYXJkQWN0aW9ucyA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NybUNhcmRBY3Rpb25zJyk7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQVBQIEhPTUUgQ09NUE9ORU5UU1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8qKlxuICogVGhlIGBIZWFkZXJBY3Rpb25zYCBjb21wb25lbnQgcmVuZGVycyBhIGNvbnRhaW5lciBmb3IgYWN0aW9uIGJ1dHRvbnMgaW4gdGhlIGFwcCBob21lIGhlYWRlci4gSXQgYWNjZXB0cyBgUHJpbWFyeUhlYWRlckFjdGlvbkJ1dHRvbmAgYW5kIGBTZWNvbmRhcnlIZWFkZXJBY3Rpb25CdXR0b25gIGFzIGNoaWxkcmVuLlxuICpcbiAqL1xuZXhwb3J0IGNvbnN0IEhlYWRlckFjdGlvbnMgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdIZWFkZXJBY3Rpb25zJyk7XG4vKipcbiAqIFRoZSBgUHJpbWFyeUhlYWRlckFjdGlvbkJ1dHRvbmAgY29tcG9uZW50IHJlbmRlcnMgYSBwcmltYXJ5IGFjdGlvbiBidXR0b24gaW4gdGhlIGFwcCBob21lIGhlYWRlci4gVGhpcyBidXR0b24gaXMgc3R5bGVkIGFzIHRoZSBtYWluIGNhbGwtdG8tYWN0aW9uIGFuZCBvbmx5IG9uZSBzaG91bGQgYmUgdXNlZCBwZXIgYEhlYWRlckFjdGlvbnNgIGNvbnRhaW5lci5cbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBQcmltYXJ5SGVhZGVyQWN0aW9uQnV0dG9uID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnUHJpbWFyeUhlYWRlckFjdGlvbkJ1dHRvbicsIHtcbiAgICBmcmFnbWVudFByb3BzOiBbJ292ZXJsYXknXSxcbn0pO1xuLyoqXG4gKiBUaGUgYFNlY29uZGFyeUhlYWRlckFjdGlvbkJ1dHRvbmAgY29tcG9uZW50IHJlbmRlcnMgYSBzZWNvbmRhcnkgYWN0aW9uIGJ1dHRvbiBpbiB0aGUgYXBwIGhvbWUgaGVhZGVyLiBNdWx0aXBsZSBzZWNvbmRhcnkgYWN0aW9ucyBjYW4gYmUgdXNlZCBhbmQgdGhleSB3aWxsIGJlIGdyb3VwZWQgYXBwcm9wcmlhdGVseSBpbiB0aGUgaGVhZGVyLlxuICpcbiAqL1xuZXhwb3J0IGNvbnN0IFNlY29uZGFyeUhlYWRlckFjdGlvbkJ1dHRvbiA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1NlY29uZGFyeUhlYWRlckFjdGlvbkJ1dHRvbicsIHtcbiAgICBmcmFnbWVudFByb3BzOiBbJ292ZXJsYXknXSxcbn0pO1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEFQUCBQQUdFIENPTVBPTkVOVFNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5leHBvcnQgY29uc3QgUGFnZUxpbmsgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdQYWdlTGluaycpO1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEVYUEVSSU1FTlRBTCBDT01QT05FTlRTXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLyoqXG4gKiBAZXhwZXJpbWVudGFsIFRoaXMgY29tcG9uZW50IGlzIGV4cGVyaW1lbnRhbC4gQXZvaWQgdXNpbmcgaXQgaW4gcHJvZHVjdGlvbiBkdWUgdG8gcG90ZW50aWFsIGJyZWFraW5nIGNoYW5nZXMuIFlvdXIgZmVlZGJhY2sgaXMgdmFsdWFibGUgZm9yIGltcHJvdmVtZW50cy4gU3RheSB0dW5lZCBmb3IgdXBkYXRlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IElmcmFtZSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0lmcmFtZScpO1xuLyoqXG4gKiBAZXhwZXJpbWVudGFsIFRoaXMgY29tcG9uZW50IGlzIGV4cGVyaW1lbnRhbC4gQXZvaWQgdXNpbmcgaXQgaW4gcHJvZHVjdGlvbiBkdWUgdG8gcG90ZW50aWFsIGJyZWFraW5nIGNoYW5nZXMuIFlvdXIgZmVlZGJhY2sgaXMgdmFsdWFibGUgZm9yIGltcHJvdmVtZW50cy4gU3RheSB0dW5lZCBmb3IgdXBkYXRlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IE1lZGlhT2JqZWN0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnTWVkaWFPYmplY3QnLCB7XG4gICAgZnJhZ21lbnRQcm9wczogWydpdGVtUmlnaHQnLCAnaXRlbUxlZnQnXSxcbn0pO1xuLyoqXG4gKiBAZXhwZXJpbWVudGFsIFRoaXMgY29tcG9uZW50IGlzIGV4cGVyaW1lbnRhbC4gQXZvaWQgdXNpbmcgaXQgaW4gcHJvZHVjdGlvbiBkdWUgdG8gcG90ZW50aWFsIGJyZWFraW5nIGNoYW5nZXMuIFlvdXIgZmVlZGJhY2sgaXMgdmFsdWFibGUgZm9yIGltcHJvdmVtZW50cy4gU3RheSB0dW5lZCBmb3IgdXBkYXRlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IFN0YWNrMiA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1N0YWNrMicpO1xuLyoqXG4gKiBAZXhwZXJpbWVudGFsIFRoaXMgY29tcG9uZW50IGlzIGV4cGVyaW1lbnRhbC4gQXZvaWQgdXNpbmcgaXQgaW4gcHJvZHVjdGlvbiBkdWUgdG8gcG90ZW50aWFsIGJyZWFraW5nIGNoYW5nZXMuIFlvdXIgZmVlZGJhY2sgaXMgdmFsdWFibGUgZm9yIGltcHJvdmVtZW50cy4gU3RheSB0dW5lZCBmb3IgdXBkYXRlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IENlbnRlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NlbnRlcicpO1xuLyoqXG4gKiBAZXhwZXJpbWVudGFsIFRoaXMgY29tcG9uZW50IGlzIGV4cGVyaW1lbnRhbC4gQXZvaWQgdXNpbmcgaXQgaW4gcHJvZHVjdGlvbiBkdWUgdG8gcG90ZW50aWFsIGJyZWFraW5nIGNoYW5nZXMuIFlvdXIgZmVlZGJhY2sgaXMgdmFsdWFibGUgZm9yIGltcHJvdmVtZW50cy4gU3RheSB0dW5lZCBmb3IgdXBkYXRlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IEdyaWQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdHcmlkJyk7XG4vKipcbiAqIEBleHBlcmltZW50YWwgVGhpcyBjb21wb25lbnQgaXMgZXhwZXJpbWVudGFsLiBBdm9pZCB1c2luZyBpdCBpbiBwcm9kdWN0aW9uIGR1ZSB0byBwb3RlbnRpYWwgYnJlYWtpbmcgY2hhbmdlcy4gWW91ciBmZWVkYmFjayBpcyB2YWx1YWJsZSBmb3IgaW1wcm92ZW1lbnRzLiBTdGF5IHR1bmVkIGZvciB1cGRhdGVzLlxuICovXG5leHBvcnQgY29uc3QgR3JpZEl0ZW0gPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdHcmlkSXRlbScpO1xuLyoqXG4gKiBAZXhwZXJpbWVudGFsIFRoaXMgY29tcG9uZW50IGlzIGV4cGVyaW1lbnRhbC4gQXZvaWQgdXNpbmcgaXQgaW4gcHJvZHVjdGlvbiBkdWUgdG8gcG90ZW50aWFsIGJyZWFraW5nIGNoYW5nZXMuIFlvdXIgZmVlZGJhY2sgaXMgdmFsdWFibGUgZm9yIGltcHJvdmVtZW50cy4gU3RheSB0dW5lZCBmb3IgdXBkYXRlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IFNldHRpbmdzVmlldyA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1NldHRpbmdzVmlldycpO1xuLyoqXG4gKiBUaGUgYEV4cGFuZGFibGVUZXh0YCBjb21wb25lbnQgcmVuZGVycyBhIHRleHQgdGhhdCBjYW4gYmUgZXhwYW5kZWQgb3IgY29sbGFwc2VkIGJhc2VkIG9uIGEgbWF4aW11bSBoZWlnaHQuXG4gKlxuICogQGV4cGVyaW1lbnRhbCBUaGlzIGNvbXBvbmVudCBpcyBleHBlcmltZW50YWwuIEF2b2lkIHVzaW5nIGl0IGluIHByb2R1Y3Rpb24gZHVlIHRvIHBvdGVudGlhbCBicmVha2luZyBjaGFuZ2VzLiBZb3VyIGZlZWRiYWNrIGlzIHZhbHVhYmxlIGZvciBpbXByb3ZlbWVudHMuIFN0YXkgdHVuZWQgZm9yIHVwZGF0ZXMuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvZXhwYW5kYWJsZS10ZXh0IEV4cGFuZGFibGVUZXh0IERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBFeHBhbmRhYmxlVGV4dCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0V4cGFuZGFibGVUZXh0Jyk7XG4vKipcbiAqIFRoZSBgUG9wb3ZlcmAgY29tcG9uZW50IHJlbmRlcnMgYSBwb3BvdmVyIG92ZXJsYXkgdGhhdCBjYW4gY29udGFpbiBvdGhlciBjb21wb25lbnRzLlxuICpcbiAqIEBleHBlcmltZW50YWwgVGhpcyBjb21wb25lbnQgaXMgZXhwZXJpbWVudGFsLiBBdm9pZCB1c2luZyBpdCBpbiBwcm9kdWN0aW9uIGR1ZSB0byBwb3RlbnRpYWwgYnJlYWtpbmcgY2hhbmdlcy4gWW91ciBmZWVkYmFjayBpcyB2YWx1YWJsZSBmb3IgaW1wcm92ZW1lbnRzLiBTdGF5IHR1bmVkIGZvciB1cGRhdGVzLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3BvcG92ZXIgUG9wb3ZlciBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgUG9wb3ZlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1BvcG92ZXInKTtcbi8qKlxuICogQGV4cGVyaW1lbnRhbCBUaGlzIGNvbXBvbmVudCBpcyBleHBlcmltZW50YWwuIEF2b2lkIHVzaW5nIGl0IGluIHByb2R1Y3Rpb24gZHVlIHRvIHBvdGVudGlhbCBicmVha2luZyBjaGFuZ2VzLiBZb3VyIGZlZWRiYWNrIGlzIHZhbHVhYmxlIGZvciBpbXByb3ZlbWVudHMuIFN0YXkgdHVuZWQgZm9yIHVwZGF0ZXMuXG4gKi9cbmV4cG9ydCBjb25zdCBGaWxlSW5wdXQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdGaWxlSW5wdXQnKTtcbiIsImltcG9ydCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5jb25zdCBNb2Nrc0NvbnRleHQgPSBjcmVhdGVDb250ZXh0KG51bGwpO1xuLyoqXG4gKiBDcmVhdGVzIGEgbW9jay1hd2FyZSBob29rIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gbW9jayB0aGUgb3JpZ2luYWwgaG9vayBmdW5jdGlvbi5cbiAqIFRoZSBtb2NrLWF3YXJlIGhvb2sgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIG1vY2tlZCBob29rIGZ1bmN0aW9uIGlmIGEgbW9jayBpcyBmb3VuZCwgb3RoZXJ3aXNlIGl0IHdpbGwgcmV0dXJuIHRoZSBvcmlnaW5hbCBob29rIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSBob29rTmFtZSBUaGUgbmFtZSBvZiB0aGUgaG9vayB0byBtb2NrIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIGtleSBpbiB0aGUgTW9ja3MgaW50ZXJmYWNlXG4gKiBAcGFyYW0gb3JpZ2luYWxIb29rRnVuY3Rpb24gVGhlIG9yaWdpbmFsIGhvb2sgZnVuY3Rpb24gdG8gY2FsbCBpZiBubyBtb2NrIGlzIGZvdW5kXG4gKiBAcmV0dXJucyBUaGUgbW9ja2VkIGhvb2sgZnVuY3Rpb24gb3IgdGhlIG9yaWdpbmFsIGhvb2sgZnVuY3Rpb24gaWYgbm8gbW9jayBpcyBmb3VuZFxuICovXG5leHBvcnQgY29uc3QgY3JlYXRlTW9ja0F3YXJlSG9vayA9IChob29rTmFtZSwgb3JpZ2luYWxIb29rRnVuY3Rpb24pID0+IHtcbiAgICBjb25zdCB1c2VXcmFwcGVyID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgY29uc3QgbW9ja3MgPSB1c2VNb2Nrc0NvbnRleHQoKTtcbiAgICAgICAgaWYgKCFtb2Nrcykge1xuICAgICAgICAgICAgLy8gSWYgbm8gbW9ja3MgYXJlIHByb3ZpZGVkLCBjYWxsIHRoZSBvcmlnaW5hbCBob29rIGZ1bmN0aW9uXG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxIb29rRnVuY3Rpb24oLi4uYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2hlbiBhIG1vY2sgaXMgcHJvdmlkZWQgYnkgdGhlIHRlc3RpbmcgdXRpbGl0aWVzICh2aWEgPE1vY2tzQ29udGV4dFByb3ZpZGVyPiksIHJldHVybiB0aGUgbW9ja2VkIGhvb2sgZnVuY3Rpb25cbiAgICAgICAgY29uc3QgbW9ja0hvb2sgPSBtb2Nrc1tob29rTmFtZV07XG4gICAgICAgIGlmICghbW9ja0hvb2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSWxsZWdhbCBTdGF0ZTogTW9jayBmb3IgaG9vayAke2hvb2tOYW1lfSBub3QgZm91bmQuYCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2FsbCB0aGUgbW9ja2VkIGhvb2sgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBhcmd1bWVudHMgYXMgdGhlIG9yaWdpbmFsIGhvb2sgZnVuY3Rpb24gYW5kIHJldHVybiB0aGUgcmVzdWx0XG4gICAgICAgIHJldHVybiBtb2NrSG9vayguLi5hcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiB1c2VXcmFwcGVyO1xufTtcbi8qKlxuICogQSBob29rIHRoYXQgcHJvdmlkZXMgYWNjZXNzIHRvIHRoZSBNb2NrcyBjb250ZXh0LlxuICogUmV0dXJucyB0aGUgbW9ja3Mgb2JqZWN0IGlmIGluc2lkZSBhIE1vY2tzQ29udGV4dFByb3ZpZGVyLCBvdGhlcndpc2UgcmV0dXJucyBudWxsLlxuICpcbiAqIEByZXR1cm5zIFRoZSBtb2NrcyBvYmplY3Qgb3IgbnVsbCBpZiBub3QgaW4gYSB0ZXN0IGVudmlyb25tZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlTW9ja3NDb250ZXh0KCkge1xuICAgIHJldHVybiB1c2VDb250ZXh0KE1vY2tzQ29udGV4dCk7XG59XG4vKipcbiAqIEEgUmVhY3QgY29tcG9uZW50IHRoYXQgcHJvdmlkZXMgdGhlIE1vY2tzIGNvbnRleHQgdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIG1vY2tzIHRvIHRoZSBtb2NrLWF3YXJlIGhvb2sgZnVuY3Rpb25zLlxuICpcbiAqIEBwYXJhbSBjaGlsZHJlbiBUaGUgY2hpbGRyZW4gdG8gcmVuZGVyLlxuICogQHJldHVybnMgVGhlIGNoaWxkcmVuIHdyYXBwZWQgaW4gdGhlIE1vY2tzIGNvbnRleHQgcHJvdmlkZXIuXG4gKi9cbmV4cG9ydCBjb25zdCBNb2Nrc0NvbnRleHRQcm92aWRlciA9IE1vY2tzQ29udGV4dC5Qcm92aWRlcjtcbiIsIi8qKlxuICogRGF0YVRhYmxlIOKAlCBSZXVzYWJsZSBmaWx0ZXJhYmxlLCBzb3J0YWJsZSwgcGFnaW5hdGVkIHRhYmxlIGNvbXBvc2l0aW9uLlxuICpcbiAqIFN1cHBvcnRzIGNsaWVudC1zaWRlIGFuZCBzZXJ2ZXItc2lkZSBtb2RlcywgdGhyZWUgZmlsdGVyIHR5cGVzXG4gKiAoc2VsZWN0LCBtdWx0aXNlbGVjdCwgZGF0ZVJhbmdlKSwgcm93IGdyb3VwaW5nLCBhbmQgZm9vdGVyIHJvd3MuXG4gKlxuICog4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4gKiBDTElFTlQtU0lERSAoZGVmYXVsdCkg4oCUIGFsbCBmaWx0ZXJpbmcsIHNvcnRpbmcsIHBhZ2luYXRpb24gaW4tbWVtb3J5OlxuICog4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4gKlxuICogICA8RGF0YVRhYmxlXG4gKiAgICAgZGF0YT17cmVjb3Jkc31cbiAqICAgICBjb2x1bW5zPXtDT0xVTU5TfVxuICogICAgIHJlbmRlclJvdz17KHJvdykgPT4gPFRhYmxlUm93IGtleT17cm93LmlkfT4uLi48L1RhYmxlUm93Pn1cbiAqICAgICBzZWFyY2hGaWVsZHM9e1tcIm5hbWVcIiwgXCJlbWFpbFwiXX1cbiAqICAgICBmaWx0ZXJzPXtGSUxURVJfQ09ORklHfVxuICogICAgIHBhZ2VTaXplPXsxMH1cbiAqICAgICBkZWZhdWx0U29ydD17eyBkYXRlOiBcImRlc2NlbmRpbmdcIiB9fVxuICogICAgIGZvb3Rlcj17KGZpbHRlcmVkRGF0YSkgPT4gPFRhYmxlUm93Pi4uLjwvVGFibGVSb3c+fVxuICogICAvPlxuICpcbiAqIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuICogU0VSVkVSLVNJREUg4oCUIHBhcmVudCBvd25zIHN0YXRlLCBjb21wb25lbnQgcmVuZGVycyBVSSArIGNhbGxzIGJhY2s6XG4gKiDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbiAqXG4gKiAgIDxEYXRhVGFibGVcbiAqICAgICBzZXJ2ZXJTaWRlPXt0cnVlfVxuICogICAgIGRhdGE9e2N1cnJlbnRQYWdlUm93c31cbiAqICAgICB0b3RhbENvdW50PXsyNDd9XG4gKiAgICAgY29sdW1ucz17Q09MVU1OU31cbiAqICAgICByZW5kZXJSb3c9eyhyb3cpID0+IDxUYWJsZVJvdyBrZXk9e3Jvdy5pZH0+Li4uPC9UYWJsZVJvdz59XG4gKiAgICAgc2VhcmNoRmllbGRzPXtbXCJuYW1lXCIsIFwiZW1haWxcIl19XG4gKiAgICAgZmlsdGVycz17RklMVEVSX0NPTkZJR31cbiAqICAgICBwYWdlU2l6ZT17MTB9XG4gKiAgICAgcGFnZT17Y3VycmVudFBhZ2V9XG4gKiAgICAgb25TZWFyY2hDaGFuZ2U9eyh0ZXJtKSA9PiByZWZldGNoKHsgc2VhcmNoOiB0ZXJtLCBwYWdlOiAxIH0pfVxuICogICAgIG9uRmlsdGVyQ2hhbmdlPXsoZmlsdGVyVmFsdWVzKSA9PiByZWZldGNoKHsgZmlsdGVyczogZmlsdGVyVmFsdWVzLCBwYWdlOiAxIH0pfVxuICogICAgIG9uU29ydENoYW5nZT17KGZpZWxkLCBkaXJlY3Rpb24pID0+IHJlZmV0Y2goeyBzb3J0OiBmaWVsZCwgZGlyOiBkaXJlY3Rpb24sIHBhZ2U6IDEgfSl9XG4gKiAgICAgb25QYWdlQ2hhbmdlPXsocGFnZSkgPT4gcmVmZXRjaCh7IHBhZ2UgfSl9XG4gKiAgIC8+XG4gKlxuICog4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4gKiBGSUxURVIgVFlQRVM6XG4gKiDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbiAqXG4gKiAgIC8vIFNpbmdsZSBzZWxlY3QgKGRlZmF1bHQpIOKAlCBleGFjdCBtYXRjaFxuICogICB7IG5hbWU6IFwic3RhdHVzXCIsIHR5cGU6IFwic2VsZWN0XCIsIHBsYWNlaG9sZGVyOiBcIkFsbCBzdGF0dXNlc1wiLCBvcHRpb25zOiBbLi4uXSB9XG4gKlxuICogICAvLyBNdWx0aSBzZWxlY3Qg4oCUIFwiYW55IG9mXCIgbWF0Y2hpbmdcbiAqICAgeyBuYW1lOiBcImNhdGVnb3J5XCIsIHR5cGU6IFwibXVsdGlzZWxlY3RcIiwgcGxhY2Vob2xkZXI6IFwiQWxsIGNhdGVnb3JpZXNcIiwgb3B0aW9uczogWy4uLl0gfVxuICpcbiAqICAgLy8gRGF0ZSByYW5nZSDigJQgZnJvbS90b1xuICogICB7IG5hbWU6IFwiZGF0ZVwiLCB0eXBlOiBcImRhdGVSYW5nZVwiLCBwbGFjZWhvbGRlcjogXCJEYXRlIHJhbmdlXCIgfVxuICpcbiAqICAgLy8gQ3VzdG9tIGZpbHRlciBmdW5jdGlvbiAod29ya3Mgd2l0aCBhbnkgdHlwZSlcbiAqICAgeyBuYW1lOiBcInNjb3JlXCIsIHR5cGU6IFwic2VsZWN0XCIsIG9wdGlvbnM6IFsuLi5dLCBmaWx0ZXJGbjogKHJvdywgdmFsdWUpID0+IHJvdy5zY29yZSA+PSB2YWx1ZSB9XG4gKlxuICog4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4gKiBST1cgR1JPVVBJTkc6XG4gKiDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbiAqXG4gKiAgIGdyb3VwQnk9e3tcbiAqICAgICBmaWVsZDogXCJzdXBwbGllclwiLFxuICogICAgIGxhYmVsOiAodmFsdWUsIHJvd3MpID0+IGAke3ZhbHVlfSAoJHtyb3dzLmxlbmd0aH0pYCxcbiAqICAgICBzb3J0OiBcImFzY1wiLFxuICogICAgIGRlZmF1bHRFeHBhbmRlZDogdHJ1ZSwgICAgICAgICAgIC8vIGdyb3VwcyBzdGFydCBleHBhbmRlZCAoZGVmYXVsdClcbiAqICAgICBhZ2dyZWdhdGlvbnM6IHsgICAgICAgICAgICAgICAgICAvLyBwZXItY29sdW1uIGFnZ3JlZ2F0aW9uIGZ1bmN0aW9uc1xuICogICAgICAgYW1vdW50OiAocm93cykgPT4gYCQke3Jvd3MucmVkdWNlKChzLCByKSA9PiBzICsgci5hbW91bnQsIDApLnRvTG9jYWxlU3RyaW5nKCl9YCxcbiAqICAgICB9LFxuICogICAgIGdyb3VwVmFsdWVzOiB7ICAgICAgICAgICAgICAgICAgIC8vIE9SIHN0YXRpYyB2YWx1ZXMgcGVyIGdyb3VwIHBlciBjb2x1bW5cbiAqICAgICAgIGVudGVycHJpc2U6IHsgYW1vdW50OiBcIiQxLjNNXCIgfSxcbiAqICAgICB9LFxuICogICB9fVxuICpcbiAqIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuICogUk9XIFNFTEVDVElPTjpcbiAqIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuICpcbiAqICAgPERhdGFUYWJsZVxuICogICAgIHNlbGVjdGFibGU9e3RydWV9XG4gKiAgICAgcm93SWRGaWVsZD1cImlkXCJcbiAqICAgICBvblNlbGVjdGlvbkNoYW5nZT17KHNlbGVjdGVkSWRzKSA9PiBoYW5kbGVTZWxlY3Rpb24oc2VsZWN0ZWRJZHMpfVxuICogICAgIGNvbHVtbnM9e1tcbiAqICAgICAgIHsgZmllbGQ6IFwibmFtZVwiLCBsYWJlbDogXCJOYW1lXCIsIHJlbmRlckNlbGw6ICh2YWwpID0+IHZhbCB9LFxuICogICAgICAgLi4uXG4gKiAgICAgXX1cbiAqICAgLz5cbiAqXG4gKiDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbiAqIElOTElORSBFRElUSU5HOlxuICog4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4gKlxuICogICBjb2x1bW5zPXtbXG4gKiAgICAgeyBmaWVsZDogXCJuYW1lXCIsICAgbGFiZWw6IFwiTmFtZVwiLCAgIGVkaXRhYmxlOiB0cnVlLCBlZGl0VHlwZTogXCJ0ZXh0XCIgfSxcbiAqICAgICB7IGZpZWxkOiBcInN0YXR1c1wiLCBsYWJlbDogXCJTdGF0dXNcIiwgZWRpdGFibGU6IHRydWUsIGVkaXRUeXBlOiBcInNlbGVjdFwiLFxuICogICAgICAgZWRpdE9wdGlvbnM6IFt7IGxhYmVsOiBcIkFjdGl2ZVwiLCB2YWx1ZTogXCJhY3RpdmVcIiB9LCAuLi5dIH0sXG4gKiAgICAgeyBmaWVsZDogXCJhbW91bnRcIiwgbGFiZWw6IFwiQW1vdW50XCIsIGVkaXRhYmxlOiB0cnVlLCBlZGl0VHlwZTogXCJjdXJyZW5jeVwiLFxuICogICAgICAgZWRpdFByb3BzOiB7IGN1cnJlbmN5Q29kZTogXCJVU0RcIiB9IH0sXG4gKiAgIF19XG4gKiAgIG9uUm93RWRpdD17KHJvdywgZmllbGQsIG5ld1ZhbHVlKSA9PiBzYXZlKHJvdy5pZCwgZmllbGQsIG5ld1ZhbHVlKX1cbiAqXG4gKiAgIFN1cHBvcnRlZCBlZGl0VHlwZSB2YWx1ZXM6XG4gKiAgICAgXCJ0ZXh0XCIgfCBcInRleHRhcmVhXCIgfCBcIm51bWJlclwiIHwgXCJjdXJyZW5jeVwiIHwgXCJzdGVwcGVyXCJcbiAqICAgICBcInNlbGVjdFwiIHwgXCJtdWx0aXNlbGVjdFwiIHwgXCJkYXRlXCIgfCBcInRvZ2dsZVwiIHwgXCJjaGVja2JveFwiXG4gKlxuICogICBOT1RFOiBzZWxlY3RhYmxlIG9yIGVkaXRhYmxlIGNvbHVtbnMgcmVxdWlyZSByZW5kZXJDZWxsKHZhbHVlLCByb3cpXG4gKiAgIG9uIGVhY2ggY29sdW1uLiByZW5kZXJSb3cgaXMgdXNlZCBvbmx5IHdoZW4gbmVpdGhlciBmZWF0dXJlIGlzIGFjdGl2ZS5cbiAqXG4gKiDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbiAqIENPTFVNTiBXSURUSDpcbiAqIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuICpcbiAqICAgRWFjaCBjb2x1bW4gYWNjZXB0cyBgd2lkdGhgIChoZWFkZXIgKyBjZWxscykgYW5kIGBjZWxsV2lkdGhgIChjZWxscyBvbmx5KTpcbiAqICAgICBcIm1pblwiICDigJQgc2hyaW5rIHRvIGZpdCBjb250ZW50IChtYXkgb3ZlcmZsb3cgd2l0aCBzY3JvbGxiYXIpXG4gKiAgICAgXCJtYXhcIiAg4oCUIGV4cGFuZCB0byBmaWxsIGF2YWlsYWJsZSBzcGFjZVxuICogICAgIFwiYXV0b1wiIOKAlCBhZGp1c3QgYmFzZWQgb24gYXZhaWxhYmxlIHNwYWNlIChkZWZhdWx0KVxuICogICAgIG51bWJlciDigJQgZml4ZWQgd2lkdGggaW4gcGl4ZWxzIChlLmcuIDIwMClcbiAqXG4gKiAgIEV4YW1wbGU6IHsgZmllbGQ6IFwibmFtZVwiLCBsYWJlbDogXCJOYW1lXCIsIHdpZHRoOiBcIm1pblwiLCBjZWxsV2lkdGg6IFwibWF4XCIgfVxuICogICBIZWFkZXIgc3RheXMgdGlnaHQgYXJvdW5kIFwiTmFtZVwiLCBjZWxscyBleHBhbmQgdG8gc2hvdyBmdWxsIHZhbHVlcy5cbiAqXG4gKiDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbiAqIEFVVE8tV0lEVEg6XG4gKiDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbiAqXG4gKiAgIEJ5IGRlZmF1bHQsIGNvbHVtbnMgd2l0aG91dCBleHBsaWNpdCB3aWR0aC9jZWxsV2lkdGggZ2V0IGF1dG8tY29tcHV0ZWRcbiAqICAgd2lkdGhzIGJhc2VkIG9uIGNvbnRlbnQgYW5hbHlzaXMgKGRhdGEgdHlwZXMsIHN0cmluZyBsZW5ndGhzLCBlZGl0IHR5cGVzKS5cbiAqICAgRGlzYWJsZSB3aXRoIGBhdXRvV2lkdGg9e2ZhbHNlfWAuXG4gKlxuICogICBIZXVyaXN0aWNzOlxuICogICAgIC0gQm9vbGVhbnMsIG51bWJlcnMg4oaSIFwibWluXCJcbiAqICAgICAtIERhdGVzIOKGkiBoZWFkZXIgXCJtaW5cIiwgY2VsbHMgXCJhdXRvXCIgKHJlbmRlcmVkIGRhdGVzIGFyZSBsb25nZXIgdGhhbiByYXcpXG4gKiAgICAgLSBTbWFsbCBlbnVtcyAo4omkNSB1bmlxdWUsIHNob3J0IHN0cmluZ3MpIOKGkiBoZWFkZXIgXCJtaW5cIiwgY2VsbHMgXCJhdXRvXCJcbiAqICAgICAtIFRleHQg4oaSIFwiYXV0b1wiIChicm93c2VyIGRpc3RyaWJ1dGVzIHNwYWNlIGV2ZW5seSlcbiAqICAgICAtIEVkaXQgdHlwZSBoaW50czogY2hlY2tib3gvdG9nZ2xlIOKGkiBcIm1pblwiLCBudW1iZXIvY3VycmVuY3kvc2VsZWN0IOKGkiBcImF1dG9cIlxuICpcbiAqIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuICogUEFHSU5BVElPTiBPUFRJT05TOlxuICog4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4gKlxuICogICBwYWdlU2l6ZT17MTB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcm93cyBwZXIgcGFnZSAoZGVmYXVsdCAxMClcbiAqICAgbWF4VmlzaWJsZVBhZ2VCdXR0b25zPXs1fSAgICAgICAgICAgICAgIC8vIG1heCBwYWdlIG51bWJlciBidXR0b25zIHNob3duXG4gKiAgIHNob3dCdXR0b25MYWJlbHM9e2ZhbHNlfSAgICAgICAgICAgICAgICAvLyBoaWRlIEZpcnN0L1ByZXYvTmV4dC9MYXN0IGxhYmVsc1xuICogICBzaG93Rmlyc3RMYXN0QnV0dG9ucz17dHJ1ZX0gICAgICAgICAgICAgLy8gc2hvdyBGaXJzdC9MYXN0IGJ1dHRvbnMgKGF1dG8gaWYgPiA1IHBhZ2VzKVxuICpcbiAqIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuICogUk9XIENPVU5UOlxuICog4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4gKlxuICogICBzaG93Um93Q291bnQ9e3RydWV9ICAgICAgICAgICAgICAgICAgICAgLy8gc2hvdyByb3cgY291bnQgKGRlZmF1bHQgdHJ1ZSlcbiAqICAgcm93Q291bnRCb2xkPXtmYWxzZX0gICAgICAgICAgICAgICAgICAgIC8vIGJvbGQgcm93IGNvdW50IHRleHQgKGRlZmF1bHQgZmFsc2UpXG4gKiAgIHJvd0NvdW50VGV4dD17KHNob3duLCB0b3RhbCkgPT4gICAgICAgICAvLyBjdXN0b20gcm93IGNvdW50IHRleHRcbiAqICAgICBgU2hvd2luZyAke3Nob3dufSBvZiAke3RvdGFsfSBpdGVtc2BcbiAqICAgfVxuICovXG5cbmltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlTWVtbywgdXNlRWZmZWN0LCB1c2VDYWxsYmFjayB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtcbiAgQm94LFxuICBCdXR0b24sXG4gIENoZWNrYm94LFxuICBDdXJyZW5jeUlucHV0LFxuICBEYXRlSW5wdXQsXG4gIEVtcHR5U3RhdGUsXG4gIEZsZXgsXG4gIEljb24sXG4gIElucHV0LFxuICBMaW5rLFxuICBNdWx0aVNlbGVjdCxcbiAgTnVtYmVySW5wdXQsXG4gIFNlYXJjaElucHV0LFxuICBTZWxlY3QsXG4gIFN0ZXBwZXJJbnB1dCxcbiAgVGFibGUsXG4gIFRhYmxlQm9keSxcbiAgVGFibGVDZWxsLFxuICBUYWJsZUZvb3RlcixcbiAgVGFibGVIZWFkLFxuICBUYWJsZUhlYWRlcixcbiAgVGFibGVSb3csXG4gIFRhZyxcbiAgVGV4dCxcbiAgVGV4dEFyZWEsXG4gIFRvZ2dsZSxcbn0gZnJvbSBcIkBodWJzcG90L3VpLWV4dGVuc2lvbnNcIjtcblxuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4vLyBIZWxwZXJzXG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcblxuY29uc3QgZm9ybWF0RGF0ZUNoaXAgPSAoZGF0ZU9iaikgPT4ge1xuICBpZiAoIWRhdGVPYmopIHJldHVybiBcIlwiO1xuICBjb25zdCB7IHllYXIsIG1vbnRoLCBkYXRlIH0gPSBkYXRlT2JqO1xuICByZXR1cm4gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoXCJlbi1VU1wiLCB7XG4gICAgbW9udGg6IFwic2hvcnRcIiwgZGF5OiBcIm51bWVyaWNcIiwgeWVhcjogXCJudW1lcmljXCIsXG4gIH0pLmZvcm1hdChuZXcgRGF0ZSh5ZWFyLCBtb250aCwgZGF0ZSkpO1xufTtcblxuY29uc3QgZGF0ZVRvVGltZXN0YW1wID0gKGRhdGVPYmopID0+IHtcbiAgaWYgKCFkYXRlT2JqKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIG5ldyBEYXRlKGRhdGVPYmoueWVhciwgZGF0ZU9iai5tb250aCwgZGF0ZU9iai5kYXRlKS5nZXRUaW1lKCk7XG59O1xuXG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbi8vIEludGVsbGlnZW50IGF1dG8td2lkdGhcbi8vIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuXG5jb25zdCBOQVJST1dfRURJVF9UWVBFUyA9IG5ldyBTZXQoW1wiY2hlY2tib3hcIiwgXCJ0b2dnbGVcIl0pO1xuXG5jb25zdCBEQVRFX1BBVFRFUk4gPSAvXlxcZHs0fVstL11cXGR7Mn1bLS9dXFxkezJ9LztcbmNvbnN0IEJPT0xfVkFMVUVTID0gbmV3IFNldChbXCJ0cnVlXCIsIFwiZmFsc2VcIiwgXCJ5ZXNcIiwgXCJub1wiLCBcIjBcIiwgXCIxXCJdKTtcblxuY29uc3QgY29tcHV0ZUF1dG9XaWR0aHMgPSAoY29sdW1ucywgZGF0YSkgPT4ge1xuICBpZiAoIWRhdGEgfHwgZGF0YS5sZW5ndGggPT09IDApIHJldHVybiB7fTtcblxuICBjb25zdCBzYW1wbGUgPSBkYXRhLnNsaWNlKDAsIDUwKTsgLy8gYW5hbHl6ZSB1cCB0byA1MCByb3dzXG4gIGNvbnN0IHJlc3VsdHMgPSB7fTtcblxuICBjb2x1bW5zLmZvckVhY2goKGNvbCkgPT4ge1xuICAgIC8vIFNraXAgY29sdW1ucyB3aXRoIGJvdGggZXhwbGljaXQgd2lkdGhzIHNldFxuICAgIGlmIChjb2wud2lkdGggJiYgY29sLmNlbGxXaWR0aCkgcmV0dXJuO1xuXG4gICAgY29uc3QgdmFsdWVzID0gc2FtcGxlLm1hcCgocm93KSA9PiByb3dbY29sLmZpZWxkXSkuZmlsdGVyKCh2KSA9PiB2ICE9IG51bGwpO1xuICAgIGNvbnN0IHN0cmluZ3MgPSB2YWx1ZXMubWFwKCh2KSA9PiBTdHJpbmcodikpO1xuXG4gICAgbGV0IHdpZHRoSGludCA9IG51bGw7IC8vIFwibWluXCIgfCBcImF1dG9cIlxuICAgIGxldCBjZWxsV2lkdGhIaW50ID0gbnVsbDtcblxuICAgIC8vIDEuIEVkaXQgdHlwZSBoaW50c1xuICAgIGlmIChjb2wuZWRpdGFibGUgJiYgY29sLmVkaXRUeXBlICYmIE5BUlJPV19FRElUX1RZUEVTLmhhcyhjb2wuZWRpdFR5cGUpKSB7XG4gICAgICBjZWxsV2lkdGhIaW50ID0gXCJtaW5cIjtcbiAgICB9XG5cbiAgICAvLyAyLiBDb250ZW50IGFuYWx5c2lzXG4gICAgaWYgKHN0cmluZ3MubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgbGVuZ3RocyA9IHN0cmluZ3MubWFwKChzKSA9PiBzLmxlbmd0aCk7XG4gICAgICBjb25zdCBtYXhMZW4gPSBNYXRoLm1heCguLi5sZW5ndGhzKTtcbiAgICAgIGNvbnN0IHVuaXF1ZUNvdW50ID0gbmV3IFNldChzdHJpbmdzKS5zaXplO1xuXG4gICAgICAvLyBCb29sZWFuLWxpa2UgdmFsdWVzIOKGkiBtaW5cbiAgICAgIGlmICh2YWx1ZXMuZXZlcnkoKHYpID0+IHR5cGVvZiB2ID09PSBcImJvb2xlYW5cIikgfHxcbiAgICAgICAgc3RyaW5ncy5ldmVyeSgocykgPT4gQk9PTF9WQUxVRVMuaGFzKHMudG9Mb3dlckNhc2UoKSkpKSB7XG4gICAgICAgIHdpZHRoSGludCA9IHdpZHRoSGludCB8fCBcIm1pblwiO1xuICAgICAgICBjZWxsV2lkdGhIaW50ID0gY2VsbFdpZHRoSGludCB8fCBcIm1pblwiO1xuICAgICAgfVxuICAgICAgLy8gRGF0ZS1saWtlIHZhbHVlcyDihpIgYXV0byAocmVuZGVyZWQgZGF0ZXMgYXJlIG9mdGVuIGxvbmdlciB0aGFuIHJhdyBJU08pXG4gICAgICBlbHNlIGlmIChzdHJpbmdzLmV2ZXJ5KChzKSA9PiBEQVRFX1BBVFRFUk4udGVzdChzKSkpIHtcbiAgICAgICAgd2lkdGhIaW50ID0gd2lkdGhIaW50IHx8IFwibWluXCI7XG4gICAgICAgIGNlbGxXaWR0aEhpbnQgPSBjZWxsV2lkdGhIaW50IHx8IFwiYXV0b1wiO1xuICAgICAgfVxuICAgICAgLy8gUHVyZSBudW1iZXJzIOKGkiBhdXRvIChoZWFkZXIgXCJtaW5cIiBjb25zdHJhaW5zIHRoZSB3aG9sZSBjb2x1bW4gdG9vIG11Y2ggZm9yIGlucHV0cylcbiAgICAgIGVsc2UgaWYgKHZhbHVlcy5ldmVyeSgodikgPT4gdHlwZW9mIHYgPT09IFwibnVtYmVyXCIpKSB7XG4gICAgICAgIHdpZHRoSGludCA9IHdpZHRoSGludCB8fCBcImF1dG9cIjtcbiAgICAgICAgY2VsbFdpZHRoSGludCA9IGNlbGxXaWR0aEhpbnQgfHwgXCJhdXRvXCI7XG4gICAgICB9XG4gICAgICAvLyBTbWFsbCBlbnVtLWxpa2UgKGZldyB1bmlxdWUgdmFsdWVzLCBzaG9ydCBzdHJpbmdzKSDihpIgbWluXG4gICAgICBlbHNlIGlmICh1bmlxdWVDb3VudCA8PSA1ICYmIG1heExlbiA8PSAxNSkge1xuICAgICAgICB3aWR0aEhpbnQgPSB3aWR0aEhpbnQgfHwgXCJtaW5cIjtcbiAgICAgICAgY2VsbFdpZHRoSGludCA9IGNlbGxXaWR0aEhpbnQgfHwgXCJhdXRvXCI7XG4gICAgICB9XG4gICAgICAvLyBFdmVyeXRoaW5nIGVsc2UgKHRleHQpIOKGkiBhdXRvLCBsZXQgdGhlIGJyb3dzZXIgZGlzdHJpYnV0ZSBldmVubHlcbiAgICAgIGVsc2Uge1xuICAgICAgICB3aWR0aEhpbnQgPSB3aWR0aEhpbnQgfHwgXCJhdXRvXCI7XG4gICAgICAgIGNlbGxXaWR0aEhpbnQgPSBjZWxsV2lkdGhIaW50IHx8IFwiYXV0b1wiO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEVkaXRhYmxlIGNvbHVtbnMgKGV4Y2VwdCBjaGVja2JveC90b2dnbGUpIG5lZWQgcm9vbSBmb3IgaW5wdXQgY29tcG9uZW50cyDigJRcbiAgICAvLyBuZXZlciBjb25zdHJhaW4gdGhlIGhlYWRlciB0byBcIm1pblwiIG9yIHRoZSBpbnB1dCB3aWxsIGdldCBzcXVlZXplZFxuICAgIGlmIChjb2wuZWRpdGFibGUgJiYgIU5BUlJPV19FRElUX1RZUEVTLmhhcyhjb2wuZWRpdFR5cGUpICYmIHdpZHRoSGludCA9PT0gXCJtaW5cIikge1xuICAgICAgd2lkdGhIaW50ID0gXCJhdXRvXCI7XG4gICAgfVxuXG4gICAgcmVzdWx0c1tjb2wuZmllbGRdID0ge1xuICAgICAgd2lkdGg6IHdpZHRoSGludCB8fCBcImF1dG9cIixcbiAgICAgIGNlbGxXaWR0aDogY2VsbFdpZHRoSGludCB8fCBcImF1dG9cIixcbiAgICB9O1xuICB9KTtcblxuICByZXR1cm4gcmVzdWx0cztcbn07XG5cbmNvbnN0IGdldEVtcHR5RmlsdGVyVmFsdWUgPSAoZmlsdGVyKSA9PiB7XG4gIGNvbnN0IHR5cGUgPSBmaWx0ZXIudHlwZSB8fCBcInNlbGVjdFwiO1xuICBpZiAodHlwZSA9PT0gXCJtdWx0aXNlbGVjdFwiKSByZXR1cm4gW107XG4gIGlmICh0eXBlID09PSBcImRhdGVSYW5nZVwiKSByZXR1cm4geyBmcm9tOiBudWxsLCB0bzogbnVsbCB9O1xuICByZXR1cm4gXCJcIjtcbn07XG5cbmNvbnN0IEJPT0xFQU5fU0VMRUNUX09QVElPTlMgPSBbXG4gIHsgbGFiZWw6IFwiWWVzXCIsIHZhbHVlOiB0cnVlIH0sXG4gIHsgbGFiZWw6IFwiTm9cIiwgdmFsdWU6IGZhbHNlIH0sXG5dO1xuXG5jb25zdCByZXNvbHZlRWRpdE9wdGlvbnMgPSAoY29sLCBkYXRhKSA9PiB7XG4gIGlmIChjb2wuZWRpdE9wdGlvbnMgJiYgY29sLmVkaXRPcHRpb25zLmxlbmd0aCA+IDApIHJldHVybiBjb2wuZWRpdE9wdGlvbnM7XG4gIC8vIEF1dG8tZGV0ZWN0IGJvb2xlYW4gZmllbGRzIGFuZCBnZW5lcmF0ZSBZZXMvTm8gb3B0aW9uc1xuICBjb25zdCBzYW1wbGUgPSBkYXRhLmZpbmQoKHJvdykgPT4gcm93W2NvbC5maWVsZF0gIT0gbnVsbCk7XG4gIGlmIChzYW1wbGUgJiYgdHlwZW9mIHNhbXBsZVtjb2wuZmllbGRdID09PSBcImJvb2xlYW5cIikgcmV0dXJuIEJPT0xFQU5fU0VMRUNUX09QVElPTlM7XG4gIHJldHVybiBbXTtcbn07XG5cbmNvbnN0IGlzRmlsdGVyQWN0aXZlID0gKGZpbHRlciwgdmFsdWUpID0+IHtcbiAgY29uc3QgdHlwZSA9IGZpbHRlci50eXBlIHx8IFwic2VsZWN0XCI7XG4gIGlmICh0eXBlID09PSBcIm11bHRpc2VsZWN0XCIpIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPiAwO1xuICBpZiAodHlwZSA9PT0gXCJkYXRlUmFuZ2VcIikgcmV0dXJuIHZhbHVlICYmICh2YWx1ZS5mcm9tIHx8IHZhbHVlLnRvKTtcbiAgcmV0dXJuICEhdmFsdWU7XG59O1xuXG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbi8vIENvbXBvbmVudFxuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG5cbmV4cG9ydCBjb25zdCBEYXRhVGFibGUgPSAoe1xuICAvLyBEYXRhXG4gIGRhdGEsXG4gIGNvbHVtbnMsXG4gIHJlbmRlclJvdyxcblxuICAvLyBTZWFyY2hcbiAgc2VhcmNoRmllbGRzID0gW10sXG4gIHNlYXJjaFBsYWNlaG9sZGVyID0gXCJTZWFyY2guLi5cIixcblxuICAvLyBGaWx0ZXJzXG4gIGZpbHRlcnMgPSBbXSxcblxuICAvLyBQYWdpbmF0aW9uXG4gIHBhZ2VTaXplID0gMTAsXG4gIG1heFZpc2libGVQYWdlQnV0dG9ucywgICAgICAgIC8vIG1heCBwYWdlIG51bWJlciBidXR0b25zIHRvIHNob3dcbiAgc2hvd0J1dHRvbkxhYmVscyA9IHRydWUsICAgICAgLy8gc2hvdyBGaXJzdC9QcmV2L05leHQvTGFzdCB0ZXh0IGxhYmVsc1xuICBzaG93Rmlyc3RMYXN0QnV0dG9ucywgICAgICAgICAvLyBzaG93IEZpcnN0L0xhc3QgcGFnZSBidXR0b25zIChkZWZhdWx0OiBhdXRvIHdoZW4gcGFnZUNvdW50ID4gNSlcblxuICAvLyBSb3cgY291bnRcbiAgc2hvd1Jvd0NvdW50ID0gdHJ1ZSwgICAgICAgICAgLy8gc2hvdyBcIlggcmVjb3Jkc1wiIC8gXCJYIG9mIFkgcmVjb3Jkc1wiIHRleHRcbiAgcm93Q291bnRCb2xkID0gZmFsc2UsICAgICAgICAgLy8gYm9sZCB0aGUgcm93IGNvdW50IHRleHRcbiAgcm93Q291bnRUZXh0LCAgICAgICAgICAgICAgICAgLy8gY3VzdG9tIGZvcm1hdHRlcjogKGRpc3BsYXlDb3VudCwgdG90YWxDb3VudCkgPT4gc3RyaW5nXG5cbiAgLy8gVGFibGUgYXBwZWFyYW5jZVxuICBib3JkZXJlZCA9IHRydWUsICAgICAgICAgICAgICAvLyBzaG93IHRhYmxlIGJvcmRlcnNcbiAgZmx1c2ggPSB0cnVlLCAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGJvdHRvbSBtYXJnaW5cblxuICAvLyBTb3J0aW5nXG4gIGRlZmF1bHRTb3J0ID0ge30sXG5cbiAgLy8gR3JvdXBpbmdcbiAgZ3JvdXBCeSxcblxuICAvLyBGb290ZXJcbiAgZm9vdGVyLFxuXG4gIC8vIEVtcHR5IHN0YXRlXG4gIGVtcHR5VGl0bGUgPSBcIk5vIHJlc3VsdHMgZm91bmRcIixcbiAgZW1wdHlNZXNzYWdlID0gXCJObyByZWNvcmRzIG1hdGNoIHlvdXIgc2VhcmNoIG9yIGZpbHRlciBjcml0ZXJpYS5cIixcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBTZXJ2ZXItc2lkZSBtb2RlXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIHNlcnZlclNpZGUgPSBmYWxzZSxcbiAgdG90YWxDb3VudCwgICAgICAgICAgIC8vIHNlcnZlciB0b3RhbCAoc2VydmVyLXNpZGUgb25seSlcbiAgcGFnZTogZXh0ZXJuYWxQYWdlLCAgIC8vIGNvbnRyb2xsZWQgcGFnZSAoc2VydmVyLXNpZGUgb25seSlcbiAgb25TZWFyY2hDaGFuZ2UsICAgICAgIC8vIChzZWFyY2hUZXJtKSA9PiB2b2lkXG4gIG9uRmlsdGVyQ2hhbmdlLCAgICAgICAvLyAoZmlsdGVyVmFsdWVzKSA9PiB2b2lkXG4gIG9uU29ydENoYW5nZSwgICAgICAgICAvLyAoZmllbGQsIGRpcmVjdGlvbikgPT4gdm9pZFxuICBvblBhZ2VDaGFuZ2UsICAgICAgICAgLy8gKHBhZ2UpID0+IHZvaWRcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSb3cgc2VsZWN0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIHNlbGVjdGFibGUgPSBmYWxzZSxcbiAgcm93SWRGaWVsZCA9IFwiaWRcIiwgICAgIC8vIGZpZWxkIG5hbWUgdXNlZCBhcyB1bmlxdWUgcm93IGlkZW50aWZpZXJcbiAgb25TZWxlY3Rpb25DaGFuZ2UsICAgICAvLyAoc2VsZWN0ZWRJZHNbXSkgPT4gdm9pZFxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIElubGluZSBlZGl0aW5nXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGVkaXRNb2RlLCAgICAgICAgICAgICAgLy8gXCJkaXNjcmV0ZVwiIChjbGljay10by1lZGl0KSB8IFwiaW5saW5lXCIgKGFsd2F5cyBzaG93IGlucHV0cylcbiAgb25Sb3dFZGl0LCAgICAgICAgICAgICAvLyAocm93LCBmaWVsZCwgbmV3VmFsdWUpID0+IHZvaWRcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBBdXRvLXdpZHRoXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGF1dG9XaWR0aCA9IHRydWUsICAgICAgLy8gYXV0by1jb21wdXRlIGNvbHVtbiB3aWR0aHMgZnJvbSBjb250ZW50IGFuYWx5c2lzXG59KSA9PiB7XG4gIC8vIEJ1aWxkIGluaXRpYWwgc29ydCBzdGF0ZVxuICBjb25zdCBpbml0aWFsU29ydFN0YXRlID0gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3Qgc3RhdGUgPSB7fTtcbiAgICBjb2x1bW5zLmZvckVhY2goKGNvbCkgPT4ge1xuICAgICAgaWYgKGNvbC5zb3J0YWJsZSkge1xuICAgICAgICBzdGF0ZVtjb2wuZmllbGRdID0gZGVmYXVsdFNvcnRbY29sLmZpZWxkXSB8fCBcIm5vbmVcIjtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH0sIFtjb2x1bW5zLCBkZWZhdWx0U29ydF0pO1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBJbnRlcm5hbCBzdGF0ZSAodXNlZCBpbiBjbGllbnQtc2lkZSBtb2RlOyBhbHNvIGRyaXZlcyBVSSBpbiBzZXJ2ZXItc2lkZSlcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGNvbnN0IFtzZWFyY2hUZXJtLCBzZXRTZWFyY2hUZXJtXSA9IHVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBbZmlsdGVyVmFsdWVzLCBzZXRGaWx0ZXJWYWx1ZXNdID0gdXNlU3RhdGUoKCkgPT4ge1xuICAgIGNvbnN0IGluaXQgPSB7fTtcbiAgICBmaWx0ZXJzLmZvckVhY2goKGYpID0+IHsgaW5pdFtmLm5hbWVdID0gZ2V0RW1wdHlGaWx0ZXJWYWx1ZShmKTsgfSk7XG4gICAgcmV0dXJuIGluaXQ7XG4gIH0pO1xuICBjb25zdCBbc29ydFN0YXRlLCBzZXRTb3J0U3RhdGVdID0gdXNlU3RhdGUoaW5pdGlhbFNvcnRTdGF0ZSk7XG4gIGNvbnN0IFtjdXJyZW50UGFnZSwgc2V0Q3VycmVudFBhZ2VdID0gdXNlU3RhdGUoMSk7XG4gIGNvbnN0IFtzaG93TW9yZUZpbHRlcnMsIHNldFNob3dNb3JlRmlsdGVyc10gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgLy8gSW4gc2VydmVyLXNpZGUgbW9kZSwgdXNlIGV4dGVybmFsIHBhZ2UgaWYgcHJvdmlkZWRcbiAgY29uc3QgYWN0aXZlUGFnZSA9IHNlcnZlclNpZGUgJiYgZXh0ZXJuYWxQYWdlICE9IG51bGwgPyBleHRlcm5hbFBhZ2UgOiBjdXJyZW50UGFnZTtcblxuICAvLyBSZXNldCBwYWdlIG9uIGNsaWVudC1zaWRlIGZpbHRlci9zb3J0L3NlYXJjaCBjaGFuZ2VcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXNlcnZlclNpZGUpIHNldEN1cnJlbnRQYWdlKDEpO1xuICB9LCBbc2VhcmNoVGVybSwgZmlsdGVyVmFsdWVzLCBzb3J0U3RhdGUsIHNlcnZlclNpZGVdKTtcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSGFuZGxlcnMg4oCUIG5vdGlmeSBwYXJlbnQgaW4gc2VydmVyLXNpZGUgbW9kZVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY29uc3QgaGFuZGxlU2VhcmNoQ2hhbmdlID0gdXNlQ2FsbGJhY2soKHRlcm0pID0+IHtcbiAgICBzZXRTZWFyY2hUZXJtKHRlcm0pO1xuICAgIGlmIChzZXJ2ZXJTaWRlICYmIG9uU2VhcmNoQ2hhbmdlKSBvblNlYXJjaENoYW5nZSh0ZXJtKTtcbiAgfSwgW3NlcnZlclNpZGUsIG9uU2VhcmNoQ2hhbmdlXSk7XG5cbiAgY29uc3QgaGFuZGxlRmlsdGVyQ2hhbmdlID0gdXNlQ2FsbGJhY2soKG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgc2V0RmlsdGVyVmFsdWVzKChwcmV2KSA9PiB7XG4gICAgICBjb25zdCBuZXh0ID0geyAuLi5wcmV2LCBbbmFtZV06IHZhbHVlIH07XG4gICAgICBpZiAoc2VydmVyU2lkZSAmJiBvbkZpbHRlckNoYW5nZSkgb25GaWx0ZXJDaGFuZ2UobmV4dCk7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9KTtcbiAgfSwgW3NlcnZlclNpZGUsIG9uRmlsdGVyQ2hhbmdlXSk7XG5cbiAgY29uc3QgaGFuZGxlU29ydENoYW5nZSA9IHVzZUNhbGxiYWNrKChmaWVsZCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBzb3J0U3RhdGVbZmllbGRdIHx8IFwibm9uZVwiO1xuICAgIGNvbnN0IG5leHREaXJlY3Rpb24gPVxuICAgICAgY3VycmVudCA9PT0gXCJub25lXCIgPyBcImFzY2VuZGluZ1wiIDpcbiAgICAgICAgY3VycmVudCA9PT0gXCJhc2NlbmRpbmdcIiA/IFwiZGVzY2VuZGluZ1wiIDogXCJub25lXCI7XG5cbiAgICBjb25zdCByZXNldCA9IHt9O1xuICAgIE9iamVjdC5rZXlzKHNvcnRTdGF0ZSkuZm9yRWFjaCgoaykgPT4geyByZXNldFtrXSA9IFwibm9uZVwiOyB9KTtcbiAgICBjb25zdCBuZXh0ID0geyAuLi5yZXNldCwgW2ZpZWxkXTogbmV4dERpcmVjdGlvbiB9O1xuICAgIHNldFNvcnRTdGF0ZShuZXh0KTtcbiAgICBpZiAoc2VydmVyU2lkZSAmJiBvblNvcnRDaGFuZ2UpIG9uU29ydENoYW5nZShmaWVsZCwgbmV4dERpcmVjdGlvbik7XG4gIH0sIFtzb3J0U3RhdGUsIHNlcnZlclNpZGUsIG9uU29ydENoYW5nZV0pO1xuXG4gIGNvbnN0IGhhbmRsZVBhZ2VDaGFuZ2UgPSB1c2VDYWxsYmFjaygocGFnZSkgPT4ge1xuICAgIHNldEN1cnJlbnRQYWdlKHBhZ2UpO1xuICAgIGlmIChzZXJ2ZXJTaWRlICYmIG9uUGFnZUNoYW5nZSkgb25QYWdlQ2hhbmdlKHBhZ2UpO1xuICB9LCBbc2VydmVyU2lkZSwgb25QYWdlQ2hhbmdlXSk7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENsaWVudC1zaWRlOiBGaWx0ZXJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGNvbnN0IGZpbHRlcmVkRGF0YSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChzZXJ2ZXJTaWRlKSByZXR1cm4gZGF0YTsgLy8gc2VydmVyIGFscmVhZHkgZmlsdGVyZWRcblxuICAgIGxldCByZXN1bHQgPSBkYXRhO1xuXG4gICAgLy8gQXBwbHkgZWFjaCBmaWx0ZXJcbiAgICBmaWx0ZXJzLmZvckVhY2goKGZpbHRlcikgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBmaWx0ZXJWYWx1ZXNbZmlsdGVyLm5hbWVdO1xuICAgICAgaWYgKCFpc0ZpbHRlckFjdGl2ZShmaWx0ZXIsIHZhbHVlKSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCB0eXBlID0gZmlsdGVyLnR5cGUgfHwgXCJzZWxlY3RcIjtcblxuICAgICAgaWYgKGZpbHRlci5maWx0ZXJGbikge1xuICAgICAgICByZXN1bHQgPSByZXN1bHQuZmlsdGVyKChyb3cpID0+IGZpbHRlci5maWx0ZXJGbihyb3csIHZhbHVlKSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwibXVsdGlzZWxlY3RcIikge1xuICAgICAgICAvLyBcIkFueSBvZlwiIG1hdGNoaW5nXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdC5maWx0ZXIoKHJvdykgPT4gdmFsdWUuaW5jbHVkZXMocm93W2ZpbHRlci5uYW1lXSkpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcImRhdGVSYW5nZVwiKSB7XG4gICAgICAgIGNvbnN0IGZyb21UcyA9IGRhdGVUb1RpbWVzdGFtcCh2YWx1ZS5mcm9tKTtcbiAgICAgICAgY29uc3QgdG9UcyA9IHZhbHVlLnRvID8gZGF0ZVRvVGltZXN0YW1wKHZhbHVlLnRvKSArIDg2NDAwMDAwIC0gMSA6IG51bGw7IC8vIGVuZCBvZiBkYXlcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmZpbHRlcigocm93KSA9PiB7XG4gICAgICAgICAgY29uc3Qgcm93VHMgPSBuZXcgRGF0ZShyb3dbZmlsdGVyLm5hbWVdKS5nZXRUaW1lKCk7XG4gICAgICAgICAgaWYgKGZyb21UcyAmJiByb3dUcyA8IGZyb21UcykgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIGlmICh0b1RzICYmIHJvd1RzID4gdG9UcykgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERlZmF1bHQ6IGV4YWN0IG1hdGNoXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdC5maWx0ZXIoKHJvdykgPT4gcm93W2ZpbHRlci5uYW1lXSA9PT0gdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU2VhcmNoIGFjcm9zcyBzZWFyY2hGaWVsZHNcbiAgICBpZiAoc2VhcmNoVGVybSAmJiBzZWFyY2hGaWVsZHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgdGVybSA9IHNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5maWx0ZXIoKHJvdykgPT5cbiAgICAgICAgc2VhcmNoRmllbGRzLnNvbWUoKGZpZWxkKSA9PiB7XG4gICAgICAgICAgY29uc3QgdmFsID0gcm93W2ZpZWxkXTtcbiAgICAgICAgICByZXR1cm4gdmFsICYmIFN0cmluZyh2YWwpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGVybSk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sIFtkYXRhLCBmaWx0ZXJWYWx1ZXMsIHNlYXJjaFRlcm0sIGZpbHRlcnMsIHNlYXJjaEZpZWxkcywgc2VydmVyU2lkZV0pO1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDbGllbnQtc2lkZTogU29ydFxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY29uc3Qgc29ydGVkRGF0YSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChzZXJ2ZXJTaWRlKSByZXR1cm4gZmlsdGVyZWREYXRhOyAvLyBzZXJ2ZXIgYWxyZWFkeSBzb3J0ZWRcblxuICAgIGNvbnN0IGFjdGl2ZUZpZWxkID0gT2JqZWN0LmtleXMoc29ydFN0YXRlKS5maW5kKChrKSA9PiBzb3J0U3RhdGVba10gIT09IFwibm9uZVwiKTtcbiAgICBpZiAoIWFjdGl2ZUZpZWxkKSByZXR1cm4gZmlsdGVyZWREYXRhO1xuXG4gICAgcmV0dXJuIFsuLi5maWx0ZXJlZERhdGFdLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGNvbnN0IGRpciA9IHNvcnRTdGF0ZVthY3RpdmVGaWVsZF0gPT09IFwiYXNjZW5kaW5nXCIgPyAxIDogLTE7XG4gICAgICBjb25zdCBhVmFsID0gYVthY3RpdmVGaWVsZF07XG4gICAgICBjb25zdCBiVmFsID0gYlthY3RpdmVGaWVsZF07XG4gICAgICBpZiAoYVZhbCA9PSBudWxsICYmIGJWYWwgPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgICBpZiAoYVZhbCA9PSBudWxsKSByZXR1cm4gMTtcbiAgICAgIGlmIChiVmFsID09IG51bGwpIHJldHVybiAtMTtcbiAgICAgIGlmIChhVmFsIDwgYlZhbCkgcmV0dXJuIC1kaXI7XG4gICAgICBpZiAoYVZhbCA+IGJWYWwpIHJldHVybiBkaXI7XG4gICAgICByZXR1cm4gMDtcbiAgICB9KTtcbiAgfSwgW2ZpbHRlcmVkRGF0YSwgc29ydFN0YXRlLCBzZXJ2ZXJTaWRlXSk7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENsaWVudC1zaWRlOiBHcm91cCAob3B0aW9uYWwpXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBjb25zdCBncm91cGVkRGF0YSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghZ3JvdXBCeSkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBzb3VyY2UgPSBzZXJ2ZXJTaWRlID8gZGF0YSA6IHNvcnRlZERhdGE7XG4gICAgY29uc3QgZ3JvdXBzID0ge307XG4gICAgc291cmNlLmZvckVhY2goKHJvdykgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gcm93W2dyb3VwQnkuZmllbGRdID8/IFwiLS1cIjtcbiAgICAgIGlmICghZ3JvdXBzW2tleV0pIGdyb3Vwc1trZXldID0gW107XG4gICAgICBncm91cHNba2V5XS5wdXNoKHJvdyk7XG4gICAgfSk7XG5cbiAgICBsZXQgZ3JvdXBLZXlzID0gT2JqZWN0LmtleXMoZ3JvdXBzKTtcbiAgICBpZiAoZ3JvdXBCeS5zb3J0KSB7XG4gICAgICBpZiAodHlwZW9mIGdyb3VwQnkuc29ydCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGdyb3VwS2V5cy5zb3J0KGdyb3VwQnkuc29ydCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkaXIgPSBncm91cEJ5LnNvcnQgPT09IFwiZGVzY1wiID8gLTEgOiAxO1xuICAgICAgICBncm91cEtleXMuc29ydCgoYSwgYikgPT4gKGEgPCBiID8gLWRpciA6IGEgPiBiID8gZGlyIDogMCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBncm91cEtleXMubWFwKChrZXkpID0+ICh7XG4gICAgICBrZXksXG4gICAgICBsYWJlbDogZ3JvdXBCeS5sYWJlbCA/IGdyb3VwQnkubGFiZWwoa2V5LCBncm91cHNba2V5XSkgOiBrZXksXG4gICAgICByb3dzOiBncm91cHNba2V5XSxcbiAgICB9KSk7XG4gIH0sIFtzb3J0ZWREYXRhLCBkYXRhLCBncm91cEJ5LCBzZXJ2ZXJTaWRlXSk7XG5cbiAgLy8gR3JvdXAgZXhwYW5kL2NvbGxhcHNlIHN0YXRlXG4gIGNvbnN0IFtleHBhbmRlZEdyb3Vwcywgc2V0RXhwYW5kZWRHcm91cHNdID0gdXNlU3RhdGUoKCkgPT4ge1xuICAgIGlmICghZ3JvdXBCeSkgcmV0dXJuIG5ldyBTZXQoKTtcbiAgICBjb25zdCBkZWZhdWx0RXhwYW5kZWQgPSBncm91cEJ5LmRlZmF1bHRFeHBhbmRlZCAhPT0gZmFsc2U7IC8vIGRlZmF1bHQgdHJ1ZVxuICAgIGlmIChkZWZhdWx0RXhwYW5kZWQgJiYgZ3JvdXBlZERhdGEpIHtcbiAgICAgIHJldHVybiBuZXcgU2V0KGdyb3VwZWREYXRhLm1hcCgoZykgPT4gZy5rZXkpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBTZXQoKTtcbiAgfSk7XG5cbiAgLy8gU3luYyBleHBhbmRlZCBncm91cHMgd2hlbiBncm91cGVkIGRhdGEgY2hhbmdlcyAobmV3IGdyb3VwcyBhcHBlYXIpXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFncm91cGVkRGF0YSkgcmV0dXJuO1xuICAgIGNvbnN0IGRlZmF1bHRFeHBhbmRlZCA9IGdyb3VwQnk/LmRlZmF1bHRFeHBhbmRlZCAhPT0gZmFsc2U7XG4gICAgaWYgKGRlZmF1bHRFeHBhbmRlZCkge1xuICAgICAgc2V0RXhwYW5kZWRHcm91cHMoKHByZXYpID0+IHtcbiAgICAgICAgY29uc3QgbmV4dCA9IG5ldyBTZXQocHJldik7XG4gICAgICAgIGdyb3VwZWREYXRhLmZvckVhY2goKGcpID0+IG5leHQuYWRkKGcua2V5KSk7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgfSk7XG4gICAgfVxuICB9LCBbZ3JvdXBlZERhdGEsIGdyb3VwQnldKTtcblxuICBjb25zdCB0b2dnbGVHcm91cCA9IHVzZUNhbGxiYWNrKChrZXkpID0+IHtcbiAgICBzZXRFeHBhbmRlZEdyb3VwcygocHJldikgPT4ge1xuICAgICAgY29uc3QgbmV4dCA9IG5ldyBTZXQocHJldik7XG4gICAgICBpZiAobmV4dC5oYXMoa2V5KSkgbmV4dC5kZWxldGUoa2V5KTtcbiAgICAgIGVsc2UgbmV4dC5hZGQoa2V5KTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH0pO1xuICB9LCBbXSk7XG5cbiAgLy8gRmxhdHRlbiBmb3IgcGFnaW5hdGlvblxuICBjb25zdCBmbGF0Um93cyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghZ3JvdXBlZERhdGEpIHJldHVybiAoc2VydmVyU2lkZSA/IGRhdGEgOiBzb3J0ZWREYXRhKS5tYXAoKHJvdykgPT4gKHsgdHlwZTogXCJkYXRhXCIsIHJvdyB9KSk7XG5cbiAgICBjb25zdCBmbGF0ID0gW107XG4gICAgZ3JvdXBlZERhdGEuZm9yRWFjaCgoZ3JvdXApID0+IHtcbiAgICAgIGZsYXQucHVzaCh7IHR5cGU6IFwiZ3JvdXAtaGVhZGVyXCIsIGdyb3VwIH0pO1xuICAgICAgaWYgKGV4cGFuZGVkR3JvdXBzLmhhcyhncm91cC5rZXkpKSB7XG4gICAgICAgIGdyb3VwLnJvd3MuZm9yRWFjaCgocm93KSA9PiBmbGF0LnB1c2goeyB0eXBlOiBcImRhdGFcIiwgcm93IH0pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZmxhdDtcbiAgfSwgW2dyb3VwZWREYXRhLCBzb3J0ZWREYXRhLCBkYXRhLCBzZXJ2ZXJTaWRlLCBleHBhbmRlZEdyb3Vwc10pO1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBQYWdpbmF0ZVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY29uc3QgdG90YWxJdGVtcyA9IHNlcnZlclNpZGUgPyAodG90YWxDb3VudCB8fCBkYXRhLmxlbmd0aCkgOiBmbGF0Um93cy5sZW5ndGg7XG4gIGNvbnN0IHBhZ2VDb3VudCA9IE1hdGguY2VpbCh0b3RhbEl0ZW1zIC8gcGFnZVNpemUpO1xuXG4gIGxldCBkaXNwbGF5Um93cztcbiAgaWYgKHNlcnZlclNpZGUpIHtcbiAgICAvLyBTZXJ2ZXIgYWxyZWFkeSBwYWdpbmF0ZWQg4oCUIHJlbmRlciBkYXRhIGFzLWlzICh3aXRoIG9wdGlvbmFsIGdyb3VwaW5nKVxuICAgIGRpc3BsYXlSb3dzID0gZ3JvdXBCeVxuICAgICAgPyBmbGF0Um93c1xuICAgICAgOiBkYXRhLm1hcCgocm93KSA9PiAoeyB0eXBlOiBcImRhdGFcIiwgcm93IH0pKTtcbiAgfSBlbHNlIHtcbiAgICBkaXNwbGF5Um93cyA9IGZsYXRSb3dzLnNsaWNlKFxuICAgICAgKGFjdGl2ZVBhZ2UgLSAxKSAqIHBhZ2VTaXplLFxuICAgICAgYWN0aXZlUGFnZSAqIHBhZ2VTaXplXG4gICAgKTtcbiAgfVxuXG4gIC8vIEZvciBmb290ZXIgY2FsbGJhY2sg4oCUIHBhc3MgZnVsbCBmaWx0ZXJlZCBkYXRhIChjbGllbnQpIG9yIGN1cnJlbnQgcGFnZSAoc2VydmVyKVxuICBjb25zdCBmb290ZXJEYXRhID0gc2VydmVyU2lkZSA/IGRhdGEgOiBmaWx0ZXJlZERhdGE7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEZpbHRlciBjaGlwc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY29uc3QgYWN0aXZlQ2hpcHMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBjaGlwcyA9IFtdO1xuICAgIGZpbHRlcnMuZm9yRWFjaCgoZmlsdGVyKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGZpbHRlclZhbHVlc1tmaWx0ZXIubmFtZV07XG4gICAgICBpZiAoIWlzRmlsdGVyQWN0aXZlKGZpbHRlciwgdmFsdWUpKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IHR5cGUgPSBmaWx0ZXIudHlwZSB8fCBcInNlbGVjdFwiO1xuICAgICAgY29uc3QgcHJlZml4ID0gZmlsdGVyLmNoaXBMYWJlbCB8fCBmaWx0ZXIucGxhY2Vob2xkZXIgfHwgZmlsdGVyLm5hbWU7XG5cbiAgICAgIGlmICh0eXBlID09PSBcIm11bHRpc2VsZWN0XCIpIHtcbiAgICAgICAgY29uc3QgbGFiZWxzID0gdmFsdWVcbiAgICAgICAgICAubWFwKCh2KSA9PiBmaWx0ZXIub3B0aW9ucy5maW5kKChvKSA9PiBvLnZhbHVlID09PSB2KT8ubGFiZWwgfHwgdilcbiAgICAgICAgICAuam9pbihcIiwgXCIpO1xuICAgICAgICBjaGlwcy5wdXNoKHsga2V5OiBmaWx0ZXIubmFtZSwgbGFiZWw6IGAke3ByZWZpeH06ICR7bGFiZWxzfWAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwiZGF0ZVJhbmdlXCIpIHtcbiAgICAgICAgY29uc3QgcGFydHMgPSBbXTtcbiAgICAgICAgaWYgKHZhbHVlLmZyb20pIHBhcnRzLnB1c2goYGZyb20gJHtmb3JtYXREYXRlQ2hpcCh2YWx1ZS5mcm9tKX1gKTtcbiAgICAgICAgaWYgKHZhbHVlLnRvKSBwYXJ0cy5wdXNoKGB0byAke2Zvcm1hdERhdGVDaGlwKHZhbHVlLnRvKX1gKTtcbiAgICAgICAgY2hpcHMucHVzaCh7IGtleTogZmlsdGVyLm5hbWUsIGxhYmVsOiBgJHtwcmVmaXh9OiAke3BhcnRzLmpvaW4oXCIgXCIpfWAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBmaWx0ZXIub3B0aW9ucy5maW5kKChvKSA9PiBvLnZhbHVlID09PSB2YWx1ZSk7XG4gICAgICAgIGNoaXBzLnB1c2goeyBrZXk6IGZpbHRlci5uYW1lLCBsYWJlbDogYCR7cHJlZml4fTogJHtvcHRpb24/LmxhYmVsIHx8IHZhbHVlfWAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNoaXBzO1xuICB9LCBbZmlsdGVyVmFsdWVzLCBmaWx0ZXJzXSk7XG5cbiAgY29uc3QgaGFuZGxlRmlsdGVyUmVtb3ZlID0gdXNlQ2FsbGJhY2soKGtleSkgPT4ge1xuICAgIGlmIChrZXkgPT09IFwiYWxsXCIpIHtcbiAgICAgIGNvbnN0IGNsZWFyZWQgPSB7fTtcbiAgICAgIGZpbHRlcnMuZm9yRWFjaCgoZikgPT4geyBjbGVhcmVkW2YubmFtZV0gPSBnZXRFbXB0eUZpbHRlclZhbHVlKGYpOyB9KTtcbiAgICAgIHNldEZpbHRlclZhbHVlcyhjbGVhcmVkKTtcbiAgICAgIGlmIChzZXJ2ZXJTaWRlICYmIG9uRmlsdGVyQ2hhbmdlKSBvbkZpbHRlckNoYW5nZShjbGVhcmVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZmlsdGVyID0gZmlsdGVycy5maW5kKChmKSA9PiBmLm5hbWUgPT09IGtleSk7XG4gICAgICBjb25zdCBlbXB0eVZhbCA9IGZpbHRlciA/IGdldEVtcHR5RmlsdGVyVmFsdWUoZmlsdGVyKSA6IFwiXCI7XG4gICAgICBzZXRGaWx0ZXJWYWx1ZXMoKHByZXYpID0+IHtcbiAgICAgICAgY29uc3QgbmV4dCA9IHsgLi4ucHJldiwgW2tleV06IGVtcHR5VmFsIH07XG4gICAgICAgIGlmIChzZXJ2ZXJTaWRlICYmIG9uRmlsdGVyQ2hhbmdlKSBvbkZpbHRlckNoYW5nZShuZXh0KTtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIFtmaWx0ZXJzLCBzZXJ2ZXJTaWRlLCBvbkZpbHRlckNoYW5nZV0pO1xuXG4gIC8vIFJlY29yZCBjb3VudFxuICBjb25zdCBkaXNwbGF5Q291bnQgPSBzZXJ2ZXJTaWRlID8gKHRvdGFsQ291bnQgfHwgZGF0YS5sZW5ndGgpIDogZmlsdGVyZWREYXRhLmxlbmd0aDtcbiAgY29uc3QgdG90YWxEYXRhQ291bnQgPSBzZXJ2ZXJTaWRlID8gKHRvdGFsQ291bnQgfHwgZGF0YS5sZW5ndGgpIDogZGF0YS5sZW5ndGg7XG4gIGNvbnN0IHJlY29yZENvdW50TGFiZWwgPSByb3dDb3VudFRleHRcbiAgICA/IHJvd0NvdW50VGV4dChkaXNwbGF5Q291bnQsIHRvdGFsRGF0YUNvdW50KVxuICAgIDogZGlzcGxheUNvdW50ID09PSB0b3RhbERhdGFDb3VudFxuICAgICAgPyBgJHt0b3RhbERhdGFDb3VudH0gcmVjb3Jkc2BcbiAgICAgIDogYCR7ZGlzcGxheUNvdW50fSBvZiAke3RvdGFsRGF0YUNvdW50fSByZWNvcmRzYDtcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUm93IHNlbGVjdGlvblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY29uc3QgW3NlbGVjdGVkSWRzLCBzZXRTZWxlY3RlZElkc10gPSB1c2VTdGF0ZShuZXcgU2V0KCkpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHNlbGVjdGFibGUpIHNldFNlbGVjdGVkSWRzKG5ldyBTZXQoKSk7XG4gIH0sIFtzZWFyY2hUZXJtLCBmaWx0ZXJWYWx1ZXMsIHNlbGVjdGFibGVdKTtcblxuICBjb25zdCBoYW5kbGVTZWxlY3RSb3cgPSB1c2VDYWxsYmFjaygocm93SWQsIGNoZWNrZWQpID0+IHtcbiAgICBzZXRTZWxlY3RlZElkcygocHJldikgPT4ge1xuICAgICAgY29uc3QgbmV4dCA9IG5ldyBTZXQocHJldik7XG4gICAgICBpZiAoY2hlY2tlZCkgbmV4dC5hZGQocm93SWQpO1xuICAgICAgZWxzZSBuZXh0LmRlbGV0ZShyb3dJZCk7XG4gICAgICBpZiAob25TZWxlY3Rpb25DaGFuZ2UpIG9uU2VsZWN0aW9uQ2hhbmdlKFsuLi5uZXh0XSk7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9KTtcbiAgfSwgW29uU2VsZWN0aW9uQ2hhbmdlXSk7XG5cbiAgY29uc3QgaGFuZGxlU2VsZWN0QWxsID0gdXNlQ2FsbGJhY2soKGNoZWNrZWQpID0+IHtcbiAgICBjb25zdCB2aXNpYmxlSWRzID0gZGlzcGxheVJvd3NcbiAgICAgIC5maWx0ZXIoKHIpID0+IHIudHlwZSA9PT0gXCJkYXRhXCIpXG4gICAgICAubWFwKChyKSA9PiByLnJvd1tyb3dJZEZpZWxkXSk7XG4gICAgc2V0U2VsZWN0ZWRJZHMoKHByZXYpID0+IHtcbiAgICAgIGNvbnN0IG5leHQgPSBuZXcgU2V0KHByZXYpO1xuICAgICAgdmlzaWJsZUlkcy5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgICBpZiAoY2hlY2tlZCkgbmV4dC5hZGQoaWQpO1xuICAgICAgICBlbHNlIG5leHQuZGVsZXRlKGlkKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKG9uU2VsZWN0aW9uQ2hhbmdlKSBvblNlbGVjdGlvbkNoYW5nZShbLi4ubmV4dF0pO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfSk7XG4gIH0sIFtkaXNwbGF5Um93cywgcm93SWRGaWVsZCwgb25TZWxlY3Rpb25DaGFuZ2VdKTtcblxuICBjb25zdCBhbGxWaXNpYmxlU2VsZWN0ZWQgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCB2aXNpYmxlSWRzID0gZGlzcGxheVJvd3NcbiAgICAgIC5maWx0ZXIoKHIpID0+IHIudHlwZSA9PT0gXCJkYXRhXCIpXG4gICAgICAubWFwKChyKSA9PiByLnJvd1tyb3dJZEZpZWxkXSk7XG4gICAgcmV0dXJuIHZpc2libGVJZHMubGVuZ3RoID4gMCAmJiB2aXNpYmxlSWRzLmV2ZXJ5KChpZCkgPT4gc2VsZWN0ZWRJZHMuaGFzKGlkKSk7XG4gIH0sIFtkaXNwbGF5Um93cywgc2VsZWN0ZWRJZHMsIHJvd0lkRmllbGRdKTtcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW5saW5lIGVkaXRpbmdcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGNvbnN0IFtlZGl0aW5nQ2VsbCwgc2V0RWRpdGluZ0NlbGxdID0gdXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IFtlZGl0VmFsdWUsIHNldEVkaXRWYWx1ZV0gPSB1c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW2VkaXRFcnJvciwgc2V0RWRpdEVycm9yXSA9IHVzZVN0YXRlKG51bGwpO1xuXG4gIGNvbnN0IHN0YXJ0RWRpdGluZyA9IHVzZUNhbGxiYWNrKChyb3dJZCwgZmllbGQsIGN1cnJlbnRWYWx1ZSkgPT4ge1xuICAgIHNldEVkaXRpbmdDZWxsKHsgcm93SWQsIGZpZWxkIH0pO1xuICAgIHNldEVkaXRWYWx1ZShjdXJyZW50VmFsdWUpO1xuICAgIHNldEVkaXRFcnJvcihudWxsKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGNhbmNlbEVkaXQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgc2V0RWRpdGluZ0NlbGwobnVsbCk7XG4gICAgc2V0RWRpdFZhbHVlKG51bGwpO1xuICAgIHNldEVkaXRFcnJvcihudWxsKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGNvbW1pdEVkaXQgPSB1c2VDYWxsYmFjaygocm93LCBmaWVsZCwgdmFsdWUpID0+IHtcbiAgICBjb25zdCBjb2wgPSBjb2x1bW5zLmZpbmQoKGMpID0+IGMuZmllbGQgPT09IGZpZWxkKTtcbiAgICBpZiAoY29sPy5lZGl0VmFsaWRhdGUpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbC5lZGl0VmFsaWRhdGUodmFsdWUsIHJvdyk7XG4gICAgICBpZiAocmVzdWx0ICE9PSB0cnVlICYmIHJlc3VsdCAhPT0gdW5kZWZpbmVkICYmIHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICBzZXRFZGl0RXJyb3IodHlwZW9mIHJlc3VsdCA9PT0gXCJzdHJpbmdcIiA/IHJlc3VsdCA6IFwiSW52YWxpZCB2YWx1ZVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob25Sb3dFZGl0KSBvblJvd0VkaXQocm93LCBmaWVsZCwgdmFsdWUpO1xuICAgIHNldEVkaXRpbmdDZWxsKG51bGwpO1xuICAgIHNldEVkaXRWYWx1ZShudWxsKTtcbiAgICBzZXRFZGl0RXJyb3IobnVsbCk7XG4gIH0sIFtvblJvd0VkaXQsIGNvbHVtbnNdKTtcblxuICBjb25zdCByZW5kZXJFZGl0Q29udHJvbCA9IChjb2wsIHJvdykgPT4ge1xuICAgIGNvbnN0IHR5cGUgPSBjb2wuZWRpdFR5cGUgfHwgXCJ0ZXh0XCI7XG4gICAgY29uc3Qgcm93SWQgPSByb3dbcm93SWRGaWVsZF07XG4gICAgY29uc3QgZmllbGROYW1lID0gYGVkaXQtJHtyb3dJZH0tJHtjb2wuZmllbGR9YDtcbiAgICBjb25zdCBjb21taXQgPSAodmFsKSA9PiBjb21taXRFZGl0KHJvdywgY29sLmZpZWxkLCB2YWwpO1xuICAgIGNvbnN0IHVwZGF0ZSA9ICh2YWwpID0+IHtcbiAgICAgIHNldEVkaXRWYWx1ZSh2YWwpO1xuICAgICAgaWYgKG9uUm93RWRpdCkgb25Sb3dFZGl0KHJvdywgY29sLmZpZWxkLCB2YWwpO1xuICAgIH07XG4gICAgY29uc3QgZXhpdEVkaXQgPSAoKSA9PiB7XG4gICAgICBpZiAoZWRpdEVycm9yKSByZXR1cm47XG4gICAgICBzZXRFZGl0aW5nQ2VsbChudWxsKTtcbiAgICAgIHNldEVkaXRWYWx1ZShudWxsKTtcbiAgICB9O1xuICAgIGNvbnN0IGV4dHJhID0gY29sLmVkaXRQcm9wcyB8fCB7fTtcblxuICAgIC8vIFZhbGlkYXRpb24gcHJvcHMgZm9yIHRleHQtdHlwZSBpbnB1dHMgKGRpc2NyZXRlIG1vZGUpXG4gICAgY29uc3QgdmFsaWRhdGUgPSBjb2wuZWRpdFZhbGlkYXRlO1xuICAgIGNvbnN0IHZhbGlkYXRpb25Qcm9wcyA9IHZhbGlkYXRlICYmIGVkaXRFcnJvciA/IHsgZXJyb3I6IHRydWUsIHZhbGlkYXRpb25NZXNzYWdlOiBlZGl0RXJyb3IgfSA6IHt9O1xuICAgIGNvbnN0IG9uSW5wdXRWYWxpZGF0ZSA9IHZhbGlkYXRlXG4gICAgICA/ICh2YWwpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdmFsaWRhdGUodmFsLCByb3cpO1xuICAgICAgICBpZiAocmVzdWx0ICE9PSB0cnVlICYmIHJlc3VsdCAhPT0gdW5kZWZpbmVkICYmIHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgIHNldEVkaXRFcnJvcih0eXBlb2YgcmVzdWx0ID09PSBcInN0cmluZ1wiID8gcmVzdWx0IDogXCJJbnZhbGlkIHZhbHVlXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldEVkaXRFcnJvcihudWxsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgXCJ0ZXh0YXJlYVwiOlxuICAgICAgICByZXR1cm4gPFRleHRBcmVhIHsuLi5leHRyYX0gbmFtZT17ZmllbGROYW1lfSBsYWJlbD1cIlwiIHZhbHVlPXtlZGl0VmFsdWUgPz8gXCJcIn0gb25DaGFuZ2U9e3VwZGF0ZX0gb25CbHVyPXtleGl0RWRpdH0gey4uLnZhbGlkYXRpb25Qcm9wc30gb25JbnB1dD17b25JbnB1dFZhbGlkYXRlfSAvPjtcbiAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgcmV0dXJuIDxOdW1iZXJJbnB1dCB7Li4uZXh0cmF9IG5hbWU9e2ZpZWxkTmFtZX0gbGFiZWw9XCJcIiB2YWx1ZT17ZWRpdFZhbHVlfSBvbkNoYW5nZT17dXBkYXRlfSBvbkJsdXI9e2V4aXRFZGl0fSB7Li4udmFsaWRhdGlvblByb3BzfSBvbklucHV0PXtvbklucHV0VmFsaWRhdGV9IC8+O1xuICAgICAgY2FzZSBcImN1cnJlbmN5XCI6XG4gICAgICAgIHJldHVybiA8Q3VycmVuY3lJbnB1dCBjdXJyZW5jeUNvZGU9XCJVU0RcIiB7Li4uZXh0cmF9IG5hbWU9e2ZpZWxkTmFtZX0gbGFiZWw9XCJcIiB2YWx1ZT17ZWRpdFZhbHVlfSBvbkNoYW5nZT17dXBkYXRlfSBvbkJsdXI9e2V4aXRFZGl0fSB7Li4udmFsaWRhdGlvblByb3BzfSBvbklucHV0PXtvbklucHV0VmFsaWRhdGV9IC8+O1xuICAgICAgY2FzZSBcInN0ZXBwZXJcIjpcbiAgICAgICAgcmV0dXJuIDxTdGVwcGVySW5wdXQgey4uLmV4dHJhfSBuYW1lPXtmaWVsZE5hbWV9IGxhYmVsPVwiXCIgdmFsdWU9e2VkaXRWYWx1ZX0gb25DaGFuZ2U9e3VwZGF0ZX0gb25CbHVyPXtleGl0RWRpdH0gey4uLnZhbGlkYXRpb25Qcm9wc30gb25JbnB1dD17b25JbnB1dFZhbGlkYXRlfSAvPjtcbiAgICAgIGNhc2UgXCJzZWxlY3RcIjpcbiAgICAgICAgcmV0dXJuIDxTZWxlY3QgdmFyaWFudD1cInRyYW5zcGFyZW50XCIgey4uLmV4dHJhfSBuYW1lPXtmaWVsZE5hbWV9IGxhYmVsPVwiXCIgdmFsdWU9e2VkaXRWYWx1ZX0gb25DaGFuZ2U9e2NvbW1pdH0gb3B0aW9ucz17cmVzb2x2ZUVkaXRPcHRpb25zKGNvbCwgZGF0YSl9IC8+O1xuICAgICAgY2FzZSBcIm11bHRpc2VsZWN0XCI6XG4gICAgICAgIHJldHVybiA8TXVsdGlTZWxlY3Qgey4uLmV4dHJhfSBuYW1lPXtmaWVsZE5hbWV9IGxhYmVsPVwiXCIgdmFsdWU9e2VkaXRWYWx1ZSB8fCBbXX0gb25DaGFuZ2U9e2NvbW1pdH0gb3B0aW9ucz17cmVzb2x2ZUVkaXRPcHRpb25zKGNvbCwgZGF0YSl9IC8+O1xuICAgICAgY2FzZSBcImRhdGVcIjpcbiAgICAgICAgcmV0dXJuIDxEYXRlSW5wdXQgey4uLmV4dHJhfSBuYW1lPXtmaWVsZE5hbWV9IGxhYmVsPVwiXCIgdmFsdWU9e2VkaXRWYWx1ZX0gb25DaGFuZ2U9e2NvbW1pdH0gLz47XG4gICAgICBjYXNlIFwidG9nZ2xlXCI6XG4gICAgICAgIHJldHVybiA8VG9nZ2xlIHsuLi5leHRyYX0gbmFtZT17ZmllbGROYW1lfSBsYWJlbD1cIlwiIGNoZWNrZWQ9eyEhZWRpdFZhbHVlfSBvbkNoYW5nZT17Y29tbWl0fSAvPjtcbiAgICAgIGNhc2UgXCJjaGVja2JveFwiOlxuICAgICAgICByZXR1cm4gPENoZWNrYm94IHsuLi5leHRyYX0gbmFtZT17ZmllbGROYW1lfSBjaGVja2VkPXshIWVkaXRWYWx1ZX0gb25DaGFuZ2U9e2NvbW1pdH0gLz47XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gPElucHV0IHsuLi5leHRyYX0gbmFtZT17ZmllbGROYW1lfSBsYWJlbD1cIlwiIHZhbHVlPXtlZGl0VmFsdWUgPz8gXCJcIn0gb25DaGFuZ2U9e3VwZGF0ZX0gb25CbHVyPXtleGl0RWRpdH0gey4uLnZhbGlkYXRpb25Qcm9wc30gb25JbnB1dD17b25JbnB1dFZhbGlkYXRlfSAvPjtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVzb2x2ZWRFZGl0TW9kZSA9IGVkaXRNb2RlIHx8IChjb2x1bW5zLnNvbWUoKGNvbCkgPT4gY29sLmVkaXRhYmxlKSA/IFwiZGlzY3JldGVcIiA6IG51bGwpO1xuICBjb25zdCB1c2VDb2x1bW5SZW5kZXJpbmcgPSBzZWxlY3RhYmxlIHx8ICEhcmVzb2x2ZWRFZGl0TW9kZSB8fCAhcmVuZGVyUm93O1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBBdXRvLXdpZHRoIGNvbXB1dGF0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBjb25zdCBhdXRvV2lkdGhzID0gdXNlTWVtbyhcbiAgICAoKSA9PiBhdXRvV2lkdGggPyBjb21wdXRlQXV0b1dpZHRocyhjb2x1bW5zLCBkYXRhKSA6IHt9LFxuICAgIFtjb2x1bW5zLCBkYXRhLCBhdXRvV2lkdGhdXG4gICk7XG5cbiAgY29uc3QgZ2V0SGVhZGVyV2lkdGggPSAoY29sKSA9PiBjb2wud2lkdGggfHwgYXV0b1dpZHRoc1tjb2wuZmllbGRdPy53aWR0aCB8fCBcImF1dG9cIjtcbiAgY29uc3QgZ2V0Q2VsbFdpZHRoID0gKGNvbCkgPT4gY29sLmNlbGxXaWR0aCB8fCBjb2wud2lkdGggfHwgYXV0b1dpZHRoc1tjb2wuZmllbGRdPy5jZWxsV2lkdGggfHwgXCJhdXRvXCI7XG5cbiAgLy8gUGVyLWNlbGwgZXJyb3IgdHJhY2tpbmcgZm9yIGlubGluZSBtb2RlIChtdWx0aXBsZSBjZWxscyBlZGl0YWJsZSBhdCBvbmNlKVxuICBjb25zdCBbaW5saW5lRXJyb3JzLCBzZXRJbmxpbmVFcnJvcnNdID0gdXNlU3RhdGUoe30pO1xuXG4gIGNvbnN0IHJlbmRlcklubGluZUNvbnRyb2wgPSAoY29sLCByb3cpID0+IHtcbiAgICBjb25zdCB0eXBlID0gY29sLmVkaXRUeXBlIHx8IFwidGV4dFwiO1xuICAgIGNvbnN0IHJvd0lkID0gcm93W3Jvd0lkRmllbGRdO1xuICAgIGNvbnN0IGZpZWxkTmFtZSA9IGBpbmxpbmUtJHtyb3dJZH0tJHtjb2wuZmllbGR9YDtcbiAgICBjb25zdCBjZWxsS2V5ID0gYCR7cm93SWR9LSR7Y29sLmZpZWxkfWA7XG4gICAgY29uc3QgdmFsdWUgPSByb3dbY29sLmZpZWxkXTtcbiAgICBjb25zdCB2YWxpZGF0ZSA9IGNvbC5lZGl0VmFsaWRhdGU7XG5cbiAgICBjb25zdCBmaXJlID0gKHZhbCkgPT4ge1xuICAgICAgaWYgKHZhbGlkYXRlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHZhbGlkYXRlKHZhbCwgcm93KTtcbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSAmJiByZXN1bHQgIT09IHVuZGVmaW5lZCAmJiByZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICBzZXRJbmxpbmVFcnJvcnMoKHByZXYpID0+ICh7IC4uLnByZXYsIFtjZWxsS2V5XTogdHlwZW9mIHJlc3VsdCA9PT0gXCJzdHJpbmdcIiA/IHJlc3VsdCA6IFwiSW52YWxpZCB2YWx1ZVwiIH0pKTtcbiAgICAgICAgICByZXR1cm47IC8vIEJsb2NrIHRoZSBlZGl0XG4gICAgICAgIH1cbiAgICAgICAgc2V0SW5saW5lRXJyb3JzKChwcmV2KSA9PiB7IGNvbnN0IG5leHQgPSB7IC4uLnByZXYgfTsgZGVsZXRlIG5leHRbY2VsbEtleV07IHJldHVybiBuZXh0OyB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChvblJvd0VkaXQpIG9uUm93RWRpdChyb3csIGNvbC5maWVsZCwgdmFsKTtcbiAgICB9O1xuICAgIGNvbnN0IGV4dHJhID0gY29sLmVkaXRQcm9wcyB8fCB7fTtcbiAgICBjb25zdCBjZWxsRXJyb3IgPSBpbmxpbmVFcnJvcnNbY2VsbEtleV07XG4gICAgY29uc3QgdmFsaWRhdGlvblByb3BzID0gY2VsbEVycm9yID8geyBlcnJvcjogdHJ1ZSwgdmFsaWRhdGlvbk1lc3NhZ2U6IGNlbGxFcnJvciB9IDoge307XG4gICAgY29uc3Qgb25JbnB1dFZhbGlkYXRlID0gdmFsaWRhdGVcbiAgICAgID8gKHZhbCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB2YWxpZGF0ZSh2YWwsIHJvdyk7XG4gICAgICAgIGlmIChyZXN1bHQgIT09IHRydWUgJiYgcmVzdWx0ICE9PSB1bmRlZmluZWQgJiYgcmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgc2V0SW5saW5lRXJyb3JzKChwcmV2KSA9PiAoeyAuLi5wcmV2LCBbY2VsbEtleV06IHR5cGVvZiByZXN1bHQgPT09IFwic3RyaW5nXCIgPyByZXN1bHQgOiBcIkludmFsaWQgdmFsdWVcIiB9KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0SW5saW5lRXJyb3JzKChwcmV2KSA9PiB7IGNvbnN0IG5leHQgPSB7IC4uLnByZXYgfTsgZGVsZXRlIG5leHRbY2VsbEtleV07IHJldHVybiBuZXh0OyB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgXCJ0ZXh0YXJlYVwiOlxuICAgICAgICByZXR1cm4gPFRleHRBcmVhIHsuLi5leHRyYX0gbmFtZT17ZmllbGROYW1lfSBsYWJlbD1cIlwiIHZhbHVlPXt2YWx1ZSA/PyBcIlwifSBvbkNoYW5nZT17ZmlyZX0gey4uLnZhbGlkYXRpb25Qcm9wc30gb25JbnB1dD17b25JbnB1dFZhbGlkYXRlfSAvPjtcbiAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgcmV0dXJuIDxOdW1iZXJJbnB1dCB7Li4uZXh0cmF9IG5hbWU9e2ZpZWxkTmFtZX0gbGFiZWw9XCJcIiB2YWx1ZT17dmFsdWV9IG9uQ2hhbmdlPXtmaXJlfSB7Li4udmFsaWRhdGlvblByb3BzfSBvbklucHV0PXtvbklucHV0VmFsaWRhdGV9IC8+O1xuICAgICAgY2FzZSBcImN1cnJlbmN5XCI6XG4gICAgICAgIHJldHVybiA8Q3VycmVuY3lJbnB1dCBjdXJyZW5jeUNvZGU9XCJVU0RcIiB7Li4uZXh0cmF9IG5hbWU9e2ZpZWxkTmFtZX0gbGFiZWw9XCJcIiB2YWx1ZT17dmFsdWV9IG9uQ2hhbmdlPXtmaXJlfSB7Li4udmFsaWRhdGlvblByb3BzfSBvbklucHV0PXtvbklucHV0VmFsaWRhdGV9IC8+O1xuICAgICAgY2FzZSBcInN0ZXBwZXJcIjpcbiAgICAgICAgcmV0dXJuIDxTdGVwcGVySW5wdXQgey4uLmV4dHJhfSBuYW1lPXtmaWVsZE5hbWV9IGxhYmVsPVwiXCIgdmFsdWU9e3ZhbHVlfSBvbkNoYW5nZT17ZmlyZX0gey4uLnZhbGlkYXRpb25Qcm9wc30gb25JbnB1dD17b25JbnB1dFZhbGlkYXRlfSAvPjtcbiAgICAgIGNhc2UgXCJzZWxlY3RcIjpcbiAgICAgICAgcmV0dXJuIDxTZWxlY3QgdmFyaWFudD1cInRyYW5zcGFyZW50XCIgey4uLmV4dHJhfSBuYW1lPXtmaWVsZE5hbWV9IGxhYmVsPVwiXCIgdmFsdWU9e3ZhbHVlfSBvbkNoYW5nZT17ZmlyZX0gb3B0aW9ucz17cmVzb2x2ZUVkaXRPcHRpb25zKGNvbCwgZGF0YSl9IC8+O1xuICAgICAgY2FzZSBcIm11bHRpc2VsZWN0XCI6XG4gICAgICAgIHJldHVybiA8TXVsdGlTZWxlY3Qgey4uLmV4dHJhfSBuYW1lPXtmaWVsZE5hbWV9IGxhYmVsPVwiXCIgdmFsdWU9e3ZhbHVlIHx8IFtdfSBvbkNoYW5nZT17ZmlyZX0gb3B0aW9ucz17cmVzb2x2ZUVkaXRPcHRpb25zKGNvbCwgZGF0YSl9IC8+O1xuICAgICAgY2FzZSBcImRhdGVcIjpcbiAgICAgICAgcmV0dXJuIDxEYXRlSW5wdXQgey4uLmV4dHJhfSBuYW1lPXtmaWVsZE5hbWV9IGxhYmVsPVwiXCIgdmFsdWU9e3ZhbHVlfSBvbkNoYW5nZT17ZmlyZX0gLz47XG4gICAgICBjYXNlIFwidG9nZ2xlXCI6XG4gICAgICAgIHJldHVybiA8VG9nZ2xlIHsuLi5leHRyYX0gbmFtZT17ZmllbGROYW1lfSBsYWJlbD1cIlwiIGNoZWNrZWQ9eyEhdmFsdWV9IG9uQ2hhbmdlPXtmaXJlfSAvPjtcbiAgICAgIGNhc2UgXCJjaGVja2JveFwiOlxuICAgICAgICByZXR1cm4gPENoZWNrYm94IHsuLi5leHRyYX0gbmFtZT17ZmllbGROYW1lfSBjaGVja2VkPXshIXZhbHVlfSBvbkNoYW5nZT17ZmlyZX0gLz47XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gPElucHV0IHsuLi5leHRyYX0gbmFtZT17ZmllbGROYW1lfSBsYWJlbD1cIlwiIHZhbHVlPXt2YWx1ZSA/PyBcIlwifSBvbkNoYW5nZT17ZmlyZX0gey4uLnZhbGlkYXRpb25Qcm9wc30gb25JbnB1dD17b25JbnB1dFZhbGlkYXRlfSAvPjtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyQ2VsbENvbnRlbnQgPSAocm93LCBjb2wpID0+IHtcbiAgICBjb25zdCByb3dJZCA9IHJvd1tyb3dJZEZpZWxkXTtcblxuICAgIC8vIElubGluZSBtb2RlOiBlZGl0YWJsZSBjZWxscyBhbHdheXMgc2hvdyB0aGVpciBpbnB1dFxuICAgIGlmIChyZXNvbHZlZEVkaXRNb2RlID09PSBcImlubGluZVwiICYmIGNvbC5lZGl0YWJsZSkge1xuICAgICAgcmV0dXJuIHJlbmRlcklubGluZUNvbnRyb2woY29sLCByb3cpO1xuICAgIH1cblxuICAgIC8vIERpc2NyZXRlIG1vZGU6IGNsaWNrLXRvLWVkaXRcbiAgICBjb25zdCBpc0VkaXRpbmcgPVxuICAgICAgZWRpdGluZ0NlbGw/LnJvd0lkID09PSByb3dJZCAmJiBlZGl0aW5nQ2VsbD8uZmllbGQgPT09IGNvbC5maWVsZDtcblxuICAgIGlmIChpc0VkaXRpbmcgJiYgY29sLmVkaXRhYmxlKSByZXR1cm4gcmVuZGVyRWRpdENvbnRyb2woY29sLCByb3cpO1xuXG4gICAgY29uc3QgY29udGVudCA9IGNvbC5yZW5kZXJDZWxsXG4gICAgICA/IGNvbC5yZW5kZXJDZWxsKHJvd1tjb2wuZmllbGRdLCByb3cpXG4gICAgICA6IHJvd1tjb2wuZmllbGRdID8/IFwiXCI7XG5cbiAgICBpZiAoY29sLmVkaXRhYmxlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8TGlua1xuICAgICAgICAgIHZhcmlhbnQ9XCJkYXJrXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzdGFydEVkaXRpbmcocm93SWQsIGNvbC5maWVsZCwgcm93W2NvbC5maWVsZF0pfVxuICAgICAgICA+XG4gICAgICAgICAge2NvbnRlbnQgfHwgXCJcXHUyMDE0XCJ9XG4gICAgICAgIDwvTGluaz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH07XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlciBmaWx0ZXIgY29udHJvbHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGNvbnN0IHJlbmRlckZpbHRlckNvbnRyb2wgPSAoZmlsdGVyKSA9PiB7XG4gICAgY29uc3QgdHlwZSA9IGZpbHRlci50eXBlIHx8IFwic2VsZWN0XCI7XG5cbiAgICBpZiAodHlwZSA9PT0gXCJtdWx0aXNlbGVjdFwiKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8TXVsdGlTZWxlY3RcbiAgICAgICAgICBrZXk9e2ZpbHRlci5uYW1lfVxuICAgICAgICAgIG5hbWU9e2BmaWx0ZXItJHtmaWx0ZXIubmFtZX1gfVxuICAgICAgICAgIGxhYmVsPVwiXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj17ZmlsdGVyLnBsYWNlaG9sZGVyIHx8IFwiQWxsXCJ9XG4gICAgICAgICAgdmFsdWU9e2ZpbHRlclZhbHVlc1tmaWx0ZXIubmFtZV0gfHwgW119XG4gICAgICAgICAgb25DaGFuZ2U9eyh2YWwpID0+IGhhbmRsZUZpbHRlckNoYW5nZShmaWx0ZXIubmFtZSwgdmFsKX1cbiAgICAgICAgICBvcHRpb25zPXtmaWx0ZXIub3B0aW9uc31cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09IFwiZGF0ZVJhbmdlXCIpIHtcbiAgICAgIGNvbnN0IHJhbmdlVmFsID0gZmlsdGVyVmFsdWVzW2ZpbHRlci5uYW1lXSB8fCB7IGZyb206IG51bGwsIHRvOiBudWxsIH07XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RmxleCBrZXk9e2ZpbHRlci5uYW1lfSBkaXJlY3Rpb249XCJyb3dcIiBhbGlnbj1cImVuZFwiIGdhcD1cInhzXCI+XG4gICAgICAgICAgPERhdGVJbnB1dFxuICAgICAgICAgICAgbmFtZT17YGZpbHRlci0ke2ZpbHRlci5uYW1lfS1mcm9tYH1cbiAgICAgICAgICAgIGxhYmVsPVwiXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRnJvbVwiXG4gICAgICAgICAgICBmb3JtYXQ9XCJtZWRpdW1cIlxuICAgICAgICAgICAgdmFsdWU9e3JhbmdlVmFsLmZyb219XG4gICAgICAgICAgICBvbkNoYW5nZT17KHZhbCkgPT5cbiAgICAgICAgICAgICAgaGFuZGxlRmlsdGVyQ2hhbmdlKGZpbHRlci5uYW1lLCB7IC4uLnJhbmdlVmFsLCBmcm9tOiB2YWwgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxUZXh0IHZhcmlhbnQ9XCJtaWNyb2NvcHlcIj50bzwvVGV4dD5cbiAgICAgICAgICA8RGF0ZUlucHV0XG4gICAgICAgICAgICBuYW1lPXtgZmlsdGVyLSR7ZmlsdGVyLm5hbWV9LXRvYH1cbiAgICAgICAgICAgIGxhYmVsPVwiXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVG9cIlxuICAgICAgICAgICAgZm9ybWF0PVwibWVkaXVtXCJcbiAgICAgICAgICAgIHZhbHVlPXtyYW5nZVZhbC50b31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsKSA9PlxuICAgICAgICAgICAgICBoYW5kbGVGaWx0ZXJDaGFuZ2UoZmlsdGVyLm5hbWUsIHsgLi4ucmFuZ2VWYWwsIHRvOiB2YWwgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0ZsZXg+XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIERlZmF1bHQ6IHNpbmdsZSBzZWxlY3RcbiAgICByZXR1cm4gKFxuICAgICAgPFNlbGVjdFxuICAgICAgICBrZXk9e2ZpbHRlci5uYW1lfVxuICAgICAgICBuYW1lPXtgZmlsdGVyLSR7ZmlsdGVyLm5hbWV9YH1cbiAgICAgICAgdmFyaWFudD1cInRyYW5zcGFyZW50XCJcbiAgICAgICAgcGxhY2Vob2xkZXI9e2ZpbHRlci5wbGFjZWhvbGRlciB8fCBcIkFsbFwifVxuICAgICAgICB2YWx1ZT17ZmlsdGVyVmFsdWVzW2ZpbHRlci5uYW1lXX1cbiAgICAgICAgb25DaGFuZ2U9eyh2YWwpID0+IGhhbmRsZUZpbHRlckNoYW5nZShmaWx0ZXIubmFtZSwgdmFsKX1cbiAgICAgICAgb3B0aW9ucz17W1xuICAgICAgICAgIHsgbGFiZWw6IGZpbHRlci5wbGFjZWhvbGRlciB8fCBcIkFsbFwiLCB2YWx1ZTogXCJcIiB9LFxuICAgICAgICAgIC4uLmZpbHRlci5vcHRpb25zLFxuICAgICAgICBdfVxuICAgICAgLz5cbiAgICApO1xuICB9O1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIHJldHVybiAoXG4gICAgPEZsZXggZGlyZWN0aW9uPVwiY29sdW1uXCIgZ2FwPVwieHNcIj5cbiAgICAgIHsvKiBUb29sYmFyICovfVxuICAgICAgPEZsZXggZGlyZWN0aW9uPVwiY29sdW1uXCIgZ2FwPVwic21cIj5cbiAgICAgICAgey8qIFJvdyAxOiBTZWFyY2ggKyBmaXJzdCAyIGZpbHRlcnMgKyBGaWx0ZXJzIHRvZ2dsZSAqL31cbiAgICAgICAgPEZsZXggZGlyZWN0aW9uPVwicm93XCIgYWxpZ249XCJjZW50ZXJcIiBnYXA9XCJzbVwiIHdyYXA9XCJ3cmFwXCI+XG4gICAgICAgICAge3NlYXJjaEZpZWxkcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgIDxTZWFyY2hJbnB1dFxuICAgICAgICAgICAgICBuYW1lPVwiZGF0YXRhYmxlLXNlYXJjaFwiXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtzZWFyY2hQbGFjZWhvbGRlcn1cbiAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaFRlcm19XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVTZWFyY2hDaGFuZ2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAge2ZpbHRlcnMuc2xpY2UoMCwgMikubWFwKHJlbmRlckZpbHRlckNvbnRyb2wpfVxuICAgICAgICAgIHtmaWx0ZXJzLmxlbmd0aCA+IDIgJiYgKFxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICB2YXJpYW50PVwidHJhbnNwYXJlbnRcIlxuICAgICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTaG93TW9yZUZpbHRlcnMoKHByZXYpID0+ICFwcmV2KX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPEljb24gbmFtZT1cImZpbHRlclwiIHNpemU9XCJzbVwiIC8+IEZpbHRlcnNcbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICl9XG4gICAgICAgICAgey8qIFJlY29yZCBjb3VudCDigJQgYWx3YXlzIG9uIHJvdyAxIHdoZW4gbm8gY2hpcHMgKi99XG4gICAgICAgICAge3Nob3dSb3dDb3VudCAmJiBhY3RpdmVDaGlwcy5sZW5ndGggPT09IDAgJiYgZGlzcGxheUNvdW50ID4gMCAmJiAoXG4gICAgICAgICAgICA8Qm94IGZsZXg9ezF9PlxuICAgICAgICAgICAgICA8RmxleCBkaXJlY3Rpb249XCJyb3dcIiBqdXN0aWZ5PVwiZW5kXCI+XG4gICAgICAgICAgICAgICAgPFRleHQgdmFyaWFudD1cIm1pY3JvY29weVwiIGZvcm1hdD17cm93Q291bnRCb2xkID8geyBmb250V2VpZ2h0OiBcImJvbGRcIiB9IDogdW5kZWZpbmVkfT57cmVjb3JkQ291bnRMYWJlbH08L1RleHQ+XG4gICAgICAgICAgICAgIDwvRmxleD5cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvRmxleD5cblxuICAgICAgICB7LyogUm93IDI6IEFkZGl0aW9uYWwgZmlsdGVycyAodG9nZ2xlZCkgKi99XG4gICAgICAgIHtzaG93TW9yZUZpbHRlcnMgJiYgZmlsdGVycy5sZW5ndGggPiAyICYmIChcbiAgICAgICAgICA8RmxleCBkaXJlY3Rpb249XCJyb3dcIiBhbGlnbj1cImVuZFwiIGdhcD1cInNtXCIgd3JhcD1cIndyYXBcIj5cbiAgICAgICAgICAgIHtmaWx0ZXJzLnNsaWNlKDIpLm1hcChyZW5kZXJGaWx0ZXJDb250cm9sKX1cbiAgICAgICAgICA8L0ZsZXg+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIEFjdGl2ZSBmaWx0ZXIgY2hpcHMgKi99XG4gICAgICAgIHthY3RpdmVDaGlwcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICA8RmxleCBkaXJlY3Rpb249XCJyb3dcIiBhbGlnbj1cImNlbnRlclwiIGdhcD1cInNtXCIgd3JhcD1cIndyYXBcIj5cbiAgICAgICAgICAgIHthY3RpdmVDaGlwcy5tYXAoKGNoaXApID0+IChcbiAgICAgICAgICAgICAgPFRhZyBrZXk9e2NoaXAua2V5fSB2YXJpYW50PVwiZGVmYXVsdFwiIG9uRGVsZXRlPXsoKSA9PiBoYW5kbGVGaWx0ZXJSZW1vdmUoY2hpcC5rZXkpfT5cbiAgICAgICAgICAgICAgICB7Y2hpcC5sYWJlbH1cbiAgICAgICAgICAgICAgPC9UYWc+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgdmFyaWFudD1cInRyYW5zcGFyZW50XCJcbiAgICAgICAgICAgICAgc2l6ZT1cImV4dHJhLXNtYWxsXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlRmlsdGVyUmVtb3ZlKFwiYWxsXCIpfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBDbGVhciBhbGxcbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAge3Nob3dSb3dDb3VudCAmJiBkaXNwbGF5Q291bnQgPiAwICYmIChcbiAgICAgICAgICAgICAgPEJveCBmbGV4PXsxfT5cbiAgICAgICAgICAgICAgICA8RmxleCBkaXJlY3Rpb249XCJyb3dcIiBqdXN0aWZ5PVwiZW5kXCI+XG4gICAgICAgICAgICAgICAgICA8VGV4dCB2YXJpYW50PVwibWljcm9jb3B5XCIgZm9ybWF0PXtyb3dDb3VudEJvbGQgPyB7IGZvbnRXZWlnaHQ6IFwiYm9sZFwiIH0gOiB1bmRlZmluZWR9PntyZWNvcmRDb3VudExhYmVsfTwvVGV4dD5cbiAgICAgICAgICAgICAgICA8L0ZsZXg+XG4gICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L0ZsZXg+XG4gICAgICAgICl9XG4gICAgICA8L0ZsZXg+XG5cbiAgICAgIHsvKiBUYWJsZSBvciBlbXB0eSBzdGF0ZSAqL31cbiAgICAgIHtkaXNwbGF5Um93cy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgIDxFbXB0eVN0YXRlIHRpdGxlPXtlbXB0eVRpdGxlfT5cbiAgICAgICAgICA8VGV4dD57ZW1wdHlNZXNzYWdlfTwvVGV4dD5cbiAgICAgICAgPC9FbXB0eVN0YXRlPlxuICAgICAgKSA6IChcbiAgICAgICAgPFRhYmxlXG4gICAgICAgICAgYm9yZGVyZWQ9e2JvcmRlcmVkfVxuICAgICAgICAgIGZsdXNoPXtmbHVzaH1cbiAgICAgICAgICBwYWdpbmF0ZWQ9e3BhZ2VDb3VudCA+IDF9XG4gICAgICAgICAgcGFnZT17YWN0aXZlUGFnZX1cbiAgICAgICAgICBwYWdlQ291bnQ9e3BhZ2VDb3VudH1cbiAgICAgICAgICBvblBhZ2VDaGFuZ2U9e2hhbmRsZVBhZ2VDaGFuZ2V9XG4gICAgICAgICAgc2hvd0ZpcnN0TGFzdEJ1dHRvbnM9e3Nob3dGaXJzdExhc3RCdXR0b25zICE9IG51bGwgPyBzaG93Rmlyc3RMYXN0QnV0dG9ucyA6IHBhZ2VDb3VudCA+IDV9XG4gICAgICAgICAgc2hvd0J1dHRvbkxhYmVscz17c2hvd0J1dHRvbkxhYmVsc31cbiAgICAgICAgICB7Li4uKG1heFZpc2libGVQYWdlQnV0dG9ucyAhPSBudWxsID8geyBtYXhWaXNpYmxlUGFnZUJ1dHRvbnMgfSA6IHt9KX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUYWJsZUhlYWQ+XG4gICAgICAgICAgICA8VGFibGVSb3c+XG4gICAgICAgICAgICAgIHtzZWxlY3RhYmxlICYmIChcbiAgICAgICAgICAgICAgICA8VGFibGVIZWFkZXIgd2lkdGg9XCJtaW5cIj5cbiAgICAgICAgICAgICAgICAgIDxDaGVja2JveFxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwiZGF0YXRhYmxlLXNlbGVjdC1hbGxcIlxuICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiU2VsZWN0IGFsbCByb3dzXCJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17YWxsVmlzaWJsZVNlbGVjdGVkfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlU2VsZWN0QWxsfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L1RhYmxlSGVhZGVyPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICB7Y29sdW1ucy5tYXAoKGNvbCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlckFsaWduID0gKHJlc29sdmVkRWRpdE1vZGUgPT09IFwiaW5saW5lXCIgJiYgY29sLmVkaXRhYmxlKSA/IHVuZGVmaW5lZCA6IGNvbC5hbGlnbjtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPFRhYmxlSGVhZGVyXG4gICAgICAgICAgICAgICAgICAgIGtleT17Y29sLmZpZWxkfVxuICAgICAgICAgICAgICAgICAgICB3aWR0aD17Z2V0SGVhZGVyV2lkdGgoY29sKX1cbiAgICAgICAgICAgICAgICAgICAgYWxpZ249e2hlYWRlckFsaWdufVxuICAgICAgICAgICAgICAgICAgICBzb3J0RGlyZWN0aW9uPXtjb2wuc29ydGFibGUgPyAoc29ydFN0YXRlW2NvbC5maWVsZF0gfHwgXCJub25lXCIpIDogXCJuZXZlclwifVxuICAgICAgICAgICAgICAgICAgICBvblNvcnRDaGFuZ2U9e2NvbC5zb3J0YWJsZSA/ICgpID0+IGhhbmRsZVNvcnRDaGFuZ2UoY29sLmZpZWxkKSA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge2NvbC5sYWJlbH1cbiAgICAgICAgICAgICAgICAgIDwvVGFibGVIZWFkZXI+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L1RhYmxlUm93PlxuICAgICAgICAgIDwvVGFibGVIZWFkPlxuICAgICAgICAgIDxUYWJsZUJvZHk+XG4gICAgICAgICAgICB7ZGlzcGxheVJvd3MubWFwKChpdGVtLCBpZHgpID0+XG4gICAgICAgICAgICAgIGl0ZW0udHlwZSA9PT0gXCJncm91cC1oZWFkZXJcIiA/IChcbiAgICAgICAgICAgICAgICA8VGFibGVSb3cga2V5PXtgZ3JvdXAtJHtpdGVtLmdyb3VwLmtleX1gfT5cbiAgICAgICAgICAgICAgICAgIHtzZWxlY3RhYmxlICYmIDxUYWJsZUNlbGwgd2lkdGg9XCJtaW5cIiAvPn1cbiAgICAgICAgICAgICAgICAgIHtjb2x1bW5zLm1hcCgoY29sLCBjb2xJZHgpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPFRhYmxlQ2VsbCBrZXk9e2NvbC5maWVsZH0gd2lkdGg9e2dldENlbGxXaWR0aChjb2wpfSBhbGlnbj17Y29sSWR4ID09PSAwID8gdW5kZWZpbmVkIDogY29sLmFsaWdufT5cbiAgICAgICAgICAgICAgICAgICAgICB7Y29sSWR4ID09PSAwID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPExpbmtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImRhcmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0b2dnbGVHcm91cChpdGVtLmdyb3VwLmtleSl9XG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxGbGV4IGRpcmVjdGlvbj1cInJvd1wiIGFsaWduPVwiY2VudGVyXCIgZ2FwPVwieHNcIiB3cmFwPVwibm93cmFwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEljb24gbmFtZT17ZXhwYW5kZWRHcm91cHMuaGFzKGl0ZW0uZ3JvdXAua2V5KSA/IFwiZG93bkNhcmF0XCIgOiBcInJpZ2h0XCJ9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRleHQgZm9ybWF0PXt7IGZvbnRXZWlnaHQ6IFwiZGVtaWJvbGRcIiB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLmdyb3VwLmxhYmVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9GbGV4PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cEJ5LmFnZ3JlZ2F0aW9ucz8uW2NvbC5maWVsZF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPyBncm91cEJ5LmFnZ3JlZ2F0aW9uc1tjb2wuZmllbGRdKGl0ZW0uZ3JvdXAucm93cywgaXRlbS5ncm91cC5rZXkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDogZ3JvdXBCeS5ncm91cFZhbHVlcz8uW2l0ZW0uZ3JvdXAua2V5XT8uW2NvbC5maWVsZF0gPz8gXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIDwvVGFibGVDZWxsPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC9UYWJsZVJvdz5cbiAgICAgICAgICAgICAgKSA6IHVzZUNvbHVtblJlbmRlcmluZyA/IChcbiAgICAgICAgICAgICAgICA8VGFibGVSb3cga2V5PXtpdGVtLnJvd1tyb3dJZEZpZWxkXSA/PyBpZHh9PlxuICAgICAgICAgICAgICAgICAge3NlbGVjdGFibGUgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8VGFibGVDZWxsIHdpZHRoPVwibWluXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPENoZWNrYm94XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lPXtgc2VsZWN0LSR7aXRlbS5yb3dbcm93SWRGaWVsZF19YH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJTZWxlY3Qgcm93XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e3NlbGVjdGVkSWRzLmhhcyhpdGVtLnJvd1tyb3dJZEZpZWxkXSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGNoZWNrZWQpID0+IGhhbmRsZVNlbGVjdFJvdyhpdGVtLnJvd1tyb3dJZEZpZWxkXSwgY2hlY2tlZCl9XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9UYWJsZUNlbGw+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAge2NvbHVtbnMubWFwKChjb2wpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm93SWQgPSBpdGVtLnJvd1tyb3dJZEZpZWxkXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNEaXNjcmV0ZUVkaXRpbmcgPSByZXNvbHZlZEVkaXRNb2RlID09PSBcImRpc2NyZXRlXCIgJiYgZWRpdGluZ0NlbGw/LnJvd0lkID09PSByb3dJZCAmJiBlZGl0aW5nQ2VsbD8uZmllbGQgPT09IGNvbC5maWVsZDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNTaG93aW5nSW5wdXQgPSBpc0Rpc2NyZXRlRWRpdGluZyB8fCAocmVzb2x2ZWRFZGl0TW9kZSA9PT0gXCJpbmxpbmVcIiAmJiBjb2wuZWRpdGFibGUpO1xuICAgICAgICAgICAgICAgICAgICAvLyBJbnB1dCBjb21wb25lbnRzIGRvbid0IHJlc3BlY3QgY2VsbCB0ZXh0LWFsaWduIOKAlCBza2lwIGFsaWduIHdoZW4gc2hvd2luZyBpbnB1dHNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2VsbEFsaWduID0gaXNTaG93aW5nSW5wdXQgPyB1bmRlZmluZWQgOiBjb2wuYWxpZ247XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgPFRhYmxlQ2VsbCBrZXk9e2NvbC5maWVsZH0gd2lkdGg9e2lzRGlzY3JldGVFZGl0aW5nID8gXCJhdXRvXCIgOiBnZXRDZWxsV2lkdGgoY29sKX0gYWxpZ249e2NlbGxBbGlnbn0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7cmVuZGVyQ2VsbENvbnRlbnQoaXRlbS5yb3csIGNvbCl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9UYWJsZUNlbGw+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICA8L1RhYmxlUm93PlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIHJlbmRlclJvdyhpdGVtLnJvdylcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1RhYmxlQm9keT5cbiAgICAgICAgICB7Zm9vdGVyICYmIChcbiAgICAgICAgICAgIDxUYWJsZUZvb3Rlcj5cbiAgICAgICAgICAgICAge2Zvb3Rlcihmb290ZXJEYXRhKX1cbiAgICAgICAgICAgIDwvVGFibGVGb290ZXI+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9UYWJsZT5cbiAgICAgICl9XG4gICAgPC9GbGV4PlxuICApO1xufTtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlQ2FsbGJhY2sgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7XG4gIEZsZXgsXG4gIEhlYWRpbmcsXG4gIFRhYmxlUm93LFxuICBUYWJsZUNlbGwsXG4gIFRhYmxlSGVhZGVyLFxuICBUZXh0LFxuICBTdGF0dXNUYWcsXG4gIFRhZyxcbiAgRGl2aWRlcixcbiAgaHVic3BvdCxcbn0gZnJvbSBcIkBodWJzcG90L3VpLWV4dGVuc2lvbnNcIjtcbmltcG9ydCB7IERhdGFUYWJsZSB9IGZyb20gXCIuL2NvbXBvbmVudHMvRGF0YVRhYmxlLmpzeFwiO1xuXG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbi8vIFNhbXBsZSBkYXRhXG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcblxuY29uc3QgU0FNUExFX0RBVEEgPSBbXG4gIHsgaWQ6IDEsIG5hbWU6IFwiQWNtZSBDb3JwXCIsIGNvbnRhY3Q6IFwiSmFuZSBTbWl0aFwiLCBzdGF0dXM6IFwiYWN0aXZlXCIsIGNhdGVnb3J5OiBcImVudGVycHJpc2VcIiwgYW1vdW50OiAxMjUwMDAsIGRhdGU6IFwiMjAyNi0wMS0xNVwiLCBwcmlvcml0eTogdHJ1ZSB9LFxuICB7IGlkOiAyLCBuYW1lOiBcIkdsb2JleCBJbmNcIiwgY29udGFjdDogXCJCb2IgSm9obnNvblwiLCBzdGF0dXM6IFwiYWN0aXZlXCIsIGNhdGVnb3J5OiBcIm1pZC1tYXJrZXRcIiwgYW1vdW50OiA2NzAwMCwgZGF0ZTogXCIyMDI2LTAyLTAzXCIsIHByaW9yaXR5OiBmYWxzZSB9LFxuICB7IGlkOiAzLCBuYW1lOiBcIkluaXRlY2hcIiwgY29udGFjdDogXCJNaWNoYWVsIEJvbHRvblwiLCBzdGF0dXM6IFwiY2h1cm5lZFwiLCBjYXRlZ29yeTogXCJzbWJcIiwgYW1vdW50OiAxMjAwMCwgZGF0ZTogXCIyMDI1LTExLTIwXCIsIHByaW9yaXR5OiBmYWxzZSB9LFxuICB7IGlkOiA0LCBuYW1lOiBcIlVtYnJlbGxhIENvcnBcIiwgY29udGFjdDogXCJBbGljZSBXZXNrZXJcIiwgc3RhdHVzOiBcImF0LXJpc2tcIiwgY2F0ZWdvcnk6IFwiZW50ZXJwcmlzZVwiLCBhbW91bnQ6IDIzMDAwMCwgZGF0ZTogXCIyMDI2LTAzLTAxXCIsIHByaW9yaXR5OiB0cnVlIH0sXG4gIHsgaWQ6IDUsIG5hbWU6IFwiU3RhcmsgSW5kdXN0cmllc1wiLCBjb250YWN0OiBcIlBlcHBlciBQb3R0c1wiLCBzdGF0dXM6IFwiYWN0aXZlXCIsIGNhdGVnb3J5OiBcImVudGVycHJpc2VcIiwgYW1vdW50OiA0NTAwMDAsIGRhdGU6IFwiMjAyNi0wMS0yOFwiLCBwcmlvcml0eTogZmFsc2UgfSxcbiAgeyBpZDogNiwgbmFtZTogXCJXYXluZSBFbnRlcnByaXNlc1wiLCBjb250YWN0OiBcIkx1Y2l1cyBGb3hcIiwgc3RhdHVzOiBcImFjdGl2ZVwiLCBjYXRlZ29yeTogXCJlbnRlcnByaXNlXCIsIGFtb3VudDogMzgwMDAwLCBkYXRlOiBcIjIwMjUtMTItMTVcIiwgcHJpb3JpdHk6IHRydWUgfSxcbiAgeyBpZDogNywgbmFtZTogXCJXb25rYSBJbmR1c3RyaWVzXCIsIGNvbnRhY3Q6IFwiQ2hhcmxpZSBCdWNrZXRcIiwgc3RhdHVzOiBcImF0LXJpc2tcIiwgY2F0ZWdvcnk6IFwibWlkLW1hcmtldFwiLCBhbW91bnQ6IDQyMDAwLCBkYXRlOiBcIjIwMjYtMDItMTRcIiwgcHJpb3JpdHk6IGZhbHNlIH0sXG4gIHsgaWQ6IDgsIG5hbWU6IFwiQ3liZXJkeW5lIFN5c3RlbXNcIiwgY29udGFjdDogXCJNaWxlcyBEeXNvblwiLCBzdGF0dXM6IFwiY2h1cm5lZFwiLCBjYXRlZ29yeTogXCJtaWQtbWFya2V0XCIsIGFtb3VudDogODkwMDAsIGRhdGU6IFwiMjAyNS0xMC0wNVwiLCBwcmlvcml0eTogZmFsc2UgfSxcbiAgeyBpZDogOSwgbmFtZTogXCJTb3lsZW50IENvcnBcIiwgY29udGFjdDogXCJTb2wgUm90aFwiLCBzdGF0dXM6IFwiYWN0aXZlXCIsIGNhdGVnb3J5OiBcInNtYlwiLCBhbW91bnQ6IDE4MDAwLCBkYXRlOiBcIjIwMjYtMDMtMTBcIiwgcHJpb3JpdHk6IGZhbHNlIH0sXG4gIHsgaWQ6IDEwLCBuYW1lOiBcIlR5cmVsbCBDb3JwXCIsIGNvbnRhY3Q6IFwiRWxkb24gVHlyZWxsXCIsIHN0YXR1czogXCJhY3RpdmVcIiwgY2F0ZWdvcnk6IFwiZW50ZXJwcmlzZVwiLCBhbW91bnQ6IDUyMDAwMCwgZGF0ZTogXCIyMDI2LTAxLTA1XCIsIHByaW9yaXR5OiB0cnVlIH0sXG4gIHsgaWQ6IDExLCBuYW1lOiBcIlBpZWQgUGlwZXJcIiwgY29udGFjdDogXCJSaWNoYXJkIEhlbmRyaWNrc1wiLCBzdGF0dXM6IFwiYWN0aXZlXCIsIGNhdGVnb3J5OiBcInNtYlwiLCBhbW91bnQ6IDI4MDAwLCBkYXRlOiBcIjIwMjYtMDItMjJcIiwgcHJpb3JpdHk6IGZhbHNlIH0sXG4gIHsgaWQ6IDEyLCBuYW1lOiBcIkhvb2xpXCIsIGNvbnRhY3Q6IFwiR2F2aW4gQmVsc29uXCIsIHN0YXR1czogXCJhdC1yaXNrXCIsIGNhdGVnb3J5OiBcImVudGVycHJpc2VcIiwgYW1vdW50OiAxNzUwMDAsIGRhdGU6IFwiMjAyNS0xMi0zMFwiLCBwcmlvcml0eTogdHJ1ZSB9LFxuXTtcblxuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4vLyBTdGF0dXMgaGVscGVyc1xuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG5cbmNvbnN0IFNUQVRVU19DT0xPUlMgPSB7XG4gIGFjdGl2ZTogXCJzdWNjZXNzXCIsXG4gIFwiYXQtcmlza1wiOiBcIndhcm5pbmdcIixcbiAgY2h1cm5lZDogXCJkYW5nZXJcIixcbn07XG5cbmNvbnN0IFNUQVRVU19MQUJFTFMgPSB7XG4gIGFjdGl2ZTogXCJBY3RpdmVcIixcbiAgXCJhdC1yaXNrXCI6IFwiQXQgUmlza1wiLFxuICBjaHVybmVkOiBcIkNodXJuZWRcIixcbn07XG5cbmNvbnN0IGZvcm1hdEN1cnJlbmN5ID0gKHZhbCkgPT5cbiAgbmV3IEludGwuTnVtYmVyRm9ybWF0KFwiZW4tVVNcIiwgeyBzdHlsZTogXCJjdXJyZW5jeVwiLCBjdXJyZW5jeTogXCJVU0RcIiwgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAwIH0pLmZvcm1hdCh2YWwpO1xuXG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbi8vIERlbW8gMTogRnVsbC1mZWF0dXJlZCAoZmlsdGVycywgc29ydCwgcGFnaW5hdGlvbiwgZm9vdGVyKVxuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG5cbmNvbnN0IEZVTExfQ09MVU1OUyA9IFtcbiAge1xuICAgIGZpZWxkOiBcIm5hbWVcIiwgbGFiZWw6IFwiQ29tcGFueVwiLCBzb3J0YWJsZTogdHJ1ZSxcbiAgICByZW5kZXJDZWxsOiAodmFsKSA9PiA8VGV4dCBmb3JtYXQ9e3sgZm9udFdlaWdodDogXCJkZW1pYm9sZFwiIH19Pnt2YWx9PC9UZXh0PlxuICB9LFxuICB7XG4gICAgZmllbGQ6IFwiY29udGFjdFwiLCBsYWJlbDogXCJDb250YWN0XCIsIHNvcnRhYmxlOiB0cnVlLFxuICAgIHJlbmRlckNlbGw6ICh2YWwpID0+IHZhbFxuICB9LFxuICB7XG4gICAgZmllbGQ6IFwic3RhdHVzXCIsIGxhYmVsOiBcIlN0YXR1c1wiLCBzb3J0YWJsZTogdHJ1ZSxcbiAgICByZW5kZXJDZWxsOiAodmFsKSA9PiA8U3RhdHVzVGFnIHZhcmlhbnQ9e1NUQVRVU19DT0xPUlNbdmFsXX0+e1NUQVRVU19MQUJFTFNbdmFsXX08L1N0YXR1c1RhZz5cbiAgfSxcbiAge1xuICAgIGZpZWxkOiBcImNhdGVnb3J5XCIsIGxhYmVsOiBcIlNlZ21lbnRcIiwgc29ydGFibGU6IHRydWUsXG4gICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gPFRhZyB2YXJpYW50PVwiZGVmYXVsdFwiPnt2YWx9PC9UYWc+XG4gIH0sXG4gIHtcbiAgICBmaWVsZDogXCJhbW91bnRcIiwgbGFiZWw6IFwiQW1vdW50XCIsIHNvcnRhYmxlOiB0cnVlLCBhbGlnbjogXCJyaWdodFwiLFxuICAgIHJlbmRlckNlbGw6ICh2YWwpID0+IGZvcm1hdEN1cnJlbmN5KHZhbClcbiAgfSxcbiAge1xuICAgIGZpZWxkOiBcImRhdGVcIiwgbGFiZWw6IFwiQ2xvc2UgRGF0ZVwiLCBzb3J0YWJsZTogdHJ1ZSxcbiAgICByZW5kZXJDZWxsOiAodmFsKSA9PiBuZXcgRGF0ZSh2YWwpLnRvTG9jYWxlRGF0ZVN0cmluZyhcImVuLVVTXCIsIHsgbW9udGg6IFwic2hvcnRcIiwgZGF5OiBcIm51bWVyaWNcIiwgeWVhcjogXCJudW1lcmljXCIgfSlcbiAgfSxcbl07XG5cbmNvbnN0IEZVTExfRklMVEVSUyA9IFtcbiAge1xuICAgIG5hbWU6IFwic3RhdHVzXCIsXG4gICAgdHlwZTogXCJzZWxlY3RcIixcbiAgICBwbGFjZWhvbGRlcjogXCJBbGwgc3RhdHVzZXNcIixcbiAgICBvcHRpb25zOiBbXG4gICAgICB7IGxhYmVsOiBcIkFjdGl2ZVwiLCB2YWx1ZTogXCJhY3RpdmVcIiB9LFxuICAgICAgeyBsYWJlbDogXCJBdCBSaXNrXCIsIHZhbHVlOiBcImF0LXJpc2tcIiB9LFxuICAgICAgeyBsYWJlbDogXCJDaHVybmVkXCIsIHZhbHVlOiBcImNodXJuZWRcIiB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBuYW1lOiBcImNhdGVnb3J5XCIsXG4gICAgdHlwZTogXCJzZWxlY3RcIixcbiAgICBwbGFjZWhvbGRlcjogXCJBbGwgc2VnbWVudHNcIixcbiAgICBvcHRpb25zOiBbXG4gICAgICB7IGxhYmVsOiBcIkVudGVycHJpc2VcIiwgdmFsdWU6IFwiZW50ZXJwcmlzZVwiIH0sXG4gICAgICB7IGxhYmVsOiBcIk1pZC1NYXJrZXRcIiwgdmFsdWU6IFwibWlkLW1hcmtldFwiIH0sXG4gICAgICB7IGxhYmVsOiBcIlNNQlwiLCB2YWx1ZTogXCJzbWJcIiB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBuYW1lOiBcImRhdGVcIixcbiAgICB0eXBlOiBcImRhdGVSYW5nZVwiLFxuICAgIHBsYWNlaG9sZGVyOiBcIkNsb3NlIGRhdGVcIixcbiAgfSxcbl07XG5cbmNvbnN0IEZ1bGxGZWF0dXJlZERlbW8gPSAoKSA9PiAoXG4gIDxGbGV4IGRpcmVjdGlvbj1cImNvbHVtblwiIGdhcD1cInNtXCI+XG4gICAgPEhlYWRpbmc+RnVsbC1GZWF0dXJlZCBEYXRhVGFibGU8L0hlYWRpbmc+XG4gICAgPFRleHQgdmFyaWFudD1cIm1pY3JvY29weVwiPlxuICAgICAgU2VhcmNoLCBmaWx0ZXIsIHNvcnQsIHBhZ2luYXRlLCBmb290ZXIgc3VtbWFyeS4gTm8gZXhwbGljaXQgd2lkdGhzIOKAlCBhdXRvLXdpZHRoIHNpemVzIGNvbHVtbnMgZnJvbSBjb250ZW50LlxuICAgIDwvVGV4dD5cbiAgICA8RGF0YVRhYmxlXG4gICAgICBkYXRhPXtTQU1QTEVfREFUQX1cbiAgICAgIGNvbHVtbnM9e0ZVTExfQ09MVU1OU31cbiAgICAgIHJlbmRlclJvdz17KHJvdykgPT4gKFxuICAgICAgICA8VGFibGVSb3cga2V5PXtyb3cuaWR9PlxuICAgICAgICAgIDxUYWJsZUNlbGw+PFRleHQgZm9ybWF0PXt7IGZvbnRXZWlnaHQ6IFwiZGVtaWJvbGRcIiB9fT57cm93Lm5hbWV9PC9UZXh0PjwvVGFibGVDZWxsPlxuICAgICAgICAgIDxUYWJsZUNlbGw+e3Jvdy5jb250YWN0fTwvVGFibGVDZWxsPlxuICAgICAgICAgIDxUYWJsZUNlbGw+PFN0YXR1c1RhZyB2YXJpYW50PXtTVEFUVVNfQ09MT1JTW3Jvdy5zdGF0dXNdfT57U1RBVFVTX0xBQkVMU1tyb3cuc3RhdHVzXX08L1N0YXR1c1RhZz48L1RhYmxlQ2VsbD5cbiAgICAgICAgICA8VGFibGVDZWxsPjxUYWcgdmFyaWFudD1cImRlZmF1bHRcIj57cm93LmNhdGVnb3J5fTwvVGFnPjwvVGFibGVDZWxsPlxuICAgICAgICAgIDxUYWJsZUNlbGwgYWxpZ249XCJyaWdodFwiPntmb3JtYXRDdXJyZW5jeShyb3cuYW1vdW50KX08L1RhYmxlQ2VsbD5cbiAgICAgICAgICA8VGFibGVDZWxsPntuZXcgRGF0ZShyb3cuZGF0ZSkudG9Mb2NhbGVEYXRlU3RyaW5nKFwiZW4tVVNcIiwgeyBtb250aDogXCJzaG9ydFwiLCBkYXk6IFwibnVtZXJpY1wiLCB5ZWFyOiBcIm51bWVyaWNcIiB9KX08L1RhYmxlQ2VsbD5cbiAgICAgICAgPC9UYWJsZVJvdz5cbiAgICAgICl9XG4gICAgICBzZWFyY2hGaWVsZHM9e1tcIm5hbWVcIiwgXCJjb250YWN0XCJdfVxuICAgICAgc2VhcmNoUGxhY2Vob2xkZXI9XCJTZWFyY2ggY29tcGFuaWVzIG9yIGNvbnRhY3RzLi4uXCJcbiAgICAgIGZpbHRlcnM9e0ZVTExfRklMVEVSU31cbiAgICAgIHBhZ2VTaXplPXs1fVxuICAgICAgZGVmYXVsdFNvcnQ9e3sgYW1vdW50OiBcImRlc2NlbmRpbmdcIiB9fVxuICAgICAgZm9vdGVyPXsoZmlsdGVyZWREYXRhKSA9PiAoXG4gICAgICAgIDxUYWJsZVJvdz5cbiAgICAgICAgICA8VGFibGVIZWFkZXI+VG90YWw8L1RhYmxlSGVhZGVyPlxuICAgICAgICAgIDxUYWJsZUhlYWRlcj48L1RhYmxlSGVhZGVyPlxuICAgICAgICAgIDxUYWJsZUhlYWRlcj48L1RhYmxlSGVhZGVyPlxuICAgICAgICAgIDxUYWJsZUhlYWRlcj48L1RhYmxlSGVhZGVyPlxuICAgICAgICAgIDxUYWJsZUhlYWRlciBhbGlnbj1cInJpZ2h0XCI+XG4gICAgICAgICAgICB7Zm9ybWF0Q3VycmVuY3koZmlsdGVyZWREYXRhLnJlZHVjZSgoc3VtLCByKSA9PiBzdW0gKyByLmFtb3VudCwgMCkpfVxuICAgICAgICAgIDwvVGFibGVIZWFkZXI+XG4gICAgICAgICAgPFRhYmxlSGVhZGVyPjwvVGFibGVIZWFkZXI+XG4gICAgICAgIDwvVGFibGVSb3c+XG4gICAgICApfVxuICAgIC8+XG4gIDwvRmxleD5cbik7XG5cbi8vIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuLy8gRGVtbyAyOiBTZWxlY3RhYmxlIHJvd3Ncbi8vIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuXG5jb25zdCBTRUxFQ1RfQ09MVU1OUyA9IFtcbiAge1xuICAgIGZpZWxkOiBcIm5hbWVcIiwgbGFiZWw6IFwiQ29tcGFueVwiLCBzb3J0YWJsZTogdHJ1ZSxcbiAgICByZW5kZXJDZWxsOiAodmFsKSA9PiA8VGV4dCBmb3JtYXQ9e3sgZm9udFdlaWdodDogXCJkZW1pYm9sZFwiIH19Pnt2YWx9PC9UZXh0PlxuICB9LFxuICB7XG4gICAgZmllbGQ6IFwiY29udGFjdFwiLCBsYWJlbDogXCJDb250YWN0XCIsXG4gICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gdmFsXG4gIH0sXG4gIHtcbiAgICBmaWVsZDogXCJzdGF0dXNcIiwgbGFiZWw6IFwiU3RhdHVzXCIsXG4gICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gPFN0YXR1c1RhZyB2YXJpYW50PXtTVEFUVVNfQ09MT1JTW3ZhbF19PntTVEFUVVNfTEFCRUxTW3ZhbF19PC9TdGF0dXNUYWc+XG4gIH0sXG4gIHtcbiAgICBmaWVsZDogXCJhbW91bnRcIiwgbGFiZWw6IFwiQW1vdW50XCIsIHNvcnRhYmxlOiB0cnVlLCBhbGlnbjogXCJyaWdodFwiLFxuICAgIHJlbmRlckNlbGw6ICh2YWwpID0+IGZvcm1hdEN1cnJlbmN5KHZhbClcbiAgfSxcbl07XG5cbmNvbnN0IFNlbGVjdGFibGVEZW1vID0gKCkgPT4ge1xuICBjb25zdCBbc2VsZWN0ZWQsIHNldFNlbGVjdGVkXSA9IHVzZVN0YXRlKFtdKTtcblxuICByZXR1cm4gKFxuICAgIDxGbGV4IGRpcmVjdGlvbj1cImNvbHVtblwiIGdhcD1cInNtXCI+XG4gICAgICA8SGVhZGluZz5Sb3cgU2VsZWN0aW9uPC9IZWFkaW5nPlxuICAgICAgPFRleHQgdmFyaWFudD1cIm1pY3JvY29weVwiPlxuICAgICAgICBTZWxlY3QgaW5kaXZpZHVhbCByb3dzIG9yIHVzZSB0aGUgaGVhZGVyIGNoZWNrYm94IHRvIHNlbGVjdCBhbGwuXG4gICAgICAgIHtzZWxlY3RlZC5sZW5ndGggPiAwICYmIGAgKCR7c2VsZWN0ZWQubGVuZ3RofSBzZWxlY3RlZClgfVxuICAgICAgPC9UZXh0PlxuICAgICAgPERhdGFUYWJsZVxuICAgICAgICBkYXRhPXtTQU1QTEVfREFUQX1cbiAgICAgICAgY29sdW1ucz17U0VMRUNUX0NPTFVNTlN9XG4gICAgICAgIHNlbGVjdGFibGU9e3RydWV9XG4gICAgICAgIHJvd0lkRmllbGQ9XCJpZFwiXG4gICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlPXtzZXRTZWxlY3RlZH1cbiAgICAgICAgc2VhcmNoRmllbGRzPXtbXCJuYW1lXCJdfVxuICAgICAgICBwYWdlU2l6ZT17NX1cbiAgICAgIC8+XG4gICAgPC9GbGV4PlxuICApO1xufTtcblxuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4vLyBEZW1vIDM6IElubGluZSBlZGl0aW5nXG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcblxuY29uc3QgRWRpdGFibGVEZW1vID0gKCkgPT4ge1xuICBjb25zdCBbZGF0YSwgc2V0RGF0YV0gPSB1c2VTdGF0ZShTQU1QTEVfREFUQSk7XG5cbiAgY29uc3QgaGFuZGxlRWRpdCA9IHVzZUNhbGxiYWNrKChyb3csIGZpZWxkLCBuZXdWYWx1ZSkgPT4ge1xuICAgIHNldERhdGEoKHByZXYpID0+XG4gICAgICBwcmV2Lm1hcCgocikgPT4gKHIuaWQgPT09IHJvdy5pZCA/IHsgLi4uciwgW2ZpZWxkXTogbmV3VmFsdWUgfSA6IHIpKVxuICAgICk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBlZGl0Q29sdW1ucyA9IFtcbiAgICB7XG4gICAgICBmaWVsZDogXCJuYW1lXCIsIGxhYmVsOiBcIkNvbXBhbnlcIiwgc29ydGFibGU6IHRydWUsXG4gICAgICBlZGl0YWJsZTogdHJ1ZSwgZWRpdFR5cGU6IFwidGV4dFwiLFxuICAgICAgZWRpdFZhbGlkYXRlOiAodmFsKSA9PiB7XG4gICAgICAgIGlmICghdmFsIHx8IHZhbC50cmltKCkgPT09IFwiXCIpIHJldHVybiBcIkNvbXBhbnkgbmFtZSBpcyByZXF1aXJlZFwiO1xuICAgICAgICBpZiAodmFsLmxlbmd0aCA8IDIpIHJldHVybiBcIk11c3QgYmUgYXQgbGVhc3QgMiBjaGFyYWN0ZXJzXCI7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICAgIHJlbmRlckNlbGw6ICh2YWwpID0+IDxUZXh0IGZvcm1hdD17eyBmb250V2VpZ2h0OiBcImRlbWlib2xkXCIgfX0+e3ZhbH08L1RleHQ+XG4gICAgfSxcbiAgICB7XG4gICAgICBmaWVsZDogXCJjb250YWN0XCIsIGxhYmVsOiBcIkNvbnRhY3RcIixcbiAgICAgIGVkaXRhYmxlOiB0cnVlLCBlZGl0VHlwZTogXCJ0ZXh0XCIsXG4gICAgICByZW5kZXJDZWxsOiAodmFsKSA9PiB2YWxcbiAgICB9LFxuICAgIHtcbiAgICAgIGZpZWxkOiBcInN0YXR1c1wiLCBsYWJlbDogXCJTdGF0dXNcIixcbiAgICAgIGVkaXRhYmxlOiB0cnVlLCBlZGl0VHlwZTogXCJzZWxlY3RcIixcbiAgICAgIGVkaXRPcHRpb25zOiBbXG4gICAgICAgIHsgbGFiZWw6IFwiQWN0aXZlXCIsIHZhbHVlOiBcImFjdGl2ZVwiIH0sXG4gICAgICAgIHsgbGFiZWw6IFwiQXQgUmlza1wiLCB2YWx1ZTogXCJhdC1yaXNrXCIgfSxcbiAgICAgICAgeyBsYWJlbDogXCJDaHVybmVkXCIsIHZhbHVlOiBcImNodXJuZWRcIiB9LFxuICAgICAgXSxcbiAgICAgIHJlbmRlckNlbGw6ICh2YWwpID0+IDxTdGF0dXNUYWcgdmFyaWFudD17U1RBVFVTX0NPTE9SU1t2YWxdfT57U1RBVFVTX0xBQkVMU1t2YWxdfTwvU3RhdHVzVGFnPlxuICAgIH0sXG4gICAge1xuICAgICAgZmllbGQ6IFwiYW1vdW50XCIsIGxhYmVsOiBcIkFtb3VudFwiLCBzb3J0YWJsZTogdHJ1ZSwgYWxpZ246IFwicmlnaHRcIixcbiAgICAgIGVkaXRhYmxlOiB0cnVlLCBlZGl0VHlwZTogXCJjdXJyZW5jeVwiLFxuICAgICAgZWRpdFZhbGlkYXRlOiAodmFsKSA9PiB7XG4gICAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQgfHwgdmFsID09PSBcIlwiKSByZXR1cm4gXCJBbW91bnQgaXMgcmVxdWlyZWRcIjtcbiAgICAgICAgaWYgKE51bWJlcih2YWwpIDwgMCkgcmV0dXJuIFwiQW1vdW50IGNhbm5vdCBiZSBuZWdhdGl2ZVwiO1xuICAgICAgICBpZiAoTnVtYmVyKHZhbCkgPiAxMDAwMDAwKSByZXR1cm4gXCJBbW91bnQgY2Fubm90IGV4Y2VlZCAkMSwwMDAsMDAwXCI7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICAgIHJlbmRlckNlbGw6ICh2YWwpID0+IGZvcm1hdEN1cnJlbmN5KHZhbClcbiAgICB9LFxuICAgIHtcbiAgICAgIGZpZWxkOiBcInByaW9yaXR5XCIsIGxhYmVsOiBcIlByaW9yaXR5XCIsXG4gICAgICBlZGl0YWJsZTogdHJ1ZSwgZWRpdFR5cGU6IFwic2VsZWN0XCIsXG4gICAgICByZW5kZXJDZWxsOiAodmFsKSA9PiB2YWwgPyA8VGFnIHZhcmlhbnQ9XCJzdWNjZXNzXCI+WWVzPC9UYWc+IDogPFRhZyB2YXJpYW50PVwiZGFuZ2VyXCI+Tm88L1RhZz5cbiAgICB9LFxuICBdO1xuXG4gIHJldHVybiAoXG4gICAgPEZsZXggZGlyZWN0aW9uPVwiY29sdW1uXCIgZ2FwPVwic21cIj5cbiAgICAgIDxIZWFkaW5nPklubGluZSBFZGl0aW5nPC9IZWFkaW5nPlxuICAgICAgPFRleHQgdmFyaWFudD1cIm1pY3JvY29weVwiPlxuICAgICAgICBDbGljayBhbnkgaGlnaGxpZ2h0ZWQgY2VsbCB0byBlZGl0LiBUZXh0L251bWJlciBmaWVsZHMgc2hvdyBTYXZlL0NhbmNlbC4gRHJvcGRvd25zIGFuZCB0b2dnbGVzIGNvbW1pdCBpbnN0YW50bHkuXG4gICAgICA8L1RleHQ+XG4gICAgICA8RGF0YVRhYmxlXG4gICAgICAgIGRhdGE9e2RhdGF9XG4gICAgICAgIGNvbHVtbnM9e2VkaXRDb2x1bW5zfVxuICAgICAgICByb3dJZEZpZWxkPVwiaWRcIlxuICAgICAgICBvblJvd0VkaXQ9e2hhbmRsZUVkaXR9XG4gICAgICAgIHNlYXJjaEZpZWxkcz17W1wibmFtZVwiLCBcImNvbnRhY3RcIl19XG4gICAgICAgIHBhZ2VTaXplPXs2fVxuICAgICAgLz5cbiAgICA8L0ZsZXg+XG4gICk7XG59O1xuXG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbi8vIERlbW8gM2I6IElubGluZSBlZGl0aW5nIChhbHdheXMtdmlzaWJsZSBpbnB1dHMpXG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcblxuY29uc3QgSW5saW5lRWRpdERlbW8gPSAoKSA9PiB7XG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKFNBTVBMRV9EQVRBKTtcblxuICBjb25zdCBoYW5kbGVFZGl0ID0gdXNlQ2FsbGJhY2soKHJvdywgZmllbGQsIG5ld1ZhbHVlKSA9PiB7XG4gICAgc2V0RGF0YSgocHJldikgPT5cbiAgICAgIHByZXYubWFwKChyKSA9PiAoci5pZCA9PT0gcm93LmlkID8geyAuLi5yLCBbZmllbGRdOiBuZXdWYWx1ZSB9IDogcikpXG4gICAgKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGlubGluZUNvbHVtbnMgPSBbXG4gICAge1xuICAgICAgZmllbGQ6IFwibmFtZVwiLCBsYWJlbDogXCJDb21wYW55XCIsXG4gICAgICBlZGl0YWJsZTogdHJ1ZSwgZWRpdFR5cGU6IFwidGV4dFwiLFxuICAgICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gdmFsXG4gICAgfSxcbiAgICB7XG4gICAgICBmaWVsZDogXCJjb250YWN0XCIsIGxhYmVsOiBcIkNvbnRhY3RcIixcbiAgICAgIGVkaXRhYmxlOiB0cnVlLCBlZGl0VHlwZTogXCJ0ZXh0XCIsXG4gICAgICByZW5kZXJDZWxsOiAodmFsKSA9PiB2YWxcbiAgICB9LFxuICAgIHtcbiAgICAgIGZpZWxkOiBcInN0YXR1c1wiLCBsYWJlbDogXCJTdGF0dXNcIixcbiAgICAgIGVkaXRhYmxlOiB0cnVlLCBlZGl0VHlwZTogXCJzZWxlY3RcIixcbiAgICAgIGVkaXRPcHRpb25zOiBbXG4gICAgICAgIHsgbGFiZWw6IFwiQWN0aXZlXCIsIHZhbHVlOiBcImFjdGl2ZVwiIH0sXG4gICAgICAgIHsgbGFiZWw6IFwiQXQgUmlza1wiLCB2YWx1ZTogXCJhdC1yaXNrXCIgfSxcbiAgICAgICAgeyBsYWJlbDogXCJDaHVybmVkXCIsIHZhbHVlOiBcImNodXJuZWRcIiB9LFxuICAgICAgXSxcbiAgICAgIHJlbmRlckNlbGw6ICh2YWwpID0+IHZhbFxuICAgIH0sXG4gICAge1xuICAgICAgZmllbGQ6IFwiYW1vdW50XCIsIGxhYmVsOiBcIkFtb3VudFwiLCBhbGlnbjogXCJyaWdodFwiLFxuICAgICAgZWRpdGFibGU6IHRydWUsIGVkaXRUeXBlOiBcImN1cnJlbmN5XCIsXG4gICAgICByZW5kZXJDZWxsOiAodmFsKSA9PiBmb3JtYXRDdXJyZW5jeSh2YWwpXG4gICAgfSxcbiAgICB7XG4gICAgICBmaWVsZDogXCJwcmlvcml0eVwiLCBsYWJlbDogXCJQcmlvcml0eVwiLFxuICAgICAgZWRpdGFibGU6IHRydWUsIGVkaXRUeXBlOiBcImNoZWNrYm94XCIsXG4gICAgICByZW5kZXJDZWxsOiAodmFsKSA9PiB2YWwgPyBcIlllc1wiIDogXCJOb1wiXG4gICAgfSxcbiAgXTtcblxuICByZXR1cm4gKFxuICAgIDxGbGV4IGRpcmVjdGlvbj1cImNvbHVtblwiIGdhcD1cInNtXCI+XG4gICAgICA8SGVhZGluZz5JbmxpbmUgRWRpdCBNb2RlPC9IZWFkaW5nPlxuICAgICAgPFRleHQgdmFyaWFudD1cIm1pY3JvY29weVwiPlxuICAgICAgICBBbGwgZWRpdGFibGUgY2VsbHMgYWx3YXlzIHNob3cgdGhlaXIgaW5wdXQgY29udHJvbHMuIENoYW5nZXMgZmlyZSBpbW1lZGlhdGVseS5cbiAgICAgIDwvVGV4dD5cbiAgICAgIDxEYXRhVGFibGVcbiAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgY29sdW1ucz17aW5saW5lQ29sdW1uc31cbiAgICAgICAgcm93SWRGaWVsZD1cImlkXCJcbiAgICAgICAgZWRpdE1vZGU9XCJpbmxpbmVcIlxuICAgICAgICBvblJvd0VkaXQ9e2hhbmRsZUVkaXR9XG4gICAgICAgIHBhZ2VTaXplPXs1fVxuICAgICAgLz5cbiAgICA8L0ZsZXg+XG4gICk7XG59O1xuXG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbi8vIERlbW8gNDogR3JvdXBlZCByb3dzXG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcblxuY29uc3QgR1JPVVBfQ09MVU1OUyA9IFtcbiAge1xuICAgIGZpZWxkOiBcIm5hbWVcIiwgbGFiZWw6IFwiQ29tcGFueVwiLFxuICAgIHJlbmRlckNlbGw6ICh2YWwpID0+IHZhbFxuICB9LFxuICB7IGZpZWxkOiBcImNvbnRhY3RcIiwgbGFiZWw6IFwiQ29udGFjdFwiLCByZW5kZXJDZWxsOiAodmFsKSA9PiB2YWwgfSxcbiAge1xuICAgIGZpZWxkOiBcInN0YXR1c1wiLCBsYWJlbDogXCJTdGF0dXNcIixcbiAgICByZW5kZXJDZWxsOiAodmFsKSA9PiA8U3RhdHVzVGFnIHZhcmlhbnQ9e1NUQVRVU19DT0xPUlNbdmFsXX0+e1NUQVRVU19MQUJFTFNbdmFsXX08L1N0YXR1c1RhZz5cbiAgfSxcbiAge1xuICAgIGZpZWxkOiBcImFtb3VudFwiLCBsYWJlbDogXCJBbW91bnRcIiwgYWxpZ246IFwicmlnaHRcIixcbiAgICByZW5kZXJDZWxsOiAodmFsKSA9PiBmb3JtYXRDdXJyZW5jeSh2YWwpXG4gIH0sXG5dO1xuXG5jb25zdCBHcm91cGVkRGVtbyA9ICgpID0+IChcbiAgPEZsZXggZGlyZWN0aW9uPVwiY29sdW1uXCIgZ2FwPVwic21cIj5cbiAgICA8SGVhZGluZz5Sb3cgR3JvdXBpbmc8L0hlYWRpbmc+XG4gICAgPFRleHQgdmFyaWFudD1cIm1pY3JvY29weVwiPlxuICAgICAgQ29sbGFwc2libGUgZ3JvdXBzIHdpdGggYWdncmVnYXRlZCB0b3RhbHMuIENsaWNrIGEgZ3JvdXAgdG8gZXhwYW5kL2NvbGxhcHNlLlxuICAgIDwvVGV4dD5cbiAgICA8RGF0YVRhYmxlXG4gICAgICBkYXRhPXtTQU1QTEVfREFUQX1cbiAgICAgIGNvbHVtbnM9e0dST1VQX0NPTFVNTlN9XG4gICAgICBncm91cEJ5PXt7XG4gICAgICAgIGZpZWxkOiBcImNhdGVnb3J5XCIsXG4gICAgICAgIGxhYmVsOiAodmFsdWUsIHJvd3MpID0+IGAke3ZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdmFsdWUuc2xpY2UoMSl9ICgke3Jvd3MubGVuZ3RofSlgLFxuICAgICAgICBzb3J0OiBcImFzY1wiLFxuICAgICAgICBhZ2dyZWdhdGlvbnM6IHtcbiAgICAgICAgICBhbW91bnQ6IChyb3dzKSA9PiBmb3JtYXRDdXJyZW5jeShyb3dzLnJlZHVjZSgoc3VtLCByKSA9PiBzdW0gKyByLmFtb3VudCwgMCkpLFxuICAgICAgICAgIHN0YXR1czogKHJvd3MpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2ZSA9IHJvd3MuZmlsdGVyKChyKSA9PiByLnN0YXR1cyA9PT0gXCJhY3RpdmVcIikubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIDxUZXh0IHZhcmlhbnQ9XCJtaWNyb2NvcHlcIj57YWN0aXZlfSBvZiB7cm93cy5sZW5ndGh9IGFjdGl2ZTwvVGV4dD47XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH19XG4gICAgICBwYWdlU2l6ZT17MzB9XG4gICAgLz5cbiAgPC9GbGV4PlxuKTtcblxuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4vLyBNYWluIGVudHJ5XG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcblxuaHVic3BvdC5leHRlbmQoKCkgPT4gPERhdGFUYWJsZURlbW9DYXJkIC8+KTtcblxuY29uc3QgRGF0YVRhYmxlRGVtb0NhcmQgPSAoKSA9PiAoXG4gIDxGbGV4IGRpcmVjdGlvbj1cImNvbHVtblwiIGdhcD1cImxnXCI+XG4gICAgPEZ1bGxGZWF0dXJlZERlbW8gLz5cbiAgICA8RGl2aWRlciAvPlxuICAgIDxTZWxlY3RhYmxlRGVtbyAvPlxuICAgIDxEaXZpZGVyIC8+XG4gICAgPEVkaXRhYmxlRGVtbyAvPlxuICAgIDxEaXZpZGVyIC8+XG4gICAgPElubGluZUVkaXREZW1vIC8+XG4gICAgPERpdmlkZXIgLz5cbiAgICA8R3JvdXBlZERlbW8gLz5cbiAgPC9GbGV4PlxuKTtcbiJdLCJuYW1lcyI6WyJTZXJ2ZXJsZXNzRXhlY3V0aW9uU3RhdHVzIiwiUmVhY3QiLCJyZXF1aXJlJCQwIiwiUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSIsInNlbGYiLCJqc3hSdW50aW1lTW9kdWxlIiwiY3JlYXRlUmVtb3RlUmVhY3RDb21wb25lbnQiLCJfanN4IiwiY3JlYXRlQ29udGV4dCIsInVzZU1lbW8iLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsInVzZUNhbGxiYWNrIl0sIm1hcHBpbmdzIjoiOztBQUlBLFFBQU0sb0JBQW9CLE1BQU0sT0FBTyxTQUFTLGVBQzVDLEtBQUssaUNBQWlDO0FBSTFDLFFBQU0sb0JBQW9CO0FBQUEsSUFDdEIsUUFBUTtBQUFBLE1BQ0osT0FBTyxDQUFDLFNBQVM7QUFDYixnQkFBUSxJQUFJLElBQUk7QUFBQSxNQUNwQjtBQUFBLE1BQ0EsTUFBTSxDQUFDLFNBQVM7QUFDWixnQkFBUSxLQUFLLElBQUk7QUFBQSxNQUNyQjtBQUFBLE1BQ0EsTUFBTSxDQUFDLFNBQVM7QUFDWixnQkFBUSxLQUFLLElBQUk7QUFBQSxNQUNyQjtBQUFBLE1BQ0EsT0FBTyxDQUFDLFNBQVM7QUFDYixnQkFBUSxNQUFNLElBQUk7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
