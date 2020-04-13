import ShadowDOMContainer from './ShadowDOMContainer';
import { promisifyImageLoad, updateLabel } from '../utility/helper';

const SidebarStyles = {
  backgroundColor: 'transparent',
  height: '100%',
  position: 'fixed',
  right: '0',
  top: '0',
  width: '400px',
  zIndex: '9000'
};

/**
 * Sidebar component with built-in logic and styles 
 */
export default class Sidebar extends ShadowDOMContainer {
  constructor() {
    super(SidebarStyles);
    this.selectedImages = [];
  }

  loadImagesOntoGallery(images) {
    const [showcase, loader] = this.container.querySelectorAll('.gallery__showcase, .gallery__loader');
    let pImages = [];

    // Make each image unique, add listeners to be used to later to shake off broken images
    for (let index = 0; index < images.length; index++) {
      const image = images[index];
      const tileImage = document.createElement('img');
      tileImage.setAttribute('src', image.src);
      tileImage.setAttribute('alt', '');
      tileImage.dataset.index = index;
      tileImage.classList.add('tile');
      tileImage.addEventListener('click', this.onImageSelected.bind(this));
      // Collect list of broken images / successfully loaded ones
      pImages.push(promisifyImageLoad(tileImage));
    }

    // Inject the loaded images onto the gallery, dismiss broken images
    Promise.allSettled(pImages)
      .then(results => results.filter(({ status }) => status === 'fulfilled'))
      .then((filtered) => { // TODO: this is for test purposes, remove afterwards
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(filtered)
          }, 3000);
        })	
      })
      .then(loadedImages => {
        loader.parentNode.removeChild(loader); // Loader suicides
      
        for (const { value: image } of loadedImages) {
          const layer = document.createElement('div'); // Add inner div as a layer over the image
          layer.classList.add('tile__layer');
          layer.appendChild(image);
          showcase.appendChild(layer); // Tile added to gallery
        }
      
        updateLabel(this.container, 'total-images', loadedImages.length);
      });
  }

  onImageSelected(e) {
    if (e.target.parentElement.classList.contains('tile--selected')) {
      const { index } = e.target.dataset;
      this.selectedImages = this.selectedImages.filter(image => image.dataset.index !== index);
    }
    else {
      this.selectedImages.push(e.target);
    }
    
    e.target.parentElement.classList.toggle('tile--selected');
    updateLabel(this.container, 'selected-images', this.selectedImages.length);
  }

  // Toggle opening / closing sidebar

  openSidebar() {
    this.container.style.transition = "transform 0.4s ease-in-out";
    this.container.style.transform = "translateX(0)";
    this.isShown = true;
  }
  
  closeSidebar() {
    this.container.style.transform = "translateX(100%)";
    this.isShown = false;
  }
}
