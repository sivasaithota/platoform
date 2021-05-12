// Module for the app Scripts and Visualisation data

import JSZip from 'jszip';
import axios from 'axios';
import { cloneDeep } from 'lodash';

import message from '@/services/message';
import constant from '@/services/constant';

export default {
  namespaced: true,

  state: {
    actions: [],
    scriptFileList: [],
    actionTriggers: [],
    actionsPromise: null, // for storing the get actions promise
  },

  getters: {
    secondaryActions: (state) => {
      return state.actions.filter(action => action.type === constant.actionTypes.secondary.value);
    },
  },

  mutations: {
    // Updating the list of available scripts
    updateScriptList(state, data) {
      state.scriptFileList = data;
    },

    // Updating/clearing the actions data
    updateActions(state, actions) {
      state.actions = actions;
    },

    updateAction(state, action) {
      const actionToUpdate = state.actions.find(stateAction => stateAction._id === action._id);
      if (actionToUpdate) Object.assign(actionToUpdate, action);
    },

    addAction(state, action) {
      state.actions.push(action);
    },

    moveAction(state, details) {
      // Changing the moved action position
      const movedAction = state.actions.find(action => action._id === details.actionId);
      if (movedAction) movedAction.segmentPosition = details.newActionIndex;

      // Changing positions for other actions
      state.actions.forEach(action => {
        // Skipping for the moved action and if segment doesn't match because actions are moved relatively to the segment
        if (action === movedAction || action.segment !== movedAction.segment) return;

        // If action is moved down
        if (details.oldActionIndex < details.newActionIndex
          && action.segmentPosition > details.oldActionIndex
          && action.segmentPosition <= details.newActionIndex
        ) action.segmentPosition -= 1;

        // If action is moved down
        if (details.oldActionIndex > details.newActionIndex
          && action.segmentPosition < details.oldActionIndex
          && action.segmentPosition >= details.newActionIndex
        ) action.segmentPosition += 1;
      });
    },

    deleteAction(state, actioId) {
      const actionIndex = state.actions.findIndex(action => action._id === actioId);
      if (actionIndex >= 0) state.actions.splice(actionIndex, 1);
    },

    // Adding uploaded script file name to the scriptFileList array
    // Expects the name of the file to be added as the payload
    addScriptFile(state, files) {
      files.forEach(file => {
        // Skipping if file with the same name already exists
        if (state.scriptFileList.includes(file.name)) return;

        state.scriptFileList.push(file.name);
      });
    },

    // Deleting script file from the scriptFileList array
    // Expects the name of the file to be deleted as the payload
    deleteScriptFile(state, fileName) {
      const index = state.scriptFileList.indexOf(fileName);
      state.scriptFileList.splice(index, 1);
    },

    updateTriggers(state, triggers) {
      state.actionTriggers = triggers;
    },

    setTrigger(state, trigger) {
      const index = state.actionTriggers.findIndex(actionTrigger => actionTrigger._id === trigger._id);
      if (index > 0) state.actionTriggers[index] = trigger;
      else state.actionTriggers.push(trigger);
    },

    updateActionsPromise(state, promise) {
      state.actionsPromise = promise;
    },
  },

  actions: {// Getting application list of scripts
    getScripts({ commit }, appId) {
      return axios.get(
        `${constant.api.enframe}apps/${appId}/scripts`,
      ).then(({ data }) => {
        commit('updateScriptList', data.result);
      }).catch(({ response }) => {
        // Clearing Scripts List
        commit('updateScriptList', []);

        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.common.gettingScriptsError,
          message: response.data.message,
        });
      });
    },

    // Uploading script zip of file for the app
    uploadScript({ commit }, details) {
      const formData = new FormData();
      // Generating zip file if needed
      return Promise.resolve().then(() => {
        const zip = new JSZip();
        details.files.forEach(file => zip.file(file.name, file));
        return zip.generateAsync({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 3 },
        }).then(archive => {
          formData.append('fileData', archive, 'scripts.zip');
          return null;
        });
      }).then(() => {
        return axios.post(
          `${constant.api.enframe}apps/${details.appId}/scripts`,
          formData,
        );
      }).then(({ data }) => {
        commit('addScriptFile', details.files);
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.success,
          title: constant.snackbarTypes.success,
          message: data.result.message,
        });
      })
        .catch(({ response }) => {
          this.dispatch('snackbar/show', {
            type: constant.snackbarTypes.error,
            title: message.common.errorUploadingFile,
            message: response.data.message,
          });
        });
    },

    // Deleting script file on the server
    deleteScript({ commit }, details) {
      return axios.delete(
        `${constant.api.enframe}apps/${details.appId}/scripts/${details.file}`,
      ).then(() => {
        commit('deleteScriptFile', details.file);
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.success,
          title: 'Success',
          message: message.actionSettings.successDeletingScript,
        });
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.actionSettings.errorDeletingScript,
          message: response.data.message,
        });
      });
    },

    // Getting application Actions settings
    getActions({ commit }, appId) {
      const promise = axios.get(
        `${constant.api.enframe}apps/${appId}/actions`,
      ).then(({ data }) => {
        commit('updateActions', data.result);
      }).catch(({ response }) => {
        // Clearing the Actions data
        commit('updateActions');

        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.actionSettings.gettingActionsError,
          message: response.data.message,
        });
      });

      commit('updateActionsPromise', promise);
      return promise;
    },

    // Creation application Action data to the server
    createAction({ commit, rootState }, details) {
      return axios.post(
        `${constant.api.enframe}apps/${rootState.application.id}/actions`,
        details,
      ).then(({ data }) => {
        details._id = data.result.id;
        commit('addAction', details);
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.success,
          title: constant.snackbarTypes.success,
          message: message.actionSettings.successCreatingAction,
        });
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.actionSettings.savingActionError,
          message: response.data.message,
        });

        throw response.data.message;
      });
    },

    // Updating application Action data on the server
    updateAction({ commit, rootState }, details) {
      return axios.patch(
        `${constant.api.enframe}apps/${rootState.application.id}/actions/${details._id}`,
        details,
      ).then(() => {
        commit('updateAction', details);
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.success,
          title: constant.snackbarTypes.success,
          message: message.actionSettings.successUpdatingAction,
        });
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.actionSettings.savingActionError,
          message: response.data.message,
        });

        throw response.data.message;
      });
    },

    deleteAction({ commit, rootState }, actionId) {
      return axios.delete(
        `${constant.api.enframe}apps/${rootState.application.id}/actions/${actionId}`,
      ).then(() => {
        commit('deleteAction', actionId);
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.success,
          title: constant.snackbarTypes.success,
          message: message.actionSettings.successDeletingAction,
        });
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.actionSettings.errorDeletingAction,
          message: response.data.message,
        });

        throw response.data.message;
      });
    },

    // Sending request to change actions order
    moveAction({ commit, rootState, state }, details) {
      // Saving current actions order to be able to revert the order if request fails
      const oldActionsOrder = cloneDeep(state.actions);

      // Saving new tables order in the state
      commit('moveAction', details);

      return axios.post(
        `${constant.api.enframe}apps/${rootState.application.id}/actions/${details.actionId}/move`,
        { position: details.newActionIndex },
      ).catch(({ response }) => {
        // Reverting to the saved order if request fails
        commit('updateActions', oldActionsOrder);
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.actionSettings.errorMovingAction,
          message: response.data.message,
        });
      });
    },

    getTriggers({ commit }, appId) {
      return axios.get(
        `${constant.api.enframe}apps/${appId}/actions/triggers`,
      ).then(({ data }) => {
        commit('updateTriggers', data.result);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.actionSettings.errorGettingTrigger,
          message: response.data.message,
        });
      });
    },

    setTrigger({ commit, rootState }, trigger) {
      trigger = cloneDeep(trigger);

      return axios.post(
        `${constant.api.enframe}apps/${rootState.application.id}/actions/triggers`,
        trigger,
      ).then(({ data }) => {
        if (data.result.id) trigger._id = data.result.id;
        commit('setTrigger', trigger);

        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.success,
          title: constant.snackbarTypes.success,
          message: message.actionSettings.successUpdatingTrigger,
        });
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.actionSettings.errorSettingTrigger,
          message: response.data.message,
        });
      });
    },
  },
};
