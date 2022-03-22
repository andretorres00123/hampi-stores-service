import { APIGatewayProxyEvent, Callback } from 'aws-lambda'
import { BaseController } from '../../helpers/infra/baseResolver'
import { CreateStore } from './createStore'
import { CreateStoreErrors } from './createStoreErrors'

export class CreateStoreController extends BaseController {
  private useCase: CreateStore

  constructor(useCase: CreateStore) {
    super()
    this.useCase = useCase
  }

  async executeImpl(event: APIGatewayProxyEvent, callback: Callback<any>): Promise<any> {
    try {
      let parsedBody: any
      if (event.isBase64Encoded) {
        const buff = Buffer.from(event.body as string, 'base64')
        const decodedBody = buff.toString('ascii')
        parsedBody = JSON.parse(decodedBody)
      } else {
        parsedBody = JSON.parse(event.body as string)
      }

      const result = await this.useCase.execute({ ...parsedBody, ownerId: event.requestContext.authorizer?.userId })

      if (result.isLeft()) {
        const error = result.value
        if (error.constructor === CreateStoreErrors.StoreAlreadyExistsError) {
          return this.redirectResponse(callback, 409, JSON.stringify({ message: error.errorValue().message }))
        }
        if (error.constructor === CreateStoreErrors.InvalidRequest) {
          return this.badRequest(callback, error.errorValue().message)
        }
        return this.fail(callback, error.errorValue().message)
      }

      return this.created(callback)
    } catch (error: any) {
      return this.fail(callback, error)
    }
  }
}
