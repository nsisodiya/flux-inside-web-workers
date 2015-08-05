/**
 * Created by narendrasisodiya on 29/07/15.
 */


var EventEmitter = require('events').EventEmitter;

class FakeStore extends EventEmitter {
	constructor(config) {
		super();
		var bridge = config.bridge;

		this.unsubid = bridge.on(config.cmdOnStateUpdate, (payload, sendBack) => {
			this.setState(payload);
		});

		bridge.post(config.cmdGetInitialState, {}, (data)=> {
			console.log("Received State from bridge");
			this.setState(data);
		});
	}

	destroy() {
		//TODO
		bridge.off(this.unsubid);
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