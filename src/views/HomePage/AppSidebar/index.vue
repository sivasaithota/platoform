<!--Sidebar on Home page-->

<template>
  <aside>
    <!--Button to create new application-->
    <div class="sidebar-container">
      <v-btn
        v-if="roleName !== $constant.userRoles.appViewer"
        color="secondary"
        class="new-app-btn"
        to="/new-application"
        large
        block
      >
        + new application
      </v-btn>

      <!--Info about active apps-->
      <sidebar-info
        :loading="loading"
        :is-active="this.selectedSortType === $constant.deployStatuses.active"
        :activeApps="appsCount[$constant.deployStatuses.active]"
        class-name="success"
        icon-name="v2-active-apps"
        type-name="Active Apps"
        :popup-message="$message.applicationList.activeApps"
        @click.native="sortAppsByStatus($constant.deployStatuses.active)"
      />
      <!--Info about inactive apps-->
      <sidebar-info
        :loading="loading"
        :is-active="this.selectedSortType === $constant.deployStatuses.inactive"
        :activeApps="appsCount[$constant.deployStatuses.inactive]"
        class-name="error"
        icon-name="v2-inactive-apps"
        type-name="Inactive Apps"
        :popup-message="$message.applicationList.inactiveApps"
        @click.native="sortAppsByStatus($constant.deployStatuses.inactive)"
      />
      <!--Info about in-progress apps-->
      <sidebar-info
        :loading="loading"
        :is-active="this.selectedSortType === $constant.deployStatuses.inProgress"
        :activeApps="appsCount[$constant.deployStatuses.inProgress]"
        class-name="warning"
        icon-name="v2-in-progress"
        type-name="In Progress Apps"
        :popup-message="$message.applicationList.inProgressApps"
        @click.native="sortAppsByStatus($constant.deployStatuses.inProgress)"
      />
    </div>

    <!--List of applications-->
    <div class="sidebar-menu">
      <div class="sidebar-title">
        Applications
      </div>

      <v-skeleton-loader
        :loading="loading"
        class="sidebar-apps-skeleton"
        type="list-item"
      >
        <sidebar-apps
          icon-name="input-data"
          type-name="All Apps"
          :count="allApps"
          path="all-apps"
        />
      </v-skeleton-loader>
    </div>
    <div class="app-version">
      Version: {{appVersion}}
    </div>
  </aside>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

import SidebarInfo from './components/SidebarInfo';
import SidebarApps from './components/SidebarApps';

export default {
  name: 'AppSidebar',

  components: { SidebarInfo, SidebarApps },

  data() {
    return {
      loading: true,
    };
  },

  computed: {
    ...mapState({
      info: state => state.applicationList.info,
      appList: state => state.applicationList.appList,
      selectedSortType: state => state.applicationList.selectedSortType,
      roleName: state => state.user.userInfo.roleName,
    }),
    appsCount() {
      return this.info.appsCount || {};
    },
    appVersion() {
      return this.info.latestACVersion || '';
    },
    allApps() {
      return this.$store.getters['applicationList/allAppsCount'];
    },
  },

  methods: {
    ...mapActions('applicationList', {
      getInfo: 'getInfo',
      getAllApps: 'getAllApps',
    }),
    ...mapMutations('applicationList', {
      updateSelectedAppId: 'updateSelectedAppId',
      updateSelectedSortType: 'updateSelectedSortType',
    }),

    sortAppsByStatus(type) {
      this.updateSelectedSortType(this.selectedSortType === type ? null : type);
      this.getAllApps({ firstRequest: true })
        .then(() => this.updateSelectedAppId(this.appList[0] ? this.appList[0]._id : null));
    },
  },

  mounted() {
    this.getInfo().then(() => {
      this.loading = false;
    });
  },
};
</script>

<style scoped lang="scss">
  aside {
    grid-area: sidebar;
    background-color: var(--theme-background-primary);
    color: var(--theme-primary-text);
    position: relative;
    border-right: 1px solid var(--theme-border-light);
  }

  .v-btn.new-app-btn {
    height: 3.7rem;
    border-radius: 4px;
    margin-bottom: 2rem;
  }

</style>

<style lang="scss">
  .v-skeleton-loader.sidebar-apps-skeleton {
    .v-skeleton-loader__text {
      height: 1.4rem;
      border-radius: .8rem;
      background: var(--theme-background-hover);
    }
  }
  .app-version {
    position: absolute;
    bottom: 1.3rem;
    left: 1.3rem;
    font-weight: 400;
  }
</style>
