# Student App Backend Testing Server

A simple CRUD server for testing purposes only.

## Routes
|Method|Path|Notes|
|------|----|-----|
|GET|`/`|Health check route: returns 200
|GET|`/students`|Array of all students|
|GET|`/students/:id`|Fetch one student|
|POST|`/students`|Create a student|
|PUT|`students/:id`|Update a student|
|DELETE|`students/:id`|Delete a student|

## Response structure
All responses are in json.

For 200 responses, the top level key will be `data`, followed by the data returned.
For error responses, the top level key will be `error`, followed by the error message.

## Testing loading and error states on a client
### Loading
If you need to simulate slow loading, include `delay={time in ms}` in your query param. For example:

```
http://localhost:8000?delay=5000
```
Will cause a 5 second delay before sending the response back to the client

You can simulate a 500 response from the server by adding `error={error message}` in the query string. For example:

```
http://localhost:8000?error=Oh%20noes
```
Will return a 500 response with the `Oh noes` as the error message.

You can also use both at once! For example:

```
http://localhost:8000?error=whoops&delay=5000
```
This will cause a 5 second delay, then return a 500 response in the format: `{ error: "whoops" }`


