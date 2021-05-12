<template>
  <v-layout
    column
    class="app-info-details"
    v-if="appName"
  >
    <div class="app-details">
      <v-layout align-center>
        <h2 v-html="'<'"></h2>
        <span :class="className"></span>
        <h4 class="main-name">{{ appName }}</h4>
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
  .app-info-details {
    .main-name {
      color: var(--theme-secondary-text);
      font-size: 1.2rem;
      font-weight: 600;
      line-height: initial;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      margin-left: 1.4rem;
    }

    a {
      text-decoration: blink;

      .v-btn {
        margin-left: 1rem;
        color: var(--theme-primary-text);
        padding: 1px 4px 0;
        min-width: auto;
      }
    }

    .app-details {
      margin-left: 1.1rem;
      .new-tab-icon{
        margin-left: 0.5rem;
      }
      span {
        position: relative;
        color: var(--theme-secondary-text);
        opacity: 0.7;
        text-transform: lowercase;
        height: 9px;
        margin-left: 1.1rem;
        &:first-letter {
          text-transform: capitalize
        }
        &:after {
          position: absolute;
          content: '';
          left: 0;
          top: 0;
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
