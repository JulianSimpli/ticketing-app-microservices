import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@js-ticketing-ms/common/middlewares'

import { Ticket } from '../models/ticket'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'
import { natsClient } from '../nats-wrapper'

const validateCreateTicket = [
  body('title').isString().notEmpty().withMessage('Title must be valid'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
]

const router = Router()

router.post(
  '/api/tickets',
  requireAuth,
  validateCreateTicket,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id })

    await ticket.save()
    await new TicketCreatedPublisher(natsClient.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    })
    res.status(201).send(ticket)
  }
)

export { router as createTicketRouter }
