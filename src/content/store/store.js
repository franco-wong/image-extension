import Vue from 'vue';

export default {
  state: {
    imagesMap: {},
    selectedImageMap: {},
    showApp: false,
  },
  getters: {
    imagesCount(state) {
      return Object.keys(state.imagesMap).length;
    },
    selectedImagesCount(state) {
      return Object.keys(state.selectedImageMap).length;
    },
  },
  mutations: {
    setShowApp(state, payload) {
      state.showApp = payload.status;
    },
    setImages(state, payload) {
      switch (payload.type) {
        case 'ADD': {
          state.imagesMap = {
            ...state.imagesMap,
            [payload.uniqueId]: payload.element,
          };
          break;
        }
      }
    },
    selectImage(state, payload) {
      state.selectedImageMap = {
        ...state.selectedImageMap,
        [payload.id]: payload.element,
      };
    },
    unselectImage(state, payload) {
      Vue.delete(state.selectedImageMap, payload.id);
    },
    unselectAllImages(state) {
      state.selectedImageMap = {};
    },
  },
  actions: {},
};
