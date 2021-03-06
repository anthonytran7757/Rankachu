const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: './client/index.tsx',
    output: {
        path: path.join(__dirname, 'client'),
        filename: 'bundle.js'
    },
    resolve: {
        alias: {
            "pokemonRanking-components": path.resolve(__dirname, "client/components"),
            "pokemonRanking-css": path.resolve(__dirname, "client/css")
        },
        extensions: [".ts", ".tsx", ".js", ".jsx", ".css"]

    },
    module: {
        rules: [
            // changed from { test: /\.jsx?$/, use: { loader: 'babel-loader' }, exclude: /node_modules/ },
            { test: /\.(t|j)sx?$/, use: { loader: 'ts-loader' }, exclude: /node_modules/ },
            // addition - add source-map support
            { enforce: "pre", test: /\.js$/, exclude: /node_modules/, loader: "source-map-loader" },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }]
    }
};