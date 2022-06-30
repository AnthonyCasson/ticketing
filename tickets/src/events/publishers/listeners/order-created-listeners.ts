import { Listener, OrderCreatedEvent, Subjects } from '@anttix/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedPublisher } from '../ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // no ticket found? throw error!
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // mark ticket as reserverd by setting orderId property
    ticket.set({ orderId: data.id });

    //save ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      orderId: ticket.orderId,
      version: ticket.version,
      userId: ticket.userId,
    });

    //ack the msg
    msg.ack();
  }
}
