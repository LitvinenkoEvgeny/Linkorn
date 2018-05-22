const path = require('path');
const webpack = require('webpack');
const base = require('./base');
const defaults = require('./defaults');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const _ = require('lodash');


const imgLoader = {
    test: /\.(gif|png|jpe?g|svg)$/i,
    loaders: [
        'file-loader?name=[path][name].[hash].[ext]', {
            loader: 'image-webpack-loader?name=[path][name].[hash].[ext]',
            options: {
                gifsicle: {
                    interlaced: false,
                },
                optipng: {
                    optimizationLevel: 7,
                },
                pngquant: {
                    quality: '65-90',
                    speed: 4
                },
                mozjpeg: {
                    progressive: true,
                    quality: 65
                },
                // Specifying webp here will create a WEBP version of your JPG/PNG images
                webp: {
                    quality: 75
                },
            },
        }
    ]
};

const cssLoader = {
    test: /\.s(c|a)ss$/,
    use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: "css-loader!postcss-loader!sass-loader"
    })
};

const loaders = [
    {...defaults.pugLoader},
    {...defaults.jsLoader},
    {...imgLoader},
    {...cssLoader},
    {...defaults.fontLoader},
    {...defaults.videoLoader},
];

const config = Object.assign(base, {
    context: path.join(__dirname, '..', 'src'),

    devtool: 'source-map',


    module: { rules: [...loaders]}
});
config.plugins.push(
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin('styles.css'),
);

module.exports = config;
