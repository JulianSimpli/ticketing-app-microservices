import { useEffect, useState } from "react"
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import useRequest from "../../hooks/use-request"
import Router from "next/router";

const stripePromise = loadStripe('pk_test_51ReEI2GbGyJpWrHqhITk7AYdCw46dg8gdOq2xjmQ7dsYzDsp3bHbkNlcYlBmwoDDmggIQcrltWDC0Pju6VeNwa0b00gSzcDjBO');

const CheckoutForm = ({ order, currentUser, doRequest, errors }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    // Crear payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        email: currentUser.email,
      },
    });

    if (error) {
      console.error('Error creating payment method:', error);
      setLoading(false);
      return;
    }

    // Enviar el payment method al backend
    await doRequest({ paymentMethodId: paymentMethod.id });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '20px 0' }}>
      <div style={{
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginBottom: '10px'
      }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn btn-primary"
        style={{ width: '100%' }}
      >
        {loading ? 'Processing...' : `Pay $${order.ticket.price}`}
      </button>
      {errors}
    </form>
  );
};

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders')
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000)

    // to stop the setInterval when this component gets unmounted o rerender 
    return () => {
      clearInterval(timerId)
    }
  }, [])

  return (
    <div>
      <h1>Purchase Order</h1>
      <h4>Ticket: {order.ticket.title}</h4>
      <h4>Price: ${order.ticket.price}</h4>
      <p>Order expires in {timeLeft} seconds</p>

      <Elements stripe={stripePromise}>
        <CheckoutForm
          order={order}
          currentUser={currentUser}
          doRequest={doRequest}
          errors={errors}
        />
      </Elements>
    </div>)
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow