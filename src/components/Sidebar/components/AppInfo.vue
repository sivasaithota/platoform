<template>
  <v-layout
    column
    class="app-info"
  >
    <v-skeleton-loader
      :loading="!appName"
      class="app-info-skeleton"
      type="list-item-two-line"
    >
      <v-layout align-center>
        <h3 class="main-name">{{ appName }}</h3>
      </v-layout>

      <div class="app-item-status">
        <v-layout align-center justify-space-between>
          <h5 :class="className">{{ appStatus }}</h5>
          <router-link
            :to="{ path: '/apps/' + appUrl + '/'}"
            :class="linkClassName"
            target="_blank"
            v-if="appStatus === $constant.deployStatuses.active"
          >
            <v-btn
              x-small
              color="primary"
              outlined
            >
              Launch <opex-icon name="v2-new-tab" class="new-tab-icon"/>
            </v-btn>
          </router-link>
          </v-layout>
      </div>
    </v-skeleton-loader>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AppInfo',
  data() {
    return {
      buttonBackgroundColor: 'rgba(255,255,255,0.1)',
    };
  },


  computed: {
    ...mapState({
      appName: state => state.application.name,
      appStatus: state => state.application.status,
      appUrl: state => state.application.url,
      isFreshDeployed: state => state.application.isFreshDeployed,
    }),
    className() {
      const status = this.appStatus;
      let className = 'non_status';
      if (status === this.$constant.deployStatuses.active) className = 'success_status';
      if (status === this.$constant.deployStatuses.inactive) className = 'error_status';
      if (status === this.$constant.deployStatuses.inProgress) className = 'in_progress_status';
      return className;
    },
    linkClassName() {
      let linkClassName = 'non_status';
      if (this.isFreshDeployed) linkClassName = 'blink';
      return linkClassName;
    },
  },
};
</script>

<style scoped lang="scss">
  .app-info {
    background-color: var(--theme-background-primary);
    padding: 1.2rem 0.5rem;
    position: relative;
    border-bottom: 1px solid var(--theme-border-light);

    .main-name {
      color: var(--theme-secondary-text);
      font-size: 1.2rem;
      font-weight: 700;
      line-height: initial;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      padding-left: 1rem;
    }

    a {
      text-decoration: blink;

      .v-btn {
        margin: 0 0.5rem;
        color: var(--theme-primary-text);
        padding: 1px 4px 0;
        min-width: auto;
      }
    }

    .app-item-status {
      margin: 0.4rem 0 0 1rem;
      .new-tab-icon{
        margin-left: 0.5rem;
      }
      h5 {
        position: relative;
        color: var(--theme-secondary-text);
        opacity: 0.7;
        text-transform: lowercase;
        padding-left: 1.1rem;
        &:first-letter {
          text-transform: capitalize
        }
        &:after {
          position: absolute;
          content: '';
          left: 0;
          top: 0.3rem;
          border-radius: 50%;
          width: 9px;
          height: 9px;
        }

        &.non_status:after {
          background-color: var(--theme-primary);
        }

        &.success_status:after {
          background-color: var(--theme-success);
        }

        &.error_status:after {
          background-color: var(--theme-error);
        }

        &.in_progress_status:after {
          background-color: var(--theme-warning);
        }
      }
    }

    .blink {
      animation: link-blink-animation 1s steps(5, start) infinite;
    }
  }

  @keyframes link-blink-animation {
    0% {
      opacity: 0;
    }
    50% {
      opacity: .5;
    }
    100% {
      opacity: 1;
    }
  }
</style>

<style lang="scss">
  .app-info-skeleton .v-skeleton-loader__list-item-two-line {
    height: auto;
    padding: 0 0.8rem;

    .v-skeleton-loader__text {
      background: var(--theme-background-hover);

      &:nth-child(1) {
        margin-bottom: 0.7rem;
      }
    }
  }
</style>
