import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

const buildTicket = async (title: string) => {
  const ticket = Ticket.build({
    title: title,
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  return ticket;
};

it("check if users can retrieve an associated order", async () => {
  // create 3 tickets
  const ticket1 = await buildTicket("concert1");
  const ticket2 = await buildTicket("concert2");
  const ticket3 = await buildTicket("concert3");

  const user1 = global.signin();
  const user2 = global.signin();
  // Create 1 order as user 1
  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  // Create 2 orders as user 2
  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket2.id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  // make request to get orders for user 2

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(200);

  // expect we only get users for user 2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order1.id);
  expect(response.body[1].id).toEqual(order2.id);
  expect(response.body[0].ticket.id).toEqual(ticket2.id);
  expect(response.body[1].ticket.id).toEqual(ticket3.id);
});
