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
  const ErrorState = createAndRegisterRemoteReactComponent("ErrorState");
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
  const LoadingSpinner = createAndRegisterRemoteReactComponent("LoadingSpinner");
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
    loading = false,
    // show loading spinner over the table
    error,
    // error message string or boolean — shows ErrorState
    totalCount,
    // server total (server-side only)
    page: externalPage,
    // controlled page (server-side only)
    searchValue,
    // controlled search term (server-side only)
    filterValues: externalFilterValues,
    // controlled filter values (server-side only)
    sort: externalSort,
    // controlled sort state, e.g. { field: "ascending" }
    searchDebounce = 0,
    // ms to debounce onSearchChange callback
    resetPageOnChange = true,
    // auto-reset to page 1 on search/filter/sort change
    onSearchChange,
    // (searchTerm) => void
    onFilterChange,
    // (filterValues) => void
    onSortChange,
    // (field, direction) => void
    onPageChange,
    // (page) => void
    onParamsChange,
    // ({ search, filters, sort, page }) => void
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
    const [internalSearchTerm, setInternalSearchTerm] = React2.useState("");
    const [internalFilterValues, setInternalFilterValues] = React2.useState(() => {
      const init = {};
      filters.forEach((f) => {
        init[f.name] = getEmptyFilterValue(f);
      });
      return init;
    });
    const [internalSortState, setInternalSortState] = React2.useState(initialSortState);
    const [currentPage, setCurrentPage] = React2.useState(1);
    const [showMoreFilters, setShowMoreFilters] = React2.useState(false);
    const searchTerm = serverSide && searchValue != null ? searchValue : internalSearchTerm;
    const filterValues = serverSide && externalFilterValues != null ? externalFilterValues : internalFilterValues;
    const sortState = serverSide && externalSort != null ? (() => {
      const s = {};
      columns.forEach((col) => {
        if (col.sortable) s[col.field] = externalSort[col.field] || "none";
      });
      return s;
    })() : internalSortState;
    const activePage = serverSide && externalPage != null ? externalPage : currentPage;
    React2.useEffect(() => {
      if (!serverSide) setCurrentPage(1);
    }, [internalSearchTerm, internalFilterValues, internalSortState, serverSide]);
    const debounceRef = React2.useRef(null);
    const fireSearchCallback = React2.useCallback((term) => {
      if (serverSide && onSearchChange) onSearchChange(term);
    }, [serverSide, onSearchChange]);
    const fireParamsChange = React2.useCallback((overrides) => {
      if (!onParamsChange) return;
      const activeSortField = Object.keys(overrides.sort || sortState).find(
        (k) => (overrides.sort || sortState)[k] !== "none"
      );
      onParamsChange({
        search: overrides.search != null ? overrides.search : searchTerm,
        filters: overrides.filters != null ? overrides.filters : filterValues,
        sort: activeSortField ? { field: activeSortField, direction: (overrides.sort || sortState)[activeSortField] } : null,
        page: overrides.page != null ? overrides.page : activePage
      });
    }, [onParamsChange, searchTerm, filterValues, sortState, activePage]);
    const resetPage = React2.useCallback(() => {
      if (resetPageOnChange) {
        setCurrentPage(1);
        if (serverSide && onPageChange) onPageChange(1);
      }
    }, [resetPageOnChange, serverSide, onPageChange]);
    const handleSearchChange = React2.useCallback((term) => {
      setInternalSearchTerm(term);
      resetPage();
      if (searchDebounce > 0) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          fireSearchCallback(term);
          fireParamsChange({ search: term, page: resetPageOnChange ? 1 : void 0 });
        }, searchDebounce);
      } else {
        fireSearchCallback(term);
        fireParamsChange({ search: term, page: resetPageOnChange ? 1 : void 0 });
      }
    }, [searchDebounce, fireSearchCallback, fireParamsChange, resetPage, resetPageOnChange]);
    React2.useEffect(() => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    }, []);
    const handleFilterChange = React2.useCallback((name, value) => {
      setInternalFilterValues((prev) => {
        const next = { ...prev, [name]: value };
        if (serverSide && onFilterChange) onFilterChange(next);
        resetPage();
        fireParamsChange({ filters: next, page: resetPageOnChange ? 1 : void 0 });
        return next;
      });
    }, [serverSide, onFilterChange, fireParamsChange, resetPage, resetPageOnChange]);
    const handleSortChange = React2.useCallback((field) => {
      const current = (serverSide && externalSort ? externalSort[field] : internalSortState[field]) || "none";
      const nextDirection = current === "none" ? "ascending" : current === "ascending" ? "descending" : "none";
      const reset = {};
      Object.keys(internalSortState).forEach((k) => {
        reset[k] = "none";
      });
      const next = { ...reset, [field]: nextDirection };
      setInternalSortState(next);
      if (serverSide && onSortChange) onSortChange(field, nextDirection);
      resetPage();
      fireParamsChange({ sort: next, page: resetPageOnChange ? 1 : void 0 });
    }, [internalSortState, serverSide, externalSort, onSortChange, fireParamsChange, resetPage, resetPageOnChange]);
    const handlePageChange = React2.useCallback((page) => {
      setCurrentPage(page);
      if (serverSide && onPageChange) onPageChange(page);
      fireParamsChange({ page });
    }, [serverSide, onPageChange, fireParamsChange]);
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
        setInternalFilterValues(cleared);
        if (serverSide && onFilterChange) onFilterChange(cleared);
        resetPage();
        fireParamsChange({ filters: cleared, page: resetPageOnChange ? 1 : void 0 });
      } else {
        const filter = filters.find((f) => f.name === key);
        const emptyVal = filter ? getEmptyFilterValue(filter) : "";
        setInternalFilterValues((prev) => {
          const next = { ...prev, [key]: emptyVal };
          if (serverSide && onFilterChange) onFilterChange(next);
          resetPage();
          fireParamsChange({ filters: next, page: resetPageOnChange ? 1 : void 0 });
          return next;
        });
      }
    }, [filters, serverSide, onFilterChange, resetPage, fireParamsChange, resetPageOnChange]);
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
        return /* @__PURE__ */ React2.createElement(Flex, { key: filter.name, direction: "row", align: "center", gap: "xs" }, /* @__PURE__ */ React2.createElement(
          DateInput,
          {
            name: `filter-${filter.name}-from`,
            label: "",
            placeholder: "From",
            format: "medium",
            value: rangeVal.from,
            onChange: (val) => handleFilterChange(filter.name, { ...rangeVal, from: val })
          }
        ), /* @__PURE__ */ React2.createElement(Icon, { name: "dataSync", size: "sm" }), /* @__PURE__ */ React2.createElement(
          DateInput,
          {
            size: "sm",
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
    return /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "xs" }, /* @__PURE__ */ React2.createElement(Flex, { direction: "row", gap: "sm" }, /* @__PURE__ */ React2.createElement(Box, { flex: 3 }, /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "sm" }, /* @__PURE__ */ React2.createElement(Flex, { direction: "row", align: "center", gap: "sm", wrap: "wrap" }, searchFields.length > 0 && /* @__PURE__ */ React2.createElement(
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
    )), showMoreFilters && filters.length > 2 && /* @__PURE__ */ React2.createElement(Flex, { direction: "row", align: "end", gap: "sm", wrap: "wrap" }, filters.slice(2).map(renderFilterControl)), activeChips.length > 0 && /* @__PURE__ */ React2.createElement(Flex, { direction: "row", align: "center", gap: "sm", wrap: "wrap" }, activeChips.map((chip) => /* @__PURE__ */ React2.createElement(Tag, { key: chip.key, variant: "default", onDelete: () => handleFilterRemove(chip.key) }, chip.label)), /* @__PURE__ */ React2.createElement(
      Button,
      {
        variant: "transparent",
        size: "extra-small",
        onClick: () => handleFilterRemove("all")
      },
      "Clear all"
    )))), showRowCount && displayCount > 0 && /* @__PURE__ */ React2.createElement(Box, { flex: 1, alignSelf: "end" }, /* @__PURE__ */ React2.createElement(Flex, { direction: "row", justify: "end" }, /* @__PURE__ */ React2.createElement(Text, { variant: "microcopy", format: rowCountBold ? { fontWeight: "bold" } : void 0 }, recordCountLabel)))), loading ? /* @__PURE__ */ React2.createElement(LoadingSpinner, { label: "Loading...", layout: "centered" }) : error ? /* @__PURE__ */ React2.createElement(ErrorState, { title: typeof error === "string" ? error : "Something went wrong." }, /* @__PURE__ */ React2.createElement(Text, null, typeof error === "string" ? "Please try again." : "An error occurred while loading data.")) : displayRows.length === 0 ? /* @__PURE__ */ React2.createElement(Flex, { direction: "column", align: "center", justify: "center" }, /* @__PURE__ */ React2.createElement(EmptyState, { title: emptyTitle, layout: "vertical" }, /* @__PURE__ */ React2.createElement(Text, null, emptyMessage))) : /* @__PURE__ */ React2.createElement(
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
  const SERVER_COLUMNS = [
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
      sortable: true,
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
  const ServerSideDemo = () => {
    const [loading, setLoading] = React2.useState(false);
    const [error, setError] = React2.useState(null);
    const [page, setPage] = React2.useState(1);
    const [search, setSearch] = React2.useState("");
    const pageSize = 4;
    const filtered = search ? SAMPLE_DATA.filter(
      (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.contact.toLowerCase().includes(search.toLowerCase())
    ) : SAMPLE_DATA;
    const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);
    const simulateLoad = () => {
      setLoading(true);
      setError(null);
      setTimeout(() => setLoading(false), 2e3);
    };
    const simulateError = () => {
      setError("Failed to fetch data from server.");
    };
    const clearError = () => {
      setError(null);
    };
    return /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "sm" }, /* @__PURE__ */ React2.createElement(Heading, null, "Server-Side Mode"), /* @__PURE__ */ React2.createElement(Text, { variant: "microcopy" }, "Simulated server-side with loading/error states. Use the buttons to test each state."), /* @__PURE__ */ React2.createElement(Flex, { direction: "row", gap: "sm" }, /* @__PURE__ */ React2.createElement(Button, { size: "small", onClick: simulateLoad }, "Simulate Loading (2s)"), /* @__PURE__ */ React2.createElement(Button, { size: "small", variant: "destructive", onClick: simulateError }, "Simulate Error"), /* @__PURE__ */ React2.createElement(Button, { size: "small", variant: "secondary", onClick: clearError }, "Clear Error")), /* @__PURE__ */ React2.createElement(
      DataTable,
      {
        serverSide: true,
        loading,
        error,
        data: pageData,
        totalCount: filtered.length,
        columns: SERVER_COLUMNS,
        searchFields: ["name", "contact"],
        searchPlaceholder: "Search (debounced 500ms)...",
        pageSize,
        page,
        searchDebounce: 500,
        onSearchChange: (term) => setSearch(term),
        onPageChange: (p) => setPage(p)
      }
    ));
  };
  hubspot.extend(() => /* @__PURE__ */ React2.createElement(DataTableDemoCard, null));
  const DataTableDemoCard = () => /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "lg" }, /* @__PURE__ */ React2.createElement(FullFeaturedDemo, null), /* @__PURE__ */ React2.createElement(Divider, null), /* @__PURE__ */ React2.createElement(SelectableDemo, null), /* @__PURE__ */ React2.createElement(Divider, null), /* @__PURE__ */ React2.createElement(EditableDemo, null), /* @__PURE__ */ React2.createElement(Divider, null), /* @__PURE__ */ React2.createElement(InlineEditDemo, null), /* @__PURE__ */ React2.createElement(Divider, null), /* @__PURE__ */ React2.createElement(GroupedDemo, null), /* @__PURE__ */ React2.createElement(Divider, null), /* @__PURE__ */ React2.createElement(ServerSideDemo, null));
})(React, RemoteUI);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YVRhYmxlRGVtby5qcyIsInNvdXJjZXMiOlsiLi4vY2FyZHMvbm9kZV9tb2R1bGVzL0BodWJzcG90L3VpLWV4dGVuc2lvbnMvZGlzdC9pbnRlcm5hbC9nbG9iYWwtdXRpbHMuanMiLCIuLi9jYXJkcy9ub2RlX21vZHVsZXMvQGh1YnNwb3QvdWktZXh0ZW5zaW9ucy9kaXN0L2h1YnNwb3QuanMiLCIuLi9jYXJkcy9ub2RlX21vZHVsZXMvQGh1YnNwb3QvdWktZXh0ZW5zaW9ucy9kaXN0L3NoYXJlZC90eXBlcy9odHRwLXJlcXVlc3RzLmpzIiwiLi4vY2FyZHMvbm9kZV9tb2R1bGVzL3JlYWN0L2Nqcy9yZWFjdC1qc3gtcnVudGltZS5kZXZlbG9wbWVudC5qcyIsIi4uL2NhcmRzL25vZGVfbW9kdWxlcy9yZWFjdC9qc3gtcnVudGltZS5qcyIsIi4uL2NhcmRzL25vZGVfbW9kdWxlcy9AaHVic3BvdC91aS1leHRlbnNpb25zL2Rpc3Qvc2hhcmVkL3V0aWxzL3JlbW90ZS1jb21wb25lbnQtcmVnaXN0cnkuanMiLCIuLi9jYXJkcy9ub2RlX21vZHVsZXMvQGh1YnNwb3QvdWktZXh0ZW5zaW9ucy9kaXN0L3NoYXJlZC9yZW1vdGVDb21wb25lbnRzLmpzIiwiLi4vY2FyZHMvbm9kZV9tb2R1bGVzL0BodWJzcG90L3VpLWV4dGVuc2lvbnMvZGlzdC9pbnRlcm5hbC9ob29rLXV0aWxzLmpzIiwiLi4vY2FyZHMvY29tcG9uZW50cy9EYXRhVGFibGUuanN4IiwiLi4vY2FyZHMvRGF0YVRhYmxlRGVtby5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDaGVja3MgaWYgdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQgaXMgYSBIdWJTcG90IGV4dGVuc2lvbiB3b3JrZXIuXG4gKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBjdXJyZW50IGVudmlyb25tZW50IGlzIGEgSHViU3BvdCBleHRlbnNpb24gd29ya2VyLlxuICovXG5jb25zdCBpc1J1bm5pbmdJbldvcmtlciA9ICgpID0+IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHNlbGYuX19IVUJTUE9UX0VYVEVOU0lPTl9XT1JLRVJfXyA9PT0gdHJ1ZTtcbi8qKlxuICogQSBmYWtlIHdvcmtlciBnbG9iYWxzIG9iamVjdCBmb3IgdXNlIGluIHRlc3QgZW52aXJvbm1lbnRzLlxuICovXG5jb25zdCBmYWtlV29ya2VyR2xvYmFscyA9IHtcbiAgICBsb2dnZXI6IHtcbiAgICAgICAgZGVidWc6IChkYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5mbzogKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhkYXRhKTtcbiAgICAgICAgfSxcbiAgICAgICAgd2FybjogKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihkYXRhKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IChkYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGRhdGEpO1xuICAgICAgICB9LFxuICAgIH0sXG4gICAgZXh0ZW5kX1YyOiAoKSA9PiB7XG4gICAgICAgIC8vIE5vLW9wIGluIHRlc3QgZW52aXJvbm1lbnRcbiAgICB9LFxuICAgIC8vIEB0cy1leHBlY3QtZXJyb3Igd2UgYXJlIG5vdCB1c2luZyB0aGUgd29ya2VyIGVuZHBvaW50IGluIHRlc3RzIGVudi5cbiAgICBfX3VzZUV4dGVuc2lvbkNvbnRleHQ6ICgpID0+IHtcbiAgICAgICAgLy8gTm8tb3AgaW4gdGVzdCBlbnZpcm9ubWVudFxuICAgIH0sXG59O1xuLyoqXG4gKiBHZXRzIHRoZSB3b3JrZXIgZ2xvYmFscyBvYmplY3QgZm9yIHRoZSBjdXJyZW50IGVudmlyb25tZW50LlxuICogQHJldHVybnMgVGhlIHdvcmtlciBnbG9iYWxzIG9iamVjdC5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldFdvcmtlckdsb2JhbHMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGlzUnVubmluZ0luV29ya2VyKClcbiAgICAgICAgPyBzZWxmXG4gICAgICAgIDogZmFrZVdvcmtlckdsb2JhbHM7XG59O1xuIiwiaW1wb3J0IHsgZ2V0V29ya2VyR2xvYmFscyB9IGZyb20gXCIuL2ludGVybmFsL2dsb2JhbC11dGlscy5qc1wiO1xuY29uc3QgZXh0ZW5kX1YyID0gZ2V0V29ya2VyR2xvYmFscygpLmV4dGVuZF9WMjtcbmV4cG9ydCBmdW5jdGlvbiBzZXJ2ZXJsZXNzKG5hbWUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VsZi5zZXJ2ZXJsZXNzKG5hbWUsIG9wdGlvbnMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoKHVybCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZWxmLmhzRmV0Y2godXJsLCBvcHRpb25zKTtcbn1cbmV4cG9ydCBjb25zdCBodWJzcG90ID0ge1xuICAgIGV4dGVuZDogZXh0ZW5kX1YyLFxuICAgIHNlcnZlcmxlc3MsXG4gICAgZmV0Y2gsXG59O1xuIiwiLyoqXG4gKiBAY2F0ZWdvcnkgU2VydmVybGVzc1xuICovXG5leHBvcnQgdmFyIFNlcnZlcmxlc3NFeGVjdXRpb25TdGF0dXM7XG4oZnVuY3Rpb24gKFNlcnZlcmxlc3NFeGVjdXRpb25TdGF0dXMpIHtcbiAgICBTZXJ2ZXJsZXNzRXhlY3V0aW9uU3RhdHVzW1wiU3VjY2Vzc1wiXSA9IFwiU1VDQ0VTU1wiO1xuICAgIFNlcnZlcmxlc3NFeGVjdXRpb25TdGF0dXNbXCJFcnJvclwiXSA9IFwiRVJST1JcIjtcbn0pKFNlcnZlcmxlc3NFeGVjdXRpb25TdGF0dXMgfHwgKFNlcnZlcmxlc3NFeGVjdXRpb25TdGF0dXMgPSB7fSkpO1xuIiwiLyoqXG4gKiBAbGljZW5zZSBSZWFjdFxuICogcmVhY3QtanN4LXJ1bnRpbWUuZGV2ZWxvcG1lbnQuanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgKGZ1bmN0aW9uKCkge1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG4vLyBBVFRFTlRJT05cbi8vIFdoZW4gYWRkaW5nIG5ldyBzeW1ib2xzIHRvIHRoaXMgZmlsZSxcbi8vIFBsZWFzZSBjb25zaWRlciBhbHNvIGFkZGluZyB0byAncmVhY3QtZGV2dG9vbHMtc2hhcmVkL3NyYy9iYWNrZW5kL1JlYWN0U3ltYm9scydcbi8vIFRoZSBTeW1ib2wgdXNlZCB0byB0YWcgdGhlIFJlYWN0RWxlbWVudC1saWtlIHR5cGVzLlxudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKTtcbnZhciBSRUFDVF9QT1JUQUxfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LnBvcnRhbCcpO1xudmFyIFJFQUNUX0ZSQUdNRU5UX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5mcmFnbWVudCcpO1xudmFyIFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5zdHJpY3RfbW9kZScpO1xudmFyIFJFQUNUX1BST0ZJTEVSX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5wcm9maWxlcicpO1xudmFyIFJFQUNUX1BST1ZJREVSX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5wcm92aWRlcicpO1xudmFyIFJFQUNUX0NPTlRFWFRfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LmNvbnRleHQnKTtcbnZhciBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFID0gU3ltYm9sLmZvcigncmVhY3QuZm9yd2FyZF9yZWYnKTtcbnZhciBSRUFDVF9TVVNQRU5TRV9UWVBFID0gU3ltYm9sLmZvcigncmVhY3Quc3VzcGVuc2UnKTtcbnZhciBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5zdXNwZW5zZV9saXN0Jyk7XG52YXIgUkVBQ1RfTUVNT19UWVBFID0gU3ltYm9sLmZvcigncmVhY3QubWVtbycpO1xudmFyIFJFQUNUX0xBWllfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LmxhenknKTtcbnZhciBSRUFDVF9PRkZTQ1JFRU5fVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0Lm9mZnNjcmVlbicpO1xudmFyIE1BWUJFX0lURVJBVE9SX1NZTUJPTCA9IFN5bWJvbC5pdGVyYXRvcjtcbnZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJztcbmZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICBpZiAobWF5YmVJdGVyYWJsZSA9PT0gbnVsbCB8fCB0eXBlb2YgbWF5YmVJdGVyYWJsZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBtYXliZUl0ZXJhdG9yID0gTUFZQkVfSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbTUFZQkVfSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXTtcblxuICBpZiAodHlwZW9mIG1heWJlSXRlcmF0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gbWF5YmVJdGVyYXRvcjtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG52YXIgUmVhY3RTaGFyZWRJbnRlcm5hbHMgPSBSZWFjdC5fX1NFQ1JFVF9JTlRFUk5BTFNfRE9fTk9UX1VTRV9PUl9ZT1VfV0lMTF9CRV9GSVJFRDtcblxuZnVuY3Rpb24gZXJyb3IoZm9ybWF0KSB7XG4gIHtcbiAgICB7XG4gICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBhcmdzW19rZXkyIC0gMV0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICBwcmludFdhcm5pbmcoJ2Vycm9yJywgZm9ybWF0LCBhcmdzKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJpbnRXYXJuaW5nKGxldmVsLCBmb3JtYXQsIGFyZ3MpIHtcbiAgLy8gV2hlbiBjaGFuZ2luZyB0aGlzIGxvZ2ljLCB5b3UgbWlnaHQgd2FudCB0byBhbHNvXG4gIC8vIHVwZGF0ZSBjb25zb2xlV2l0aFN0YWNrRGV2Lnd3dy5qcyBhcyB3ZWxsLlxuICB7XG4gICAgdmFyIFJlYWN0RGVidWdDdXJyZW50RnJhbWUgPSBSZWFjdFNoYXJlZEludGVybmFscy5SZWFjdERlYnVnQ3VycmVudEZyYW1lO1xuICAgIHZhciBzdGFjayA9IFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSgpO1xuXG4gICAgaWYgKHN0YWNrICE9PSAnJykge1xuICAgICAgZm9ybWF0ICs9ICclcyc7XG4gICAgICBhcmdzID0gYXJncy5jb25jYXQoW3N0YWNrXSk7XG4gICAgfSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaW50ZXJuYWwvc2FmZS1zdHJpbmctY29lcmNpb25cblxuXG4gICAgdmFyIGFyZ3NXaXRoRm9ybWF0ID0gYXJncy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBTdHJpbmcoaXRlbSk7XG4gICAgfSk7IC8vIENhcmVmdWw6IFJOIGN1cnJlbnRseSBkZXBlbmRzIG9uIHRoaXMgcHJlZml4XG5cbiAgICBhcmdzV2l0aEZvcm1hdC51bnNoaWZ0KCdXYXJuaW5nOiAnICsgZm9ybWF0KTsgLy8gV2UgaW50ZW50aW9uYWxseSBkb24ndCB1c2Ugc3ByZWFkIChvciAuYXBwbHkpIGRpcmVjdGx5IGJlY2F1c2UgaXRcbiAgICAvLyBicmVha3MgSUU5OiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzEzNjEwXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWludGVybmFsL25vLXByb2R1Y3Rpb24tbG9nZ2luZ1xuXG4gICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZVtsZXZlbF0sIGNvbnNvbGUsIGFyZ3NXaXRoRm9ybWF0KTtcbiAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgZW5hYmxlU2NvcGVBUEkgPSBmYWxzZTsgLy8gRXhwZXJpbWVudGFsIENyZWF0ZSBFdmVudCBIYW5kbGUgQVBJLlxudmFyIGVuYWJsZUNhY2hlRWxlbWVudCA9IGZhbHNlO1xudmFyIGVuYWJsZVRyYW5zaXRpb25UcmFjaW5nID0gZmFsc2U7IC8vIE5vIGtub3duIGJ1Z3MsIGJ1dCBuZWVkcyBwZXJmb3JtYW5jZSB0ZXN0aW5nXG5cbnZhciBlbmFibGVMZWdhY3lIaWRkZW4gPSBmYWxzZTsgLy8gRW5hYmxlcyB1bnN0YWJsZV9hdm9pZFRoaXNGYWxsYmFjayBmZWF0dXJlIGluIEZpYmVyXG4vLyBzdHVmZi4gSW50ZW5kZWQgdG8gZW5hYmxlIFJlYWN0IGNvcmUgbWVtYmVycyB0byBtb3JlIGVhc2lseSBkZWJ1ZyBzY2hlZHVsaW5nXG4vLyBpc3N1ZXMgaW4gREVWIGJ1aWxkcy5cblxudmFyIGVuYWJsZURlYnVnVHJhY2luZyA9IGZhbHNlOyAvLyBUcmFjayB3aGljaCBGaWJlcihzKSBzY2hlZHVsZSByZW5kZXIgd29yay5cblxudmFyIFJFQUNUX01PRFVMRV9SRUZFUkVOQ0U7XG5cbntcbiAgUkVBQ1RfTU9EVUxFX1JFRkVSRU5DRSA9IFN5bWJvbC5mb3IoJ3JlYWN0Lm1vZHVsZS5yZWZlcmVuY2UnKTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpIHtcbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9IC8vIE5vdGU6IHR5cGVvZiBtaWdodCBiZSBvdGhlciB0aGFuICdzeW1ib2wnIG9yICdudW1iZXInIChlLmcuIGlmIGl0J3MgYSBwb2x5ZmlsbCkuXG5cblxuICBpZiAodHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9QUk9GSUxFUl9UWVBFIHx8IGVuYWJsZURlYnVnVHJhY2luZyAgfHwgdHlwZSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSB8fCBlbmFibGVMZWdhY3lIaWRkZW4gIHx8IHR5cGUgPT09IFJFQUNUX09GRlNDUkVFTl9UWVBFIHx8IGVuYWJsZVNjb3BlQVBJICB8fCBlbmFibGVDYWNoZUVsZW1lbnQgIHx8IGVuYWJsZVRyYW5zaXRpb25UcmFjaW5nICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiB0eXBlICE9PSBudWxsKSB7XG4gICAgaWYgKHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0xBWllfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9DT05URVhUX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSB8fCAvLyBUaGlzIG5lZWRzIHRvIGluY2x1ZGUgYWxsIHBvc3NpYmxlIG1vZHVsZSByZWZlcmVuY2Ugb2JqZWN0XG4gICAgLy8gdHlwZXMgc3VwcG9ydGVkIGJ5IGFueSBGbGlnaHQgY29uZmlndXJhdGlvbiBhbnl3aGVyZSBzaW5jZVxuICAgIC8vIHdlIGRvbid0IGtub3cgd2hpY2ggRmxpZ2h0IGJ1aWxkIHRoaXMgd2lsbCBlbmQgdXAgYmVpbmcgdXNlZFxuICAgIC8vIHdpdGguXG4gICAgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTU9EVUxFX1JFRkVSRU5DRSB8fCB0eXBlLmdldE1vZHVsZUlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZ2V0V3JhcHBlZE5hbWUob3V0ZXJUeXBlLCBpbm5lclR5cGUsIHdyYXBwZXJOYW1lKSB7XG4gIHZhciBkaXNwbGF5TmFtZSA9IG91dGVyVHlwZS5kaXNwbGF5TmFtZTtcblxuICBpZiAoZGlzcGxheU5hbWUpIHtcbiAgICByZXR1cm4gZGlzcGxheU5hbWU7XG4gIH1cblxuICB2YXIgZnVuY3Rpb25OYW1lID0gaW5uZXJUeXBlLmRpc3BsYXlOYW1lIHx8IGlubmVyVHlwZS5uYW1lIHx8ICcnO1xuICByZXR1cm4gZnVuY3Rpb25OYW1lICE9PSAnJyA/IHdyYXBwZXJOYW1lICsgXCIoXCIgKyBmdW5jdGlvbk5hbWUgKyBcIilcIiA6IHdyYXBwZXJOYW1lO1xufSAvLyBLZWVwIGluIHN5bmMgd2l0aCByZWFjdC1yZWNvbmNpbGVyL2dldENvbXBvbmVudE5hbWVGcm9tRmliZXJcblxuXG5mdW5jdGlvbiBnZXRDb250ZXh0TmFtZSh0eXBlKSB7XG4gIHJldHVybiB0eXBlLmRpc3BsYXlOYW1lIHx8ICdDb250ZXh0Jztcbn0gLy8gTm90ZSB0aGF0IHRoZSByZWNvbmNpbGVyIHBhY2thZ2Ugc2hvdWxkIGdlbmVyYWxseSBwcmVmZXIgdG8gdXNlIGdldENvbXBvbmVudE5hbWVGcm9tRmliZXIoKSBpbnN0ZWFkLlxuXG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0eXBlKSB7XG4gIGlmICh0eXBlID09IG51bGwpIHtcbiAgICAvLyBIb3N0IHJvb3QsIHRleHQgbm9kZSBvciBqdXN0IGludmFsaWQgdHlwZS5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHtcbiAgICBpZiAodHlwZW9mIHR5cGUudGFnID09PSAnbnVtYmVyJykge1xuICAgICAgZXJyb3IoJ1JlY2VpdmVkIGFuIHVuZXhwZWN0ZWQgb2JqZWN0IGluIGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSgpLiAnICsgJ1RoaXMgaXMgbGlrZWx5IGEgYnVnIGluIFJlYWN0LiBQbGVhc2UgZmlsZSBhbiBpc3N1ZS4nKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgbnVsbDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgUkVBQ1RfRlJBR01FTlRfVFlQRTpcbiAgICAgIHJldHVybiAnRnJhZ21lbnQnO1xuXG4gICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgIHJldHVybiAnUG9ydGFsJztcblxuICAgIGNhc2UgUkVBQ1RfUFJPRklMRVJfVFlQRTpcbiAgICAgIHJldHVybiAnUHJvZmlsZXInO1xuXG4gICAgY2FzZSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFOlxuICAgICAgcmV0dXJuICdTdHJpY3RNb2RlJztcblxuICAgIGNhc2UgUkVBQ1RfU1VTUEVOU0VfVFlQRTpcbiAgICAgIHJldHVybiAnU3VzcGVuc2UnO1xuXG4gICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEU6XG4gICAgICByZXR1cm4gJ1N1c3BlbnNlTGlzdCc7XG5cbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBzd2l0Y2ggKHR5cGUuJCR0eXBlb2YpIHtcbiAgICAgIGNhc2UgUkVBQ1RfQ09OVEVYVF9UWVBFOlxuICAgICAgICB2YXIgY29udGV4dCA9IHR5cGU7XG4gICAgICAgIHJldHVybiBnZXRDb250ZXh0TmFtZShjb250ZXh0KSArICcuQ29uc3VtZXInO1xuXG4gICAgICBjYXNlIFJFQUNUX1BST1ZJREVSX1RZUEU6XG4gICAgICAgIHZhciBwcm92aWRlciA9IHR5cGU7XG4gICAgICAgIHJldHVybiBnZXRDb250ZXh0TmFtZShwcm92aWRlci5fY29udGV4dCkgKyAnLlByb3ZpZGVyJztcblxuICAgICAgY2FzZSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFOlxuICAgICAgICByZXR1cm4gZ2V0V3JhcHBlZE5hbWUodHlwZSwgdHlwZS5yZW5kZXIsICdGb3J3YXJkUmVmJyk7XG5cbiAgICAgIGNhc2UgUkVBQ1RfTUVNT19UWVBFOlxuICAgICAgICB2YXIgb3V0ZXJOYW1lID0gdHlwZS5kaXNwbGF5TmFtZSB8fCBudWxsO1xuXG4gICAgICAgIGlmIChvdXRlck5hbWUgIT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gb3V0ZXJOYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0eXBlLnR5cGUpIHx8ICdNZW1vJztcblxuICAgICAgY2FzZSBSRUFDVF9MQVpZX1RZUEU6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgbGF6eUNvbXBvbmVudCA9IHR5cGU7XG4gICAgICAgICAgdmFyIHBheWxvYWQgPSBsYXp5Q29tcG9uZW50Ll9wYXlsb2FkO1xuICAgICAgICAgIHZhciBpbml0ID0gbGF6eUNvbXBvbmVudC5faW5pdDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0Q29tcG9uZW50TmFtZUZyb21UeXBlKGluaXQocGF5bG9hZCkpO1xuICAgICAgICAgIH0gY2F0Y2ggKHgpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZmFsbHRocm91Z2hcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxudmFyIGFzc2lnbiA9IE9iamVjdC5hc3NpZ247XG5cbi8vIEhlbHBlcnMgdG8gcGF0Y2ggY29uc29sZS5sb2dzIHRvIGF2b2lkIGxvZ2dpbmcgZHVyaW5nIHNpZGUtZWZmZWN0IGZyZWVcbi8vIHJlcGxheWluZyBvbiByZW5kZXIgZnVuY3Rpb24uIFRoaXMgY3VycmVudGx5IG9ubHkgcGF0Y2hlcyB0aGUgb2JqZWN0XG4vLyBsYXppbHkgd2hpY2ggd29uJ3QgY292ZXIgaWYgdGhlIGxvZyBmdW5jdGlvbiB3YXMgZXh0cmFjdGVkIGVhZ2VybHkuXG4vLyBXZSBjb3VsZCBhbHNvIGVhZ2VybHkgcGF0Y2ggdGhlIG1ldGhvZC5cbnZhciBkaXNhYmxlZERlcHRoID0gMDtcbnZhciBwcmV2TG9nO1xudmFyIHByZXZJbmZvO1xudmFyIHByZXZXYXJuO1xudmFyIHByZXZFcnJvcjtcbnZhciBwcmV2R3JvdXA7XG52YXIgcHJldkdyb3VwQ29sbGFwc2VkO1xudmFyIHByZXZHcm91cEVuZDtcblxuZnVuY3Rpb24gZGlzYWJsZWRMb2coKSB7fVxuXG5kaXNhYmxlZExvZy5fX3JlYWN0RGlzYWJsZWRMb2cgPSB0cnVlO1xuZnVuY3Rpb24gZGlzYWJsZUxvZ3MoKSB7XG4gIHtcbiAgICBpZiAoZGlzYWJsZWREZXB0aCA9PT0gMCkge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgcmVhY3QtaW50ZXJuYWwvbm8tcHJvZHVjdGlvbi1sb2dnaW5nICovXG4gICAgICBwcmV2TG9nID0gY29uc29sZS5sb2c7XG4gICAgICBwcmV2SW5mbyA9IGNvbnNvbGUuaW5mbztcbiAgICAgIHByZXZXYXJuID0gY29uc29sZS53YXJuO1xuICAgICAgcHJldkVycm9yID0gY29uc29sZS5lcnJvcjtcbiAgICAgIHByZXZHcm91cCA9IGNvbnNvbGUuZ3JvdXA7XG4gICAgICBwcmV2R3JvdXBDb2xsYXBzZWQgPSBjb25zb2xlLmdyb3VwQ29sbGFwc2VkO1xuICAgICAgcHJldkdyb3VwRW5kID0gY29uc29sZS5ncm91cEVuZDsgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8xOTA5OVxuXG4gICAgICB2YXIgcHJvcHMgPSB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6IGRpc2FibGVkTG9nLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfTsgLy8gJEZsb3dGaXhNZSBGbG93IHRoaW5rcyBjb25zb2xlIGlzIGltbXV0YWJsZS5cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY29uc29sZSwge1xuICAgICAgICBpbmZvOiBwcm9wcyxcbiAgICAgICAgbG9nOiBwcm9wcyxcbiAgICAgICAgd2FybjogcHJvcHMsXG4gICAgICAgIGVycm9yOiBwcm9wcyxcbiAgICAgICAgZ3JvdXA6IHByb3BzLFxuICAgICAgICBncm91cENvbGxhcHNlZDogcHJvcHMsXG4gICAgICAgIGdyb3VwRW5kOiBwcm9wc1xuICAgICAgfSk7XG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIHJlYWN0LWludGVybmFsL25vLXByb2R1Y3Rpb24tbG9nZ2luZyAqL1xuICAgIH1cblxuICAgIGRpc2FibGVkRGVwdGgrKztcbiAgfVxufVxuZnVuY3Rpb24gcmVlbmFibGVMb2dzKCkge1xuICB7XG4gICAgZGlzYWJsZWREZXB0aC0tO1xuXG4gICAgaWYgKGRpc2FibGVkRGVwdGggPT09IDApIHtcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIHJlYWN0LWludGVybmFsL25vLXByb2R1Y3Rpb24tbG9nZ2luZyAqL1xuICAgICAgdmFyIHByb3BzID0ge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9OyAvLyAkRmxvd0ZpeE1lIEZsb3cgdGhpbmtzIGNvbnNvbGUgaXMgaW1tdXRhYmxlLlxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhjb25zb2xlLCB7XG4gICAgICAgIGxvZzogYXNzaWduKHt9LCBwcm9wcywge1xuICAgICAgICAgIHZhbHVlOiBwcmV2TG9nXG4gICAgICAgIH0pLFxuICAgICAgICBpbmZvOiBhc3NpZ24oe30sIHByb3BzLCB7XG4gICAgICAgICAgdmFsdWU6IHByZXZJbmZvXG4gICAgICAgIH0pLFxuICAgICAgICB3YXJuOiBhc3NpZ24oe30sIHByb3BzLCB7XG4gICAgICAgICAgdmFsdWU6IHByZXZXYXJuXG4gICAgICAgIH0pLFxuICAgICAgICBlcnJvcjogYXNzaWduKHt9LCBwcm9wcywge1xuICAgICAgICAgIHZhbHVlOiBwcmV2RXJyb3JcbiAgICAgICAgfSksXG4gICAgICAgIGdyb3VwOiBhc3NpZ24oe30sIHByb3BzLCB7XG4gICAgICAgICAgdmFsdWU6IHByZXZHcm91cFxuICAgICAgICB9KSxcbiAgICAgICAgZ3JvdXBDb2xsYXBzZWQ6IGFzc2lnbih7fSwgcHJvcHMsIHtcbiAgICAgICAgICB2YWx1ZTogcHJldkdyb3VwQ29sbGFwc2VkXG4gICAgICAgIH0pLFxuICAgICAgICBncm91cEVuZDogYXNzaWduKHt9LCBwcm9wcywge1xuICAgICAgICAgIHZhbHVlOiBwcmV2R3JvdXBFbmRcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgICAgLyogZXNsaW50LWVuYWJsZSByZWFjdC1pbnRlcm5hbC9uby1wcm9kdWN0aW9uLWxvZ2dpbmcgKi9cbiAgICB9XG5cbiAgICBpZiAoZGlzYWJsZWREZXB0aCA8IDApIHtcbiAgICAgIGVycm9yKCdkaXNhYmxlZERlcHRoIGZlbGwgYmVsb3cgemVyby4gJyArICdUaGlzIGlzIGEgYnVnIGluIFJlYWN0LiBQbGVhc2UgZmlsZSBhbiBpc3N1ZS4nKTtcbiAgICB9XG4gIH1cbn1cblxudmFyIFJlYWN0Q3VycmVudERpc3BhdGNoZXIgPSBSZWFjdFNoYXJlZEludGVybmFscy5SZWFjdEN1cnJlbnREaXNwYXRjaGVyO1xudmFyIHByZWZpeDtcbmZ1bmN0aW9uIGRlc2NyaWJlQnVpbHRJbkNvbXBvbmVudEZyYW1lKG5hbWUsIHNvdXJjZSwgb3duZXJGbikge1xuICB7XG4gICAgaWYgKHByZWZpeCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBFeHRyYWN0IHRoZSBWTSBzcGVjaWZpYyBwcmVmaXggdXNlZCBieSBlYWNoIGxpbmUuXG4gICAgICB0cnkge1xuICAgICAgICB0aHJvdyBFcnJvcigpO1xuICAgICAgfSBjYXRjaCAoeCkge1xuICAgICAgICB2YXIgbWF0Y2ggPSB4LnN0YWNrLnRyaW0oKS5tYXRjaCgvXFxuKCAqKGF0ICk/KS8pO1xuICAgICAgICBwcmVmaXggPSBtYXRjaCAmJiBtYXRjaFsxXSB8fCAnJztcbiAgICAgIH1cbiAgICB9IC8vIFdlIHVzZSB0aGUgcHJlZml4IHRvIGVuc3VyZSBvdXIgc3RhY2tzIGxpbmUgdXAgd2l0aCBuYXRpdmUgc3RhY2sgZnJhbWVzLlxuXG5cbiAgICByZXR1cm4gJ1xcbicgKyBwcmVmaXggKyBuYW1lO1xuICB9XG59XG52YXIgcmVlbnRyeSA9IGZhbHNlO1xudmFyIGNvbXBvbmVudEZyYW1lQ2FjaGU7XG5cbntcbiAgdmFyIFBvc3NpYmx5V2Vha01hcCA9IHR5cGVvZiBXZWFrTWFwID09PSAnZnVuY3Rpb24nID8gV2Vha01hcCA6IE1hcDtcbiAgY29tcG9uZW50RnJhbWVDYWNoZSA9IG5ldyBQb3NzaWJseVdlYWtNYXAoKTtcbn1cblxuZnVuY3Rpb24gZGVzY3JpYmVOYXRpdmVDb21wb25lbnRGcmFtZShmbiwgY29uc3RydWN0KSB7XG4gIC8vIElmIHNvbWV0aGluZyBhc2tlZCBmb3IgYSBzdGFjayBpbnNpZGUgYSBmYWtlIHJlbmRlciwgaXQgc2hvdWxkIGdldCBpZ25vcmVkLlxuICBpZiAoICFmbiB8fCByZWVudHJ5KSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAge1xuICAgIHZhciBmcmFtZSA9IGNvbXBvbmVudEZyYW1lQ2FjaGUuZ2V0KGZuKTtcblxuICAgIGlmIChmcmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZnJhbWU7XG4gICAgfVxuICB9XG5cbiAgdmFyIGNvbnRyb2w7XG4gIHJlZW50cnkgPSB0cnVlO1xuICB2YXIgcHJldmlvdXNQcmVwYXJlU3RhY2tUcmFjZSA9IEVycm9yLnByZXBhcmVTdGFja1RyYWNlOyAvLyAkRmxvd0ZpeE1lIEl0IGRvZXMgYWNjZXB0IHVuZGVmaW5lZC5cblxuICBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZSA9IHVuZGVmaW5lZDtcbiAgdmFyIHByZXZpb3VzRGlzcGF0Y2hlcjtcblxuICB7XG4gICAgcHJldmlvdXNEaXNwYXRjaGVyID0gUmVhY3RDdXJyZW50RGlzcGF0Y2hlci5jdXJyZW50OyAvLyBTZXQgdGhlIGRpc3BhdGNoZXIgaW4gREVWIGJlY2F1c2UgdGhpcyBtaWdodCBiZSBjYWxsIGluIHRoZSByZW5kZXIgZnVuY3Rpb25cbiAgICAvLyBmb3Igd2FybmluZ3MuXG5cbiAgICBSZWFjdEN1cnJlbnREaXNwYXRjaGVyLmN1cnJlbnQgPSBudWxsO1xuICAgIGRpc2FibGVMb2dzKCk7XG4gIH1cblxuICB0cnkge1xuICAgIC8vIFRoaXMgc2hvdWxkIHRocm93LlxuICAgIGlmIChjb25zdHJ1Y3QpIHtcbiAgICAgIC8vIFNvbWV0aGluZyBzaG91bGQgYmUgc2V0dGluZyB0aGUgcHJvcHMgaW4gdGhlIGNvbnN0cnVjdG9yLlxuICAgICAgdmFyIEZha2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRocm93IEVycm9yKCk7XG4gICAgICB9OyAvLyAkRmxvd0ZpeE1lXG5cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZha2UucHJvdG90eXBlLCAncHJvcHMnLCB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIFdlIHVzZSBhIHRocm93aW5nIHNldHRlciBpbnN0ZWFkIG9mIGZyb3plbiBvciBub24td3JpdGFibGUgcHJvcHNcbiAgICAgICAgICAvLyBiZWNhdXNlIHRoYXQgd29uJ3QgdGhyb3cgaW4gYSBub24tc3RyaWN0IG1vZGUgZnVuY3Rpb24uXG4gICAgICAgICAgdGhyb3cgRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gJ29iamVjdCcgJiYgUmVmbGVjdC5jb25zdHJ1Y3QpIHtcbiAgICAgICAgLy8gV2UgY29uc3RydWN0IGEgZGlmZmVyZW50IGNvbnRyb2wgZm9yIHRoaXMgY2FzZSB0byBpbmNsdWRlIGFueSBleHRyYVxuICAgICAgICAvLyBmcmFtZXMgYWRkZWQgYnkgdGhlIGNvbnN0cnVjdCBjYWxsLlxuICAgICAgICB0cnkge1xuICAgICAgICAgIFJlZmxlY3QuY29uc3RydWN0KEZha2UsIFtdKTtcbiAgICAgICAgfSBjYXRjaCAoeCkge1xuICAgICAgICAgIGNvbnRyb2wgPSB4O1xuICAgICAgICB9XG5cbiAgICAgICAgUmVmbGVjdC5jb25zdHJ1Y3QoZm4sIFtdLCBGYWtlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgRmFrZS5jYWxsKCk7XG4gICAgICAgIH0gY2F0Y2ggKHgpIHtcbiAgICAgICAgICBjb250cm9sID0geDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZuLmNhbGwoRmFrZS5wcm90b3R5cGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aHJvdyBFcnJvcigpO1xuICAgICAgfSBjYXRjaCAoeCkge1xuICAgICAgICBjb250cm9sID0geDtcbiAgICAgIH1cblxuICAgICAgZm4oKTtcbiAgICB9XG4gIH0gY2F0Y2ggKHNhbXBsZSkge1xuICAgIC8vIFRoaXMgaXMgaW5saW5lZCBtYW51YWxseSBiZWNhdXNlIGNsb3N1cmUgZG9lc24ndCBkbyBpdCBmb3IgdXMuXG4gICAgaWYgKHNhbXBsZSAmJiBjb250cm9sICYmIHR5cGVvZiBzYW1wbGUuc3RhY2sgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBUaGlzIGV4dHJhY3RzIHRoZSBmaXJzdCBmcmFtZSBmcm9tIHRoZSBzYW1wbGUgdGhhdCBpc24ndCBhbHNvIGluIHRoZSBjb250cm9sLlxuICAgICAgLy8gU2tpcHBpbmcgb25lIGZyYW1lIHRoYXQgd2UgYXNzdW1lIGlzIHRoZSBmcmFtZSB0aGF0IGNhbGxzIHRoZSB0d28uXG4gICAgICB2YXIgc2FtcGxlTGluZXMgPSBzYW1wbGUuc3RhY2suc3BsaXQoJ1xcbicpO1xuICAgICAgdmFyIGNvbnRyb2xMaW5lcyA9IGNvbnRyb2wuc3RhY2suc3BsaXQoJ1xcbicpO1xuICAgICAgdmFyIHMgPSBzYW1wbGVMaW5lcy5sZW5ndGggLSAxO1xuICAgICAgdmFyIGMgPSBjb250cm9sTGluZXMubGVuZ3RoIC0gMTtcblxuICAgICAgd2hpbGUgKHMgPj0gMSAmJiBjID49IDAgJiYgc2FtcGxlTGluZXNbc10gIT09IGNvbnRyb2xMaW5lc1tjXSkge1xuICAgICAgICAvLyBXZSBleHBlY3QgYXQgbGVhc3Qgb25lIHN0YWNrIGZyYW1lIHRvIGJlIHNoYXJlZC5cbiAgICAgICAgLy8gVHlwaWNhbGx5IHRoaXMgd2lsbCBiZSB0aGUgcm9vdCBtb3N0IG9uZS4gSG93ZXZlciwgc3RhY2sgZnJhbWVzIG1heSBiZVxuICAgICAgICAvLyBjdXQgb2ZmIGR1ZSB0byBtYXhpbXVtIHN0YWNrIGxpbWl0cy4gSW4gdGhpcyBjYXNlLCBvbmUgbWF5YmUgY3V0IG9mZlxuICAgICAgICAvLyBlYXJsaWVyIHRoYW4gdGhlIG90aGVyLiBXZSBhc3N1bWUgdGhhdCB0aGUgc2FtcGxlIGlzIGxvbmdlciBvciB0aGUgc2FtZVxuICAgICAgICAvLyBhbmQgdGhlcmUgZm9yIGN1dCBvZmYgZWFybGllci4gU28gd2Ugc2hvdWxkIGZpbmQgdGhlIHJvb3QgbW9zdCBmcmFtZSBpblxuICAgICAgICAvLyB0aGUgc2FtcGxlIHNvbWV3aGVyZSBpbiB0aGUgY29udHJvbC5cbiAgICAgICAgYy0tO1xuICAgICAgfVxuXG4gICAgICBmb3IgKDsgcyA+PSAxICYmIGMgPj0gMDsgcy0tLCBjLS0pIHtcbiAgICAgICAgLy8gTmV4dCB3ZSBmaW5kIHRoZSBmaXJzdCBvbmUgdGhhdCBpc24ndCB0aGUgc2FtZSB3aGljaCBzaG91bGQgYmUgdGhlXG4gICAgICAgIC8vIGZyYW1lIHRoYXQgY2FsbGVkIG91ciBzYW1wbGUgZnVuY3Rpb24gYW5kIHRoZSBjb250cm9sLlxuICAgICAgICBpZiAoc2FtcGxlTGluZXNbc10gIT09IGNvbnRyb2xMaW5lc1tjXSkge1xuICAgICAgICAgIC8vIEluIFY4LCB0aGUgZmlyc3QgbGluZSBpcyBkZXNjcmliaW5nIHRoZSBtZXNzYWdlIGJ1dCBvdGhlciBWTXMgZG9uJ3QuXG4gICAgICAgICAgLy8gSWYgd2UncmUgYWJvdXQgdG8gcmV0dXJuIHRoZSBmaXJzdCBsaW5lLCBhbmQgdGhlIGNvbnRyb2wgaXMgYWxzbyBvbiB0aGUgc2FtZVxuICAgICAgICAgIC8vIGxpbmUsIHRoYXQncyBhIHByZXR0eSBnb29kIGluZGljYXRvciB0aGF0IG91ciBzYW1wbGUgdGhyZXcgYXQgc2FtZSBsaW5lIGFzXG4gICAgICAgICAgLy8gdGhlIGNvbnRyb2wuIEkuZS4gYmVmb3JlIHdlIGVudGVyZWQgdGhlIHNhbXBsZSBmcmFtZS4gU28gd2UgaWdub3JlIHRoaXMgcmVzdWx0LlxuICAgICAgICAgIC8vIFRoaXMgY2FuIGhhcHBlbiBpZiB5b3UgcGFzc2VkIGEgY2xhc3MgdG8gZnVuY3Rpb24gY29tcG9uZW50LCBvciBub24tZnVuY3Rpb24uXG4gICAgICAgICAgaWYgKHMgIT09IDEgfHwgYyAhPT0gMSkge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICBzLS07XG4gICAgICAgICAgICAgIGMtLTsgLy8gV2UgbWF5IHN0aWxsIGhhdmUgc2ltaWxhciBpbnRlcm1lZGlhdGUgZnJhbWVzIGZyb20gdGhlIGNvbnN0cnVjdCBjYWxsLlxuICAgICAgICAgICAgICAvLyBUaGUgbmV4dCBvbmUgdGhhdCBpc24ndCB0aGUgc2FtZSBzaG91bGQgYmUgb3VyIG1hdGNoIHRob3VnaC5cblxuICAgICAgICAgICAgICBpZiAoYyA8IDAgfHwgc2FtcGxlTGluZXNbc10gIT09IGNvbnRyb2xMaW5lc1tjXSkge1xuICAgICAgICAgICAgICAgIC8vIFY4IGFkZHMgYSBcIm5ld1wiIHByZWZpeCBmb3IgbmF0aXZlIGNsYXNzZXMuIExldCdzIHJlbW92ZSBpdCB0byBtYWtlIGl0IHByZXR0aWVyLlxuICAgICAgICAgICAgICAgIHZhciBfZnJhbWUgPSAnXFxuJyArIHNhbXBsZUxpbmVzW3NdLnJlcGxhY2UoJyBhdCBuZXcgJywgJyBhdCAnKTsgLy8gSWYgb3VyIGNvbXBvbmVudCBmcmFtZSBpcyBsYWJlbGVkIFwiPGFub255bW91cz5cIlxuICAgICAgICAgICAgICAgIC8vIGJ1dCB3ZSBoYXZlIGEgdXNlci1wcm92aWRlZCBcImRpc3BsYXlOYW1lXCJcbiAgICAgICAgICAgICAgICAvLyBzcGxpY2UgaXQgaW4gdG8gbWFrZSB0aGUgc3RhY2sgbW9yZSByZWFkYWJsZS5cblxuXG4gICAgICAgICAgICAgICAgaWYgKGZuLmRpc3BsYXlOYW1lICYmIF9mcmFtZS5pbmNsdWRlcygnPGFub255bW91cz4nKSkge1xuICAgICAgICAgICAgICAgICAgX2ZyYW1lID0gX2ZyYW1lLnJlcGxhY2UoJzxhbm9ueW1vdXM+JywgZm4uZGlzcGxheU5hbWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50RnJhbWVDYWNoZS5zZXQoZm4sIF9mcmFtZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSAvLyBSZXR1cm4gdGhlIGxpbmUgd2UgZm91bmQuXG5cblxuICAgICAgICAgICAgICAgIHJldHVybiBfZnJhbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gd2hpbGUgKHMgPj0gMSAmJiBjID49IDApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIHJlZW50cnkgPSBmYWxzZTtcblxuICAgIHtcbiAgICAgIFJlYWN0Q3VycmVudERpc3BhdGNoZXIuY3VycmVudCA9IHByZXZpb3VzRGlzcGF0Y2hlcjtcbiAgICAgIHJlZW5hYmxlTG9ncygpO1xuICAgIH1cblxuICAgIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gcHJldmlvdXNQcmVwYXJlU3RhY2tUcmFjZTtcbiAgfSAvLyBGYWxsYmFjayB0byBqdXN0IHVzaW5nIHRoZSBuYW1lIGlmIHdlIGNvdWxkbid0IG1ha2UgaXQgdGhyb3cuXG5cblxuICB2YXIgbmFtZSA9IGZuID8gZm4uZGlzcGxheU5hbWUgfHwgZm4ubmFtZSA6ICcnO1xuICB2YXIgc3ludGhldGljRnJhbWUgPSBuYW1lID8gZGVzY3JpYmVCdWlsdEluQ29tcG9uZW50RnJhbWUobmFtZSkgOiAnJztcblxuICB7XG4gICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29tcG9uZW50RnJhbWVDYWNoZS5zZXQoZm4sIHN5bnRoZXRpY0ZyYW1lKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3ludGhldGljRnJhbWU7XG59XG5mdW5jdGlvbiBkZXNjcmliZUZ1bmN0aW9uQ29tcG9uZW50RnJhbWUoZm4sIHNvdXJjZSwgb3duZXJGbikge1xuICB7XG4gICAgcmV0dXJuIGRlc2NyaWJlTmF0aXZlQ29tcG9uZW50RnJhbWUoZm4sIGZhbHNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzaG91bGRDb25zdHJ1Y3QoQ29tcG9uZW50KSB7XG4gIHZhciBwcm90b3R5cGUgPSBDb21wb25lbnQucHJvdG90eXBlO1xuICByZXR1cm4gISEocHJvdG90eXBlICYmIHByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50KTtcbn1cblxuZnVuY3Rpb24gZGVzY3JpYmVVbmtub3duRWxlbWVudFR5cGVGcmFtZUluREVWKHR5cGUsIHNvdXJjZSwgb3duZXJGbikge1xuXG4gIGlmICh0eXBlID09IG51bGwpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB7XG4gICAgICByZXR1cm4gZGVzY3JpYmVOYXRpdmVDb21wb25lbnRGcmFtZSh0eXBlLCBzaG91bGRDb25zdHJ1Y3QodHlwZSkpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZGVzY3JpYmVCdWlsdEluQ29tcG9uZW50RnJhbWUodHlwZSk7XG4gIH1cblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICByZXR1cm4gZGVzY3JpYmVCdWlsdEluQ29tcG9uZW50RnJhbWUoJ1N1c3BlbnNlJyk7XG5cbiAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRTpcbiAgICAgIHJldHVybiBkZXNjcmliZUJ1aWx0SW5Db21wb25lbnRGcmFtZSgnU3VzcGVuc2VMaXN0Jyk7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgc3dpdGNoICh0eXBlLiQkdHlwZW9mKSB7XG4gICAgICBjYXNlIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU6XG4gICAgICAgIHJldHVybiBkZXNjcmliZUZ1bmN0aW9uQ29tcG9uZW50RnJhbWUodHlwZS5yZW5kZXIpO1xuXG4gICAgICBjYXNlIFJFQUNUX01FTU9fVFlQRTpcbiAgICAgICAgLy8gTWVtbyBtYXkgY29udGFpbiBhbnkgY29tcG9uZW50IHR5cGUgc28gd2UgcmVjdXJzaXZlbHkgcmVzb2x2ZSBpdC5cbiAgICAgICAgcmV0dXJuIGRlc2NyaWJlVW5rbm93bkVsZW1lbnRUeXBlRnJhbWVJbkRFVih0eXBlLnR5cGUsIHNvdXJjZSwgb3duZXJGbik7XG5cbiAgICAgIGNhc2UgUkVBQ1RfTEFaWV9UWVBFOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIGxhenlDb21wb25lbnQgPSB0eXBlO1xuICAgICAgICAgIHZhciBwYXlsb2FkID0gbGF6eUNvbXBvbmVudC5fcGF5bG9hZDtcbiAgICAgICAgICB2YXIgaW5pdCA9IGxhenlDb21wb25lbnQuX2luaXQ7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gTGF6eSBtYXkgY29udGFpbiBhbnkgY29tcG9uZW50IHR5cGUgc28gd2UgcmVjdXJzaXZlbHkgcmVzb2x2ZSBpdC5cbiAgICAgICAgICAgIHJldHVybiBkZXNjcmliZVVua25vd25FbGVtZW50VHlwZUZyYW1lSW5ERVYoaW5pdChwYXlsb2FkKSwgc291cmNlLCBvd25lckZuKTtcbiAgICAgICAgICB9IGNhdGNoICh4KSB7fVxuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuICcnO1xufVxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG52YXIgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG52YXIgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlJlYWN0RGVidWdDdXJyZW50RnJhbWU7XG5cbmZ1bmN0aW9uIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpIHtcbiAge1xuICAgIGlmIChlbGVtZW50KSB7XG4gICAgICB2YXIgb3duZXIgPSBlbGVtZW50Ll9vd25lcjtcbiAgICAgIHZhciBzdGFjayA9IGRlc2NyaWJlVW5rbm93bkVsZW1lbnRUeXBlRnJhbWVJbkRFVihlbGVtZW50LnR5cGUsIGVsZW1lbnQuX3NvdXJjZSwgb3duZXIgPyBvd25lci50eXBlIDogbnVsbCk7XG4gICAgICBSZWFjdERlYnVnQ3VycmVudEZyYW1lLnNldEV4dHJhU3RhY2tGcmFtZShzdGFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuc2V0RXh0cmFTdGFja0ZyYW1lKG51bGwpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGNvbXBvbmVudE5hbWUsIGVsZW1lbnQpIHtcbiAge1xuICAgIC8vICRGbG93Rml4TWUgVGhpcyBpcyBva2F5IGJ1dCBGbG93IGRvZXNuJ3Qga25vdyBpdC5cbiAgICB2YXIgaGFzID0gRnVuY3Rpb24uY2FsbC5iaW5kKGhhc093blByb3BlcnR5KTtcblxuICAgIGZvciAodmFyIHR5cGVTcGVjTmFtZSBpbiB0eXBlU3BlY3MpIHtcbiAgICAgIGlmIChoYXModHlwZVNwZWNzLCB0eXBlU3BlY05hbWUpKSB7XG4gICAgICAgIHZhciBlcnJvciQxID0gdm9pZCAwOyAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAvLyBmYWlsIHRoZSByZW5kZXIgcGhhc2Ugd2hlcmUgaXQgZGlkbid0IGZhaWwgYmVmb3JlLiBTbyB3ZSBsb2cgaXQuXG4gICAgICAgIC8vIEFmdGVyIHRoZXNlIGhhdmUgYmVlbiBjbGVhbmVkIHVwLCB3ZSdsbCBsZXQgdGhlbSB0aHJvdy5cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgaW50ZW50aW9uYWxseSBhbiBpbnZhcmlhbnQgdGhhdCBnZXRzIGNhdWdodC4gSXQncyB0aGUgc2FtZVxuICAgICAgICAgIC8vIGJlaGF2aW9yIGFzIHdpdGhvdXQgdGhpcyBzdGF0ZW1lbnQgZXhjZXB0IHdpdGggYSBiZXR0ZXIgbWVzc2FnZS5cbiAgICAgICAgICBpZiAodHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaW50ZXJuYWwvcHJvZC1lcnJvci1jb2Rlc1xuICAgICAgICAgICAgdmFyIGVyciA9IEVycm9yKChjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycpICsgJzogJyArIGxvY2F0aW9uICsgJyB0eXBlIGAnICsgdHlwZVNwZWNOYW1lICsgJ2AgaXMgaW52YWxpZDsgJyArICdpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UsIGJ1dCByZWNlaXZlZCBgJyArIHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSArICdgLicgKyAnVGhpcyBvZnRlbiBoYXBwZW5zIGJlY2F1c2Ugb2YgdHlwb3Mgc3VjaCBhcyBgUHJvcFR5cGVzLmZ1bmN0aW9uYCBpbnN0ZWFkIG9mIGBQcm9wVHlwZXMuZnVuY2AuJyk7XG4gICAgICAgICAgICBlcnIubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBlcnJvciQxID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnKTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBlcnJvciQxID0gZXg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IkMSAmJiAhKGVycm9yJDEgaW5zdGFuY2VvZiBFcnJvcikpIHtcbiAgICAgICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KTtcblxuICAgICAgICAgIGVycm9yKCclczogdHlwZSBzcGVjaWZpY2F0aW9uIG9mICVzJyArICcgYCVzYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgKyAnZnVuY3Rpb24gbXVzdCByZXR1cm4gYG51bGxgIG9yIGFuIGBFcnJvcmAgYnV0IHJldHVybmVkIGEgJXMuICcgKyAnWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgJyArICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgKyAnc2hhcGUgYWxsIHJlcXVpcmUgYW4gYXJndW1lbnQpLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgbG9jYXRpb24sIHR5cGVTcGVjTmFtZSwgdHlwZW9mIGVycm9yJDEpO1xuXG4gICAgICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQobnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IkMSBpbnN0YW5jZW9mIEVycm9yICYmICEoZXJyb3IkMS5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgICAvLyBPbmx5IG1vbml0b3IgdGhpcyBmYWlsdXJlIG9uY2UgYmVjYXVzZSB0aGVyZSB0ZW5kcyB0byBiZSBhIGxvdCBvZiB0aGVcbiAgICAgICAgICAvLyBzYW1lIGVycm9yLlxuICAgICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvciQxLm1lc3NhZ2VdID0gdHJ1ZTtcbiAgICAgICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KTtcblxuICAgICAgICAgIGVycm9yKCdGYWlsZWQgJXMgdHlwZTogJXMnLCBsb2NhdGlvbiwgZXJyb3IkMS5tZXNzYWdlKTtcblxuICAgICAgICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KG51bGwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbnZhciBpc0FycmF5SW1wbCA9IEFycmF5LmlzQXJyYXk7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZWRlY2xhcmVcblxuZnVuY3Rpb24gaXNBcnJheShhKSB7XG4gIHJldHVybiBpc0FycmF5SW1wbChhKTtcbn1cblxuLypcbiAqIFRoZSBgJycgKyB2YWx1ZWAgcGF0dGVybiAodXNlZCBpbiBpbiBwZXJmLXNlbnNpdGl2ZSBjb2RlKSB0aHJvd3MgZm9yIFN5bWJvbFxuICogYW5kIFRlbXBvcmFsLiogdHlwZXMuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvcHVsbC8yMjA2NC5cbiAqXG4gKiBUaGUgZnVuY3Rpb25zIGluIHRoaXMgbW9kdWxlIHdpbGwgdGhyb3cgYW4gZWFzaWVyLXRvLXVuZGVyc3RhbmQsXG4gKiBlYXNpZXItdG8tZGVidWcgZXhjZXB0aW9uIHdpdGggYSBjbGVhciBlcnJvcnMgbWVzc2FnZSBtZXNzYWdlIGV4cGxhaW5pbmcgdGhlXG4gKiBwcm9ibGVtLiAoSW5zdGVhZCBvZiBhIGNvbmZ1c2luZyBleGNlcHRpb24gdGhyb3duIGluc2lkZSB0aGUgaW1wbGVtZW50YXRpb25cbiAqIG9mIHRoZSBgdmFsdWVgIG9iamVjdCkuXG4gKi9cbi8vICRGbG93Rml4TWUgb25seSBjYWxsZWQgaW4gREVWLCBzbyB2b2lkIHJldHVybiBpcyBub3QgcG9zc2libGUuXG5mdW5jdGlvbiB0eXBlTmFtZSh2YWx1ZSkge1xuICB7XG4gICAgLy8gdG9TdHJpbmdUYWcgaXMgbmVlZGVkIGZvciBuYW1lc3BhY2VkIHR5cGVzIGxpa2UgVGVtcG9yYWwuSW5zdGFudFxuICAgIHZhciBoYXNUb1N0cmluZ1RhZyA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLnRvU3RyaW5nVGFnO1xuICAgIHZhciB0eXBlID0gaGFzVG9TdHJpbmdUYWcgJiYgdmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXSB8fCB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lIHx8ICdPYmplY3QnO1xuICAgIHJldHVybiB0eXBlO1xuICB9XG59IC8vICRGbG93Rml4TWUgb25seSBjYWxsZWQgaW4gREVWLCBzbyB2b2lkIHJldHVybiBpcyBub3QgcG9zc2libGUuXG5cblxuZnVuY3Rpb24gd2lsbENvZXJjaW9uVGhyb3codmFsdWUpIHtcbiAge1xuICAgIHRyeSB7XG4gICAgICB0ZXN0U3RyaW5nQ29lcmNpb24odmFsdWUpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB0ZXN0U3RyaW5nQ29lcmNpb24odmFsdWUpIHtcbiAgLy8gSWYgeW91IGVuZGVkIHVwIGhlcmUgYnkgZm9sbG93aW5nIGFuIGV4Y2VwdGlvbiBjYWxsIHN0YWNrLCBoZXJlJ3Mgd2hhdCdzXG4gIC8vIGhhcHBlbmVkOiB5b3Ugc3VwcGxpZWQgYW4gb2JqZWN0IG9yIHN5bWJvbCB2YWx1ZSB0byBSZWFjdCAoYXMgYSBwcm9wLCBrZXksXG4gIC8vIERPTSBhdHRyaWJ1dGUsIENTUyBwcm9wZXJ0eSwgc3RyaW5nIHJlZiwgZXRjLikgYW5kIHdoZW4gUmVhY3QgdHJpZWQgdG9cbiAgLy8gY29lcmNlIGl0IHRvIGEgc3RyaW5nIHVzaW5nIGAnJyArIHZhbHVlYCwgYW4gZXhjZXB0aW9uIHdhcyB0aHJvd24uXG4gIC8vXG4gIC8vIFRoZSBtb3N0IGNvbW1vbiB0eXBlcyB0aGF0IHdpbGwgY2F1c2UgdGhpcyBleGNlcHRpb24gYXJlIGBTeW1ib2xgIGluc3RhbmNlc1xuICAvLyBhbmQgVGVtcG9yYWwgb2JqZWN0cyBsaWtlIGBUZW1wb3JhbC5JbnN0YW50YC4gQnV0IGFueSBvYmplY3QgdGhhdCBoYXMgYVxuICAvLyBgdmFsdWVPZmAgb3IgYFtTeW1ib2wudG9QcmltaXRpdmVdYCBtZXRob2QgdGhhdCB0aHJvd3Mgd2lsbCBhbHNvIGNhdXNlIHRoaXNcbiAgLy8gZXhjZXB0aW9uLiAoTGlicmFyeSBhdXRob3JzIGRvIHRoaXMgdG8gcHJldmVudCB1c2VycyBmcm9tIHVzaW5nIGJ1aWx0LWluXG4gIC8vIG51bWVyaWMgb3BlcmF0b3JzIGxpa2UgYCtgIG9yIGNvbXBhcmlzb24gb3BlcmF0b3JzIGxpa2UgYD49YCBiZWNhdXNlIGN1c3RvbVxuICAvLyBtZXRob2RzIGFyZSBuZWVkZWQgdG8gcGVyZm9ybSBhY2N1cmF0ZSBhcml0aG1ldGljIG9yIGNvbXBhcmlzb24uKVxuICAvL1xuICAvLyBUbyBmaXggdGhlIHByb2JsZW0sIGNvZXJjZSB0aGlzIG9iamVjdCBvciBzeW1ib2wgdmFsdWUgdG8gYSBzdHJpbmcgYmVmb3JlXG4gIC8vIHBhc3NpbmcgaXQgdG8gUmVhY3QuIFRoZSBtb3N0IHJlbGlhYmxlIHdheSBpcyB1c3VhbGx5IGBTdHJpbmcodmFsdWUpYC5cbiAgLy9cbiAgLy8gVG8gZmluZCB3aGljaCB2YWx1ZSBpcyB0aHJvd2luZywgY2hlY2sgdGhlIGJyb3dzZXIgb3IgZGVidWdnZXIgY29uc29sZS5cbiAgLy8gQmVmb3JlIHRoaXMgZXhjZXB0aW9uIHdhcyB0aHJvd24sIHRoZXJlIHNob3VsZCBiZSBgY29uc29sZS5lcnJvcmAgb3V0cHV0XG4gIC8vIHRoYXQgc2hvd3MgdGhlIHR5cGUgKFN5bWJvbCwgVGVtcG9yYWwuUGxhaW5EYXRlLCBldGMuKSB0aGF0IGNhdXNlZCB0aGVcbiAgLy8gcHJvYmxlbSBhbmQgaG93IHRoYXQgdHlwZSB3YXMgdXNlZDoga2V5LCBhdHJyaWJ1dGUsIGlucHV0IHZhbHVlIHByb3AsIGV0Yy5cbiAgLy8gSW4gbW9zdCBjYXNlcywgdGhpcyBjb25zb2xlIG91dHB1dCBhbHNvIHNob3dzIHRoZSBjb21wb25lbnQgYW5kIGl0c1xuICAvLyBhbmNlc3RvciBjb21wb25lbnRzIHdoZXJlIHRoZSBleGNlcHRpb24gaGFwcGVuZWQuXG4gIC8vXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1pbnRlcm5hbC9zYWZlLXN0cmluZy1jb2VyY2lvblxuICByZXR1cm4gJycgKyB2YWx1ZTtcbn1cbmZ1bmN0aW9uIGNoZWNrS2V5U3RyaW5nQ29lcmNpb24odmFsdWUpIHtcbiAge1xuICAgIGlmICh3aWxsQ29lcmNpb25UaHJvdyh2YWx1ZSkpIHtcbiAgICAgIGVycm9yKCdUaGUgcHJvdmlkZWQga2V5IGlzIGFuIHVuc3VwcG9ydGVkIHR5cGUgJXMuJyArICcgVGhpcyB2YWx1ZSBtdXN0IGJlIGNvZXJjZWQgdG8gYSBzdHJpbmcgYmVmb3JlIGJlZm9yZSB1c2luZyBpdCBoZXJlLicsIHR5cGVOYW1lKHZhbHVlKSk7XG5cbiAgICAgIHJldHVybiB0ZXN0U3RyaW5nQ29lcmNpb24odmFsdWUpOyAvLyB0aHJvdyAodG8gaGVscCBjYWxsZXJzIGZpbmQgdHJvdWJsZXNob290aW5nIGNvbW1lbnRzKVxuICAgIH1cbiAgfVxufVxuXG52YXIgUmVhY3RDdXJyZW50T3duZXIgPSBSZWFjdFNoYXJlZEludGVybmFscy5SZWFjdEN1cnJlbnRPd25lcjtcbnZhciBSRVNFUlZFRF9QUk9QUyA9IHtcbiAga2V5OiB0cnVlLFxuICByZWY6IHRydWUsXG4gIF9fc2VsZjogdHJ1ZSxcbiAgX19zb3VyY2U6IHRydWVcbn07XG52YXIgc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd247XG52YXIgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd247XG52YXIgZGlkV2FybkFib3V0U3RyaW5nUmVmcztcblxue1xuICBkaWRXYXJuQWJvdXRTdHJpbmdSZWZzID0ge307XG59XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkUmVmKGNvbmZpZykge1xuICB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCAncmVmJykpIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbmZpZywgJ3JlZicpLmdldDtcblxuICAgICAgaWYgKGdldHRlciAmJiBnZXR0ZXIuaXNSZWFjdFdhcm5pbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb25maWcucmVmICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkS2V5KGNvbmZpZykge1xuICB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCAna2V5JykpIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbmZpZywgJ2tleScpLmdldDtcblxuICAgICAgaWYgKGdldHRlciAmJiBnZXR0ZXIuaXNSZWFjdFdhcm5pbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb25maWcua2V5ICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIHdhcm5JZlN0cmluZ1JlZkNhbm5vdEJlQXV0b0NvbnZlcnRlZChjb25maWcsIHNlbGYpIHtcbiAge1xuICAgIGlmICh0eXBlb2YgY29uZmlnLnJlZiA9PT0gJ3N0cmluZycgJiYgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCAmJiBzZWxmICYmIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQuc3RhdGVOb2RlICE9PSBzZWxmKSB7XG4gICAgICB2YXIgY29tcG9uZW50TmFtZSA9IGdldENvbXBvbmVudE5hbWVGcm9tVHlwZShSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LnR5cGUpO1xuXG4gICAgICBpZiAoIWRpZFdhcm5BYm91dFN0cmluZ1JlZnNbY29tcG9uZW50TmFtZV0pIHtcbiAgICAgICAgZXJyb3IoJ0NvbXBvbmVudCBcIiVzXCIgY29udGFpbnMgdGhlIHN0cmluZyByZWYgXCIlc1wiLiAnICsgJ1N1cHBvcnQgZm9yIHN0cmluZyByZWZzIHdpbGwgYmUgcmVtb3ZlZCBpbiBhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiAnICsgJ1RoaXMgY2FzZSBjYW5ub3QgYmUgYXV0b21hdGljYWxseSBjb252ZXJ0ZWQgdG8gYW4gYXJyb3cgZnVuY3Rpb24uICcgKyAnV2UgYXNrIHlvdSB0byBtYW51YWxseSBmaXggdGhpcyBjYXNlIGJ5IHVzaW5nIHVzZVJlZigpIG9yIGNyZWF0ZVJlZigpIGluc3RlYWQuICcgKyAnTGVhcm4gbW9yZSBhYm91dCB1c2luZyByZWZzIHNhZmVseSBoZXJlOiAnICsgJ2h0dHBzOi8vcmVhY3Rqcy5vcmcvbGluay9zdHJpY3QtbW9kZS1zdHJpbmctcmVmJywgZ2V0Q29tcG9uZW50TmFtZUZyb21UeXBlKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQudHlwZSksIGNvbmZpZy5yZWYpO1xuXG4gICAgICAgIGRpZFdhcm5BYm91dFN0cmluZ1JlZnNbY29tcG9uZW50TmFtZV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpIHtcbiAge1xuICAgIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdLZXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duKSB7XG4gICAgICAgIHNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duID0gdHJ1ZTtcblxuICAgICAgICBlcnJvcignJXM6IGBrZXlgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL3JlYWN0anMub3JnL2xpbmsvc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHdhcm5BYm91dEFjY2Vzc2luZ0tleS5pc1JlYWN0V2FybmluZyA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAna2V5Jywge1xuICAgICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdLZXksXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkZWZpbmVSZWZQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpIHtcbiAge1xuICAgIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duKSB7XG4gICAgICAgIHNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duID0gdHJ1ZTtcblxuICAgICAgICBlcnJvcignJXM6IGByZWZgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL3JlYWN0anMub3JnL2xpbmsvc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHdhcm5BYm91dEFjY2Vzc2luZ1JlZi5pc1JlYWN0V2FybmluZyA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAncmVmJywge1xuICAgICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgfVxufVxuLyoqXG4gKiBGYWN0b3J5IG1ldGhvZCB0byBjcmVhdGUgYSBuZXcgUmVhY3QgZWxlbWVudC4gVGhpcyBubyBsb25nZXIgYWRoZXJlcyB0b1xuICogdGhlIGNsYXNzIHBhdHRlcm4sIHNvIGRvIG5vdCB1c2UgbmV3IHRvIGNhbGwgaXQuIEFsc28sIGluc3RhbmNlb2YgY2hlY2tcbiAqIHdpbGwgbm90IHdvcmsuIEluc3RlYWQgdGVzdCAkJHR5cGVvZiBmaWVsZCBhZ2FpbnN0IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSB0byBjaGVja1xuICogaWYgc29tZXRoaW5nIGlzIGEgUmVhY3QgRWxlbWVudC5cbiAqXG4gKiBAcGFyYW0geyp9IHR5cGVcbiAqIEBwYXJhbSB7Kn0gcHJvcHNcbiAqIEBwYXJhbSB7Kn0ga2V5XG4gKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IHJlZlxuICogQHBhcmFtIHsqfSBvd25lclxuICogQHBhcmFtIHsqfSBzZWxmIEEgKnRlbXBvcmFyeSogaGVscGVyIHRvIGRldGVjdCBwbGFjZXMgd2hlcmUgYHRoaXNgIGlzXG4gKiBkaWZmZXJlbnQgZnJvbSB0aGUgYG93bmVyYCB3aGVuIFJlYWN0LmNyZWF0ZUVsZW1lbnQgaXMgY2FsbGVkLCBzbyB0aGF0IHdlXG4gKiBjYW4gd2Fybi4gV2Ugd2FudCB0byBnZXQgcmlkIG9mIG93bmVyIGFuZCByZXBsYWNlIHN0cmluZyBgcmVmYHMgd2l0aCBhcnJvd1xuICogZnVuY3Rpb25zLCBhbmQgYXMgbG9uZyBhcyBgdGhpc2AgYW5kIG93bmVyIGFyZSB0aGUgc2FtZSwgdGhlcmUgd2lsbCBiZSBub1xuICogY2hhbmdlIGluIGJlaGF2aW9yLlxuICogQHBhcmFtIHsqfSBzb3VyY2UgQW4gYW5ub3RhdGlvbiBvYmplY3QgKGFkZGVkIGJ5IGEgdHJhbnNwaWxlciBvciBvdGhlcndpc2UpXG4gKiBpbmRpY2F0aW5nIGZpbGVuYW1lLCBsaW5lIG51bWJlciwgYW5kL29yIG90aGVyIGluZm9ybWF0aW9uLlxuICogQGludGVybmFsXG4gKi9cblxuXG52YXIgUmVhY3RFbGVtZW50ID0gZnVuY3Rpb24gKHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIG93bmVyLCBwcm9wcykge1xuICB2YXIgZWxlbWVudCA9IHtcbiAgICAvLyBUaGlzIHRhZyBhbGxvd3MgdXMgdG8gdW5pcXVlbHkgaWRlbnRpZnkgdGhpcyBhcyBhIFJlYWN0IEVsZW1lbnRcbiAgICAkJHR5cGVvZjogUkVBQ1RfRUxFTUVOVF9UWVBFLFxuICAgIC8vIEJ1aWx0LWluIHByb3BlcnRpZXMgdGhhdCBiZWxvbmcgb24gdGhlIGVsZW1lbnRcbiAgICB0eXBlOiB0eXBlLFxuICAgIGtleToga2V5LFxuICAgIHJlZjogcmVmLFxuICAgIHByb3BzOiBwcm9wcyxcbiAgICAvLyBSZWNvcmQgdGhlIGNvbXBvbmVudCByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhpcyBlbGVtZW50LlxuICAgIF9vd25lcjogb3duZXJcbiAgfTtcblxuICB7XG4gICAgLy8gVGhlIHZhbGlkYXRpb24gZmxhZyBpcyBjdXJyZW50bHkgbXV0YXRpdmUuIFdlIHB1dCBpdCBvblxuICAgIC8vIGFuIGV4dGVybmFsIGJhY2tpbmcgc3RvcmUgc28gdGhhdCB3ZSBjYW4gZnJlZXplIHRoZSB3aG9sZSBvYmplY3QuXG4gICAgLy8gVGhpcyBjYW4gYmUgcmVwbGFjZWQgd2l0aCBhIFdlYWtNYXAgb25jZSB0aGV5IGFyZSBpbXBsZW1lbnRlZCBpblxuICAgIC8vIGNvbW1vbmx5IHVzZWQgZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzLlxuICAgIGVsZW1lbnQuX3N0b3JlID0ge307IC8vIFRvIG1ha2UgY29tcGFyaW5nIFJlYWN0RWxlbWVudHMgZWFzaWVyIGZvciB0ZXN0aW5nIHB1cnBvc2VzLCB3ZSBtYWtlXG4gICAgLy8gdGhlIHZhbGlkYXRpb24gZmxhZyBub24tZW51bWVyYWJsZSAod2hlcmUgcG9zc2libGUsIHdoaWNoIHNob3VsZFxuICAgIC8vIGluY2x1ZGUgZXZlcnkgZW52aXJvbm1lbnQgd2UgcnVuIHRlc3RzIGluKSwgc28gdGhlIHRlc3QgZnJhbWV3b3JrXG4gICAgLy8gaWdub3JlcyBpdC5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50Ll9zdG9yZSwgJ3ZhbGlkYXRlZCcsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6IGZhbHNlXG4gICAgfSk7IC8vIHNlbGYgYW5kIHNvdXJjZSBhcmUgREVWIG9ubHkgcHJvcGVydGllcy5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCAnX3NlbGYnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogc2VsZlxuICAgIH0pOyAvLyBUd28gZWxlbWVudHMgY3JlYXRlZCBpbiB0d28gZGlmZmVyZW50IHBsYWNlcyBzaG91bGQgYmUgY29uc2lkZXJlZFxuICAgIC8vIGVxdWFsIGZvciB0ZXN0aW5nIHB1cnBvc2VzIGFuZCB0aGVyZWZvcmUgd2UgaGlkZSBpdCBmcm9tIGVudW1lcmF0aW9uLlxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc291cmNlJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHNvdXJjZVxuICAgIH0pO1xuXG4gICAgaWYgKE9iamVjdC5mcmVlemUpIHtcbiAgICAgIE9iamVjdC5mcmVlemUoZWxlbWVudC5wcm9wcyk7XG4gICAgICBPYmplY3QuZnJlZXplKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufTtcbi8qKlxuICogaHR0cHM6Ly9naXRodWIuY29tL3JlYWN0anMvcmZjcy9wdWxsLzEwN1xuICogQHBhcmFtIHsqfSB0eXBlXG4gKiBAcGFyYW0ge29iamVjdH0gcHJvcHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqL1xuXG5mdW5jdGlvbiBqc3hERVYodHlwZSwgY29uZmlnLCBtYXliZUtleSwgc291cmNlLCBzZWxmKSB7XG4gIHtcbiAgICB2YXIgcHJvcE5hbWU7IC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcblxuICAgIHZhciBwcm9wcyA9IHt9O1xuICAgIHZhciBrZXkgPSBudWxsO1xuICAgIHZhciByZWYgPSBudWxsOyAvLyBDdXJyZW50bHksIGtleSBjYW4gYmUgc3ByZWFkIGluIGFzIGEgcHJvcC4gVGhpcyBjYXVzZXMgYSBwb3RlbnRpYWxcbiAgICAvLyBpc3N1ZSBpZiBrZXkgaXMgYWxzbyBleHBsaWNpdGx5IGRlY2xhcmVkIChpZS4gPGRpdiB7Li4ucHJvcHN9IGtleT1cIkhpXCIgLz5cbiAgICAvLyBvciA8ZGl2IGtleT1cIkhpXCIgey4uLnByb3BzfSAvPiApLiBXZSB3YW50IHRvIGRlcHJlY2F0ZSBrZXkgc3ByZWFkLFxuICAgIC8vIGJ1dCBhcyBhbiBpbnRlcm1lZGlhcnkgc3RlcCwgd2Ugd2lsbCB1c2UganN4REVWIGZvciBldmVyeXRoaW5nIGV4Y2VwdFxuICAgIC8vIDxkaXYgey4uLnByb3BzfSBrZXk9XCJIaVwiIC8+LCBiZWNhdXNlIHdlIGFyZW4ndCBjdXJyZW50bHkgYWJsZSB0byB0ZWxsIGlmXG4gICAgLy8ga2V5IGlzIGV4cGxpY2l0bHkgZGVjbGFyZWQgdG8gYmUgdW5kZWZpbmVkIG9yIG5vdC5cblxuICAgIGlmIChtYXliZUtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB7XG4gICAgICAgIGNoZWNrS2V5U3RyaW5nQ29lcmNpb24obWF5YmVLZXkpO1xuICAgICAgfVxuXG4gICAgICBrZXkgPSAnJyArIG1heWJlS2V5O1xuICAgIH1cblxuICAgIGlmIChoYXNWYWxpZEtleShjb25maWcpKSB7XG4gICAgICB7XG4gICAgICAgIGNoZWNrS2V5U3RyaW5nQ29lcmNpb24oY29uZmlnLmtleSk7XG4gICAgICB9XG5cbiAgICAgIGtleSA9ICcnICsgY29uZmlnLmtleTtcbiAgICB9XG5cbiAgICBpZiAoaGFzVmFsaWRSZWYoY29uZmlnKSkge1xuICAgICAgcmVmID0gY29uZmlnLnJlZjtcbiAgICAgIHdhcm5JZlN0cmluZ1JlZkNhbm5vdEJlQXV0b0NvbnZlcnRlZChjb25maWcsIHNlbGYpO1xuICAgIH0gLy8gUmVtYWluaW5nIHByb3BlcnRpZXMgYXJlIGFkZGVkIHRvIGEgbmV3IHByb3BzIG9iamVjdFxuXG5cbiAgICBmb3IgKHByb3BOYW1lIGluIGNvbmZpZykge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCBwcm9wTmFtZSkgJiYgIVJFU0VSVkVEX1BST1BTLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBjb25maWdbcHJvcE5hbWVdO1xuICAgICAgfVxuICAgIH0gLy8gUmVzb2x2ZSBkZWZhdWx0IHByb3BzXG5cblxuICAgIGlmICh0eXBlICYmIHR5cGUuZGVmYXVsdFByb3BzKSB7XG4gICAgICB2YXIgZGVmYXVsdFByb3BzID0gdHlwZS5kZWZhdWx0UHJvcHM7XG5cbiAgICAgIGZvciAocHJvcE5hbWUgaW4gZGVmYXVsdFByb3BzKSB7XG4gICAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGRlZmF1bHRQcm9wc1twcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoa2V5IHx8IHJlZikge1xuICAgICAgdmFyIGRpc3BsYXlOYW1lID0gdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgPyB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSB8fCAnVW5rbm93bicgOiB0eXBlO1xuXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWYpIHtcbiAgICAgICAgZGVmaW5lUmVmUHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUmVhY3RFbGVtZW50KHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQsIHByb3BzKTtcbiAgfVxufVxuXG52YXIgUmVhY3RDdXJyZW50T3duZXIkMSA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlJlYWN0Q3VycmVudE93bmVyO1xudmFyIFJlYWN0RGVidWdDdXJyZW50RnJhbWUkMSA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlJlYWN0RGVidWdDdXJyZW50RnJhbWU7XG5cbmZ1bmN0aW9uIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50JDEoZWxlbWVudCkge1xuICB7XG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIHZhciBvd25lciA9IGVsZW1lbnQuX293bmVyO1xuICAgICAgdmFyIHN0YWNrID0gZGVzY3JpYmVVbmtub3duRWxlbWVudFR5cGVGcmFtZUluREVWKGVsZW1lbnQudHlwZSwgZWxlbWVudC5fc291cmNlLCBvd25lciA/IG93bmVyLnR5cGUgOiBudWxsKTtcbiAgICAgIFJlYWN0RGVidWdDdXJyZW50RnJhbWUkMS5zZXRFeHRyYVN0YWNrRnJhbWUoc3RhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBSZWFjdERlYnVnQ3VycmVudEZyYW1lJDEuc2V0RXh0cmFTdGFja0ZyYW1lKG51bGwpO1xuICAgIH1cbiAgfVxufVxuXG52YXIgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd247XG5cbntcbiAgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24gPSBmYWxzZTtcbn1cbi8qKlxuICogVmVyaWZpZXMgdGhlIG9iamVjdCBpcyBhIFJlYWN0RWxlbWVudC5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjaXN2YWxpZGVsZW1lbnRcbiAqIEBwYXJhbSB7P29iamVjdH0gb2JqZWN0XG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIGBvYmplY3RgIGlzIGEgUmVhY3RFbGVtZW50LlxuICogQGZpbmFsXG4gKi9cblxuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudChvYmplY3QpIHtcbiAge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QgIT09IG51bGwgJiYgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCkge1xuICB7XG4gICAgaWYgKFJlYWN0Q3VycmVudE93bmVyJDEuY3VycmVudCkge1xuICAgICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lRnJvbVR5cGUoUmVhY3RDdXJyZW50T3duZXIkMS5jdXJyZW50LnR5cGUpO1xuXG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICByZXR1cm4gJ1xcblxcbkNoZWNrIHRoZSByZW5kZXIgbWV0aG9kIG9mIGAnICsgbmFtZSArICdgLic7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtKHNvdXJjZSkge1xuICB7XG4gICAgaWYgKHNvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgZmlsZU5hbWUgPSBzb3VyY2UuZmlsZU5hbWUucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgICAgdmFyIGxpbmVOdW1iZXIgPSBzb3VyY2UubGluZU51bWJlcjtcbiAgICAgIHJldHVybiAnXFxuXFxuQ2hlY2sgeW91ciBjb2RlIGF0ICcgKyBmaWxlTmFtZSArICc6JyArIGxpbmVOdW1iZXIgKyAnLic7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG59XG4vKipcbiAqIFdhcm4gaWYgdGhlcmUncyBubyBrZXkgZXhwbGljaXRseSBzZXQgb24gZHluYW1pYyBhcnJheXMgb2YgY2hpbGRyZW4gb3JcbiAqIG9iamVjdCBrZXlzIGFyZSBub3QgdmFsaWQuIFRoaXMgYWxsb3dzIHVzIHRvIGtlZXAgdHJhY2sgb2YgY2hpbGRyZW4gYmV0d2VlblxuICogdXBkYXRlcy5cbiAqL1xuXG5cbnZhciBvd25lckhhc0tleVVzZVdhcm5pbmcgPSB7fTtcblxuZnVuY3Rpb24gZ2V0Q3VycmVudENvbXBvbmVudEVycm9ySW5mbyhwYXJlbnRUeXBlKSB7XG4gIHtcbiAgICB2YXIgaW5mbyA9IGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpO1xuXG4gICAgaWYgKCFpbmZvKSB7XG4gICAgICB2YXIgcGFyZW50TmFtZSA9IHR5cGVvZiBwYXJlbnRUeXBlID09PSAnc3RyaW5nJyA/IHBhcmVudFR5cGUgOiBwYXJlbnRUeXBlLmRpc3BsYXlOYW1lIHx8IHBhcmVudFR5cGUubmFtZTtcblxuICAgICAgaWYgKHBhcmVudE5hbWUpIHtcbiAgICAgICAgaW5mbyA9IFwiXFxuXFxuQ2hlY2sgdGhlIHRvcC1sZXZlbCByZW5kZXIgY2FsbCB1c2luZyA8XCIgKyBwYXJlbnROYW1lICsgXCI+LlwiO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpbmZvO1xuICB9XG59XG4vKipcbiAqIFdhcm4gaWYgdGhlIGVsZW1lbnQgZG9lc24ndCBoYXZlIGFuIGV4cGxpY2l0IGtleSBhc3NpZ25lZCB0byBpdC5cbiAqIFRoaXMgZWxlbWVudCBpcyBpbiBhbiBhcnJheS4gVGhlIGFycmF5IGNvdWxkIGdyb3cgYW5kIHNocmluayBvciBiZVxuICogcmVvcmRlcmVkLiBBbGwgY2hpbGRyZW4gdGhhdCBoYXZlbid0IGFscmVhZHkgYmVlbiB2YWxpZGF0ZWQgYXJlIHJlcXVpcmVkIHRvXG4gKiBoYXZlIGEgXCJrZXlcIiBwcm9wZXJ0eSBhc3NpZ25lZCB0byBpdC4gRXJyb3Igc3RhdHVzZXMgYXJlIGNhY2hlZCBzbyBhIHdhcm5pbmdcbiAqIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB0aGF0IHJlcXVpcmVzIGEga2V5LlxuICogQHBhcmFtIHsqfSBwYXJlbnRUeXBlIGVsZW1lbnQncyBwYXJlbnQncyB0eXBlLlxuICovXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVFeHBsaWNpdEtleShlbGVtZW50LCBwYXJlbnRUeXBlKSB7XG4gIHtcbiAgICBpZiAoIWVsZW1lbnQuX3N0b3JlIHx8IGVsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZCB8fCBlbGVtZW50LmtleSAhPSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZWxlbWVudC5fc3RvcmUudmFsaWRhdGVkID0gdHJ1ZTtcbiAgICB2YXIgY3VycmVudENvbXBvbmVudEVycm9ySW5mbyA9IGdldEN1cnJlbnRDb21wb25lbnRFcnJvckluZm8ocGFyZW50VHlwZSk7XG5cbiAgICBpZiAob3duZXJIYXNLZXlVc2VXYXJuaW5nW2N1cnJlbnRDb21wb25lbnRFcnJvckluZm9dKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb3duZXJIYXNLZXlVc2VXYXJuaW5nW2N1cnJlbnRDb21wb25lbnRFcnJvckluZm9dID0gdHJ1ZTsgLy8gVXN1YWxseSB0aGUgY3VycmVudCBvd25lciBpcyB0aGUgb2ZmZW5kZXIsIGJ1dCBpZiBpdCBhY2NlcHRzIGNoaWxkcmVuIGFzIGFcbiAgICAvLyBwcm9wZXJ0eSwgaXQgbWF5IGJlIHRoZSBjcmVhdG9yIG9mIHRoZSBjaGlsZCB0aGF0J3MgcmVzcG9uc2libGUgZm9yXG4gICAgLy8gYXNzaWduaW5nIGl0IGEga2V5LlxuXG4gICAgdmFyIGNoaWxkT3duZXIgPSAnJztcblxuICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuX293bmVyICYmIGVsZW1lbnQuX293bmVyICE9PSBSZWFjdEN1cnJlbnRPd25lciQxLmN1cnJlbnQpIHtcbiAgICAgIC8vIEdpdmUgdGhlIGNvbXBvbmVudCB0aGF0IG9yaWdpbmFsbHkgY3JlYXRlZCB0aGlzIGNoaWxkLlxuICAgICAgY2hpbGRPd25lciA9IFwiIEl0IHdhcyBwYXNzZWQgYSBjaGlsZCBmcm9tIFwiICsgZ2V0Q29tcG9uZW50TmFtZUZyb21UeXBlKGVsZW1lbnQuX293bmVyLnR5cGUpICsgXCIuXCI7XG4gICAgfVxuXG4gICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQkMShlbGVtZW50KTtcblxuICAgIGVycm9yKCdFYWNoIGNoaWxkIGluIGEgbGlzdCBzaG91bGQgaGF2ZSBhIHVuaXF1ZSBcImtleVwiIHByb3AuJyArICclcyVzIFNlZSBodHRwczovL3JlYWN0anMub3JnL2xpbmsvd2FybmluZy1rZXlzIGZvciBtb3JlIGluZm9ybWF0aW9uLicsIGN1cnJlbnRDb21wb25lbnRFcnJvckluZm8sIGNoaWxkT3duZXIpO1xuXG4gICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQkMShudWxsKTtcbiAgfVxufVxuLyoqXG4gKiBFbnN1cmUgdGhhdCBldmVyeSBlbGVtZW50IGVpdGhlciBpcyBwYXNzZWQgaW4gYSBzdGF0aWMgbG9jYXRpb24sIGluIGFuXG4gKiBhcnJheSB3aXRoIGFuIGV4cGxpY2l0IGtleXMgcHJvcGVydHkgZGVmaW5lZCwgb3IgaW4gYW4gb2JqZWN0IGxpdGVyYWxcbiAqIHdpdGggdmFsaWQga2V5IHByb3BlcnR5LlxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtSZWFjdE5vZGV9IG5vZGUgU3RhdGljYWxseSBwYXNzZWQgY2hpbGQgb2YgYW55IHR5cGUuXG4gKiBAcGFyYW0geyp9IHBhcmVudFR5cGUgbm9kZSdzIHBhcmVudCdzIHR5cGUuXG4gKi9cblxuXG5mdW5jdGlvbiB2YWxpZGF0ZUNoaWxkS2V5cyhub2RlLCBwYXJlbnRUeXBlKSB7XG4gIHtcbiAgICBpZiAodHlwZW9mIG5vZGUgIT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzQXJyYXkobm9kZSkpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hpbGQgPSBub2RlW2ldO1xuXG4gICAgICAgIGlmIChpc1ZhbGlkRWxlbWVudChjaGlsZCkpIHtcbiAgICAgICAgICB2YWxpZGF0ZUV4cGxpY2l0S2V5KGNoaWxkLCBwYXJlbnRUeXBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNWYWxpZEVsZW1lbnQobm9kZSkpIHtcbiAgICAgIC8vIFRoaXMgZWxlbWVudCB3YXMgcGFzc2VkIGluIGEgdmFsaWQgbG9jYXRpb24uXG4gICAgICBpZiAobm9kZS5fc3RvcmUpIHtcbiAgICAgICAgbm9kZS5fc3RvcmUudmFsaWRhdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGUpIHtcbiAgICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihub2RlKTtcblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIEVudHJ5IGl0ZXJhdG9ycyB1c2VkIHRvIHByb3ZpZGUgaW1wbGljaXQga2V5cyxcbiAgICAgICAgLy8gYnV0IG5vdyB3ZSBwcmludCBhIHNlcGFyYXRlIHdhcm5pbmcgZm9yIHRoZW0gbGF0ZXIuXG4gICAgICAgIGlmIChpdGVyYXRvckZuICE9PSBub2RlLmVudHJpZXMpIHtcbiAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwobm9kZSk7XG4gICAgICAgICAgdmFyIHN0ZXA7XG5cbiAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICBpZiAoaXNWYWxpZEVsZW1lbnQoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgdmFsaWRhdGVFeHBsaWNpdEtleShzdGVwLnZhbHVlLCBwYXJlbnRUeXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbi8qKlxuICogR2l2ZW4gYW4gZWxlbWVudCwgdmFsaWRhdGUgdGhhdCBpdHMgcHJvcHMgZm9sbG93IHRoZSBwcm9wVHlwZXMgZGVmaW5pdGlvbixcbiAqIHByb3ZpZGVkIGJ5IHRoZSB0eXBlLlxuICpcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBlbGVtZW50XG4gKi9cblxuXG5mdW5jdGlvbiB2YWxpZGF0ZVByb3BUeXBlcyhlbGVtZW50KSB7XG4gIHtcbiAgICB2YXIgdHlwZSA9IGVsZW1lbnQudHlwZTtcblxuICAgIGlmICh0eXBlID09PSBudWxsIHx8IHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcHJvcFR5cGVzO1xuXG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBwcm9wVHlwZXMgPSB0eXBlLnByb3BUeXBlcztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSB8fCAvLyBOb3RlOiBNZW1vIG9ubHkgY2hlY2tzIG91dGVyIHByb3BzIGhlcmUuXG4gICAgLy8gSW5uZXIgcHJvcHMgYXJlIGNoZWNrZWQgaW4gdGhlIHJlY29uY2lsZXIuXG4gICAgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFKSkge1xuICAgICAgcHJvcFR5cGVzID0gdHlwZS5wcm9wVHlwZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocHJvcFR5cGVzKSB7XG4gICAgICAvLyBJbnRlbnRpb25hbGx5IGluc2lkZSB0byBhdm9pZCB0cmlnZ2VyaW5nIGxhenkgaW5pdGlhbGl6ZXJzOlxuICAgICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lRnJvbVR5cGUodHlwZSk7XG4gICAgICBjaGVja1Byb3BUeXBlcyhwcm9wVHlwZXMsIGVsZW1lbnQucHJvcHMsICdwcm9wJywgbmFtZSwgZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlLlByb3BUeXBlcyAhPT0gdW5kZWZpbmVkICYmICFwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93bikge1xuICAgICAgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24gPSB0cnVlOyAvLyBJbnRlbnRpb25hbGx5IGluc2lkZSB0byBhdm9pZCB0cmlnZ2VyaW5nIGxhenkgaW5pdGlhbGl6ZXJzOlxuXG4gICAgICB2YXIgX25hbWUgPSBnZXRDb21wb25lbnROYW1lRnJvbVR5cGUodHlwZSk7XG5cbiAgICAgIGVycm9yKCdDb21wb25lbnQgJXMgZGVjbGFyZWQgYFByb3BUeXBlc2AgaW5zdGVhZCBvZiBgcHJvcFR5cGVzYC4gRGlkIHlvdSBtaXNzcGVsbCB0aGUgcHJvcGVydHkgYXNzaWdubWVudD8nLCBfbmFtZSB8fCAnVW5rbm93bicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdHlwZS5nZXREZWZhdWx0UHJvcHMgPT09ICdmdW5jdGlvbicgJiYgIXR5cGUuZ2V0RGVmYXVsdFByb3BzLmlzUmVhY3RDbGFzc0FwcHJvdmVkKSB7XG4gICAgICBlcnJvcignZ2V0RGVmYXVsdFByb3BzIGlzIG9ubHkgdXNlZCBvbiBjbGFzc2ljIFJlYWN0LmNyZWF0ZUNsYXNzICcgKyAnZGVmaW5pdGlvbnMuIFVzZSBhIHN0YXRpYyBwcm9wZXJ0eSBuYW1lZCBgZGVmYXVsdFByb3BzYCBpbnN0ZWFkLicpO1xuICAgIH1cbiAgfVxufVxuLyoqXG4gKiBHaXZlbiBhIGZyYWdtZW50LCB2YWxpZGF0ZSB0aGF0IGl0IGNhbiBvbmx5IGJlIHByb3ZpZGVkIHdpdGggZnJhZ21lbnQgcHJvcHNcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBmcmFnbWVudFxuICovXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVGcmFnbWVudFByb3BzKGZyYWdtZW50KSB7XG4gIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGZyYWdtZW50LnByb3BzKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG5cbiAgICAgIGlmIChrZXkgIT09ICdjaGlsZHJlbicgJiYga2V5ICE9PSAna2V5Jykge1xuICAgICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCQxKGZyYWdtZW50KTtcblxuICAgICAgICBlcnJvcignSW52YWxpZCBwcm9wIGAlc2Agc3VwcGxpZWQgdG8gYFJlYWN0LkZyYWdtZW50YC4gJyArICdSZWFjdC5GcmFnbWVudCBjYW4gb25seSBoYXZlIGBrZXlgIGFuZCBgY2hpbGRyZW5gIHByb3BzLicsIGtleSk7XG5cbiAgICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQkMShudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZyYWdtZW50LnJlZiAhPT0gbnVsbCkge1xuICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQkMShmcmFnbWVudCk7XG5cbiAgICAgIGVycm9yKCdJbnZhbGlkIGF0dHJpYnV0ZSBgcmVmYCBzdXBwbGllZCB0byBgUmVhY3QuRnJhZ21lbnRgLicpO1xuXG4gICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCQxKG51bGwpO1xuICAgIH1cbiAgfVxufVxuXG52YXIgZGlkV2FybkFib3V0S2V5U3ByZWFkID0ge307XG5mdW5jdGlvbiBqc3hXaXRoVmFsaWRhdGlvbih0eXBlLCBwcm9wcywga2V5LCBpc1N0YXRpY0NoaWxkcmVuLCBzb3VyY2UsIHNlbGYpIHtcbiAge1xuICAgIHZhciB2YWxpZFR5cGUgPSBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSk7IC8vIFdlIHdhcm4gaW4gdGhpcyBjYXNlIGJ1dCBkb24ndCB0aHJvdy4gV2UgZXhwZWN0IHRoZSBlbGVtZW50IGNyZWF0aW9uIHRvXG4gICAgLy8gc3VjY2VlZCBhbmQgdGhlcmUgd2lsbCBsaWtlbHkgYmUgZXJyb3JzIGluIHJlbmRlci5cblxuICAgIGlmICghdmFsaWRUeXBlKSB7XG4gICAgICB2YXIgaW5mbyA9ICcnO1xuXG4gICAgICBpZiAodHlwZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiB0eXBlICE9PSBudWxsICYmIE9iamVjdC5rZXlzKHR5cGUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpbmZvICs9ICcgWW91IGxpa2VseSBmb3Jnb3QgdG8gZXhwb3J0IHlvdXIgY29tcG9uZW50IGZyb20gdGhlIGZpbGUgJyArIFwiaXQncyBkZWZpbmVkIGluLCBvciB5b3UgbWlnaHQgaGF2ZSBtaXhlZCB1cCBkZWZhdWx0IGFuZCBuYW1lZCBpbXBvcnRzLlwiO1xuICAgICAgfVxuXG4gICAgICB2YXIgc291cmNlSW5mbyA9IGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtKHNvdXJjZSk7XG5cbiAgICAgIGlmIChzb3VyY2VJbmZvKSB7XG4gICAgICAgIGluZm8gKz0gc291cmNlSW5mbztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZm8gKz0gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciB0eXBlU3RyaW5nO1xuXG4gICAgICBpZiAodHlwZSA9PT0gbnVsbCkge1xuICAgICAgICB0eXBlU3RyaW5nID0gJ251bGwnO1xuICAgICAgfSBlbHNlIGlmIChpc0FycmF5KHR5cGUpKSB7XG4gICAgICAgIHR5cGVTdHJpbmcgPSAnYXJyYXknO1xuICAgICAgfSBlbHNlIGlmICh0eXBlICE9PSB1bmRlZmluZWQgJiYgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFKSB7XG4gICAgICAgIHR5cGVTdHJpbmcgPSBcIjxcIiArIChnZXRDb21wb25lbnROYW1lRnJvbVR5cGUodHlwZS50eXBlKSB8fCAnVW5rbm93bicpICsgXCIgLz5cIjtcbiAgICAgICAgaW5mbyA9ICcgRGlkIHlvdSBhY2NpZGVudGFsbHkgZXhwb3J0IGEgSlNYIGxpdGVyYWwgaW5zdGVhZCBvZiBhIGNvbXBvbmVudD8nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHlwZVN0cmluZyA9IHR5cGVvZiB0eXBlO1xuICAgICAgfVxuXG4gICAgICBlcnJvcignUmVhY3QuanN4OiB0eXBlIGlzIGludmFsaWQgLS0gZXhwZWN0ZWQgYSBzdHJpbmcgKGZvciAnICsgJ2J1aWx0LWluIGNvbXBvbmVudHMpIG9yIGEgY2xhc3MvZnVuY3Rpb24gKGZvciBjb21wb3NpdGUgJyArICdjb21wb25lbnRzKSBidXQgZ290OiAlcy4lcycsIHR5cGVTdHJpbmcsIGluZm8pO1xuICAgIH1cblxuICAgIHZhciBlbGVtZW50ID0ganN4REVWKHR5cGUsIHByb3BzLCBrZXksIHNvdXJjZSwgc2VsZik7IC8vIFRoZSByZXN1bHQgY2FuIGJlIG51bGxpc2ggaWYgYSBtb2NrIG9yIGEgY3VzdG9tIGZ1bmN0aW9uIGlzIHVzZWQuXG4gICAgLy8gVE9ETzogRHJvcCB0aGlzIHdoZW4gdGhlc2UgYXJlIG5vIGxvbmdlciBhbGxvd2VkIGFzIHRoZSB0eXBlIGFyZ3VtZW50LlxuXG4gICAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfSAvLyBTa2lwIGtleSB3YXJuaW5nIGlmIHRoZSB0eXBlIGlzbid0IHZhbGlkIHNpbmNlIG91ciBrZXkgdmFsaWRhdGlvbiBsb2dpY1xuICAgIC8vIGRvZXNuJ3QgZXhwZWN0IGEgbm9uLXN0cmluZy9mdW5jdGlvbiB0eXBlIGFuZCBjYW4gdGhyb3cgY29uZnVzaW5nIGVycm9ycy5cbiAgICAvLyBXZSBkb24ndCB3YW50IGV4Y2VwdGlvbiBiZWhhdmlvciB0byBkaWZmZXIgYmV0d2VlbiBkZXYgYW5kIHByb2QuXG4gICAgLy8gKFJlbmRlcmluZyB3aWxsIHRocm93IHdpdGggYSBoZWxwZnVsIG1lc3NhZ2UgYW5kIGFzIHNvb24gYXMgdGhlIHR5cGUgaXNcbiAgICAvLyBmaXhlZCwgdGhlIGtleSB3YXJuaW5ncyB3aWxsIGFwcGVhci4pXG5cblxuICAgIGlmICh2YWxpZFR5cGUpIHtcbiAgICAgIHZhciBjaGlsZHJlbiA9IHByb3BzLmNoaWxkcmVuO1xuXG4gICAgICBpZiAoY2hpbGRyZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoaXNTdGF0aWNDaGlsZHJlbikge1xuICAgICAgICAgIGlmIChpc0FycmF5KGNoaWxkcmVuKSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICB2YWxpZGF0ZUNoaWxkS2V5cyhjaGlsZHJlbltpXSwgdHlwZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChPYmplY3QuZnJlZXplKSB7XG4gICAgICAgICAgICAgIE9iamVjdC5mcmVlemUoY2hpbGRyZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvcignUmVhY3QuanN4OiBTdGF0aWMgY2hpbGRyZW4gc2hvdWxkIGFsd2F5cyBiZSBhbiBhcnJheS4gJyArICdZb3UgYXJlIGxpa2VseSBleHBsaWNpdGx5IGNhbGxpbmcgUmVhY3QuanN4cyBvciBSZWFjdC5qc3hERVYuICcgKyAnVXNlIHRoZSBCYWJlbCB0cmFuc2Zvcm0gaW5zdGVhZC4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsaWRhdGVDaGlsZEtleXMoY2hpbGRyZW4sIHR5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwocHJvcHMsICdrZXknKSkge1xuICAgICAgICB2YXIgY29tcG9uZW50TmFtZSA9IGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0eXBlKTtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wcykuZmlsdGVyKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgcmV0dXJuIGsgIT09ICdrZXknO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGJlZm9yZUV4YW1wbGUgPSBrZXlzLmxlbmd0aCA+IDAgPyAne2tleTogc29tZUtleSwgJyArIGtleXMuam9pbignOiAuLi4sICcpICsgJzogLi4ufScgOiAne2tleTogc29tZUtleX0nO1xuXG4gICAgICAgIGlmICghZGlkV2FybkFib3V0S2V5U3ByZWFkW2NvbXBvbmVudE5hbWUgKyBiZWZvcmVFeGFtcGxlXSkge1xuICAgICAgICAgIHZhciBhZnRlckV4YW1wbGUgPSBrZXlzLmxlbmd0aCA+IDAgPyAneycgKyBrZXlzLmpvaW4oJzogLi4uLCAnKSArICc6IC4uLn0nIDogJ3t9JztcblxuICAgICAgICAgIGVycm9yKCdBIHByb3BzIG9iamVjdCBjb250YWluaW5nIGEgXCJrZXlcIiBwcm9wIGlzIGJlaW5nIHNwcmVhZCBpbnRvIEpTWDpcXG4nICsgJyAgbGV0IHByb3BzID0gJXM7XFxuJyArICcgIDwlcyB7Li4ucHJvcHN9IC8+XFxuJyArICdSZWFjdCBrZXlzIG11c3QgYmUgcGFzc2VkIGRpcmVjdGx5IHRvIEpTWCB3aXRob3V0IHVzaW5nIHNwcmVhZDpcXG4nICsgJyAgbGV0IHByb3BzID0gJXM7XFxuJyArICcgIDwlcyBrZXk9e3NvbWVLZXl9IHsuLi5wcm9wc30gLz4nLCBiZWZvcmVFeGFtcGxlLCBjb21wb25lbnROYW1lLCBhZnRlckV4YW1wbGUsIGNvbXBvbmVudE5hbWUpO1xuXG4gICAgICAgICAgZGlkV2FybkFib3V0S2V5U3ByZWFkW2NvbXBvbmVudE5hbWUgKyBiZWZvcmVFeGFtcGxlXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSkge1xuICAgICAgdmFsaWRhdGVGcmFnbWVudFByb3BzKGVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWxpZGF0ZVByb3BUeXBlcyhlbGVtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxufSAvLyBUaGVzZSB0d28gZnVuY3Rpb25zIGV4aXN0IHRvIHN0aWxsIGdldCBjaGlsZCB3YXJuaW5ncyBpbiBkZXZcbi8vIGV2ZW4gd2l0aCB0aGUgcHJvZCB0cmFuc2Zvcm0uIFRoaXMgbWVhbnMgdGhhdCBqc3hERVYgaXMgcHVyZWx5XG4vLyBvcHQtaW4gYmVoYXZpb3IgZm9yIGJldHRlciBtZXNzYWdlcyBidXQgdGhhdCB3ZSB3b24ndCBzdG9wXG4vLyBnaXZpbmcgeW91IHdhcm5pbmdzIGlmIHlvdSB1c2UgcHJvZHVjdGlvbiBhcGlzLlxuXG5mdW5jdGlvbiBqc3hXaXRoVmFsaWRhdGlvblN0YXRpYyh0eXBlLCBwcm9wcywga2V5KSB7XG4gIHtcbiAgICByZXR1cm4ganN4V2l0aFZhbGlkYXRpb24odHlwZSwgcHJvcHMsIGtleSwgdHJ1ZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIGpzeFdpdGhWYWxpZGF0aW9uRHluYW1pYyh0eXBlLCBwcm9wcywga2V5KSB7XG4gIHtcbiAgICByZXR1cm4ganN4V2l0aFZhbGlkYXRpb24odHlwZSwgcHJvcHMsIGtleSwgZmFsc2UpO1xuICB9XG59XG5cbnZhciBqc3ggPSAganN4V2l0aFZhbGlkYXRpb25EeW5hbWljIDsgLy8gd2UgbWF5IHdhbnQgdG8gc3BlY2lhbCBjYXNlIGpzeHMgaW50ZXJuYWxseSB0byB0YWtlIGFkdmFudGFnZSBvZiBzdGF0aWMgY2hpbGRyZW4uXG4vLyBmb3Igbm93IHdlIGNhbiBzaGlwIGlkZW50aWNhbCBwcm9kIGZ1bmN0aW9uc1xuXG52YXIganN4cyA9ICBqc3hXaXRoVmFsaWRhdGlvblN0YXRpYyA7XG5cbmV4cG9ydHMuRnJhZ21lbnQgPSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xuZXhwb3J0cy5qc3ggPSBqc3g7XG5leHBvcnRzLmpzeHMgPSBqc3hzO1xuICB9KSgpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWpzeC1ydW50aW1lLnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWpzeC1ydW50aW1lLmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCJpbXBvcnQgeyBqc3ggYXMgX2pzeCB9IGZyb20gXCJyZWFjdC9qc3gtcnVudGltZVwiO1xuaW1wb3J0IHsgY3JlYXRlUmVtb3RlUmVhY3RDb21wb25lbnQgfSBmcm9tICdAcmVtb3RlLXVpL3JlYWN0JztcbmV4cG9ydCBjb25zdCBjcmVhdGVSZW1vdGVDb21wb25lbnRSZWdpc3RyeSA9ICgpID0+IHtcbiAgICBjb25zdCBjb21wb25lbnRNZXRhZGF0YUxvb2t1cCA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBjb21wb25lbnROYW1lQnlDb21wb25lbnRNYXAgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgcmVnaXN0ZXJDb21wb25lbnQgPSAoY29tcG9uZW50LCBjb21wb25lbnROYW1lLCBmcmFnbWVudFByb3BzKSA9PiB7XG4gICAgICAgIGNvbXBvbmVudE5hbWVCeUNvbXBvbmVudE1hcC5zZXQoY29tcG9uZW50LCBjb21wb25lbnROYW1lKTtcbiAgICAgICAgY29tcG9uZW50TWV0YWRhdGFMb29rdXAuc2V0KGNvbXBvbmVudE5hbWUsIHtcbiAgICAgICAgICAgIGZyYWdtZW50UHJvcHNTZXQ6IG5ldyBTZXQoZnJhZ21lbnRQcm9wcyksXG4gICAgICAgICAgICBmcmFnbWVudFByb3BzQXJyYXk6IGZyYWdtZW50UHJvcHMsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH07XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0Q29tcG9uZW50TmFtZTogKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudE5hbWVCeUNvbXBvbmVudE1hcC5nZXQoY29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudE5hbWU7XG4gICAgICAgIH0sXG4gICAgICAgIGlzQWxsb3dlZENvbXBvbmVudE5hbWU6IChjb21wb25lbnROYW1lKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50TWV0YWRhdGFMb29rdXAuaGFzKGNvbXBvbmVudE5hbWUpO1xuICAgICAgICB9LFxuICAgICAgICBpc0NvbXBvbmVudEZyYWdtZW50UHJvcDogKGNvbXBvbmVudE5hbWUsIHByb3BOYW1lKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnRNZXRhZGF0YSA9IGNvbXBvbmVudE1ldGFkYXRhTG9va3VwLmdldChjb21wb25lbnROYW1lKTtcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50TWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50TWV0YWRhdGEuZnJhZ21lbnRQcm9wc1NldC5oYXMocHJvcE5hbWUpO1xuICAgICAgICB9LFxuICAgICAgICBnZXRDb21wb25lbnRGcmFnbWVudFByb3BOYW1lczogKGNvbXBvbmVudE5hbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudE1ldGFkYXRhID0gY29tcG9uZW50TWV0YWRhdGFMb29rdXAuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICAgICAgaWYgKCFjb21wb25lbnRNZXRhZGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHsgZnJhZ21lbnRQcm9wc0FycmF5IH0gPSBjb21wb25lbnRNZXRhZGF0YTtcbiAgICAgICAgICAgIHJldHVybiBmcmFnbWVudFByb3BzQXJyYXk7XG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQ6IChjb21wb25lbnROYW1lLCBvcHRpb25zID0ge30pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgZnJhZ21lbnRQcm9wcyA9IFtdIH0gPSBvcHRpb25zO1xuICAgICAgICAgICAgY29uc3QgcmVtb3RlUmVhY3RDb21wb25lbnQgPSBjcmVhdGVSZW1vdGVSZWFjdENvbXBvbmVudChjb21wb25lbnROYW1lLCB7XG4gICAgICAgICAgICAgICAgZnJhZ21lbnRQcm9wczogZnJhZ21lbnRQcm9wcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlZ2lzdGVyQ29tcG9uZW50KHJlbW90ZVJlYWN0Q29tcG9uZW50LCBjb21wb25lbnROYW1lLCBmcmFnbWVudFByb3BzKTtcbiAgICAgICAgfSxcbiAgICAgICAgY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVDb21wb3VuZFJlYWN0Q29tcG9uZW50OiAoY29tcG9uZW50TmFtZSwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBmcmFnbWVudFByb3BzID0gW10gfSA9IG9wdGlvbnM7XG4gICAgICAgICAgICBjb25zdCBSZW1vdGVDb21wb25lbnRUeXBlID0gY3JlYXRlUmVtb3RlUmVhY3RDb21wb25lbnQoY29tcG9uZW50TmFtZSwge1xuICAgICAgICAgICAgICAgIGZyYWdtZW50UHJvcHMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIFdlIGNhbiBvbmx5IGF0dGFjaCBwcm9wZXJ0aWVzIHRvIGEgZnVuY3Rpb24gY29tcG9uZW50IHR5cGUsIHNvIHdlIG5lZWQgdG8gY2hlY2sgaWYgdGhlIHJlbW90ZSBjb21wb25lbnQgdHlwZSBpcyBhIGZ1bmN0aW9uLlxuICAgICAgICAgICAgLy8gSWYgdGhlIHJlbW90ZSBjb21wb25lbnQgdHlwZSBpcyBub3QgYSBmdW5jdGlvbiwgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgZnVuY3Rpb24gY29tcG9uZW50LlxuICAgICAgICAgICAgY29uc3QgQ29tcG91bmRGdW5jdGlvbkNvbXBvbmVudFR5cGUgPSB0eXBlb2YgUmVtb3RlQ29tcG9uZW50VHlwZSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICAgID8gUmVtb3RlQ29tcG9uZW50VHlwZVxuICAgICAgICAgICAgICAgIDogKHByb3BzKSA9PiAoX2pzeChSZW1vdGVDb21wb25lbnRUeXBlLCB7IC4uLnByb3BzIH0pKTtcbiAgICAgICAgICAgIC8vIEF0dGFjaCB0aGUgY29tcG91bmQgY29tcG9uZW50IHByb3BlcnRpZXMgdG8gdGhlIGZ1bmN0aW9uIGNvbXBvbmVudCB0aGF0IHdlIHdpbGwgYmUgcmV0dXJuaW5nLlxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihDb21wb3VuZEZ1bmN0aW9uQ29tcG9uZW50VHlwZSwgb3B0aW9ucy5jb21wb3VuZENvbXBvbmVudFByb3BlcnRpZXMpO1xuICAgICAgICAgICAgLy8gUmVnaXN0ZXIgdGhlIGNvbXBvdW5kIGZ1bmN0aW9uIGNvbXBvbmVudCB3aXRoIHRoZSByZWdpc3RyeSBhbmQgcmV0dXJuIGl0LlxuICAgICAgICAgICAgcmV0dXJuIHJlZ2lzdGVyQ29tcG9uZW50KENvbXBvdW5kRnVuY3Rpb25Db21wb25lbnRUeXBlLCBjb21wb25lbnROYW1lLCBmcmFnbWVudFByb3BzKTtcbiAgICAgICAgfSxcbiAgICB9O1xufTtcbiIsImltcG9ydCB7IGNyZWF0ZVJlbW90ZUNvbXBvbmVudFJlZ2lzdHJ5IH0gZnJvbSBcIi4vdXRpbHMvcmVtb3RlLWNvbXBvbmVudC1yZWdpc3RyeS5qc1wiO1xuLyoqXG4gKiBSZXByZXNlbnRzIGEgcmVnaXN0cnkgb2YgSHViU3BvdC1wcm92aWRlZCBSZWFjdCBjb21wb25lbnRzIHRoYXQgc2hvdWxkIG9ubHkgYmUgdXNlZCAqKmludGVybmFsbHkqKiBieSB0aGUgVUkgZXh0ZW5zaW9uIFNESy5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGNvbnN0IF9faHViU3BvdENvbXBvbmVudFJlZ2lzdHJ5ID0gY3JlYXRlUmVtb3RlQ29tcG9uZW50UmVnaXN0cnkoKTtcbmNvbnN0IHsgY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCwgY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVDb21wb3VuZFJlYWN0Q29tcG9uZW50LCB9ID0gX19odWJTcG90Q29tcG9uZW50UmVnaXN0cnk7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFNUQU5EQVJEIENPTVBPTkVOVFNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLyoqXG4gKiBUaGUgYEFsZXJ0YCBjb21wb25lbnQgcmVuZGVycyBhbiBhbGVydCB3aXRoaW4gYSBjYXJkLiBVc2UgdGhpcyBjb21wb25lbnQgdG8gZ2l2ZSB1c2FnZSBndWlkYW5jZSwgbm90aWZ5IHVzZXJzIG9mIGFjdGlvbiByZXN1bHRzLCBvciB3YXJuIHRoZW0gYWJvdXQgcG90ZW50aWFsIGlzc3VlcyBvciBmYWlsdXJlcy5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9hbGVydCBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9hcHAuaHVic3BvdC5jb20vZG9jcy80ODAwODkxNi9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2FsZXJ0I3ZhcmlhbnRzIFZhcmlhbnRzfVxuICovXG5leHBvcnQgY29uc3QgQWxlcnQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdBbGVydCcpO1xuLyoqXG4gKiBUaGUgYEJ1dHRvbmAgY29tcG9uZW50IHJlbmRlcnMgYSBzaW5nbGUgYnV0dG9uLiBVc2UgdGhpcyBjb21wb25lbnQgdG8gZW5hYmxlIHVzZXJzIHRvIHBlcmZvcm0gYWN0aW9ucywgc3VjaCBhcyBzdWJtaXR0aW5nIGEgZm9ybSwgc2VuZGluZyBkYXRhIHRvIGFuIGV4dGVybmFsIHN5c3RlbSwgb3IgZGVsZXRpbmcgZGF0YS5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9idXR0b24gRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvYnV0dG9uI3VzYWdlLWV4YW1wbGVzIEV4YW1wbGVzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL0h1YlNwb3QvdWktZXh0ZW5zaW9ucy1leGFtcGxlcy90cmVlL21haW4vZGVzaWduLXBhdHRlcm5zI2J1dHRvbiBEZXNpZ24gUGF0dGVybiBFeGFtcGxlc31cbiAqL1xuZXhwb3J0IGNvbnN0IEJ1dHRvbiA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0J1dHRvbicsIHtcbiAgICBmcmFnbWVudFByb3BzOiBbJ292ZXJsYXknXSxcbn0pO1xuLyoqXG4gKiBUaGUgYEJ1dHRvblJvd2AgY29tcG9uZW50IHJlbmRlcnMgYSByb3cgb2Ygc3BlY2lmaWVkIGBCdXR0b25gIGNvbXBvbmVudHMuIFVzZSB0aGlzIGNvbXBvbmVudCB3aGVuIHlvdSB3YW50IHRvIGluY2x1ZGUgbXVsdGlwbGUgYnV0dG9ucyBpbiBhIHJvdy5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9idXR0b24tcm93IERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBCdXR0b25Sb3cgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdCdXR0b25Sb3cnKTtcbmV4cG9ydCBjb25zdCBDYXJkID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQ2FyZCcpO1xuLyoqXG4gKiBUaGUgYERlc2NyaXB0aW9uTGlzdGAgY29tcG9uZW50IHJlbmRlcnMgcGFpcnMgb2YgbGFiZWxzIGFuZCB2YWx1ZXMuIFVzZSB0aGlzIGNvbXBvbmVudCB0byBkaXNwbGF5IHBhaXJzIG9mIGxhYmVscyBhbmQgdmFsdWVzIGluIGEgd2F5IHRoYXQncyBlYXN5IHRvIHJlYWQgYXQgYSBnbGFuY2UuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvZGVzY3JpcHRpb24tbGlzdCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgRGVzY3JpcHRpb25MaXN0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnRGVzY3JpcHRpb25MaXN0Jyk7XG4vKipcbiAqIFRoZSBgRGVzY3JpcHRpb25MaXN0SXRlbWAgY29tcG9uZW50IHJlbmRlcnMgYSBzaW5nbGUgc2V0IG9mIGEgbGFiZWwgYW5kIHZhbHVlLiBVc2UgdGhpcyBjb21wb25lbnQgd2l0aGluIGEgYERlc2NyaXB0aW9uTGlzdGAgY29tcG9uZW50LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2Rlc2NyaXB0aW9uLWxpc3QgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IERlc2NyaXB0aW9uTGlzdEl0ZW0gPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdEZXNjcmlwdGlvbkxpc3RJdGVtJyk7XG4vKipcbiAqIFRoZSBgRGl2aWRlcmAgY29tcG9uZW50IHJlbmRlcnMgYSBncmV5LCBob3Jpem9udGFsIGxpbmUgZm9yIHNwYWNpbmcgb3V0IGNvbXBvbmVudHMgdmVydGljYWxseSBvciBjcmVhdGluZyBzZWN0aW9ucyBpbiBhbiBleHRlbnNpb24uIFVzZSB0aGlzIGNvbXBvbmVudCB0byBzcGFjZSBvdXQgb3RoZXIgY29tcG9uZW50cyB3aGVuIHRoZSBjb250ZW50IG5lZWRzIG1vcmUgc2VwYXJhdGlvbiB0aGFuIHdoaXRlIHNwYWNlLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2RpdmlkZXIgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IERpdmlkZXIgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdEaXZpZGVyJyk7XG4vKipcbiAqIFRoZSBgU3BhY2VyYCBjb21wb25lbnQgcmVuZGVycyB2ZXJ0aWNhbCBzcGFjZSBiZXR3ZWVuIGNvbXBvbmVudHMuIFVzZSB0aGlzIGNvbXBvbmVudFxuICogdG8gYWRkIGNvbnNpc3RlbnQgc3BhY2luZyB3aXRob3V0IHVzaW5nIGVtcHR5IHdyYXBwZXIgY29tcG9uZW50cy5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9zcGFjZXIgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFNwYWNlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1NwYWNlcicpO1xuLyoqXG4gKiBUaGUgYEVtcHR5U3RhdGVgIGNvbXBvbmVudCBzZXRzIHRoZSBjb250ZW50IHRoYXQgYXBwZWFycyB3aGVuIHRoZSBleHRlbnNpb24gaXMgaW4gYW4gZW1wdHkgc3RhdGUuIFVzZSB0aGlzIGNvbXBvbmVudCB3aGVuIHRoZXJlJ3Mgbm8gY29udGVudCBvciBkYXRhIHRvIGhlbHAgZ3VpZGUgdXNlcnMuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvZW1wdHktc3RhdGUgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IEVtcHR5U3RhdGUgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdFbXB0eVN0YXRlJyk7XG4vKipcbiAqIFRoZSBgRXJyb3JTdGF0ZWAgY29tcG9uZW50IHNldHMgdGhlIGNvbnRlbnQgb2YgYW4gZXJyb3JpbmcgZXh0ZW5zaW9uLiBVc2UgdGhpcyBjb21wb25lbnQgdG8gZ3VpZGUgdXNlcnMgdGhyb3VnaCByZXNvbHZpbmcgZXJyb3JzIHRoYXQgeW91ciBleHRlbnNpb24gbWlnaHQgZW5jb3VudGVyLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2Vycm9yLXN0YXRlIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBFcnJvclN0YXRlID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnRXJyb3JTdGF0ZScpO1xuLyoqXG4gKiBUaGUgYEZvcm1gIGNvbXBvbmVudCByZW5kZXJzIGEgZm9ybSB0aGF0IGNhbiBjb250YWluIG90aGVyIHN1YmNvbXBvbmVudHMsIHN1Y2ggYXMgYElucHV0YCwgYFNlbGVjdGAsIGFuZCBgQnV0dG9uYC4gVXNlIHRoaXMgY29tcG9uZW50IHRvIGVuYWJsZSB1c2VycyB0byBzdWJtaXQgZGF0YSB0byBIdWJTcG90IG9yIGFuIGV4dGVybmFsIHN5c3RlbS5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9mb3JtIERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9kZXNpZ24tcGF0dGVybnMjZm9ybSBEZXNpZ24gUGF0dGVybiBFeGFtcGxlc31cbiAqL1xuZXhwb3J0IGNvbnN0IEZvcm0gPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdGb3JtJyk7XG4vKipcbiAqIFRoZSBgSGVhZGluZ2AgY29tcG9uZW50IHJlbmRlcnMgbGFyZ2UgaGVhZGluZyB0ZXh0LiBVc2UgdGhpcyBjb21wb25lbnQgdG8gaW50cm9kdWNlIG9yIGRpZmZlcmVudGlhdGUgc2VjdGlvbnMgb2YgeW91ciBjb21wb25lbnQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvaGVhZGluZyBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgSGVhZGluZyA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0hlYWRpbmcnKTtcbi8qKlxuICogVGhlIGBJbWFnZWAgY29tcG9uZW50IHJlbmRlcnMgYW4gaW1hZ2UuIFVzZSB0aGlzIGNvbXBvbmVudCB0byBhZGQgYSBsb2dvIG9yIG90aGVyIHZpc3VhbCBicmFuZCBpZGVudGl0eSBhc3NldCwgb3IgdG8gYWNjZW50dWF0ZSBvdGhlciBjb250ZW50IGluIHRoZSBleHRlbnNpb24uXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvaW1hZ2UgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IEltYWdlID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnSW1hZ2UnLCB7XG4gICAgZnJhZ21lbnRQcm9wczogWydvdmVybGF5J10sXG59KTtcbi8qKlxuICogVGhlIGBJbnB1dGAgY29tcG9uZW50IHJlbmRlcnMgYSB0ZXh0IGlucHV0IGZpZWxkIHdoZXJlIGEgdXNlciBjYW4gZW50ZXIgYSBjdXN0b20gdGV4dCB2YWx1ZS4gTGlrZSBvdGhlciBpbnB1dHMsIHRoaXMgY29tcG9uZW50IHNob3VsZCBiZSB1c2VkIHdpdGhpbiBhIGBGb3JtYCB0aGF0IGhhcyBhIHN1Ym1pdCBidXR0b24uXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvaW5wdXQgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IElucHV0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnSW5wdXQnKTtcbi8qKlxuICogVGhlIGBMaW5rYCBjb21wb25lbnQgcmVuZGVycyBhIGNsaWNrYWJsZSBoeXBlcmxpbmsuIFVzZSBsaW5rcyB0byBkaXJlY3QgdXNlcnMgdG8gYW4gZXh0ZXJuYWwgd2ViIHBhZ2Ugb3IgYW5vdGhlciBwYXJ0IG9mIHRoZSBIdWJTcG90IGFwcC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9saW5rIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBMaW5rID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnTGluaycsIHtcbiAgICBmcmFnbWVudFByb3BzOiBbJ292ZXJsYXknXSxcbn0pO1xuLyoqXG4gKiBUaGUgYFRleHRBcmVhYCBjb21wb25lbnQgcmVuZGVycyBhIGZpbGxhYmxlIHRleHQgZmllbGQuIExpa2Ugb3RoZXIgaW5wdXRzLCB0aGlzIGNvbXBvbmVudCBzaG91bGQgYmUgdXNlZCB3aXRoaW4gYSBgRm9ybWAgdGhhdCBoYXMgYSBzdWJtaXQgYnV0dG9uLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3RleHQtYXJlYSBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgVGV4dEFyZWEgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUZXh0QXJlYScpO1xuLy8gVGV4dGFyZWEgd2FzIGNoYW5nZWQgdG8gVGV4dEFyZWFcbi8vIEV4cG9ydGluZyBib3RoIGZvciBiYWNrd2FyZHMgY29tcGF0XG4vKiogQGRlcHJlY2F0ZWQgdXNlIFRleHRBcmVhIGluc3RlYWQuIFdpdGggYSBjYXBpdGFsIEEuKi9cbmV4cG9ydCBjb25zdCBUZXh0YXJlYSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RleHRhcmVhJyk7XG4vKipcbiAqIFRoZSBgTG9hZGluZ1NwaW5uZXJgIGNvbXBvbmVudCByZW5kZXJzIGEgdmlzdWFsIGluZGljYXRvciBmb3Igd2hlbiBhbiBleHRlbnNpb24gaXMgbG9hZGluZyBvciBwcm9jZXNzaW5nIGRhdGEuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvbG9hZGluZy1zcGlubmVyIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBMb2FkaW5nU3Bpbm5lciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0xvYWRpbmdTcGlubmVyJyk7XG4vKipcbiAqIFRoZSBgUHJvZ3Jlc3NCYXJgIGNvbXBvbmVudCByZW5kZXJzIGEgdmlzdWFsIGluZGljYXRvciBzaG93aW5nIGEgbnVtZXJpYyBhbmQvb3IgcGVyY2VudGFnZS1iYXNlZCByZXByZXNlbnRhdGlvbiBvZiBwcm9ncmVzcy4gVGhlIHBlcmNlbnRhZ2UgaXMgY2FsY3VsYXRlZCBiYXNlZCBvbiB0aGUgbWF4aW11bSBwb3NzaWJsZSB2YWx1ZSBzcGVjaWZpZWQgaW4gdGhlIGNvbXBvbmVudC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9wcm9ncmVzcy1iYXIgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFByb2dyZXNzQmFyID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnUHJvZ3Jlc3NCYXInKTtcbi8qKlxuICogVGhlIGBTZWxlY3RgIGNvbXBvbmVudCByZW5kZXJzIGEgZHJvcGRvd24gbWVudSBzZWxlY3QgZmllbGQgd2hlcmUgYSB1c2VyIGNhbiBzZWxlY3QgYSBzaW5nbGUgdmFsdWUuIEEgc2VhcmNoIGJhciB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgaW5jbHVkZWQgd2hlbiB0aGVyZSBhcmUgbW9yZSB0aGFuIHNldmVuIG9wdGlvbnMuIExpa2Ugb3RoZXIgaW5wdXRzLCB0aGlzIGNvbXBvbmVudCBzaG91bGQgYmUgdXNlZCB3aXRoaW4gYSBgRm9ybWAgdGhhdCBoYXMgYSBzdWJtaXQgYnV0dG9uLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3NlbGVjdCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgU2VsZWN0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU2VsZWN0Jyk7XG4vKipcbiAqIFRoZSBgVGFnYCBjb21wb25lbnQgcmVuZGVycyBhIHRhZyB0byBsYWJlbCBvciBjYXRlZ29yaXplIGluZm9ybWF0aW9uIG9yIG90aGVyIGNvbXBvbmVudHMuIFRhZ3MgY2FuIGJlIHN0YXRpYyBvciBjbGlja2FibGUgZm9yIGludm9raW5nIGZ1bmN0aW9ucy5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90YWcgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFRhZyA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RhZycsIHtcbiAgICBmcmFnbWVudFByb3BzOiBbJ292ZXJsYXknXSxcbn0pO1xuLyoqXG4gKiBUaGUgYFRleHRgIGNvbXBvbmVudCByZW5kZXJzIHRleHQgd2l0aCBmb3JtYXR0aW5nIG9wdGlvbnMuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdGV4dCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgVGV4dCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RleHQnKTtcbi8qKlxuICogVGhlIGBUaWxlYCBjb21wb25lbnQgcmVuZGVycyBhIHNxdWFyZSB0aWxlIHRoYXQgY2FuIGNvbnRhaW4gb3RoZXIgY29tcG9uZW50cy4gVXNlIHRoaXMgY29tcG9uZW50IHRvIGNyZWF0ZSBncm91cHMgb2YgcmVsYXRlZCBjb21wb25lbnRzLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3RpbGUgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFRpbGUgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUaWxlJyk7XG4vKiogQGRlcHJlY2F0ZWQgdXNlIEZsZXggaW5zdGVhZC4gSXQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IHJlbGVhc2UuICovXG5leHBvcnQgY29uc3QgU3RhY2sgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdTdGFjaycpO1xuLyoqXG4gKiBUaGUgYFRvZ2dsZUdyb3VwYCBjb21wb25lbnQgcmVuZGVycyBhIGxpc3Qgb2Ygc2VsZWN0YWJsZSBvcHRpb25zLCBlaXRoZXIgaW4gcmFkaW8gYnV0dG9uIG9yIGNoZWNrYm94IGZvcm0uXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdG9nZ2xlLWdyb3VwIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBUb2dnbGVHcm91cCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RvZ2dsZUdyb3VwJyk7XG4vKipcbiAqIFRoZSBgU3RhdGlzdGljc0l0ZW1gIGNvbXBvbmVudCByZW5kZXJzIGEgc2luZ2xlIGRhdGEgcG9pbnQgd2l0aGluIGEgYFN0YXRpc3RpY3NgIGNvbXBvbmVudC4gVXNlIHRoaXMgY29tcG9uZW50IHRvIGRpc3BsYXkgYSBzaW5nbGUgZGF0YSBwb2ludCwgc3VjaCBhcyBhIG51bWJlciBvciBwZXJjZW50YWdlLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3N0YXRpc3RpY3MgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFN0YXRpc3RpY3NJdGVtID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU3RhdGlzdGljc0l0ZW0nKTtcbi8qKlxuICogVGhlIGBTdGF0aXN0aWNzYCBjb21wb25lbnQgcmVuZGVycyBhIHZpc3VhbCBzcG90bGlnaHQgb2Ygb25lIG9yIG1vcmUgZGF0YSBwb2ludHMuIEluY2x1ZGVzIHRoZSBgU3RhdGlzdGljc0l0ZW1gIGFuZCBgU3RhdGlzdGljc1RyZW5kYCBzdWJjb21wb25lbnRzLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3N0YXRpc3RpY3MgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFN0YXRpc3RpY3MgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdTdGF0aXN0aWNzJyk7XG4vKipcbiAqIFRoZSBgU3RhdGlzdGljc1RyZW5kYCBjb21wb25lbnQgcmVuZGVycyBhIHBlcmNlbnRhZ2UgdHJlbmQgdmFsdWUgYW5kIGRpcmVjdGlvbiBhbG9uc2lkZSBhIGBTdGF0aXN0aWNzSXRlbWAgY29tcG9uZW50LiBVc2UgdGhpcyBjb21wb25lbnQgd2l0aGluIHRoZSBgU3RhdGlzdGljc0l0ZW1gIGNvbXBvbmVudC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9zdGF0aXN0aWNzIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBTdGF0aXN0aWNzVHJlbmQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdTdGF0aXN0aWNzVHJlbmQnKTtcbi8qKlxuICogVGhlIGBUYWJsZWAgY29tcG9uZW50IHJlbmRlcnMgYSB0YWJsZS4gVG8gZm9ybWF0IHRoZSB0YWJsZSwgdXNlIHRoZSBzdWJjb21wb25lbnRzIGBUYWJsZUhlYWRgLCBgVGFibGVSb3dgLCBgVGFibGVIZWFkZXJgLCBgVGFibGVCb2R5YCwgYFRhYmxlQ2VsbGBhbmQgYFRhYmxlRm9vdGVyYC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90YWJsZSBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL0h1YlNwb3QvdWktZXh0ZW5zaW9ucy1leGFtcGxlcy90cmVlL21haW4vZGVzaWduLXBhdHRlcm5zI3RhYmxlIERlc2lnbiBQYXR0ZXJuIEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBUYWJsZSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RhYmxlJyk7XG4vKipcbiAqIFRoZSBgVGFibGVGb290ZXJgIGNvbXBvbmVudCByZW5kZXJzIGEgZm9vdGVyIHdpdGhpbiBhIGBUYWJsZWAgY29tcG9uZW50LiBVc2UgdGhpcyBjb21wb25lbnQgdG8gZGlzcGxheSB0b3RhbHMgb3Igb3RoZXIgc3VtbWFyeSBpbmZvcm1hdGlvbi5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90YWJsZSBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgVGFibGVGb290ZXIgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUYWJsZUZvb3RlcicpO1xuLyoqXG4gKiBUaGUgYFRhYmxlQ2VsbGAgY29tcG9uZW50IHJlbmRlcnMgaW5kaXZpZHVhbCBjZWxscyB3aXRoaW4gdGhlIGBUYWJsZUJvZHlgIGNvbXBvbmVudC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90YWJsZSBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgVGFibGVDZWxsID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnVGFibGVDZWxsJyk7XG4vKipcbiAqIFRoZSBgVGFibGVSb3dgIGNvbXBvbmVudCByZW5kZXJzIGEgcm93IHdpdGhpbiB0aGUgYFRhYmxlQm9keWAgb3IgYFRhYmxlSGVhZGAgY29tcG9uZW50LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3RhYmxlIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBUYWJsZVJvdyA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RhYmxlUm93Jyk7XG4vKipcbiAqIFRoZSBgVGFibGVCb2R5YCBjb21wb25lbnQgcmVuZGVycyB0aGUgYm9keSAocm93cyBhbmQgY2VsbHMpIG9mIGEgdGFibGUgd2l0aGluIHRoZSBgVGFibGVgIGNvbXBvbmVudC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90YWJsZSBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgVGFibGVCb2R5ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnVGFibGVCb2R5Jyk7XG4vKipcbiAqIFRoZSBgVGFibGVIZWFkZXJgIGNvbXBvbmVudCByZW5kZXJzIGluZGl2aWR1YWwgY2VsbHMgY29udGFpbmluZyBib2xkZWQgY29sdW1uIGxhYmVscywgd2l0aGluIGBUYWJsZUhlYWRgLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3RhYmxlIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBUYWJsZUhlYWRlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RhYmxlSGVhZGVyJyk7XG4vKipcbiAqIFRoZSBgVGFibGVIZWFkYCBjb21wb25lbnQgcmVuZGVycyB0aGUgaGVhZGVyIHNlY3Rpb24gb2YgdGhlIGBUYWJsZWAgY29tcG9uZW50LCBjb250YWluaW5nIGNvbHVtbiBsYWJlbHMuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdGFibGUgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFRhYmxlSGVhZCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RhYmxlSGVhZCcpO1xuLyoqXG4gKiBUaGUgYE51bWJlcklucHV0YCBjb21wb25lbnQgcmVuZGVycyBhIG51bWJlciBpbnB1dCBmaWVsZC4gTGlrZSBvdGhlciBpbnB1dHMsIHRoaXMgY29tcG9uZW50IHNob3VsZCBiZSB1c2VkIHdpdGhpbiBhIGBGb3JtYCB0aGF0IGhhcyBhIHN1Ym1pdCBidXR0b24uXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvbnVtYmVyLWlucHV0IERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBOdW1iZXJJbnB1dCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ051bWJlcklucHV0Jyk7XG4vKipcbiAqIFRoZSBgQm94YCBjb21wb25lbnQgcmVuZGVycyBhbiBlbXB0eSBkaXYgY29udGFpbmVyIGZvciBmaW5lIHR1bmluZyB0aGUgc3BhY2luZyBvZiBjb21wb25lbnRzLiBDb21tb25seSB1c2VkIHdpdGggdGhlIGBGbGV4YCBjb21wb25lbnQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvYm94IERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9mbGV4LWFuZC1ib3ggRmxleCBhbmQgQm94IEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBCb3ggPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdCb3gnKTtcbi8qKlxuICogVGhlIGBTdGVwSW5kaWNhdG9yYCBjb21wb25lbnQgcmVuZGVycyBhbiBpbmRpY2F0b3IgdG8gc2hvdyB0aGUgY3VycmVudCBzdGVwIG9mIGEgbXVsdGktc3RlcCBwcm9jZXNzLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3N0ZXAtaW5kaWNhdG9yIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBTdGVwSW5kaWNhdG9yID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU3RlcEluZGljYXRvcicpO1xuLyoqXG4gKiBUaGUgYEFjY29yZGlvbmAgY29tcG9uZW50IHJlbmRlcnMgYW4gZXhwYW5kYWJsZSBhbmQgY29sbGFwc2FibGUgc2VjdGlvbiB0aGF0IGNhbiBjb250YWluIG90aGVyIGNvbXBvbmVudHMuIFRoaXMgY29tcG9uZW50IGNhbiBiZSBoZWxwZnVsIGZvciBzYXZpbmcgc3BhY2UgYW5kIGJyZWFraW5nIHVwIGV4dGVuc2lvbiBjb250ZW50LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2FjY29yZGlvbiBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgQWNjb3JkaW9uID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQWNjb3JkaW9uJyk7XG4vKipcbiAqIFRoZSBNdWx0aVNlbGVjdCBjb21wb25lbnQgcmVuZGVycyBhIGRyb3Bkb3duIG1lbnUgc2VsZWN0IGZpZWxkIHdoZXJlIGEgdXNlciBjYW4gc2VsZWN0IG11bHRpcGxlIHZhbHVlcy4gQ29tbW9ubHkgdXNlZCB3aXRoaW4gdGhlIGBGb3JtYCBjb21wb25lbnQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvbXVsdGktc2VsZWN0IERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBNdWx0aVNlbGVjdCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ011bHRpU2VsZWN0Jyk7XG4vKipcbiAqIFRoZSBgRmxleGAgY29tcG9uZW50IHJlbmRlcnMgYSBmbGV4IGNvbnRhaW5lciB0aGF0IGNhbiBjb250YWluIG90aGVyIGNvbXBvbmVudHMsIGFuZCBhcnJhbmdlIHRoZW0gd2l0aCBwcm9wcy4gVXNlIHRoaXMgY29tcG9uZW50IHRvIGNyZWF0ZSBhIGZsZXhpYmxlIGFuZCByZXNwb25zaXZlIGxheW91dC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9mbGV4IERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9mbGV4LWFuZC1ib3ggRmxleCBhbmQgQm94IEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBGbGV4ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnRmxleCcpO1xuLyoqXG4gKiBUaGUgYERhdGVJbnB1dGAgY29tcG9uZW50IHJlbmRlcnMgYW4gaW5wdXQgZmllbGQgd2hlcmUgYSB1c2VyIGNhbiBzZWxlY3QgYSBkYXRlLiBDb21tb25seSB1c2VkIHdpdGhpbiB0aGUgYEZvcm1gIGNvbXBvbmVudC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9kYXRlLWlucHV0IERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBEYXRlSW5wdXQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdEYXRlSW5wdXQnKTtcbi8qKlxuICogVGhlIGBDaGVja2JveGAgY29tcG9uZW50IHJlbmRlcnMgYSBzaW5nbGUgY2hlY2tib3ggaW5wdXQuIENvbW1vbmx5IHVzZWQgd2l0aGluIHRoZSBgRm9ybWAgY29tcG9uZW50LiBJZiB5b3Ugd2FudCB0byBkaXNwbGF5IG11bHRpcGxlIGNoZWNrYm94ZXMsIHlvdSBzaG91bGQgdXNlIGBUb2dnbGVHcm91cGAgaW5zdGVhZCwgYXMgaXQgY29tZXMgd2l0aCBleHRyYSBsb2dpYyBmb3IgaGFuZGxpbmcgbXVsdGlwbGUgY2hlY2tib3hlcy5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9jaGVja2JveCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgQ2hlY2tib3ggPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdDaGVja2JveCcpO1xuLyoqXG4gKiBUaGUgYFJhZGlvQnV0dG9uYCBjb21wb25lbnQgcmVuZGVycyBhIHNpbmdsZSByYWRpbyBpbnB1dC4gQ29tbW9ubHkgdXNlZCB3aXRoaW4gdGhlIGBGb3JtYCBjb21wb25lbnQuIElmIHlvdSB3YW50IHRvIGRpc3BsYXkgbXVsdGlwbGUgcmFkaW8gaW5wdXRzLCB5b3Ugc2hvdWxkIHVzZSBgVG9nZ2xlR3JvdXBgIGluc3RlYWQsIGFzIGl0IGNvbWVzIHdpdGggZXh0cmEgbG9naWMgZm9yIGhhbmRsaW5nIG11bHRpcGxlIGlucHV0cy5cbiAqL1xuZXhwb3J0IGNvbnN0IFJhZGlvQnV0dG9uID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnUmFkaW9CdXR0b24nKTtcbi8qKlxuICogVGhlIGBMaXN0YCBjb21wb25lbnQgcmVuZGVycyBhIGxpc3Qgb2YgaXRlbXMuIFVzZSB0aGlzIGNvbXBvbmVudCB0byBkaXNwbGF5IGEgbGlzdCBvZiBpdGVtcywgc3VjaCBhcyBhIGxpc3Qgb2YgY29udGFjdHMsIHRhc2tzLCBvciBvdGhlciBkYXRhLiBBIGxpc3QgY2FuIGJlIHN0eWxlZCBhcyBhIGJ1bGxldGVkIGxpc3Qgb3IgYSBudW1iZXJlZCBsaXN0LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2xpc3QgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IExpc3QgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdMaXN0Jyk7XG4vKipcbiAqIFRoZSBgVG9nZ2xlYCBjb21wb25lbnQgcmVuZGVycyBhIGJvb2xlYW4gdG9nZ2xlIHN3aXRjaCB0aGF0IGNhbiBiZSBjb25maWd1cmVkIHdpdGggc2l6aW5nLCBsYWJlbCBwb3NpdGlvbiwgcmVhZC1vbmx5LCBhbmQgbW9yZS5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90b2dnbGUgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFRvZ2dsZSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RvZ2dsZScpO1xuLyoqXG4gKiBUaGUgYERyb3Bkb3duYCBjb21wb25lbnQgcmVuZGVycyBhIGRyb3Bkb3duIG1lbnUgdGhhdCBjYW4gYXBwZWFyIGFzIGEgYnV0dG9uIG9yIGh5cGVybGluay4gVXNlIHRoaXMgY29tcG9uZW50IHRvIGVuYWJsZSB1c2VycyB0byBzZWxlY3QgZnJvbSBtdWx0aXBsZSBvcHRpb25zIGluIGEgY29tcGFjdCBsaXN0LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2Ryb3Bkb3duIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBEcm9wZG93biA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlQ29tcG91bmRSZWFjdENvbXBvbmVudCgnRHJvcGRvd24nLCB7XG4gICAgY29tcG91bmRDb21wb25lbnRQcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgYERyb3Bkb3duLkJ1dHRvbkl0ZW1gIGNvbXBvbmVudCByZXByZXNlbnRzIGEgc2luZ2xlIG9wdGlvbiB3aXRoaW4gYSBgRHJvcGRvd25gIG1lbnUuIFVzZSB0aGlzIGNvbXBvbmVudCBhcyBhIGNoaWxkIG9mIHRoZSBgRHJvcGRvd25gIGNvbXBvbmVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogKipMaW5rczoqKlxuICAgICAgICAgKlxuICAgICAgICAgKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2Ryb3Bkb3duIERvY3N9XG4gICAgICAgICAqL1xuICAgICAgICBCdXR0b25JdGVtOiBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdEcm9wZG93bkJ1dHRvbkl0ZW0nLCB7XG4gICAgICAgICAgICBmcmFnbWVudFByb3BzOiBbJ292ZXJsYXknXSxcbiAgICAgICAgfSksXG4gICAgfSxcbn0pO1xuLyoqXG4gKiBUaGUgUGFuZWwgY29tcG9uZW50IHJlbmRlcnMgYSBwYW5lbCBvdmVybGF5IG9uIHRoZSByaWdodCBzaWRlIG9mIHRoZSBwYWdlIGFuZCBjb250YWlucyBvdGhlciBjb21wb25lbnRzLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3BhbmVsIERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9vdmVybGF5LWV4YW1wbGUgT3ZlcmxheSBFeGFtcGxlfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL0h1YlNwb3QvdWktZXh0ZW5zaW9ucy1leGFtcGxlcy90cmVlL21haW4vZGVzaWduLXBhdHRlcm5zI3BhbmVsIERlc2lnbiBQYXR0ZXJuIEV4YW1wbGVzfVxuICovXG5leHBvcnQgY29uc3QgUGFuZWwgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdQYW5lbCcpO1xuLyoqXG4gKiBUaGUgYFBhbmVsRm9vdGVyYCBpcyBhIHN0aWNreSBmb290ZXIgY29tcG9uZW50IGRpc3BsYXllZCBhdCB0aGUgYm90dG9tIG9mIGEgYFBhbmVsYCBjb21wb25lbnQuIFVzZSB0aGlzIGNvbXBvbmVudCB0byBkaXNwbGF5IGFjdGlvbnMgb3Igb3RoZXIgY29udGVudCB0aGF0IHNob3VsZCBiZSB2aXNpYmxlIGF0IGFsbCB0aW1lcy4gSW5jbHVkZSBvbmx5IG9uZSBgUGFuZWxGb290ZXJgIGNvbXBvbmVudCBwZXIgYFBhbmVsYC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9wYW5lbC1mb290ZXIgRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9IdWJTcG90L3VpLWV4dGVuc2lvbnMtZXhhbXBsZXMvdHJlZS9tYWluL292ZXJsYXktZXhhbXBsZSBPdmVybGF5IEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBQYW5lbEZvb3RlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1BhbmVsRm9vdGVyJyk7XG4vKipcbiAqIFRoZSBgUGFuZWxCb2R5YCBjb21wb25lbnQgaXMgYSBjb250YWluZXIgdGhhdCB3cmFwcyB0aGUgcGFuZWwncyBjb250ZW50IGFuZCBtYWtlcyBpdCBzY3JvbGxhYmxlLiBJbmNsdWRlIG9ubHkgb25lIGBQYW5lbEJvZHlgIGNvbXBvbmVudCBwZXIgYFBhbmVsYC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9wYW5lbC1mb290ZXIgRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9IdWJTcG90L3VpLWV4dGVuc2lvbnMtZXhhbXBsZXMvdHJlZS9tYWluL292ZXJsYXktZXhhbXBsZSBPdmVybGF5IEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBQYW5lbEJvZHkgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdQYW5lbEJvZHknKTtcbi8qKlxuICogVGhlIGBQYW5lbFNlY3Rpb25gIGNvbXBvbmVudCBpcyBhIGNvbnRhaW5lciB0aGF0IGFkZHMgcGFkZGluZyBhbmQgYm90dG9tIG1hcmdpbiB0byBwcm92aWRlIHNwYWNpbmcgYmV0d2VlbiBjb250ZW50LiBVc2UgdGhlIGBQYW5lbFNlY3Rpb25gIGNvbXBvbmVudCB0byBzZXBhcmF0ZSBjb250ZW50IHdpdGhpbiBhIGBQYW5lbEJvZHlgLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3BhbmVsLWZvb3RlciBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL0h1YlNwb3QvdWktZXh0ZW5zaW9ucy1leGFtcGxlcy90cmVlL21haW4vb3ZlcmxheS1leGFtcGxlIE92ZXJsYXkgRXhhbXBsZX1cbiAqL1xuZXhwb3J0IGNvbnN0IFBhbmVsU2VjdGlvbiA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1BhbmVsU2VjdGlvbicpO1xuLyoqXG4gKiBUaGUgYFN0ZXBwZXJJbnB1dGAgY29tcG9uZW50IHJlbmRlcnMgYSBudW1iZXIgaW5wdXQgZmllbGQgdGhhdCBjYW4gYmUgaW5jcmVhc2VkIG9yIGRlY3JlYXNlZCBieSBhIHNldCBudW1iZXIuIENvbW1vbmx5IHVzZWQgd2l0aGluIHRoZSBgRm9ybWAgY29tcG9uZW50LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3N0ZXBwZXItaW5wdXQgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFN0ZXBwZXJJbnB1dCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1N0ZXBwZXJJbnB1dCcpO1xuLyoqXG4gKiBUaGUgTW9kYWwgY29tcG9uZW50IHJlbmRlcnMgYSBwb3AtdXAgb3ZlcmxheSB0aGF0IGNhbiBjb250YWluIG90aGVyIGNvbXBvbmVudHMuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvbW9kYWwgRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9IdWJTcG90L3VpLWV4dGVuc2lvbnMtZXhhbXBsZXMvdHJlZS9tYWluL292ZXJsYXktZXhhbXBsZSBPdmVybGF5IEV4YW1wbGV9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9kZXNpZ24tcGF0dGVybnMjbW9kYWwgRGVzaWduIFBhdHRlcm4gRXhhbXBsZXN9XG4gKi9cbmV4cG9ydCBjb25zdCBNb2RhbCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ01vZGFsJyk7XG4vKipcbiAqIFRoZSBgTW9kYWxCb2R5YCBjb21wb25lbnQgY29udGFpbnMgdGhlIG1haW4gY29udGVudCBvZiB0aGUgbW9kYWwuIE9uZSBgTW9kYWxCb2R5YCBpcyByZXF1aXJlZCBwZXIgYE1vZGFsYC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9tb2RhbCBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL0h1YlNwb3QvdWktZXh0ZW5zaW9ucy1leGFtcGxlcy90cmVlL21haW4vb3ZlcmxheS1leGFtcGxlIE92ZXJsYXkgRXhhbXBsZX1cbiAqL1xuZXhwb3J0IGNvbnN0IE1vZGFsQm9keSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ01vZGFsQm9keScpO1xuLyoqXG4gKiBUaGUgYE1vZGFsRm9vdGVyYCBjb21wb25lbnQgaXMgYW4gb3B0aW9uYWwgY29tcG9uZW50IHRvIGZvcm1hdCB0aGUgZm9vdGVyIHNlY3Rpb24gb2YgdGhlIG1vZGFsLiBVc2Ugb25lIGBNb2RhbEZvb3RlcmAgcGVyIGBNb2RhbGAuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvbW9kYWwgRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9IdWJTcG90L3VpLWV4dGVuc2lvbnMtZXhhbXBsZXMvdHJlZS9tYWluL292ZXJsYXktZXhhbXBsZSBPdmVybGF5IEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBNb2RhbEZvb3RlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ01vZGFsRm9vdGVyJyk7XG4vKipcbiAqIFVzZSB0aGUgYEljb25gIGNvbXBvbmVudCB0byByZW5kZXIgYSB2aXN1YWwgaWNvbiB3aXRoaW4gb3RoZXIgY29tcG9uZW50cy4gSXQgY2FuIGdlbmVyYWxseSBiZSB1c2VkIGluc2lkZSBtb3N0IGNvbXBvbmVudHMsIGV4Y2x1ZGluZyBvbmVzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBjaGlsZCBjb21wb25lbnRzLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2ljb24gRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IEljb24gPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdJY29uJyk7XG4vKipcbiAqIFRoZSBgU3RhdHVzVGFnYCBjb21wb25lbnQgcmVuZGVycyBhIHZpc3VhbCBpbmRpY2F0b3IgdG8gZGlzcGxheSB0aGUgY3VycmVudCBzdGF0dXMgb2YgYW4gaXRlbS4gU3RhdHVzIHRhZ3MgY2FuIGJlIHN0YXRpYyBvciBjbGlja2FibGUuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvc3RhdHVzLXRhZyBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9zdGF0dXMtdGFnI3ZhcmlhbnRzIFZhcmlhbnRzfVxuICovXG5leHBvcnQgY29uc3QgU3RhdHVzVGFnID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU3RhdHVzVGFnJyk7XG4vKipcbiAqIFRoZSBgTG9hZGluZ0J1dHRvbmAgY29tcG9uZW50IHJlbmRlcnMgYSBidXR0b24gd2l0aCBsb2FkaW5nIHN0YXRlIG9wdGlvbnMuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvbG9hZGluZy1idXR0b24gRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IExvYWRpbmdCdXR0b24gPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdMb2FkaW5nQnV0dG9uJywge1xuICAgIGZyYWdtZW50UHJvcHM6IFsnb3ZlcmxheSddLFxufSk7XG4vKipcbiAqIFRoZSBgQmFyQ2hhcnRgIGNvbXBvbmVudCByZW5kZXJzIGEgYmFyIGNoYXJ0IGZvciB2aXN1YWxpemluZyBkYXRhLiBUaGlzIHR5cGUgb2YgY2hhcnQgaXMgYmVzdCBzdWl0ZWQgZm9yIGNvbXBhcmluZyBjYXRlZ29yaWNhbCBkYXRhLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2Jhci1jaGFydCBCYXJDaGFydCBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9jaGFydHMgQ2hhcnRzIERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9jaGFydHMtZXhhbXBsZSBDaGFydHMgRXhhbXBsZX1cbiAqL1xuZXhwb3J0IGNvbnN0IEJhckNoYXJ0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQmFyQ2hhcnQnKTtcbi8qKlxuICogVGhlIGBMaW5lQ2hhcnRgIGNvbXBvbmVudCByZW5kZXJzIGEgbGluZSBjaGFydCBmb3IgdmlzdWFsaXppbmcgZGF0YS4gVGhpcyB0eXBlIG9mIGNoYXJ0IGlzIGJlc3Qgc3VpdGVkIGZvciB0aW1lIHNlcmllcyBwbG90cyBvciB0cmVuZCBkYXRhLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2xpbmUtY2hhcnQgTGluZUNoYXJ0IERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2NoYXJ0cyBDaGFydHMgRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9IdWJTcG90L3VpLWV4dGVuc2lvbnMtZXhhbXBsZXMvdHJlZS9tYWluL2NoYXJ0cy1leGFtcGxlIENoYXJ0cyBFeGFtcGxlfVxuICovXG5leHBvcnQgY29uc3QgTGluZUNoYXJ0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnTGluZUNoYXJ0Jyk7XG4vKipcbiAqIFRoZSBgU2NvcmVDaXJjbGVgIGNvbXBvbmVudCBkaXNwbGF5cyBhIHNjb3JlIHZhbHVlICgwLTEwMCkgYXMgYSBjaXJjdWxhciBwcm9ncmVzcyBpbmRpY2F0b3Igd2l0aCBjb2xvci1jb2RlZCBiYW5kcy5cbiAqIFNjb3JlcyBhcmUgY29sb3ItY29kZWQ6IDAtMzIgKGFsZXJ0L3JlZCksIDMzLTY1ICh3YXJuaW5nL3llbGxvdyksIDY2LTEwMCAoc3VjY2Vzcy9ncmVlbikuXG4gKiBAZXhhbXBsZVxuICogYGBgdHN4XG4gKiAgIDxTY29yZUNpcmNsZSBzY29yZT17NzV9IC8+XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNvbnN0IFNjb3JlQ2lyY2xlID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU2NvcmVDaXJjbGUnKTtcbi8qKlxuICogYFRhYnNgIGFsbG93IHlvdSB0byBncm91cCByZWxhdGVkIGNvbnRlbnQgaW4gYSBjb21wYWN0IHNwYWNlLCBhbGxvd2luZyB1c2VycyB0byBzd2l0Y2ggYmV0d2VlbiB2aWV3cyB3aXRob3V0IGxlYXZpbmcgdGhlIHBhZ2UuXG4gKiBAZXhhbXBsZVxuICogYGBgdHN4XG4gKiA8VGFicyBkZWZhdWx0U2VsZWN0ZWQ9XCIxXCI+XG4gKiAgIDxUYWIgdGFiSWQ9XCIxXCI+Rmlyc3QgdGFiIGNvbnRlbnQ8L1RhYj5cbiAqICAgPFRhYiB0YWJJZD1cIjJcIj5TZWNvbmQgdGFiIGNvbnRlbnQ8L1RhYj5cbiAqIDwvVGFicz5cbiAqIGBgYFxuICpcbiAqICoqTGlua3M6KipcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdGFicyBEb2N1bWVudGF0aW9ufVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2h1YnNwb3RkZXYvdWllLXRhYmJlZC1wcm9kdWN0LWNhcm91c2VsIFRhYnMgRXhhbXBsZX1cbiAqL1xuZXhwb3J0IGNvbnN0IFRhYnMgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUYWJzJyk7XG4vKipcbiAqIEVhY2ggYFRhYmAgcmVwcmVzZW50cyBhIHNpbmdsZSB0YWIgKG9yIFwidmlld1wiKSB3aXRoaW4gdGhlIHBhcmVudCBgVGFic2AgY29tcG9uZW50LlxuICogQGV4YW1wbGVcbiAqIGBgYHRzeFxuICogPFRhYnMgZGVmYXVsdFNlbGVjdGVkPVwiMVwiPlxuICogICA8VGFiIHRhYklkPVwiMVwiPkZpcnN0IHRhYiBjb250ZW50PC9UYWI+XG4gKiAgIDxUYWIgdGFiSWQ9XCIyXCI+U2Vjb25kIHRhYiBjb250ZW50PC9UYWI+XG4gKiA8L1RhYnM+XG4gKiBgYGBcbiAqXG4gKiAqKkxpbmtzOioqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3RhYnMgRG9jdW1lbnRhdGlvbn1cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9odWJzcG90ZGV2L3VpZS10YWJiZWQtcHJvZHVjdC1jYXJvdXNlbCBUYWJzIEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBUYWIgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUYWInKTtcbi8qKlxuICogVGhlIGBJbGx1c3RyYXRpb25gIGNvbXBvbmVudCByZW5kZXJzIGFuIGlsbHVzdHJhdGlvbi5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9pbGx1c3RyYXRpb24gSWxsdXN0cmF0aW9uIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBJbGx1c3RyYXRpb24gPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdJbGx1c3RyYXRpb24nKTtcbi8qKlxuICogVGhlIGBUb29sdGlwYCBjb21wb25lbnQgcmVuZGVycyBhIHRvb2x0aXAgZm9yIGEgY29tcG9uZW50LlxuICpcbiAqICoqTGlua3M6KipcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdG9vbHRpcCBEb2N1bWVudGF0aW9ufVxuICovXG5leHBvcnQgY29uc3QgVG9vbHRpcCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1Rvb2x0aXAnKTtcbi8qKlxuICogVGhlIGBTZWFyY2hJbnB1dGAgY29tcG9uZW50IHJlbmRlcnMgYSBzZWFyY2ggaW5wdXQgZmllbGQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvc2VhcmNoLWlucHV0IFNlYXJjaElucHV0IERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBTZWFyY2hJbnB1dCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1NlYXJjaElucHV0Jyk7XG4vKipcbiAqIFRoZSBgVGltZUlucHV0YCBjb21wb25lbnQgcmVuZGVycyBhbiBpbnB1dCBmaWVsZCB3aGVyZSBhIHVzZXIgY2FuIHNlbGVjdCBhIHRpbWUuIENvbW1vbmx5IHVzZWQgd2l0aGluIHRoZSBgRm9ybWAgY29tcG9uZW50LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3RpbWUtaW5wdXQgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFRpbWVJbnB1dCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RpbWVJbnB1dCcpO1xuLyoqXG4gKiBUaGUgYEN1cnJlbmN5SW5wdXRgIGNvbXBvbmVudCByZW5kZXJzIGEgY3VycmVuY3kgaW5wdXQgZmllbGQgd2l0aCBwcm9wZXIgZm9ybWF0dGluZyxcbiAqIGN1cnJlbmN5IHN5bWJvbHMsIGFuZCBsb2NhbGUtc3BlY2lmaWMgZGlzcGxheSBwYXR0ZXJucy4gQ29tbW9ubHkgdXNlZCB3aXRoaW4gdGhlIGBGb3JtYCBjb21wb25lbnQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvY3VycmVuY3ktaW5wdXQgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IEN1cnJlbmN5SW5wdXQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdDdXJyZW5jeUlucHV0Jyk7XG4vKipcbiAqIFRoZSBgSW5saW5lYCBjb21wb25lbnQgc3ByZWFkcyBhbGlnbnMgaXRzIGNoaWxkcmVuIGhvcml6b250YWxseSAoYWxvbmcgdGhlIHgtYXhpcykuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvaW5saW5lIERvY3N9XG4gKi8gZXhwb3J0IGNvbnN0IElubGluZSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0lubGluZScpO1xuLyoqXG4gKiBUaGUgYEF1dG9HcmlkYCBjb21wb25lbnQgcmVuZGVycyBhIHJlc3BvbnNpdmUgZ3JpZCBsYXlvdXQgdGhhdCBhdXRvbWF0aWNhbGx5IGFkanVzdHMgdGhlIG51bWJlciBvZiBjb2x1bW5zIGJhc2VkIG9uIGF2YWlsYWJsZSBzcGFjZS4gVXNlIHRoaXMgY29tcG9uZW50IHRvIGNyZWF0ZSBmbGV4aWJsZSBncmlkIGxheW91dHMgZm9yIGNhcmRzLCB0aWxlcywgb3Igb3RoZXIgY29udGVudC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9zaW1wbGUtZ3JpZCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgQXV0b0dyaWQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdBdXRvR3JpZCcpO1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIENSTSBDT01QT05FTlRTXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZXhwb3J0IGNvbnN0IENybVByb3BlcnR5TGlzdCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NybVByb3BlcnR5TGlzdCcpO1xuZXhwb3J0IGNvbnN0IENybUFzc29jaWF0aW9uVGFibGUgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdDcm1Bc3NvY2lhdGlvblRhYmxlJyk7XG5leHBvcnQgY29uc3QgQ3JtRGF0YUhpZ2hsaWdodCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NybURhdGFIaWdobGlnaHQnKTtcbmV4cG9ydCBjb25zdCBDcm1SZXBvcnQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdDcm1SZXBvcnQnKTtcbmV4cG9ydCBjb25zdCBDcm1Bc3NvY2lhdGlvblBpdm90ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQ3JtQXNzb2NpYXRpb25QaXZvdCcpO1xuZXhwb3J0IGNvbnN0IENybUFzc29jaWF0aW9uUHJvcGVydHlMaXN0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQ3JtQXNzb2NpYXRpb25Qcm9wZXJ0eUxpc3QnKTtcbmV4cG9ydCBjb25zdCBDcm1Bc3NvY2lhdGlvblN0YWdlVHJhY2tlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NybUFzc29jaWF0aW9uU3RhZ2VUcmFja2VyJyk7XG5leHBvcnQgY29uc3QgQ3JtU2ltcGxlRGVhZGxpbmUgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdDcm1TaW1wbGVEZWFkbGluZScpO1xuZXhwb3J0IGNvbnN0IENybVN0YWdlVHJhY2tlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NybVN0YWdlVHJhY2tlcicpO1xuZXhwb3J0IGNvbnN0IENybVN0YXRpc3RpY3MgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdDcm1TdGF0aXN0aWNzJyk7XG5leHBvcnQgY29uc3QgQ3JtQWN0aW9uQnV0dG9uID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQ3JtQWN0aW9uQnV0dG9uJyk7XG5leHBvcnQgY29uc3QgQ3JtQWN0aW9uTGluayA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NybUFjdGlvbkxpbmsnKTtcbmV4cG9ydCBjb25zdCBDcm1DYXJkQWN0aW9ucyA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NybUNhcmRBY3Rpb25zJyk7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQVBQIEhPTUUgQ09NUE9ORU5UU1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8qKlxuICogVGhlIGBIZWFkZXJBY3Rpb25zYCBjb21wb25lbnQgcmVuZGVycyBhIGNvbnRhaW5lciBmb3IgYWN0aW9uIGJ1dHRvbnMgaW4gdGhlIGFwcCBob21lIGhlYWRlci4gSXQgYWNjZXB0cyBgUHJpbWFyeUhlYWRlckFjdGlvbkJ1dHRvbmAgYW5kIGBTZWNvbmRhcnlIZWFkZXJBY3Rpb25CdXR0b25gIGFzIGNoaWxkcmVuLlxuICpcbiAqL1xuZXhwb3J0IGNvbnN0IEhlYWRlckFjdGlvbnMgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdIZWFkZXJBY3Rpb25zJyk7XG4vKipcbiAqIFRoZSBgUHJpbWFyeUhlYWRlckFjdGlvbkJ1dHRvbmAgY29tcG9uZW50IHJlbmRlcnMgYSBwcmltYXJ5IGFjdGlvbiBidXR0b24gaW4gdGhlIGFwcCBob21lIGhlYWRlci4gVGhpcyBidXR0b24gaXMgc3R5bGVkIGFzIHRoZSBtYWluIGNhbGwtdG8tYWN0aW9uIGFuZCBvbmx5IG9uZSBzaG91bGQgYmUgdXNlZCBwZXIgYEhlYWRlckFjdGlvbnNgIGNvbnRhaW5lci5cbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBQcmltYXJ5SGVhZGVyQWN0aW9uQnV0dG9uID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnUHJpbWFyeUhlYWRlckFjdGlvbkJ1dHRvbicsIHtcbiAgICBmcmFnbWVudFByb3BzOiBbJ292ZXJsYXknXSxcbn0pO1xuLyoqXG4gKiBUaGUgYFNlY29uZGFyeUhlYWRlckFjdGlvbkJ1dHRvbmAgY29tcG9uZW50IHJlbmRlcnMgYSBzZWNvbmRhcnkgYWN0aW9uIGJ1dHRvbiBpbiB0aGUgYXBwIGhvbWUgaGVhZGVyLiBNdWx0aXBsZSBzZWNvbmRhcnkgYWN0aW9ucyBjYW4gYmUgdXNlZCBhbmQgdGhleSB3aWxsIGJlIGdyb3VwZWQgYXBwcm9wcmlhdGVseSBpbiB0aGUgaGVhZGVyLlxuICpcbiAqL1xuZXhwb3J0IGNvbnN0IFNlY29uZGFyeUhlYWRlckFjdGlvbkJ1dHRvbiA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1NlY29uZGFyeUhlYWRlckFjdGlvbkJ1dHRvbicsIHtcbiAgICBmcmFnbWVudFByb3BzOiBbJ292ZXJsYXknXSxcbn0pO1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEFQUCBQQUdFIENPTVBPTkVOVFNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5leHBvcnQgY29uc3QgUGFnZUxpbmsgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdQYWdlTGluaycpO1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEVYUEVSSU1FTlRBTCBDT01QT05FTlRTXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLyoqXG4gKiBAZXhwZXJpbWVudGFsIFRoaXMgY29tcG9uZW50IGlzIGV4cGVyaW1lbnRhbC4gQXZvaWQgdXNpbmcgaXQgaW4gcHJvZHVjdGlvbiBkdWUgdG8gcG90ZW50aWFsIGJyZWFraW5nIGNoYW5nZXMuIFlvdXIgZmVlZGJhY2sgaXMgdmFsdWFibGUgZm9yIGltcHJvdmVtZW50cy4gU3RheSB0dW5lZCBmb3IgdXBkYXRlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IElmcmFtZSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0lmcmFtZScpO1xuLyoqXG4gKiBAZXhwZXJpbWVudGFsIFRoaXMgY29tcG9uZW50IGlzIGV4cGVyaW1lbnRhbC4gQXZvaWQgdXNpbmcgaXQgaW4gcHJvZHVjdGlvbiBkdWUgdG8gcG90ZW50aWFsIGJyZWFraW5nIGNoYW5nZXMuIFlvdXIgZmVlZGJhY2sgaXMgdmFsdWFibGUgZm9yIGltcHJvdmVtZW50cy4gU3RheSB0dW5lZCBmb3IgdXBkYXRlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IE1lZGlhT2JqZWN0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnTWVkaWFPYmplY3QnLCB7XG4gICAgZnJhZ21lbnRQcm9wczogWydpdGVtUmlnaHQnLCAnaXRlbUxlZnQnXSxcbn0pO1xuLyoqXG4gKiBAZXhwZXJpbWVudGFsIFRoaXMgY29tcG9uZW50IGlzIGV4cGVyaW1lbnRhbC4gQXZvaWQgdXNpbmcgaXQgaW4gcHJvZHVjdGlvbiBkdWUgdG8gcG90ZW50aWFsIGJyZWFraW5nIGNoYW5nZXMuIFlvdXIgZmVlZGJhY2sgaXMgdmFsdWFibGUgZm9yIGltcHJvdmVtZW50cy4gU3RheSB0dW5lZCBmb3IgdXBkYXRlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IFN0YWNrMiA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1N0YWNrMicpO1xuLyoqXG4gKiBAZXhwZXJpbWVudGFsIFRoaXMgY29tcG9uZW50IGlzIGV4cGVyaW1lbnRhbC4gQXZvaWQgdXNpbmcgaXQgaW4gcHJvZHVjdGlvbiBkdWUgdG8gcG90ZW50aWFsIGJyZWFraW5nIGNoYW5nZXMuIFlvdXIgZmVlZGJhY2sgaXMgdmFsdWFibGUgZm9yIGltcHJvdmVtZW50cy4gU3RheSB0dW5lZCBmb3IgdXBkYXRlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IENlbnRlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NlbnRlcicpO1xuLyoqXG4gKiBAZXhwZXJpbWVudGFsIFRoaXMgY29tcG9uZW50IGlzIGV4cGVyaW1lbnRhbC4gQXZvaWQgdXNpbmcgaXQgaW4gcHJvZHVjdGlvbiBkdWUgdG8gcG90ZW50aWFsIGJyZWFraW5nIGNoYW5nZXMuIFlvdXIgZmVlZGJhY2sgaXMgdmFsdWFibGUgZm9yIGltcHJvdmVtZW50cy4gU3RheSB0dW5lZCBmb3IgdXBkYXRlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IEdyaWQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdHcmlkJyk7XG4vKipcbiAqIEBleHBlcmltZW50YWwgVGhpcyBjb21wb25lbnQgaXMgZXhwZXJpbWVudGFsLiBBdm9pZCB1c2luZyBpdCBpbiBwcm9kdWN0aW9uIGR1ZSB0byBwb3RlbnRpYWwgYnJlYWtpbmcgY2hhbmdlcy4gWW91ciBmZWVkYmFjayBpcyB2YWx1YWJsZSBmb3IgaW1wcm92ZW1lbnRzLiBTdGF5IHR1bmVkIGZvciB1cGRhdGVzLlxuICovXG5leHBvcnQgY29uc3QgR3JpZEl0ZW0gPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdHcmlkSXRlbScpO1xuLyoqXG4gKiBAZXhwZXJpbWVudGFsIFRoaXMgY29tcG9uZW50IGlzIGV4cGVyaW1lbnRhbC4gQXZvaWQgdXNpbmcgaXQgaW4gcHJvZHVjdGlvbiBkdWUgdG8gcG90ZW50aWFsIGJyZWFraW5nIGNoYW5nZXMuIFlvdXIgZmVlZGJhY2sgaXMgdmFsdWFibGUgZm9yIGltcHJvdmVtZW50cy4gU3RheSB0dW5lZCBmb3IgdXBkYXRlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IFNldHRpbmdzVmlldyA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1NldHRpbmdzVmlldycpO1xuLyoqXG4gKiBUaGUgYEV4cGFuZGFibGVUZXh0YCBjb21wb25lbnQgcmVuZGVycyBhIHRleHQgdGhhdCBjYW4gYmUgZXhwYW5kZWQgb3IgY29sbGFwc2VkIGJhc2VkIG9uIGEgbWF4aW11bSBoZWlnaHQuXG4gKlxuICogQGV4cGVyaW1lbnRhbCBUaGlzIGNvbXBvbmVudCBpcyBleHBlcmltZW50YWwuIEF2b2lkIHVzaW5nIGl0IGluIHByb2R1Y3Rpb24gZHVlIHRvIHBvdGVudGlhbCBicmVha2luZyBjaGFuZ2VzLiBZb3VyIGZlZWRiYWNrIGlzIHZhbHVhYmxlIGZvciBpbXByb3ZlbWVudHMuIFN0YXkgdHVuZWQgZm9yIHVwZGF0ZXMuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvZXhwYW5kYWJsZS10ZXh0IEV4cGFuZGFibGVUZXh0IERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBFeHBhbmRhYmxlVGV4dCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0V4cGFuZGFibGVUZXh0Jyk7XG4vKipcbiAqIFRoZSBgUG9wb3ZlcmAgY29tcG9uZW50IHJlbmRlcnMgYSBwb3BvdmVyIG92ZXJsYXkgdGhhdCBjYW4gY29udGFpbiBvdGhlciBjb21wb25lbnRzLlxuICpcbiAqIEBleHBlcmltZW50YWwgVGhpcyBjb21wb25lbnQgaXMgZXhwZXJpbWVudGFsLiBBdm9pZCB1c2luZyBpdCBpbiBwcm9kdWN0aW9uIGR1ZSB0byBwb3RlbnRpYWwgYnJlYWtpbmcgY2hhbmdlcy4gWW91ciBmZWVkYmFjayBpcyB2YWx1YWJsZSBmb3IgaW1wcm92ZW1lbnRzLiBTdGF5IHR1bmVkIGZvciB1cGRhdGVzLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3BvcG92ZXIgUG9wb3ZlciBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgUG9wb3ZlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1BvcG92ZXInKTtcbi8qKlxuICogQGV4cGVyaW1lbnRhbCBUaGlzIGNvbXBvbmVudCBpcyBleHBlcmltZW50YWwuIEF2b2lkIHVzaW5nIGl0IGluIHByb2R1Y3Rpb24gZHVlIHRvIHBvdGVudGlhbCBicmVha2luZyBjaGFuZ2VzLiBZb3VyIGZlZWRiYWNrIGlzIHZhbHVhYmxlIGZvciBpbXByb3ZlbWVudHMuIFN0YXkgdHVuZWQgZm9yIHVwZGF0ZXMuXG4gKi9cbmV4cG9ydCBjb25zdCBGaWxlSW5wdXQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdGaWxlSW5wdXQnKTtcbiIsImltcG9ydCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5jb25zdCBNb2Nrc0NvbnRleHQgPSBjcmVhdGVDb250ZXh0KG51bGwpO1xuLyoqXG4gKiBDcmVhdGVzIGEgbW9jay1hd2FyZSBob29rIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gbW9jayB0aGUgb3JpZ2luYWwgaG9vayBmdW5jdGlvbi5cbiAqIFRoZSBtb2NrLWF3YXJlIGhvb2sgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIG1vY2tlZCBob29rIGZ1bmN0aW9uIGlmIGEgbW9jayBpcyBmb3VuZCwgb3RoZXJ3aXNlIGl0IHdpbGwgcmV0dXJuIHRoZSBvcmlnaW5hbCBob29rIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSBob29rTmFtZSBUaGUgbmFtZSBvZiB0aGUgaG9vayB0byBtb2NrIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIGtleSBpbiB0aGUgTW9ja3MgaW50ZXJmYWNlXG4gKiBAcGFyYW0gb3JpZ2luYWxIb29rRnVuY3Rpb24gVGhlIG9yaWdpbmFsIGhvb2sgZnVuY3Rpb24gdG8gY2FsbCBpZiBubyBtb2NrIGlzIGZvdW5kXG4gKiBAcmV0dXJucyBUaGUgbW9ja2VkIGhvb2sgZnVuY3Rpb24gb3IgdGhlIG9yaWdpbmFsIGhvb2sgZnVuY3Rpb24gaWYgbm8gbW9jayBpcyBmb3VuZFxuICovXG5leHBvcnQgY29uc3QgY3JlYXRlTW9ja0F3YXJlSG9vayA9IChob29rTmFtZSwgb3JpZ2luYWxIb29rRnVuY3Rpb24pID0+IHtcbiAgICBjb25zdCB1c2VXcmFwcGVyID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgY29uc3QgbW9ja3MgPSB1c2VNb2Nrc0NvbnRleHQoKTtcbiAgICAgICAgaWYgKCFtb2Nrcykge1xuICAgICAgICAgICAgLy8gSWYgbm8gbW9ja3MgYXJlIHByb3ZpZGVkLCBjYWxsIHRoZSBvcmlnaW5hbCBob29rIGZ1bmN0aW9uXG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxIb29rRnVuY3Rpb24oLi4uYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2hlbiBhIG1vY2sgaXMgcHJvdmlkZWQgYnkgdGhlIHRlc3RpbmcgdXRpbGl0aWVzICh2aWEgPE1vY2tzQ29udGV4dFByb3ZpZGVyPiksIHJldHVybiB0aGUgbW9ja2VkIGhvb2sgZnVuY3Rpb25cbiAgICAgICAgY29uc3QgbW9ja0hvb2sgPSBtb2Nrc1tob29rTmFtZV07XG4gICAgICAgIGlmICghbW9ja0hvb2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSWxsZWdhbCBTdGF0ZTogTW9jayBmb3IgaG9vayAke2hvb2tOYW1lfSBub3QgZm91bmQuYCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2FsbCB0aGUgbW9ja2VkIGhvb2sgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBhcmd1bWVudHMgYXMgdGhlIG9yaWdpbmFsIGhvb2sgZnVuY3Rpb24gYW5kIHJldHVybiB0aGUgcmVzdWx0XG4gICAgICAgIHJldHVybiBtb2NrSG9vayguLi5hcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiB1c2VXcmFwcGVyO1xufTtcbi8qKlxuICogQSBob29rIHRoYXQgcHJvdmlkZXMgYWNjZXNzIHRvIHRoZSBNb2NrcyBjb250ZXh0LlxuICogUmV0dXJucyB0aGUgbW9ja3Mgb2JqZWN0IGlmIGluc2lkZSBhIE1vY2tzQ29udGV4dFByb3ZpZGVyLCBvdGhlcndpc2UgcmV0dXJucyBudWxsLlxuICpcbiAqIEByZXR1cm5zIFRoZSBtb2NrcyBvYmplY3Qgb3IgbnVsbCBpZiBub3QgaW4gYSB0ZXN0IGVudmlyb25tZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlTW9ja3NDb250ZXh0KCkge1xuICAgIHJldHVybiB1c2VDb250ZXh0KE1vY2tzQ29udGV4dCk7XG59XG4vKipcbiAqIEEgUmVhY3QgY29tcG9uZW50IHRoYXQgcHJvdmlkZXMgdGhlIE1vY2tzIGNvbnRleHQgdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIG1vY2tzIHRvIHRoZSBtb2NrLWF3YXJlIGhvb2sgZnVuY3Rpb25zLlxuICpcbiAqIEBwYXJhbSBjaGlsZHJlbiBUaGUgY2hpbGRyZW4gdG8gcmVuZGVyLlxuICogQHJldHVybnMgVGhlIGNoaWxkcmVuIHdyYXBwZWQgaW4gdGhlIE1vY2tzIGNvbnRleHQgcHJvdmlkZXIuXG4gKi9cbmV4cG9ydCBjb25zdCBNb2Nrc0NvbnRleHRQcm92aWRlciA9IE1vY2tzQ29udGV4dC5Qcm92aWRlcjtcbiIsIi8qKlxuICogRGF0YVRhYmxlIOKAlCBSZXVzYWJsZSBmaWx0ZXJhYmxlLCBzb3J0YWJsZSwgcGFnaW5hdGVkIHRhYmxlIGNvbXBvc2l0aW9uLlxuICpcbiAqIFN1cHBvcnRzIGNsaWVudC1zaWRlIGFuZCBzZXJ2ZXItc2lkZSBtb2RlcywgdGhyZWUgZmlsdGVyIHR5cGVzXG4gKiAoc2VsZWN0LCBtdWx0aXNlbGVjdCwgZGF0ZVJhbmdlKSwgcm93IGdyb3VwaW5nLCBhbmQgZm9vdGVyIHJvd3MuXG4gKlxuICog4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4gKiBDTElFTlQtU0lERSAoZGVmYXVsdCkg4oCUIGFsbCBmaWx0ZXJpbmcsIHNvcnRpbmcsIHBhZ2luYXRpb24gaW4tbWVtb3J5OlxuICog4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4gKlxuICogICA8RGF0YVRhYmxlXG4gKiAgICAgZGF0YT17cmVjb3Jkc31cbiAqICAgICBjb2x1bW5zPXtDT0xVTU5TfVxuICogICAgIHJlbmRlclJvdz17KHJvdykgPT4gPFRhYmxlUm93IGtleT17cm93LmlkfT4uLi48L1RhYmxlUm93Pn1cbiAqICAgICBzZWFyY2hGaWVsZHM9e1tcIm5hbWVcIiwgXCJlbWFpbFwiXX1cbiAqICAgICBmaWx0ZXJzPXtGSUxURVJfQ09ORklHfVxuICogICAgIHBhZ2VTaXplPXsxMH1cbiAqICAgICBkZWZhdWx0U29ydD17eyBkYXRlOiBcImRlc2NlbmRpbmdcIiB9fVxuICogICAgIGZvb3Rlcj17KGZpbHRlcmVkRGF0YSkgPT4gPFRhYmxlUm93Pi4uLjwvVGFibGVSb3c+fVxuICogICAvPlxuICpcbiAqIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuICogU0VSVkVSLVNJREUg4oCUIHBhcmVudCBvd25zIHN0YXRlLCBjb21wb25lbnQgcmVuZGVycyBVSSArIGNhbGxzIGJhY2s6XG4gKiDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbiAqXG4gKiAgIDxEYXRhVGFibGVcbiAqICAgICBzZXJ2ZXJTaWRlPXt0cnVlfVxuICogICAgIGxvYWRpbmc9e2lzTG9hZGluZ31cbiAqICAgICBlcnJvcj17ZmV0Y2hFcnJvcn1cbiAqICAgICBkYXRhPXtjdXJyZW50UGFnZVJvd3N9XG4gKiAgICAgdG90YWxDb3VudD17MjQ3fVxuICogICAgIGNvbHVtbnM9e0NPTFVNTlN9XG4gKiAgICAgcmVuZGVyUm93PXsocm93KSA9PiA8VGFibGVSb3cga2V5PXtyb3cuaWR9Pi4uLjwvVGFibGVSb3c+fVxuICogICAgIHNlYXJjaEZpZWxkcz17W1wibmFtZVwiLCBcImVtYWlsXCJdfVxuICogICAgIGZpbHRlcnM9e0ZJTFRFUl9DT05GSUd9XG4gKiAgICAgcGFnZVNpemU9ezEwfVxuICogICAgIHBhZ2U9e2N1cnJlbnRQYWdlfVxuICogICAgIHNlYXJjaFZhbHVlPXtwYXJhbXMuc2VhcmNofVxuICogICAgIGZpbHRlclZhbHVlcz17cGFyYW1zLmZpbHRlcnN9XG4gKiAgICAgc29ydD17cGFyYW1zLnNvcnR9XG4gKiAgICAgc2VhcmNoRGVib3VuY2U9ezMwMH1cbiAqICAgICBvblNlYXJjaENoYW5nZT17KHRlcm0pID0+IHJlZmV0Y2goeyBzZWFyY2g6IHRlcm0sIHBhZ2U6IDEgfSl9XG4gKiAgICAgb25GaWx0ZXJDaGFuZ2U9eyhmaWx0ZXJWYWx1ZXMpID0+IHJlZmV0Y2goeyBmaWx0ZXJzOiBmaWx0ZXJWYWx1ZXMsIHBhZ2U6IDEgfSl9XG4gKiAgICAgb25Tb3J0Q2hhbmdlPXsoZmllbGQsIGRpcmVjdGlvbikgPT4gcmVmZXRjaCh7IHNvcnQ6IGZpZWxkLCBkaXI6IGRpcmVjdGlvbiwgcGFnZTogMSB9KX1cbiAqICAgICBvblBhZ2VDaGFuZ2U9eyhwYWdlKSA9PiByZWZldGNoKHsgcGFnZSB9KX1cbiAqICAgICBvblBhcmFtc0NoYW5nZT17KHBhcmFtcykgPT4gcmVmZXRjaChwYXJhbXMpfVxuICogICAvPlxuICpcbiAqIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuICogRklMVEVSIFRZUEVTOlxuICog4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4gKlxuICogICAvLyBTaW5nbGUgc2VsZWN0IChkZWZhdWx0KSDigJQgZXhhY3QgbWF0Y2hcbiAqICAgeyBuYW1lOiBcInN0YXR1c1wiLCB0eXBlOiBcInNlbGVjdFwiLCBwbGFjZWhvbGRlcjogXCJBbGwgc3RhdHVzZXNcIiwgb3B0aW9uczogWy4uLl0gfVxuICpcbiAqICAgLy8gTXVsdGkgc2VsZWN0IOKAlCBcImFueSBvZlwiIG1hdGNoaW5nXG4gKiAgIHsgbmFtZTogXCJjYXRlZ29yeVwiLCB0eXBlOiBcIm11bHRpc2VsZWN0XCIsIHBsYWNlaG9sZGVyOiBcIkFsbCBjYXRlZ29yaWVzXCIsIG9wdGlvbnM6IFsuLi5dIH1cbiAqXG4gKiAgIC8vIERhdGUgcmFuZ2Ug4oCUIGZyb20vdG9cbiAqICAgeyBuYW1lOiBcImRhdGVcIiwgdHlwZTogXCJkYXRlUmFuZ2VcIiwgcGxhY2Vob2xkZXI6IFwiRGF0ZSByYW5nZVwiIH1cbiAqXG4gKiAgIC8vIEN1c3RvbSBmaWx0ZXIgZnVuY3Rpb24gKHdvcmtzIHdpdGggYW55IHR5cGUpXG4gKiAgIHsgbmFtZTogXCJzY29yZVwiLCB0eXBlOiBcInNlbGVjdFwiLCBvcHRpb25zOiBbLi4uXSwgZmlsdGVyRm46IChyb3csIHZhbHVlKSA9PiByb3cuc2NvcmUgPj0gdmFsdWUgfVxuICpcbiAqIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuICogUk9XIEdST1VQSU5HOlxuICog4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4gKlxuICogICBncm91cEJ5PXt7XG4gKiAgICAgZmllbGQ6IFwic3VwcGxpZXJcIixcbiAqICAgICBsYWJlbDogKHZhbHVlLCByb3dzKSA9PiBgJHt2YWx1ZX0gKCR7cm93cy5sZW5ndGh9KWAsXG4gKiAgICAgc29ydDogXCJhc2NcIixcbiAqICAgICBkZWZhdWx0RXhwYW5kZWQ6IHRydWUsICAgICAgICAgICAvLyBncm91cHMgc3RhcnQgZXhwYW5kZWQgKGRlZmF1bHQpXG4gKiAgICAgYWdncmVnYXRpb25zOiB7ICAgICAgICAgICAgICAgICAgLy8gcGVyLWNvbHVtbiBhZ2dyZWdhdGlvbiBmdW5jdGlvbnNcbiAqICAgICAgIGFtb3VudDogKHJvd3MpID0+IGAkJHtyb3dzLnJlZHVjZSgocywgcikgPT4gcyArIHIuYW1vdW50LCAwKS50b0xvY2FsZVN0cmluZygpfWAsXG4gKiAgICAgfSxcbiAqICAgICBncm91cFZhbHVlczogeyAgICAgICAgICAgICAgICAgICAvLyBPUiBzdGF0aWMgdmFsdWVzIHBlciBncm91cCBwZXIgY29sdW1uXG4gKiAgICAgICBlbnRlcnByaXNlOiB7IGFtb3VudDogXCIkMS4zTVwiIH0sXG4gKiAgICAgfSxcbiAqICAgfX1cbiAqXG4gKiDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbiAqIFJPVyBTRUxFQ1RJT046XG4gKiDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbiAqXG4gKiAgIDxEYXRhVGFibGVcbiAqICAgICBzZWxlY3RhYmxlPXt0cnVlfVxuICogICAgIHJvd0lkRmllbGQ9XCJpZFwiXG4gKiAgICAgb25TZWxlY3Rpb25DaGFuZ2U9eyhzZWxlY3RlZElkcykgPT4gaGFuZGxlU2VsZWN0aW9uKHNlbGVjdGVkSWRzKX1cbiAqICAgICBjb2x1bW5zPXtbXG4gKiAgICAgICB7IGZpZWxkOiBcIm5hbWVcIiwgbGFiZWw6IFwiTmFtZVwiLCByZW5kZXJDZWxsOiAodmFsKSA9PiB2YWwgfSxcbiAqICAgICAgIC4uLlxuICogICAgIF19XG4gKiAgIC8+XG4gKlxuICog4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4gKiBJTkxJTkUgRURJVElORzpcbiAqIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuICpcbiAqICAgY29sdW1ucz17W1xuICogICAgIHsgZmllbGQ6IFwibmFtZVwiLCAgIGxhYmVsOiBcIk5hbWVcIiwgICBlZGl0YWJsZTogdHJ1ZSwgZWRpdFR5cGU6IFwidGV4dFwiIH0sXG4gKiAgICAgeyBmaWVsZDogXCJzdGF0dXNcIiwgbGFiZWw6IFwiU3RhdHVzXCIsIGVkaXRhYmxlOiB0cnVlLCBlZGl0VHlwZTogXCJzZWxlY3RcIixcbiAqICAgICAgIGVkaXRPcHRpb25zOiBbeyBsYWJlbDogXCJBY3RpdmVcIiwgdmFsdWU6IFwiYWN0aXZlXCIgfSwgLi4uXSB9LFxuICogICAgIHsgZmllbGQ6IFwiYW1vdW50XCIsIGxhYmVsOiBcIkFtb3VudFwiLCBlZGl0YWJsZTogdHJ1ZSwgZWRpdFR5cGU6IFwiY3VycmVuY3lcIixcbiAqICAgICAgIGVkaXRQcm9wczogeyBjdXJyZW5jeUNvZGU6IFwiVVNEXCIgfSB9LFxuICogICBdfVxuICogICBvblJvd0VkaXQ9eyhyb3csIGZpZWxkLCBuZXdWYWx1ZSkgPT4gc2F2ZShyb3cuaWQsIGZpZWxkLCBuZXdWYWx1ZSl9XG4gKlxuICogICBTdXBwb3J0ZWQgZWRpdFR5cGUgdmFsdWVzOlxuICogICAgIFwidGV4dFwiIHwgXCJ0ZXh0YXJlYVwiIHwgXCJudW1iZXJcIiB8IFwiY3VycmVuY3lcIiB8IFwic3RlcHBlclwiXG4gKiAgICAgXCJzZWxlY3RcIiB8IFwibXVsdGlzZWxlY3RcIiB8IFwiZGF0ZVwiIHwgXCJ0b2dnbGVcIiB8IFwiY2hlY2tib3hcIlxuICpcbiAqICAgTk9URTogc2VsZWN0YWJsZSBvciBlZGl0YWJsZSBjb2x1bW5zIHJlcXVpcmUgcmVuZGVyQ2VsbCh2YWx1ZSwgcm93KVxuICogICBvbiBlYWNoIGNvbHVtbi4gcmVuZGVyUm93IGlzIHVzZWQgb25seSB3aGVuIG5laXRoZXIgZmVhdHVyZSBpcyBhY3RpdmUuXG4gKlxuICog4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4gKiBDT0xVTU4gV0lEVEg6XG4gKiDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbiAqXG4gKiAgIEVhY2ggY29sdW1uIGFjY2VwdHMgYHdpZHRoYCAoaGVhZGVyICsgY2VsbHMpIGFuZCBgY2VsbFdpZHRoYCAoY2VsbHMgb25seSk6XG4gKiAgICAgXCJtaW5cIiAg4oCUIHNocmluayB0byBmaXQgY29udGVudCAobWF5IG92ZXJmbG93IHdpdGggc2Nyb2xsYmFyKVxuICogICAgIFwibWF4XCIgIOKAlCBleHBhbmQgdG8gZmlsbCBhdmFpbGFibGUgc3BhY2VcbiAqICAgICBcImF1dG9cIiDigJQgYWRqdXN0IGJhc2VkIG9uIGF2YWlsYWJsZSBzcGFjZSAoZGVmYXVsdClcbiAqICAgICBudW1iZXIg4oCUIGZpeGVkIHdpZHRoIGluIHBpeGVscyAoZS5nLiAyMDApXG4gKlxuICogICBFeGFtcGxlOiB7IGZpZWxkOiBcIm5hbWVcIiwgbGFiZWw6IFwiTmFtZVwiLCB3aWR0aDogXCJtaW5cIiwgY2VsbFdpZHRoOiBcIm1heFwiIH1cbiAqICAgSGVhZGVyIHN0YXlzIHRpZ2h0IGFyb3VuZCBcIk5hbWVcIiwgY2VsbHMgZXhwYW5kIHRvIHNob3cgZnVsbCB2YWx1ZXMuXG4gKlxuICog4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4gKiBBVVRPLVdJRFRIOlxuICog4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4gKlxuICogICBCeSBkZWZhdWx0LCBjb2x1bW5zIHdpdGhvdXQgZXhwbGljaXQgd2lkdGgvY2VsbFdpZHRoIGdldCBhdXRvLWNvbXB1dGVkXG4gKiAgIHdpZHRocyBiYXNlZCBvbiBjb250ZW50IGFuYWx5c2lzIChkYXRhIHR5cGVzLCBzdHJpbmcgbGVuZ3RocywgZWRpdCB0eXBlcykuXG4gKiAgIERpc2FibGUgd2l0aCBgYXV0b1dpZHRoPXtmYWxzZX1gLlxuICpcbiAqICAgSGV1cmlzdGljczpcbiAqICAgICAtIEJvb2xlYW5zLCBudW1iZXJzIOKGkiBcIm1pblwiXG4gKiAgICAgLSBEYXRlcyDihpIgaGVhZGVyIFwibWluXCIsIGNlbGxzIFwiYXV0b1wiIChyZW5kZXJlZCBkYXRlcyBhcmUgbG9uZ2VyIHRoYW4gcmF3KVxuICogICAgIC0gU21hbGwgZW51bXMgKOKJpDUgdW5pcXVlLCBzaG9ydCBzdHJpbmdzKSDihpIgaGVhZGVyIFwibWluXCIsIGNlbGxzIFwiYXV0b1wiXG4gKiAgICAgLSBUZXh0IOKGkiBcImF1dG9cIiAoYnJvd3NlciBkaXN0cmlidXRlcyBzcGFjZSBldmVubHkpXG4gKiAgICAgLSBFZGl0IHR5cGUgaGludHM6IGNoZWNrYm94L3RvZ2dsZSDihpIgXCJtaW5cIiwgbnVtYmVyL2N1cnJlbmN5L3NlbGVjdCDihpIgXCJhdXRvXCJcbiAqXG4gKiDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbiAqIFBBR0lOQVRJT04gT1BUSU9OUzpcbiAqIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuICpcbiAqICAgcGFnZVNpemU9ezEwfSAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJvd3MgcGVyIHBhZ2UgKGRlZmF1bHQgMTApXG4gKiAgIG1heFZpc2libGVQYWdlQnV0dG9ucz17NX0gICAgICAgICAgICAgICAvLyBtYXggcGFnZSBudW1iZXIgYnV0dG9ucyBzaG93blxuICogICBzaG93QnV0dG9uTGFiZWxzPXtmYWxzZX0gICAgICAgICAgICAgICAgLy8gaGlkZSBGaXJzdC9QcmV2L05leHQvTGFzdCBsYWJlbHNcbiAqICAgc2hvd0ZpcnN0TGFzdEJ1dHRvbnM9e3RydWV9ICAgICAgICAgICAgIC8vIHNob3cgRmlyc3QvTGFzdCBidXR0b25zIChhdXRvIGlmID4gNSBwYWdlcylcbiAqXG4gKiDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbiAqIFJPVyBDT1VOVDpcbiAqIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuICpcbiAqICAgc2hvd1Jvd0NvdW50PXt0cnVlfSAgICAgICAgICAgICAgICAgICAgIC8vIHNob3cgcm93IGNvdW50IChkZWZhdWx0IHRydWUpXG4gKiAgIHJvd0NvdW50Qm9sZD17ZmFsc2V9ICAgICAgICAgICAgICAgICAgICAvLyBib2xkIHJvdyBjb3VudCB0ZXh0IChkZWZhdWx0IGZhbHNlKVxuICogICByb3dDb3VudFRleHQ9eyhzaG93biwgdG90YWwpID0+ICAgICAgICAgLy8gY3VzdG9tIHJvdyBjb3VudCB0ZXh0XG4gKiAgICAgYFNob3dpbmcgJHtzaG93bn0gb2YgJHt0b3RhbH0gaXRlbXNgXG4gKiAgIH1cbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZU1lbW8sIHVzZUVmZmVjdCwgdXNlQ2FsbGJhY2ssIHVzZVJlZiB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtcbiAgQm94LFxuICBCdXR0b24sXG4gIENoZWNrYm94LFxuICBDdXJyZW5jeUlucHV0LFxuICBEYXRlSW5wdXQsXG4gIEVtcHR5U3RhdGUsXG4gIEVycm9yU3RhdGUsXG4gIEZsZXgsXG4gIEljb24sXG4gIElucHV0LFxuICBMaW5rLFxuICBMb2FkaW5nU3Bpbm5lcixcbiAgTXVsdGlTZWxlY3QsXG4gIE51bWJlcklucHV0LFxuICBTZWFyY2hJbnB1dCxcbiAgU2VsZWN0LFxuICBTdGVwcGVySW5wdXQsXG4gIFRhYmxlLFxuICBUYWJsZUJvZHksXG4gIFRhYmxlQ2VsbCxcbiAgVGFibGVGb290ZXIsXG4gIFRhYmxlSGVhZCxcbiAgVGFibGVIZWFkZXIsXG4gIFRhYmxlUm93LFxuICBUYWcsXG4gIFRleHQsXG4gIFRleHRBcmVhLFxuICBUb2dnbGUsXG59IGZyb20gXCJAaHVic3BvdC91aS1leHRlbnNpb25zXCI7XG5cbi8vIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuLy8gSGVscGVyc1xuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG5cbmNvbnN0IGZvcm1hdERhdGVDaGlwID0gKGRhdGVPYmopID0+IHtcbiAgaWYgKCFkYXRlT2JqKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgeyB5ZWFyLCBtb250aCwgZGF0ZSB9ID0gZGF0ZU9iajtcbiAgcmV0dXJuIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KFwiZW4tVVNcIiwge1xuICAgIG1vbnRoOiBcInNob3J0XCIsIGRheTogXCJudW1lcmljXCIsIHllYXI6IFwibnVtZXJpY1wiLFxuICB9KS5mb3JtYXQobmV3IERhdGUoeWVhciwgbW9udGgsIGRhdGUpKTtcbn07XG5cbmNvbnN0IGRhdGVUb1RpbWVzdGFtcCA9IChkYXRlT2JqKSA9PiB7XG4gIGlmICghZGF0ZU9iaikgcmV0dXJuIG51bGw7XG4gIHJldHVybiBuZXcgRGF0ZShkYXRlT2JqLnllYXIsIGRhdGVPYmoubW9udGgsIGRhdGVPYmouZGF0ZSkuZ2V0VGltZSgpO1xufTtcblxuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4vLyBJbnRlbGxpZ2VudCBhdXRvLXdpZHRoXG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcblxuY29uc3QgTkFSUk9XX0VESVRfVFlQRVMgPSBuZXcgU2V0KFtcImNoZWNrYm94XCIsIFwidG9nZ2xlXCJdKTtcblxuY29uc3QgREFURV9QQVRURVJOID0gL15cXGR7NH1bLS9dXFxkezJ9Wy0vXVxcZHsyfS87XG5jb25zdCBCT09MX1ZBTFVFUyA9IG5ldyBTZXQoW1widHJ1ZVwiLCBcImZhbHNlXCIsIFwieWVzXCIsIFwibm9cIiwgXCIwXCIsIFwiMVwiXSk7XG5cbmNvbnN0IGNvbXB1dGVBdXRvV2lkdGhzID0gKGNvbHVtbnMsIGRhdGEpID0+IHtcbiAgaWYgKCFkYXRhIHx8IGRhdGEubGVuZ3RoID09PSAwKSByZXR1cm4ge307XG5cbiAgY29uc3Qgc2FtcGxlID0gZGF0YS5zbGljZSgwLCA1MCk7IC8vIGFuYWx5emUgdXAgdG8gNTAgcm93c1xuICBjb25zdCByZXN1bHRzID0ge307XG5cbiAgY29sdW1ucy5mb3JFYWNoKChjb2wpID0+IHtcbiAgICAvLyBTa2lwIGNvbHVtbnMgd2l0aCBib3RoIGV4cGxpY2l0IHdpZHRocyBzZXRcbiAgICBpZiAoY29sLndpZHRoICYmIGNvbC5jZWxsV2lkdGgpIHJldHVybjtcblxuICAgIGNvbnN0IHZhbHVlcyA9IHNhbXBsZS5tYXAoKHJvdykgPT4gcm93W2NvbC5maWVsZF0pLmZpbHRlcigodikgPT4gdiAhPSBudWxsKTtcbiAgICBjb25zdCBzdHJpbmdzID0gdmFsdWVzLm1hcCgodikgPT4gU3RyaW5nKHYpKTtcblxuICAgIGxldCB3aWR0aEhpbnQgPSBudWxsOyAvLyBcIm1pblwiIHwgXCJhdXRvXCJcbiAgICBsZXQgY2VsbFdpZHRoSGludCA9IG51bGw7XG5cbiAgICAvLyAxLiBFZGl0IHR5cGUgaGludHNcbiAgICBpZiAoY29sLmVkaXRhYmxlICYmIGNvbC5lZGl0VHlwZSAmJiBOQVJST1dfRURJVF9UWVBFUy5oYXMoY29sLmVkaXRUeXBlKSkge1xuICAgICAgY2VsbFdpZHRoSGludCA9IFwibWluXCI7XG4gICAgfVxuXG4gICAgLy8gMi4gQ29udGVudCBhbmFseXNpc1xuICAgIGlmIChzdHJpbmdzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGxlbmd0aHMgPSBzdHJpbmdzLm1hcCgocykgPT4gcy5sZW5ndGgpO1xuICAgICAgY29uc3QgbWF4TGVuID0gTWF0aC5tYXgoLi4ubGVuZ3Rocyk7XG4gICAgICBjb25zdCB1bmlxdWVDb3VudCA9IG5ldyBTZXQoc3RyaW5ncykuc2l6ZTtcblxuICAgICAgLy8gQm9vbGVhbi1saWtlIHZhbHVlcyDihpIgbWluXG4gICAgICBpZiAodmFsdWVzLmV2ZXJ5KCh2KSA9PiB0eXBlb2YgdiA9PT0gXCJib29sZWFuXCIpIHx8XG4gICAgICAgIHN0cmluZ3MuZXZlcnkoKHMpID0+IEJPT0xfVkFMVUVTLmhhcyhzLnRvTG93ZXJDYXNlKCkpKSkge1xuICAgICAgICB3aWR0aEhpbnQgPSB3aWR0aEhpbnQgfHwgXCJtaW5cIjtcbiAgICAgICAgY2VsbFdpZHRoSGludCA9IGNlbGxXaWR0aEhpbnQgfHwgXCJtaW5cIjtcbiAgICAgIH1cbiAgICAgIC8vIERhdGUtbGlrZSB2YWx1ZXMg4oaSIGF1dG8gKHJlbmRlcmVkIGRhdGVzIGFyZSBvZnRlbiBsb25nZXIgdGhhbiByYXcgSVNPKVxuICAgICAgZWxzZSBpZiAoc3RyaW5ncy5ldmVyeSgocykgPT4gREFURV9QQVRURVJOLnRlc3QocykpKSB7XG4gICAgICAgIHdpZHRoSGludCA9IHdpZHRoSGludCB8fCBcIm1pblwiO1xuICAgICAgICBjZWxsV2lkdGhIaW50ID0gY2VsbFdpZHRoSGludCB8fCBcImF1dG9cIjtcbiAgICAgIH1cbiAgICAgIC8vIFB1cmUgbnVtYmVycyDihpIgYXV0byAoaGVhZGVyIFwibWluXCIgY29uc3RyYWlucyB0aGUgd2hvbGUgY29sdW1uIHRvbyBtdWNoIGZvciBpbnB1dHMpXG4gICAgICBlbHNlIGlmICh2YWx1ZXMuZXZlcnkoKHYpID0+IHR5cGVvZiB2ID09PSBcIm51bWJlclwiKSkge1xuICAgICAgICB3aWR0aEhpbnQgPSB3aWR0aEhpbnQgfHwgXCJhdXRvXCI7XG4gICAgICAgIGNlbGxXaWR0aEhpbnQgPSBjZWxsV2lkdGhIaW50IHx8IFwiYXV0b1wiO1xuICAgICAgfVxuICAgICAgLy8gU21hbGwgZW51bS1saWtlIChmZXcgdW5pcXVlIHZhbHVlcywgc2hvcnQgc3RyaW5ncykg4oaSIG1pblxuICAgICAgZWxzZSBpZiAodW5pcXVlQ291bnQgPD0gNSAmJiBtYXhMZW4gPD0gMTUpIHtcbiAgICAgICAgd2lkdGhIaW50ID0gd2lkdGhIaW50IHx8IFwibWluXCI7XG4gICAgICAgIGNlbGxXaWR0aEhpbnQgPSBjZWxsV2lkdGhIaW50IHx8IFwiYXV0b1wiO1xuICAgICAgfVxuICAgICAgLy8gRXZlcnl0aGluZyBlbHNlICh0ZXh0KSDihpIgYXV0bywgbGV0IHRoZSBicm93c2VyIGRpc3RyaWJ1dGUgZXZlbmx5XG4gICAgICBlbHNlIHtcbiAgICAgICAgd2lkdGhIaW50ID0gd2lkdGhIaW50IHx8IFwiYXV0b1wiO1xuICAgICAgICBjZWxsV2lkdGhIaW50ID0gY2VsbFdpZHRoSGludCB8fCBcImF1dG9cIjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFZGl0YWJsZSBjb2x1bW5zIChleGNlcHQgY2hlY2tib3gvdG9nZ2xlKSBuZWVkIHJvb20gZm9yIGlucHV0IGNvbXBvbmVudHMg4oCUXG4gICAgLy8gbmV2ZXIgY29uc3RyYWluIHRoZSBoZWFkZXIgdG8gXCJtaW5cIiBvciB0aGUgaW5wdXQgd2lsbCBnZXQgc3F1ZWV6ZWRcbiAgICBpZiAoY29sLmVkaXRhYmxlICYmICFOQVJST1dfRURJVF9UWVBFUy5oYXMoY29sLmVkaXRUeXBlKSAmJiB3aWR0aEhpbnQgPT09IFwibWluXCIpIHtcbiAgICAgIHdpZHRoSGludCA9IFwiYXV0b1wiO1xuICAgIH1cblxuICAgIHJlc3VsdHNbY29sLmZpZWxkXSA9IHtcbiAgICAgIHdpZHRoOiB3aWR0aEhpbnQgfHwgXCJhdXRvXCIsXG4gICAgICBjZWxsV2lkdGg6IGNlbGxXaWR0aEhpbnQgfHwgXCJhdXRvXCIsXG4gICAgfTtcbiAgfSk7XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59O1xuXG5jb25zdCBnZXRFbXB0eUZpbHRlclZhbHVlID0gKGZpbHRlcikgPT4ge1xuICBjb25zdCB0eXBlID0gZmlsdGVyLnR5cGUgfHwgXCJzZWxlY3RcIjtcbiAgaWYgKHR5cGUgPT09IFwibXVsdGlzZWxlY3RcIikgcmV0dXJuIFtdO1xuICBpZiAodHlwZSA9PT0gXCJkYXRlUmFuZ2VcIikgcmV0dXJuIHsgZnJvbTogbnVsbCwgdG86IG51bGwgfTtcbiAgcmV0dXJuIFwiXCI7XG59O1xuXG5jb25zdCBCT09MRUFOX1NFTEVDVF9PUFRJT05TID0gW1xuICB7IGxhYmVsOiBcIlllc1wiLCB2YWx1ZTogdHJ1ZSB9LFxuICB7IGxhYmVsOiBcIk5vXCIsIHZhbHVlOiBmYWxzZSB9LFxuXTtcblxuY29uc3QgcmVzb2x2ZUVkaXRPcHRpb25zID0gKGNvbCwgZGF0YSkgPT4ge1xuICBpZiAoY29sLmVkaXRPcHRpb25zICYmIGNvbC5lZGl0T3B0aW9ucy5sZW5ndGggPiAwKSByZXR1cm4gY29sLmVkaXRPcHRpb25zO1xuICAvLyBBdXRvLWRldGVjdCBib29sZWFuIGZpZWxkcyBhbmQgZ2VuZXJhdGUgWWVzL05vIG9wdGlvbnNcbiAgY29uc3Qgc2FtcGxlID0gZGF0YS5maW5kKChyb3cpID0+IHJvd1tjb2wuZmllbGRdICE9IG51bGwpO1xuICBpZiAoc2FtcGxlICYmIHR5cGVvZiBzYW1wbGVbY29sLmZpZWxkXSA9PT0gXCJib29sZWFuXCIpIHJldHVybiBCT09MRUFOX1NFTEVDVF9PUFRJT05TO1xuICByZXR1cm4gW107XG59O1xuXG5jb25zdCBpc0ZpbHRlckFjdGl2ZSA9IChmaWx0ZXIsIHZhbHVlKSA9PiB7XG4gIGNvbnN0IHR5cGUgPSBmaWx0ZXIudHlwZSB8fCBcInNlbGVjdFwiO1xuICBpZiAodHlwZSA9PT0gXCJtdWx0aXNlbGVjdFwiKSByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID4gMDtcbiAgaWYgKHR5cGUgPT09IFwiZGF0ZVJhbmdlXCIpIHJldHVybiB2YWx1ZSAmJiAodmFsdWUuZnJvbSB8fCB2YWx1ZS50byk7XG4gIHJldHVybiAhIXZhbHVlO1xufTtcblxuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4vLyBDb21wb25lbnRcbi8vIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuXG5leHBvcnQgY29uc3QgRGF0YVRhYmxlID0gKHtcbiAgLy8gRGF0YVxuICBkYXRhLFxuICBjb2x1bW5zLFxuICByZW5kZXJSb3csXG5cbiAgLy8gU2VhcmNoXG4gIHNlYXJjaEZpZWxkcyA9IFtdLFxuICBzZWFyY2hQbGFjZWhvbGRlciA9IFwiU2VhcmNoLi4uXCIsXG5cbiAgLy8gRmlsdGVyc1xuICBmaWx0ZXJzID0gW10sXG5cbiAgLy8gUGFnaW5hdGlvblxuICBwYWdlU2l6ZSA9IDEwLFxuICBtYXhWaXNpYmxlUGFnZUJ1dHRvbnMsICAgICAgICAvLyBtYXggcGFnZSBudW1iZXIgYnV0dG9ucyB0byBzaG93XG4gIHNob3dCdXR0b25MYWJlbHMgPSB0cnVlLCAgICAgIC8vIHNob3cgRmlyc3QvUHJldi9OZXh0L0xhc3QgdGV4dCBsYWJlbHNcbiAgc2hvd0ZpcnN0TGFzdEJ1dHRvbnMsICAgICAgICAgLy8gc2hvdyBGaXJzdC9MYXN0IHBhZ2UgYnV0dG9ucyAoZGVmYXVsdDogYXV0byB3aGVuIHBhZ2VDb3VudCA+IDUpXG5cbiAgLy8gUm93IGNvdW50XG4gIHNob3dSb3dDb3VudCA9IHRydWUsICAgICAgICAgIC8vIHNob3cgXCJYIHJlY29yZHNcIiAvIFwiWCBvZiBZIHJlY29yZHNcIiB0ZXh0XG4gIHJvd0NvdW50Qm9sZCA9IGZhbHNlLCAgICAgICAgIC8vIGJvbGQgdGhlIHJvdyBjb3VudCB0ZXh0XG4gIHJvd0NvdW50VGV4dCwgICAgICAgICAgICAgICAgIC8vIGN1c3RvbSBmb3JtYXR0ZXI6IChkaXNwbGF5Q291bnQsIHRvdGFsQ291bnQpID0+IHN0cmluZ1xuXG4gIC8vIFRhYmxlIGFwcGVhcmFuY2VcbiAgYm9yZGVyZWQgPSB0cnVlLCAgICAgICAgICAgICAgLy8gc2hvdyB0YWJsZSBib3JkZXJzXG4gIGZsdXNoID0gdHJ1ZSwgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBib3R0b20gbWFyZ2luXG5cbiAgLy8gU29ydGluZ1xuICBkZWZhdWx0U29ydCA9IHt9LFxuXG4gIC8vIEdyb3VwaW5nXG4gIGdyb3VwQnksXG5cbiAgLy8gRm9vdGVyXG4gIGZvb3RlcixcblxuICAvLyBFbXB0eSBzdGF0ZVxuICBlbXB0eVRpdGxlID0gXCJObyByZXN1bHRzIGZvdW5kXCIsXG4gIGVtcHR5TWVzc2FnZSA9IFwiTm8gcmVjb3JkcyBtYXRjaCB5b3VyIHNlYXJjaCBvciBmaWx0ZXIgY3JpdGVyaWEuXCIsXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gU2VydmVyLXNpZGUgbW9kZVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBzZXJ2ZXJTaWRlID0gZmFsc2UsXG4gIGxvYWRpbmcgPSBmYWxzZSwgICAgICAgIC8vIHNob3cgbG9hZGluZyBzcGlubmVyIG92ZXIgdGhlIHRhYmxlXG4gIGVycm9yLCAgICAgICAgICAgICAgICAgIC8vIGVycm9yIG1lc3NhZ2Ugc3RyaW5nIG9yIGJvb2xlYW4g4oCUIHNob3dzIEVycm9yU3RhdGVcbiAgdG90YWxDb3VudCwgICAgICAgICAgICAgLy8gc2VydmVyIHRvdGFsIChzZXJ2ZXItc2lkZSBvbmx5KVxuICBwYWdlOiBleHRlcm5hbFBhZ2UsICAgICAvLyBjb250cm9sbGVkIHBhZ2UgKHNlcnZlci1zaWRlIG9ubHkpXG4gIHNlYXJjaFZhbHVlLCAgICAgICAgICAgIC8vIGNvbnRyb2xsZWQgc2VhcmNoIHRlcm0gKHNlcnZlci1zaWRlIG9ubHkpXG4gIGZpbHRlclZhbHVlczogZXh0ZXJuYWxGaWx0ZXJWYWx1ZXMsIC8vIGNvbnRyb2xsZWQgZmlsdGVyIHZhbHVlcyAoc2VydmVyLXNpZGUgb25seSlcbiAgc29ydDogZXh0ZXJuYWxTb3J0LCAgICAgLy8gY29udHJvbGxlZCBzb3J0IHN0YXRlLCBlLmcuIHsgZmllbGQ6IFwiYXNjZW5kaW5nXCIgfVxuICBzZWFyY2hEZWJvdW5jZSA9IDAsICAgICAvLyBtcyB0byBkZWJvdW5jZSBvblNlYXJjaENoYW5nZSBjYWxsYmFja1xuICByZXNldFBhZ2VPbkNoYW5nZSA9IHRydWUsIC8vIGF1dG8tcmVzZXQgdG8gcGFnZSAxIG9uIHNlYXJjaC9maWx0ZXIvc29ydCBjaGFuZ2VcbiAgb25TZWFyY2hDaGFuZ2UsICAgICAgICAgLy8gKHNlYXJjaFRlcm0pID0+IHZvaWRcbiAgb25GaWx0ZXJDaGFuZ2UsICAgICAgICAgLy8gKGZpbHRlclZhbHVlcykgPT4gdm9pZFxuICBvblNvcnRDaGFuZ2UsICAgICAgICAgICAvLyAoZmllbGQsIGRpcmVjdGlvbikgPT4gdm9pZFxuICBvblBhZ2VDaGFuZ2UsICAgICAgICAgICAvLyAocGFnZSkgPT4gdm9pZFxuICBvblBhcmFtc0NoYW5nZSwgICAgICAgICAvLyAoeyBzZWFyY2gsIGZpbHRlcnMsIHNvcnQsIHBhZ2UgfSkgPT4gdm9pZFxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJvdyBzZWxlY3Rpb25cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgc2VsZWN0YWJsZSA9IGZhbHNlLFxuICByb3dJZEZpZWxkID0gXCJpZFwiLCAgICAgLy8gZmllbGQgbmFtZSB1c2VkIGFzIHVuaXF1ZSByb3cgaWRlbnRpZmllclxuICBvblNlbGVjdGlvbkNoYW5nZSwgICAgIC8vIChzZWxlY3RlZElkc1tdKSA9PiB2b2lkXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW5saW5lIGVkaXRpbmdcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZWRpdE1vZGUsICAgICAgICAgICAgICAvLyBcImRpc2NyZXRlXCIgKGNsaWNrLXRvLWVkaXQpIHwgXCJpbmxpbmVcIiAoYWx3YXlzIHNob3cgaW5wdXRzKVxuICBvblJvd0VkaXQsICAgICAgICAgICAgIC8vIChyb3csIGZpZWxkLCBuZXdWYWx1ZSkgPT4gdm9pZFxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEF1dG8td2lkdGhcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgYXV0b1dpZHRoID0gdHJ1ZSwgICAgICAvLyBhdXRvLWNvbXB1dGUgY29sdW1uIHdpZHRocyBmcm9tIGNvbnRlbnQgYW5hbHlzaXNcbn0pID0+IHtcbiAgLy8gQnVpbGQgaW5pdGlhbCBzb3J0IHN0YXRlXG4gIGNvbnN0IGluaXRpYWxTb3J0U3RhdGUgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBzdGF0ZSA9IHt9O1xuICAgIGNvbHVtbnMuZm9yRWFjaCgoY29sKSA9PiB7XG4gICAgICBpZiAoY29sLnNvcnRhYmxlKSB7XG4gICAgICAgIHN0YXRlW2NvbC5maWVsZF0gPSBkZWZhdWx0U29ydFtjb2wuZmllbGRdIHx8IFwibm9uZVwiO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfSwgW2NvbHVtbnMsIGRlZmF1bHRTb3J0XSk7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEludGVybmFsIHN0YXRlICh1c2VkIGluIGNsaWVudC1zaWRlIG1vZGU7IGFsc28gZHJpdmVzIFVJIGluIHNlcnZlci1zaWRlKVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY29uc3QgW2ludGVybmFsU2VhcmNoVGVybSwgc2V0SW50ZXJuYWxTZWFyY2hUZXJtXSA9IHVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBbaW50ZXJuYWxGaWx0ZXJWYWx1ZXMsIHNldEludGVybmFsRmlsdGVyVmFsdWVzXSA9IHVzZVN0YXRlKCgpID0+IHtcbiAgICBjb25zdCBpbml0ID0ge307XG4gICAgZmlsdGVycy5mb3JFYWNoKChmKSA9PiB7IGluaXRbZi5uYW1lXSA9IGdldEVtcHR5RmlsdGVyVmFsdWUoZik7IH0pO1xuICAgIHJldHVybiBpbml0O1xuICB9KTtcbiAgY29uc3QgW2ludGVybmFsU29ydFN0YXRlLCBzZXRJbnRlcm5hbFNvcnRTdGF0ZV0gPSB1c2VTdGF0ZShpbml0aWFsU29ydFN0YXRlKTtcbiAgY29uc3QgW2N1cnJlbnRQYWdlLCBzZXRDdXJyZW50UGFnZV0gPSB1c2VTdGF0ZSgxKTtcbiAgY29uc3QgW3Nob3dNb3JlRmlsdGVycywgc2V0U2hvd01vcmVGaWx0ZXJzXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICAvLyBSZXNvbHZlIGNvbnRyb2xsZWQgdnMgaW50ZXJuYWwgc3RhdGVcbiAgY29uc3Qgc2VhcmNoVGVybSA9IHNlcnZlclNpZGUgJiYgc2VhcmNoVmFsdWUgIT0gbnVsbCA/IHNlYXJjaFZhbHVlIDogaW50ZXJuYWxTZWFyY2hUZXJtO1xuICBjb25zdCBmaWx0ZXJWYWx1ZXMgPSBzZXJ2ZXJTaWRlICYmIGV4dGVybmFsRmlsdGVyVmFsdWVzICE9IG51bGwgPyBleHRlcm5hbEZpbHRlclZhbHVlcyA6IGludGVybmFsRmlsdGVyVmFsdWVzO1xuICBjb25zdCBzb3J0U3RhdGUgPSBzZXJ2ZXJTaWRlICYmIGV4dGVybmFsU29ydCAhPSBudWxsXG4gICAgPyAoKCkgPT4ge1xuICAgICAgY29uc3QgcyA9IHt9O1xuICAgICAgY29sdW1ucy5mb3JFYWNoKChjb2wpID0+IHsgaWYgKGNvbC5zb3J0YWJsZSkgc1tjb2wuZmllbGRdID0gZXh0ZXJuYWxTb3J0W2NvbC5maWVsZF0gfHwgXCJub25lXCI7IH0pO1xuICAgICAgcmV0dXJuIHM7XG4gICAgfSkoKVxuICAgIDogaW50ZXJuYWxTb3J0U3RhdGU7XG5cbiAgLy8gSW4gc2VydmVyLXNpZGUgbW9kZSwgdXNlIGV4dGVybmFsIHBhZ2UgaWYgcHJvdmlkZWRcbiAgY29uc3QgYWN0aXZlUGFnZSA9IHNlcnZlclNpZGUgJiYgZXh0ZXJuYWxQYWdlICE9IG51bGwgPyBleHRlcm5hbFBhZ2UgOiBjdXJyZW50UGFnZTtcblxuICAvLyBSZXNldCBwYWdlIG9uIGNsaWVudC1zaWRlIGZpbHRlci9zb3J0L3NlYXJjaCBjaGFuZ2VcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXNlcnZlclNpZGUpIHNldEN1cnJlbnRQYWdlKDEpO1xuICB9LCBbaW50ZXJuYWxTZWFyY2hUZXJtLCBpbnRlcm5hbEZpbHRlclZhbHVlcywgaW50ZXJuYWxTb3J0U3RhdGUsIHNlcnZlclNpZGVdKTtcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gU2VhcmNoIGRlYm91bmNlXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBjb25zdCBkZWJvdW5jZVJlZiA9IHVzZVJlZihudWxsKTtcblxuICBjb25zdCBmaXJlU2VhcmNoQ2FsbGJhY2sgPSB1c2VDYWxsYmFjaygodGVybSkgPT4ge1xuICAgIGlmIChzZXJ2ZXJTaWRlICYmIG9uU2VhcmNoQ2hhbmdlKSBvblNlYXJjaENoYW5nZSh0ZXJtKTtcbiAgfSwgW3NlcnZlclNpZGUsIG9uU2VhcmNoQ2hhbmdlXSk7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFVuaWZpZWQgcGFyYW1zIGhlbHBlclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY29uc3QgZmlyZVBhcmFtc0NoYW5nZSA9IHVzZUNhbGxiYWNrKChvdmVycmlkZXMpID0+IHtcbiAgICBpZiAoIW9uUGFyYW1zQ2hhbmdlKSByZXR1cm47XG4gICAgY29uc3QgYWN0aXZlU29ydEZpZWxkID0gT2JqZWN0LmtleXMob3ZlcnJpZGVzLnNvcnQgfHwgc29ydFN0YXRlKS5maW5kKFxuICAgICAgKGspID0+IChvdmVycmlkZXMuc29ydCB8fCBzb3J0U3RhdGUpW2tdICE9PSBcIm5vbmVcIlxuICAgICk7XG4gICAgb25QYXJhbXNDaGFuZ2Uoe1xuICAgICAgc2VhcmNoOiBvdmVycmlkZXMuc2VhcmNoICE9IG51bGwgPyBvdmVycmlkZXMuc2VhcmNoIDogc2VhcmNoVGVybSxcbiAgICAgIGZpbHRlcnM6IG92ZXJyaWRlcy5maWx0ZXJzICE9IG51bGwgPyBvdmVycmlkZXMuZmlsdGVycyA6IGZpbHRlclZhbHVlcyxcbiAgICAgIHNvcnQ6IGFjdGl2ZVNvcnRGaWVsZFxuICAgICAgICA/IHsgZmllbGQ6IGFjdGl2ZVNvcnRGaWVsZCwgZGlyZWN0aW9uOiAob3ZlcnJpZGVzLnNvcnQgfHwgc29ydFN0YXRlKVthY3RpdmVTb3J0RmllbGRdIH1cbiAgICAgICAgOiBudWxsLFxuICAgICAgcGFnZTogb3ZlcnJpZGVzLnBhZ2UgIT0gbnVsbCA/IG92ZXJyaWRlcy5wYWdlIDogYWN0aXZlUGFnZSxcbiAgICB9KTtcbiAgfSwgW29uUGFyYW1zQ2hhbmdlLCBzZWFyY2hUZXJtLCBmaWx0ZXJWYWx1ZXMsIHNvcnRTdGF0ZSwgYWN0aXZlUGFnZV0pO1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBIYW5kbGVycyDigJQgbm90aWZ5IHBhcmVudCBpbiBzZXJ2ZXItc2lkZSBtb2RlXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBIZWxwZXI6IHJlc2V0IHBhZ2UgdG8gMSBvbiBzZWFyY2gvZmlsdGVyL3NvcnQgY2hhbmdlc1xuICBjb25zdCByZXNldFBhZ2UgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaWYgKHJlc2V0UGFnZU9uQ2hhbmdlKSB7XG4gICAgICBzZXRDdXJyZW50UGFnZSgxKTtcbiAgICAgIGlmIChzZXJ2ZXJTaWRlICYmIG9uUGFnZUNoYW5nZSkgb25QYWdlQ2hhbmdlKDEpO1xuICAgIH1cbiAgfSwgW3Jlc2V0UGFnZU9uQ2hhbmdlLCBzZXJ2ZXJTaWRlLCBvblBhZ2VDaGFuZ2VdKTtcblxuICBjb25zdCBoYW5kbGVTZWFyY2hDaGFuZ2UgPSB1c2VDYWxsYmFjaygodGVybSkgPT4ge1xuICAgIHNldEludGVybmFsU2VhcmNoVGVybSh0ZXJtKTtcbiAgICByZXNldFBhZ2UoKTtcbiAgICBpZiAoc2VhcmNoRGVib3VuY2UgPiAwKSB7XG4gICAgICBpZiAoZGVib3VuY2VSZWYuY3VycmVudCkgY2xlYXJUaW1lb3V0KGRlYm91bmNlUmVmLmN1cnJlbnQpO1xuICAgICAgZGVib3VuY2VSZWYuY3VycmVudCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBmaXJlU2VhcmNoQ2FsbGJhY2sodGVybSk7XG4gICAgICAgIGZpcmVQYXJhbXNDaGFuZ2UoeyBzZWFyY2g6IHRlcm0sIHBhZ2U6IHJlc2V0UGFnZU9uQ2hhbmdlID8gMSA6IHVuZGVmaW5lZCB9KTtcbiAgICAgIH0sIHNlYXJjaERlYm91bmNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlyZVNlYXJjaENhbGxiYWNrKHRlcm0pO1xuICAgICAgZmlyZVBhcmFtc0NoYW5nZSh7IHNlYXJjaDogdGVybSwgcGFnZTogcmVzZXRQYWdlT25DaGFuZ2UgPyAxIDogdW5kZWZpbmVkIH0pO1xuICAgIH1cbiAgfSwgW3NlYXJjaERlYm91bmNlLCBmaXJlU2VhcmNoQ2FsbGJhY2ssIGZpcmVQYXJhbXNDaGFuZ2UsIHJlc2V0UGFnZSwgcmVzZXRQYWdlT25DaGFuZ2VdKTtcblxuICAvLyBDbGVhbiB1cCBkZWJvdW5jZSB0aW1lciBvbiB1bm1vdW50XG4gIHVzZUVmZmVjdCgoKSA9PiAoKSA9PiB7IGlmIChkZWJvdW5jZVJlZi5jdXJyZW50KSBjbGVhclRpbWVvdXQoZGVib3VuY2VSZWYuY3VycmVudCk7IH0sIFtdKTtcblxuICBjb25zdCBoYW5kbGVGaWx0ZXJDaGFuZ2UgPSB1c2VDYWxsYmFjaygobmFtZSwgdmFsdWUpID0+IHtcbiAgICBzZXRJbnRlcm5hbEZpbHRlclZhbHVlcygocHJldikgPT4ge1xuICAgICAgY29uc3QgbmV4dCA9IHsgLi4ucHJldiwgW25hbWVdOiB2YWx1ZSB9O1xuICAgICAgaWYgKHNlcnZlclNpZGUgJiYgb25GaWx0ZXJDaGFuZ2UpIG9uRmlsdGVyQ2hhbmdlKG5leHQpO1xuICAgICAgcmVzZXRQYWdlKCk7XG4gICAgICBmaXJlUGFyYW1zQ2hhbmdlKHsgZmlsdGVyczogbmV4dCwgcGFnZTogcmVzZXRQYWdlT25DaGFuZ2UgPyAxIDogdW5kZWZpbmVkIH0pO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfSk7XG4gIH0sIFtzZXJ2ZXJTaWRlLCBvbkZpbHRlckNoYW5nZSwgZmlyZVBhcmFtc0NoYW5nZSwgcmVzZXRQYWdlLCByZXNldFBhZ2VPbkNoYW5nZV0pO1xuXG4gIGNvbnN0IGhhbmRsZVNvcnRDaGFuZ2UgPSB1c2VDYWxsYmFjaygoZmllbGQpID0+IHtcbiAgICBjb25zdCBjdXJyZW50ID0gKHNlcnZlclNpZGUgJiYgZXh0ZXJuYWxTb3J0ID8gZXh0ZXJuYWxTb3J0W2ZpZWxkXSA6IGludGVybmFsU29ydFN0YXRlW2ZpZWxkXSkgfHwgXCJub25lXCI7XG4gICAgY29uc3QgbmV4dERpcmVjdGlvbiA9XG4gICAgICBjdXJyZW50ID09PSBcIm5vbmVcIiA/IFwiYXNjZW5kaW5nXCIgOlxuICAgICAgICBjdXJyZW50ID09PSBcImFzY2VuZGluZ1wiID8gXCJkZXNjZW5kaW5nXCIgOiBcIm5vbmVcIjtcblxuICAgIGNvbnN0IHJlc2V0ID0ge307XG4gICAgT2JqZWN0LmtleXMoaW50ZXJuYWxTb3J0U3RhdGUpLmZvckVhY2goKGspID0+IHsgcmVzZXRba10gPSBcIm5vbmVcIjsgfSk7XG4gICAgY29uc3QgbmV4dCA9IHsgLi4ucmVzZXQsIFtmaWVsZF06IG5leHREaXJlY3Rpb24gfTtcbiAgICBzZXRJbnRlcm5hbFNvcnRTdGF0ZShuZXh0KTtcbiAgICBpZiAoc2VydmVyU2lkZSAmJiBvblNvcnRDaGFuZ2UpIG9uU29ydENoYW5nZShmaWVsZCwgbmV4dERpcmVjdGlvbik7XG4gICAgcmVzZXRQYWdlKCk7XG4gICAgZmlyZVBhcmFtc0NoYW5nZSh7IHNvcnQ6IG5leHQsIHBhZ2U6IHJlc2V0UGFnZU9uQ2hhbmdlID8gMSA6IHVuZGVmaW5lZCB9KTtcbiAgfSwgW2ludGVybmFsU29ydFN0YXRlLCBzZXJ2ZXJTaWRlLCBleHRlcm5hbFNvcnQsIG9uU29ydENoYW5nZSwgZmlyZVBhcmFtc0NoYW5nZSwgcmVzZXRQYWdlLCByZXNldFBhZ2VPbkNoYW5nZV0pO1xuXG4gIGNvbnN0IGhhbmRsZVBhZ2VDaGFuZ2UgPSB1c2VDYWxsYmFjaygocGFnZSkgPT4ge1xuICAgIHNldEN1cnJlbnRQYWdlKHBhZ2UpO1xuICAgIGlmIChzZXJ2ZXJTaWRlICYmIG9uUGFnZUNoYW5nZSkgb25QYWdlQ2hhbmdlKHBhZ2UpO1xuICAgIGZpcmVQYXJhbXNDaGFuZ2UoeyBwYWdlIH0pO1xuICB9LCBbc2VydmVyU2lkZSwgb25QYWdlQ2hhbmdlLCBmaXJlUGFyYW1zQ2hhbmdlXSk7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENsaWVudC1zaWRlOiBGaWx0ZXJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGNvbnN0IGZpbHRlcmVkRGF0YSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChzZXJ2ZXJTaWRlKSByZXR1cm4gZGF0YTsgLy8gc2VydmVyIGFscmVhZHkgZmlsdGVyZWRcblxuICAgIGxldCByZXN1bHQgPSBkYXRhO1xuXG4gICAgLy8gQXBwbHkgZWFjaCBmaWx0ZXJcbiAgICBmaWx0ZXJzLmZvckVhY2goKGZpbHRlcikgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBmaWx0ZXJWYWx1ZXNbZmlsdGVyLm5hbWVdO1xuICAgICAgaWYgKCFpc0ZpbHRlckFjdGl2ZShmaWx0ZXIsIHZhbHVlKSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCB0eXBlID0gZmlsdGVyLnR5cGUgfHwgXCJzZWxlY3RcIjtcblxuICAgICAgaWYgKGZpbHRlci5maWx0ZXJGbikge1xuICAgICAgICByZXN1bHQgPSByZXN1bHQuZmlsdGVyKChyb3cpID0+IGZpbHRlci5maWx0ZXJGbihyb3csIHZhbHVlKSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwibXVsdGlzZWxlY3RcIikge1xuICAgICAgICAvLyBcIkFueSBvZlwiIG1hdGNoaW5nXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdC5maWx0ZXIoKHJvdykgPT4gdmFsdWUuaW5jbHVkZXMocm93W2ZpbHRlci5uYW1lXSkpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcImRhdGVSYW5nZVwiKSB7XG4gICAgICAgIGNvbnN0IGZyb21UcyA9IGRhdGVUb1RpbWVzdGFtcCh2YWx1ZS5mcm9tKTtcbiAgICAgICAgY29uc3QgdG9UcyA9IHZhbHVlLnRvID8gZGF0ZVRvVGltZXN0YW1wKHZhbHVlLnRvKSArIDg2NDAwMDAwIC0gMSA6IG51bGw7IC8vIGVuZCBvZiBkYXlcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmZpbHRlcigocm93KSA9PiB7XG4gICAgICAgICAgY29uc3Qgcm93VHMgPSBuZXcgRGF0ZShyb3dbZmlsdGVyLm5hbWVdKS5nZXRUaW1lKCk7XG4gICAgICAgICAgaWYgKGZyb21UcyAmJiByb3dUcyA8IGZyb21UcykgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIGlmICh0b1RzICYmIHJvd1RzID4gdG9UcykgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERlZmF1bHQ6IGV4YWN0IG1hdGNoXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdC5maWx0ZXIoKHJvdykgPT4gcm93W2ZpbHRlci5uYW1lXSA9PT0gdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU2VhcmNoIGFjcm9zcyBzZWFyY2hGaWVsZHNcbiAgICBpZiAoc2VhcmNoVGVybSAmJiBzZWFyY2hGaWVsZHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgdGVybSA9IHNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5maWx0ZXIoKHJvdykgPT5cbiAgICAgICAgc2VhcmNoRmllbGRzLnNvbWUoKGZpZWxkKSA9PiB7XG4gICAgICAgICAgY29uc3QgdmFsID0gcm93W2ZpZWxkXTtcbiAgICAgICAgICByZXR1cm4gdmFsICYmIFN0cmluZyh2YWwpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGVybSk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sIFtkYXRhLCBmaWx0ZXJWYWx1ZXMsIHNlYXJjaFRlcm0sIGZpbHRlcnMsIHNlYXJjaEZpZWxkcywgc2VydmVyU2lkZV0pO1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDbGllbnQtc2lkZTogU29ydFxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY29uc3Qgc29ydGVkRGF0YSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChzZXJ2ZXJTaWRlKSByZXR1cm4gZmlsdGVyZWREYXRhOyAvLyBzZXJ2ZXIgYWxyZWFkeSBzb3J0ZWRcblxuICAgIGNvbnN0IGFjdGl2ZUZpZWxkID0gT2JqZWN0LmtleXMoc29ydFN0YXRlKS5maW5kKChrKSA9PiBzb3J0U3RhdGVba10gIT09IFwibm9uZVwiKTtcbiAgICBpZiAoIWFjdGl2ZUZpZWxkKSByZXR1cm4gZmlsdGVyZWREYXRhO1xuXG4gICAgcmV0dXJuIFsuLi5maWx0ZXJlZERhdGFdLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGNvbnN0IGRpciA9IHNvcnRTdGF0ZVthY3RpdmVGaWVsZF0gPT09IFwiYXNjZW5kaW5nXCIgPyAxIDogLTE7XG4gICAgICBjb25zdCBhVmFsID0gYVthY3RpdmVGaWVsZF07XG4gICAgICBjb25zdCBiVmFsID0gYlthY3RpdmVGaWVsZF07XG4gICAgICBpZiAoYVZhbCA9PSBudWxsICYmIGJWYWwgPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgICBpZiAoYVZhbCA9PSBudWxsKSByZXR1cm4gMTtcbiAgICAgIGlmIChiVmFsID09IG51bGwpIHJldHVybiAtMTtcbiAgICAgIGlmIChhVmFsIDwgYlZhbCkgcmV0dXJuIC1kaXI7XG4gICAgICBpZiAoYVZhbCA+IGJWYWwpIHJldHVybiBkaXI7XG4gICAgICByZXR1cm4gMDtcbiAgICB9KTtcbiAgfSwgW2ZpbHRlcmVkRGF0YSwgc29ydFN0YXRlLCBzZXJ2ZXJTaWRlXSk7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENsaWVudC1zaWRlOiBHcm91cCAob3B0aW9uYWwpXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBjb25zdCBncm91cGVkRGF0YSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghZ3JvdXBCeSkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBzb3VyY2UgPSBzZXJ2ZXJTaWRlID8gZGF0YSA6IHNvcnRlZERhdGE7XG4gICAgY29uc3QgZ3JvdXBzID0ge307XG4gICAgc291cmNlLmZvckVhY2goKHJvdykgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gcm93W2dyb3VwQnkuZmllbGRdID8/IFwiLS1cIjtcbiAgICAgIGlmICghZ3JvdXBzW2tleV0pIGdyb3Vwc1trZXldID0gW107XG4gICAgICBncm91cHNba2V5XS5wdXNoKHJvdyk7XG4gICAgfSk7XG5cbiAgICBsZXQgZ3JvdXBLZXlzID0gT2JqZWN0LmtleXMoZ3JvdXBzKTtcbiAgICBpZiAoZ3JvdXBCeS5zb3J0KSB7XG4gICAgICBpZiAodHlwZW9mIGdyb3VwQnkuc29ydCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGdyb3VwS2V5cy5zb3J0KGdyb3VwQnkuc29ydCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkaXIgPSBncm91cEJ5LnNvcnQgPT09IFwiZGVzY1wiID8gLTEgOiAxO1xuICAgICAgICBncm91cEtleXMuc29ydCgoYSwgYikgPT4gKGEgPCBiID8gLWRpciA6IGEgPiBiID8gZGlyIDogMCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBncm91cEtleXMubWFwKChrZXkpID0+ICh7XG4gICAgICBrZXksXG4gICAgICBsYWJlbDogZ3JvdXBCeS5sYWJlbCA/IGdyb3VwQnkubGFiZWwoa2V5LCBncm91cHNba2V5XSkgOiBrZXksXG4gICAgICByb3dzOiBncm91cHNba2V5XSxcbiAgICB9KSk7XG4gIH0sIFtzb3J0ZWREYXRhLCBkYXRhLCBncm91cEJ5LCBzZXJ2ZXJTaWRlXSk7XG5cbiAgLy8gR3JvdXAgZXhwYW5kL2NvbGxhcHNlIHN0YXRlXG4gIGNvbnN0IFtleHBhbmRlZEdyb3Vwcywgc2V0RXhwYW5kZWRHcm91cHNdID0gdXNlU3RhdGUoKCkgPT4ge1xuICAgIGlmICghZ3JvdXBCeSkgcmV0dXJuIG5ldyBTZXQoKTtcbiAgICBjb25zdCBkZWZhdWx0RXhwYW5kZWQgPSBncm91cEJ5LmRlZmF1bHRFeHBhbmRlZCAhPT0gZmFsc2U7IC8vIGRlZmF1bHQgdHJ1ZVxuICAgIGlmIChkZWZhdWx0RXhwYW5kZWQgJiYgZ3JvdXBlZERhdGEpIHtcbiAgICAgIHJldHVybiBuZXcgU2V0KGdyb3VwZWREYXRhLm1hcCgoZykgPT4gZy5rZXkpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBTZXQoKTtcbiAgfSk7XG5cbiAgLy8gU3luYyBleHBhbmRlZCBncm91cHMgd2hlbiBncm91cGVkIGRhdGEgY2hhbmdlcyAobmV3IGdyb3VwcyBhcHBlYXIpXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFncm91cGVkRGF0YSkgcmV0dXJuO1xuICAgIGNvbnN0IGRlZmF1bHRFeHBhbmRlZCA9IGdyb3VwQnk/LmRlZmF1bHRFeHBhbmRlZCAhPT0gZmFsc2U7XG4gICAgaWYgKGRlZmF1bHRFeHBhbmRlZCkge1xuICAgICAgc2V0RXhwYW5kZWRHcm91cHMoKHByZXYpID0+IHtcbiAgICAgICAgY29uc3QgbmV4dCA9IG5ldyBTZXQocHJldik7XG4gICAgICAgIGdyb3VwZWREYXRhLmZvckVhY2goKGcpID0+IG5leHQuYWRkKGcua2V5KSk7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgfSk7XG4gICAgfVxuICB9LCBbZ3JvdXBlZERhdGEsIGdyb3VwQnldKTtcblxuICBjb25zdCB0b2dnbGVHcm91cCA9IHVzZUNhbGxiYWNrKChrZXkpID0+IHtcbiAgICBzZXRFeHBhbmRlZEdyb3VwcygocHJldikgPT4ge1xuICAgICAgY29uc3QgbmV4dCA9IG5ldyBTZXQocHJldik7XG4gICAgICBpZiAobmV4dC5oYXMoa2V5KSkgbmV4dC5kZWxldGUoa2V5KTtcbiAgICAgIGVsc2UgbmV4dC5hZGQoa2V5KTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH0pO1xuICB9LCBbXSk7XG5cbiAgLy8gRmxhdHRlbiBmb3IgcGFnaW5hdGlvblxuICBjb25zdCBmbGF0Um93cyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghZ3JvdXBlZERhdGEpIHJldHVybiAoc2VydmVyU2lkZSA/IGRhdGEgOiBzb3J0ZWREYXRhKS5tYXAoKHJvdykgPT4gKHsgdHlwZTogXCJkYXRhXCIsIHJvdyB9KSk7XG5cbiAgICBjb25zdCBmbGF0ID0gW107XG4gICAgZ3JvdXBlZERhdGEuZm9yRWFjaCgoZ3JvdXApID0+IHtcbiAgICAgIGZsYXQucHVzaCh7IHR5cGU6IFwiZ3JvdXAtaGVhZGVyXCIsIGdyb3VwIH0pO1xuICAgICAgaWYgKGV4cGFuZGVkR3JvdXBzLmhhcyhncm91cC5rZXkpKSB7XG4gICAgICAgIGdyb3VwLnJvd3MuZm9yRWFjaCgocm93KSA9PiBmbGF0LnB1c2goeyB0eXBlOiBcImRhdGFcIiwgcm93IH0pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZmxhdDtcbiAgfSwgW2dyb3VwZWREYXRhLCBzb3J0ZWREYXRhLCBkYXRhLCBzZXJ2ZXJTaWRlLCBleHBhbmRlZEdyb3Vwc10pO1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBQYWdpbmF0ZVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY29uc3QgdG90YWxJdGVtcyA9IHNlcnZlclNpZGUgPyAodG90YWxDb3VudCB8fCBkYXRhLmxlbmd0aCkgOiBmbGF0Um93cy5sZW5ndGg7XG4gIGNvbnN0IHBhZ2VDb3VudCA9IE1hdGguY2VpbCh0b3RhbEl0ZW1zIC8gcGFnZVNpemUpO1xuXG4gIGxldCBkaXNwbGF5Um93cztcbiAgaWYgKHNlcnZlclNpZGUpIHtcbiAgICAvLyBTZXJ2ZXIgYWxyZWFkeSBwYWdpbmF0ZWQg4oCUIHJlbmRlciBkYXRhIGFzLWlzICh3aXRoIG9wdGlvbmFsIGdyb3VwaW5nKVxuICAgIGRpc3BsYXlSb3dzID0gZ3JvdXBCeVxuICAgICAgPyBmbGF0Um93c1xuICAgICAgOiBkYXRhLm1hcCgocm93KSA9PiAoeyB0eXBlOiBcImRhdGFcIiwgcm93IH0pKTtcbiAgfSBlbHNlIHtcbiAgICBkaXNwbGF5Um93cyA9IGZsYXRSb3dzLnNsaWNlKFxuICAgICAgKGFjdGl2ZVBhZ2UgLSAxKSAqIHBhZ2VTaXplLFxuICAgICAgYWN0aXZlUGFnZSAqIHBhZ2VTaXplXG4gICAgKTtcbiAgfVxuXG4gIC8vIEZvciBmb290ZXIgY2FsbGJhY2sg4oCUIHBhc3MgZnVsbCBmaWx0ZXJlZCBkYXRhIChjbGllbnQpIG9yIGN1cnJlbnQgcGFnZSAoc2VydmVyKVxuICBjb25zdCBmb290ZXJEYXRhID0gc2VydmVyU2lkZSA/IGRhdGEgOiBmaWx0ZXJlZERhdGE7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEZpbHRlciBjaGlwc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY29uc3QgYWN0aXZlQ2hpcHMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBjaGlwcyA9IFtdO1xuICAgIGZpbHRlcnMuZm9yRWFjaCgoZmlsdGVyKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGZpbHRlclZhbHVlc1tmaWx0ZXIubmFtZV07XG4gICAgICBpZiAoIWlzRmlsdGVyQWN0aXZlKGZpbHRlciwgdmFsdWUpKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IHR5cGUgPSBmaWx0ZXIudHlwZSB8fCBcInNlbGVjdFwiO1xuICAgICAgY29uc3QgcHJlZml4ID0gZmlsdGVyLmNoaXBMYWJlbCB8fCBmaWx0ZXIucGxhY2Vob2xkZXIgfHwgZmlsdGVyLm5hbWU7XG5cbiAgICAgIGlmICh0eXBlID09PSBcIm11bHRpc2VsZWN0XCIpIHtcbiAgICAgICAgY29uc3QgbGFiZWxzID0gdmFsdWVcbiAgICAgICAgICAubWFwKCh2KSA9PiBmaWx0ZXIub3B0aW9ucy5maW5kKChvKSA9PiBvLnZhbHVlID09PSB2KT8ubGFiZWwgfHwgdilcbiAgICAgICAgICAuam9pbihcIiwgXCIpO1xuICAgICAgICBjaGlwcy5wdXNoKHsga2V5OiBmaWx0ZXIubmFtZSwgbGFiZWw6IGAke3ByZWZpeH06ICR7bGFiZWxzfWAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwiZGF0ZVJhbmdlXCIpIHtcbiAgICAgICAgY29uc3QgcGFydHMgPSBbXTtcbiAgICAgICAgaWYgKHZhbHVlLmZyb20pIHBhcnRzLnB1c2goYGZyb20gJHtmb3JtYXREYXRlQ2hpcCh2YWx1ZS5mcm9tKX1gKTtcbiAgICAgICAgaWYgKHZhbHVlLnRvKSBwYXJ0cy5wdXNoKGB0byAke2Zvcm1hdERhdGVDaGlwKHZhbHVlLnRvKX1gKTtcbiAgICAgICAgY2hpcHMucHVzaCh7IGtleTogZmlsdGVyLm5hbWUsIGxhYmVsOiBgJHtwcmVmaXh9OiAke3BhcnRzLmpvaW4oXCIgXCIpfWAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBmaWx0ZXIub3B0aW9ucy5maW5kKChvKSA9PiBvLnZhbHVlID09PSB2YWx1ZSk7XG4gICAgICAgIGNoaXBzLnB1c2goeyBrZXk6IGZpbHRlci5uYW1lLCBsYWJlbDogYCR7cHJlZml4fTogJHtvcHRpb24/LmxhYmVsIHx8IHZhbHVlfWAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNoaXBzO1xuICB9LCBbZmlsdGVyVmFsdWVzLCBmaWx0ZXJzXSk7XG5cbiAgY29uc3QgaGFuZGxlRmlsdGVyUmVtb3ZlID0gdXNlQ2FsbGJhY2soKGtleSkgPT4ge1xuICAgIGlmIChrZXkgPT09IFwiYWxsXCIpIHtcbiAgICAgIGNvbnN0IGNsZWFyZWQgPSB7fTtcbiAgICAgIGZpbHRlcnMuZm9yRWFjaCgoZikgPT4geyBjbGVhcmVkW2YubmFtZV0gPSBnZXRFbXB0eUZpbHRlclZhbHVlKGYpOyB9KTtcbiAgICAgIHNldEludGVybmFsRmlsdGVyVmFsdWVzKGNsZWFyZWQpO1xuICAgICAgaWYgKHNlcnZlclNpZGUgJiYgb25GaWx0ZXJDaGFuZ2UpIG9uRmlsdGVyQ2hhbmdlKGNsZWFyZWQpO1xuICAgICAgcmVzZXRQYWdlKCk7XG4gICAgICBmaXJlUGFyYW1zQ2hhbmdlKHsgZmlsdGVyczogY2xlYXJlZCwgcGFnZTogcmVzZXRQYWdlT25DaGFuZ2UgPyAxIDogdW5kZWZpbmVkIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBmaWx0ZXIgPSBmaWx0ZXJzLmZpbmQoKGYpID0+IGYubmFtZSA9PT0ga2V5KTtcbiAgICAgIGNvbnN0IGVtcHR5VmFsID0gZmlsdGVyID8gZ2V0RW1wdHlGaWx0ZXJWYWx1ZShmaWx0ZXIpIDogXCJcIjtcbiAgICAgIHNldEludGVybmFsRmlsdGVyVmFsdWVzKChwcmV2KSA9PiB7XG4gICAgICAgIGNvbnN0IG5leHQgPSB7IC4uLnByZXYsIFtrZXldOiBlbXB0eVZhbCB9O1xuICAgICAgICBpZiAoc2VydmVyU2lkZSAmJiBvbkZpbHRlckNoYW5nZSkgb25GaWx0ZXJDaGFuZ2UobmV4dCk7XG4gICAgICAgIHJlc2V0UGFnZSgpO1xuICAgICAgICBmaXJlUGFyYW1zQ2hhbmdlKHsgZmlsdGVyczogbmV4dCwgcGFnZTogcmVzZXRQYWdlT25DaGFuZ2UgPyAxIDogdW5kZWZpbmVkIH0pO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgW2ZpbHRlcnMsIHNlcnZlclNpZGUsIG9uRmlsdGVyQ2hhbmdlLCByZXNldFBhZ2UsIGZpcmVQYXJhbXNDaGFuZ2UsIHJlc2V0UGFnZU9uQ2hhbmdlXSk7XG5cbiAgLy8gUmVjb3JkIGNvdW50XG4gIGNvbnN0IGRpc3BsYXlDb3VudCA9IHNlcnZlclNpZGUgPyAodG90YWxDb3VudCB8fCBkYXRhLmxlbmd0aCkgOiBmaWx0ZXJlZERhdGEubGVuZ3RoO1xuICBjb25zdCB0b3RhbERhdGFDb3VudCA9IHNlcnZlclNpZGUgPyAodG90YWxDb3VudCB8fCBkYXRhLmxlbmd0aCkgOiBkYXRhLmxlbmd0aDtcbiAgY29uc3QgcmVjb3JkQ291bnRMYWJlbCA9IHJvd0NvdW50VGV4dFxuICAgID8gcm93Q291bnRUZXh0KGRpc3BsYXlDb3VudCwgdG90YWxEYXRhQ291bnQpXG4gICAgOiBkaXNwbGF5Q291bnQgPT09IHRvdGFsRGF0YUNvdW50XG4gICAgICA/IGAke3RvdGFsRGF0YUNvdW50fSByZWNvcmRzYFxuICAgICAgOiBgJHtkaXNwbGF5Q291bnR9IG9mICR7dG90YWxEYXRhQ291bnR9IHJlY29yZHNgO1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSb3cgc2VsZWN0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBjb25zdCBbc2VsZWN0ZWRJZHMsIHNldFNlbGVjdGVkSWRzXSA9IHVzZVN0YXRlKG5ldyBTZXQoKSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc2VsZWN0YWJsZSkgc2V0U2VsZWN0ZWRJZHMobmV3IFNldCgpKTtcbiAgfSwgW3NlYXJjaFRlcm0sIGZpbHRlclZhbHVlcywgc2VsZWN0YWJsZV0pO1xuXG4gIGNvbnN0IGhhbmRsZVNlbGVjdFJvdyA9IHVzZUNhbGxiYWNrKChyb3dJZCwgY2hlY2tlZCkgPT4ge1xuICAgIHNldFNlbGVjdGVkSWRzKChwcmV2KSA9PiB7XG4gICAgICBjb25zdCBuZXh0ID0gbmV3IFNldChwcmV2KTtcbiAgICAgIGlmIChjaGVja2VkKSBuZXh0LmFkZChyb3dJZCk7XG4gICAgICBlbHNlIG5leHQuZGVsZXRlKHJvd0lkKTtcbiAgICAgIGlmIChvblNlbGVjdGlvbkNoYW5nZSkgb25TZWxlY3Rpb25DaGFuZ2UoWy4uLm5leHRdKTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH0pO1xuICB9LCBbb25TZWxlY3Rpb25DaGFuZ2VdKTtcblxuICBjb25zdCBoYW5kbGVTZWxlY3RBbGwgPSB1c2VDYWxsYmFjaygoY2hlY2tlZCkgPT4ge1xuICAgIGNvbnN0IHZpc2libGVJZHMgPSBkaXNwbGF5Um93c1xuICAgICAgLmZpbHRlcigocikgPT4gci50eXBlID09PSBcImRhdGFcIilcbiAgICAgIC5tYXAoKHIpID0+IHIucm93W3Jvd0lkRmllbGRdKTtcbiAgICBzZXRTZWxlY3RlZElkcygocHJldikgPT4ge1xuICAgICAgY29uc3QgbmV4dCA9IG5ldyBTZXQocHJldik7XG4gICAgICB2aXNpYmxlSWRzLmZvckVhY2goKGlkKSA9PiB7XG4gICAgICAgIGlmIChjaGVja2VkKSBuZXh0LmFkZChpZCk7XG4gICAgICAgIGVsc2UgbmV4dC5kZWxldGUoaWQpO1xuICAgICAgfSk7XG4gICAgICBpZiAob25TZWxlY3Rpb25DaGFuZ2UpIG9uU2VsZWN0aW9uQ2hhbmdlKFsuLi5uZXh0XSk7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9KTtcbiAgfSwgW2Rpc3BsYXlSb3dzLCByb3dJZEZpZWxkLCBvblNlbGVjdGlvbkNoYW5nZV0pO1xuXG4gIGNvbnN0IGFsbFZpc2libGVTZWxlY3RlZCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHZpc2libGVJZHMgPSBkaXNwbGF5Um93c1xuICAgICAgLmZpbHRlcigocikgPT4gci50eXBlID09PSBcImRhdGFcIilcbiAgICAgIC5tYXAoKHIpID0+IHIucm93W3Jvd0lkRmllbGRdKTtcbiAgICByZXR1cm4gdmlzaWJsZUlkcy5sZW5ndGggPiAwICYmIHZpc2libGVJZHMuZXZlcnkoKGlkKSA9PiBzZWxlY3RlZElkcy5oYXMoaWQpKTtcbiAgfSwgW2Rpc3BsYXlSb3dzLCBzZWxlY3RlZElkcywgcm93SWRGaWVsZF0pO1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBJbmxpbmUgZWRpdGluZ1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY29uc3QgW2VkaXRpbmdDZWxsLCBzZXRFZGl0aW5nQ2VsbF0gPSB1c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW2VkaXRWYWx1ZSwgc2V0RWRpdFZhbHVlXSA9IHVzZVN0YXRlKG51bGwpO1xuICBjb25zdCBbZWRpdEVycm9yLCBzZXRFZGl0RXJyb3JdID0gdXNlU3RhdGUobnVsbCk7XG5cbiAgY29uc3Qgc3RhcnRFZGl0aW5nID0gdXNlQ2FsbGJhY2soKHJvd0lkLCBmaWVsZCwgY3VycmVudFZhbHVlKSA9PiB7XG4gICAgc2V0RWRpdGluZ0NlbGwoeyByb3dJZCwgZmllbGQgfSk7XG4gICAgc2V0RWRpdFZhbHVlKGN1cnJlbnRWYWx1ZSk7XG4gICAgc2V0RWRpdEVycm9yKG51bGwpO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgY2FuY2VsRWRpdCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzZXRFZGl0aW5nQ2VsbChudWxsKTtcbiAgICBzZXRFZGl0VmFsdWUobnVsbCk7XG4gICAgc2V0RWRpdEVycm9yKG51bGwpO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgY29tbWl0RWRpdCA9IHVzZUNhbGxiYWNrKChyb3csIGZpZWxkLCB2YWx1ZSkgPT4ge1xuICAgIGNvbnN0IGNvbCA9IGNvbHVtbnMuZmluZCgoYykgPT4gYy5maWVsZCA9PT0gZmllbGQpO1xuICAgIGlmIChjb2w/LmVkaXRWYWxpZGF0ZSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gY29sLmVkaXRWYWxpZGF0ZSh2YWx1ZSwgcm93KTtcbiAgICAgIGlmIChyZXN1bHQgIT09IHRydWUgJiYgcmVzdWx0ICE9PSB1bmRlZmluZWQgJiYgcmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgIHNldEVkaXRFcnJvcih0eXBlb2YgcmVzdWx0ID09PSBcInN0cmluZ1wiID8gcmVzdWx0IDogXCJJbnZhbGlkIHZhbHVlXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvblJvd0VkaXQpIG9uUm93RWRpdChyb3csIGZpZWxkLCB2YWx1ZSk7XG4gICAgc2V0RWRpdGluZ0NlbGwobnVsbCk7XG4gICAgc2V0RWRpdFZhbHVlKG51bGwpO1xuICAgIHNldEVkaXRFcnJvcihudWxsKTtcbiAgfSwgW29uUm93RWRpdCwgY29sdW1uc10pO1xuXG4gIGNvbnN0IHJlbmRlckVkaXRDb250cm9sID0gKGNvbCwgcm93KSA9PiB7XG4gICAgY29uc3QgdHlwZSA9IGNvbC5lZGl0VHlwZSB8fCBcInRleHRcIjtcbiAgICBjb25zdCByb3dJZCA9IHJvd1tyb3dJZEZpZWxkXTtcbiAgICBjb25zdCBmaWVsZE5hbWUgPSBgZWRpdC0ke3Jvd0lkfS0ke2NvbC5maWVsZH1gO1xuICAgIGNvbnN0IGNvbW1pdCA9ICh2YWwpID0+IGNvbW1pdEVkaXQocm93LCBjb2wuZmllbGQsIHZhbCk7XG4gICAgY29uc3QgdXBkYXRlID0gKHZhbCkgPT4ge1xuICAgICAgc2V0RWRpdFZhbHVlKHZhbCk7XG4gICAgICBpZiAob25Sb3dFZGl0KSBvblJvd0VkaXQocm93LCBjb2wuZmllbGQsIHZhbCk7XG4gICAgfTtcbiAgICBjb25zdCBleGl0RWRpdCA9ICgpID0+IHtcbiAgICAgIGlmIChlZGl0RXJyb3IpIHJldHVybjtcbiAgICAgIHNldEVkaXRpbmdDZWxsKG51bGwpO1xuICAgICAgc2V0RWRpdFZhbHVlKG51bGwpO1xuICAgIH07XG4gICAgY29uc3QgZXh0cmEgPSBjb2wuZWRpdFByb3BzIHx8IHt9O1xuXG4gICAgLy8gVmFsaWRhdGlvbiBwcm9wcyBmb3IgdGV4dC10eXBlIGlucHV0cyAoZGlzY3JldGUgbW9kZSlcbiAgICBjb25zdCB2YWxpZGF0ZSA9IGNvbC5lZGl0VmFsaWRhdGU7XG4gICAgY29uc3QgdmFsaWRhdGlvblByb3BzID0gdmFsaWRhdGUgJiYgZWRpdEVycm9yID8geyBlcnJvcjogdHJ1ZSwgdmFsaWRhdGlvbk1lc3NhZ2U6IGVkaXRFcnJvciB9IDoge307XG4gICAgY29uc3Qgb25JbnB1dFZhbGlkYXRlID0gdmFsaWRhdGVcbiAgICAgID8gKHZhbCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB2YWxpZGF0ZSh2YWwsIHJvdyk7XG4gICAgICAgIGlmIChyZXN1bHQgIT09IHRydWUgJiYgcmVzdWx0ICE9PSB1bmRlZmluZWQgJiYgcmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgc2V0RWRpdEVycm9yKHR5cGVvZiByZXN1bHQgPT09IFwic3RyaW5nXCIgPyByZXN1bHQgOiBcIkludmFsaWQgdmFsdWVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0RWRpdEVycm9yKG51bGwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBcInRleHRhcmVhXCI6XG4gICAgICAgIHJldHVybiA8VGV4dEFyZWEgey4uLmV4dHJhfSBuYW1lPXtmaWVsZE5hbWV9IGxhYmVsPVwiXCIgdmFsdWU9e2VkaXRWYWx1ZSA/PyBcIlwifSBvbkNoYW5nZT17dXBkYXRlfSBvbkJsdXI9e2V4aXRFZGl0fSB7Li4udmFsaWRhdGlvblByb3BzfSBvbklucHV0PXtvbklucHV0VmFsaWRhdGV9IC8+O1xuICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICByZXR1cm4gPE51bWJlcklucHV0IHsuLi5leHRyYX0gbmFtZT17ZmllbGROYW1lfSBsYWJlbD1cIlwiIHZhbHVlPXtlZGl0VmFsdWV9IG9uQ2hhbmdlPXt1cGRhdGV9IG9uQmx1cj17ZXhpdEVkaXR9IHsuLi52YWxpZGF0aW9uUHJvcHN9IG9uSW5wdXQ9e29uSW5wdXRWYWxpZGF0ZX0gLz47XG4gICAgICBjYXNlIFwiY3VycmVuY3lcIjpcbiAgICAgICAgcmV0dXJuIDxDdXJyZW5jeUlucHV0IGN1cnJlbmN5Q29kZT1cIlVTRFwiIHsuLi5leHRyYX0gbmFtZT17ZmllbGROYW1lfSBsYWJlbD1cIlwiIHZhbHVlPXtlZGl0VmFsdWV9IG9uQ2hhbmdlPXt1cGRhdGV9IG9uQmx1cj17ZXhpdEVkaXR9IHsuLi52YWxpZGF0aW9uUHJvcHN9IG9uSW5wdXQ9e29uSW5wdXRWYWxpZGF0ZX0gLz47XG4gICAgICBjYXNlIFwic3RlcHBlclwiOlxuICAgICAgICByZXR1cm4gPFN0ZXBwZXJJbnB1dCB7Li4uZXh0cmF9IG5hbWU9e2ZpZWxkTmFtZX0gbGFiZWw9XCJcIiB2YWx1ZT17ZWRpdFZhbHVlfSBvbkNoYW5nZT17dXBkYXRlfSBvbkJsdXI9e2V4aXRFZGl0fSB7Li4udmFsaWRhdGlvblByb3BzfSBvbklucHV0PXtvbklucHV0VmFsaWRhdGV9IC8+O1xuICAgICAgY2FzZSBcInNlbGVjdFwiOlxuICAgICAgICByZXR1cm4gPFNlbGVjdCB2YXJpYW50PVwidHJhbnNwYXJlbnRcIiB7Li4uZXh0cmF9IG5hbWU9e2ZpZWxkTmFtZX0gbGFiZWw9XCJcIiB2YWx1ZT17ZWRpdFZhbHVlfSBvbkNoYW5nZT17Y29tbWl0fSBvcHRpb25zPXtyZXNvbHZlRWRpdE9wdGlvbnMoY29sLCBkYXRhKX0gLz47XG4gICAgICBjYXNlIFwibXVsdGlzZWxlY3RcIjpcbiAgICAgICAgcmV0dXJuIDxNdWx0aVNlbGVjdCB7Li4uZXh0cmF9IG5hbWU9e2ZpZWxkTmFtZX0gbGFiZWw9XCJcIiB2YWx1ZT17ZWRpdFZhbHVlIHx8IFtdfSBvbkNoYW5nZT17Y29tbWl0fSBvcHRpb25zPXtyZXNvbHZlRWRpdE9wdGlvbnMoY29sLCBkYXRhKX0gLz47XG4gICAgICBjYXNlIFwiZGF0ZVwiOlxuICAgICAgICByZXR1cm4gPERhdGVJbnB1dCB7Li4uZXh0cmF9IG5hbWU9e2ZpZWxkTmFtZX0gbGFiZWw9XCJcIiB2YWx1ZT17ZWRpdFZhbHVlfSBvbkNoYW5nZT17Y29tbWl0fSAvPjtcbiAgICAgIGNhc2UgXCJ0b2dnbGVcIjpcbiAgICAgICAgcmV0dXJuIDxUb2dnbGUgey4uLmV4dHJhfSBuYW1lPXtmaWVsZE5hbWV9IGxhYmVsPVwiXCIgY2hlY2tlZD17ISFlZGl0VmFsdWV9IG9uQ2hhbmdlPXtjb21taXR9IC8+O1xuICAgICAgY2FzZSBcImNoZWNrYm94XCI6XG4gICAgICAgIHJldHVybiA8Q2hlY2tib3ggey4uLmV4dHJhfSBuYW1lPXtmaWVsZE5hbWV9IGNoZWNrZWQ9eyEhZWRpdFZhbHVlfSBvbkNoYW5nZT17Y29tbWl0fSAvPjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiA8SW5wdXQgey4uLmV4dHJhfSBuYW1lPXtmaWVsZE5hbWV9IGxhYmVsPVwiXCIgdmFsdWU9e2VkaXRWYWx1ZSA/PyBcIlwifSBvbkNoYW5nZT17dXBkYXRlfSBvbkJsdXI9e2V4aXRFZGl0fSB7Li4udmFsaWRhdGlvblByb3BzfSBvbklucHV0PXtvbklucHV0VmFsaWRhdGV9IC8+O1xuICAgIH1cbiAgfTtcblxuICBjb25zdCByZXNvbHZlZEVkaXRNb2RlID0gZWRpdE1vZGUgfHwgKGNvbHVtbnMuc29tZSgoY29sKSA9PiBjb2wuZWRpdGFibGUpID8gXCJkaXNjcmV0ZVwiIDogbnVsbCk7XG4gIGNvbnN0IHVzZUNvbHVtblJlbmRlcmluZyA9IHNlbGVjdGFibGUgfHwgISFyZXNvbHZlZEVkaXRNb2RlIHx8ICFyZW5kZXJSb3c7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEF1dG8td2lkdGggY29tcHV0YXRpb25cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGNvbnN0IGF1dG9XaWR0aHMgPSB1c2VNZW1vKFxuICAgICgpID0+IGF1dG9XaWR0aCA/IGNvbXB1dGVBdXRvV2lkdGhzKGNvbHVtbnMsIGRhdGEpIDoge30sXG4gICAgW2NvbHVtbnMsIGRhdGEsIGF1dG9XaWR0aF1cbiAgKTtcblxuICBjb25zdCBnZXRIZWFkZXJXaWR0aCA9IChjb2wpID0+IGNvbC53aWR0aCB8fCBhdXRvV2lkdGhzW2NvbC5maWVsZF0/LndpZHRoIHx8IFwiYXV0b1wiO1xuICBjb25zdCBnZXRDZWxsV2lkdGggPSAoY29sKSA9PiBjb2wuY2VsbFdpZHRoIHx8IGNvbC53aWR0aCB8fCBhdXRvV2lkdGhzW2NvbC5maWVsZF0/LmNlbGxXaWR0aCB8fCBcImF1dG9cIjtcblxuICAvLyBQZXItY2VsbCBlcnJvciB0cmFja2luZyBmb3IgaW5saW5lIG1vZGUgKG11bHRpcGxlIGNlbGxzIGVkaXRhYmxlIGF0IG9uY2UpXG4gIGNvbnN0IFtpbmxpbmVFcnJvcnMsIHNldElubGluZUVycm9yc10gPSB1c2VTdGF0ZSh7fSk7XG5cbiAgY29uc3QgcmVuZGVySW5saW5lQ29udHJvbCA9IChjb2wsIHJvdykgPT4ge1xuICAgIGNvbnN0IHR5cGUgPSBjb2wuZWRpdFR5cGUgfHwgXCJ0ZXh0XCI7XG4gICAgY29uc3Qgcm93SWQgPSByb3dbcm93SWRGaWVsZF07XG4gICAgY29uc3QgZmllbGROYW1lID0gYGlubGluZS0ke3Jvd0lkfS0ke2NvbC5maWVsZH1gO1xuICAgIGNvbnN0IGNlbGxLZXkgPSBgJHtyb3dJZH0tJHtjb2wuZmllbGR9YDtcbiAgICBjb25zdCB2YWx1ZSA9IHJvd1tjb2wuZmllbGRdO1xuICAgIGNvbnN0IHZhbGlkYXRlID0gY29sLmVkaXRWYWxpZGF0ZTtcblxuICAgIGNvbnN0IGZpcmUgPSAodmFsKSA9PiB7XG4gICAgICBpZiAodmFsaWRhdGUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdmFsaWRhdGUodmFsLCByb3cpO1xuICAgICAgICBpZiAocmVzdWx0ICE9PSB0cnVlICYmIHJlc3VsdCAhPT0gdW5kZWZpbmVkICYmIHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgIHNldElubGluZUVycm9ycygocHJldikgPT4gKHsgLi4ucHJldiwgW2NlbGxLZXldOiB0eXBlb2YgcmVzdWx0ID09PSBcInN0cmluZ1wiID8gcmVzdWx0IDogXCJJbnZhbGlkIHZhbHVlXCIgfSkpO1xuICAgICAgICAgIHJldHVybjsgLy8gQmxvY2sgdGhlIGVkaXRcbiAgICAgICAgfVxuICAgICAgICBzZXRJbmxpbmVFcnJvcnMoKHByZXYpID0+IHsgY29uc3QgbmV4dCA9IHsgLi4ucHJldiB9OyBkZWxldGUgbmV4dFtjZWxsS2V5XTsgcmV0dXJuIG5leHQ7IH0pO1xuICAgICAgfVxuICAgICAgaWYgKG9uUm93RWRpdCkgb25Sb3dFZGl0KHJvdywgY29sLmZpZWxkLCB2YWwpO1xuICAgIH07XG4gICAgY29uc3QgZXh0cmEgPSBjb2wuZWRpdFByb3BzIHx8IHt9O1xuICAgIGNvbnN0IGNlbGxFcnJvciA9IGlubGluZUVycm9yc1tjZWxsS2V5XTtcbiAgICBjb25zdCB2YWxpZGF0aW9uUHJvcHMgPSBjZWxsRXJyb3IgPyB7IGVycm9yOiB0cnVlLCB2YWxpZGF0aW9uTWVzc2FnZTogY2VsbEVycm9yIH0gOiB7fTtcbiAgICBjb25zdCBvbklucHV0VmFsaWRhdGUgPSB2YWxpZGF0ZVxuICAgICAgPyAodmFsKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHZhbGlkYXRlKHZhbCwgcm93KTtcbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSAmJiByZXN1bHQgIT09IHVuZGVmaW5lZCAmJiByZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICBzZXRJbmxpbmVFcnJvcnMoKHByZXYpID0+ICh7IC4uLnByZXYsIFtjZWxsS2V5XTogdHlwZW9mIHJlc3VsdCA9PT0gXCJzdHJpbmdcIiA/IHJlc3VsdCA6IFwiSW52YWxpZCB2YWx1ZVwiIH0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRJbmxpbmVFcnJvcnMoKHByZXYpID0+IHsgY29uc3QgbmV4dCA9IHsgLi4ucHJldiB9OyBkZWxldGUgbmV4dFtjZWxsS2V5XTsgcmV0dXJuIG5leHQ7IH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBcInRleHRhcmVhXCI6XG4gICAgICAgIHJldHVybiA8VGV4dEFyZWEgey4uLmV4dHJhfSBuYW1lPXtmaWVsZE5hbWV9IGxhYmVsPVwiXCIgdmFsdWU9e3ZhbHVlID8/IFwiXCJ9IG9uQ2hhbmdlPXtmaXJlfSB7Li4udmFsaWRhdGlvblByb3BzfSBvbklucHV0PXtvbklucHV0VmFsaWRhdGV9IC8+O1xuICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICByZXR1cm4gPE51bWJlcklucHV0IHsuLi5leHRyYX0gbmFtZT17ZmllbGROYW1lfSBsYWJlbD1cIlwiIHZhbHVlPXt2YWx1ZX0gb25DaGFuZ2U9e2ZpcmV9IHsuLi52YWxpZGF0aW9uUHJvcHN9IG9uSW5wdXQ9e29uSW5wdXRWYWxpZGF0ZX0gLz47XG4gICAgICBjYXNlIFwiY3VycmVuY3lcIjpcbiAgICAgICAgcmV0dXJuIDxDdXJyZW5jeUlucHV0IGN1cnJlbmN5Q29kZT1cIlVTRFwiIHsuLi5leHRyYX0gbmFtZT17ZmllbGROYW1lfSBsYWJlbD1cIlwiIHZhbHVlPXt2YWx1ZX0gb25DaGFuZ2U9e2ZpcmV9IHsuLi52YWxpZGF0aW9uUHJvcHN9IG9uSW5wdXQ9e29uSW5wdXRWYWxpZGF0ZX0gLz47XG4gICAgICBjYXNlIFwic3RlcHBlclwiOlxuICAgICAgICByZXR1cm4gPFN0ZXBwZXJJbnB1dCB7Li4uZXh0cmF9IG5hbWU9e2ZpZWxkTmFtZX0gbGFiZWw9XCJcIiB2YWx1ZT17dmFsdWV9IG9uQ2hhbmdlPXtmaXJlfSB7Li4udmFsaWRhdGlvblByb3BzfSBvbklucHV0PXtvbklucHV0VmFsaWRhdGV9IC8+O1xuICAgICAgY2FzZSBcInNlbGVjdFwiOlxuICAgICAgICByZXR1cm4gPFNlbGVjdCB2YXJpYW50PVwidHJhbnNwYXJlbnRcIiB7Li4uZXh0cmF9IG5hbWU9e2ZpZWxkTmFtZX0gbGFiZWw9XCJcIiB2YWx1ZT17dmFsdWV9IG9uQ2hhbmdlPXtmaXJlfSBvcHRpb25zPXtyZXNvbHZlRWRpdE9wdGlvbnMoY29sLCBkYXRhKX0gLz47XG4gICAgICBjYXNlIFwibXVsdGlzZWxlY3RcIjpcbiAgICAgICAgcmV0dXJuIDxNdWx0aVNlbGVjdCB7Li4uZXh0cmF9IG5hbWU9e2ZpZWxkTmFtZX0gbGFiZWw9XCJcIiB2YWx1ZT17dmFsdWUgfHwgW119IG9uQ2hhbmdlPXtmaXJlfSBvcHRpb25zPXtyZXNvbHZlRWRpdE9wdGlvbnMoY29sLCBkYXRhKX0gLz47XG4gICAgICBjYXNlIFwiZGF0ZVwiOlxuICAgICAgICByZXR1cm4gPERhdGVJbnB1dCB7Li4uZXh0cmF9IG5hbWU9e2ZpZWxkTmFtZX0gbGFiZWw9XCJcIiB2YWx1ZT17dmFsdWV9IG9uQ2hhbmdlPXtmaXJlfSAvPjtcbiAgICAgIGNhc2UgXCJ0b2dnbGVcIjpcbiAgICAgICAgcmV0dXJuIDxUb2dnbGUgey4uLmV4dHJhfSBuYW1lPXtmaWVsZE5hbWV9IGxhYmVsPVwiXCIgY2hlY2tlZD17ISF2YWx1ZX0gb25DaGFuZ2U9e2ZpcmV9IC8+O1xuICAgICAgY2FzZSBcImNoZWNrYm94XCI6XG4gICAgICAgIHJldHVybiA8Q2hlY2tib3ggey4uLmV4dHJhfSBuYW1lPXtmaWVsZE5hbWV9IGNoZWNrZWQ9eyEhdmFsdWV9IG9uQ2hhbmdlPXtmaXJlfSAvPjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiA8SW5wdXQgey4uLmV4dHJhfSBuYW1lPXtmaWVsZE5hbWV9IGxhYmVsPVwiXCIgdmFsdWU9e3ZhbHVlID8/IFwiXCJ9IG9uQ2hhbmdlPXtmaXJlfSB7Li4udmFsaWRhdGlvblByb3BzfSBvbklucHV0PXtvbklucHV0VmFsaWRhdGV9IC8+O1xuICAgIH1cbiAgfTtcblxuICBjb25zdCByZW5kZXJDZWxsQ29udGVudCA9IChyb3csIGNvbCkgPT4ge1xuICAgIGNvbnN0IHJvd0lkID0gcm93W3Jvd0lkRmllbGRdO1xuXG4gICAgLy8gSW5saW5lIG1vZGU6IGVkaXRhYmxlIGNlbGxzIGFsd2F5cyBzaG93IHRoZWlyIGlucHV0XG4gICAgaWYgKHJlc29sdmVkRWRpdE1vZGUgPT09IFwiaW5saW5lXCIgJiYgY29sLmVkaXRhYmxlKSB7XG4gICAgICByZXR1cm4gcmVuZGVySW5saW5lQ29udHJvbChjb2wsIHJvdyk7XG4gICAgfVxuXG4gICAgLy8gRGlzY3JldGUgbW9kZTogY2xpY2stdG8tZWRpdFxuICAgIGNvbnN0IGlzRWRpdGluZyA9XG4gICAgICBlZGl0aW5nQ2VsbD8ucm93SWQgPT09IHJvd0lkICYmIGVkaXRpbmdDZWxsPy5maWVsZCA9PT0gY29sLmZpZWxkO1xuXG4gICAgaWYgKGlzRWRpdGluZyAmJiBjb2wuZWRpdGFibGUpIHJldHVybiByZW5kZXJFZGl0Q29udHJvbChjb2wsIHJvdyk7XG5cbiAgICBjb25zdCBjb250ZW50ID0gY29sLnJlbmRlckNlbGxcbiAgICAgID8gY29sLnJlbmRlckNlbGwocm93W2NvbC5maWVsZF0sIHJvdylcbiAgICAgIDogcm93W2NvbC5maWVsZF0gPz8gXCJcIjtcblxuICAgIGlmIChjb2wuZWRpdGFibGUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxMaW5rXG4gICAgICAgICAgdmFyaWFudD1cImRhcmtcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHN0YXJ0RWRpdGluZyhyb3dJZCwgY29sLmZpZWxkLCByb3dbY29sLmZpZWxkXSl9XG4gICAgICAgID5cbiAgICAgICAgICB7Y29udGVudCB8fCBcIlxcdTIwMTRcIn1cbiAgICAgICAgPC9MaW5rPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGVudDtcbiAgfTtcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyIGZpbHRlciBjb250cm9sc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY29uc3QgcmVuZGVyRmlsdGVyQ29udHJvbCA9IChmaWx0ZXIpID0+IHtcbiAgICBjb25zdCB0eXBlID0gZmlsdGVyLnR5cGUgfHwgXCJzZWxlY3RcIjtcblxuICAgIGlmICh0eXBlID09PSBcIm11bHRpc2VsZWN0XCIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxNdWx0aVNlbGVjdFxuICAgICAgICAgIGtleT17ZmlsdGVyLm5hbWV9XG4gICAgICAgICAgbmFtZT17YGZpbHRlci0ke2ZpbHRlci5uYW1lfWB9XG4gICAgICAgICAgbGFiZWw9XCJcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPXtmaWx0ZXIucGxhY2Vob2xkZXIgfHwgXCJBbGxcIn1cbiAgICAgICAgICB2YWx1ZT17ZmlsdGVyVmFsdWVzW2ZpbHRlci5uYW1lXSB8fCBbXX1cbiAgICAgICAgICBvbkNoYW5nZT17KHZhbCkgPT4gaGFuZGxlRmlsdGVyQ2hhbmdlKGZpbHRlci5uYW1lLCB2YWwpfVxuICAgICAgICAgIG9wdGlvbnM9e2ZpbHRlci5vcHRpb25zfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZSA9PT0gXCJkYXRlUmFuZ2VcIikge1xuICAgICAgY29uc3QgcmFuZ2VWYWwgPSBmaWx0ZXJWYWx1ZXNbZmlsdGVyLm5hbWVdIHx8IHsgZnJvbTogbnVsbCwgdG86IG51bGwgfTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxGbGV4IGtleT17ZmlsdGVyLm5hbWV9IGRpcmVjdGlvbj1cInJvd1wiIGFsaWduPVwiY2VudGVyXCIgZ2FwPVwieHNcIj5cbiAgICAgICAgICA8RGF0ZUlucHV0XG4gICAgICAgICAgICBuYW1lPXtgZmlsdGVyLSR7ZmlsdGVyLm5hbWV9LWZyb21gfVxuICAgICAgICAgICAgbGFiZWw9XCJcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJGcm9tXCJcbiAgICAgICAgICAgIGZvcm1hdD1cIm1lZGl1bVwiXG4gICAgICAgICAgICB2YWx1ZT17cmFuZ2VWYWwuZnJvbX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsKSA9PlxuICAgICAgICAgICAgICBoYW5kbGVGaWx0ZXJDaGFuZ2UoZmlsdGVyLm5hbWUsIHsgLi4ucmFuZ2VWYWwsIGZyb206IHZhbCB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEljb24gbmFtZT1cImRhdGFTeW5jXCIgc2l6ZT1cInNtXCI+PC9JY29uPlxuICAgICAgICAgIDxEYXRlSW5wdXRcbiAgICAgICAgICAgIHNpemU9XCJzbVwiXG4gICAgICAgICAgICBuYW1lPXtgZmlsdGVyLSR7ZmlsdGVyLm5hbWV9LXRvYH1cbiAgICAgICAgICAgIGxhYmVsPVwiXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVG9cIlxuICAgICAgICAgICAgZm9ybWF0PVwibWVkaXVtXCJcbiAgICAgICAgICAgIHZhbHVlPXtyYW5nZVZhbC50b31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsKSA9PlxuICAgICAgICAgICAgICBoYW5kbGVGaWx0ZXJDaGFuZ2UoZmlsdGVyLm5hbWUsIHsgLi4ucmFuZ2VWYWwsIHRvOiB2YWwgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0ZsZXg+XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIERlZmF1bHQ6IHNpbmdsZSBzZWxlY3RcbiAgICByZXR1cm4gKFxuICAgICAgPFNlbGVjdFxuICAgICAgICBrZXk9e2ZpbHRlci5uYW1lfVxuICAgICAgICBuYW1lPXtgZmlsdGVyLSR7ZmlsdGVyLm5hbWV9YH1cbiAgICAgICAgdmFyaWFudD1cInRyYW5zcGFyZW50XCJcbiAgICAgICAgcGxhY2Vob2xkZXI9e2ZpbHRlci5wbGFjZWhvbGRlciB8fCBcIkFsbFwifVxuICAgICAgICB2YWx1ZT17ZmlsdGVyVmFsdWVzW2ZpbHRlci5uYW1lXX1cbiAgICAgICAgb25DaGFuZ2U9eyh2YWwpID0+IGhhbmRsZUZpbHRlckNoYW5nZShmaWx0ZXIubmFtZSwgdmFsKX1cbiAgICAgICAgb3B0aW9ucz17W1xuICAgICAgICAgIHsgbGFiZWw6IGZpbHRlci5wbGFjZWhvbGRlciB8fCBcIkFsbFwiLCB2YWx1ZTogXCJcIiB9LFxuICAgICAgICAgIC4uLmZpbHRlci5vcHRpb25zLFxuICAgICAgICBdfVxuICAgICAgLz5cbiAgICApO1xuICB9O1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIHJldHVybiAoXG4gICAgPEZsZXggZGlyZWN0aW9uPVwiY29sdW1uXCIgZ2FwPVwieHNcIj5cbiAgICAgIHsvKiBUb29sYmFyICovfVxuICAgICAgPEZsZXggZGlyZWN0aW9uPVwicm93XCIgZ2FwPVwic21cIj5cbiAgICAgICAgey8qIExlZnQ6IFNlYXJjaCwgZmlsdGVycywgY2hpcHMgKHVwIHRvIDc1JSkgKi99XG4gICAgICAgIDxCb3ggZmxleD17M30+XG4gICAgICAgICAgPEZsZXggZGlyZWN0aW9uPVwiY29sdW1uXCIgZ2FwPVwic21cIj5cbiAgICAgICAgICAgIHsvKiBSb3cgMTogU2VhcmNoICsgZmlyc3QgMiBmaWx0ZXJzICsgRmlsdGVycyB0b2dnbGUgKi99XG4gICAgICAgICAgICA8RmxleCBkaXJlY3Rpb249XCJyb3dcIiBhbGlnbj1cImNlbnRlclwiIGdhcD1cInNtXCIgd3JhcD1cIndyYXBcIj5cbiAgICAgICAgICAgICAge3NlYXJjaEZpZWxkcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICA8U2VhcmNoSW5wdXRcbiAgICAgICAgICAgICAgICAgIG5hbWU9XCJkYXRhdGFibGUtc2VhcmNoXCJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtzZWFyY2hQbGFjZWhvbGRlcn1cbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtzZWFyY2hUZXJtfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZVNlYXJjaENoYW5nZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICB7ZmlsdGVycy5zbGljZSgwLCAyKS5tYXAocmVuZGVyRmlsdGVyQ29udHJvbCl9XG4gICAgICAgICAgICAgIHtmaWx0ZXJzLmxlbmd0aCA+IDIgJiYgKFxuICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2hvd01vcmVGaWx0ZXJzKChwcmV2KSA9PiAhcHJldil9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPEljb24gbmFtZT1cImZpbHRlclwiIHNpemU9XCJzbVwiIC8+IEZpbHRlcnNcbiAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvRmxleD5cblxuICAgICAgICAgICAgey8qIFJvdyAyOiBBZGRpdGlvbmFsIGZpbHRlcnMgKHRvZ2dsZWQpICovfVxuICAgICAgICAgICAge3Nob3dNb3JlRmlsdGVycyAmJiBmaWx0ZXJzLmxlbmd0aCA+IDIgJiYgKFxuICAgICAgICAgICAgICA8RmxleCBkaXJlY3Rpb249XCJyb3dcIiBhbGlnbj1cImVuZFwiIGdhcD1cInNtXCIgd3JhcD1cIndyYXBcIj5cbiAgICAgICAgICAgICAgICB7ZmlsdGVycy5zbGljZSgyKS5tYXAocmVuZGVyRmlsdGVyQ29udHJvbCl9XG4gICAgICAgICAgICAgIDwvRmxleD5cbiAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgIHsvKiBBY3RpdmUgZmlsdGVyIGNoaXBzICovfVxuICAgICAgICAgICAge2FjdGl2ZUNoaXBzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICA8RmxleCBkaXJlY3Rpb249XCJyb3dcIiBhbGlnbj1cImNlbnRlclwiIGdhcD1cInNtXCIgd3JhcD1cIndyYXBcIj5cbiAgICAgICAgICAgICAgICB7YWN0aXZlQ2hpcHMubWFwKChjaGlwKSA9PiAoXG4gICAgICAgICAgICAgICAgICA8VGFnIGtleT17Y2hpcC5rZXl9IHZhcmlhbnQ9XCJkZWZhdWx0XCIgb25EZWxldGU9eygpID0+IGhhbmRsZUZpbHRlclJlbW92ZShjaGlwLmtleSl9PlxuICAgICAgICAgICAgICAgICAgICB7Y2hpcC5sYWJlbH1cbiAgICAgICAgICAgICAgICAgIDwvVGFnPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgICBzaXplPVwiZXh0cmEtc21hbGxcIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlRmlsdGVyUmVtb3ZlKFwiYWxsXCIpfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIENsZWFyIGFsbFxuICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICA8L0ZsZXg+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvRmxleD5cbiAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgey8qIFJpZ2h0OiBSZWNvcmQgY291bnQgKHVwIHRvIDI1JSkgKi99XG4gICAgICAgIHtzaG93Um93Q291bnQgJiYgZGlzcGxheUNvdW50ID4gMCAmJiAoXG4gICAgICAgICAgPEJveCBmbGV4PXsxfSBhbGlnblNlbGY9XCJlbmRcIj5cbiAgICAgICAgICAgIDxGbGV4IGRpcmVjdGlvbj1cInJvd1wiIGp1c3RpZnk9XCJlbmRcIj5cbiAgICAgICAgICAgICAgPFRleHQgdmFyaWFudD1cIm1pY3JvY29weVwiIGZvcm1hdD17cm93Q291bnRCb2xkID8geyBmb250V2VpZ2h0OiBcImJvbGRcIiB9IDogdW5kZWZpbmVkfT57cmVjb3JkQ291bnRMYWJlbH08L1RleHQ+XG4gICAgICAgICAgICA8L0ZsZXg+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICl9XG4gICAgICA8L0ZsZXg+XG5cbiAgICAgIHsvKiBMb2FkaW5nIC8gZXJyb3IgLyB0YWJsZSAvIGVtcHR5IHN0YXRlICovfVxuICAgICAge2xvYWRpbmcgPyAoXG4gICAgICAgIDxMb2FkaW5nU3Bpbm5lciBsYWJlbD1cIkxvYWRpbmcuLi5cIiBsYXlvdXQ9XCJjZW50ZXJlZFwiIC8+XG4gICAgICApIDogZXJyb3IgPyAoXG4gICAgICAgIDxFcnJvclN0YXRlIHRpdGxlPXt0eXBlb2YgZXJyb3IgPT09IFwic3RyaW5nXCIgPyBlcnJvciA6IFwiU29tZXRoaW5nIHdlbnQgd3JvbmcuXCJ9PlxuICAgICAgICAgIDxUZXh0Pnt0eXBlb2YgZXJyb3IgPT09IFwic3RyaW5nXCIgPyBcIlBsZWFzZSB0cnkgYWdhaW4uXCIgOiBcIkFuIGVycm9yIG9jY3VycmVkIHdoaWxlIGxvYWRpbmcgZGF0YS5cIn08L1RleHQ+XG4gICAgICAgIDwvRXJyb3JTdGF0ZT5cbiAgICAgICkgOiBkaXNwbGF5Um93cy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgIDxGbGV4IGRpcmVjdGlvbj1cImNvbHVtblwiIGFsaWduPVwiY2VudGVyXCIganVzdGlmeT1cImNlbnRlclwiPlxuICAgICAgICAgIDxFbXB0eVN0YXRlIHRpdGxlPXtlbXB0eVRpdGxlfSBsYXlvdXQ9XCJ2ZXJ0aWNhbFwiPlxuICAgICAgICAgICAgPFRleHQ+e2VtcHR5TWVzc2FnZX08L1RleHQ+XG4gICAgICAgICAgPC9FbXB0eVN0YXRlPlxuICAgICAgICA8L0ZsZXg+XG4gICAgICApIDogKFxuICAgICAgICA8VGFibGVcbiAgICAgICAgICBib3JkZXJlZD17Ym9yZGVyZWR9XG4gICAgICAgICAgZmx1c2g9e2ZsdXNofVxuICAgICAgICAgIHBhZ2luYXRlZD17cGFnZUNvdW50ID4gMX1cbiAgICAgICAgICBwYWdlPXthY3RpdmVQYWdlfVxuICAgICAgICAgIHBhZ2VDb3VudD17cGFnZUNvdW50fVxuICAgICAgICAgIG9uUGFnZUNoYW5nZT17aGFuZGxlUGFnZUNoYW5nZX1cbiAgICAgICAgICBzaG93Rmlyc3RMYXN0QnV0dG9ucz17c2hvd0ZpcnN0TGFzdEJ1dHRvbnMgIT0gbnVsbCA/IHNob3dGaXJzdExhc3RCdXR0b25zIDogcGFnZUNvdW50ID4gNX1cbiAgICAgICAgICBzaG93QnV0dG9uTGFiZWxzPXtzaG93QnV0dG9uTGFiZWxzfVxuICAgICAgICAgIHsuLi4obWF4VmlzaWJsZVBhZ2VCdXR0b25zICE9IG51bGwgPyB7IG1heFZpc2libGVQYWdlQnV0dG9ucyB9IDoge30pfVxuICAgICAgICA+XG4gICAgICAgICAgPFRhYmxlSGVhZD5cbiAgICAgICAgICAgIDxUYWJsZVJvdz5cbiAgICAgICAgICAgICAge3NlbGVjdGFibGUgJiYgKFxuICAgICAgICAgICAgICAgIDxUYWJsZUhlYWRlciB3aWR0aD1cIm1pblwiPlxuICAgICAgICAgICAgICAgICAgPENoZWNrYm94XG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJkYXRhdGFibGUtc2VsZWN0LWFsbFwiXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJTZWxlY3QgYWxsIHJvd3NcIlxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXthbGxWaXNpYmxlU2VsZWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVTZWxlY3RBbGx9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvVGFibGVIZWFkZXI+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHtjb2x1bW5zLm1hcCgoY29sKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVhZGVyQWxpZ24gPSAocmVzb2x2ZWRFZGl0TW9kZSA9PT0gXCJpbmxpbmVcIiAmJiBjb2wuZWRpdGFibGUpID8gdW5kZWZpbmVkIDogY29sLmFsaWduO1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8VGFibGVIZWFkZXJcbiAgICAgICAgICAgICAgICAgICAga2V5PXtjb2wuZmllbGR9XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoPXtnZXRIZWFkZXJXaWR0aChjb2wpfVxuICAgICAgICAgICAgICAgICAgICBhbGlnbj17aGVhZGVyQWxpZ259XG4gICAgICAgICAgICAgICAgICAgIHNvcnREaXJlY3Rpb249e2NvbC5zb3J0YWJsZSA/IChzb3J0U3RhdGVbY29sLmZpZWxkXSB8fCBcIm5vbmVcIikgOiBcIm5ldmVyXCJ9XG4gICAgICAgICAgICAgICAgICAgIG9uU29ydENoYW5nZT17Y29sLnNvcnRhYmxlID8gKCkgPT4gaGFuZGxlU29ydENoYW5nZShjb2wuZmllbGQpIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7Y29sLmxhYmVsfVxuICAgICAgICAgICAgICAgICAgPC9UYWJsZUhlYWRlcj5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvVGFibGVSb3c+XG4gICAgICAgICAgPC9UYWJsZUhlYWQ+XG4gICAgICAgICAgPFRhYmxlQm9keT5cbiAgICAgICAgICAgIHtkaXNwbGF5Um93cy5tYXAoKGl0ZW0sIGlkeCkgPT5cbiAgICAgICAgICAgICAgaXRlbS50eXBlID09PSBcImdyb3VwLWhlYWRlclwiID8gKFxuICAgICAgICAgICAgICAgIDxUYWJsZVJvdyBrZXk9e2Bncm91cC0ke2l0ZW0uZ3JvdXAua2V5fWB9PlxuICAgICAgICAgICAgICAgICAge3NlbGVjdGFibGUgJiYgPFRhYmxlQ2VsbCB3aWR0aD1cIm1pblwiIC8+fVxuICAgICAgICAgICAgICAgICAge2NvbHVtbnMubWFwKChjb2wsIGNvbElkeCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8VGFibGVDZWxsIGtleT17Y29sLmZpZWxkfSB3aWR0aD17Z2V0Q2VsbFdpZHRoKGNvbCl9IGFsaWduPXtjb2xJZHggPT09IDAgPyB1bmRlZmluZWQgOiBjb2wuYWxpZ259PlxuICAgICAgICAgICAgICAgICAgICAgIHtjb2xJZHggPT09IDAgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8TGlua1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiZGFya1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRvZ2dsZUdyb3VwKGl0ZW0uZ3JvdXAua2V5KX1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPEZsZXggZGlyZWN0aW9uPVwicm93XCIgYWxpZ249XCJjZW50ZXJcIiBnYXA9XCJ4c1wiIHdyYXA9XCJub3dyYXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPXtleHBhbmRlZEdyb3Vwcy5oYXMoaXRlbS5ncm91cC5rZXkpID8gXCJkb3duQ2FyYXRcIiA6IFwicmlnaHRcIn0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGV4dCBmb3JtYXQ9e3sgZm9udFdlaWdodDogXCJkZW1pYm9sZFwiIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW0uZ3JvdXAubGFiZWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L0ZsZXg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQnkuYWdncmVnYXRpb25zPy5bY29sLmZpZWxkXVxuICAgICAgICAgICAgICAgICAgICAgICAgICA/IGdyb3VwQnkuYWdncmVnYXRpb25zW2NvbC5maWVsZF0oaXRlbS5ncm91cC5yb3dzLCBpdGVtLmdyb3VwLmtleSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBncm91cEJ5Lmdyb3VwVmFsdWVzPy5baXRlbS5ncm91cC5rZXldPy5bY29sLmZpZWxkXSA/PyBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgPC9UYWJsZUNlbGw+XG4gICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L1RhYmxlUm93PlxuICAgICAgICAgICAgICApIDogdXNlQ29sdW1uUmVuZGVyaW5nID8gKFxuICAgICAgICAgICAgICAgIDxUYWJsZVJvdyBrZXk9e2l0ZW0ucm93W3Jvd0lkRmllbGRdID8/IGlkeH0+XG4gICAgICAgICAgICAgICAgICB7c2VsZWN0YWJsZSAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxUYWJsZUNlbGwgd2lkdGg9XCJtaW5cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8Q2hlY2tib3hcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9e2BzZWxlY3QtJHtpdGVtLnJvd1tyb3dJZEZpZWxkXX1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlNlbGVjdCByb3dcIlxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17c2VsZWN0ZWRJZHMuaGFzKGl0ZW0ucm93W3Jvd0lkRmllbGRdKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoY2hlY2tlZCkgPT4gaGFuZGxlU2VsZWN0Um93KGl0ZW0ucm93W3Jvd0lkRmllbGRdLCBjaGVja2VkKX1cbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L1RhYmxlQ2VsbD5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICB7Y29sdW1ucy5tYXAoKGNvbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByb3dJZCA9IGl0ZW0ucm93W3Jvd0lkRmllbGRdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0Rpc2NyZXRlRWRpdGluZyA9IHJlc29sdmVkRWRpdE1vZGUgPT09IFwiZGlzY3JldGVcIiAmJiBlZGl0aW5nQ2VsbD8ucm93SWQgPT09IHJvd0lkICYmIGVkaXRpbmdDZWxsPy5maWVsZCA9PT0gY29sLmZpZWxkO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc1Nob3dpbmdJbnB1dCA9IGlzRGlzY3JldGVFZGl0aW5nIHx8IChyZXNvbHZlZEVkaXRNb2RlID09PSBcImlubGluZVwiICYmIGNvbC5lZGl0YWJsZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIElucHV0IGNvbXBvbmVudHMgZG9uJ3QgcmVzcGVjdCBjZWxsIHRleHQtYWxpZ24g4oCUIHNraXAgYWxpZ24gd2hlbiBzaG93aW5nIGlucHV0c1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjZWxsQWxpZ24gPSBpc1Nob3dpbmdJbnB1dCA/IHVuZGVmaW5lZCA6IGNvbC5hbGlnbjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICA8VGFibGVDZWxsIGtleT17Y29sLmZpZWxkfSB3aWR0aD17aXNEaXNjcmV0ZUVkaXRpbmcgPyBcImF1dG9cIiA6IGdldENlbGxXaWR0aChjb2wpfSBhbGlnbj17Y2VsbEFsaWdufT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtyZW5kZXJDZWxsQ29udGVudChpdGVtLnJvdywgY29sKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L1RhYmxlQ2VsbD5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIDwvVGFibGVSb3c+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgcmVuZGVyUm93KGl0ZW0ucm93KVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvVGFibGVCb2R5PlxuICAgICAgICAgIHtmb290ZXIgJiYgKFxuICAgICAgICAgICAgPFRhYmxlRm9vdGVyPlxuICAgICAgICAgICAgICB7Zm9vdGVyKGZvb3RlckRhdGEpfVxuICAgICAgICAgICAgPC9UYWJsZUZvb3Rlcj5cbiAgICAgICAgICApfVxuICAgICAgICA8L1RhYmxlPlxuICAgICAgKX1cbiAgICA8L0ZsZXg+XG4gICk7XG59O1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VDYWxsYmFjayB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBGbGV4LFxuICBIZWFkaW5nLFxuICBUYWJsZVJvdyxcbiAgVGFibGVDZWxsLFxuICBUYWJsZUhlYWRlcixcbiAgVGV4dCxcbiAgU3RhdHVzVGFnLFxuICBUYWcsXG4gIERpdmlkZXIsXG4gIGh1YnNwb3QsXG59IGZyb20gXCJAaHVic3BvdC91aS1leHRlbnNpb25zXCI7XG5pbXBvcnQgeyBEYXRhVGFibGUgfSBmcm9tIFwiLi9jb21wb25lbnRzL0RhdGFUYWJsZS5qc3hcIjtcblxuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4vLyBTYW1wbGUgZGF0YVxuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG5cbmNvbnN0IFNBTVBMRV9EQVRBID0gW1xuICB7IGlkOiAxLCBuYW1lOiBcIkFjbWUgQ29ycFwiLCBjb250YWN0OiBcIkphbmUgU21pdGhcIiwgc3RhdHVzOiBcImFjdGl2ZVwiLCBjYXRlZ29yeTogXCJlbnRlcnByaXNlXCIsIGFtb3VudDogMTI1MDAwLCBkYXRlOiBcIjIwMjYtMDEtMTVcIiwgcHJpb3JpdHk6IHRydWUgfSxcbiAgeyBpZDogMiwgbmFtZTogXCJHbG9iZXggSW5jXCIsIGNvbnRhY3Q6IFwiQm9iIEpvaG5zb25cIiwgc3RhdHVzOiBcImFjdGl2ZVwiLCBjYXRlZ29yeTogXCJtaWQtbWFya2V0XCIsIGFtb3VudDogNjcwMDAsIGRhdGU6IFwiMjAyNi0wMi0wM1wiLCBwcmlvcml0eTogZmFsc2UgfSxcbiAgeyBpZDogMywgbmFtZTogXCJJbml0ZWNoXCIsIGNvbnRhY3Q6IFwiTWljaGFlbCBCb2x0b25cIiwgc3RhdHVzOiBcImNodXJuZWRcIiwgY2F0ZWdvcnk6IFwic21iXCIsIGFtb3VudDogMTIwMDAsIGRhdGU6IFwiMjAyNS0xMS0yMFwiLCBwcmlvcml0eTogZmFsc2UgfSxcbiAgeyBpZDogNCwgbmFtZTogXCJVbWJyZWxsYSBDb3JwXCIsIGNvbnRhY3Q6IFwiQWxpY2UgV2Vza2VyXCIsIHN0YXR1czogXCJhdC1yaXNrXCIsIGNhdGVnb3J5OiBcImVudGVycHJpc2VcIiwgYW1vdW50OiAyMzAwMDAsIGRhdGU6IFwiMjAyNi0wMy0wMVwiLCBwcmlvcml0eTogdHJ1ZSB9LFxuICB7IGlkOiA1LCBuYW1lOiBcIlN0YXJrIEluZHVzdHJpZXNcIiwgY29udGFjdDogXCJQZXBwZXIgUG90dHNcIiwgc3RhdHVzOiBcImFjdGl2ZVwiLCBjYXRlZ29yeTogXCJlbnRlcnByaXNlXCIsIGFtb3VudDogNDUwMDAwLCBkYXRlOiBcIjIwMjYtMDEtMjhcIiwgcHJpb3JpdHk6IGZhbHNlIH0sXG4gIHsgaWQ6IDYsIG5hbWU6IFwiV2F5bmUgRW50ZXJwcmlzZXNcIiwgY29udGFjdDogXCJMdWNpdXMgRm94XCIsIHN0YXR1czogXCJhY3RpdmVcIiwgY2F0ZWdvcnk6IFwiZW50ZXJwcmlzZVwiLCBhbW91bnQ6IDM4MDAwMCwgZGF0ZTogXCIyMDI1LTEyLTE1XCIsIHByaW9yaXR5OiB0cnVlIH0sXG4gIHsgaWQ6IDcsIG5hbWU6IFwiV29ua2EgSW5kdXN0cmllc1wiLCBjb250YWN0OiBcIkNoYXJsaWUgQnVja2V0XCIsIHN0YXR1czogXCJhdC1yaXNrXCIsIGNhdGVnb3J5OiBcIm1pZC1tYXJrZXRcIiwgYW1vdW50OiA0MjAwMCwgZGF0ZTogXCIyMDI2LTAyLTE0XCIsIHByaW9yaXR5OiBmYWxzZSB9LFxuICB7IGlkOiA4LCBuYW1lOiBcIkN5YmVyZHluZSBTeXN0ZW1zXCIsIGNvbnRhY3Q6IFwiTWlsZXMgRHlzb25cIiwgc3RhdHVzOiBcImNodXJuZWRcIiwgY2F0ZWdvcnk6IFwibWlkLW1hcmtldFwiLCBhbW91bnQ6IDg5MDAwLCBkYXRlOiBcIjIwMjUtMTAtMDVcIiwgcHJpb3JpdHk6IGZhbHNlIH0sXG4gIHsgaWQ6IDksIG5hbWU6IFwiU295bGVudCBDb3JwXCIsIGNvbnRhY3Q6IFwiU29sIFJvdGhcIiwgc3RhdHVzOiBcImFjdGl2ZVwiLCBjYXRlZ29yeTogXCJzbWJcIiwgYW1vdW50OiAxODAwMCwgZGF0ZTogXCIyMDI2LTAzLTEwXCIsIHByaW9yaXR5OiBmYWxzZSB9LFxuICB7IGlkOiAxMCwgbmFtZTogXCJUeXJlbGwgQ29ycFwiLCBjb250YWN0OiBcIkVsZG9uIFR5cmVsbFwiLCBzdGF0dXM6IFwiYWN0aXZlXCIsIGNhdGVnb3J5OiBcImVudGVycHJpc2VcIiwgYW1vdW50OiA1MjAwMDAsIGRhdGU6IFwiMjAyNi0wMS0wNVwiLCBwcmlvcml0eTogdHJ1ZSB9LFxuICB7IGlkOiAxMSwgbmFtZTogXCJQaWVkIFBpcGVyXCIsIGNvbnRhY3Q6IFwiUmljaGFyZCBIZW5kcmlja3NcIiwgc3RhdHVzOiBcImFjdGl2ZVwiLCBjYXRlZ29yeTogXCJzbWJcIiwgYW1vdW50OiAyODAwMCwgZGF0ZTogXCIyMDI2LTAyLTIyXCIsIHByaW9yaXR5OiBmYWxzZSB9LFxuICB7IGlkOiAxMiwgbmFtZTogXCJIb29saVwiLCBjb250YWN0OiBcIkdhdmluIEJlbHNvblwiLCBzdGF0dXM6IFwiYXQtcmlza1wiLCBjYXRlZ29yeTogXCJlbnRlcnByaXNlXCIsIGFtb3VudDogMTc1MDAwLCBkYXRlOiBcIjIwMjUtMTItMzBcIiwgcHJpb3JpdHk6IHRydWUgfSxcbl07XG5cbi8vIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuLy8gU3RhdHVzIGhlbHBlcnNcbi8vIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuXG5jb25zdCBTVEFUVVNfQ09MT1JTID0ge1xuICBhY3RpdmU6IFwic3VjY2Vzc1wiLFxuICBcImF0LXJpc2tcIjogXCJ3YXJuaW5nXCIsXG4gIGNodXJuZWQ6IFwiZGFuZ2VyXCIsXG59O1xuXG5jb25zdCBTVEFUVVNfTEFCRUxTID0ge1xuICBhY3RpdmU6IFwiQWN0aXZlXCIsXG4gIFwiYXQtcmlza1wiOiBcIkF0IFJpc2tcIixcbiAgY2h1cm5lZDogXCJDaHVybmVkXCIsXG59O1xuXG5jb25zdCBmb3JtYXRDdXJyZW5jeSA9ICh2YWwpID0+XG4gIG5ldyBJbnRsLk51bWJlckZvcm1hdChcImVuLVVTXCIsIHsgc3R5bGU6IFwiY3VycmVuY3lcIiwgY3VycmVuY3k6IFwiVVNEXCIsIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMCB9KS5mb3JtYXQodmFsKTtcblxuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4vLyBEZW1vIDE6IEZ1bGwtZmVhdHVyZWQgKGZpbHRlcnMsIHNvcnQsIHBhZ2luYXRpb24sIGZvb3Rlcilcbi8vIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuXG5jb25zdCBGVUxMX0NPTFVNTlMgPSBbXG4gIHtcbiAgICBmaWVsZDogXCJuYW1lXCIsIGxhYmVsOiBcIkNvbXBhbnlcIiwgc29ydGFibGU6IHRydWUsXG4gICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gPFRleHQgZm9ybWF0PXt7IGZvbnRXZWlnaHQ6IFwiZGVtaWJvbGRcIiB9fT57dmFsfTwvVGV4dD5cbiAgfSxcbiAge1xuICAgIGZpZWxkOiBcImNvbnRhY3RcIiwgbGFiZWw6IFwiQ29udGFjdFwiLCBzb3J0YWJsZTogdHJ1ZSxcbiAgICByZW5kZXJDZWxsOiAodmFsKSA9PiB2YWxcbiAgfSxcbiAge1xuICAgIGZpZWxkOiBcInN0YXR1c1wiLCBsYWJlbDogXCJTdGF0dXNcIiwgc29ydGFibGU6IHRydWUsXG4gICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gPFN0YXR1c1RhZyB2YXJpYW50PXtTVEFUVVNfQ09MT1JTW3ZhbF19PntTVEFUVVNfTEFCRUxTW3ZhbF19PC9TdGF0dXNUYWc+XG4gIH0sXG4gIHtcbiAgICBmaWVsZDogXCJjYXRlZ29yeVwiLCBsYWJlbDogXCJTZWdtZW50XCIsIHNvcnRhYmxlOiB0cnVlLFxuICAgIHJlbmRlckNlbGw6ICh2YWwpID0+IDxUYWcgdmFyaWFudD1cImRlZmF1bHRcIj57dmFsfTwvVGFnPlxuICB9LFxuICB7XG4gICAgZmllbGQ6IFwiYW1vdW50XCIsIGxhYmVsOiBcIkFtb3VudFwiLCBzb3J0YWJsZTogdHJ1ZSwgYWxpZ246IFwicmlnaHRcIixcbiAgICByZW5kZXJDZWxsOiAodmFsKSA9PiBmb3JtYXRDdXJyZW5jeSh2YWwpXG4gIH0sXG4gIHtcbiAgICBmaWVsZDogXCJkYXRlXCIsIGxhYmVsOiBcIkNsb3NlIERhdGVcIiwgc29ydGFibGU6IHRydWUsXG4gICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gbmV3IERhdGUodmFsKS50b0xvY2FsZURhdGVTdHJpbmcoXCJlbi1VU1wiLCB7IG1vbnRoOiBcInNob3J0XCIsIGRheTogXCJudW1lcmljXCIsIHllYXI6IFwibnVtZXJpY1wiIH0pXG4gIH0sXG5dO1xuXG5jb25zdCBGVUxMX0ZJTFRFUlMgPSBbXG4gIHtcbiAgICBuYW1lOiBcInN0YXR1c1wiLFxuICAgIHR5cGU6IFwic2VsZWN0XCIsXG4gICAgcGxhY2Vob2xkZXI6IFwiQWxsIHN0YXR1c2VzXCIsXG4gICAgb3B0aW9uczogW1xuICAgICAgeyBsYWJlbDogXCJBY3RpdmVcIiwgdmFsdWU6IFwiYWN0aXZlXCIgfSxcbiAgICAgIHsgbGFiZWw6IFwiQXQgUmlza1wiLCB2YWx1ZTogXCJhdC1yaXNrXCIgfSxcbiAgICAgIHsgbGFiZWw6IFwiQ2h1cm5lZFwiLCB2YWx1ZTogXCJjaHVybmVkXCIgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgbmFtZTogXCJjYXRlZ29yeVwiLFxuICAgIHR5cGU6IFwic2VsZWN0XCIsXG4gICAgcGxhY2Vob2xkZXI6IFwiQWxsIHNlZ21lbnRzXCIsXG4gICAgb3B0aW9uczogW1xuICAgICAgeyBsYWJlbDogXCJFbnRlcnByaXNlXCIsIHZhbHVlOiBcImVudGVycHJpc2VcIiB9LFxuICAgICAgeyBsYWJlbDogXCJNaWQtTWFya2V0XCIsIHZhbHVlOiBcIm1pZC1tYXJrZXRcIiB9LFxuICAgICAgeyBsYWJlbDogXCJTTUJcIiwgdmFsdWU6IFwic21iXCIgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgbmFtZTogXCJkYXRlXCIsXG4gICAgdHlwZTogXCJkYXRlUmFuZ2VcIixcbiAgICBwbGFjZWhvbGRlcjogXCJDbG9zZSBkYXRlXCIsXG4gIH0sXG5dO1xuXG5jb25zdCBGdWxsRmVhdHVyZWREZW1vID0gKCkgPT4gKFxuICA8RmxleCBkaXJlY3Rpb249XCJjb2x1bW5cIiBnYXA9XCJzbVwiPlxuICAgIDxIZWFkaW5nPkZ1bGwtRmVhdHVyZWQgRGF0YVRhYmxlPC9IZWFkaW5nPlxuICAgIDxUZXh0IHZhcmlhbnQ9XCJtaWNyb2NvcHlcIj5cbiAgICAgIFNlYXJjaCwgZmlsdGVyLCBzb3J0LCBwYWdpbmF0ZSwgZm9vdGVyIHN1bW1hcnkuIE5vIGV4cGxpY2l0IHdpZHRocyDigJQgYXV0by13aWR0aCBzaXplcyBjb2x1bW5zIGZyb20gY29udGVudC5cbiAgICA8L1RleHQ+XG4gICAgPERhdGFUYWJsZVxuICAgICAgZGF0YT17U0FNUExFX0RBVEF9XG4gICAgICBjb2x1bW5zPXtGVUxMX0NPTFVNTlN9XG4gICAgICByZW5kZXJSb3c9eyhyb3cpID0+IChcbiAgICAgICAgPFRhYmxlUm93IGtleT17cm93LmlkfT5cbiAgICAgICAgICA8VGFibGVDZWxsPjxUZXh0IGZvcm1hdD17eyBmb250V2VpZ2h0OiBcImRlbWlib2xkXCIgfX0+e3Jvdy5uYW1lfTwvVGV4dD48L1RhYmxlQ2VsbD5cbiAgICAgICAgICA8VGFibGVDZWxsPntyb3cuY29udGFjdH08L1RhYmxlQ2VsbD5cbiAgICAgICAgICA8VGFibGVDZWxsPjxTdGF0dXNUYWcgdmFyaWFudD17U1RBVFVTX0NPTE9SU1tyb3cuc3RhdHVzXX0+e1NUQVRVU19MQUJFTFNbcm93LnN0YXR1c119PC9TdGF0dXNUYWc+PC9UYWJsZUNlbGw+XG4gICAgICAgICAgPFRhYmxlQ2VsbD48VGFnIHZhcmlhbnQ9XCJkZWZhdWx0XCI+e3Jvdy5jYXRlZ29yeX08L1RhZz48L1RhYmxlQ2VsbD5cbiAgICAgICAgICA8VGFibGVDZWxsIGFsaWduPVwicmlnaHRcIj57Zm9ybWF0Q3VycmVuY3kocm93LmFtb3VudCl9PC9UYWJsZUNlbGw+XG4gICAgICAgICAgPFRhYmxlQ2VsbD57bmV3IERhdGUocm93LmRhdGUpLnRvTG9jYWxlRGF0ZVN0cmluZyhcImVuLVVTXCIsIHsgbW9udGg6IFwic2hvcnRcIiwgZGF5OiBcIm51bWVyaWNcIiwgeWVhcjogXCJudW1lcmljXCIgfSl9PC9UYWJsZUNlbGw+XG4gICAgICAgIDwvVGFibGVSb3c+XG4gICAgICApfVxuICAgICAgc2VhcmNoRmllbGRzPXtbXCJuYW1lXCIsIFwiY29udGFjdFwiXX1cbiAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIGNvbXBhbmllcyBvciBjb250YWN0cy4uLlwiXG4gICAgICBmaWx0ZXJzPXtGVUxMX0ZJTFRFUlN9XG4gICAgICBwYWdlU2l6ZT17NX1cbiAgICAgIGRlZmF1bHRTb3J0PXt7IGFtb3VudDogXCJkZXNjZW5kaW5nXCIgfX1cbiAgICAgIGZvb3Rlcj17KGZpbHRlcmVkRGF0YSkgPT4gKFxuICAgICAgICA8VGFibGVSb3c+XG4gICAgICAgICAgPFRhYmxlSGVhZGVyPlRvdGFsPC9UYWJsZUhlYWRlcj5cbiAgICAgICAgICA8VGFibGVIZWFkZXI+PC9UYWJsZUhlYWRlcj5cbiAgICAgICAgICA8VGFibGVIZWFkZXI+PC9UYWJsZUhlYWRlcj5cbiAgICAgICAgICA8VGFibGVIZWFkZXI+PC9UYWJsZUhlYWRlcj5cbiAgICAgICAgICA8VGFibGVIZWFkZXIgYWxpZ249XCJyaWdodFwiPlxuICAgICAgICAgICAge2Zvcm1hdEN1cnJlbmN5KGZpbHRlcmVkRGF0YS5yZWR1Y2UoKHN1bSwgcikgPT4gc3VtICsgci5hbW91bnQsIDApKX1cbiAgICAgICAgICA8L1RhYmxlSGVhZGVyPlxuICAgICAgICAgIDxUYWJsZUhlYWRlcj48L1RhYmxlSGVhZGVyPlxuICAgICAgICA8L1RhYmxlUm93PlxuICAgICAgKX1cbiAgICAvPlxuICA8L0ZsZXg+XG4pO1xuXG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcbi8vIERlbW8gMjogU2VsZWN0YWJsZSByb3dzXG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcblxuY29uc3QgU0VMRUNUX0NPTFVNTlMgPSBbXG4gIHtcbiAgICBmaWVsZDogXCJuYW1lXCIsIGxhYmVsOiBcIkNvbXBhbnlcIiwgc29ydGFibGU6IHRydWUsXG4gICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gPFRleHQgZm9ybWF0PXt7IGZvbnRXZWlnaHQ6IFwiZGVtaWJvbGRcIiB9fT57dmFsfTwvVGV4dD5cbiAgfSxcbiAge1xuICAgIGZpZWxkOiBcImNvbnRhY3RcIiwgbGFiZWw6IFwiQ29udGFjdFwiLFxuICAgIHJlbmRlckNlbGw6ICh2YWwpID0+IHZhbFxuICB9LFxuICB7XG4gICAgZmllbGQ6IFwic3RhdHVzXCIsIGxhYmVsOiBcIlN0YXR1c1wiLFxuICAgIHJlbmRlckNlbGw6ICh2YWwpID0+IDxTdGF0dXNUYWcgdmFyaWFudD17U1RBVFVTX0NPTE9SU1t2YWxdfT57U1RBVFVTX0xBQkVMU1t2YWxdfTwvU3RhdHVzVGFnPlxuICB9LFxuICB7XG4gICAgZmllbGQ6IFwiYW1vdW50XCIsIGxhYmVsOiBcIkFtb3VudFwiLCBzb3J0YWJsZTogdHJ1ZSwgYWxpZ246IFwicmlnaHRcIixcbiAgICByZW5kZXJDZWxsOiAodmFsKSA9PiBmb3JtYXRDdXJyZW5jeSh2YWwpXG4gIH0sXG5dO1xuXG5jb25zdCBTZWxlY3RhYmxlRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW3NlbGVjdGVkLCBzZXRTZWxlY3RlZF0gPSB1c2VTdGF0ZShbXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8RmxleCBkaXJlY3Rpb249XCJjb2x1bW5cIiBnYXA9XCJzbVwiPlxuICAgICAgPEhlYWRpbmc+Um93IFNlbGVjdGlvbjwvSGVhZGluZz5cbiAgICAgIDxUZXh0IHZhcmlhbnQ9XCJtaWNyb2NvcHlcIj5cbiAgICAgICAgU2VsZWN0IGluZGl2aWR1YWwgcm93cyBvciB1c2UgdGhlIGhlYWRlciBjaGVja2JveCB0byBzZWxlY3QgYWxsLlxuICAgICAgICB7c2VsZWN0ZWQubGVuZ3RoID4gMCAmJiBgICgke3NlbGVjdGVkLmxlbmd0aH0gc2VsZWN0ZWQpYH1cbiAgICAgIDwvVGV4dD5cbiAgICAgIDxEYXRhVGFibGVcbiAgICAgICAgZGF0YT17U0FNUExFX0RBVEF9XG4gICAgICAgIGNvbHVtbnM9e1NFTEVDVF9DT0xVTU5TfVxuICAgICAgICBzZWxlY3RhYmxlPXt0cnVlfVxuICAgICAgICByb3dJZEZpZWxkPVwiaWRcIlxuICAgICAgICBvblNlbGVjdGlvbkNoYW5nZT17c2V0U2VsZWN0ZWR9XG4gICAgICAgIHNlYXJjaEZpZWxkcz17W1wibmFtZVwiXX1cbiAgICAgICAgcGFnZVNpemU9ezV9XG4gICAgICAvPlxuICAgIDwvRmxleD5cbiAgKTtcbn07XG5cbi8vIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuLy8gRGVtbyAzOiBJbmxpbmUgZWRpdGluZ1xuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG5cbmNvbnN0IEVkaXRhYmxlRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW2RhdGEsIHNldERhdGFdID0gdXNlU3RhdGUoU0FNUExFX0RBVEEpO1xuXG4gIGNvbnN0IGhhbmRsZUVkaXQgPSB1c2VDYWxsYmFjaygocm93LCBmaWVsZCwgbmV3VmFsdWUpID0+IHtcbiAgICBzZXREYXRhKChwcmV2KSA9PlxuICAgICAgcHJldi5tYXAoKHIpID0+IChyLmlkID09PSByb3cuaWQgPyB7IC4uLnIsIFtmaWVsZF06IG5ld1ZhbHVlIH0gOiByKSlcbiAgICApO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgZWRpdENvbHVtbnMgPSBbXG4gICAge1xuICAgICAgZmllbGQ6IFwibmFtZVwiLCBsYWJlbDogXCJDb21wYW55XCIsIHNvcnRhYmxlOiB0cnVlLFxuICAgICAgZWRpdGFibGU6IHRydWUsIGVkaXRUeXBlOiBcInRleHRcIixcbiAgICAgIGVkaXRWYWxpZGF0ZTogKHZhbCkgPT4ge1xuICAgICAgICBpZiAoIXZhbCB8fCB2YWwudHJpbSgpID09PSBcIlwiKSByZXR1cm4gXCJDb21wYW55IG5hbWUgaXMgcmVxdWlyZWRcIjtcbiAgICAgICAgaWYgKHZhbC5sZW5ndGggPCAyKSByZXR1cm4gXCJNdXN0IGJlIGF0IGxlYXN0IDIgY2hhcmFjdGVyc1wiO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICByZW5kZXJDZWxsOiAodmFsKSA9PiA8VGV4dCBmb3JtYXQ9e3sgZm9udFdlaWdodDogXCJkZW1pYm9sZFwiIH19Pnt2YWx9PC9UZXh0PlxuICAgIH0sXG4gICAge1xuICAgICAgZmllbGQ6IFwiY29udGFjdFwiLCBsYWJlbDogXCJDb250YWN0XCIsXG4gICAgICBlZGl0YWJsZTogdHJ1ZSwgZWRpdFR5cGU6IFwidGV4dFwiLFxuICAgICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gdmFsXG4gICAgfSxcbiAgICB7XG4gICAgICBmaWVsZDogXCJzdGF0dXNcIiwgbGFiZWw6IFwiU3RhdHVzXCIsXG4gICAgICBlZGl0YWJsZTogdHJ1ZSwgZWRpdFR5cGU6IFwic2VsZWN0XCIsXG4gICAgICBlZGl0T3B0aW9uczogW1xuICAgICAgICB7IGxhYmVsOiBcIkFjdGl2ZVwiLCB2YWx1ZTogXCJhY3RpdmVcIiB9LFxuICAgICAgICB7IGxhYmVsOiBcIkF0IFJpc2tcIiwgdmFsdWU6IFwiYXQtcmlza1wiIH0sXG4gICAgICAgIHsgbGFiZWw6IFwiQ2h1cm5lZFwiLCB2YWx1ZTogXCJjaHVybmVkXCIgfSxcbiAgICAgIF0sXG4gICAgICByZW5kZXJDZWxsOiAodmFsKSA9PiA8U3RhdHVzVGFnIHZhcmlhbnQ9e1NUQVRVU19DT0xPUlNbdmFsXX0+e1NUQVRVU19MQUJFTFNbdmFsXX08L1N0YXR1c1RhZz5cbiAgICB9LFxuICAgIHtcbiAgICAgIGZpZWxkOiBcImFtb3VudFwiLCBsYWJlbDogXCJBbW91bnRcIiwgc29ydGFibGU6IHRydWUsIGFsaWduOiBcInJpZ2h0XCIsXG4gICAgICBlZGl0YWJsZTogdHJ1ZSwgZWRpdFR5cGU6IFwiY3VycmVuY3lcIixcbiAgICAgIGVkaXRWYWxpZGF0ZTogKHZhbCkgPT4ge1xuICAgICAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gXCJcIikgcmV0dXJuIFwiQW1vdW50IGlzIHJlcXVpcmVkXCI7XG4gICAgICAgIGlmIChOdW1iZXIodmFsKSA8IDApIHJldHVybiBcIkFtb3VudCBjYW5ub3QgYmUgbmVnYXRpdmVcIjtcbiAgICAgICAgaWYgKE51bWJlcih2YWwpID4gMTAwMDAwMCkgcmV0dXJuIFwiQW1vdW50IGNhbm5vdCBleGNlZWQgJDEsMDAwLDAwMFwiO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICByZW5kZXJDZWxsOiAodmFsKSA9PiBmb3JtYXRDdXJyZW5jeSh2YWwpXG4gICAgfSxcbiAgICB7XG4gICAgICBmaWVsZDogXCJwcmlvcml0eVwiLCBsYWJlbDogXCJQcmlvcml0eVwiLFxuICAgICAgZWRpdGFibGU6IHRydWUsIGVkaXRUeXBlOiBcInNlbGVjdFwiLFxuICAgICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gdmFsID8gPFRhZyB2YXJpYW50PVwic3VjY2Vzc1wiPlllczwvVGFnPiA6IDxUYWcgdmFyaWFudD1cImRhbmdlclwiPk5vPC9UYWc+XG4gICAgfSxcbiAgXTtcblxuICByZXR1cm4gKFxuICAgIDxGbGV4IGRpcmVjdGlvbj1cImNvbHVtblwiIGdhcD1cInNtXCI+XG4gICAgICA8SGVhZGluZz5JbmxpbmUgRWRpdGluZzwvSGVhZGluZz5cbiAgICAgIDxUZXh0IHZhcmlhbnQ9XCJtaWNyb2NvcHlcIj5cbiAgICAgICAgQ2xpY2sgYW55IGhpZ2hsaWdodGVkIGNlbGwgdG8gZWRpdC4gVGV4dC9udW1iZXIgZmllbGRzIHNob3cgU2F2ZS9DYW5jZWwuIERyb3Bkb3ducyBhbmQgdG9nZ2xlcyBjb21taXQgaW5zdGFudGx5LlxuICAgICAgPC9UZXh0PlxuICAgICAgPERhdGFUYWJsZVxuICAgICAgICBkYXRhPXtkYXRhfVxuICAgICAgICBjb2x1bW5zPXtlZGl0Q29sdW1uc31cbiAgICAgICAgcm93SWRGaWVsZD1cImlkXCJcbiAgICAgICAgb25Sb3dFZGl0PXtoYW5kbGVFZGl0fVxuICAgICAgICBzZWFyY2hGaWVsZHM9e1tcIm5hbWVcIiwgXCJjb250YWN0XCJdfVxuICAgICAgICBwYWdlU2l6ZT17Nn1cbiAgICAgIC8+XG4gICAgPC9GbGV4PlxuICApO1xufTtcblxuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4vLyBEZW1vIDNiOiBJbmxpbmUgZWRpdGluZyAoYWx3YXlzLXZpc2libGUgaW5wdXRzKVxuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG5cbmNvbnN0IElubGluZUVkaXREZW1vID0gKCkgPT4ge1xuICBjb25zdCBbZGF0YSwgc2V0RGF0YV0gPSB1c2VTdGF0ZShTQU1QTEVfREFUQSk7XG5cbiAgY29uc3QgaGFuZGxlRWRpdCA9IHVzZUNhbGxiYWNrKChyb3csIGZpZWxkLCBuZXdWYWx1ZSkgPT4ge1xuICAgIHNldERhdGEoKHByZXYpID0+XG4gICAgICBwcmV2Lm1hcCgocikgPT4gKHIuaWQgPT09IHJvdy5pZCA/IHsgLi4uciwgW2ZpZWxkXTogbmV3VmFsdWUgfSA6IHIpKVxuICAgICk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBpbmxpbmVDb2x1bW5zID0gW1xuICAgIHtcbiAgICAgIGZpZWxkOiBcIm5hbWVcIiwgbGFiZWw6IFwiQ29tcGFueVwiLFxuICAgICAgZWRpdGFibGU6IHRydWUsIGVkaXRUeXBlOiBcInRleHRcIixcbiAgICAgIHJlbmRlckNlbGw6ICh2YWwpID0+IHZhbFxuICAgIH0sXG4gICAge1xuICAgICAgZmllbGQ6IFwiY29udGFjdFwiLCBsYWJlbDogXCJDb250YWN0XCIsXG4gICAgICBlZGl0YWJsZTogdHJ1ZSwgZWRpdFR5cGU6IFwidGV4dFwiLFxuICAgICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gdmFsXG4gICAgfSxcbiAgICB7XG4gICAgICBmaWVsZDogXCJzdGF0dXNcIiwgbGFiZWw6IFwiU3RhdHVzXCIsXG4gICAgICBlZGl0YWJsZTogdHJ1ZSwgZWRpdFR5cGU6IFwic2VsZWN0XCIsXG4gICAgICBlZGl0T3B0aW9uczogW1xuICAgICAgICB7IGxhYmVsOiBcIkFjdGl2ZVwiLCB2YWx1ZTogXCJhY3RpdmVcIiB9LFxuICAgICAgICB7IGxhYmVsOiBcIkF0IFJpc2tcIiwgdmFsdWU6IFwiYXQtcmlza1wiIH0sXG4gICAgICAgIHsgbGFiZWw6IFwiQ2h1cm5lZFwiLCB2YWx1ZTogXCJjaHVybmVkXCIgfSxcbiAgICAgIF0sXG4gICAgICByZW5kZXJDZWxsOiAodmFsKSA9PiB2YWxcbiAgICB9LFxuICAgIHtcbiAgICAgIGZpZWxkOiBcImFtb3VudFwiLCBsYWJlbDogXCJBbW91bnRcIiwgYWxpZ246IFwicmlnaHRcIixcbiAgICAgIGVkaXRhYmxlOiB0cnVlLCBlZGl0VHlwZTogXCJjdXJyZW5jeVwiLFxuICAgICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gZm9ybWF0Q3VycmVuY3kodmFsKVxuICAgIH0sXG4gICAge1xuICAgICAgZmllbGQ6IFwicHJpb3JpdHlcIiwgbGFiZWw6IFwiUHJpb3JpdHlcIixcbiAgICAgIGVkaXRhYmxlOiB0cnVlLCBlZGl0VHlwZTogXCJjaGVja2JveFwiLFxuICAgICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gdmFsID8gXCJZZXNcIiA6IFwiTm9cIlxuICAgIH0sXG4gIF07XG5cbiAgcmV0dXJuIChcbiAgICA8RmxleCBkaXJlY3Rpb249XCJjb2x1bW5cIiBnYXA9XCJzbVwiPlxuICAgICAgPEhlYWRpbmc+SW5saW5lIEVkaXQgTW9kZTwvSGVhZGluZz5cbiAgICAgIDxUZXh0IHZhcmlhbnQ9XCJtaWNyb2NvcHlcIj5cbiAgICAgICAgQWxsIGVkaXRhYmxlIGNlbGxzIGFsd2F5cyBzaG93IHRoZWlyIGlucHV0IGNvbnRyb2xzLiBDaGFuZ2VzIGZpcmUgaW1tZWRpYXRlbHkuXG4gICAgICA8L1RleHQ+XG4gICAgICA8RGF0YVRhYmxlXG4gICAgICAgIGRhdGE9e2RhdGF9XG4gICAgICAgIGNvbHVtbnM9e2lubGluZUNvbHVtbnN9XG4gICAgICAgIHJvd0lkRmllbGQ9XCJpZFwiXG4gICAgICAgIGVkaXRNb2RlPVwiaW5saW5lXCJcbiAgICAgICAgb25Sb3dFZGl0PXtoYW5kbGVFZGl0fVxuICAgICAgICBwYWdlU2l6ZT17NX1cbiAgICAgIC8+XG4gICAgPC9GbGV4PlxuICApO1xufTtcblxuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4vLyBEZW1vIDQ6IEdyb3VwZWQgcm93c1xuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG5cbmNvbnN0IEdST1VQX0NPTFVNTlMgPSBbXG4gIHtcbiAgICBmaWVsZDogXCJuYW1lXCIsIGxhYmVsOiBcIkNvbXBhbnlcIixcbiAgICByZW5kZXJDZWxsOiAodmFsKSA9PiB2YWxcbiAgfSxcbiAgeyBmaWVsZDogXCJjb250YWN0XCIsIGxhYmVsOiBcIkNvbnRhY3RcIiwgcmVuZGVyQ2VsbDogKHZhbCkgPT4gdmFsIH0sXG4gIHtcbiAgICBmaWVsZDogXCJzdGF0dXNcIiwgbGFiZWw6IFwiU3RhdHVzXCIsXG4gICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gPFN0YXR1c1RhZyB2YXJpYW50PXtTVEFUVVNfQ09MT1JTW3ZhbF19PntTVEFUVVNfTEFCRUxTW3ZhbF19PC9TdGF0dXNUYWc+XG4gIH0sXG4gIHtcbiAgICBmaWVsZDogXCJhbW91bnRcIiwgbGFiZWw6IFwiQW1vdW50XCIsIGFsaWduOiBcInJpZ2h0XCIsXG4gICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gZm9ybWF0Q3VycmVuY3kodmFsKVxuICB9LFxuXTtcblxuY29uc3QgR3JvdXBlZERlbW8gPSAoKSA9PiAoXG4gIDxGbGV4IGRpcmVjdGlvbj1cImNvbHVtblwiIGdhcD1cInNtXCI+XG4gICAgPEhlYWRpbmc+Um93IEdyb3VwaW5nPC9IZWFkaW5nPlxuICAgIDxUZXh0IHZhcmlhbnQ9XCJtaWNyb2NvcHlcIj5cbiAgICAgIENvbGxhcHNpYmxlIGdyb3VwcyB3aXRoIGFnZ3JlZ2F0ZWQgdG90YWxzLiBDbGljayBhIGdyb3VwIHRvIGV4cGFuZC9jb2xsYXBzZS5cbiAgICA8L1RleHQ+XG4gICAgPERhdGFUYWJsZVxuICAgICAgZGF0YT17U0FNUExFX0RBVEF9XG4gICAgICBjb2x1bW5zPXtHUk9VUF9DT0xVTU5TfVxuICAgICAgZ3JvdXBCeT17e1xuICAgICAgICBmaWVsZDogXCJjYXRlZ29yeVwiLFxuICAgICAgICBsYWJlbDogKHZhbHVlLCByb3dzKSA9PiBgJHt2YWx1ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHZhbHVlLnNsaWNlKDEpfSAoJHtyb3dzLmxlbmd0aH0pYCxcbiAgICAgICAgc29ydDogXCJhc2NcIixcbiAgICAgICAgYWdncmVnYXRpb25zOiB7XG4gICAgICAgICAgYW1vdW50OiAocm93cykgPT4gZm9ybWF0Q3VycmVuY3kocm93cy5yZWR1Y2UoKHN1bSwgcikgPT4gc3VtICsgci5hbW91bnQsIDApKSxcbiAgICAgICAgICBzdGF0dXM6IChyb3dzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhY3RpdmUgPSByb3dzLmZpbHRlcigocikgPT4gci5zdGF0dXMgPT09IFwiYWN0aXZlXCIpLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiA8VGV4dCB2YXJpYW50PVwibWljcm9jb3B5XCI+e2FjdGl2ZX0gb2Yge3Jvd3MubGVuZ3RofSBhY3RpdmU8L1RleHQ+O1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9fVxuICAgICAgcGFnZVNpemU9ezMwfVxuICAgIC8+XG4gIDwvRmxleD5cbik7XG5cbi8vIOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkFxuLy8gRGVtbyA1OiBTZXJ2ZXItc2lkZSBtb2RlIChzaW11bGF0ZWQpXG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcblxuY29uc3QgU0VSVkVSX0NPTFVNTlMgPSBbXG4gIHtcbiAgICBmaWVsZDogXCJuYW1lXCIsIGxhYmVsOiBcIkNvbXBhbnlcIiwgc29ydGFibGU6IHRydWUsXG4gICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gPFRleHQgZm9ybWF0PXt7IGZvbnRXZWlnaHQ6IFwiZGVtaWJvbGRcIiB9fT57dmFsfTwvVGV4dD5cbiAgfSxcbiAge1xuICAgIGZpZWxkOiBcImNvbnRhY3RcIiwgbGFiZWw6IFwiQ29udGFjdFwiLFxuICAgIHJlbmRlckNlbGw6ICh2YWwpID0+IHZhbFxuICB9LFxuICB7XG4gICAgZmllbGQ6IFwic3RhdHVzXCIsIGxhYmVsOiBcIlN0YXR1c1wiLCBzb3J0YWJsZTogdHJ1ZSxcbiAgICByZW5kZXJDZWxsOiAodmFsKSA9PiA8U3RhdHVzVGFnIHZhcmlhbnQ9e1NUQVRVU19DT0xPUlNbdmFsXX0+e1NUQVRVU19MQUJFTFNbdmFsXX08L1N0YXR1c1RhZz5cbiAgfSxcbiAge1xuICAgIGZpZWxkOiBcImFtb3VudFwiLCBsYWJlbDogXCJBbW91bnRcIiwgc29ydGFibGU6IHRydWUsIGFsaWduOiBcInJpZ2h0XCIsXG4gICAgcmVuZGVyQ2VsbDogKHZhbCkgPT4gZm9ybWF0Q3VycmVuY3kodmFsKVxuICB9LFxuXTtcblxuY29uc3QgU2VydmVyU2lkZURlbW8gPSAoKSA9PiB7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW3BhZ2UsIHNldFBhZ2VdID0gdXNlU3RhdGUoMSk7XG4gIGNvbnN0IFtzZWFyY2gsIHNldFNlYXJjaF0gPSB1c2VTdGF0ZShcIlwiKTtcbiAgY29uc3QgcGFnZVNpemUgPSA0O1xuXG4gIC8vIFNpbXVsYXRlIHNlcnZlci1zaWRlOiBmaWx0ZXIgdGhlbiBzbGljZVxuICBjb25zdCBmaWx0ZXJlZCA9IHNlYXJjaFxuICAgID8gU0FNUExFX0RBVEEuZmlsdGVyKChyKSA9PlxuICAgICAgICByLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2gudG9Mb3dlckNhc2UoKSkgfHxcbiAgICAgICAgci5jb250YWN0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoLnRvTG93ZXJDYXNlKCkpXG4gICAgICApXG4gICAgOiBTQU1QTEVfREFUQTtcbiAgY29uc3QgcGFnZURhdGEgPSBmaWx0ZXJlZC5zbGljZSgocGFnZSAtIDEpICogcGFnZVNpemUsIHBhZ2UgKiBwYWdlU2l6ZSk7XG5cbiAgY29uc3Qgc2ltdWxhdGVMb2FkID0gKCkgPT4ge1xuICAgIHNldExvYWRpbmcodHJ1ZSk7XG4gICAgc2V0RXJyb3IobnVsbCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBzZXRMb2FkaW5nKGZhbHNlKSwgMjAwMCk7XG4gIH07XG5cbiAgY29uc3Qgc2ltdWxhdGVFcnJvciA9ICgpID0+IHtcbiAgICBzZXRFcnJvcihcIkZhaWxlZCB0byBmZXRjaCBkYXRhIGZyb20gc2VydmVyLlwiKTtcbiAgfTtcblxuICBjb25zdCBjbGVhckVycm9yID0gKCkgPT4ge1xuICAgIHNldEVycm9yKG51bGwpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPEZsZXggZGlyZWN0aW9uPVwiY29sdW1uXCIgZ2FwPVwic21cIj5cbiAgICAgIDxIZWFkaW5nPlNlcnZlci1TaWRlIE1vZGU8L0hlYWRpbmc+XG4gICAgICA8VGV4dCB2YXJpYW50PVwibWljcm9jb3B5XCI+XG4gICAgICAgIFNpbXVsYXRlZCBzZXJ2ZXItc2lkZSB3aXRoIGxvYWRpbmcvZXJyb3Igc3RhdGVzLiBVc2UgdGhlIGJ1dHRvbnMgdG8gdGVzdCBlYWNoIHN0YXRlLlxuICAgICAgPC9UZXh0PlxuICAgICAgPEZsZXggZGlyZWN0aW9uPVwicm93XCIgZ2FwPVwic21cIj5cbiAgICAgICAgPEJ1dHRvbiBzaXplPVwic21hbGxcIiBvbkNsaWNrPXtzaW11bGF0ZUxvYWR9PlNpbXVsYXRlIExvYWRpbmcgKDJzKTwvQnV0dG9uPlxuICAgICAgICA8QnV0dG9uIHNpemU9XCJzbWFsbFwiIHZhcmlhbnQ9XCJkZXN0cnVjdGl2ZVwiIG9uQ2xpY2s9e3NpbXVsYXRlRXJyb3J9PlNpbXVsYXRlIEVycm9yPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b24gc2l6ZT1cInNtYWxsXCIgdmFyaWFudD1cInNlY29uZGFyeVwiIG9uQ2xpY2s9e2NsZWFyRXJyb3J9PkNsZWFyIEVycm9yPC9CdXR0b24+XG4gICAgICA8L0ZsZXg+XG4gICAgICA8RGF0YVRhYmxlXG4gICAgICAgIHNlcnZlclNpZGU9e3RydWV9XG4gICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgIGVycm9yPXtlcnJvcn1cbiAgICAgICAgZGF0YT17cGFnZURhdGF9XG4gICAgICAgIHRvdGFsQ291bnQ9e2ZpbHRlcmVkLmxlbmd0aH1cbiAgICAgICAgY29sdW1ucz17U0VSVkVSX0NPTFVNTlN9XG4gICAgICAgIHNlYXJjaEZpZWxkcz17W1wibmFtZVwiLCBcImNvbnRhY3RcIl19XG4gICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIChkZWJvdW5jZWQgNTAwbXMpLi4uXCJcbiAgICAgICAgcGFnZVNpemU9e3BhZ2VTaXplfVxuICAgICAgICBwYWdlPXtwYWdlfVxuICAgICAgICBzZWFyY2hEZWJvdW5jZT17NTAwfVxuICAgICAgICBvblNlYXJjaENoYW5nZT17KHRlcm0pID0+IHNldFNlYXJjaCh0ZXJtKX1cbiAgICAgICAgb25QYWdlQ2hhbmdlPXsocCkgPT4gc2V0UGFnZShwKX1cbiAgICAgIC8+XG4gICAgPC9GbGV4PlxuICApO1xufTtcblxuLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4vLyBNYWluIGVudHJ5XG4vLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcblxuaHVic3BvdC5leHRlbmQoKCkgPT4gPERhdGFUYWJsZURlbW9DYXJkIC8+KTtcblxuY29uc3QgRGF0YVRhYmxlRGVtb0NhcmQgPSAoKSA9PiAoXG4gIDxGbGV4IGRpcmVjdGlvbj1cImNvbHVtblwiIGdhcD1cImxnXCI+XG4gICAgPEZ1bGxGZWF0dXJlZERlbW8gLz5cbiAgICA8RGl2aWRlciAvPlxuICAgIDxTZWxlY3RhYmxlRGVtbyAvPlxuICAgIDxEaXZpZGVyIC8+XG4gICAgPEVkaXRhYmxlRGVtbyAvPlxuICAgIDxEaXZpZGVyIC8+XG4gICAgPElubGluZUVkaXREZW1vIC8+XG4gICAgPERpdmlkZXIgLz5cbiAgICA8R3JvdXBlZERlbW8gLz5cbiAgICA8RGl2aWRlciAvPlxuICAgIDxTZXJ2ZXJTaWRlRGVtbyAvPlxuICA8L0ZsZXg+XG4pO1xuIl0sIm5hbWVzIjpbIlNlcnZlcmxlc3NFeGVjdXRpb25TdGF0dXMiLCJSZWFjdCIsInJlcXVpcmUkJDAiLCJSZWFjdERlYnVnQ3VycmVudEZyYW1lIiwic2VsZiIsImpzeFJ1bnRpbWVNb2R1bGUiLCJjcmVhdGVSZW1vdGVSZWFjdENvbXBvbmVudCIsIl9qc3giLCJjcmVhdGVDb250ZXh0IiwidXNlTWVtbyIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwidXNlUmVmIiwidXNlQ2FsbGJhY2siXSwibWFwcGluZ3MiOiI7O0FBSUEsUUFBTSxvQkFBb0IsTUFBTSxPQUFPLFNBQVMsZUFDNUMsS0FBSyxpQ0FBaUM7QUFJMUMsUUFBTSxvQkFBb0I7QUFBQSxJQUN0QixRQUFRO0FBQUEsTUFDSixPQUFPLENBQUMsU0FBUztBQUNiLGdCQUFRLElBQUksSUFBSTtBQUFBLE1BQ3BCO0FBQUEsTUFDQSxNQUFNLENBQUMsU0FBUztBQUNaLGdCQUFRLEtBQUssSUFBSTtBQUFBLE1BQ3JCO0FBQUEsTUFDQSxNQUFNLENBQUMsU0FBUztBQUNaLGdCQUFRLEtBQUssSUFBSTtBQUFBLE1BQ3JCO0FBQUEsTUFDQSxPQUFPLENBQUMsU0FBUztBQUNiLGdCQUFRLE1BQU0sSUFBSTtBQUFBLE1BQ3RCO0FBQUEsSUFDUjtBQUFBLElBQ0ksV0FBVyxNQUFNO0FBQUEsSUFFakI7QUFBQTtBQUFBLElBRUEsdUJBQXVCLE1BQU07QUFBQSxJQUU3QjtBQUFBLEVBQ0o7QUFLTyxRQUFNLG1CQUFtQixNQUFNO0FBQ2xDLFdBQU8sa0JBQWlCLElBQ2xCLE9BQ0E7QUFBQSxFQUNWO0FDdkNBLFFBQU0sWUFBWSxpQkFBZ0IsRUFBRztBQUM5QixXQUFTLFdBQVcsTUFBTSxTQUFTO0FBQ3RDLFdBQU8sS0FBSyxXQUFXLE1BQU0sT0FBTztBQUFBLEVBQ3hDO0FBQ08sV0FBUyxNQUFNLEtBQUssU0FBUztBQUNoQyxXQUFPLEtBQUssUUFBUSxLQUFLLE9BQU87QUFBQSxFQUNwQztBQUNPLFFBQU0sVUFBVTtBQUFBLElBQ25CLFFBQVE7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLEVBQ0o7QUNUTyxNQUFJO0FBQ1gsR0FBQyxTQUFVQSw0QkFBMkI7QUFDbEMsSUFBQUEsMkJBQTBCLFNBQVMsSUFBSTtBQUN2QyxJQUFBQSwyQkFBMEIsT0FBTyxJQUFJO0FBQUEsRUFDekMsR0FBRyw4QkFBOEIsNEJBQTRCLENBQUEsRUFBRzs7Ozs7OztJQ1BoRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFZMkM7QUFDekMsT0FBQyxXQUFXO0FBR2QsWUFBSUMsVUFBUUM7QUFNWixZQUFJLHFCQUFxQixPQUFPLElBQUksZUFBZTtBQUNuRCxZQUFJLG9CQUFvQixPQUFPLElBQUksY0FBYztBQUNqRCxZQUFJLHNCQUFzQixPQUFPLElBQUksZ0JBQWdCO0FBQ3JELFlBQUkseUJBQXlCLE9BQU8sSUFBSSxtQkFBbUI7QUFDM0QsWUFBSSxzQkFBc0IsT0FBTyxJQUFJLGdCQUFnQjtBQUNyRCxZQUFJLHNCQUFzQixPQUFPLElBQUksZ0JBQWdCO0FBQ3JELFlBQUkscUJBQXFCLE9BQU8sSUFBSSxlQUFlO0FBQ25ELFlBQUkseUJBQXlCLE9BQU8sSUFBSSxtQkFBbUI7QUFDM0QsWUFBSSxzQkFBc0IsT0FBTyxJQUFJLGdCQUFnQjtBQUNyRCxZQUFJLDJCQUEyQixPQUFPLElBQUkscUJBQXFCO0FBQy9ELFlBQUksa0JBQWtCLE9BQU8sSUFBSSxZQUFZO0FBQzdDLFlBQUksa0JBQWtCLE9BQU8sSUFBSSxZQUFZO0FBQzdDLFlBQUksdUJBQXVCLE9BQU8sSUFBSSxpQkFBaUI7QUFDdkQsWUFBSSx3QkFBd0IsT0FBTztBQUNuQyxZQUFJLHVCQUF1QjtBQUMzQixpQkFBUyxjQUFjLGVBQWU7QUFDcEMsY0FBSSxrQkFBa0IsUUFBUSxPQUFPLGtCQUFrQixVQUFVO0FBQy9ELG1CQUFPO0FBQUEsVUFBQTtBQUdULGNBQUksZ0JBQWdCLHlCQUF5QixjQUFjLHFCQUFxQixLQUFLLGNBQWMsb0JBQW9CO0FBRXZILGNBQUksT0FBTyxrQkFBa0IsWUFBWTtBQUN2QyxtQkFBTztBQUFBLFVBQUE7QUFHVCxpQkFBTztBQUFBLFFBQUE7QUFHVCxZQUFJLHVCQUF1QkQsUUFBTTtBQUVqQyxpQkFBUyxNQUFNLFFBQVE7QUFDckI7QUFDRTtBQUNFLHVCQUFTLFFBQVEsVUFBVSxRQUFRLE9BQU8sSUFBSSxNQUFNLFFBQVEsSUFBSSxRQUFRLElBQUksQ0FBQyxHQUFHLFFBQVEsR0FBRyxRQUFRLE9BQU8sU0FBUztBQUNqSCxxQkFBSyxRQUFRLENBQUMsSUFBSSxVQUFVLEtBQUs7QUFBQSxjQUFBO0FBR25DLDJCQUFhLFNBQVMsUUFBUSxJQUFJO0FBQUEsWUFBQTtBQUFBLFVBQ3BDO0FBQUEsUUFDRjtBQUdGLGlCQUFTLGFBQWEsT0FBTyxRQUFRLE1BQU07QUFHekM7QUFDRSxnQkFBSUUsMEJBQXlCLHFCQUFxQjtBQUNsRCxnQkFBSSxRQUFRQSx3QkFBdUIsaUJBQUE7QUFFbkMsZ0JBQUksVUFBVSxJQUFJO0FBQ2hCLHdCQUFVO0FBQ1YscUJBQU8sS0FBSyxPQUFPLENBQUMsS0FBSyxDQUFDO0FBQUEsWUFBQTtBQUk1QixnQkFBSSxpQkFBaUIsS0FBSyxJQUFJLFNBQVUsTUFBTTtBQUM1QyxxQkFBTyxPQUFPLElBQUk7QUFBQSxZQUFBLENBQ25CO0FBRUQsMkJBQWUsUUFBUSxjQUFjLE1BQU07QUFJM0MscUJBQVMsVUFBVSxNQUFNLEtBQUssUUFBUSxLQUFLLEdBQUcsU0FBUyxjQUFjO0FBQUEsVUFBQTtBQUFBLFFBQ3ZFO0FBS0YsWUFBSSxpQkFBaUI7QUFDckIsWUFBSSxxQkFBcUI7QUFDekIsWUFBSSwwQkFBMEI7QUFFOUIsWUFBSSxxQkFBcUI7QUFJekIsWUFBSSxxQkFBcUI7QUFFekIsWUFBSTtBQUVKO0FBQ0UsbUNBQXlCLE9BQU8sSUFBSSx3QkFBd0I7QUFBQSxRQUFBO0FBRzlELGlCQUFTLG1CQUFtQixNQUFNO0FBQ2hDLGNBQUksT0FBTyxTQUFTLFlBQVksT0FBTyxTQUFTLFlBQVk7QUFDMUQsbUJBQU87QUFBQSxVQUFBO0FBSVQsY0FBSSxTQUFTLHVCQUF1QixTQUFTLHVCQUF1QixzQkFBdUIsU0FBUywwQkFBMEIsU0FBUyx1QkFBdUIsU0FBUyw0QkFBNEIsc0JBQXVCLFNBQVMsd0JBQXdCLGtCQUFtQixzQkFBdUIseUJBQTBCO0FBQzdULG1CQUFPO0FBQUEsVUFBQTtBQUdULGNBQUksT0FBTyxTQUFTLFlBQVksU0FBUyxNQUFNO0FBQzdDLGdCQUFJLEtBQUssYUFBYSxtQkFBbUIsS0FBSyxhQUFhLG1CQUFtQixLQUFLLGFBQWEsdUJBQXVCLEtBQUssYUFBYSxzQkFBc0IsS0FBSyxhQUFhO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFJakwsS0FBSyxhQUFhLDBCQUEwQixLQUFLLGdCQUFnQixRQUFXO0FBQzFFLHFCQUFPO0FBQUEsWUFBQTtBQUFBLFVBQ1Q7QUFHRixpQkFBTztBQUFBLFFBQUE7QUFHVCxpQkFBUyxlQUFlLFdBQVcsV0FBVyxhQUFhO0FBQ3pELGNBQUksY0FBYyxVQUFVO0FBRTVCLGNBQUksYUFBYTtBQUNmLG1CQUFPO0FBQUEsVUFBQTtBQUdULGNBQUksZUFBZSxVQUFVLGVBQWUsVUFBVSxRQUFRO0FBQzlELGlCQUFPLGlCQUFpQixLQUFLLGNBQWMsTUFBTSxlQUFlLE1BQU07QUFBQSxRQUFBO0FBSXhFLGlCQUFTLGVBQWUsTUFBTTtBQUM1QixpQkFBTyxLQUFLLGVBQWU7QUFBQSxRQUFBO0FBSTdCLGlCQUFTLHlCQUF5QixNQUFNO0FBQ3RDLGNBQUksUUFBUSxNQUFNO0FBRWhCLG1CQUFPO0FBQUEsVUFBQTtBQUdUO0FBQ0UsZ0JBQUksT0FBTyxLQUFLLFFBQVEsVUFBVTtBQUNoQyxvQkFBTSxtSEFBd0g7QUFBQSxZQUFBO0FBQUEsVUFDaEk7QUFHRixjQUFJLE9BQU8sU0FBUyxZQUFZO0FBQzlCLG1CQUFPLEtBQUssZUFBZSxLQUFLLFFBQVE7QUFBQSxVQUFBO0FBRzFDLGNBQUksT0FBTyxTQUFTLFVBQVU7QUFDNUIsbUJBQU87QUFBQSxVQUFBO0FBR1Qsa0JBQVEsTUFBQTtBQUFBLFlBQ04sS0FBSztBQUNILHFCQUFPO0FBQUEsWUFFVCxLQUFLO0FBQ0gscUJBQU87QUFBQSxZQUVULEtBQUs7QUFDSCxxQkFBTztBQUFBLFlBRVQsS0FBSztBQUNILHFCQUFPO0FBQUEsWUFFVCxLQUFLO0FBQ0gscUJBQU87QUFBQSxZQUVULEtBQUs7QUFDSCxxQkFBTztBQUFBLFVBQUE7QUFJWCxjQUFJLE9BQU8sU0FBUyxVQUFVO0FBQzVCLG9CQUFRLEtBQUssVUFBQTtBQUFBLGNBQ1gsS0FBSztBQUNILG9CQUFJLFVBQVU7QUFDZCx1QkFBTyxlQUFlLE9BQU8sSUFBSTtBQUFBLGNBRW5DLEtBQUs7QUFDSCxvQkFBSSxXQUFXO0FBQ2YsdUJBQU8sZUFBZSxTQUFTLFFBQVEsSUFBSTtBQUFBLGNBRTdDLEtBQUs7QUFDSCx1QkFBTyxlQUFlLE1BQU0sS0FBSyxRQUFRLFlBQVk7QUFBQSxjQUV2RCxLQUFLO0FBQ0gsb0JBQUksWUFBWSxLQUFLLGVBQWU7QUFFcEMsb0JBQUksY0FBYyxNQUFNO0FBQ3RCLHlCQUFPO0FBQUEsZ0JBQUE7QUFHVCx1QkFBTyx5QkFBeUIsS0FBSyxJQUFJLEtBQUs7QUFBQSxjQUVoRCxLQUFLLGlCQUNIO0FBQ0Usb0JBQUksZ0JBQWdCO0FBQ3BCLG9CQUFJLFVBQVUsY0FBYztBQUM1QixvQkFBSSxPQUFPLGNBQWM7QUFFekIsb0JBQUk7QUFDRix5QkFBTyx5QkFBeUIsS0FBSyxPQUFPLENBQUM7QUFBQSxnQkFBQSxTQUN0QyxHQUFHO0FBQ1YseUJBQU87QUFBQSxnQkFBQTtBQUFBLGNBQ1Q7QUFBQSxZQUNGO0FBQUEsVUFHSjtBQUdGLGlCQUFPO0FBQUEsUUFBQTtBQUdULFlBQUksU0FBUyxPQUFPO0FBTXBCLFlBQUksZ0JBQWdCO0FBQ3BCLFlBQUk7QUFDSixZQUFJO0FBQ0osWUFBSTtBQUNKLFlBQUk7QUFDSixZQUFJO0FBQ0osWUFBSTtBQUNKLFlBQUk7QUFFSixpQkFBUyxjQUFjO0FBQUEsUUFBQTtBQUV2QixvQkFBWSxxQkFBcUI7QUFDakMsaUJBQVMsY0FBYztBQUNyQjtBQUNFLGdCQUFJLGtCQUFrQixHQUFHO0FBRXZCLHdCQUFVLFFBQVE7QUFDbEIseUJBQVcsUUFBUTtBQUNuQix5QkFBVyxRQUFRO0FBQ25CLDBCQUFZLFFBQVE7QUFDcEIsMEJBQVksUUFBUTtBQUNwQixtQ0FBcUIsUUFBUTtBQUM3Qiw2QkFBZSxRQUFRO0FBRXZCLGtCQUFJLFFBQVE7QUFBQSxnQkFDVixjQUFjO0FBQUEsZ0JBQ2QsWUFBWTtBQUFBLGdCQUNaLE9BQU87QUFBQSxnQkFDUCxVQUFVO0FBQUE7QUFHWixxQkFBTyxpQkFBaUIsU0FBUztBQUFBLGdCQUMvQixNQUFNO0FBQUEsZ0JBQ04sS0FBSztBQUFBLGdCQUNMLE1BQU07QUFBQSxnQkFDTixPQUFPO0FBQUEsZ0JBQ1AsT0FBTztBQUFBLGdCQUNQLGdCQUFnQjtBQUFBLGdCQUNoQixVQUFVO0FBQUEsY0FBQSxDQUNYO0FBQUEsWUFBQTtBQUlIO0FBQUEsVUFBQTtBQUFBLFFBQ0Y7QUFFRixpQkFBUyxlQUFlO0FBQ3RCO0FBQ0U7QUFFQSxnQkFBSSxrQkFBa0IsR0FBRztBQUV2QixrQkFBSSxRQUFRO0FBQUEsZ0JBQ1YsY0FBYztBQUFBLGdCQUNkLFlBQVk7QUFBQSxnQkFDWixVQUFVO0FBQUE7QUFHWixxQkFBTyxpQkFBaUIsU0FBUztBQUFBLGdCQUMvQixLQUFLLE9BQU8sQ0FBQSxHQUFJLE9BQU87QUFBQSxrQkFDckIsT0FBTztBQUFBLGdCQUFBLENBQ1I7QUFBQSxnQkFDRCxNQUFNLE9BQU8sQ0FBQSxHQUFJLE9BQU87QUFBQSxrQkFDdEIsT0FBTztBQUFBLGdCQUFBLENBQ1I7QUFBQSxnQkFDRCxNQUFNLE9BQU8sQ0FBQSxHQUFJLE9BQU87QUFBQSxrQkFDdEIsT0FBTztBQUFBLGdCQUFBLENBQ1I7QUFBQSxnQkFDRCxPQUFPLE9BQU8sQ0FBQSxHQUFJLE9BQU87QUFBQSxrQkFDdkIsT0FBTztBQUFBLGdCQUFBLENBQ1I7QUFBQSxnQkFDRCxPQUFPLE9BQU8sQ0FBQSxHQUFJLE9BQU87QUFBQSxrQkFDdkIsT0FBTztBQUFBLGdCQUFBLENBQ1I7QUFBQSxnQkFDRCxnQkFBZ0IsT0FBTyxDQUFBLEdBQUksT0FBTztBQUFBLGtCQUNoQyxPQUFPO0FBQUEsZ0JBQUEsQ0FDUjtBQUFBLGdCQUNELFVBQVUsT0FBTyxDQUFBLEdBQUksT0FBTztBQUFBLGtCQUMxQixPQUFPO0FBQUEsaUJBQ1I7QUFBQSxjQUFBLENBQ0Y7QUFBQSxZQUFBO0FBSUgsZ0JBQUksZ0JBQWdCLEdBQUc7QUFDckIsb0JBQU0sOEVBQW1GO0FBQUEsWUFBQTtBQUFBLFVBQzNGO0FBQUEsUUFDRjtBQUdGLFlBQUkseUJBQXlCLHFCQUFxQjtBQUNsRCxZQUFJO0FBQ0osaUJBQVMsOEJBQThCLE1BQU0sUUFBUSxTQUFTO0FBQzVEO0FBQ0UsZ0JBQUksV0FBVyxRQUFXO0FBRXhCLGtCQUFJO0FBQ0Ysc0JBQU0sTUFBQTtBQUFBLGNBQU0sU0FDTCxHQUFHO0FBQ1Ysb0JBQUksUUFBUSxFQUFFLE1BQU0sS0FBQSxFQUFPLE1BQU0sY0FBYztBQUMvQyx5QkFBUyxTQUFTLE1BQU0sQ0FBQyxLQUFLO0FBQUEsY0FBQTtBQUFBLFlBQ2hDO0FBSUYsbUJBQU8sT0FBTyxTQUFTO0FBQUEsVUFBQTtBQUFBLFFBQ3pCO0FBRUYsWUFBSSxVQUFVO0FBQ2QsWUFBSTtBQUVKO0FBQ0UsY0FBSSxrQkFBa0IsT0FBTyxZQUFZLGFBQWEsVUFBVTtBQUNoRSxnQ0FBc0IsSUFBSSxnQkFBQTtBQUFBLFFBQWdCO0FBRzVDLGlCQUFTLDZCQUE2QixJQUFJLFdBQVc7QUFFbkQsY0FBSyxDQUFDLE1BQU0sU0FBUztBQUNuQixtQkFBTztBQUFBLFVBQUE7QUFHVDtBQUNFLGdCQUFJLFFBQVEsb0JBQW9CLElBQUksRUFBRTtBQUV0QyxnQkFBSSxVQUFVLFFBQVc7QUFDdkIscUJBQU87QUFBQSxZQUFBO0FBQUEsVUFDVDtBQUdGLGNBQUk7QUFDSixvQkFBVTtBQUNWLGNBQUksNEJBQTRCLE1BQU07QUFFdEMsZ0JBQU0sb0JBQW9CO0FBQzFCLGNBQUk7QUFFSjtBQUNFLGlDQUFxQix1QkFBdUI7QUFHNUMsbUNBQXVCLFVBQVU7QUFDakMsd0JBQUE7QUFBQSxVQUFZO0FBR2QsY0FBSTtBQUVGLGdCQUFJLFdBQVc7QUFFYixrQkFBSSxPQUFPLFdBQVk7QUFDckIsc0JBQU0sTUFBQTtBQUFBLGNBQU07QUFJZCxxQkFBTyxlQUFlLEtBQUssV0FBVyxTQUFTO0FBQUEsZ0JBQzdDLEtBQUssV0FBWTtBQUdmLHdCQUFNLE1BQUE7QUFBQSxnQkFBTTtBQUFBLGNBQ2QsQ0FDRDtBQUVELGtCQUFJLE9BQU8sWUFBWSxZQUFZLFFBQVEsV0FBVztBQUdwRCxvQkFBSTtBQUNGLDBCQUFRLFVBQVUsTUFBTSxFQUFFO0FBQUEsZ0JBQUEsU0FDbkIsR0FBRztBQUNWLDRCQUFVO0FBQUEsZ0JBQUE7QUFHWix3QkFBUSxVQUFVLElBQUksQ0FBQSxHQUFJLElBQUk7QUFBQSxjQUFBLE9BQ3pCO0FBQ0wsb0JBQUk7QUFDRix1QkFBSyxLQUFBO0FBQUEsZ0JBQUssU0FDSCxHQUFHO0FBQ1YsNEJBQVU7QUFBQSxnQkFBQTtBQUdaLG1CQUFHLEtBQUssS0FBSyxTQUFTO0FBQUEsY0FBQTtBQUFBLFlBQ3hCLE9BQ0s7QUFDTCxrQkFBSTtBQUNGLHNCQUFNLE1BQUE7QUFBQSxjQUFNLFNBQ0wsR0FBRztBQUNWLDBCQUFVO0FBQUEsY0FBQTtBQUdaLGlCQUFBO0FBQUEsWUFBRztBQUFBLFVBQ0wsU0FDTyxRQUFRO0FBRWYsZ0JBQUksVUFBVSxXQUFXLE9BQU8sT0FBTyxVQUFVLFVBQVU7QUFHekQsa0JBQUksY0FBYyxPQUFPLE1BQU0sTUFBTSxJQUFJO0FBQ3pDLGtCQUFJLGVBQWUsUUFBUSxNQUFNLE1BQU0sSUFBSTtBQUMzQyxrQkFBSSxJQUFJLFlBQVksU0FBUztBQUM3QixrQkFBSSxJQUFJLGFBQWEsU0FBUztBQUU5QixxQkFBTyxLQUFLLEtBQUssS0FBSyxLQUFLLFlBQVksQ0FBQyxNQUFNLGFBQWEsQ0FBQyxHQUFHO0FBTzdEO0FBQUEsY0FBQTtBQUdGLHFCQUFPLEtBQUssS0FBSyxLQUFLLEdBQUcsS0FBSyxLQUFLO0FBR2pDLG9CQUFJLFlBQVksQ0FBQyxNQUFNLGFBQWEsQ0FBQyxHQUFHO0FBTXRDLHNCQUFJLE1BQU0sS0FBSyxNQUFNLEdBQUc7QUFDdEIsdUJBQUc7QUFDRDtBQUNBO0FBR0EsMEJBQUksSUFBSSxLQUFLLFlBQVksQ0FBQyxNQUFNLGFBQWEsQ0FBQyxHQUFHO0FBRS9DLDRCQUFJLFNBQVMsT0FBTyxZQUFZLENBQUMsRUFBRSxRQUFRLFlBQVksTUFBTTtBQUs3RCw0QkFBSSxHQUFHLGVBQWUsT0FBTyxTQUFTLGFBQWEsR0FBRztBQUNwRCxtQ0FBUyxPQUFPLFFBQVEsZUFBZSxHQUFHLFdBQVc7QUFBQSx3QkFBQTtBQUd2RDtBQUNFLDhCQUFJLE9BQU8sT0FBTyxZQUFZO0FBQzVCLGdEQUFvQixJQUFJLElBQUksTUFBTTtBQUFBLDBCQUFBO0FBQUEsd0JBQ3BDO0FBSUYsK0JBQU87QUFBQSxzQkFBQTtBQUFBLG9CQUNULFNBQ08sS0FBSyxLQUFLLEtBQUs7QUFBQSxrQkFBQTtBQUcxQjtBQUFBLGdCQUFBO0FBQUEsY0FDRjtBQUFBLFlBQ0Y7QUFBQSxVQUNGLFVBQ0Y7QUFDRSxzQkFBVTtBQUVWO0FBQ0UscUNBQXVCLFVBQVU7QUFDakMsMkJBQUE7QUFBQSxZQUFhO0FBR2Ysa0JBQU0sb0JBQW9CO0FBQUEsVUFBQTtBQUk1QixjQUFJLE9BQU8sS0FBSyxHQUFHLGVBQWUsR0FBRyxPQUFPO0FBQzVDLGNBQUksaUJBQWlCLE9BQU8sOEJBQThCLElBQUksSUFBSTtBQUVsRTtBQUNFLGdCQUFJLE9BQU8sT0FBTyxZQUFZO0FBQzVCLGtDQUFvQixJQUFJLElBQUksY0FBYztBQUFBLFlBQUE7QUFBQSxVQUM1QztBQUdGLGlCQUFPO0FBQUEsUUFBQTtBQUVULGlCQUFTLCtCQUErQixJQUFJLFFBQVEsU0FBUztBQUMzRDtBQUNFLG1CQUFPLDZCQUE2QixJQUFJLEtBQUs7QUFBQSxVQUFBO0FBQUEsUUFDL0M7QUFHRixpQkFBUyxnQkFBZ0IsV0FBVztBQUNsQyxjQUFJLFlBQVksVUFBVTtBQUMxQixpQkFBTyxDQUFDLEVBQUUsYUFBYSxVQUFVO0FBQUEsUUFBQTtBQUduQyxpQkFBUyxxQ0FBcUMsTUFBTSxRQUFRLFNBQVM7QUFFbkUsY0FBSSxRQUFRLE1BQU07QUFDaEIsbUJBQU87QUFBQSxVQUFBO0FBR1QsY0FBSSxPQUFPLFNBQVMsWUFBWTtBQUM5QjtBQUNFLHFCQUFPLDZCQUE2QixNQUFNLGdCQUFnQixJQUFJLENBQUM7QUFBQSxZQUFBO0FBQUEsVUFDakU7QUFHRixjQUFJLE9BQU8sU0FBUyxVQUFVO0FBQzVCLG1CQUFPLDhCQUE4QixJQUFJO0FBQUEsVUFBQTtBQUczQyxrQkFBUSxNQUFBO0FBQUEsWUFDTixLQUFLO0FBQ0gscUJBQU8sOEJBQThCLFVBQVU7QUFBQSxZQUVqRCxLQUFLO0FBQ0gscUJBQU8sOEJBQThCLGNBQWM7QUFBQSxVQUFBO0FBR3ZELGNBQUksT0FBTyxTQUFTLFVBQVU7QUFDNUIsb0JBQVEsS0FBSyxVQUFBO0FBQUEsY0FDWCxLQUFLO0FBQ0gsdUJBQU8sK0JBQStCLEtBQUssTUFBTTtBQUFBLGNBRW5ELEtBQUs7QUFFSCx1QkFBTyxxQ0FBcUMsS0FBSyxNQUFNLFFBQVEsT0FBTztBQUFBLGNBRXhFLEtBQUssaUJBQ0g7QUFDRSxvQkFBSSxnQkFBZ0I7QUFDcEIsb0JBQUksVUFBVSxjQUFjO0FBQzVCLG9CQUFJLE9BQU8sY0FBYztBQUV6QixvQkFBSTtBQUVGLHlCQUFPLHFDQUFxQyxLQUFLLE9BQU8sR0FBRyxRQUFRLE9BQU87QUFBQSxnQkFBQSxTQUNuRSxHQUFHO0FBQUEsZ0JBQUE7QUFBQSxjQUFDO0FBQUEsWUFDZjtBQUFBLFVBQ0o7QUFHRixpQkFBTztBQUFBLFFBQUE7QUFHVCxZQUFJLGlCQUFpQixPQUFPLFVBQVU7QUFFdEMsWUFBSSxxQkFBcUIsQ0FBQTtBQUN6QixZQUFJLHlCQUF5QixxQkFBcUI7QUFFbEQsaUJBQVMsOEJBQThCLFNBQVM7QUFDOUM7QUFDRSxnQkFBSSxTQUFTO0FBQ1gsa0JBQUksUUFBUSxRQUFRO0FBQ3BCLGtCQUFJLFFBQVEscUNBQXFDLFFBQVEsTUFBTSxRQUFRLFNBQVMsUUFBUSxNQUFNLE9BQU8sSUFBSTtBQUN6RyxxQ0FBdUIsbUJBQW1CLEtBQUs7QUFBQSxZQUFBLE9BQzFDO0FBQ0wscUNBQXVCLG1CQUFtQixJQUFJO0FBQUEsWUFBQTtBQUFBLFVBQ2hEO0FBQUEsUUFDRjtBQUdGLGlCQUFTLGVBQWUsV0FBVyxRQUFRLFVBQVUsZUFBZSxTQUFTO0FBQzNFO0FBRUUsZ0JBQUksTUFBTSxTQUFTLEtBQUssS0FBSyxjQUFjO0FBRTNDLHFCQUFTLGdCQUFnQixXQUFXO0FBQ2xDLGtCQUFJLElBQUksV0FBVyxZQUFZLEdBQUc7QUFDaEMsb0JBQUksVUFBVTtBQUlkLG9CQUFJO0FBR0Ysc0JBQUksT0FBTyxVQUFVLFlBQVksTUFBTSxZQUFZO0FBRWpELHdCQUFJLE1BQU0sT0FBTyxpQkFBaUIsaUJBQWlCLE9BQU8sV0FBVyxZQUFZLGVBQWUsK0ZBQW9HLE9BQU8sVUFBVSxZQUFZLElBQUksaUdBQXNHO0FBQzNVLHdCQUFJLE9BQU87QUFDWCwwQkFBTTtBQUFBLGtCQUFBO0FBR1IsNEJBQVUsVUFBVSxZQUFZLEVBQUUsUUFBUSxjQUFjLGVBQWUsVUFBVSxNQUFNLDhDQUE4QztBQUFBLGdCQUFBLFNBQzlILElBQUk7QUFDWCw0QkFBVTtBQUFBLGdCQUFBO0FBR1osb0JBQUksV0FBVyxFQUFFLG1CQUFtQixRQUFRO0FBQzFDLGdEQUE4QixPQUFPO0FBRXJDLHdCQUFNLDRSQUFxVCxpQkFBaUIsZUFBZSxVQUFVLGNBQWMsT0FBTyxPQUFPO0FBRWpZLGdEQUE4QixJQUFJO0FBQUEsZ0JBQUE7QUFHcEMsb0JBQUksbUJBQW1CLFNBQVMsRUFBRSxRQUFRLFdBQVcscUJBQXFCO0FBR3hFLHFDQUFtQixRQUFRLE9BQU8sSUFBSTtBQUN0QyxnREFBOEIsT0FBTztBQUVyQyx3QkFBTSxzQkFBc0IsVUFBVSxRQUFRLE9BQU87QUFFckQsZ0RBQThCLElBQUk7QUFBQSxnQkFBQTtBQUFBLGNBQ3BDO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBR0YsWUFBSSxjQUFjLE1BQU07QUFFeEIsaUJBQVMsUUFBUSxHQUFHO0FBQ2xCLGlCQUFPLFlBQVksQ0FBQztBQUFBLFFBQUE7QUFhdEIsaUJBQVMsU0FBUyxPQUFPO0FBQ3ZCO0FBRUUsZ0JBQUksaUJBQWlCLE9BQU8sV0FBVyxjQUFjLE9BQU87QUFDNUQsZ0JBQUksT0FBTyxrQkFBa0IsTUFBTSxPQUFPLFdBQVcsS0FBSyxNQUFNLFlBQVksUUFBUTtBQUNwRixtQkFBTztBQUFBLFVBQUE7QUFBQSxRQUNUO0FBSUYsaUJBQVMsa0JBQWtCLE9BQU87QUFDaEM7QUFDRSxnQkFBSTtBQUNGLGlDQUFtQixLQUFLO0FBQ3hCLHFCQUFPO0FBQUEsWUFBQSxTQUNBLEdBQUc7QUFDVixxQkFBTztBQUFBLFlBQUE7QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUdGLGlCQUFTLG1CQUFtQixPQUFPO0FBd0JqQyxpQkFBTyxLQUFLO0FBQUEsUUFBQTtBQUVkLGlCQUFTLHVCQUF1QixPQUFPO0FBQ3JDO0FBQ0UsZ0JBQUksa0JBQWtCLEtBQUssR0FBRztBQUM1QixvQkFBTSxtSEFBd0gsU0FBUyxLQUFLLENBQUM7QUFFN0kscUJBQU8sbUJBQW1CLEtBQUs7QUFBQSxZQUFBO0FBQUEsVUFDakM7QUFBQSxRQUNGO0FBR0YsWUFBSSxvQkFBb0IscUJBQXFCO0FBQzdDLFlBQUksaUJBQWlCO0FBQUEsVUFDbkIsS0FBSztBQUFBLFVBQ0wsS0FBSztBQUFBLFVBQ0wsUUFBUTtBQUFBLFVBQ1IsVUFBVTtBQUFBO0FBRVosWUFBSTtBQUNKLFlBQUk7QUFPSixpQkFBUyxZQUFZLFFBQVE7QUFDM0I7QUFDRSxnQkFBSSxlQUFlLEtBQUssUUFBUSxLQUFLLEdBQUc7QUFDdEMsa0JBQUksU0FBUyxPQUFPLHlCQUF5QixRQUFRLEtBQUssRUFBRTtBQUU1RCxrQkFBSSxVQUFVLE9BQU8sZ0JBQWdCO0FBQ25DLHVCQUFPO0FBQUEsY0FBQTtBQUFBLFlBQ1Q7QUFBQSxVQUNGO0FBR0YsaUJBQU8sT0FBTyxRQUFRO0FBQUEsUUFBQTtBQUd4QixpQkFBUyxZQUFZLFFBQVE7QUFDM0I7QUFDRSxnQkFBSSxlQUFlLEtBQUssUUFBUSxLQUFLLEdBQUc7QUFDdEMsa0JBQUksU0FBUyxPQUFPLHlCQUF5QixRQUFRLEtBQUssRUFBRTtBQUU1RCxrQkFBSSxVQUFVLE9BQU8sZ0JBQWdCO0FBQ25DLHVCQUFPO0FBQUEsY0FBQTtBQUFBLFlBQ1Q7QUFBQSxVQUNGO0FBR0YsaUJBQU8sT0FBTyxRQUFRO0FBQUEsUUFBQTtBQUd4QixpQkFBUyxxQ0FBcUMsUUFBUUMsT0FBTTtBQUMxRDtBQUNFLGdCQUFJLE9BQU8sT0FBTyxRQUFRLFlBQVksa0JBQWtCLFdBQVdBLE1BQXNEO0FBQUEsVUFRekg7QUFBQSxRQUNGO0FBR0YsaUJBQVMsMkJBQTJCLE9BQU8sYUFBYTtBQUN0RDtBQUNFLGdCQUFJLHdCQUF3QixXQUFZO0FBQ3RDLGtCQUFJLENBQUMsNEJBQTRCO0FBQy9CLDZDQUE2QjtBQUU3QixzQkFBTSw2T0FBNFAsV0FBVztBQUFBLGNBQUE7QUFBQSxZQUMvUTtBQUdGLGtDQUFzQixpQkFBaUI7QUFDdkMsbUJBQU8sZUFBZSxPQUFPLE9BQU87QUFBQSxjQUNsQyxLQUFLO0FBQUEsY0FDTCxjQUFjO0FBQUEsWUFBQSxDQUNmO0FBQUEsVUFBQTtBQUFBLFFBQ0g7QUFHRixpQkFBUywyQkFBMkIsT0FBTyxhQUFhO0FBQ3REO0FBQ0UsZ0JBQUksd0JBQXdCLFdBQVk7QUFDdEMsa0JBQUksQ0FBQyw0QkFBNEI7QUFDL0IsNkNBQTZCO0FBRTdCLHNCQUFNLDZPQUE0UCxXQUFXO0FBQUEsY0FBQTtBQUFBLFlBQy9RO0FBR0Ysa0NBQXNCLGlCQUFpQjtBQUN2QyxtQkFBTyxlQUFlLE9BQU8sT0FBTztBQUFBLGNBQ2xDLEtBQUs7QUFBQSxjQUNMLGNBQWM7QUFBQSxZQUFBLENBQ2Y7QUFBQSxVQUFBO0FBQUEsUUFDSDtBQXdCRixZQUFJLGVBQWUsU0FBVSxNQUFNLEtBQUssS0FBS0EsT0FBTSxRQUFRLE9BQU8sT0FBTztBQUN2RSxjQUFJLFVBQVU7QUFBQTtBQUFBLFlBRVosVUFBVTtBQUFBO0FBQUEsWUFFVjtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBO0FBQUEsWUFFQSxRQUFRO0FBQUE7QUFHVjtBQUtFLG9CQUFRLFNBQVMsQ0FBQTtBQUtqQixtQkFBTyxlQUFlLFFBQVEsUUFBUSxhQUFhO0FBQUEsY0FDakQsY0FBYztBQUFBLGNBQ2QsWUFBWTtBQUFBLGNBQ1osVUFBVTtBQUFBLGNBQ1YsT0FBTztBQUFBLFlBQUEsQ0FDUjtBQUVELG1CQUFPLGVBQWUsU0FBUyxTQUFTO0FBQUEsY0FDdEMsY0FBYztBQUFBLGNBQ2QsWUFBWTtBQUFBLGNBQ1osVUFBVTtBQUFBLGNBQ1YsT0FBT0E7QUFBQSxZQUFBLENBQ1I7QUFHRCxtQkFBTyxlQUFlLFNBQVMsV0FBVztBQUFBLGNBQ3hDLGNBQWM7QUFBQSxjQUNkLFlBQVk7QUFBQSxjQUNaLFVBQVU7QUFBQSxjQUNWLE9BQU87QUFBQSxZQUFBLENBQ1I7QUFFRCxnQkFBSSxPQUFPLFFBQVE7QUFDakIscUJBQU8sT0FBTyxRQUFRLEtBQUs7QUFDM0IscUJBQU8sT0FBTyxPQUFPO0FBQUEsWUFBQTtBQUFBLFVBQ3ZCO0FBR0YsaUJBQU87QUFBQSxRQUFBO0FBU1QsaUJBQVMsT0FBTyxNQUFNLFFBQVEsVUFBVSxRQUFRQSxPQUFNO0FBQ3BEO0FBQ0UsZ0JBQUk7QUFFSixnQkFBSSxRQUFRLENBQUE7QUFDWixnQkFBSSxNQUFNO0FBQ1YsZ0JBQUksTUFBTTtBQU9WLGdCQUFJLGFBQWEsUUFBVztBQUMxQjtBQUNFLHVDQUF1QixRQUFRO0FBQUEsY0FBQTtBQUdqQyxvQkFBTSxLQUFLO0FBQUEsWUFBQTtBQUdiLGdCQUFJLFlBQVksTUFBTSxHQUFHO0FBQ3ZCO0FBQ0UsdUNBQXVCLE9BQU8sR0FBRztBQUFBLGNBQUE7QUFHbkMsb0JBQU0sS0FBSyxPQUFPO0FBQUEsWUFBQTtBQUdwQixnQkFBSSxZQUFZLE1BQU0sR0FBRztBQUN2QixvQkFBTSxPQUFPO0FBQ2IsbURBQXFDLFFBQVFBLEtBQUk7QUFBQSxZQUFBO0FBSW5ELGlCQUFLLFlBQVksUUFBUTtBQUN2QixrQkFBSSxlQUFlLEtBQUssUUFBUSxRQUFRLEtBQUssQ0FBQyxlQUFlLGVBQWUsUUFBUSxHQUFHO0FBQ3JGLHNCQUFNLFFBQVEsSUFBSSxPQUFPLFFBQVE7QUFBQSxjQUFBO0FBQUEsWUFDbkM7QUFJRixnQkFBSSxRQUFRLEtBQUssY0FBYztBQUM3QixrQkFBSSxlQUFlLEtBQUs7QUFFeEIsbUJBQUssWUFBWSxjQUFjO0FBQzdCLG9CQUFJLE1BQU0sUUFBUSxNQUFNLFFBQVc7QUFDakMsd0JBQU0sUUFBUSxJQUFJLGFBQWEsUUFBUTtBQUFBLGdCQUFBO0FBQUEsY0FDekM7QUFBQSxZQUNGO0FBR0YsZ0JBQUksT0FBTyxLQUFLO0FBQ2Qsa0JBQUksY0FBYyxPQUFPLFNBQVMsYUFBYSxLQUFLLGVBQWUsS0FBSyxRQUFRLFlBQVk7QUFFNUYsa0JBQUksS0FBSztBQUNQLDJDQUEyQixPQUFPLFdBQVc7QUFBQSxjQUFBO0FBRy9DLGtCQUFJLEtBQUs7QUFDUCwyQ0FBMkIsT0FBTyxXQUFXO0FBQUEsY0FBQTtBQUFBLFlBQy9DO0FBR0YsbUJBQU8sYUFBYSxNQUFNLEtBQUssS0FBS0EsT0FBTSxRQUFRLGtCQUFrQixTQUFTLEtBQUs7QUFBQSxVQUFBO0FBQUEsUUFDcEY7QUFHRixZQUFJLHNCQUFzQixxQkFBcUI7QUFDL0MsWUFBSSwyQkFBMkIscUJBQXFCO0FBRXBELGlCQUFTLGdDQUFnQyxTQUFTO0FBQ2hEO0FBQ0UsZ0JBQUksU0FBUztBQUNYLGtCQUFJLFFBQVEsUUFBUTtBQUNwQixrQkFBSSxRQUFRLHFDQUFxQyxRQUFRLE1BQU0sUUFBUSxTQUFTLFFBQVEsTUFBTSxPQUFPLElBQUk7QUFDekcsdUNBQXlCLG1CQUFtQixLQUFLO0FBQUEsWUFBQSxPQUM1QztBQUNMLHVDQUF5QixtQkFBbUIsSUFBSTtBQUFBLFlBQUE7QUFBQSxVQUNsRDtBQUFBLFFBQ0Y7QUFHRixZQUFJO0FBRUo7QUFDRSwwQ0FBZ0M7QUFBQSxRQUFBO0FBV2xDLGlCQUFTLGVBQWUsUUFBUTtBQUM5QjtBQUNFLG1CQUFPLE9BQU8sV0FBVyxZQUFZLFdBQVcsUUFBUSxPQUFPLGFBQWE7QUFBQSxVQUFBO0FBQUEsUUFDOUU7QUFHRixpQkFBUyw4QkFBOEI7QUFDckM7QUFDRSxnQkFBSSxvQkFBb0IsU0FBUztBQUMvQixrQkFBSSxPQUFPLHlCQUF5QixvQkFBb0IsUUFBUSxJQUFJO0FBRXBFLGtCQUFJLE1BQU07QUFDUix1QkFBTyxxQ0FBcUMsT0FBTztBQUFBLGNBQUE7QUFBQSxZQUNyRDtBQUdGLG1CQUFPO0FBQUEsVUFBQTtBQUFBLFFBQ1Q7QUFHRixpQkFBUywyQkFBMkIsUUFBUTtBQUMxQztBQU9FLG1CQUFPO0FBQUEsVUFBQTtBQUFBLFFBQ1Q7QUFTRixZQUFJLHdCQUF3QixDQUFBO0FBRTVCLGlCQUFTLDZCQUE2QixZQUFZO0FBQ2hEO0FBQ0UsZ0JBQUksT0FBTyw0QkFBQTtBQUVYLGdCQUFJLENBQUMsTUFBTTtBQUNULGtCQUFJLGFBQWEsT0FBTyxlQUFlLFdBQVcsYUFBYSxXQUFXLGVBQWUsV0FBVztBQUVwRyxrQkFBSSxZQUFZO0FBQ2QsdUJBQU8sZ0RBQWdELGFBQWE7QUFBQSxjQUFBO0FBQUEsWUFDdEU7QUFHRixtQkFBTztBQUFBLFVBQUE7QUFBQSxRQUNUO0FBZUYsaUJBQVMsb0JBQW9CLFNBQVMsWUFBWTtBQUNoRDtBQUNFLGdCQUFJLENBQUMsUUFBUSxVQUFVLFFBQVEsT0FBTyxhQUFhLFFBQVEsT0FBTyxNQUFNO0FBQ3RFO0FBQUEsWUFBQTtBQUdGLG9CQUFRLE9BQU8sWUFBWTtBQUMzQixnQkFBSSw0QkFBNEIsNkJBQTZCLFVBQVU7QUFFdkUsZ0JBQUksc0JBQXNCLHlCQUF5QixHQUFHO0FBQ3BEO0FBQUEsWUFBQTtBQUdGLGtDQUFzQix5QkFBeUIsSUFBSTtBQUluRCxnQkFBSSxhQUFhO0FBRWpCLGdCQUFJLFdBQVcsUUFBUSxVQUFVLFFBQVEsV0FBVyxvQkFBb0IsU0FBUztBQUUvRSwyQkFBYSxpQ0FBaUMseUJBQXlCLFFBQVEsT0FBTyxJQUFJLElBQUk7QUFBQSxZQUFBO0FBR2hHLDRDQUFnQyxPQUFPO0FBRXZDLGtCQUFNLDZIQUFrSSwyQkFBMkIsVUFBVTtBQUU3Syw0Q0FBZ0MsSUFBSTtBQUFBLFVBQUE7QUFBQSxRQUN0QztBQWFGLGlCQUFTLGtCQUFrQixNQUFNLFlBQVk7QUFDM0M7QUFDRSxnQkFBSSxPQUFPLFNBQVMsVUFBVTtBQUM1QjtBQUFBLFlBQUE7QUFHRixnQkFBSSxRQUFRLElBQUksR0FBRztBQUNqQix1QkFBUyxJQUFJLEdBQUcsSUFBSSxLQUFLLFFBQVEsS0FBSztBQUNwQyxvQkFBSSxRQUFRLEtBQUssQ0FBQztBQUVsQixvQkFBSSxlQUFlLEtBQUssR0FBRztBQUN6QixzQ0FBb0IsT0FBTyxVQUFVO0FBQUEsZ0JBQUE7QUFBQSxjQUN2QztBQUFBLFlBQ0YsV0FDUyxlQUFlLElBQUksR0FBRztBQUUvQixrQkFBSSxLQUFLLFFBQVE7QUFDZixxQkFBSyxPQUFPLFlBQVk7QUFBQSxjQUFBO0FBQUEsWUFDMUIsV0FDUyxNQUFNO0FBQ2Ysa0JBQUksYUFBYSxjQUFjLElBQUk7QUFFbkMsa0JBQUksT0FBTyxlQUFlLFlBQVk7QUFHcEMsb0JBQUksZUFBZSxLQUFLLFNBQVM7QUFDL0Isc0JBQUksV0FBVyxXQUFXLEtBQUssSUFBSTtBQUNuQyxzQkFBSTtBQUVKLHlCQUFPLEVBQUUsT0FBTyxTQUFTLEtBQUEsR0FBUSxNQUFNO0FBQ3JDLHdCQUFJLGVBQWUsS0FBSyxLQUFLLEdBQUc7QUFDOUIsMENBQW9CLEtBQUssT0FBTyxVQUFVO0FBQUEsb0JBQUE7QUFBQSxrQkFDNUM7QUFBQSxnQkFDRjtBQUFBLGNBQ0Y7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFVRixpQkFBUyxrQkFBa0IsU0FBUztBQUNsQztBQUNFLGdCQUFJLE9BQU8sUUFBUTtBQUVuQixnQkFBSSxTQUFTLFFBQVEsU0FBUyxVQUFhLE9BQU8sU0FBUyxVQUFVO0FBQ25FO0FBQUEsWUFBQTtBQUdGLGdCQUFJO0FBRUosZ0JBQUksT0FBTyxTQUFTLFlBQVk7QUFDOUIsMEJBQVksS0FBSztBQUFBLFlBQUEsV0FDUixPQUFPLFNBQVMsYUFBYSxLQUFLLGFBQWE7QUFBQTtBQUFBLFlBRTFELEtBQUssYUFBYSxrQkFBa0I7QUFDbEMsMEJBQVksS0FBSztBQUFBLFlBQUEsT0FDWjtBQUNMO0FBQUEsWUFBQTtBQUdGLGdCQUFJLFdBQVc7QUFFYixrQkFBSSxPQUFPLHlCQUF5QixJQUFJO0FBQ3hDLDZCQUFlLFdBQVcsUUFBUSxPQUFPLFFBQVEsTUFBTSxPQUFPO0FBQUEsWUFBQSxXQUNyRCxLQUFLLGNBQWMsVUFBYSxDQUFDLCtCQUErQjtBQUN6RSw4Q0FBZ0M7QUFFaEMsa0JBQUksUUFBUSx5QkFBeUIsSUFBSTtBQUV6QyxvQkFBTSx1R0FBdUcsU0FBUyxTQUFTO0FBQUEsWUFBQTtBQUdqSSxnQkFBSSxPQUFPLEtBQUssb0JBQW9CLGNBQWMsQ0FBQyxLQUFLLGdCQUFnQixzQkFBc0I7QUFDNUYsb0JBQU0sNEhBQWlJO0FBQUEsWUFBQTtBQUFBLFVBQ3pJO0FBQUEsUUFDRjtBQVFGLGlCQUFTLHNCQUFzQixVQUFVO0FBQ3ZDO0FBQ0UsZ0JBQUksT0FBTyxPQUFPLEtBQUssU0FBUyxLQUFLO0FBRXJDLHFCQUFTLElBQUksR0FBRyxJQUFJLEtBQUssUUFBUSxLQUFLO0FBQ3BDLGtCQUFJLE1BQU0sS0FBSyxDQUFDO0FBRWhCLGtCQUFJLFFBQVEsY0FBYyxRQUFRLE9BQU87QUFDdkMsZ0RBQWdDLFFBQVE7QUFFeEMsc0JBQU0sNEdBQWlILEdBQUc7QUFFMUgsZ0RBQWdDLElBQUk7QUFDcEM7QUFBQSxjQUFBO0FBQUEsWUFDRjtBQUdGLGdCQUFJLFNBQVMsUUFBUSxNQUFNO0FBQ3pCLDhDQUFnQyxRQUFRO0FBRXhDLG9CQUFNLHVEQUF1RDtBQUU3RCw4Q0FBZ0MsSUFBSTtBQUFBLFlBQUE7QUFBQSxVQUN0QztBQUFBLFFBQ0Y7QUFHRixZQUFJLHdCQUF3QixDQUFBO0FBQzVCLGlCQUFTLGtCQUFrQixNQUFNLE9BQU8sS0FBSyxrQkFBa0IsUUFBUUEsT0FBTTtBQUMzRTtBQUNFLGdCQUFJLFlBQVksbUJBQW1CLElBQUk7QUFHdkMsZ0JBQUksQ0FBQyxXQUFXO0FBQ2Qsa0JBQUksT0FBTztBQUVYLGtCQUFJLFNBQVMsVUFBYSxPQUFPLFNBQVMsWUFBWSxTQUFTLFFBQVEsT0FBTyxLQUFLLElBQUksRUFBRSxXQUFXLEdBQUc7QUFDckcsd0JBQVE7QUFBQSxjQUFBO0FBR1Ysa0JBQUksYUFBYSwyQkFBaUM7QUFFbEQsa0JBQUksWUFBWTtBQUNkLHdCQUFRO0FBQUEsY0FBQSxPQUNIO0FBQ0wsd0JBQVEsNEJBQUE7QUFBQSxjQUE0QjtBQUd0QyxrQkFBSTtBQUVKLGtCQUFJLFNBQVMsTUFBTTtBQUNqQiw2QkFBYTtBQUFBLGNBQUEsV0FDSixRQUFRLElBQUksR0FBRztBQUN4Qiw2QkFBYTtBQUFBLGNBQUEsV0FDSixTQUFTLFVBQWEsS0FBSyxhQUFhLG9CQUFvQjtBQUNyRSw2QkFBYSxPQUFPLHlCQUF5QixLQUFLLElBQUksS0FBSyxhQUFhO0FBQ3hFLHVCQUFPO0FBQUEsY0FBQSxPQUNGO0FBQ0wsNkJBQWEsT0FBTztBQUFBLGNBQUE7QUFHdEIsb0JBQU0sMklBQXFKLFlBQVksSUFBSTtBQUFBLFlBQUE7QUFHN0ssZ0JBQUksVUFBVSxPQUFPLE1BQU0sT0FBTyxLQUFLLFFBQVFBLEtBQUk7QUFHbkQsZ0JBQUksV0FBVyxNQUFNO0FBQ25CLHFCQUFPO0FBQUEsWUFBQTtBQVFULGdCQUFJLFdBQVc7QUFDYixrQkFBSSxXQUFXLE1BQU07QUFFckIsa0JBQUksYUFBYSxRQUFXO0FBQzFCLG9CQUFJLGtCQUFrQjtBQUNwQixzQkFBSSxRQUFRLFFBQVEsR0FBRztBQUNyQiw2QkFBUyxJQUFJLEdBQUcsSUFBSSxTQUFTLFFBQVEsS0FBSztBQUN4Qyx3Q0FBa0IsU0FBUyxDQUFDLEdBQUcsSUFBSTtBQUFBLG9CQUFBO0FBR3JDLHdCQUFJLE9BQU8sUUFBUTtBQUNqQiw2QkFBTyxPQUFPLFFBQVE7QUFBQSxvQkFBQTtBQUFBLGtCQUN4QixPQUNLO0FBQ0wsMEJBQU0sc0pBQWdLO0FBQUEsa0JBQUE7QUFBQSxnQkFDeEssT0FDSztBQUNMLG9DQUFrQixVQUFVLElBQUk7QUFBQSxnQkFBQTtBQUFBLGNBQ2xDO0FBQUEsWUFDRjtBQUdGO0FBQ0Usa0JBQUksZUFBZSxLQUFLLE9BQU8sS0FBSyxHQUFHO0FBQ3JDLG9CQUFJLGdCQUFnQix5QkFBeUIsSUFBSTtBQUNqRCxvQkFBSSxPQUFPLE9BQU8sS0FBSyxLQUFLLEVBQUUsT0FBTyxTQUFVLEdBQUc7QUFDaEQseUJBQU8sTUFBTTtBQUFBLGdCQUFBLENBQ2Q7QUFDRCxvQkFBSSxnQkFBZ0IsS0FBSyxTQUFTLElBQUksb0JBQW9CLEtBQUssS0FBSyxTQUFTLElBQUksV0FBVztBQUU1RixvQkFBSSxDQUFDLHNCQUFzQixnQkFBZ0IsYUFBYSxHQUFHO0FBQ3pELHNCQUFJLGVBQWUsS0FBSyxTQUFTLElBQUksTUFBTSxLQUFLLEtBQUssU0FBUyxJQUFJLFdBQVc7QUFFN0Usd0JBQU0sbU9BQTRQLGVBQWUsZUFBZSxjQUFjLGFBQWE7QUFFM1Qsd0NBQXNCLGdCQUFnQixhQUFhLElBQUk7QUFBQSxnQkFBQTtBQUFBLGNBQ3pEO0FBQUEsWUFDRjtBQUdGLGdCQUFJLFNBQVMscUJBQXFCO0FBQ2hDLG9DQUFzQixPQUFPO0FBQUEsWUFBQSxPQUN4QjtBQUNMLGdDQUFrQixPQUFPO0FBQUEsWUFBQTtBQUczQixtQkFBTztBQUFBLFVBQUE7QUFBQSxRQUNUO0FBTUYsaUJBQVMsd0JBQXdCLE1BQU0sT0FBTyxLQUFLO0FBQ2pEO0FBQ0UsbUJBQU8sa0JBQWtCLE1BQU0sT0FBTyxLQUFLLElBQUk7QUFBQSxVQUFBO0FBQUEsUUFDakQ7QUFFRixpQkFBUyx5QkFBeUIsTUFBTSxPQUFPLEtBQUs7QUFDbEQ7QUFDRSxtQkFBTyxrQkFBa0IsTUFBTSxPQUFPLEtBQUssS0FBSztBQUFBLFVBQUE7QUFBQSxRQUNsRDtBQUdGLFlBQUksTUFBTztBQUdYLFlBQUksT0FBUTtBQUVaLG9DQUFBLFdBQW1CO0FBQ25CLG9DQUFBLE1BQWM7QUFDZCxvQ0FBQSxPQUFlO0FBQUEsTUFBQSxHQUNiO0FBQUEsSUFDRjs7Ozs7OztBQ2h6Q087QUFDTEMsaUJBQUEsVUFBaUJILG1DQUFBO0FBQUEsSUFDbkI7Ozs7QUNKTyxRQUFNLGdDQUFnQyxNQUFNO0FBQy9DLFVBQU0sMEJBQTBCLG9CQUFJLElBQUc7QUFDdkMsVUFBTSw4QkFBOEIsb0JBQUksSUFBRztBQUMzQyxVQUFNLG9CQUFvQixDQUFDLFdBQVcsZUFBZSxrQkFBa0I7QUFDbkUsa0NBQTRCLElBQUksV0FBVyxhQUFhO0FBQ3hELDhCQUF3QixJQUFJLGVBQWU7QUFBQSxRQUN2QyxrQkFBa0IsSUFBSSxJQUFJLGFBQWE7QUFBQSxRQUN2QyxvQkFBb0I7QUFBQSxNQUNoQyxDQUFTO0FBQ0QsYUFBTztBQUFBLElBQ1g7QUFDQSxXQUFPO0FBQUEsTUFDSCxrQkFBa0IsQ0FBQyxjQUFjO0FBQzdCLGNBQU0sZ0JBQWdCLDRCQUE0QixJQUFJLFNBQVM7QUFDL0QsWUFBSSxDQUFDLGVBQWU7QUFDaEIsaUJBQU87QUFBQSxRQUNYO0FBQ0EsZUFBTztBQUFBLE1BQ1g7QUFBQSxNQUNBLHdCQUF3QixDQUFDLGtCQUFrQjtBQUN2QyxlQUFPLHdCQUF3QixJQUFJLGFBQWE7QUFBQSxNQUNwRDtBQUFBLE1BQ0EseUJBQXlCLENBQUMsZUFBZSxhQUFhO0FBQ2xELGNBQU0sb0JBQW9CLHdCQUF3QixJQUFJLGFBQWE7QUFDbkUsWUFBSSxDQUFDLG1CQUFtQjtBQUNwQixpQkFBTztBQUFBLFFBQ1g7QUFDQSxlQUFPLGtCQUFrQixpQkFBaUIsSUFBSSxRQUFRO0FBQUEsTUFDMUQ7QUFBQSxNQUNBLCtCQUErQixDQUFDLGtCQUFrQjtBQUM5QyxjQUFNLG9CQUFvQix3QkFBd0IsSUFBSSxhQUFhO0FBQ25FLFlBQUksQ0FBQyxtQkFBbUI7QUFDcEIsaUJBQU8sQ0FBQTtBQUFBLFFBQ1g7QUFDQSxjQUFNLEVBQUUsbUJBQWtCLElBQUs7QUFDL0IsZUFBTztBQUFBLE1BQ1g7QUFBQSxNQUNBLHVDQUF1QyxDQUFDLGVBQWUsVUFBVSxPQUFPO0FBQ3BFLGNBQU0sRUFBRSxnQkFBZ0IsQ0FBQSxFQUFFLElBQUs7QUFDL0IsY0FBTSx1QkFBdUJJLE1BQUFBLDJCQUEyQixlQUFlO0FBQUEsVUFDbkU7QUFBQSxRQUNoQixDQUFhO0FBQ0QsZUFBTyxrQkFBa0Isc0JBQXNCLGVBQWUsYUFBYTtBQUFBLE1BQy9FO0FBQUEsTUFDQSwrQ0FBK0MsQ0FBQyxlQUFlLFlBQVk7QUFDdkUsY0FBTSxFQUFFLGdCQUFnQixDQUFBLEVBQUUsSUFBSztBQUMvQixjQUFNLHNCQUFzQkEsTUFBQUEsMkJBQTJCLGVBQWU7QUFBQSxVQUNsRTtBQUFBLFFBQ2hCLENBQWE7QUFHRCxjQUFNLGdDQUFnQyxPQUFPLHdCQUF3QixhQUMvRCxzQkFDQSxDQUFDLFVBQVdDLGtCQUFBQSxJQUFLLHFCQUFxQixFQUFFLEdBQUcsTUFBSyxDQUFFO0FBRXhELGVBQU8sT0FBTywrQkFBK0IsUUFBUSwyQkFBMkI7QUFFaEYsZUFBTyxrQkFBa0IsK0JBQStCLGVBQWUsYUFBYTtBQUFBLE1BQ3hGO0FBQUEsSUFDUjtBQUFBLEVBQ0E7QUN4RE8sUUFBTSw2QkFBNkIsOEJBQTZCO0FBQ3ZFLFFBQU0sRUFBRSx1Q0FBdUMsOENBQTZDLElBQU07QUFZN0Usd0NBQXNDLE9BQU87QUFVM0QsUUFBTSxTQUFTLHNDQUFzQyxVQUFVO0FBQUEsSUFDbEUsZUFBZSxDQUFDLFNBQVM7QUFBQSxFQUM3QixDQUFDO0FBUXdCLHdDQUFzQyxXQUFXO0FBQ3RELHdDQUFzQyxNQUFNO0FBUWpDLHdDQUFzQyxpQkFBaUI7QUFRbkQsd0NBQXNDLHFCQUFxQjtBQVF2RixRQUFNLFVBQVUsc0NBQXNDLFNBQVM7QUFTaEQsd0NBQXNDLFFBQVE7QUFRN0QsUUFBTSxhQUFhLHNDQUFzQyxZQUFZO0FBUXJFLFFBQU0sYUFBYSxzQ0FBc0MsWUFBWTtBQVN4RCx3Q0FBc0MsTUFBTTtBQVF6RCxRQUFNLFVBQVUsc0NBQXNDLFNBQVM7QUFRakQsd0NBQXNDLFNBQVM7QUFBQSxJQUNoRSxlQUFlLENBQUMsU0FBUztBQUFBLEVBQzdCLENBQUM7QUFRTSxRQUFNLFFBQVEsc0NBQXNDLE9BQU87QUFRM0QsUUFBTSxPQUFPLHNDQUFzQyxRQUFRO0FBQUEsSUFDOUQsZUFBZSxDQUFDLFNBQVM7QUFBQSxFQUM3QixDQUFDO0FBUU0sUUFBTSxXQUFXLHNDQUFzQyxVQUFVO0FBSWhELHdDQUFzQyxVQUFVO0FBUWpFLFFBQU0saUJBQWlCLHNDQUFzQyxnQkFBZ0I7QUFRekQsd0NBQXNDLGFBQWE7QUFRdkUsUUFBTSxTQUFTLHNDQUFzQyxRQUFRO0FBUTdELFFBQU0sTUFBTSxzQ0FBc0MsT0FBTztBQUFBLElBQzVELGVBQWUsQ0FBQyxTQUFTO0FBQUEsRUFDN0IsQ0FBQztBQVFNLFFBQU0sT0FBTyxzQ0FBc0MsTUFBTTtBQVE1Qyx3Q0FBc0MsTUFBTTtBQUUzQyx3Q0FBc0MsT0FBTztBQVF2Qyx3Q0FBc0MsYUFBYTtBQVFoRCx3Q0FBc0MsZ0JBQWdCO0FBUTFELHdDQUFzQyxZQUFZO0FBUTdDLHdDQUFzQyxpQkFBaUI7QUFTL0UsUUFBTSxRQUFRLHNDQUFzQyxPQUFPO0FBUTNELFFBQU0sY0FBYyxzQ0FBc0MsYUFBYTtBQVF2RSxRQUFNLFlBQVksc0NBQXNDLFdBQVc7QUFRbkUsUUFBTSxXQUFXLHNDQUFzQyxVQUFVO0FBUWpFLFFBQU0sWUFBWSxzQ0FBc0MsV0FBVztBQVFuRSxRQUFNLGNBQWMsc0NBQXNDLGFBQWE7QUFRdkUsUUFBTSxZQUFZLHNDQUFzQyxXQUFXO0FBUW5FLFFBQU0sY0FBYyxzQ0FBc0MsYUFBYTtBQVN2RSxRQUFNLE1BQU0sc0NBQXNDLEtBQUs7QUFRakMsd0NBQXNDLGVBQWU7QUFRekQsd0NBQXNDLFdBQVc7QUFRbkUsUUFBTSxjQUFjLHNDQUFzQyxhQUFhO0FBU3ZFLFFBQU0sT0FBTyxzQ0FBc0MsTUFBTTtBQVF6RCxRQUFNLFlBQVksc0NBQXNDLFdBQVc7QUFRbkUsUUFBTSxXQUFXLHNDQUFzQyxVQUFVO0FBSTdDLHdDQUFzQyxhQUFhO0FBUTFELHdDQUFzQyxNQUFNO0FBUXpELFFBQU0sU0FBUyxzQ0FBc0MsUUFBUTtBQVE1QyxnREFBOEMsWUFBWTtBQUFBLElBQzlFLDZCQUE2QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFRekIsWUFBWSxzQ0FBc0Msc0JBQXNCO0FBQUEsUUFDcEUsZUFBZSxDQUFDLFNBQVM7QUFBQSxNQUNyQyxDQUFTO0FBQUEsSUFDVDtBQUFBLEVBQ0EsQ0FBQztBQVVvQix3Q0FBc0MsT0FBTztBQVN2Qyx3Q0FBc0MsYUFBYTtBQVNyRCx3Q0FBc0MsV0FBVztBQVM5Qyx3Q0FBc0MsY0FBYztBQVF6RSxRQUFNLGVBQWUsc0NBQXNDLGNBQWM7QUFVM0Qsd0NBQXNDLE9BQU87QUFTekMsd0NBQXNDLFdBQVc7QUFTL0Msd0NBQXNDLGFBQWE7QUFRdkUsUUFBTSxPQUFPLHNDQUFzQyxNQUFNO0FBU3pELFFBQU0sWUFBWSxzQ0FBc0MsV0FBVztBQVE3Qyx3Q0FBc0MsaUJBQWlCO0FBQUEsSUFDaEYsZUFBZSxDQUFDLFNBQVM7QUFBQSxFQUM3QixDQUFDO0FBVXVCLHdDQUFzQyxVQUFVO0FBVS9DLHdDQUFzQyxXQUFXO0FBUy9DLHdDQUFzQyxhQUFhO0FBZTFELHdDQUFzQyxNQUFNO0FBZTdDLHdDQUFzQyxLQUFLO0FBUWxDLHdDQUFzQyxjQUFjO0FBT3pELHdDQUFzQyxTQUFTO0FBUS9ELFFBQU0sY0FBYyxzQ0FBc0MsYUFBYTtBQVFyRCx3Q0FBc0MsV0FBVztBQVNuRSxRQUFNLGdCQUFnQixzQ0FBc0MsZUFBZTtBQU94RCx3Q0FBc0MsUUFBUTtBQVFoRCx3Q0FBc0MsVUFBVTtBQUl6Qyx3Q0FBc0MsaUJBQWlCO0FBQ25ELHdDQUFzQyxxQkFBcUI7QUFDOUQsd0NBQXNDLGtCQUFrQjtBQUMvRCx3Q0FBc0MsV0FBVztBQUN2Qyx3Q0FBc0MscUJBQXFCO0FBQ3BELHdDQUFzQyw0QkFBNEI7QUFDbEUsd0NBQXNDLDRCQUE0QjtBQUMzRSx3Q0FBc0MsbUJBQW1CO0FBQzNELHdDQUFzQyxpQkFBaUI7QUFDekQsd0NBQXNDLGVBQWU7QUFDbkQsd0NBQXNDLGlCQUFpQjtBQUN6RCx3Q0FBc0MsZUFBZTtBQUNwRCx3Q0FBc0MsZ0JBQWdCO0FBUXZELHdDQUFzQyxlQUFlO0FBS3pDLHdDQUFzQyw2QkFBNkI7QUFBQSxJQUN4RyxlQUFlLENBQUMsU0FBUztBQUFBLEVBQzdCLENBQUM7QUFLMEMsd0NBQXNDLCtCQUErQjtBQUFBLElBQzVHLGVBQWUsQ0FBQyxTQUFTO0FBQUEsRUFDN0IsQ0FBQztBQUl1Qix3Q0FBc0MsVUFBVTtBQU9sRCx3Q0FBc0MsUUFBUTtBQUl6Qyx3Q0FBc0MsZUFBZTtBQUFBLElBQzVFLGVBQWUsQ0FBQyxhQUFhLFVBQVU7QUFBQSxFQUMzQyxDQUFDO0FBSXFCLHdDQUFzQyxRQUFRO0FBSTlDLHdDQUFzQyxRQUFRO0FBSWhELHdDQUFzQyxNQUFNO0FBSXhDLHdDQUFzQyxVQUFVO0FBSTVDLHdDQUFzQyxjQUFjO0FBVWxELHdDQUFzQyxnQkFBZ0I7QUFVN0Qsd0NBQXNDLFNBQVM7QUFJN0Msd0NBQXNDLFdBQVc7QUNsc0IxRSxRQUFNLGVBQWVDLE9BQUFBLGNBQWMsSUFBSTtBQXlDSCxlQUFhO0FDNkpqRCxRQUFNLGlCQUFpQixDQUFDLFlBQVk7QUFDbEMsUUFBSSxDQUFDLFFBQVMsUUFBTztBQUNyQixVQUFNLEVBQUUsTUFBTSxPQUFPLEtBQUEsSUFBUztBQUM5QixXQUFPLElBQUksS0FBSyxlQUFlLFNBQVM7QUFBQSxNQUN0QyxPQUFPO0FBQUEsTUFBUyxLQUFLO0FBQUEsTUFBVyxNQUFNO0FBQUEsSUFBQSxDQUN2QyxFQUFFLE9BQU8sSUFBSSxLQUFLLE1BQU0sT0FBTyxJQUFJLENBQUM7QUFBQSxFQUN2QztBQUVBLFFBQU0sa0JBQWtCLENBQUMsWUFBWTtBQUNuQyxRQUFJLENBQUMsUUFBUyxRQUFPO0FBQ3JCLFdBQU8sSUFBSSxLQUFLLFFBQVEsTUFBTSxRQUFRLE9BQU8sUUFBUSxJQUFJLEVBQUUsUUFBQTtBQUFBLEVBQzdEO0FBTUEsUUFBTSxvQkFBb0Isb0JBQUksSUFBSSxDQUFDLFlBQVksUUFBUSxDQUFDO0FBRXhELFFBQU0sZUFBZTtBQUNyQixRQUFNLGNBQWMsb0JBQUksSUFBSSxDQUFDLFFBQVEsU0FBUyxPQUFPLE1BQU0sS0FBSyxHQUFHLENBQUM7QUFFcEUsUUFBTSxvQkFBb0IsQ0FBQyxTQUFTLFNBQVM7QUFDM0MsUUFBSSxDQUFDLFFBQVEsS0FBSyxXQUFXLFVBQVUsQ0FBQTtBQUV2QyxVQUFNLFNBQVMsS0FBSyxNQUFNLEdBQUcsRUFBRTtBQUMvQixVQUFNLFVBQVUsQ0FBQTtBQUVoQixZQUFRLFFBQVEsQ0FBQyxRQUFRO0FBRXZCLFVBQUksSUFBSSxTQUFTLElBQUksVUFBVztBQUVoQyxZQUFNLFNBQVMsT0FBTyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sS0FBSyxJQUFJO0FBQzFFLFlBQU0sVUFBVSxPQUFPLElBQUksQ0FBQyxNQUFNLE9BQU8sQ0FBQyxDQUFDO0FBRTNDLFVBQUksWUFBWTtBQUNoQixVQUFJLGdCQUFnQjtBQUdwQixVQUFJLElBQUksWUFBWSxJQUFJLFlBQVksa0JBQWtCLElBQUksSUFBSSxRQUFRLEdBQUc7QUFDdkUsd0JBQWdCO0FBQUEsTUFDbEI7QUFHQSxVQUFJLFFBQVEsU0FBUyxHQUFHO0FBQ3RCLGNBQU0sVUFBVSxRQUFRLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTTtBQUMzQyxjQUFNLFNBQVMsS0FBSyxJQUFJLEdBQUcsT0FBTztBQUNsQyxjQUFNLGNBQWMsSUFBSSxJQUFJLE9BQU8sRUFBRTtBQUdyQyxZQUFJLE9BQU8sTUFBTSxDQUFDLE1BQU0sT0FBTyxNQUFNLFNBQVMsS0FDNUMsUUFBUSxNQUFNLENBQUMsTUFBTSxZQUFZLElBQUksRUFBRSxZQUFBLENBQWEsQ0FBQyxHQUFHO0FBQ3hELHNCQUFZLGFBQWE7QUFDekIsMEJBQWdCLGlCQUFpQjtBQUFBLFFBQ25DLFdBRVMsUUFBUSxNQUFNLENBQUMsTUFBTSxhQUFhLEtBQUssQ0FBQyxDQUFDLEdBQUc7QUFDbkQsc0JBQVksYUFBYTtBQUN6QiwwQkFBZ0IsaUJBQWlCO0FBQUEsUUFDbkMsV0FFUyxPQUFPLE1BQU0sQ0FBQyxNQUFNLE9BQU8sTUFBTSxRQUFRLEdBQUc7QUFDbkQsc0JBQVksYUFBYTtBQUN6QiwwQkFBZ0IsaUJBQWlCO0FBQUEsUUFDbkMsV0FFUyxlQUFlLEtBQUssVUFBVSxJQUFJO0FBQ3pDLHNCQUFZLGFBQWE7QUFDekIsMEJBQWdCLGlCQUFpQjtBQUFBLFFBQ25DLE9BRUs7QUFDSCxzQkFBWSxhQUFhO0FBQ3pCLDBCQUFnQixpQkFBaUI7QUFBQSxRQUNuQztBQUFBLE1BQ0Y7QUFJQSxVQUFJLElBQUksWUFBWSxDQUFDLGtCQUFrQixJQUFJLElBQUksUUFBUSxLQUFLLGNBQWMsT0FBTztBQUMvRSxvQkFBWTtBQUFBLE1BQ2Q7QUFFQSxjQUFRLElBQUksS0FBSyxJQUFJO0FBQUEsUUFDbkIsT0FBTyxhQUFhO0FBQUEsUUFDcEIsV0FBVyxpQkFBaUI7QUFBQSxNQUFBO0FBQUEsSUFFaEMsQ0FBQztBQUVELFdBQU87QUFBQSxFQUNUO0FBRUEsUUFBTSxzQkFBc0IsQ0FBQyxXQUFXO0FBQ3RDLFVBQU0sT0FBTyxPQUFPLFFBQVE7QUFDNUIsUUFBSSxTQUFTLGNBQWUsUUFBTyxDQUFBO0FBQ25DLFFBQUksU0FBUyxZQUFhLFFBQU8sRUFBRSxNQUFNLE1BQU0sSUFBSSxLQUFBO0FBQ25ELFdBQU87QUFBQSxFQUNUO0FBRUEsUUFBTSx5QkFBeUI7QUFBQSxJQUM3QixFQUFFLE9BQU8sT0FBTyxPQUFPLEtBQUE7QUFBQSxJQUN2QixFQUFFLE9BQU8sTUFBTSxPQUFPLE1BQUE7QUFBQSxFQUN4QjtBQUVBLFFBQU0scUJBQXFCLENBQUMsS0FBSyxTQUFTO0FBQ3hDLFFBQUksSUFBSSxlQUFlLElBQUksWUFBWSxTQUFTLFVBQVUsSUFBSTtBQUU5RCxVQUFNLFNBQVMsS0FBSyxLQUFLLENBQUMsUUFBUSxJQUFJLElBQUksS0FBSyxLQUFLLElBQUk7QUFDeEQsUUFBSSxVQUFVLE9BQU8sT0FBTyxJQUFJLEtBQUssTUFBTSxVQUFXLFFBQU87QUFDN0QsV0FBTyxDQUFBO0FBQUEsRUFDVDtBQUVBLFFBQU0saUJBQWlCLENBQUMsUUFBUSxVQUFVO0FBQ3hDLFVBQU0sT0FBTyxPQUFPLFFBQVE7QUFDNUIsUUFBSSxTQUFTLGNBQWUsUUFBTyxNQUFNLFFBQVEsS0FBSyxLQUFLLE1BQU0sU0FBUztBQUMxRSxRQUFJLFNBQVMsWUFBYSxRQUFPLFVBQVUsTUFBTSxRQUFRLE1BQU07QUFDL0QsV0FBTyxDQUFDLENBQUM7QUFBQSxFQUNYO0FBTU8sUUFBTSxZQUFZLENBQUM7QUFBQTtBQUFBLElBRXhCO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQTtBQUFBLElBR0EsZUFBZSxDQUFBO0FBQUEsSUFDZixvQkFBb0I7QUFBQTtBQUFBLElBR3BCLFVBQVUsQ0FBQTtBQUFBO0FBQUEsSUFHVixXQUFXO0FBQUEsSUFDWDtBQUFBO0FBQUEsSUFDQSxtQkFBbUI7QUFBQTtBQUFBLElBQ25CO0FBQUE7QUFBQTtBQUFBLElBR0EsZUFBZTtBQUFBO0FBQUEsSUFDZixlQUFlO0FBQUE7QUFBQSxJQUNmO0FBQUE7QUFBQTtBQUFBLElBR0EsV0FBVztBQUFBO0FBQUEsSUFDWCxRQUFRO0FBQUE7QUFBQTtBQUFBLElBR1IsY0FBYyxDQUFBO0FBQUE7QUFBQSxJQUdkO0FBQUE7QUFBQSxJQUdBO0FBQUE7QUFBQSxJQUdBLGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtmLGFBQWE7QUFBQSxJQUNiLFVBQVU7QUFBQTtBQUFBLElBQ1Y7QUFBQTtBQUFBLElBQ0E7QUFBQTtBQUFBLElBQ0EsTUFBTTtBQUFBO0FBQUEsSUFDTjtBQUFBO0FBQUEsSUFDQSxjQUFjO0FBQUE7QUFBQSxJQUNkLE1BQU07QUFBQTtBQUFBLElBQ04saUJBQWlCO0FBQUE7QUFBQSxJQUNqQixvQkFBb0I7QUFBQTtBQUFBLElBQ3BCO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtBLGFBQWE7QUFBQSxJQUNiLGFBQWE7QUFBQTtBQUFBLElBQ2I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0E7QUFBQTtBQUFBLElBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0EsWUFBWTtBQUFBO0FBQUEsRUFDZCxNQUFNO0FBRUosVUFBTSxtQkFBbUJDLE9BQUFBLFFBQVEsTUFBTTtBQUNyQyxZQUFNLFFBQVEsQ0FBQTtBQUNkLGNBQVEsUUFBUSxDQUFDLFFBQVE7QUFDdkIsWUFBSSxJQUFJLFVBQVU7QUFDaEIsZ0JBQU0sSUFBSSxLQUFLLElBQUksWUFBWSxJQUFJLEtBQUssS0FBSztBQUFBLFFBQy9DO0FBQUEsTUFDRixDQUFDO0FBQ0QsYUFBTztBQUFBLElBQ1QsR0FBRyxDQUFDLFNBQVMsV0FBVyxDQUFDO0FBS3pCLFVBQU0sQ0FBQyxvQkFBb0IscUJBQXFCLElBQUlDLE9BQUFBLFNBQVMsRUFBRTtBQUMvRCxVQUFNLENBQUMsc0JBQXNCLHVCQUF1QixJQUFJQSxPQUFBQSxTQUFTLE1BQU07QUFDckUsWUFBTSxPQUFPLENBQUE7QUFDYixjQUFRLFFBQVEsQ0FBQyxNQUFNO0FBQUUsYUFBSyxFQUFFLElBQUksSUFBSSxvQkFBb0IsQ0FBQztBQUFBLE1BQUcsQ0FBQztBQUNqRSxhQUFPO0FBQUEsSUFDVCxDQUFDO0FBQ0QsVUFBTSxDQUFDLG1CQUFtQixvQkFBb0IsSUFBSUEsT0FBQUEsU0FBUyxnQkFBZ0I7QUFDM0UsVUFBTSxDQUFDLGFBQWEsY0FBYyxJQUFJQSxPQUFBQSxTQUFTLENBQUM7QUFDaEQsVUFBTSxDQUFDLGlCQUFpQixrQkFBa0IsSUFBSUEsT0FBQUEsU0FBUyxLQUFLO0FBRzVELFVBQU0sYUFBYSxjQUFjLGVBQWUsT0FBTyxjQUFjO0FBQ3JFLFVBQU0sZUFBZSxjQUFjLHdCQUF3QixPQUFPLHVCQUF1QjtBQUN6RixVQUFNLFlBQVksY0FBYyxnQkFBZ0IsUUFDM0MsTUFBTTtBQUNQLFlBQU0sSUFBSSxDQUFBO0FBQ1YsY0FBUSxRQUFRLENBQUMsUUFBUTtBQUFFLFlBQUksSUFBSSxTQUFVLEdBQUUsSUFBSSxLQUFLLElBQUksYUFBYSxJQUFJLEtBQUssS0FBSztBQUFBLE1BQVEsQ0FBQztBQUNoRyxhQUFPO0FBQUEsSUFDVCxPQUNFO0FBR0osVUFBTSxhQUFhLGNBQWMsZ0JBQWdCLE9BQU8sZUFBZTtBQUd2RUMsSUFBQUEsT0FBQUEsVUFBVSxNQUFNO0FBQ2QsVUFBSSxDQUFDLFdBQVksZ0JBQWUsQ0FBQztBQUFBLElBQ25DLEdBQUcsQ0FBQyxvQkFBb0Isc0JBQXNCLG1CQUFtQixVQUFVLENBQUM7QUFLNUUsVUFBTSxjQUFjQyxPQUFBQSxPQUFPLElBQUk7QUFFL0IsVUFBTSxxQkFBcUJDLG1CQUFZLENBQUMsU0FBUztBQUMvQyxVQUFJLGNBQWMsZUFBZ0IsZ0JBQWUsSUFBSTtBQUFBLElBQ3ZELEdBQUcsQ0FBQyxZQUFZLGNBQWMsQ0FBQztBQUsvQixVQUFNLG1CQUFtQkEsbUJBQVksQ0FBQyxjQUFjO0FBQ2xELFVBQUksQ0FBQyxlQUFnQjtBQUNyQixZQUFNLGtCQUFrQixPQUFPLEtBQUssVUFBVSxRQUFRLFNBQVMsRUFBRTtBQUFBLFFBQy9ELENBQUMsT0FBTyxVQUFVLFFBQVEsV0FBVyxDQUFDLE1BQU07QUFBQSxNQUFBO0FBRTlDLHFCQUFlO0FBQUEsUUFDYixRQUFRLFVBQVUsVUFBVSxPQUFPLFVBQVUsU0FBUztBQUFBLFFBQ3RELFNBQVMsVUFBVSxXQUFXLE9BQU8sVUFBVSxVQUFVO0FBQUEsUUFDekQsTUFBTSxrQkFDRixFQUFFLE9BQU8saUJBQWlCLFlBQVksVUFBVSxRQUFRLFdBQVcsZUFBZSxFQUFBLElBQ2xGO0FBQUEsUUFDSixNQUFNLFVBQVUsUUFBUSxPQUFPLFVBQVUsT0FBTztBQUFBLE1BQUEsQ0FDakQ7QUFBQSxJQUNILEdBQUcsQ0FBQyxnQkFBZ0IsWUFBWSxjQUFjLFdBQVcsVUFBVSxDQUFDO0FBTXBFLFVBQU0sWUFBWUEsT0FBQUEsWUFBWSxNQUFNO0FBQ2xDLFVBQUksbUJBQW1CO0FBQ3JCLHVCQUFlLENBQUM7QUFDaEIsWUFBSSxjQUFjLGFBQWMsY0FBYSxDQUFDO0FBQUEsTUFDaEQ7QUFBQSxJQUNGLEdBQUcsQ0FBQyxtQkFBbUIsWUFBWSxZQUFZLENBQUM7QUFFaEQsVUFBTSxxQkFBcUJBLG1CQUFZLENBQUMsU0FBUztBQUMvQyw0QkFBc0IsSUFBSTtBQUMxQixnQkFBQTtBQUNBLFVBQUksaUJBQWlCLEdBQUc7QUFDdEIsWUFBSSxZQUFZLFFBQVMsY0FBYSxZQUFZLE9BQU87QUFDekQsb0JBQVksVUFBVSxXQUFXLE1BQU07QUFDckMsNkJBQW1CLElBQUk7QUFDdkIsMkJBQWlCLEVBQUUsUUFBUSxNQUFNLE1BQU0sb0JBQW9CLElBQUksUUFBVztBQUFBLFFBQzVFLEdBQUcsY0FBYztBQUFBLE1BQ25CLE9BQU87QUFDTCwyQkFBbUIsSUFBSTtBQUN2Qix5QkFBaUIsRUFBRSxRQUFRLE1BQU0sTUFBTSxvQkFBb0IsSUFBSSxRQUFXO0FBQUEsTUFDNUU7QUFBQSxJQUNGLEdBQUcsQ0FBQyxnQkFBZ0Isb0JBQW9CLGtCQUFrQixXQUFXLGlCQUFpQixDQUFDO0FBR3ZGRixJQUFBQSxPQUFBQSxVQUFVLE1BQU0sTUFBTTtBQUFFLFVBQUksWUFBWSxRQUFTLGNBQWEsWUFBWSxPQUFPO0FBQUEsSUFBRyxHQUFHLENBQUEsQ0FBRTtBQUV6RixVQUFNLHFCQUFxQkUsT0FBQUEsWUFBWSxDQUFDLE1BQU0sVUFBVTtBQUN0RCw4QkFBd0IsQ0FBQyxTQUFTO0FBQ2hDLGNBQU0sT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFBO0FBQ2hDLFlBQUksY0FBYyxlQUFnQixnQkFBZSxJQUFJO0FBQ3JELGtCQUFBO0FBQ0EseUJBQWlCLEVBQUUsU0FBUyxNQUFNLE1BQU0sb0JBQW9CLElBQUksUUFBVztBQUMzRSxlQUFPO0FBQUEsTUFDVCxDQUFDO0FBQUEsSUFDSCxHQUFHLENBQUMsWUFBWSxnQkFBZ0Isa0JBQWtCLFdBQVcsaUJBQWlCLENBQUM7QUFFL0UsVUFBTSxtQkFBbUJBLG1CQUFZLENBQUMsVUFBVTtBQUM5QyxZQUFNLFdBQVcsY0FBYyxlQUFlLGFBQWEsS0FBSyxJQUFJLGtCQUFrQixLQUFLLE1BQU07QUFDakcsWUFBTSxnQkFDSixZQUFZLFNBQVMsY0FDbkIsWUFBWSxjQUFjLGVBQWU7QUFFN0MsWUFBTSxRQUFRLENBQUE7QUFDZCxhQUFPLEtBQUssaUJBQWlCLEVBQUUsUUFBUSxDQUFDLE1BQU07QUFBRSxjQUFNLENBQUMsSUFBSTtBQUFBLE1BQVEsQ0FBQztBQUNwRSxZQUFNLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEdBQUcsY0FBQTtBQUNsQywyQkFBcUIsSUFBSTtBQUN6QixVQUFJLGNBQWMsYUFBYyxjQUFhLE9BQU8sYUFBYTtBQUNqRSxnQkFBQTtBQUNBLHVCQUFpQixFQUFFLE1BQU0sTUFBTSxNQUFNLG9CQUFvQixJQUFJLFFBQVc7QUFBQSxJQUMxRSxHQUFHLENBQUMsbUJBQW1CLFlBQVksY0FBYyxjQUFjLGtCQUFrQixXQUFXLGlCQUFpQixDQUFDO0FBRTlHLFVBQU0sbUJBQW1CQSxtQkFBWSxDQUFDLFNBQVM7QUFDN0MscUJBQWUsSUFBSTtBQUNuQixVQUFJLGNBQWMsYUFBYyxjQUFhLElBQUk7QUFDakQsdUJBQWlCLEVBQUUsTUFBTTtBQUFBLElBQzNCLEdBQUcsQ0FBQyxZQUFZLGNBQWMsZ0JBQWdCLENBQUM7QUFLL0MsVUFBTSxlQUFlSixPQUFBQSxRQUFRLE1BQU07QUFDakMsVUFBSSxXQUFZLFFBQU87QUFFdkIsVUFBSSxTQUFTO0FBR2IsY0FBUSxRQUFRLENBQUMsV0FBVztBQUMxQixjQUFNLFFBQVEsYUFBYSxPQUFPLElBQUk7QUFDdEMsWUFBSSxDQUFDLGVBQWUsUUFBUSxLQUFLLEVBQUc7QUFFcEMsY0FBTSxPQUFPLE9BQU8sUUFBUTtBQUU1QixZQUFJLE9BQU8sVUFBVTtBQUNuQixtQkFBUyxPQUFPLE9BQU8sQ0FBQyxRQUFRLE9BQU8sU0FBUyxLQUFLLEtBQUssQ0FBQztBQUFBLFFBQzdELFdBQVcsU0FBUyxlQUFlO0FBRWpDLG1CQUFTLE9BQU8sT0FBTyxDQUFDLFFBQVEsTUFBTSxTQUFTLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQztBQUFBLFFBQ2xFLFdBQVcsU0FBUyxhQUFhO0FBQy9CLGdCQUFNLFNBQVMsZ0JBQWdCLE1BQU0sSUFBSTtBQUN6QyxnQkFBTSxPQUFPLE1BQU0sS0FBSyxnQkFBZ0IsTUFBTSxFQUFFLElBQUksUUFBVyxJQUFJO0FBQ25FLG1CQUFTLE9BQU8sT0FBTyxDQUFDLFFBQVE7QUFDOUIsa0JBQU0sUUFBUSxJQUFJLEtBQUssSUFBSSxPQUFPLElBQUksQ0FBQyxFQUFFLFFBQUE7QUFDekMsZ0JBQUksVUFBVSxRQUFRLE9BQVEsUUFBTztBQUNyQyxnQkFBSSxRQUFRLFFBQVEsS0FBTSxRQUFPO0FBQ2pDLG1CQUFPO0FBQUEsVUFDVCxDQUFDO0FBQUEsUUFDSCxPQUFPO0FBRUwsbUJBQVMsT0FBTyxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sSUFBSSxNQUFNLEtBQUs7QUFBQSxRQUM1RDtBQUFBLE1BQ0YsQ0FBQztBQUdELFVBQUksY0FBYyxhQUFhLFNBQVMsR0FBRztBQUN6QyxjQUFNLE9BQU8sV0FBVyxZQUFBO0FBQ3hCLGlCQUFTLE9BQU87QUFBQSxVQUFPLENBQUMsUUFDdEIsYUFBYSxLQUFLLENBQUMsVUFBVTtBQUMzQixrQkFBTSxNQUFNLElBQUksS0FBSztBQUNyQixtQkFBTyxPQUFPLE9BQU8sR0FBRyxFQUFFLFlBQUEsRUFBYyxTQUFTLElBQUk7QUFBQSxVQUN2RCxDQUFDO0FBQUEsUUFBQTtBQUFBLE1BRUw7QUFFQSxhQUFPO0FBQUEsSUFDVCxHQUFHLENBQUMsTUFBTSxjQUFjLFlBQVksU0FBUyxjQUFjLFVBQVUsQ0FBQztBQUt0RSxVQUFNLGFBQWFBLE9BQUFBLFFBQVEsTUFBTTtBQUMvQixVQUFJLFdBQVksUUFBTztBQUV2QixZQUFNLGNBQWMsT0FBTyxLQUFLLFNBQVMsRUFBRSxLQUFLLENBQUMsTUFBTSxVQUFVLENBQUMsTUFBTSxNQUFNO0FBQzlFLFVBQUksQ0FBQyxZQUFhLFFBQU87QUFFekIsYUFBTyxDQUFDLEdBQUcsWUFBWSxFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU07QUFDdEMsY0FBTSxNQUFNLFVBQVUsV0FBVyxNQUFNLGNBQWMsSUFBSTtBQUN6RCxjQUFNLE9BQU8sRUFBRSxXQUFXO0FBQzFCLGNBQU0sT0FBTyxFQUFFLFdBQVc7QUFDMUIsWUFBSSxRQUFRLFFBQVEsUUFBUSxLQUFNLFFBQU87QUFDekMsWUFBSSxRQUFRLEtBQU0sUUFBTztBQUN6QixZQUFJLFFBQVEsS0FBTSxRQUFPO0FBQ3pCLFlBQUksT0FBTyxLQUFNLFFBQU8sQ0FBQztBQUN6QixZQUFJLE9BQU8sS0FBTSxRQUFPO0FBQ3hCLGVBQU87QUFBQSxNQUNULENBQUM7QUFBQSxJQUNILEdBQUcsQ0FBQyxjQUFjLFdBQVcsVUFBVSxDQUFDO0FBS3hDLFVBQU0sY0FBY0EsT0FBQUEsUUFBUSxNQUFNO0FBQ2hDLFVBQUksQ0FBQyxRQUFTLFFBQU87QUFFckIsWUFBTSxTQUFTLGFBQWEsT0FBTztBQUNuQyxZQUFNLFNBQVMsQ0FBQTtBQUNmLGFBQU8sUUFBUSxDQUFDLFFBQVE7QUFDdEIsY0FBTSxNQUFNLElBQUksUUFBUSxLQUFLLEtBQUs7QUFDbEMsWUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFHLFFBQU8sR0FBRyxJQUFJLENBQUE7QUFDaEMsZUFBTyxHQUFHLEVBQUUsS0FBSyxHQUFHO0FBQUEsTUFDdEIsQ0FBQztBQUVELFVBQUksWUFBWSxPQUFPLEtBQUssTUFBTTtBQUNsQyxVQUFJLFFBQVEsTUFBTTtBQUNoQixZQUFJLE9BQU8sUUFBUSxTQUFTLFlBQVk7QUFDdEMsb0JBQVUsS0FBSyxRQUFRLElBQUk7QUFBQSxRQUM3QixPQUFPO0FBQ0wsZ0JBQU0sTUFBTSxRQUFRLFNBQVMsU0FBUyxLQUFLO0FBQzNDLG9CQUFVLEtBQUssQ0FBQyxHQUFHLE1BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksTUFBTSxDQUFFO0FBQUEsUUFDM0Q7QUFBQSxNQUNGO0FBRUEsYUFBTyxVQUFVLElBQUksQ0FBQyxTQUFTO0FBQUEsUUFDN0I7QUFBQSxRQUNBLE9BQU8sUUFBUSxRQUFRLFFBQVEsTUFBTSxLQUFLLE9BQU8sR0FBRyxDQUFDLElBQUk7QUFBQSxRQUN6RCxNQUFNLE9BQU8sR0FBRztBQUFBLE1BQUEsRUFDaEI7QUFBQSxJQUNKLEdBQUcsQ0FBQyxZQUFZLE1BQU0sU0FBUyxVQUFVLENBQUM7QUFHMUMsVUFBTSxDQUFDLGdCQUFnQixpQkFBaUIsSUFBSUMsT0FBQUEsU0FBUyxNQUFNO0FBQ3pELFVBQUksQ0FBQyxRQUFTLFFBQU8sb0JBQUksSUFBQTtBQUN6QixZQUFNLGtCQUFrQixRQUFRLG9CQUFvQjtBQUNwRCxVQUFJLG1CQUFtQixhQUFhO0FBQ2xDLGVBQU8sSUFBSSxJQUFJLFlBQVksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUM7QUFBQSxNQUM5QztBQUNBLGlDQUFXLElBQUE7QUFBQSxJQUNiLENBQUM7QUFHREMsSUFBQUEsT0FBQUEsVUFBVSxNQUFNO0FBQ2QsVUFBSSxDQUFDLFlBQWE7QUFDbEIsWUFBTSxtQkFBa0IsbUNBQVMscUJBQW9CO0FBQ3JELFVBQUksaUJBQWlCO0FBQ25CLDBCQUFrQixDQUFDLFNBQVM7QUFDMUIsZ0JBQU0sT0FBTyxJQUFJLElBQUksSUFBSTtBQUN6QixzQkFBWSxRQUFRLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRSxHQUFHLENBQUM7QUFDMUMsaUJBQU87QUFBQSxRQUNULENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRixHQUFHLENBQUMsYUFBYSxPQUFPLENBQUM7QUFFekIsVUFBTSxjQUFjRSxtQkFBWSxDQUFDLFFBQVE7QUFDdkMsd0JBQWtCLENBQUMsU0FBUztBQUMxQixjQUFNLE9BQU8sSUFBSSxJQUFJLElBQUk7QUFDekIsWUFBSSxLQUFLLElBQUksR0FBRyxFQUFHLE1BQUssT0FBTyxHQUFHO0FBQUEsWUFDN0IsTUFBSyxJQUFJLEdBQUc7QUFDakIsZUFBTztBQUFBLE1BQ1QsQ0FBQztBQUFBLElBQ0gsR0FBRyxDQUFBLENBQUU7QUFHTCxVQUFNLFdBQVdKLE9BQUFBLFFBQVEsTUFBTTtBQUM3QixVQUFJLENBQUMsWUFBYSxTQUFRLGFBQWEsT0FBTyxZQUFZLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxRQUFRLE1BQU07QUFFOUYsWUFBTSxPQUFPLENBQUE7QUFDYixrQkFBWSxRQUFRLENBQUMsVUFBVTtBQUM3QixhQUFLLEtBQUssRUFBRSxNQUFNLGdCQUFnQixPQUFPO0FBQ3pDLFlBQUksZUFBZSxJQUFJLE1BQU0sR0FBRyxHQUFHO0FBQ2pDLGdCQUFNLEtBQUssUUFBUSxDQUFDLFFBQVEsS0FBSyxLQUFLLEVBQUUsTUFBTSxRQUFRLElBQUEsQ0FBSyxDQUFDO0FBQUEsUUFDOUQ7QUFBQSxNQUNGLENBQUM7QUFDRCxhQUFPO0FBQUEsSUFDVCxHQUFHLENBQUMsYUFBYSxZQUFZLE1BQU0sWUFBWSxjQUFjLENBQUM7QUFLOUQsVUFBTSxhQUFhLGFBQWMsY0FBYyxLQUFLLFNBQVUsU0FBUztBQUN2RSxVQUFNLFlBQVksS0FBSyxLQUFLLGFBQWEsUUFBUTtBQUVqRCxRQUFJO0FBQ0osUUFBSSxZQUFZO0FBRWQsb0JBQWMsVUFDVixXQUNBLEtBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLFFBQVEsSUFBQSxFQUFNO0FBQUEsSUFDL0MsT0FBTztBQUNMLG9CQUFjLFNBQVM7QUFBQSxTQUNwQixhQUFhLEtBQUs7QUFBQSxRQUNuQixhQUFhO0FBQUEsTUFBQTtBQUFBLElBRWpCO0FBR0EsVUFBTSxhQUFhLGFBQWEsT0FBTztBQUt2QyxVQUFNLGNBQWNBLE9BQUFBLFFBQVEsTUFBTTtBQUNoQyxZQUFNLFFBQVEsQ0FBQTtBQUNkLGNBQVEsUUFBUSxDQUFDLFdBQVc7QUFDMUIsY0FBTSxRQUFRLGFBQWEsT0FBTyxJQUFJO0FBQ3RDLFlBQUksQ0FBQyxlQUFlLFFBQVEsS0FBSyxFQUFHO0FBRXBDLGNBQU0sT0FBTyxPQUFPLFFBQVE7QUFDNUIsY0FBTSxTQUFTLE9BQU8sYUFBYSxPQUFPLGVBQWUsT0FBTztBQUVoRSxZQUFJLFNBQVMsZUFBZTtBQUMxQixnQkFBTSxTQUFTLE1BQ1osSUFBSSxDQUFDOztBQUFNLGlDQUFPLFFBQVEsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsTUFBeEMsbUJBQTJDLFVBQVM7QUFBQSxXQUFDLEVBQ2hFLEtBQUssSUFBSTtBQUNaLGdCQUFNLEtBQUssRUFBRSxLQUFLLE9BQU8sTUFBTSxPQUFPLEdBQUcsTUFBTSxLQUFLLE1BQU0sR0FBQSxDQUFJO0FBQUEsUUFDaEUsV0FBVyxTQUFTLGFBQWE7QUFDL0IsZ0JBQU0sUUFBUSxDQUFBO0FBQ2QsY0FBSSxNQUFNLEtBQU0sT0FBTSxLQUFLLFFBQVEsZUFBZSxNQUFNLElBQUksQ0FBQyxFQUFFO0FBQy9ELGNBQUksTUFBTSxHQUFJLE9BQU0sS0FBSyxNQUFNLGVBQWUsTUFBTSxFQUFFLENBQUMsRUFBRTtBQUN6RCxnQkFBTSxLQUFLLEVBQUUsS0FBSyxPQUFPLE1BQU0sT0FBTyxHQUFHLE1BQU0sS0FBSyxNQUFNLEtBQUssR0FBRyxDQUFDLElBQUk7QUFBQSxRQUN6RSxPQUFPO0FBQ0wsZ0JBQU0sU0FBUyxPQUFPLFFBQVEsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLEtBQUs7QUFDM0QsZ0JBQU0sS0FBSyxFQUFFLEtBQUssT0FBTyxNQUFNLE9BQU8sR0FBRyxNQUFNLE1BQUssaUNBQVEsVUFBUyxLQUFLLElBQUk7QUFBQSxRQUNoRjtBQUFBLE1BQ0YsQ0FBQztBQUNELGFBQU87QUFBQSxJQUNULEdBQUcsQ0FBQyxjQUFjLE9BQU8sQ0FBQztBQUUxQixVQUFNLHFCQUFxQkksbUJBQVksQ0FBQyxRQUFRO0FBQzlDLFVBQUksUUFBUSxPQUFPO0FBQ2pCLGNBQU0sVUFBVSxDQUFBO0FBQ2hCLGdCQUFRLFFBQVEsQ0FBQyxNQUFNO0FBQUUsa0JBQVEsRUFBRSxJQUFJLElBQUksb0JBQW9CLENBQUM7QUFBQSxRQUFHLENBQUM7QUFDcEUsZ0NBQXdCLE9BQU87QUFDL0IsWUFBSSxjQUFjLGVBQWdCLGdCQUFlLE9BQU87QUFDeEQsa0JBQUE7QUFDQSx5QkFBaUIsRUFBRSxTQUFTLFNBQVMsTUFBTSxvQkFBb0IsSUFBSSxRQUFXO0FBQUEsTUFDaEYsT0FBTztBQUNMLGNBQU0sU0FBUyxRQUFRLEtBQUssQ0FBQyxNQUFNLEVBQUUsU0FBUyxHQUFHO0FBQ2pELGNBQU0sV0FBVyxTQUFTLG9CQUFvQixNQUFNLElBQUk7QUFDeEQsZ0NBQXdCLENBQUMsU0FBUztBQUNoQyxnQkFBTSxPQUFPLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxHQUFHLFNBQUE7QUFDL0IsY0FBSSxjQUFjLGVBQWdCLGdCQUFlLElBQUk7QUFDckQsb0JBQUE7QUFDQSwyQkFBaUIsRUFBRSxTQUFTLE1BQU0sTUFBTSxvQkFBb0IsSUFBSSxRQUFXO0FBQzNFLGlCQUFPO0FBQUEsUUFDVCxDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0YsR0FBRyxDQUFDLFNBQVMsWUFBWSxnQkFBZ0IsV0FBVyxrQkFBa0IsaUJBQWlCLENBQUM7QUFHeEYsVUFBTSxlQUFlLGFBQWMsY0FBYyxLQUFLLFNBQVUsYUFBYTtBQUM3RSxVQUFNLGlCQUFpQixhQUFjLGNBQWMsS0FBSyxTQUFVLEtBQUs7QUFDdkUsVUFBTSxtQkFBbUIsZUFDckIsYUFBYSxjQUFjLGNBQWMsSUFDekMsaUJBQWlCLGlCQUNmLEdBQUcsY0FBYyxhQUNqQixHQUFHLFlBQVksT0FBTyxjQUFjO0FBSzFDLFVBQU0sQ0FBQyxhQUFhLGNBQWMsSUFBSUgsT0FBQUEsU0FBUyxvQkFBSSxLQUFLO0FBRXhEQyxJQUFBQSxPQUFBQSxVQUFVLE1BQU07QUFDZCxVQUFJLFdBQVksZ0JBQWUsb0JBQUksS0FBSztBQUFBLElBQzFDLEdBQUcsQ0FBQyxZQUFZLGNBQWMsVUFBVSxDQUFDO0FBRXpDLFVBQU0sa0JBQWtCRSxPQUFBQSxZQUFZLENBQUMsT0FBTyxZQUFZO0FBQ3RELHFCQUFlLENBQUMsU0FBUztBQUN2QixjQUFNLE9BQU8sSUFBSSxJQUFJLElBQUk7QUFDekIsWUFBSSxRQUFTLE1BQUssSUFBSSxLQUFLO0FBQUEsWUFDdEIsTUFBSyxPQUFPLEtBQUs7QUFDdEIsWUFBSSxrQkFBbUIsbUJBQWtCLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDbEQsZUFBTztBQUFBLE1BQ1QsQ0FBQztBQUFBLElBQ0gsR0FBRyxDQUFDLGlCQUFpQixDQUFDO0FBRXRCLFVBQU0sa0JBQWtCQSxtQkFBWSxDQUFDLFlBQVk7QUFDL0MsWUFBTSxhQUFhLFlBQ2hCLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxNQUFNLEVBQy9CLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxVQUFVLENBQUM7QUFDL0IscUJBQWUsQ0FBQyxTQUFTO0FBQ3ZCLGNBQU0sT0FBTyxJQUFJLElBQUksSUFBSTtBQUN6QixtQkFBVyxRQUFRLENBQUMsT0FBTztBQUN6QixjQUFJLFFBQVMsTUFBSyxJQUFJLEVBQUU7QUFBQSxjQUNuQixNQUFLLE9BQU8sRUFBRTtBQUFBLFFBQ3JCLENBQUM7QUFDRCxZQUFJLGtCQUFtQixtQkFBa0IsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNsRCxlQUFPO0FBQUEsTUFDVCxDQUFDO0FBQUEsSUFDSCxHQUFHLENBQUMsYUFBYSxZQUFZLGlCQUFpQixDQUFDO0FBRS9DLFVBQU0scUJBQXFCSixPQUFBQSxRQUFRLE1BQU07QUFDdkMsWUFBTSxhQUFhLFlBQ2hCLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxNQUFNLEVBQy9CLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxVQUFVLENBQUM7QUFDL0IsYUFBTyxXQUFXLFNBQVMsS0FBSyxXQUFXLE1BQU0sQ0FBQyxPQUFPLFlBQVksSUFBSSxFQUFFLENBQUM7QUFBQSxJQUM5RSxHQUFHLENBQUMsYUFBYSxhQUFhLFVBQVUsQ0FBQztBQUt6QyxVQUFNLENBQUMsYUFBYSxjQUFjLElBQUlDLE9BQUFBLFNBQVMsSUFBSTtBQUNuRCxVQUFNLENBQUMsV0FBVyxZQUFZLElBQUlBLE9BQUFBLFNBQVMsSUFBSTtBQUMvQyxVQUFNLENBQUMsV0FBVyxZQUFZLElBQUlBLE9BQUFBLFNBQVMsSUFBSTtBQUUvQyxVQUFNLGVBQWVHLE9BQUFBLFlBQVksQ0FBQyxPQUFPLE9BQU8saUJBQWlCO0FBQy9ELHFCQUFlLEVBQUUsT0FBTyxPQUFPO0FBQy9CLG1CQUFhLFlBQVk7QUFDekIsbUJBQWEsSUFBSTtBQUFBLElBQ25CLEdBQUcsQ0FBQSxDQUFFO0FBRWNBLElBQUFBLE9BQUFBLFlBQVksTUFBTTtBQUNuQyxxQkFBZSxJQUFJO0FBQ25CLG1CQUFhLElBQUk7QUFDakIsbUJBQWEsSUFBSTtBQUFBLElBQ25CLEdBQUcsQ0FBQSxDQUFFO0FBRUwsVUFBTSxhQUFhQSxPQUFBQSxZQUFZLENBQUMsS0FBSyxPQUFPLFVBQVU7QUFDcEQsWUFBTSxNQUFNLFFBQVEsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLEtBQUs7QUFDakQsVUFBSSwyQkFBSyxjQUFjO0FBQ3JCLGNBQU0sU0FBUyxJQUFJLGFBQWEsT0FBTyxHQUFHO0FBQzFDLFlBQUksV0FBVyxRQUFRLFdBQVcsVUFBYSxXQUFXLE1BQU07QUFDOUQsdUJBQWEsT0FBTyxXQUFXLFdBQVcsU0FBUyxlQUFlO0FBQ2xFO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFDQSxVQUFJLFVBQVcsV0FBVSxLQUFLLE9BQU8sS0FBSztBQUMxQyxxQkFBZSxJQUFJO0FBQ25CLG1CQUFhLElBQUk7QUFDakIsbUJBQWEsSUFBSTtBQUFBLElBQ25CLEdBQUcsQ0FBQyxXQUFXLE9BQU8sQ0FBQztBQUV2QixVQUFNLG9CQUFvQixDQUFDLEtBQUssUUFBUTtBQUN0QyxZQUFNLE9BQU8sSUFBSSxZQUFZO0FBQzdCLFlBQU0sUUFBUSxJQUFJLFVBQVU7QUFDNUIsWUFBTSxZQUFZLFFBQVEsS0FBSyxJQUFJLElBQUksS0FBSztBQUM1QyxZQUFNLFNBQVMsQ0FBQyxRQUFRLFdBQVcsS0FBSyxJQUFJLE9BQU8sR0FBRztBQUN0RCxZQUFNLFNBQVMsQ0FBQyxRQUFRO0FBQ3RCLHFCQUFhLEdBQUc7QUFDaEIsWUFBSSxVQUFXLFdBQVUsS0FBSyxJQUFJLE9BQU8sR0FBRztBQUFBLE1BQzlDO0FBQ0EsWUFBTSxXQUFXLE1BQU07QUFDckIsWUFBSSxVQUFXO0FBQ2YsdUJBQWUsSUFBSTtBQUNuQixxQkFBYSxJQUFJO0FBQUEsTUFDbkI7QUFDQSxZQUFNLFFBQVEsSUFBSSxhQUFhLENBQUE7QUFHL0IsWUFBTSxXQUFXLElBQUk7QUFDckIsWUFBTSxrQkFBa0IsWUFBWSxZQUFZLEVBQUUsT0FBTyxNQUFNLG1CQUFtQixVQUFBLElBQWMsQ0FBQTtBQUNoRyxZQUFNLGtCQUFrQixXQUNwQixDQUFDLFFBQVE7QUFDVCxjQUFNLFNBQVMsU0FBUyxLQUFLLEdBQUc7QUFDaEMsWUFBSSxXQUFXLFFBQVEsV0FBVyxVQUFhLFdBQVcsTUFBTTtBQUM5RCx1QkFBYSxPQUFPLFdBQVcsV0FBVyxTQUFTLGVBQWU7QUFBQSxRQUNwRSxPQUFPO0FBQ0wsdUJBQWEsSUFBSTtBQUFBLFFBQ25CO0FBQUEsTUFDRixJQUNFO0FBRUosY0FBUSxNQUFBO0FBQUEsUUFDTixLQUFLO0FBQ0gsc0RBQVEsVUFBQSxFQUFVLEdBQUcsT0FBTyxNQUFNLFdBQVcsT0FBTSxJQUFHLE9BQU8sYUFBYSxJQUFJLFVBQVUsUUFBUSxRQUFRLFVBQVcsR0FBRyxpQkFBaUIsU0FBUyxpQkFBaUI7QUFBQSxRQUNuSyxLQUFLO0FBQ0gsc0RBQVEsYUFBQSxFQUFhLEdBQUcsT0FBTyxNQUFNLFdBQVcsT0FBTSxJQUFHLE9BQU8sV0FBVyxVQUFVLFFBQVEsUUFBUSxVQUFXLEdBQUcsaUJBQWlCLFNBQVMsaUJBQWlCO0FBQUEsUUFDaEssS0FBSztBQUNILHNEQUFRLGVBQUEsRUFBYyxjQUFhLE9BQU8sR0FBRyxPQUFPLE1BQU0sV0FBVyxPQUFNLElBQUcsT0FBTyxXQUFXLFVBQVUsUUFBUSxRQUFRLFVBQVcsR0FBRyxpQkFBaUIsU0FBUyxpQkFBaUI7QUFBQSxRQUNyTCxLQUFLO0FBQ0gsc0RBQVEsY0FBQSxFQUFjLEdBQUcsT0FBTyxNQUFNLFdBQVcsT0FBTSxJQUFHLE9BQU8sV0FBVyxVQUFVLFFBQVEsUUFBUSxVQUFXLEdBQUcsaUJBQWlCLFNBQVMsaUJBQWlCO0FBQUEsUUFDakssS0FBSztBQUNILHNEQUFRLFFBQUEsRUFBTyxTQUFRLGVBQWUsR0FBRyxPQUFPLE1BQU0sV0FBVyxPQUFNLElBQUcsT0FBTyxXQUFXLFVBQVUsUUFBUSxTQUFTLG1CQUFtQixLQUFLLElBQUksR0FBRztBQUFBLFFBQ3hKLEtBQUs7QUFDSCxzREFBUSxhQUFBLEVBQWEsR0FBRyxPQUFPLE1BQU0sV0FBVyxPQUFNLElBQUcsT0FBTyxhQUFhLENBQUEsR0FBSSxVQUFVLFFBQVEsU0FBUyxtQkFBbUIsS0FBSyxJQUFJLEdBQUc7QUFBQSxRQUM3SSxLQUFLO0FBQ0gsaUJBQU8sZ0JBQUFaLE9BQUEsY0FBQyxXQUFBLEVBQVcsR0FBRyxPQUFPLE1BQU0sV0FBVyxPQUFNLElBQUcsT0FBTyxXQUFXLFVBQVUsT0FBQSxDQUFRO0FBQUEsUUFDN0YsS0FBSztBQUNILGlCQUFPLGdCQUFBQSxPQUFBLGNBQUMsUUFBQSxFQUFRLEdBQUcsT0FBTyxNQUFNLFdBQVcsT0FBTSxJQUFHLFNBQVMsQ0FBQyxDQUFDLFdBQVcsVUFBVSxRQUFRO0FBQUEsUUFDOUYsS0FBSztBQUNILGlCQUFPLGdCQUFBQSxPQUFBLGNBQUMsVUFBQSxFQUFVLEdBQUcsT0FBTyxNQUFNLFdBQVcsU0FBUyxDQUFDLENBQUMsV0FBVyxVQUFVLE9BQUEsQ0FBUTtBQUFBLFFBQ3ZGO0FBQ0Usc0RBQVEsT0FBQSxFQUFPLEdBQUcsT0FBTyxNQUFNLFdBQVcsT0FBTSxJQUFHLE9BQU8sYUFBYSxJQUFJLFVBQVUsUUFBUSxRQUFRLFVBQVcsR0FBRyxpQkFBaUIsU0FBUyxpQkFBaUI7QUFBQSxNQUFBO0FBQUEsSUFFcEs7QUFFQSxVQUFNLG1CQUFtQixhQUFhLFFBQVEsS0FBSyxDQUFDLFFBQVEsSUFBSSxRQUFRLElBQUksYUFBYTtBQUN6RixVQUFNLHFCQUFxQixjQUFjLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQztBQUtoRSxVQUFNLGFBQWFRLE9BQUFBO0FBQUFBLE1BQ2pCLE1BQU0sWUFBWSxrQkFBa0IsU0FBUyxJQUFJLElBQUksQ0FBQTtBQUFBLE1BQ3JELENBQUMsU0FBUyxNQUFNLFNBQVM7QUFBQSxJQUFBO0FBRzNCLFVBQU0saUJBQWlCLENBQUMsUUFBQTs7QUFBUSxpQkFBSSxXQUFTLGdCQUFXLElBQUksS0FBSyxNQUFwQixtQkFBdUIsVUFBUztBQUFBO0FBQzdFLFVBQU0sZUFBZSxDQUFDLFFBQUE7O0FBQVEsaUJBQUksYUFBYSxJQUFJLFdBQVMsZ0JBQVcsSUFBSSxLQUFLLE1BQXBCLG1CQUF1QixjQUFhO0FBQUE7QUFHaEcsVUFBTSxDQUFDLGNBQWMsZUFBZSxJQUFJQyxPQUFBQSxTQUFTLENBQUEsQ0FBRTtBQUVuRCxVQUFNLHNCQUFzQixDQUFDLEtBQUssUUFBUTtBQUN4QyxZQUFNLE9BQU8sSUFBSSxZQUFZO0FBQzdCLFlBQU0sUUFBUSxJQUFJLFVBQVU7QUFDNUIsWUFBTSxZQUFZLFVBQVUsS0FBSyxJQUFJLElBQUksS0FBSztBQUM5QyxZQUFNLFVBQVUsR0FBRyxLQUFLLElBQUksSUFBSSxLQUFLO0FBQ3JDLFlBQU0sUUFBUSxJQUFJLElBQUksS0FBSztBQUMzQixZQUFNLFdBQVcsSUFBSTtBQUVyQixZQUFNLE9BQU8sQ0FBQyxRQUFRO0FBQ3BCLFlBQUksVUFBVTtBQUNaLGdCQUFNLFNBQVMsU0FBUyxLQUFLLEdBQUc7QUFDaEMsY0FBSSxXQUFXLFFBQVEsV0FBVyxVQUFhLFdBQVcsTUFBTTtBQUM5RCw0QkFBZ0IsQ0FBQyxVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sV0FBVyxXQUFXLFNBQVMsa0JBQWtCO0FBQ3pHO0FBQUEsVUFDRjtBQUNBLDBCQUFnQixDQUFDLFNBQVM7QUFBRSxrQkFBTSxPQUFPLEVBQUUsR0FBRyxLQUFBO0FBQVEsbUJBQU8sS0FBSyxPQUFPO0FBQUcsbUJBQU87QUFBQSxVQUFNLENBQUM7QUFBQSxRQUM1RjtBQUNBLFlBQUksVUFBVyxXQUFVLEtBQUssSUFBSSxPQUFPLEdBQUc7QUFBQSxNQUM5QztBQUNBLFlBQU0sUUFBUSxJQUFJLGFBQWEsQ0FBQTtBQUMvQixZQUFNLFlBQVksYUFBYSxPQUFPO0FBQ3RDLFlBQU0sa0JBQWtCLFlBQVksRUFBRSxPQUFPLE1BQU0sbUJBQW1CLFVBQUEsSUFBYyxDQUFBO0FBQ3BGLFlBQU0sa0JBQWtCLFdBQ3BCLENBQUMsUUFBUTtBQUNULGNBQU0sU0FBUyxTQUFTLEtBQUssR0FBRztBQUNoQyxZQUFJLFdBQVcsUUFBUSxXQUFXLFVBQWEsV0FBVyxNQUFNO0FBQzlELDBCQUFnQixDQUFDLFVBQVUsRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxXQUFXLFdBQVcsU0FBUyxrQkFBa0I7QUFBQSxRQUMzRyxPQUFPO0FBQ0wsMEJBQWdCLENBQUMsU0FBUztBQUFFLGtCQUFNLE9BQU8sRUFBRSxHQUFHLEtBQUE7QUFBUSxtQkFBTyxLQUFLLE9BQU87QUFBRyxtQkFBTztBQUFBLFVBQU0sQ0FBQztBQUFBLFFBQzVGO0FBQUEsTUFDRixJQUNFO0FBRUosY0FBUSxNQUFBO0FBQUEsUUFDTixLQUFLO0FBQ0gsc0RBQVEsVUFBQSxFQUFVLEdBQUcsT0FBTyxNQUFNLFdBQVcsT0FBTSxJQUFHLE9BQU8sU0FBUyxJQUFJLFVBQVUsTUFBTyxHQUFHLGlCQUFpQixTQUFTLGlCQUFpQjtBQUFBLFFBQzNJLEtBQUs7QUFDSCxpQkFBTyxnQkFBQVQsT0FBQSxjQUFDLGFBQUEsRUFBYSxHQUFHLE9BQU8sTUFBTSxXQUFXLE9BQU0sSUFBRyxPQUFjLFVBQVUsTUFBTyxHQUFHLGlCQUFpQixTQUFTLGlCQUFpQjtBQUFBLFFBQ3hJLEtBQUs7QUFDSCxzREFBUSxlQUFBLEVBQWMsY0FBYSxPQUFPLEdBQUcsT0FBTyxNQUFNLFdBQVcsT0FBTSxJQUFHLE9BQWMsVUFBVSxNQUFPLEdBQUcsaUJBQWlCLFNBQVMsaUJBQWlCO0FBQUEsUUFDN0osS0FBSztBQUNILGlCQUFPLGdCQUFBQSxPQUFBLGNBQUMsY0FBQSxFQUFjLEdBQUcsT0FBTyxNQUFNLFdBQVcsT0FBTSxJQUFHLE9BQWMsVUFBVSxNQUFPLEdBQUcsaUJBQWlCLFNBQVMsaUJBQWlCO0FBQUEsUUFDekksS0FBSztBQUNILHNEQUFRLFFBQUEsRUFBTyxTQUFRLGVBQWUsR0FBRyxPQUFPLE1BQU0sV0FBVyxPQUFNLElBQUcsT0FBYyxVQUFVLE1BQU0sU0FBUyxtQkFBbUIsS0FBSyxJQUFJLEdBQUc7QUFBQSxRQUNsSixLQUFLO0FBQ0gsc0RBQVEsYUFBQSxFQUFhLEdBQUcsT0FBTyxNQUFNLFdBQVcsT0FBTSxJQUFHLE9BQU8sU0FBUyxDQUFBLEdBQUksVUFBVSxNQUFNLFNBQVMsbUJBQW1CLEtBQUssSUFBSSxHQUFHO0FBQUEsUUFDdkksS0FBSztBQUNILGlCQUFPLGdCQUFBQSxPQUFBLGNBQUMsV0FBQSxFQUFXLEdBQUcsT0FBTyxNQUFNLFdBQVcsT0FBTSxJQUFHLE9BQWMsVUFBVSxLQUFBLENBQU07QUFBQSxRQUN2RixLQUFLO0FBQ0gsaUJBQU8sZ0JBQUFBLE9BQUEsY0FBQyxRQUFBLEVBQVEsR0FBRyxPQUFPLE1BQU0sV0FBVyxPQUFNLElBQUcsU0FBUyxDQUFDLENBQUMsT0FBTyxVQUFVLE1BQU07QUFBQSxRQUN4RixLQUFLO0FBQ0gsaUJBQU8sZ0JBQUFBLE9BQUEsY0FBQyxVQUFBLEVBQVUsR0FBRyxPQUFPLE1BQU0sV0FBVyxTQUFTLENBQUMsQ0FBQyxPQUFPLFVBQVUsS0FBQSxDQUFNO0FBQUEsUUFDakY7QUFDRSxzREFBUSxPQUFBLEVBQU8sR0FBRyxPQUFPLE1BQU0sV0FBVyxPQUFNLElBQUcsT0FBTyxTQUFTLElBQUksVUFBVSxNQUFPLEdBQUcsaUJBQWlCLFNBQVMsaUJBQWlCO0FBQUEsTUFBQTtBQUFBLElBRTVJO0FBRUEsVUFBTSxvQkFBb0IsQ0FBQyxLQUFLLFFBQVE7QUFDdEMsWUFBTSxRQUFRLElBQUksVUFBVTtBQUc1QixVQUFJLHFCQUFxQixZQUFZLElBQUksVUFBVTtBQUNqRCxlQUFPLG9CQUFvQixLQUFLLEdBQUc7QUFBQSxNQUNyQztBQUdBLFlBQU0sYUFDSiwyQ0FBYSxXQUFVLFVBQVMsMkNBQWEsV0FBVSxJQUFJO0FBRTdELFVBQUksYUFBYSxJQUFJLFNBQVUsUUFBTyxrQkFBa0IsS0FBSyxHQUFHO0FBRWhFLFlBQU0sVUFBVSxJQUFJLGFBQ2hCLElBQUksV0FBVyxJQUFJLElBQUksS0FBSyxHQUFHLEdBQUcsSUFDbEMsSUFBSSxJQUFJLEtBQUssS0FBSztBQUV0QixVQUFJLElBQUksVUFBVTtBQUNoQixlQUNFLGdCQUFBQSxPQUFBO0FBQUEsVUFBQztBQUFBLFVBQUE7QUFBQSxZQUNDLFNBQVE7QUFBQSxZQUNSLFNBQVMsTUFBTSxhQUFhLE9BQU8sSUFBSSxPQUFPLElBQUksSUFBSSxLQUFLLENBQUM7QUFBQSxVQUFBO0FBQUEsVUFFM0QsV0FBVztBQUFBLFFBQUE7QUFBQSxNQUdsQjtBQUVBLGFBQU87QUFBQSxJQUNUO0FBS0EsVUFBTSxzQkFBc0IsQ0FBQyxXQUFXO0FBQ3RDLFlBQU0sT0FBTyxPQUFPLFFBQVE7QUFFNUIsVUFBSSxTQUFTLGVBQWU7QUFDMUIsZUFDRSxnQkFBQUEsT0FBQTtBQUFBLFVBQUM7QUFBQSxVQUFBO0FBQUEsWUFDQyxLQUFLLE9BQU87QUFBQSxZQUNaLE1BQU0sVUFBVSxPQUFPLElBQUk7QUFBQSxZQUMzQixPQUFNO0FBQUEsWUFDTixhQUFhLE9BQU8sZUFBZTtBQUFBLFlBQ25DLE9BQU8sYUFBYSxPQUFPLElBQUksS0FBSyxDQUFBO0FBQUEsWUFDcEMsVUFBVSxDQUFDLFFBQVEsbUJBQW1CLE9BQU8sTUFBTSxHQUFHO0FBQUEsWUFDdEQsU0FBUyxPQUFPO0FBQUEsVUFBQTtBQUFBLFFBQUE7QUFBQSxNQUd0QjtBQUVBLFVBQUksU0FBUyxhQUFhO0FBQ3hCLGNBQU0sV0FBVyxhQUFhLE9BQU8sSUFBSSxLQUFLLEVBQUUsTUFBTSxNQUFNLElBQUksS0FBQTtBQUNoRSxlQUNFLGdCQUFBQSxPQUFBLGNBQUMsTUFBQSxFQUFLLEtBQUssT0FBTyxNQUFNLFdBQVUsT0FBTSxPQUFNLFVBQVMsS0FBSSxLQUFBLEdBQ3pELGdCQUFBQSxPQUFBO0FBQUEsVUFBQztBQUFBLFVBQUE7QUFBQSxZQUNDLE1BQU0sVUFBVSxPQUFPLElBQUk7QUFBQSxZQUMzQixPQUFNO0FBQUEsWUFDTixhQUFZO0FBQUEsWUFDWixRQUFPO0FBQUEsWUFDUCxPQUFPLFNBQVM7QUFBQSxZQUNoQixVQUFVLENBQUMsUUFDVCxtQkFBbUIsT0FBTyxNQUFNLEVBQUUsR0FBRyxVQUFVLE1BQU0sSUFBQSxDQUFLO0FBQUEsVUFBQTtBQUFBLFFBQUEsR0FHOUQsZ0JBQUFBLE9BQUEsY0FBQyxNQUFBLEVBQUssTUFBSyxZQUFXLE1BQUssTUFBSyxHQUNoQyxnQkFBQUEsT0FBQTtBQUFBLFVBQUM7QUFBQSxVQUFBO0FBQUEsWUFDQyxNQUFLO0FBQUEsWUFDTCxNQUFNLFVBQVUsT0FBTyxJQUFJO0FBQUEsWUFDM0IsT0FBTTtBQUFBLFlBQ04sYUFBWTtBQUFBLFlBQ1osUUFBTztBQUFBLFlBQ1AsT0FBTyxTQUFTO0FBQUEsWUFDaEIsVUFBVSxDQUFDLFFBQ1QsbUJBQW1CLE9BQU8sTUFBTSxFQUFFLEdBQUcsVUFBVSxJQUFJLElBQUEsQ0FBSztBQUFBLFVBQUE7QUFBQSxRQUFBLENBRzlEO0FBQUEsTUFFSjtBQUdBLGFBQ0UsZ0JBQUFBLE9BQUE7QUFBQSxRQUFDO0FBQUEsUUFBQTtBQUFBLFVBQ0MsS0FBSyxPQUFPO0FBQUEsVUFDWixNQUFNLFVBQVUsT0FBTyxJQUFJO0FBQUEsVUFDM0IsU0FBUTtBQUFBLFVBQ1IsYUFBYSxPQUFPLGVBQWU7QUFBQSxVQUNuQyxPQUFPLGFBQWEsT0FBTyxJQUFJO0FBQUEsVUFDL0IsVUFBVSxDQUFDLFFBQVEsbUJBQW1CLE9BQU8sTUFBTSxHQUFHO0FBQUEsVUFDdEQsU0FBUztBQUFBLFlBQ1AsRUFBRSxPQUFPLE9BQU8sZUFBZSxPQUFPLE9BQU8sR0FBQTtBQUFBLFlBQzdDLEdBQUcsT0FBTztBQUFBLFVBQUE7QUFBQSxRQUNaO0FBQUEsTUFBQTtBQUFBLElBR047QUFLQSxXQUNFLGdCQUFBQSxPQUFBLGNBQUMsTUFBQSxFQUFLLFdBQVUsVUFBUyxLQUFJLEtBQUEsR0FFM0IsZ0JBQUFBLE9BQUEsY0FBQyxNQUFBLEVBQUssV0FBVSxPQUFNLEtBQUksUUFFeEIsZ0JBQUFBLE9BQUEsY0FBQyxLQUFBLEVBQUksTUFBTSxLQUNULGdCQUFBQSxPQUFBLGNBQUMsTUFBQSxFQUFLLFdBQVUsVUFBUyxLQUFJLEtBQUEsR0FFM0IsZ0JBQUFBLE9BQUEsY0FBQyxRQUFLLFdBQVUsT0FBTSxPQUFNLFVBQVMsS0FBSSxNQUFLLE1BQUssT0FBQSxHQUNoRCxhQUFhLFNBQVMsS0FDckIsZ0JBQUFBLE9BQUE7QUFBQSxNQUFDO0FBQUEsTUFBQTtBQUFBLFFBQ0MsTUFBSztBQUFBLFFBQ0wsYUFBYTtBQUFBLFFBQ2IsT0FBTztBQUFBLFFBQ1AsVUFBVTtBQUFBLE1BQUE7QUFBQSxJQUFBLEdBR2IsUUFBUSxNQUFNLEdBQUcsQ0FBQyxFQUFFLElBQUksbUJBQW1CLEdBQzNDLFFBQVEsU0FBUyxLQUNoQixnQkFBQUEsT0FBQTtBQUFBLE1BQUM7QUFBQSxNQUFBO0FBQUEsUUFDQyxTQUFRO0FBQUEsUUFDUixNQUFLO0FBQUEsUUFDTCxTQUFTLE1BQU0sbUJBQW1CLENBQUMsU0FBUyxDQUFDLElBQUk7QUFBQSxNQUFBO0FBQUEsTUFFakQsZ0JBQUFBLE9BQUEsY0FBQyxNQUFBLEVBQUssTUFBSyxVQUFTLE1BQUssTUFBSztBQUFBLE1BQUU7QUFBQSxJQUFBLENBR3RDLEdBR0MsbUJBQW1CLFFBQVEsU0FBUyxLQUNuQyxnQkFBQUEsT0FBQSxjQUFDLE1BQUEsRUFBSyxXQUFVLE9BQU0sT0FBTSxPQUFNLEtBQUksTUFBSyxNQUFLLE9BQUEsR0FDN0MsUUFBUSxNQUFNLENBQUMsRUFBRSxJQUFJLG1CQUFtQixDQUMzQyxHQUlELFlBQVksU0FBUyxLQUNwQixnQkFBQUEsT0FBQSxjQUFDLFFBQUssV0FBVSxPQUFNLE9BQU0sVUFBUyxLQUFJLE1BQUssTUFBSyxPQUFBLEdBQ2hELFlBQVksSUFBSSxDQUFDLFNBQ2hCLGdCQUFBQSxPQUFBLGNBQUMsS0FBQSxFQUFJLEtBQUssS0FBSyxLQUFLLFNBQVEsV0FBVSxVQUFVLE1BQU0sbUJBQW1CLEtBQUssR0FBRyxFQUFBLEdBQzlFLEtBQUssS0FDUixDQUNELEdBQ0QsZ0JBQUFBLE9BQUE7QUFBQSxNQUFDO0FBQUEsTUFBQTtBQUFBLFFBQ0MsU0FBUTtBQUFBLFFBQ1IsTUFBSztBQUFBLFFBQ0wsU0FBUyxNQUFNLG1CQUFtQixLQUFLO0FBQUEsTUFBQTtBQUFBLE1BQ3hDO0FBQUEsSUFBQSxDQUdILENBRUosQ0FDRixHQUdDLGdCQUFnQixlQUFlLEtBQzlCLGdCQUFBQSxPQUFBLGNBQUMsS0FBQSxFQUFJLE1BQU0sR0FBRyxXQUFVLE1BQUEsd0NBQ3JCLE1BQUEsRUFBSyxXQUFVLE9BQU0sU0FBUSxTQUM1QixnQkFBQUEsT0FBQSxjQUFDLE1BQUEsRUFBSyxTQUFRLGFBQVksUUFBUSxlQUFlLEVBQUUsWUFBWSxXQUFXLFVBQVksZ0JBQWlCLENBQ3pHLENBQ0YsQ0FFSixHQUdDLFVBQ0MsZ0JBQUFBLE9BQUEsY0FBQyxnQkFBQSxFQUFlLE9BQU0sY0FBYSxRQUFPLFlBQVcsSUFDbkQsUUFDRixnQkFBQUEsT0FBQSxjQUFDLFlBQUEsRUFBVyxPQUFPLE9BQU8sVUFBVSxXQUFXLFFBQVEsd0JBQUEsR0FDckQsZ0JBQUFBLE9BQUEsY0FBQyxNQUFBLE1BQU0sT0FBTyxVQUFVLFdBQVcsc0JBQXNCLHVDQUF3QyxDQUNuRyxJQUNFLFlBQVksV0FBVyxJQUN6QixnQkFBQUEsT0FBQSxjQUFDLFFBQUssV0FBVSxVQUFTLE9BQU0sVUFBUyxTQUFRLFlBQzlDLGdCQUFBQSxPQUFBLGNBQUMsWUFBQSxFQUFXLE9BQU8sWUFBWSxRQUFPLFdBQUEsR0FDcEMsZ0JBQUFBLE9BQUEsY0FBQyxZQUFNLFlBQWEsQ0FDdEIsQ0FDRixJQUVBLGdCQUFBQSxPQUFBO0FBQUEsTUFBQztBQUFBLE1BQUE7QUFBQSxRQUNDO0FBQUEsUUFDQTtBQUFBLFFBQ0EsV0FBVyxZQUFZO0FBQUEsUUFDdkIsTUFBTTtBQUFBLFFBQ047QUFBQSxRQUNBLGNBQWM7QUFBQSxRQUNkLHNCQUFzQix3QkFBd0IsT0FBTyx1QkFBdUIsWUFBWTtBQUFBLFFBQ3hGO0FBQUEsUUFDQyxHQUFJLHlCQUF5QixPQUFPLEVBQUUsMEJBQTBCLENBQUE7QUFBQSxNQUFDO0FBQUEsTUFFbEUsZ0JBQUFBLE9BQUEsY0FBQyxpQkFDQyxnQkFBQUEsT0FBQSxjQUFDLFVBQUEsTUFDRSxjQUNDLGdCQUFBQSxPQUFBLGNBQUMsYUFBQSxFQUFZLE9BQU0sTUFBQSxHQUNqQixnQkFBQUEsT0FBQTtBQUFBLFFBQUM7QUFBQSxRQUFBO0FBQUEsVUFDQyxNQUFLO0FBQUEsVUFDTCxjQUFXO0FBQUEsVUFDWCxTQUFTO0FBQUEsVUFDVCxVQUFVO0FBQUEsUUFBQTtBQUFBLE1BQUEsQ0FFZCxHQUVELFFBQVEsSUFBSSxDQUFDLFFBQVE7QUFDcEIsY0FBTSxjQUFlLHFCQUFxQixZQUFZLElBQUksV0FBWSxTQUFZLElBQUk7QUFDdEYsZUFDRSxnQkFBQUEsT0FBQTtBQUFBLFVBQUM7QUFBQSxVQUFBO0FBQUEsWUFDQyxLQUFLLElBQUk7QUFBQSxZQUNULE9BQU8sZUFBZSxHQUFHO0FBQUEsWUFDekIsT0FBTztBQUFBLFlBQ1AsZUFBZSxJQUFJLFdBQVksVUFBVSxJQUFJLEtBQUssS0FBSyxTQUFVO0FBQUEsWUFDakUsY0FBYyxJQUFJLFdBQVcsTUFBTSxpQkFBaUIsSUFBSSxLQUFLLElBQUk7QUFBQSxVQUFBO0FBQUEsVUFFaEUsSUFBSTtBQUFBLFFBQUE7QUFBQSxNQUdYLENBQUMsQ0FDSCxDQUNGO0FBQUEsTUFDQSxnQkFBQUEsT0FBQSxjQUFDLGlCQUNFLFlBQVk7QUFBQSxRQUFJLENBQUMsTUFBTSxRQUN0QixLQUFLLFNBQVMsc0RBQ1gsVUFBQSxFQUFTLEtBQUssU0FBUyxLQUFLLE1BQU0sR0FBRyxHQUFBLEdBQ25DLGNBQWMsZ0JBQUFBLE9BQUEsY0FBQyxXQUFBLEVBQVUsT0FBTSxNQUFBLENBQU0sR0FDckMsUUFBUSxJQUFJLENBQUMsS0FBSyxXQUFBOztzREFDaEIsV0FBQSxFQUFVLEtBQUssSUFBSSxPQUFPLE9BQU8sYUFBYSxHQUFHLEdBQUcsT0FBTyxXQUFXLElBQUksU0FBWSxJQUFJLFNBQ3hGLFdBQVcsSUFDVixnQkFBQUEsT0FBQTtBQUFBLFlBQUM7QUFBQSxZQUFBO0FBQUEsY0FDQyxTQUFRO0FBQUEsY0FDUixTQUFTLE1BQU0sWUFBWSxLQUFLLE1BQU0sR0FBRztBQUFBLFlBQUE7QUFBQSxZQUV6QyxnQkFBQUEsT0FBQSxjQUFDLE1BQUEsRUFBSyxXQUFVLE9BQU0sT0FBTSxVQUFTLEtBQUksTUFBSyxNQUFLLFlBQ2pELGdCQUFBQSxPQUFBLGNBQUMsTUFBQSxFQUFLLE1BQU0sZUFBZSxJQUFJLEtBQUssTUFBTSxHQUFHLElBQUksY0FBYyxRQUFBLENBQVMsd0NBQ3ZFLE1BQUEsRUFBSyxRQUFRLEVBQUUsWUFBWSxXQUFBLEVBQVcsR0FDcEMsS0FBSyxNQUFNLEtBQ2QsQ0FDRjtBQUFBLFVBQUEsTUFHRixhQUFRLGlCQUFSLG1CQUF1QixJQUFJLFVBQ3ZCLFFBQVEsYUFBYSxJQUFJLEtBQUssRUFBRSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU0sR0FBRyxNQUMvRCxtQkFBUSxnQkFBUixtQkFBc0IsS0FBSyxNQUFNLFNBQWpDLG1CQUF3QyxJQUFJLFdBQVUsRUFFOUQ7QUFBQSxTQUNELENBQ0gsSUFDRSxxQkFDRixnQkFBQUEsT0FBQSxjQUFDLFVBQUEsRUFBUyxLQUFLLEtBQUssSUFBSSxVQUFVLEtBQUssSUFBQSxHQUNwQyxjQUNDLGdCQUFBQSxPQUFBLGNBQUMsV0FBQSxFQUFVLE9BQU0sU0FDZixnQkFBQUEsT0FBQTtBQUFBLFVBQUM7QUFBQSxVQUFBO0FBQUEsWUFDQyxNQUFNLFVBQVUsS0FBSyxJQUFJLFVBQVUsQ0FBQztBQUFBLFlBQ3BDLGNBQVc7QUFBQSxZQUNYLFNBQVMsWUFBWSxJQUFJLEtBQUssSUFBSSxVQUFVLENBQUM7QUFBQSxZQUM3QyxVQUFVLENBQUMsWUFBWSxnQkFBZ0IsS0FBSyxJQUFJLFVBQVUsR0FBRyxPQUFPO0FBQUEsVUFBQTtBQUFBLFFBQUEsQ0FFeEUsR0FFRCxRQUFRLElBQUksQ0FBQyxRQUFRO0FBQ3BCLGdCQUFNLFFBQVEsS0FBSyxJQUFJLFVBQVU7QUFDakMsZ0JBQU0sb0JBQW9CLHFCQUFxQixlQUFjLDJDQUFhLFdBQVUsVUFBUywyQ0FBYSxXQUFVLElBQUk7QUFDeEgsZ0JBQU0saUJBQWlCLHFCQUFzQixxQkFBcUIsWUFBWSxJQUFJO0FBRWxGLGdCQUFNLFlBQVksaUJBQWlCLFNBQVksSUFBSTtBQUNuRCxzREFDRyxXQUFBLEVBQVUsS0FBSyxJQUFJLE9BQU8sT0FBTyxvQkFBb0IsU0FBUyxhQUFhLEdBQUcsR0FBRyxPQUFPLFVBQUEsR0FDdEYsa0JBQWtCLEtBQUssS0FBSyxHQUFHLENBQ2xDO0FBQUEsUUFFSixDQUFDLENBQ0gsSUFFQSxVQUFVLEtBQUssR0FBRztBQUFBLE1BQUEsQ0FHeEI7QUFBQSxNQUNDLFVBQ0MsZ0JBQUFBLE9BQUEsY0FBQyxhQUFBLE1BQ0UsT0FBTyxVQUFVLENBQ3BCO0FBQUEsSUFBQSxDQUlSO0FBQUEsRUFFSjtBQzlzQ0EsUUFBTSxjQUFjO0FBQUEsSUFDbEIsRUFBRSxJQUFJLEdBQUcsTUFBTSxhQUFhLFNBQVMsY0FBYyxRQUFRLFVBQVUsVUFBVSxjQUFjLFFBQVEsT0FBUSxNQUFNLGNBQWMsVUFBVSxLQUFBO0FBQUEsSUFDM0ksRUFBRSxJQUFJLEdBQUcsTUFBTSxjQUFjLFNBQVMsZUFBZSxRQUFRLFVBQVUsVUFBVSxjQUFjLFFBQVEsTUFBTyxNQUFNLGNBQWMsVUFBVSxNQUFBO0FBQUEsSUFDNUksRUFBRSxJQUFJLEdBQUcsTUFBTSxXQUFXLFNBQVMsa0JBQWtCLFFBQVEsV0FBVyxVQUFVLE9BQU8sUUFBUSxNQUFPLE1BQU0sY0FBYyxVQUFVLE1BQUE7QUFBQSxJQUN0SSxFQUFFLElBQUksR0FBRyxNQUFNLGlCQUFpQixTQUFTLGdCQUFnQixRQUFRLFdBQVcsVUFBVSxjQUFjLFFBQVEsTUFBUSxNQUFNLGNBQWMsVUFBVSxLQUFBO0FBQUEsSUFDbEosRUFBRSxJQUFJLEdBQUcsTUFBTSxvQkFBb0IsU0FBUyxnQkFBZ0IsUUFBUSxVQUFVLFVBQVUsY0FBYyxRQUFRLE1BQVEsTUFBTSxjQUFjLFVBQVUsTUFBQTtBQUFBLElBQ3BKLEVBQUUsSUFBSSxHQUFHLE1BQU0scUJBQXFCLFNBQVMsY0FBYyxRQUFRLFVBQVUsVUFBVSxjQUFjLFFBQVEsTUFBUSxNQUFNLGNBQWMsVUFBVSxLQUFBO0FBQUEsSUFDbkosRUFBRSxJQUFJLEdBQUcsTUFBTSxvQkFBb0IsU0FBUyxrQkFBa0IsUUFBUSxXQUFXLFVBQVUsY0FBYyxRQUFRLE1BQU8sTUFBTSxjQUFjLFVBQVUsTUFBQTtBQUFBLElBQ3RKLEVBQUUsSUFBSSxHQUFHLE1BQU0scUJBQXFCLFNBQVMsZUFBZSxRQUFRLFdBQVcsVUFBVSxjQUFjLFFBQVEsTUFBTyxNQUFNLGNBQWMsVUFBVSxNQUFBO0FBQUEsSUFDcEosRUFBRSxJQUFJLEdBQUcsTUFBTSxnQkFBZ0IsU0FBUyxZQUFZLFFBQVEsVUFBVSxVQUFVLE9BQU8sUUFBUSxNQUFPLE1BQU0sY0FBYyxVQUFVLE1BQUE7QUFBQSxJQUNwSSxFQUFFLElBQUksSUFBSSxNQUFNLGVBQWUsU0FBUyxnQkFBZ0IsUUFBUSxVQUFVLFVBQVUsY0FBYyxRQUFRLE1BQVEsTUFBTSxjQUFjLFVBQVUsS0FBQTtBQUFBLElBQ2hKLEVBQUUsSUFBSSxJQUFJLE1BQU0sY0FBYyxTQUFTLHFCQUFxQixRQUFRLFVBQVUsVUFBVSxPQUFPLFFBQVEsTUFBTyxNQUFNLGNBQWMsVUFBVSxNQUFBO0FBQUEsSUFDNUksRUFBRSxJQUFJLElBQUksTUFBTSxTQUFTLFNBQVMsZ0JBQWdCLFFBQVEsV0FBVyxVQUFVLGNBQWMsUUFBUSxPQUFRLE1BQU0sY0FBYyxVQUFVLEtBQUE7QUFBQSxFQUM3STtBQU1BLFFBQU0sZ0JBQWdCO0FBQUEsSUFDcEIsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsU0FBUztBQUFBLEVBQ1g7QUFFQSxRQUFNLGdCQUFnQjtBQUFBLElBQ3BCLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLFNBQVM7QUFBQSxFQUNYO0FBRUEsUUFBTSxpQkFBaUIsQ0FBQyxRQUN0QixJQUFJLEtBQUssYUFBYSxTQUFTLEVBQUUsT0FBTyxZQUFZLFVBQVUsT0FBTyx1QkFBdUIsR0FBRyxFQUFFLE9BQU8sR0FBRztBQU03RyxRQUFNLGVBQWU7QUFBQSxJQUNuQjtBQUFBLE1BQ0UsT0FBTztBQUFBLE1BQVEsT0FBTztBQUFBLE1BQVcsVUFBVTtBQUFBLE1BQzNDLFlBQVksQ0FBQyxRQUFRLGdCQUFBQSxPQUFBLGNBQUMsTUFBQSxFQUFLLFFBQVEsRUFBRSxZQUFZLFdBQUEsRUFBVyxHQUFJLEdBQUk7QUFBQSxJQUFBO0FBQUEsSUFFdEU7QUFBQSxNQUNFLE9BQU87QUFBQSxNQUFXLE9BQU87QUFBQSxNQUFXLFVBQVU7QUFBQSxNQUM5QyxZQUFZLENBQUMsUUFBUTtBQUFBLElBQUE7QUFBQSxJQUV2QjtBQUFBLE1BQ0UsT0FBTztBQUFBLE1BQVUsT0FBTztBQUFBLE1BQVUsVUFBVTtBQUFBLE1BQzVDLFlBQVksQ0FBQyxRQUFRLGdCQUFBQSxPQUFBLGNBQUMsV0FBQSxFQUFVLFNBQVMsY0FBYyxHQUFHLEtBQUksY0FBYyxHQUFHLENBQUU7QUFBQSxJQUFBO0FBQUEsSUFFbkY7QUFBQSxNQUNFLE9BQU87QUFBQSxNQUFZLE9BQU87QUFBQSxNQUFXLFVBQVU7QUFBQSxNQUMvQyxZQUFZLENBQUMsNkNBQVMsS0FBQSxFQUFJLFNBQVEsYUFBVyxHQUFJO0FBQUEsSUFBQTtBQUFBLElBRW5EO0FBQUEsTUFDRSxPQUFPO0FBQUEsTUFBVSxPQUFPO0FBQUEsTUFBVSxVQUFVO0FBQUEsTUFBTSxPQUFPO0FBQUEsTUFDekQsWUFBWSxDQUFDLFFBQVEsZUFBZSxHQUFHO0FBQUEsSUFBQTtBQUFBLElBRXpDO0FBQUEsTUFDRSxPQUFPO0FBQUEsTUFBUSxPQUFPO0FBQUEsTUFBYyxVQUFVO0FBQUEsTUFDOUMsWUFBWSxDQUFDLFFBQVEsSUFBSSxLQUFLLEdBQUcsRUFBRSxtQkFBbUIsU0FBUyxFQUFFLE9BQU8sU0FBUyxLQUFLLFdBQVcsTUFBTSxXQUFXO0FBQUEsSUFBQTtBQUFBLEVBRXRIO0FBRUEsUUFBTSxlQUFlO0FBQUEsSUFDbkI7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLGFBQWE7QUFBQSxNQUNiLFNBQVM7QUFBQSxRQUNQLEVBQUUsT0FBTyxVQUFVLE9BQU8sU0FBQTtBQUFBLFFBQzFCLEVBQUUsT0FBTyxXQUFXLE9BQU8sVUFBQTtBQUFBLFFBQzNCLEVBQUUsT0FBTyxXQUFXLE9BQU8sVUFBQTtBQUFBLE1BQVU7QUFBQSxJQUN2QztBQUFBLElBRUY7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLGFBQWE7QUFBQSxNQUNiLFNBQVM7QUFBQSxRQUNQLEVBQUUsT0FBTyxjQUFjLE9BQU8sYUFBQTtBQUFBLFFBQzlCLEVBQUUsT0FBTyxjQUFjLE9BQU8sYUFBQTtBQUFBLFFBQzlCLEVBQUUsT0FBTyxPQUFPLE9BQU8sTUFBQTtBQUFBLE1BQU07QUFBQSxJQUMvQjtBQUFBLElBRUY7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLGFBQWE7QUFBQSxJQUFBO0FBQUEsRUFFakI7QUFFQSxRQUFNLG1CQUFtQixNQUN2QixnQkFBQUEsT0FBQSxjQUFDLE1BQUEsRUFBSyxXQUFVLFVBQVMsS0FBSSxLQUFBLEdBQzNCLGdCQUFBQSxPQUFBLGNBQUMsU0FBQSxNQUFRLHlCQUF1QixHQUNoQyxnQkFBQUEsT0FBQSxjQUFDLFFBQUssU0FBUSxZQUFBLEdBQVksNkdBRTFCLEdBQ0EsZ0JBQUFBLE9BQUE7QUFBQSxJQUFDO0FBQUEsSUFBQTtBQUFBLE1BQ0MsTUFBTTtBQUFBLE1BQ04sU0FBUztBQUFBLE1BQ1QsV0FBVyxDQUFDLFFBQ1YsZ0JBQUFBLE9BQUEsY0FBQyxVQUFBLEVBQVMsS0FBSyxJQUFJLE1BQ2pCLGdCQUFBQSxPQUFBLGNBQUMsV0FBQSwyQ0FBVyxNQUFBLEVBQUssUUFBUSxFQUFFLFlBQVksYUFBVyxHQUFJLElBQUksSUFBSyxDQUFPLEdBQ3RFLGdCQUFBQSxPQUFBLGNBQUMsV0FBQSxNQUFXLElBQUksT0FBUSxHQUN4QixnQkFBQUEsT0FBQSxjQUFDLFdBQUEsTUFBVSxnQkFBQUEsT0FBQSxjQUFDLFdBQUEsRUFBVSxTQUFTLGNBQWMsSUFBSSxNQUFNLEtBQUksY0FBYyxJQUFJLE1BQU0sQ0FBRSxDQUFZLHdDQUNoRyxXQUFBLE1BQVUsZ0JBQUFBLE9BQUEsY0FBQyxLQUFBLEVBQUksU0FBUSxhQUFXLElBQUksUUFBUyxDQUFNLHdDQUNyRCxXQUFBLEVBQVUsT0FBTSxRQUFBLEdBQVMsZUFBZSxJQUFJLE1BQU0sQ0FBRSxHQUNyRCxnQkFBQUEsT0FBQSxjQUFDLGlCQUFXLElBQUksS0FBSyxJQUFJLElBQUksRUFBRSxtQkFBbUIsU0FBUyxFQUFFLE9BQU8sU0FBUyxLQUFLLFdBQVcsTUFBTSxVQUFBLENBQVcsQ0FBRSxDQUNsSDtBQUFBLE1BRUYsY0FBYyxDQUFDLFFBQVEsU0FBUztBQUFBLE1BQ2hDLG1CQUFrQjtBQUFBLE1BQ2xCLFNBQVM7QUFBQSxNQUNULFVBQVU7QUFBQSxNQUNWLGFBQWEsRUFBRSxRQUFRLGFBQUE7QUFBQSxNQUN2QixRQUFRLENBQUMsaUJBQ1AsZ0JBQUFBLE9BQUEsY0FBQyxVQUFBLDJDQUNFLGFBQUEsTUFBWSxPQUFLLEdBQ2xCLGdCQUFBQSxPQUFBLGNBQUMsaUJBQVksR0FDYixnQkFBQUEsT0FBQSxjQUFDLGFBQUEsSUFBWSx3Q0FDWixhQUFBLElBQVksR0FDYixnQkFBQUEsT0FBQSxjQUFDLGFBQUEsRUFBWSxPQUFNLFdBQ2hCLGVBQWUsYUFBYSxPQUFPLENBQUMsS0FBSyxNQUFNLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUNwRSxHQUNBLGdCQUFBQSxPQUFBLGNBQUMsaUJBQVksQ0FDZjtBQUFBLElBQUE7QUFBQSxFQUVKLENBQ0Y7QUFPRixRQUFNLGlCQUFpQjtBQUFBLElBQ3JCO0FBQUEsTUFDRSxPQUFPO0FBQUEsTUFBUSxPQUFPO0FBQUEsTUFBVyxVQUFVO0FBQUEsTUFDM0MsWUFBWSxDQUFDLFFBQVEsZ0JBQUFBLE9BQUEsY0FBQyxNQUFBLEVBQUssUUFBUSxFQUFFLFlBQVksV0FBQSxFQUFXLEdBQUksR0FBSTtBQUFBLElBQUE7QUFBQSxJQUV0RTtBQUFBLE1BQ0UsT0FBTztBQUFBLE1BQVcsT0FBTztBQUFBLE1BQ3pCLFlBQVksQ0FBQyxRQUFRO0FBQUEsSUFBQTtBQUFBLElBRXZCO0FBQUEsTUFDRSxPQUFPO0FBQUEsTUFBVSxPQUFPO0FBQUEsTUFDeEIsWUFBWSxDQUFDLFFBQVEsZ0JBQUFBLE9BQUEsY0FBQyxXQUFBLEVBQVUsU0FBUyxjQUFjLEdBQUcsS0FBSSxjQUFjLEdBQUcsQ0FBRTtBQUFBLElBQUE7QUFBQSxJQUVuRjtBQUFBLE1BQ0UsT0FBTztBQUFBLE1BQVUsT0FBTztBQUFBLE1BQVUsVUFBVTtBQUFBLE1BQU0sT0FBTztBQUFBLE1BQ3pELFlBQVksQ0FBQyxRQUFRLGVBQWUsR0FBRztBQUFBLElBQUE7QUFBQSxFQUUzQztBQUVBLFFBQU0saUJBQWlCLE1BQU07QUFDM0IsVUFBTSxDQUFDLFVBQVUsV0FBVyxJQUFJUyxPQUFBQSxTQUFTLENBQUEsQ0FBRTtBQUUzQyxXQUNFLGdCQUFBVCxPQUFBLGNBQUMsUUFBSyxXQUFVLFVBQVMsS0FBSSxLQUFBLEdBQzNCLGdCQUFBQSxPQUFBLGNBQUMsU0FBQSxNQUFRLGVBQWEsR0FDdEIsZ0JBQUFBLE9BQUEsY0FBQyxRQUFLLFNBQVEsWUFBQSxHQUFZLG9FQUV2QixTQUFTLFNBQVMsS0FBSyxLQUFLLFNBQVMsTUFBTSxZQUM5QyxHQUNBLGdCQUFBQSxPQUFBO0FBQUEsTUFBQztBQUFBLE1BQUE7QUFBQSxRQUNDLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxRQUNULFlBQVk7QUFBQSxRQUNaLFlBQVc7QUFBQSxRQUNYLG1CQUFtQjtBQUFBLFFBQ25CLGNBQWMsQ0FBQyxNQUFNO0FBQUEsUUFDckIsVUFBVTtBQUFBLE1BQUE7QUFBQSxJQUFBLENBRWQ7QUFBQSxFQUVKO0FBTUEsUUFBTSxlQUFlLE1BQU07QUFDekIsVUFBTSxDQUFDLE1BQU0sT0FBTyxJQUFJUyxPQUFBQSxTQUFTLFdBQVc7QUFFNUMsVUFBTSxhQUFhRyxPQUFBQSxZQUFZLENBQUMsS0FBSyxPQUFPLGFBQWE7QUFDdkQ7QUFBQSxRQUFRLENBQUMsU0FDUCxLQUFLLElBQUksQ0FBQyxNQUFPLEVBQUUsT0FBTyxJQUFJLEtBQUssRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsU0FBQSxJQUFhLENBQUU7QUFBQSxNQUFBO0FBQUEsSUFFdkUsR0FBRyxDQUFBLENBQUU7QUFFTCxVQUFNLGNBQWM7QUFBQSxNQUNsQjtBQUFBLFFBQ0UsT0FBTztBQUFBLFFBQVEsT0FBTztBQUFBLFFBQVcsVUFBVTtBQUFBLFFBQzNDLFVBQVU7QUFBQSxRQUFNLFVBQVU7QUFBQSxRQUMxQixjQUFjLENBQUMsUUFBUTtBQUNyQixjQUFJLENBQUMsT0FBTyxJQUFJLEtBQUEsTUFBVyxHQUFJLFFBQU87QUFDdEMsY0FBSSxJQUFJLFNBQVMsRUFBRyxRQUFPO0FBQzNCLGlCQUFPO0FBQUEsUUFDVDtBQUFBLFFBQ0EsWUFBWSxDQUFDLFFBQVEsZ0JBQUFaLE9BQUEsY0FBQyxNQUFBLEVBQUssUUFBUSxFQUFFLFlBQVksV0FBQSxFQUFXLEdBQUksR0FBSTtBQUFBLE1BQUE7QUFBQSxNQUV0RTtBQUFBLFFBQ0UsT0FBTztBQUFBLFFBQVcsT0FBTztBQUFBLFFBQ3pCLFVBQVU7QUFBQSxRQUFNLFVBQVU7QUFBQSxRQUMxQixZQUFZLENBQUMsUUFBUTtBQUFBLE1BQUE7QUFBQSxNQUV2QjtBQUFBLFFBQ0UsT0FBTztBQUFBLFFBQVUsT0FBTztBQUFBLFFBQ3hCLFVBQVU7QUFBQSxRQUFNLFVBQVU7QUFBQSxRQUMxQixhQUFhO0FBQUEsVUFDWCxFQUFFLE9BQU8sVUFBVSxPQUFPLFNBQUE7QUFBQSxVQUMxQixFQUFFLE9BQU8sV0FBVyxPQUFPLFVBQUE7QUFBQSxVQUMzQixFQUFFLE9BQU8sV0FBVyxPQUFPLFVBQUE7QUFBQSxRQUFVO0FBQUEsUUFFdkMsWUFBWSxDQUFDLFFBQVEsZ0JBQUFBLE9BQUEsY0FBQyxXQUFBLEVBQVUsU0FBUyxjQUFjLEdBQUcsS0FBSSxjQUFjLEdBQUcsQ0FBRTtBQUFBLE1BQUE7QUFBQSxNQUVuRjtBQUFBLFFBQ0UsT0FBTztBQUFBLFFBQVUsT0FBTztBQUFBLFFBQVUsVUFBVTtBQUFBLFFBQU0sT0FBTztBQUFBLFFBQ3pELFVBQVU7QUFBQSxRQUFNLFVBQVU7QUFBQSxRQUMxQixjQUFjLENBQUMsUUFBUTtBQUNyQixjQUFJLFFBQVEsUUFBUSxRQUFRLFVBQWEsUUFBUSxHQUFJLFFBQU87QUFDNUQsY0FBSSxPQUFPLEdBQUcsSUFBSSxFQUFHLFFBQU87QUFDNUIsY0FBSSxPQUFPLEdBQUcsSUFBSSxJQUFTLFFBQU87QUFDbEMsaUJBQU87QUFBQSxRQUNUO0FBQUEsUUFDQSxZQUFZLENBQUMsUUFBUSxlQUFlLEdBQUc7QUFBQSxNQUFBO0FBQUEsTUFFekM7QUFBQSxRQUNFLE9BQU87QUFBQSxRQUFZLE9BQU87QUFBQSxRQUMxQixVQUFVO0FBQUEsUUFBTSxVQUFVO0FBQUEsUUFDMUIsWUFBWSxDQUFDLFFBQVEsMkNBQU8sS0FBQSxFQUFJLFNBQVEsVUFBQSxHQUFVLEtBQUcsSUFBUyxnQkFBQUEsT0FBQSxjQUFDLEtBQUEsRUFBSSxTQUFRLFlBQVMsSUFBRTtBQUFBLE1BQUE7QUFBQSxJQUN4RjtBQUdGLFdBQ0UsZ0JBQUFBLE9BQUEsY0FBQyxNQUFBLEVBQUssV0FBVSxVQUFTLEtBQUksS0FBQSxHQUMzQixnQkFBQUEsT0FBQSxjQUFDLFNBQUEsTUFBUSxnQkFBYyxHQUN2QixnQkFBQUEsT0FBQSxjQUFDLE1BQUEsRUFBSyxTQUFRLFlBQUEsR0FBWSxrSEFFMUIsR0FDQSxnQkFBQUEsT0FBQTtBQUFBLE1BQUM7QUFBQSxNQUFBO0FBQUEsUUFDQztBQUFBLFFBQ0EsU0FBUztBQUFBLFFBQ1QsWUFBVztBQUFBLFFBQ1gsV0FBVztBQUFBLFFBQ1gsY0FBYyxDQUFDLFFBQVEsU0FBUztBQUFBLFFBQ2hDLFVBQVU7QUFBQSxNQUFBO0FBQUEsSUFBQSxDQUVkO0FBQUEsRUFFSjtBQU1BLFFBQU0saUJBQWlCLE1BQU07QUFDM0IsVUFBTSxDQUFDLE1BQU0sT0FBTyxJQUFJUyxPQUFBQSxTQUFTLFdBQVc7QUFFNUMsVUFBTSxhQUFhRyxPQUFBQSxZQUFZLENBQUMsS0FBSyxPQUFPLGFBQWE7QUFDdkQ7QUFBQSxRQUFRLENBQUMsU0FDUCxLQUFLLElBQUksQ0FBQyxNQUFPLEVBQUUsT0FBTyxJQUFJLEtBQUssRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsU0FBQSxJQUFhLENBQUU7QUFBQSxNQUFBO0FBQUEsSUFFdkUsR0FBRyxDQUFBLENBQUU7QUFFTCxVQUFNLGdCQUFnQjtBQUFBLE1BQ3BCO0FBQUEsUUFDRSxPQUFPO0FBQUEsUUFBUSxPQUFPO0FBQUEsUUFDdEIsVUFBVTtBQUFBLFFBQU0sVUFBVTtBQUFBLFFBQzFCLFlBQVksQ0FBQyxRQUFRO0FBQUEsTUFBQTtBQUFBLE1BRXZCO0FBQUEsUUFDRSxPQUFPO0FBQUEsUUFBVyxPQUFPO0FBQUEsUUFDekIsVUFBVTtBQUFBLFFBQU0sVUFBVTtBQUFBLFFBQzFCLFlBQVksQ0FBQyxRQUFRO0FBQUEsTUFBQTtBQUFBLE1BRXZCO0FBQUEsUUFDRSxPQUFPO0FBQUEsUUFBVSxPQUFPO0FBQUEsUUFDeEIsVUFBVTtBQUFBLFFBQU0sVUFBVTtBQUFBLFFBQzFCLGFBQWE7QUFBQSxVQUNYLEVBQUUsT0FBTyxVQUFVLE9BQU8sU0FBQTtBQUFBLFVBQzFCLEVBQUUsT0FBTyxXQUFXLE9BQU8sVUFBQTtBQUFBLFVBQzNCLEVBQUUsT0FBTyxXQUFXLE9BQU8sVUFBQTtBQUFBLFFBQVU7QUFBQSxRQUV2QyxZQUFZLENBQUMsUUFBUTtBQUFBLE1BQUE7QUFBQSxNQUV2QjtBQUFBLFFBQ0UsT0FBTztBQUFBLFFBQVUsT0FBTztBQUFBLFFBQVUsT0FBTztBQUFBLFFBQ3pDLFVBQVU7QUFBQSxRQUFNLFVBQVU7QUFBQSxRQUMxQixZQUFZLENBQUMsUUFBUSxlQUFlLEdBQUc7QUFBQSxNQUFBO0FBQUEsTUFFekM7QUFBQSxRQUNFLE9BQU87QUFBQSxRQUFZLE9BQU87QUFBQSxRQUMxQixVQUFVO0FBQUEsUUFBTSxVQUFVO0FBQUEsUUFDMUIsWUFBWSxDQUFDLFFBQVEsTUFBTSxRQUFRO0FBQUEsTUFBQTtBQUFBLElBQ3JDO0FBR0YsV0FDRSxnQkFBQVosT0FBQSxjQUFDLE1BQUEsRUFBSyxXQUFVLFVBQVMsS0FBSSxLQUFBLEdBQzNCLGdCQUFBQSxPQUFBLGNBQUMsU0FBQSxNQUFRLGtCQUFnQixHQUN6QixnQkFBQUEsT0FBQSxjQUFDLE1BQUEsRUFBSyxTQUFRLFlBQUEsR0FBWSxnRkFFMUIsR0FDQSxnQkFBQUEsT0FBQTtBQUFBLE1BQUM7QUFBQSxNQUFBO0FBQUEsUUFDQztBQUFBLFFBQ0EsU0FBUztBQUFBLFFBQ1QsWUFBVztBQUFBLFFBQ1gsVUFBUztBQUFBLFFBQ1QsV0FBVztBQUFBLFFBQ1gsVUFBVTtBQUFBLE1BQUE7QUFBQSxJQUFBLENBRWQ7QUFBQSxFQUVKO0FBTUEsUUFBTSxnQkFBZ0I7QUFBQSxJQUNwQjtBQUFBLE1BQ0UsT0FBTztBQUFBLE1BQVEsT0FBTztBQUFBLE1BQ3RCLFlBQVksQ0FBQyxRQUFRO0FBQUEsSUFBQTtBQUFBLElBRXZCLEVBQUUsT0FBTyxXQUFXLE9BQU8sV0FBVyxZQUFZLENBQUMsUUFBUSxJQUFBO0FBQUEsSUFDM0Q7QUFBQSxNQUNFLE9BQU87QUFBQSxNQUFVLE9BQU87QUFBQSxNQUN4QixZQUFZLENBQUMsUUFBUSxnQkFBQUEsT0FBQSxjQUFDLFdBQUEsRUFBVSxTQUFTLGNBQWMsR0FBRyxLQUFJLGNBQWMsR0FBRyxDQUFFO0FBQUEsSUFBQTtBQUFBLElBRW5GO0FBQUEsTUFDRSxPQUFPO0FBQUEsTUFBVSxPQUFPO0FBQUEsTUFBVSxPQUFPO0FBQUEsTUFDekMsWUFBWSxDQUFDLFFBQVEsZUFBZSxHQUFHO0FBQUEsSUFBQTtBQUFBLEVBRTNDO0FBRUEsUUFBTSxjQUFjLE1BQ2xCLGdCQUFBQSxPQUFBLGNBQUMsTUFBQSxFQUFLLFdBQVUsVUFBUyxLQUFJLEtBQUEsR0FDM0IsZ0JBQUFBLE9BQUEsY0FBQyxTQUFBLE1BQVEsY0FBWSxHQUNyQixnQkFBQUEsT0FBQSxjQUFDLFFBQUssU0FBUSxZQUFBLEdBQVksOEVBRTFCLEdBQ0EsZ0JBQUFBLE9BQUE7QUFBQSxJQUFDO0FBQUEsSUFBQTtBQUFBLE1BQ0MsTUFBTTtBQUFBLE1BQ04sU0FBUztBQUFBLE1BQ1QsU0FBUztBQUFBLFFBQ1AsT0FBTztBQUFBLFFBQ1AsT0FBTyxDQUFDLE9BQU8sU0FBUyxHQUFHLE1BQU0sT0FBTyxDQUFDLEVBQUUsWUFBQSxJQUFnQixNQUFNLE1BQU0sQ0FBQyxDQUFDLEtBQUssS0FBSyxNQUFNO0FBQUEsUUFDekYsTUFBTTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osUUFBUSxDQUFDLFNBQVMsZUFBZSxLQUFLLE9BQU8sQ0FBQyxLQUFLLE1BQU0sTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQUEsVUFDM0UsUUFBUSxDQUFDLFNBQVM7QUFDaEIsa0JBQU0sU0FBUyxLQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUUsV0FBVyxRQUFRLEVBQUU7QUFDekQsbUJBQU8sZ0JBQUFBLE9BQUEsY0FBQyxRQUFLLFNBQVEsZUFBYSxRQUFPLFFBQUssS0FBSyxRQUFPLFNBQU87QUFBQSxVQUNuRTtBQUFBLFFBQUE7QUFBQSxNQUNGO0FBQUEsTUFFRixVQUFVO0FBQUEsSUFBQTtBQUFBLEVBQ1osQ0FDRjtBQU9GLFFBQU0saUJBQWlCO0FBQUEsSUFDckI7QUFBQSxNQUNFLE9BQU87QUFBQSxNQUFRLE9BQU87QUFBQSxNQUFXLFVBQVU7QUFBQSxNQUMzQyxZQUFZLENBQUMsUUFBUSxnQkFBQUEsT0FBQSxjQUFDLE1BQUEsRUFBSyxRQUFRLEVBQUUsWUFBWSxXQUFBLEVBQVcsR0FBSSxHQUFJO0FBQUEsSUFBQTtBQUFBLElBRXRFO0FBQUEsTUFDRSxPQUFPO0FBQUEsTUFBVyxPQUFPO0FBQUEsTUFDekIsWUFBWSxDQUFDLFFBQVE7QUFBQSxJQUFBO0FBQUEsSUFFdkI7QUFBQSxNQUNFLE9BQU87QUFBQSxNQUFVLE9BQU87QUFBQSxNQUFVLFVBQVU7QUFBQSxNQUM1QyxZQUFZLENBQUMsUUFBUSxnQkFBQUEsT0FBQSxjQUFDLFdBQUEsRUFBVSxTQUFTLGNBQWMsR0FBRyxLQUFJLGNBQWMsR0FBRyxDQUFFO0FBQUEsSUFBQTtBQUFBLElBRW5GO0FBQUEsTUFDRSxPQUFPO0FBQUEsTUFBVSxPQUFPO0FBQUEsTUFBVSxVQUFVO0FBQUEsTUFBTSxPQUFPO0FBQUEsTUFDekQsWUFBWSxDQUFDLFFBQVEsZUFBZSxHQUFHO0FBQUEsSUFBQTtBQUFBLEVBRTNDO0FBRUEsUUFBTSxpQkFBaUIsTUFBTTtBQUMzQixVQUFNLENBQUMsU0FBUyxVQUFVLElBQUlTLE9BQUFBLFNBQVMsS0FBSztBQUM1QyxVQUFNLENBQUMsT0FBTyxRQUFRLElBQUlBLE9BQUFBLFNBQVMsSUFBSTtBQUN2QyxVQUFNLENBQUMsTUFBTSxPQUFPLElBQUlBLE9BQUFBLFNBQVMsQ0FBQztBQUNsQyxVQUFNLENBQUMsUUFBUSxTQUFTLElBQUlBLE9BQUFBLFNBQVMsRUFBRTtBQUN2QyxVQUFNLFdBQVc7QUFHakIsVUFBTSxXQUFXLFNBQ2IsWUFBWTtBQUFBLE1BQU8sQ0FBQyxNQUNsQixFQUFFLEtBQUssWUFBQSxFQUFjLFNBQVMsT0FBTyxZQUFBLENBQWEsS0FDbEQsRUFBRSxRQUFRLFlBQUEsRUFBYyxTQUFTLE9BQU8sYUFBYTtBQUFBLElBQUEsSUFFdkQ7QUFDSixVQUFNLFdBQVcsU0FBUyxPQUFPLE9BQU8sS0FBSyxVQUFVLE9BQU8sUUFBUTtBQUV0RSxVQUFNLGVBQWUsTUFBTTtBQUN6QixpQkFBVyxJQUFJO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsaUJBQVcsTUFBTSxXQUFXLEtBQUssR0FBRyxHQUFJO0FBQUEsSUFDMUM7QUFFQSxVQUFNLGdCQUFnQixNQUFNO0FBQzFCLGVBQVMsbUNBQW1DO0FBQUEsSUFDOUM7QUFFQSxVQUFNLGFBQWEsTUFBTTtBQUN2QixlQUFTLElBQUk7QUFBQSxJQUNmO0FBRUEsV0FDRSxnQkFBQVQsT0FBQSxjQUFDLFFBQUssV0FBVSxVQUFTLEtBQUksS0FBQSxHQUMzQixnQkFBQUEsT0FBQSxjQUFDLFNBQUEsTUFBUSxrQkFBZ0IsR0FDekIsZ0JBQUFBLE9BQUEsY0FBQyxRQUFLLFNBQVEsWUFBQSxHQUFZLHNGQUUxQixHQUNBLGdCQUFBQSxPQUFBLGNBQUMsTUFBQSxFQUFLLFdBQVUsT0FBTSxLQUFJLEtBQUEsR0FDeEIsZ0JBQUFBLE9BQUEsY0FBQyxRQUFBLEVBQU8sTUFBSyxTQUFRLFNBQVMsYUFBQSxHQUFjLHVCQUFxQixHQUNqRSxnQkFBQUEsT0FBQSxjQUFDLFVBQU8sTUFBSyxTQUFRLFNBQVEsZUFBYyxTQUFTLGNBQUEsR0FBZSxnQkFBYyxHQUNqRixnQkFBQUEsT0FBQSxjQUFDLFFBQUEsRUFBTyxNQUFLLFNBQVEsU0FBUSxhQUFZLFNBQVMsV0FBQSxHQUFZLGFBQVcsQ0FDM0UsR0FDQSxnQkFBQUEsT0FBQTtBQUFBLE1BQUM7QUFBQSxNQUFBO0FBQUEsUUFDQyxZQUFZO0FBQUEsUUFDWjtBQUFBLFFBQ0E7QUFBQSxRQUNBLE1BQU07QUFBQSxRQUNOLFlBQVksU0FBUztBQUFBLFFBQ3JCLFNBQVM7QUFBQSxRQUNULGNBQWMsQ0FBQyxRQUFRLFNBQVM7QUFBQSxRQUNoQyxtQkFBa0I7QUFBQSxRQUNsQjtBQUFBLFFBQ0E7QUFBQSxRQUNBLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQixDQUFDLFNBQVMsVUFBVSxJQUFJO0FBQUEsUUFDeEMsY0FBYyxDQUFDLE1BQU0sUUFBUSxDQUFDO0FBQUEsTUFBQTtBQUFBLElBQUEsQ0FFbEM7QUFBQSxFQUVKO0FBTUEsVUFBUSxPQUFPLE1BQU0sZ0JBQUFBLE9BQUEsY0FBQyxtQkFBQSxJQUFrQixDQUFFO0FBRTFDLFFBQU0sb0JBQW9CLE1BQ3hCLGdCQUFBQSxPQUFBLGNBQUMsUUFBSyxXQUFVLFVBQVMsS0FBSSxLQUFBLEdBQzNCLGdCQUFBQSxPQUFBLGNBQUMsa0JBQUEsSUFBaUIsd0NBQ2pCLFNBQUEsSUFBUSx3Q0FDUixnQkFBQSxJQUFlLHdDQUNmLFNBQUEsSUFBUSxHQUNULGdCQUFBQSxPQUFBLGNBQUMsY0FBQSxJQUFhLEdBQ2QsZ0JBQUFBLE9BQUEsY0FBQyxTQUFBLElBQVEsR0FDVCxnQkFBQUEsT0FBQSxjQUFDLGdCQUFBLElBQWUsR0FDaEIsZ0JBQUFBLE9BQUEsY0FBQyxTQUFBLElBQVEsR0FDVCxnQkFBQUEsT0FBQSxjQUFDLGlCQUFZLEdBQ2IsZ0JBQUFBLE9BQUEsY0FBQyxhQUFRLEdBQ1QsZ0JBQUFBLE9BQUEsY0FBQyxvQkFBZSxDQUNsQjs7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzAsMSwyLDMsNCw1LDYsN119
