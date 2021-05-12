<!--Parameters page component-->

<template>
  <div class="position-relative parameters-page">
    <section class="app-content app-content--full">
      <v-layout
        class="app-content-header"
        align-center
        justify-space-between
      >
        <h3>
          {{ $route.name }}
        </h3>

        <v-spacer/>

        <v-layout
          align-center
          justify-end
        >
          <opex-tooltip
            v-if="showParameterBlock"
            left
            :title="$message.parameters.previewTooltip"
            :message="$message.parameters.previewMessage"
            icon="info-fill"
          >
            <template #activator>
              <opex-icon
                name="info-fill"
                class="info-icon"
              />
            </template>
          </opex-tooltip>
          <h3
            v-if="showParameterBlock"
            class="preview-label"
          >
            Preview
          </h3>
        </v-layout>

        <opex-switch
          hide-details
          v-if="showParameterBlock"
          v-model="switchPreview"
        />
      </v-layout>

      <!--Parameters skeleton loader-->
      <v-layout
        v-if="loading"
        class="parameters-skeleton-container"
      >
        <v-layout
          column
          class="parameters-types-skeleton"
        >
          <v-skeleton-loader
            v-for="n in 6"
            :key="n"
            type="avatar"
          />
        </v-layout>

        <v-layout
          column
          class="parameters-skeleton"
        >
          <opex-card
            v-for="n in 4"
            :key="n"
          >
            <v-skeleton-loader
              class="card-skeleton card-skeleton-darkened"
              type="list-item-two-line"
            />
          </opex-card>
        </v-layout>
      </v-layout>

      <component :is="currentView" v-else/>
    </section>

  </div>
</template>

<script>
import { mapActions } from 'vuex';

import ParametersContent from './components/ParametersContent/index';
import ParametersPreview from './components/ParametersPreview/index';

export default {
  name: 'Parameters',
  components: { ParametersContent, ParametersPreview },
  data() {
    return {
      appId: 0,
      loading: true,
      switchPreview: false,
    };
  },

  methods: {
    ...mapActions('parameters', {
      getParameters: 'getParameters',
      getParamTypes: 'getParamTypes',
    }),
  },

  computed: {
    // Get component name
    currentView() {
      return !this.switchPreview ? 'ParametersContent' : 'ParametersPreview';
    },

    // Show the block if we have custom groups or some parameter in default group
    showParameterBlock() {
      return this.$store.getters['parameters/getVisibilityState'];
    },
  },

  mounted() {
    this.appId = this.$route.params.id;

    // Fetching parameters data from the server
    // Fetching parameters types from the server
    Promise.all([
      this.getParameters({ appId: this.appId }),
      this.getParamTypes(),
    ]).then(() => {
      this.loading = false;
    });
  },
};
</script>

<style scoped lang="scss">
  .preview-label {
    margin-right: 1rem;
    font-size: 1.2rem;
    font-weight: 400;
  }
  i.info-icon {
    font-size: 1.5rem;
    line-height: 1.9rem;
    color: var(--theme-secondary);
    cursor: pointer;
  }
</style>

<style lang="scss">
  div.parameters-page div.v-input--switch div.v-input__slot {
    flex-direction: row;
  }

  .parameters-skeleton-container {
    margin-top: 1.2rem;

    .parameters-types-skeleton {
      position: absolute;
      left: 13.7rem;
      flex-grow: 0;
      background: var(--theme-background-light);
      border: solid 1px var(--theme-border-light);

      .v-skeleton-loader {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 4.3rem;
        width: 4.3rem;
        background: var(--theme-background-light);
        border-bottom: solid 1px var(--theme-border-light);
        border-radius: 0;
        box-shadow: 0.1rem 0.1rem 0.5rem -0.1rem rgba(0, 0, 0, .09);

        .v-skeleton-loader__avatar {
          height: 2rem;
          width: 2rem;
          background: var(--theme-secondary);
          opacity: .16;
        }
      }
    }

    .parameters-skeleton {
      .opex-card {
        margin: 0;
        border-bottom: solid 1px var(--theme-border-light);

        &:nth-child(2) {
          margin-bottom: 1.2rem;
        }

        .v-skeleton-loader {
          width: 30%;

          .v-skeleton-loader__list-item-two-line {
            padding: 1.6rem 1rem;
          }
        }
      }
    }
  }
</style>
