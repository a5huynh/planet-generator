var path = require( 'path' );

// Production build?
var IS_PROD = (process.env.NODE_ENV === 'production');

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
    ]
  },
  module: {
    rules: [
      {
        // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  }
}
