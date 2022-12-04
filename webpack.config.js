const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const paths = {
  src: "./src/",
  pages: "./src/pages/",
  js: "./src/js/",
};

const config = {
  mode: "development",
  entry: paths.js + "index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "autoprefixer",
                    {
                      grid: true,
                      overrideBrowserslist: ["last 3 versions"],
                      cascade: true,
                    },
                  ],
                ],
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "image/png",
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: "file-loader",
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin()],
  },
  plugins: [
    // new CopyPlugin({
    //   patterns: [{ from: "src/index.html" }],
    // }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      title: "Custom template",
      template: paths.pages + "index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "page.html",
      title: "Page template",
      template: paths.pages + "page.html",
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[id].css",
    }),
    new CleanWebpackPlugin(),
  ],
  devServer: {
    port: 8080,
    compress: true,
    watchFiles: ["src/**/*"],
    open: {
      target: ["index.html"],
    },
    static: {
      directory: path.join(__dirname, "public"),
    },
  },
};

module.exports = config;
