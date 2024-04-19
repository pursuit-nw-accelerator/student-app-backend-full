const { getCourseById } = require('../queries/coursesQueries');
const { getStudentById } = require('../queries/studentsQueries');

const STUDENT_FIELDS = [
  'city',
  'company',
  'email',
  'firstName',
  'lastName',
  'pic',
  'skill',
];

const validateIdMiddleware = (request, response, next) => {
  // If the id is not valid, return 400 and do NOT call next()
  const { id } = request.params;
  if (!Number.isInteger(Number(id)) || Number(id) < 1) {
    return response
      .status(400)
      .json({ error: `id param must be positive integer; received ${id}` });
  } else {
    // Else "annotate" request with parsed id as number and call next
    request.id = Number(id);
    next();
  }
};

const validateStudentMiddleware = (request, response, next) => {
  const student = request.body;
  // Each of STUDENT_FIELDS must be present and must be a string
  for (const field of STUDENT_FIELDS) {
    // return false if field is not a key in student, or if the value is not a string
    if (!student.hasOwnProperty(field) || typeof student[field] !== 'string') {
      return response.status(400).json({
        error: `Field ${field} is not present or wrong type, received ${student[field]}`,
      });
    }
  }

  // The student cannot have any extra fields NOT in STUDENT_FIELDS
  // (Example: cannot have an extra "admin" field)
  for (const field in student) {
    if (!STUDENT_FIELDS.includes(field)) {
      return response.status(400).json({ error: `Field ${field} not allowed` });
    }
  }
  request.student = student;
  next();
};

const validateStudentExistsMiddleware = async (request, response, next) => {
  const { id } = request; // assumes this is called AFTER validateIdMiddleware
  const student = await getStudentById(id);
  if (!student) {
    return response
      .status(404)
      .json({ error: `Cannot find student with id ${id}` });
  }
  request.student = student;
  next();
};

const validateCourseExistsMiddleware = async (request, response, next) => {
  const { id } = request; // assumes this is called AFTER validateIdMiddleware
  const course = await getCourseById(id);
  if (!course) {
    return response
      .status(404)
      .json({ error: `Cannot find course with id ${id}` });
  }
  request.course = course;
  next();
};

module.exports = {
  validateIdMiddleware,
  validateStudentMiddleware,
  validateStudentExistsMiddleware,
  validateCourseExistsMiddleware,
};
