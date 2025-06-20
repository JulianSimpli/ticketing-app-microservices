import { NextFunction, Request, Response } from 'express'

import { NotAuthorizedError } from '../errors/not-authorized-error'

// assumption: never use without previously running currentUser middleware
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError()
  }
  next()
}
