/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _commonBLLayerLoaderJs = __webpack_require__(172);

	var _commonBLLayerLoaderJs2 = _interopRequireDefault(_commonBLLayerLoaderJs);

	var todostore = __webpack_require__(163);
	var TodoActions = __webpack_require__(171);

	var bridge = _commonBLLayerLoaderJs2['default'].getBLBridge();

	todostore.on('change', function () {
		bridge.post("/stores/TodoStore/updateState", todostore.getState());
	});

	bridge.on("/stores/TodoStore/getInitialState", function (payload, sendBack) {
		sendBack(todostore.getState());
	});
	//TODO , support * Syntax
	//bridge.on("/actions/TodoActions/*", function (payload, sendBack, path) {
	//	var x = path.split("/");
	//	x.splice(0, 1);
	//	var method = x[2];
	//	TodoActions[method].call(TodoActions, payload);
	//});

	bridge.on("/actions/TodoActions/addTodo", function (payload, sendBack, path) {
		TodoActions.addTodo(payload);
	});

	bridge.on("/actions/TodoActions/markComplete", function (payload, sendBack, path) {
		TodoActions.markComplete(payload);
	});

	bridge.on("/actions/TodoActions/remove", function (payload, sendBack, path) {
		TodoActions.remove(payload);
	});

	bridge.on("/actions/TodoActions/removeAllCompleted", function (payload, sendBack, path) {
		TodoActions.removeAllCompleted();
	});

	bridge.on("/actions/TodoActions/edit", function (payload, sendBack, path) {
		TodoActions.edit(payload.id, payload.text);
	});

	bridge.on("/actions/TodoActions/markUnComplete", function (payload, sendBack, path) {
		TodoActions.markUnComplete(payload);
	});

	bridge.on("/actions/TodoActions/markAllUnComplete", function (payload, sendBack, path) {
		TodoActions.markAllUnComplete();
	});

	bridge.on("/actions/TodoActions/markAllComplete", function (payload, sendBack, path) {
		TodoActions.markAllComplete();
	});

/***/ },

