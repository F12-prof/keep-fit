const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'inline-source-map',
    entry: {
        index: './src/scripts/index.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.ejs',
            hash: true,
            minify: false
        })
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.ttf$/i,
                type: 'asset/resource',
            }
        ],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
}