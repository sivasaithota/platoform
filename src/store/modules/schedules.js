// Module for the app Schedules data manipulation

import moment from 'moment';

import axios from 'axios';
import message from '@/services/message';
import constant from '@/services/constant';

// Transforming list of schedules scenarios used in the frontend code to the list of actions expected on the server
const transformSchedules = (scenarios) => {
  const actions = [];
  scenarios.forEach(scenario => {
    scenario.actionIds.forEach(actionId => {
      actions.push({
        scenarioId: scenario.id,
        actionId,
      });
    });
  });

  return actions;
};

export default {
  namespaced: true,

  state: {
    schedules: [],
    schedulesExecutionStatus: {},
  },

  mutations: {
    // Saving schedules to the state
    updateSchedules(state, schedules = []) {
      schedules.forEach(schedule => {
        // Transforming UTC time to local time
        const [hour, minute] = schedule.runTime.split(':');
        schedule.localRunTime = moment()
          .utc()
          .hour(hour)
          .minute(minute)
          .local()
          .format('HH:mm');

        // Transforming list of action and scenario IDs to the list of scenarios
        schedule.scenarios = [];
        schedule.actions.forEach((action, index) => {
          if (schedule.actions[index - 1] && schedule.actions[index - 1].scenarioId === action.scenarioId) {
            // If previous action has the same scenario ID, just saving actionId to the list of the last scenario object
            schedule.scenarios[schedule.scenarios.length - 1].actionIds.push(action.actionId);
          } else {
            // In other case creating a new scenario object
            schedule.scenarios.push({
              id: action.scenarioId,
              actionIds: [action.actionId],
            });
          }
        });
      });

      state.schedules = schedules;
    },

    addSchedule(state, schedule) {
      state.schedules.push(schedule);
    },

    updateSchedule(state, data) {
      state.schedules[data.index] = data.schedule;
    },

    deleteSchedule(state, scheduleIndex) {
      state.schedules.splice(scheduleIndex, 1);
    },

    changeScheduleStatus(state, data) {
      Object.assign(state.schedules[data.index], data.schedule);
    },
  },

  actions: {
    // Fetching list of schedules for the app
    getSchedules({ commit }, appId) {
      return axios.get(
        `${constant.api.enframe}apps/${appId}/schedules`,
      ).then(({ data }) => {
        commit('updateSchedules', data.result);
      }).catch(({ response }) => {
        commit('updateSchedules');
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.schedules.errorFetching,
          message: response.data.message,
        });

        throw response.data.message;
      });
    },

    createSchedule({ commit, rootState }, { schedule }) {
      schedule.actions = transformSchedules(schedule.scenarios);

      // Deleting scenarios object which is needed only in the frontend code
      const { scenarios } = schedule;
      delete schedule.scenarios;

      return axios.post(
        `${constant.api.enframe}apps/${rootState.application.id}/schedules`,
        schedule,
      ).then(({ data }) => {
        // Adding id, status flag and author to the created schedule and saving it to the state
        schedule._id = data.result.id;
        schedule.isActive = true;
        schedule.createdBy = rootState.user.username;
        commit('addSchedule', schedule);

        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.success,
          title: constant.snackbarTypes.success,
          message: message.schedules.successCreating,
        });
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.schedules.errorCreating,
          message: response.data.message,
        });

        throw response.data.message;
      })
        .finally(() => {
        // Restoring scenarios object
          schedule.scenarios = scenarios;
        });
    },

    updateSchedule({ commit, rootState }, data) {
      data.schedule.actions = transformSchedules(data.schedule.scenarios);

      // Deleting scenarios object which is needed only in the frontend code
      const { scenarios } = data.schedule;
      delete data.schedule.scenarios;

      return axios.patch(
        `${constant.api.enframe}apps/${rootState.application.id}/schedules/${data.schedule._id}`,
        data.schedule,
      ).then(() => {
        commit('updateSchedule', data);

        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.success,
          title: constant.snackbarTypes.success,
          message: message.schedules.successUpdating,
        });
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.schedules.errorUpdating,
          message: response.data.message,
        });

        throw response.data.message;
      })
        .finally(() => {
        // Restoring scenarios object
          data.schedule.scenarios = scenarios;
        });
    },

    deleteSchedule({ commit, rootState }, { scheduleId, scheduleIndex }) {
      return axios.delete(
        `${constant.api.enframe}apps/${rootState.application.id}/schedules/${scheduleId}`,
      ).then(() => {
        commit('deleteSchedule', scheduleIndex);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.schedules.errorDeleting,
          message: response.data.message,
        });

        throw response.data.message;
      });
    },

    // Changing schedule status (active/inactive)
    changeScheduleStatus({ commit, rootState }, data) {
      return axios.patch(
        `${constant.api.enframe}apps/${rootState.application.id}/schedules/${data.schedule._id}`,
        data.schedule,
      ).then(() => {
        commit('changeScheduleStatus', data);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.schedules.errorChangingStatus,
          message: response.data.message,
        });

        throw response.data.message;
      });
    },

  },
};
