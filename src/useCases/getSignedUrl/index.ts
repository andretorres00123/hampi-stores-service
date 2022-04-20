import { bucketService } from '../../services/bucketService'
import { fileRepo } from '../../repos/fileRepo'
import { GetSignedUrl } from './getSignedUrl'
import { GetSignedUrlController } from './getSignedUrlController'

const getSignedUrlUseCase = new GetSignedUrl(fileRepo, bucketService)
export const getSignedUrlController = new GetSignedUrlController(getSignedUrlUseCase)
