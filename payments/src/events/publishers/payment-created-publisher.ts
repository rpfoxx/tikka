import { PaymentCreatedEvent, Publisher, Subjects } from "@tikkahelpers/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
