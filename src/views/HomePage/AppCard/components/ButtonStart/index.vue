<!--Button and Modal window to Start App on Home page-->

<template>
  <app-action-button
    :title="$message.appDeployment.buttons.start.confirmation"
    :list-name="$message.appDeployment.buttons.start.listName"
    :list-description="$message.appDeployment.buttons.start.listDescription"
    :confirm-text="$message.appDeployment.buttons.start.confirm"
    :show-modal="showModalPopup"
    icon-name="v2-play3"
    confirm-color="primary"
    cancel-color="secondary"
    :is-cancel-flat="false"
    @confirm="onConfirm"
    @deactivate="$emit('deactivate')"
    @setShowModal="setShowModal"
  >
    <v-card-text class="startAppContainer">
      <p>{{ $message.appDeployment.buttons.start.description }}</p>
      <div class="opex-label">
        edit application url
      </div>
      <v-layout align-center class="app-start-url">
        <label>{{ origin }}/
          <input v-model="url">
        </label>
      </v-layout>
    </v-card-text>
  </app-action-button>
</template>

<script>
import { mapActions } from 'vuex';
import AppActionButton from '../AppActionButton';

export default {
  name: 'ButtonStart',
  props: {
    appData: {
      type: Object,
      required: true,
    },
  },
  components: { AppActionButton },

  data() {
    return {
      startServerDialog: false,
      origin: window.location.origin,
      url: this.appData.url ? this.appData.url : this.appData.name.toString().toLowerCase().replace(/ /g, '_'),
      showModalPopup: false,
    };
  },

  methods: {
    ...mapActions({
      showSnackbar: 'snackbar/show',
      updateAppFromList: 'applicationList/updateAppFromList',
      saveDetails: 'application/saveDetails',
      changeAppInfo: 'applicationList/changeAppInfo',
    }),
    onConfirm() {
      this.showModalPopup = false;
      this.startServerDialog = false;
      const { _id: id, status: lastStatus } = this.appData;
      const { active, running } = this.$constant.deployStatuses;
      const isUrlChanged = this.appData.url !== this.url;

      // changing app status on client
      this.updateAppFromList({ id, status: running })
        // updating app url on server
        .then(() => {
          // skip request if url has not changed
          if (!isUrlChanged) return null;
          return this.saveDetails({
            appId: id,
            params: { url: this.url },
          });
        })
        // updating app url on client
        .then(() => this.updateAppFromList({ id, url: this.url }))
        .then(() => {
          // Sending App Details to the server
          this.saveDetails({
            appId: this.appData._id,
            params: { status: this.$constant.deployStatuses.active },
          });
        })
        .then(() => {
          this.updateAppFromList({ id, status: active });
          this.showSnackbar({
            type: this.$constant.snackbarTypes.success,
            title: this.$message.appDeployment.deployTitleSuccess,
            message: this.$message.appDeployment.startAppSuccess,
          });
          this.changeAppInfo({ status: lastStatus, newStatus: this.$constant.deployStatuses.active });
        })
        .catch(error => {
          this.updateAppFromList({ id, status: lastStatus });
          this.showSnackbar({
            type: this.$constant.snackbarTypes.error,
            title: this.$message.appDeployment.deployTitleError,
            message: error.data.message || error,
          });
        });
    },
    setShowModal(value) {
      this.showModalPopup = value;
    },
  },
  watch: {
    appData() {
      this.url = this.appData.url ? this.appData.url : this.appData.name.toString().toLowerCase().replace(/ /g, '_');
    },
  },
};
</script>

<style scoped lang="scss">
  .startAppContainer {
    padding: 0;
  }
  .opex-label {
    color: var(--theme-secondary);
    font-size: 0.8rem;
  }

  .app-start-url {
    margin-top: .2rem;
    font-weight: 600;

    input {
      width: 20rem;
      margin-left: .3rem;
      padding: 0.3rem 0.5rem;
      border: solid 1px var(--theme-border-grey);
      background-color: rgba(var(--theme-primary-rgb), 0.05);
      outline: none;
      transition: all .3s;

      &:focus {
        border-color: var(--theme-border-light);
        background-color: var(--theme-background-light);
      }
    }
  }
</style>
