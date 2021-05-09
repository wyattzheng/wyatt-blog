const DotenvPlugin = require('dotenv-webpack');
const path = require("path");
const {whenProd} = require("@craco/craco");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');


const BundleAnalyzer = whenProd(
    () => [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: path.resolve(__dirname, `analyzer/index.html`),
      }),
    ],
    [],
);

module.exports = {
    webpack:{
        plugins:[
            new MomentLocalesPlugin(),
            new UglifyJsPlugin({
                cache:true,
                parallel:true,
                sourceMap:true
            }),
            new DotenvPlugin(),
            ...BundleAnalyzer,
        
        ],
        configure:(webpackConfig, { env, paths })=>{
            webpackConfig.devtool = false;
            return webpackConfig;
        }
    }
}