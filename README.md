# Node.js RESTful API Service based on Express.js 4

This is the RESTful API Service. It's base example include token authorisation and sample of CRUD (create, read, update, delete) operations.

### Getting started

0. To store user accounts and other information i use `mongodb`. If you want you can use local `mongodb` server or you can use free plan for example from [mlab](http://mlab.com/). How to create database on mlab see [docs](http://docs.mlab.com/)

1. Make project directory and initialise npm project
```
mkdir restapi
cd restapi
npm init
```

2. Install base node packages
```
npm install --save bcrypt body-parser express jsonwebtoken mongoose mongoose-timestamp
```

3. You can clone this project and skep 1 and 2 steps by
```
git clone git@github.com:simdo/rest.api.git
```
or [download](https://github.com/simdo/rest.api/archive/master.zip) source project files

4. Create environment file `env.json` on the root project folder
```
touch env.json
```

5. Put the following code into `env.json`
```json
{
  "api"         : {
    "version"   : "v1.0"
  },
  "port"        : 3000,
  "host"        : "localhost",
  "environment" : "development",
  "mongodb"     : "mongodb://user:password@id.mlab.com:port/dbname",
  "secret"      : "Some super sercet string for JSON Web token",
  "from_email"  : "robot@project.domain.name"
}
```

6. Start project
```
node index.js
```

7. Use for example [Postman](https://www.getpostman.com/) for test you Restful API server

### Change Log

This project adheres to [Semantic Versioning](http://semver.org/).
Every release, along with the migration instructions, is documented on the Github [Releases](https://github.com/simdo/api/releases) page.

### License

MIT