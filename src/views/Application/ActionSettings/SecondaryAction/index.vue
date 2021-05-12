<!--Secondary actions page component-->

<template>
  <v-layout class="secondary-actions">

    <!--Drawer with scripts list and form for editing action-->
    <opex-drawer
      v-if="!loading"
      v-model="drawerVisible"
      title="action settings"
      :subtitle="$route.name"
      icon="v2-action-icon"
      @close="closeDrawer"
    >
      <opex-drawer-tabs :tabs="drawerTabs">
        <script-list :slot="drawerTabs[0]"/>
        <edit-action
          v-if="drawerVisible"
          :action-data="selectedAction"
          :slot="drawerTabs[1]"
          @close="closeDrawer"
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
        <v-btn
          color="secondary"
          @click="editAction()"
        >
          add action
        </v-btn>
      </v-layout>

      <v-layout
        align-center
        justify-space-between
        class="secondary-actions-filters"
      >
        <!--Action segment switch-->
        <div>
          <div
            class="secondary-action-segment"
            v-for="segment in $constant.segments"
            :key="segment"
            :class="{ selected: segment === selectedSegment }"
            @click="selectedSegment = segment"
          >
            {{ segment }}
          </div>
        </div>

        <!--Action type select-->
        <v-layout
          class="secondary-actions-type"
          align-center
        >
          <span class="filter-by">Filter by</span>
          <v-select
            hide-details
            single-line
            :menu-props="{ contentClass: 'actions-type-menu' }"
            :items="secondaryActionTypes"
            v-model="selectedType"
          />
        </v-layout>
      </v-layout>

      <!--Actions skeleton loader-->
      <template v-if="loading">
        <opex-card
          v-for="n in 2"
          :key="n"
          disabled
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
      </template>

      <draggable
        v-else
        tag="div"
        v-model="secondaryActions"
        handle=".action-card-sort"
        @change="actionMoved"
      >
        <opex-card
          v-for="(action, index) in secondaryActions"
          :key="index"
          :class="{ selected: action === selectedAction }"
          @click.native="editAction(action)"
        >
          <div class="action-card">
            <img
              class="action-card-sort"
              src="@/assets/svg/sort-icon.svg"
              alt="sorting"
            >

            <!--Delete action button-->
            <opex-popup
              title="Delete action"
              :message="$message.actionSettings.deleteAction"
              button-name="Delete"
              icon="v2-delete-2"
              @confirm="deleteAction(action._id)"
            >
              <v-btn
                fab
                text
                small
                class="action-card-delete"
                color="support"
              >
                <opex-icon
                  name="v2-delete-1"
                />
              </v-btn>
            </opex-popup>

            <!--Action name and description-->
            <h4 class="action-card-title">
              {{ action.name }}
            </h4>

            <p class="action-card-subtitle">
              {{ action.description }}
            </p>

            <!--Action info-->
            <div class="action-card-info">
              <span class="opex-label">
                {{ $constant.actionLabels.type }}
              </span>

              <span class="opex-card-value">
                {{ $constant.actionTypes[action.type].text }}
              </span>
            </div>

            <div
              v-if="action.type === $constant.actionTypes.secondary.value"
              class="action-card-info"
            >
              <span class="opex-label">
                {{ $constant.actionLabels.scriptToExecute }}
              </span>

              <span class="opex-card-value">
                {{ action.fileName }}
              </span>
            </div>

            <div
              v-if="action.type === $constant.actionTypes.secondary.value"
              class="action-card-info"
            >
              <span class="opex-label">
                {{ $constant.actionLabels.environmentToExecute }}
              </span>

              <span class="opex-card-value">
                {{ action.environment }}
              </span>
            </div>

            <!--Scendary action instance sizing-->
            <div
              v-if="action.instanceType"
              class="action-card-info"
            >
              <span class="opex-label">
                {{ $constant.actionLabels.instanceSizing }}
              </span>

              <span class="opex-card-value">
                {{ $constant.instanceTypes[action.instanceType].text }}
              </span>
            </div>

            <div
              v-if="action.type !== $constant.actionTypes.secondary.value"
              class="action-card-info"
            >
              <span class="opex-label">
                {{ $constant.actionLabels.scenarioSpecific }}
              </span>

              <span class="opex-card-value">
                {{ action.isScenarioSpecific ? 'Yes' : 'No' }}
              </span>
            </div>
          </div>
        </opex-card>
      </draggable>
    </section>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import ScriptList from '../components/ScriptList/index';
