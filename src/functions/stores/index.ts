import log from 'lambda-log'
import { Context, APIGatewayProxyEvent } from 'aws-lambda'

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<any> => {
  log.info('Receiving request', { event, context })
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'OK' }),
  }
}
