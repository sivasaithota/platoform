<!--Component with the form to update url drawer on the deployment options page-->

<template>
  <v-form
    class="drawer-form"
    v-model="formValid"
  >

    <label class="url-label">custom url</label>
    <p class="domain-label">{{domainUrl}}</p>
    <opex-input
      v-model="mutableUrl"
      placeholder="custom url"
      :error-messages="urlAsyncErrors"
      :validation-rules="validationRules"
      @valid="appUrlValid = $event"
      @input="checkUrlUniqueness"
      required
    />
    <!--Buttons-->
    <v-divider/>
    <v-layout justify-end>
      <v-btn
        color="secondary"
        small
        :disabled="!formValid"
        @click="saveUrl"
      >
       save
      </v-btn>

      <v-btn
        text
        small
        color="primary"
        class="text-capitalize"
        @click="$emit('close')"
      >
        cancel
      </v-btn>
    </v-layout>
    <v-divider/>
  </v-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { debounce } from 'lodash';

export default {
  name: 'CustomUrlDrawer',

  props: {
    domainUrl: {
      type: String,
      default: null,
    },
    appUrl: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      appUrlValid: true,
      formValid: true,
      mutableUrl: this.appUrl,
      urlAsyncErrors: [], // URL errors returned from the server
      validationRules: [
        value => /^[a-zA-Z0-9-_]+$/.test(value) || this.$message.createNewApp.urlValidation,
      ],
    };
  },
  computed: mapState({
    userInfo: state => state.applicationUsers.userInfo,
  }),

  methods: {
    ...mapActions('application', {
      checkValueUniqueness: 'checkValueUniqueness',
      saveDetails: 'saveDetails',
    }),

    // Sending request to the server to check the custom URL uniqueness with 500ms debounce
    // eslint-disable-next-line func-names
    checkUrlUniqueness: debounce(function () {
      // Removing error messages if URL is not changed
      if (this.appUrl === this.mutableUrl) {
        this.urlAsyncErrors = [];
        return;
      }

      this.checkValueUniqueness({
        type: this.$constant.checkUniqueness.type.app,
        params: { url: this.mutableUrl },
      }).then(({ data }) => {
        // Adding or removing error message basing on the check result
        this.urlAsyncErrors = data.result.isUnique ? [] : [this.$message.createNewApp.urlUnique];
      });
    }, 500),

    // Saving custom url on the server
    saveUrl() {
      // Sending App URL to the server
      this.saveDetails({
        appId: this.$route.params.id,
        params: { url: this.mutableUrl },
      });

      this.$emit('close');
    },
  },

};
</script>

<style scoped lang="scss">
  .url-label {
    font-size: .7rem;
    font-weight: bold;
    text-transform: uppercase;
    color: var(--theme-secondary);
  }
  .domain-label {
    font-size: 1rem;
    font-weight: 500;
    line-height: normal;
    color: var(--theme-text);
    margin-bottom: 0;
  }
</style>
