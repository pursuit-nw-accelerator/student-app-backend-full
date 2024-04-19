const express = require('express');
const cors = require('cors');
const studentsController = require('./controllers/studentsController');
const coursesController = require('./controllers/coursesController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Controllers
app.use('/students', studentsController);
app.use('/courses', coursesController);

// Health check route
app.get('/', (request, response) => {
  response.status(200).json({ data: 'Service is running' });
});

module.exports = app;
