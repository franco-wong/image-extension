export default {
  state: {
    images: new Map(), // id maps to image element (not reactive in Vue)
    imagesCount: 0,
    selectedImages: new Set(), // collection of image ids (not reactive in Vue)
    selectedImagesCount: 0,
    showApp: false, // showing the app modal
  },
  getters: {},
  mutations: {
    setShowApp(state, payload) {
      state.showApp = payload.status;
    },
    setImages(state, payload) {
      switch (payload.type) {
        case 'ADD': {
          const source = payload.element.src || payload.element.dataset.src;
          state.images = new Map(
            state.images.set(payload.element.src, payload.element)
          );
          state.imagesCount++;
          break;
        }
        case 'REMOVE': {
          const source = payload.element.src || payload.element.dataset.src;
          state.images = new Map(state.images.delete(source));
          state.imagesCount > 0 && state.imagesCount--;
          break;
        }
      }
    },
    setSelectedImages(state, payload) {
      console.log('payload', payload);
      let obj = {
        id: payload.id,
        imgSrc: payload.imgSrc,
      };
      switch (payload.type) {
        case 'ADD':
          state.selectedImages.add(JSON.stringify(obj));
          state.selectedImagesCount++;
          break;
        case 'REMOVE':
          state.selectedImages.delete(JSON.stringify(obj));
          state.selectedImagesCount > 0 && state.selectedImagesCount--;
          break;
      }
    },
    setUnselectAllImages(state) {
      for (let obj of state.selectedImages) {
        obj = JSON.parse(obj);
        let payload = {
          id: obj.id,
          imgSrc: obj.imgSrc,
        };
        state.selectedImages.delete(JSON.stringify(payload));

        state.images.get(obj.id).classList.remove('image-selected');
      }
      state.selectedImagesCount = 0;
    },
  },
  actions: {},
};
