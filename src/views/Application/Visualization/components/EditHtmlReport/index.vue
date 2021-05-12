<!--Edit HTML report form in the drawer on the Visualisations page-->

<template>
  <v-form
    class="drawer-form edit-html-report"
    v-model="formValid"
  >
    <span class="opex-label">
      {{ $constant.htmlReportLabels.type }}
    </span>

    <!--HTML reports options-->
    <v-radio-group
      hide-details
      v-model="report.type"
    >
      <!--Default option-->
      <v-radio
        color="secondary"
        :ripple="false"
        :key="reportTypes.default.typeName"
        :label="reportTypes.default.displayName"
        :value="reportTypes.default.typeName"
      />

      <!--Custom URL option-->
      <v-radio
        color="secondary"
        :ripple="false"
        :key="reportTypes.url.typeName"
        :label="reportTypes.url.displayName"
        :value="reportTypes.url.typeName"
      />

      <!--Custom URL input-->
      <opex-input
        v-if="report.type === reportTypes.url.typeName"
        textarea
        v-model="report.url"
        placeholder="Enter URL"
        required
        :validation-rules="urlValidationRule"
      />

      <!--Shiny R option-->
      <v-radio
        v-if="reportTypes.shiny"
        color="secondary"
        :ripple="false"
        :key="reportTypes.shiny.typeName"
        :label="reportTypes.shiny.displayName"
        :value="reportTypes.shiny.typeName"
      />
    </v-radio-group>

    <!--ShinyR folder upload area-->
    <opex-upload-area
      v-if="reportTypes.shiny && report.type === reportTypes.shiny.typeName && !deployingShiny"
      folder
      text="Upload Shiny R folder"
      :icon="$constant.uploadAreaIcons.folder"
      :state="uploadState"
      @files="folderUpload"
    />

    <!--Spinner while deploying Shiny R app-->
    <v-layout
      v-if="deployingShiny"
      class="deploying-shiny"
      align-center
    >
      <v-progress-circular
        indeterminate
        color="secondary"
        style="width: 2rem; height: 2rem"
      />
      <span>Deploying...</span>
    </v-layout>

    <!--Buttons-->
    <v-divider/>
    <v-layout justify-end>
      <v-btn
        v-if="reportTypes.shiny && report.type === reportTypes.shiny.typeName"
        color="secondary"
        small
        :disabled="deployButtonDisabled"
        @click="deployShinyR"
      >
        {{ deployButtonName }}
      </v-btn>

      <v-btn
        v-else
        color="secondary"
        small
        :disabled="!formValid || !report || !report.type"
        @click="saveReport"
      >
        save
      </v-btn>

      <v-btn
        text
        small
        color="primary"
        @click="$emit('close')"
      >
        cancel
      </v-btn>
    </v-layout>
    <v-divider/>
  </v-form>
</template>

<script>
import JSZip from 'jszip';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'EditHtmlReport',

  data() {
    return {
      appId: this.$route.params.id,
      report: {},
      currentHtmlType: null,
      formValid: false,
      uploadState: this.$constant.uploadAreaStates.pending,
      deployingShiny: false,

      requiredShinyFile: 'server.R',
      shinyType: 'shiny',
      archivedFile: [],

      urlValidationRule: [
        // eslint-disable-next-line
        value => /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi.test(value)
          || this.$message.visualization.invalidUrl,
      ],
    };
  },

  computed: {
    ...mapState({
      initialReport: state => state.visualization.report,
      reportTypes: state => state.visualization.reportTypes,
    }),

    // Deploy/Redeploy ShinyR button state
    deployButtonDisabled() {
      // Disabled if the deployment is in progress
      // or current HTML type is not ShinyR and the valid ShinyR folder is not uploaded
      return this.deployingShiny
        || (this.currentHtmlType !== this.shinyType
            && this.uploadState !== this.$constant.uploadAreaStates.success);
    },

    // Deploy/Redeploy ShinyR button name
    deployButtonName() {
      // 'redeploy' if current HTML type not ShinyR and a new ShinyR folder is not uploaded
      // 'deploy' in other case
      return this.currentHtmlType === this.shinyType
        && this.uploadState === this.$constant.uploadAreaStates.pending
        ? 'redeploy'
        : 'deploy';
    },
  },

  methods: {
    ...mapActions({
      createReport: 'visualization/createReport',
      updateReport: 'visualization/updateReport',
      showSnackbar: 'snackbar/show',
      deployApp: 'appDeployment/deployApp',
    }),

    // Sending report data to the server
    saveReport() {
      // Default HTML option doesn't have URL
      if (this.report.type === this.reportTypes.default.typeName) delete this.report.url;

      const action = this.initialReport.type ? this.updateReport : this.createReport;
      action(this.report)
        .then(() => {
          this.$emit('close');
        });
    },

    // ShinyR folder upload handler
    folderUpload(files) {
      // Checking if the required file presents
      if (!files.find(file => file.name === this.requiredShinyFile)) {
        this.showSnackbar({
          type: this.$constant.snackbarTypes.error,
          title: this.$message.common.errorUploadingFolder,
          message: this.$message.visualization.missingServerFile,
        });

        this.uploadState = this.$constant.uploadAreaStates.error;
        return;
      }

      // Creating zip file structure with the uploaded files
      const zip = new JSZip();
      files.forEach(file => {
        zip.file(file.name, file);
      });

      // Generating zip file and uploading it to the server
      this.uploadState = this.$constant.uploadAreaStates.uploading;
      zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 3,
        },
      }).then(archive => {
        this.archivedFile = archive;
        this.uploadState = this.$constant.uploadAreaStates.success;
      }).catch((error) => {
        this.uploadState = this.$constant.uploadAreaStates.error;
        this.showSnackbar({
          type: this.$constant.snackbarTypes.error,
          title: this.$message.common.errorUploadingFolder,
          message: error,
        });
      });
    },

    // Deploy btn click handler
    deployShinyR() {
      const deployBody = new FormData();
      if (this.archivedFile.constructor === Blob) {
        deployBody.append('fileData', this.archivedFile, 'shiny.zip');
      }
      this.deployingShiny = true;

      // Sending request to deploy shinyR app and checking the deployment status
      this.deployApp({
        id: this.appId,
        deployBody,
        deployOption: this.$constant.deployTypes.shinyR,
      }).then(url => {
        this.deployingShiny = false;
        this.report.url = url;
        this.saveReport();

        this.showSnackbar({
          type: this.$constant.snackbarTypes.success,
          title: this.$constant.snackbarTypes.success,
          message: this.$message.visualization.successDeployingShiny,
        });
      }).catch((error) => {
        this.deployingShiny = false;
        this.$emit('close');

        this.showSnackbar({
          type: this.$constant.snackbarTypes.error,
          title: this.$message.visualization.errorDeployingShiny,
          message: error.data || error,
        });
      });
    },
  },

  created() {
    // Fetching report data from Vuex and making a copy of it
    // to avoid changing state outside the mutations
    this.report = { ...this.$store.state.visualization.report };

    // Also saving the readonly value of current report type
    this.currentHtmlType = this.report.type;
  },
};
</script>

<style lang="scss">
  form.edit-html-report {
    .v-textarea {
      padding-top: 0;
    }

    .opex-upload-area {
      margin-bottom: 1rem;
    }

    .deploying-shiny {
      margin-bottom: 1rem;
      font-size: 1rem;
      font-weight: 600;
      color: var(--theme-text);

      .v-progress-circular {
        margin-right: .6rem;
      }
    }

    .shiny-error {
      margin: 1rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--theme-error);
    }
  }
</style>
