var myWorker = new Worker('/dist/worker.bundle.js');

/*
 * worker.postMessage({cmd: "actions.TodoActions", method: "edit", args: [e.currentTarget.dataset.todoId, text]});
 *
 *      vs
 *
 *     worker.post("/actions/TodoActions/edit", e.currentTarget.dataset.todoId, text);
 * */
myWorker.post = function (url, ...args) {
	myWorker.postMessage({cmd: url, args: args});
};

var callbacks = [];
var c = 0;
myWorker.get = function (url, callback) {
	callbacks[c] = callback;
	myWorker.postMessage({cmd: url, type: "callback", callbackId: c});
	c = c + 1
};

myWorker.addEventListener('message', function (e) {
	//TODO = switch case !
	var cmd = e.data.cmd;
	if (cmd === "callbackUpdate") {
		var f = callbacks[e.data.callbackId];
		if (typeof f === "function") {
			f(e.data.data);
			callbacks[e.data.callbackId] = null;
		}
	}
}, false);
export default myWorker;