import { v4 as uuid } from 'uuid'
import { Result } from '../../helpers/core/Result'
import { AppError } from '../../helpers/core/AppError'
import { Either, left, right } from '../../helpers/core/Either'
import { GetSignedUrlDTO, GetSignedUrlResponseDTO } from './getSignedUrlDTO'
import { FileRepo } from '../../repos/fileRepo'
import { BucketService } from '../../services/bucketService'
import { File } from '../../domain/file'
import { UniqueEntityID } from '../../domain/common/UniqueEntityID'

export type GetSignedUrlResponse = Either<AppError.UnexpectedError, Result<GetSignedUrlResponseDTO>>

export class GetSignedUrl implements UseCase<GetSignedUrlDTO, GetSignedUrlResponse> {
  private fileRepo: FileRepo
  private bucketService: BucketService

  constructor(fileRepo: FileRepo, bucketService: BucketService) {
    this.fileRepo = fileRepo
    this.bucketService = bucketService
  }

  async execute(request: GetSignedUrlDTO): Promise<GetSignedUrlResponse> {
    try {
      const [_, extension] = request.filename.split('.')
      const uploadId = uuid()
      const { HAMPI_FILES_BUCKET_NAME, HAMPI_FILES_BUCKET_HOST: host } = process.env

      const signedUrl = this.bucketService.getSignedUrl(
        HAMPI_FILES_BUCKET_NAME as string,
        `${request.folder}/${uploadId}.${extension}`,
      )

      const { pathname, search } = new URL(signedUrl)

      const fileResult = File.create(
        {
          filename: request.filename,
          contentType: request.contentType,
          ownerId: request.ownerId,
          size: request.size,
          publicUrl: `https://${host}/${request.folder}/${uploadId}.${extension}`,
        },
        new UniqueEntityID(uploadId),
      )

      if (fileResult.isFailure) {
        return left(new AppError.UnexpectedError(fileResult.errorValue()))
      }

      const file = fileResult.getValue()

      await this.fileRepo.saveFile(file)

      return right(
        Result.ok({
          presignedUrl: `https://${host}${pathname}${search}`,
          file,
        }),
      )
    } catch (error) {
      return left(new AppError.UnexpectedError(error))
    }
  }
}
