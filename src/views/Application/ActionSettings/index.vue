<!--Action Settings root page component-->

<template>
  <div class="position-relative">
    <!--Submenu with action settings options-->
    <opex-submenu
      title="action settings"
      :items="submenuItems"
      v-model="selectedItem"
    />

    <div class="action-settings">
      <immediate-update-banner/>
      <router-view :loading="loading"/>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ActionSettings',

  data() {
    return {
      loading: true,

      submenuItems: [
        {
          name: 'Primary Action',
          route: 'primary action',
          icon: 'v2-primary-action',
        },
        {
          name: 'Secondary Actions',
          route: 'secondary actions',
          icon: 'v2-action-icon',
        },
        // For future migrating the action workflows to the Enframe
        {
          name: 'Workflows',
          route: 'workflows',
          icon: 'v2-enframe-workflows',
        },
        {
          name: 'Scheduler',
          route: 'scheduler',
          icon: 'v2-scheduler-icon',
        },
      ],
      selectedItem: 0,
    };
  },

  methods: {
    ...mapActions({
      getActions: 'actionSettings/getActions',
      getScripts: 'actionSettings/getScripts',
      getEnvironments: 'environment/getEnvironments',
    }),
  },

  mounted() {
    if (this.$route.name === 'action settings') {
      // Default route
      this.$router.push({ name: this.submenuItems[0].route });
    } else {
      // Selected submenu item basing on the route name
      this.selectedItem = this.submenuItems.findIndex(item => item.route === this.$route.name);
    }

    // Fetching action settings data from the server after fetching app details
    return Promise.all([
      this.getActions(this.$route.params.id),
      this.getScripts(this.$route.params.id),
      this.getEnvironments(),
    ])
      .then(() => {
        this.loading = false;
      });
  },
};
</script>

<style lang="scss">
  .action-settings {
    max-height: calc(100vh - #{$header-height});
    overflow: auto;

    .app-content {
      max-height: 100%;
    }
  }

  .action-card {
    width: 100%;
    display: grid;

    .action-card-title {
      font-weight: 600;
      font-size: 1.2rem;
    }

    .action-card-subtitle {
      margin-bottom: 1.2rem;
      font-size: 0.9rem;
      font-weight: 500;
      opacity: 0.6;
    }

    .no-data {
      color: var(--theme-support)
    }
  }

  .opex-card.action-settings-skeleton {
    margin-top: 1rem;

    .layout {
      width: 80%;
      align-self: start;
    }

    .v-skeleton-loader {
      width: 100%;

      .v-skeleton-loader__heading {
        width: 30%;
        height: 1.6rem;
        margin-bottom: 2rem;
        background: var(--theme-secondary);
        opacity: .16;
      }

      .v-skeleton-loader__list-item-two-line {
        padding: 0 40% 0 0;
      }
    }
  }

  .inactive-app-notice {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--theme-warning);
  }
</style>
