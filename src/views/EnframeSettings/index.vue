<!--Enframe Settings page component-->

<template>
  <div class="settings-wrapper position-relative" :class="{'iframe-wrapper': isIframe}">
    <app-header/>
    <section class="settings-container">
      <!--Page title-->
      <v-layout class="app-content-header">
        <h3>
          Enframe Settings
        </h3>
      </v-layout>
      <v-layout>
        <opex-nav-drawer :item-list="menuList"/>
        <div class="settings-content">
          <fetching-data-spinner :visible="loading"/>
          <router-view
            v-if="!loading"
            class="router-content"
          />
        </div>
      </v-layout>
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import store from '@/store';

import AppHeader from '@/components/AppHeader';
import OpexNavDrawer from './components/OpexNavDrawer';

export default {
  name: 'Settings',

  components: { AppHeader, OpexNavDrawer },

  data() {
    return {
      menuList: [{
        title: 'General Settings',
        visible: true,
        items: [{
          name: 'User Management',
          visible: true,
          url: '/settings/user-management',
        },
        {
          name: 'Environment Management',
          visible: true,
          url: '/settings/environment-management',
        }],
      }, {
        title: 'Visualization',
        visible: true,
        items: [{
          name: 'Tableau',
          visible: true,
          url: '/settings/tableau',
        }, {
          name: 'Power BI',
          visible: true,
          url: '/settings/powerbi',
        }],
      }, {
        title: 'Security settings',
        visible: true,
        items: [{
          name: 'Accepted Domains',
          visible: true,
          url: '/settings/security',
        }],
      }],
      loading: true,
      isIframe: this.$common.isIframe(),
    };
  },

  beforeRouteEnter(to, from, next) {
    // Protecting page from accessing by users without 'admin' role assigned
    if (!store.state.user.userInfo.isAdmin) next('/');
    else next();
  },

  mounted() {
    // Fetching data from the server
    this.getSettings()
      .then(() => {
        this.loading = false;
      });
  },

  methods: {
    ...mapActions('settings', {
      getSettings: 'getSettings',
    }),
  },
};
</script>

<style scoped lang="scss">
  .settings-wrapper {
    display: grid;
    height: 100%;
    grid-template-columns: auto;
    grid-template-rows: $header-height auto;
    grid-template-areas: "header" "app-container";
    &.iframe-wrapper {
      grid-template-rows: 6rem auto;
    }
  }
  .settings-container {
    padding: 2rem 20rem;
    background-color: var(--theme-background);
  }
  .router-content {
    margin-left: .625rem;
    background-color: var(--theme-background-light);
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  }
  .settings-content {
    width: 100%;
  }
</style>

<style lang="scss">
  .settings-header {
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: .25rem;
  }
  .settings-subheader{
    opacity :.5;
    font-weight: 500;
    margin-bottom: 1.75rem;
  }
  .setting-form-container {
    padding: 2.01rem 1.375rem 0 2.25rem;
  }
  .setting-action-container {
    padding: 1.125rem 1.375rem 1.25rem 0;
  }
</style>
