<!--Card with main information about the app on Home page-->

<template>
  <v-layout
    column
    class="app-info-card"
  >
    <!-- Card header with action buttons -->
    <v-layout
      justify-space-between
      class="app-info-header"
      :style="backgroundStyle"
    >
      <v-skeleton-loader
        :loading="!appData._id && fetchingApps"
        class="app-card-header-skeleton"
        type="heading, list-item-two-line"
      >
      <div class="info_container">
        <div class="app-info-name">
          {{ appData.name }}
        </div>
        <div class="app-info-description">
          {{ appData.description }}
        </div>
      </div>
      </v-skeleton-loader>

      <div
        class="actions_container"
        v-if="appData.isEditable"
      >
        <v-menu
          v-model="actionMenu"
          origin="center center"
          transition="slide-y-transition"
          content-class="action_list"
          bottom
        >
          <template #activator="{ on }">
            <v-btn
              fab
              text
              color="secondary"
              v-show="appData._id && !fetchingApps"
              v-on="on"
            >
              <opex-icon class="more" name="v2-more" />
            </v-btn>
          </template>

          <v-list class="layout column">
            <button-upgrade
              v-if="isUpgradeFailed"
              :app-data="appData"
              @deactivate="deactivateMenu"
            />

            <!-- DOWNLOAD APP -->
            <button-download
              v-if="!isAppCreated"
              @deactivate="deactivateMenu"
            />

            <!-- STOP APP -->
            <button-stop
              v-if="isAppStarted && showStartStopBtn"
              :app-data="appData"
              @deactivate="deactivateMenu"
            />

            <!-- START APP -->
            <button-start
              v-else-if="showStartStopBtn"
              :app-data="appData"
              @deactivate="deactivateMenu"
            />

            <!-- DELETE APP -->
            <button-delete
              :app-data="appData"
              @deactivate="deactivateMenu"
            />
          </v-list>
        </v-menu>

        <!-- EDIT APP -->
        <div
          class="edit_container"
          v-if="appData.isEditable"
        >
          <opex-tooltip
            bottom
            :message="$message.appDeployment.buttons.edit.tooltip"
          >
            <template #activator>
              <v-btn
                fab
                large
                color="secondary"
                class="edit_container--icon"
                v-show="appData._id && !fetchingApps"
                @click="editApp"
              >
                <opex-icon name="v2-pencil"/>
              </v-btn>
            </template>
          </opex-tooltip>
        </div>
      </div>
    </v-layout>

    <!--App info skeleton loader-->
    <v-layout
      wrap
      v-if="!appData._id && fetchingApps"
      class="app-info-body"
    >
      <v-skeleton-loader
        v-for="n in 8"
        :key="n"
        class="card-skeleton app-card-info-skeleton"
        type="list-item-two-line"
      />
    </v-layout>

    <!--Application Information-->
    <v-layout
      v-else
      wrap
      class="app-info-body"
    >
      <!--Application status-->
      <v-flex xs4 class="app-info">
        <div class="app-info-title">Application status</div>
        <div :class="`app-info-value ${deployStatusClass}`">
          {{ appData.status }}
          <v-progress-circular
            v-if="appData.status === $constant.deployStatuses.running"
            indeterminate
            color="secondary"
            style="width: 1.5rem; height: 1.5rem"
          />
        </div>
      </v-flex>

      <!--Application ID-->
      <v-flex xs5 class="app-info">
        <div class="app-info-title">Application Id</div>
        <div
          class="app-info-value app-id-value"
          @click="copyToClipboard(appData._id)"
        >
          <span>{{ appData._id }}</span>
          <opex-icon
            name="v2-copy-app-info"
          />
        </div>
      </v-flex>

      <!--Application Author-->
      <v-flex xs4 class="app-info">
        <div class="app-info-title">Created by</div>
        <div class="app-info-value">{{ appData.createdBy }}</div>
      </v-flex>
      <!--Modification Time-->
      <v-flex xs5 class="app-info">
        <div class="app-info-title">Last Modified on</div>
        <div class="app-info-value">{{ convertTime(appData.updatedAt) }}</div>
      </v-flex>
      <!--Creation Time-->
      <v-flex xs3 class="app-info">
        <div class="app-info-title">Created on</div>
        <div class="app-info-value">{{ convertTime(appData.createdAt) }}</div>
      </v-flex>

      <!-- Application admins-->
      <application-admins :empty-value="emptyValue"/>

      <!--Deployment Details-->
      <v-flex xs8 class="app-info">
        <!--Application URL-->
        <div class="app-info-title">Application url</div>
        <a
          v-if="!isAppCreated && appUrl"
          :href="appUrl"
          class="app-info-value"
          :class="{'app-info-value--empty': !appUrl}"
          target="_blank"
        >
          {{ appUrl }}
        </a>
        <div
          v-else
          class="app-info-value app-info-value--empty"
        >{{ emptyValue }}</div>
        <opex-icon
          v-if="appUrl"
          @click.native="copyToClipboard(appUrl)"
          name="v2-copy-app-info"
          class="clipboard-btn"
        />
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import moment from 'moment';
import { mapActions, mapState } from 'vuex';
import router from '@/router';

