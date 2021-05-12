<!--Component with list on group parameters and actions for them on the Parameters page-->

<template>
  <div>
    <!--Group actions block-->
    <div
      v-if="currentGroup.name !== $constant.defaultGroupName"
      class="divider"
    >
      <!--Select all parameters inside the group-->
      <div
        v-if="isGroupActive"
        class="checker"
        :class="{'checker--active': selectAll}"
      >
        <v-checkbox
          v-model="selectAll"
          :value="selectAll"
          @change="includeAllParams(groupIndex)"
        />
      </div>
      <slot></slot>
    </div>

    <div
      v-show="!currentGroup.isCollapsed"
      class="position-relative"
    >
      <!--List of parameters with dragging ability-->
      <draggable
        :id="currentGroup._id"
        v-model="parameterList"
        v-bind="dragOptions"
        handle=".handle"
        group="parameter"
        class="parameter_section"
        @start="onStartDragging"
        @end="finishDragging"
      >
        <v-layout
          column
          v-for="(page, index) in parameterList"
          :key="index"
          :id="page._id"
          class="parameter_item"
          :class="{
            'parameter_item--active': isActive(page._id),
            'parameter_item--nonactive': !isActive(page._id),
          }"
          @mouseover="hoverOnParam(index, page._id)"
          @mouseleave="leaveParam(index)"
        >
          <v-layout
            align-center
            fill-height
          >
            <!--Select current parameter-->
            <div class="parameter_checkbox">
              <v-checkbox
                :value="isActive(page._id)"
                @change="includeParam(index, page._id)"
              />
            </div>

            <h3 class="parameter_title">{{ page.name || 'untitled parameter' }}</h3>

            <!--Parameter's tooltip-->
            <opex-tooltip
              v-if="page.tooltip"
              right
              :message="page.tooltip"
            >
              <template #activator>
                <opex-icon
                  name="info-fill"
                  class="opex-icon info-icon"
                />
              </template>
            </opex-tooltip>
          </v-layout>

          <v-layout>
            <img
              v-if="!isActive(page._id)"
              :src="sortIcon"
              alt="sort element"
              class="handle"
            />
            <!--Field for parameter's Default values-->
            <v-flex
              xs8
              :class="{
                'field-margin': isActive(page._id),
              }"
            >
              <!--Type is Text-->
              <opex-input
                v-if="page.type === $constant.parameterTypes.text && !page.isNumeric"
                :value="page.defaultValue"
                :placeholder="enterPlaceholder"
                @change="updateDefaultValue($event, page)"
              />
              <!--Type is Numeric-->
              <opex-input
                v-else-if="page.type === $constant.parameterTypes.text && page.isNumeric"
                :value="page.defaultValue"
                type="number"
                :placeholder="enterPlaceholder"
                @change="updateDefaultValue(Number($event), page)"
              />
              <!--Type is Date-->
              <v-menu
                v-else-if="page.type === $constant.parameterTypes.date"
                :value="page.isPickerOpen"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
                @input="openDateField($event, index)"
              >
                <template #activator="{ on }">
                  <opex-input
                    v-on="on"
                    :value="page.defaultValue"
                    :placeholder="enterPlaceholder"
                    readonly
                    style="width: 100%"
                    icon="actions"
                  />
                </template>
                <v-date-picker
                  color="primary"
                  next-icon="icon-v2-arrow-right2"
                  prev-icon="icon-v2-arrow-left2"
                  :value="parseDate(page.defaultValue)"
                  @input="updateDateType($event, index, page)"
                  autosave
                />
              </v-menu>
              <!--Type is Dropdown-->
              <opex-input
                v-else-if="page.type === $constant.parameterTypes.checkbox"
                :autocomplete-items="page.dropdownValues"
                :value="page.defaultValue"
                multiple
                chips
                :placeholder="selectPlaceholder"
                @change="updateDefaultValue($event, page)"
              />
              <!--Type is Radio-->
              <opex-input
                v-else-if="page.type === $constant.parameterTypes.radio"
                :autocomplete-items="page.dropdownValues"
                :value="page.defaultValue"
                :placeholder="selectPlaceholder"
                @change="updateDefaultValue($event, page)"
              />
              <!--Type is Switch-->
              <opex-switch
                v-else-if="page.type === $constant.parameterTypes.switch"
                :value="page.defaultValue"
                @change="updateDefaultValue($event, page)"
              />

            </v-flex>
          </v-layout>

          <!--Parameter's control block buttons, which is showing on the parameter's card-->
          <v-layout
            column
            class="parameter_controller"
            :class="{'parameter_controller--open': page.isHovered}"
          >
            <!--Edit parameter via drawer-->
            <v-btn
              color="secondary"
              @click="editParameter(page)"
            >
              <opex-icon
                name="edit"
                class="icon_single_edit"
              />
            </v-btn>
            <!--Delete parameter-->
            <v-btn
              color="secondary"
              @click="deleteParams(page)"
            >
              <opex-icon
                name="delete-fill"
                class="icon_single_edit"
              />
            </v-btn>
          </v-layout>
        </v-layout>
      </draggable>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import moment from 'moment';
