<template>
  <router-link
    v-ripple
    :to="url"
    class="menu-item-link"
    :class="{selected: $route.path.startsWith(url)}"
  >
    <opex-icon :name="icon" class="opex-icon"></opex-icon>
    <span>{{name}}</span>
  </router-link>
</template>

<script>
export default {
  name: 'menu-item',
  props: {
    url: String,
    name: String,
    icon: String,
  },
};
</script>

<style lang="scss" scoped>
  .opex-icon {
    font-size: 1.2rem;
    margin-right: 0.6rem;
  }

  .menu-item-link {
    color: var(--theme-secondary-text);
    text-decoration: none;
    width: 100%;
    padding: 0.8rem 1.2rem;
    border-left: 0.3rem solid transparent;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      background-color: rgba(51, 51, 51, 0.05);
    }
  }

  .selected {
    border-left-color: var(--theme-accent);
    background-color: rgba(51, 51, 51, 0.05);
    .opex-icon {
      color: var(--theme-accent);
    }
  }
</style>
