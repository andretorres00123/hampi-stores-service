import { AppError } from '../../helpers/core/AppError'
import { Result } from '../../helpers/core/Result'
import { Either, left, right } from '../../helpers/core/Either'
import { FileUploadedDTO } from './fileUploadedDTO'
import { FileRepo } from '../../repos/fileRepo'
import { FileUploadedErrors } from './fileUploadedErrors'

export type FileUploadedResponse = Either<FileUploadedErrors.NotFound | AppError.UnexpectedError, Result<void>>

export class FileUploaded implements UseCase<FileUploadedDTO, FileUploadedResponse> {
  private fileRepo: FileRepo

  constructor(fileRepo: FileRepo) {
    this.fileRepo = fileRepo
  }

  async execute(request: FileUploadedDTO): Promise<FileUploadedResponse> {
    try {
      const file = await this.fileRepo.getFileById(request.fileId)
      if (!file) {
        return left(new FileUploadedErrors.NotFound())
      }

      file.hasBeenUploaded()
      await this.fileRepo.saveFile(file)

      return right(Result.ok())
    } catch (error) {
      return left(new AppError.UnexpectedError(error))
    }
  }
}
