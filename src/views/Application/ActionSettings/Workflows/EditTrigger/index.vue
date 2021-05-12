<!--Edit action trigger form-->

<template>
  <v-form
    class="drawer-form"
    v-model="formValid"
  >
    <!--Trigger table if trigger point is Upload table-->
    <template v-if="trigger.type === $constant.triggerPoints.tableUpload.value">
      <opex-input
        v-model="trigger.scenarioId"
        :label="$constant.triggerLabels.scenario"
        :autocomplete-items="scenarios"
        placeholder="Select scenario"
        item-text="name"
        item-value="id"
        required
      />

      <opex-input
        v-model="trigger.tableId"
        :label="$constant.triggerLabels.table"
        :autocomplete-items="tables"
        placeholder="Select table"
        item-text="displayName"
        item-value="_id"
        required
      />
    </template>

    <!--Trigger action-->
    <opex-input
      v-model="trigger.actionId"
      :label="$constant.triggerLabels.action"
      :autocomplete-items="secondaryActions"
      placeholder="Select action"
      item-text="name"
      item-value="_id"
      required
    />

    <!--Buttons-->
    <v-divider/>
    <v-layout justify-end>
      <v-btn
        small
        color="secondary"
        :disabled="!formValid || updating"
        @click="updateTrigger"
      >
        update
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

export default {
  name: 'EditTrigger',

  props: {
    triggerType: String,
  },

  data() {
    return {
      formValid: true,
      updating: false,
      trigger: {},
    };
  },

  computed: {
    ...mapState({
      tables: state => state.tables.tables,
      scenarios: state => state.application.scenarios.filter(scenario => scenario.status === 'active'),
    }),

    secondaryActions() {
      return this.$store.getters['actionSettings/secondaryActions'];
    },

    triggerPoints() {
      return Object.values(this.$constant.triggerPoints);
    },
  },

  methods: {
    ...mapActions('actionSettings', {
      setTrigger: 'setTrigger',
    }),

    updateTrigger() {
      this.updating = true;
      this.trigger.isEnabled = true;

      this.setTrigger(this.trigger)
        .then(() => {
          this.updating = false;
          this.$emit('update');
          this.$emit('close');
        });
    },
  },

  mounted() {
    // Finding action trigger by the passed type and storing a copy of it if defined
    const trigger = this.$store.state.actionSettings.actionTriggers.find((actionTrigger) => actionTrigger.type === this.triggerType);
    if (trigger) this.trigger = { ...trigger };
    else this.trigger.type = this.triggerType;
  },
};
</script>
