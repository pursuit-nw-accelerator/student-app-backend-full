const express = require('express');
const cors = require('cors');
const { withDelay, withError } = require('./middleware');
const studentsController = require('./controllers/studentsController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(withDelay);
app.use(withError);

// Controllers
app.use('/students', studentsController);

app.get('/', (request, response) => {
  response.status(200).json({ data: 'Service is running' });
});

module.exports = app;
