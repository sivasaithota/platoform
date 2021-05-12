import Vue from 'vue';
import draggable from 'vuedraggable';

import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import initKeycloak from './keycloak';
import './filters/middleTruncation';
import message from './services/message';
import constant from './services/constant';
import common from './services/common';
import directives from './directives'; // eslint-disable-line no-unused-vars

import OpexIcon from './components/OpexIcon';
import OpexPopup from './components/OpexPopup';
import OpexTag from './components/OpexTag';
import OpexDrawer from './components/OpexDrawer';
import OpexDrawerTabs from './components/OpexDrawerTabs';
import OpexTooltip from './components/OpexTooltip';
import OpexLink from './components/OpexLink';
import OpexUploadArea from './components/OpexUploadArea';
import OpexInput from './components/OpexInput';
import OpexSavedLabel from './components/OpexSavedLabel';
import OpexCard from './components/OpexCard';
import OpexSubmenu from './components/OpexSubmenu';
import OpexListItem from './components/OpexListItem';
import OpexMenuListItem from './components/OpexMenuListItem';
import FetchingDataSpinner from './components/FetchingDataSpinner';
import OpexSwitch from './components/OpexSwitch';
import OpexDialog from './components/OpexDialog';
import ImmediateUpdateBanner from './components/ImmediateUpdateBanner';

// Global custom components declaring
Vue.component('opex-icon', OpexIcon);
Vue.component('opex-popup', OpexPopup);
Vue.component('opex-tag', OpexTag);
Vue.component('opex-drawer', OpexDrawer);
Vue.component('opex-drawer-tabs', OpexDrawerTabs);
Vue.component('opex-tooltip', OpexTooltip);
Vue.component('opex-link', OpexLink);
Vue.component('opex-upload-area', OpexUploadArea);
Vue.component('opex-input', OpexInput);
Vue.component('opex-saved-label', OpexSavedLabel);
Vue.component('opex-card', OpexCard);
Vue.component('opex-submenu', OpexSubmenu);
Vue.component('opex-list-item', OpexListItem);
Vue.component('opex-menu-list-item', OpexMenuListItem);
Vue.component('fetching-data-spinner', FetchingDataSpinner);
Vue.component('opex-switch', OpexSwitch);
Vue.component('opex-dialog', OpexDialog);
Vue.component('immediate-update-banner', ImmediateUpdateBanner);
Vue.component('draggable', draggable);

Vue.config.productionTip = false;

initKeycloak().then(() => {
  new Vue({
    router,
    store,
    vuetify,
    message,
    constant,
    common,
    render: h => h(App),
  }).$mount('#app');
});
