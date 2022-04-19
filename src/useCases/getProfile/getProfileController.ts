import { UserMapper } from '../../mappers/userMapper'
import { BaseController } from '../../helpers/infra/baseResolver'
import { GetProfile } from './getProfile'
import { GetProfileErrors } from './getProfileErrors'
import { APIGatewayProxyEvent, Callback } from 'aws-lambda'

export class GetProfileController extends BaseController {
  private useCase: GetProfile

  constructor(useCase: GetProfile) {
    super()
    this.useCase = useCase
  }

  async executeImpl(event: APIGatewayProxyEvent, callback: Callback<any>): Promise<any> {
    try {
      const result = await this.useCase.execute({ userId: event.requestContext.authorizer?.userId })

      if (result.isLeft()) {
        const error = result.value
        if (error.constructor === GetProfileErrors.NotFound) {
          return this.notFound(callback, error.errorValue().message)
        }
        return this.fail(callback, error.errorValue().message)
      }

      const user = result.value.getValue()
      return this.ok(callback, UserMapper.mapToDTO(user))
    } catch (error: any) {
      return this.fail(callback, error)
    }
  }
}
