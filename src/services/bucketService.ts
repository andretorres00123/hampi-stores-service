import AWS from 'aws-sdk'
import { GetObjectOutput } from 'aws-sdk/clients/s3'
import { S3BucketService } from './implementations/s3BucketService'

export interface BucketService {
  getSignedUrl(bucketName: string, filename: string): string
  getObject(fileKey: string, bucketName?: string): Promise<GetObjectOutput>
}

const s3Client = new AWS.S3({ region: 'us-east-1', signatureVersion: 'v4' })

export const bucketService = new S3BucketService(s3Client)
