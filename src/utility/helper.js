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

export function promisifyImageLoad(image) {
  return new Promise((resolve, reject) => {
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', reject);
  });
}

export function updateLabel(element = document, id, value) {
  element.querySelector(`#${id}`).textContent = value;
}