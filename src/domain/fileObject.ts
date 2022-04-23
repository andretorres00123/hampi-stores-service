import { Guard } from '../helpers/core/Guard'
import { Result } from '../helpers/core/Result'
import { ValueObject } from './common/ValueObject'

export interface FileObjectProps {
  id: string
  publicUrl: string
  contentType: string
  ownerId: string
  filename: string
  folder: string
  size?: string | null
}

export class FileObject extends ValueObject<FileObjectProps> {
  static create(props: FileObjectProps): Result<FileObject> {
    const requiredFields = [
      { argumentName: 'publicUrl', argument: props.publicUrl },
      { argumentName: 'contentType', argument: props.contentType },
      { argumentName: 'ownerId', argument: props.ownerId },
      { argumentName: 'filename', argument: props.filename },
      { argumentName: 'folder', argument: props.folder },
    ]
    let guardResult = Guard.againstNullOrUndefinedBulk(requiredFields)
    if (!guardResult.succeeded) {
      return Result.fail<FileObject>(guardResult.message as string)
    }

    guardResult = Guard.againstEmptyStringBulk(requiredFields)
    if (!guardResult.succeeded) {
      return Result.fail<FileObject>(guardResult.message as string)
    }

    return Result.ok(new FileObject(props))
  }
}
