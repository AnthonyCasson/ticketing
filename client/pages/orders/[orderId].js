import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

function OrderShow({ order, currentUser }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => {
      Router.push('/orders');
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      <h1>Time left to pay: {timeLeft} seconds</h1>
      <StripeCheckout
        closed={() => Router.push('/orders')}
        token={({ id }) => {
          doRequest({ token: id });
        }}
        amount={order.ticket.price * 100}
        email={currentUser.email}
        stripeKey="pk_test_51LHlXnJ1PdYyfErN8rVMg6jXtCJq3E5ZMWFoNKzSrmtm98JzNKwpqOPlikOwxsTzNWzELKs4On1mJMQM2LVB9x4X00odLHuSjJ"
      />
      {errors}
    </div>
  );
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
