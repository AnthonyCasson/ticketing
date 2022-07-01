import { Subjects, Publisher, ExpirationCompleteEvent } from '@anttix/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
