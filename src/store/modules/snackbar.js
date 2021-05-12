// Module for calling a snackbar
// Should be called only using the show ACTION, not MUTATION. If calling using
// the mutation, in case of snackbar overlapping, closing animation will not be
// shown and the time to close will be shared between the overlapping snackbars

import constant from '@/services/constant';

const DEFAULT_TIMEOUT = 3000;
const DEFAULT_ERROR_TIMEOUT = 5000;

export default {
  namespaced: true,

  state: {
    isVisible: false,
    type: null,
    title: null,
    message: null,
    timeout: null,
  },

  mutations: {
    show(state, details) {
      // Switching isVisible to true shows the snackbar with the passed details
      state.isVisible = true;
      state.type = details.type;
      state.title = details.title || details.type;
      state.message = details.message;
      state.timeout = details.timeout
        || (details.type === 'error' ? DEFAULT_ERROR_TIMEOUT : DEFAULT_TIMEOUT);
    },

    hide(state) {
      state.isVisible = false;
    },
  },

  actions: {
    // Showing a new snackbar with hiding a currently shown one
    // Accepts payload with snackbar details object with properties:
    // type - can be one of the available types defined above (mandatory)
    // title - string with snackbar title. If not provided, type is used instead
    // message - string with snackbar message
    // timeout - amount of time snackbar is visible. Default is defined above
    show({ state, commit }, details) {
      // Throwing an error if the passed snackbar type is now correct
      if (!constant.snackbarTypes[details.type]) {
        throw new Error('Incorrect snackbar type');
      }

      // If there is a currently visible snackbar, hiding it and waiting 0.3 sec
      // for closing animation to complete
      if (state.isVisible) {
        commit('hide');
        setTimeout(() => {
          commit('show', details);
        }, 300);
      } else {
        commit('show', details);
      }
    },
  },
};
