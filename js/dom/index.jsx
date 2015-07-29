import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import StoreView from './common/StoreView.jsx';
import TodoApp from './TodoApp.js';
import ForkMe from './common/ForkMe.js';
import FakeStore from './common/FakeStore';
import worker from './common/initWorker.js';

window.worker = worker;

var RenderView = [StoreView, TodoApp][1];

var fakeTodoStore = new FakeStore({
	worker: worker,
	cmdOnStateUpdate: "/stores/TodoStore/updateState",
	cmdGetInitialState: "/stores/TodoStore/getInitialState"
});

class MainApp extends Component {
	constructor() {
		super();
	}

	componentWillUnmount() {
		fakeTodoStore.destroy();
	}

	render() {
		return <div>
			<ForkMe repo="https://github.com/nsisodiya/flux-inside-web-workers"></ForkMe>
			<h1>Flux inside Web Workers</h1>
			<div>
				<h3>Open Console and copy paste following commands</h3>
				<pre>
					worker.post("/actions/TodoActions/addTodo", "TodoAdded From Console");
				</pre>
				<pre>
					worker.post("/actions/TodoActions/markComplete", 0);
				</pre>
			</div>
			<RenderView store={fakeTodoStore}></RenderView>
		</div>;
	}
}

ReactDOM.render(<MainApp/>, document.getElementById("content"));