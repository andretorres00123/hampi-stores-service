import { fileRepo } from '../../repos/fileRepo'
import { FileUploaded } from './fileUploaded'

export const fileUploadedUseCase = new FileUploaded(fileRepo)
