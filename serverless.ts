import { AWS } from "@serverless/typescript";

// DynamoDB
import dynamoDbTables from "./resources/user-table";
// SQS
import standardQueues from "./resources/stand-queues";

const serverlessConfiguration: AWS = {
  service: "serverless-todo" as AWS["service"],
  frameworkVersion: "*",

  useDotenv: true,

  // Add the serverless-webpack plugin
  plugins: [
    "serverless-offline",
    "serverless-dynamodb-local",
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
      USERS_TABLE: "${self:custom.user_table}",
      LIST_TABLE: "${self:custom.list_table}",
      TASKS_TABLE: "${self:custom.tasks_table}",
      INVITATION_EMAIL_QUEUE_URL: { Ref: "InvitationEmailQueue" },
    },
    logRetentionInDays: 3,
    logs: {
      httpApi: true,
    },
    httpApi: {
      cors: true,
      authorizers: {
        Cognito: {
          type: "jwt",
          identitySource: "$request.header.Authorization",
          issuerUrl:
            "https://cognito-idp.${aws:region}.amazonaws.com/ap-southeast-2_6G4tWBXZm",
          audience: "4vtmrg014aorq0bnmbisuvb18a",
        },
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: "*",
            Resource: "*",
          },
        ],
      },
    },
  },

  custom: {
    region: "${opt:region, env:REGION}",
    stage: "${opt:stage, env:STAGE}",
    cognito_user_pool_arn: "${env:COGNITO_USER_POOL_ARN}",
    cognito_user_pool_id: "env:COGNITO_USER_POOL_ID",
    cognito_user_pool_name: "${env:COGNITO_USER_POOL_NAME}",
    user_table: "${self:service}-users-table-${opt:stage, env:STAGE}",
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
    bundle: {
      sourcemaps: false,
      excludeFiles: "**/*.test.ts",
      esBuild: true,
    },
  },

  functions: {
    app: {
      handler: "src/server/server.handler",
      events: [
        {
          httpApi: {
            path: "/public/{proxy+}",
            method: "OPTIONS",
          },
        },
        {
          httpApi: {
            path: "/public/{proxy+}",
            method: "GET",
          },
        },
        {
          httpApi: {
            path: "/public/{proxy+}",
            method: "POST",
          },
        },
        {
          httpApi: {
            path: "/private/{proxy+}",
            method: "*",
            authorizer: "Cognito",
          },
        },
      ],
    },
    // hello: {
    //   handler: "src/handler.hello",
    //   architecture: "arm64",
    //   events: [
    //     {
    //       http: {
    //         method: "get",
    //         path: "hello",
    //       },
    //     },
    //   ],
    // },
    create: {
      handler: "src/lambdas/cognitoUserPoolUser/create.handler",
      architecture: "arm64",
      events: [
        {
          http: {
            method: "post",
            path: "create",
          },
        },
      ],
    },
    changePassword: {
      handler: "src/lambdas/cognitoUserPoolUser/changePassword.handler",
      architecture: "arm64",
      events: [
        {
          http: {
            method: "post",
            path: "changePassword",
            cors: true,
          },
        },
      ],
    },
    // checkInvitationExpirationCronJob: {
    //   handler: "src/lambdas/checkInvitationExpirationCronJob.handler",
    //   architecture: "arm64",
    //   events: [
    //     {
    //       schedule: "rate(6 hours)",
    //     },
    //   ],
    // },
    // invitationEmailQueueProcessor: {
    //   handler: "src/lambdas/invitationEmailQueueProcessor.handler",
    //   architecture: "arm64",
    //   events: [
    //     {
    //       sqs: {
    //         arn: "arn:aws:sqs:${aws:region}:${aws:accountId}:invitation-email-queue-${self:custom.stage}",
    //         batchSize: 1,
    //       },
    //     },
    //   ],
    // },
    // deliveryChecker: {
    //   handler: "src/lambdas/sesCheckers/delivery.handler",
    //   architecture: "arm64",
    //   events: [
    //     {
    //       sns: {
    //         arn: "arn:aws:sns:ap-southeast-2:275745566633:delivery_check",
    //       },
    //     },
    //   ],
    // },
    // bounceChecker: {
    //   handler: "src/lambdas/sesCheckers/bounce.handler",
    //   architecture: "arm64",
    //   events: [
    //     {
    //       sns: {
    //         arn: "arn:aws:sns:ap-southeast-2:275745566633:bounce_check",
    //       },
    //     },
    //   ],
    // },
    // complaintChecker: {
    //   handler: "src/lambdas/sesCheckers/complaint.handler",
    //   architecture: "arm64",
    //   events: [
    //     {
    //       sns: {
    //         arn: "arn:aws:sns:ap-southeast-2:275745566633:complaint_check",
    //       },
    //     },
    //   ],
    // },
    customMessage: {
      handler: "src/lambdas/currentMessage.handler",
      architecture: "arm64",
      events: [
        {
          cognitoUserPool: {
            pool: "${self:custom.cognito_user_pool_name}",
            trigger: "CustomMessage",
            existing: true,
          },
        },
      ],
    },
    preAuthentication: {
      handler: "src/lambdas/preAuthentication.handler",
      architecture: "arm64",
      events: [
        {
          cognitoUserPool: {
            pool: "${self:custom.cognito_user_pool_name}",
            trigger: "PreAuthentication",
            existing: true,
          },
        },
      ],
    },
    postAuthentication: {
      handler: "src/lambdas/postAuthentication.handler",
      architecture: "arm64",
      events: [
        {
          cognitoUserPool: {
            pool: "${self:custom.cognito_user_pool_name}",
            trigger: "PostAuthentication",
            existing: true,
          },
        },
      ],
    },
  },

  package: {
    individually: true, // This enabled option will also allow serverless-bundle to use Webpack to generate optimized packages using a tree shaking algorithm.
  },

  resources: {
    Resources: {
      ...dynamoDbTables,
      ...standardQueues,
    },
  },
};

module.exports = serverlessConfiguration;
