const express = require('express');
const router = express.Router();

const { create, read, removeTodo, editTodo } = require('../controller')

router.post('/todo/create', create);
router.get('/todos', read);
router.delete('/todo/:id', removeTodo);
router.put('/todo/:id', editTodo);

module.exports = router;