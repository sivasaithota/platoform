<!--Login page component-->

<template>
  <v-layout
    align-center
    justify-center
    column
    fill-height
    class="login-container"
  >
    <!--Header-->
    <img :src="opexEnframeLogo" class="login-header-image" alt="Opex Analytics">

    <!--Login Forms-->
    <div class="login-form">
      <!--Organization sign in Button-->
      <organization-login v-if="isBlocksVisible"/>
      <!--Separator-->
      <v-layout
        v-if="isBlocksVisible"
        class="or-divider"
      >
        <div class="block"></div>
        <span>or</span>
        <div class="block"></div>
      </v-layout>
      <!--Button to sign in using normal username/password-->
      <username-login @visibility="activateElements"/>
    </div>

    <!--Logo-->
    <div class="powered-by">
      <a href="http://opexanalytics.com/" target="_blank">
        <img :src="poweredBy" alt="Opex Analytics">
      </a>
    </div>
  </v-layout>
</template>

<script>
import poweredBy from '@/assets/svg/powered-by-2.svg';
import opexEnframeLogo from '@/assets/svg/opex-enframe-logo.svg';
import OrganizationLogin from './components/OrganizationLogin/index';
import UsernameLogin from './components/UsernameLogin/index';

export default {
  name: 'login',

  components: { OrganizationLogin, UsernameLogin },

  data() {
    return {
      poweredBy,
      opexEnframeLogo,
      isBlocksVisible: true,
    };
  },

  methods: {
    activateElements(value) {
      this.isBlocksVisible = value;
    },
  },
};
</script>

<style scoped lang="scss">
  .login-container {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, .6), rgba(0, 0, 0, .6)),
      url('../../assets/images/theme/default-theme-2.png');
  }
  .powered-by {
    position: absolute;
    right: 2.86rem;
    bottom: 2.86rem;
    img {
      width: 8rem;
    }
  }
  .login-form {
    width: 24.3rem;
  }
  .login-header-image {
    margin-bottom: 2.25rem;
  }
  .or-divider {
    margin: 1rem 0;
    color: var(--theme-primary-text);
    font-weight: 700;
    .block {
      border-bottom: 0.1rem solid var(--theme-primary-text);
      height: 1rem;
      margin: 0 .5rem;
      -webkit-box-flex: 1;
      box-sizing: border-box;
      width: 100%;
    }
  }
</style>
