# Jobly - Node Express REST API server

### What is Jobly?
 Jobly is a platform for job seekers and companies. Users can create, view, update, and delete accounts, companies, and jobs. Authentication is required for all actions, and a token is provided upon login for secure usage

### Why Jobly?
During my time at Springboard, I built Jobly as a project to learn creating RESTful APIs in Express. It was an excellent way to practice database CRUD operations, middleware, authentication, error handling, test writing, and JSON Schema validation.

### How to use it?
 - clone or download the project  
 - navigate to the project directory
 - run **npm install** in yout terminal to install dependencies
 - add node_modules to .gitignore file
 - run **createdb jobly** (to create the database)
 - run **psql jobly < jobly.sql** (to seed the database)
 - run the same things with **jobly_test**
 - edit your **config.js** file and add it to .gitignore
 - to run the server: **node server.js** - server will be running at http://localhost:3001
 - to run the tests: **jest -i** 

Here are some helpful routes to interact with while using Jobly:

**User Routes**

- **POST http://localhost:3001/users**
  Only for admin users to add new users.
  Returns {user: { username, firstName, lastName, email, isAdmin }, token }

- **GET http://localhost:3001/users**
  Returns list of all users { users: [ {username, firstName, lastName, email }, ... ] }

- **GET http://localhost:3001/users/[username]**
  Returns { username, firstName, lastName, isAdmin, jobs }

- **PATCH http://localhost:3001/users/[username]**
  Updates an existing user (must be the logged-in user or an admin) and returns { username, firstName, lastName, email, isAdmin }.

- **DELETE http://localhost:3001/users/[username]**
  Removes an existing user (must be the logged-in user or an admin) and returns { deleted: username }.

- **POST http://localhost:3001/users/[username]/jobs/:id**
  Applies a specific user to  job. Returns {"applied": jobId}

**Login Route**

- **POST http://localhost:3001/register**
  Returns JWT token which can be used to authenticate further requests.

**Company Routes**

- **POST http://localhost:3001/companies**
  Creates a new company (must be an admin). Returns { handle, name, description, numEmployees, logoUrl }

- **GET http://localhost:3001/companies**
  Returns the list of all companies. It provides query string parameters for filtering:
  - nameLike (will find case-insensitive, partial matches)
  - minEmployees: at least that number of employees
  - maxEmployees: no more than that number of employees

- **GET http://localhost:3001/companies/[handle]**
  Returns a single company found by its handle.

- **PATCH http://localhost:3001/companies/[handle]**
  Updates an existing company (must be an admin) and returns { handle, name, description, numEmployees, logo_url }

- **DELETE http://localhost:3001/companies/[handle]**
  Removes an existing company (must be an admin) and returns { deleted: handle }

**Job Routes**

- **POST http://localhost:3001/jobs**
  Creates a new job (must be an admin) and returns { id, title, salary, equity, companyHandle }

- **GET http://localhost:3001/jobs**
  Lists all job titles and company handles for all jobs. It provides query string parameters for filtering:
  - title: partial matches, case insensitive
  - minSalary: filter to jobs with at least that salary
  - hasEquity: if true (non-zero amount of equity)

- **GET http://localhost:3001/jobs/[id]**
  Shows information about a specific job, returns { id, title, salary, equity, company }

- **PATCH http://localhost:3001/jobs/[id]**
  Updates a job by its ID (must be an admin) and returns { title, salary, equity, companyHandle }

- **DELETE http://localhost:3001/jobs/[id]**
  Deletes a job (must be an admin) and returns { deleted: id }
