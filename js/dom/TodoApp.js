/**
 * Created by narendrasisodiya on 29/07/15.
 */

import React, {Component} from 'react';
import bridge from './common/initBridge.js';
import classnames from 'classnames';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';

const FILTER_TITLES = {
  [SHOW_ALL]: 'All',
  [SHOW_ACTIVE]: 'Active',
  [SHOW_COMPLETED]: 'Completed'
}

const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: todo => !todo.done,
  [SHOW_COMPLETED]: todo => todo.done
}

class TodoApp extends Component {
	constructor(props, context) {
		super(props, context);
		this.subfun = () => {
			this.setState(this.props.store.getState());
		};
		this.props.store.on('change', this.subfun);
		this.state = this.props.store.getState();
	}

	componentWillUnmount() {
		this.props.store.removeListener('change', this.subfun);
	}
	handleBlur() {

	}

	handleChange() {

	}

	markComplete(e) {
		var url;
		if (e.currentTarget.checked) {
			url = "/actions/TodoActions/markComplete";
		} else {
			url = "/actions/TodoActions/markUnComplete";
		}
		bridge.post(url, parseInt(e.currentTarget.dataset.todoId, 10));
	}

	toggleAll(e) {
		var url;
		if (e.currentTarget.checked) {
			url = "/actions/TodoActions/markAllComplete";
		} else {
			url = "/actions/TodoActions/markAllUnComplete";
		}
		bridge.post(url);
	}

	handleSubmit(e) {
		const text = e.currentTarget.value.trim();
		if (e.which === 13 && text !== "") {
			bridge.post("/actions/TodoActions/addTodo", text);
			e.currentTarget.value = "";
		}
	}

	handleEdit(e) {
		const text = e.currentTarget.value.trim();
		if (e.which === 13) {
			var id = parseInt(e.currentTarget.dataset.todoId, 10);
			if (text === "") {
				bridge.post("/actions/TodoActions/remove", id);
			} else {
				bridge.post("/actions/TodoActions/edit", {id: id, text: text});
			}
		}
	}

	handleRemove(e) {
		var id = parseInt(e.currentTarget.dataset.todoId, 10);
		bridge.post("/actions/TodoActions/remove", id);
	}

	clearCompleted(e) {
		bridge.post("/actions/TodoActions/removeAllCompleted");
	}

	handleDoubleClick(e) {
		//editing flag
	}

	handelOnShow(filter) {
		bridge.post("/actions/TodoActions/onShow", filter);
	}

  renderFilterLink(filter, selectedFilter) {
    const title = FILTER_TITLES[filter]
    const { onShow } = this.props

    return (
      <a className={classnames({ selected: filter === selectedFilter })}
         style={{ cursor: 'pointer' }}
         onClick={this.handelOnShow.bind(this, filter)}>
        {title}
      </a>
    )
  }

	render() {
		if (this.state === undefined || this.state === null) {
			return <div>Loading ...</div>;
		}

    const { todos, selectedFilter } = this.state;

    const filteredTodos = todos.filter(TODO_FILTERS[selectedFilter])
    const completedCount = todos.reduce((count, todo) =>
      todo.done ? count + 1 : count,
      0
    )

		return <div>
			<section className="todoapp">
				<header className="header">
					<h1>todos</h1>
					<input onBlur={this.handleBlur.bind(this)}
							onChange={this.handleChange.bind(this)}
							onKeyDown={this.handleSubmit.bind(this)} className="new-todo"
							placeholder="What needs to be done?"></input>
				</header>
				<section className="main">
					<input onChange={this.toggleAll.bind(this)} className="toggle-all" type="checkbox"></input>
					<ul className="todo-list">
						{
							filteredTodos.map((v, i)=> {
								return <li key={v.id} className={v.done?"done":""}>
									<div className="view">
										<input data-todo-id={v.id} onChange={this.markComplete.bind(this)} className="toggle"
												type="checkbox" checked={v.done}></input>
										<label onDoubleClick={this.handleDoubleClick.bind(this)}>{v.task}</label>
										<button data-todo-id={v.id} onClick={this.handleRemove.bind(this)} className="destroy"></button>
									</div>
									<input data-todo-id={v.id}
											onChange={this.handleChange.bind(this)}
											onKeyDown={this.handleEdit.bind(this)} className="edit"></input>
								</li>
							})
						}
					</ul>
				</section>
				{
					todos.length > 0
							? <footer className="footer">
					<span className="todo-count">
										<strong>{this.state.uncompleted}</strong><span> </span><span>item</span><span> left</span></span>
						<ul className="filters">
		          {[ SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED ].map(filter =>
		            <li key={filter}>
		              {this.renderFilterLink(filter, selectedFilter)}
		            </li>
		          )}
						</ul>
						{
							this.state.completed > 0 ?
									<button onClick={this.clearCompleted.bind(this)} className="clear-completed">Clear
										completed</button> : ""
						}

					</footer>
							: ""
				}
			</section>
		</div>;
	}
}

export default TodoApp;