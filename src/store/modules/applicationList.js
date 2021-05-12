import _ from 'lodash';
import axios from 'axios';
import message from '@/services/message';
import constant from '@/services/constant';

let cancel;

const listOfSort = [
  { title: 'App Name', key: 'displayName' },
  { title: 'Created Date', key: 'createdAt' },
  { title: 'Modified Date', key: 'updatedAt' },
];

// default count of apps what will load in 1 time
const APPS_LIMIT_PORTION = 20;

const defaultState = {
  allAppsList: [],
  fetchingApps: false,
  filter: '',
  sortBy: listOfSort[1],
  sortIndex: constant.sortIndex.desc,
  selectedApp: {},
  listOfSort,
  limit: APPS_LIMIT_PORTION,
  userList: [],
  userCount: 0,
  nonUserList: null,
  selectedSortType: null,
  info: {},
  lastPage: false,
};

const handleScenarioData = (data) => {
  const scenarios = _.get(data, 'scenarios', []);
  return scenarios.map(scenario => {
    return { title: scenario.name, key: scenario.id };
  });
};

const handleTableauData = (data) => {
  return data.map(item => {
    const splitUrl = item.url.split('/');
    return {
      title: `${splitUrl[splitUrl.findIndex(urlItem => urlItem === 'views') + 1]}.twbx`,
      key: `t${item.id}`,
      reportType: 'tableau',
    };
  });
};

