<!-- Component to make inline editing of user access -->

<template>
  <v-menu
    v-model="editAccessTypeMenu"
    :close-on-content-click="false"
    bottom
    @input="updateData"
  >
    <template #activator="{ on }">
      <v-layout
        v-on="on"
        class="edit-access-type"
        justify-space-between
        align-center
      >
        <span
          class="user-access"
          :class="{'user-edit-access': hasEditAccess}"
        >
          {{ `${hasEditAccess ? 'EDIT' : 'VIEW'} ACCESS` }}
        </span>
        <span
          class="user-access-success"
          v-if="isSuccess"
        >
          <opex-icon name="success"/>
        </span>
      </v-layout>
    </template>

    <v-card class="popup-card" v-if="!disabled">
      <v-form v-model="formValid">
      <!--Inputs-->
        <opex-input
          :autocomplete-items="$constant.accessTypes"
          v-model="localData"
          item-text="name"
          :label="$message.userList.rolesAutocompleteLabel"
          :placeholder="$message.userList.rolesAutocompletePlaceholder"
          return-object
          required
        />
      </v-form>
    </v-card>
  </v-menu>
</template>

<script>

import { mapActions } from 'vuex';
import { cloneDeep } from 'lodash';

export default {
  name: 'EditAccessType',

  props: {
    hasEditAccess: Boolean,
    disabled: Boolean,
    userId: String,
    defaultScopes: Array,
  },

  data() {
    return {
      localData: {},
      formValid: true,
      loading: false,
      editAccessTypeMenu: false,
      isSuccess: false,
    };
  },

  methods: {
    ...mapActions('applicationList', {
      editUser: 'editUser',
    }),

    // update button click handler
    async updateData(isOpened) {
      // do not run update function on opening popup
      if (this.disabled) return;
      if (isOpened) {
        this.$emit('editing', this.userId, true);
        return;
      }

      // if user has cleaned input, we will return value from the store
      if (!this.localData || !this.localData.name) {
        await this.restoreDefault();
      }
      // Sending data to server
      this.loading = true;
      this.editUser({
        userId: this.userId,
        scopes: this.localData.scopes,
        appId: this.$route.params.id,
      }).then(() => {
        this.loading = false;
        this.$emit('close');
        this.$emit('editing', this.userId, false);
        this.$emit('updateUsers');
        this.isSuccess = true;
        setTimeout(() => { this.isSuccess = false; }, 2500);
      });
    },
    async restoreDefault() {
      const restore = this.$constant.accessTypes.find(accessType => {
        let isMatch = true;
        accessType.scopes.forEach(accessTypeScope => {
          if (!this.defaultScopes.includes(accessTypeScope)) isMatch = false;
        });
        return isMatch;
      });
      this.localData = cloneDeep(restore);
    },
  },

  created() {
    this.restoreDefault();
  },
};
</script>

<style scoped lang="scss">
  .edit-access-type {
    width: 10rem;
    .user-access {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem;
      border-radius: 0.1rem;
      color: var(--theme-secondary);
      background-color: rgba(var(--theme-secondary-rgb), 0.1);
      cursor: pointer;
    }
    .user-edit-access {
      color: var(--theme-primary);
      background-color: rgba(var(--theme-primary-rgb), 0.1);
    }
    .user-access-success {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background-color: var(--theme-success);
      vertical-align: middle;
      text-align: center;
      color: var(--theme-background-light);
    }
  }
  .popup-card {
    padding: 1rem 1rem 0 1rem;
  }
</style>
