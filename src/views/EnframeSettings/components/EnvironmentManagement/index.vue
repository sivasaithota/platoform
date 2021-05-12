<!--Environment Management settings page-->

<template>
  <v-layout column>
    <v-layout
      align-start
      justify-center
      class="setting-form-container"
    >
      <v-layout column>
        <h4 class="settings-header">{{ $message.setting.packageManager.header }}</h4>
        <h5 class="settings-subheader">{{ $message.setting.packageManager.subheader }}</h5>
      </v-layout>

      <environment-management-dialog
        v-if="!loading && showModalPopup"
        :show-modal="showModalPopup"
        :env-index="selectedEnvIndex"
        @setShowModal="setShowModal"
      />

      <v-btn
        color="secondary"
        small
        @click="creatEnvironment"
      >
        new environment
      </v-btn>


    </v-layout>

    <fetching-data-spinner :visible="loading"/>

    <div v-if="!loading">
      <!--List of environments-->
      <div v-if="environments.length">
        <v-layout
          align-center
          justify-space-between
          class="env-row"
          v-for="(environment, index) in environments"
          :key="index"
        >
          <v-layout column>
            <p class="env-name">
              {{ environment.name }}
              <opex-icon
                v-if="environment.createdBy !== userInfo.email && environment.locked"
                name="v2-lock" />
            </p>
            <p class="env-description">{{ environment.description }}</p>
            <p class="env-description">Created: {{ environment.createdAt | time }} by {{ environment.createdBy }}</p>
          </v-layout>

          <!--menu button-->
          <v-menu
            v-if="!(environment.createdBy !== userInfo.email && environment.locked)"
            offset-y
            transition="slide-y-transition"
          >
            <template #activator="{ on }">
              <!--Menu Icon-->
              <div
                v-on="on"
                class="menu-btn"
              >
                <opex-icon name="v2-more"/>
              </div>
            </template>

            <!--Menu Body-->
            <v-list>
              <v-list-item
                class="menu-item"
                @click="editEnvironment(index)"
              >
                <v-list-item-title>
                  Edit
                </v-list-item-title>
              </v-list-item>

              <v-list-item @click="showDeleteEnvPopup(index)">
                <v-list-item-title>
                  Delete
                </v-list-item-title>
              </v-list-item>
            </v-list>

          </v-menu>

          <!--Delete column popup-->
          <opex-popup
            left
            :ref="`delete-env-${index}`"
            title="Delete column"
            :message="$message.setting.packageManager.deleteEnv(environment.name)"
            button-name="delete"
            @confirm="deleteEnvConfirm(index)"
          />
        </v-layout>
      </div>
      <!--Info block when list of environments is empty-->
      <v-layout
        v-else
        align-center
        justify-center
        column
      >
        <img
          src="@/assets/svg/environment-setting.svg"
          alt=""
        >
        <p
          v-html="$message.setting.packageManager.infoText"
          class="empty-info"
        ></p>
      </v-layout>
    </div>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';

import EnvironmentManagementDialog from '../EnvironmentManagementDialog';

export default {
  name: 'EnvironmentManagement',

  components: { EnvironmentManagementDialog },

  data() {
    return {
      loading: true,
      formValid: true,
      showModalPopup: false,
      selectedEnvIndex: null,
    };
  },

  computed: {
    ...mapState({
      environments: state => state.environment.environments,
      userInfo: state => state.user.userInfo,
    }),
  },

  methods: {
    ...mapActions('environment', {
      getEnvironments: 'getEnvironments',
      deleteEnvironment: 'deleteEnvironment',
    }),

    setShowModal(value) {
      this.showModalPopup = value;
    },

    // Dialog card click handler
    creatEnvironment() {
      // Opening the create env window
      this.selectedEnvIndex = null;
      this.showModalPopup = true;
    },

    // Dialog card click handler
    editEnvironment(envIndex) {
      // Opening the edit env window
      this.selectedEnvIndex = envIndex;
      this.showModalPopup = true;
    },

    showDeleteEnvPopup(index) {
      // Changing popup visibility directly, activator slot approach doesn't work for the popup in menu
      this.$refs[`delete-env-${index}`][0].isVisible = true;
    },

    // Delete column confirm button click handler
    deleteEnvConfirm(envIndex) {
      this.deleteEnvironment({
        envId: this.environments[envIndex]._id,
        envIndex,
      });
    },
  },

  filters: {
    time(value) {
      return moment(value).format('MMMM DD, YYYY');
    },
  },

  mounted() {
    // Fetching data from the server
    this.getEnvironments().then(() => {
      this.loading = false;
    });
  },
};
</script>

<style scoped lang="scss">
  .settings-subheader {
    margin-bottom: 0;
  }
  .empty-info {
    opacity: 0.5;
    font-size: 0.86rem;
    font-weight: 500;
    line-height: 1.67;
    margin-top: 0.71rem;
    text-align: center;
  }
  .env-row {
    border-bottom: solid 1px var(--theme-border-grey);
    padding: 0.71rem 1.375rem 0.71rem 2.25rem;
    &:last-child {
      border-bottom: none;
    }
    .env-name {
      font-size: 1rem;
      font-weight: 500;
      line-height: normal;
      color: var(--theme-text);
      margin-bottom: 0.36rem;
    }
    .env-description {
      opacity: 0.51;
      font-size: 0.71rem;
      font-weight: 500;
      margin-bottom: 0;
    }
  }
</style>
