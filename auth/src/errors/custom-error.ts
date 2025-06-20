export abstract class CustomError extends Error {
  // must have
  abstract statusCode: number

  // message is for logging purpose
  constructor(message: string) {
    super(message)

    // only because we are extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  // must have (method signature)
  abstract serializeErrors(): { message: string; field?: string }[]
}
