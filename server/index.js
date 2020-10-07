
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); // can now use process.env.CLIENT_SECRET
}
const express = require('express')
// const bodyParser = require('body-parser')
const fetch = require('node-fetch');
const cors = require('cors');

const app = express()
const port = 3002

const AuthDomain = "https://accounts.google.com/o/oauth2/auth"
app.use(cors())
app.use(express.json());
// var jsonParser = bodyParser.json()
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
  res.send('')
})

app.post('/token',  function (req, res) {
  console.log(req.body)
  let result = checkRequestParameters(req.body);
  if (result === 200) {
		let newParams = '';
		newParams += `client_id=${process.env.CLIENT_ID}`;
		newParams += `&redirect_uri=${encodeURI(
			req.body.redirect_uri
		)}`;
		newParams += `&grant_type=authorization_code`;
		newParams += `&code=${req.body.code}`;
		newParams += `&code_verifier=${req.body.code_verifier}`;
		newParams += `&client_secret=${process.env.CLIENT_SECRET}`;
	
		fetch('https://oauth2.googleapis.com/token', {
		  method: 'post',
		  body: newParams,
		  headers: { 'Content-type': 'application/x-www-form-urlencoded' },
		})
			.then((newResponse) => newResponse)
			.then()
	} else { // return Parameter error
		console.log("400 Bad request")
    res.send(`400 Bad Request`)
	}
})

/**
 * Error Codes
 * 
 * 400 - bad request
 * 200 - request success
 */
const REQUIRED_PARAMS = ['redirect_uri', 'grant_type', 'code', 'code_verifier']

function checkRequestParameters(body) {
	if (Object.keys(body).length !== 4) {
		return false
	}
  // content type === application/json
  for (let required_param of REQUIRED_PARAMS) {
		if (Object.keys(body).indexOf(required_param) === -1) return 400
	}
	return 200; 
}

app.listen(port, () => {
  console.log(`gd-sync-image-extension server listening at http://localhost:${port}`)
})