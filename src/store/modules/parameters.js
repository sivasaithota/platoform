// Module for the app Parameter data

import Vue from 'vue';
import { cloneDeep, map, omit, forOwn } from 'lodash'; // eslint-disable-line
import axios from 'axios';
import message from '@/services/message';
import constant from '@/services/constant';

export default {
  namespaced: true,

  state: {
    draggingIsActive: false,
    prevParamData: null,
    parameterData: null,
    paramTypes: [],
  },

  getters: {
    // Getting parameter data by the passed group and parameter indexes
    // Expects the paramId and groupId as the details
    getParamData: (state) => (details) => {
      return state.parameterData
        .find(group => group._id === details.groupId)
        .parameters
        .find(parameter => parameter._id === details.paramId);
    },

    getPreviewData: (state) => {
      const rows = [];
      const parameters = map(cloneDeep(state.parameterData), (param) => {
        return omit(param, 'class');
      });
      parameters.forEach((parameter, index) => {
        if (index === 0) {
          rows[0] = parameter.parameters;
        } else if (index === parameters.length) {
          if (!parameters[index - 1].class) parameters[index - 1].class = 'xs12';
          return parameters;
        } else {
          const lastRowIndex = rows.length - 1;
          const lastRow = rows[lastRowIndex];
          const lastRowLength = lastRow.length;
          const currentRowLength = parameter.parameters.length;
          const nextRowLength = parameters[index + 1] ? parameters[index + 1].parameters.length : 0;
          switch (lastRowLength) {
            case 1:
              switch (currentRowLength) {
                case 1:
                  parameter.class = nextRowLength > 2 || nextRowLength === 0 ? 'xs9 content_last' : 'xs3';
                  parameters[index - 1].class = 'xs3';
                  rows[lastRowIndex] = lastRow.concat(parameter.parameters);
                  break;
                case 2:
                  parameter.class = nextRowLength > 1 || nextRowLength === 0 ? 'xs9 content_last' : 'xs6';
                  parameters[index - 1].class = 'xs3';
                  rows[lastRowIndex] = lastRow.concat(parameter.parameters);
                  break;
                case 3:
                  parameter.class = 'xs9 content_last';
                  parameters[index - 1].class = 'xs3';
                  rows[lastRowIndex] = lastRow.concat(parameter.parameters);
                  break;
                default:
                  parameters[index - 1].class = 'xs12';
                  rows.push(parameter.parameters);
                  break;
              }
              break;

            case 2:
              switch (currentRowLength) {
                case 1:
                  parameter.class = nextRowLength > 2 || nextRowLength === 0 ? 'xs6 content_last' : 'xs3';
                  if (!parameters[index - 1].class) parameters[index - 1].class = 'xs6';
                  rows[lastRowIndex] = lastRow.concat(parameter.parameters);
                  break;
                case 2:
                  parameter.class = 'xs6 content_last';
                  if (!parameters[index - 1].class) parameters[index - 1].class = 'xs6';
                  rows[lastRowIndex] = lastRow.concat(parameter.parameters);
                  break;
                case 3:
                  if (!parameters[index - 1].class) parameters[index - 1].class = 'xs12';
                  rows.push(parameter.parameters);
                  break;
                default:
                  if (!parameters[index - 1].class) parameters[index - 1].class = 'xs12';
                  rows.push(parameter.parameters);
                  break;
              }
              break;

            case 3:
              switch (currentRowLength) {
                case 1:
                  parameter.class = 'xs3 content_last';
                  if (!parameters[index - 1].class) parameters[index - 1].class = 'xs9';
                  rows[lastRowIndex] = lastRow.concat(parameter.parameters);
                  break;
                default:
                  if (!parameters[index - 1].class) parameters[index - 1].class = 'xs12';
                  rows.push(parameter.parameters);
                  break;
              }
              break;

            default:
              if (!parameters[index - 1].class) parameters[index - 1].class = 'xs12';
              rows.push(parameter.parameters);
              break;
          }
        }
      });
      return parameters;
    },

    // Getting type data by the passed type
    // Expects type as the detail
    getTypeData: (state) => (type) => {
      return state.paramTypes.find(typeData => typeData.typeName === type);
    },

    // Show the block if we have custom groups or some parameter in default group
    getVisibilityState: (state) => {
      return !state.parameterData || state.parameterData.length > 1 || !!state.parameterData[0].parameters.length;
    },
  },

  mutations: {
    changeDraggingStatus(state, data) {
      state.draggingIsActive = data;
    },

    updatePrevParamData(state) {
      state.prevParamData = cloneDeep(state.parameterData);
    },

    rollbackDragging(state) {
      state.parameterData = cloneDeep(state.prevParamData);
    },

    updateParamTypes(state, data) {
      state.paramTypes = data;
    },

    updateParameterList(state, { groupId, parameters }) {
      const index = state.parameterData.findIndex(group => group._id === groupId);
      state.parameterData[index].parameters = parameters;
    },


    updateParameterGroups(state, data) {
      state.parameterData = data;
      if (state.parameterData) {
        state.parameterData.forEach(group => {
          Vue.set(group, 'isEditGroup', false);
          Vue.set(group, 'isParamsSelected', false);
          group.parameters.forEach(param => {
            Vue.set(param, 'isHovered', false);
            Vue.set(param, 'isPickerOpen', false);
          });
        });
      }
    },

    // Changing order of groups by the passed init and possible indexes
    // Expects indexA, indexB as the details
    changeGroupPosition(state, details) {
      const list = state.parameterData.slice();
      const element = list[details.indexA];
      list[details.indexA] = list[details.indexB];
      list[details.indexB] = element;
      state.parameterData = list;
    },

    // Change group's flags by passed group index and it's key
    // Expects index, key (isCollapsed, isEditGroup, isParamsSelected) as the details
    changeGroupFlag(state, details) {
      state.parameterData[details.index][details.key] = !state
        .parameterData[details.index][details.key];
    },

    // Adding new group to parameters
    createParameterGroup(state) {
      state.parameterData.push({
        name: '',
        isEditGroup: true,
        isCollapsed: false,
        parameters: [],
      });
    },

    // Updating group info for current block by passed group index
    // Expects id, index, name, isCollapsed as the details
    updateGroupDetails(state, details) {
      if (details.id) state.parameterData[details.index]._id = details.id;
      state.parameterData[details.index].name = details.name;
      state.parameterData[details.index].isEditGroup = !state.parameterData[details.index].isEditGroup;
    },

    // Deleting group by passed group index and moving parameters from it to the default block
    // Expects index, defaultGroupId as the details
    deleteGroup(state, details) {
      const { parameterData: newParameterData } = state;
      if (details.defaultGroupId) {
        const parameterList = newParameterData[details.index].parameters.slice();
        const defaultGroup = newParameterData[0];
        parameterList.forEach(parameter => {
          parameter.parameterGroupId = defaultGroup._id;
        });
        defaultGroup.parameters = defaultGroup.parameters.concat(parameterList);
      }
      newParameterData.splice(details.index, 1);
      state.parameterData = newParameterData;
    },

    // Moving parameters to different group the passed init and possible group indexes and
    // selected parameter indexes
    // Expects initIndex, groupIndex, indexes as the details
    changeParametersPosition(state, details) {
      forOwn(details.params.parameterMap, (parameterIds, groupId) => {
        const { parameters } = state.parameterData.find(group => group._id === groupId);
        const newParameters = state.parameterData.find(group => group._id === details.recipientGroup).parameters;
        if (groupId !== details.recipientGroup) {
          // Remove parameters from the source group
          state.parameterData.find(group => group._id === groupId).parameters = parameters
            .filter((value) => !parameterIds.includes(value._id));

          // Add parameters to the recipient group
          parameterIds.forEach(id => {
            // Set parameter position inside the group
            if (details.params.position !== null && details.params.position !== undefined) {
              state.parameterData.find(group => group._id === details.recipientGroup).parameters
                .splice(details.params.position, 0, parameters.find(param => param._id === id));
            } else {
              state.parameterData.find(group => group._id === details.recipientGroup)
                .parameters.push(parameters.find(param => param._id === id));
            }
          });
        } else {
          if (details.params.position >= newParameters.length) {
            let lengthRange = details.params.position - newParameters.length + 1;
            // eslint-disable-next-line
            while (lengthRange--) {
              state.parameterData.find(group => group._id === details.recipientGroup).parameters.push(undefined);
            }
          }
          state.parameterData
            .find(group => group._id === details.recipientGroup).parameters
            .splice(details.params.position, 0, newParameters.splice(details.oldPosition, 1)[0]);
        }
      });
    },

    // Adding new parameter or updating an existing parameter data
    // Expects groupId, paramId, paramData as the details
    addUpdateParameter(state, details) {
      // Create new parameter
      if (details.paramId === null) {
        // Set parameter position inside the group
        if (details.position !== null) {
          state.parameterData
            .find(group => group._id === details.groupId).parameters
            .splice(details.position, 0, details.params);
        } else {
          // adding parameter to default group
          state.parameterData
            .find(group => group._id === details.groupId).parameters
            .push(details.params);
        }
      } else {
        // Update existing parameter with new data
        state.parameterData
          .find(group => group._id === details.groupId).parameters
          .map(parameter => (parameter._id !== details.paramId ? parameter : Object.assign(parameter, details.params)));
      }
    },

    // Deleting parameters by passed group and parameters indexes
    // Expects groupIds, parameterIds as the details
    deleteParameter(state, details) {
      forOwn(details.params.parameterMap, (parameterIds, groupId) => {
        const { parameters } = state.parameterData.find(group => group._id === groupId);
        state.parameterData.find(group => group._id === groupId).parameters = parameters
          .filter((value) => !parameterIds.includes(value._id));
      });
    },

    // Change parameter's flags by passed group, parameter indexes and it's key
    // Expects groupIndex, paramIndex,
    // key (isHovered, isPickerOpen) as the details
    changeParameterFlag(state, details) {
      state.parameterData[details.groupIndex]
        .parameters[details.paramIndex][details.key] = details.action;
    },
  },

  actions: {
    startDragging({ commit }) {
      commit('changeDraggingStatus', true);
      commit('updatePrevParamData');
    },

    // Getting available data types for parameters
    getParamTypes({ commit }) {
      return axios.get(
        `${constant.api.enframe}parameterTypes`,
      ).then(({ data }) => {
        commit('updateParamTypes', data.result);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.parameters.gettingTypesError,
          message: response.data.message,
        });
      });
    },

    // Getting application Parameter data
    getParameters({ commit }, details) {
      return axios.get(
        `${constant.api.enframe}apps/${details.appId}/parameterGroups`,
      ).then(({ data }) => {
        commit('updateParameterGroups', data.result);
      }).catch(({ response }) => {
        // Clearing the Parameter data
        commit('updateParameterGroups', { parameters: null });

        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.parameters.gettingParametersError,
          message: response.data.message,
        });
      });
    },

    // Creation application Parameter Group
    createGroup({ commit }, details) {
      // Combining data to send
      const group = {
        name: details.name,
        isCollapsed: false,
      };
      return axios.post(
        `${constant.api.enframe}apps/${details.appId}/parameterGroups`,
        group,
      ).then(({ data }) => {
        commit('updateGroupDetails', {
          id: data.result.id,
          index: details.index,
          name: details.name,
        });
      }).catch(({ response }) => {
        // Clearing the Parameter data
        commit('deleteGroup', { index: details.index });

        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.parameters.creatingGroupError,
          message: response.data.message,
        });
      });
    },

    // Update application Parameter Group Info
    updateGroup({ commit }, details) {
      return axios.patch(
        `${constant.api.enframe}apps/${details.appId}/parameterGroups/${details.groupId}`,
        details.params,
      ).then(() => {
        if (details.params.name) {
          commit('updateGroupDetails', {
            index: details.index,
            name: details.params.name,
          });
        }
        if (details.params.isCollapsed !== undefined) {
          commit('changeGroupFlag', {
            index: details.index,
            key: 'isCollapsed',
          });
        }
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.parameters.updatingGroupError,
          message: response.data.message,
        });
      });
    },

    // Update application Parameter Group position
    moveGroup({ commit }, details) {
      return axios.post(
        `${constant.api.enframe}apps/${details.appId}/parameterGroups/${details.groupId}/move`,
        details.params,
      ).then(() => {
        commit('changeGroupPosition', details.indexes);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.parameters.movingGroupError,
          message: response.data.message,
        });
      });
    },

    // Delete Parameter Group
    deleteGroup({ commit }, details) {
      const params = {
        parametersMovedToGroupId: details.defaultGroupId,
      };

      return axios.delete(
        `${constant.api.enframe}apps/${details.appId}/parameterGroups/${details.groupId}`,
        { params },
      ).then(() => {
        commit('deleteGroup', details);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.parameters.deletingGroupError,
          message: response.data.message,
        });
      });
    },

    // Creation Parameter
    createParameter({ commit }, details) {
      let url = `${constant.api.enframe}apps/${details.appId}/parameterGroups/${details.groupId}/parameters`;
      if (details.position !== null) url += `?position=${details.position}`;
      return axios.post(url, details.params)
        .then(({ data }) => {
          details.params._id = data.result.id;
          details.params.parameterGroupId = details.groupId;
          commit('addUpdateParameter', details);
          this.dispatch('snackbar/show', {
            type: constant.snackbarTypes.success,
            title: message.parameters.creatingParameterSuccess,
            message: message.parameters.creatingParameterSuccessMessage(details.params.name),
          });
        })
        .catch(({ response }) => {
          this.dispatch('snackbar/show', {
            type: constant.snackbarTypes.error,
            title: message.parameters.creatingParameterError,
            message: response.data.message,
          });
        });
    },

    // Update application Parameter Info
    updateParameter({ commit }, details) {
      return axios.patch(
        `${constant.api.enframe}apps/${details.appId}/parameterGroups/${details.groupId}/parameters/${details.paramId}`,
        details.params,
      ).then(() => {
        commit('addUpdateParameter', details);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.parameters.updatingParameterError,
          message: response.data.message,
        });
      });
    },

    // Delete Parameter
    deleteParameter({ commit }, details) {
      return axios.delete(
        `${constant.api.enframe}apps/${details.appId}/parameterGroups/parameters`,
        {
          data: details.params,
        },
      ).then(() => {
        commit('deleteParameter', details);
      }).catch(({ response }) => {
        this.dispatch('snackbar/show', {
          type: constant.snackbarTypes.error,
          title: message.parameters.deletingParameterError,
          message: response.data.message,
        });
      });
    },

    // Update application Parameter Group position
    moveParameter({ commit }, details) {
      return new Promise((resolve, reject) => {
        axios.post(
          `${constant.api.enframe}apps/${details.appId}/parameterGroups/${details.recipientGroup}/moveParameters`,
          details.params,
        )
          .then(() => resolve())
          .catch(({ response }) => {
            reject();
            commit('rollbackDragging');
            this.dispatch('snackbar/show', {
              type: constant.snackbarTypes.error,
              title: message.parameters.movingParameterError,
              message: response.data.message,
            });
          });
      });
    },
  },
};
