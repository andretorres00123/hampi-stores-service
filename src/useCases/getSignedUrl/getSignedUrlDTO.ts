import { File } from '../../domain/file'

export interface GetSignedUrlDTO {
  filename: string
  contentType: string
  ownerId: string
  folder: string
  size?: string
}

export interface GetSignedUrlResponseDTO {
  presignedUrl: string
  file: File
}
