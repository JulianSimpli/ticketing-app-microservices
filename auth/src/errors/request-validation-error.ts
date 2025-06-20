import { ValidationError } from 'express-validator'

import { CustomError } from './custom-error'

export class RequestValidationError extends CustomError {
  statusCode = 400
  // equivalent "Parameter Properties" ts concept
  // errors: ValidationError[]
  // constructor(errors: ValidationError[]) { this.errors = errors}
  constructor(private errors: ValidationError[]) {
    super('Request error')

    // only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors() {
    return this.errors.map((err) => {
      if (err.type === 'field') {
        return { message: err.msg, field: err.path }
      }
      return { message: err.msg }
    })
  }
}
