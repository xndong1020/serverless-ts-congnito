### 1. create ts project template using templates

```
sls create --template aws-nodejs-typescript --path <your_project_name>

yarn install
```

Then we need to change the `serverless.ts`

```ts
import { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "serverless-todo" as AWS["service"],
  frameworkVersion: "*",

  // Add the serverless-webpack plugin
  plugins: ["serverless-webpack"],

  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "ap-southeast-2",
    apiGateway: {
      shouldStartNameWithService: true,
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
  },

  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  functions: {
    hello: {
      handler: "src/handler.hello",
      events: [
        {
          http: {
            method: "get",
            path: "hello",
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
```

Here we replaced the `serverless-esBuild` with `serverless-webpack`. to run the code locally, we need to add `yarn add -D serverless-webpack ts-loader webpack webpack-cli webpack-node-externals remove-files-webpack-plugin`

And add `webpack.config.js`

```js
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
```

To deploy to AWS, use the following script: `serverless deploy --aws-profile <aws profile name>`

Or test locally with the following command: `serverless invoke local --function hello`

#### Improve production build

Next we can replace `serverless-webpack` with `serverless-bundle`, which produces a much smaller production bundle.

```
yarn add -D serverless-offline serverless-dotenv-plugin serverless-bundle @types/uuid

yarn add aws-sdk uuid
```

and we can safely delete the `webpack.config.js`, and then create a `.env` file at the project root
