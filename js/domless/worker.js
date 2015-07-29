var todostore = require('./todoStore');

var TodoActions = require('./TodoActions');


var actionList = {};
actionList["TodoActions"] = TodoActions;


todostore.on('change', function () {
	self.postMessage({
		cmd: "/stores/TodoStore/updateState",
		args: [todostore.getState()]
	});
});

self.addEventListener('message', function (e) {
	//console.info("Message arrived", arguments);
	var data = e.data;
	var x = data.cmd.split("/");
	x.splice(0, 1);
	var type = x[0];
	var service = x[1];
	var method = x[2];

	switch (type) {
		case 'actions':
			if (actionList[service] && actionList[service][method] && typeof actionList[service][method] === "function") {
				actionList[service][method].apply(actionList[service], data.args);
			}
			break;
		case 'stores':
			//TODO - remove hardcoding !
			if (data.cmd === "/stores/TodoStore/getInitialState") {
				self.postMessage({
					cmd: "callbackUpdate",
					callbackId: data.callbackId,
					data: todostore.getState()
				});
			}
			break;
		default:
			console.log("Unknown Command", data.cmd);
	}
}, false);
