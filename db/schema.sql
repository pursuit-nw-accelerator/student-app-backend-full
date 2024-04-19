DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS students;


CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name varchar(255),
    last_name varchar(255),
    city varchar(255),
    company varchar(255),
    email varchar(255),
    pic text,
    skill varchar(255)
);

CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    score integer DEFAULT 0,
    student_id integer REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title varchar(255)
);

CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  student_id integer REFERENCES students(id) ON DELETE CASCADE,
  course_id integer REFERENCES courses(id) ON DELETE CASCADE,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ
);

CREATE INDEX grades_student_id ON grades(student_id);