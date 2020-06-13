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
        case 'ADD':
          state.images.set(payload.id, payload.element);
          state.imagesCount++;
          break;
        case 'REMOVE':
          state.images.delete(payload.id);
          state.imagesCount > 0 && state.imagesCount--;
          break;
      }
    },
    setSelectedImages(state, payload) {
      switch (payload.type) {
        case 'ADD':
          state.selectedImages.add(payload.id);
          state.selectedImagesCount++;
          break;
        case 'REMOVE':
          state.selectedImages.delete(payload.id);
          state.selectedImagesCount > 0 && state.selectedImagesCount--;
          break;
      }
    },
  },
  actions: {},
};
