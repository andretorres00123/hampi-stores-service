import { ValueObject } from './ValueObject'

interface AvatarProps {
  url: string
}

class Avatar extends ValueObject<AvatarProps> {
  constructor(props: AvatarProps) {
    super(props)
  }
}

describe('ValueObject', () => {
  let instance: Avatar
  let avatar1Props: AvatarProps
  beforeAll(() => {
    avatar1Props = { url: 'https://pets.com/cat1.png' }
    instance = new Avatar(avatar1Props)
  })
  describe('constructor', () => {
    test('should have set the expected props', () => {
      expect(instance.props.url).toEqual('https://pets.com/cat1.png')
    })
  })
  describe('equals', () => {
    test('should return false when the passed parameter is null or undefined', () => {
      // @ts-expect-error for testing purposes
      expect(instance.equals(null)).toBeFalsy()
      expect(instance.equals()).toBeFalsy()
    })
    test('should return false if the parameter does not has props', () => {
      // @ts-expect-error for testing purposes
      const avatar2 = new Avatar()
      expect(instance.equals(avatar2)).toBeFalsy()
    })
    test('should return true if the value object passed has the same props values', () => {
      const avatar2 = new Avatar(avatar1Props)
      expect(instance.equals(avatar2)).toBeTruthy()
    })
    test('should return false if the value object passed has different props values', () => {
      const avatar2 = new Avatar({ url: 'https://pets.com/dog1.png' })
      expect(instance.equals(avatar2)).toBeFalsy()
    })
  })
})
