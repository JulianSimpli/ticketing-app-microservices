import { Request, Response, Router } from 'express'
import { body } from 'express-validator'

import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@js-ticketing-ms/common'

import { Ticket } from '../models/ticket'

const validateUpdateTicket = [
  body('title').notEmpty().withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be provided and must be greater than 0'),
]

const router = Router()

router.put(
  '/api/tickets/:id',
  requireAuth,
  validateUpdateTicket,
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    })

    await ticket.save()

    res.status(200).send(ticket)
  }
)

export { router as updateTicketRouter }
