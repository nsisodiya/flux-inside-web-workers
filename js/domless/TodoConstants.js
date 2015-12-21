var keymirror = require('keymirror');

var TodoConstants = keymirror({
	TODO_CREATE: null,
	TODO_REMOVE: null,
	TODO_EDIT: null,
	TODO_MARK_COMPLETE: null,
	TODO_MARK_UNCOMPLETE: null,
	TODO_MARK_ALL_COMPLETE: null,
	TODO_MARK_ALL_UNCOMPLETE: null,
	TODO_REMOVE_ALL_COMPLETED: null,
  TODO_ON_SHOW: null
});

module.exports = TodoConstants;