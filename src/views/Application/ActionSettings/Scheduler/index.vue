<!--Scheduler settings page-->

<template>
  <v-layout class="scheduler">
    <opex-drawer
      v-if="!loading"
      v-model="drawerVisible"
      :title="$route.name"
      :subtitle="drawerSubtitle"
      icon="v2-clock2"
    >
      <edit-schedule
        v-if="drawerVisible"
        @close="drawerVisible = false"
        :schedule-index="selectedScheduleIndex"
      />
    </opex-drawer>

    <not-deployed-app-placeholder
      v-if="appInProgress"
      item="schedule"
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
        <v-btn
          v-if="!loading"
          color="secondary"
          :disabled="!appActive"
          @click="createSchedule"
        >
          new schedule
        </v-btn>
      </v-layout>

      <p
        v-if="!appActive"
        class="inactive-app-notice"
      >
        {{ $message.schedules.activeApps }}
      </p>

      <!--Schedules skeleton loader-->
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

      <!--List of schedules-->
      <template v-else>
        <div
          v-for="(schedule, index) in schedules"
          :key="index"
          :class="{disabled: !appActive}"
          class="schedule"
          @click="editSchedule(index)"
        >
          <!--Schedule name, description, status and some other info-->
          <v-layout
            justify-space-between
            class="schedule-info"
          >
            <div>
              <h4 class="schedule-name">{{ schedule.name }}</h4>
              <p class="schedule-description">{{ schedule.description }}</p>

              <v-layout>
                <div>
                  <span class="opex-label">status</span>
                  <div
                    class="schedule-value"
                    :style="{color: `var(--theme-${schedule.isActive ? 'success' : 'error'})`}"
                  >
                    {{ schedule.isActive ? 'Active' : 'Inactive' }}
                  </div>
                </div>

                <div>
                  <span class="opex-label">repeat</span>
                  <div class="schedule-value">
                    {{ schedule.type }}
                  </div>
                </div>

                <div>
                  <span class="opex-label">created by</span>
                  <div class="schedule-value text-lowercase">
                    {{ schedule.createdBy }}
                  </div>
                </div>

                <div>
                  <span class="opex-label">start time</span>
                  <div class="schedule-value">
                    {{ schedule.localRunTime }}
                  </div>
                </div>

                <div v-if="schedule.instanceType">
                  <span class="opex-label">{{ $constant.actionLabels.instanceSizing }}</span>
                  <div class="schedule-value">
                    {{ schedule.instanceType }}
                  </div>
                </div>
              </v-layout>
            </div>

          <!--Schedule menu-->
          <v-menu
            :ref="`scheduleMenu${index}`"
            content-class="schedule-menu"
            transition="slide-y-transition"
          >
            <template #activator="{ on }">
              <v-btn
                fab
                text
                color="primary"
                v-on="on"
              >
                <opex-icon name="v2-more" />
              </v-btn>
            </template>

              <v-list>
                <v-list-item
                  ripple
                  v-for="(item, menuIndex) in menuItems"
                  :key="menuIndex"
                  :disabled="item.disabled"
                  @click="item.clickHandler(index)"
                >
                  <v-list-item-title class="text-capitalize">
                    <template v-if="item.name === 'activate' && schedule.isActive">de</template>{{ item.name }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-layout>

          <!--Footer with schedule execution details-->
          <div class="schedule-footer">
          <span class="schedule-run-status">
            <span class="schedule-label">Last run time status: </span>
            <span
              v-if="schedule.lastResult"
              class="schedule-footer-value"
              :style="{color: `var(--theme-${executionStatusColor[schedule.lastResult]})`}"
            >
              {{ schedule.lastResult.toLowerCase() }}
            </span>
            <span v-else>-</span>
          </span>

            <span class="schedule-label">Last run time duration (sec): </span>
            <span
              v-if="schedule.lastDuration"
              class="schedule-footer-value"
            >
            {{ schedule.lastDuration }}
          </span>
            <span v-else>-</span>
          </div>
        </div>
      </template>

      <!--Delete schedule dialog window-->
      <opex-dialog
        v-model="deleteDialogVisible"
        :title="$message.schedules.dialogTitle('delete')"
        confirm-text="delete"
        confirm-color="error"
        @confirm="confirmDeleteSchedule"
      >
        <p
          v-if="deleteDialogVisible"
          v-html="$message.schedules.deleteText(schedules[scheduleIndexToDelete].name)"
          class="schedule-delete-message"
        ></p>
      </opex-dialog>

      <!--Activate/deactivate schedule dialog window-->
      <opex-dialog
        v-model="changeStatusDialogVisible"
        :title="$message.schedules.dialogTitle(changeStatusAction)"
        :confirm-text="changeStatusAction"
        @confirm="confirmChangeStatus"
      >
        <div
          v-if="changeStatusDialogVisible"
          class="schedule-status-change"
        >
          <!--Deactivate message and textarea for the deactivation reason-->
          <div v-if="schedules[this.scheduleIndexToChangeStatus].isActive">
            <p v-html="$message.schedules.deactivateText"></p>

            <opex-input
              textarea
              hide-details
              v-model="deactivationReason"
              :rows="5"
              :placeholder="$message.schedules.deactivateReason"
            />
          </div>

          <!--Activate message and deactivation reason-->
          <div v-else>
            <p>{{ $message.schedules.activateText }}</p>

            <div
              v-if="schedules[this.scheduleIndexToChangeStatus].deactivationReason"
              class="schedule-deactivation-reason"
            >
              <p>Deactivated by {{ schedules[this.scheduleIndexToChangeStatus].deactivatedBy }}</p>
              <p>{{ schedules[this.scheduleIndexToChangeStatus].deactivationReason }}</p>
            </div>
          </div>
        </div>
      </opex-dialog>
    </section>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import EditSchedule from './components/EditSchedule';
import NotDeployedAppPlaceholder from '../components/NotDeployedAppPlaceholder';

export default {
  name: 'Scheduler',
  components: { EditSchedule, NotDeployedAppPlaceholder },

  data() {
    return {
      loading: false,
      drawerVisible: false,
      selectedScheduleIndex: null,

      executionStatusColor: {
        SUCCESS: 'success',
        FAILURE: 'error',
      },

      menuItems: [
        {
          name: 'activate',
          clickHandler: this.showChangeStatusDialog,
        },
        {
          name: 'delete',
          clickHandler: this.showDeleteDialog,
        },
      ],

      deleteDialogVisible: false,
      changeStatusDialogVisible: false,
      scheduleIndexToDelete: null,
      scheduleIndexToChangeStatus: null,
      deactivationReason: '',
    };
  },

  computed: {
    ...mapState({
      schedules: state => state.schedules.schedules,
      schedulesExecutionStatus: state => state.schedules.schedulesExecutionStatus,
      appStatus: state => state.application.status,
    }),

    appInProgress() {
      return this.appStatus === this.$constant.deployStatuses.inProgress;
    },

    appActive() {
      return this.appStatus === this.$constant.deployStatuses.active;
    },

    drawerSubtitle() {
      return this.selectedScheduleIndex === null
        ? 'Create schedule'
        : 'Edit schedule';
    },

    changeStatusAction() {
      if (this.scheduleIndexToChangeStatus === null) return;
      return `${this.schedules[this.scheduleIndexToChangeStatus].isActive ? 'de' : ''}activate`;
    },
  },

  methods: {
    ...mapActions({
      getSchedules: 'schedules/getSchedules',
      changeScheduleStatus: 'schedules/changeScheduleStatus',
      deleteSchedule: 'schedules/deleteSchedule',
      getScenarios: 'application/getScenarios',
    }),

    createSchedule() {
      this.selectedScheduleIndex = null;
      this.drawerVisible = true;
    },

    editSchedule(index) {
      // Skipping if app is not active or the schedule card menu was clicked
      if (!this.appActive || this.$refs[`scheduleMenu${index}`][0].isActive) return;
      this.selectedScheduleIndex = index;
      this.drawerVisible = true;
    },

    // Delete modal window confirm button click handler
    confirmDeleteSchedule() {
      this.deleteSchedule({
        scheduleIndex: this.scheduleIndexToDelete,
        scheduleId: this.schedules[this.scheduleIndexToDelete]._id,
      }).then(() => {
        this.deleteDialogVisible = false;
      });
    },

    // Activate/deactivate modal window confirm button click handler
    confirmChangeStatus() {
      const scheduleActive = this.schedules[this.scheduleIndexToChangeStatus].isActive;

      // Combining data to send
      const schedule = {
        _id: this.schedules[this.scheduleIndexToChangeStatus]._id,
        isActive: !scheduleActive,
      };
      if (scheduleActive) schedule.deactivationReason = this.deactivationReason;

      this.changeScheduleStatus({
        index: this.scheduleIndexToChangeStatus,
        schedule,
      }).then(() => {
        this.deactivationReason = '';
        this.changeStatusDialogVisible = false;
      });
    },

    showDeleteDialog(scheduleIndex) {
      this.scheduleIndexToDelete = scheduleIndex;
      this.deleteDialogVisible = true;
    },

    showChangeStatusDialog(scheduleIndex) {
      this.scheduleIndexToChangeStatus = scheduleIndex;
      this.changeStatusDialogVisible = true;
    },
  },

  mounted() {
    if (this.appInProgress) return;

    // Fetching data from the server after fetching app details in the parent component
    this.loading = true;
    if (!this.appActive) {
      // If app is not active, fetching only schedules data
      return this.getSchedules(this.$route.params.id)
        .then(() => {
          this.loading = false;
        });
    }

    // In other case fetching schedules data, list of scenarios and list of actions
    return Promise.all([
      this.getSchedules(this.$route.params.id),
      this.getScenarios(),
    ]).then(() => {
      this.loading = false;
    });
  },
};
</script>

<style lang="scss">
  .schedule-menu {
    border: solid 1px #f5f5f5;
    box-shadow: 0 .6rem .8rem 0 var(--theme-background-grey);
    border-radius: .3rem;

    .v-list {
      padding: .6rem 0;
    }

    .v-list-item {
      height: 3rem;
      padding: 0 1.8rem;
      font-size: 1rem;
      font-weight: 600;
    }
  }

  .schedule-status-change b {
    color: var(--theme-error);
  }
</style>

<style scoped lang="scss">
  .app-content-header {
    min-height: 4.4rem;
  }

  .opex-card.action-settings-skeleton {
    margin-top: 2rem;
  }

  .schedule {
    margin: 2rem 0;
    background-color: var(--theme-background-light);
    box-shadow: 0 1px 1px 0 var(--theme-background-grey);
    cursor: pointer;
    transition: box-shadow .2s;

    &:hover {
      box-shadow: 0 .2rem .4rem rgba(0,0,0,.2);
    }

    .v-btn--floating {
      margin-left: 2rem;
    }

    .opex-label {
      margin-right: 7rem;
    }

    &.disabled {
      cursor: default;

      &:hover {
        box-shadow: 0 1px 1px 0 var(--theme-background-grey);
      }
    }
  }

  .schedule-info {
    padding: 1.2rem 1rem;
    box-shadow: 0 1px 1px -1px var(--theme-background-grey);

    &>div:not(.v-menu) {
      width: 100%;
    }
  }

  .schedule-footer {
    padding: .8rem;
    background-color: var(--theme-background-grey);
  }

  .schedule-name {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .schedule-description {
    margin: .8rem 0;
    font-size: 1rem;
  }

  .schedule-value {
    margin-right: 2rem;
    font-size: 1rem;
    font-weight: 500;
    text-transform: capitalize;
    color: var(--theme-secondary);
  }

  .schedule-run-status {
    display: inline-block;
    min-width: 20rem;
  }

  .schedule-label {
    font-size: 1rem;
    font-weight: bold;
  }

  .schedule-footer-value {
    font-weight: 500;
    text-transform: capitalize;
  }

  .schedule-delete-message {
    margin: 1.6rem 1rem;
    font-weight: 500;
  }

  .schedule-status-change {
    margin: 1.6rem 1rem;

    p {
      margin: 0;
      font-weight: 500;
    }
  }

  .schedule-deactivation-reason {
    margin-top: 1.6rem;

    p {
      font-weight: 300;
    }
  }
</style>
