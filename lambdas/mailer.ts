import { SQSHandler } from "aws-lambda";
import { SES_EMAIL_FROM, SES_EMAIL_TO, SES_REGION } from "../env";
import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from "@aws-sdk/client-ses";

if (!SES_EMAIL_TO || !SES_EMAIL_FROM || !SES_REGION) {
  throw new Error(
    "Please add the SES_EMAIL_TO, SES_EMAIL_FROM and SES_REGION environment variables in an env.js file located in the root directory"
  );
}

type ContactDetails = {
  name: string;
  email: string;
  message: string;
};

const client = new SESClient({ region: SES_REGION });

export const handler: SQSHandler = async (event: any) => {
  console.log("SES_EMAIL_FROM:", SES_EMAIL_FROM);
  console.log("SES_EMAIL_TO:", SES_EMAIL_TO);
  console.log("SES_REGION:", SES_REGION);
  console.log("Event:", JSON.stringify(event));

  for (const record of event.Records) {
    const recordBody = JSON.parse(record.body);
    const snsMessage = JSON.parse(recordBody.Message);

    if (snsMessage.Records) {
      console.log("Record body:", JSON.stringify(snsMessage));

      for (const messageRecord of snsMessage.Records) {
        const s3e = messageRecord.s3;
        const srcBucket = s3e.bucket.name;
        const srcKey = decodeURIComponent(s3e.object.key.replace(/\+/g, " "));

        try {
          const name = "The Photo Album";
          const message = `We received your Image. Its URL is s3://${srcBucket}/${srcKey}`;
          const params = sendEmailParams({ name, email: SES_EMAIL_FROM, message });

          console.log("SES Email Params:", JSON.stringify(params, null, 2));

          await client.send(new SendEmailCommand(params));
        } catch (error) {
          console.log("ERROR:", error);
        }
      }
    }
  }
};

function sendEmailParams({ name, email, message }: ContactDetails): SendEmailCommandInput {
  return {
    Destination: {
      ToAddresses: [SES_EMAIL_TO],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: getHtmlContent({ name, email, message }),
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `New Image Upload`,
      },
    },
    Source: SES_EMAIL_FROM,
  };
}

function getHtmlContent({ name, email, message }: ContactDetails): string {
  return `
    <html>
      <body>
        <h2>Sent from:</h2>
        <ul>
          <li style="font-size:18px">👤 <b>${name}</b></li>
          <li style="font-size:18px">✉️ <b>${email}</b></li>
        </ul>
        <p style="font-size:18px">${message}</p>
      </body>
    </html> 
  `;
}
