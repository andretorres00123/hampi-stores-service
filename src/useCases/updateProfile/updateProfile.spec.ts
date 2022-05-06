import { FileRepoImpl } from '../../repos/implementations/fileRepoImpl'
import { User } from '../../domain/user'
import { AppError } from '../../helpers/core/AppError'
import { UserRepoImpl } from '../../repos/implementations/userRepoImpl'
import { UpdateProfile, UpdateProfileResponse } from './updateProfile'
import { UpdateProfileDTO } from './updateProfileDTO'
import { UpdateProfileErrors } from './updateProfileErrors'
import { S3BucketService } from '../../services/implementations/s3BucketService'
jest.mock('../../repos/implementations/userRepoImpl')
jest.mock('../../repos/implementations/fileRepoImpl')
jest.mock('../../services/implementations/s3BucketService')

const mockedUserRepo = jest.mocked(new UserRepoImpl(expect.anything()), true)
const mockedFileRepo = jest.mocked(new FileRepoImpl(expect.anything()), true)
const mockedBucketService = jest.mocked(new S3BucketService(expect.anything()), true)

describe('UpdateProfile', () => {
  let instance: UpdateProfile
  let request: UpdateProfileDTO
  let mockedUser: User
  beforeAll(() => {
    request = {
      userId: 'unique-id',
      phone: '+19883456767',
      preferredLanguage: 'EN',
      displayName: 'Andre Torres',
      profilePicture: {
        id: 'file-id',
        contentType: 'image/png',
        filename: 'cat.png',
        folder: 'profiles',
        ownerId: 'unique-id',
        publicUrl: 'https://google.com/images/cat.png',
        size: null,
      },
    }
    mockedUser = User.create({ email: 'test@test.com' }).getValue()
    instance = new UpdateProfile(mockedUserRepo, mockedFileRepo, mockedBucketService)
  })
  describe('execute', () => {
    let result: UpdateProfileResponse
    describe('when an unexpected error happened', () => {
      beforeAll(async () => {
        mockedUserRepo.getUserById.mockRejectedValueOnce(new Error('Connection issues'))
        result = await instance.execute(request)
      })
      test('should return a failure result', () => {
        expect(result.isLeft()).toEqual(true)
      })
      test('should returned value be the expected instance', () => {
        expect(result.value).toBeInstanceOf(AppError.UnexpectedError)
      })
    })
    describe('when the user is not found', () => {
      beforeAll(async () => {
        mockedUserRepo.getUserById.mockResolvedValueOnce(null)
        result = await instance.execute(request)
      })
      test('should return a failure result', () => {
        expect(result.isLeft()).toEqual(true)
      })
      test('should returned value be the expected instance', () => {
        expect(result.value).toBeInstanceOf(UpdateProfileErrors.NotFound)
      })
    })
    describe('when a property is invalid', () => {
      beforeAll(async () => {
        mockedUserRepo.getUserById.mockResolvedValueOnce(mockedUser)
        // @ts-ignore
        result = await instance.execute({ ...request, preferredLanguage: 'sd' })
      })
      test('should return a failure result', () => {
        expect(result.isLeft()).toEqual(true)
      })
      test('should returned value be the expected instance', () => {
        expect(result.value).toBeInstanceOf(UpdateProfileErrors.InvalidProperty)
      })
    })
    describe('when the update is successful', () => {
      beforeAll(async () => {
        mockedUserRepo.getUserById.mockResolvedValueOnce(mockedUser)
        mockedUserRepo.updateUser.mockResolvedValueOnce()
        result = await instance.execute(request)
        console.log(result)
      })
      test('should return a successful result', () => {
        expect(result.isRight()).toEqual(true)
      })
    })
  })
})
