import { APIGatewayProxyEvent, Callback } from 'aws-lambda'
import { BaseController } from '../../helpers/infra/baseResolver'
import { UpdateProfile } from './updateProfile'
import { UpdateProfileErrors } from './updateProfileErrors'

export class UpdateProfileController extends BaseController {
  private useCase: UpdateProfile

  constructor(useCase: UpdateProfile) {
    super()
    this.useCase = useCase
  }

  async executeImpl(event: APIGatewayProxyEvent, callback: Callback<any>): Promise<any> {
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

      const result = await this.useCase.execute({ ...parsedBody, userId: event.requestContext.authorizer?.userId })
      if (result.isLeft()) {
        const error = result.value
        if (error.constructor === UpdateProfileErrors.NotFound) {
          return this.notFound(callback, error.errorValue().message)
        }
        if (error.constructor === UpdateProfileErrors.InvalidProperty) {
          return this.badRequest(callback, error.errorValue().message)
        }
        return this.fail(callback, error.errorValue().message)
      }

      return this.ok(callback)
    } catch (error: any) {
      return this.fail(callback, error)
    }
  }
}
