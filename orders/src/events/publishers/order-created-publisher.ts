import { Publisher, OrderCreatedEvent, Subjects } from "@tikkahelpers/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
