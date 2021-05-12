<!--Primary action page component-->

<template>
  <v-layout class="primary-action">
    <!--Drawer with scripts list and form for editing primary action-->
    <opex-drawer
      v-if="!loading"
      v-model="drawerVisible"
      title="action settings"
      :subtitle="$route.name"
      icon="v2-primary-action"
    >
      <opex-drawer-tabs :tabs="drawerTabs">
        <script-list :slot="drawerTabs[0]"/>
        <edit-action
          v-if="drawerVisible"
          :action-data="primaryAction"
          :slot="drawerTabs[1]"
          @close="drawerVisible = false"
        />
      </opex-drawer-tabs>
    </opex-drawer>

    <section class="app-content">
      <v-layout
        class="app-content-header"
        align-center
      >
        <h3>
          {{ $route.name }}
        </h3>

        <v-spacer/>
      </v-layout>

      <!--Skeleton loader card-->
      <opex-card
        disabled
        v-if="loading"
        class="column action-settings-skeleton"
      >
        <v-skeleton-loader type="heading"/>
        <v-layout>
          <v-skeleton-loader
            v-for="n in 3"
            :key="n"
            class="card-skeleton card-skeleton-darkened"
            type="list-item-two-line"
          />
        </v-layout>
      </opex-card>

      <!--Primary action card-->
      <opex-card
        v-else
        :class="{ selected: drawerVisible }"
        @click.native="drawerVisible = true"
      >
        <div class="action-card">
          <h4 class="action-card-title">
            {{ $message.actionSettings.primaryActionCardTitle }}
          </h4>

          <p class="action-card-subtitle">
            {{ $message.actionSettings.primaryActionCardSubtitle }}
          </p>

          <!--Primary action script to execute-->
          <div>
            <span class="opex-label">
              {{ $constant.actionLabels.scriptToExecute }}
            </span>

            <span class="opex-card-value">
              <span v-if="primaryAction.fileName">
                {{ primaryAction.fileName }}
              </span>
              <span
                v-else
                class="no-data"
              >
                {{ $message.actionSettings.clickToUpdate }}
              </span>
            </span>
          </div>

          <!--Primary action environment-->
          <div>
            <span class="opex-label">
              {{ $constant.actionLabels.environmentToExecute }}
            </span>

            <span class="opex-card-value">
              <span v-if="primaryAction.environment">
                {{ primaryAction.environment }}
              </span>
              <span
                v-else
                class="no-data"
              >
                {{ $message.actionSettings.clickToUpdate }}
              </span>
            </span>
          </div>

          <!--Primary action instance sizing-->
          <div>
            <span class="opex-label">
              {{ $constant.actionLabels.instanceSizing }}
            </span>

            <span class="opex-card-value">
              <span v-if="primaryAction.instanceType">
                {{ $constant.instanceTypes[primaryAction.instanceType].text }}
              </span>
              <span
                v-else
                class="no-data"
              >
                {{ $message.actionSettings.clickToUpdate }}
              </span>
            </span>
          </div>
        </div>
      </opex-card>
    </section>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex';

import ScriptList from '../components/ScriptList/index';
import EditAction from '../components/EditAction/index';

export default {
  name: 'PrimaryAction',
  components: { ScriptList, EditAction },

  props: {
    loading: Boolean,
  },

  data() {
    return {
      appId: 0,
      drawerVisible: false,
      selectedActionId: null,
      submenuSelectedItem: 0,

      drawerTabs: ['available scripts', 'primary action'],
    };
  },

  computed: {
    ...mapState({
      actions: state => state.actionSettings.actions,
    }),

    primaryAction() {
      return this.actions.find(action => action.type === this.$constant.actionTypes.primary.value)
        || { type: this.$constant.actionTypes.primary.value };
    },
  },
};
</script>

<style scoped lang="scss">
  .action-card {
    grid-template-columns: repeat(4, 1fr);

    .action-card-title {
      grid-area: 1 / 1 / 2 / -1;
    }

    .action-card-subtitle {
      grid-area: 2 / 1 / 3 / -1;
    }
  }
</style>

<!--Fix for the issue when the content inside tabs is sometimes cut off-->
<style lang="scss">
  .v-window__container {
    height: 100% !important;
  }
</style>
