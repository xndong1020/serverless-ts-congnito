import { APIGatewayProxyEvent, Context } from "aws-lambda";
import * as serverlessHttp from "serverless-http";

import app from "./app";

const server = serverlessHttp(app);

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  console.log("server event", event);
  console.log("server context", context);
  // you can do other things here
  const result = await server(event, context);
  console.log("server result", result);
  return result;
};
