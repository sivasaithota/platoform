<!--Edit app details form in the drawer on the App Details page-->

<template>
  <v-form
    class="drawer-form edit-app-details"
    v-model="formValid"
  >
    <opex-input
      v-model="appDetails.name"
      :label="$constant.appDetailsLabels.name"
      :max-length="maxLength"
      :validation-rules="appNameRules"
      :error-messages="appNameAsyncErrors"
      required
      @input="checkNameUniqueness"
    />

    <opex-input
      v-model="appDetails.displayName"
      :label="$constant.appDetailsLabels.displayName"
      :max-length="maxLength"
      :validation-rules="[quoteRule]"
      required
    />

    <opex-input
      textarea
      :rows="8"
      v-model="appDetails.description"
      :label="$constant.appDetailsLabels.description"
      :max-length="maxLength"
      :validation-rules="[quoteRule]"
    />

    <!--Buttons-->
    <v-divider/>
    <v-layout justify-end>
      <v-btn
        color="secondary"
        small
        :disabled="!formValid"
        @click="updateAppDetails"
      >
        update
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
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { debounce } from 'lodash';

export default {
  name: 'EditAppDetails',

  data() {
    return {
      appDetails: {
        name: this.$store.state.application.name,
        displayName: this.$store.state.application.displayName,
        description: this.$store.state.application.description,
      },
      currentAppName: this.$store.state.application.name, // not changed app name
      formValid: false,

      // Validation rule checking the presence of single quote
      quoteRule: value => {
        if (value && value.includes('\'')) return this.$message.common.singleQuoteRule;
        return true;
      },

      // app name validation rules
      appNameRules: [
        // Allowed characters for the app name
        value => this.$store.getters['application/checkAppNamePattern'](value)
          || this.$message.createNewApp.appNameAllowedCharacters,
        value => this.$store.getters['application/checkAppNameLength'](value)
          || this.$message.createNewApp.appNameTooLong,
      ],
      maxLength: '300',
    };
  },

  computed: {
    ...mapState({
      appNameAsyncErrors: state => state.application.nameAsyncErrors,
    }),
  },

  methods: {
    ...mapMutations('application', {
      updateNameAsyncErrors: 'updateNameAsyncErrors',
    }),

    ...mapActions('application', {
      saveDetails: 'saveDetails',
      checkAppNameUniqueness: 'checkAppNameUniqueness',
    }),

    // Sending request to the server to check the app name uniqueness with 500ms debounce
    // eslint-disable-next-line func-names
    checkNameUniqueness: debounce(function () {
      this.checkAppNameUniqueness(this.appDetails.name);
    }, 500),

    // Update button click handler
    updateAppDetails() {
      // Trim app name
      this.appDetails.name = this.appDetails.name.trim();

      // Sending App Details to the server
      this.saveDetails({
        appId: this.$route.params.id,
        params: this.appDetails,
      });

      this.$emit('close');
    },
  },

  mounted() {
    // Cleaning app name async errors returned from the server
    this.updateNameAsyncErrors();
  },
};
</script>
