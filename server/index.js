if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); // can now use process.env.CLIENT_SECRET
}

const express = require('express')
const fetch = require('node-fetch');
const cors = require('cors');
const app = express()
const port = 3002
const AuthDomain = "https://accounts.google.com/o/oauth2/auth"

app.use(cors())
app.use(express.json());

app.post('/token', async (req, res) => {
	const REQUIRED_PARAMS = ['redirect_uri', 'grant_type', 'code', 'code_verifier']
	const params = Object.keys(req.body);
	const areFieldsValid = REQUIRED_PARAMS.every(field => params.includes(field));

	console.log(req.body);

	if (!areFieldsValid) {
		return res.status(400).json({
			message: 'Mandatory fields are missing.'
		});
	}

	let newParams = '';
	newParams += `client_id=${process.env.CLIENT_ID}`;
	newParams += `&redirect_uri=${req.body.redirect_uri}`;
	newParams += `&grant_type=authorization_code`;
	newParams += `&code=${req.body.code}`;
	newParams += `&code_verifier=${req.body.code_verifier}`;
	newParams += `&client_secret=${process.env.CLIENT_SECRET}`;

	try {
		const response = await fetch('https://oauth2.googleapis.com/token', {
			method: 'post',
			body: newParams,
			headers: { 'Content-type': 'application/x-www-form-urlencoded' },
		});
		const text = await response.json();
		res.status(200).json(text);
	}
	catch (error) {
		return res.status(400).json({
			message: 'Response could not be fulfilled'
		});
	}
})

app.listen(port, () => {
  console.log(`gd-sync-image-extension server listening at http://localhost:${port}`)
})
