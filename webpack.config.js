const webpack = require('webpack');
const path = require('path');

const NODE_ENV = JSON.stringify(process.env.NODE_ENV);
const isDevelopment = NODE_ENV === '"development"';

let exportedConfig;
if(isDevelopment){
    const devConfig = require('./config/dev');
    console.log('start development webpack config');
    exportedConfig = devConfig;
} else {
    const prodConfig = require('./config/production.js');
    console.log('start production webpack config');
    exportedConfig = prodConfig;
}

module.exports = exportedConfig;
