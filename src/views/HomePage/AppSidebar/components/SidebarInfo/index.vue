<!--Information card about active/inactive apps on Home page-->

<template>
  <v-skeleton-loader
    :loading="loading"
    class="sidebar-info-skeleton"
    type="list-item-avatar-two-line"
  >
    <v-layout
      align-center
      class="apps-info"
      :class="isActive && 'active'"
    >
      <v-layout
        justify-center
        align-center
        class="icon--app"
        :class="className"
      >
        <opex-icon :name="iconName"/>
      </v-layout>

      <v-layout column class="apps-info-content">
        <span class="name">{{ typeName }}</span>
        <span class="count">{{ activeApps }}</span>
      </v-layout>

      <!--Tooltip with information about app types-->
      <opex-tooltip
        right
        color="white"
        font-color="secondary"
        icon="info-fill"
        :title="typeName"
      >
        <!-- <template #activator>
          <opex-icon
            name="info-fill"
            class="opex-icon icon--info"
          />
        </template> -->
        <p class="apps-info-message">{{ popupMessage }}</p>
      </opex-tooltip>
    </v-layout>
  </v-skeleton-loader>
</template>

<script>
export default {
  name: 'SidebarInfo',

  props: {
    loading: Boolean,
    isActive: Boolean,
    activeApps: Number,
    className: String,
    iconName: String,
    typeName: String,
    popupMessage: String,
  },
};
</script>

<style lang="scss">
  .v-skeleton-loader.sidebar-info-skeleton {
    margin-bottom: .7rem;
    background-color: var(--theme-background-hover);
    border-radius: .2rem;

    &>.v-skeleton-loader__bone {
      height: 5.2rem;

      .v-skeleton-loader__avatar, .v-skeleton-loader__text {
        background: var(--theme-background-hover);
      }
    }
  }

  .apps-info {
    cursor: pointer;
    margin-bottom: .7rem;
    padding: 1rem;
    color: var(--theme-primary-text);
    border-radius: .2rem;
    border: 2px solid transparent;
    background-color: #e9e9e9;
    &.active {
      // border-color: rgba(var(--theme-primary-text-rgb), 0.5);
    }
    .icon--app {
      min-width: 2.5rem;
      height: 2.5rem;
      font-size: 1.2rem;
      border-radius: 50%;
      margin-right: 1rem;
    }
    .icon--info {
      opacity: .5;
      font-size: 1.8rem;
      cursor: pointer;
    }
    .apps-info-content {
      width: 100%;
      line-height: 1.1;
      color: var(--theme-secondary-text);

      .name {
        font-size: .8rem;
        text-transform: uppercase;
        font-weight: bold;
      }
      .count {
        font-size: 1.2rem;
      }
    }
  }
  .apps-info-message {
    margin: 0 0 0 2rem;
    font-size: .9rem;
    color: var(--theme-text);
  }
</style>
