<!--Component with list of parameter to manage them on the Parameters page-->

<template>
  <div ref="parametersPanel">
    <!--Add/edit parameter drawer-->
    <opex-drawer
      v-if="parameters"
      v-model="paramDrawerVisible"
      title="parameters"
      :subtitle="drawerSubtitle"
      icon="v2-parameters"
      @close="selectedGroupId = null"
    >
      <parameters-drawer
        v-if="paramDrawerVisible"
        :group-id="selectedGroupId"
        :param-id="selectedParamId"
        :param-position="selectedParamPosition"
        :param-type="selectedParamType"
        @close="closeDrawer"
      />
    </opex-drawer>

    <div>
      <!-- Type bar to add new group or parameter-->
      <type-bar
        :position="offsetLeft"
        @createParameter="addParameter"
        @createParameterGroup="createNewGroup"
      />

      <!--Group control block buttons-->
      <v-layout
        column
        class="group_controller"
        :style="{ left: groupPosition }"
        :class="{ 'group_controller--open': isGroupControl }"
      >
        <!--Delete list of selected parameters-->
        <v-btn
          color="white"
          @click="deleteParams"
        >
          <opex-icon name="delete-fill"/>
        </v-btn>
        <div class="group_divider"></div>
        <!--Move selected parameters to the different group-->
        <v-menu
          transition="slide-x-transition"
          offset-x
          right
          open-on-hover
        >
          <template #activator="{ on }">
            <v-btn
              v-on="on"
              color="white"
            >
              <v-layout justify-space-around align-center>
                <img
                  :src="moveIcon"
                  alt="Move parameters"
                  class="menu_icon"
                />
              </v-layout>
            </v-btn>
          </template>
          <!--List of existing groups-->
          <v-list class="group_menu">
            <v-list-item>
              <v-list-item-title class="default">Move to group</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-for="(item, i) in groupList"
              :key="i"
              @click="changeParamPosition(item._id)"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-layout>

      <div
        v-if="showParameterBlock"
        class="position-relative"
      >
        <!--List of parameters-->
        <parameter-section
          v-for="(group, index) in parameters"
          :key="`${index}-grouped`"
          :group-index="index"
          ref="parameter"
          @editParameter="editParameter"
          @updateSelectedList="updateSelectedList"
        >
          <div class="divider">
            <h2>
              <div
                v-show="!group.isEditGroup"
                class="divider_label"
                @click="focusGroup(index)"
              >
                <v-layout
                  align-center
                  justify-center
                  fill-height
                >
                  <span>{{ group.name }}</span>
                  <span>&nbsp;</span>
                  <span class="count">{{ group.parameters.length }}</span>
                </v-layout>
              </div>
              <!--Editing group name field-->
              <div
                v-show="group.isEditGroup"
                class="divider-input"
              >
                <input
                  :value="group.name"
                  type="text"
                  placeholder="Untitled group name"
                  ref="group"
                  @blur="saveGroup($event, index)"
                  @keyup.enter="saveGroup($event, index)"
                >
              </div>
            </h2>
            <!--Group control block buttons-->
            <div
              class="tools"
              :class="{'tools--active': !group.name}"
            >
              <v-layout
                v-if="group.name && group.parameters.length"
                tag="ul"
                class="tools_list"
                align-center
                justify-center
                fill-height
              >
                <!--Collapse group btn-->
                <v-flex
                  tag="li"
                  @click="toggleGroup(index, group.isCollapsed)"
                >
                  <v-layout
                    tag="a"
                    class="collapse"
                    align-center
                    justify-center
                    fill-height
                  >
                    <img v-if="!group.isCollapsed" :src="collapseIcon" alt="collapse group">
                    <img v-else :src="unCollapseIcon" alt="collapse group">
                  </v-layout>
                </v-flex>
                <!--Move group down btn-->
                <v-flex
                  tag="li"
                  v-if="(index + 1) !== parameters.length"
                  @click="changeGroupPosition(index, index + 1)"
                >
                  <v-layout
                    tag="a"
                    class="collapse"
                    align-center
                    justify-center
                    fill-height
                  >
                    <img :src="moveDownIcon" alt="move down group">
                  </v-layout>
                </v-flex>
                <!--Move group up btn-->
                <v-flex
                  tag="li"
                  v-if="index !== 0 && checkDefaultGroupPosition(index - 1)"
                  @click="changeGroupPosition(index, index - 1)"
                >
                  <v-layout
                    tag="a"
                    class="collapse"
                    align-center
                    justify-center
                    fill-height
                  >
                    <img :src="moveUpIcon" alt="move up group">
                  </v-layout>
                </v-flex>
                <!--Delete group btn-->
                <v-flex
                  tag="li"
                  @click="deleteGroup(index)"
                >
                  <v-layout
                    tag="a"
                    class="collapse"
                    align-center
                    justify-center
                    fill-height
                  >
                    <img :src="deleteGroupIcon" alt="delete group">
                  </v-layout>
                </v-flex>
              </v-layout>
              <!--Delete empty group btn-->
              <v-layout
                v-else
                tag="a"
                class="non-active-group"
                :class="{'empty_icon': !group.name}"
                align-center
                justify-center
                fill-height
                @click="deleteGroup(index)"
              >
                <img :src="deleteGroupIcon" alt="delete group">
              </v-layout>
            </div>
          </div>
        </parameter-section>
      </div>

      <!--Show image if there is no existing group/parameter-->
      <v-layout
        v-else
        align-center
        justify-center
        column
        fill-height
        class="app-container--empty"
      >
        <br>
        <img
          :src="emptyParamsIcon"
          alt="Empty list"
          class="empty_icon"
        >
        <br>
        <h2 v-html="$message.emptyList.parameter"></h2>
      </v-layout>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { map, forOwn } from 'lodash';

