import { Guard } from '../helpers/core/Guard'
import { Result } from '../helpers/core/Result'
import { Entity } from './common/Entity'
import { UniqueEntityID } from './common/UniqueEntityID'

export interface FileProps {
  publicUrl: string
  contentType: string
  ownerId: string
  filename: string
  size?: string | null
}

export class File extends Entity<FileProps> {
  private constructor(props: FileProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get id(): UniqueEntityID {
    return this._id
  }

  static create(props: FileProps, id?: UniqueEntityID): Result<File> {
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

    return Result.ok(new File(props, id))
  }
}
