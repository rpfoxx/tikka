import { Subjects, Publisher, OrderCancelledEvent } from "@tikkahelpers/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
