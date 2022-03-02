const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();
const { merge } = require('webpack-merge');
const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');
const isProduction = process.env.NODE_ENV === 'production';

const commonConfig = {
  // ...
  entry: './src/main.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '../dist'),
    // publicPath: `//xxx.com/`,
    chunkFilename: '[name].[contenthash].js'
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  cache: {
    type: 'filesystem',
    cacheDirectory: path.join(__dirname, './../node_modules/.cac/webpack')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 压缩css 文件
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              esModule: false
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'less-loader',
          {
            loader: 'thread-loader',
            options: {
              workerParallelJobs: 2
            }
          },
        ]
      },
      {
        test: /\.(png|svg|gif|jpe?g)$/,
        type: 'asset',
        generator: {
          filename: 'img/[name].[hash:4][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 30 * 1024
          }
        }
      },
      {
        test: /\.(ttf|woff2?)$/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name].[hash:3][ext]'
        }
      },
      {
        test: /\.jsx?$/,
        include: path.resolve('src'),
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 抽离css 插件
      filename: '[name].css'
    }),
    new HtmlWebpackPlugin({
      title: '设置的标题',
      template: './public/index.html'
    }),
    new DefinePlugin({
      BASE_URL: '"./"'
    }),
    // 进度条
    new ProgressBarPlugin()
  ]
};

const baseConfig = isProduction ? prodConfig : devConfig;
const defaultConfig = merge(commonConfig, baseConfig);

module.exports = smp.wrap(defaultConfig);
