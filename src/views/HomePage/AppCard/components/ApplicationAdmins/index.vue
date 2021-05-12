<!-- Application admins preview and btn to show all -->
<template>
  <v-flex xs4 class="app-info">
    <div class="app-info-title">App shared with</div>
    <v-menu
      v-if="allUsers.length"
      open-on-hover
      offset-x right
    >
      <template #activator>
        <v-layout class="user-list">
          <v-layout
            align-center
            justify-center
            class="user-initials"
            v-for="(user, index) in initialsList"
            :class="`user-initials-${index}`"
            :key="index"
          >
            <span>{{ user }}</span>
          </v-layout>
        </v-layout>
      </template>

      <div class="all-users">
        <div class="all-users-title">
          App shared with
        </div>
        <v-layout
          row
          align-baseline
          v-for="(item, index) in allUsers"
          :key="index"
          class="all-users-item"
        >
          <div>
            <v-layout
              row
              align-center
              justify-center
              class="user-initials"
            >
              <span>{{ getInitials(item.name) }}</span>
            </v-layout>
          </div>
          <div>{{ item.name }}</div>
        </v-layout>
      </div>
    </v-menu>
    <div
      v-else
      class="app-info-value app-info-value--empty"
    >{{ emptyValue }}</div>
  </v-flex>
</template>

<script>
import { get, map } from 'lodash';
import { mapState } from 'vuex';

export default {
  name: 'ApplicationAdmins',
  props: {
    emptyValue: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState({
      selectedApp: state => state.applicationList.selectedApp,
    }),
    allUsers() {
      return get(this.selectedApp, 'users', []);
    },
    initialsList() {
      const usersArray = this.allUsers.length > 5 ? this.allUsers.slice(0, 4) : this.allUsers;
      const initials = map(usersArray, user => this.getInitials(user.name));
      const extraCount = this.allUsers.length - usersArray.length;
      if (extraCount) initials.push(`+${extraCount}`);
      return initials;
    },
  },
  methods: {
    getInitials(name) {
      const nameSplit = name.split(' ');
      const secondChar = nameSplit[1] || '';
      return nameSplit[0].charAt(0) + secondChar.charAt(0);
    },

  },
};
</script>

<style scoped lang="scss">
  .user-list  .user-initials {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 1px solid var(--theme-background-light);
    color: var(--theme-primary-text);
    background-color: var(--theme-primary);
    text-transform: uppercase;
    font-size: .7rem;
    margin-left: -.3rem;
    &.user-initials-0 {
      z-index: 5;
      margin-left: 0;
    }
    &.user-initials-1 {
      z-index: 4;
      filter: brightness(125%);
    }
    &.user-initials-2 {
      z-index: 3;
      filter: brightness(150%);
    }
    &.user-initials-3 {
      z-index: 2;
      filter: brightness(175%);
    }
    &.user-initials-4 {
      z-index: 1;
      filter: brightness(200%);
    }
  }

  .all-users {
    background-color: var(--theme-primary);
    color: var(--theme-primary-text);
    cursor: default;
    .all-users-title {
      font-weight: bold;
      padding: .7rem;
      text-transform: uppercase;
      opacity: .6;
    }
    .all-users-item {
      padding: .7rem;
      padding-top: 0;
      font-weight: 500;
    }
    .user-initials {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      color: var(--theme-secondary-text);
      background-color: var(--theme-secondary);
      text-transform: uppercase;
      font-size: .8rem;
      margin-right: .7rem;
    }
  }
</style>
