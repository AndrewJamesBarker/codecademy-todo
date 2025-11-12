const pool = require('./database.js');

const create = (description) =>
    pool.query('INSERT INTO todo (description) VALUES ($1) RETURNING *', [
    description,
]);