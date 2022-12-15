require("dotenv").config();

const { nanoid } = require("nanoid");
const { BrokerFactory } = require("./concerns");

const target = {
  id: nanoid(16),
  title: "My first post",
  content: "Lorem ipsum...",
  votes: 0,
  token: nanoid(32),
};

describe("resources", () => {
  let broker = BrokerFactory({
    resource: {
      name: "posts",
      schema: {
        title: "string",
        content: "string",
        votes: "number",
        token: "secret",
      },
    },
  });

  beforeAll(async function () {
    await broker.start();
  });

  afterAll(() => {
    return broker.stop();
  });

  it("create", async () => {
    const data = await broker.call("posts.create", { ...target });
    expect(data.id).toBeDefined();
  });

  it("create and get", async () => {
    const originalData = await broker.call("posts.create", { ...target });
    const liveData = await broker.call("posts.get", { id: originalData.id });

    for (const key of Object.keys(target)) {
      expect(liveData[key]).toEqual(target[key]);
    }
  });

  it("create and remove", async () => {
    const data = await broker.call("posts.create", { ...target });
    await broker.call("posts.remove", { id: data.id });
  });

  it("create, update and get", async () => {
    const originalData = await broker.call("posts.create", { ...target });

    const updatedData = await broker.call("posts.update", {
      id: originalData.id,
      title: "My new title!",
    });

    const obj = await broker.call("posts.get", { id: originalData.id });
    const entries = Object.entries(obj).filter(
      ([key]) => !key.startsWith("_") && key !== `token`
    );

    for (const entry of entries) {
      const [key, value] = entry;
      expect(updatedData[key]).toEqual(value);
    }
  });

  it("list", async () => {
    const list = await broker.call("posts.list");
  });
});
