import { StoreRepoImpl } from '../../repos/implementations/storeRepoImpl'
import { ProductsRepoImpl } from '../../repos/implementations/productsRepoImpl'
import { CreateProduct, CreateProductResponse } from './createProduct'
import { CreateProductDTO } from './createProductDTO'
import { PaymentOptionsEnum } from '../../domain/paymentOption'
import { AppError } from '../../helpers/core/AppError'
import { Store } from '../../domain/store'
import { buildStoreFixture } from '../../fixtures/store.fixture'

jest.mock('../../repos/implementations/productsRepoImpl')
jest.mock('../../repos/implementations/storeRepoImpl')

const mockedProductsRepo = jest.mocked(new ProductsRepoImpl(expect.anything()), true)
const mockedStoresRepo = jest.mocked(new StoreRepoImpl(expect.anything()), true)

describe('CreateProduct', () => {
  let instance: CreateProduct

  beforeAll(() => {
    instance = new CreateProduct(mockedProductsRepo, mockedStoresRepo)
  })

  describe('execute', () => {
    let request: CreateProductDTO
    let result: CreateProductResponse
    let mockedStore: Store

    beforeAll(() => {
      mockedStore = buildStoreFixture()
      request = {
        storeId: '79280902-7b77-414f-bd39-f1c61275e170',
        userId: 'ab585634-5d3d-4ca8-a3b2-3604dc5184e9',
        name: 'Iphone 13',
        description: 'Cool phone',
        dimensions: null,
        discounts: [],
        images: [],
        package: null,
        price: { currency: 'USD', value: 130000 },
        stock: null,
        sku: null,
        attributes: null,
        paymentOptions: [{ value: PaymentOptionsEnum.SUPPLIER_ARRANGEMENT }],
      }
    })

    describe('when an unexpected error occurs', () => {
      beforeAll(async () => {
        mockedStoresRepo.getStoreByIdAndOwner.mockRejectedValueOnce(new Error('test'))
        result = await instance.execute(request)
      })
      test('should returned the expected instance', () => {
        expect(result.value).toBeInstanceOf(AppError.UnexpectedError)
      })
      test('should return a failure result', () => {
        expect(result.isLeft).toBeTruthy()
      })
    })

    describe('when the user is not owner of the store', () => {
      beforeAll(async () => {
        mockedStoresRepo.getStoreByIdAndOwner.mockResolvedValueOnce(null)
        result = await instance.execute(request)
      })
      test('should returned the expected instance', () => {
        expect(result.value).toBeInstanceOf(AppError.Forbidden)
      })
      test('should return a failure result', () => {
        expect(result.isLeft).toBeTruthy()
      })
    })

    describe('when succeeded', () => {
      beforeAll(async () => {
        mockedStoresRepo.getStoreByIdAndOwner.mockResolvedValueOnce(mockedStore)
        result = await instance.execute(request)
      })
      test('should return a successful result', () => {
        expect(result.isRight).toBeTruthy()
      })
    })
  })
})
