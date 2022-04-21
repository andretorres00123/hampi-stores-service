import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { File } from '../../domain/file'
import { FileMapper } from '../../mappers/fileMapper'
import { FileRepo } from '../../repos/fileRepo'

// TODO load table name for Edge Lambda

export class FileRepoImpl implements FileRepo {
  private dbClient: DocumentClient

  constructor(dbClient: DocumentClient) {
    this.dbClient = dbClient
  }

  async saveFile(file: File): Promise<void> {
    const rawFile = FileMapper.mapToPersistence(file)
    await this.dbClient
      .put({
        TableName: process.env.HAMPI_FILES_TABLE || 'hampi-uploads-sandbox',
        Item: rawFile,
      })
      .promise()
  }

  async getFileById(fileId: string): Promise<File | null> {
    const result = await this.dbClient
      .get({
        TableName: process.env.HAMPI_FILES_TABLE || 'hampi-uploads-sandbox',
        Key: {
          PK: fileId,
        },
      })
      .promise()

    if (!result.Item) {
      return null
    }

    return FileMapper.mapToDomain(result.Item as any)
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.dbClient
      .delete({
        TableName: process.env.HAMPI_FILES_TABLE || 'hampi-uploads-sandbox',
        Key: {
          PK: fileId,
        },
      })
      .promise()
  }
}
