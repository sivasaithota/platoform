# App Studio OpenX

This repository contains the platform or enframe micro service which provides the core functionality for enframe.

#### Configuration management
This platform service spins out Analytics center application. This creates a depedency on Analytics center's version (docker image tag) that need to be spined out. 

For environments like dev & qa this is a rolling update - configured to auto mode in 
 * [dev.json](./config/dev.json)
 * [qa.json](./config/dev.json)

For production environment :
 * [prod.json](./config/dev.json) need to be updated with version of analytics center once a stable release of analytics center happens.

For local development box, default.json should suffice all local box development needs applicable to all developers. If developer wants to overide the configuration which is applicable only to his system, please create :
 * local.json - under config directory. This should not be pushed to version control, so it is added to [.gitignore](./gitignore). 


## Project setup

### Install dependencies (first time only)
```
docker-compose up install
```

### Setup default collections in backend (first time only)
```
docker-compose up migrate
```

### Compiles and minify front-end for production
```
docker-compose up build
```

### Start server
```
docker stack deploy enframe -c docker-stack.yml
```

## Creating migration scripts in case of MongoDB schema/data change

The [migrate-mongo](https://www.npmjs.com/package/migrate-mongo) package is used to prepare and run migration scripts whenever there is a change or addition to be made to the mongo database. Configuration to be used by this package is defined in the [migrate-mongo-config.js](./migrate-mongo-config.js) file.

### Creating a migration script

Command:
```
npm run migrate -- create <script-name>
```

The script file must contain javascript that exposes to functions:
- `up()` which contains code for migrating database to newer state 
- `down()` which contains code for reverting the changes made in `up()`

These functions are provided with the `db` object used by mongo for perfroming all database operations.
Every script (other than the first) must contain both functions with relevant code.
