let { students } = require('../db/data/studentsData.json');
let lastId = students.length;

const getAllStudents = async () => {
  return students;
};

const getStudentById = async (id) => {
  return students.find((student) => student.id === id);
};

module.exports = {
  getAllStudents,
  getStudentById,
};
