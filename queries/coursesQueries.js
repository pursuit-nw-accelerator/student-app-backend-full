let { courses } = require('../db/data/coursesData');

const getAllCourses = async () => {
  return courses;
};

module.exports = {
  getAllCourses,
};
