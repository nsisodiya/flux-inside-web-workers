import BLLayerLoader from 'bl-layer-loader';

var bridge = BLLayerLoader.load({
	url: './dist/worker.bundle.js',
	method: "Worker"
});
export default bridge;