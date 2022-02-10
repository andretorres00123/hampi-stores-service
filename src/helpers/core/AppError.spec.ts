import { AppError } from './AppError'

describe('AppError', () => {
  describe('UnexpectedError', () => {
    let instance: AppError.UnexpectedError
    beforeAll(() => {
      instance = new AppError.UnexpectedError('Unexpected Error happened')
    })
    test('should return the expected result', () => {
      expect(instance).toEqual(
        expect.objectContaining({
          isSuccess: false,
          isFailure: true,
        }),
      )
    })
    test('should return the expected error value', () => {
      expect(instance.errorValue()).toEqual({
        error: 'Unexpected Error happened',
        message: 'An unexpected error occurred.',
      })
    })
  })
})
