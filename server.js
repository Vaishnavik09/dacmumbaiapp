// Import dependency modules
var express = require('express');
var session = require('express-session');
var parseurl = require('parseurl');
var path = require('path');
var bodyParser = require('body-parser');

// Create an Express application
const app = express();

// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for parsing application/json
app.use(bodyParser.json());

// Configure session options
var sessionOptions = {
  secret: 'yourSecretKey', // Replace with your secure secret key
  resave: false, // Prevents session from being saved back to the store if it hasn't been modified
  saveUninitialized: true, // Save new sessions that haven't been modified yet
  cookie: {
    maxAge: 60000, // Session cookie expiration time in milliseconds
  },
};

// Use session middleware
app.use(session(sessionOptions));

// Example middleware to track session-based views
app.use((req, res, next) => {
  if (!req.session.views) {
    req.session.views = {};
  }

  // Get the pathname of the requested URL
  var pathname = parseurl(req).pathname;

  // Increment the count for this pathname
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;

  next();
});

// Example routes
app.get('/', (req, res) => {
  res.send('Welcome to the session-based Express app!');
});

app.get('/view', (req, res) => {
  res.send(
    `You have viewed this page ${req.session.views['/view'] || 0} times.`
  );
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
