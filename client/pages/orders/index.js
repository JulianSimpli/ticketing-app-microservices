const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map((elem) => {
        return <li key={elem.id}>{elem.ticket.title} - {elem.status}</li>;
      })}
    </ul>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');
  return { orders: data };
};

export default OrderIndex;