import mongoose from 'mongoose';
import { TicketUpdatedEvent } from '@anttix/common';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  // create listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save ticket
  const ticket = Ticket.build({
    title: 'jojoWAP',
    price: 231,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  // create fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    userId: 'boomboom',
    price: 23,
    title: 'new Was',
  };

  // create fake msg object ( the ack:  mockfn)
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return ALL THINGZ
  return { ticket, data, msg, listener };
};

it('finds, updates, and save a ticket', async () => {
  const { msg, listener, data, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if event has skipped version number', async () => {
  const { msg, data, listener } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
