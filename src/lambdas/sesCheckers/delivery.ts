import { SNSEvent, SNSHandler, Context, Callback } from "aws-lambda";

export const handler: SNSHandler = (
  event: SNSEvent,
  context: Context,
  callback: Callback
) => {
  console.log("event", JSON.stringify(event, null, 2));
  console.log("context", JSON.stringify(context, null, 2));
  callback(null, event);
};
