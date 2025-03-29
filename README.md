<!--
title: 'AWS Simple HTTP Endpoint example in NodeJS'
description: 'This template demonstrates how to make a simple HTTP API with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.'
layout: Doc
framework: v4
platform: AWS
language: nodeJS
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, Inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->

# Serverless Notes Backend

This repo consists of a Serverless Node.js REST API made from scratch using Serverless Framework. This allowed to integrate:

✔ AWS API Gateway as an entry point for each endpoint.

✔ An AWS Lambda function that contains business logic.

✔ AWS DynamoDB as database.

## Usage

### Deployment

In order to deploy the example, you need to run the following command:

```
serverless deploy
```

After successful deployment, you can call the created application via HTTP.

### Local development

Use the `dev` command to develop and test your function:

```
serverless dev
```

Also, the `offline` command will help to create a local test environment.

```
serverless offline
```

This will start a local emulator of AWS Lambda and tunnel your requests to and from AWS Lambda, allowing you to interact with your function as if it were running in the cloud.

Now you can invoke the function as before, but this time the function will be executed locally. Now you can develop your function locally, invoke it, and see the results immediately without having to re-deploy.

When you are done developing, don't forget to run `serverless deploy` to deploy the function to the cloud.
