const { Router } = require('express');
const {
  validateIdMiddleware,
  validateEnrollmentExistsMiddleware,
  validateEnrollmentMiddleware,
} = require('../middleware');
const { updateEnrollment } = require('../queries/enrollmentsQueries');

const enrollmentsController = Router();

enrollmentsController.get(
  '/:id',
  validateIdMiddleware,
  validateEnrollmentExistsMiddleware,
  async (request, response) => {
    try {
      const { course } = request; // from middleware
      response.status(200).json({ data: course });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  }
);

enrollmentsController.put(
  '/:id',
  validateIdMiddleware,
  validateEnrollmentExistsMiddleware,
  validateEnrollmentMiddleware,
  async (request, response) => {
    try {
      const { id, enrollment } = request; // from middleware
      const updatedEnrollment = await updateEnrollment(id, enrollment);
      response.status(200).json({ data: updatedEnrollment });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  }
);

module.exports = enrollmentsController;
