import { Identifier } from './Identifier'
import { UniqueEntityID } from './UniqueEntityID'

describe('UniqueEntityID', () => {
  let instance: UniqueEntityID
  beforeAll(() => {
    instance = new UniqueEntityID('unique-id')
  })
  describe('constructor', () => {
    test('should the instance be the expected', () => {
      expect(instance instanceof Identifier).toBeTruthy()
    })
    describe('when no default value is passed', () => {
      test('should contain the expected value', () => {
        const v4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
        instance = new UniqueEntityID()
        expect(instance.toValue()).toMatch(v4)
      })
    })
  })
})