/***/ 162:
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function (n) {
	  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function (type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events) this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler)) return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        len = arguments.length;
	        args = new Array(len - 1);
	        for (i = 1; i < len; i++) args[i - 1] = arguments[i];
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    len = arguments.length;
	    args = new Array(len - 1);
	    for (i = 1; i < len; i++) args[i - 1] = arguments[i];

	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++) listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function (type, listener) {
	  var m;

	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  if (!this._events) this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    var m;
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function (type, listener) {
	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function (type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type]) return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener || isFunction(list.listener) && list.listener === listener) {
	    delete this._events[type];
	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0) return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function (type) {
	  var key, listeners;

	  if (!this._events) return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else {
	    // LIFO order
	    while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function (type) {
	  var ret;
	  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.listenerCount = function (emitter, type) {
	  var ret;
	  if (!emitter._events || !emitter._events[type]) ret = 0;else if (isFunction(emitter._events[type])) ret = 1;else ret = emitter._events[type].length;
	  return ret;
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}

/***/ },

/***/ 163:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _actionToMethodsMapping;

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var AppDispatcher = __webpack_require__(164);
	var TodoConstants = __webpack_require__(168);
	var BaseStore = __webpack_require__(170);

	var TodoStoreClass = (function (_BaseStore) {
		_inherits(TodoStoreClass, _BaseStore);

		function TodoStoreClass() {
			_classCallCheck(this, TodoStoreClass);

			_get(Object.getPrototypeOf(TodoStoreClass.prototype), 'constructor', this).call(this);
			if (this.state.todos.length !== 0) {
				this.counter = this.state.todos[this.state.todos.length - 1].id + 1;
			} else {
				this.counter = this.state.todos.length;
			}
		}

		_createClass(TodoStoreClass, [{
			key: 'getInitialState',
			value: function getInitialState() {
				var defaultState = {
					todos: []
				};
				return defaultState;
				//		try {
				//			var state = JSON.parse(window.localStorage.getItem("todoStore"));
				//			if (state !== null && state !== undefined) {
				//				return state;
				//			} else {
				//				return defaultState;
				//			}
				//		} catch (ex) {
				//			return defaultState;
				//		}
			}
		}, {
			key: 'addTodo',
			value: function addTodo(text) {
				this.setState({
					todos: [].concat(_toConsumableArray(this.state.todos), [{
						task: text,
						done: false,
						id: this.counter
					}])
				});
				this.counter++;
			}
		}, {
			key: 'duringSetState',
			value: function duringSetState() {
				this.state.completed = this.getTotalCompleted();
				this.state.uncompleted = this.state.todos.length - this.state.completed;
				//window.localStorage.setItem("todoStore", JSON.stringify(this.state));
			}
		}, {
			key: 'markComplete',
			value: function markComplete(id) {
				this.setState({
					todos: this.state.todos.map(function (v) {
						if (v.id === id) {
							v.done = true;
						}
						return v;
					})
				});
			}
		}, {
			key: 'remove',
			value: function remove(id) {
				this.setState({
					todos: this.state.todos.filter(function (v) {
						return v.id !== id;
					})
				});
			}
		}, {
			key: 'removeAllCompleted',
			value: function removeAllCompleted() {
				this.setState({
					todos: this.state.todos.filter(function (v) {
						return v.done === false;
					})
				});
			}
		}, {
			key: 'markAllComplete',
			value: function markAllComplete() {
				this.setState({
					todos: this.state.todos.map(function (v) {
						v.done = true;
						return v;
					})
				});
			}
		}, {
			key: 'edit',
			value: function edit(id, task) {
				this.setState({
					todos: this.state.todos.map(function (v) {
						if (v.id === id) {
							v.task = task;
						}
						return v;
					})
				});
			}
		}, {
			key: 'markAllUnComplete',
			value: function markAllUnComplete() {
				this.setState({
					todos: this.state.todos.map(function (v) {
						v.done = false;
						return v;
					})
				});
			}
		}, {
			key: 'markUnComplete',
			value: function markUnComplete(id) {
				this.setState({
					todos: this.state.todos.map(function (v) {
						if (v.id === id) {
							v.done = false;
						}
						return v;
					})
				});
			}
		}, {
			key: 'getTotalCompleted',
			value: function getTotalCompleted() {
				return this.state.todos.filter(function (v) {
					return v.done === true;
				}).length;
			}
		}]);

		return TodoStoreClass;
	})(BaseStore);

	var TodoStore = new TodoStoreClass();
	var actionToMethodsMapping = (_actionToMethodsMapping = {}, _defineProperty(_actionToMethodsMapping, TodoConstants.TODO_CREATE, "addTodo"), _defineProperty(_actionToMethodsMapping, TodoConstants.TODO_REMOVE, "remove"), _defineProperty(_actionToMethodsMapping, TodoConstants.TODO_MARK_COMPLETE, "markComplete"), _defineProperty(_actionToMethodsMapping, TodoConstants.TODO_EDIT, "edit"), _defineProperty(_actionToMethodsMapping, TodoConstants.TODO_MARK_UNCOMPLETE, "markUnComplete"), _defineProperty(_actionToMethodsMapping, TodoConstants.TODO_MARK_ALL_COMPLETE, "markAllComplete"), _defineProperty(_actionToMethodsMapping, TodoConstants.TODO_MARK_ALL_UNCOMPLETE, "markAllUnComplete"), _defineProperty(_actionToMethodsMapping, TodoConstants.TODO_REMOVE_ALL_COMPLETED, "removeAllCompleted"), _actionToMethodsMapping);

	AppDispatcher.register(function (e) {
		var action = e.action;
		if (actionToMethodsMapping[action.actionType] !== undefined) {
			TodoStore[actionToMethodsMapping[action.actionType]].apply(TodoStore, action.args);
		}
	});
	module.exports = TodoStore;

/***/ },

/***/ 164:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var Dispatcher = __webpack_require__(165).Dispatcher;

	var AppDispatcher = (function (_Dispatcher) {
		_inherits(AppDispatcher, _Dispatcher);

		function AppDispatcher() {
			_classCallCheck(this, AppDispatcher);

			_get(Object.getPrototypeOf(AppDispatcher.prototype), "constructor", this).call(this);
		}

		_createClass(AppDispatcher, [{
			key: "handleViewAction",
			value: function handleViewAction(action) {
				//console.log(action);
				this.dispatch({
					source: "VIEW_ACTION",
					action: action
				});
			}
		}]);

		return AppDispatcher;
	})(Dispatcher);

	module.exports = new AppDispatcher();

/***/ },

/***/ 165:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	module.exports.Dispatcher = __webpack_require__(166);

/***/ },

