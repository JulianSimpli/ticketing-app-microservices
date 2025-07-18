import { Streams, Subjects } from '../events/subjects'

export interface TicketCreatedEvent {
  stream: Streams.Tickets
  subject: Subjects.TicketCreated
  data: {
    id: string
    title: string
    price: number
  }
}
