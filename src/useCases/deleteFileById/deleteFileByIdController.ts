import { APIGatewayProxyEvent, Callback } from 'aws-lambda'
import { AppError } from '../../helpers/core/AppError'
import { BaseController } from '../../helpers/infra/baseResolver'
import { DeleteFileById } from './deleteFileById'
import { DeleteFileByIdErrors } from './deleteFileByIdErrors'

export class DeleteFileByIdController extends BaseController {
  private useCase: DeleteFileById

  constructor(useCase: DeleteFileById) {
    super()
    this.useCase = useCase
  }

  async executeImpl(event: APIGatewayProxyEvent, callback: Callback<any>): Promise<any> {
    try {
      const userId = event.requestContext.authorizer?.userId
      const fileId = event.pathParameters?.fileId as string

      const result = await this.useCase.execute({ userId, fileId })

      if (result.isLeft()) {
        const error = result.value
        switch (error.constructor) {
          case DeleteFileByIdErrors.NotFound:
            return this.notFound(callback, error.errorValue().message)
          case AppError.Forbidden:
            return this.forbidden(callback)
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
