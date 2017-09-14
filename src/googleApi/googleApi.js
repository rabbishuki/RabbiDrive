// Every error in this file will be throw to the resolver and he will need to handle it

var google = require('googleapis');
var drive = google.drive('v3');

// Getting all files from the google drive
var getFileById = (auth, fileID) => {
  return new Promise (function(resolve, reject) {
    drive.files.get({
      fileId: fileID,
      auth: auth,
      fields: "id, name, mimeType,iconLink"
    }, function(err, response) {
      if (err) {
        return resolve('The API returned an error: ' + err);
      }
      if (response.length == 0) {
        resolve('No files found.')
      } else {
        resolve(response)
      }
    })
  });
}

// Getting all files from the google drive
var getFiles = (auth) => {
  return new Promise (function(resolve, reject) {
    drive.files.list({
      auth: auth,
      fields: "nextPageToken, files(id, name, mimeType,iconLink)"
    }, function(err, response) {
      if (err) {
        return resolve('The API returned an error: ' + err);
      }
      if (response.files.length == 0) {
        resolve('No files found.')
      } else {
        resolve(response.files)
      }
    })
  });
}

// Getting files by a specific parameter
var searchFile = (auth, params) => {
  return new Promise (function(resolve, reject) {
    let searchQuery = params.searchQuery;
    drive.files.list({
        q: searchQuery,
        fields: 'files(kind, id, name, mimeType,iconLink)',
        auth: auth
    }, function (err, response) {
        if(err) {
          return resolve('The API returned an error: ' + err);
        } else {
          if (response.files.length == 0) {
            resolve('No files found.');
          } else {
            resolve(response.files)
          }
        }
    });
  });
}

// Adding tag to file at the google drive
var addTag = (auth, params) => {
  return new Promise (function(resolve, reject) {
    var fileID = params.fileID;
    var fileMetadata = {
        'properties': { "tag": params.tagName }
    };

    drive.files.update({
        fileId: fileID,
        resource: fileMetadata,
        fields: 'id',
        auth: auth
    }, function (err, file) {
        if (err) {
            return resolve('The API returned an error: ' + err);
        } else {
            resolve("success!");
        }
    });
  });
}

module.exports = {
    getFiles: getFiles,
    addTag: addTag,
    searchFile: searchFile,
    getFileById:getFileById
}