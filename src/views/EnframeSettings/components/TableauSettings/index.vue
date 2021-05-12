<!--Tableau settings page-->

<template>
  <v-form
    class="drawer-form"
    v-model="formValid"
    ref="form"
  >
    <v-layout class="setting-form-container" column>
      <h4 class="settings-header">{{ $message.setting.tableau.header }}</h4>
      <h5 class="settings-subheader">{{ $message.setting.tableau.subheader }}</h5>
      <v-layout wrap>
        <v-flex xs6>
          <opex-input
            v-model="tableau.server"
            label="Server name"
            placeholder="Enter Server name"
            :validation-rules="[fieldPattern]"
            required
          />
        </v-flex>
        <v-flex xs6>
          <opex-input
            v-model="tableau.username"
            label="User name"
            placeholder="Enter User name"
            :validation-rules="[fieldPattern]"
            required
          />
        </v-flex>
        <v-flex xs6>
          <opex-password
            v-model="tableau.password"
            label="Password"
            placeholder="Enter Password"
            :requirements="passwordRules"
          />
        </v-flex>
        <v-flex xs6>
          <opex-input
            v-model="tableau.siteContentUrl"
            label="Content URL (Site ID)"
            placeholder="Enter site (Leave it blank for default site)"
            :validation-rules="[fieldPattern]"
          />
        </v-flex>
        <v-flex xs6>
          <opex-input
            v-model="tableau.projectName"
            label="Project"
            placeholder="Enter Project"
            :validation-rules="[fieldPattern]"
            required
          />
        </v-flex>
        <v-flex xs6>
          <opex-input
            v-model="tableau.reportServer"
            label="Report server"
            placeholder="Enter Report server"
            :validation-rules="[fieldPattern]"
            required
          />
        </v-flex>
        <v-flex xs6>
          <opex-input
            v-model="tableau.authKey"
            label="Authentication key"
            placeholder="Enter Authentication key"
            :validation-rules="[fieldPattern]"
            required
          />
        </v-flex>
        <v-flex xs6>
          <opex-input
            v-model="tableau.databaseServer"
            label="Database server"
            placeholder="Enter Database server"
            :validation-rules="[fieldPattern]"
            required
          />
        </v-flex>
      </v-layout>
    </v-layout>

    <v-divider/>

    <!--Buttons-->
    <v-layout
      justify-end
      class="setting-action-container"
    >
      <v-btn
        text
        small
        color="primary"
        @click="resetForm"
      >
        reset
      </v-btn>

      <v-btn
        color="secondary"
        small
        :disabled="!formValid"
        @click="updateTableau"
      >
        save
      </v-btn>
    </v-layout>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex';
import { cloneDeep } from 'lodash';

import OpexPassword from '@/components/OpexPassword/index';

export default {
  name: 'TableauSettings',

  components: { OpexPassword },

  data() {
    return {
      formValid: true,
      tableau: {},
      // Validation rules
      fieldPattern: value => /^[^,&\x22\x27]*$/.test(value) || this.$message.setting.nameSymbols,
      passwordRules: [
        this.$constant.passwordRequirements.minLength,
        this.$constant.passwordRequirements.lowercaseLetter,
        this.$constant.passwordRequirements.numericLetter,
      ],
    };
  },

  methods: {
    ...mapActions('settings', {
      updateSettings: 'updateSettings',
    }),

    updateTableau() {
      this.updateSettings({
        data: { tableau: this.tableau },
        type: this.$constant.enframeSetting.tableau,
      });
    },

    resetForm() {
      this.$refs.form.reset();
    },
  },

  created() {
    // Initialising the form model
    this.tableau = cloneDeep(this.$store.state.settings.tableau);
  },
};
</script>

<style scoped lang="scss">
  .setting-form-container .opex-input,
  .setting-form-container .opex-password {
      margin-right: 2.5rem;
  }
</style>
