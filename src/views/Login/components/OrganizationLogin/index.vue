<!--Component with sign in button to login to Enframe using organization account on the Login page-->

<template>
  <v-layout column>
    <v-btn
      id="sign-org"
      large
      @click="login"
    >
      <v-layout
        row
        justify-space-around
        align-center
      >
        <img :src="orgLogo" alt="Login with Opex email"/>
        <span>Login with Opex email</span>
      </v-layout>
    </v-btn>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex';
import { get } from 'lodash';

import router from '@/router';
import orgLogo from '@/assets/images/org-logo.svg';

export default {
  name: 'OrganizationLogin',

  data() {
    return {
      orgLogo,
    };
  },

  methods: {
    ...mapActions('user', {
      orgLogin: 'orgLogin',
    }),

    // Return token to sign in
    login() {
      window.open(`${window.location.origin}${this.$constant.api.userManagement}auth/v1/login?client=org`,
        'window',
        'status=0,menubar=0,resizable=1,width=500,height=800;');
    },
  },
};

window.HandleGoogleResult = () => {
  const redirect = get(router, 'history.current.query.redirect', '/');
  router.push(redirect);
};
</script>

<style scoped lang="scss">
  #sign-org {
    margin: 0;
    padding: 1.32rem 1.2rem;

    img {
      width: 2rem;
      height: 2rem;
    }
  }
</style>
