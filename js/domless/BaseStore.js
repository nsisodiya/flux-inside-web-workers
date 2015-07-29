var EventEmitter = require('events').EventEmitter;

class BaseStore extends EventEmitter {
	constructor() {
		super();
		this.setState(this.getInitialState());
	}

	getState() {
		return this.state;
	}

	setState(state) {
		this.state = state;
		this.duringSetState();
		this.emit('change');
	}

	getInitialState() {
		return {}
	}
}
module.exports = BaseStore;