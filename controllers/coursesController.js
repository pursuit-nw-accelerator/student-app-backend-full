const { Router } = require('express');

const { getAllCourses } = require('../queries/coursesQueries');
const {
  validateCourseExistsMiddleware,
  validateIdMiddleware,
} = require('../middleware');
const { getEnrollmentsByCourseId } = require('../queries/enrollmentsQueries');

const coursesController = Router();

coursesController.get('/', async (request, response) => {
  try {
    const courses = await getAllCourses();
    response.status(200).json({ data: courses });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

coursesController.get(
  '/:id',
  validateIdMiddleware,
  validateCourseExistsMiddleware,
  async (request, response) => {
    try {
      const { course } = request; // from middleware
      response.status(200).json({ data: course });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  }
);

coursesController.get(
  '/:id/enrollments',
  validateIdMiddleware,
  validateCourseExistsMiddleware,
  async (request, response) => {
    try {
      const { id } = request; // from middleware
      const enrollments = await getEnrollmentsByCourseId(id);
      response.status(200).json({ data: enrollments });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  }
);

module.exports = coursesController;
