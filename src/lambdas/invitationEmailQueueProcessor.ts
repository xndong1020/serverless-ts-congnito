import { Context, Callback, SQSHandler, SQSEvent } from "aws-lambda";
import { SES } from "aws-sdk";

export const handler: SQSHandler = async (
  event: SQSEvent,
  _: Context,
  callback: Callback
) => {
  const ses = new SES();
  for await (const record of event.Records) {
    const { email, name } = JSON.parse(record.body) as {
      sub: string;
      name: string;
      email: string;
    };

    const params: SES.SendEmailRequest = {
      Destination: {
        ToAddresses: [email],
      },
      Source: "isdance2004@yahoo.com",
      Message: {
        Subject: {
          Data: "InvitationEmail Reminder",
        },
        Body: {
          Html: {
            Data: `
                    <div style="font-size:20px;color:blue;">
                        Hello ${name}. 
                    </div>
                    <div style="font-size:16px;color:red;">
                        Please note: Your temporary password will be expired within 24 hours.
                    </div>
                    <div>
                      Please check the <a href="https://uac.helpjuice.com/marketplace/secrets/9dAvPhMhiU9wIcL5Kdf-FQ" target="_blank">training guide</a>.
                    </div>
          `,
          },
        },
      },
    };

    const res = await ses.sendEmail(params).promise();
    console.log("res", res);
  }
  callback(null, event);
};
