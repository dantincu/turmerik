const fs = require("fs");
const path = require("path");

const nodeEnv = process.env.NODE_ENV?.trim();
const prod = (nodeEnv === "production");

/* console.log("nodeEnv", nodeEnv);
console.log("typeof nodeEnv", typeof nodeEnv);
console.log("prod", prod);
console.log("nodeEnv.length", nodeEnv.length);
console.log("production.length", "production".length); */

const envName = prod ? "prod" : "dev";

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: prod ? 'production' : 'development',
  entry: `./src/app-config/${envName}/index.tsx`,
  output: {
    path: __dirname + '/dist/',
    assetModuleFilename: (pathData) => {
      const filepath = path
        .dirname(pathData.filename)
        .split("/")
        .slice(1)
        .join("/");
        
      return `${filepath}/[name][ext]`;
    },
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
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico|fnt)$/,
        type: "asset/resource",
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
      /* https: {
          key: fs.readFileSync("devsslcert/cert.key"),
          cert: fs.readFileSync("devsslcert/cert.crt"),
          ca: fs.readFileSync("devsslcert/ca.crt"),
      },*/
      // ....
  },
};
