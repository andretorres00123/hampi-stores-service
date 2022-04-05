import { APIGatewayProxyEvent, Callback } from 'aws-lambda'
import { StoreMapper } from '../../mappers/storeMapper'
import { BaseController } from '../../helpers/infra/baseResolver'
import { GetStoresByOwnerId } from './getStoresByOwnerId'

export class GetStoresByOwnerIdController extends BaseController {
  private useCase: GetStoresByOwnerId

  constructor(useCase: GetStoresByOwnerId) {
    super()
    this.useCase = useCase
  }

  async executeImpl(event: APIGatewayProxyEvent, callback: Callback<any>): Promise<any> {
    try {
      const result = await this.useCase.execute({ ownerId: event.requestContext?.authorizer?.userId })
      if (result.isLeft()) {
        const error = result.value
        return this.fail(callback, error.errorValue().message)
      }

      const stores = result.value.getValue()
      return this.ok(
        callback,
        stores.map((store) => StoreMapper.mapToDTO(store)),
      )
    } catch (error: any) {
      return this.fail(callback, error)
    }
  }
}
