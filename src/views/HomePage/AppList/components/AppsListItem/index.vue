<!--App info on Home page-->

<template>
  <opex-menu-list-item
    class="app-list-item"
    :is-active="isActive"
  >
    <opex-tooltip
      bottom
      :message="$message.applicationList.doubleClickMessage"
    >
      <template #activator>
        <v-layout
          justify-space-between
          align-center
          class="app-item-info"
        >
          <span :class="!appData.isEditable ? 'app-item-info-limit50' : ''">{{ appData.createdBy }}</span>
          <span
            class="view-only-badge"
            v-if="!appData.isEditable && roleName !== $constant.userRoles.appViewer"
          >
            VIEW ACCESS
          </span>
          <span>{{ time }}</span>
        </v-layout>
      </template>
    </opex-tooltip>
    <div class="app-item-name" :class="className">
      <h3>{{ appData.name }}</h3>
    </div>
  </opex-menu-list-item>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import { get } from 'lodash';

export default {
  name: 'AppsListItem',
  props: {
    appData: Object,
    isActive: Boolean,
  },

  computed: {
    ...mapState({
      roleName: state => state.user.userInfo.roleName,
    }),
    time() {
      return moment(this.appData.createdAt).format('MMMM DD, YYYY');
    },
    className() {
      const status = get(this, 'appData.status');
      let className = 'non_status';
      if (status === this.$constant.deployStatuses.active) className = 'success_status';
      if (status === this.$constant.deployStatuses.inactive) className = 'error_status';
      if (status === this.$constant.deployStatuses.inProgress) className = 'in_progress_status';
      return className;
    },
  },
};
</script>

<style scoped lang="scss">
  .app-list-item {
    padding: 1rem;
    border-bottom: 2px solid $light-border-color;
    cursor: pointer;
    position: relative;
    .app-item-info {
      color: var(--theme-secondary-text);
      opacity: .8;
      font-size: .8rem;
      font-weight: 600;
      span {
        max-width: 65%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .app-item-info-limit50 {
        max-width: 50%;
      }
      .view-only-badge {
        background-color: var(--theme-secondary);
        color: var(--theme-secondary-text);
        padding: 0.2rem;
        border-radius: 0.7rem;
      }
    }
    .app-item-name {
      position: relative;
      padding-left: 2rem;
      padding-top: 1rem;
      h3 {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-weight: 600;
      }
      &:after {
        position: absolute;
        content: '';
        left: 0;
        top: 1.5rem;
        border-radius: 50%;
        width: 9px;
        height: 9px;
      }
      &.non_status:after {
        background-color: var(--theme-primary);
        border: 1px solid rgba(255, 255, 255, 0.5);
      }
      &.success_status:after {
        background-color: var(--theme-success);
        border: 1px solid rgba(255, 255, 255, 0.5);
      }
      &.error_status:after {
        background-color: var(--theme-error);
        border: 1px solid rgba(255, 255, 255, 0.5);
      }
      &.in_progress_status:after {
        background-color: var(--theme-warning);
        border: 1px solid rgba(255, 255, 255, 0.5);
      }
    }
  }
</style>
