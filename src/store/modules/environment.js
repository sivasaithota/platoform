// Module for the settings related state

import axios from 'axios';
import constant from '@/services/constant';
import message from '@/services/message';

export default {
  namespaced: true,

  state: {
    environments: [],
    baseEnvs: [],
  },

  mutations: {
    updateEnvData(state, data) {
      state.environments = data.filter(env => env.type === constant.environmentTypes.custom);
      state.baseEnvs = data.filter(env => env.type === constant.environmentTypes.default);
    },

    createEnv(state, data) {
      state.environments.push(data);
    },

    updateEnv(state, data) {
      data.value.commands = state.environments[data.index].commands.concat(data.value.commands);
      Object.assign(state.environments[data.index], data.value);
    },

    deleteEnv(state, envIndex) {
      state.environments.splice(envIndex, 1);
    },
  },

  actions: {
    // Fetching list of custom Environments
    getEnvironments({ commit }) {
      return axios.get(
        `${constant.api.enframe}environment/all`,
      ).then(({ data }) => {
        commit('updateEnvData', data);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.setting.packageManager.errorFetchingData,
          message: response.data.message,
        });
      });
    },

    // Sending request to create a new environment
    createEnvironment(store, details) {
      details.name = `${details.baseImage}_${details.name}`;
      return axios.post(
        `${constant.api.enframe}environment`,
        details,
      ).then(({ data }) => {
        return data;
      }).catch(({ response }) => {
        throw response.data;
      });
    },

    // Sending request to create a new environment
    updateEnvironment(store, details) {
      return axios.patch(
        `${constant.api.enframe}environment/${details._id}`,
        details,
      ).then(({ data }) => {
        return data;
      }).catch(({ response }) => {
        throw response.data;
      });
    },

    // Sending request to delete a environment
    deleteEnvironment({ commit }, details) {
      return axios.delete(
        `${constant.api.enframe}environment/${details.envId}`,
      ).then(() => {
        commit('deleteEnv', details.envIndex);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.inputOutput.errorDeletingTable,
          message: response.data.message,
        });
      });
    },
  },
};