import EditAction from '../components/EditAction/index';

export default {
  name: 'SecondaryAction',
  components: { ScriptList, EditAction },

  props: {
    loading: Boolean,
  },

  data() {
    return {
      allActions: {
        value: 'all',
        text: 'All actions',
      },

      selectedSegment: this.$constant.segments[0],
      selectedType: 'all',
      drawerVisible: false,
      selectedAction: null,

      drawerTabs: ['available scripts', 'secondary action'],
    };
  },

  computed: {
    ...mapState({
      actions: state => state.actionSettings.actions,
    }),

    // List of the secondary actions filtered by segment and type
    secondaryActions: {
      get() {
        return this.actions
          .filter(action => {
            return action.segment === this.selectedSegment
                && (action.type === this.selectedType || this.selectedType === this.allActions.value);
          })
          .sort((a, b) => a.segmentPosition - b.segmentPosition);
      },
      set() {},
    },

    // Available secondary actions types
    secondaryActionTypes() {
      const types = Object
        .values(this.$constant.actionTypes)
        .filter(type => type.value !== this.$constant.actionTypes.primary.value);

      // Adding all actions type
      types.unshift(this.allActions);
      return types;
    },
  },

  methods: {
    ...mapActions('actionSettings', {
      deleteAction: 'deleteAction',
      moveAction: 'moveAction',
    }),

    editAction(action) {
      this.selectedAction = action;
      this.drawerVisible = true;
    },

    // Action drag&drop handler
    actionMoved({ moved }) {
      this.moveAction({
        actionId: moved.element._id,
        oldActionIndex: moved.oldIndex,
        newActionIndex: moved.newIndex,
      });
    },

    closeDrawer() {
      this.drawerVisible = false;
      this.selectedAction = null;
    },
  },
};
</script>

<style scoped lang="scss">
  .secondary-actions-filters {
    margin-bottom: 1rem;
  }

  .secondary-action-segment {
    display: inline-block;
    margin-right: 0.6rem;
    padding: 0.2rem 0;
    width: 6rem;
    border-bottom-left-radius: 15% 50%;
    border-bottom-right-radius: 15% 50%;
    border-top-left-radius: 15% 50%;
    border-top-right-radius: 15% 50%;
    background-color: transparent;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
    transition: all 0.2s;
    cursor: pointer;

    &.selected {
      background-color: var(--theme-secondary);
      color: var(--theme-primary-text);
      box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.2);
    }
  }

  .secondary-actions-type {
    flex-grow: 0;

    .filter-by {
      font-size: 0.9rem;
      font-weight: 500;
    }

    .v-select {
      max-width: 13rem;
      margin: 0 0 0 0.8rem;
      padding: 0;
      cursor: pointer;
    }
  }

  .action-card {
    grid-template-columns: 1.4rem 0.8fr 1fr 1fr 1fr 2rem;

    .action-card-title {
      grid-area: 1 / 2 / 2 / -2;
    }

    .action-card-subtitle {
      grid-area: 2 / 2 / 3 / -2;
    }

    .action-card-sort {
      grid-area: 1 / 1 / 4 / 2;
      margin-top: 0.4rem;
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }

    button.v-btn.action-card-delete {
      grid-area: 1 / -2 / 2 / -1;
      height: 2rem;
      width: 2rem;
      margin: 0;
      border-radius: 50%;
    }

    .action-card-info {
      grid-row-start: 3;
    }
  }
</style>

<!--Rewriting Vuetify select styles-->
<style lang="scss">
  div.secondary-actions-type div.v-input.v-select div.v-input__slot {
    min-height: 2rem;
    background-color: var(--theme-background-light) !important;
    border: solid 1px var(--theme-border-grey);
    border-radius: 0;
    cursor: pointer;

    &:before, &:after {
      display: none;
    }

    .v-select__selections {
      padding-left: 0.6rem;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .v-input__append-inner {
      align-self: center;
      margin: 0;
    }

    input {
      margin: 0;
    }
  }

  .actions-type-menu {
    .v-list__tile--link {
      height: 2.2rem;
      padding: 0 0.8rem;
    }

    .v-list__tile__title {
      font-size: 0.9rem;
    }
  }
</style>
