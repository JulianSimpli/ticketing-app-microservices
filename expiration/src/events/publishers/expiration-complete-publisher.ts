import { ExpirationCompleteEvent, Publisher, Subjects } from '@js-ticketing-ms/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}