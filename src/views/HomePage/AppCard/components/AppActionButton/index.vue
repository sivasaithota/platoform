<template>
  <opex-dialog
    v-model="showModalPopup"
    :title="title"
    :width="modalWidth"
    :disabled="disabledButton"
    :confirm-text="confirmText"
    :cancel-text="cancelText"
    :in-progress-text="inProgressText"
    :in-progress-status="inProgressStatus"
    :is-confirm-disabled="isConfirmDisabled"
    :confirm-color="confirmColor"
    :cancel-color="cancelColor"
    :is-cancel-flat="isCancelFlat"
    @confirm="confirm"
    @cancel="cancel"
  >
    <template #activator>
      <v-list-item
        class="action_list--item"
        :disabled="disabledButton"
        @click="$emit('deactivate')"
      >
        <v-list-item-title>
          <v-layout
            align-center
            start
          >
            <opex-icon :name="iconName"/>
            <v-layout column>
              <div class="list--name">{{ listName }}</div>
              <div class="list--description">{{ listDescription }}</div>
            </v-layout>
          </v-layout>
        </v-list-item-title>
      </v-list-item>
    </template>

    <v-layout
      class="app-action-button-body"
      :class="withoutPadding && 'without-padding'"
    >
      <slot/>
    </v-layout>
  </opex-dialog>

</template>

<script>
export default {
  name: 'AppActionButton',
  props: {
    inProgressStatus: {
      type: Boolean,
    },
    listName: {
      type: String,
    },
    listDescription: {
      type: String,
    },
    modalWidth: {
      type: String,
      default: '50rem',
    },
    iconName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    confirmText: {
      type: String,
      default: 'Confirm',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
    withoutPadding: {
      type: Boolean,
    },
    disabledButton: {
      type: Boolean,
    },
    inProgressText: {
      type: String,
      default: '',
    },
    showModal: {
      type: Boolean,
      default: false,
    },
    confirmColor: {
      type: String,
      default: 'secondary',
    },
    cancelColor: {
      type: String,
      default: 'primary',
    },
    isCancelFlat: {
      type: Boolean,
      default: true,
    },
    isConfirmDisabled: {
      type: Boolean,
    },
  },
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    cancel() {
      this.$emit('cancel');
      // if not in progress close modal
      if (!this.inProgressStatus) {
        this.showModalPopup = false;
      }
    },
  },
  computed: {
    // controls dialog visibility
    showModalPopup: {
      get() {
        return this.showModal;
      },
      set(value) {
        this.$emit('setShowModal', value);
      },
    },
  },
};
</script>

<style lang="scss">
  div.action_list--item.v-list-item--disabled {
    background-color: var(--theme-support);
    div.list--description {
      color: var(--theme-primary);
    }
  }

  .app-action-button-body b {
    color: var(--theme-error);
  }
</style>

<style lang="scss" scoped>
  .app-action-button-body {
    padding: 2rem 1.3rem;
    font-size: 1rem;
    font-weight: 500;
    h3.app-name {
      font-size: 1rem;
      color: var(--theme-secondary);
      margin-bottom: 1rem;
    }
  }
  .without-padding {
    padding: 0;
  }

  .action_list--item {
    border-bottom: solid 1px rgba(58, 78, 91, .1);
    .list--name {
      font-size: .86rem;
      font-weight: bold;
      line-height: normal;
      color: var(--theme-primary);
    }
    .list--description {
      font-size: .71rem;
      font-weight: 600;
      line-height: normal;
      color: var(--theme-support);
    }
    i {
      color: var(--theme-secondary);
      margin-right: .57rem;
      font-size: 1rem;
    }
  }
</style>
