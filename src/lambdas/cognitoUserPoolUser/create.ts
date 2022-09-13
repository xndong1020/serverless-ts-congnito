import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  Context,
} from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import passwordGen from "src/utils/passwordGen";

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
  const { email, name, username } = payload;

  const tempPassword = passwordGen();

  console.log("tempPassword", tempPassword);

  try {
    await COGNITO_PROVIDER.adminCreateUser({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: username,
      // MessageAction: "SUPPRESS",
      TemporaryPassword: tempPassword,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "email_verified",
          Value: "true",
        },
        {
          Name: "name",
          Value: name,
        },
      ],
    }).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: `User ${email} has been created successfully. TemporaryPassword is ${tempPassword}`,
        },
        null,
        2
      ),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          error,
          input: payload,
        },
        null,
        2
      ),
    };
  }
};
