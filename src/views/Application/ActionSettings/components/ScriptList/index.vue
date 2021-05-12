<!--List of scripts inside drawer on the Action Settings page-->

<template>
  <div class="script-list">
    <!--Area for uploading scripts-->
    <opex-upload-area
      text="Click to upload a script"
      :icon="$constant.uploadAreaIcons.script"
      :hint="$message.createNewApp.scriptsFormat"
      :state="uploadState"
      multiple
      @files="uploadScript"
    />
    <opex-dialog
      v-model="showDialog"
      :title="$message.actionSettings.replaceScript(duplicateFiles.join(', '))"
      confirm-text="Replace"
      confirm-color="success"
      @confirm="confirmUploadScript"
      cancel-text="Cancel"
      @cancel="emptyFiles"
    />
    <!--List of existing scripts-->
    <transition-group name="script-list">
      <opex-list-item
        v-for="(item, index) in scriptFileList"
        :key="index"
        v-model="scriptFileList[index]"
        img="script"
        @delete="deleteScript(item)"
      />
    </transition-group>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import OpexListItem from '@/components/OpexListItem/index';

export default {
  name: 'ScriptList',
  components: { OpexListItem },

  data() {
    return {
      appId: this.$route.params.id,
      uploadState: this.$constant.uploadAreaStates.pending,
      duplicateFiles: [],
      selectedFiles: [],
    };
  },

  computed: {
    ...mapState({
      actions: state => state.actionSettings.actions,
      scriptFileList: state => state.actionSettings.scriptFileList,
    }),

    showDialog: {
      get() {
        return !!this.duplicateFiles.length;
      },
      set() {},
    },
  },

  methods: {
    ...mapActions({
      showSnackbar: 'snackbar/show',
      uploadScripts: 'actionSettings/uploadScript',
      deleteScriptFile: 'actionSettings/deleteScript',
    }),

    // Script upload handler
    uploadScript(files) {
      // Uploading file to the server
      this.selectedFiles = files;
      this.error = false;
      files.forEach((value) => {
        if (!(/^[a-zA-Z0-9.\-_]{3,}$/.test(value.name))) this.error = true;
        else if (this.scriptFileList.includes(value.name)) {
          this.duplicateFiles.push(value.name);
        }
      });
      if (this.error) {
        this.showSnackbar({
          type: this.$constant.snackbarTypes.error,
          title: this.$message.common.errorUploadingFile,
          message: this.$message.actionSettings.fileNameAllowedCharacters,
        });
      } else if (!this.duplicateFiles.length) {
        this.confirmUploadScript(files);
      }
    },

    emptyFiles() {
      this.duplicateFiles = [];
      this.selectedFiles = [];
    },

    confirmUploadScript() {
      this.duplicateFiles = [];
      this.uploadState = this.$constant.uploadAreaStates.uploading;
      this.uploadScripts({
        appId: this.appId,
        files: this.selectedFiles,
      }).then(() => {
        this.uploadState = this.$constant.uploadAreaStates.success;
        this.emptyFiles();
      }).catch(() => {
        this.uploadState = this.$constant.uploadAreaStates.error;
      });
    },

    // Delete script button click handler
    deleteScript(file) {
      // validation not allowing to delete the script used for any action
      if (this.actions.find(action => action.fileName === file)) {
        this.showSnackbar({
          type: this.$constant.snackbarTypes.error,
          title: this.$message.common.errorDeletingFile,
          message: this.$message.actionSettings.errorDeletingActionScript,
        });

        return;
      }

      // Deleting the script on the server and updating the script list
      this.deleteScriptFile({
        appId: this.appId,
        file,
      });
    },
  },
};
</script>

<style scoped lang="scss">
  .opex-upload-area {
    margin-bottom: 1rem;
  }

  .script-list-enter-active, .script-list-leave-active {
    transition: all .2s;
  }

  .script-list-enter, .script-list-leave-to {
    opacity: 0;
  }
</style>
