var googleDrive = require('./googledrive');
var express = require('express');
var path = require('path');
var app = express();
var port = 3000

app.use(express.static(path.join(__dirname, '/src/client')));

// Interacting to google drive and get all files names and id`s
app.get("/getFiles", function(req, res) {
  googleDrive();
})

// Starting the node server
app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> Listening on http://localhost:%s/ ", port)
  }
})