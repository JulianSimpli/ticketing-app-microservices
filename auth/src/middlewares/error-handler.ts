import { NextFunction, Request, Response } from 'express'

import { CustomError } from '../errors/custom-error'

export const errorHandler = (
  err: Error, // extra param to distinguish it from other middlewares
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() })
    return
  }

  res.status(400).send({
    message: err.message,
  })
  return
}
