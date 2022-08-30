import { AWS } from "@serverless/typescript";

// DynamoDB
import dynamoDbTables from "./resources/dynamodb-tables";

const serverlessConfiguration: AWS = {
  service: "serverless-todo" as AWS["service"],
  frameworkVersion: "*",

  useDotenv: true,

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
      REGION: "${self:custom.region}",
      STAGE: "${self:custom.stage}",
      LIST_TABLE: "${self:custom.list_table}",
      TASKS_TABLE: "${self:custom.tasks_table}",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:DescribeTable",
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Resource: [
              { "Fn::GetAtt": ["ListTable", "Arn"] },
              { "Fn::GetAtt": ["TasksTable", "Arn"] },
            ],
          },
        ],
      },
    },
  },

  custom: {
    region: "${opt:region, env:REGION}",
    stage: "${opt:stage, env:STAGE}",
    list_table: "${self:service}-list-table-${opt:stage, env:STAGE}",
    tasks_table: "${self:service}-tasks-table-${opt:stage, env:STAGE}",
    table_throughputs: {
      prod: 5,
      default: 1,
    },
    table_throughput:
      "${self:custom.TABLE_THROUGHPUTS.${self:custom.stage}, self:custom.table_throughputs.default}",
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8008,
        inMemory: true,
        heapInitial: "200m",
        heapMax: "1g",
        migrate: true,
        seed: true,
        convertEmptyValues: true,
        // Uncomment only if you already have a DynamoDB running locally
        // noStart: true
      },
    },
    ["serverless-offline"]: {
      httpPort: 3000,
      babelOptions: {
        presets: ["env"],
      },
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

  package: {
    individually: true, // This enabled option will also allow serverless-bundle to use Webpack to generate optimized packages using a tree shaking algorithm.
  },

  resources: {
    Resources: dynamoDbTables,
  },
};

module.exports = serverlessConfiguration;
