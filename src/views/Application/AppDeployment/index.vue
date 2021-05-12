<!--Application Deployment page component-->

<template>
  <div class="position-relative">
    <!--Drawer with available themes list and form to create a custom theme-->
    <opex-drawer
      v-model="themesDrawerVisible"
      title="app deployment"
      subtitle="application theme"
      icon="v2-app-deployment"
    >
      <opex-drawer-tabs
        v-model="activeDrawerTabIndex"
        :tabs="themeDrawerTabs"
      >
        <themes-drawer
          v-if="themesDrawerVisible"
          :slot="themeDrawerTabs[0]"
          @close="themesDrawerVisible = false"
        />
        <custom-theme-drawer
          v-if="themesDrawerVisible"
          :slot="themeDrawerTabs[1]"
          @close="themesDrawerVisible = false"
        />
      </opex-drawer-tabs>
    </opex-drawer>

    <!--dialog with deployment related info-->
    <deployment-dialog
      @close="deployDialogVisible = false"
      :title="$route.name"
      :sub-title="$message.appDeployment.deployDialogSubTitle"
      :show-modal-dialog="deployDialogVisible"
      :disabled-button="true"
      :is-restore="isRestore"
      @setShowModal="setShowModal"
      modal-width="60rem"
    />

    <section class="app-content">
      <v-layout
        class="app-content-header"
        align-center
      >
        <h3>
          {{ $route.name }}
        </h3>

        <v-spacer/>
        <!--(re)deploy button with confirm popup-->
        <opex-popup
          v-if="!loading && isLatestVersion"
          title="App deployment"
          :message="$message.appDeployment.startDeployment"
          button-name="deploy"
          icon="app-deploy"
          @confirm="deployDialogVisible = true"
        >
          <v-btn
          color="secondary"
          :disabled="!isLatestVersion"
          >
            {{ isDeployed ? 're-' : '' }}deploy app
          </v-btn>
        </opex-popup>

        <opex-tooltip bottom :message="$message.appDeployment.upgradeApp">
          <template #activator>
            <v-btn
              v-if="!loading && !isLatestVersion"
              color="secondary"
              :disabled="!isLatestVersion"
            >
              {{ isDeployed ? 're-' : '' }}deploy app
            </v-btn>
          </template>
        </opex-tooltip>

      </v-layout>

      <!--Skeleton loader cards-->
      <template v-if="loading">
        <opex-card
          v-for="n in 3"
          :key="n"
          disabled
          class="justify-space-between"
        >
          <v-skeleton-loader
            v-for="n in 3"
            :key="n"
            class="card-skeleton card-skeleton-darkened app-deployment-skeleton"
            type="list-item-two-line"
          />
        </opex-card>
      </template>

      <!--App segments card-->
      <template v-else>
        <opex-card
          disabled
          class="app-segments"
        >
          <v-form v-model="segmentsFormValid">
            <span class="opex-label">application segments</span>

          <!--Inputs to edit app segments-->
          <v-layout>
            <opex-input
              v-for="(segment, index) in appSegments"
              :key="index"
              :value="segment.name"
              :placeholder="segment.type"
              @blur="changeSegmentName($event, index)"
              required
            >
              <template #append>
                <v-layout
                  align-center
                  class="app-segment-append"
                >
                  <!--Visibility of the segment-->
                  <button
                    v-if="segment.isVisible"
                    type="button"
                    class="v-icon v-icon--link"
                    @click="changeSegmentVisibility(index, false)"
                  >
                    <opex-icon name="v2-eye"/>
                  </button>
                  <button
                    v-if="!segment.isVisible"
                    type="button"
                    class="v-icon v-icon--link support--text"
                    @click="changeSegmentVisibility(index, true)"
                  >
                    <opex-icon name="v2-eye-blocked"/>
                  </button>

                    <!--If the segment default-->
                    <span
                      class="app-segment-default"
                      :class="{ default: segment.isDefault, disabled: !segment.isVisible }"
                      @click="changeDefaultSegment(index)"
                    >
                      default
                    </span>
                  </v-layout>
                </template>
              </opex-input>
            </v-layout>
          </v-form>

          <!--Icon with tooltip containing info about app segments section-->
          <v-spacer/>
          <opex-tooltip
            left
            color="info"
            title="Help guide"
          >
            <template #activator>
              <opex-icon name="info-fill"/>
            </template>

            <p
              class="app-segments-info"
              v-for="info in $message.appSegmentsInfo"
              :key="info.subject"
            >
              {{ info.start }}
              <span class="segments-info-subject">{{ info.subject }}</span>
              {{ info.end }}
            </p>
          </opex-tooltip>
        </opex-card>

        <!--Chosen theme-->
        <opex-card
          class="theme_card"
          :class="{ selected: themesDrawerVisible }"
          @click.native="themesDrawerVisible = true"
        >
          <v-layout
            align-start
            justify-start
            column
            fill-height
          >
            <p class="opex-label">application theme</p>
            <v-layout
              v-if="appTheme"
              justify-start
              align-center
              fill-height
            >
              <img
                v-if="appTheme.images"
                :src="appTheme.images.backgroundUrl"
                :alt="appTheme.name"
              >
              <v-layout column>
                <v-layout v-if="appTheme.colorSchemes">
                  <div
                    class="current_color"
                    :style="{'background-color': appTheme.colorSchemes[colorSchemeIndex].mainColor}"
                  ></div>
                  <div
                    class="current_color"
                    :style="{'background-color': appTheme.colorSchemes[colorSchemeIndex].extraColor}"
                  ></div>
                </v-layout>
                <h3 v-if="appTheme.name">{{ appTheme.name }}</h3>
              </v-layout>
            </v-layout>
          </v-layout>
        </opex-card>

        <!--Make App private. Hidden in case of app permissions implementation-->
        <!-- <opex-card
          class="app-privacy"
          disabled
        >
          <v-layout
            column
            fill-height
          >
            <p class="opex-label">Restricted Access</p>
            <opex-switch
              hide-details
              :value="isPrivate"
              :label="$message.appDeployment.privacyApp"
              label-transform="initial"
              @change="changeAppPrivacy"
            />
          </v-layout>
        </opex-card> -->
      </template>
    </section>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import {
  cloneDeep,
  forOwn,
  sortBy,
  toPairs,
} from 'lodash';

