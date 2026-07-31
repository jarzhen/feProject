const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash:8].js',
    clean: true
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'Vue2 + Element UI'
    })
  ],
  devServer: {
    port: 8080,
    hot: true,
    open: true,
    onListening: function (devServer) {
      if (!devServer) return;
      const port = devServer.server.address().port;
      const localUrl = `http://localhost:${port}`;
      const networkUrl = `http://${require('os').networkInterfaces()?.['以太网']?.[0]?.address || require('os').networkInterfaces()?.['WLAN']?.[0]?.address || 'localhost'}:${port}`;
      console.log('\n\x1b[36m%s\x1b[0m', '========================================');
      console.log('\x1b[32m%s\x1b[0m', '  项目启动成功!');
      console.log('\x1b[36m%s\x1b[0m', '========================================');
      console.log('  本地访问:  \x1b[33m%s\x1b[0m', localUrl);
      console.log('  网络访问:  \x1b[33m%s\x1b[0m', networkUrl);
      console.log('\x1b[36m%s\x1b[0m\n', '========================================');
    }
  }
};
