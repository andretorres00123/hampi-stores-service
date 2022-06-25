import { Guard } from '../helpers/core/Guard'
import { Result } from '../helpers/core/Result'
import { ValueObject } from './common/ValueObject'

export enum PaymentOptionsEnum {
  SUPPLIER_ARRANGEMENT = 'SUPPLIER_ARRANGEMENT',
}

export interface PaymentOptionProps {
  value: number
}

export class PaymentOption extends ValueObject<PaymentOptionProps> {
  static create(props: PaymentOptionProps): Result<PaymentOption> {
    const requiredFields = [{ argumentName: 'value', argument: props.value }]

    let guardResult = Guard.againstNullOrUndefinedBulk(requiredFields)
    if (!guardResult.succeeded) {
      return Result.fail<PaymentOption>(guardResult.message as string)
    }

    guardResult = Guard.againstEmptyStringBulk(requiredFields)
    if (!guardResult.succeeded) {
      return Result.fail<PaymentOption>(guardResult.message as string)
    }
    // @ts-ignore
    if (props.value !== PaymentOptionsEnum.SUPPLIER_ARRANGEMENT) {
      return Result.fail<PaymentOption>('Invalid payment option')
    }

    return Result.ok(new PaymentOption(props))
  }
}
