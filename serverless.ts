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
