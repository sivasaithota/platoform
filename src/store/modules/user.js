import _ from 'lodash';
import axios from 'axios';
import router from '@/router';
import constant from '@/services/constant';
import { keycloak as keycloakConfig } from '@/../configs/config.json';

export default {
  namespaced: true,

  state: {
    userInfo: {},
  },

  mutations: {
    updateUserInfo(state, userInfo) {
      state.userInfo = { ...userInfo };
    },
  },

  actions: {
    userLogin(state, params) {
      const redirect = _.get(router, 'history.current.query.redirect', '/');
      axios
        .post(`${constant.api.userManagement}auth/v1/login`, params)
        .then(() => router.push(redirect))
        .catch(({ response }) => {
          this.dispatch('snackbar/show', {
            type: 'error',
            title: 'Login Error',
            message: response.data.message,
          });
        });
    },
    logout() {
      localStorage.clear();
      window.open(`${keycloakConfig.logoutUrl}?redirect_uri=${window.location.href}`, '_self');
    },
  },
};
