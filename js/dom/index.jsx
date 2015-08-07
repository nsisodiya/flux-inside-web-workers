import React, {Component} from 'react';
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
			this.state = {
				showStoreView: false
			}
		}

		componentWillUnmount() {
			fakeTodoStore.destroy();
		}

		onChange() {
			this.setState({showStoreView: !this.state.showStoreView});
		}
		render() {
			function iff(x) {
				return ((x === true) + 1) % 2;
			}

			var RenderView = [StoreView, TodoApp][iff(this.state.showStoreView)];
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
				<div>
					<input checked={this.state.showStoreView} onChange={this.onChange.bind(this)} type="checkbox"/> <b>Show Store
					JSON View (DOMLess)</b>
				</div>

				<RenderView store={fakeTodoStore}></RenderView>
			</div>;
		}
	}

	React.render(<MainApp/>, document.getElementById("content"));
});
