import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  Context,
} from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";

const COGNITO_PROVIDER = new CognitoIdentityServiceProvider();

export interface IUser {
  email: string;
  name: string;
  username: string;
}

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context
) => {
  const payload = JSON.parse(event.body) as IUser;
  console.log("event", payload);
  const { email, name, username } = payload;

  const resFormUserCreation = await COGNITO_PROVIDER.adminCreateUser({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: username,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "name",
        Value: name,
      },
    ],
  }).promise();

  console.log("resFormUserCreation", resFormUserCreation);

  const listOfUsers = await COGNITO_PROVIDER.listUsers({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
  }).promise();

  console.log("listOfUsers", listOfUsers);

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
};
