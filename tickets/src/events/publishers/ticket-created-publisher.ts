import { JetStreamPublisher, Streams, Subjects } from '@js-ticketing-ms/common/events'
import { TicketCreatedEvent } from '@js-ticketing-ms/common/events'

export class TicketCreatedPublisher extends JetStreamPublisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
    stream = Streams.Tickets
}