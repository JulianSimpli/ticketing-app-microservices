import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { User } from '../models/user'
import { validateRequest } from '../middlewares/validate-request'
import { BadRequestError } from '../errors/bad-request-error'
import { PasswordManager } from '../services/password-manager'

const router = express.Router()

const validateSignin = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password must be between 4 and 20 characters'),
]

router.post(
  '/api/users/signin',
  validateSignin,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      throw new BadRequestError(`Invalid credentials`)
    }

    const passwordMatch = PasswordManager.compare(user.password, password)
    if (!passwordMatch) {
      throw new BadRequestError(`Invalid credentials`)
    }

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    )
    req.session = { jwt: userJwt }

    res.status(200).send(user)
  }
)

export { router as signinRouter }
