import { NatsConnection } from 'nats'
import { Streams, Subjects } from './subjects'

interface Event {
  stream: Streams
  subject: Subjects
  data: any
}

export abstract class JetStreamPublisher<T extends Event> {
  protected abstract subject: T['subject']
  protected abstract stream: T['stream']

  constructor(protected client: NatsConnection) {}

  async publish(data: T['data']) {
    const jsm = await this.client.jetstreamManager()
    try {
      await jsm.streams.info(this.stream)
    } catch {
      console.error(
        `❌ El stream "${this.stream}" no existe. Ejecuta primero el script de setup (npm run nats:setup) antes de iniciar el publisher.`
      )
      process.exit(1)
    }

    const js = this.client.jetstream()
    const pubAck = await js.publish(this.subject, JSON.stringify(data))
    console.log('✅Event published to JetStream')
    console.log('+ Publish acknowledgment:', pubAck)
    console.log(`+ Published to subject: ${this.subject}`)
    console.log(`+ Stream: ${this.stream}`)
  }
}
