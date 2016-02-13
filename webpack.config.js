var webpack = require('webpack');

module.exports = {
    debug: true,
    entry: './src/index.js',
    output: {
        filename: './dist/angular-quagga-js.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
        }, {
            test: /\.html$/,
            loader: 'ngtemplate!html'
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }]
    }
};