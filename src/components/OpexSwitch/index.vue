<template>
  <v-switch
    inset
    v-model="model"
    :ripple="false"
    :rules="rules"
    :hide-details="hideDetails"
    @change="$emit('change', $event)"
  >
    <template #label>
      <v-layout
        column
        align-start
      >
        <span
          class="switch-title"
          :class="labelTransform"
        >
          {{ label }}
        </span>
        <span class="switch-description">{{ description }}</span>
      </v-layout>
    </template>
  </v-switch>
</template>

<script>
export default {
  name: 'opex-switch',

  props: {
    value: Boolean,
    label: String,
    description: String,
    rules: Array,
    hideDetails: Boolean,
    labelTransform: {
      type: String,
      default: 'text-uppercase',
    },
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

<style lang="scss">
  div.v-input.v-input--switch {
    margin: 0;

    div.v-input__slot {
      flex-direction: row-reverse;
      justify-content: space-between;
      margin-bottom: 0;
    }

    label.v-label {
      width: 100%;
      height: auto;
      font-size: .8rem;
      line-height: normal;

      .switch-title {
        font-weight: 700;
        color: var(--theme-secondary);
      }

      .switch-description {
        width: 90%;
        font-weight: 400;
        color: rgba(var(--theme-primary-rgb), 0.5);
      }
    }

    div.v-input--selection-controls__input {
      align-items: center;
      width: 2.7rem;
      height: 1.6rem;
      margin-right: .5rem;

      .v-input--switch__track {
        height: 1.6rem;
        width: 2.7rem;
        top: 0;
        left: 0;
        border-radius: .8rem;
        opacity: 1;

        &:before, &:after {
          position: absolute;
          font-family: OpexIcon, sans-serif;
          font-size: 1.05rem;
          color: var(--theme-primary-text);
        }

        &:before {
          content: "\e921";
          left: .2rem;
        }
        &:after {
          content: "\e912";
          right: .2rem;
        }

        &.accent--text {
          background-color: var(--theme-primary);
        }
        &.primary--text {
          background-color: var(--theme-primary);
        }
      }

      .v-input--switch__thumb {
        width: 1.3rem;
        height: 1.3rem;
        top: 0;
        left: .15rem;
        background-color: var(--theme-background-light);
        box-shadow: none;

        &.accent--text {
          transform: translate(1.1rem, 0);
        }
      }
    }

    &.v-input--is-label-active .v-input--switch__thumb {
      transform: translate(1.07rem, 0) !important;
    }
  }
</style>
