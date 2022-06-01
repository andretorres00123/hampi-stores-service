declare interface FileObjectDTO {
  id: string
  publicUrl: string
  contentType: string
  ownerId: string
  filename: string
  folder: string
  size?: string | null
}

declare interface FileObjectPersistence {
  id: string
  publicUrl: string
  contentType: string
  ownerId: string
  filename: string
  folder: string
  size: string | null
}
