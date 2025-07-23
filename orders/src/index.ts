import mongoose from 'mongoose'

import { app } from './app'
import { closeNatsClient, getNatsClient } from './nats-wrapper'
import { retryAsync } from './utils/retry-async'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined')
  }

  // Retry logic for NATS
  try {
    await retryAsync(
      getNatsClient,
      10,
      5000,
      (err, attempt) => console.log(`NATS not available, retrying in 5s... Attempt ${attempt}`)
    )
  } catch (err) {
    console.error('Could not connect to NATS after several attempts, exiting.')
    process.exit(1)
  }

  try {
    await mongoose.connect(process.env.MONGO_URI.toString())
    console.log('Connected to MongoDB')

    app.listen(3000, () => {
      console.log('Listening Tickets server on port 3000')
    })
  } catch (error) {
    console.error('Failed to start server: ', error)
    process.exit(1)
  }
}

start()

process.on('SIGINT', async () => {
  await closeNatsClient();
  process.exit(1);
});

process.on('SIGTERM', async () => {
  await closeNatsClient();
  process.exit(1);
});
