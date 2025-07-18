import express from 'express'
import cookieSession from 'cookie-session'

import { NotFoundError } from '@js-ticketing-ms/common/errors'
import { currentUser, errorHandler } from '@js-ticketing-ms/common/middlewares'

import { createTicketRouter } from './routes/new'
import { getTicketsRouter } from './routes/show'
import { updateTicketRouter } from './routes/update'

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

app.use(currentUser)

app.use(createTicketRouter)
app.use(getTicketsRouter)
app.use(updateTicketRouter)

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
