// Vuex store. Docs https://vuex.vuejs.org/en/
import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production', // Not allowing to mutate state outside mutations
});
