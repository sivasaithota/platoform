<template>
  <opex-dialog
    v-model="showModal"
    :title="title"
    :width="modalWidth"
    :cancel-text="cancelText"
    hide-close-btn
    hide-footer
    disabled
    :hide-header-circular="false"
    @cancel="cancel"
  >

    <v-layout
      column
      class="deployment-dialog-body"
      :class="withoutPadding && 'without-padding'"
    >
      <div>{{ subTitle }}</div>
      <v-layout
        justify-space-between
        class="deployment-step-visualisation"
      >
        <v-layout class="deployment-step-visualisation-step"
          justify-space-between
          v-for="(step, index) in deploymentSteps"
          :key="index"
        >
          <div class="deployment-step-visualisation-line" :class="step.status"></div>
          <div class="deployment-step-visualisation-point" :class="step.status"></div>
        </v-layout>
      </v-layout>
      <v-layout
        justify-space-between
        class="deployment-step-names-box"
      >
        <div class="deployment-step-name" v-for="(step, index) in deploymentSteps"
          :key="index">
          {{step.name}}
        </div>
      </v-layout>
    </v-layout>
  </opex-dialog>

</template>

<script>

import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'DeploymentDialog',
  data() {
    return {
      isDeploymentFinished: false,
      appId: this.$route.params.id,
      deploymentSteps: [],
    };
  },

  props: {
    modalWidth: {
      type: String,
      default: '50rem',
    },
    title: {
      type: String,
    },
    subTitle: {
      type: String,
      default: 'Confirm',
    },
    cancelText: {
      type: String,
      default: 'Close',
    },
    withoutPadding: {
      type: Boolean,
    },
    showModalDialog: {
      type: Boolean,
      default: false,
    },
    disabledButton: {
      type: Boolean,
    },
    isRestore: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    showModal: {
      get() {
        if (this.showModalDialog) {
          this.runDeploy();
        }
        return this.showModalDialog;
      },
      set(value) {
        this.$emit('setShowModal', value);
      },
    },
  },

  methods: {
    ...mapActions({
      showSnackbar: 'snackbar/show',
      deployApp: 'appDeployment/deployApp',
      updateAppFromList: 'applicationList/updateAppFromList',
      getDetails: 'application/getDetails',
    }),

    ...mapMutations({
      updateStatus: 'application/updateStatus',
      updateIsFreshDeployed: 'application/updateIsFreshDeployed',
    }),

    cancel() {
      this.$emit('cancel');
    },
    increaseDeploymentSteps(delay) {
      const inProgressIndex = this.deploymentSteps.findIndex(step => step.status === this.$constant.deployStatuses.inProgress);
      const deploymentStepsLength = this.deploymentSteps.length;
      if (this.deploymentSteps[inProgressIndex + 1]) {
        this.deploymentSteps[inProgressIndex].status = this.$constant.deployStatuses.active;
        this.deploymentSteps[inProgressIndex + 1].status = this.$constant.deployStatuses.inProgress;
        if (inProgressIndex + 2 !== deploymentStepsLength || this.isDeploymentFinished) {
          this.timerId = setTimeout(() => this.increaseDeploymentSteps(delay), this.randomizeDelay(delay));
        }
      } else if (this.isDeploymentFinished) {
        this.deploymentSteps[inProgressIndex].status = this.$constant.deployStatuses.active;
        this.showSnackbar({
          type: this.$constant.snackbarTypes.success,
          title: this.$message.appDeployment.deployTitleSuccess,
          message: this.$message.appDeployment.deploySuccess,
        });
        this.updateStatus(this.$constant.deployStatuses.active);
        this.updateAppFromList({ id: this.appId, status: this.$constant.deployStatuses.active });
        this.updateIsFreshDeployed();
        this.showModal = false;
      }
    },
    randomizeDelay(delay) {
      return delay - 200 + Math.round(Math.random() * 400);
    },
    setDefaultDeploymentSteps() {
      this.deploymentSteps = [
        {
          name: 'Building docker environment',
          status: this.$constant.deployStatuses.active,
        },
        {
          name: 'Creating database & tables',
          status: this.$constant.deployStatuses.inProgress,
        },
        {
          name: 'Creating user roles & controls',
          status: this.$constant.deployStatuses.inactive,
        },
        {
          name: 'Deploying user interface',
          status: this.$constant.deployStatuses.inactive,
        },
        {
          name: 'Initiating web server',
          status: this.$constant.deployStatuses.inactive,
        },
      ];
    },
    runDeploy() {
      const defaultDelay = 3000;
      this.isDeploymentFinished = false;
      this.setDefaultDeploymentSteps();
      this.timerId = setTimeout(() => this.increaseDeploymentSteps(defaultDelay), this.randomizeDelay(defaultDelay));
      this.deployApp({
        id: this.appId,
        deployBody: {
          deployType: this.isRestore
            ? this.$constant.deployTypes.restore
            : this.$constant.deployTypes.deploy,
        },
        deployOption: this.$constant.deployTypes.deploy,
      })
        // TODO: delete section after ngnix sockets will available to catch if app is runned
        .then(() => {
          clearTimeout(this.timerId);
          this.isDeploymentFinished = true;
          const nonActiveCount = this.deploymentSteps.filter(step => step.status !== this.$constant.deployStatuses.active).length;
          const newDelay = Math.round(7000 / nonActiveCount);
          this.timerId = setTimeout(() => this.increaseDeploymentSteps(newDelay), this.randomizeDelay(newDelay));
        })
        .catch((error) => {
          clearTimeout(this.timerId);
          const inProgressIndex = this.deploymentSteps.findIndex(step => step.status === this.$constant.deployStatuses.inProgress);
          this.deploymentSteps[inProgressIndex].status = this.$constant.deployStatuses.failure;
          this.showSnackbar({
            type: this.$constant.snackbarTypes.error,
            title: error.stage ? this.$message.appDeployment.stages[error.stage].title : this.$message.appDeployment.deployTitleError,
            message: error.stage ? this.$message.appDeployment.stages[error.stage].message : error.data,
          });
          this.getDetails({ appId: this.appId });
          this.updateAppFromList({ id: this.appId, status: this.$constant.deployStatuses.inactive });
          this.showModal = false;
        });
    },
  },
};
</script>

