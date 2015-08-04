var todostore = require('./todoStore');

var TodoActions = require('./TodoActions');


var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';

var actionList = {};
actionList["TodoActions"] = TodoActions;


todostore.on('change', function () {
	sendMessageToMainUIThread({
		cmd: "/stores/TodoStore/updateState",
		args: [todostore.getState()]
	});
});

function sendMessageToMainUIThread(message) {
	if (ENVIRONMENT_IS_WORKER) {
		self.postMessage(message);
	} else {
		if (globalEvtBusForWorkerLessEvt) {
			globalEvtBusForWorkerLessEvt.emit("TO_UI_THREAD", message);
		} else {
			alert("Unable to find communication bus");
		}
	}
}

function handelMessageFromMainUIThread(data) {
	//console.info("Message arrived", arguments);
	var x = data.cmd.split("/");
	x.splice(0, 1);
	var type = x[0];
	var service = x[1];
	var method = x[2];

	switch (type) {
		case 'actions':
			if (actionList[service] && actionList[service][method] && typeof actionList[service][method] === "function") {
				actionList[service][method].apply(actionList[service], data.args);
			} else {
				//TODO - console.error()
			}
			break;
		case 'stores':
			//TODO - remove hardcoding !
			if (data.cmd === "/stores/TodoStore/getInitialState") {
				sendMessageToMainUIThread({
					cmd: "callbackUpdate",
					callbackId: data.callbackId,
					data: todostore.getState()
				});
			}
			break;
		default:
			console.log("Unknown Command", data.cmd);
	}
}

if (ENVIRONMENT_IS_WORKER) {
	self.addEventListener('message', function (e) {
		handelMessageFromMainUIThread(e.data);
	}, false);
} else {

	if (globalEvtBusForWorkerLessEvt) {
		globalEvtBusForWorkerLessEvt.on("TO_WORKER_THREAD", (message)=> {
			handelMessageFromMainUIThread(message);
		});
	} else {
		alert("Unable to find communication bus");
	}
}
