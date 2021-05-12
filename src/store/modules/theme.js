import vuetify from '@/plugins/vuetify';
import constant from '@/services/constant';
import defaultTheme from '@/assets/themes/default.json';
import alternativeTheme from '@/assets/themes/alternative.json';

const themeList = {
  [constant.appThemes.default]: defaultTheme,
  [constant.appThemes.alternative]: alternativeTheme,
};

export default {
  namespaced: true,
  state: {
    colors: {},
  },

  actions: {
    changeTheme({ commit }, name) {
      commit('updateTheme', name);
    },
    initTheme({ commit }) {
      commit('updateTheme', constant.appThemes.default);
    },
  },

  mutations: {
    updateTheme(state, name) {
      // Updating vuetify colors and saving applied colors to the state
      Object.assign(vuetify.framework.theme.themes.light, themeList[name]);
      state.colors = { ...themeList[name] };
    },
  },
};
