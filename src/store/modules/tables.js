// Module for the app Input, Output data

import axios from 'axios';
import message from '@/services/message';
import constant from '@/services/constant';

// Composing form data to send with request to create or update table
const composeFormData = details => {
  const formData = new FormData();
  formData.append('jsonData', JSON.stringify(details.tableData));
  if (details.file) formData.append('fileData', details.file);
  return formData;
};

const groupTablesByTags = (tables, tagList) => {
  return tables.reduce((res, val) => {
    if (!res.length) {
      const tagObject = { ...val.tag, ...{ tables: [val] } };
      res = [tagObject];
    } else {
      const tagIndex = res.findIndex(el => el.name === val.tag.name);
      if (tagIndex === -1) {
        res.push({ ...val.tag, ...{ tables: [val] } });
      } else {
        res[tagIndex].tables.push(val);
      }
    }
    return res;
  }, tagList);
};

const getIndex = (tagList, id) => {
  let commonStep = 0;
  for (let tagStep = 0; tagStep <= tagList.length; tagStep += 1) {
    const index = tagList[tagStep].tables.findIndex(table => table._id === id);
    if (index !== -1) return commonStep + index;
    commonStep += tagList[tagStep].tables.length;
  }
};

export default {
  namespaced: true,

  state: {
    tables: [],
    tagList: [],
    columns: [],
    tags: [], // list of tags used by the tables of the current app
    dataTypes: [],
    selectedTagIndex: null,
    selectedTableIndex: null,
  },

  getters: {
    // Getting the list of columns with the enabled Quick Filter of a particular table
    // Expects the section(input/output) and tableIndex as the details
    getFilterColumns: (state) => {
      return state.columns
        .filter(column => column.hasFilter);
    },

    getSelectedTable: (state) => {
      if (!state.tagList || !state.tagList.length || state.selectedTableIndex === null) return null;
      return {
        ...state.tagList[state.selectedTagIndex].tables[state.selectedTableIndex],
        ...{ tagIndex: state.selectedTagIndex, tableIndex: state.selectedTableIndex },
      };
    },
  },

  mutations: {
    resetSelectedTable(state) {
      if (state.tagList.length) {
        state.selectedTagIndex = 0;
        state.selectedTableIndex = state.tagList[0].tables.length ? 0 : null;
      } else {
        state.selectedTagIndex = null;
        state.selectedTableIndex = null;
      }
    },

    updateSelectedTagIndex(state, index) {
      state.selectedTagIndex = index;
    },

    updateSelectedTableIndex(state, index) {
      state.selectedTableIndex = index;
    },

    updateDataTypes(state, dataTypes) {
      state.dataTypes = dataTypes;
    },

    updateTags(state, tagList) {
      state.tags = tagList;
      // eslint-disable-next-line array-callback-return
      tagList.map(tag => {
        const tagIndex = state.tagList.findIndex(tagData => tagData.name === tag.name);
        if (tagIndex === -1) state.tagList.push({ ...tag, ...{ tables: [] } });
      });
    },

    updateTables(state, tagList) {
      state.tables = tagList;
    },

    updateTagList(state, tagList) {
      state.tagList = tagList;
    },

    updateColumns(state, columns) {
      state.columns = columns;
    },

    addTag(state, tag) {
      state.tags.push(tag);
      state.tagList.push({ ...tag, tables: [] });
    },

    createTable(state, { tableData, tagIndex }) {
      const tagList = [...[], ...state.tagList];
      const selectedTableIndex = tagList[tagIndex].tables.length;
      tagList[tagIndex].tables.push(tableData);
      state.tagList = tagList;
      state.selectedTagIndex = tagIndex;
      state.selectedTableIndex = selectedTableIndex;
    },

    updateTable(state, details) {
      const {
        tagIndex, tableIndex, tableData, changedVisibility,
      } = details;
      const tagList = [...[], ...state.tagList];

      if (!changedVisibility && (tagIndex !== state.selectedTagIndex || tableIndex !== state.selectedTableIndex)) {
        tagList[state.selectedTagIndex].tables.splice(state.selectedTableIndex, 1);
      }
      tagList[tagIndex].tables[tableIndex] = tableData;

      state.tagList = tagList;
      if (!changedVisibility) {
        state.selectedTagIndex = tagIndex;
        state.selectedTableIndex = tableIndex;
      }
    },

    deleteSelectedTable(state) {
      state.tagList[state.selectedTagIndex].tables.splice(state.selectedTableIndex, 1);
      if (state.tagList[0].tables.length) {
        state.selectedTagIndex = 0;
        state.selectedTableIndex = 0;
      } else {
        state.selectedTableIndex = null;
      }
    },

    createColumn(state, column) {
      state.columns.push(column);
    },

    updateColumn(state, details) {
      state.columns[details.columnIndex] = Object.assign(state.columns[details.columnIndex], details.columnData);
    },

    deleteColumn(state, columnIndex) {
      state.columns.splice(columnIndex, 1);
    },
  },

  actions: {
    updateTagList({ commit, state }, data) {
      const { tagList, tagIndex, tableIndex, movedElements } = data; // eslint-disable-line
      // saving prev values for rollback functionality
      const oldTagList = [...[], ...state.tagList];
      const oldSelectedTagIndex = state.selectedTagIndex;
      const oldSelectedTableIndex = state.selectedTableIndex;

      // updating state by new values
      commit('updateTagList', tagList);
      commit('updateSelectedTagIndex', tagIndex || state.selectedTagIndex);
      commit('updateSelectedTableIndex', tableIndex || state.selectedTableIndex);

      // request to server
      return this.dispatch('tables/tableMoveTo', movedElements)
        .catch(() => {
          commit('updateTagList', oldTagList);
          commit('updateSelectedTagIndex', oldSelectedTagIndex);
          commit('updateSelectedTableIndex', oldSelectedTableIndex);
        });
    },

    // Getting available data types for table columns
    getDataTypes({ commit }) {
      return axios.get(
        `${constant.api.enframe}datatypes`,
      ).then(({ data }) => {
        commit('updateDataTypes', data.result);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.inputOutput.errorFetchingDataTypes,
          message: response.data.message,
        });
      });
    },

    // Fetching app tables list
    getTables({ commit }, { type, appId }) {
      const params = { type };
      return axios.get(
        `${constant.api.enframe}apps/${appId}/tables`,
        { params },
      ).then(({ data }) => {
        commit('updateTables', data.result);
        commit('updateTagList', groupTablesByTags(data.result, []));
      }).catch(({ response }) => {
        commit('updateTagList', []);
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.inputOutput.errorFetchingTables,
          message: response.data.message,
        });
      });
    },

    // Fetching column list of a particular table
    getColumns({ commit }, { appId, tableId }) {
      return axios.get(
        `${constant.api.enframe}apps/${appId}/tables/${tableId}/columns`,
      ).then(({ data }) => {
        commit('updateColumns', data.result);
      }).catch(({ response }) => {
        commit('updateColumns', []);
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.inputOutput.errorFetchingColumns,
          message: response.data.message,
        });
      });
    },

    // Fetching tables tags list
    getTags({ commit }, appId) {
      return axios.get(
        `${constant.api.enframe}apps/${appId}/tags`,
      ).then(({ data }) => {
        commit('updateTags', data.result);
      }).catch(({ response }) => {
        commit('updateTags', []);
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.inputOutput.errorFetchingTags,
          message: response.data.message,
        });
      });
    },

    tableMoveTo({ rootState, state }, movedElements) {
      const position = getIndex(state.tagList, movedElements.tableIds[0]);
      return axios.patch(
        `${constant.api.enframe}apps/${rootState.application.id}/tables/moveTo/${position}/`,
        movedElements,
      ).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.inputOutput.errorMovingTable,
          message: response.data.message,
        });
      });
    },

    // Sending request to create a new table
    createTable({ commit, rootState }, details) {
      const params = {
        detectDatatypes: details.detectDatatypes,
        normalizeTitles: details.normalizeTitles,
      };
      return axios.post(
        `${constant.api.enframe}apps/${rootState.application.id}/tables`,
        composeFormData(details),
        { params },
      ).then(({ data }) => {
        details.tableData._id = data.result.id;
        commit('createTable', {
          tagIndex: details.tagIndex,
          tableData: details.tableData,
        });
        commit('updateColumns', data.result.columns ? data.result.columns : []);

        const movedElements = {
          tableIds: [details.tableData._id],
          newTag: details.tableData.tag,
        };
        this.dispatch('tables/tableMoveTo', movedElements);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.inputOutput.errorCreatingTable,
          message: response.data.message,
        });
      });
    },

    // Sending request to update an existing table
    updateTable({ commit, rootState }, details) {
      return axios.patch(
        `${constant.api.enframe}apps/${rootState.application.id}/tables/${details.tableData._id}`,
        composeFormData(details),
      ).then(({ data }) => {
        commit('updateTable', {
          tagIndex: details.tagIndex,
          tableIndex: details.tableIndex,
          tableData: details.tableData,
          changedVisibility: details.changedVisibility,
        });

        // Updating column list if columns are returned from the server
        if (data.result.columns) commit('updateColumns', data.result.columns);

        if (details.changedVisibility) return;

        const movedElements = {
          tableIds: [details.tableData._id],
          newTag: details.tableData.tag,
        };
        this.dispatch('tables/tableMoveTo', movedElements);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.inputOutput.errorUpdatingTable,
          message: response.data.message,
        });
      });
    },

    // Sending request to delete a table
    deleteTable({ commit, rootState }, details) {
      return axios.delete(
        `${constant.api.enframe}apps/${rootState.application.id}/tables/${details.tableId}`,
      ).then(() => {
        commit('deleteSelectedTable');
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.inputOutput.errorDeletingTable,
          message: response.data.message,
        });
      });
    },

    // Sending request to create a new column
    createColumn({ commit, state, rootState }, { columnData, tableIndex, tagIndex }) {
      const tableId = state.tagList[tagIndex].tables[tableIndex]._id;
      return axios.post(
        `${constant.api.enframe}apps/${rootState.application.id}/tables/${tableId}/columns`,
        columnData,
      ).then(({ data }) => {
        columnData._id = data.result.id;
        commit('createColumn', columnData);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.inputOutput.errorCreatingColumn,
          message: response.data.message,
        });
      });
    },

    // Sending request to update an existing column
    updateColumn({ commit, state, rootState }, details) {
      const {
        columnData, columnIndex, tableIndex, tagIndex,
      } = details;
      const tableId = state.tagList[tagIndex].tables[tableIndex]._id;
      return axios.patch(
        `${constant.api.enframe}apps/${rootState.application.id}/tables/${tableId}/columns/${columnData._id}`,
        columnData,
      ).then(() => {
        commit('updateColumn', {
          columnData,
          columnIndex,
        });
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.inputOutput.errorUpdatingColumn,
          message: response.data.message,
        });
      });
    },

    // Sending request to delete a column
    deleteColumn({ commit, rootState }, details) {
      return axios.delete(
        `${constant.api.enframe}apps/${rootState.application.id}/tables/${details.tableId}/columns/${details.columnId}`,
      ).then(() => {
        commit('deleteColumn', details.columnIndex);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.inputOutput.errorDeletingColumn,
          message: response.data.message,
        });
      });
    },

    // Sending request to change columns order
    // eslint-disable-next-line object-curly-newline
    moveColumn({ commit, rootState, state }, { tableId, columnId, newColumnIndex, newColumnsOrder }) {
      // Saving current columns order to be able to revert the order if request fails
      const oldColumnsOrder = state.columns;

      // Saving new tables order in the state
      commit('updateColumns', newColumnsOrder);

      return axios.post(
        `${constant.api.enframe}apps/${rootState.application.id}/tables/${tableId}/columns/${columnId}/move`,
        { position: newColumnIndex },
      ).catch(({ response }) => {
        // Reverting to the saved order if request fails
        commit('updateColumns', oldColumnsOrder);
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.inputOutput.errorMovingColumn,
          message: response.data.message,
        });
      });
    },
  },
};
