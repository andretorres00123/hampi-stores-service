import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { File } from '../../domain/file'
import { FileMapper } from '../../mappers/fileMapper'
import { FileRepo } from '../../repos/fileRepo'

export class FileRepoImpl implements FileRepo {
  private dbClient: DocumentClient

  constructor(dbClient: DocumentClient) {
    this.dbClient = dbClient
  }

  async saveFile(file: File): Promise<void> {
    const rawFile = FileMapper.mapToPersistence(file)
    await this.dbClient
      .put({
        TableName: process.env.HAMPI_FILES_TABLE || '',
        Item: rawFile,
      })
      .promise()
  }
}
