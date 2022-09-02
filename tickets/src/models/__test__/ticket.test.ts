import { Ticket } from "../ticket";

it("it implements Optomistic concurrency control", async () => {
  // create instance of ticker
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });
  //save ticket to db
  await ticket.save();
  //fetch ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const SecondInstance = await Ticket.findById(ticket.id);

  // make 2 seperate changes to the tickets
  firstInstance!.set({ price: 10 });
  SecondInstance!.set({ price: 15 });
  // save first fetched ticket
  await firstInstance!.save();
  // save 2nd fetched ticket and expect an error
  try {
    await SecondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
