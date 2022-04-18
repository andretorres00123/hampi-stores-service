import { Guard } from '../helpers/core/Guard'
import { Result } from '../helpers/core/Result'
import { ValueObject } from './common/ValueObject'

export interface FileProps {
  publicUrl: string
  contentType: string
  ownerId: string
  filename: string
  size?: string
}

export class File extends ValueObject<FileProps> {
  static create(props: FileProps): Result<File> {
    const requiredFields = [
      { argumentName: 'publicUrl', argument: props.publicUrl },
      { argumentName: 'contentType', argument: props.contentType },
      { argumentName: 'ownerId', argument: props.ownerId },
      { argumentName: 'filename', argument: props.filename },
    ]
    let guardResult = Guard.againstNullOrUndefinedBulk(requiredFields)
    if (!guardResult.succeeded) {
      return Result.fail<File>(guardResult.message as string)
    }

    guardResult = Guard.againstEmptyStringBulk(requiredFields)
    if (!guardResult.succeeded) {
      return Result.fail<File>(guardResult.message as string)
    }

    return Result.ok(new File(props))
  }
}
