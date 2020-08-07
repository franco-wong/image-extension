export default {
  state: {
    imagesMap: {},
    showApp: false,
  },
  getters: {
    imagesCount(state) {
      return Object.keys(state.imagesMap).length;
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
  },
  actions: {},
};
