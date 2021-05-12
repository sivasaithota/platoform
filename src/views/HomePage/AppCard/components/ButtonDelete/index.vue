<!-- BUTTON TO DELETE APP -->
<template>
  <app-action-button
    :title="$message.appDeployment.buttons.delete.confirmation"
    :list-name="$message.appDeployment.buttons.delete.listName"
    :list-description="$message.appDeployment.buttons.delete.listDescription"
    :confirm-text="$message.appDeployment.buttons.delete.confirm"
    :cancel-text="$message.appDeployment.buttons.delete.cancel"
    :show-modal="showModalPopup"
    icon-name="v2-delete-2"
    confirm-color="primary"
    cancel-color="secondary"
    :is-cancel-flat="false"
    @confirm="submitDelete"
    @deactivate="$emit('deactivate')"
    @setShowModal="setShowModal"
  >
    <div v-html="$message.appDeployment.buttons.delete.description"></div>
  </app-action-button>
</template>

<script>
import { mapActions } from 'vuex';
import AppActionButton from '../AppActionButton';

export default {
  name: 'ButtonDelete',
  components: { AppActionButton },
  props: {
    appData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      showModalPopup: false,
    };
  },

  methods: {
    ...mapActions({
      deleteApp: 'appDeployment/deleteApp',
    }),

    submitDelete() {
      this.showModalPopup = false;
      this.deleteApp({
        id: this.appData._id,
        name: this.appData.name,
        withBackup: false, // sending false to delete all files
        status: this.appData.status,
      });
    },
    setShowModal(value) {
      this.showModalPopup = value;
    },
  },
};
</script>
