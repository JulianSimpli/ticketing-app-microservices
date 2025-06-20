import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
  id: string
  email: string
}

// make a modification to an existing type definition
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload | null
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    req.currentUser = null
    return next()
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload
    req.currentUser = payload
  } catch (err) {}

  next()
}
