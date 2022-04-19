import { S3 } from 'aws-sdk'
import { BucketService } from '../bucketService'

export class S3BucketService implements BucketService {
  private s3Client: S3

  constructor(s3Client: S3) {
    this.s3Client = s3Client
  }

  getSignedUrl(bucketName: string, filename: string, contentType: string): string {
    return this.s3Client.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: filename,
      Expires: 60,
      ACL: 'public-read',
      ContentType: contentType,
    })
  }
}
