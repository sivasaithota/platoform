<!--Admins Enframe page component-->

<template>
  <div class="position-relative">
    <!--Drawer with form to edit app details-->
    <opex-drawer
      v-model="drawerVisible"
      :title="$message.userList.addEditUserTitle(drawerActionType)"
      icon="v2-enframe-admins"
    >
      <edit-admin
        :userData="currentUser"
        :isEdit="drawerIsEdit"
        :actionType="drawerActionType"
        :isListFull="isListFull"
        v-if="drawerVisible"
        @updateUsers="loadUsers"
        @close="drawerClosed"
      />
    </opex-drawer>
    <opex-dialog
      v-model="deleteDialogVisible"
      :title="$message.setting.userManagement.deleteDialogTitle"
      :confirm-text="$message.setting.userManagement.deleteDialogConfirmText"
      confirm-color="primary"
      cancel-color="secondary"
      :is-cancel-flat="false"
      @confirm="removeUsers"
      @cancel="cancelRemoveUsers"
    >
      <v-layout
        class="delete-users-body"
        column
      >
        <h3
          v-if="deleteDialogVisible"
          class="delete-users-count"
        >
          {{ selectedCount }} users found
        </h3>
        <div
          v-if="deleteDialogVisible"
          v-html="$message.userList.deleteDialogText"
        />
      </v-layout>
    </opex-dialog>

    <!--Layout with info for the not deployed apps-->
    <v-layout
      v-if="appInProgress"
      column
      align-center
      class="app-content schedule-not-deployed-app"
    >
      <img
        class="not-deployed-image"
        src="@/assets/svg/rocket.svg"
        alt="rocket"
      />

      <h3 class="not-deployed-title">{{ $message.schedules.appNotDeployedTitle }}</h3>
      <p class="not-deployed-message">{{ $message.userList.appNotDeployedMessage }}</p>

      <router-link
        to="app-deployment"
        class="not-deployed-link"
      >
        {{ $message.schedules.appNotDeployedLink }}
      </router-link>
    </v-layout>
    <section
      v-else
      class="app-content app-content--full"
    >
      <v-layout
        class="app-content-header"
        row
        align-center
        justify-space-between
      >
        <h3>
          {{ $route.name }}
        </h3>

        <v-layout class="user-search-add"
          justify-end
        >
          <opex-input
            :value="filter"
            :v-model="filter"
            class="user-search"
            :placeholder="$message.setting.userManagement.searchPlaceholder"
            @input="searchUsers"
            icon="v2-search"
            icon-color="support"
          />
          <v-btn
            color="secondary"
            @click="addUser"
            class="add-user"
            :disabled="!appActive"
          >
            Add User
          </v-btn>
        </v-layout>
      </v-layout>
      <v-layout column>
        <v-layout class="table-row">
          <v-checkbox class="column-data column-data-5"
            v-model="selectAll"
            :value="selectAll"
            @change="selectChange(true)"
            :disabled="!appActive"
          />
          <div class="column-data column-data-30">
            <span class="opex-label">User Details</span>
          </div>
          <div class="column-data">
            <span class="opex-label">Role Type</span>
          </div>
          <div class="column-data column-data-30">
            <span class="opex-label">Access Type</span>
          </div>
          <div
            class="column-data-15"
            justify-end
          >
            <v-btn
              v-if="selectedCount"
              small
              class="delete-btn"
              color="secondary"
              @click="deleteDialogVisible = true"
              :disabled="!appActive"
            >
              delete ({{ selectedCount }})
            </v-btn>
          </div>
        </v-layout>

        <v-divider/>

        <!--Skeleton loader placeholder when loading users-->

        <template v-if="loading">
          <v-skeleton-loader
            v-for="n in 10"
            :key="n"
            class="card-skeleton tables-skeleton"
            type="list-item-two-line"
          />
        </template>

        <template v-else>
          <v-layout
            v-for="(user, index) in users"
            :key="index"
            column
          >
            <v-layout
              class="table-row user-row"
              :class="{'user-row-highlited': user.selected || user.isEditing}"
            >
              <v-checkbox class="column-data column-data-5"
                v-model="user.selected"
                :value="user.selected"
                @change="selectChange(false)"
                :disabled="!user.editable || !appActive"
              />
              <v-layout column class="column-data column-data-30">
                <span>
                  {{ `${user.firstName} ${user.lastName}` }}
                </span>
              </v-layout>
              <span class="column-data">
                {{ user.role.name }}
              </span>
              <span class="column-data column-data-40">
                <edit-access-type
                  :has-edit-access="user.hasEditAccess"
                  :user-id="user.id"
                  :default-scopes="user.scopes"
                  :disabled="!user.editable || user.isAppViewer || !appActive"
                  @updateUsers="updateUsers"
                  @editing="userIsEditing"
                />
              </span>

              <div class="delete-button">
                <opex-tooltip
                  bottom
                  :message="$message.userList.deleteUserTooltip"
                >
                  <template #activator>
                    <v-btn
                      fab
                      color="secondary"
                      :class="{'disabled': !user.editable || !appActive}"
                      @click="showDeleteUserPopup(index)"
                    >
                      <opex-icon name="v2-delete-1"/>
                    </v-btn>
                  </template>
                </opex-tooltip>
              </div>

              <opex-popup
                left
                :ref="`delete-user-${index}`"
                :title="$message.setting.userManagement.deleteUsersTitle"
                :message="$message.setting.userManagement.deleteUsersMessage"
                :button-name="$message.setting.userManagement.deleteUsersButtonName"
                :confirmMain="false"
                icon="v2-delete-1"
                @confirm="removeUsers([user.id])"
              />
            </v-layout>

            <v-divider/>
          </v-layout>
        </template>
      </v-layout>

      <v-layout
        class="pagination-container"
        v-if="users.length && userCountMoreThenTen"
        justify-end
      >
        <v-layout
          class="pagination-views"
          justify-start
          align-start
        >
          <span class="pagination-description pagination-description-1">
            View
          </span>
          <!--Toogle-->
          <opex-toggle
            class="radio_box"
            v-model="viewValue"
            :radio-items="viewItems"
            item-value="value"
            item-text="text"
            @input="loadUsers(1)"
          />

        </v-layout>
        <v-layout
          justify-space-between
        >
          <span class="pagination-description pagination-description-2">
            Showing results  {{ firstUser }} - {{ lastUser }} of {{ displayCount }}
          </span>
          <v-pagination
            v-model="page"
            :page="page"
            :length="paginationLength"
            :total-visible="7"
            color="secondary"
            @input="loadUsers"
          />
        </v-layout>
      </v-layout>
      <v-layout
        v-if="!users.length"
        class="no-results-container"
      >
        <h4 class="no-results">No results found for ‘{{ filter }}’</h4>
      </v-layout>
    </section>

  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { debounce, cloneDeep } from 'lodash';
