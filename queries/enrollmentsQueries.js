const db = require('../db');

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

module.exports = {
  getEnrollmentsByStudentId,
  getEnrollmentsByCourseId,
};
