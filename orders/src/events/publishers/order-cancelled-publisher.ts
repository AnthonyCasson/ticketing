import { Subjects, OrderCancelledEvent, Publisher } from '@anttix/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
