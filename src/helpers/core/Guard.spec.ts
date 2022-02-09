import { Guard, GuardArgumentCollection } from './Guard'

describe('Guard', () => {
  describe('againstEmptyString', () => {
    test('should return the expected success message when the argument passed is not an empty string', () => {
      const expected: IGuardResult = { succeeded: true }
      expect(Guard.againstEmptyString('test', 'name')).toEqual(expected)
    })
    test('should return the expected error message when the passed argument is null an empty string', () => {
      const expected: IGuardResult = {
        succeeded: false,
        message: 'name is empty',
      }
      expect(Guard.againstEmptyString('', 'name')).toEqual(expected)
    })
  })

  describe('againstEmptyStringBulk()', () => {
    test('should return the expected success message when all the arguments passed are not empty string', () => {
      const expected: IGuardResult = { succeeded: true }
      const properties: GuardArgumentCollection = [
        { argument: 'Teddy', argumentName: 'name' },
        { argument: 'Bear', argumentName: 'animal' },
      ]
      expect(Guard.againstEmptyStringBulk(properties)).toEqual(expected)
    })
    test('should return the expected success message when one of the arguments passed is an empty string', () => {
      const expected: IGuardResult = { succeeded: false, message: 'name is empty' }
      const properties: GuardArgumentCollection = [
        { argument: '', argumentName: 'name' },
        { argument: 'Bear', argumentName: 'animal' },
      ]
      expect(Guard.againstEmptyStringBulk(properties)).toEqual(expected)
    })
  })

  describe('againstNullOrUndefined()', () => {
    test('should return the expected success message when the argument passed is not null or undefined', () => {
      const expected: IGuardResult = { succeeded: true }
      expect(Guard.againstNullOrUndefined('test', 'name')).toEqual(expected)
    })

    test('should return the expected error message when the passed argument is null or undefined', () => {
      const expected: IGuardResult = {
        succeeded: false,
        message: 'name is null or undefined',
      }
      expect(Guard.againstNullOrUndefined(null, 'name')).toEqual(expected)
    })
  })

  describe('againstNullOrUndefinedBulk()', () => {
    test('should return the expected success message when all the arguments passed are not null or undefined', () => {
      const expected: IGuardResult = { succeeded: true }
      const properties: GuardArgumentCollection = [
        { argument: 'Teddy', argumentName: 'name' },
        { argument: 'Bear', argumentName: 'animal' },
      ]
      expect(Guard.againstNullOrUndefinedBulk(properties)).toEqual(expected)
    })
  })

  describe('isOneOf', () => {
    let result: IGuardResult
    let validValues: any[]
    let value: any
    let argumentName: string
    describe('when is a invalid value', () => {
      beforeAll(() => {
        validValues = ['any']
        value = 'test'
        argumentName = 'test'
        result = Guard.isOneOf(value, validValues, 'test')
      })
      test('should return the expected result', () => {
        expect(result).toEqual({
          succeeded: false,
          message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(validValues)}. Got "${value}".`,
        })
      })
    })
    describe('when is a valid value', () => {
      beforeAll(() => {
        validValues = ['test']
        value = 'test'
        argumentName = 'test'
        result = Guard.isOneOf(value, validValues, 'test')
      })
      test('should return the expected result', () => {
        expect(result).toEqual({
          succeeded: true,
        })
      })
    })
  })

  test('should return the expected error message when any of the arguments passed is null or undefined', () => {
    const expected: IGuardResult = {
      succeeded: false,
      message: 'name is null or undefined',
    }
    const properties: GuardArgumentCollection = [
      { argument: null, argumentName: 'name' },
      { argument: 'Bear', argumentName: 'animal' },
    ]
    expect(Guard.againstNullOrUndefinedBulk(properties)).toEqual(expected)
  })
})