export default {
  namespaced: true,
  state: defaultState,
  getters: {
    getSelectedApp: (state) => {
      return _.find(state.allAppsList, (app) => app._id === state.selectedApp._id);
    },

    allAppsCount: (state) => {
      if (!state.info.appsCount) return 0;
      const { inProgress, inactive, active } = constant.deployStatuses;
      return state.info.appsCount[inProgress] + state.info.appsCount[inactive] + state.info.appsCount[active];
    },
  },

  actions: {
    // Getting general Enframe info
    getInfo({ commit }) {
      return axios.get(
        `${constant.api.enframe}info`,
      ).then(({ data }) => {
        commit('updateInfo', data.result);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.common.errorFetchingEnframeInfo,
          message: response.data.message,
        });
      });
    },

    changeAppInfo({ state, commit }, { status, newStatus }) {
      const appsCount = _.cloneDeep(state.info.appsCount);
      appsCount[status] -= 1;
      if (newStatus) appsCount[newStatus] += 1;
      commit('updateInfo', { appsCount });
    },

    // Fetching list of apps from the server
    getAllApps({ state, commit, getters }, data = {}) {
      // if we don't pass skip value it's mean that we are fetching data in the first time
      if (!data.skip) {
        commit('updateLastPage', false);
        commit('updateAllAppsList', []);
      }

      // checking that length of app list is not 0 and equal to information from the statistic,
      // or that we noted that we already had the last page
      const isAllFetched = (!!state.allAppsList.length && state.allAppsList.length === getters.allAppsCount) || state.lastPage;
      if (isAllFetched && !data.firstRequest) return; // if we have fetched all and this is not the first request after any params changing

      // URL query parameters for sorting, filtering and limit
      const params = {
        sortBy: state.sortBy.key,
        sortDirection: state.sortIndex,
        filter: state.filter,
        filterBy: ['name', 'description', 'createdBy'],
        limit: state.limit,
        skip: data.skip,
        statuses: state.selectedSortType ? [state.selectedSortType] : null,
      };

      commit('updateFetchingApps', true);
      return axios
        .get(`${constant.api.enframe}apps`, {
          params,
        })
        .then((response) => {
          let result = _.get(response, 'data.result', [])
            .map(app => {
              app.isEditable = app.scopes && Array.isArray(app.scopes) && app.scopes.includes('update');
              return app;
            });
          if (result.length < APPS_LIMIT_PORTION) commit('updateLastPage', true);
          if (data.skip) result = _.concat(state.allAppsList, result);
          commit('updateAllAppsList', result);
        })
        .catch(({ response }) => {
          this.dispatch('snackbar/show', {
            type: constant.snackbarTypes.error,
            title: message.applicationList.getAllAppsErrorTitle,
            message: response.data.message,
          });
        })
        .finally(() => {
          commit('updateFetchingApps', false);
        });
    },

    // updating application data from app list by ID
    updateAppFromList({ commit, state }, data) {
      if (!data.id) return;
      const newAllAppsList = _.cloneDeep(state.allAppsList);
      // finding of app index what we gonna change
      const index = _.findIndex(newAllAppsList, app => app._id === data.id);
      if (data.status === constant.deployStatuses.deleted) {
        newAllAppsList.splice(index, 1);
        // checking what user didn't switch to another app
        if (state.selectedApp._id === data.id) {
          // selection of the first app from the list after deleting
          commit('updateSelectedAppId', newAllAppsList[0] ? newAllAppsList[0]._id : null);
        }
      } else {
        delete data.id;
        newAllAppsList[index] = { ...newAllAppsList[index], ...data };
      }
      commit('updateAllAppsList', newAllAppsList);
    },

    getUsers({ state, commit }, options) {
      const {
        id, first, max, shared, search,
      } = options;
      const params = {
        first: first || 1,
        max: max || 10,
        shared,
      };
      if (search && search !== '') params.search = search;
      return axios.get(
        `${constant.api.enframe}apps/${id}/share/users`,
        { params },
      ).then(({ data }) => {
        let result = _.get(data, 'result', [])
          .map(user => {
            if (user.attributes
              && user.attributes.lastlogin
              && user.attributes.lastlogin[0]) {
              user.attributes.lastlogin[0] = parseInt(`${user.attributes.lastlogin[0]}000`, 10);
            }
            return user;
          });
        if (!shared) {
          if (params.first !== 1) {
            result = state.nonUserList.concat(result);
          }
          commit('updateNonUserList', result);
        } else {
          commit('updateUserList', result);
        }
        return _.get(data, 'count', 0);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.userList.getUsersErrorTitle,
          message: response.data.message,
        });
      });
    },

    getUserCount({ commit }, id) {
      return axios.get(
        `${constant.api.enframe}apps/${id}/share/users/count`,
      ).then(({ data }) => {
        const result = _.get(data, 'result', []);
        commit('updateUserCount', result);
        return result;
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.userList.getUsersCountErrorTitle,
          message: response.data.message,
        });
      });
    },

    // Adding user to the list of app users
    addUser({ commit }, details) {
      return axios.post(
        `${constant.api.enframe}apps/${details.appId}/share`,
        {
          userId: details.userId,
          scopes: details.scopes,
          updateac: true,
        },
      ).then(() => {
        commit('addUser', details);
        return null;
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.userList.errorAddingUser,
          message: response.data.message,
        });
      });
    },

    // Editing user permission from the list of app users
    editUser({ commit }, details) {
      return axios.patch(
        `${constant.api.enframe}apps/${details.appId}/share`,
        {
          userId: details.userId,
          scopes: details.scopes,
          updateac: true,
        },
      ).then(() => {
        commit('updateUser', details);
        return null;
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.userList.errorAddingUser,
          message: response.data.message,
        });
      });
    },

    // Deleting user from the list of app admins
    deleteUsers({ commit }, details) {
      return axios.delete(
        `${constant.api.enframe}apps/${details.appId}/share`,
        { data: { userIds: details.userIds, updateac: true } },
      ).then(() => {
        commit('deleteUsers', details.userIds);
        return null;
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.userList.errorDeletingUser,
          message: response.data.message,
        });
      });
    },

    getScenarioList({ commit }, url) {
      if (!url) return;
      return axios.get(`${constant.api.appManager}${url}/scenario/all`)
        .then((response) => {
          commit('updateScenarioList', handleScenarioData(response.data));
          commit('updateLoginWarning', false);
          return null;
        })
        .catch((e) => {
          if (e && e.response && e.response.data === message.common.userNotExist) {
            commit('updateLoginWarning', true);
          } else {
            this.dispatch('snackbar/show', {
              type: constant.snackbarTypes.error,
              title: message.applicationList.getScenarioListErrorTitle,
              message: e.response.data.message,
            });
          }
        });
    },

    getTableauList({ commit }, url) {
      if (!url) return;
      return axios.get(`${constant.api.appManager}${url}/tableau?unique=true`)
        .then((response) => {
          commit('updateTableauList', handleTableauData(response.data));
          commit('updateLoginWarning', false);
          return null;
        })
        .catch((e) => {
          if (e && e.response && e.response.data === message.common.userNotExist) {
            commit('updateLoginWarning', true);
          } else {
            this.dispatch('snackbar/show', {
              type: constant.snackbarTypes.error,
              title: message.applicationList.getScenarioListErrorTitle,
              message: e.response.data.message,
            });
          }
        });
    },

    downloadApp(state, {
      id, name, data,
    }) {
      return axios
        .post(
          `${constant.api.enframe}apps/${id}/download`,
          data,
          {
            responseType: 'arraybuffer',
            cancelToken: axios.CancelToken(((c) => {
            // assign current query terminator
              cancel = c;
            })),
          },
        )
        .then((response) => {
          const urlData = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = urlData;
          link.setAttribute('download', `${name}.zip`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        })
        .catch((e) => {
          this.dispatch('snackbar/show', {
            type: constant.snackbarTypes.error,
            title: message.applicationList.downloadAppErrorTitle,
            message: e.message || e.response.data.message,
          });
        });
    },
    cancelRequest() {
      // use query terminator
      return cancel(message.appDeployment.buttons.download.cancel);
    },
  },
  mutations: {
    updateLastPage(state, data) {
      state.lastPage = data;
    },
    updateInfo(state, info) {
      state.info = { ...state.info, ...info };
    },
    updateSelectedSortType(state, data) {
      state.selectedSortType = data;
    },
    updateFetchingApps(state, data) {
      state.fetchingApps = data;
    },
    updateAllAppsList(state, data) {
      state.allAppsList = data;
    },
    updateFilter(state, data) {
      state.filter = data;
    },
    updateSortBy(state, data) {
      state.sortBy = data;
    },
    updateSortIndex(state, data) {
      state.sortIndex = data;
    },
    updateSelectedAppId(state, data) {
      state.selectedApp = { ...state.selectedApp, ...{ _id: data } };
    },
    updateUsers(state, data) {
      state.selectedApp = { ...state.selectedApp, ...{ users: data } };
    },
    updateScenarioList(state, data) {
      state.selectedApp = { ...state.selectedApp, ...{ scenarioList: data } };
    },
    updateUserList(state, data) {
      state.userList = data;
    },
    updateNonUserList(state, data) {
      state.nonUserList = data;
    },
    updateUserCount(state, data) {
      state.userCount = data;
    },
    updateTableauList(state, data) {
      state.selectedApp = { ...state.selectedApp, ...{ tableauList: data } };
    },
    updateLoginWarning(state, data) {
      state.selectedApp = { ...state.selectedApp, loginWarning: data };
    },

    // Adding user to the list of app admins
    // Expects the user object to be added as the payload
    addUser(state, data) {
      const index = state.nonUserList.findIndex(user => user.id === data.userId);
      const user = _.cloneDeep(state.nonUserList[index]);
      user.scopes = data.scopes;
      state.nonUserList.splice(index, 1);
      if (!data.isListFull) state.userList.push(user);
    },
    updateUser(state, data) {
      const index = state.userList.findIndex(user => user.id === data.userId);
      state.userList[index].scopes = data.scopes;
    },

    // Deleting user from the list of app users
    // Expects the ids of the users to be deleted as the payload
    deleteUsers(state, userIds) {
      state.userList = state.userList.filter(user => !userIds.includes(user.id));
    },
  },
};
