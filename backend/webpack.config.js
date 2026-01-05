// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        fallback: {
            assert: require.resolve('assert/'),
            path: require.resolve('path-browserify'),
            crypto: require.resolve('crypto-browserify'),
            fs: false, // 'fs' is not available in the browser environment, so you might want to set it to false
            http: require.resolve('stream-http'),
            net: false, // Node.js 'net' module is not available in the browser, so set to false
            buffer: require.resolve('buffer/'),
            stream: require.resolve('stream-browserify'),
            url: require.resolve('url/'),
            process: require.resolve('process/browser'),
            zlib: require.resolve('browserify-zlib'),
            dns: false, // Node.js 'dns' module is not available in the browser
            child_process: false, // Node.js 'child_process' module is not available in the browser
            os: require.resolve('os-browserify/browser'),
            tls: false, // Node.js 'tls' module is not available in the browser
            querystring: require.resolve('querystring-es3'),
            https: require.resolve('https-browserify'),
            vm: require.resolve('vm-browserify'),
            async_hooks: false
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                'style-loader',
                'css-loader'
                ]
            },
            {
                test: /\.html$/,
                use: [ 'html-loader' ]
            }
        ]
    },
    mode: 'production', // Set the mode option to 'development' or 'production' based on your environment
    externals: {
        'mock-aws-s3': 'commonjs mock-aws-s3',
        'aws-sdk': 'commonjs aws-sdk',
        'nock': 'commonjs nock',
        'node-gyp': 'commonjs node-gyp',
        'npm': 'commonjs npm'
    }      
};
