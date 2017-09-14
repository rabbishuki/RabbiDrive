var express = require('express');
var session = require('express-session');
var path = require('path');
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./webpack.config')
var getAuth = require('./src/googleApi/googledrive');
var googleApi = require('./src/googleApi/googleApi');
var Visitores = require('./models/Visitores.js');
var Users = require('./models/Users.js');
var Folder = require('./models/Folder.js');
var Tag = require('./models/Tag.js');
var app = express();
var port = process.env.PORT || 3000
var mongoose = require('mongoose');

mongoose.connect(process.env.mongoURL, function(err) {
  if (err) {
    handleError('Could not connect to mongodb. Ensure that mongodb accepts connections on standard ports!', err)
  }
});

var handleError = (type, err) => {
  console.log(type + " There has been an error: " + err)
}

// Configuring passport settings
passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
       // Checking if user is a member of the system
       Users.find({ 'id': profile.id}, (err, user)=> {
         if(!err) {
          if(user.length) {
            return done(err, user[0]._doc);
          } else {  // In case its new user adding him to the visitores collection
            let newVisitore = new Visitores({
                id: profile.id,
                displayName: profile.displayName,
                name: profile.name,
                gender: profile.gender,
                email: profile.emails[0].value,
                isAdmin: false
            })
            newVisitore.save((err)=> {
              if (err) {
                return ("passport", err)
              }
              return done(err, profile);
            })
          }
         }
         return ("passport", err);
       });
  }
));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  Users.find(user.prof, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
app.use(session({secret: "Shh, its a secret!"}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.use(express.static(path.join(__dirname, '/src')));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get("/getUserInfo", function (req, res) {
  if(req.session.passport) {
    res.send({username: req.session.passport.user})
  } else {
    res.send('no user login')
  }
})

// -- All google drive fetching.

// Interacting to google drive and get files names with id`s
app.post("/getFileById", function (req, response) {
  getAuth.Auth(googleApi.getFileById, req.body.fileId).then((res) => {
    var file = JSON.stringify(res);
    response.send(file);
  })
})

// Interacting to google drive and get files names with id`s
app.get("/getFiles", function (req, response) {
  getAuth.Auth(googleApi.getFiles).then((res) => {
    var files = JSON.stringify(res);
    response.send(files);
  })
})

// Interacting to google drive and get files by specific parameter
app.post("/search", function (req, response) {
  let params;
  if(req.body.tagName) {
    params = {searchQuery:"properties has { key='tag' and value= '" + req.body.tagName+"'}"};
  } else if (req.body.fileName) {
    params = {searchQuery:"name contains '" + req.body.fileName +"'"};
  } else if(req.body.folderId) {
    params = {searchQuery:"'"+ req.body.folderId + "' in parents"}
  } else {
    params = {searchQuery: req.body.folderContent}
  }
  getAuth.Auth(googleApi.searchFile, params).then((res) => {
    var resultsFiles = JSON.stringify(res);
    response.send(resultsFiles);
  })
})

// Interacting to google drive and add tag name to file
app.post("/addTag", function (req, response) {
  // !!! Need to check if tag alredy exist !!!

  var params = {fileID:req.body.fileId ,tagName: req.body.tagVal};
  getAuth.Auth(googleApi.addTag, params).then((res) => {
    var newTag = new Tag({name: req.body.tagVal})
    newTag.save();
    response.send(200)
  })
})

// -- Google oauth api`s, callback and etc

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect("/");
  });

// -- All db api`s

// Interacting to db and gets tags list
app.get("/getTags", function (req, res) {
    Tag.find((err, tags)=> {
     if(err) {
          return handleError("Getting tags list from the db", err)
          res.send(400, err)
     }
     res.send({tags: tags});
    });
})

// Interacting to db and gets folders data
app.get("/getFolders", function (req, res) {
    Folder.find((err, folders)=> {
     if(err) {
        return handleError("Getting folders from db", err)
        res.send(400, err)
     }
     res.send({folders: folders});
    });
})

// Interacting to db and gets folders data
app.post("/saveFolder", function (req, res) {
    var folder = new Folder({name: req.body.name, icon: req.body.icon, content: req.body.content});
    folder.save(
      function (err) {
        if (err) {
          return handleError("saving folder to db", err)
          res.send(400, err)
        }
        else 
          res.send(200)
    })
})

// Interacting to db and gets folders data
app.post("/updateFolder", function (req, res) {
  Folder.findByIdAndUpdate(req.body.folderID, { $set: { name: req.body.name, 
                                                        icon: req.body.icon,
                                                        content:req.body.content}},
                                                        { new: true },
  function (err, folder) {
  if (err) {
    return handleError("Updating folder in db", err);
    res.send(400, err)
  }
  res.send(folder);
  });
})

// Interacting to db and gets folders data
app.post("/deleteFolder", function (req, res) {
  Folder.remove({ _id: req.body.folderID }, function (err) {
    if (err) {
      return handleError("Deleting folder from db",err);
      res.send(400, err)
    }
    res.send("removed!")
  });
})


// Starting the node server
app.listen(port, function (error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> Listening on http://localhost:%s/ ", port)
  }
})
