const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
    const devServer = {
        publicPath: '/dist',
        open: true,
        inline: true,
        hot: true,
        contentBase: [
            './',
            path.resolve(__dirname, './src/**')
        ],
        watchContentBase: true
    };

    const config = {
        mode: 'development',
        resolve: {
            modules: [
                path.resolve('./src'),
                path.resolve('./node_modules')
            ]
        },
        devtool: 'eval',
        entry: {
            app: ['./src/js/index.js']
        },
        output: {
            path: path.resolve(__dirname, './dist/'),
            filename: '[name].js'
        },
        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: '[name].css',
                chunkFilename: '[id].css'
            }),
            new DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('development')
                }
            })
        ],
        module: {
            rules: [
                {
                    test: /\.(js|jsx|mjs)$/,
                    exclude: /node_modules/,
                    enforce: 'pre',
                    use: {
                        loader: 'eslint-loader'
                    }
                },
                {
                    test: /\.(js|jsx|mjs)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'resolve-url-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2|png|jpg)$/,
                    use: {
                        loader: 'file-loader'
                    }
                }
            ]
        },
        devServer
    };

    return config;
};
