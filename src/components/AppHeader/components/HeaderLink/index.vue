<!-- You can pass to this component or URL or @click handler-->
<!-- However, you still must pass icon-name parameter-->

<template>
  <router-link
    v-ripple
    :to="url"
    target="_blank"
    class="d-flex router-link align-center justify-center"
    :class="{'iframe-link': isIframe}"
  >
    <opex-icon :name="iconName" />
  </router-link>
</template>

<script>
export default {
  name: 'HeaderLink',
  data() {
    return {
      isIframe: this.$common.isIframe(),
    };
  },
  props: {
    iconName: String,
    url: String,
  },
};
</script>

<style scoped lang="scss">
  .router-link {
    cursor: pointer;
    width: $header-height;
    height: $header-height;
    font-size: 1.9rem;
    color: var(--theme-primary-text);
    text-decoration: none;
    background-color: transparent;
    transition: background-color 0.1s;
    &:hover {
      background-color: var(--theme-secondary);
      transition: background-color 0.2s;
    }
    &.iframe-link:hover{
      background-color: var(--theme-background-primary);
      color: var(--theme-accent);
      border: 1px solid var(--theme-accent);
    }
  }
</style>
