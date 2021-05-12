<!--Download button with modal window with different downloading app types on Home page-->

<template>
  <app-action-button
    :title="$message.appDeployment.buttons.download.confirmation"
    :list-name="$message.appDeployment.buttons.download.listName"
    :list-description="$message.appDeployment.buttons.download.listDescription"
    :confirm-text="$message.appDeployment.buttons.download.confirm"
    :in-progress-text="$message.appDeployment.buttons.download.inProgress"
    :in-progress-status="inProgressStatus"
    :show-modal="showModalPopup"
    :is-confirm-disabled="isConfirmDisabled"
    icon-name="v2-arrow-down2"
    modalWidth="70rem"
    withoutPadding
    @confirm="onConfirm"
    @cancel="dropValues"
    @setShowModal="setShowModal"
    @deactivate="$emit('deactivate')"
  >
    <div class="download-options">
      <v-layout
        v-for="(option, index) in $constant.downloadOptions"
        :key="index"
        :class="{
          'active': activeTabIndex === index,
          'disabled': disableElements(index),
        }"
        class="download-option"
        row
        @click="changeTab(index)"
      >
        <v-checkbox
          class="download-checkbox"
          color="secondary"
          :disabled="disableElements(index)"
          v-model="optionsSelected"
          :value="option.tab"
          @click.native.stop
        />
        <div>
          {{ option.name }}
        </div>
      </v-layout>
      <div
        v-if="selectedApp.loginWarning"
        class="login-warning-box"
      >
        <div class="login-warning">
          <v-layout
            class="login-warning-head"
            row
          >
            <opex-icon
              class="login-warning-head-icon"
              name="v2-app-info"
            />
            <div
              class="login-warning-head-text"
            >
              Attention required!
            </div>
          </v-layout>
          <div
            class="login-warning-body"
            v-html="$constant.loginWarning"
          />
        </div>
      </div>
    </div>
    <v-layout column justify-space-between>
      <!-- Body of download card -->
      <v-layout column class="download-card-body">

        <div class="body-title">
          {{ selectedAppData.name }}
        </div>

        <div class="body-description" v-html="$constant.downloadOptions[activeTabIndex].headerText"/>

        <!-- Select scenario component -->
        <tab-content
          v-if="isScenario"
          :type="$constant.downloadOptions[1].tab"
          :active-index="activeTabIndex"
          :selected-data="selectedScenario"
          :selected-all-data="selectedAllScenario"
          :data-list="scenarioList"
          @selectAll="onClickSelectAllScenario"
          @selectItem="onClickSelectScenario"
        />

        <!-- Select reports component -->
        <tab-content
          v-if="isReports"
          :type="$constant.downloadOptions[2].tab"
          :active-index="activeTabIndex"
          :selected-data="selectedReports"
          :selected-all-data="selectedAllReports"
          :data-list="reportsList"
          @selectAll="onClickSelectAllReports"
          @selectItem="onClickSelectReports"
        />
      </v-layout>
    </v-layout>
  </app-action-button>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import tableauLogo from '@/assets/images/Tableau_Logo.svg';
import AppActionButton from '../AppActionButton';
import TabContent from './TabContent';

