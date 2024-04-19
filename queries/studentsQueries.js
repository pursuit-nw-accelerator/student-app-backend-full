const db = require('../db');

const getAllStudents = async () => {
  console.log('getAllStudents');
  return db.any(`
  SELECT 
	   students.*,
	   round(avg(grades.score), 2) AS average_grade,
	   array_agg(to_json(grades.*)) AS grades, 
	   e.enrollments
  FROM students
  JOIN grades
  ON students.id = grades.student_id
  JOIN 
  	(SELECT students.id, 
      array_agg(to_jsonb(ec.*)) AS enrollments
  	FROM students
  	JOIN (
  		SELECT enrollments.*, courses.title
  		FROM enrollments
  		JOIN courses
		  ON enrollments.course_id = courses.id) AS ec
  	ON students.id = ec.student_id
  	GROUP BY students.id
  	ORDER BY students.id) AS e
  ON students.id = e.id
  GROUP BY students.id, e.enrollments
  ORDER BY students.id;
  `);
};

const getStudentById = async (id) => {
  return db.oneOrNone('SELECT * FROM students WHERE id = $1', [id]);
};

const createStudent = async (student) => {
  const { firstName, lastName, company, skill, pic, city, email } = student;
  return db.oneOrNone(
    `
  INSERT INTO students (first_name, last_name, company, skill, pic, city, email)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;
  `,
    [firstName, lastName, company, skill, pic, city, email]
  );
};

const updateStudent = async (id, student) => {
  const { firstName, lastName, company, skill, pic, city, email } = student;
  return db.oneOrNone(
    `
  UPDATE students SET 
    first_name = $1,
    last_name = $2,
    company = $3,
    skill = $4,
    pic = $5, 
    city = $6, 
    email = $7
  WHERE id = $8
  RETURNING *;
  `,
    [firstName, lastName, company, skill, pic, city, email, id]
  );
};

const deleteStudent = async (id) => {
  return db.oneOrNone('DELETE FROM students WHERE id = $1 RETURNING *;', [id]);
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
