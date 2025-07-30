import { Publisher, OrderCreatedEvent, Subjects } from '@js-ticketing-ms/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
