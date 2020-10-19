import { GOOGLE_API } from '../utility/constants';

/**
 * Create root folder to store uploaded images
 * @param {String} url - API url
 * @param {String} token - Access token to call GDrive APIs
 */
const createGDriveFolder = (url, token) => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mimeType: GOOGLE_API.QueryFolder,
      name: GOOGLE_API.RootFolderName,
    }),
  };

  return fetch(url, options)
    .then((response) => response.json())
    .then((json) => json.id);
};

/**
 * Find and create a "Image Extension" folder if it doesn't current exist
 * Reference: https://developers.google.com/drive/api/v3/ref-search-terms
 * @param {String} token - Access token to call GDrive APIs
 */
export const retrieveGDriveFolderId = (token) => {
  const url = new URL(GOOGLE_API.RequestUri);

  url.searchParams.append(
    'q',
    `mimeType='${GOOGLE_API.QueryFolder}' and trashed = false`
  );

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  };

  return fetch(url, options)
    .then((response) => response.json())
    .then((json) => {
      // TODO: Are we certain our file will always be the first in the list?
      // Might need to verify if folder can be found in any index position
      const [file] = json.files;

      if (file && file.name === GOOGLE_API.RootFolderName) {
        return file.id;
      } else {
        return createGDriveFolder(url, token);
      }
    });
};

/**
 * Generate random string using algorithm provided in the link.
 * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 */
export const generateRandomString = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

/**
 * Convert decimal (base10) integer to hexadecimal (base16) integer.
 * @param {Number} dec - Decimal (base10) integer
 */
function dec2hex(dec) {
  return ('0' + dec.toString(16)).substr(-2); // Return the beginning two indices only
}

/**
 * Generate high-entropy cryptographic random string using the browser's crypto module.
 */
function generateCodeVerifier() {
  const buffer = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(buffer);
  return Array.from(buffer, dec2hex).join('');
}

/**
 * SHA265 cryptographic hash function 
 * Reference: https://docs.cotter.app/sdk-reference/api-for-other-mobile-apps/api-for-mobile-apps
 * @param {String} plain - Plaintext string being hashed
 * @returns {Promise} ArrayBuffer
 */
function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

/**
 * Base64Url encode the hash value, to avoid reserved character conflict with http headers, file system names, etc.
 * @param {String} hash - SHA256 hash value
 */
function base64UrlEncode(hash) {
  const str = "";
  const bytes = new Uint8Array(hash);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i]);
  }

  // Base64Url is essentially Base64 encoding with these "reserved" character replacements
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * The code challenge is constructed from the code verifier through a series of hashing and encoding. 
 * @param {String} codeVerifier - The pseudo-randomly generated string
 * @returns {String} - Base64Url encoded hash of the original code verifier value
 */
async function generateCodeChallenge(codeVerifier) {
  const hashed = await sha256(codeVerifier);
  return base64UrlEncode(hashed);
}

/**
 * Generate code challenge by generating random, then hashed using SHA256 and finally base64 url encoded
 * @returns {String[]} Tuple of the code verifier and code challenge in that respective order
 */
export const generateCodeVerifierAndChallenge = async () => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  return [codeVerifier, codeChallenge];
};
