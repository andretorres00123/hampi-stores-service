import { S3 } from 'aws-sdk'
import { GetObjectOutput } from 'aws-sdk/clients/s3'
import { BucketService } from '../bucketService'

export class S3BucketService implements BucketService {
  private s3Client: S3

  constructor(s3Client: S3) {
    this.s3Client = s3Client
  }

  getSignedUrl(filename: string): string {
    return this.s3Client.getSignedUrl('putObject', {
      Bucket: process.env.HAMPI_FILES_BUCKET_NAME || '',
      Key: filename,
      Expires: 60,
    })
  }

  async getObject(fileKey: string, bucketName?: string): Promise<GetObjectOutput | null> {
    try {
      const result = await this.s3Client
        .getObject({
          Bucket: bucketName || '',
          Key: fileKey,
        })
        .promise()
      return result
    } catch (error: any) {
      if (error.name === 'NoSuchKey') {
        return null
      }
      throw error
    }
  }

  async deleteObject(fileKey: string): Promise<void> {
    await this.s3Client
      .deleteObject({
        Bucket: process.env.HAMPI_FILES_BUCKET_NAME || '',
        Key: fileKey,
      })
      .promise()
  }
}
