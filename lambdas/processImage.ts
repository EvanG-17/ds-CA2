/* eslint-disable import/extensions, import/no-absolute-path */
import { SQSHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDDbDocClient();

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const recordBody = JSON.parse(record.body);
    const snsMessage = JSON.parse(recordBody.Message);

    if (snsMessage.Records) {
      for (const messageRecord of snsMessage.Records) {
        const s3e = messageRecord.s3;
        const srcKey = decodeURIComponent(s3e.object.key.replace(/\+/g, " "));

        const eventType = messageRecord.eventName;

        // Handle object deletion
        if (eventType.includes("ObjectRemoved")) {
          await deleteImageFromDynamoDB(srcKey);
        } else if (eventType.includes("ObjectCreated")) {
          // Handle object creation (existing functionality)
          const typeMatch = srcKey.match(/\.([^.]*)$/);
          if (!typeMatch) {
            throw new Error("Could not determine the image type.");
          }

          const imageType = typeMatch[1].toLowerCase();
          if (imageType !== "jpeg" && imageType !== "png") {
            throw new Error(`Unsupported image type: ${imageType}`);
          }

          await ddbDocClient.send(
            new PutCommand({
              TableName: "Images",
              Item: {
                ImageName: srcKey,
              },
            })
          );
        }
      }
    }
  }
};

// Function to delete an image from DynamoDB
const deleteImageFromDynamoDB = async (key: string) => {
  const params = {
    TableName: "Images",
    Key: {
      ImageName: key, // Ensure this matches the DynamoDB table's primary key
    },
  };

  try {
    await ddbDocClient.send(new DeleteCommand(params));
  } catch (error) {
    throw error;
  }
};

// Function to create the DynamoDB Document Client
function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  const marshallOptions = {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  };
  const unmarshallOptions = {
    wrapNumbers: false,
  };
  const translateConfig = { marshallOptions, unmarshallOptions };
  return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}
