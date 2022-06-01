export interface CreateStoreDTO {
  workspace: string
  country: string
  city: string
  ownerId: string
  state: string
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
