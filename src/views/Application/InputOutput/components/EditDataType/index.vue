<!-- Component to make inline editing of data type for input/output tables -->

<template>
  <v-menu
    v-model="EditDataTypeMenu"
    :close-on-content-click="false"
    bottom
    @input="updateData"
  >
    <template #activator="{ on }">
      <div v-on="on" class="edit-data-type">
        <span class="opex-card-value">{{ localData.datatype }}</span>
        <span
          class="opex-card-value"
          v-if="localData.datatype === $constant.tableDatatype.doublePrecision"
        >({{localData.precision}})</span>
        <span
          class="opex-card-value"
          v-if="localData.datatype === $constant.tableDatatype.varchar"
        >({{localData.length}})</span>
        <span
          class="opex-card-value"
          v-if="localData.datatype === $constant.tableDatatype.numeric"
        >({{localData.precision}}, {{localData.scale}})</span>
        <v-btn
          v-if="isSuccess"
          fab
          small
          color="success"
          slot="append"
        >
          <opex-icon name="success"/>
        </v-btn>
      </div>
    </template>

    <v-card class="popup-card">
      <v-form v-model="formValid">
      <!--Inputs-->
        <opex-input
        :autocomplete-items="this.dataTypes"
        v-model="localData.datatype"
        item-text="typeName"
        label="column data type"
        placeholder="Select Data Type"
        required
      />

      <opex-input
        v-if="localData.datatype === $constant.tableDatatype.doublePrecision"
        v-model.number="localData.precision"
        class="number-input"
        label="decimal digits"
        placeholder="Number"
        type="number"
        :min="1"
        :max="15"
        :validation-rules="decimalsInputRule"
      />

      <opex-input
        v-if="localData.datatype === $constant.tableDatatype.varchar"
        v-model.number="localData.length"
        class="number-input"
        label="varchar length"
        placeholder="Number"
        type="number"
        :min="1"
        :validation-rules="minOneRule"
      />

      <v-layout
        v-if="localData.datatype === $constant.tableDatatype.numeric"
        justify-space-between
      >
        <opex-tooltip
          bottom
          class="number-input"
          :message="$message.inputOutput.precisionTooltip"
        >
          <template #activator>
            <opex-input
              v-model.number="localData.precision"
              label="precision"
              placeholder="Number"
              type="number"
              :min="1"
              :validation-rules="minOneRule"
            />
          </template>
        </opex-tooltip>

        <opex-tooltip
          bottom
          class="number-input"
          :message="$message.inputOutput.scaleTooltip"
        >
          <template #activator>
            <opex-input
              v-model.number="localData.scale"
              label="scale"
              placeholder="Number"
              type="number"
              :min="1"
              :validation-rules="minOneRule"
            />
          </template>
        </opex-tooltip>
      </v-layout>
    </v-form>
    </v-card>
  </v-menu>
</template>

<script>

import { mapActions, mapState } from 'vuex';
import { cloneDeep } from 'lodash';

export default {
  name: 'EditDataType',

  props: {
    columnIndex: {
      type: Number,
      default: null,
    },

    columnData: {
      type: Object,
      required: true,
    },

    tagIndex: {
      type: Number,
      required: true,
    },

    tableIndex: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      localData: {},
      formValid: true,
      loading: false,
      EditDataTypeMenu: false,
      isSuccess: false,

      decimalsInputRule: [
        val => (val === undefined || val === '' || (val > 0 && val < 16)) || this.$message.common.minMaxRule(1, 15),
      ],
      minOneRule: [
        val => (val === undefined || val === '' || val > 0) || this.$message.common.minRule(1),
      ],
      quickFilterRule: [
        value => {
          return (!value || this.isCurrentFieldFilter || this.filterColumns.length < 3)
            || this.$message.inputOutput.filtersCountRestriction;
        },
      ],
    };
  },

  computed: {
    ...mapState({
      columns: state => state.tables.columns,
      // Available column data types
      dataTypes: state => state.tables.dataTypes,
    }),

    // List of columns with enabled Quick filter
    filterColumns() {
      return this.$store.getters['tables/getFilterColumns'];
    },

    isCurrentFieldFilter() {
      const currentField = this.filterColumns.filter(column => column._id === this.columnData._id);
      return !!(currentField && currentField.length);
    },
  },

  methods: {
    ...mapActions('tables', {
      updateColumn: 'updateColumn',
    }),

    // update button click handler
    updateData(isOpened) {
      if (isOpened) return; // do not run update function on opening popup

      // if user has cleaned input, we will return value from the store
      if (!this.localData.datatype) {
        this.localData = cloneDeep(this.columnData);
        return;
      }

      // Sending column data to server
      this.loading = true;
      this.updateColumn({
        tagIndex: this.tagIndex,
        tableIndex: this.tableIndex,
        columnIndex: this.columnIndex,
        columnData: this.localData,
      }).then(() => {
        this.loading = false;
        this.$emit('close');
        this.isSuccess = true;
        setTimeout(() => { this.isSuccess = false; }, 2500);
      });
    },
  },

  created() {
    // Making a deep copy of it to avoid mutating state outside the mutations
    this.localData = cloneDeep(this.columnData);
  },
};
</script>

<style scoped lang="scss">
  .edit-data-type {
    position: relative;
    button {
      position: absolute;
      right: 0;
      top: -.2rem;
      width: 1rem;
      height: 1rem;
    }
  }
  .number-input {
    width: 45%;
  }
  .popup-card {
    padding: 1rem 1rem 0 1rem;
  }
  .opex-card-value {
    cursor: pointer;
    font-weight: 400;
  }
</style>
