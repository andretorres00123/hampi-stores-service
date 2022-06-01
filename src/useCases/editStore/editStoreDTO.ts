export interface EditStoreDTO {
  ownerId: string
  storeId: string
  city?: string
  state?: string
  displayName?: string
  profilePicture?: FileObjectDTO
  phone?: string
  whatsappUrl?: string
  locationAddress?: string
  locationUrl?: string
  description?: string
  coverPicture?: FileObjectDTO
  categories?: string[]
}
