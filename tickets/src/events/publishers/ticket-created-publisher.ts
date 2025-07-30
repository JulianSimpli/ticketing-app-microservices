import { Publisher, Subjects, TicketCreatedEvent } from '@js-ticketing-ms/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
