<!-- This is a wrap for the "opex-input" component with local functions and local styles -->

<template>
  <opex-input
    v-model="fieldValue"
    class="name-input"
    :placeholder="placeholder"
    required
    @valid="fieldValid = $event"
    @blur="checkValidation"
    :validation-rules="validationRules"
  >
    <template #append>
      <opex-icon
        v-if="!(isSuccess || isFailed || isPending)"
        name="edit"
        class="edit-name-icon"
      />
      <v-btn
        v-if="isSuccess"
        fab
        small
        color="success"
      >
        <opex-icon name="success"/>
      </v-btn>
      <opex-icon
        v-if="isFailed"
        name="close"
        class="error--text"
      />
    </template>
  </opex-input>
</template>

<script>

import { mapActions, mapState, mapMutations } from 'vuex';
import { cloneDeep, debounce } from 'lodash';

export default {
  name: 'EditColumn',

  props: {
    columnData: {
      type: Object,
      required: true,
    },

    fieldName: {
      type: String,
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

    columnIndex: {
      type: Number,
      required: true,
    },

    placeholder: {
      type: String,
      default: ' ',
    },

    unique: Boolean,
  },

  data() {
    return {
      isSuccess: false,
      isPending: false,
      isFailed: false,
      fieldValid: true,
      lastValidValue: null,

      // Validation rules
      columnNamePattern: value => /^[^,&\x22\x27]*$/.test(value) || this.$message.inputOutput.columnNameSymbols,
      columnNameUniqueness: value => {
        const column = this.columns[this.columnIndex];
        const nameChanged = (column && column.name !== value) || (!column && value);
        const nameInUse = this.columns.some(col => col.name === value);
        return !(nameChanged && nameInUse) || this.$message.inputOutput.columnNameUniqueness;
      },
    };
  },

  computed: {
    ...mapState({
      columns: state => state.tables.columns,
    }),
    validationRules() {
      const rules = [this.columnNamePattern];
      if (this.unique) rules.push(this.columnNameUniqueness);
      return rules;
    },
    fieldValue: {
      get() {
        return this.columnData[this.fieldName];
      },
      // eslint-disable-next-line func-names
      set: debounce(function (val) {
        if (this.fieldValid) {
          this.lastValidValue = val;
          // if value is valid, than saving it on server
          this.updateColumnData(val);
        } else {
          // updating lastValidValue if user haven't done any valid changes
          if (!this.lastValidValue) this.lastValidValue = this.columnData[this.fieldName];
          // if value is not valid, than saving only locally
          const columnData = cloneDeep(this.columnData);
          columnData[this.fieldName] = val;
          this.mutateColumn({
            columnIndex: this.columnIndex,
            columnData,
          });
        }
      }, 500),
    },
  },

  methods: {
    ...mapActions('tables', {
      updateColumn: 'updateColumn',
    }),
    ...mapMutations('tables', {
      mutateColumn: 'updateColumn',
    }),

    // checking value in field on blur
    checkValidation() {
      const columnData = cloneDeep(this.columnData);
      columnData[this.fieldName] = this.lastValidValue;
      // rollback the field value to last saved if it's not valid
      if (!this.fieldValid) {
        this.mutateColumn({
          columnIndex: this.columnIndex,
          columnData,
        });
      }
    },

    // add/update button click handler
    updateColumnData(val) {
      const newColumnData = cloneDeep(this.columnData);
      newColumnData[this.fieldName] = val;
      // Sending column data to server
      this.isPending = true;
      this.updateColumn({
        tagIndex: this.tagIndex,
        tableIndex: this.tableIndex,
        columnIndex: this.columnIndex,
        columnData: newColumnData,
      }).then(() => {
        this.isPending = false;
        this.showStatusIcon('isSuccess');
      }).catch(() => {
        this.isPending = false;
        this.showStatusIcon('isFailed');
      });
    },

    showStatusIcon(type) {
      this[type] = true;
      setTimeout(() => { this[type] = false; }, 2500);
    },
  },
};
</script>

<!-- STYLE hasn't to be scoped, to update styles for nested elements -->
<style lang="scss">
  .name-input.opex-input {
    input {
      transition: all .2s;
    }
    button {
      width: 1rem;
      height: 1rem;
    }

    &:not(:hover),
    .v-input--is-focused {
      .edit-name-icon {
        display: none;
      }
    }
    .v-input__append-inner {
      transition: all .1s;
    }
    .v-input.v-text-field {
      padding: 0;
      margin-bottom: -1rem;
      transition: all .2s;

      &.error--text {
        margin-bottom: 0;
      }
      &:not(.v-input--is-focused) {
        .v-input__slot {
          border-color: transparent;
          background-color: transparent;
          input {
            padding-left: 0;
            &:hover {
              color: var(--theme-secondary);
            }
          }
        }
      }
    }
  }
</style>
