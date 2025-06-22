import express from 'express'
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
    secure: process.env.NODE_ENV !== 'test',
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

export { app }
