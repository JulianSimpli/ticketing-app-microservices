import {
  AckPolicy,
  DeliverPolicy,
  JetStreamClient,
  JetStreamManager,
  JsMsg,
  NatsConnection,
} from 'nats'
import { Streams, Subjects } from './subjects'

interface Event {
  stream: Streams
  subject: Subjects
  data: any
}

// magic
export abstract class JetStreamListener<T extends Event> {
  protected abstract subject: T['subject']
  protected abstract stream: T['stream']
  protected abstract durableName: string
  protected abstract onMessage(
    data: T['data'],
    msg: JsMsg
  ): void | Promise<void>

  constructor(protected client: NatsConnection) {}

  async initAndListen() {
    const js: JetStreamClient = this.client.jetstream()
    const jsm: JetStreamManager = await this.client.jetstreamManager()

    try {
      await jsm.consumers.info(this.stream, this.durableName)
    } catch {
      await jsm.consumers.add(this.stream, {
        name: this.durableName,
        durable_name: this.durableName,
        filter_subject: this.subject,
        ack_policy: AckPolicy.Explicit,
        max_deliver: 3,
        deliver_policy: DeliverPolicy.All,
        ack_wait: 10_000_000_000,
      })
    }

    await this.listen(js)
  }

  async listen(js: JetStreamClient) {
    const consumer = await js.consumers.get(this.stream, this.durableName)
    const messages = await consumer.consume({ max_messages: 100 })
    for await (const msg of messages) {
      try {
        const data = this.parseMessage(msg)
        await this.onMessage(data, msg)
        msg.ack()
      } catch {
        msg.nak()
      }
    }
  }

  protected parseMessage(msg: JsMsg): any {
    return JSON.parse(msg.string())
  }
}
