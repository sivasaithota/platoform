<template>
  <div class="wrapper" :class="{'iframe-wrapper': isIframe}">
    <app-header></app-header>
    <side-bar class="app-navigation-sidebar"></side-bar>
    <router-view class="app-container"></router-view>
  </div>

</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

import SideBar from '@/components/Sidebar';
import AppHeader from '@/components/AppHeader';

export default {
  name: 'App',
  components: { SideBar, AppHeader },
  data() {
    return {
      isIframe: this.$common.isIframe(),
    };
  },
  methods: {
    ...mapMutations({
      updateId: 'application/updateId',
    }),
    ...mapActions({
      getDetails: 'application/getDetails',
      getScopes: 'application/getScopes',
    }),
  },

  created() {
    // Updating app id
    this.updateId(this.$route.params.id);

    // Fetching app scopes
    this.getScopes({ appId: this.$route.params.id })
      .then(() => {
        // Checking scopes
        if (this.scopes.includes('delete') && this.scopes.includes('update') && this.scopes.includes('create')) {
          // Fetching app details
          this.getDetails({ appId: this.$route.params.id });
        } else {
          // Redirect to main
          this.$router.push({ path: '/' });
        }
      });
  },

  computed: {
    ...mapState({
      scopes: state => state.application.scopes,
    }),
  },
};
</script>

<style lang="scss">
  .app-navigation-sidebar {
    grid-area: sidebar;
    background-color: var(--theme-background-primary);
    overflow: auto;
    border-right: 1px solid var(--theme-border-light);
  }

  .wrapper {
    display: grid;
    height: 100%;
    grid-template-columns: 13.54% auto;
    grid-template-rows: $header-height auto;
    grid-template-areas:
     "header header" "sidebar app-container";
    &.iframe-wrapper {
      grid-template-rows: 6rem auto;
    }
  }

  .app-container {
    grid-area: app-container;
    background-color: var(--theme-background);
    overflow: hidden;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "left-bar main-content";
  }

  .left-bar {
    grid-area: left-bar;
  }

  .app-content {
    grid-area: main-content;
    width: 100%;
    max-height: calc(100vh - #{$header-height});
    padding: 2rem 4rem;
    overflow: auto;
  }

  // Styles for main container without submenu across the app editing pages
  .app-content--full {
    padding: 5rem 20rem;
  }

  .app-content-header {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--theme-border);

    h3 {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--theme-text);
      text-transform: uppercase;
    }

    .v-btn {
      margin: 0 0 0 1rem;
    }
  }

  .app-container--empty {
    h2 {
      opacity: .2;
      line-height: normal;
      text-align: center;
      text-transform: capitalize;
      font-size: 2rem;
    }

    .icon {
      width: 9.8rem;
      margin-bottom: 1.5rem;
      height: 12.8rem;
    }
  }

  // Common styles for the forms inside the drawers
  .drawer-form {
    .v-divider {
      margin: .8rem 0;
      border-color: var(--theme-border);
      opacity: .4;
    }
  }

  .opex-drawer-content .v-divider {
    position: relative;
    right: $drawer-indent;
    min-width: calc(100% + 2 * #{$drawer-indent});

    .v-btn {
      margin: .8rem 0;
    }

    .v-btn--text {
      margin-left: .4rem;
      text-transform: capitalize;
    }
  }
</style>
