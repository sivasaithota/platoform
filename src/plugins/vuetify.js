import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const options = {
  icons: {
    values: {
      dropdown: 'icon-v2-play3',
      radioOn: 'icon-v2-radio-checked',
      radioOff: 'icon-v2-radio-unchecked',
      checkboxOn: 'icon-v2-checkbox-checked',
      checkboxOff: 'icon-v2-checkbox-unchecked',
    },
  },
  theme: {
    options: {
      cspNonce: '2726c7f26c',
    },
  },
};

export default new Vuetify(options);
