const { isBefore, isValid } = require('date-fns');
const { getCourseById } = require('../queries/coursesQueries');
const { getEnrollmentById } = require('../queries/enrollmentsQueries');
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

const ENROLLMENT_FIELDS = ['student_id', 'course_id', 'start_date'];

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

const validateEnrollmentExistsMiddleware = async (request, response, next) => {
  const { id } = request; // assumes this is called AFTER validateIdMiddleware
  const course = await getEnrollmentById(id);
  if (!course) {
    return response
      .status(404)
      .json({ error: `Cannot find enrollment with id ${id}` });
  }
  request.course = course;
  next();
};

const validateEnrollmentMiddleware = async (request, response, next) => {
  const enrollment = request.body;
  for (const field of ENROLLMENT_FIELDS) {
    if (!enrollment.hasOwnProperty(field)) {
      return response.status(400).json({
        error: `Field ${field} is not present`,
      });
    }
  }

  for (const field of Object.keys(enrollment)) {
    if (!ENROLLMENT_FIELDS.includes(field) && field !== 'end_date') {
      return response.status(400).json({
        error: `Field ${field} is not allowed`,
      });
    }
  }
  // Add end_date = null if missing
  if (!enrollment.hasOwnProperty('end_date')) {
    enrollment['end_date'] = null;
  }
  // end_date and start_date must be dates
  const { start_date, end_date } = enrollment;
  const sDate = new Date(start_date);
  const eDate = new Date(end_date);
  if (!isValid(sDate) || !isValid(eDate)) {
    return response.status(400).json({
      error: `Start and end dates must be valid date strings; received start_date=${start_date}, end_date=${end_date}`,
    });
  }

  // end_date cannot be before start_date
  if (isBefore(eDate, sDate)) {
    return response.status(400).json({
      error: `End date cannot be before start date`,
    });
  }

  // Check that student and course both exist
  const { student_id, course_id } = enrollment;
  const student = getStudentById(student_id);
  if (!student) {
    return response.status(404).json({
      error: `Cannot update enrollment because student with ${student_id} could not be found`,
    });
  }

  const course = getStudentById(course_id);
  if (!course) {
    return response.status(404).json({
      error: `Cannot update enrollment because course with ${course_id} could not be found`,
    });
  }

  // All looks good! Add enrollment to request and call next()
  request.enrollment = enrollment;
  next();
};

module.exports = {
  validateIdMiddleware,
  validateStudentMiddleware,
  validateStudentExistsMiddleware,
  validateCourseExistsMiddleware,
  validateEnrollmentExistsMiddleware,
  validateEnrollmentMiddleware,
};
