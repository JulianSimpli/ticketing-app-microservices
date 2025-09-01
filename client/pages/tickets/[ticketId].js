// 1. Usuario accede a /tickets/123
// 2. Next.js ejecuta AppComponent.getInitialProps()
//    - Construye client
//    - Obtiene currentUser
//    - Llama a TicketShow.getInitialProps(context, client)
//    - Obtiene ticket data
// 3. Renderiza página con { currentUser, ticket }

import useRequest from "../../hooks/use-request"
import useRoute from 'next/router'

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id
    },
    onSuccess: (order) => useRoute.push(`/orders/[orderId]`, `/orders/${order.id}`)
  })

  return <div>
    <h1>{ticket.title}</h1>
    <h4>Price: {ticket.price}</h4>
    {errors}
    <button className="btn btn-primary" onClick={() => doRequest()}>Purchase</button>
  </div>
}

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query
  const { data } = await client.get(`/api/tickets/${ticketId}`)

  return { ticket: data }
}

export default TicketShow