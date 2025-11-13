const formidable = require('formidable');
const { create, get, remove } = require('../model/todo.js')

exports.create = (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields) => {
        const { description } = fields;
        if (!fields.description) {
            return res.status(400).json({
                error: 'Description is required',
            });
        }
        try {
            const newTask = await create(description);
            return res.status(201).send({
                data: newTask.rows[0]
            });
        } catch (error) {
            return res.status(400).json({
                error,
            });
        }
    })
}