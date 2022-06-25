import { Guard } from "../helpers/core/Guard";
import { Result } from "../helpers/core/Result";
import { ValueObject } from "./common/ValueObject";

export interface PackageProps {
  unit: string
  value: number
}

export class Package extends ValueObject<PackageProps> {
  static create(props: PackageProps): Result<Package> {
    const requiredFields = [
      { argumentName: 'value', argument: props.value },
      { argumentName: 'unit', argument: props.unit },
    ]

    let guardResult = Guard.againstNullOrUndefinedBulk(requiredFields)
    if (!guardResult.succeeded) {
      return Result.fail<Package>(guardResult.message as string)
    }

    guardResult = Guard.againstEmptyStringBulk(requiredFields)
    if (!guardResult.succeeded) {
      return Result.fail<Package>(guardResult.message as string)
    }

    return Result.ok(new Package(props))
  }
}
