import { Result } from '../../helpers/core/Result'
import { AppError } from '../../helpers/core/AppError'
import { Either, left, right } from '../../helpers/core/Either'
import { GetFileByIdDTO, GetFileByIdResponseDTO } from './getFileByIdDTO'
import { BucketService } from '../../services/bucketService'
import { GetFileByIdErrors } from './getFileByIdErrors'

export type GetFileByIdResponse = Either<
  GetFileByIdErrors.NotFound | AppError.UnexpectedError,
  Result<GetFileByIdResponseDTO>
>

export class GetFileById implements UseCase<GetFileByIdDTO, GetFileByIdResponse> {
  private bucketService: BucketService

  constructor(bucketService: BucketService) {
    this.bucketService = bucketService
  }

  async execute(request: GetFileByIdDTO): Promise<GetFileByIdResponse> {
    try {
      // TODO get bucketname
      const imageResult = await this.bucketService.getObject(request.fileId, 'hampi-files-bucket-sandbox')

      if (!imageResult || !imageResult.Body) {
        return left(new GetFileByIdErrors.NotFound())
      }

      return right(Result.ok({ data: imageResult.Body as Buffer, contentType: imageResult.ContentType as string }))
    } catch (error) {
      return left(new AppError.UnexpectedError(error))
    }
  }
}
