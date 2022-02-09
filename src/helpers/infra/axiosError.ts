interface Response {
  status: number
  data: any
}

export class AxiosError extends Error {
  public readonly response: Response

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.response = { status, data }
  }
}
