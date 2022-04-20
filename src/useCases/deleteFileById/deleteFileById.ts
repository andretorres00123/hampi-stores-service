import { AppError } from '../../helpers/core/AppError'
import { Result } from '../../helpers/core/Result'
import { Either, left, right } from '../../helpers/core/Either'
import { DeleteFileByIdDTO } from './deleteFileByIdDTO'
import { FileRepo } from '../../repos/fileRepo'
import { DeleteFileByIdErrors } from './deleteFileByIdErrors'
import { BucketService } from '../../services/bucketService'

export type DeleteFileByIdResponse = Either<
  DeleteFileByIdErrors.NotFound | AppError.Forbidden | AppError.UnexpectedError,
  Result<void>
>

export class DeleteFileById implements UseCase<DeleteFileByIdDTO, DeleteFileByIdResponse> {
  private fileRepo: FileRepo
  private bucketService: BucketService

  constructor(fileRepo: FileRepo, bucketService: BucketService) {
    this.fileRepo = fileRepo
    this.bucketService = bucketService
  }

  async execute(request: DeleteFileByIdDTO): Promise<DeleteFileByIdResponse> {
    try {
      const file = await this.fileRepo.getFileById(request.fileId)
      if (!file) {
        return left(new DeleteFileByIdErrors.NotFound())
      }

      if (file.props.ownerId !== request.userId) {
        return left(new AppError.Forbidden())
      }

      await this.bucketService.deleteObject(file.props.fileKey)
      await this.fileRepo.deleteFile(file.id.toString())

      return right(Result.ok())
    } catch (error) {
      return left(new AppError.UnexpectedError(error))
    }
  }
}
