# Node.js RESTful API Service based on Express.js 4

This is the RESTful API Service. It's base example include token authorisation and sample of CRUD (create, read, update, delete) operations.

### Getting started

* To store user accounts and other information i use `mongodb`. If you want you can use local `mongodb` server or you can use free plan for example from [mlab](http://mlab.com/). How to create database on mlab see [docs](http://docs.mlab.com/)

* Make project directory and initialise npm project
```
mkdir restapi
cd restapi
npm init
```

* Install base node packages
```
npm install --save bcrypt body-parser express jsonwebtoken mongoose mongoose-timestamp postmark
```

* You can clone this project and skep 1 and 2 steps by
```
git clone git@github.com:simdo/rest.api.git
```
or [download](https://github.com/simdo/rest.api/archive/master.zip) source project files

* Create environment file `env.json` on the root project folder
```
touch env.json
```

* Put the following code into `env.json`
```json
{
  "product"     : "RESTful API Service",
  "company"     : "Company Name, LLC",
  "api"         : {
    "version"   : "v1.0"
  },
  "port"        : 3000,
  "hosts"       : {
    "api"       : "api.domain.name",
    "app"       : "app.domain.name"
  },
  "environment" : "development",
  "mongodb"     : "mongodb://user:password@id.mlab.com:port/dbname",
  "secret"      : "Some super sercet string for JSON Web token",
  "postmark"    : {
    "secret"    : "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "welcome"   : 1272561,
    "reset"     : 1272761,
    "password"  : 1279242,
    "security"  : 1279241
  },
  "from_email"  : "Service Robot <robot@domain.name>",
  "to_email"    : "support@domain.name"
}
```

* Start project
```
node index.js
```

* Use for example [Postman](https://www.getpostman.com/) for test you Restful API server

### Change Log

This project adheres to [Semantic Versioning](http://semver.org/).
Every release, along with the migration instructions, is documented on the Github [Releases](https://github.com/simdo/api/releases) page.

### License

MIT