export default {
  name: 'ButtonDownload',
  components: { AppActionButton, TabContent },

  data() {
    return {
      tableauLogo,
      activeTabIndex: 0,
      selectedScenario: [],
      selectedReports: [],
      selectedAllScenario: true,
      selectedAllReports: true,
      optionsSelected: [this.$constant.downloadOptions[0].tab],
      headerText: this.$constant.downloadOptions[0].headerText,
      inProgressStatus: false,
      forceVisible: false,
      showModalPopup: false,
    };
  },
  methods: {
    ...mapActions('applicationList', {
      getScenarioList: 'getScenarioList',
      getTableauList: 'getTableauList',
      downloadApp: 'downloadApp',
      cancelRequest: 'cancelRequest',
    }),
    onConfirm() {
      const { _id: id, name } = this.selectedAppData;
      this.forceVisible = false;
      this.inProgressStatus = true;
      const data = {
        config: this.optionsSelected.includes(this.$constant.downloadOptions[0].tab),
        scenarios: this.optionsSelected.includes(this.$constant.downloadOptions[1].tab) ? this.selectedScenario : [],
        reports: this.optionsSelected.includes(this.$constant.downloadOptions[2].tab)
          ? this.reportsList
            .filter(report => this.selectedReports.includes(report.key))
            .map(report => report.title)
          : [],
      };
      this
        .downloadApp({
          id,
          name,
          data,
        })
        .finally(() => {
          this[this.forceVisible ? 'forceVisible' : 'showModalPopup'] = false;
          this.inProgressStatus = false;
          this.dropValues();
          this.resetData();
        });
    },
    changeTab(index) {
      if (this.selectedApp.loginWarning) return;
      this.activeTabIndex = index;
    },
    onClickSelectAllScenario(selectedAllScenario) {
      this.selectedAllScenario = selectedAllScenario;
      this.selectedScenario = this.selectedAllScenario
        ? this.scenarioList.map(item => item.key) : [];
    },
    onClickSelectScenario(selectedValue) {
      const exists = this.selectedScenario.includes(selectedValue);
      if (exists) {
        this.selectedScenario = this.selectedScenario.filter(s => s !== selectedValue);
      } else {
        this.selectedScenario.push(selectedValue);
      }
      this.selectedAllScenario = this.selectedScenario.length === this.currentList.length;
    },
    onClickSelectAllReports(selectedAllReports) {
      this.selectedAllReports = selectedAllReports;
      this.selectedReports = selectedAllReports
        ? this.reportsList.map(item => item.key) : [];
    },
    onClickSelectReports(selectedValue) {
      const exists = this.selectedReports.includes(selectedValue);
      if (exists) {
        this.selectedReports = this.selectedReports.filter(s => s !== selectedValue);
      } else {
        this.selectedReports.push(selectedValue);
      }
      this.selectedAllReports = this.selectedReports.length === this.reportsList.length;
    },
    dropValues() {
      if (this.inProgressStatus) {
        this.forceVisible = true;
        this.cancelRequest();
      }
    },
    async resetData() {
      const { url } = this.selectedAppData;
      await this.getScenarioList(url);
      await this.getTableauList(url);
      this.activeTabIndex = 0;
      if (this.selectedApp.loginWarning) this.optionsSelected = this.optionsSelected.slice(0, 1);
      this.selectedAllScenario = true;
      this.selectedAllReports = true;
      this.selectedScenario = this.scenarioList.map(item => item.key);
      this.selectedReports = this.reportsList.map(item => item.key);
      this.headerText = this.$constant.downloadOptions[0].headerText;
    },
    setShowModal(value) {
      if (value) { this.resetData(); }
      this.showModalPopup = value;
    },
    disableElements(index) {
      return !!(index && this.selectedApp.loginWarning);
    },
  },
  computed: {
    ...mapState({
      selectedApp: state => state.applicationList.selectedApp,
    }),
    selectedAppData() {
      return this.$store.getters['applicationList/getSelectedApp'] || {};
    },
    scenarioList() {
      return this.selectedApp.scenarioList;
    },
    reportsList() {
      return this.selectedApp.tableauList || [];
    },
    isScenario() {
      return this.activeTabIndex === 1;
    },
    isReports() {
      return this.activeTabIndex === 2;
    },
    currentList() {
      return this.isScenario ? this.scenarioList : this.reportsList;
    },
    selectedTab() {
      return this.$constant.downloadOptions[this.activeTabIndex].tab;
    },
    isConfirmDisabled() {
      if (!this.optionsSelected.length) return true;
      if (this.optionsSelected.includes(this.$constant.downloadOptions[0].tab)) return false;
      if (this.optionsSelected.includes(this.$constant.downloadOptions[1].tab) && this.selectedScenario.length) return false;
      return !(this.optionsSelected.includes(this.$constant.downloadOptions[2].tab) && this.selectedReports.length);
    },
  },
};
</script>

<style lang="scss">
  .select-checkbox-title {
    color: var(--theme-primary-text);
  }
  .select-item-report {
    .v-label {
      width: 30rem !important;
    }
    img {
      margin-left: 1rem;
    }
  }
  .body-description b {
    color: var(--theme-primary);
  }
</style>

<style scoped lang="scss">
  .download-options {
    width: 20rem;
    padding-top: .8rem;
    border-right: 1px solid var(--theme-border-grey);
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--theme-primary);
    .download-option {
      margin-right: 0rem;
      padding: .8rem 1.6rem;
      cursor: pointer;
      &.active {
        color: var(--theme-secondary);
        background-color: rgba(var(--theme-secondary-rgb), 0.08);
      }
      &.disabled {
        color: var(--theme-support);
      }
      .download-checkbox {
        margin: 0.4rem 0.4rem 0rem 0rem;
      }
    }
    .login-warning-box {
      padding: 2rem;
      width: 100%;
      .login-warning {
        background: rgba(var(--theme-warning-rgb), 0.1);
        border-radius: 2px;
        border: 1px solid var(--theme-warning);
        height: 12rem;
        width: 100%;
        padding: 1.5rem;
        font-size: 1rem;
        .login-warning-head {
          width: 100%;
          margin-left: unset;
          .login-warning-head-icon {
            font-size: 1.6rem;
            margin-right: 0.7rem;
            color: var(--theme-warning);
          }
          .login-warning-head-text {
            font-weight: 600;
          }
        }
        .login-warning-body {
          margin-top: 1rem;
          font-weight: 500;
        }
      }
    }
  }

  .download-card-body {
    height: 30rem;
    width: 48rem;
    padding: 1.6rem 0 1.6rem 2rem;
    .body-title {
      font-size: 1.3rem;
      padding-bottom: 1rem;
      font-weight: 600;
      color: var(--theme-info);
    }
    .body-description {
      font-size: 1rem;
      padding-bottom: 1rem;
      font-weight: 500;
      color: var(--theme-primary);
    }
  }

  .download-card-actions {
    padding: 1.4rem
  }
</style>
