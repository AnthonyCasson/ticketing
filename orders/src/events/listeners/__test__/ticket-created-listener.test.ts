import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import { TicketCreatedEvent } from '@anttix/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance ofg the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'concerto',
    price: 66,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, data };
};

it('creates and saves a ticket', async () => {
  const { listener, msg, data } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertion to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, msg, data } = await setup();

  // write assertion to make sure a ticket was created
  await listener.onMessage(data, msg);

  // write assertions to check if fucntion was called

  expect(msg.ack).toHaveBeenCalled();
});

it('acks the message', async () => {});
