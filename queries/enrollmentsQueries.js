const db = require('../db');

const getEnrollmentById = async (id) => {
  const enrollment = await db.oneOrNone(
    'SELECT * FROM enrollments WHERE id = $1',
    [id]
  );
  return enrollment;
};

const getEnrollmentsByStudentId = async (studentId) => {
  const enrollments = await db.any(
    `
  SELECT enrollments.*, courses.title AS course_title
  FROM enrollments
  JOIN courses
  ON enrollments.course_id = courses.id
  WHERE student_id = $1;
  `,
    [studentId]
  );
  return enrollments;
};

const getEnrollmentsByCourseId = async (courseId) => {
  const enrollments = await db.any(
    `SELECT 
	     enrollments.*, 
	     courses.title AS course_title,
	     students.first_name AS student_first_name,
	     students.last_name AS student_last_name
    FROM enrollments
    JOIN courses
    ON enrollments.course_id = courses.id
    JOIN students
    ON enrollments.student_id = students.id
    WHERE courses.id = $1;`,
    [courseId]
  );
  return enrollments;
};

const updateEnrollment = async (id, enrollment) => {
  const { student_id, course_id, start_date, end_date } = enrollment;
  const updatedEnrollment = await db.oneOrNone(
    `
  UPDATE enrollments SET 
    student_id = $1,
    course_id = $2,
    start_date = $3,
    end_date = $4
  WHERE id = $5
  RETURNING *;
  `,
    [student_id, course_id, start_date, end_date, id]
  );
  return updatedEnrollment;
};

module.exports = {
  getEnrollmentsByStudentId,
  getEnrollmentsByCourseId,
  getEnrollmentById,
  updateEnrollment,
};
