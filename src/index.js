const { S3db } = require("s3db.js");

const _ = require("lodash");
const Promise = require("bluebird");
const { ServiceSchemaError } = require("moleculer").Errors;

class S3dbAdapter {
  /**
   * Creates an instance of S3dbAdapter.
   * @param {String} uri
   * @param {Object?} options
   * @param {String?} dbName
   * @memberof MongoDbAdapter
   */
  constructor(options) {
    this.options = options;
  }

  /**
   * Initialize adapter
   * @param {ServiceBroker} broker
   * @param {Service} service
   * @memberof MongoDbAdapter
   */
  init(broker, service) {
    this.broker = broker;
    this.service = service;

    if (!this.service.schema?.resource?.name) {
      throw new ServiceSchemaError(
        "Missing `resource.name` definition in schema of service!"
      );
    }

    if (!this.service.schema?.resource?.schema) {
      throw new ServiceSchemaError(
        "Missing `resource.schema` definition in schema of service!"
      );
    }
  }

  /**
   * Connect to database
   * @returns {Promise}
   * @memberof MongoDbAdapter
   */
  async connect() {
    this.s3db = new S3db(this.options);

    await this.s3db.connect();

    const { name, schema } = this.service.schema.resource;

    await this.s3db.createResource({
      resourceName: name,
      attributes: schema,
    });

    this.resource = this.s3db.resource(name);
  }

  /**
   * Disconnect from database
   * @returns {Promise}
   * @memberof MongoDbAdapter
   */
  disconnect() {
    return Promise.resolve();
  }

  /**
   * Find all entities by filters.
   * Available filter props:
   * 	- limit
   *  - offset
   *  - sort
   *  - search
   *  - searchFields
   *  - query
   * @param {Object} filters
   * @returns {Promise<Array>}
   * @memberof MongoDbAdapter
   */
  find(filters) {
    return this.createCursor(filters, false).toArray();
  }

  /**
   * Find an entity by query
   * @param {Object} query
   * @returns {Promise}
   * @memberof MemoryDbAdapter
   */
  findOne(query) {
    return this.collection.findOne(query);
  }

  /**
   * Find an entities by ID.
   * @param {String} _id
   * @returns {Promise<Object>} Return with the found document.
   * @memberof MongoDbAdapter
   */
  findById(_id) {
    return this.resource.getById(_id);
  }

  /**
   * Find any entities by IDs.
   * @param {Array} idList
   * @returns {Promise<Array>} Return with the found documents in an Array.
   * @memberof MongoDbAdapter
   */
  findByIds(idList) {
    return this.resource.getByIdList(idList);
  }

  /**
   * Get count of filtered entites.
   * Available query props:
   *  - search
   *  - searchFields
   *  - query
   * @param {Object} [filters={}]
   * @returns {Promise<Number>} Return with the count of documents.
   * @memberof MongoDbAdapter
   */
  count(filters = {}) {
    return this.resource.count();
  }

  /**
   * Insert an entity.
   * @param {Object} entity
   * @returns {Promise<Object>} Return with the inserted document.
   * @memberof MongoDbAdapter
   */
  insert(entity) {
    return this.resource.insert(entity);
  }

  /**
   * Insert many entities
   *
   * @param {Array} entities
   * @returns {Promise<Array<Object>>} Return with the inserted documents in an Array.
   *
   * @memberof MongoDbAdapter
   */
  insertMany(entities) {
    return this.resource.bulkInsert(entities);
  }

  /**
   * Update many entities by `query` and `update`
   * @param {Object} query
   * @param {Object} update
   * @returns {Promise<Number>} Return with the count of modified documents.
   * @memberof MongoDbAdapter
   */
  updateMany(query, update) {
    return this.collection
      .updateMany(query, update)
      .then((res) => res.modifiedCount);
  }

  /**
   * Update an entity by ID and `update`
   * @param {String} _id - ObjectID as hexadecimal string.
   * @param {Object} update
   * @returns {Promise<Object>} Return with the updated document.
   * @memberof MongoDbAdapter
   */
  updateById(_id, update) {
    return this.collection
      .findOneAndUpdate({ _id: this.stringToObjectID(_id) }, update, {
        returnOriginal: false,
      })
      .then((res) => res.value);
  }

  /**
   * Remove entities which are matched by `query`
   * @param {Object} query
   * @returns {Promise<Number>} Return with the count of deleted documents.
   * @memberof MongoDbAdapter
   */
  removeMany(query) {
    return this.resource.bulkDelete(query);
  }

  /**
   * Remove an entity by ID
   * @param {String} _id - ObjectID as hexadecimal string.
   * @returns {Promise<Object>} Return with the removed document.
   * @memberof MongoDbAdapter
   */
  removeById(_id) {
    return this.collection
      .findOneAndDelete({ _id: this.stringToObjectID(_id) })
      .then((res) => res.value);
  }

  /**
   * Clear all entities from collection
   * @returns {Promise}
   * @memberof MongoDbAdapter
   */
  clear() {
    return this.resource.deleteAll();
  }

	/**
	* Transforms 'idField' into MongoDB's '_id'
	* @param {Object} entity
	* @param {String} idField
	* @memberof MongoDbAdapter
	* @returns {Object} Modified entity
	*/
	beforeSaveTransformID (entity, idField) {
		let newEntity = _.cloneDeep(entity);
		return newEntity;
	}
}

module.exports = S3dbAdapter;
