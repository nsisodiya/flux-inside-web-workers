module.exports = {
	entry: {
		main: "./js/dom/index.jsx",
		worker: "./js/domless/worker.js"
	},
	output: {
		path: "dist",
		filename: "[name].bundle.js"
	},
	module: {
		loaders: [
			{ test: /.jsx?$/, loader: "babel-loader" }
		]
	}
};