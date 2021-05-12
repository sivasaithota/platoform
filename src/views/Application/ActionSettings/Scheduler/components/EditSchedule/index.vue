<!--Edit schedule form in the drawer on the Scheduler page-->

<template>
  <div>
    <add-scenario
      v-if="addingScenario || editingScenario"
      :schedule-scenario="editedScenario"
      @save="saveScenario"
      @cancel="cancelScenario"
    />

    <v-form
      v-else
      class="drawer-form edit-schedule"
      v-model="formValid"
    >
      <!--Schedule title input field-->
      <opex-input
        v-model="scheduleData.name"
        label="title"
        placeholder="Schedule title"
        required
      />

      <!--Schedule description text field-->
      <opex-input
        v-model="scheduleData.description"
        textarea
        :rows="1"
        maxLength="300"
        label="description"
        placeholder="Write something here"
      />
      <v-divider/>

      <!--Instance types-->
      <opex-input
        placeholder="Select instance"
        v-model="scheduleData.instanceType"
        :label="$constant.actionLabels.instanceSizing"
        :autocomplete-items="instanceTypes"
        required
      />

      <schedule-repetition :schedule-data="scheduleData"/>

      <!--Dropdown with time picker-->
      <v-menu
        offset-y
        :max-width="timePickerWidth"
        ref="timeMenu"
        transition="slide-y-transition"
        v-model="timePickerVisible"
        :close-on-content-click="false"
        :return-value.sync="scheduleData.localRunTime"
      >
        <template #activator="{ on }">

          <!--Input field with the tooltip about timezone info-->
          <opex-input
            v-on="on"
            v-model="scheduleData.localRunTime"
            label="start time"
            required
            readonly
            hide-details
            @click="timePickerVisible = true"
          >
            <template #append>
              <opex-tooltip
                bottom
                color="primary"
                :message="$message.schedules.timezoneTooltip"
              >
                <template #activator>
                  <opex-icon name="v2-app-info"/>
                </template>
              </opex-tooltip>
            </template>
          </opex-input>
        </template>

        <v-time-picker
          color="secondary"
          :width="timePickerWidth"
          v-if="timePickerVisible"
          v-model="scheduleData.localRunTime"
          @click:minute="$refs.timeMenu.save(scheduleData.localRunTime)"
        />
      </v-menu>
      <v-divider/>

      <!--Form to add a new scenario if schedule has only one scenario-->
      <schedule-scenario
        v-if="scheduleData.scenarios.length < 2"
        :schedule-scenario="scheduleData.scenarios[0]"
      />

      <!--List schedule scenarios in other case-->
      <div v-else>
        <span class="opex-label">scenarios</span>
        <p class="edit-scenario-hint">{{ $message.schedules.editScenarioHint }}</p>

        <draggable
          v-model="scheduleData.scenarios"
          tag="div"
          handle=".handle"
        >
          <opex-list-item
            class="cursor-pointer"
            v-for="(scenario, index) in scheduleData.scenarios"
            :key="index"
            :value="findScenarioName(scenario.id)"
            is-draggable
            @click.native="editScenario(scenario, index)"
            @delete="deleteScenario(index)"
          />
        </draggable>
      </div>

      <opex-link
        v-if="scenarioSelected"
        plus-sign
        color="secondary"
        @click="addScenario"
      >
        Add another scenario
      </opex-link>

      <!--Buttons-->
      <v-divider/>
      <v-layout justify-end>
        <v-btn
          small
          color="secondary"
          :disabled="!formValid || !scenarioSelected"
          @click="saveSchedule"
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
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { mapActions, mapState } from 'vuex';

import AddScenario from '../AddScenario/index';
import ScheduleScenario from '../ScheduleScenario/index';
import ScheduleRepetition from '../ScheduleRepetition/index';

