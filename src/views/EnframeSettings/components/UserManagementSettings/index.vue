<!--User management settings page-->

<template>
  <v-layout column>
    <edit-user-modal
      @close="closeModal"
      :showModal="editUserVisible"
      :userData="userData"
      :isEdit="isEdit"
    />
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
          v-html="$message.setting.userManagement.deleteDialogText"
        />
      </v-layout>
    </opex-dialog>
    <v-layout>
      <v-layout class="setting-form-container" column>
        <h4 class="settings-header">{{ $message.setting.userManagement.header }}</h4>
        <h5 class="settings-subheader">{{ $message.setting.userManagement.subheader }}</h5>
      </v-layout>
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
          class="add-user"
          color="secondary"
          @click="setUserForEdit()"
        >
          create user
        </v-btn>
      </v-layout>
    </v-layout>

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
      <v-layout column>
        <v-layout column class="table-container">
          <v-layout class="table-row">
            <v-checkbox class="column-data column-data-5"
              v-model="selectAll"
              :value="selectAll"
              @change="selectChange(true)"
            />
            <div class="column-data column-data-30">
              <span class="opex-label">User Details</span>
            </div>
            <div class="column-data">
              <span class="opex-label">User Type</span>
            </div>
            <div class="column-data column-data-30">
              <span class="opex-label">Role Type</span>
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
              >
                delete ({{ selectedCount }})
              </v-btn>
            </div>
          </v-layout>
        </v-layout>

        <v-divider/>

        <v-layout
          v-for="(user, index) in users"
          :key="index"
          column
          class="table-container"
        >
          <v-layout
            class="table-row user-row"
            :class="{'user-row-highlited': user.selected || user.isEditing || user.moreMenu}"
          >
            <v-checkbox class="column-data column-data-5"
              v-model="user.selected"
              :value="user.selected"
              @change="selectChange(false)"
              :disabled="!user.isDeleteable"
            />
            <v-layout column class="column-data column-data-30">
              <span>
                {{ `${user.firstName} ${user.lastName}` }}
              </span>
              <span class="column-data-small">
                <span v-if="user
                  && user.attributes
                  && user.attributes.lastlogin
                  && user.attributes.lastlogin[0]
                  && user.attributes.lastlogin[0] !== 'unix timestamp'"
                >
                  Last login : {{ formatDate(user.attributes.lastlogin[0]) }}
                </span>
                <span v-else>
                    {{ $message.setting.userManagement.lastLoginYetToSignIn }}
                </span>
              </span>
            </v-layout>
            <span class="column-data">
              <span v-if="user.attributes && user.attributes.type && user.attributes.type[0]">
                {{ user.attributes.type[0] }}
              </span>
            </span>
            <span class="column-data column-data-40">
              {{ user.role.name }}
            </span>

            <!--      menu button        -->
            <v-menu
              v-model="user.moreMenu"
              offset-y
              transition="slide-y-transition"
            >
              <template #activator="{ on }">
                <!--       Menu Icon       -->
                <div v-on="on" class="menu-btn column-data column-data-5">
                  <opex-icon name="v2-more"/>
                </div>
              </template>

              <!--       Menu Body       -->
              <v-list>
                <v-list-item
                  class="menu-item"
                >
                  <v-list-item-title @click="setUserForEdit(index)" class="cursor-pointer">
                    Edit
                  </v-list-item-title>
                </v-list-item>

                <v-list-item
                  @click="showDeleteUserPopup(index)"
                  v-if="user.isDeleteable">
                  <v-list-item-title>
                    Delete
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <opex-popup
              left
              :ref="`delete-user-${index}`"
              :title="$message.setting.userManagement.deleteUsersTitle"
              :message="$message.setting.userManagement.deleteUsersMessage"
              :button-name="$message.setting.userManagement.deleteUsersButtonName"
              :confirmMain="false"
              icon="v2-delete-1"
              @confirm="removeUsers([user.id])"
              @close="userIsEditing(user.id, false)"
            />
          </v-layout>

          <v-divider/>
        </v-layout>
      </v-layout>
    </template>

    <v-layout
      class="pagination-container"
      justify-end
      v-if="users.length && userCountMoreThenTen"
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
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { debounce, cloneDeep } from 'lodash';
import moment from 'moment';

import OpexToggle from '@/components/OpexToggle';
import EditUserModal from './components/EditUserModal';

