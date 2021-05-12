<template>
  <!-- <div >
    <app-studio-header></app-studio-header>
  </div> -->
  <v-toolbar height="prominent" class="iframe-header" v-if="isIframe">
    <div class="top-bar">
      <span >
        <ProductsMenu />
      </span>
      <header-link
        v-if="userInfo.isAdmin"
        :url="settingUrl"
        icon-name="v10-settings-outline"
        class="iframe-link"
      />
      <header-link
        :url="connectorDocumentation"
        icon-name="v10-help-outline"
        class="iframe-link"
      />
    </div>
    <div class="bottom-bar">
      <span
        class="app-title"
        @click="$router.push({ path: '/' })"
      >
        App Studio OpenX
      </span>
      <app-info v-if="this.$route.params.id"></app-info>
    </div>
  </v-toolbar>
  <v-toolbar height="prominent" class="app-header" v-else>
    <ProductsMenu />
    <img
      :src="CoupaLogo"
      alt="Coupa Supply Chain App Studio OpenX"
      class="coupa-logo"
    >
    <span
      class="app-title"
      @click="$router.push({ path: '/' })"
    >
      Supply Chain App Studio OpenX
    </span>
    <v-spacer/>
    <header-link
      :url="connectorDocumentation"
      icon-name="v2-forgot-password"
    />
    <header-link
      v-if="userInfo.isAdmin"
      :url="settingUrl"
      icon-name="v2-app-settings"
    />
    <header-user/>
  </v-toolbar>
</template>

<script>
import { mapState } from 'vuex';
import CoupaLogo from '@/assets/svg/coupa-logo-white.svg';
import ProductsMenu from './components/ProductsMenu';
import HeaderLink from './components/HeaderLink';
import HeaderUser from './components/User';
import AppInfo from './components/AppInfo';

export default {
  components: {
    HeaderUser, ProductsMenu, HeaderLink, AppInfo,
  },
  data() {
    return {
      CoupaLogo,
      settingUrl: '/settings',
      connectorDocumentation: '/connector_documentation/',
      isIframe: this.$common.isIframe(),
    };
  },

  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
    }),
  },
};
</script>

<style scoped lang="scss">
  .coupa-logo {
    height: 1.8rem;
    padding-left: .5rem
  }
  .app-title {
    font-size: 1.5rem;
    font-weight: 600;
    cursor: pointer;
    padding-left: 1.5rem;
    height: 3.8rem;
    display: flex;
    align-items: center;
  }
  .app-header.v-sheet {
    grid-area: header;
    background-color: var(--theme-primary);
    color: var(--theme-primary-text);
    z-index: 10;
    box-shadow: none;
    .v-toolbar__content {
      padding: 0;
    }
  }
</style>

<style lang="scss">
  .app-header.v-sheet .v-toolbar__content {
    padding: 0;
  }
</style>

<style lang="scss">
  .iframe-header.v-sheet {
    grid-area: header;
    background-color: var(--theme-background);
    color: var(--theme-secondary-text);
    z-index: 10;
    box-shadow: none;
    border-bottom: 1px solid var(--theme-border-light);
    > .v-toolbar__content {
      padding: 0;
      flex-direction: column;
      > .top-bar {
        width: 100%;
        display: flex;
        height: 2.2rem;
        padding-left: 1.5rem;
        align-items: center;
        background-color: var(--theme-background-primary);
        > span {
          flex: 1;
        }
      }
      > .bottom-bar {
        width: 100%;
        display: flex;
        height: 3.8rem;
        align-items: center;
      }
    }
    .iframe-link {
      width: 2.2rem;
      height: 2.2rem;
      color: var(--theme-secondary-color);
      margin-right: 1rem;
      font-size: 1.5rem;
    }
  }
</style>
