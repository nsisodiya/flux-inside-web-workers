var AppDispatcher = require('./AppDispatcher');
var TodoConstants = require("./TodoConstants");
var BaseStore = require('./BaseStore');
import { SHOW_ALL } from '../constants/TodoFilters';

class TodoStoreClass extends BaseStore {
	constructor() {
		super();
		if (this.state.todos.length !== 0) {
			this.counter = this.state.todos[this.state.todos.length - 1].id + 1;
		} else {
			this.counter = this.state.todos.length;
		}
	}

	getInitialState() {
		var defaultState = {
			todos: [],
			selectedFilter: SHOW_ALL
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
	addTodo(text) {
		this.setState({
			todos: [...this.state.todos, {
				task: text,
				done: false,
				id: this.counter
			}]
		});
		this.counter++;
	}

	duringSetState() {
		this.state.completed = this.getTotalCompleted();
		this.state.uncompleted = this.state.todos.length - this.state.completed;
		//window.localStorage.setItem("todoStore", JSON.stringify(this.state));
	}

	markComplete(id) {
		this.setState({
			todos: this.state.todos.map(function (v) {
				if (v.id === id) {
					v.done = true;
				}
				return v;
			})
		});
	}

	remove(id) {
		this.setState({
			todos: this.state.todos.filter(function (v) {
				return v.id !== id;
			})
		});
	}

	removeAllCompleted() {
		this.setState({
			todos: this.state.todos.filter(function (v) {
				return v.done === false;
			})
		});
	}

	markAllComplete() {
		this.setState({
			todos: this.state.todos.map(function (v) {
				v.done = true;
				return v;
			})
		});
	}

	edit(id, task) {
		this.setState({
			todos: this.state.todos.map(function (v) {
				if (v.id === id) {
					v.task = task;
				}
				return v;
			})
		});
	}

	markAllUnComplete() {
		this.setState({
			todos: this.state.todos.map(function (v) {
				v.done = false;
				return v;
			})
		});
	}

	markUnComplete(id) {
		this.setState({
			todos: this.state.todos.map(function (v) {
				if (v.id === id) {
					v.done = false;
				}
				return v;
			})
		});
	}

	getTotalCompleted() {
		return this.state.todos.filter(function (v) {
			return v.done === true;
		}).length;
	}

	onShow(filter){
		this.setState({ selectedFilter: filter, todos: this.state.todos });
	}
}

var TodoStore = new TodoStoreClass();
var actionToMethodsMapping = {
	[TodoConstants.TODO_CREATE]: "addTodo",
	[TodoConstants.TODO_REMOVE]: "remove",
	[TodoConstants.TODO_MARK_COMPLETE]: "markComplete",
	[TodoConstants.TODO_EDIT]: "edit",
	[TodoConstants.TODO_MARK_UNCOMPLETE]: "markUnComplete",
	[TodoConstants.TODO_MARK_ALL_COMPLETE]: "markAllComplete",
	[TodoConstants.TODO_MARK_ALL_UNCOMPLETE]: "markAllUnComplete",
	[TodoConstants.TODO_REMOVE_ALL_COMPLETED]: "removeAllCompleted",
	[TodoConstants.TODO_ON_SHOW]: "onShow",
};


AppDispatcher.register(function (e) {
	var action = e.action;
	if (actionToMethodsMapping[action.actionType] !== undefined) {
		TodoStore[actionToMethodsMapping[action.actionType]].apply(TodoStore, action.args);
	}
});
module.exports = TodoStore;