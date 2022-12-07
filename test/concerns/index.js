require("dotenv").config();

jest.setTimeout(30 * 1000);

const DbService = require("moleculer-db");
const { ServiceBroker } = require("moleculer");

const { S3dbAdapter } = require("../../src");
const MoleculerConfig = require("./moleculer.config");

const { AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

module.exports = {
  BrokerFactory({ resource, adapter } = {}) {
    const broker = new ServiceBroker(MoleculerConfig);

    broker.createService({
      name: "posts",
      mixins: [DbService],
      resource,

      settings: {
        idField: "id",
      },

      adapter: new S3dbAdapter({
        uri: `s3://${AWS_ACCESS_KEY_ID}:${AWS_SECRET_ACCESS_KEY}@${AWS_S3_BUCKET}/databases/moleculer`,
        passphrase: "super-secret",
        ...adapter,
      }),
    });

    return broker;
  },
};
