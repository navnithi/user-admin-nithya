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