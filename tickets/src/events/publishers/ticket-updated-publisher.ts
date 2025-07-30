import { Publisher, Subjects, TicketUpdatedEvent } from '@js-ticketing-ms/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
