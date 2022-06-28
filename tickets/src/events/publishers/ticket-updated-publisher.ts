import { Publisher, Subjects, TicketUpdatedEvent } from '@anttix/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
