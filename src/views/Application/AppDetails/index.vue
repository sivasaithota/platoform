<!--App details page-->

<template>
  <div class="app-details position-relative">

    <!--Drawer with form to edit app details-->
    <opex-drawer
      v-if="appName"
      v-model="drawerVisible"
      :title="$route.name"
      :subtitle="'edit ' + $route.name"
      icon="v2-app-info"
    >
      <edit-app-details
        v-if="drawerVisible"
        @close="drawerVisible = false"
      />
    </opex-drawer>

    <section class="app-content">
      <!--Header-->
      <v-layout
        class="app-content-header"
        align-center
      >
        <h3>
          {{ $route.name }}
        </h3>
      </v-layout>

      <!--Skeleton loader card-->
      <opex-card
        disabled
        class="justify-space-between"
        v-if="!appName"
      >
        <v-skeleton-loader
          v-for="n in 3"
          :key="n"
          class="card-skeleton card-skeleton-darkened app-details-skeleton"
          type="list-item-two-line"
        />
      </opex-card>

      <!--Card with app details-->
      <opex-card
        v-else
        class="justify-space-between cursor-pointer"
        @click.native="drawerVisible = true"
      >
        <!--App name-->
        <div class="app-details-value">
          <span class="opex-label">
            {{ $constant.appDetailsLabels.name }}
          </span>
          <opex-tooltip
            bottom
            class="opex-card-value"
            :message="$message.appDetails.nameDescription"
          >
            <template #activator>
              <span class="opex-card-value">
                {{ appName }}
              </span>
            </template>
          </opex-tooltip>
        </div>

        <!--App display name-->
        <div class="app-details-value">
          <span class="opex-label">
            {{ $constant.appDetailsLabels.displayName }}
          </span>
          <opex-tooltip
            bottom
            class="opex-card-value"
            :message="$message.appDetails.displayNameDescription"
          >
            <template #activator>
              <span class="opex-card-value">
                {{ appDisplayName }}
              </span>
            </template>
          </opex-tooltip>
        </div>

        <!--App description with tooltip-->
        <div class="app-details-value app-description">
          <span class="opex-label">
            {{ $constant.appDetailsLabels.description }}
          </span>

          <opex-tooltip
            v-if="appDescription"
            bottom
            color="primary"
            :message="$message.appDetails.descriptionDescription"
          >
            <template #activator>
              <span class="opex-card-value">
                {{ appDescription }}
              </span>
            </template>
          </opex-tooltip>

          <!--No app description placeholder-->
          <span
            v-else
            class="opex-card-value no-description"
          >
              {{ $message.appDetails.noDescription }}
          </span>
        </div>
      </opex-card>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditAppDetails from './components/EditAppDetails/index';

export default {
  name: 'AppDetails',

  components: { EditAppDetails },

  data() {
    return {
      drawerVisible: false,
    };
  },

  computed: {
    ...mapState({
      appName: state => state.application.name,
      appDisplayName: state => state.application.displayName,
      appDescription: state => state.application.description,
    }),
  },
};
</script>

<style scoped lang="scss">
  .app-details {
    .app-details-value {
      max-width: 25%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .app-description {
      max-width: 50%;
      margin-right: 2rem;
    }

    .no-description {
      opacity: 0.4;
    }
  }
  .opex-card-value {
    font-size: 1rem;
    color: var(--theme-secondary-text);
    font-weight: 400;
  }
</style>

<style lang="scss">
  .card-skeleton.app-details-skeleton {
    width: 20%;

    .v-skeleton-loader__list-item-two-line {
      padding: 0;
    }
  }
</style>
