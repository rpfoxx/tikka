import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@tikkahelpers/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
