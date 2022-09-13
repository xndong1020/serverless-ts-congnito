import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  Context,
} from "aws-lambda";

// import { v4 as uuidv4 } from "uuid";
import { SES } from "aws-sdk";

// import UsersModel from "./models/user.model";

// import { CognitoIdentityServiceProvider, SQS } from "aws-sdk";

// import { differenceInHours } from "date-fns";

// import { UserStatus } from "./enums/user-status.enum";
// import { CognitoUserPoolUser } from "./interfaces/cognitoUserpoolUser.interface";

// const COGNITO_PROVIDER = new CognitoIdentityServiceProvider();

export const hello: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context
) => {
  try {
    // const sqs = new SQS();
    // const usersList = (await COGNITO_PROVIDER.listUsers({
    //   UserPoolId: process.env.COGNITO_USER_POOL_ID,
    //   Filter: `cognito:user_status="${UserStatus.FORCE_CHANGE_PASSWORD}" and status="true"`,
    // }).promise()) as {
    //   Users: CognitoUserPoolUser[];
    // };
    // //
    // console.log("usersList", usersList.Users);
    // console.log("usersList type", typeof usersList.Users);
    // try {
    //   let targetUsers: CognitoUserPoolUser[] = [];
    //   if (usersList.Users.length) {
    //     targetUsers = usersList.Users.filter((user) => {
    //       const datesToExpire = differenceInHours(
    //         new Date(), // today,
    //         new Date(user.UserCreateDate) // userCreateDate
    //       );
    //       console.log("datesToExpire", datesToExpire);
    //       return datesToExpire < 24 && datesToExpire > 0;
    //     });
    //   }
    //   console.log("targetUsers", JSON.stringify(targetUsers, null, 2));
    //   const entries = targetUsers.map((user, idx) => ({
    //     Id: `${user.Username}-${idx}`,
    //     MessageBody: JSON.stringify(
    //       user.Attributes.reduce((agg, curr) => {
    //         agg[curr.Name] = curr.Value;
    //         return agg;
    //       }, {})
    //     ),
    //   }));
    //   console.log("entries", entries);
    //   const res = await sqs
    //     .sendMessageBatch({
    //       QueueUrl:
    //         "https://sqs.ap-southeast-2.amazonaws.com/275745566633/invitation-email-queue-dev",
    //       Entries: entries,
    //     })
    //     .promise();
    //   console.log("res", res);

    //   let scanResult = await UsersModel.scan().exec();
    //   console.log("scanResult", scanResult);
    //   const fakePK = uuidv4();

    //   for (let i = 0; i < 10; i++) {
    //     await UsersModel.create({
    //       PK: fakePK,
    //       SK: String(i),
    //       GSI1PK: "test GSI1PK",
    //       GSI1SK: "test GSI1SK",
    //       name: "Jeremy",
    //       email: "test@test.com",
    //       username: "jg",
    //       defaultProvider: "test defaultProvider",
    //       role: "Admin",
    //     });
    //   }

    //   const updateResult = await UsersModel.update(
    //     { PK: fakePK, SK: "1" },
    //     {
    //       role: "ProviderEditor",
    //     }
    //   );

    //   console.log("updateResult", updateResult);

    //   scanResult = await UsersModel.scan({
    //     name: { eq: "Jeremy" },
    //     role: { eq: "ProviderEditor" },
    //   }).exec();
    //   console.log("scanResult", scanResult);

    //   const getResult = await UsersModel.get({ PK: fakePK, SK: "2" });
    //   console.log("getResult", getResult);

    //   const queryResult = await UsersModel.query({
    //     PK: fakePK,
    //     SK: { lt: "5" },
    //   }).exec();
    //   console.log("queryResult", queryResult);
    // } catch (error) {
    //   console.error(error);
    // }

    const ses = new SES();

    const test = await ses.getSendStatistics().promise();
    console.log("aaaaaa", test);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message:
            "Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!",
          input: event,
        },
        null,
        2
      ),
    };
  } catch (error) {
    console.error("aaaa error", error);
  }
};
