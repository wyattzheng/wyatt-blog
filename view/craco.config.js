const DotenvPlugin = require('dotenv-webpack');
const path = require("path");
const {whenProd} = require("@craco/craco");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");


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
            new UglifyJsPlugin({
                cache:true,
                parallel:true,
                sourceMap:true
            }),
            new DotenvPlugin({
                safe: true,
                systemvars: true
            }),
            ...BundleAnalyzer,
        
        ],
        configure:(webpackConfig, { env, paths })=>{
            webpackConfig.devtool = false;
            webpackConfig.externals = {
                "react":"React",
                "react-dom":"ReactDOM",
                "xterm":"xterm",
                "eventemitter2":"eventemitter2"
            }
            return webpackConfig;
        }
    }
}