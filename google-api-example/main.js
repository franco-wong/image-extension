window.onload = Init;

const CLIENT_ID = "422708725016-0hb05pfhev84hbd4nldvfkfrlbhmgmql.apps.googleusercontent.com";
const API_KEY = "AIzaSyAQy4Hn-qZyXowzxnuC9Q-f6BWe4rO6G7w";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

gapi.load('client', Init);

function OnConnectedToGoogleApi(recieved) {
    gapi.auth2.getAuthInstance().signIn();
    prompt('testing');

    const driveParms = {
        "pageSize": 10,
        "fields": "nextPageToken, files(id, name)"
    };

    gapi.client.drive.files.list(driveParms)
        .then((response) => {
            console.log(response);
        }, OnError);
}

function OnError(error) {
    console.log("Got an error");
    console.log(error);
}

function Init() {
    try {

        gapi.client.init({
            'apiKey': API_KEY,
            'discoveryDocs': DISCOVERY_DOCS,
            'clientId': CLIENT_ID,
            'scope': SCOPES
        }).then(OnConnectedToGoogleApi, OnError)

    }
    catch(e) {
        console.log(e);
    }

  console.log("Hello world");
}