import emptyParamsIcon from '@/assets/svg/parameters/parameter-image.svg';
import deleteGroupIcon from '@/assets/svg/parameters/delete-group-only.svg';
import moveUpIcon from '@/assets/svg/parameters/move-up-group.svg';
import moveDownIcon from '@/assets/svg/parameters/move-down-group.svg';
import collapseIcon from '@/assets/svg/parameters/collapse-group.svg';
import unCollapseIcon from '@/assets/svg/parameters/uncollapse-group.svg';
import moveIcon from '@/assets/svg/parameters/move-to-group.svg';
import ParametersDrawer from '../ParametersDrawer/index';
import ParameterSection from '../ParameterSection/index';
import TypeBar from '../TypeBar/index';

export default {
  name: 'ParametersContent',

  components: {
    ParameterSection,
    ParametersDrawer,
    TypeBar,
  },

  data() {
    return {
      appId: this.$route.params.id,
      drag: false,
      selectedParamId: null,
      selectedParamPosition: null,
      selectedParamType: null,
      selectedGroupId: null,
      paramDrawerVisible: false,
      isGroupControl: false,
      selectedList: {},
      offsetLeft: 0,
      offsetRight: 0,
      emptyParamsIcon,
      deleteGroupIcon,
      moveUpIcon,
      moveDownIcon,
      collapseIcon,
      unCollapseIcon,
      moveIcon,
      drawerSubtitle: 'update parameter',
    };
  },

  computed: {
    ...mapState({
      parameters: state => state.parameters.parameterData,
      paramTypes: state => state.parameters.paramTypes,
    }),

    // List of existing group names
    groupList() {
      return map(this.parameters, item => {
        return {
          _id: item._id,
          name: item.name,
        };
      });
    },

    // Calculate group bar position
    groupPosition() {
      const menuMargin = '2rem';
      return `calc(${this.offsetRight}px + ${menuMargin})`;
    },

    // Show the block if we have custom groups or some parameter in default group
    showParameterBlock() {
      return this.$store.getters['parameters/getVisibilityState'];
    },
  },

  methods: {
    ...mapMutations('parameters', {
      updateParameter: 'updateParameter',
      changeGroupFlag: 'changeGroupFlag',
      deleteLocalGroup: 'deleteGroup',
      changeParametersPosition: 'changeParametersPosition',
      createParameterGroup: 'createParameterGroup',
      updatePrevParamData: 'updatePrevParamData',
    }),

    ...mapActions('parameters', {
      createGroup: 'createGroup',
      updateGroup: 'updateGroup',
      moveGroup: 'moveGroup',
      deleteGroupName: 'deleteGroup',
      deleteParameter: 'deleteParameter',
      moveParameter: 'moveParameter',
    }),

    // Create new parameters by selecting type in the drawer
    addParameter({ type, groupId, position }) {
      if (this.paramDrawerVisible) return;

      this.selectedGroupId = groupId || this.parameters[0]._id;
      this.selectedParamId = null;
      this.selectedParamPosition = position !== undefined ? position : null;
      this.selectedParamType = type;

      // Open drawer to update new parameter
      this.paramDrawerVisible = true;
      this.drawerSubtitle = 'create parameter';
    },

    // Edit existing parameter in the drawer
    editParameter(data) {
      if (this.paramDrawerVisible) return;

      this.selectedGroupId = data.groupId;
      this.selectedParamId = data.paramId;

      // Open drawer to update existing parameter
      this.paramDrawerVisible = true;
      this.drawerSubtitle = 'update parameter';
    },

    updateSelectedList(data) {
      this.isGroupControl = false;
      this.selectedList[data.groupId] = data.selectedParams;
      forOwn(this.selectedList, (param) => {
        if (param.length) this.isGroupControl = true;
      });
    },

    // Closing the drawers and clearing the selected parameter index
    closeDrawer() {
      this.paramDrawerVisible = false;
      this.selectedGroupId = null;
      this.selectedParamId = null;
      this.selectedParamPosition = null;
    },

    resizeWin() {
      this.offsetLeft = this.$refs.parametersPanel.offsetLeft;
      this.offsetRight = this.$refs.parametersPanel.offsetLeft + this.$refs.parametersPanel.offsetWidth;
    },

    toggleGroup(index, value) {
      this.updateGroup({
        index,
        appId: this.appId,
        groupId: this.parameters[index]._id,
        params: {
          isCollapsed: value,
        },
      });
    },

    // Move group up if there is not under default group
    checkDefaultGroupPosition(newIndex) {
      return !(this.parameters[newIndex] && this.parameters[newIndex].name === this.$constant.defaultGroupName);
    },

    // Move group click handler
    changeGroupPosition(index, newIndex) {
      this.moveGroup({
        appId: this.appId,
        groupId: this.parameters[index]._id,
        params: {
          position: newIndex,
        },
        indexes: {
          indexA: index,
          indexB: newIndex,
        },
      });
    },

    createNewGroup() {
      this.createParameterGroup();
      setTimeout(() => {
        this.$refs.group[this.$refs.group.length - 1].focus();
      }, 0);
    },

    focusGroup(index) {
      this.changeKey(index, 'isEditGroup');
      setTimeout(() => {
        this.$refs.group[index - 1].focus();
      }, 0);
    },

    // Create/Update group click handler
    saveGroup(event, index) {
      if (!this.parameters[index].isEditGroup) return; // prevent blur event if saved by Enter
      if (!event.target.value) {
        this.changeKey(index, 'isEditGroup'); // hide the edit input
        if (!this.parameters[index]._id) this.deleteLocalGroup({ index });
        return;
      }
      if (!this.parameters[index]._id) {
        this.createGroup({
          index,
          appId: this.appId,
          name: event.target.value,
        });
      } else if (this.parameters[index].name !== event.target.value) {
        this.updateGroup({
          index,
          appId: this.appId,
          groupId: this.parameters[index]._id,
          params: {
            name: event.target.value,
          },
        });
      } else {
        this.changeKey(index, 'isEditGroup'); // hide the edit input
      }
    },

    // Delete group click handler
    deleteGroup(index) {
      if (this.parameters[index]._id) {
        const defaultGroup = this.parameters.find(group => group.name === this.$constant.defaultGroupName);
        const params = {
          index,
          appId: this.appId,
          groupId: this.parameters[index]._id,
        };
        if (defaultGroup) params.defaultGroupId = defaultGroup._id;
        this.deleteGroupName(params);
      } else {
        this.deleteLocalGroup({ index });
      }
    },

    changeKey(index, key) {
      this.changeGroupFlag({
        key,
        index,
      });
    },

    // Delete parameter click handler
    deleteParams() {
      // Generate parameter object with a list of selected parameters
      const params = {
        parameterMap: {},
      };
      forOwn(this.selectedList, (param, groupId) => {
        if (param.length) params.parameterMap[groupId] = param;
      });

      // Sending delete request to the server
      this.deleteParameter({
        appId: this.appId,
        params,
      }).then(() => {
        this.$refs.parameter.forEach((parameter) => {
          parameter.cleanSelectedList();
          this.cleanSelectedList();
        });
      });
    },

    // Move parameters click handler
    changeParamPosition(recipientGroup) {
      // saving prev state of params to use rollback in case of error
      this.updatePrevParamData();
      // Generate parameter object with a list of selected parameters
      const params = {
        parameterMap: {},
      };
      forOwn(this.selectedList, (param, groupId) => {
        if (param.length) params.parameterMap[groupId] = param;
      });

      // Sending request to the server
      const details = {
        appId: this.appId,
        recipientGroup,
        params,
      };
      this.moveParameter(details)
        .then(() => {
          this.changeParametersPosition(details);
          this.$refs.parameter.forEach((parameter) => {
            parameter.cleanSelectedList();
            this.cleanSelectedList();
          });
        });
    },

    cleanSelectedList() {
      this.selectedList = {};
      this.isGroupControl = false;
    },
  },

  mounted() {
    this.resizeWin();
  },

  created() {
    window.addEventListener('resize', this.resizeWin);
  },

  destroyed() {
    window.removeEventListener('resize', this.resizeWin);
  },

};
</script>

