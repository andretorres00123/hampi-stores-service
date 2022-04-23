import { Result } from '../../helpers/core/Result'
import { AppError } from '../../helpers/core/AppError'
import { Either, left, right } from '../../helpers/core/Either'
import { FileRepo } from '../../repos/fileRepo'

export type DeleteFileRecordsResponse = Either<AppError.UnexpectedError, Result<void>>

export class DeleteFileRecords implements UseCase<undefined, DeleteFileRecordsResponse> {
  private fileRepo: FileRepo

  constructor(fileRepo: FileRepo) {
    this.fileRepo = fileRepo
  }

  async execute(): Promise<DeleteFileRecordsResponse> {
    try {
      const files = await this.fileRepo.getNotUploadedFiles()

      await Promise.all(
        files.map(async (file) => {
          await this.fileRepo.deleteFile(file.id.toString())
        }),
      )

      return right(Result.ok())
    } catch (error) {
      return left(new AppError.UnexpectedError(error))
    }
  }
}
