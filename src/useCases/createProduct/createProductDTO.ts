interface PackageDTO {
  unit: string
  value: number
}

interface PriceDTO {
  currency: string
  value: number
  discountRate?: number
}

interface AttributeDTO {
  key: string
  text: string
  values: string[]
}

interface PaymentOption {
  value: string
}

export interface CreateProductDTO {
  storeId: string
  userId: string
  name: string
  description: string
  dimensions?: null | string
  discounts: string[]
  images: FileObjectDTO[]
  package?: null | PackageDTO
  price: PriceDTO
  stock?: null | number
  sku?: string | null // store's unique code
  attributes?: null | AttributeDTO[]
  paymentOptions: PaymentOption[]
}
