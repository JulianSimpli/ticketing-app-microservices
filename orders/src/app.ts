import express from 'express'
import cookieSession from 'cookie-session'

import { NotFoundError } from '@js-ticketing-ms/common/errors'
import { currentUser, errorHandler } from '@js-ticketing-ms/common/middlewares'

import { deleteOrderRouter } from './routes/delete'
import { getOrdersRouter } from './routes/show'
import { newOrderRouter } from './routes/new'

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

app.use(getOrdersRouter)
app.use(deleteOrderRouter)
app.use(newOrderRouter)

app.use((req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
