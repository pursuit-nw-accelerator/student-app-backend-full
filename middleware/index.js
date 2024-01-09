const sleep = async (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

const STUDENT_FIELDS = [
  'firstName',
  'lastName',
  'city',
  'country',
  'email',
  'pic',
  'skill',
];

/**
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 *
 * Delays calling next middleware function for user-specified interval
 * if the ?delay={time in ms} query param is present
 */
const withDelay = async (request, response, next) => {
  const { delay } = request.query;
  if (delay) {
    await sleep(delay);
  }
  next();
};

/**
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 *
 * Returns a 500 with user-specified message if the
 * error query param is present in the request
 */
const withError = (request, response, next) => {
  const { error } = request.query;
  if (error) {
    return response.status(500).json({ error });
  }
  next();
};
/**
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 *
 * Returns 400 response for routes with /:id params
 * if the id cannot be parsed as a positive integer.
 * If not, annotates the request.id with the parsed id.
 */
const validateId = (request, response, next) => {
  const { id } = request.params;

  if (!Number.isInteger(Number(id)) || Number(id) < 1) {
    return response
      .status(400)
      .json({ error: `id must be positive integer, received ${id}` });
  }
  request.id = Number(id);
  next();
};

const validateStudent = (request, response, next) => {
  const student = request.body;
  // All student fields must be present as strings
  for (const field of STUDENT_FIELDS) {
    if (!student.hasOwnProperty(field) || typeof student[field] !== 'string') {
      return response.status(400).json({
        error: `${field} must be present and must be a string, received ${student[field]}`,
      });
    }
  }
  // No other fields may be present
  for (const field in student) {
    if (!STUDENT_FIELDS.includes(field)) {
      return response.status(400).json({ error: `${field} field not allowed` });
    }
  }

  request.student = student;
  next();
};

module.exports = {
  withDelay,
  withError,
  validateId,
  validateStudent,
};
