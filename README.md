# Student App Backend FULL implementation

# Local setup
1. Clone this repo to your computer
1. `cd student-app-backend-full`
1. Install dependencies: `npm install`
1. Create the database: `createdb student-app-full-2024`(If this doesn't work, try with `sudo` or `sudo -u postgres` to run the command as the postgres user)
1. Create a `.env` file and set your environment variable:
```
DB_URL=postgresql://localhost:5432/student-app-full-2024
```
1. Also set this environment variable **outside of the .env file** so that you can run commands on the command line: `export DB_URL=postgresql://localhost:5432/student-app-full-2024`
1. Run the schema: `psql -d $DB_URL -f db/schema.sql`
1. Run the seeds: `psql -d $DB_URL -f db/seeds.sql`
1. Start the backend: `npm start`


## Routes
|Method|Path|Notes|
|------|----|-----|
|GET|`/`|Health check route: returns 200
|GET|`/students`|Array of all students (can be empty)|
|GET|`/students/:id`|Fetch one student|
|POST|`/students`|Create a student|
|PUT|`students/:id`|Update a student|
|DELETE|`students/:id`|Delete a student|
|GET|`/courses`|Array of all courses (can be empty)|
|GET|`/courses/:id`|Fetch one course|
|GET|`/courses/:id/enrollments`|Fetch all enrollments for a course|
|GET|`/students/:id/enrollments`|Fetch all enrollments for a student|

## Response structure
All responses are in json.

For 200 responses, the top level key will be `data`, followed by the data returned.
For error responses, the top level key will be `error`, followed by the error message.


