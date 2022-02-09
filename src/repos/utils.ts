import DynamoDB from 'aws-sdk/clients/dynamodb'

export const isDevelopment = process.env.NODE_ENV === 'development'

const localDynamoDbOptions = {
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
}

export const dynamoDbOptions = isDevelopment ? localDynamoDbOptions : undefined
export const documentClient = new DynamoDB.DocumentClient(dynamoDbOptions)
