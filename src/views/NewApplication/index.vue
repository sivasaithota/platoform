<!--Create new application page. Redirected from the Home page-->

<template>
  <section>
    <!--Close new app page button at the top right corner-->
    <v-btn
      fab
      large
      depressed
      class="close-page-button"
      color="support"
      to="/"
    >
      <opex-icon name="close"/>
    </v-btn>

    <!--Create new app form-->
    <v-layout
      class="new-app-form"
      column
      align-center
    >
      <!--Image and header-->
      <img :src="createApplicationImg" alt="create application"/>
      <!--Header title-->
      <h1 v-if="ticdatSelected">{{$constant.createApp.ticdat.title}}</h1>
      <h1 v-else-if="csvSelected">{{$constant.createApp.csv.title}}</h1>
      <h1 v-else>{{$message.createNewApp.header}}</h1>

      <div v-if="!ticdatSelected && !csvSelected" class="type-selectors">
        <select-creation-type
          :title="$constant.createApp.csv.title"
          :description="$constant.createApp.csv.description"
          :img-src="csvImage"
          @click="selectType('csvSelected')"
        />
        <select-creation-type
          :title="$constant.createApp.ticdat.title"
          :description="$constant.createApp.ticdat.description"
          :img-src="ticDatImage"
          @click="selectType('ticdatSelected')"
        />
      </div>

      <div v-else class="create-new-app-body">
        <!--Application name input-->
        <opex-input
          v-model="appName"
          label="Enter Application Name"
          placeholder="Application Name"
          required
          :validation-rules="appNameRules"
          :error-messages="appNameAsyncErrors"
          @valid="appNameValid = $event"
          @input="checkNameUniqueness"
        />

        <div class="app-folder-upload">
          <!--Spinner while uploading the folder to the server-->
          <v-layout
            v-if="loading"
            class="upload-progress"
            justify-center
            align-center
          >
            <span>Uploading files</span>
            <v-progress-circular
              indeterminate
              color="secondary"
              style="width: 2.5rem; height: 2.5rem"
            />
          </v-layout>

          <!--Application folder upload area-->
          <opex-upload-area
            v-else
            :folder="csvSelected"
            :extensions="ticdatSelected ? ticdatExtensions : []"
            :text="ticdatSelected ? 'Click to upload File' : 'Click to upload Folder'"
            :icon="$constant.uploadAreaIcons.cloud"
            :state="uploadState"
            @files="folderUpload($event)"
          />

          <!--Each uploaded folder state-->
          <folder-state
            v-for="(folder, name) in folderState"
            :key="name"
            :title="name"
            :state="uploadState"
            :text="folder.text"
            :errors="folder.errors"
            :showScriptIcon="ticdatSelected"
          />
        </div>

        <!--Data type detection switch-->
        <v-layout
          v-if="!loading && !ticdatSelected"
          justify-space-between
          align-center
          class="new-app-footer datatype-switch"
        >
          <opex-switch
            hide-details
            v-model="detectDatatypes"
            :label="$message.createNewApp.datatypeValidationLabel"
            :description="$message.createNewApp.datatypeValidationDescription"
          />
        </v-layout>

        <!--Title normalization switch-->
        <v-layout
          v-if="!loading && !ticdatSelected"
          justify-space-between
          align-center
          class="new-app-footer datatype-switch"
        >
          <opex-switch
            hide-details
            v-model="isTitleNormalized"
            :label="$message.createNewApp.titleNormalizationLabel"
            :description="$message.createNewApp.titleNormalizationDescription"
          />
        </v-layout>

        <v-layout
          v-if="!loading"
          justify-space-between
          align-center
          class="new-app-footer"
        >
          <!--Immediate deploy checkbox-->
          <v-checkbox
            v-model="immediateDeploy"
            :disabled="databaseIsPresent"
            :ripple="false"
            class="text-uppercase"
            label="immediate deployment"
            color="secondary"
          />

          <!--Create app button-->
          <v-btn
            color="secondary"
            :disabled="!appNameValid || uploadState !== 'success'"
            @click="createApp"
          >
            {{ immediateDeploy ? 'deploy' : 'create' }} app
          </v-btn>
        </v-layout>
      </div>
    </v-layout>
  </section>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { debounce, uniq } from 'lodash';
import JSZip from 'jszip';

import validator from '@/services/validator';

import ticDatImage from '@/assets/svg/tic-dat-icon.svg';
import csvImage from '@/assets/svg/csv-file-icon.svg';
import createApplicationImg from '@/assets/svg/create-application.svg';
import SelectCreationType from './components/SelectCreationType';
import FolderState from './components/FolderState';

