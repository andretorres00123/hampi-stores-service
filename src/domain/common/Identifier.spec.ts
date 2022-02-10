import { Identifier } from './Identifier'

describe('Identifier', () => {
  let instance: Identifier<string>
  beforeAll(() => {
    instance = new Identifier<string>('unique-id')
  })
  describe('toValue', () => {
    test('should return the expected value', () => {
      expect(instance.toValue()).toEqual('unique-id')
    })
  })
  describe('equals', () => {
    test('should return false if no parameter is passed', () => {
      expect(instance.equals()).toBeFalsy()
    })
    test('should return false if the object is not instance of Identifier', () => {
      // @ts-expect-error for testing purposes
      expect(instance.equals(9)).toBeFalsy()
    })
    test('should return false if the raw values are not equal', () => {
      const test = new Identifier<string>('other-unique-id')
      expect(instance.equals(test)).toBeFalsy()
    })
    test('should return true if the raw values are equals', () => {
      const test = new Identifier<string>('unique-id')
      expect(instance.equals(test)).toBeTruthy()
    })
  })
  describe('toString', () => {
    test('should return the expected value', () => {
      expect(instance.toString()).toEqual('unique-id')
    })
  })
})
