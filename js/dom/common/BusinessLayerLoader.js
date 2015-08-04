/**
 * Created by narendrasisodiya on 01/08/15.
 */


var EventEmitter = require('events').EventEmitter;

class EvtBus extends EventEmitter {
	constructor(config) {
		super();
	}
}

var globalEvtBusForWorkerLessEvt = new EvtBus();
window.globalEvtBusForWorkerLessEvt = globalEvtBusForWorkerLessEvt;

var callbacks = [];
var c = 0;

function handelMessageFromWorker(message) {
	var cmd = message.cmd;
	if (cmd === "callbackUpdate") {
		var f = callbacks[message.callbackId];
		if (typeof f === "function") {
			f(message.data);
			callbacks[message.callbackId] = null;
		}
	}
};


class BLLayer {
	init(){

	}
	post(url, ...args) {

	}

	get(url, callback) {

	}

	onMessage() {

	}

	onReady() {

	}
}


var BusinessLayerLoader = {

	loadInWorkerThread: true,

	load: function (config) {
		this.url = config.url;
		if (config.loadInWorkerThread !== undefined && config.loadInWorkerThread !== null) {
			this.loadInWorkerThread = config.loadInWorkerThread;
		}

		if (this.loadInWorkerThread) {
			var worker = new Worker(this.url);
			worker.post = function (url, ...args) {
				worker.postMessage({cmd: url, args: args});
			};

			worker.get = function (url, callback) {
				callbacks[c] = callback;
				worker.postMessage({cmd: url, type: "callback", callbackId: c});
				c = c + 1
			};

			worker.onMessage = (callback) => {
				worker.addEventListener('message', function (e) {
					callback(e.data);
				}, false);
			};
			worker.onMessage((message)=> {
				handelMessageFromWorker(message);
			});
			worker.onReady = (callback) => {
				callback();
			};
			return worker;

		} else {
			var script = document.createElement('script');
			script.src = this.url;
			script.onload = () => {
				//config.callback();
				this.onReadyCallback();
			};
			document.head.appendChild(script);

			var worker = {};
			worker.post = function (url, ...args) {
				globalEvtBusForWorkerLessEvt.emit("TO_WORKER_THREAD", {cmd: url, args: args})
			};
			worker.get = function (url, callback) {
				callbacks[c] = callback;
				globalEvtBusForWorkerLessEvt.emit("TO_WORKER_THREAD", {cmd: url, type: "callback", callbackId: c});
				c = c + 1
			};
			worker.onMessage = (callback) => {
				globalEvtBusForWorkerLessEvt.on("TO_UI_THREAD", (message) => {
					callback(message);
				});
			};
			worker.onMessage((message)=> {
				handelMessageFromWorker(message);
			});
			worker.onReady = (callback) => {
				this.onReadyCallback = callback;
			};

			return worker;
		}
	}
};


module.exports = BusinessLayerLoader;