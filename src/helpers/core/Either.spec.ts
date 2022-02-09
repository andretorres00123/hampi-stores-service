import { left, Left, Either, right, Right } from './Either'
import { Result } from './Result'
import { AppError } from './AppError'

class Test {}

describe('Left', () => {
  let testMock: Test
  let leftInstance: Either<Result<Test>, AppError.UnexpectedError>
  beforeEach(() => {
    testMock = new Test()
    leftInstance = left(Result.ok<Test>(testMock))
  })
  test('should return a Left instance', () => {
    expect(leftInstance instanceof Left).toBeTruthy()
  })
  describe('isLeft', () => {
    test('should return true', () => {
      expect(leftInstance.isLeft()).toBeTruthy()
    })
  })
  describe('isRight', () => {
    test('should return false', () => {
      expect(leftInstance.isRight()).toBeFalsy()
    })
  })
})

describe('Right', () => {
  let rightInstance: Either<Result<Test>, AppError.UnexpectedError>
  beforeEach(() => {
    rightInstance = right(new AppError.UnexpectedError('Not test found'))
  })
  test('should return a Left instance', () => {
    expect(rightInstance instanceof Right).toBeTruthy()
  })
  describe('isRight', () => {
    test('should return true', () => {
      expect(rightInstance.isRight()).toBeTruthy()
    })
  })
  describe('isLeft', () => {
    test('should return true', () => {
      expect(rightInstance.isLeft()).toBeFalsy()
    })
  })
})
