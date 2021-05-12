<!--Component with the form to update parameter drawer on the Parameters page-->

<template>
  <v-form
    class="parameters-drawer drawer-form"
    v-model="formValid"
    @submit.prevent="saveParam"
  >

    <opex-input
      v-model="paramData.name"
      label="parameter name"
      placeholder="Enter Parameter Name"
      ref="paramName"
      required
    />

    <div class="static_info">
      <p class="label">
        parameter type
      </p>
      <h4>{{ typeInfo.displayName }}</h4>
    </div>

    <!--List of possible options for checkbox or radio types-->
    <div
      v-if="hasOptions"
      class="static_info"
    >
      <p class="label">
        parameter options
      </p>
      <draggable
        tag="div"
        v-model="paramData.dropdownValues"
        handle=".handle"
      >
        <opex-list-item
          v-for="(item, index) in paramData.dropdownValues"
          :key="index"
          v-model="paramData.dropdownValues[index]"
          is-draggable
          is-editable
          @cancel="cancelOpexList(index)"
          @delete="paramData.dropdownValues.splice(index, 1)"
          @editingMode="switchEditingMode"
          @input="changeListValue"
          :validation-rules="validateParameterUniqueness(index)"
        />
      </draggable>
      <!--Add new option-->
      <opex-link
        plus-sign
        color="secondary"
        :disabled="isEditingMode"
        @click="paramData.dropdownValues.push(null)"
      >
        add option
      </opex-link>
      <br><br>
    </div>

    <!--Switch for setting numeric type for inputBox-->
    <opex-switch
      v-if="paramData.type === $constant.parameterTypes.text"
      v-model="paramData.isNumeric"
      label="numeric only"
      :description="$message.parameters.numericParameter"
    />

    <!--Switch for requiring option. Should be hidden as this functionality does not exist yet-->
    <!-- <opex-switch
      v-model="paramData.isRequired"
      label="required"
      :description="$message.parameters.mandatoryParameter"
    /> -->

    <opex-input
      textarea
      v-model="paramData.tooltip"
      label="Parameter Tool Tip"
      placeholder="Enter Parameter Tool Tip"
    />
    <!--Buttons-->
    <v-divider/>
    <v-layout justify-end>
      <v-btn
        color="secondary"
        small
        :disabled="!formValid"
        @click="saveParam"
      >
        save
      </v-btn>

      <v-btn
        text
        small
        color="primary"
        class="text-capitalize"
        @click="$emit('close')"
      >
        cancel
      </v-btn>
    </v-layout>
    <v-divider/>
  </v-form>
</template>

<script>
import { cloneDeep, filter } from 'lodash';
import { mapActions } from 'vuex';

import OpexListItem from '@/components/OpexListItem/index';

export default {
  name: 'ParametersDrawer',

  components: { OpexListItem },

  props: {
    paramId: {
      type: String,
      default: null,
    },

    paramType: {
      type: String,
      default: null,
    },

    paramPosition: {
      type: Number,
      default: null,
    },

    groupId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      appId: this.$route.params.id,
      parameterFormValid: false,
      paramData: {},
      typeInfo: {},
      isEditingMode: false,
    };
  },

  created() {
    // Initialising the form model

    this.paramData = this.paramId === null
      // Adding a new parameter if the passed parameter index is null
      // Returning initial empty parameter data structure
      ? this.$common.createEmptyParameter(this.paramType)
      // Fetching column data from Vuex and making a deep copy of it
      // to avoid mutating state outside the mutations
      : cloneDeep(this.$store.getters['parameters/getParamData']({
        paramId: this.paramId,
        groupId: this.groupId,
      }));

    this.typeInfo = this.$store.getters['parameters/getTypeData'](this.paramData.type);

    setTimeout(() => {
      this.$refs.paramName.$children[0].$refs.input.focus();
    }, 150); // waiting for drawer showing (to prevent blinking) (150 - empirically obtained)
  },

  computed: {
    // Check Dropdown type or Radio type to show options
    hasOptions() {
      return this.paramData.type === this.$constant.parameterTypes.checkbox
        || this.paramData.type === this.$constant.parameterTypes.radio;
    },

    // to validate parameter we need to check if its type is dropdown with at least one element
    formValid: {
      get() {
        // if it's not a dropdown return form validation value
        if (!this.hasOptions) return this.parameterFormValid;
        // checking that form is valid and dropdown has at least one element
        return this.parameterFormValid && !!filter(this.paramData.dropdownValues, value => !!value).length;
        // we need to use filter to exclude all null values
      },
      set(val) {
        // saving validation result for form (without validation of dropdown)
        this.parameterFormValid = val;
      },
    },
  },

  methods: {
    ...mapActions('parameters', {
      createParameter: 'createParameter',
      updateParameter: 'updateParameter',
    }),

    validateParameterUniqueness(index) {
      return [
        val => {
          const arrayWithoutElement = this.paramData.dropdownValues.slice(); // making copy of array
          arrayWithoutElement.splice(index, 1); // removing current element from array
          return !arrayWithoutElement.includes(val) || this.$message.parameters.optionUniqueError;
        },
      ];
    },

    cancelOpexList(index) {
      // remove item if it was just created
      if (this.paramData.dropdownValues[index] === null) this.paramData.dropdownValues.splice(index, 1);
    },

    switchEditingMode(value) {
      this.isEditingMode = value;
    },

    // Save button click handler
    saveParam() {
      if (!this.formValid) return;
      // Update parameter
      if (this.paramData._id) {
        const params = {
          name: this.paramData.name,
          isRequired: this.paramData.isRequired,
          tooltip: this.paramData.tooltip,
        };
        // Add extra options based on the type
        if (this.paramData.type === this.$constant.parameterTypes.text) params.isNumeric = this.paramData.isNumeric;
        if (this.paramData.type === this.$constant.parameterTypes.checkbox
          || this.paramData.type === this.$constant.parameterTypes.radio) params.dropdownValues = this.paramData.dropdownValues;
        // Sending parameter data to Vuex
        this.updateParameter({
          appId: this.appId,
          groupId: this.groupId,
          paramId: this.paramId,
          params: this.paramData,
        });
      } else {
        // Create new parameter
        // Sending parameter data to Vuex
        this.createParameter({
          appId: this.appId,
          groupId: this.groupId,
          paramId: this.paramId,
          params: this.paramData,
          position: this.paramPosition,
        });
      }

      this.$emit('close');
    },

    // Update default value when this list value was changed
    changeListValue(newVal, oldVal) {
      if (this.paramData.defaultValue === oldVal) this.paramData.defaultValue = newVal;
    },
  },
};
</script>

<style lang="scss">
  div.parameters-page form.parameters-drawer div.v-input--switch {
    margin-bottom: 1rem;

    div.v-input__slot {
      flex-direction: row-reverse;
    }
  }
</style>
