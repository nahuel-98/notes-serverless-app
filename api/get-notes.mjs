/**
 * Route: GET /notes
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import * as utils from './utils.mjs';

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const tableName = process.env.NOTES_TABLE;

export const handler = async (event) => {
  try {
    const params = event.queryStringParameters;
    const limit = params && params.limit ? parseInt(params.limit) : 3;
    const userId = utils.getUserId(event.headers);

    const request = {
      TableName: tableName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      Limit: limit,
      ScanDataForward: false, //This returns the data sorted in descending order of the sort key(timestamps) (In inverse chronological order - from the latest to the newest)
    };

    const startTimestamps = params && params.start ? parseInt(params.start) : 0; //TODO: Para qué es?

    if (startTimestamps > 0) {
      request.ExclusiveStartKey = {
        userId,
        timestamps: startTimestamps,
      };
    }

    const queryCommand = new QueryCommand(request);
    const response = await ddbDocClient.send(queryCommand);

    return {
      statusCode: 200,
      headers: utils.getResponseHeaders(),
      body: JSON.stringify(response.Items),
    };
  } catch (error) {
    console.log('Something went wrong');
    return {
      statusCode: error.statusCode ? error.statusCode : 500,
      headers: utils.getResponseHeaders(),
      body: JSON.stringify({
        error: 'Exception',
        message: 'Unknown error',
      }),
    };
  }
};
