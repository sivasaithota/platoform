<!--Form for adding new scenario to the schedule-->

<template>
  <div class="add-schedule-scenario">
    <!--Breadcrumbs with navigation-->
    <v-breadcrumbs :items="breadcrumbs" divider=">">
      <template #item="props">
        <a
          class="scheduler-breadcrumb-item"
          :class="props.item.disabled && 'disabled'"
          @click="props.item.clickHandler"
        >
          {{ props.item.name }}
        </a>
      </template>
    </v-breadcrumbs>

    <schedule-scenario :schedule-scenario="scheduleScenario"/>

    <!--Buttons-->
    <v-divider/>
    <v-layout justify-end>
      <v-btn
        small
        color="secondary"
        @click="$emit('save', scheduleScenario)"
      >
        save
      </v-btn>

      <v-btn
        text
        small
        color="primary"
        @click="$emit('cancel')"
      >
        cancel
      </v-btn>
    </v-layout>
    <v-divider/>
  </div>
</template>

<script>
import ScheduleScenario from '../ScheduleScenario/index';

export default {
  name: 'AddScenario',
  components: { ScheduleScenario },

  props: {
    scheduleScenario: Object,
  },

  data() {
    return {
      breadcrumbs: [
        {
          name: 'Scheduler',
          clickHandler: () => this.$emit('cancel'),
        },
        {
          name: 'Add scenario',
          disabled: true,
          clickHandler: () => {},
        },
      ],
    };
  },
};
</script>

<style lang="scss">
  .add-schedule-scenario li.v-breadcrumbs__divider {
    padding: 0 .8rem;
    font-size: 1.2rem;
    font-weight: bold;
  }
</style>


<style scoped lang="scss">
  .add-schedule-scenario {
    .v-breadcrumbs {
      margin: -1rem -1rem 1rem;
      padding: 0.4rem 1.2rem;
      font-size: 0.8rem;
      background-color: var(--theme-background);
    }

    .scheduler-breadcrumb-item {
      font-size: .9rem;
      color: var(--theme-secondary);

      &.disabled {
        pointer-events: none;
        color: var(--theme-primary);
      }
    }
  }
</style>
