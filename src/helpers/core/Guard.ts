export type GuardArgumentCollection = IGuardArgument[]

export class Guard {
  public static againstEmptyString(argument: string, argumentName: string): IGuardResult {
    if (argument === '') {
      return {
        succeeded: false,
        message: `${argumentName} is empty`,
      }
    }
    return { succeeded: true }
  }

  public static againstEmptyStringBulk(args: GuardArgumentCollection): IGuardResult {
    for (const arg of args) {
      const result = this.againstEmptyString(arg.argument, arg.argumentName)
      if (!result.succeeded) {
        return result
      }
    }
    return { succeeded: true }
  }

  public static againstNullOrUndefined(argument: unknown, argumentName: string): IGuardResult {
    if (argument === null || argument === undefined) {
      return {
        succeeded: false,
        message: `${argumentName} is null or undefined`,
      }
    }
    return { succeeded: true }
  }

  public static againstNullOrUndefinedBulk(args: GuardArgumentCollection): IGuardResult {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(arg.argument, arg.argumentName)
      if (!result.succeeded) {
        return result
      }
    }

    return { succeeded: true }
  }

  public static isOneOf(value: unknown, validValues: any[], argumentName: string): IGuardResult {
    let isValid = false
    for (const validValue of validValues) {
      if (value === validValue) {
        isValid = true
      }
    }

    if (isValid) {
      return { succeeded: true }
    }
    return {
      succeeded: false,
      message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(validValues)}. Got "${value}".`,
    }
  }
}
