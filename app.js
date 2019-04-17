const express = require('express');
require('dotenv').config();
const app = express();
const path = require('path');
const Error = require('./helpers/Error');
// 
process.env.IMAGE_PATH = 'upload/images'
process.env.TMP_PATH = 'tmp';
process.env.UPLOAD_PATH = 'upload';
process.env.ROOT_PATH = __dirname;

// Disable console.log
if (process.env.EVIRONMENT != 'DEV')
  console.log = function () {};

// Express session
var session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET || 'aaa',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true
  }
}));


//user cors
var cors = require('cors')
app.use(cors());
// Get port 
const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}))

// parse application/json
app.use('/api', bodyParser.json())
app.use(express.static('public'));


//
app.get('/', (req, res) => {
  res.send('API for foody');
  //console.log(req.session);
});

// setup router api
var apiRouter = require('./api/router');
app.use('/api', apiRouter);

// Error Handle
app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    if (err.code) {
      res.json(err.code).json({
        error: err.message
      });
    } else
      res.status(500).json({
        error: 'Lỗi không xác định!'
      });
  }
});


app.listen(port, a => {
  console.log(`Server running on port ${port}`)
});


module.exports = app;