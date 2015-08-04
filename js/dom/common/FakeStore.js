/**
 * Created by narendrasisodiya on 29/07/15.
 */


var EventEmitter = require('events').EventEmitter;

class FakeStore extends EventEmitter {
	constructor(config) {
		super();
		var worker = config.worker;
		this.onStateUpdate = (message) => {
			var cmd = message.cmd;
			if (cmd === config.cmdOnStateUpdate) {
				this.setState(message.args[0]);
			}
		};
		worker.onMessage(this.onStateUpdate);
		worker.get(config.cmdGetInitialState, (state)=> {
			console.log("Received State from Worker");
			this.setState(state);
		});
	}

	destroy() {
		//TODO
		worker.remove(this.onStateUpdate);
	}

	getState() {
		return this.state;
	}

	setState(state) {
		this.state = state;
		this.emit('change');
	}
}
module.exports = FakeStore;