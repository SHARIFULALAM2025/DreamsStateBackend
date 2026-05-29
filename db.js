const knex = require('knex');
const config = require('./knexFile');
const db = knex(config.development);

module.exports = db;