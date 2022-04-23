import log from 'lambda-log'
import { Context } from 'aws-lambda'
import { deleteFileRecordsUseCase } from '../../useCases/deleteFileRecords'

export const handler = async (event: any, context: Context): Promise<any> => {
  log.info('Receiving request', { event, context })
  await deleteFileRecordsUseCase.execute()
  return {
    isSuccess: true,
    message: 'OK',
  }
}
