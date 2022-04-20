import log from 'lambda-log'
import { Context, Callback, Handler } from 'aws-lambda'
import { getFileByIdUseCase } from '../../useCases/getFileById'
import { GetFileByIdErrors } from '../../useCases/getFileById/getFileByIdErrors'

export const handler: Handler = async (event: any, context: Context, callback: Callback): Promise<void> => {
  try {
    log.info('Receiving Lambda edge event', { event, context })
    const request = event.Records[0].cf.request
    const { uri, method } = request

    if (method !== 'GET') {
      return callback(null, request)
    }

    const result = await getFileByIdUseCase.execute({ fileId: uri.substring(1) })

    if (result.isLeft()) {
      const error = result.value
      if (error.constructor === GetFileByIdErrors.NotFound) {
        return callback(null, { status: 404 })
      }
      return callback(null, {
        status: 500,
        headers: {
          'content-type': [{ key: 'Content-Type', value: 'application/json' }],
        },
        body: JSON.stringify({ message: error.errorValue().message }),
      })
    }

    const { contentType, data } = result.value.getValue()

    callback(null, {
      status: 200,
      headers: {
        'content-type': [{ key: 'Content-Type', value: contentType }],
      },
      body: data.toString('base64'),
      bodyEncoding: 'base64',
      statusDescription: 'OK',
    })
  } catch (error) {
    callback(null, {
      status: 500,
      headers: {
        'content-type': [{ key: 'Content-Type', value: 'application/json' }],
      },
      body: JSON.stringify(error),
    })
  }
}
