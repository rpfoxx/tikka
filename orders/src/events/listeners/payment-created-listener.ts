import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@tikkahelpers/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    //should normally send up event to update eg order:updated, to tell other services the order has been updated so they stay in sync,
    //but our app no longer interacts with order as its status is complete

    msg.ack();
  }
}