export default {
  name: 'NewApplication',
  components: { SelectCreationType, FolderState },

  data() {
    return {
      // Expected app folders to upload
      appFolders: {
        inputs: 'inputs',
        outputs: 'outputs',
        scripts: 'scripts',
        config: 'config',
        database: 'database',
        reports: 'reports',
      },

      dataSections: {
        input: 'Input',
        output: 'Output',
      },

      appName: '',
      appNameValid: false,
      detectDatatypes: true,
      isTitleNormalized: true,
      // Application name input validation rules
      appNameRules: [
        // Allowed characters for the app name
        value => this.$store.getters['application/checkAppNamePattern'](value)
          || this.$message.createNewApp.appNameAllowedCharacters,
        value => this.$store.getters['application/checkAppNameLength'](value)
          || this.$message.createNewApp.appNameTooLong,
      ],

      folderState: {},
      uploadState: this.$constant.uploadAreaStates.pending,
      folderFiles: {},
      ticdatFile: {},
      inputConfigUploaded: false,
      outputConfigUploaded: false,
      scriptsConfig: {},
      loading: false,
      immediateDeploy: false,
      databaseIsPresent: false,

      ticDatImage,
      csvImage,
      createApplicationImg,
      csvSelected: false,
      ticdatSelected: false,
      ticdatExtensions: ['py', 'zip'],
    };
  },

  computed: {
    ...mapState({
      appId: state => state.application.id,
      appNameAsyncErrors: state => state.application.nameAsyncErrors,
    }),
  },

  methods: {
    ...mapActions({
      createNewApp: 'application/createNewApp',
      checkAppNameUniqueness: 'application/checkAppNameUniqueness',
      showSnackbar: 'snackbar/show',
    }),

    ...mapMutations('application', {
      updateName: 'updateName',
      updateNameAsyncErrors: 'updateNameAsyncErrors',
    }),

    selectType(type) {
      this[type] = true;

      // Initializing state of the each app folder with the appropriate folder description
      const csvFolderState = {
        inputs: {
          text: this.$message.createNewApp.filesFormat(this.dataSections.input),
        },
        outputs: {
          text: this.$message.createNewApp.filesFormat(this.dataSections.output),
        },
        config: {
          text: this.$message.createNewApp.configFormat,
        },
        scripts: {
          text: this.$message.createNewApp.scriptsFormat,
        },
      };

      const ticdatFolderState = {
        ticdat: {
          text: this.$message.createNewApp.ticdatFileDescription,
          errors: [],
        },
      };

      this.folderState = this.ticdatSelected ? ticdatFolderState : csvFolderState;

      // Cleaning app name async errors returned from the server
      this.updateNameAsyncErrors();

      // Clearing app name in the Vuex
      this.updateName();
    },

    // Sending request to the server to check the app name uniqueness with 500ms debounce
    // eslint-disable-next-line func-names
    checkNameUniqueness: debounce(function () {
      this.checkAppNameUniqueness(this.appName);
    }, 500),

    // Folder upload handler
    folderUpload(files) {
      if (!this.ticdatSelected) {
        this.checkFolderStructure(files);
      } else {
        this.checkTicdatFile(files[0]);
      }
    },

    // Validating the uploaded ticdat file
    checkTicdatFile(file) {
      this.folderState.ticdat.errors = [];

      // Checking ticdat file extension
      const extension = file.name.split('.').pop();
      if (!this.ticdatExtensions.includes(extension)) {
        this.folderState.ticdat.errors.push(`${file.name}: ${this.$message.createNewApp.ticdatExtensionError}`);
        this.uploadState = this.$constant.uploadAreaStates.error;
      } else {
        this.ticdatFile = file;
        this.uploadState = this.$constant.uploadAreaStates.success;
      }
    },

    // Validating the uploaded folder structure
    checkFolderStructure(files) {
      // (re)initialising data
      this.folderFiles = {
        inputs: null,
        outputs: null,
        scripts: null,
        config: null,
        database: null,
      };
      this.scriptsConfig = {
        scriptFileList: [],
      };
      this.uploadState = this.$constant.uploadAreaStates.pending;
      this.inputConfigUploaded = false;
      this.outputConfigUploaded = false;

      Object.keys(this.folderState).forEach(folder => {
        this.folderState[folder].errors = [];
      });

      // Iterating through each uploaded file
      files.forEach(this.checkFile);

      // Checking if inputs folder is present
      if (!this.folderFiles.inputs) {
        this.folderState.inputs.errors.push(this.$message.createNewApp.missingInputData);
      }

      // reset immediate Deploy
      if (this.databaseIsPresent) {
        this.immediateDeploy = false;
        this.databaseIsPresent = false;
      }

      // Checking if database folder is present
      if (this.folderFiles.database) {
        this.immediateDeploy = true;
        this.databaseIsPresent = true;
      }

      this.validateConfigFiles().then(() => {
        // Result of all the validations
        this.uploadState = (
          this.folderState.inputs.errors.length
          || this.folderState.outputs.errors.length
          || this.folderState.config.errors.length
          || this.folderState.scripts.errors.length
        ) ? this.$constant.uploadAreaStates.error : this.$constant.uploadAreaStates.success;
      });
    },

    // Checking each uploaded file
    checkFile(file) {
      // Skipping the .DS_Store file
      if (file.webkitRelativePath.includes('.DS_Store')) return;

      // Skipping .pyc files
      if (file.name.endsWith('.pyc')) return;

      // Path without parent folder, grouping folder name and file extension
      file.path = file.webkitRelativePath.slice(file.webkitRelativePath.indexOf('/') + 1);
      file.folder = file.webkitRelativePath.split('/')[1].toLowerCase();
      file.extension = file.name.split('.').pop().toLowerCase();

      // Checking extension and size of the input and output files
      if (file.folder === this.appFolders.inputs || file.folder === this.appFolders.outputs) {
        if (this.$constant.allowedTableFileExtensions.indexOf(file.extension) < 0) {
          const extensions = this.$constant.allowedTableFileExtensions.join(', ');
          this.folderState[file.folder].errors.push(`${file.name}:
              ${this.$message.createNewApp.fileExtensionRestriction(extensions, file.folder)}`);
          return;
        }

        if (!this.$common.checkFileSize(file, 20)) {
          this.folderState[file.folder].errors.push(`${file.name}: ${this.$message.common.tableFileSizeRestriction}`);
          return;
        }
      }

      if (file.folder === this.appFolders.config) {
        // Checking extension of the config files
        if (file.extension !== this.$constant.allowedConfigFileExtension) {
          this.folderState.config.errors.push(`${file.name}:
              ${this.$message.createNewApp.fileExtensionRestriction(this.$constant.allowedConfigFileExtension, file.folder)}`);
          return;
        }

        // Saving if input and outputs configs are uploaded
        if (file.name === 'InputTableConfig.json') this.inputConfigUploaded = true;
        if (file.name === 'OutputTableConfig.json') this.outputConfigUploaded = true;
      }

      // Saving the list of uploaded scripts
      // and saving info about main script to execute if provided
      if (file.folder === this.appFolders.scripts) {
        if (!(/^[a-zA-Z0-9.\-_]{3,}$/.test(file.name))) {
          this.folderState.scripts.errors.push(`${file.name}:
              ${this.$message.actionSettings.fileNameAllowedCharacters}`);
          return;
        }

        this.scriptsConfig.scriptFileList.push({ fileName: file.webkitRelativePath.split(`${file.folder}/`)[1] });

        if (file.name.includes('execute')) {
          this.scriptsConfig.script = file.name;
          this.scriptsConfig.commandToExecute = this.$constant.scriptExtensionCommandMapping[
            file.extension.toLowerCase()];
        }
      }

      // Saving file info to the appropriate array
      if (this.appFolders[file.folder]) {
        if (this.folderFiles[file.folder]) this.folderFiles[file.folder].push(file);
        else this.folderFiles[file.folder] = [file];
      }
    },

    // Validating the content of uploaded config files
    validateConfigFiles() {
      const promises = [];

      // Validating each config file
      if (this.folderFiles.config) {
        this.folderFiles.config.forEach(file => {
          const promise = validator.validateConfig(file).then(result => {
            if (result !== true) this.folderState.config.errors.push(`${file.name}: ${result}`);
          });

          promises.push(promise);
        });
      }

      // Waiting for finishing the validation of all the config files
      return Promise.all(promises);
    },

    // Archiving the uploaded folder
    archiveFolder() {
      // Saving each processed file into the archive
      const zip = new JSZip();
      const scriptFileNames = [];
      Object.keys(this.folderFiles).forEach(folder => {
        // Skipping if nothing was uploaded for a particular folder
        if (!this.folderFiles[folder]) return;

        this.folderFiles[folder].forEach(file => {
          if (folder === this.appFolders.scripts) scriptFileNames.push(file.name);
          zip.folder(folder).file(file.webkitRelativePath.split(`${file.folder}/`)[1], file);
        });
      });

      if (scriptFileNames.length !== uniq(scriptFileNames).length) {
        return Promise.reject(this.$message.createNewApp.duplicateScriptNames);
      }
      // Saving the generated scriptsConfig.json file
      zip.folder(`${this.appName}/${this.appFolders.config}`).file(
        'ScriptsConfig.json',
        JSON.stringify(this.scriptsConfig, null, 2),
      );

      // Generating the zip file with compression
      return zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 3,
        },
      });
    },

    uploadAppData() {
      if (this.ticdatSelected) {
        // Sending the data to the server
        return this.createNewApp({
          appName: this.appName.trim(),
          appFormat: this.$constant.appFormats.ticdat,
          file: this.ticdatFile,
        });
      }

      // Archiving app folder and sending the data to the server
      return this.archiveFolder()
        .then(archive => {
          return this.createNewApp({
            appName: this.appName.trim(),
            appFormat: this.$constant.appFormats.normal,
            detectDatatypes: this.detectDatatypes,
            normalizeTitles: this.isTitleNormalized,
            archive,
          });
        })
        .catch(error => {
          this.showSnackbar({
            type: this.$constant.snackbarTypes.error,
            title: this.$constant.createApp.csv.upload.title,
            message: error || this.$constant.createApp.csv.upload.description,
          });
          throw error;
        });
    },

    // Create app button click handler
    createApp() {
      this.loading = true;
      this.uploadAppData()
        .then(() => {
          // Redirecting to the restore deployment page if database folder is present
          // Redirecting to the deployment page if Immediate deploy checkbox is checked
          // or app details page in other case
          let option;
          if (this.databaseIsPresent) {
            option = 'app-deployment/restore';
          } else if (this.immediateDeploy) {
            option = 'app-deployment/immediate';
          } else {
            option = 'details';
          }
          this.$router.push({ path: `/application/${this.appId}/${option}` });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
  .type-selectors div {
    margin-top: 1rem;
  }

  .close-page-button {
    position: fixed;
    right: 2rem;
    top: 2rem;
    width: 3rem;
    height: 3rem;

    i {
      font-size: 1.8rem;
    }
  }

  .new-app-form {
    width: 32rem;
    margin: 3% auto 0;

    h1 {
      margin: 0.8rem 0;
      font-size: 1.7rem;
      color: var(--theme-text);
      font-weight: 700;
    }

    img {
      width: 10rem;
    }

    .icon-information {
      font-size: 2rem;
      color: var(--theme-text)
    }

    .create-new-app-body {
      width: 100%;
      .app-folder-upload {
        width: 100%;
        border: 2px solid var(--theme-border);
        border-radius: .2rem;

        .upload-progress {
          min-height: 7rem;

          span {
            margin-right: .6rem;
            font-size: 1.2rem;
            font-weight: bold;
            color: var(--theme-text);
          }
        }

        .folder-state:not(:last-child) {
          border-bottom: 0.15rem solid var(--theme-border);
        }

        .folder-state:nth-child(2) {
          border-top: 0.15rem solid var(--theme-border);
        }
      }
    }

    .opex-upload-area {
      border: none;
      border-radius: 0;
    }

    .new-app-footer {
      width: 100%;
      margin-top: 1.2rem;

      .v-label {
        margin-left: .6rem;
      }

      .v-btn {
        margin: 0;
      }
    }

    .datatype-switch {
      border: .15rem solid var(--theme-border);
      border-radius: .2rem;
      padding: 0 1rem;
    }
  }

  p {
    margin: 0;
    font-size: .8rem;
  }

  .v-progress-circular {
    width: 2rem;
  }
</style>

<style lang="scss">
  .datatype-switch div.v-input.v-input--switch {
    width: 100%;
    padding: 1.2rem 0;

    label.v-label span.switch-title {
      font-weight: 700;
      font-size: 1rem;
      color: var(--theme-text);
    }
  }
  div.new-app-form div.opex-input {
    width: 100%;

    div.v-input__control div.v-input__slot {
      background-color: var(--theme-background-light);
      border-width: 2px;
      border-radius: .2rem;

      div.v-text-field__slot {
        input {
          padding: 1.4rem 1rem;
          font-weight: 600;
        }

        label {
          font-size: 1rem;
          font-weight: 700;
          top: 0;
        }
      }
    }
  }

  .new-app-footer .v-label {
    margin-left: .4rem;
    color: var(--theme-secondary);
    font-size: 1rem;
    font-weight: 600;
  }
</style>
