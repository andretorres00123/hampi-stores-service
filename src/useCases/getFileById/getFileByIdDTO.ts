export interface GetFileByIdDTO {
  fileId: string
}

export interface GetFileByIdResponseDTO {
  contentType: string
  data: Buffer
}
