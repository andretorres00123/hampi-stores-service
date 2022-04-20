import { File } from '../domain/file'
import { FileRepoImpl } from './implementations/fileRepoImpl'
import { documentClient } from './utils'

export interface FileRepo {
  saveFile(file: File): Promise<void>
  getFileById(fileId: string): Promise<File | null>
}

export const fileRepo = new FileRepoImpl(documentClient)
