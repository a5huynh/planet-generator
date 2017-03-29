const { CheckerPlugin } = require('awesome-typescript-loader');

var path = require( 'path' );

module.exports = {
  entry: './src/typescript/index.ts',
  output: {
    filename: './dist/webgl/bundle.js'
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
  plugins: [
    new CheckerPlugin(),
  ]
}