<!--Component with the form for the add/edit column drawer on the input/output data page-->

<template>
  <v-form
    class="drawer-form"
    v-model="formValid"
  >
    <!--Inputs-->
    <opex-input
      v-model="columnData.name"
      label="column name"
      placeholder="Enter Column Name"
      :validation-rules="[columnNamePattern, columnNameUniqueness]"
      required
    />

    <opex-input
      v-model="columnData.displayName"
      label="column display name"
      placeholder="Enter Column Display Name"
      :validation-rules="[columnNamePattern]"
      required
    />

    <opex-input
      :autocomplete-items="dataTypes"
      v-model="columnData.datatype"
      item-text="typeName"
      label="column data type"
      placeholder="Select Data Type"
      required
    />

    <opex-input
      v-if="columnData.datatype === $constant.tableDatatype.doublePrecision"
      v-model.number="columnData.precision"
      class="number-input"
      label="decimal digits"
      placeholder="Number"
      type="number"
      :min="1"
      :max="15"
      :validation-rules="decimalsInputRule"
    />

    <opex-input
      v-if="columnData.datatype === $constant.tableDatatype.varchar"
      v-model.number="columnData.length"
      class="number-input"
      label="varchar length"
      placeholder="Number"
      type="number"
      :min="1"
      :validation-rules="minOneRule"
    />

    <v-layout v-if="columnData.datatype === $constant.tableDatatype.numeric">
      <opex-tooltip
        bottom
        class="number-input"
        :message="$message.inputOutput.precisionTooltip"
      >
        <template #activator>
          <opex-input
            v-model.number="columnData.precision"
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
            v-model.number="columnData.scale"
            label="scale"
            placeholder="Number"
            type="number"
            :min="1"
            :validation-rules="minOneRule"
          />
        </template>
      </opex-tooltip>
    </v-layout>

    <!--Switches-->
    <opex-switch
      v-model="columnData.isVisible"
      label="visible"
      :description="$message.inputOutput.columnVisibility"
    />

    <opex-switch
      v-model="columnData.hasFilter"
      label="add to quick filter"
      :description="$message.inputOutput.quickFilter"
      :rules="quickFilterRule"
    />

    <opex-switch
      v-model="columnData.isEditable"
      label="editable"
      :description="$message.inputOutput.editableColumn"
    />

    <!--Buttons-->
    <v-divider/>
    <v-layout justify-end>
      <v-btn
        color="secondary"
        small
        :disabled="!formValid || loading"
        @click="addUpdateColumn"
      >
        {{ columnIndex === null ? 'add' : 'update' }}
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

import { mapActions, mapState } from 'vuex';
import { cloneDeep } from 'lodash';

export default {
  name: 'EditColumn',

  props: {
    columnIndex: {
      type: Number,
      default: null,
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
      columnData: {},
      formValid: true,
      loading: false,

      // Validation rules
      columnNamePattern: value => /^[^,&\x22\x27]*$/.test(value) || this.$message.inputOutput.columnNameSymbols,
      columnNameUniqueness: value => {
        const column = this.columns[this.columnIndex];
        const nameChanged = (column && column.name !== value) || (!column && value);
        const nameInUse = this.columns.some(col => col.name === value);
        return !(nameChanged && nameInUse) || this.$message.inputOutput.columnNameUniqueness;
      },

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
      createColumn: 'createColumn',
      updateColumn: 'updateColumn',
    }),

    // add/update button click handler
    addUpdateColumn() {
      const action = this.columnIndex === null ? this.createColumn : this.updateColumn;

      // Sending column data to server
      this.loading = true;
      action({
        tagIndex: this.tagIndex,
        tableIndex: this.tableIndex,
        columnIndex: this.columnIndex,
        columnData: this.columnData,
      }).then(() => {
        this.loading = false;
        this.$emit('close');
      });
    },
  },

  created() {
    // Initialising the form model
    this.columnData = this.columnIndex === null
      // Adding a new column if the passed column index is null
      // Returning initial empty column data structure
      ? { ...this.$constant.initialColumnStructure }
      // Fetching column data from Vuex and making a deep copy of it
      // to avoid mutating state outside the mutations
      : cloneDeep(this.$store.state.tables.columns[this.columnIndex]);
  },
};
</script>

<style scoped lang="scss">
  .number-input {
    width: 40%;
    margin-right: 1rem;
  }
</style>
