import {
  PostAuthenticationTriggerHandler,
  PostAuthenticationTriggerEvent,
  Context,
  Callback,
} from "aws-lambda";

export const handler: PostAuthenticationTriggerHandler = async (
  event: PostAuthenticationTriggerEvent,
  context: Context,
  callback: Callback
) => {
  // Log the event information for debugging purposes.
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Current Context:", JSON.stringify(context, null, 2));
  callback(null, event);
};
