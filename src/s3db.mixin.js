const MoleculerDB = require("moleculer-db");
const S3dbAdapter = require("./s3db-adapter.class");

module.exports = ({ options = {}, resource = {}, settings = {}}) => ({
  name: "s3db",
  mixins: [MoleculerDB],

  settings: {
    idField: "id",
    ...settings,
  },

  resource: {
    name: null,
    schema: null,
    ...resource,
  },

  adapter: new S3dbAdapter({ ...options }),
});
