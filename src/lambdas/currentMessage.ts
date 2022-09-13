import type {
  Callback,
  Context,
  CustomMessageTriggerEvent,
  CustomMessageTriggerHandler,
} from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import * as mustache from "mustache";

import passwordGen from "../utils/passwordGen";
import {
  // adminCreateUserTemplate,
  forgotPasswordTemplate,
  testTemplate,
} from "src/utils/emailTemplates";

export const handler: CustomMessageTriggerHandler = async (
  event: CustomMessageTriggerEvent,
  _: Context,
  callback: Callback
) => {
  const {
    triggerSource,
    userName,
    request: { codeParameter, userAttributes, usernameParameter },
  } = event;

  const COGNITO_PROVIDER = new CognitoIdentityServiceProvider();
  const mustacheInstance = (mustache as any).default;

  try {
    switch (triggerSource) {
      case "CustomMessage_AdminCreateUser": {
        event.response = {
          smsMessage: `Welcome ${usernameParameter} to the service. Your code is ${codeParameter}`,
          emailMessage: mustacheInstance.render(testTemplate, {
            code: codeParameter,
            email: usernameParameter,
            name: userAttributes.name,
          }),
          emailSubject: "Your test temporary password from UAC",
        };
        break;
      }
      case "CustomMessage_ForgotPassword": {
        const tempPassword = passwordGen();
        const params: CognitoIdentityServiceProvider.AdminSetUserPasswordRequest =
          {
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: userName,
            Password: tempPassword,
            Permanent: false,
          };

        await COGNITO_PROVIDER.adminSetUserPassword(params).promise();
        event.response = {
          smsMessage: `Hi ${usernameParameter}. Your code is ${codeParameter}`,
          emailMessage: mustacheInstance.render(forgotPasswordTemplate, {
            name: userAttributes.name,
            password: tempPassword,
            code: codeParameter,
          }),
          emailSubject: "Your new temporary password from UAC",
        };
        break;
      }
    }

    console.log("Return to Amazon Cognito");
    // Return to Amazon Cognito
    callback(null, event);
  } catch (e: any) {
    console.error("Lambda cognitoEmail", e);
    throw e;
  }
};
