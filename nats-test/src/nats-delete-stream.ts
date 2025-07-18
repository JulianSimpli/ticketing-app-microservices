import { connect } from 'nats'

import { Streams } from './events/subjects'

async function deleteStream() {
  const client = await connect({ servers: 'http://localhost:4222' })
  const jsm = await client.jetstreamManager()

  try {
    await jsm.streams.delete(Streams.Tickets)
    console.log('Stream "TICKETS" deleted')
  } catch (err) {
    console.log('Stream "TICKETS" does not exist or could not be deleted')
  }

  await client.close()
}

deleteStream()
