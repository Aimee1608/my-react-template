module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    hot: true,
    port: 8080,
    open: false,
    compress: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'https://api.github.com',
        pathRewrite: { '^/api': '' },
        changeOrigin: true
      }
    }
  }
  // ...
};
