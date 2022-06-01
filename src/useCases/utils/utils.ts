import { FileObject } from "../../domain/fileObject"

export const getFileObject = (profilePicture?: FileObjectDTO): FileObject | undefined => {
  if (!profilePicture) {
    return undefined
  }
  const result = FileObject.create(profilePicture)
  if (result.isFailure) {
    throw new Error(`Invalid file: ${result.errorValue()}`)
  }
  return result.getValue()
}
