/**
 * TodoActions
 */

var AppDispatcher = require('./AppDispatcher');


var TodoConstants = require("./TodoConstants");

var actionAlias = {
	addTodo: TodoConstants.TODO_CREATE,
	remove: TodoConstants.TODO_REMOVE,
	markComplete: TodoConstants.TODO_MARK_COMPLETE,
	markUnComplete: TodoConstants.TODO_MARK_UNCOMPLETE,
	edit: TodoConstants.TODO_EDIT,
	markAllComplete: TodoConstants.TODO_MARK_ALL_COMPLETE,
	removeAllCompleted: TodoConstants.TODO_REMOVE_ALL_COMPLETED,
	markAllUnComplete: TodoConstants.TODO_MARK_ALL_UNCOMPLETE,
	onShow: TodoConstants.TODO_ON_SHOW
};

var TodoActions = {};
Object.keys(actionAlias).map(function (key) {
	TodoActions[key] = function () {
		AppDispatcher.handleViewAction({
			actionType: actionAlias[key],
			args: arguments
		});
	}
});

//window.TodoActions = TodoActions;
module.exports = TodoActions;