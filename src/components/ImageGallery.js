import { promisifyImageLoad, updateLabel } from "../utility/helper";
import { ImgMetaDataAPI, ImgMetaData } from "../utility/ImgMetaDataAPI";

export default class ImageGallery {
  constructor(shadowDOMContainer) {
    this.shadowDocument = shadowDOMContainer.container;
    this.shadowRoot = shadowDOMContainer.shadowRoot;
    this.showLoader = true;
    this.galleryImageMap = new Map();

    // Defined here to grab the correct invocation context (this) when invoked from inside the proxy
    const updateSidebar = (size) => {
      this.shadowDocument.querySelector("#send-btn").disabled = !(size > 0);
      updateLabel(this.shadowDocument, "selected-images", size);
    };

    // Upload button is dependent on the amount of images user has selected
    this.selectedImages = new Proxy(new Map(), {
      get(target, property) {
        if (property === "size") {
          return target.size;
        }

        if (property === "set" || property === "delete") {
          const operator = { set: 1, delete: -1 };
          const size = target.size + operator[property];
          updateSidebar(size);
        }

        let value = Reflect.get(...arguments);
        return typeof value === "function" ? value.bind(target) : value;
      },
    });

    const handleMutatedNodes = (node) => {
      const name = node.tagName.toLowerCase();
      let results = null;

      switch (name) {
        case "img":
          results = [
            new ImgMetaData(node.src, node.alt, node.width, node.height),
          ];
          break;
        case "div":
          results = ImgMetaDataAPI.getImgMetaData(node);
          break;
      }

      if (!results || !results.length) return;

      results = results.reduce((accum, image) => {
        if (this.galleryImageMap.has(image.src)) {
          return accum;
        }

        this.galleryImageMap.set(image.src, image);
        accum.push(image);
        return accum;
      }, []);

      this.loadImagesOntoGallery(results);
    };

    this.observer = new MutationObserver((mutationList) => {
      for (let mutation of mutationList) {
        if (mutation.type === "childList") {
          [].forEach.call(mutation.target.children, handleMutatedNodes);
        }
      }
    });
  }

  init(domain) {
    const imageResults = ImgMetaDataAPI.getImgMetaData(document, domain);
    console.log(imageResults);
    // Store images in a Map for quick storage & retrievals to avoid storing duplicate image links
    for (const image of imageResults) {
      this.galleryImageMap.set(image.src, image);
    }

    this.loadImagesOntoGallery(imageResults);

    // Set up event listener for sending / uploading photos to drive
    this.shadowRoot
      .querySelector("#send-btn")
      .addEventListener("click", () => this.uploadPhotos());

    this.observer.observe(document.body, {
      characterData: false,
      childList: true,
      subtree: true,
      attributes: false,
    });
  }

  generateImageTiles(images) {
    let pImages = [];

    for (let index = 0; index < images.length; index++) {
      const image = images[index];
      const tileImage = document.createElement("img");

      // Assign the image src to the newly created tags
      tileImage.setAttribute("src", image.src);
      tileImage.setAttribute("alt", image.alt);

      // Add informative datasets to the tag
      tileImage.dataset.index = index;
      tileImage.dataset.metadata = JSON.stringify({
        alt: image.alt,
        width: image.width,
        height: image.height,
      });

      // Add overlay tile classes to darken the background of selected images
      tileImage.classList.add("tile");
      tileImage.addEventListener("click", this.onImageSelected.bind(this));

      pImages.push(promisifyImageLoad(tileImage));
    }

    return pImages;
  }

  addImagesToGallery(loadedImages) {
    const [showcase, loader] = this.shadowDocument.querySelectorAll(
      ".gallery__showcase, .gallery__loader"
    );

    // Remove loader after initial page and images load
    if (this.showLoader) {
      loader.parentNode.removeChild(loader); // Loader suicides
      this.showLoader = false;
    }

    for (const image of loadedImages) {
      // Add inner div as a layer over the image
      const layer = document.createElement("div");
      layer.classList.add("tile__layer");
      layer.appendChild(image);

      // Tile added to gallery
      showcase.appendChild(layer);
    }

    updateLabel(this.shadowDocument, "total-images", this.galleryImageMap.size);
  }

  /**
   * Generate image tiles for the gallery while removing broken src links
   */
  loadImagesOntoGallery(images) {
    if (!(images.length > 0)) return;

    // Collect list of broken images / successfully loaded ones
    const pTileImages = this.generateImageTiles(images);

    // Inject the successfully loaded images onto the gallery, dismiss broken images
    Promise.allSettled(pTileImages)
      .then((results) => {
        return results.reduce((accum, image) => {
          if (image.status === "fulfilled") {
            accum.push(image.value);
          }

          return accum;
        }, []);
      })
      .then((filteredResults) => this.addImagesToGallery(filteredResults));
  }

  onImageSelected(e) {
    const { index } = e.target.dataset;

    if (e.target.parentElement.classList.contains("tile--selected")) {
      this.selectedImages.delete(index);
    } else {
      this.selectedImages.set(index, e.target);
    }

    e.target.parentElement.classList.toggle("tile--selected");
  }

  /**
   * Prompt background script to upload the selected images from the sidebar
   */
  uploadPhotos() {
    const uploadImages = [];

    for (const [_, image] of this.selectedImages) {
      uploadImages.push({
        src: image.src,
        metadata: image.dataset.metadata,
      });
    }

    console.log(uploadImages);

    chrome.runtime.sendMessage(
      {
        command: "UPLOAD_IMAGES",
        uploadImages,
      },
      (value) => {
        console.log(value);
      }
    );
  }
}