/***/ 166:
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Dispatcher
	 * @typechecks
	 */

	"use strict";

	var invariant = __webpack_require__(167);

	var _lastID = 1;
	var _prefix = 'ID_';

	/**
	 * Dispatcher is used to broadcast payloads to registered callbacks. This is
	 * different from generic pub-sub systems in two ways:
	 *
	 *   1) Callbacks are not subscribed to particular events. Every payload is
	 *      dispatched to every registered callback.
	 *   2) Callbacks can be deferred in whole or part until other callbacks have
	 *      been executed.
	 *
	 * For example, consider this hypothetical flight destination form, which
	 * selects a default city when a country is selected:
	 *
	 *   var flightDispatcher = new Dispatcher();
	 *
	 *   // Keeps track of which country is selected
	 *   var CountryStore = {country: null};
	 *
	 *   // Keeps track of which city is selected
	 *   var CityStore = {city: null};
	 *
	 *   // Keeps track of the base flight price of the selected city
	 *   var FlightPriceStore = {price: null}
	 *
	 * When a user changes the selected city, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'city-update',
	 *     selectedCity: 'paris'
	 *   });
	 *
	 * This payload is digested by `CityStore`:
	 *
	 *   flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'city-update') {
	 *       CityStore.city = payload.selectedCity;
	 *     }
	 *   });
	 *
	 * When the user selects a country, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'country-update',
	 *     selectedCountry: 'australia'
	 *   });
	 *
	 * This payload is digested by both stores:
	 *
	 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       CountryStore.country = payload.selectedCountry;
	 *     }
	 *   });
	 *
	 * When the callback to update `CountryStore` is registered, we save a reference
	 * to the returned token. Using this token with `waitFor()`, we can guarantee
	 * that `CountryStore` is updated before the callback that updates `CityStore`
	 * needs to query its data.
	 *
	 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       // `CountryStore.country` may not be updated.
	 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
	 *       // `CountryStore.country` is now guaranteed to be updated.
	 *
	 *       // Select the default city for the new country
	 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
	 *     }
	 *   });
	 *
	 * The usage of `waitFor()` can be chained, for example:
	 *
	 *   FlightPriceStore.dispatchToken =
	 *     flightDispatcher.register(function(payload) {
	 *       switch (payload.actionType) {
	 *         case 'country-update':
	 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
	 *           FlightPriceStore.price =
	 *             getFlightPriceStore(CountryStore.country, CityStore.city);
	 *           break;
	 *
	 *         case 'city-update':
	 *           FlightPriceStore.price =
	 *             FlightPriceStore(CountryStore.country, CityStore.city);
	 *           break;
	 *     }
	 *   });
	 *
	 * The `country-update` payload will be guaranteed to invoke the stores'
	 * registered callbacks in order: `CountryStore`, `CityStore`, then
	 * `FlightPriceStore`.
	 */

	function Dispatcher() {
	  this.$Dispatcher_callbacks = {};
	  this.$Dispatcher_isPending = {};
	  this.$Dispatcher_isHandled = {};
	  this.$Dispatcher_isDispatching = false;
	  this.$Dispatcher_pendingPayload = null;
	}

	/**
	 * Registers a callback to be invoked with every dispatched payload. Returns
	 * a token that can be used with `waitFor()`.
	 *
	 * @param {function} callback
	 * @return {string}
	 */
	Dispatcher.prototype.register = function (callback) {
	  var id = _prefix + _lastID++;
	  this.$Dispatcher_callbacks[id] = callback;
	  return id;
	};

	/**
	 * Removes a callback based on its token.
	 *
	 * @param {string} id
	 */
	Dispatcher.prototype.unregister = function (id) {
	  invariant(this.$Dispatcher_callbacks[id], 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id);
	  delete this.$Dispatcher_callbacks[id];
	};

	/**
	 * Waits for the callbacks specified to be invoked before continuing execution
	 * of the current callback. This method should only be used by a callback in
	 * response to a dispatched payload.
	 *
	 * @param {array<string>} ids
	 */
	Dispatcher.prototype.waitFor = function (ids) {
	  invariant(this.$Dispatcher_isDispatching, 'Dispatcher.waitFor(...): Must be invoked while dispatching.');
	  for (var ii = 0; ii < ids.length; ii++) {
	    var id = ids[ii];
	    if (this.$Dispatcher_isPending[id]) {
	      invariant(this.$Dispatcher_isHandled[id], 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id);
	      continue;
	    }
	    invariant(this.$Dispatcher_callbacks[id], 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id);
	    this.$Dispatcher_invokeCallback(id);
	  }
	};

	/**
	 * Dispatches a payload to all registered callbacks.
	 *
	 * @param {object} payload
	 */
	Dispatcher.prototype.dispatch = function (payload) {
	  invariant(!this.$Dispatcher_isDispatching, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.');
	  this.$Dispatcher_startDispatching(payload);
	  try {
	    for (var id in this.$Dispatcher_callbacks) {
	      if (this.$Dispatcher_isPending[id]) {
	        continue;
	      }
	      this.$Dispatcher_invokeCallback(id);
	    }
	  } finally {
	    this.$Dispatcher_stopDispatching();
	  }
	};

	/**
	 * Is this Dispatcher currently dispatching.
	 *
	 * @return {boolean}
	 */
	Dispatcher.prototype.isDispatching = function () {
	  return this.$Dispatcher_isDispatching;
	};

	/**
	 * Call the callback stored with the given id. Also do some internal
	 * bookkeeping.
	 *
	 * @param {string} id
	 * @internal
	 */
	Dispatcher.prototype.$Dispatcher_invokeCallback = function (id) {
	  this.$Dispatcher_isPending[id] = true;
	  this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
	  this.$Dispatcher_isHandled[id] = true;
	};

	/**
	 * Set up bookkeeping needed when dispatching.
	 *
	 * @param {object} payload
	 * @internal
	 */
	Dispatcher.prototype.$Dispatcher_startDispatching = function (payload) {
	  for (var id in this.$Dispatcher_callbacks) {
	    this.$Dispatcher_isPending[id] = false;
	    this.$Dispatcher_isHandled[id] = false;
	  }
	  this.$Dispatcher_pendingPayload = payload;
	  this.$Dispatcher_isDispatching = true;
	};

	/**
	 * Clear bookkeeping used for dispatching.
	 *
	 * @internal
	 */
	Dispatcher.prototype.$Dispatcher_stopDispatching = function () {
	  this.$Dispatcher_pendingPayload = null;
	  this.$Dispatcher_isDispatching = false;
	};

	module.exports = Dispatcher;

/***/ },

