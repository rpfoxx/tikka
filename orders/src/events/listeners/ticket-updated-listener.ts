import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@tikkahelpers/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findbyEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, price } = data; //add version prop to strip out updateIfCurrentPlugin logic on order service, see order->ticket model

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
