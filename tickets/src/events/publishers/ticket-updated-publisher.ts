import { JetStreamPublisher, Streams, Subjects, TicketUpdatedEvent } from '@js-ticketing-ms/common/events'

export class TicketUpdatedPublisher extends JetStreamPublisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated
    stream = Streams.Tickets
}