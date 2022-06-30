import { OrderCreatedEvent, OrderStatus } from '@anttix/common';
import mongoose from 'mongoose';
import { Ticket } from '../../../../models/ticket';
import { natsWrapper } from '../../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listeners';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  //make listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // build and save ticket
  const ticket = Ticket.build({
    title: 'gog',
    price: 22,
    userId: 'dsad',
  });
  await ticket.save();

  //create fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'dhsfj',
    expiresAt: 'dfs',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the msg', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('published a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
