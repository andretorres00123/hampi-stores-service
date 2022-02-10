import log from 'lambda-log'
import { APIGatewayProxyEvent, Callback } from 'aws-lambda'
import { BaseController } from '../../helpers/infra/baseResolver'
import { SignUp } from './signUp'
import { SignUpErrors } from './signUpErrors'

export class SignUpController extends BaseController {
  private useCase: SignUp

  constructor(useCase: SignUp) {
    super()
    this.useCase = useCase
  }

  async executeImpl(event: APIGatewayProxyEvent, callback: Callback): Promise<any> {
    try {
      let parsedBody: any
      try {
        if (event.isBase64Encoded) {
          const buff = Buffer.from(event.body as string, 'base64')
          const decodedBody = buff.toString('ascii')
          parsedBody = JSON.parse(decodedBody)
        } else {
          parsedBody = JSON.parse(event.body as string)
        }
      } catch {
        return this.badRequest(callback, 'Invalid payload')
      }

      const result = await this.useCase.execute(parsedBody)
      if (result.isLeft()) {
        const error = result.value
        if (error.constructor === SignUpErrors.InputError) {
          return  this.badRequest(callback, error.errorValue().message)
        }
        return this.fail(callback, error.errorValue().message)
      }

      return this.ok(callback)
    } catch (error: any) {
      return this.fail(callback, error)
    }
  }
} 
