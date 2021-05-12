<!--Dialog window with date picker for the Custom schedule repetition-->

<template>
  <v-dialog
    light
    persistent
    content-class="schedule-days"
    width="300px"
    v-model="model"
  >
    <h5 class="schedule-days-title">Select date</h5>
    <v-date-picker
      no-title
      color="secondary"
      next-icon="icon-v2-arrow-right2"
      prev-icon="icon-v2-arrow-left2"
      v-model="date"
      :min="yesterday"
    >
      <v-spacer/>
      <v-btn
        small
        color="secondary"
        class="text-capitalize"
        @click="saveDates"
      >
        save
      </v-btn>
      <v-btn
        small
        text
        class="text-capitalize"
        color="primary"
        @click="model = false"
      >
        Cancel
      </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
import moment from 'moment';

export default {
  name: 'ScheduleDays',

  props: {
    value: Boolean,
    selectedDate: String,
  },

  data() {
    return {
      yesterday: moment().subtract(1, 'days').toISOString(),
      date: this.selectedDate || moment().toISOString(),
    };
  },

  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },

  methods: {
    saveDates() {
      this.$emit('save', [this.date]);
      this.model = false;
    },
  },
};
</script>

<style lang="scss">
  .schedule-days {
    background-color: var(--theme-background-light);

    .v-picker--date {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      box-shadow: none;

      .v-icon.icon {
        color: var(--theme-secondary);
      }
    }
  }
</style>


<style scoped lang="scss">
  .schedule-days-title {
    padding: 1rem 1.4rem .6rem;
    font-size: 1.4rem;
  }
</style>
