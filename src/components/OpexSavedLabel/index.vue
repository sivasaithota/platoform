<!--SAVED label component. Visibility is controlled through the v-model-->

<template>
  <v-scroll-x-transition>
    <v-layout
      align-center
      v-show="show"
      class="opex-saved-label"
    >
      <opex-icon name="success"/>
      <span>saved</span>
    </v-layout>
  </v-scroll-x-transition>
</template>

<script>
export default {
  name: 'opex-saved-label',

  props: {
    value: Boolean,
    timeout: {
      type: Number,
      default: 1000,
    },
  },

  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },

  watch: {
    // Watching the value prop change
    // When changed to true, waiting for the timeout and changing back to false
    value() {
      if (!this.value) return;
      setTimeout(() => {
        this.show = false;
      }, this.timeout);
    },
  },
};
</script>

<style scoped lang="scss">
  .opex-saved-label {
    color: var(--theme-success);
    font-size: 0.6rem;
    font-weight: bold;
    line-height: 1;
    text-transform: uppercase;

    i {
      font-size: 1rem;
    }
  }
</style>
