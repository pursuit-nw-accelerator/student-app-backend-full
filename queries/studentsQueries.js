let { students } = require('../db/data/studentsData.json');
let lastId = students.length;

const getAllStudents = async () => {
  return students;
};

const getStudentById = async (id) => {
  return students.find((student) => student.id === id);
};

const createStudent = async (student) => {
  students.push({ id: ++lastId, ...student });
  return students[students.length - 1];
};

const updateStudent = async (id, student) => {
  const idx = students.findIndex((currStudent) => currStudent.id === id);
  students[idx] = { id, ...student };
  return students[idx];
};

const deleteStudent = async (id) => {
  const idx = students.findIndex((currStudent) => currStudent.id === id);
  const deletedStudent = students[idx];
  students = students.filter((student) => student.id !== id);
  return deletedStudent;
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
