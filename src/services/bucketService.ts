export interface BucketService {
  getSignedUrl(bucketName: string, filename: string, contentType: string): string
}
