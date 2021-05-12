<template>
  <div id="app-wrapper" :class="{'iframe-wrapper': isIframe}">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'AppWrapper',
  data() {
    return {
      isIframe: this.$common.isIframe(),
    };
  },
};
</script>

<style scoped lang="scss">
  #app-wrapper {
    display: grid;
    height: 100%;
    grid-template-columns: $sidebar-width auto;
    grid-template-rows: $header-height auto;
    grid-template-areas: "header header" "sidebar app-container";
    &.iframe-wrapper {
      grid-template-rows: 6rem auto;
    }
  }
</style>
