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
      headers: {
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({ message }),
    })
  }

  public notFound(callback: Callback, message?: string): void {
    return callback(null, {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({ message: message || 'Not Found' }),
    })
  }

  public ok<T>(callback: Callback, dto?: T): void {
    return callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: dto ? JSON.stringify(dto) : undefined,
    })
  }

  public created(callback: Callback): void {
    return callback(null, {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
    })
  }

  public redirectResponse(callback: Callback, code: number, data: unknown): void {
    return callback(null, {
      statusCode: code,
      headers: {
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: data,
    })
  }

  public forbidden(callback: Callback, message?: string): void {
    return callback(null, {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({ message: message || 'Forbidden' }),
    })
  }

  public badRequest(callback: Callback, message?: string): void {
    return callback(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({ message: message || 'Invalid request' }),
    })
  }

  public fail(callback: Callback, error: Error | string): void {
    log.error(error)
    return callback(null, {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({ message: typeof error === 'string' ? error : error.message.toString() }),
    })
  }
}
