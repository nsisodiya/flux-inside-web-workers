import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import StoreView from './common/StoreView.jsx';
import TodoApp from './TodoApp.js';
import ForkMe from './common/ForkMe.js';
import FakeStore from './common/FakeStore';
import bridge from './common/initBridge.js';

window.bridge = bridge;

bridge.onReady(() => {
	var fakeTodoStore = new FakeStore({
		bridge: bridge,
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
			//TODO - user should control this switch !
			var RenderView = [StoreView, TodoApp][1];

			return <div>
				<ForkMe repo="https://github.com/nsisodiya/flux-inside-web-workers"></ForkMe>

				<h1>Flux inside Web Workers</h1>

				<div>
					<h3>Open Console and copy paste following commands</h3>
				<pre>
					bridge.post("/actions/TodoActions/addTodo", "TodoAdded From Console");
				</pre>
				<pre>
					bridge.post("/actions/TodoActions/markComplete", 0);
				</pre>
				</div>
				<RenderView store={fakeTodoStore}></RenderView>
			</div>;
		}
	}

	ReactDOM.render(<MainApp/>, document.getElementById("content"));
});
