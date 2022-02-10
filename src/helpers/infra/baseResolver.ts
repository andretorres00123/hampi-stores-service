import { Callback, APIGatewayProxyEvent } from 'aws-lambda'
import log from 'lambda-log'

export abstract class BaseController {
  protected abstract executeImpl(event: APIGatewayProxyEvent, callback: Callback): Promise<void | any>

  public async execute(event: APIGatewayProxyEvent, callback: Callback): Promise<void> {
    try {
      await this.executeImpl(event, callback)
    } catch (error) {
      log.error('[BaseController]: Uncaught controller error', { error })
      this.fail(callback, 'An unexpected error occurred')
    }
  }

  public static jsonResponse(callback: Callback, code: number, message: string): void {
    return callback(null, {
      statusCode: code,
      body: JSON.stringify({ message }),
    })
  }

  public ok<T>(callback: Callback, dto?: T): void {
    return callback(null, {
      statusCode: 200,
      body: dto ? JSON.stringify(dto) : undefined,
    })
  }

  public redirectResponse(callback: Callback, code: number, data: unknown): void {
    return callback(null, {
      statusCode: code,
      body: data,
    })
  }

  public cloudfrontForbiddenResponse(callback: Callback, message?: string): void {
    return callback(null, {
      status: '403',
      statusDescription: 'Forbidden',
      headers: {
        'content-type': [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
        'content-encoding': [
          {
            key: 'Content-Encoding',
            value: 'UTF-8',
          },
        ],
      },
      body: message || 'Forbidden',
    })
  }

  public forbidden(callback: Callback, message?: string): void {
    return callback(null, {
      statusCode: 403,
      body: JSON.stringify({ message: message || 'Forbidden' }),
    })
  }

  public badRequest(callback: Callback, message?: string): void {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({ message: message || 'Invalid request' }),
    })
  }

  public fail(callback: Callback, error: Error | string): void {
    log.error(error)
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({ message: typeof error === 'string' ? error : error.message.toString() }),
    })
  }
}
