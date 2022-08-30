import { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "serverless-todo" as AWS["service"],
  frameworkVersion: "*",

  // Add the serverless-webpack plugin
  plugins: [
    "serverless-offline",
    "serverless-dotenv-plugin",
    "serverless-bundle",
  ],

  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    region: "ap-southeast-2",
    apiGateway: {
      shouldStartNameWithService: true,
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
  },

  custom: {},
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
