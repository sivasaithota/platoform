// Module for the specific application related state

import axios from 'axios';
import constant from '@/services/constant';
import message from '@/services/message';

export default {
  namespaced: true,

  state: {
    id: null,
    name: '',
    displayName: '',
    description: '',
    author: '',
    url: '',
    status: '',
    nameAsyncErrors: [], // App name errors returned from the server
    database: {},
    userDetails: {},
    appTheme: {},
    colorSchemeIndex: 0,
    themeList: [],
    segments: [],
    scenarios: [],
    isPrivate: false,
    isFreshDeployed: false,
    version: '',
  },

  getters: {
    // Checking if app name contains not allowed characters
    checkAppNamePattern: (state) => (appName) => {
      return /^[a-zA-Z0-9- ]+$/.test(appName || state.name);
    },
    checkAppNameLength: (state) => (appName) => {
      return (appName || state.name || '').length <= 100;
    },
  },

  mutations: {
    updateId(state, id) {
      state.id = id;
    },

    updateName(state, name) {
      state.name = name;
    },

    updateAppDetails(state, details) {
      state.name = details.name;
      state.displayName = details.displayName;
      state.description = details.description;
    },

    updateAppUrl(state, details) {
      state.url = details;
    },

    updateDBDetails(state, details) {
      state.database = details;
    },

    updateAppVersion(state, details) {
      state.version = details;
    },

    updateUserDetails(state, details) {
      state.userDetails = details;
    },

    updateAppAuthor(state, details) {
      state.author = details;
    },

    updateNameAsyncErrors(state, errors = []) {
      state.nameAsyncErrors = errors;
    },

    updateAppTheme(state, theme) {
      // Saving selected color scheme index
      if (theme.colorIndex !== undefined) state.colorSchemeIndex = theme.colorIndex;

      // Finding the selected theme in the list of themes
      state.appTheme = state.themeList.find(val => val._id === theme.id) || theme;
    },

    updateThemeList(state, details) {
      // Resolving paths to the images for each theme
      details.forEach(theme => {
        if (theme.group === constant.themeGroups.custom) {
          const themeApi = `${constant.api.enframe}themes/`;

          // If theme is a custom one, generating URLs to the theme images stored on the server
          theme.images.backgroundUrl = `${themeApi}${theme._id}/images?type=${constant.themeImageTypes.background}`;

          // Updating URL to logo image only if it exists
          if (theme.images.logo) {
            theme.images.logoUrl = `${themeApi}${theme._id}/images?type=${constant.themeImageTypes.logo}`;
          }

          // Updating URL to icon image only if it exists
          if (theme.images.icon) {
            theme.images.iconUrl = `${themeApi}${theme._id}/images?type=${constant.themeImageTypes.icon}`;
          }
        } else {
          // In other case need to resolve path to the appropriate image thumbnail
          // eslint-disable-next-line global-require, import/no-dynamic-require
          theme.images.backgroundUrl = require(`@/assets/images/theme/thumbnails/${theme.images.background}`);
        }
      });

      state.themeList = details;
    },

    // Updating particular theme data in the theme list
    updateTheme(state, { themeId, data }) {
      const theme = state.themeList.find(val => val._id === themeId);
      theme.name = data.name;
      theme.colorSchemes = data.colorSchemes;
      theme.disableFooter = data.disableFooter;
    },

    // Updating particular theme image data in the theme list
    updateThemeImage(state, details) {
      const theme = state.themeList.find(val => val._id === details.themeId);
      theme.images[details.type] = details.file.name;
      theme.images[`${details.type}Url`] = details.image;
    },

    addTheme(state, theme) {
      state.themeList.push(theme);
    },

    updateSegments(state, details) {
      state.segments = details;
    },

    updatePrivacy(state, details) {
      state.isPrivate = details;
    },

    updateStatus(state, data) {
      state.status = data;
    },

    updateScenarios(state, scenarios = []) {
      state.scenarios = scenarios;
    },

    updateIsFreshDeployed(state) {
      state.isFreshDeployed = true;
    },
    updateAppScopes(state, data) {
      state.scopes = data;
    },
  },

  actions: {
    // Sending request to the server to create new application
    createNewApp({ commit }, details) {
      commit('updateName', details.appName);

      // Combining form data to send
      const formData = new FormData();
      formData.append('jsonData', JSON.stringify({ name: details.appName }));
      if (details.file) {
        formData.append('fileData', details.file, details.file.name);
      } else {
        formData.append('fileData', details.archive, 'app.zip');
      }
      const params = {
        detectDatatypes: details.detectDatatypes,
        appFormat: details.appFormat,
        normalizeTitles: details.normalizeTitles,
      };
      return axios.post(
        `${constant.api.enframe}apps`,
        formData,
        { params },
      ).then(({ data }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.success,
          title: constant.snackbarTypes.success,
          message: message.createNewApp.appCreatedSuccessfully,
        });

        commit('updateId', data.result.id);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.createNewApp.errorCreatingApp,
          message: response.data.message,
        });

        throw response.data.message;
      });
    },

    // Fetching application details from the server
    getDetails({ commit }, details) {
      const params = {
        step: constant.appSteps.application,
      };

      // Clearing state before fetching the details
      commit('updateAppDetails', {});
      commit('updateId');
      commit('updateAppUrl');
      commit('updateAppAuthor');
      commit('updateDBDetails', {});
      commit('updateAppVersion');
      commit('updateUserDetails', {});
      commit('updateAppTheme', {});
      commit('updateSegments', []);
      commit('updateStatus');
      commit('updatePrivacy');

      return axios
        .get(
          `${constant.api.enframe}apps/${details.appId}`,
          { params },
        )
        .then(({ data }) => {
          commit('updateAppDetails', data.result);
          commit('updateId', data.result._id);
          commit('updateAppUrl', data.result.url);
          commit('updateAppAuthor', data.result.createdBy);
          commit('updateDBDetails', data.result.database);
          commit('updateUserDetails', data.result.login);
          commit('updateAppTheme', data.result.theme);
          commit('updateSegments', data.result.segments);
          commit('updateStatus', data.result.status);
          commit('updatePrivacy', data.result.isPrivate);
          commit('updateAppVersion', data.result.version);
        })
        .catch(({ response }) => {
          this.dispatch('snackbar/show', {
            type: constant.snackbarTypes.error,
            title: message.inputOutput.errorFetchingData,
            message: response.data.message,
          });
        });
    },

    // Fetching application scopes from the server
    getScopes({ commit }, details) {
      // Clearing state before fetching the details
      commit('updateAppScopes', []);

      return axios
        .get(
          `${constant.api.enframe}apps/${details.appId}/scopes`,
        )
        .then(({ data }) => {
          commit('updateAppScopes', data.result);
        })
        .catch(({ response }) => {
          this.dispatch('snackbar/show', {
            type: constant.snackbarTypes.error,
            title: message.appDetails.errorFetchingScopes,
            message: response.data.message,
          });
        });
    },

    // Sending application details to the server
    saveDetails({ commit, rootState }, details) {
      return axios.patch(
        `${constant.api.enframe}apps/${details.appId || rootState.application.id}`,
        details.params,
      ).then(() => {
        if (details.params.name) commit('updateAppDetails', details.params);
        if (details.params.url) commit('updateAppUrl', details.params.url);
        if (details.params.database) commit('updateDBDetails', details.params.database);
        if (details.params.login) commit('updateUserDetails', details.params.login);
        if (details.params.segments) commit('updateSegments', details.params.segments);
        if (details.params.theme) commit('updateAppTheme', details.params.theme);
        if (details.params.isPrivate) commit('updatePrivacy', details.params.isPrivate);

        if (!details.silent) {
          this.dispatch('snackbar/show', {
            type: constant.snackbarTypes.success,
            title: constant.snackbarTypes.success,
            message: message.common.dataSaved,
          });
        }
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.common.errorSavingData,
          message: response.data.message,
        });
        throw response;
      });
    },

    // Uploading files for the app based on the folder name
    uploadConfig(store, details) {
      const formData = new FormData();
      details.files.forEach(file => {
        formData.append('fileData', file);
      });

      return axios.post(
        `${constant.api.enframe}apps/${details.appId}/config`,
        formData,
      ).then(({ data }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.success,
          title: 'Success',
          message: data.result,
        });
      }).catch(({ response }) => {
        this.showSnackbar({
          type: constant.snackbarTypes.error,
          title: message.common.errorUploadingFile,
          message: response.data.message,
        });
      });
    },

    // Checking uniqueness of some value
    // Action expects params object with the following properties:
    // type - 'application' or 'table'
    // params - query params to check uniqueness against. E.g. 'name' for the 'application' type to check app name uniqueness
    checkValueUniqueness(store, { type, params }) {
      return axios.get(
        `${constant.api.enframe}checkUnique/${type}`,
        { params },
      ).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.createNewApp.errorCheckingUniqueness,
          message: response.data.message,
        });
      });
    },

    // Checking app name uniqueness
    checkAppNameUniqueness({ state, dispatch, commit }, appName) {
      // Removing error message if app name is not changed
      if (appName === state.name) {
        commit('updateNameAsyncErrors');
        return;
      }

      if (appName.length > 100) {
        commit('updateNameAsyncErrors', [message.createNewApp.appNameTooLong]);
        return;
      }

      dispatch('checkValueUniqueness', {
        type: constant.checkUniqueness.type.app,
        params: { name: appName },
      }).then(({ data }) => {
        // Adding or removing error message basing on the check result
        commit('updateNameAsyncErrors', data.result.isUnique ? null : [message.createNewApp.appNameExists]);
      });
    },

    // Getting available themes for app
    getThemes({ state, commit }) {
      return axios.get(
        `${constant.api.enframe}themes`,
      ).then(({ data }) => {
        commit('updateThemeList', data.result);
        commit('updateAppTheme', state.appTheme);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.parameters.gettingTypesError,
          message: response.data.message,
        });
      });
    },

    // Creating custom theme
    createTheme({ commit, dispatch }, { details, archive, images }) {
      // Combining form data to send
      const formData = new FormData();
      formData.append('jsonData', JSON.stringify(details));
      formData.append('fileData', archive, 'images.zip');

      return axios.post(
        `${constant.api.enframe}themes`,
        formData,
      ).then(({ data }) => {
        const newTheme = {
          id: data.result.id,
          colorIndex: 0, // Custom themes have only 1 color scheme for now
        };

        // Adding the created theme to the list of themes
        commit('addTheme', {
          name: details.name,
          _id: newTheme.id,
          group: constant.themeGroups.custom,
          images,
          colorSchemes: details.colorSchemes,
        });

        // Setting the created theme as the app theme
        return dispatch('saveDetails', {
          params: {
            theme: newTheme,
          },
          silent: true,
        });
      }).then(() => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.success,
          title: constant.snackbarTypes.success,
          message: message.customTheme.themeCreated,
        });
      })
        .catch(({ response }) => {
          this.dispatch('snackbar/show', {
            type: constant.snackbarTypes.error,
            title: message.customTheme.error,
            message: response.data.message,
          });
        });
    },

    // Updating JSON data of a custom theme
    updateTheme({ commit }, details) {
      return axios.patch(
        `${constant.api.enframe}themes/${details.themeId}`,
        details.data,
      ).then(() => {
        commit('updateTheme', details);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.customTheme.error,
          message: response.data.message,
        });
      });
    },

    // Updating image of a custom theme
    updateThemeImage({ commit }, details) {
      const params = {
        type: details.type,
      };

      // Form data to send
      const formData = new FormData();
      formData.append('fileData', details.file, details.file.name);

      return axios.patch(
        `${constant.api.enframe}themes/${details.themeId}/images`,
        formData,
        { params },
      ).then(() => {
        commit('updateThemeImage', details);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.customTheme.error,
          message: response.data.message,
        });
      });
    },

    // Fetching list of app scenarios using AC API
    getScenarios({ commit, state }) {
      return axios.get(
        `/apps/${state.url}/scenario/all`,
      ).then(({ data }) => {
        commit('updateScenarios', data.scenarios);
      }).catch(({ response }) => {
        commit('updateScenarios');
        let errorMessage = response.data;
        if (response.status >= 500) {
          errorMessage = response.statusText;
        }
        if (response.data === message.common.userNotExist) errorMessage = message.common.logIntoApp;
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.common.errorFetchingScenarios,
          message: errorMessage,
        });

        throw response.data;
      });
    },
  },
};
