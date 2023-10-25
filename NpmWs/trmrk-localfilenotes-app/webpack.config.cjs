const fs = require("fs");

const prod = process.env.NODE_ENV === 'production';
const envName = prod ? "prod" : "dev";

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: prod ? 'production' : 'development',
  entry: `./src/app-config/${envName}/index.tsx`,
  output: {
    path: __dirname + '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.json'],
        },
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      /* {
        test: /\.json$/,
        type: "json"
      } */
    ]
  },
  devtool: prod ? undefined : 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new MiniCssExtractPlugin(),
  ],
  devServer: {
      // ...
      https: {
          key: fs.readFileSync("devsslcert/cert.key"),
          cert: fs.readFileSync("devsslcert/cert.crt"),
          ca: fs.readFileSync("devsslcert/ca.crt"),
      },
      // ....
  },
};
