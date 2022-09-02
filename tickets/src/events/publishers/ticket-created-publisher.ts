import { Publisher, Subjects, TicketCreatedEvent } from "@tikkahelpers/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated; 
}