const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        // Home
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
        }),
        // Profil
        new HtmlWebpackPlugin({
            template: './src/profil/index.html',
            filename: 'profil/index.html',
        }),
        // Visi
        new HtmlWebpackPlugin({
            template: './src/visi/index.html',
            filename: 'visi/index.html',
        }),
        // Staff & Guru
        new HtmlWebpackPlugin({
            template: './src/staff/index.html',
            filename: 'staff/index.html',
        }),

        // Galeri
        new HtmlWebpackPlugin({
            template: './src/galeri/index.html',
            filename: 'galeri/index.html',
        }),
        // Kontak
        new HtmlWebpackPlugin({
            template: './src/kontak/index.html',
            filename: 'kontak/index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/assets',
                    to: 'assets',
                    noErrorOnMissing: true,
                },
            ],
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 8080,
        open: true,
        hot: true,
        watchFiles: ['src/**/*'],
        historyApiFallback: false,
    },
};
