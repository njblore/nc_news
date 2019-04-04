const { dbConfig } =
  process.env.NODE_ENV === 'production' ? process.env : require('../knexfile');

module.exports = require('knex')(dbConfig);
