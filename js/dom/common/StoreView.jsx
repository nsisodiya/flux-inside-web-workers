import React, {Component} from 'react';

import JSONViewer from 'react-json-viewer';


class StoreView extends Component {
	constructor(props, context) {
		super(props, context);
		var store = this.props.store;
		store.on('change', () => {
			this.setState(store.getState());
		});
		this.state = store.getState();
	}

	downloadState() {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.state)));
		element.setAttribute('download', "state.json");
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	render() {
		if (this.state === null || this.state === undefined) {
			return <div>Loading...</div>
		}
		return <div>
			<div>
				<button onClick={this.downloadState.bind(this)}>Download</button>
			</div>
			<JSONViewer json={this.state}></JSONViewer>
		</div>;
	}
}

export default StoreView;