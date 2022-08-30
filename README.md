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

#### 3. setup DynamoDB

Firstly we can read `STAGE` and `REGION` from `.dev`

`.env`

```
STAGE="dev"
REGION="ap-southeast-2"
```

Then enable `serverless-dotenv-plugin` from `serverless.ts`

```ts
...
useDotenv: true,
...
```

Also add a few custom variables. For example the `region` will firstly try to read value from command line, then from `process.env.REGION`, which was loaded by `serverless-dotenv-plugin`

```ts
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
```

and environment variables for provider

```ts
environment: {
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    REGION: "${self:custom.region}",
    STAGE: "${self:custom.stage}",
    LIST_TABLE: "${self:custom.list_table}",
    TASKS_TABLE: "${self:custom.tasks_table}",
},
```

Also a section in provider section for iam roles

```ts
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
```

and a separate file for `Dynamodb` resources

`resources/dynamodb-tables.ts`

```ts
export default {
  ListTable: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "${self:provider.environment.LIST_TABLE}",
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: "${self:custom.table_throughput}",
        WriteCapacityUnits: "${self:custom.table_throughput}",
      },
    },
  },
  TasksTable: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "${self:provider.environment.TASKS_TABLE}",
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "listId", AttributeType: "S" },
      ],
      KeySchema: [
        { AttributeName: "id", KeyType: "HASH" },
        { AttributeName: "listId", KeyType: "RANGE" },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: "${self:custom.table_throughput}",
        WriteCapacityUnits: "${self:custom.table_throughput}",
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: "list_index",
          KeySchema: [{ AttributeName: "listId", KeyType: "HASH" }],
          Projection: {
            // attributes to project into the index
            ProjectionType: "ALL",
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: "${self:custom.table_throughput}",
            WriteCapacityUnits: "${self:custom.table_throughput}",
          },
        },
      ],
    },
  },
};
```

Then load it from `serverless.ts`

```ts
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
```
