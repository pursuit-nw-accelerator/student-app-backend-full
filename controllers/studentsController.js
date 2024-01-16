const { Router } = require('express');
const {
  getAllStudents,
  getStudentById,
} = require('../queries/studentsQueries');

const { validateId } = require('../middleware');

const studentsController = Router();

studentsController.get('/', async (request, response) => {
  try {
    const students = await getAllStudents();
    response.status(200).json({ data: students });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

studentsController.get('/:id', validateId, async (request, response) => {
  try {
    const { id } = request; // from middleware
    const student = await getStudentById(id);
    if (student) {
      response.status(200).json({ data: student });
    } else {
      return response
        .status(404)
        .json({ error: `Cannot find student with id ${id}` });
    }
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

module.exports = studentsController;
