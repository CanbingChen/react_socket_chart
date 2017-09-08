const webpack = require("webpack");
const path = require("path");
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require("./webpack.config.dev.js");


const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
	stats: {
		colors: true
	},
	historyApiFallback: true,
	contentBase: path.join(__dirname, ".."),

	hot: true,
	overlay: true,
	disableHostCheck: true,
	proxy: {
		'/api/**': {
            // target: 'http://rapapi.org/mockjs/20340',
			// target: 'http://127.0.0.1:8888',
			target: 'http://10.0.0.181:8080',
			changeOrigin: true
		}
	},
});

server.listen(9000, "0.0.0.0", function(err) {
	console.log(err || "Starting server on http://localhost:9000");
});
