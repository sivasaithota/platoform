<!--Drawer tabs component
    Expects the mandatory tabs array property and slots with names
    equal to the appropriate elements in the tabs array
-->

<template>
  <v-tabs
    v-model="model"
    class="opex-drawer-tabs"
    color="background"
    slider-color="secondary"
    grow
  >
    <template v-for="(tab, index) in tabs">
      <!--Tabs-->
      <v-tab :key="index">
        {{ tab }}
      </v-tab>

      <!--Tabs content-->
      <v-tab-item :key="index">
        <slot :name="tab"/>
      </v-tab-item>
    </template>
  </v-tabs>
</template>

<script>
export default {
  name: 'OpexDrawerTabs',

  props: {
    value: {
      type: Number,
      default: 0,
    },

    tabs: {
      type: Array,
      required: true,
    },
  },

  computed: {
    // Active tab
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>

<style lang="scss">
  .opex-drawer-tabs.v-tabs {
    margin-right: -$drawer-indent;
    margin-left: -$drawer-indent;
    width: calc(100% + #{$drawer-indent} + #{$drawer-indent});
    .v-tabs-bar {
      height: 100%;
      margin-top: -1rem;
      background-color: var(--theme-background);
    }

    .v-tab {
      padding: 0.8rem;
      font-size: 1rem;
      font-weight: 700;
      text-transform: capitalize;
      color: var(--theme-text);
    }

    .v-tab--active{
      color: var(--theme-secondary);
    }

    .v-tabs-items {
      padding-right: $drawer-indent;
      padding-left: $drawer-indent;
      padding-top: $drawer-indent;
    }
  }
</style>
