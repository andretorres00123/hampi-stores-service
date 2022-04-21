import { APIGatewayProxyEvent, Callback } from 'aws-lambda'
import { FileMapper } from '../../mappers/fileMapper'
import { BaseController } from '../../helpers/infra/baseResolver'
import { GetSignedUrl } from './getSignedUrl'

export class GetSignedUrlController extends BaseController {
  private useCase: GetSignedUrl

  constructor(useCase: GetSignedUrl) {
    super()
    this.useCase = useCase
  }

  protected async executeImpl(event: APIGatewayProxyEvent, callback: Callback<any>): Promise<any> {
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

      const result = await this.useCase.execute({ ...parsedBody, ownerId: event.requestContext.authorizer?.userId })

      if (result.isLeft()) {
        const error = result.value
        return this.fail(callback, error.errorValue().message)
      }
      const { presignedUrl, file } = result.value.getValue()
      return this.ok(callback, { presignedUrl, fileInfo: FileMapper.mapToDTO(file) })
    } catch (error: any) {
      return this.fail(callback, error)
    }
  }
}
