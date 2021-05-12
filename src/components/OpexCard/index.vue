<!--Component with common styles for the cards used across the app
    with the abilities to delete and drag-and-drop the cards if the appropriate props are passed
-->

<template>
  <v-layout
    align-center
    class="opex-card"
    :class="{interactive: !disabled}"
  >
    <img
      src="@/assets/svg/sort-icon.svg"
      alt="sort element"
      class="handle"
      v-if="isDraggable"
    />

    <slot></slot>

    <!--Delete card button with confirm popup-->
    <opex-popup
      left
      :title="popupTitle"
      :message="popupMessage"
      button-name="delete"
      @confirm="deleteCardConfirm"
      v-if="isDeletable"
    >
      <v-btn
        text
        fab
        color="primary"
        class="delete-card-button"
      >
        <opex-icon name="delete-fill"/>
      </v-btn>
    </opex-popup>
  </v-layout>
</template>

<script>
export default {
  name: 'opex-card',
  props: {
    isDraggable: Boolean,
    isDeletable: Boolean,
    popupTitle: String,
    popupMessage: String,

    // Disables the card style change on hover
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    // Emitting event to the parent component to delete the card
    deleteCardConfirm() {
      this.$emit('deleteConfirm');
    },
  },
};
</script>

<style scoped lang="scss">
  .opex-card {
    width: 100%;
    padding: 1rem;
    margin-bottom: .8rem;
    background-color: var(--theme-background-primary);
    box-shadow: 0 1px 1px 0 var(--theme-background-grey);
    border-left: .3rem solid transparent;
    transition: all .2s;

    &.selected {
      border-left-color: var(--theme-secondary);
    }

    &.interactive {
      cursor: pointer;

      &:hover {
        border-left-color: var(--theme-secondary);
        box-shadow: 0 2px 4px rgba(0,0,0,.2);
      }
    }
  }

  .opex-label {
    display: block;
  }

  .opex-card-value {
    font-size: 1rem;
    color: var(--theme-secondary-text);
    font-weight: 400;
  }

  .handle {
    margin-right: 1rem;
    cursor: grabbing;
  }

  .delete-card-button {
    margin: 0;
  }
</style>
