/* eslint-disable import/extensions, import/no-absolute-path */
import { SQSHandler } from "aws-lambda";
import { GetObjectCommand, PutObjectCommandInput, GetObjectCommandInput, S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const s3 = new S3Client();
const ddbDocClient = createDDbDocClient();

export const handler: SQSHandler = async (event) => {
  console.log("Event ", event);
  for (const record of event.Records) {
    const recordBody = JSON.parse(record.body);
    console.log("Raw SNS message ", JSON.stringify(recordBody));

    const recordMessage = JSON.parse(recordBody.Message);
    console.log("SNS Message: ", recordMessage);

    if (recordMessage.Records) {
      for (const messageRecord of recordMessage.Records) {
        const s3e = messageRecord.s3;
        const srcBucket = s3e.bucket.name;
        const srcKey = decodeURIComponent(s3e.object.key.replace(/\+/g, " "));

        const eventType = messageRecord.eventName;

        
        if (eventType === "ObjectRemoved:Delete") {
          await deleteImageFromDynamoDB(srcKey);  
          console.log(`Deleted image with key ${srcKey} from DynamoDB.`);
        } else {
          
          const typeMatch = srcKey.match(/\.([^.]*)$/);
          if (!typeMatch) {
            console.log("Could not determine the image type.");
            throw new Error("Could not determine the image type.");
          }
          const imageType = typeMatch[1].toLowerCase();
          if (imageType !== "jpeg" && imageType !== "png") {
            console.log(`Unsupported image type: ${imageType}`);
            throw new Error(`Unsupported image type: ${imageType}`);
          }

          
          const dynamodbUpload = await ddbDocClient.send(
            new PutCommand({
              TableName: "Images",
              Item: {
                "ImageName": srcKey,
              },
            })
          );

          console.log("Response: ", dynamodbUpload);
        }
      }
    }
  }
};


const deleteImageFromDynamoDB = async (id: string) => {
  const params = {
    TableName: "Images",
    Key: {
      ImageName: { S: id },
    },
  };

  try {
    await ddbDocClient.send(new DeleteCommand(params));
  } catch (error) {
    console.error(`Failed to delete image with ID ${id} from DynamoDB:`, error);
  }
};


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
