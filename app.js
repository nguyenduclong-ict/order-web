const express = require('express');
require('dotenv').config();
const app = express();
const path = require('path');
// 
process.env.IMAGE_ROOT_PATH = path.join(__dirname, 'upload/images');


// Disable console.log
if(process.env.EVIRONMENT != 'DEV')
  console.log = function(){};

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
  extended: false
}))

// parse application/json
app.use(bodyParser.json())
// app.use(express.static('public'));

//
app.get('/', (req, res) => {
  res.send('Hello from Long NUCE');
  //console.log(req.session);
});

// setup router api
var apiRouter = require('./api/router');
app.use('/api', apiRouter);

// Error Handle
app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    res.json({
      error: err.message
    })
  }
});


app.listen(port, a => {
  console.log(`Server running on port ${port}`)
});


module.exports = app;