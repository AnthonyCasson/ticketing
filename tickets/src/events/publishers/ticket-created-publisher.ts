import { Publisher, Subjects, TicketCreatedEvent } from '@anttix/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
