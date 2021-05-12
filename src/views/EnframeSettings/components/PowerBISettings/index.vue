<!--Power BI settings page-->

<template>
  <v-form
    class="drawer-form"
    v-model="formValid"
    ref="form"
  >
    <v-layout class="setting-form-container" column>
      <h4 class="settings-header">{{ $message.setting.powerbi.header }}</h4>
      <h5 class="settings-subheader">{{ $message.setting.powerbi.subheader }}</h5>
      <v-layout wrap>
        <v-flex xs6>
          <opex-input
            v-model="powerbi.servicePrincipalKey"
            label="Service principal key"
            placeholder="Enter Service principal key"
            :validation-rules="[fieldPattern]"
            required
          />
        </v-flex>
        <v-flex xs6>
          <opex-input
            v-model="powerbi.applicationId"
            label="Application ID"
            placeholder="Application ID"
            :validation-rules="[fieldPattern]"
            required
          />
        </v-flex>
        <v-flex xs6>
          <opex-input
            v-model="powerbi.tenantId"
            label="Tenant ID"
            placeholder="Enter Tenant ID"
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
        @click="updatePowerbi"
      >
        save
      </v-btn>
    </v-layout>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex';
import { cloneDeep } from 'lodash';

export default {
  name: 'PowerBISettings',

  data() {
    return {
      formValid: true,
      powerbi: {},
      // Validation rules
      fieldPattern: value => /^[^,&\x22\x27]*$/.test(value) || this.$message.setting.nameSymbols,
    };
  },

  methods: {
    ...mapActions('settings', {
      updateSettings: 'updateSettings',
    }),

    updatePowerbi() {
      this.updateSettings({
        data: { powerbi: this.powerbi },
        type: this.$constant.enframeSetting.powerbi,
      });
    },

    resetForm() {
      this.$refs.form.reset();
    },
  },

  created() {
    // Initialising the form model
    this.powerbi = cloneDeep(this.$store.state.settings.powerbi);
  },
};
</script>

<style scoped lang="scss">
  .setting-form-container .opex-input{
    margin-right: 2.5rem;
  }
</style>
