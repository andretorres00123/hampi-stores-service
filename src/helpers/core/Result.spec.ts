import { Result } from './Result'

describe('Result', () => {
  let instance: Result<string>
  describe('Static methods', () => {
    test('should have an ok static method', () => {
      expect(typeof Result.ok).toEqual('function')
    })
    test('should have a fail static method', () => {
      expect(typeof Result.fail).toEqual('function')
    })
    test('should have an combine static method', () => {
      expect(typeof Result.combine).toEqual('function')
    })
  })
  describe('Success constructor', () => {
    beforeEach(() => {
      instance = new Result(true, '', 'test')
    })
    test('should set isSuccess', () => {
      expect(instance.isSuccess).toEqual(true)
    })
    test('should set isSuccess', () => {
      expect(instance.isFailure).toEqual(false)
    })
    test('should set value', () => {
      expect(instance.getValue()).toEqual('test')
    })
    test('should set falsy error', () => {
      expect(instance.errorValue()).toEqual('')
    })
    test('should freeze instance state', () => {
      const alterState = () => {
        instance.isFailure = true
      }
      expect(alterState).toThrow(new RegExp('Cannot assign to read only property'))
    })
  })
  describe('Error constructor', () => {
    beforeEach(() => {
      instance = new Result(false, 'testError', 'test')
    })
    test('should set isSuccess', () => {
      expect(instance.isSuccess).toEqual(false)
    })
    test('should set isFailure', () => {
      expect(instance.isFailure).toEqual(true)
    })
    test('should throw error on returning value', () => {
      expect(() => instance.getValue()).toThrow("Can't get the value of an error result. Use 'errorValue' instead.")
    })
    test('should set error', () => {
      expect(instance.errorValue()).toEqual('testError')
    })
    test('should freeze instance state', () => {
      const alterState = () => {
        instance.isFailure = true
      }
      expect(alterState).toThrow(new RegExp('Cannot assign to read only property'))
    })
  })
  describe('Both Error and Success constructor', () => {
    test('should throw an error', () => {
      const createInstance = () => new Result(true, 'testError')
      expect(createInstance).toThrow(new RegExp('InvalidOperation: A result cannot be successful and contain an error'))
    })
  })
  describe('Neither Error nor Success constructor', () => {
    test('should throw an error', () => {
      const createInstance = () => new Result(false, '')
      expect(createInstance).toThrow(new RegExp('InvalidOperation: A failing result needs to contain an error message'))
    })
  })

  describe('ok', () => {
    type TestType = {
      someAttr: string
      version: number
    }
    let result: Result<TestType>
    beforeEach(() => {
      result = Result.ok<TestType>({
        someAttr: 'testValue',
        version: 23,
      })
    })
    test('should return a Result instance with the appropiate value', () => {
      expect(result.getValue()).toEqual({
        someAttr: 'testValue',
        version: 23,
      })
    })
    test('should return a success Result instance', () => {
      expect(result.isSuccess).toEqual(true)
    })
    test('should not return a failure Result instance', () => {
      expect(result.isFailure).toEqual(false)
    })
  })

  describe('fail', () => {
    type TestType = {
      someAttr: string
      version: number
    }
    const errorString = 'test failure'
    let result: Result<TestType>
    beforeEach(() => {
      result = Result.fail<TestType>(errorString)
    })
    test('should return a Result instance with the appropiate error', () => {
      expect(result.errorValue()).toEqual(errorString)
    })
    test('should not return a success Result instance', () => {
      expect(result.isSuccess).toEqual(false)
    })
    test('should return a failure Result instance', () => {
      expect(result.isFailure).toEqual(true)
    })
  })

  describe('combine', () => {
    let results: Result<string>[]
    beforeEach(() => {
      results = []
    })

    test('should merge all results into a successful result', () => {
      expect(Result.combine(results) instanceof Result).toEqual(true)
    })

    describe('when all results are successful', () => {
      beforeEach(() => {
        results = [Result.ok<string>('first'), Result.ok<string>('second'), Result.ok<string>('third')]
      })

      test('merged result should be successful', () => {
        expect(Result.combine(results).isSuccess).toEqual(true)
      })
    })

    describe('when at least one results is not successful', () => {
      beforeEach(() => {
        results = [Result.ok<string>('first'), Result.fail<string>('error'), Result.ok<string>('third')]
      })

      test('merged result should be successful', () => {
        expect(Result.combine(results).isFailure).toEqual(true)
      })
    })
  })
})
