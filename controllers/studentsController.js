const { Router } = require('express');
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../queries/studentsQueries');

const { validateId, validateStudent } = require('../middleware');

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

// Part 1.1: POST /students
studentsController.post('/', validateStudent, async (request, response) => {
  try {
    const { student } = request; // from middleware
    const createdStudent = await createStudent(student);
    response.status(201).json({ data: createdStudent });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

// Part 1.2: PUT /students/:id
studentsController.put(
  '/:id',
  validateId,
  validateStudent,
  async (request, response) => {
    try {
      const { id, student } = request; // from middleware

      // First try to fetch the student; return 404 if doesn't exist
      const persistedStudent = await getStudentById(id);
      if (!persistedStudent) {
        return response
          .status(404)
          .json({ error: `Cannot find student with id ${id}` });
      }
      const updatedStudent = await updateStudent(id, student);
      response.status(200).json({ data: updatedStudent });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  }
);

// Part 1.3: DELETE /students/:id
studentsController.delete('/:id', validateId, async (request, response) => {
  try {
    const { id } = request; // from middleware

    // First try to fetch the student; return 404 if doesn't exist
    const persistedStudent = await getStudentById(Number(id));
    if (!persistedStudent) {
      return response
        .status(404)
        .json({ error: `Cannot find student with id ${id}` });
    }
    const deletedStudent = await deleteStudent(Number(id));
    response.status(200).json({ data: deletedStudent });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

module.exports = studentsController;
