import { UniqueEntityID } from '../domain/common/UniqueEntityID'
import { File } from '../domain/file'

interface FilePersistence {
  PK: string
  id: string
  publicUrl: string
  contentType: string
  ownerId: string
  filename: string
  fileKey: string
  folder: string
  size: string | null
  isUploaded: number
  uploadedAt: string | null
}

interface FileDTO {
  id: string
  publicUrl: string
  contentType: string
  ownerId: string
  filename: string
  folder: string
  size: string | null
  uploadedAt: string | null
  isUploaded: boolean
}

export class FileMapper {
  static mapToPersistence(file: File): FilePersistence {
    return {
      PK: file.id.toString(),
      id: file.id.toString(),
      publicUrl: file.props.publicUrl,
      contentType: file.props.contentType,
      ownerId: file.props.ownerId,
      filename: file.props.filename,
      size: file.props.size || null,
      fileKey: file.props.fileKey,
      folder: file.props.folder,
      isUploaded: file.props.isUploaded ? 1 : 0,
      uploadedAt: file.props.uploadedAt?.toISOString() || null,
    }
  }

  static mapToDTO(file: File): FileDTO {
    return {
      id: file.id.toString(),
      publicUrl: file.props.publicUrl,
      contentType: file.props.contentType,
      ownerId: file.props.ownerId,
      filename: file.props.filename,
      size: file.props.size || null,
      folder: file.props.folder,
      uploadedAt: file.props.uploadedAt?.toISOString() || null,
      isUploaded: file.props.isUploaded,
    }
  }

  static mapToDomain(rawFile: FilePersistence): File {
    const result = File.create(
      {
        publicUrl: rawFile.publicUrl,
        contentType: rawFile.contentType,
        ownerId: rawFile.ownerId,
        filename: rawFile.filename,
        size: rawFile.size,
        fileKey: rawFile.fileKey,
        folder: rawFile.folder,
        isUploaded: !!rawFile.isUploaded,
        uploadedAt: rawFile.uploadedAt ? new Date(rawFile.uploadedAt) : undefined,
      },
      new UniqueEntityID(rawFile.PK),
    )

    if (result.isFailure) {
      throw new Error(`Error mapping File: ${result.errorValue()}`)
    }

    return result.getValue()
  }
}