import moment from 'moment';

import OpexToggle from '@/components/OpexToggle';
import EditAdmin from './components/EditAdminDrawer/index';
import EditAccessType from './components/EditAccessType';

export default {
  name: 'AppSharing',

  components: { EditAdmin, EditAccessType, OpexToggle },

  data() {
    return {
      isEdit: false,
      selectAll: false,
      selectedCount: 0,
      currentUser: {},
      drawerIsEdit: false,
      viewUsers: [],
      filter: '',
      filterCount: 0,
      viewItems: [
        {
          value: '10',
          text: '10',
        },
        {
          value: '20',
          text: '20',
        },
        {
          value: '40',
          text: '40',
        },
      ],
      viewValue: '10',
      page: 1,
      userOffset: 0,
      users: [],
      loading: true,
      drawerVisible: false,
      userCount: 0,
      userLimit: 0,
      paginationLength: 1,
      deleteDialogVisible: false,
    };
  },

  methods: {
    ...mapActions('applicationList', {
      getUsers: 'getUsers',
      deleteUsers: 'deleteUsers',
      getUserCount: 'getUserCount',
    }),
    ...mapMutations({
      updateAdminList: 'applicationList/updateAdminList',
    }),
    async removeUsers(idArr) {
      if (!idArr) {
        idArr = this.users
          .filter(user => user.selected)
          .map(user => user.id);
      }
      this.deleteDialogVisible = false;
      await this.deleteUsers({
        userIds: idArr,
        appId: this.appId,
      });
      await this.loadUsers();
      this.updateUsers();
      this.selectChange();
    },
    cancelRemoveUsers() {
      this.deleteDialogVisible = false;
    },
    showDeleteUserPopup(index) {
      // Changing popup visibility directly, activator slot approach doesn't work for the popup in menu
      if (this.users[index].editable && this.appActive) this.$refs[`delete-user-${index}`][0].isVisible = true;
    },
    addUser() {
      if (this.drawerVisible) return;
      this.drawerIsEdit = false;
      this.drawerVisible = true;
    },
    // eslint-disable-next-line func-names
    searchUsers: debounce(function (val) {
      this.filter = val;
      this.loadUsers(1);
    }, 500),
    setPaginationLength() {
      this.paginationLength = Math.ceil(this.displayCount / parseInt(this.viewValue, 10));
    },
    async loadUsers(page) {
      this.loading = true;
      this.selectAll = false;
      this.selectedCount = 0;
      if (page) this.page = page;
      this.setPaginationLength();
      await this.updateUserLimit();
      this.filterCount = await this.getUsers({
        first: this.userOffset + 1,
        max: this.userLimit,
        id: this.appId,
        search: this.filter,
        shared: true,
      });
      this.setPaginationLength();
      this.updateUsers();
      this.loading = false;
    },
    async updateUserLimit() {
      const viewValue = parseInt(this.viewValue, 10);
      this.userOffset = (this.page - 1) * viewValue;
      this.userLimit = viewValue;
    },
    updateUsers() {
      this.users = cloneDeep(this.$store.state.applicationList.userList)
        .map(user => {
          Object.assign(user, {
            hasEditAccess: user.scopes.length > 1 || user.scopes[0] !== 'read',
            editable: user.role.name === this.$constant.userRoles.appViewer || user.role.name === this.$constant.userRoles.appDeveloper,
            isAppViewer: user.role.name === this.$constant.userRoles.appViewer,
            isEditing: false,
          });
          return user;
        });
    },
    userIsEditing(id, val) {
      const index = this.users.findIndex(user => user.id === id);
      this.users[index].isEditing = val;
    },
    formatDate(date) {
      return moment(date).format('h.mm a | MMMM Do YYYY');
    },
    drawerClosed() {
      this.drawerVisible = false;
    },
    selectChange(isSelectAll) {
      const selectAll = !!this.selectAll;
      let selectedCount = 0;
      let allSelected = true;
      this.users.forEach(user => {
        if (user.editable) {
          if (isSelectAll) {
            user.selected = selectAll;
            if (selectAll) selectedCount += 1;
          } else if (user.selected) {
            selectedCount += 1;
          } else {
            allSelected = false;
          }
        }
      });
      if (selectedCount === 0) allSelected = false;
      this.selectAll = allSelected;
      this.selectedCount = selectedCount;
    },
  },

  computed: {
    ...mapState({
      userList: state => state.applicationList.userList,
      appStatus: state => state.application.status,
    }),
    appInProgress() {
      return this.appStatus === this.$constant.deployStatuses.inProgress;
    },
    appActive() {
      return this.appStatus === this.$constant.deployStatuses.active;
    },
    firstUser() {
      return this.userOffset + 1;
    },
    lastUser() {
      const testValue = this.userOffset + this.userLimit;
      return testValue > this.displayCount ? this.displayCount : testValue;
    },
    drawerActionType() {
      return this.drawerIsEdit ? 'edit' : 'add';
    },
    isListFull() {
      const viewValue = parseInt(this.viewValue, 10);
      return !this.displayCount < viewValue;
    },
    userCountMoreThenTen() {
      return this.displayCount > 10;
    },
    displayCount() {
      return this.filter && this.filter !== '' ? this.filterCount : this.userCount;
    },

  },

  mounted() {
    this.appId = this.$route.params.id;
    this.setPaginationLength();
    this.getUserCount(
      this.appId,
    ).then(result => {
      this.userCount = result;
      return this.loadUsers();
    }).catch(error => {
      this.showSnackbar({
        type: this.$constant.snackbarTypes.error,
        title: this.$message.userList.getUsersErrorTitle,
        message: error.response.data.message,
      });
    });
  },
};
</script>

