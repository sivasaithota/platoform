// Module for the app visualisation data

import axios from 'axios';
import message from '@/services/message';
import constant from '@/services/constant';

export default {
  namespaced: true,

  state: {
    report: {},
    reportTypes: [],
  },

  mutations: {
    updateReportTypes(state, reportTypes) {
      state.reportTypes = reportTypes;
    },

    updateReport(state, report = {}) {
      state.report = report;
    },
  },

  actions: {
    // Getting available report types
    getReportTypes({ commit }) {
      return axios.get(
        `${constant.api.enframe}reportTypes`,
      ).then(({ data }) => {
        // Converting array of report types go an object
        const reportTypes = {};
        data.result.forEach(type => {
          reportTypes[type.typeName] = type;
        });

        commit('updateReportTypes', reportTypes);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.visualization.errorFetchingVisualisation,
          message: response.data.message,
        });
      });
    },

    // Fetching reports
    getReports({ commit }, appId) {
      return axios.get(
        `${constant.api.enframe}apps/${appId}/reports`,
      ).then(({ data }) => {
        commit('updateReport', data.result[0]);
      }).catch(({ response }) => {
        commit('updateReport');
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.visualization.errorFetchingVisualisation,
          message: response.data.message,
        });
      });
    },

    // Creating a new report
    createReport({ commit, rootState }, report) {
      return axios.post(
        `${constant.api.enframe}apps/${rootState.application.id}/reports`,
        report,
      ).then(({ data }) => {
        report._id = data.result.id;
        commit('updateReport', report);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.visualization.errorCreatingReport,
          message: response.data.message,
        });
      });
    },

    // Updating an existing report
    updateReport({ commit, rootState }, report) {
      return axios.patch(
        `${constant.api.enframe}apps/${rootState.application.id}/reports/${report._id}`,
        report,
      ).then(() => {
        commit('updateReport', report);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.visualization.errorUpdatingReport,
          message: response.data.message,
        });
      });
    },

    // Deleting report
    deleteReport({ commit, rootState }, reportId) {
      return axios.delete(
        `${constant.api.enframe}apps/${rootState.application.id}/reports/${reportId}`,
      ).then(() => {
        commit('updateReport');
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.visualization.errorDeletingReport,
          message: response.data.message,
        });
      });
    },

    // Downloading shiny app logs
    getLogs({ rootState }, reportId) {
      return axios.get(`${constant.api.enframe}apps/${rootState.application.id}/reports/${reportId}/logs`)
        .then(({ data }) => {
          return data.result.data;
        })
        .catch(({ response }) => {
          this.dispatch('snackbar/show', {
            type: constant.snackbarTypes.error,
            title: message.common.errorDownloadingLogs,
            message: response.data.message,
          });
        });
    },
  },
};
