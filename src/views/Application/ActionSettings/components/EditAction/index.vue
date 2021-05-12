<template>
  <v-form
    class="drawer-form"
    v-model="formValid"
  >
    <template v-if="action.type !== $constant.actionTypes.primary.value">
      <!--Action type-->
      <opex-input
        v-model="action.type"
        :label="$constant.actionLabels.type"
        :autocomplete-items="secondaryActionTypes"
        required
      />

      <!--Action segment-->
      <opex-input
        v-model="action.segment"
        :label="$constant.actionLabels.segment"
        :autocomplete-items="$constant.segments"
        required
      />

      <!--Action name-->
      <opex-input
        placeholder="Give a Name"
        v-model="action.name"
        :label="$constant.actionLabels.name"
        :error-messages="nameAsyncErrors"
        @input="checkNameUniqueness"
        required
      />

      <!--File name to download-->
      <opex-input
        v-if="action.type === $constant.actionTypes.download.value"
        placeholder="File name with extension"
        v-model="action.downloadFile"
        :label="$constant.actionLabels.fileName"
        required
      />

      <!--Action description-->
      <opex-input
        textarea
        placeholder="Optional description"
        v-model="action.description"
        :label="$constant.actionLabels.description"
      />
    </template>

    <template v-if="action.type === $constant.actionTypes.primary.value || action.type === $constant.actionTypes.secondary.value">
      <!--Script for execution-->
      <opex-input
        placeholder="Select a script"
        v-model="action.fileName"
        :label="$constant.actionLabels.scriptToExecute"
        :autocomplete-items="scriptFileList"
        required
      />

      <!--Environments for execution-->
      <opex-input
        placeholder="Select an Environment"
        v-model="action.environment"
        :label="$constant.actionLabels.environmentToExecute"
        :autocomplete-items="Object.values(envList)"
        :menu-props="{ 'contentClass': 'custom_menu' }"
        item-text="name"
        item-value="name"
        required
      />

      <!--Command versions-->
      <opex-toggle
        v-if="commandVersions.length > 1"
        v-model="action.version"
        :radio-items="commandVersions"
        item-value="value"
        item-text="displayValue"
      />
    </template>

    <!--Instance types-->
    <opex-input
      placeholder="Select instance"
      v-model="action.instanceType"
      :label="$constant.actionLabels.instanceSizing"
      :autocomplete-items="instanceTypes"
      required
    />

    <!--Scenario specific switch-->
    <opex-switch
      v-if="action.type === $constant.actionTypes.upload.value || action.type === $constant.actionTypes.download.value"
      v-model="action.isScenarioSpecific"
      :label="$constant.actionLabels.scenarioSpecific"
      :description="$message.actionSettings.scenarioSpecific"
    />

    <!--Buttons-->
    <v-divider/>
    <v-layout justify-end>
      <v-btn
        small
        color="secondary"
        :disabled="updateBtnDisabled"
        @click="saveData"
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
import { debounce } from 'lodash';
import { mapActions, mapState } from 'vuex';

import OpexToggle from '@/components/OpexToggle';

export default {
  name: 'EditAction',

  components: { OpexToggle },

  props: {
    actionData: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      formValid: true,
      saving: false,
      action: {
        type: this.$constant.actionTypes.secondary.value,
        segment: this.$constant.segments[0],
        isScenarioSpecific: false,
        instanceType: this.$constant.instanceTypes.default.value,
      },
      commandVersions: [],
      envList: [],
      nameAsyncErrors: [], // Action name errors returned from the server
    };
  },

  computed: {
    ...mapState({
      scriptFileList: state => state.actionSettings.scriptFileList,
      environments: state => state.environment.environments,
      baseEnvs: state => state.environment.baseEnvs,
    }),

    // Secondary action types
    secondaryActionTypes() {
      return Object
        .values(this.$constant.actionTypes)
        .filter(type => type.value !== this.$constant.actionTypes.primary.value);
    },

    // Available instance types
    instanceTypes() {
      return Object.values(this.$constant.instanceTypes);
    },

    // Update button state
    updateBtnDisabled() {
      // Update button is disabled during the data saving, if form is not valid
      // or command to execute has versions but no version is chosen
      return this.saving || !this.formValid || (!!this.commandVersions.length && !this.action.version);
    },
  },

  methods: {
    ...mapActions({
      createAction: 'actionSettings/createAction',
      updateAction: 'actionSettings/updateAction',
      checkValueUniqueness: 'application/checkValueUniqueness',
    }),

    // Sending request to the server to check the action name uniqueness with 500ms debounce
    // eslint-disable-next-line func-names
    checkNameUniqueness: debounce(function () {
      // Removing error messages if table name is not changed
      if (this.actionData !== null && this.actionData.name === this.action.name) {
        this.nameAsyncErrors = [];
        return;
      }

      this.checkValueUniqueness({
        type: this.$constant.checkUniqueness.type.action,
        params: {
          appId: this.$route.params.id,
          name: this.action.name,
        },
      }).then(({ data }) => {
        // Adding or removing error message basing on the check result
        this.nameAsyncErrors = data.result.isUnique ? [] : [this.$message.inputOutput.tableNameUniqueness];
      });
    }, 500),

    // Creating/Updating action data in Vuex
    saveData() {
      // Clearing props not related to the action type
      if (this.action.type !== this.$constant.actionTypes.download.value) delete this.action.downloadFile;
      if (this.action.type === this.$constant.actionTypes.primary.value
        || this.action.type === this.$constant.actionTypes.secondary.value) {
        delete this.action.isScenarioSpecific;
      } else {
        delete this.action.fileName;
        delete this.action.command;
        delete this.action.version;
      }

      this.saving = true;
      const action = this.action._id ? this.updateAction : this.createAction;
      action(this.action)
        .then(() => {
          this.$emit('close');
        })
        .finally(() => {
          this.saving = false;
        });
    },
  },

  created() {
    if (this.actionData.type) {
      this.action = { ...this.actionData };
    }
    if (!this.action.instanceType) {
      this.action.instanceType = this.$constant.instanceTypes.default.value;
    }
    // Preparation of a list of existing environments
    this.envList.push({
      header: this.$constant.actionLabels.defaultEnv,
    });
    this.envList = this.envList.concat(this.baseEnvs);
    this.envList.push({
      divider: true,
    });
    this.envList.push({
      header: this.$constant.actionLabels.customEnv,
    });
    this.envList = this.envList.concat(this.environments);
  },
};
</script>
