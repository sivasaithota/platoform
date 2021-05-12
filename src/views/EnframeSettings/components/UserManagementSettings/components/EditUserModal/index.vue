<!--Edit user modal-->

<template>
  <opex-dialog
    :title="title"
    :use-title-lowercase="false"
    :confirm-text="confirmText"
    :cancel-text="$message.setting.userManagement.addUserCancelText"
    :is-confirm-disabled="!formValid"
    v-model="showModalPopup"
    width="50rem"
    @confirm="confirm"
    @cancel="cancel"
  >
    <v-form
      class="drawer-form"
      v-model="formValid"
      ref="userForm"
    >
      <v-layout
        column
        class="add-user-container"
      >
        <v-radio-group
          hide-details
          v-model="user.type"
          row
          required
        >
          <v-radio
            v-for="(option, key) in userTypes"
            color="secondary"
            on-icon="icon-v2-radio-checked2"
            :ripple="false"
            :key="key"
            :label="option.text"
            :value="option.val"
          />
        </v-radio-group>
        <v-layout wrap>
          <v-flex xs6>
            <opex-input
              v-model="user.firstName"
              :label="$message.setting.userManagement.addUserFirstNameLabel"
              :placeholder="$message.setting.userManagement.addUserFirstNamePlaceholder"
              :validation-rules="userNameRules"
              required
            />
          </v-flex>
          <v-flex xs6>
            <opex-input
              v-model="user.lastName"
              :label="$message.setting.userManagement.addUserLastNameLabel"
              :placeholder="$message.setting.userManagement.addUserLastNamePlaceholder"
              :validation-rules="userNameRules"
              required
            />
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex>
            <opex-input
              v-model="user.email"
              :label="$message.setting.userManagement.addUserEmailLabel"
              :placeholder="$message.setting.userManagement.addUserEmailPlaceholder"
              :validation-rules="emailRules"
              :readonly="isEdit"
              required
            />
          </v-flex>
        </v-layout>
        <v-layout
          v-if="isStandalone"
          wrap
        >
          <v-flex xs6>
            <opex-password
              v-model="user.password"
              :label="$message.setting.userManagement.addUserPasswordLabel"
              :placeholder="$message.setting.userManagement.addUserPasswordPlaceholder"
              :requirements="passwordRules"
              :required="isStandalone"
            />
          </v-flex>
          <v-flex xs6>
            <opex-password
              v-model="user.confirmPassword"
              :label="$message.setting.userManagement.addUserConfirmPasswordLabel"
              :placeholder="$message.setting.userManagement.addUserConfirmPasswordPlaceholder"
              :requirements="confirmPasswordRules"
              :required="isStandalone"
            />
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs6>
            <opex-input
              :autocomplete-items="roles"
              v-model="user.role"
              :label="$message.setting.userManagement.addUserRoleLabel"
              :placeholder="$message.setting.userManagement.addUserRolePlaceholder"
              item-text="name"
              required
            />
          </v-flex>
        </v-layout>
      </v-layout>
    </v-form>
  </opex-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { cloneDeep } from 'lodash';

import OpexPassword from '@/components/OpexPassword/index';

export default {
  name: 'EditUserModal',
  components: { OpexPassword },

  data() {
    return {
      user: {},
      formValid: true,
      userTypes: [
        {
          val: 'SSO',
          text: 'Single-Sign-On (SSO) User',
        },
        {
          val: 'Standalone',
          text: 'Stand Alone User',
        },
      ],
      passwordRules: [
        this.$constant.passwordRequirements.minLength,
        this.$constant.passwordRequirements.lowercaseLetter,
        this.$constant.passwordRequirements.uppercaseLetter,
        this.$constant.passwordRequirements.specialLetter,
        this.$constant.passwordRequirements.numericLetter,
      ],
      confirmPasswordRules: [
        {
          text: this.$message.setting.userManagement.passwordsDoNotMatch,
          rule: () => this.user.confirmPassword === this.user.password && this.user.confirmPassword !== '',
        },
      ],
      emailRules: [
        // eslint-disable-next-line
        value => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          .test(value) || this.$message.setting.userManagement.invalidEmail,
      ],
      userNameRules: [
        value => /^[a-zA-Z0-9]*$/.test(value) || this.$message.setting.userManagement.alphanumericOnly,
      ],
    };
  },
  props: {
    showModal: Boolean,
    isEdit: Boolean,
    userData: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      roles: state => state.settings.userManagement.roles,
    }),
    showModalPopup: {
      get() {
        return this.showModal;
      },
      set() {
        this.$emit('close');
      },
    },
    title() {
      return this.isEdit
        ? this.$message.setting.userManagement.editUserTitle
        : this.$message.setting.userManagement.addUserTitle;
    },
    confirmText() {
      return this.isEdit
        ? this.$message.setting.userManagement.editUserConfirmText
        : this.$message.setting.userManagement.addUserConfirmText;
    },
    isStandalone() {
      return this.user.type === this.$constant.userTypes.standalone;
    },
  },

  methods: {
    ...mapActions('settings', {
      createUser: 'createUser',
      editUser: 'editUser',
    }),
    async confirm() {
      if (this.isEdit) {
        await this.editUser(this.user);
      } else await this.createUser(this.user);
      this.resetForm();
      this.$emit('close');
    },
    cancel() {
      this.resetForm();
      this.$emit('close');
    },
    resetForm() {
      this.$refs.userForm.reset();
    },
  },
  watch: {
    userData(val) {
      this.user = cloneDeep(val);
      this.user.password = '';
      this.user.confirmPassword = '';
    },
  },
};
</script>

<style scoped lang="scss">
  .add-user-container {
    .opex-input, .opex-password {
      margin: 0rem 1rem;
    }
    .v-input--radio-group {
      margin: 1rem;
      .v-radio {
        width: 40%;
      }
    }
  }
  .add-user {
    padding: 0rem !important;
    margin: 1rem !important;
    width: 8.5rem !important;
    height: 2.85rem !important;
  }
</style>
