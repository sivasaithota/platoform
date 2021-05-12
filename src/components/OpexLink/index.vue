<!--Link component with optional plus sign-->

<template>
  <a
    class="opex-link"
    :style="{color: linkColor}"
    :class="{'disabled': disabled}"
    @click="$emit('click')"
  >
    <!--Optional plus sign-->
    <span v-if="plusSign" class="link-plus">+</span>

    <!--Link content passed through the slot-->
    <span class="link-content">
      <slot></slot>
    </span>
  </a>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'opex-link',

  props: {
    color: {
      type: String,
      default: 'secondary',
    },

    // Whether to show a bordered plus sign before the link text
    plusSign: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: mapState({
    linkColor(state) {
      return state.theme.colors[this.color];
    },
  }),
};
</script>

<style scoped lang="scss">
  .opex-link {
    font-size: 0.8rem;
    font-weight: bold;
    &.disabled {
      pointer-events: none;
      cursor: default;
      opacity: .5;
    }

    .link-content {
      text-decoration: underline;
      text-transform: capitalize;
    }

    .link-plus {
      display: inline-block;
      margin-right: 0.2rem;
      padding: 0.1rem 0.45rem;
      border: 0.05rem dashed;
      border-radius: 0.2rem;
      color: var(--theme-primary);
      border-color: var(--theme-border);
    }
    &:hover {
      opacity: 0.8;
    }
  }
</style>
