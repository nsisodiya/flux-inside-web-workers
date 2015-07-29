var Dispatcher = require('flux').Dispatcher;

class AppDispatcher extends Dispatcher {
	constructor() {
		super();
	}

	handleViewAction(action) {
		//console.log(action);
		this.dispatch({
			source: "VIEW_ACTION",
			action: action
		})
	}
}

module.exports = new AppDispatcher();