import { remove } from 'lodash';

import moveIcon from '@/assets/svg/parameters/move-to-group.svg';
import sortIcon from '@/assets/svg/sort-icon.svg';

export default {

  props: {
    groupIndex: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      enterPlaceholder: 'Enter a default value',
      selectPlaceholder: 'Select a default value',
      selectedParams: [],
      selectAll: false,
      appId: this.$route.params.id,
      moveIcon,
      sortIcon,
      draggingElementId: null,
    };
  },

  computed: {
    ...mapState('parameters', {
      parameterData: 'parameterData',
      draggingIsActive: 'draggingIsActive',
    }),

    // Sortable options
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    },

    currentGroup() {
      return this.parameterData[this.groupIndex];
    },

    // Showing checkbox for selecting all parameters
    isGroupActive() {
      return this.currentGroup.name && this.currentGroup.parameters.length;
    },

    parameterList: {
      get() {
        return this.currentGroup.parameters;
      },
      set(parameters) {
        this.updateParameterList({
          groupId: this.currentGroup._id,
          parameters,
        });
      },
    },

  },

  methods: {
    ...mapMutations('parameters', {
      rollbackDragging: 'rollbackDragging',
      changeParameterFlag: 'changeParameterFlag',
      updateParameterList: 'updateParameterList',
      changeDraggingStatus: 'changeDraggingStatus',
    }),

    ...mapActions('parameters', {
      startDragging: 'startDragging',
      updateParameter: 'updateParameter',
      moveParameter: 'moveParameter',
      deleteParameter: 'deleteParameter',
    }),

    // Flag for checking selected parameter or not
    isActive(id) {
      return this.selectedParams.includes(id);
    },

    // Show/hide parameter's action block
    showHideControlBlock(index, action) {
      this.changeParameterFlag({
        groupIndex: this.groupIndex,
        paramIndex: index,
        key: 'isHovered',
        action,
      });
    },

    // Mouse event to show control block
    // except situations when parameter section is dragging or selected
    hoverOnParam(index, id) {
      if (!this.draggingIsActive && !this.selectedParams.includes(id)) {
        this.showHideControlBlock(index, true);
      }
    },

    // Mouse event to hide control block
    leaveParam(index) {
      this.showHideControlBlock(index, false);
    },

    // Select current parameter click handler
    includeParam(index, id) {
      this.selectedParams.includes(id)  /* eslint-disable-line */
        ? remove(this.selectedParams, _id => _id === id)
        : this.selectedParams.push(id);
      // Change main checkbox if all parameters in a group selected
      this.selectAll = this.selectedParams.length === this.parameterList.length;
      this.showHideControlBlock(index, false);
      this.updateSelectedList();
    },

    // Select all parameters click handler
    includeAllParams() {
      this.selectedParams = this.selectAll ? this.parameterList.map((param) => param._id) : [];
      this.updateSelectedList();
    },

    // Open/close datepicker
    showHideDateField(index, action) {
      this.changeParameterFlag({
        groupIndex: this.groupIndex,
        paramIndex: index,
        key: 'isPickerOpen',
        action,
      });
    },

    // Open datepicker click handler
    openDateField(value, index) {
      this.showHideDateField(index, true);
    },

    // Update default date value and close datepicker
    updateDateType(value, index, parameter) {
      let newValue = this.formatDate(value);
      if (this.parameterList[index].defaultValue === newValue) {
        newValue = '';
      }
      this.updateDefaultValue(newValue, parameter);
      this.showHideDateField(index, false);
    },

    // Convert date to ISO format for datepicker
    parseDate(date) {
      return date ? moment(date).format('YYYY-MM-DD') : '';
    },

    // Convert date to MM/DD/YYYY format for DB
    formatDate(date) {
      return date ? moment(date).format('MM/DD/YYYY') : '';
    },

    // Update default parameter value for different types of fields
    updateDefaultValue(value, parameter) {
      this.updateParameter({
        appId: this.appId,
        groupId: this.currentGroup._id,
        paramId: parameter._id,
        params: {
          defaultValue: value,
        },
      });
    },

    // Emitting information of selected parameter to the parent component to call editing drawer
    editParameter(parameter) {
      this.$emit('editParameter', {
        groupId: this.currentGroup._id,
        paramId: parameter._id,
      });
    },

    // Delete parameter click handler
    deleteParams(parameter) {
      const params = {
        parameterMap: {},
      };
      params.parameterMap[this.currentGroup._id] = [parameter._id];
      this.deleteParameter({
        appId: this.appId,
        params,
      });
      // Clean lists of selected parameters
      this.cleanSelectedList();
      this.updateSelectedList();
    },

    // Clean list of selected parameters on parent component
    updateSelectedList() {
      this.$emit('updateSelectedList', {
        groupId: this.currentGroup._id,
        selectedParams: this.selectedParams,
      });
    },

    // Clean list of selected parameters on current component
    cleanSelectedList() {
      this.selectedParams = [];
      this.selectAll = false;
    },

    onStartDragging(ev) {
      this.draggingElementId = ev.item.id;
      this.startDragging();
    },

    // Move parameters drop handler
    finishDragging(ev) {
      // Generate parameter object with a list of selected parameters
      const params = {
        parameterMap: {},
        position: ev.newIndex,
      };
      params.parameterMap[ev.from.id] = [this.draggingElementId];

      // Sending request to the server
      this.moveParameter({
        appId: this.appId,
        recipientGroup: ev.to.id,
        oldPosition: ev.oldIndex,
        params,
      }).then(() => {
        // Clean lists of selected parameters
        this.cleanSelectedList();
        this.updateSelectedList();
      }).finally(() => {
        this.changeDraggingStatus(false);
      });
    },
  },
};
</script>

