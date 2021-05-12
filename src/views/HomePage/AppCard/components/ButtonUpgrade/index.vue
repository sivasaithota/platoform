<!-- BUTTON TO UPGRADE APP -->
<template>
  <app-action-button
    :title="$message.appDeployment.buttons.upgrade.confirmation"
    :list-name="$message.appDeployment.buttons.upgrade.listName"
    :list-description="listDescription"
    :confirm-text="$message.appDeployment.buttons.upgrade.confirm"
    :disabledButton="isLatestVersion"
    :show-modal="showModalPopup"
    icon-name="v2-upgrade-app-2"
    confirm-color="primary"
    cancel-color="secondary"
    :is-cancel-flat="false"
    @confirm="upgradeApp"
    @deactivate="$emit('deactivate')"
    @setShowModal="setShowModal"
  >
    <v-spacer/>
    <v-layout
      align-center
      justify-space-around
    >
      <v-layout column align-center>
        <h4>Current version</h4>
        <v-layout justify-center class="version">
          {{appData.version}}
        </v-layout>
      </v-layout>

      <v-layout column align-center class="icon">
        <br/>
        <opex-icon name="v2-upgrade-app-21"/>
      </v-layout>


      <v-layout column align-center>
        <h4>New version</h4>
        <v-layout justify-center class="version new">
          {{latestVersion}}
        </v-layout>
      </v-layout>
    </v-layout>
    <v-spacer/>
  </app-action-button>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AppActionButton from '../AppActionButton';

export default {
  name: 'ButtonUpgrade',
  props: {
    appData: {
      type: Object,
      required: true,
    },
  },
  components: { AppActionButton },

  data() {
    return {
      showModalPopup: false,
    };
  },

  computed: {
    isLatestVersion() {
      return this.appData.version === this.latestVersion;
    },
    listDescription() {
      return this.isLatestVersion
        ? this.$message.appDeployment.buttons.upgrade.latestVersion
        : this.$message.appDeployment.buttons.upgrade.listDescription;
    },
    ...mapState({
      latestVersion: state => state.applicationList.info.latestACVersion,
    }),
  },

  methods: {
    ...mapActions({
      showSnackbar: 'snackbar/show',
      deployApp: 'appDeployment/deployApp',
      updateAppFromList: 'applicationList/updateAppFromList',
      changeAppInfo: 'applicationList/changeAppInfo',
    }),

    upgradeApp() {
      this.showModalPopup = false;
      const { _id: id, status: lastStatus } = this.appData;
      this.updateAppFromList({ id, status: this.$constant.deployStatuses.running })
        .then(() => this.deployApp({
          id,
          deployBody: { deployType: this.$constant.deployTypes.upgrade },
          deployOption: this.$constant.deployTypes.deploy,
        }))
        .then(() => {
          this.updateAppFromList({
            id,
            status: this.$constant.deployStatuses.active,
            version: this.latestVersion,
          });
          this.showSnackbar({
            type: this.$constant.snackbarTypes.success,
            title: this.$message.appDeployment.deployTitleSuccess,
            message: this.$message.appDeployment.upgradeSuccess,
          });
          if (this.appData.status !== this.$constant.deployStatuses.active) {
            this.changeAppInfo({ status: lastStatus, newStatus: this.$constant.deployStatuses.active });
          }
        })
        .catch((error) => {
          this.updateAppFromList({ id, status: this.$constant.deployStatuses.inactive });
          this.showSnackbar({
            type: this.$constant.snackbarTypes.error,
            title: this.$message.appDeployment.upgradeAppErrorTitle,
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

<style scoped lang="scss">
  .version {
    border-radius: 2rem;
    padding: .3rem 1rem;
    width: 9rem;
    font-weight: 700;
    font-size: 1.2rem;
  }

  .version {
    background-color: rgba(var(--theme-support-rgb), 0.4);
  }

  .version.new {
    background-color: rgba(var(--theme-secondary-rgb), 0.2);
    color: rgb(var(--theme-secondary-rgb));
  }

  .icon {
    color: rgba(var(--theme-support-rgb), 0.8);
  }

  .icon i {
    font-size: 1.6rem;
  }
</style>
