import { APIGatewayProxyEvent, Callback } from 'aws-lambda'
import { AppError } from '../../helpers/core/AppError'
import { BaseController } from '../../helpers/infra/baseResolver'
import { CreateProduct } from './createProduct'
import { CreateProductErrors } from './createProductErrors'

export class CreateProductController extends BaseController {
  constructor(private useCase: CreateProduct) {
    super()
    this.useCase = useCase
  }

  protected async executeImpl(event: APIGatewayProxyEvent, callback: Callback<any>): Promise<any> {
    try {
      const userId = event.requestContext.authorizer?.userId
      let parsedBody: any
      if (event.isBase64Encoded) {
        const buff = Buffer.from(event.body as string, 'base64')
        const decodedBody = buff.toString('ascii')
        parsedBody = JSON.parse(decodedBody)
      } else {
        parsedBody = JSON.parse(event.body as string)
      }

      const result = await this.useCase.execute({ ...parsedBody, userId })
      if (result.isLeft()) {
        const error = result.value
        switch (error.constructor) {
          case CreateProductErrors.BadInputError:
            return this.badRequest(callback, error.errorValue().message)
          case AppError.Forbidden:
            return this.forbidden(callback, error.errorValue().message)
          default:
            return this.fail(callback, error.errorValue().message)
        }
      }

      return this.ok(callback)
    } catch (error: any) {
      return this.fail(callback, error)
    }
  }
}
