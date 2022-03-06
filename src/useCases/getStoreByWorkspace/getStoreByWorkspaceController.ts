import { APIGatewayProxyEvent, Callback } from 'aws-lambda'
import { StoreMapper } from '../../mappers/storeMapper'
import { BaseController } from '../../helpers/infra/baseResolver'
import { GetStoreByWorkspace } from './getStoreByWorkspace'
import { GetStoreByWorkspaceErrors } from './getStoreByWorkspaceErrors'

export class GetStoreByWorkspaceController extends BaseController {
  private useCase: GetStoreByWorkspace

  constructor(useCase: GetStoreByWorkspace) {
    super()
    this.useCase = useCase
  }

  async executeImpl(event: APIGatewayProxyEvent, callback: Callback<any>): Promise<any> {
    try {
      const result = await this.useCase.execute({ workspace: event.pathParameters?.workspace as string })

      if (result.isLeft()) {
        const error = result.value
        if (error.constructor === GetStoreByWorkspaceErrors.StoreNotFoundError) {
          return this.notFound(callback, error.errorValue().message)
        }
        return this.fail(callback, error.errorValue().message)
      }

      const store = result.value.getValue()
      return this.ok(callback, StoreMapper.mapToDTO(store))
    } catch (error: any) {
      return this.fail(callback, error)
    }
  }
}
