import { Request, Response, Router } from 'express'
import { NotAuthorizedError, NotFoundError } from '@js-ticketing-ms/common/errors'
import { Order } from '../models/order'
import { requireAuth } from '@js-ticketing-ms/common/middlewares'

const router = Router()

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    'ticket'
  )
  res.send(orders)
})

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    userId: req.currentUser!.id
  }).populate('ticket')
  if (!order) {
    throw new NotFoundError()
  }
  res.send(order)
})

export { router as getOrdersRouter }
