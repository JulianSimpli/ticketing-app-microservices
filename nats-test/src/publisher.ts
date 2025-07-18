import { connect } from 'nats'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'

async function publish() {
  let client = null
  try {
    client = await connect({ servers: 'nats://localhost:4222' })
    console.log(`connected to ${client.getServer()}`)

    const publisher = new TicketCreatedPublisher(client)
    await publisher.publish({
      id: '123',
      title: 'title',
      price: 20,
    })

    await client.drain()
  } catch (error) {
    console.error(error)
  } finally {
    if (client) {
      try {
        await client.close()
      } catch (error) {
        console.error('Error closing client:', error)
      }
    }
  }
}

publish()

// KEY DIFFERENCES IN PUBLISHING:
//
// CORE NATS:
// client.publish('subject', data)  // Fire-and-forget, no confirmation
//
// JETSTREAM:
// await js.publish('subject', data)  // Returns server confirmation
// const ack = await js.publish('subject', data)  // You can get the ACK
