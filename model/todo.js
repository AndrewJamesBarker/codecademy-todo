const pool = require('./database.js');

const create = (description) =>
    pool.query('INSERT INTO todo (description) VALUES ($1) RETURNING *', [
    description,
]);

const get = () =>
    pool.query('SELECT * FROM todo');

const remove = (id) =>
    pool.query('DELETE FROM todo WHERE todo_id = $1', [id]);

const update = (id, description) =>
    pool.query(`UPDATE todo SET description = $1 WHERE todo_id = $2`, [description, id]);

module.exports = { create, get, remove, update };