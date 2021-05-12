// Module for the settings related state

import _ from 'lodash';
import axios from 'axios';
import constant from '@/services/constant';
import message from '@/services/message';

const transformUser = (userData, roles) => {
  return {
    username: userData.email,
    email: userData.email,
    type: userData.type,
    password: userData.password,
    firstname: userData.firstName,
    lastname: userData.lastName,
    role: roles.find(role => role.name === userData.role),
  };
};

export default {
  namespaced: true,

  state: {
    powerbi: {},
    tableau: {},
    acceptedDomains: [],
    userManagement: {
      user: { type: 'SSO' },
      userCount: 0,
      userLimit: 10,
      viewValue: '10',
      users: [],
      roles: [],
    },
  },

  mutations: {
    updateSettingData(state, settings) {
      if (settings) {
        state.powerbi = settings.powerbi;
        state.tableau = settings.tableau;
        state.acceptedDomains = settings.acceptedDomains;
        state.userManagement.userCount = settings.userCount;
      }
    },

    updateDomainList(state, items) {
      state.acceptedDomains = items;
    },

    updatePowerbiList(state, items) {
      state.powerbi = items;
    },

    updateTableauList(state, items) {
      state.tableau = items;
    },

    updateUsers(state, items) {
      state.userManagement.users = items;
    },

    addUser(state, item) {
      state.userManagement.users.push(item);
    },

    updateUser(state, item) {
      const index = state.userManagement.users.findIndex(user => user.id === item.id);
      state.userManagement.users[index].attributes.type = [item.type];
      state.userManagement.users[index].firstName = item.firstname;
      state.userManagement.users[index].lastName = item.lastname;
      state.userManagement.users[index].role = item.role;
    },

    updateRoles(state, items) {
      state.userManagement.roles = items.filter(item => !constant.enframeSetting.excludeRoles.includes(item.name));
    },

    setUserLimit(state, item) {
      state.userManagement.userLimit = item < 10 ? 10 : item;
    },

    async setViewValue(state, item) {
      state.userManagement.viewValue = item;
    },

    setUserCount(state, item) {
      state.userManagement.userCount = item;
    },
  },

  actions: {
    // Fetching list of global settings
    getSettings({ commit }) {
      return axios.get(
        `${constant.api.enframe}setting`,
      ).then(({ data }) => {
        commit('updateSettingData', { ...data.result, ...{ userCount: data.userCount ? data.userCount : 0 } });
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.setting.error,
          message: response.data.message,
        });
      });
    },

    // Updating settings parts
    updateSettings({ commit }, details) {
      return axios.patch(
        `${constant.api.enframe}setting`,
        details.data,
      ).then(() => {
        if (details.type && details.type === constant.enframeSetting.powerbi) {
          commit('updatePowerbiList', details.data.powerbi);
        }
        if (details.type && details.type === constant.enframeSetting.tableau) {
          commit('updateTableauList', details.data.tableau);
        }
        if (details.type && details.type === 'acceptedDomains') {
          commit('updateDomainList', details.data.acceptedDomains);
        }
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.setting.error,
          message: response.data.message,
        });
      });
    },

    // Fetching list of users
    getUsers({ commit }, details) {
      const params = {
        first: details.offset || 0,
      };
      if (details.limit) params.max = details.limit;
      if (details.search && details.search !== '') params.search = details.search;
      return axios.get(
        `${constant.api.enframe}users`,
        { params },
      ).then(({ data }) => {
        const result = _.get(data, 'result', [])
          .map(user => {
            if (user.attributes
              && user.attributes.lastlogin
              && user.attributes.lastlogin[0]) {
              user.attributes.lastlogin[0] = parseInt(`${user.attributes.lastlogin[0]}000`, 10);
            }
            return user;
          });
        commit('updateUsers', result);
        return _.get(data, 'count', 0);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.setting.error,
          message: response.data.message,
        });
      });
    },

    getRoles({ commit }) {
      return axios.get(
        `${constant.api.enframe}roles`,
      ).then(({ data }) => {
        commit('updateRoles', data.result);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.setting.error,
          message: response.data.message,
        });
      });
    },

    createUser({ state, commit }, userData) {
      const user = transformUser(userData, state.userManagement.roles);
      return axios.post(
        `${constant.api.enframe}users`,
        user,
      ).then(({ data }) => {
        const viewValue = parseInt(state.userManagement.viewValue, 10);
        const updateList = state.userManagement.userLimit < viewValue;
        if (updateList) {
          const newUser = {
            ...userData,
            ...{
              id: data.result.id,
              attributes: { type: [userData.type] },
              role: state.userManagement.roles.find(role => role.name === userData.role),
            },
          };
          commit('addUser', newUser);
          commit('setUserLimit', state.userManagement.userLimit + 1);
        }
        commit('setUserCount', state.userManagement.userCount + 1);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.setting.error,
          message: response.data.message,
        });
      });
    },

    editUser({ state, commit }, userData) {
      const user = transformUser(userData, state.userManagement.roles);
      return axios.patch(
        `${constant.api.enframe}users/${userData.id}`,
        user,
      ).then(() => {
        user.id = userData.id;
        commit('updateUser', user);
      }).catch((response) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.setting.error,
          message: response.data.message,
        });
      });
    },

    deleteUsers({ state, commit }, details) {
      return axios.delete(
        `${constant.api.enframe}users`,
        { data: details },
      ).then(() => {
        commit('setUserCount', state.userManagement.userCount - details.length);
        return null;
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.setting.error,
          message: response.data.message,
        });
      });
    },
  },
};
