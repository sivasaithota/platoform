<!--Deployment Options page component-->

<template>
  <div class="position-relative">

    <opex-submenu
      title="Deployment Options"
      :items="submenuItems"
      v-model="submenuSelectedItem"
    />

    <section class="app-content">
      <component
        :is="currentTabComponent"
        :tab-name="currentTabName"></component>
    </section>
  </div>
</template>

<script>
import CustomUrl from './components/CustomUrl/index';

export default {
  name: 'DeploymentOptions',
  components: { CustomUrl },
  data() {
    return {
      submenuItems: [
        {
          icon: 'v2-custom-url',
          name: 'Custom URL',
          component: 'CustomUrl',
        },
      ],
      submenuSelectedItem: 0,
    };
  },

  computed: {
    // Get component name
    currentTabComponent() {
      return this.submenuItems[this.submenuSelectedItem].component;
    },
    // Get title for header
    currentTabName() {
      return this.submenuItems[this.submenuSelectedItem].name;
    },
  },
};

</script>
