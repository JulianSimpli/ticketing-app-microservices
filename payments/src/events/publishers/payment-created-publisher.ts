import { Publisher, Subjects, PaymentCreatedEvent } from '@js-ticketing-ms/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}