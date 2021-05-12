<!--Add admin user form in the drawer on the Enframe Admin page-->

<template>
  <div>
    <v-form
      class="drawer-form edit-app-details"
      v-model="formValid"
    >
      <!--List of existing users-->
      <v-autocomplete
        v-if="nonUserList"
        color="secondary"
        v-model="currentUser"
        :items="nonUserList"
        :label="$message.userList.addEditUserTitle(actionType)"
        :placeholder="$message.userList.userAutocompletePlaceholder"
        return-object
        required
        @update:search-input="filterUsers"
        :filter="filterReplacer"
        :disabled="isEdit"
        @change="userSelected"
      >
        <template #selection="data">
          <span class="autocomplete_item--selected">
            {{ `${data.item.firstName} ${data.item.lastName}` }}
          </span>
        </template>
        <template #item="data">
          <v-layout class="autocomplite_item">
            <v-list-item-content v-observe-visibility="visibilityChanged">
              <v-list-item-title v-html="`${data.item.firstName} ${data.item.lastName}`"></v-list-item-title>
              <v-list-item-subtitle v-html="data.item.role.name"></v-list-item-subtitle>
            </v-list-item-content>
          </v-layout>
        </template>
      </v-autocomplete>

      <!--List of existing roles-->
      <v-autocomplete
        color="secondary"
        v-model="currentUserRole"
        :items="$constant.accessTypes"
        :label="$message.userList.rolesAutocompleteLabel"
        :placeholder="$message.userList.rolesAutocompletePlaceholder"
        :disabled="disableRoleSelect"
        return-object
        required
      >
        <template #selection="data">
          <span class="autocomplete_item--selected">
            {{ data.item.name }}
          </span>
        </template>
        <template #item="data">
          <v-layout class="autocomplite_item">
            <v-list-item-content v-observe-visibility="visibilityChanged">
              <v-list-item-title v-html="data.item.name"></v-list-item-title>
              <v-list-item-subtitle v-html="data.item.description"></v-list-item-subtitle>
            </v-list-item-content>
          </v-layout>
        </template>
      </v-autocomplete>

      <!--Buttons-->
      <v-divider/>
      <v-layout justify-end>
        <v-btn
          color="secondary"
          small
          :disabled="!formValid"
          @click="confirm"
        >
          {{ actionType }}
        </v-btn>

        <v-btn
          text
          small
          color="primary"
          @click="$emit('close')"
        >
          cancel
        </v-btn>
      </v-layout>
      <v-divider/>
    </v-form>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { debounce, difference, cloneDeep } from 'lodash';

export default {
  name: 'EditAdmin',

  data() {
    return {
      formValid: false,
      disableRoleSelect: false,
      loading: true,
      currentUser: null,
      currentUserRole: null,
      filter: '',
      rolesList: [
        {
          scopes: ['read'],
          name: 'View Access',
          description: 'View only access to the app',
        },
        {
          scopes: ['read', 'delete', 'update', 'create'],
          name: 'Edit Access',
          description: 'Complete access to app to edit',
        },
      ],
    };
  },
  props: {
    isEdit: Boolean,
    isListFull: Boolean,
    actionType: String,
    userData: {
      type: Object,
    },
  },

  methods: {
    ...mapActions('applicationList', {
      getUsers: 'getUsers',
      addUser: 'addUser',
      editUser: 'editUser',
    }),

    ...mapMutations({
      updateNonUserList: 'applicationList/updateNonUserList',
    }),

    userSelected() {
      this.disableRoleSelect = this.currentUser && this.currentUser.role.name === this.$constant.userRoles.appViewer;
      if (this.disableRoleSelect) {
        this.currentUserRole = cloneDeep(this.rolesList[0]);
      }
    },

    // Add button click handler
    async confirm() {
      if (this.isEdit) {
        await this.editUser({
          userId: this.currentUser.id,
          scopes: this.currentUserRole.scopes,
          appId: this.$route.params.id,
        });
      } else {
        await this.addUser({
          userId: this.currentUser.id,
          scopes: this.currentUserRole.scopes,
          appId: this.$route.params.id,
          isListFull: this.isListFull,
        });
      }
      this.$emit('updateUsers');
      this.$emit('close');
    },
    visibilityChanged(isVisible, entry) {
      const lastUser = this.nonUserList[this.nonUserList.length - 1];
      const lastUserText = `${lastUser.firstName} ${lastUser.lastName}`;
      const isLastUser = entry.target.innerText.includes(lastUserText);
      if (isLastUser && isVisible && !this.loading) {
        this.userListScroll();
      }
    },
    userListScroll() {
      this.loadUsers({
        first: this.nonUserList.length + 1,
        max: 10,
      });
    },
    // load list of users on filter change from server
    filterUsers(filter) {
      this.filter = filter;
      if (this.filter !== null) this.loadUsers({ first: 1, max: 10 });
    },
    // list of users is already filtered on server side.
    // It's not possible to have no filter for autocomlete.
    // So returning all list without check
    filterReplacer() {
      return true;
    },
    // eslint-disable-next-line
    loadUsers: debounce(function (options) {
      this.getUsers({
        first: options.first,
        max: options.max,
        id: this.appId,
        search: this.filter,
        shared: false,
      }).then(() => {
        this.loading = false;
      }).catch(error => {
        this.showSnackbar({
          type: this.$constant.snackbarTypes.error,
          title: this.$message.applicationList.userList,
          message: error.response.data.message,
        });
      });
    }, 300),
  },

  computed: {
    ...mapState({
      nonUserList: state => state.applicationList.nonUserList,
    }),
  },

  mounted() {
    this.appId = this.$route.params.id;
    if (this.isEdit) {
      this.updateNonUserList([this.userData]);
      this.currentUser = this.userData;
      this.currentUserRole = this.$constant.accessTypes.find(role => {
        return !difference(role.scopes, this.currentUser.scopes).length
          && role.scopes.length === this.currentUser.scopes.length;
      });
    } else {
    // Fetching list of users from the server
      this.loadUsers({
        first: 1,
        max: 10,
      });
    }
  },
};
</script>

<style scoped>
  .autocomplite_item {
    background-color: var(--theme-background-light);
  }
</style>
