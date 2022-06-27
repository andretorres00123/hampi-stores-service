import log from 'lambda-log'
import { Context, APIGatewayProxyEvent, Callback } from 'aws-lambda'
import { createProductController } from '../../useCases/createProduct'

export const handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback): Promise<any> => {
  log.info('Receiving request', { event, context })
  if (event.httpMethod === 'POST' && event.resource === '/api/v1/products') {
    return await createProductController.execute(event, callback)
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Method Not Allowed' }),
  }
}
