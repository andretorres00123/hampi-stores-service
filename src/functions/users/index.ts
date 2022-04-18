import log from 'lambda-log'
import { Context, APIGatewayProxyEvent, Callback } from 'aws-lambda'
import { updateProfileController } from '../../useCases/updateProfile'
import { getProfileController } from '../../useCases/getProfile'

export const handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback): Promise<any> => {
  log.info('Receiving request', { event, context })
  if (event.httpMethod === 'PUT' && event.resource === '/api/v1/users/updateProfile') {
    return updateProfileController.execute(event, callback)
  }
  if (event.httpMethod === 'GET' && event.resource === '/api/v1/users/profile') {
    return getProfileController.execute(event, callback)
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Method Not Allowed' }),
  }
}
