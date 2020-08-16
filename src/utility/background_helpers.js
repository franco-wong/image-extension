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
 * @param {String} token - Access token to call GDrive APIs
 */
export const retrieveGDriveFolderId = (token) => {
  // Query url
  const url = new URL(GOOGLE_API.RequestUri);
  url.searchParams.append('q', `mimeType='${GOOGLE_API.QueryFolder}'`);

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
