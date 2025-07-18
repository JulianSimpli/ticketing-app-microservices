import nats, { NatsConnection } from 'nats'
import { Streams } from './events/subjects'
import { TicketCreatedListener } from './events/ticket-created-listener'

async function main() {
  let client: NatsConnection | null = null

  try {
    const instanceId = `INSTANCE-${crypto.randomUUID().slice(0, 8)}`
    console.log(`Listener instance: ${instanceId}`)

    client = await nats.connect({ servers: 'http://localhost:4222' })
    console.log(`Instance ${instanceId} connected`)

    // Verificar existencia del stream antes de escuchar
    const jsm = await client.jetstreamManager()
    try {
      await jsm.streams.info(Streams.Tickets)
    } catch {
      console.error(
        `❌ El stream "${Streams.Tickets}" no existe. Ejecuta primero el script de setup (npm run nats:setup) antes de iniciar el listener.`
      )
      process.exit(1)
    }

    const listener = new TicketCreatedListener(client)
    await listener.initAndListen()
  } catch (error) {
    console.error('Connection error: ', error)
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

main()
