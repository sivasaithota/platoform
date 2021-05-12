<!--Card with link to different types of apps on Home page-->

<template>
  <router-link
    :to="path"
    tag="div"
    class="sidebar-apps"
  >
    <v-layout justify-space-between>
      <span class="sidebar-app-type">
        {{ typeName }}
      </span>
      <v-layout
        justify-center
        align-center
        class="sidebar-app-count"
      >
        {{ count }}
      </v-layout>
    </v-layout>
  </router-link>
</template>

<script>
export default {
  name: 'SidebarIndex',

  props: {
    iconName: String,
    typeName: String,
    count: Number,
    path: String,
  },
};
</script>

<style scoped lang="scss">
  .sidebar-apps {
    position: relative;
    padding: 1rem $sidebar-padding;
    &.router-link-active {
      background-color: #E9E9E9;
      &:after {
        content: '';
        height: 100%;
        border-right: 5px solid;
        border-color: var(--theme-accent);
        position: absolute;
        left: 0;
        top: 0;
      }
      .sidebar-app-count {
        background-color: var(--theme-accent);
        color: var(--theme-primary-text);
      }
      i {
        color: var(--theme-accent);
      }
    }
    &:hover {
      background-color: #E9E9E9;
    }

    .sidebar-app-type {
      color: var(--theme-secondary-text);
      font-size: 1.2rem;
      font-weight: 400;
    }
    .sidebar-app-count {
      height: 1.5rem;
      width: 2.5rem;
      flex-grow: 0;
      border-radius: 9px;
      color: var(--theme-primary-text);
      font-size: .9rem;
      background-color: var(--theme-background-hover);
    }
  }
</style>
