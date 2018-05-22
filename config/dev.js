const path = require('path');
const webpack = require('webpack');
const base = require('./base');
const defaults = require('./defaults');

const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const eslintLoader = {
    test: /\.js$/,
    exclude: /node_modules/,
    enforce: "pre",
    loader: "eslint-loader",
};

const jsHintLoader = {
    test: /\.js$/, // include .js files
    enforce: "pre", // preload the jshint loader
    exclude: /node_modules/, // exclude any and all files in the node_modules folder
    use: [
        {
            loader: "jshint-loader",
            options: {
                "undef": true,
                "unused": true,
                "esversion": 6,
                "globals": {
                    "MY_GLOBAL": true
                }
            }
        }
    ]
};

const loaders = [
    {...defaults.pugLoader},
    {...defaults.jsLoader},
    {...defaults.cssLoader},
    {...defaults.imgLoader},
    {...defaults.fontLoader},
    {...defaults.videoLoader},
];

const config = Object.assign(base, {
    context: path.join(__dirname, '..', 'src'),

    devtool: 'source-map',

    module: {rules: [...loaders]}
});

config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackHarddiskPlugin()
);

module.exports = config;