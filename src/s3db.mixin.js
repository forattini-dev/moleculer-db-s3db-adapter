const MoleculerDB = require('moleculer-db')

module.exports = {
  name: 's3db',
  mixins: [MoleculerDB],
  
  settings: {
    idField: "id",
  },

  resource: {
    name: null,
    schema: null,
  },

  started () {
    // this.resource.on('connected', () => this.emit(`s3db-${this.name}:connected`))
  }
}
