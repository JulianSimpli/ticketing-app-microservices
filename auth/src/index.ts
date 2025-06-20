import express from 'express'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'

const app = express()
// config for our ingress nginx proxy service
// req.ip will have real client info
app.set('trust proxy', true)
app.use(express.json())
// will create req.session object
app.use(
  cookieSession({
    signed: false,
    secure: true,
    httpOnly: true,
  })
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

// handling not found routes
// Express 4
// app.use((req, res, next) => {
//   next(new NotFoundError())
// })
// Express 5
app.use((req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

// remove wrapper function for "type": "module" config
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    console.log('Connected to MongoDB')

    app.listen(3000, () => {
      console.log('Listening Auth server on port 3000')
    })
  } catch (error) {
    console.error('Failed to start server: ', error)
    process.exit(1)
  }
}

start()
