<!--Upload configuration files-->
<template>
  <div class="position-relative">
    <!--Upload file drawer-->
    <opex-drawer
      v-model="configDrawerVisible"
      title="config upload"
      subtitle="add configuration file"
      icon="v2-config-file"
    >
      <upload-config
        v-if="configDrawerVisible"
        @uploaded="addConfig"
      />
    </opex-drawer>

    <section class="app-content app-content--full">
      <v-layout
        class="app-content-header"
        align-center
      >
        <h3>
          {{ $route.name }}
        </h3>
        <v-spacer/>
        <v-btn
          color="secondary"
          @click="addConfigFile"
        >
          add config file
        </v-btn>
      </v-layout>

      <!--List of uploaded files-->
      <v-layout v-if="configFiles.length" column>
        <opex-card
          class="justify-space-between"
          v-for="(config, index) in configFiles"
          :key="index"
        >
          <v-layout align-center>
              <img
                :src="configIcon"
                alt="uploaded"
                class="card-icon"
              >
            <div>
              <span class="opex-label">configuration file</span>
              <span class="opex-card-value">
                {{ config }}
              </span>
            </div>
          </v-layout>
          <v-spacer/>
          <v-layout
            align-center
            class="success-label"
          >
            <opex-icon name="success"/>
          </v-layout>
        </opex-card>
      </v-layout>

      <v-layout
        v-else
        align-center
        justify-center
        column
        fill-height
        class="app-container--empty"
      >
        <!--TODO update svg color-->
        <img
          :src="configIcon"
          alt="Empty list"
          class="icon"
        >
        <h2 v-html="$message.emptyList.config"></h2>
      </v-layout>
    </section>
  </div>
</template>

<script>
import configIcon from '@/assets/svg/config-file.svg';
import UploadConfig from './components/UploadConfig/index';

export default {
  name: 'ConfigUpload',
  components: { UploadConfig },
  data() {
    return {
      configDrawerVisible: false,
      configFiles: [],
      configIcon,
    };
  },
  methods: {
    // Add configuration button click handler
    addConfigFile() {
      if (this.configDrawerVisible) return;
      this.configDrawerVisible = true;
    },

    // Update list of uploaded files and close drawer
    addConfig(files) {
      this.configFiles = this.configFiles.concat(files);
      this.configDrawerVisible = false;
    },
  },
};

</script>

<style scoped lang="scss">
  .card-icon {
    margin-right: 1rem;
  }

  .success-label {
    flex-grow: 0;
    border-radius: 50%;
    box-shadow: 0 2px 4px 0 var(--theme-background-grey);
    background-color: var(--theme-success);
    color: var(--theme-primary-text);
    padding: .12rem;
  }
</style>
