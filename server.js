var googleDrive = require('./src/googleApi/googledrive');
var express = require('express');
var path = require('path');
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

var app = express();
var port = 3000

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.use(express.static(path.join(__dirname, '/src/client')));

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

// Interacting to google drive and get all files names and id`s
app.get("/addTag", function(req, res) {
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