/***/ 167:
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	"use strict";

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function invariant(condition, format, a, b, c, d, e, f) {
	  if (false) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error('Invariant Violation: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;

/***/ },

/***/ 168:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keymirror = __webpack_require__(169);

	var TodoConstants = keymirror({
		TODO_CREATE: null,
		TODO_REMOVE: null,
		TODO_EDIT: null,
		TODO_MARK_COMPLETE: null,
		TODO_MARK_UNCOMPLETE: null,
		TODO_MARK_ALL_COMPLETE: null,
		TODO_MARK_ALL_UNCOMPLETE: null,
		TODO_REMOVE_ALL_COMPLETED: null
	});

	module.exports = TodoConstants;

/***/ },

/***/ 169:
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 */

	"use strict";

	/**
	 * Constructs an enumeration with keys equal to their value.
	 *
	 * For example:
	 *
	 *   var COLORS = keyMirror({blue: null, red: null});
	 *   var myColor = COLORS.blue;
	 *   var isColorValid = !!COLORS[myColor];
	 *
	 * The last line could not be performed if the values of the generated enum were
	 * not equal to their keys.
	 *
	 *   Input:  {key1: val1, key2: val2}
	 *   Output: {key1: key1, key2: key2}
	 *
	 * @param {object} obj
	 * @return {object}
	 */
	var keyMirror = function keyMirror(obj) {
	  var ret = {};
	  var key;
	  if (!(obj instanceof Object && !Array.isArray(obj))) {
	    throw new Error('keyMirror(...): Argument must be an object.');
	  }
	  for (key in obj) {
	    if (!obj.hasOwnProperty(key)) {
	      continue;
	    }
	    ret[key] = key;
	  }
	  return ret;
	};

	module.exports = keyMirror;

/***/ },

/***/ 170:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var EventEmitter = __webpack_require__(162).EventEmitter;

	var BaseStore = (function (_EventEmitter) {
		_inherits(BaseStore, _EventEmitter);

		function BaseStore() {
			_classCallCheck(this, BaseStore);

			_get(Object.getPrototypeOf(BaseStore.prototype), 'constructor', this).call(this);
			this.setState(this.getInitialState());
		}

		_createClass(BaseStore, [{
			key: 'getState',
			value: function getState() {
				return this.state;
			}
		}, {
			key: 'setState',
			value: function setState(state) {
				this.state = state;
				this.duringSetState();
				this.emit('change');
			}
		}, {
			key: 'getInitialState',
			value: function getInitialState() {
				return {};
			}
		}]);

		return BaseStore;
	})(EventEmitter);

	module.exports = BaseStore;

/***/ },