<style scoped lang="scss">
  $btn_indent: 0.57rem;

  .empty_icon {
    opacity: 0.3;
  }
  .non-active-group {
    margin-top: 0.18rem;
  }

  // Button list
  #app .group_controller .v-btn {
    box-shadow: none;
  }

  .group_controller {
    box-shadow: 2px 2px 6px -2px var(--theme-background-grey);
    position: absolute;
    display: none;
    border: solid 1px var(--theme-border-light);
    button.v-btn {
      border-radius: 0;
      min-width: auto;
      width: 2.5rem;
      padding: $btn_indent;
      margin: 0;
      color: var(--theme-secondary);
      font-size: 1.2rem;
      &:not(.v-btn--text):not(.v-btn--depressed) {
        box-shadow: none;
      }
    }

    .group_divider {
      border-bottom: solid 1px var(--theme-border-light);
    }
  }

  .group_controller--open {
    display: flex;
  }

  .group_menu .v-list-item__title {
    font-size: 0.75rem;
    font-weight: 600;
    &.default {
      opacity: 0.5;
    }
  }

  .menu_icon {
    width: 1rem;
  }
</style>

<style lang="scss">
  // Parameter group view
  .divider {
    position: relative;
    margin: 1.18rem 0;
    &:hover {
      .checker,
      .tools {
        opacity: 1;
      }
    }
    &:after {
      content: "";
      width: 100%;
      height: 1px;
      background: $parameter-border-color;
      position: absolute;
      top: 0;
      left: 0;
      margin: .82rem 0 0;
    }
    .tools {
      position: absolute;
      top: 0;
      right: 0;
      padding: 0 0 0 .625rem;
      z-index: 1;
      opacity: 0;
      transition: opacity .2s ease;
      background-color: var(--theme-background);
    }
    .tools--active {
      opacity: 1;
    }
    .tools_list {
      box-shadow: 0 1px 1px 0 var(--theme-background-grey);
      background-color: var(--theme-background-light);
      list-style: none;
      padding-left: 0;
      > li {
        transition: opacity .2s ease;
        width: 1.56rem;
        height: 1.875rem;
        border-right: 1px solid rgba(27,13,63,.1);
        &:last-child {
          border: none;
        }
      }
    }
    h2 {
      display: inline-block;
      font-size: 1rem;
      vertical-align: middle;
      padding: 0 .5rem;
      margin-left: 1.9rem;
      line-height: normal;
      color: var(--theme-secondary);
      position: relative;
      z-index: 1;
      background-color: var(--theme-background);
      .count {
        position: relative;
        border: 1px solid var(--theme-secondary);
        color: var(--theme-secondary);
        font-size: .875rem;
        border-radius: 1.25rem;
        padding: .125rem .625rem;
        margin-left: .31rem;
      }
      input {
        padding: 0 .5rem;
        border-radius: .25rem;
        width: 15rem;
        height: 2.5rem;
        box-shadow: inset 0 3px 4px 0 rgba(0,0,0,.1);
        border: solid 1px rgba(27,13,63,.1);
        background-color: var(--theme-background-light);
        font-size: 1rem;
        font-weight: 500;
        outline: none;
        position: relative;
      }
    }
  }
</style>
