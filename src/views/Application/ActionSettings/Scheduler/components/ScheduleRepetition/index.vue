<!--Schedule repetition template in the scheduler drawer-->

<template>
  <div class="schedule-repetition">
    <span class="opex-label">repeat</span>

    <!--Repeat options-->
    <v-radio-group
      hide-details
      v-model="scheduleData.type"
    >
      <v-radio
        v-for="(option, key) in repeatTypes"
        color="secondary"
        :ripple="false"
        :key="key"
        :label="option.text"
        :value="key"
      />
    </v-radio-group>

    <!--Day of the week selector-->
    <v-layout
      v-if="scheduleData.type === repeatTypes.weekly.value"
      class="schedule-days"
      justify-start
    >
      <v-checkbox
        class="text-uppercase"
        v-for="(day, index) in daysOfWeek"
        v-model="selectedDays"
        :key="index"
        :label="day.charAt(0)"
        :value="index"
        @change="scheduleData.days = $event"
      />
    </v-layout>

    <!--Schedule repetition description-->
    <p class="repetition-description">
      <span v-if="scheduleData.type === repeatTypes.weekly.value">
       {{ selectedDaysDescription }}
      </span>
      <span v-if="scheduleData.type === repeatTypes.custom.value">
        Selected date (yyyy-mm-dd) {{ selectedDatesDesc }}
      </span>
    </p>

    <opex-link
      v-if="scheduleData.type === repeatTypes.custom.value"
      color="secondary"
      @click="customDatesModalVisible = true"
    >
      View/edit date
    </opex-link>

    <schedule-days
      v-model="customDatesModalVisible"
      :selected-dates="scheduleData.dates"
      @save="saveDates"
    />
  </div>
</template>

<script>
import ScheduleDays from '../ScheduleDays/index';

export default {
  name: 'ScheduleRepetition',
  components: { ScheduleDays },

  props: {
    scheduleData: Object,
  },

  data() {
    return {
      repeatTypes: this.$constant.scheduleRepeatTypes,

      daysOfWeek: [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ],
      selectedDays: this.scheduleData.days || [],
      selectedDatesDesc: '',

      customDatesModalVisible: false,
    };
  },

  computed: {
    selectedDaysDescription() {
      // If all the week days are selected
      return this.selectedDays.length !== 7
        ? `Every week on ${this.selectedDays.map(day => this.daysOfWeek[day]).join(', ')}`
        : 'Every day';
    },
  },

  methods: {
    saveDates(dates) {
      this.scheduleData.dates = dates;
      this.changeSelectedDatesDesc();
    },

    // Showing only first 3 selected dates for custom repetition description
    changeSelectedDatesDesc() {
      const maxDays = 3;
      if (!this.scheduleData.dates) return;

      this.selectedDatesDesc = this.scheduleData.dates.length <= maxDays
        ? this.scheduleData.dates.join(', ')
        : `${this.scheduleData.dates.slice(0, 3).join(', ')} and ${this.scheduleData.dates.length - maxDays} more...`;
    },
  },

  mounted() {
    this.changeSelectedDatesDesc();
  },
};
</script>

<style lang="scss">
  .schedule-repetition {
    .v-input--radio-group__input {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }

    .schedule-days {
      .v-input--checkbox {
        flex-grow: 0;
        margin-right: 1rem;

        .v-input__slot {
          width: 2rem;
          height: 2rem;
          background-color: var(--theme-background-grey);
          border-radius: .2rem;

          .v-label {
            justify-content: center;
            font-weight: bold;
          }
        }

        .v-input--selection-controls__input {
          display: none;
        }

        &.v-input--is-label-active {
          .v-input__slot {
            background-color: var(--theme-secondary);

            .v-label {
              color: var(--theme-primary-text);
            }
          }
        }
      }
    }
  }
</style>

<style scoped lang="scss">
  .schedule-repetition {
    margin-bottom: 1rem;

    .opex-label {
      font-size: .7rem;
      color: var(--theme-secondary);
    }

    .v-radio {
      width: 50%;
    }

    .schedule-days {
      margin-bottom: 1rem;
    }

    .repetition-description {
      margin: 0;
      font-size: .9rem;
      opacity: .7;
    }
  }
</style>
