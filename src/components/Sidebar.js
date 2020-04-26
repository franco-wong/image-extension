import ShadowDOMContainer from "./ShadowDOMContainer";
import { promisifyImageLoad, updateLabel } from "../utility/helper";

const SidebarStyles = {
  height: "100%",
  position: "fixed",
  right: "-400px",
  top: "0",
  width: "400px",
  zIndex: "9001",
  transition: "all 225ms ease-in-out 0ms",
};

/**
 * Sidebar component with built-in logic and styles
 */
export default class Sidebar {
  constructor() {
    this.shadowDOMContainer = new ShadowDOMContainer();
    this.isShown = false;
    this.inActiveElement = this.addInActiveSurfaceElement();

    // Defined here to grab the correct invocation context (this) when invoked from inside the proxy
    const updateSidebar = (size) => {
      this.shadowDOMContainer.container.querySelector("#send-btn").disabled = !(
        size > 0
      );
      updateLabel(this.shadowDOMContainer.container, "selected-images", size);
    };

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
  }

  // To shadow the background when the drawer is open
  addInActiveSurfaceElement() {
    const inActiveSurfaceElement = document.createElement("div");

    inActiveSurfaceElement.css({
      backgroundColor: "rgba(0, 0, 0)",
      bottom: "0",
      left: "0",
      opacity: "0",
      position: "fixed",
      right: "0",
      top: "0",
      transition: "all 225ms cubic-bezier(0.4, 0, 0.2, 1) 225ms",
      zIndex: "-1",
    });

    document.body.prepend(inActiveSurfaceElement);

    return inActiveSurfaceElement;
  }

  async init() {
    return await this.shadowDOMContainer.init(SidebarStyles);
  }

  loadImagesOntoGallery(images) {
    const [
      showcase,
      loader,
    ] = this.shadowDOMContainer.container.querySelectorAll(
      ".gallery__showcase, .gallery__loader"
    );
    let pImages = [];

    // Make each image unique, add listeners to be used to later to shake off broken images
    for (let index = 0; index < images.length; index++) {
      const image = images[index];
      const tileImage = document.createElement("img");
      tileImage.setAttribute("src", image.src);
      tileImage.setAttribute("alt", "");
      tileImage.dataset.index = index;
      tileImage.classList.add("tile");
      tileImage.addEventListener("click", this.onImageSelected.bind(this));
      // Collect list of broken images / successfully loaded ones
      pImages.push(promisifyImageLoad(tileImage));
    }

    // Inject the loaded images onto the gallery, dismiss broken images
    Promise.allSettled(pImages)
      .then((results) => results.filter(({ status }) => status === "fulfilled"))
      .then((loadedImages) => {
        loader.parentNode.removeChild(loader); // Loader suicides

        for (const { value: image } of loadedImages) {
          const layer = document.createElement("div"); // Add inner div as a layer over the image
          layer.classList.add("tile__layer");
          layer.appendChild(image);
          showcase.appendChild(layer); // Tile added to gallery
        }

        updateLabel(
          this.shadowDOMContainer.container,
          "total-images",
          loadedImages.length
        );
      });
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

  // Toggle opening / closing sidebar

  openSidebar() {
    this.isShown = true;
    // Open sidebar gallery
    this.shadowDOMContainer.hostNode.css({
      right: "0",
    });
    // Add a dark shadow to the webpage
    this.inActiveElement.css({
      opacity: "0.5",
      zIndex: "9000",
    });
  }

  closeSidebar() {
    this.isShown = false;
    // Close sidebar gallery
    this.shadowDOMContainer.hostNode.css({
      right: "-400px", // Width of the host node
    });
    // Remove webpage shadow
    this.inActiveElement.css({
      opacity: "0",
      zIndex: "-1",
    });
  }
}
