var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/components/index'
  ],
  externals: {
    react: 'React'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'react-form-entry.js',
    publicPath: '/static/',
    libraryTarget: 'var',
    library: 'ReactFormEntry'
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb/)
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }, {
      test: /\.less$/,
      loader: "style-loader!css-loader!less-loader"
    }, {
      test: /\.gif$/,
      loader: "url-loader?mimetype=image/png"
    }, {
      test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/,
      loader: "url-loader?mimetype=application/font-woff"
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/,
      loader: "file-loader?name=[name].[ext]"
    }, ]
  }
};
