import { S3 } from 'aws-sdk'
import { GetObjectOutput } from 'aws-sdk/clients/s3'
import { BucketService } from '../bucketService'

export class S3BucketService implements BucketService {
  private s3Client: S3

  constructor(s3Client: S3) {
    this.s3Client = s3Client
  }

  getSignedUrl(bucketName: string, filename: string): string {
    return this.s3Client.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: filename,
      Expires: 60,
    })
  }

  getObject(fileKey: string, bucketName?: string): Promise<GetObjectOutput> {
    return this.s3Client
      .getObject({
        Bucket: bucketName || '',
        Key: fileKey,
      })
      .promise()
  }
}
