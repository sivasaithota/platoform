<template>
  <opex-dialog
    v-model="showModalPopup"
    :title="envIndex !== null
      ? $message.setting.packageManager.updateDialogTitle
      : $message.setting.packageManager.createDialogTitle
    "
    :confirm-text="envIndex !== null
      ? $message.setting.packageManager.updateConfirmText
      : $message.setting.packageManager.createConfirmText
    "
    :cancel-text="$message.setting.packageManager.cancelText"
    :in-progress-status="inProgressStatus"
    :in-progress-text="envIndex !== null
      ? $message.setting.packageManager.updateProgressText
      : $message.setting.packageManager.createProgressText
    "
    :is-confirm-disabled="envIndex === null && environment.status === $constant.deployStatuses.success"
    @confirm="confirm"
    @cancel="cancel"
  >
    <!--Dialog content-->
    <v-form
      class="dialog-form"
      v-model="formValid"
      ref="form"
    >
      <!--List of Environments-->
      <opex-input
        v-if="envIndex === null"
        v-model="environment.baseImage"
        :autocomplete-items="baseEnvs"
        item-text="name"
        item-value="name"
        label="Base Environment"
        placeholder="Select Environment"
        required
      />

      <div class="position-relative">
        <p class="label position-absolute">Environment Name</p>
        <opex-input
          v-model="environment.name"
          placeholder="Eg: Sys1_a"
          :readonly="envIndex !== null"
          :validation-rules="envNameRules"
          required
        >
          <template #prepend>
            <v-layout
              v-if="envIndex === null"
              class="append-details"
              align-center
            >
              {{ environment.baseImage }}
              <span v-if="environment.baseImage">_</span>
            </v-layout>
          </template>
        </opex-input>
      </div>

      <!--Environment description field-->
      <opex-input
        v-model="environment.description"
        label="Description"
        textarea
        :rows="4"
        :maxLength="descMaxLength"
        placeholder="Write something here…"
        required
      />

      <!--Previous commands-->
      <div
        v-if="envIndex !== null && environment.commands"
        class="log_container"
      >
        <p class="label">Command history</p>
        <div class="log_content">
          <h4
            class="commands"
            v-html="environment.commands"></h4>
          <v-layout
            align-center
            justify-end
          >
            <v-btn
              text
              small
              color="primary"
              class="text-capitalize"
              @click="copyCommands"
            >
              <opex-icon name="v2-download3"/>
              Copy history
            </v-btn>
          </v-layout>
        </div>
      </div>

      <!--Commands field-->
      <opex-input
        v-model="environment.newCommands"
        label="Commands"
        textarea
        hide-details
        :rows="8"
        placeholder="Write something here…"
      />
      <!--Logs container-->
      <div
        v-if="environment.logs"
        class="log_container"
      >
        <p class="label">Installation logs</p>
        <div class="log_content">
          <h4 v-html="formatedLogs"></h4>
          <v-layout
            align-center
            justify-end
          >
            <v-btn
              text
              small
              color="primary"
              class="text-capitalize"
              @click="downloadLogs"
            >
              <opex-icon name="v2-download3"/>
              Detailed logs
            </v-btn>
          </v-layout>
        </div>
      </div>
      <!--Lock switcher-->
      <opex-switch
        v-if="envIndex === null || environment.createdBy === userInfo.email"
        v-model="environment.locked"
        label="Lock environment"
        description="Prevents others from editing the details."
      />
    </v-form>

    <template #footerInfo>
      <h6 v-if="environment.status">Environment status: {{ environment.status }}</h6>
    </template>
  </opex-dialog>

</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import { cloneDeep } from 'lodash';
import { saveAs } from 'file-saver';

import SocketHandler from '@/services/socket';

