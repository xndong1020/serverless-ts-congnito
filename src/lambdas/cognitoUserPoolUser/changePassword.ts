import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  Context,
} from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";

const COGNITO_PROVIDER = new CognitoIdentityServiceProvider();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context
) => {
  const payload = JSON.parse(event.body);
  try {
    const { user, newPassword } = payload;

    const params: CognitoIdentityServiceProvider.AdminSetUserPasswordRequest = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: user,
      Password: newPassword,
      Permanent: true,
    };

    await COGNITO_PROVIDER.adminSetUserPassword(params).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify(
        {
          message: "User password has been changed successfully.",
        },
        null,
        2
      ),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
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
