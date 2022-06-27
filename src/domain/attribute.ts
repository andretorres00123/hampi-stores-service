import { Guard } from '../helpers/core/Guard'
import { Result } from '../helpers/core/Result'
import { ValueObject } from './common/ValueObject'

export interface AttributeProps {
  key: string
  text: string
  values: string[]
}

export class Attribute extends ValueObject<AttributeProps> {
  static create(props: AttributeProps): Result<Attribute> {
    const requiredFields = [
      { argumentName: 'values', argument: props.values },
      { argumentName: 'key', argument: props.key },
      { argumentName: 'text', argument: props.text },
    ]

    let guardResult = Guard.againstNullOrUndefinedBulk(requiredFields)
    if (!guardResult.succeeded) {
      return Result.fail<Attribute>(guardResult.message as string)
    }

    guardResult = Guard.againstEmptyStringBulk(requiredFields)
    if (!guardResult.succeeded) {
      return Result.fail<Attribute>(guardResult.message as string)
    }

    return Result.ok(new Attribute(props))
  }
}
