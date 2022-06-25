declare interface RawPackage {
  unit: string
  value: number
}

declare interface RawPrice {
  currency: string
  value: number
  discountRate?: number
}

declare interface RawAttribute {
  key: string
  text: string
  values: string[]
}

declare interface RawPaymentOption {
  value: string
}

declare interface RawProduct {
  PK: string
  SK: string
  storeId: string
  name: string
  description: string
  dimensions?: null | string
  discounts: string[]
  images: FileObjectPersistence[]
  package?: null | RawPackage
  price: RawPrice
  stock?: null | number
  sku?: string | null // store's unique code
  attributes?: null | RawAttribute[]
  paymentOptions: RawPaymentOption[]
  createdAt?: string
  updatedAt?: string
}