<style lang="scss">
  .v-dialog__activator--disabled {
    cursor: default;
  }
</style>

<style lang="scss" scoped>
  .deployment-dialog-body {
    padding: 2rem 1.3rem;
    font-size: 1rem;
    font-weight: 500;
  }

  .without-padding {
    padding: 0;
  }

  .deployment-step-names-box {
    margin-left: -1rem;
    padding : 0 0 1rem 0;
    width: 100%;
    .deployment-step-name {
      width: 10rem;
      text-align: center;
    }
  }

  .deployment-step-visualisation {
    width: 100%;
    padding: 3rem 5.5rem 1rem 3.5rem;
    .deployment-step-visualisation-step {
      margin: 0;

      .deployment-step-visualisation-point {
        width: 1rem;
        height: 1rem;
        border: 0.2rem solid;
        border-radius: 0.5rem;
        &.ACTIVE {
          border-color: var(--theme-success);
          background-color: var(--theme-success);
        }
        &.INACTIVE {
          border-color: var(--theme-secondary);
        }
        &.FAILURE {
          background-color: var(--theme-error);
          border-color: var(--theme-error);
        }
      }

      .deployment-step-visualisation-line {
        margin: 0.45rem 1rem;
        height: 0.1rem;
        width: 10rem;
        &.ACTIVE {
          background-color: var(--theme-success);
        }
        &.IN-PROGRESS {
          background-color: var(--theme-success);
        }
        &.INACTIVE {
          background-color: rgba(0, 0, 0, .2);
        }
        &.FAILURE {
          background-color: var(--theme-error);
          border-color: var(--theme-error);
        }
      }
    }

    :first-child .deployment-step-visualisation-line {
      display: none;
    }
  }

  .deployment-step-visualisation-point.IN-PROGRESS {
    background-color: rgba(var(--theme-secondary-rgb), 0.3);
    border-color: var(--theme-secondary);
  }
</style>
