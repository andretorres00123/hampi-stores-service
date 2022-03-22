import { APIGatewayProxyEvent, Callback } from 'aws-lambda'
import { BaseController } from '../../helpers/infra/baseResolver'
import { EditStore } from './editStore'
import { EditStoreErrors } from './editStoreErrors'

export class EditStoreController extends BaseController {
  private useCase: EditStore

  constructor(useCase: EditStore) {
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

      const result = await this.useCase.execute({
        ownerId: event.requestContext.authorizer?.userId,
        storeId: event.pathParameters?.storeId as string,
        city: parsedBody.city,
        state: parsedBody.state,
        displayName: parsedBody.displayName,
        profileUrl: parsedBody.profileUrl,
        phone: parsedBody.phone,
        whatsappUrl: parsedBody.whatsappUrl,
        locationAddress: parsedBody.locationAddress,
        locationUrl: parsedBody.locationUrl,
        description: parsedBody.description,
        coverUrl: parsedBody.coverUrl,
        categories: parsedBody.categories,
      })

      if (result.isLeft()) {
        const error = result.value
        switch (error.constructor) {
          case EditStoreErrors.NotFound:
            return this.notFound(callback, error.errorValue().message)
          case EditStoreErrors.InvalidRequest:
            return this.badRequest(callback, error.errorValue().message)
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
