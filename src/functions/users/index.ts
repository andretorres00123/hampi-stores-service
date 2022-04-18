import log from 'lambda-log'
import { Context, APIGatewayProxyEvent, Callback } from 'aws-lambda'
import { updateProfileController } from '../../useCases/updateProfile'

export const handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback): Promise<any> => {
  log.info('Receiving request', { event, context })
  if (event.httpMethod === 'PUT' && event.resource === '/api/v1/users/updateProfile') {
    return updateProfileController.execute(event, callback)
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Method Not Allowed' }),
  }
}
