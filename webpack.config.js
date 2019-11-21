const { CheckerPlugin } = require('awesome-typescript-loader');
var webpack = require('webpack');
var path = require( 'path' );

// Production build?
var IS_PROD = (process.env.NODE_ENV === 'production');

// Setup plugins
var PLUGINS = [ new CheckerPlugin() ];

// Main build config
module.exports = {
  entry: './src/typescript/index.ts',
  mode: IS_PROD ? 'production' : 'development',
  optimization: {
    minimize: IS_PROD
  },
  output: {
    filename: IS_PROD ? './webgl/bundle.min.js' : './webgl/bundle.js'
  },
  resolve: {
    // List of extensions to be tried when looking at imports
    extensions: [
      '.js',
      '.ts',
      '.tsx',
      '.web.js',
      '.webpack.js',
    ],
    // Where to look for modules
    modules: [
      path.resolve( __dirname, 'src' ),
      'node_modules'
    ],
  },
  module: {
    rules: [
      {
        // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
        test: /\.tsx?$/,
        use: [ 'awesome-typescript-loader' ]
      }
    ]
  },
  plugins: PLUGINS
}
