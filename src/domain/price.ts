import { Guard } from '../helpers/core/Guard'
import { Result } from '../helpers/core/Result'
import { ValueObject } from './common/ValueObject'

export interface PriceProps {
  currency: string
  value: number
  discountRate?: number
}

export class Price extends ValueObject<PriceProps> {
  static create(props: PriceProps): Result<Price> {
    const requiredFields = [
      { argumentName: 'currency', argument: props.currency },
      { argumentName: 'value', argument: props.value },
    ]

    let guardResult = Guard.againstNullOrUndefinedBulk(requiredFields)
    if (!guardResult.succeeded) {
      return Result.fail<Price>(guardResult.message as string)
    }

    guardResult = Guard.againstEmptyStringBulk(requiredFields)
    if (!guardResult.succeeded) {
      return Result.fail<Price>(guardResult.message as string)
    }

    return Result.ok(new Price(props))
  }
}
