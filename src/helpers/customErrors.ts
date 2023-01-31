export class CustomError extends Error {
  statusCode: number
  constructor (message: string, statusCode: number) {
    super(message)
    this.name = Error.name
    this.statusCode = statusCode
    Error.captureStackTrace(this)
  }
}