import { fileRepo } from '../../repos/fileRepo'
import { DeleteFileRecords } from './deleteFileRecords'

export const deleteFileRecordsUseCase = new DeleteFileRecords(fileRepo)
