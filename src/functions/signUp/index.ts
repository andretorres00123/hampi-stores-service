import log from 'lambda-log'
import { Context, APIGatewayProxyEvent, Callback } from 'aws-lambda'
import { signUpController } from '../../useCases/signUp'

export const handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback): Promise<void> => {
  log.info('Receiving request', { event, context })
  await signUpController.execute(event, callback)
}
