# Node.js RESTful API Service based on Express.js 4

This is the RESTful API Service. It's base example include token authorisation and sample of CRUD (create, read, update, delete) operations.

### Getting started

0. To store user accounts we use `mongodb`.

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

3. Make some directories and create `index.js` file

```
mkdir controllers models routes
touch index.js
```

4. Put the following code into `index.js`

```js
// import packages that we need
var express     = require('express');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

// import out api routes
var users       = require('./routes/users'); 
var items       = require('./routes/items');

// define app using express.js
var app         = express();

// [Use native promises for backwards compatibility. Mongoose 4 returns mpromise promises by default.](http://mongoosejs.com/docs/promises.html)
mongoose.Promise = global.Promise;

// connect to local mongodb by default if it not specified in env
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/restapi');

// get mongoose connection instance
var dbi = mongoose.connection;
dbi.on('error', console.error.bind(console, 'Connection error:'));
dbi.once('open', function() {
  console.log('Connected to Database!');
});

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// set 8080 port as default if it not specified in env
app.set('port', process.env.PORT || 8080);

// register api routes
app.use('/', users);
app.use('/', items);

// start our rest api server
var server = app.listen(app.get('port'), function() {
  console.log('RESTful API server listening on port ' + server.address().port);
});

// prevent too long threshold
server.timeout = 2048;

```

5. 5
6. 6
7. 7

### Installations

### Change Log

This project adheres to [Semantic Versioning](http://semver.org/).
Every release, along with the migration instructions, is documented on the Github [Releases](https://github.com/simdo/api/releases) page.

### License

MIT