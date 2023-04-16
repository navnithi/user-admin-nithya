# User-Admin Management

1.Bootstraping the backend

- setup folder structure:- src -> models, conntrollers, routes, helpers, middlewares, config and validation
- setup environment variables
- create & run the basic server
- connect to mongodb atlas

2. Create User

 - create schema & models
 - required: name, email, password, phone,
 - not required: image,
 - default: is_admin, is_verified, createdAt
 - create register route with express-formidable
 - create register controller

3. Create User
 - /register
  - we have received the data
  - check input data validtion
  - secure the password
  - verify the user email (valid 10min)
  - storing the user in database
  - /login
  - email & password
  - token
 - /logout
 - /profile -> if you are logged in
 - reset password
 - forget password
 - crud -> create, read, update, delete