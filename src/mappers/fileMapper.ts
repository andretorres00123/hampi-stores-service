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
}

interface FileDTO {
  id: string
  publicUrl: string
  contentType: string
  ownerId: string
  filename: string
  folder: string
  size: string | null
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
      },
      new UniqueEntityID(rawFile.PK),
    )

    if (result.isFailure) {
      throw new Error(`Error mapping File: ${result.errorValue()}`)
    }

    return result.getValue()
  }
}
