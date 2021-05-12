<!-- BUTTON TO STOP APP -->
<template>
  <app-action-button
    :title="$message.appDeployment.buttons.stop.confirmation"
    :list-name="$message.appDeployment.buttons.stop.listName"
    :list-description="$message.appDeployment.buttons.stop.listDescription"
    :confirm-text="$message.appDeployment.buttons.stop.confirm"
    :show-modal="showModalPopup"
    icon-name="v2-inactive-apps"
    confirm-color="primary"
    cancel-color="secondary"
    :is-cancel-flat="false"
    @confirm="stopApp"
    @deactivate="$emit('deactivate')"
    @setShowModal="setShowModal"
  >
    <div v-html="$message.appDeployment.buttons.stop.description"></div>
  </app-action-button>
</template>

<script>
import { mapActions } from 'vuex';
import AppActionButton from '../AppActionButton';

export default {
  name: 'ButtonStop',
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
      showSnackbar: 'snackbar/show',
      saveDetails: 'application/saveDetails',
      updateAppFromList: 'applicationList/updateAppFromList',
      changeAppInfo: 'applicationList/changeAppInfo',
    }),

    stopApp() {
      this.showModalPopup = false;
      const { _id: id, status: lastStatus } = this.appData;
      this.updateAppFromList({ id, status: this.$constant.deployStatuses.running });
      // Sending request to stop the app
      this.saveDetails({
        appId: this.appData._id,
        params: { status: this.$constant.deployStatuses.inactive },
      })
        .then(() => {
          // updating status of application in apps list
          this.updateAppFromList({ id, status: this.$constant.deployStatuses.inactive });
          this.showSnackbar({
            type: this.$constant.snackbarTypes.success,
            title: this.$message.appDeployment.deployTitleSuccess,
            message: this.$message.appDeployment.stopAppSuccess,
          });
          this.changeAppInfo({ status: lastStatus, newStatus: this.$constant.deployStatuses.inactive });
        })
        .catch((error) => {
          this.updateAppFromList({ id, status: lastStatus });
          this.showSnackbar({
            type: this.$constant.snackbarTypes.error,
            title: this.$message.appDeployment.stopAppError,
            message: error.data.message || error,
          });
        });
    },
    setShowModal(value) {
      this.showModalPopup = value;
    },
  },
};
</script>
