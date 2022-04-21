import { bucketService } from '../../services/bucketService'
import { GetFileById } from './getFileById'

export const getFileByIdUseCase = new GetFileById(bucketService)
