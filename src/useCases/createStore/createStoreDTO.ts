export interface CreateStoreDTO {
  workspace: string
  country: string
  city: string
  ownerId: string
  state: string
  displayName?: string
  profileUrl?: string
  phone?: string
  whatsappUrl?: string
  locationAddress?: string
  locationUrl?: string
  description?: string
  coverUrl?: string
  categories?: string[]
}
