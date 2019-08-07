const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const join = require('path').join;

module.exports = {
  name: 'admin',
  entry: ['./index.tsx'],
  devtool: 'source-map',
  output: {
    filename: "bundle.js",
    path: join(__dirname, '../../../public/admin/'),
    publicPath: '/admin',
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/, 
        loader: "ts-loader" 
      }, // '.ts' 혹은 '.tsx' 파일들은 ts-loader를 거친다
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", },
          { 
            loader: 'postcss-loader',
            options: {
                plugins: () => [require('autoprefixer')({
                    'browsers': ['> 10%', 'last 2 versions']
                })],
            }
          },
          { loader: 'sass-loader', },
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "style.css",
      path: join(__dirname, '../../../public/admin/'),
      chunkFilename: "[id].css"
    })
  ],
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:8080',
        pathRewrite: {'^/uploads' : '/admin/uploads/'},
        changeOrigin: true
      },
      '/admin': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx', '.scss', '.css'],
  },
};