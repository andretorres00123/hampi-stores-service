import { buildProductFixture } from '../fixtures/product.fixture'
import { ProductMapper } from './productMapper'

describe('ProductMapper', () => {
  describe('mapToPersistence', () => {
    const mockedProduct = buildProductFixture()

    test('shoould return the expected result', () => {
      const result = ProductMapper.mapToPersistence(mockedProduct)

      expect(result).toEqual({
        PK: `STORE#${mockedProduct.props.storeId}`,
        SK: `PRODUCT#${mockedProduct.id.toString()}`,
        storeId: mockedProduct.props.storeId,
        name: mockedProduct.props.name,
        description: mockedProduct.props.description,
        dimensions: mockedProduct.props.dimensions,
        discounts: mockedProduct.props.discounts,
        images: [],
        package: mockedProduct.props.package?.props,
        price: mockedProduct.props.price.props,
        stock: Number.isInteger(mockedProduct.props.stock) ? mockedProduct.props.stock : null,
        sku: mockedProduct.props.sku || null,
        attributes: mockedProduct.props.attributes ? mockedProduct.props.attributes.map((attri) => attri.props) : null,
        paymentOptions: mockedProduct.props.paymentOptions.map((payment) => payment.props),
        createdAt: mockedProduct.props.createdAt?.toISOString(),
        updatedAt: mockedProduct.props.updatedAt?.toISOString(),
      })
    })
  })
})
