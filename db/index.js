const { Pool } = require('pg');
const settings = require('../config').db;

const pool = new Pool(settings);

module.exports = {
  query: (text, params) => pool.query(text, params),
  getConnect: () => pool.connect()
}