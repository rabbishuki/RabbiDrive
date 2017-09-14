var fs = require('fs');
var axios = require('axios');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly',
'https://www.googleapis.com/auth/drive',
'https://www.googleapis.com/auth/drive.file',
'https://www.googleapis.com/auth/drive.appdata',
'https://www.googleapis.com/auth/drive.scripts',
'https://www.googleapis.com/auth/drive.metadata'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

exports.Auth = function(callback, params) {
    // Load client secrets from a local file.
    return new Promise (function(resolve, reject) {
      fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
      }
      // Authorize a client with the loaded credentials, then call the
      // Drive API.
      resolve(authorize(JSON.parse(content), callback, params));
    })
  });
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, params) {
  var clientSecret = credentials.web.client_secret;
  var clientId = credentials.web.client_id;
  var redirectUrl = credentials.web.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  return new Promise (function(resolve, reject) {
    fs.readFile(TOKEN_PATH, function(err, token) {
      if (err) {
        getNewToken(oauth2Client, callback, params);
      } else {
        oauth2Client.credentials = JSON.parse(token);
        resolve(callback(oauth2Client, params));
      }
    })
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback, params) {
  const refresh_token = process.env.refreshToken;
  const client_id = process.env.clientID;
  const client_secret = process.env.clientSecret;
  const refresh_url = "https://www.googleapis.com/oauth2/v4/token";

  const post_body = `grant_type=refresh_token&client_id=${encodeURIComponent(client_id)}&client_secret=${encodeURIComponent(client_secret)}&refresh_token=${encodeURIComponent(refresh_token)}`;

  axios({
    method: 'post',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    data: post_body,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
    .then(function (response) {
      oauth2Client.credentials = response.data;
      storeToken(oauth2Client.credentials);
      callback(oauth2Client, params);
    })
    .catch(function (error) {
      console.log(error);
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}