import { DeleteFileById } from './deleteFileById'
import { DeleteFileByIdController } from './deleteFileByIdController'
import { fileRepo } from '../../repos/fileRepo'
import { bucketService } from '../../services/bucketService'

const deleteFileByIdUseCase = new DeleteFileById(fileRepo, bucketService)
export const deleteFileByIdController = new DeleteFileByIdController(deleteFileByIdUseCase)
