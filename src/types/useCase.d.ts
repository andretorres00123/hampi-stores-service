declare interface UseCase<IRequest, IResponse> {
  execute(request?: IRequest): Promise<IResponse> | IResponse
}
