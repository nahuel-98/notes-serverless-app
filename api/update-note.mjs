/**
 * Route: PATCH /note
 */

import moment from 'moment';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import * as utils from './utils.mjs';

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const tableName = process.env.NOTES_TABLE;

export const handler = async (event) => {
  try {
    const item = JSON.parse(event.body).Item;
    const userId = utils.getUserId(event.headers);
    const username = utils.getUsername(event.headers);
    const expires = moment().add(90, 'days').unix();

    const key = {
      userId,
      timestamps: item.timestamps,
    };

    // UpdateExpression y ExpressionAttributeValues para actualizar los atributos
    const updateExpression = 'SET username = :username, expires = :expires, noteId = :noteId, title = :title, cat = :cat, description = :description';
    const expressionAttributeValues = {
      ':username': username,
      ':expires': expires,
      ':noteId': item.noteId,
      ':note': item.note,
      ':cat': item.cat,
      ':description': item.description,
      ':title': item.title,
    };

    const updateCommand = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'attribute_exists(timestamps)', //Se hará efectivo sólo si timestamps ya existe en el item que se quiere actualizar
      ReturnValues: 'ALL_NEW', //Devuelve el item actualizado
    });

    const response = await ddbDocClient.send(updateCommand);

    return {
      statusCode: 200,
      headers: utils.getResponseHeaders(),
      body: JSON.stringify(response.Attributes),
    };
  } catch (error) {
    console.log(error);
    if (error.statusCode === 404) {
      return {
        statusCode: 404,
        headers: utils.getResponseHeaders(), //Qué indica este header?
        body: JSON.stringify({
          error: 'Not found',
          message: 'Not found',
        }),
      };
    }
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