<style scoped lang="scss">
  .delete-button {
    margin: auto;
    button.v-btn {
      span i {
        color: var(--theme-primary-text);
        font-size: .8rem !important;
        vertical-align: middle;
      }
    }
    .disabled {
      opacity: .3;
      pointer-events: none;
    }
  }
  .app-content {
    background-color: var(--theme-background);
  }
  .app-content-header {
    margin: 0rem 0rem 1rem 0rem;
  }
  .card-skeleton.tables-skeleton {
    width: 100%;
    background-color: var(--theme-background-light);
  }
  .no-results-container {
    height: 4rem;
    .no-results {
      margin: auto;
      opacity: 0.2;
    }
  }
  .opex-card .opex-tag {
    margin-right: 2.14rem;
  }
  h3 {
    margin-top: 1.1rem;
  }
  .user-search-add {
    margin-bottom: 1.1rem;
    width: 14rem;
    height: 3.5rem;
    .user-search {
      width: 18.5rem;
      height: 3rem;
    }
  }
  .table-row {
    // color: var(--theme-primary);
    background-color: var(--theme-background-primary);
    .column-data {
      width: 20%;
      font-weight: 500;
      padding-right: 1rem;
      padding: 1rem 1rem 1rem 0rem;
      margin: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .opex-label {
        color: var(--theme-secondary);
      }
    }
    .column-data-5 {
      width: 5%;
      padding: 1rem 1rem 1rem 1rem;
      margin: auto;
    }
    .column-data-30 {
      width: 30%;
    }
    .column-data-small {
      font-size: 0.8rem;
      opacity: 0.5;
    }
    .column-data-15 {
      width: 15%;
      .delete-btn {
        margin: 0.5rem 0rem 0rem 1.5rem;
      }
    }
    .column-data-40 {
      width: 40%;
    }
  }
  .user-row:hover, .user-row-highlited {
    background-color: rgba(var(--theme-secondary-rgb), 0.06);
  }
  .pagination-container {
    background-color: var(--theme-background-light);
    font-size: 0.9rem;
    padding: 1rem 0rem;
    .pagination-views {
      width: 45%;
      padding-left: 5%;
    }
    .pagination-description {
      margin: auto 0rem;
      white-space: nowrap;
    }
    .pagination-description-1 {
      margin-right: 1rem;
    }
    .pagination-description-2 {
      width: 25%;
    }
    .radio_box {
      margin: auto 0rem;
    }
  }
  .add-user-container {
    .opex-input, .opex-password {
      margin: 0rem 1rem;
    }
    .v-input--radio-group {
      margin: 0rem 1rem;
      .v-radio {
        width: 40%;
      }
    }
  }
  .add-user {
    padding: 0rem !important;
    margin: 1rem 0rem 1rem 1rem !important;
    width: 8.5rem !important;
    height: 3rem !important;
  }
  .delete-users-body {
    padding: 2rem 1.3rem;
    font-size: 1rem;
    font-weight: 500;
    .delete-users-count {
      color: var(--theme-secondary);
    }
  }
</style>