import DeploymentDialog from './components/DeploymentDialog';
import ThemesDrawer from './components/ThemesDrawer';
import CustomThemeDrawer from './components/CustomThemeDrawer/index';

export default {
  name: 'AppDeployment',
  components: {
    DeploymentDialog,
    ThemesDrawer,
    CustomThemeDrawer,
  },

  data() {
    return {
      appId: this.$route.params.id,
      loading: true,
      themesDrawerVisible: false,
      deployDialogVisible: false,
      isRestore: false,
      segmentsFormValid: true,

      themeDrawerTabs: ['Available Themes', 'Custom theme'],
      activeDrawerTabIndex: 0,
    };
  },

  computed: {
    ...mapState({
      appTheme: state => state.application.appTheme,
      colorSchemeIndex: state => state.application.colorSchemeIndex,
      appSegments: state => state.application.segments,
      appStatus: state => state.application.status,
      isPrivate: state => state.application.isPrivate,
      isLatestVersion: state => {
        return (
          state.applicationList.info.latestACVersion
            && (
              state.application.version === state.applicationList.info.latestACVersion || !state.application.version
            )
        );
      },
    }),

    isDeployed() {
      return this.appStatus !== this.$constant.deployStatuses.inactive
        && this.appStatus !== this.$constant.deployStatuses.inProgress;
    },
  },
  methods: {
    ...mapActions({
      getThemes: 'application/getThemes',
      saveDetails: 'application/saveDetails',
      showSnackbar: 'snackbar/show',
      getInfo: 'applicationList/getInfo',
    }),

    // Switching the default segment
    changeDefaultSegment(segmentIndex) {
      const mutableSegments = cloneDeep(this.appSegments);
      forOwn(mutableSegments, (value) => {
        value.isDefault = false;
      });
      mutableSegments[segmentIndex].isDefault = true;
      // Call function to update data
      this.saveSegment(mutableSegments);
    },

    // Switching the segment visibility
    changeSegmentVisibility(segmentIndex, value) {
      const mutableSegments = cloneDeep(this.appSegments);
      const reducer = (accumulator, key) => accumulator + ((!value && !mutableSegments[key].isVisible) ? 0 : 1);
      const mutableSegmentsKeys = Object.keys(mutableSegments);
      const visibleSumm = mutableSegmentsKeys.reduce(reducer, 0);
      // It should be at least 1 visible segment
      if (visibleSumm > 1) {
        mutableSegments[segmentIndex].isVisible = value;
        // Find new default if needed
        if (mutableSegments[segmentIndex].isDefault
          && !value) {
          let noDefault = true;
          const mutableSegmentsArr = sortBy(toPairs(mutableSegments), element => element[1].order);
          mutableSegmentsArr.forEach(element => {
            if (element[1].isVisible
              && noDefault) {
              mutableSegments[element[0]].isDefault = true;
              mutableSegments[segmentIndex].isDefault = false;
              noDefault = false;
            }
          });
        }
        // Call function to update data
        this.saveSegment(mutableSegments);
      } else {
        this.showSnackbar({
          type: this.$constant.snackbarTypes.error,
          title: this.$message.appDeployment.allSegmentsInvisibleErrorTitle,
          message: this.$message.appDeployment.allSegmentsInvisibleErrorMessage,
        });
      }
    },

    // Changing the segment name
    changeSegmentName({ target }, segmentIndex) {
      const mutableSegments = cloneDeep(this.appSegments);
      // Skipping if value was not changed
      if (mutableSegments[segmentIndex].name === target.value) return;

      mutableSegments[segmentIndex].name = target.value;
      // Call function to update data
      this.saveSegment(mutableSegments);
    },

    // Sending segment data to the server
    saveSegment(value) {
      this.saveDetails({
        appId: this.appId,
        params: { segments: value },
        silent: true,
      });
    },

    // Changing app privacy
    changeAppPrivacy(value) {
      this.saveDetails({
        params: { isPrivate: value },
        silent: true,
      });
    },

    // hede modal
    setShowModal(value) {
      this.deployDialogVisible = value;
    },
  },

  mounted() {
    this.getInfo();
    // Fetching deployment settings data and list of themes from the server
    this.getThemes().then(() => {
      this.loading = false;
      // Selecting the Custom Themes tab in the drawer if app theme is a custom one
      if (this.appTheme.group === this.$constant.themeGroups.custom) this.activeDrawerTabIndex = 1;

      // Starting the deployment if the immediate deployment is requested
      if (this.$route.path.includes('/immediate')) {
        this.deployDialogVisible = true;
        this.$router.replace({
          name: 'app deployment',
        });
      } else if (this.$route.path.includes('/restore')) { // Starting the restore deployment if the restore deployment is requested
        this.isRestore = true;
        this.deployDialogVisible = true;
      }
    });
  },
};

