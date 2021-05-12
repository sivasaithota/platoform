<!--Form to manage scenarios and actions for the Schedule-->

<template>
  <div>
    <!--Scenarios autocomplete dropdown-->
    <opex-input
      v-model="scheduleScenario.id"
      :autocomplete-items="scenarios"
      item-text="name"
      item-value="id"
      label="scenario"
      placeholder="Select..."
    />

    <!--Actions autocomplete dropdown-->
    <opex-input
      v-model="selectedAction"
      :autocomplete-items="secondaryActions"
      item-text="name"
      item-value="_id"
      label="actions"
      placeholder="Choose actions"
      @change="selectAction"
    />

    <!--List of selected actions-->
    <draggable
      v-model="scheduleScenario.actionIds"
      tag="div"
      handle=".handle"
    >
      <opex-list-item
        v-for="(actionId, index) in scheduleScenario.actionIds"
        :key="index"
        :value="findActionName(actionId)"
        is-draggable
        @delete="deleteAction(index)"
      />
    </draggable>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ScheduleScenario',

  props: {
    scheduleScenario: {
      type: Object,
      default: () => ({ id: null, actionIds: [] }),
    },
  },

  data() {
    return {
      selectedAction: null,
    };
  },

  computed: {
    ...mapState({
      scenarios: state => state.application.scenarios.filter(scenario => scenario.status === 'active'),
      actions: state => state.actionSettings.actions,
    }),

    secondaryActions() {
      return this.$store.getters['actionSettings/secondaryActions'];
    },
  },

  methods: {
    selectAction() {
      this.scheduleScenario.actionIds.push(this.selectedAction);
      // Clearing the input field on the next tick
      this.$nextTick(() => {
        this.selectedAction = null;
      });
    },

    deleteAction(actionIndex) {
      this.scheduleScenario.actionIds.splice(actionIndex, 1);
    },

    findActionName(actionId) {
      return this.actions.find(action => action._id === actionId).name;
    },
  },
};
</script>
