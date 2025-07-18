import { connect } from 'nats'

async function listStreams() {
  const client = await connect({ servers: 'http://localhost:4222' })
  const jsm = await client.jetstreamManager()

  try {
    const streams = await jsm.streams.list().next()
    if (streams.length === 0) {
      console.log('No streams found.')
    } else {
      for (const stream of streams) {
        console.log(`Stream: ${stream.config.name}`)
        console.log(
          `  Subjects: ${stream.config.subjects?.join(', ') || 'None'}`
        )
      }
    }
  } catch (err) {
    console.error('Error listing streams:', err)
  }

  await client.close()
}

listStreams()
