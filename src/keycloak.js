import Keycloak from 'keycloak-js';
import { keycloak as keycloakConfig } from '../configs/config';
import store from './store';
import message from './services/message';
import constant from './services/constant';

const keycloak = Keycloak(keycloakConfig);

function initKeycloak() {
  return new Promise((resolve, reject) => {
    keycloak.init({ onLoad: keycloakConfig.onLoad })
      .success((auth) => {
        if (!auth) {
          window.location.reload();
        }
        localStorage.setItem('accessToken', keycloak.token);

        // Fetching user info and storing it in Vuex
        keycloak.loadUserInfo()
          .success(userInfo => {
            if (userInfo) {
              userInfo.isAdmin = keycloak.hasResourceRole(
                constant.userRoles.admin,
                constant.keycloakClients.enframeBackend,
              );
              if (userInfo.roles.includes(constant.userRoles.admin)) {
                userInfo.roleName = constant.userRoles.admin;
              } else if (userInfo.roles.includes(constant.userRoles.architect)) {
                userInfo.roleName = constant.userRoles.architect;
              } else if (userInfo.roles.includes(constant.userRoles.appDeveloper)) {
                userInfo.roleName = constant.userRoles.appDeveloper;
              } else userInfo.roleName = constant.userRoles.appViewer;
            }

            store.commit('user/updateUserInfo', userInfo);
            resolve();
          })
          .error(() => {
            store.dispatch('snackbar/show', {
              type: constant.snackbarTypes.error,
              title: constant.snackbarTypes.error,
              message: message.auth.userInfoError,
            });
            reject();
          });
      }).error(() => {
        store.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: constant.snackbarTypes.error,
          message: message.auth.authError,
        });
        reject();
        // TODO: Need to redirect to Unauthorized page
      });
  });
}

setInterval(() => {
  keycloak.updateToken(70).success((refreshed) => {
    if (refreshed) {
      localStorage.setItem('accessToken', keycloak.token);
    }
  }).error(() => {
    store.dispatch('snackbar/show', {
      type: constant.snackbarTypes.error,
      title: constant.snackbarTypes.error,
      message: message.auth.refreshTokenError,
    });
  });
}, 60000);

export default initKeycloak;
