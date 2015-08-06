var todostore = require('./todoStore');
var TodoActions = require('./TodoActions');
import BLLayerLoader from 'bl-layer-loader'

var bridge = BLLayerLoader.getBLBridge();

todostore.on('change', function () {
	bridge.post("/stores/TodoStore/updateState", todostore.getState());
});

bridge.on("/stores/TodoStore/getInitialState", function (payload, sendBack) {
	sendBack(todostore.getState());
});

//TODO , support : Syntax
//bridge.on("/actions/TodoActions/:method", function (payload, sendBack, path) {
//	var method = path.params.method
//  path.url = "/actions/TodoActions/addTodo"
//  path.matchedUrl = "/actions/TodoActions/:method"
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