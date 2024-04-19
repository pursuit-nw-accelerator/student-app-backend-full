const db = require('../db');

const getAllCourses = async () => {
  const courses = await db.any('SELECT * FROM courses;');
  return courses;
};

const getCourseById = async (id) => {
  const course = await db.oneOrNone('SELECT * FROM courses WHERE id = $1', [
    id,
  ]);
  return course;
};

module.exports = {
  getAllCourses,
  getCourseById,
};
