import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  BadRequestError,
  OrderStatus,
} from "@tikkahelpers/common";
import { body } from "express-validator";
import { Ticket } from "../../src/models/ticket";
import { Order } from "../../src/models/order";

import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

const router = express.Router();

const EXPIRATION_WINDOWS_SECONDS = 1 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) //specific to mongo DB, coupling services maybe not the best(this can be removed)
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in database
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }
    // Make sure that this ticket is not alredy reserved
    // run query to look at all order, find and order where the ticket is the ticket we just found && the order status is not! cancelled
    // if we find an order from that, means the ticket is reserved
    const isReserved = await ticket.isReserved(); //isReserved method created in ticket model.
    if (isReserved) {
      throw new BadRequestError("The ticket is already reserved");
    }

    // calculate an expiration date from this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOWS_SECONDS);

    // build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // publish an event saying the order has been created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
