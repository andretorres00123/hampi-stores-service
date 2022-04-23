import { FileObject } from '../domain/fileObject'

export class FileObjectMapper {
  public static mapToPersistence(fileObject?: FileObject): FileObjectPersistence | null {
    if (!fileObject) return null

    return {
      ...fileObject.props,
      size: fileObject.props.size || null,
    }
  }

  public static mapToDomain(rawData: FileObjectPersistence): FileObject {
    const fileObjectResult = FileObject.create({
      ...rawData,
    })

    if (fileObjectResult.isFailure) {
      throw new Error(`Error mapping file object to Domain: ${fileObjectResult.errorValue()}`)
    }

    return fileObjectResult.getValue()
  }

  public static mapToDTO(fileObject: FileObject): FileObjectDTO {
    return {
      ...fileObject.props,
      size: fileObject.props.size || null,
    }
  }
}
