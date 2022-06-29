import { Publisher, OrderCreatedEvent, Subjects } from '@anttix/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
