export function fetchResourceString(filename) {
  const url = chrome.runtime.getURL(filename);

  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.text();
      }
      else {
        Promise.reject(response.statusText);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}