export default {
  name: 'EnvironmentManagementDialog',
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },

    envIndex: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      formValid: true,
      inProgressStatus: false,
      environment: {},
      // env name validation rules
      envNameRules: [
        value => value.indexOf(' ') < 0 || this.$message.setting.packageManager.errorNameMsg,
      ],
      nameMaxLength: '50',
      descMaxLength: '300',
    };
  },

  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      environments: state => state.environment.environments,
      baseEnvs: state => state.environment.baseEnvs,
    }),

    // controls dialog visibility
    showModalPopup: {
      get() {
        return this.showModal;
      },
      set(value) {
        this.$emit('setShowModal', value);
      },
    },

    formatedLogs() {
      return this.environment.logs.replace(/\u21B5/g, '<br/>');
    },
  },

  methods: {
    ...mapActions({
      createEnvironment: 'environment/createEnvironment',
      updateEnvironment: 'environment/updateEnvironment',
      showSnackbar: 'snackbar/show',
    }),

    ...mapMutations('environment', {
      createEnv: 'createEnv',
      updateEnv: 'updateEnv',
    }),

    listenSocketStatus(data) {
      return new Promise((resolve, reject) => {
        const socket = new SocketHandler();
        // connection to socket
        socket.start(data.roomId);
        // subscribing to socket event
        socket.registerEvent('updatedDockerStatus', response => {
          if (response.status === this.$constant.deployStatuses.success) {
            socket.close();
            resolve(response);
          }
          if (response.status === this.$constant.deployStatuses.failure) {
            socket.close();
            reject(this.$message.setting.packageManager.errorMsg);
          }
          this.environment.status = response.status;
          // if the status is not Success or Failure - setting this status for app
          if (response.logs) this.environment.logs = response.logs;
        });
      });
    },

    confirm() {
      this.$nextTick(() => {
        this.showModalPopup = true;
      });
      if (!this.formValid) {
        this.showSnackbar({
          type: this.$constant.snackbarTypes.error,
          title: this.$message.setting.packageManager.errorCreatingEnv,
          message: this.$message.setting.packageManager.errorMsgValidation,
        });
        return;
      }
      const action = this.envIndex === null ? this.createEnvironment : this.updateEnvironment;
      this.inProgressStatus = true;

      // Sending env data to server
      const environmentCopy = cloneDeep(this.environment);
      // Replace entries
      environmentCopy.commands = environmentCopy.newCommands
        ? environmentCopy.newCommands.replace(/\\(\r\n|\n|\r)/gm, '').split(' && ') : [];
      action(environmentCopy).then((data) => {
        // Listen sockets
        return this.listenSocketStatus(data);
      }).then((data) => {
        this.inProgressStatus = false;
        this.showSnackbar({
          type: this.$constant.snackbarTypes.success,
          title: this.envIndex === null
            ? this.$message.setting.packageManager.successCreatingTitle
            : this.$message.setting.packageManager.successUpdatingTitle,
          message: this.envIndex === null
            ? this.$message.setting.packageManager.successCreatingMsg(data.name)
            : this.$message.setting.packageManager.successUpdatingMsg(data.name),
        });
        return this.envIndex === null
          ? this.createEnv(data)
          : this.updateEnv({
            index: this.envIndex,
            value: data,
          });
      }).catch((error) => {
        this.inProgressStatus = false;
        this.showSnackbar({
          type: this.$constant.snackbarTypes.error,
          title: this.$message.setting.packageManager.errorCreatingEnv,
          message: error.message || error,
        });
      });
    },

    // Close dialog window
    cancel() {
      // if not in progress close modal
      if (!this.inProgressStatus) {
        this.showModalPopup = false;
      }
    },

    // Saving the environment log in a file
    downloadLogs() {
      saveAs(
        new Blob([this.environment.logs]),
        `${this.environment.name}.log`,
      );
    },

    // Copying the environment commands in a file
    copyCommands() {
      navigator.clipboard
        .writeText(this.environment.commands.replace(/<br>/g, ''))
        .catch(error => {
          this.showSnackbar({
            type: this.$constant.snackbarTypes.error,
            title: this.$message.common.errorClipboard,
            message: error,
          });
        });
    },
  },

  created() {
    if (this.envIndex === null) this.environment = { ...this.$constant.environmentManagement };
    else {
      this.environment = cloneDeep(this.environments[this.envIndex]);
      this.environment.commands = this.environment.commands.join(' && <br>');
      this.environment.newCommands = '';
    }
  },
};
</script>

<style lang="scss" scoped>
  .dialog-form {
    padding: 1.43rem 3.56rem 1rem 2.86rem;
  }
  .label {
    font-weight: bold;
    line-height: normal;
    color: var(--theme-secondary);
    margin-bottom: .5rem;
    font-size: .65rem;
    text-transform: uppercase;
  }
  .append-details {
    border: solid 1px var(--theme-border);
    border-right: none;
    background-color: var(--theme-background-light);
    padding: 0 .71rem;
    max-height: 34px;
    min-height: 34px;
    font-size: 1rem;
    white-space: nowrap;
    min-width: 12rem;
  }
  .log_container {
    margin-top: 1rem;
    margin-bottom: 2rem;
    .log_content {
      border: solid 1px var(--theme-border);
      background-color: var(--theme-background);
    }
    h4 {
      font-size: 1rem;
      font-weight: normal;
      line-height: 1.43;
      padding: .71rem 1.71rem 0 .71rem;
      max-height: 9rem;
      overflow: auto;
      white-space: pre-line;
      &.commands {
        opacity: .5;
      }
    }
  }
</style>
