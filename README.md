# moleculer-db-s3db-adapter

[![license: unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/) [![npm version](https://img.shields.io/npm/v/moleculer-db-s3db-adapter.svg?style=flat)](https://www.npmjs.com/package/moleculer-db-s3db-adapter) [![Maintainability](https://api.codeclimate.com/v1/badges/26e3dc46c42367d44f18/maintainability)](https://codeclimate.com/github/forattini-dev/moleculer-db-s3db-adapter/maintainability) [![Coverage Status](https://coveralls.io/repos/github/forattini-dev/moleculer-db-s3db-adapter/badge.svg?branch=main)](https://coveralls.io/github/forattini-dev/moleculer-db-s3db-adapter?branch=main)


[`s3db.js`](https://github.com/forattini-dev/s3db.js) adapter for Moleculer DB service.

## Install

```bash
$ npm install moleculer-db moleculer-db-s3db-adapter --save

# or

$ yarn add moleculer-db moleculer-db-s3db-adapter
```

## Usage

```javascript
const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");
const S3dbAdapter = require("moleculer-db-s3db-adapter");

const broker = new ServiceBroker();

// Create a Mongoose service for `post` entities
broker.createService({
  name: "posts",
  mixins: [DbService],

  settings: {
    idField: "id",
  },
  
  adapter: new S3dbAdapter({
    uri: `s3://${AWS_ACCESS_KEY_ID}:${AWS_SECRET_ACCESS_KEY}@${AWS_S3_BUCKET}/databases/moleculer`,
  }),
  
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

broker
  .start()
  // Create a new post
  .then(() =>
    broker.call("posts.create", {
      title: "My first post",
      content: "Lorem ipsum...",
      votes: 0,
    })
  )

  // Get all posts
  .then(() => broker.call("posts.find").then(console.log));
```

More initial parameters at [`s3db.js`](https://github.com/forattini-dev/s3db.js).
