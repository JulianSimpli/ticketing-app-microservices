import { Request, Response, Router } from 'express'
import { body } from 'express-validator'

import { requireAuth, validateRequest } from '@js-ticketing-ms/common/middlewares'

import { BadRequestError, NotFoundError } from '@js-ticketing-ms/common/errors'
import { Ticket } from '../models/ticket'
import { Order, OrderStatus } from '../models/order'

const EXPIRATION_WINDOW_SECONDS = 15 * 60

const validateCreateOrder = [
  body('ticketId')
    .notEmpty()
    .isMongoId() // if we are sure that the ticket id is always a mongo id
    .withMessage('TicketId must be provided'),
]

const router = Router()

router.post(
  '/api/orders',
  requireAuth,
  validateCreateOrder,
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    // find the ticket that the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    // check if the ticket is already reserved
    const isReserved = await ticket.isReserved()
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved')
    }

    // calculate an expiration date for this order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    })
    await order.save()

    // publish an event saying that an order was created

    res.status(201).send(order)
  }
)

export { router as newOrderRouter }
