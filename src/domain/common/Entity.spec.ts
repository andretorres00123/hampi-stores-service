import { Entity } from './Entity'
import { UniqueEntityID } from './UniqueEntityID'

interface UserProps {
  firstName: string
  lastName: string
}

class User extends Entity<UserProps> {
  constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  getId(): UniqueEntityID {
    return this._id
  }
}

describe('Entity', () => {
  let instance: User
  let userProps: UserProps
  let uniqueId: UniqueEntityID
  beforeAll(() => {
    userProps = { firstName: 'Teddy', lastName: 'Bear' }
    uniqueId = new UniqueEntityID('unique-id')
    instance = new User(userProps, uniqueId)
  })
  describe('constructor', () => {
    test('should set the expected id', () => {
      expect(instance.getId()).toEqual(uniqueId)
    })
  })
  describe('equals', () => {
    test('should return false if the parameter is null or undefined', () => {
      expect(instance.equals()).toBeFalsy()
      // @ts-expect-error for testing purposes
      expect(instance.equals(null)).toBeFalsy()
    })
    test('should return true if the passed parameter is the same instance', () => {
      expect(instance.equals(instance)).toBeTruthy()
    })
    test('should return false is the passed paramter is not an instance of Entity', () => {
      // @ts-expect-error for testing purposes
      expect(instance.equals({ firstName: 'Bugs', lastName: 'Bunny' })).toBeFalsy()
    })
    test('should return true if the id property is the same', () => {
      const user2 = new User(userProps, uniqueId)
      expect(instance.equals(user2)).toBeTruthy()
    })
  })
})
