<!--Menu app item on Home page-->

<template>
  <v-layout
    column
    class="opex-menu-list-item"
    :class="isActive && 'active'"
  >
    <slot/>
  </v-layout>
</template>

<script>
export default {
  name: 'OpexMenuListItem',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
  .opex-menu-list-item {
    transition: background-color 0.2s;
    &.active:after {
      content: '';
      height: 100%;
      border-right: 5px solid var(--theme-accent);
      position: absolute;
      left: 0;
      top: 0;
    }
    &:hover:before,
    &.active:before {
      content: '';
      width: 100%;
      height: 100%;
      background-color: var(--theme-secondary);
      opacity: 0.05;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }
  }
</style>
