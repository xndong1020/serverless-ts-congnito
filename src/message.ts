import type {
  Callback,
  Context,
  CustomMessageTriggerEvent,
  CustomMessageTriggerHandler,
} from "aws-lambda";

export const handler: CustomMessageTriggerHandler = async (
  event: CustomMessageTriggerEvent,
  _: Context,
  callback: Callback
) => {
  const {
    triggerSource,
    request: { codeParameter, userAttributes, usernameParameter },
  } = event;
  try {
    switch (triggerSource) {
      case "CustomMessage_AdminCreateUser": {
        event.response = {
          smsMessage: `Welcome ${usernameParameter} to the service. Your code is ${codeParameter}`,
          emailMessage: `
                    <div style="font-size:20px;color:blue;">
                        Welcome ${userAttributes.name} to UAC. 
                    </div>
                    <div style="font-size:18px;color:green;">
                        Your email address is ${usernameParameter} and your temporary password is <strong>${codeParameter}</strong>
                    </div>
                    <div style="font-size:16px;color:red;">
                        Your temporary password will be expired in 72 hours.
                    </div>
          `,
          emailSubject: "Your test temporary password from test server",
        };
      }
    }

    // Return to Amazon Cognito
    callback(null, event);
  } catch (e: any) {
    console.error("Lambda cognitoEmail", e);
    throw e;
  }
};