export default {
  name: 'UserManagementSettings',
  components: { OpexToggle, EditUserModal },

  data() {
    return {
      loading: true,
      userData: {},
      isEdit: false,
      selectAll: false,
      selectedCount: 0,
      filter: '',
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
      page: 1,
      userOffset: 0,
      editUserVisible: false,
      deleteDialogVisible: false,
      users: {},
      paginationLength: 0,
      filterCount: 0,
    };
  },

  computed: {
    ...mapState({
      roles: state => state.settings.userManagement.roles,
      userCount: state => state.settings.userManagement.userCount,
      userLimit: state => state.settings.userManagement.userLimit,
      currentUserEmail: state => state.user.userInfo.email,
    }),
    viewValue: {
      get() {
        return this.$store.state.settings.userManagement.viewValue;
      },
      set(value) {
        this.setViewValue(value);
      },
    },
    lastUser() {
      const testValue = this.userOffset + this.userLimit;
      return testValue > this.displayCount ? this.displayCount : testValue;
    },
    firstUser() {
      return this.userOffset + 1;
    },
    userCountMoreThenTen() {
      return this.displayCount > 10;
    },
    displayCount() {
      return this.filter && this.filter !== '' ? this.filterCount : this.userCount;
    },
  },

  methods: {
    ...mapActions('settings', {
      getUsers: 'getUsers',
      getRoles: 'getRoles',
      deleteUsers: 'deleteUsers',
    }),
    ...mapMutations('settings', {
      setUserLimit: 'setUserLimit',
      setViewValue: 'setViewValue',
      setUserCount: 'setUserCount',
    }),
    userIsEditing(id, val) {
      const index = this.users.findIndex(user => user.id === id);
      this.users[index].isEditing = val;
    },
    setUserForEdit(index) {
      if (typeof index !== 'undefined') {
        this.isEdit = true;
        this.userData = cloneDeep(this.users[index]);
        this.userData.type = this.userData.attributes.type[0].slice(0);
        this.userData.role = this.userData.role.name;
        this.users[index].isEditing = true;
      } else {
        this.userData = { type: 'SSO' };
        this.isEdit = false;
      }
      this.editUserVisible = true;
    },
    deleteDialogShow() {
      this.deleteDialogVisible = true;
    },
    async removeUsers(idArr) {
      if (!idArr) {
        idArr = this.users
          .filter(user => user.selected)
          .map(user => user.id);
      }
      this.deleteDialogVisible = false;
      await this.deleteUsers(idArr);
      await this.loadUsers();
      this.selectChange();
    },
    cancelRemoveUsers() {
      this.deleteDialogVisible = false;
    },
    // eslint-disable-next-line func-names
    searchUsers: debounce(function (val) {
      this.filter = val;
      this.loadUsers(1);
    }, 500),
    closeModal() {
      this.editUserVisible = false;
      this.updateUsers();
    },
    showDeleteUserPopup(index) {
      // Changing popup visibility directly, activator slot approach doesn't work for the popup in menu
      this.$refs[`delete-user-${index}`][0].isVisible = true;
      this.users[index].isEditing = true;
    },
    formatDate(date) {
      return moment(date).format('h.mm a | MMMM Do YYYY');
    },
    selectChange(isSelectAll) {
      const selectAll = !!this.selectAll;
      let selectedCount = 0;
      let allSelected = true;
      this.users.forEach(user => {
        if (isSelectAll && user.isDeleteable) {
          user.selected = selectAll;
          if (selectAll) selectedCount += 1;
        } else if (user.selected) {
          selectedCount += 1;
        } else {
          allSelected = false;
        }
      });
      this.selectAll = allSelected;
      this.selectedCount = selectedCount;
    },
    async loadUsers(page) {
      this.loading = true;
      this.selectAll = false;
      this.selectedCount = 0;
      if (page) this.page = page;
      this.setPaginationLength();
      const viewValue = parseInt(this.viewValue, 10);
      await this.setUserLimit(viewValue);
      this.userOffset = (this.page - 1) * viewValue;
      this.filterCount = await this.getUsers({
        limit: this.userLimit,
        offset: this.userOffset + 1,
        search: this.filter,
      });
      this.setPaginationLength();
      this.updateUsers();
      this.loading = false;
    },
    updateUsers() {
      this.users = cloneDeep(this.$store.state.settings.userManagement.users)
        .map(user => {
          user.isEditing = false;
          user.isDeleteable = this.currentUserEmail !== user.email;
          return user;
        });
    },
    setPaginationLength() {
      this.paginationLength = Math.ceil(this.displayCount / parseInt(this.viewValue, 10));
    },
  },

  created() {
    // Initialising the form model
    this.setPaginationLength();
    this.loadUsers();
    this.getRoles();
  },
};
</script>

<style scoped lang="scss">
  .tables-skeleton-container {
    width: 22rem;
    background-color: var(--theme-background-light);

    .table-skeleton-title {
      margin: 1rem;
      font-size: 1.6rem;
      font-weight: 700;
      line-height: 1.3;
    }
  }
  .no-results-container {
    height: 4rem;
    .no-results {
      margin: auto;
      opacity: 0.2;
    }
  }
  .user-search-add {
    margin-top: 1.1rem;
    width: 14rem;
    height: 3.5rem;
  }
  .table-container {
    box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
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
      i {
        cursor: pointer;
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
  }
  .user-row:hover, .user-row-highlited {
    background-color: rgba(var(--theme-secondary-rgb), 0.06);
  }
  .pagination-container {
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
    margin: 1rem !important;
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

<style lang="scss">
  .user-search {
    width: 18.5rem;
    height: 3rem;
    margin: 1rem 0rem !important;
    .v-input {
      padding: 0rem !important;
      height: 3rem;
    }
    .v-input__slot {
      margin: 0rem !important;
      height: 3rem;
      border-color: var(--theme-border-grey) !important;
    }
    .v-input__control {
      height: 3rem;
    }
  }
  .delete-users-body b {
    color: var(--theme-error);
  }
  .pagination-container {
    .radio_container {
      margin: 0rem;
      label {
        padding: 0rem 1rem 0rem 0rem;
        background-color: transparent;
        border: none;
        box-shadow: none;
        color: var(--theme-text);
        font-weight: 700;
      }
      input:checked + label, label:hover {
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
        color: var(--theme-secondary) !important;
        text-decoration: underline;
      }
    }
    .v-pagination {
      margin: 0rem 1rem 0rem 0rem;
      width: auto;
      li {
        button {
          border: none !important;
          box-shadow: none !important;
          height: 2rem;
          margin: 0rem 0rem !important;
          padding: 0rem !important;
          font-size: 0.9rem !important;
          .v-icon {
            font-size: 1rem !important;
          }
          outline: none;
        }
        .v-pagination__item {
          min-width: 2rem;
        }
        .v-pagination__navigation {
          width: 2rem;
        }
      }
    }
  }
</style>