<style scoped lang="scss">
  $parameter_indent: .72rem;
  $icon-size--sm: 1.28rem;
  $icon-size--md: 1.7rem;
  $btn_indent: .57rem;
  $drag_img--width: .45rem;
  $drag_img--right: 1.2rem;
  $drag_img--left: .2rem;
  .parameter_section {
    box-shadow: 0 1px 1px 0 var(--theme-background-grey);
  }
  .parameter_item {
    background-color: var(--theme-background-primary);
    padding: $parameter_indent $parameter_indent 0;
    position: relative;
  }
  .parameter_item--active {
    border: 1px solid var(--theme-secondary);
    background-color: #f3eefc;
    + .parameter_item--active {
      border-top: none;
    }
  }
  .parameter_item--nonactive {
    border: 1px solid transparent;
    border-bottom-color: $parameter-border-color;
    &:last-child {
      border-bottom: transparent;
    }
  }
  .parameter_title {
    line-height: normal;
  }
  .handle {
    margin-right: $drag_img--right;
    margin-left: $drag_img--left;
    width: $drag_img--width;
    cursor: grabbing;
  }
  .field-margin {
    margin-left: drag_img--left + drag_img--width + drag_img--right;
  }
  .icon_single_edit {
    font-size: $icon-size--sm;
  }
  .icon_group_edit {
    font-size: $icon-size--md;
  }

  // Button list
  .parameter_controller {
    display: none;
    position: absolute;
    right: 0;
    box-shadow: -3px 1px 5px 0 var(--theme-background-grey);
    button.v-btn{
      border-radius: 0;
      min-width: auto;
      width: auto;
      padding: $btn_indent;
      margin: 0;
      &:not(.v-btn--text):not(.v-btn--depressed) {
        box-shadow: none;
      }
      &:first-child {
        border-top-left-radius: .36rem !important;
      }
      &:last-child {
        border-bottom-left-radius: .36rem !important;
      }
    }
  }
  .parameter_controller--open {
    display: flex;
  }

  // Checkbox group
  .parameter_checkbox {
    margin-right: $parameter_indent;
  }

  .checker {
    position: absolute;
    top: .41rem;
    z-index: 1;
    background-color: var(--theme-background);
    opacity: 0;
    transition: opacity .2s ease;
  }
  .checker--active {
    opacity: 1;
  }

  .info-icon {
    font-size: 1.4rem;
    top: .19rem;
    position: relative;
    color: var(--theme-secondary);
  }
</style>
