<!--Component for Custom URL tab on the Deployment Option page-->

<template>
  <div>
    <!--Updating url drawer-->
    <opex-drawer
      v-model="urlDrawerVisible"
      title="deployment options"
      subtitle="custom url"
      icon="v2-deployment-options"
    >
      <custom-url-drawer
        v-if="urlDrawerVisible"
        :domain-url="origin"
        :app-url="appUrl"
        @close="closeDrawer"
      />
    </opex-drawer>

    <v-layout
      class="app-content-header"
      align-center
    >
      <h3>
        {{ tabName }}
      </h3>
    </v-layout>

    <opex-card
      class="justify-space-between"
      :class="{ selected: urlDrawerVisible }"
      @click.native="updateUrl"
    >
      <div>
        <span class="opex-label">application custom url</span>
        <span class="opex-card-value">
          {{ customUrl }}
        </span>
      </div>
    </opex-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import CustomUrlDrawer from '../CustomUrlDrawer/index';

export default {
  name: 'CustomUrl',

  props: {
    tabName: {
      type: String,
      default: null,
    },
  },

  components: { CustomUrlDrawer },

  data() {
    return {
      urlDrawerVisible: false,
      origin: `${window.location.origin}/`,
    };
  },

  computed: {
    ...mapState({
      appUrl: state => state.application.url,
    }),

    // Generate app link
    customUrl() {
      return this.origin + this.appUrl ? this.appUrl : '';
    },
  },

  methods: {
    // Update app url button click handler
    updateUrl() {
      if (this.urlDrawerVisible) return;
      this.urlDrawerVisible = true;
    },

    // Close the drawer
    closeDrawer() {
      this.urlDrawerVisible = false;
    },
  },
};
</script>
