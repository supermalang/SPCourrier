const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'umd',
    library: 'ibsn',
    umdNamedDefine: true
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      include: /\.min\.js$/,
    })
  ],
  module: {
    loaders: [{
      test: /\.ts$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      query: { declaration: false, }
    }],
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      }
    ],
  },
};