import ButtonStart from './components/ButtonStart';
import ButtonUpgrade from './components/ButtonUpgrade';
import ButtonStop from './components/ButtonStop';
import ApplicationAdmins from './components/ApplicationAdmins';
import ButtonDelete from './components/ButtonDelete';
import ButtonDownload from './components/ButtonDownload';

export default {
  name: 'AppCard',
  components: {
    ButtonUpgrade,
    ButtonStart,
    ButtonStop,
    ApplicationAdmins,
    ButtonDelete,
    ButtonDownload,
  },
  data() {
    return {
      deleteAll: true,
      emptyValue: 'Not Available',
      actionMenu: false,
    };
  },
  computed: {
    ...mapState({
      fetchingApps: state => state.applicationList.fetchingApps,
    }),

    showStartStopBtn() {
      const { status } = this.appData;
      const { active, inactive } = this.$constant.deployStatuses;
      return status === active || status === inactive;
    },
    isAppStarted() {
      const { status } = this.appData;
      return status === this.$constant.deployStatuses.active;
    },
    isAppCreated() {
      return this.appData.status === this.$constant.deployStatuses.inProgress;
    },
    isUpgradeFailed() {
      return this.appData.status === this.$constant.deployStatuses.upgradeFailed;
    },
    appUrl() {
      return (this.appData.status === this.$constant.deployStatuses.active && this.appData.url)
        ? `${window.location.origin}/apps/${this.appData.url}/` : '';
    },
    appData() {
      return this.$store.getters['applicationList/getSelectedApp'] || {};
    },
    deployStatusClass() {
      let statusClass = 'app-info-value--empty';
      if (this.appData.status === this.$constant.deployStatuses.active) statusClass = 'activated_status_text';
      if (this.appData.status === this.$constant.deployStatuses.inactive) statusClass = 'inactive_status_text';
      if (this.appData.status === this.$constant.deployStatuses.inProgress) statusClass = 'in_progress_status_text';
      return statusClass;
    },
    backgroundStyle() {
      return this.appData.theme
        && 'background-image: linear-gradient(to bottom,rgba(var(--theme-primary-rgb),.75),rgba(var(--theme-primary-rgb),.75)), '
        + `url('${this.$constant.api.enframe}themes/${this.appData.theme.id}/images?type=background')`;
    },
  },
  methods: {
    ...mapActions({
      showSnackbar: 'snackbar/show',
    }),
    editApp() {
      if (this.appData.isEditable) router.push({ path: `/application/${this.appData._id}/details` });
    },
    convertTime(time) {
      return moment(time).format('MMMM DD, YYYY');
    },
    copyToClipboard(value) {
      navigator.clipboard
        .writeText(value)
        .catch(error => {
          this.showSnackbar({
            type: this.$constant.snackbarTypes.error,
            title: this.$message.common.errorClipboard,
            message: error,
          });
        });
    },
    // Close actions menu
    deactivateMenu() {
      this.actionMenu = false;
    },
  },
};
</script>

