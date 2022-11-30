require("dotenv").config();

const { nanoid } = require("nanoid");
const { BrokerFactory } = require("./concerns");

const RESOURCE_ATTRIBUTES = {
  title: "My first post",
  content: "Lorem ipsum...",
  votes: 0,
};

describe("resources", () => {
  let broker = BrokerFactory();

  beforeAll(async function () {
    await broker.start();
  });

  it("create", async () => {
    await broker.call("posts.create", RESOURCE_ATTRIBUTES);
  });

  it("create and get", async () => {
    const data = { 
      id: nanoid(), 
      ...RESOURCE_ATTRIBUTES
    };

    await broker.call("posts.create", data);

    const obj = await broker.call("posts.get", { id: data.id });
    const entries = Object.entries(obj).filter(([key]) => !key.startsWith("_"));

    for (const entry of entries) {
      const [key, value] = entry;
      expect(data[key]).toEqual(value);
    }
  });

  it("create and remove", async () => {
    const data = { 
      id: nanoid(), 
      ...RESOURCE_ATTRIBUTES
    };

    await broker.call("posts.create", data);
    await broker.call("posts.remove", { id: data.id });
  });

  it("create, update and get", async () => {
    const dataToCreate = { 
      id: nanoid(), 
      ...RESOURCE_ATTRIBUTES
    };
    
    const dataToUpdate = { 
      id: dataToCreate.id, 
      ...RESOURCE_ATTRIBUTES
    };

    await broker.call("posts.create", dataToCreate);
    await broker.call("posts.update", dataToUpdate);

    const obj = await broker.call("posts.get", { id: dataToCreate.id });
    const entries = Object.entries(obj).filter(([key]) => !key.startsWith("_"));

    for (const entry of entries) {
      const [key, value] = entry;
      expect(dataToUpdate[key]).toEqual(value);
    }
  });

  it("list", async () => {
    const list = await broker.call("posts.list");
  });
});
