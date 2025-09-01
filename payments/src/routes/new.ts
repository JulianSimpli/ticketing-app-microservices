import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest, OrderStatus } from '@js-ticketing-ms/common';

import { natsWrapper } from '../nats-wrapper';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { stripe } from '../stripe';

const validation = [
  body('paymentMethodId').not().isEmpty(),
  body('orderId').not().isEmpty(),
]

const router = express.Router();

router.post('/api/payments', requireAuth, validation, validateRequest, async (req: Request, res: Response) => {
  const { orderId, paymentMethodId } = req.body;

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

  try {
    // Crear y confirmar Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
    });

    const payment = Payment.build({
      orderId,
      stripeChargeId: paymentIntent.id,
    });
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeChargeId,
    });

    res.status(201).send({ id: payment.id });

  } catch (error) {
    console.error('Stripe payment error:', error);
    throw new BadRequestError('Payment failed');
  }
});

export { router as newPaymentRouter };