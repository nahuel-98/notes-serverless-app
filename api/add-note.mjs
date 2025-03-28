/**
 * Route: POST /note
 */

import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import * as utils from './utils.mjs';

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const tableName = process.env.NOTES_TABLE;

export const handler = async (event) => {
  try {
    const item = JSON.parse(event.body).Item;
    item.userId = utils.getUserId(event.headers);
    item.username = utils.getUsername(event.headers);
    item.timestamps = moment().unix();
    item.noteId = `${item.userId}:${uuidv4()}`;
    item.expires = moment().add(90, 'days').unix(); //Will be used to clean olds notes

    const putCommand = new PutCommand({
      TableName: tableName,
      Item: item,
    });

    const response = await ddbDocClient.send(putCommand);

    return {
      statusCode: 200,
      headers: utils.getResponseHeaders(),
      body: JSON.stringify(item),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode ? error.statusCode : 500,
      headers: utils.getResponseHeaders(), //Qué indica este header?
      body: JSON.stringify({
        error: 'Exception',
        message: 'Unknown error',
      }),
    };
  }
};
