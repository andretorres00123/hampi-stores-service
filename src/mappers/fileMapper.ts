import { File } from '../domain/file'

interface FileMapperPersistence {
  PK: string
  id: string
  publicUrl: string
  contentType: string
  ownerId: string
  filename: string
  size: string | null
}

export class FileMapper {
  static mapToPersistence(file: File): FileMapperPersistence {
    return {
      PK: file.id.toString(),
      id: file.id.toString(),
      publicUrl: file.props.publicUrl,
      contentType: file.props.contentType,
      ownerId: file.props.ownerId,
      filename: file.props.filename,
      size: file.props.size || null,
    }
  }
}
