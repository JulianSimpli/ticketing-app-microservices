import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@js-ticketing-ms/common';
import { body } from 'express-validator';
import { OrderStatus } from '@js-ticketing-ms/common';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const validation = [
  body('token').not().isEmpty(),
  body('orderId').not().isEmpty(),
]

const router = express.Router();

router.post('/api/payments', requireAuth, validation, validateRequest, async (req: Request, res: Response) => {
  const { orderId, token } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  if (order.status === OrderStatus.Cancelled) {
    throw new BadRequestError('Cannot pay for an cancelled order');
  }

  const charge = await stripe.charges.create({
    currency: 'usd',
    amount: order.price * 100,
    source: token,
  });

  const payment = Payment.build({
    orderId,
    stripeChargeId: charge.id,
  });
  await payment.save();

  new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: payment.orderId,
    stripeId: payment.stripeChargeId,
  });

  res.status(201).send({ id: payment.id });
});

export { router as newPaymentRouter };