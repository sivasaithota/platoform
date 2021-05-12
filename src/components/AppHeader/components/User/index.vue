<template>
  <v-menu
    offset-y
    right
    max-width="10rem"
    offset-x
  >
    <template v-slot:activator="{ on }">
      <div
        v-on="on"
        class="account-header d-flex flex-row align-center"
      >
        <v-avatar
          v-if="avatarUrl"
          class="account-avatar"
        >
          <img :src="avatarUrl" alt="ava"/>
        </v-avatar>
        <v-layout
          v-else
          align-center
          justify-center
          class="user-letter-avatar"
        >
          <span>{{ initials }}</span>
        </v-layout>
        <v-layout column>
          <span class="account-name">{{ userInfo.name }}</span>
          <span class="account-role">{{ role }}</span>
        </v-layout>
        <opex-icon name="v2-np-arrow"/>
      </div>
    </template>
    <v-list>
      <v-list-item
        @click="logout"
      >
        Sign Out
      </v-list-item>
    </v-list>
  </v-menu>

</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'HeaderUser',
  data() {
    return {
      avatarUrl: '',
    };
  },

  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
    }),

    role() {
      if (this.userInfo.roles.includes(this.$constant.userRoles.admin)) return this.$constant.userRoles.admin;
      if (this.userInfo.roles.includes(this.$constant.userRoles.architect)) return this.$constant.userRoles.architect;
      if (this.userInfo.roles.includes(this.$constant.userRoles.appDeveloper)) return this.$constant.userRoles.appDeveloper;
      return this.$constant.userRoles.appViewer;
    },

    initials() {
      const nameSplit = this.userInfo.name.split(' ');
      const secondChar = nameSplit[1] || '';
      return nameSplit[0].charAt(0) + secondChar.charAt(0);
    },
  },

  methods: {
    ...mapActions('user', {
      logout: 'logout',
    }),
  },
};
</script>

<style scoped lang="scss">
  .v-list {
    padding: 0;
    .v-list-item {
      min-height: 3rem;
    }
  }
  .account-header {
    position: relative;
    padding-right: 1rem;
    padding-left: 1rem;
    cursor: pointer;
    .account-role {
      text-transform: uppercase;
      font-size: .7rem;
      color: var(--theme-primary-text);
      font-weight: 400;
      opacity: .4;
    }
    .account-role{
      font-weight: 600;
    }
    .user-letter-avatar {
      width: $header-height/2;
      height: $header-height/2;
      font-weight: 600;
      border-radius: 50%;
      background-color: #53b8e7;
      color: var(--theme-primary-text);
      margin-right: 1rem;
      text-transform: uppercase;
    }
    i {
      font-size: 4px;
      background-color: var(--theme-primary-text);
      color: var(--theme-primary);
      padding: 2px;
      border-radius: 50%;
      margin-left: 0.7rem;
    }
  }
</style>
