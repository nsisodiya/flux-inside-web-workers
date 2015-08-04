import BusinessLayerLoader from './BusinessLayerLoader.js';

var myWorker = BusinessLayerLoader.load({
	url: './dist/worker.bundle.js',
	loadInWorkerThread: true
});

export default myWorker;