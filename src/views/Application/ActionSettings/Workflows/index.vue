<!--Action settings workflows page-->

<template>
  <v-layout class="workflows">
    <!--Drawer with form for editing a workflow-->
    <opex-drawer
      v-if="!loading"
      v-model="drawerVisible"
      title="action settings"
      :subtitle="$route.name"
      icon="v2-enframe-workflows"
    >
      <edit-trigger
        v-if="drawerVisible"
        :trigger-type="selectedTriggerType"
        @update="populateTriggers"
        @close="drawerVisible = false"
      />
    </opex-drawer>

    <not-deployed-app-placeholder
      v-if="appInProgress"
      item="workflow"
    />

    <section
      v-else
      class="app-content"
    >
      <v-layout
        class="app-content-header"
        align-center
      >
        <h3>
          {{ $route.name }}
        </h3>

        <v-spacer/>
      </v-layout>

      <p
        v-if="!appActive"
        class="inactive-app-notice"
      >
        {{ $message.actionSettings.workflowsActiveApps }}
      </p>

      <!--Skeleton loader card-->
      <template v-if="loading">
        <opex-card
          v-for="n in 3"
          :key="n"
          disabled
          class="column action-settings-skeleton"
        >
          <v-skeleton-loader type="heading"/>
          <v-layout>
            <v-skeleton-loader
              v-for="m in 3"
              :key="m"
              class="card-skeleton card-skeleton-darkened"
              type="list-item-two-line"
            />
          </v-layout>
        </opex-card>
      </template>

      <!--Action trigger card-->
      <template v-else>
        <opex-card
          v-for="trigger in triggers"
          :key="trigger._id"
          :disabled="!appActive"
          :class="{ selected: drawerVisible }"
          @click.native="updateTrigger(trigger)"
        >
          <div class="action-card">
            <h4 class="action-card-title">
              {{ trigger.text }}
            </h4>

            <p
              class="action-card-subtitle"
              :style="{ 'margin-bottom': trigger.isEnabled && appActive ? '1.2rem' : 0 }"
            >
              {{ trigger.description }}
            </p>

            <!--Trigger switch-->
            <v-switch
              v-if="appActive"
              hide-details
              class="trigger-switch"
              v-model="trigger.isEnabled"
              :ripple="false"
              @click.native.stop
              @change="switchTrigger(trigger)"
            />

            <template v-if="trigger.isEnabled && appActive">
              <template v-if="trigger.value === $constant.triggerPoints.tableUpload.value">
                <!--Scenario name-->
                <div>
                  <span class="opex-label">
                    {{ $constant.triggerLabels.scenario }}
                  </span>

                    <span class="opex-card-value">
                    <span v-if="trigger.scenario">
                      {{ trigger.scenario.name }}
                    </span>
                    <span
                      v-else
                      class="no-data"
                    >
                      {{ $message.actionSettings.clickToUpdate }}
                    </span>
                  </span>
                </div>

                <!--Table name-->
                <div>
                  <span class="opex-label">
                    {{ $constant.triggerLabels.table }}
                  </span>

                    <span class="opex-card-value">
                    <span v-if="trigger.table">
                      {{ trigger.table.displayName }}
                    </span>
                    <span
                      v-else
                      class="no-data"
                    >
                      {{ $message.actionSettings.clickToUpdate }}
                    </span>
                  </span>
                </div>
              </template>

              <!--Action to execute-->
              <div>
                <span class="opex-label">
                  {{ $constant.triggerLabels.action }}
                </span>

                  <span class="opex-card-value">
                  <span v-if="trigger.action">
                    {{ trigger.action.name }}
                  </span>
                  <span
                    v-else
                    class="no-data"
                  >
                    {{ $message.actionSettings.clickToUpdate }}
                  </span>
                </span>
              </div>
            </template>
          </div>
        </opex-card>
      </template>
    </section>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { cloneDeep } from 'lodash';
import EditTrigger from './EditTrigger/index';
import NotDeployedAppPlaceholder from '../components/NotDeployedAppPlaceholder';

export default {
  name: 'Workflows',
  components: { EditTrigger, NotDeployedAppPlaceholder },
  data() {
    return {
      loading: true,
      drawerVisible: false,
      triggers: null,
      selectedTriggerType: null,
    };
  },

  computed: {
    ...mapState({
      actionsPromise: state => state.actionSettings.actionsPromise,
      appStatus: state => state.application.status,
    }),

    appInProgress() {
      return this.appStatus === this.$constant.deployStatuses.inProgress;
    },

    appActive() {
      return this.appStatus === this.$constant.deployStatuses.active;
    },
  },

  methods: {
    ...mapActions({
      getTables: 'tables/getTables',
      getScenarios: 'application/getScenarios',
      getTriggers: 'actionSettings/getTriggers',
      setTrigger: 'actionSettings/setTrigger',
    }),

    // Populating trigger objects with action, table and scenario data
    // Adding not defined triggers
    populateTriggers() {
      this.triggers = cloneDeep(this.$constant.triggerPoints);

      const triggers = cloneDeep(this.$store.state.actionSettings.actionTriggers);
      triggers.forEach(trigger => {
        trigger.action = this.$store.getters['actionSettings/secondaryActions'].find(action => action._id === trigger.actionId);

        if (trigger.type === this.$constant.triggerPoints.tableUpload.value) {
          trigger.table = this.$store.state.tables.tables.find(table => table._id === trigger.tableId);
          trigger.scenario = this.$store.state.application.scenarios.find(scenario => scenario.id === trigger.scenarioId);
        }

        this.triggers[trigger.type] = { ...this.triggers[trigger.type], ...trigger };
      });
    },

    // Enable/disable trigger
    switchTrigger(trigger) {
      // Only if trigger is already defined
      if (trigger._id) {
        const payload = {
          _id: trigger._id,
          type: trigger.type,
          actionId: trigger.actionId,
          tableId: trigger.tableId,
          isEnabled: trigger.isEnabled,
        };
        if (trigger.scenarioId) payload.scenarioId = trigger.scenarioId;

        this.setTrigger(payload);
      }
    },

    updateTrigger(trigger) {
      if (trigger.isEnabled && this.appActive) {
        this.selectedTriggerType = trigger.value;
        this.drawerVisible = true;
      }
    },
  },

  mounted() {
    // Fetching app triggers, tables and scenarios if app is active after fetching app details
    const promises = [
      this.getTables({ appId: this.$route.params.id }),
      this.getTriggers(this.$route.params.id),
    ];
    if (this.appActive) promises.push(this.getScenarios());
    return Promise.all(promises)
      .then(() => this.actionsPromise)
      .then(() => {
        this.populateTriggers();
        this.loading = false;
      });
  },
};
</script>

<style scoped lang="scss">
  .action-card {
    grid-template-columns: 1fr 1fr 1fr 1fr 3rem;

    .action-card-title {
      grid-area: 1 / 1 / 2 / -2;
    }

    .action-card-subtitle {
      grid-area: 2 / 1 / 3 / -2;
    }

    .trigger-switch {
      grid-area: 1 / -2 / 3 / -1;
      padding: 0;
    }
  }
</style>
