const { Router } = require('express');
const {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../queries/studentsQueries');

const { getEnrollmentsByStudentId } = require('../queries/enrollmentsQueries');

const {
  validateIdMiddleware,
  validateStudentMiddleware,
  validateStudentExistsMiddleware,
} = require('../middleware');

const studentsController = Router();

studentsController.get('/', async (request, response) => {
  try {
    const students = await getAllStudents();
    response.status(200).json({ data: students });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

studentsController.get(
  '/:id',
  validateIdMiddleware,
  validateStudentExistsMiddleware,
  async (request, response) => {
    try {
      const { student } = request; // from middleware
      response.status(200).json({ data: student });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  }
);

studentsController.post(
  '/',
  validateStudentMiddleware,
  async (request, response) => {
    try {
      const { student } = request; // from middleware
      const persistedStudent = await createStudent(student);
      response.status(201).json({ data: persistedStudent });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  }
);

studentsController.put(
  '/:id',
  validateIdMiddleware,
  validateStudentExistsMiddleware,
  validateStudentMiddleware,
  async (request, response) => {
    try {
      const { id, student } = request; // from middleware
      const updatedStudent = await updateStudent(id, student);
      response.status(200).json({ data: updatedStudent });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  }
);

studentsController.delete(
  '/:id',
  validateIdMiddleware,
  validateStudentExistsMiddleware,
  async (request, response) => {
    try {
      const { id } = request; // from middleware
      const deletedStudent = await deleteStudent(id);
      response.status(200).json({ data: deletedStudent });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  }
);

studentsController.get(
  '/:id/enrollments',
  validateIdMiddleware,
  validateStudentExistsMiddleware,
  async (request, response) => {
    try {
      const { id } = request; // from middleware
      const enrollments = await getEnrollmentsByStudentId(id);
      response.status(200).json({ data: enrollments });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  }
);

module.exports = studentsController;
