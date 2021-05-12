<!--Security settings page-->

<template>
  <v-form
    class="drawer-form"
    v-model="formValid"
    ref="form"
  >
    <v-layout class="setting-form-container" column>
      <h4 class="settings-header">{{ $message.setting.security.header }}</h4>
      <h5 class="settings-subheader">{{ $message.setting.security.subheader }}</h5>
      <v-layout align-baseline>
        <v-flex xs5>
          <!--Field to add domain-->
          <opex-input
            v-model="newDomain"
            label="Enter the domain"
            placeholder="...com"
            :validation-rules="[fieldPattern, domainNameUniqueness]"
            required
          />
        </v-flex>
        <v-btn
          color="secondary"
          small
          :disabled="!formValid"
          @click="addDomain"
        >
          add
        </v-btn>
      </v-layout>
      <v-layout>
        <v-flex xs5>
          <!--Existing domains-->
          <opex-list-item
            v-for="(domain, index) in acceptedDomains"
            :key="index"
            v-model="acceptedDomains[index]"
            @delete="deleteDomain(domain)"
            icon="v2-web"
            class="list-icon"
          />
        </v-flex>
      </v-layout>
    </v-layout>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'SecuritySettings',
  data() {
    return {
      formValid: true,
      newDomain: null,
      // Validation rules
      fieldPattern: value => /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(value)
        || this.$message.setting.securityDomain,
      domainNameUniqueness: value => {
        return !this.acceptedDomains || (this.acceptedDomains && !this.acceptedDomains.find(domain => { return domain === value; }))
          || this.$message.setting.domainNameUniqueness;
      },
    };
  },
  methods: {
    ...mapActions('settings', {
      updateSettings: 'updateSettings',
    }),
    // add button click handler
    addDomain() {
      this.acceptedDomains.push(this.newDomain);
      this.updateSettings({
        data: { acceptedDomains: this.acceptedDomains },
        type: this.$constant.enframeSetting.acceptedDomains,
      }).then(() => {
        this.$refs.form.reset();
      });
    },
    deleteDomain(domain) {
      const index = this.acceptedDomains.indexOf(domain);
      if (index !== -1) this.acceptedDomains.splice(index, 1);
      this.updateSettings({
        data: { acceptedDomains: this.acceptedDomains },
        type: this.$constant.enframeSetting.acceptedDomains,
      }).then(() => {
        this.$refs.form.reset();
      });
    },
  },
  created() {
    // Initialising the form model
    this.acceptedDomains = Array.from(this.$store.state.settings.acceptedDomains);
  },
};
</script>

<style scoped lang="scss">
  .setting-form-container .opex-input{
    margin-right: 2.5rem;
  }
</style>
