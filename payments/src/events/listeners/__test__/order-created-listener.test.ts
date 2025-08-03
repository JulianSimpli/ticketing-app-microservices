import { OrderCreatedEvent, OrderStatus } from "@js-ticketing-ms/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
}

it('should listen to order created events and create an order', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order).toBeDefined();
  expect(order!.price).toEqual(data.ticket.price);
  expect(order!.status).toEqual(data.status);
  expect(order!.userId).toEqual(data.userId);
  expect(order!.version).toEqual(data.version);
  expect(msg.ack).toHaveBeenCalled();
});