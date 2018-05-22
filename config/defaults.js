const path = require('path');


const srcPath = path.join(__dirname, '../src');
const entryFileName = './index.js';
const vendorLibs = ['jquery'];
const publicPath = '/assets/';

const pugLoader = {
    test: /\.(pug)$/,
    use: {
        loader: 'pug-loader',
    }
};

const jsLoader = {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: ['env', 'es2015', 'es2016', 'es2017']
        }
    }
};

const cssLoader = {
    test: /\.s(c|a)ss$/,
    use: [{
        loader: "style-loader" // creates style nodes from JS strings
    }, {
        loader: "css-loader" // translates CSS into CommonJS
    }, {
        loader: "postcss-loader"
    },{
        loader: "sass-loader" // compiles Sass to CSS
    }]
};

const imgLoader = {
    test: /\.(png|svg|jpg|gif)$/,
    loader: 'url-loader',
    options: {
        limit: '8192',
        name: '[path][name].[hash].[ext]'
    }
};

const fontLoader = {
    test: /\.(ttf|eot|woff2?)(\?v=[a-z0-9=\.]+)?$/i,
    loader: 'url-loader',
    options: {
        limit: '8192',
        name: '[path][name].[hash].[ext]'
    },

};

const videoLoader = {
    test: /\.(mp4|ogg)$/,
    loader: 'file-loader',
    options: {
        name: '[path][name].[hash].[ext]',
    }
};


// https://github.com/mixtur/webpack-spritesmith#example
const pngSpritesFolder = path.join(__dirname, '..', 'src', 'img', 'sprites', 'png');
const pngSpritesOutputPath = path.join(__dirname, '..', 'src', 'img', 'sprites', 'sprite.png');
const pngSpritesCssOutputPath = path.join(__dirname, '..', 'src', 'css', 'sprites', 'png-sprites.sass');

module.exports = {
    entryFileName,
    vendorLibs,
    srcPath,
    publicPath,
    jsLoader,
    pugLoader,
    cssLoader,
    imgLoader,
    fontLoader,
    videoLoader,
    pngSpritesFolder,
    pngSpritesOutputPath,
    pngSpritesCssOutputPath
};