/***/ 171:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * TodoActions
	 */

	"use strict";

	var AppDispatcher = __webpack_require__(164);

	var TodoConstants = __webpack_require__(168);

	var actionAlias = {
		addTodo: TodoConstants.TODO_CREATE,
		remove: TodoConstants.TODO_REMOVE,
		markComplete: TodoConstants.TODO_MARK_COMPLETE,
		markUnComplete: TodoConstants.TODO_MARK_UNCOMPLETE,
		edit: TodoConstants.TODO_EDIT,
		markAllComplete: TodoConstants.TODO_MARK_ALL_COMPLETE,
		removeAllCompleted: TodoConstants.TODO_REMOVE_ALL_COMPLETED,
		markAllUnComplete: TodoConstants.TODO_MARK_ALL_UNCOMPLETE
	};

	var TodoActions = {};
	Object.keys(actionAlias).map(function (key) {
		TodoActions[key] = function () {
			AppDispatcher.handleViewAction({
				actionType: actionAlias[key],
				args: arguments
			});
		};
	});

	//window.TodoActions = TodoActions;
	module.exports = TodoActions;

/***/ },

/***/ 172:
/***/ function(module, exports) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';

	var MESSAGE_TYPE = {
		RETURN_MESSAGE: "returnMessage",
		DEPART_WITH_SENDBACK_ID: "departWithSendBackId",
		DEPART: "depart"
	};

	var WorkerAdapter = (function () {
		function WorkerAdapter(url) {
			var _this = this;

			_classCallCheck(this, WorkerAdapter);

			var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';

			this.isBridgeReady = false;

			if (ENVIRONMENT_IS_WORKER === false) {
				this.worker = new Worker(url);
			} else {
				this.worker = self;
			}

			this._evtBus = {};
			this._unsubObj = [];
			this._returnCallback = [];

			this.worker.addEventListener('message', function (e) {
				_this._processRawMessage(e.data);
			}, false);
		}

		_createClass(WorkerAdapter, [{
			key: "_processRawMessage",
			value: function _processRawMessage(message) {
				console.log("Message Received", message);

				if (message.type === MESSAGE_TYPE.RETURN_MESSAGE) {
					var c = this._returnCallback[message.sendBackId];
					if (typeof c === "function") {
						c(message.payload);
						this._returnCallback[message.sendBackId] = null;
					} else {
						console.error("message contains sendBackID which do not have any corrosponding callback");
					}
				} else {
					var path = message.path;

					//Some Message comes from URL Worker thread, we need to process it. message is raw message. payload is inside raw message.
					// User is only interested in payload.
					var f = this._evtBus[path];
					var THAT = this;
					if (f !== undefined && f.length !== 0) {
						f.map(function (v, i) {
							v(message.payload, function (sendBackData) {
								console.log("send Back data is", sendBackData);
								THAT.worker.postMessage({
									payload: sendBackData,
									type: MESSAGE_TYPE.RETURN_MESSAGE,
									sendBackId: message.sendBackId
								});
							});
						});
					}
				}
			}
		}, {
			key: "onReady",
			value: function onReady(callback) {
				callback(); //Immediatly execute callback - TODO
			}
		}, {
			key: "on",
			value: function on(path, callback) {
				if (this._evtBus[path] === undefined) {
					this._evtBus[path] = [];
				}
				var index = this._evtBus[path].push(callback) - 1;
				var unSubIndex = this._unsubObj.push({
					path: path,
					index: index
				}) - 1;

				return unSubIndex;
			}
		}, {
			key: "off",
			value: function off(unSubIndex) {
				try {
					var _unsubObj$unSubIndex = this._unsubObj[unSubIndex];
					var path = _unsubObj$unSubIndex.path;
					var index = _unsubObj$unSubIndex.index;

					this._evtBus[path][index] = null;
				} catch (ex) {}
			}
		}, {
			key: "post",
			value: function post(path, payload, callback) {
				if (callback === undefined) {
					this.worker.postMessage({
						path: path,
						payload: payload,
						type: MESSAGE_TYPE.DEPART
					});
				} else {
					var id = this._registerSendBack(path, callback);
					this.worker.postMessage({
						path: path,
						payload: payload,
						type: MESSAGE_TYPE.DEPART_WITH_SENDBACK_ID,
						sendBackId: id
					});
				}
			}
		}, {
			key: "_registerSendBack",
			value: function _registerSendBack(path, callback) {
				//when a Raw Message comes with type : "return", we need to find its corresponding callback.
				var x = this._returnCallback.push(callback);
				return x - 1;
			}
		}]);

		return WorkerAdapter;
	})();

	var BLLayerLoader = {
		load: function load(config) {
			if (ENVIRONMENT_IS_WORKER === true) {
				throw "This method should not be called from Worker";
				return;
			}
			var url = config.url;
			var method = config.method;

			return new WorkerAdapter(url);
		},
		getBLBridge: function getBLBridge() {
			if (ENVIRONMENT_IS_WORKER === true) {
				return new WorkerAdapter();
			}
		}
	};

	module.exports = BLLayerLoader;

/***/ }

/******/ });