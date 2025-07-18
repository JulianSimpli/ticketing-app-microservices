import { JsMsg } from 'nats'

import { JetStreamListener } from './base-listener'
import { Streams, Subjects } from './subjects'

import { TicketCreatedEvent } from '../interfaces/ticket-created-event.interface'

export class TicketCreatedListener extends JetStreamListener<TicketCreatedEvent> {
  protected readonly subject = Subjects.TicketCreated
  protected stream = Streams.Tickets
  protected durableName = 'ticket-processors'

  // magic
  protected async onMessage(data: TicketCreatedEvent['data'], msg: JsMsg) {
    console.log(`Received:`, data)
    console.log(`Processing message #${msg.seq}: ${msg.string()}`)
  }
}