</script>

<style lang="scss">
  .card-skeleton.app-deployment-skeleton {
    margin: 1.5rem 0;
    width: 20%;
  }

  div.app-segments {
    div.v-input.v-text-field {
      padding: .6rem 1.2rem 0 0;
    }
  }

  p.app-segments-info {
    margin: .2rem 0;
    font-size: 0.8rem;

    .segments-info-subject {
      text-transform: uppercase;
      font-weight: 600;
    }
  }
</style>

<style scoped lang="scss">
  .app-content-header {
    min-height: 4.4rem;
  }

  .opex-card.theme_card {
    border-left: .3rem solid transparent;
    cursor: pointer;
    &.selected {
      border-left-color: var(--theme-secondary);
    }
    .opex-label {
      margin-bottom: .625rem;
    }
    img {
      width: 12rem;
      box-shadow: 1px 1px 2px 0 var(--theme-background-grey);
      border: solid 1px var(--theme-border-grey);
      margin-right: .9rem;
    }
  }
  .current_color {
    width: 2rem;
    height: 2rem;
    &:first-child {
      margin-right: .625rem;
    }
  }

  div.app-segments {
    .icon-info-fill {
      font-size: 2.4rem;
      color: var(--theme-secondary);
    }

    div.app-segment-append i.v-icon {
      width: 1.2rem;

      &:before {
        font-size: 1rem;
      }
    }

    .app-segment-default {
      margin: 0 .4rem 0 .6rem;
      padding: .2rem .3rem;
      font-size: .7rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--theme-primary-text);
      background: var(--theme-support);
      cursor: pointer;

      &.default {
        background: var(--theme-secondary);
      }

      &.disabled {
        pointer-events: none;
      }
    }
  }

  div.app-privacy {
    .opex-label {
      margin-bottom: 0;
    }

    .v-input--switch {
      padding: 0;
    }
  }
</style>
