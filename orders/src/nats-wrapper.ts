import { connect, NatsConnection } from 'nats'

let client: NatsConnection | null = null

export async function getNatsClient(): Promise<NatsConnection> {
  if (!client) {
    const natsUrl = process.env.NATS_URL || 'nats://nats-srv:4222'
    client = await connect({ servers: natsUrl })
    console.log(`connected to ${client.getServer()}`)
  }
  return client
}

export async function closeNatsClient() {
  if (client) {
    await client.close()
    client = null
  }
}

export const natsClient = {
  get client(): NatsConnection {
    if (!client) {
      throw new Error('NATS client not connected')
    }
    return client
  },
}