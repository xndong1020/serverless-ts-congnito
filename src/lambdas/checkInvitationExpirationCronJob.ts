import {
  Context,
  Callback,
  EventBridgeEvent,
  EventBridgeHandler,
} from "aws-lambda";
import { CognitoIdentityServiceProvider, SQS } from "aws-sdk";
import { differenceInHours } from "date-fns";
import { UserStatus } from "src/enums/user-status.enum";
import { CognitoUserPoolUser } from "src/interfaces/cognitoUserpoolUser.interface";

const COGNITO_PROVIDER = new CognitoIdentityServiceProvider();

export const handler: EventBridgeHandler<any, any, any> = async (
  event: EventBridgeEvent<any, any>,
  _: Context,
  callback: Callback
) => {
  const sqs = new SQS();

  const usersList = (await COGNITO_PROVIDER.listUsers({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Filter: `cognito:user_status="${UserStatus.FORCE_CHANGE_PASSWORD}" and status="true"`,
  }).promise()) as {
    Users: CognitoUserPoolUser[];
  };

  try {
    let targetUsers: CognitoUserPoolUser[] = [];
    if (usersList.Users.length) {
      targetUsers = usersList.Users.filter((user) => {
        const datesToExpire = differenceInHours(
          new Date(), // today,
          new Date(user.UserCreateDate) // userCreateDate
        );
        return datesToExpire < 24 && datesToExpire > 0;
      });
    }

    const entries = targetUsers.map((user, idx) => ({
      Id: `${user.Username}-${idx}`,
      MessageBody: JSON.stringify(
        user.Attributes.reduce((agg, curr) => {
          agg[curr.Name] = curr.Value;
          return agg;
        }, {})
      ),
    }));

    await sqs
      .sendMessageBatch({
        QueueUrl:
          "https://sqs.ap-southeast-2.amazonaws.com/275745566633/invitation-email-queue-dev",
        Entries: entries,
      })
      .promise();

    callback(null, event);
  } catch (error) {
    console.error(error);
  }
};
