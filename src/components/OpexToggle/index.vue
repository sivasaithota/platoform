<template>
  <div>
    <v-layout
      align-center
      justify-start
      wrap
    >
      <div
        v-for="(item, index) in radioItems"
        :key="index"
        class="radio_container"
      >
        <input
          name="radio"
          type="radio"
          v-model="model"
          :id="`opex-toggle-${index}`"
          :value="item[itemValue] || item"
          @change="$emit('change', $event)"
        >
        <label :for="`opex-toggle-${index}`">
          {{ item[itemText] || item }}
        </label>
      </div>
    </v-layout>
  </div>
</template>
<script>
export default {
  name: 'opex-toggle',

  props: {
    value: String,
    radioItems: Array,
    itemValue: String, // Property to use for each item, if items are Objects
    itemText: String, // Property to show for each item, if items are Objects
  },

  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>
<style scoped lang="scss">
  %radio_view {
    background-color: var(--theme-secondary);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
    border-color: rgba(51, 71, 91, 0.2);
    color: var(--theme-primary-text);
  }

  .radio_container {
    margin-right: 0.72rem;
    margin-bottom: 0.72rem;

    label {
      display: flex;
      background: var(--theme-background);
      border: solid 1px;
      border-color: var(--theme-border);
      border-radius: 3px;
      cursor: pointer;
      color: var(--theme-text);
      padding: 0.7rem;
      transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), box-shadow 1ms;
      font-weight: 500;
      &:hover {
        @extend %radio_view;
      }
      i {
        font-size: 2.3rem;
      }
    }

    input[type="radio"] {
      display: none;
    }

    input[type="radio"]:checked+label {
      @extend %radio_view;
    }
  }
</style>
