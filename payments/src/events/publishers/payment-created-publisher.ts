import { Subjects, Publisher, PaymentCreatedEvent } from '@anttix/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
