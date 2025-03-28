/**
 * Route: GET /note/n/{note_id}
 */

import * as utils from './utils.mjs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const tableName = process.env.NOTES_TABLE;

export const handler = async (event) => {
  try {
    // Para la operación query siempre hay que mandar la primary key completa: tanto el partition key como la sort key.
    const noteId = decodeURIComponent(event.pathParameters.note_id);

    const request = {
      TableName: tableName,
      IndexName: 'noteIdIndex',
      KeyConditionExpression: 'noteId = :noteId',
      ExpressionAttributeValues: {
        ':noteId': noteId,
      },
      Limit: 1,
    };

    const queryCommand = new QueryCommand(request);
    const response = await ddbDocClient.send(queryCommand);

    if (response.Items.length > 0) {
      return {
        statusCode: 200,
        headers: utils.getResponseHeaders(),
        body: JSON.stringify(response.Items[0]),
      };
    } else {
      return {
        statusCode: 404,
        headers: utils.getResponseHeaders(),
        body: JSON.stringify({
          error: 'Not Found',
          message: 'The note does not exist',
        }),
      };
    }
  } catch (error) {
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
