
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); // can now use process.env.CLIENT_SECRET
}
const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto');
const { response } = require('express');

const app = express()
const port = 3001

const AuthDomain = "https://accounts.google.com/o/oauth2/auth"

// var jsonParser = bodyParser.json()
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

let auth_map = new Map()

app.get('/', (req, res) => {
  res.send('')
})

app.post('/token',  function (req, res) {
  console.log(req.query)

  if (!checkRequestParameters(req.query)) {
    // return error
  }

  let newParams = '';
  newParams += `&client_id=${process.env.CLIENT_ID}`;
  newParams += `&redirect_uri=${encodeURI(
    req.query.redirect_uri
  )}`;
  newParams += `&grant_type=authorization_code`;
  newParams += `&code=${req.query.code}`;
  newParams += `&code_verifier=${req.query.code_verifier}`;
  newParams += `&client_secret=${process.env.CLIENT_SECRET}`;

  // fetch('https://oauth2.googleapis.com/token', {
  //   method: 'post',
  //   body: newParams,
  //   headers: { 'Content-type': 'application/x-www-form-urlencoded' },
  // })
  //   .then((newResponse) => {
  //     return newResponse.json()
  //   })
  //   .then((response) => {
  //     return response
  //   })
  res.send('hello')
})

/**
 * Error Codes
 * 
 * 404 - 
 * 401 - Unauthorized request
 * 200 - request success
 * Default - 500 - Internal Server Error
 */
const REQUIRED_PARAMS = ["redirect_uri", "grant_type", "code", "code_verifier", "content_type"]

function checkRequestParameters(parameters) {
  if (parameters.length !== 5) return false
  // content type === application/json
  for (let required_param in required_params) {
    if (required_param in parameters) continue;
    return false; // will expand on the errors
  }
}

app.listen(port, () => {
  console.log(`gd-sync-image-extension server listening at http://localhost:${port}`)
})