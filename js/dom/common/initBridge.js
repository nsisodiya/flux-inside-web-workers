import BLLayerLoader from './../../common/BLLayerLoader.js';

var bridge = BLLayerLoader.load({
	url: './dist/worker.bundle.js',
	method: "Worker"
});
export default bridge;