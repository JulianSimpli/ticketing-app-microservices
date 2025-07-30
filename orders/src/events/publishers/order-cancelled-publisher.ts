import { Subjects, Publisher, OrderCancelledEvent } from '@js-ticketing-ms/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
