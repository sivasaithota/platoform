<template>
  <v-form
    class="drawer-form"
    v-model="formValid"
  >
    <!--Table upload area-->
    <opex-upload-area
      :icon="$constant.uploadAreaIcons.table"
      :text="addTable ? 'Upload table' : 'Upload table to add columns'"
      :extensions="$constant.allowedTableFileExtensions"
      :state="uploadState"
      @files="tableUpload"
    />

    <!--Uploaded file name-->
    <div v-if="tableData.fileName">
      <span class="opex-label">file name</span>
      <div class="file-name">
        {{ tableData.fileName }}
      </div>
    </div>

    <!--Inputs-->
    <opex-input
      v-model="tableData.name"
      :error-messages="nameAsyncErrors"
      label="table name"
      placeholder="Enter Table Name"
      required
      @input="checkNameUniqueness"
    />

    <opex-input
      v-model="tableData.displayName"
      label="table display name"
      placeholder="Enter Table Display Name"
      required
    />

    <tag-input
      :tag="tableData.tag"
      @select="tableData.tag = $event"
    />

    <!--Visible switch-->
    <opex-switch
      v-model="tableData.isVisible"
      label="visible"
      :description="$message.inputOutput.tableVisibility"
    />

    <!--Data type detection switch-->
    <opex-switch
      v-model="detectDatatypes"
      :label="$message.createNewApp.datatypeValidationLabel"
      :description="$message.createNewApp.datatypeValidationDescription"
    />

    <!--Title normalization switch-->
    <opex-switch
      v-model="isTitleNormalized"
      :label="$message.createNewApp.titleNormalizationLabel"
      :description="$message.createNewApp.titleNormalizationDescription"
    />

    <!--Buttons-->
    <v-divider/>
    <v-layout justify-end>
      <v-btn
        color="secondary"
        small
        :disabled="addUpdateDisabled"
        @click="addUpdateTable"
      >
        {{ addTable ? 'add' : 'update' }}
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
import { cloneDeep, debounce } from 'lodash';
import { mapActions, mapState, mapMutations } from 'vuex';

import TagInput from '../TagInput/index';

export default {
  name: 'EditTable',
  components: { TagInput },

  props: {
    addTable: Boolean,
  },

  data() {
    return {
      detectDatatypes: true,
      loading: false,
      tableData: {},
      uploadedFile: null,
      nameAsyncErrors: [], // Table name errors returned from the server
      formValid: true,
      uploadState: this.$constant.uploadAreaStates.pending,
      isTitleNormalized: true,
    };
  },

  computed: {
    ...mapState({
      tagList: state => state.tables.tagList,
    }),

    selectedTable() {
      return this.$store.getters['tables/getSelectedTable'];
    },

    addUpdateDisabled() {
      return !this.formValid
        || this.loading
        || this.uploadState === this.$constant.uploadAreaStates.uploading
        || this.uploadState === this.$constant.uploadAreaStates.error;
    },
  },

  methods: {
    ...mapActions({
      showSnackbar: 'snackbar/show',
      checkValueUniqueness: 'application/checkValueUniqueness',
      createTable: 'tables/createTable',
      updateTable: 'tables/updateTable',
    }),

    ...mapMutations({
      addTag: 'tables/addTag',
    }),

    // Sending request to the server to check the table name uniqueness with 500ms debounce
    // eslint-disable-next-line func-names
    checkNameUniqueness: debounce(function () {
      // Removing error messages if table name is not changed
      if (this.selectedTable !== null && this.selectedTable.name === this.tableData.name) {
        this.nameAsyncErrors = [];
        return;
      }

      this.checkValueUniqueness({
        type: this.$constant.checkUniqueness.type.table,
        params: {
          appId: this.$route.params.id,
          name: this.tableData.name,
        },
      }).then(({ data }) => {
        // Adding or removing error message basing on the check result
        this.nameAsyncErrors = data.result.isUnique ? [] : [this.$message.inputOutput.tableNameUniqueness];
      });
    }, 500),

    // Table file upload handler
    tableUpload([file]) {
      // Validating file size
      if (!this.$common.checkFileSize(file, 20)) {
        this.showSnackbar({
          type: this.$constant.snackbarTypes.error,
          title: this.$message.inputOutput.errorUploadingTable,
          message: this.$message.common.tableFileSizeRestriction,
        });

        this.uploadState = this.$constant.uploadAreaStates.error;
        return;
      }
      const tableName = file.name.replace(/.csv|.xlsx|.xls/i, '');
      this.uploadState = this.$constant.uploadAreaStates.success;
      this.uploadedFile = file;
      this.$set(this.tableData, 'fileName', file.name);
      this.$set(this.tableData, 'name', tableName);
      this.$set(this.tableData, 'displayName', this.normalizeTableName(tableName));
    },

    // add/update button click handler
    addUpdateTable() {
      const action = this.addTable ? this.createTable : this.updateTable;

      this.loading = true;
      if (this.uploadedFile) this.uploadState = this.$constant.uploadAreaStates.uploading;

      const { tagIndex: selectedTagIndex } = this.selectedTable || {};
      let tagIndex = this.tagList.findIndex(tag => tag.name === this.tableData.tag.name);
      let tableIndex = 0;
      // if the index is equal -1 - it's mean that we have removed all tables and tag removed too
      if (tagIndex === -1) {
        this.addTag({
          name: 'untagged',
          class: this.$constant.tagSupportClasses.none,
        });
        tagIndex = 0;
      } else if (tagIndex !== selectedTagIndex) {
        tableIndex = this.tagList[tagIndex].tables.length;
      }

      action({
        tableData: this.tableData,
        tagIndex,
        tableIndex,
        file: this.uploadedFile,
        detectDatatypes: this.detectDatatypes,
        normalizeTitles: this.isTitleNormalized,
      }).then(() => {
        this.$emit('close');
      });
    },

    // Auto case-normalize headers
    normalizeTableName(name) {
      // Replace underscore and dash with space
      name = name.replace(/([^_|\s].*?)_(?=[^_|^s])/g, '$1 ');
      // Change case of first character of every new word to Upper Case
      return name.replace(/(^|\s)[a-z]/g, (letter) => {
        return letter.toUpperCase();
      });
    },
  },

  created() {
    // Initialising the form model
    this.tableData = this.addTable
      // Adding a new table if the passed table index is null
      // Returning initial empty table data structure
      ? cloneDeep(this.$constant.initialTableStructure)
      // Fetching table data from Vuex and making a deep copy of it
      // to avoid mutating state outside the mutations
      : cloneDeep(this.selectedTable);

    // Adding table type (input/output)
    this.tableData.type = this.$route.name;
  },
};
</script>

<style scoped lang="scss">
  .opex-upload-area {
    margin-bottom: 1.2rem;
  }

  .file-name {
    margin-bottom: 1rem;
    font-size: 1rem;
    color: var(--theme-primary);
  }
</style>
