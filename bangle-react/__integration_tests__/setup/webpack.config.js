const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isProduction = env && env.production;
  const mode = isProduction ? 'production' : 'development';
  if (isProduction && process.env.NODE_ENV !== 'production') {
    throw new Error('NODE_ENV not production');
  }
  console.log(`
  ====================${mode}========================
  `);
  return {
    target: 'web',
    mode,
    entry: path.join(__dirname, 'entry.js'),
    devtool: true ? 'source-map' : 'eval-source-map',
    resolve: {
      // TODO fix me punycode
      fallback: { punycode: require.resolve('punycode/') },
    },
    resolveLoader: {},
    devServer: {
      contentBase: path.join(__dirname, 'build'),
      publicPath: '/',
      disableHostCheck: true,
      port: 4000,
      host: '0.0.0.0',
    },
    output: {
      filename: 'main.[contenthash].js',
      chunkFilename: '[name].bundle.[contenthash].js',
      path: path.resolve(__dirname, 'build'),
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          isProduction ? 'production' : 'development',
        ),
      }),
      new HtmlWebpackPlugin({
        title: 'bangle-react testing',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ['file-loader'],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
            options: { rootMode: 'upward' },
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
  };
};