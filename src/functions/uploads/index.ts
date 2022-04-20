import log from 'lambda-log'
import { Context, APIGatewayProxyEvent, Callback } from 'aws-lambda'
import { getSignedUrlController } from '../../useCases/getSignedUrl'

export const handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback): Promise<any> => {
  log.info('Receiving request', { event, context })

  if (event.httpMethod === 'POST' && event.resource === '/api/v1/uploads/getSignedUrl') {
    return getSignedUrlController.execute(event, callback)
  }
  if (event.httpMethod === 'DELETE' && event.resource === '/api/v1/uploads/{fileId}') {
    // TODO implement
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Method Not Allowed' }),
  }
}
