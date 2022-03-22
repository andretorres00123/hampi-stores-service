import log from 'lambda-log'
import { Context, APIGatewayProxyEvent, Callback } from 'aws-lambda'
import { createStoreController } from '../../useCases/createStore'
import { getStoreByWorkspaceController } from '../../useCases/getStoreByWorkspace'
import { editStoreController } from '.../../useCases/editStore'

export const handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback): Promise<any> => {
  log.info('Receiving request', { event, context })
  if (event.httpMethod === 'POST' && event.resource === '/api/v1/stores') {
    return await createStoreController.execute(event, callback)
  }
  if (event.httpMethod === 'GET' && event.resource === '/api/v1/stores/{workspace}') {
    return await getStoreByWorkspaceController.execute(event, callback)
  }
  if (event.httpMethod === 'PUT' && event.resource === '/api/v1/stores/{storeId}') {
    return await editStoreController.execute(event, callback)
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Method Not Allowed' }),
  }
}
