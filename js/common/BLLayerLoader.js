var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';

var MESSAGE_TYPE = {
	RETURN_MESSAGE: "returnMessage",
	DEPART_WITH_SENDBACK_ID: "departWithSendBackId",
	DEPART: "depart"
};

function setUpGlobalMessagePass() {
	if (ENVIRONMENT_IS_WORKER === false && window._globalMessagePassForWorkerLessEnv_ === undefined) {
		//Define only once !
		var local = {};

		local.registerBL = function (callback) {
			local.BL = callback;
		};

		local.registerUI = function (callback) {
			local.UI = callback;
		};
		local.sendToBL = function (message) {
			local.BL(message);
		};
		local.sendToUI = function (message) {
			local.UI(message);
		};
		window._globalMessagePassForWorkerLessEnv_ = local;
	}
}

class FakeWorker {
	constructor(BLL) {
		if (BLL === undefined) {
			throw "Send BLL Variable Either True of False";
		}
		this.BLL = BLL;
	}

	addEventListener(topic, callback) {
		if (this.BLL) {
			window._globalMessagePassForWorkerLessEnv_.registerBL(callback);
		} else {
			window._globalMessagePassForWorkerLessEnv_.registerUI(callback);
		}
	}

	postMessage(message) {
		if (this.BLL) {
			window._globalMessagePassForWorkerLessEnv_.sendToUI({
				data: message
			});
		} else {
			window._globalMessagePassForWorkerLessEnv_.sendToBL({
				data: message
			});
		}
	}
}

class BaseAdapter {
	constructor() {
		this.isBridgeReady = false;
		this._evtBus = {};
		this._unsubObj = [];
		this._returnCallback = [];
		this.BLLayer = true;
	}

	_processRawMessage(message) {
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
			var {path} = message;
			//Some Message comes from URL Worker thread, we need to process it. message is raw message. payload is inside raw message.
			// User is only interested in payload.
			var f = this._evtBus[path];
			var THAT = this;
			if (f !== undefined && f.length !== 0) {
				f.map((v, i)=> {
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

	on(path, callback) {
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

	off(unSubIndex) {
		try {
			var {path , index} = this._unsubObj[unSubIndex];
			this._evtBus[path][index] = null;
		} catch (ex) {

		}
	}

	post(path, payload, callback) {
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

	_registerSendBack(path, callback) {
		//when a Raw Message comes with type : "return", we need to find its corresponding callback.
		var x = this._returnCallback.push(callback);
		return x - 1;

	}

}
class LocalAdapter extends BaseAdapter {
	constructor(url) {
		super();

		if (url !== undefined) {
			this._loadScript(url);
			this.BLLayer = false;
		}

		if (window._globalMessagePassForWorkerLessEnv_ === undefined) {
			setUpGlobalMessagePass();
		}
		this.worker = new FakeWorker(this.BLLayer);

		this.worker.addEventListener('message', (e) => {
			this._processRawMessage(e.data);
		}, false);

	}

	_loadScript(url) {
		var script = document.createElement('script');
		script.src = url;
		script.onload = () => {
			this._onScriptLoaded();
		};
		document.head.appendChild(script);
	}

	_onScriptLoaded() {
		this.isBridgeReady = true;
		if (this._onReadyCallback !== undefined) {
			this._onReadyCallback();
			this._onReadyCallback === undefined;
		}
	}

	onReady(callback) {
		if (this.isBridgeReady === true) {
			callback();
		} else {
			this._onReadyCallback = callback;
		}
	}
}
class WorkerAdapter extends BaseAdapter {
	constructor(url) {
		super();
		if (ENVIRONMENT_IS_WORKER === false) {
			this.BLLayer = false;
			this.worker = new Worker(url);
		} else {
			this.BLLayer = true;
			this.worker = self;
		}
		this.worker.addEventListener('message', (e) => {
			this._processRawMessage(e.data);
		}, false);
	}

	onReady(callback) {
		callback();//Immediatly execute callback - TODO
	}
}

var BLLayerLoader = {
	load: function (config) {
		if (ENVIRONMENT_IS_WORKER === true) {
			throw "This method should not be called from Worker";
			return;
		}
		var {url, method} = config;
		if (method === "Worker") {
			return new WorkerAdapter(url);
		}
		if (method === "Local") {
			return new LocalAdapter(url);
		}
	},
	getBLBridge: function () {
		if (ENVIRONMENT_IS_WORKER === true) {
			return new WorkerAdapter();
		} else {
			return new LocalAdapter();
		}
	}
};

module.exports = BLLayerLoader;