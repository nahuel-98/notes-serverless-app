/**
 * Route: DELETE /note/t/{timestamps}
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import * as utils from './utils.mjs';

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const tableName = process.env.NOTES_TABLE;

export const handler = async (event) => {
  try {
    const timestamps = parseInt(event.pathParameters.timestamps);
    const userId = utils.getUserId(event.headers);

    //Tenemos que mandar la primary key completa en un DeleteCommand.
    const request = {
      TableName: tableName,
      Key: {
        userId,
        timestamps,
      },
    };
    const deleteCommand = new DeleteCommand(request);
    const response = await ddbDocClient.send(deleteCommand);
    console.log(`DeleteCommand response: ${(response, null, 2)}`);

    return {
      statusCode: 200,
      headers: utils.getResponseHeaders(),
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