export default {
  name: 'EditSchedule',
  components: { AddScenario, ScheduleScenario, ScheduleRepetition },

  props: {
    scheduleIndex: Number,
  },

  data() {
    return {
      scheduleData: {},
      formValid: false,
      addingScenario: false,
      editingScenario: false,
      editedScenario: null, // Scenario to edit in the add/edit scenario form
      editedScenarioIndex: null, // Index of the scenario to edit

      timePickerWidth: '22rem',
      timePickerVisible: false,
    };
  },

  computed: {
    ...mapState({
      scenarios: state => state.application.scenarios,
    }),

    // If at least one scenario and one action is selected
    scenarioSelected() {
      return this.scheduleData.scenarios[0].id !== null && this.scheduleData.scenarios[0].actionIds.length;
    },

    // Available instance types
    instanceTypes() {
      return Object.values(this.$constant.instanceTypes);
    },
  },

  methods: {
    ...mapActions({
      showSnackbar: 'snackbar/show',
      createSchedule: 'schedules/createSchedule',
      updateSchedule: 'schedules/updateSchedule',
    }),

    addScenario() {
      this.editedScenario = {
        id: null,
        actionIds: [],
      };
      this.addingScenario = true;
    },

    editScenario(scenario, index) {
      this.editedScenario = cloneDeep(scenario);
      this.editedScenarioIndex = index;
      this.editingScenario = true;
    },

    // Saving scenario after adding/editing
    saveScenario(scenario) {
      if (this.addingScenario) {
        this.scheduleData.scenarios.push(scenario);
        this.addingScenario = false;
      }

      if (this.editingScenario) {
        this.scheduleData.scenarios[this.editedScenarioIndex] = scenario;
        this.editingScenario = false;
      }
    },

    cancelScenario() {
      this.addingScenario = false;
      this.editingScenario = false;
    },

    findScenarioName(scenarioId) {
      return this.scenarios.find(scenario => scenario.id === scenarioId).name;
    },

    deleteScenario(scenarioIndex) {
      this.scheduleData.scenarios.splice(scenarioIndex, 1);
    },

    // Sending schedule data to the server
    saveSchedule() {
      // Validation to have at least one day of the week selected of schedule type is weekly
      if (this.scheduleData.type === this.$constant.scheduleRepeatTypes.weekly.value
        && (!this.scheduleData.days || !this.scheduleData.days.length)) {
        this.showSnackbar({
          type: this.$constant.snackbarTypes.error,
          title: this.$message.schedules.errorCreating,
          message: this.$message.schedules.minDays,
        });

        return;
      }

      // Validation to have at least one date selected of schedule type is custom
      if (this.scheduleData.type === this.$constant.scheduleRepeatTypes.custom.value
        && (!this.scheduleData.dates || !this.scheduleData.dates.length)) {
        this.showSnackbar({
          type: this.$constant.snackbarTypes.error,
          title: this.$message.schedules.errorCreating,
          message: this.$message.schedules.minDate,
        });

        return;
      }

      // Clearing additional data not related to the schedule type
      if (this.scheduleData.type !== this.$constant.scheduleRepeatTypes.weekly.value) delete this.scheduleData.days;
      if (this.scheduleData.type !== this.$constant.scheduleRepeatTypes.custom.value) delete this.scheduleData.dates;

      // Transforming time in local time zone to UTC time
      const [hour, minute] = this.scheduleData.localRunTime.split(':');
      this.scheduleData.runTime = moment()
        .hour(hour)
        .minute(minute)
        .utc()
        .format('HH:mm');

      const action = this.scheduleIndex === null ? this.createSchedule : this.updateSchedule;
      action({
        schedule: this.scheduleData,
        index: this.scheduleIndex,
      }).then(() => {
        this.$emit('close');
      });
    },
  },

  created() {
    // Initialising the form model
    if (this.scheduleIndex === null) {
      this.scheduleData = cloneDeep(this.$constant.initialScheduleStructure);
      this.scheduleData.localRunTime = new Date().toLocaleTimeString().substr(0, 5); // current time in HH:mm format
    } else {
      this.scheduleData = cloneDeep(this.$store.state.schedules.schedules[this.scheduleIndex]);
    }
    if (!this.scheduleData.instanceType) {
      this.scheduleData.instanceType = this.$constant.instanceTypes.default.value;
    }
  },
};
</script>

<style scoped lang="scss">
  .edit-schedule {
    .v-breadcrumbs {
      margin: -1rem -1rem 1rem;
      padding: .4rem 1.2rem;
      font-size: .8rem;
      background-color: var(--theme-background);
    }

    .opex-label {
      font-size: .7rem;
      color: var(--theme-secondary);
    }

    .edit-scenario-hint {
      margin-bottom: .6rem;
      font-size: .9rem;
      opacity: .7;
    }
  }
</style>
