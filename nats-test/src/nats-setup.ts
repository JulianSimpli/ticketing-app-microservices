import { connect } from 'nats'
import { Streams } from './events/subjects'

async function setup() {
  const client = await connect({ servers: 'http://localhost:4222' })
  const jsm = await client.jetstreamManager()

  try {
    const streams = await jsm.streams.list().next()
    for (const stream of streams) {
      await jsm.streams.delete(stream.config.name)
      console.log(`Deleted stream: ${stream.config.name}`)
    }
  } catch (err) {
    console.error('Error deleting streams:', err)
  }

  try {
    await jsm.streams.add({
      name: Streams.Tickets,
      subjects: ['ticket.*'], // <-- acepta ticket.created y ticket.updated
    })
    console.log('Stream "TICKETS" creado para subjects: ticket.*')
  } catch (err) {
    console.error('Error creating stream:', err)
  }

  await client.close()
}

setup()
