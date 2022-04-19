import { File } from '../domain/file'

export interface FileRepo {
  saveFile(file: File): Promise<void>
}
