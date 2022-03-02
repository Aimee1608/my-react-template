const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin'); // webpack5自带插件
const PurgecssPlugin = require('purgecss-webpack-plugin'); // 需自行安装
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // 需自行安装 需webpack5版本
const glob = require('glob');
const path = require('path');
module.exports = {
  mode: 'production',
  optimization: {
    minimize: true, // 开启代码压缩
    minimizer: [
      new TerserPlugin({
        extractComments: false
      }), // js代码压缩的插件
      new CssMinimizerPlugin() // 插件使用 cssnano 优化和压缩 CSS
    ],
    splitChunks: {
      chunks: 'all', // async initial all
      minSize: 20000,
      maxSize: 20000,
      minChunks: 1,
      cacheGroups: {
        syVendors: {
          test: /[\\/]node_modules[\\/]/,
          filename: 'js/[id]_vendor.js',
          priority: -10
        },
        default: {
          minChunks: 2,
          filename: 'js/chunk_[id].js',
          priority: -20
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    }),
    new PurgecssPlugin({
      // 移除未使用的css代码
      paths: glob.sync(`${path.resolve(__dirname, './../src')}/**/*`, { nodir: true })
    }),
    new BundleAnalyzerPlugin()
  ]
};
