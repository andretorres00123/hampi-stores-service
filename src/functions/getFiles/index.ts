import log from 'lambda-log'
import { Context, Callback, Handler } from 'aws-lambda'

export const handler: Handler = async (event: any, context: Context, callback: Callback): Promise<void> => {
  log.info('Receiving Lambda edge event', { event, context })
  const request = event.Records[0].cf.request
  return callback(null, request)
}
