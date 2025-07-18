import { NatsConnection } from 'nats'
import { TicketCreatedEvent } from '../interfaces/ticket-created-event.interface'
import { JetStreamPublisher } from './base-publisher'
import { Streams, Subjects } from './subjects'

export class TicketCreatedPublisher extends JetStreamPublisher<TicketCreatedEvent> {
  protected readonly subject = Subjects.TicketCreated
  protected stream = Streams.Tickets

  constructor(protected client: NatsConnection) {
    super(client)
  }
}
