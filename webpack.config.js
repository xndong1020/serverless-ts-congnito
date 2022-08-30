const path = require("path");
const webpack = require("webpack");
const slsw = require("serverless-webpack");
const RemovePlugin = require("remove-files-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = (async () => {
  const config = {
    mode: slsw.lib.webpack.isLocal ? "development" : "production",
    externals: slsw.lib.webpack.isLocal ? [nodeExternals()] : ["aws-sdk"],
    entry: slsw.lib.entries,
    optimization: {
      minimize: false,
    },
    ignoreWarnings: [
      {
        module: /^(?!CriticalDependenciesWarning$)/, // A RegExp
      },
      (warning) => true,
    ],
    stats: {
      modules: false,
      errorDetails: true,
    },
    output: {
      libraryTarget: "commonjs",
      path: path.join(__dirname, ".webpack"),
      filename: "[name].js",
    },
    target: "node",
    module: {
      rules: [{ test: /\.ts(x)?$/, loader: "ts-loader" }],
    },
    devtool: "source-map",
    resolve: {
      extensions: [".ts", ".js"],
      alias: {
        src: path.resolve(__dirname, "src"),
      },
      symlinks: false,
      cacheWithContext: false,
    },
    plugins: [],
  };
  return config;
})();
