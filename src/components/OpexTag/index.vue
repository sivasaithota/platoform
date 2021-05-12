<!--Opex tag component-->

<template>
  <div class="opex-tag">
    <!--Showing a space instead of tag text if tag is minimized-->
    <span v-if="minimized">&nbsp;</span>
    <slot v-else></slot>
  </div>
</template>

<script>

export default {
  name: 'opex-tag',

  props: {
    // If passed, tag is shown just as a coloured square, without text
    minimized: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
  .opex-tag {
    display: inline-block;
    min-width: 1.2rem;
    margin: 0 0.1rem;
    padding: 0 0.4rem;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
    color: var(--theme-primary-text);
    border-radius: 0.15rem;
  }
</style>