<style lang="scss">
  div.v-skeleton-loader.app-card-header-skeleton {
    width: 100%;
    height: fit-content;

    .v-skeleton-loader__heading {
      margin-top: 1rem;
    }

    div.v-skeleton-loader__heading, .v-skeleton-loader__text {
      background: var(--theme-background-hover);
    }

    .v-skeleton-loader__list-item-two-line {
      padding: 0;
    }
  }

  .card-skeleton.app-card-info-skeleton {
    width: 28%;
    margin-right: 5%;

    .v-skeleton-loader__list-item-two-line {
      margin-bottom: 2.4rem;
    }
  }

  $app-card-header-btn-size: 3rem;
  div.v-input.delete-all-checkbox {
    margin: 0.6rem 0;
    text-transform: uppercase;
    .v-label {
      color: var(--theme-secondary);
      margin-left: 0.4rem;
      font-size: 1rem;
      font-weight: 600;
    }
  }
  #app button.v-btn.app-card-btn-icon {
    margin: 0 0.5rem;
    i {
      font-size: 1.5rem;
      color: var(--theme-secondary);
    }
    &:hover {
      box-shadow: 0 0.6rem 0.7rem rgba(0,0,0,0.5);
    }
  }

  .app-info {
    margin-bottom: 2rem;
    text-overflow: ellipsis;
    overflow: hidden;
    .app-info-title {
      text-transform: uppercase;
      font-size: .8rem;
      font-weight: bold;
    }
    .app-info-value {
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--theme-text-light);
      text-overflow: ellipsis;
      overflow: hidden;
      &.client-name {
        color: #4c9aff;
      }
      // &.activated_status_text {
      //   color: var(--theme-success);
      // }
      // &.inactive_status_text {
      //   color: var(--theme-error);
      // }
      // &.in_progress_status_text {
      //   color: var(--theme-warning);
      // }
    }
    .app-info-value--empty {
      opacity: .5;
    }
  }
</style>

<style scoped lang="scss">
  $app-info-header-height: 15rem;
  $app-info-header-padding--top: 2rem;
  $app-info-header-padding--right: 3rem;
  $password-details-size: .57rem;
  $edit-btn--size: 4.29rem;

  .info_container {
    max-width: 90%;
  }
  .actions_container {
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    display: flex;
    .more {
      transform: rotate(90deg);
      font-weight: bold;
      color: var(--theme-secondary-text);
    }
  }
  .edit_container {
    position: relative;
    bottom: calc(-#{$app-info-header-padding--top} - #{$edit-btn--size}/2);
    button.v-btn.edit_container--icon {
      height: $edit-btn--size;
      width: $edit-btn--size;
      i {
        font-size: 1.4rem;
      }
    }
  }
  .action_list {
    box-shadow: 0 10px 10px 0 rgba(0, 0, 0, .3);
    border-radius: 0;
    .v-list {
      padding: 0;
      border-radius: 0;
    }
  }
  .app-info-card {
    box-shadow: 0 2rem 2rem .8rem rgba(0, 0, 0, 0.05);
    background-color: var(--theme-background-light);
    position: relative;
    .app-info-header {
      background-color: var(--theme-primary);
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      color: var(--theme-primary-text);
      height: $app-info-header-height;
      padding: $app-info-header-padding--top $app-info-header-padding--right;
      .app-info-name {
        font-size: 2rem;
        font-weight: bold;
        position: relative;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .app-info-description {
        padding-top: .5rem;
        font-size: 1.1rem;
        font-weight: 500;
        opacity: .8;
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 80%;
      }
    }
    .app-info-body {
      top: $app-info-header-height;
      padding: 3rem;
    }
    .clipboard-btn {
      cursor: pointer;
      font-size: 1.2rem;
      padding-left: .4375rem;
      color: var(--theme-secondary);
      &:active {
        opacity: .8;
      }
    }
    .app-id-value {
      text-overflow: ellipsis;
      overflow: hidden;
      cursor: pointer;
      i {
        margin-left: .4375rem;
        color: var(--theme-secondary);
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s, opacity 0.2s linear;
      }
      &:hover i {
        visibility: visible;
        opacity: 1;
      }
    }
  }
  .deployment-details {
    border: solid 1px var(--theme-border-grey);
    margin-top: 1.2rem;
    padding: .6rem .8rem;
    background-color: var(--theme-background);
    width: max-content;
    .v-icon {
      font-size: .8rem;
    }
    > div:not(:last-child) {
      margin-right: .71rem;
    }
  }
  .password-details {
    width: $password-details-size;
    height: $password-details-size;
    background-color: var(--theme-secondary);
    border-radius: 50%;
    margin-right: .21rem;
  }
</style>
