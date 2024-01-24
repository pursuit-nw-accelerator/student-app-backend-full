const { Router } = require('express');
const { getAllCourses } = require('../queries/coursesQueries');

const coursesController = Router();

coursesController.get('/', async (request, response) => {
  try {
    const courses = await getAllCourses();
    response.status(200).json({ data: courses });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

module.exports = coursesController;
