<!--Component with the form to update theme drawer on the app deployment page-->

<template>
  <v-form
    class="drawer-form"
    v-model="formValid"
  >
    <v-autocomplete
      color="secondary"
      v-model="currentTheme"
      :items="sortedGroups"
      item-text="name"
      item-value="name"
      label="select a theme"
      placeholder="Search for a Theme"
      return-object
      :rules="themeRules"
      required
      @change="colorSchemeIndex = 0"
    >
      <template #selection="data">
        <span class="autocomplete_item--selected">{{ data.item.name }}</span>
      </template>
      <template #item="data">
        <v-layout class="autocomplite_item">
          <img
            :src="data.item.images.backgroundUrl"
            :alt="data.item.name"
            class="theme_icon--list"
          >
          <v-list-item-content>
            <v-list-item-title v-html="data.item.name"></v-list-item-title>
          </v-list-item-content>
        </v-layout>
      </template>
    </v-autocomplete>

    <!--Background image preview-->
    <div
      v-if="currentTheme.images"
      class="static_info"
    >
      <p class="label">
        background image
      </p>
      <img
        :src="currentTheme.images.backgroundUrl"
        :alt="currentTheme.name"
        class="theme_icon--bg"
      >
    </div>
    <br>

    <!--Available color sets for chosen theme-->
    <div
      v-if="currentTheme && currentTheme.colorSchemes"
      class="static_info"
    >
      <p class="label">
        color theme
      </p>
      <v-radio-group
        row
        hide-details
        v-model="colorSchemeIndex"
        class="theme_container"
      >
        <v-radio
          v-for="(theme, index) in currentTheme.colorSchemes"
          :key="index"
          :value="index"
        >
          <template #label>
            <div
              class="current_color"
              :style="{'background-color': theme.mainColor}"
            ></div>
            <div
              class="current_color"
              :style="{'background-color': theme.extraColor}"
            ></div>
          </template>
        </v-radio>
      </v-radio-group>
    </div>
    <br>

    <!--Buttons-->
    <v-divider/>
    <v-layout justify-end>
      <v-btn
        color="secondary"
        small
        :disabled="!formValid"
        @click="saveChanges"
      >
        apply
      </v-btn>

      <v-btn
        text
        small
        color="primary"
        class="text-capitalize"
        @click="$emit('close')"
      >
        cancel
      </v-btn>
    </v-layout>
    <v-divider/>
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { groupBy } from 'lodash';

export default {
  name: 'ThemesDrawer',

  data() {
    return {
      currentTheme: {},
      colorSchemeIndex: null,
      formValid: true,
      sortedGroups: [],
      themeRules: [v => !!v || this.$message.common.mandatoryField],
    };
  },

  computed: {
    ...mapState({
      themeList: state => state.application.themeList,
    }),
  },

  methods: {
    ...mapActions({
      saveDetails: 'application/saveDetails',
    }),

    // Sending theme data to the server and close drawer
    saveChanges() {
      const theme = {
        id: this.currentTheme._id,
        colorIndex: this.colorSchemeIndex,
      };

      this.saveDetails({
        appId: this.$route.params.id,
        params: { theme },
      }).then(() => {
        this.$emit('close');
      });
    },
  },

  mounted() {
    // Parse theme list for the select field with theme header and divider
    const groups = groupBy(this.themeList, 'group');

    // Theme groups order priority
    const groupsOrder = {
      [this.$constant.themeGroups.custom]: 0,
      [this.$constant.themeGroups.default]: 1,
      [this.$constant.themeGroups.demo]: 2,
      [this.$constant.themeGroups.client]: 3,
    };

    // Fetching and sorting group names
    const keyNames = Object.keys(groups).sort((groupA, groupB) => groupsOrder[groupA] - groupsOrder[groupB]);

    // Add default theme
    keyNames.forEach(value => {
      this.sortedGroups.push({
        header: value,
      });
      this.sortedGroups.push({
        divider: true,
      });
      this.sortedGroups = this.sortedGroups.concat(groups[value]);
    });

    // Selected theme and color scheme index from the store
    this.currentTheme = this.$store.state.application.appTheme || {};
    this.colorSchemeIndex = this.$store.state.application.colorSchemeIndex;
  },
};
</script>

<style lang="scss">
  .autocomplite_item {
    border-bottom: 1px solid rgba(0, 64, 89, .1);
    padding-top: .625rem;
    padding-bottom: .625rem;
  }
  .autocomplete_item--selected {
    font-weight: 500;
    padding-left: .75rem;
    font-size: 1rem;
  }
  div.v-input.v-input--radio-group.theme_container div.v-input__slot div.v-radio {
    .v-input--selection-controls__input{
      display:none;
      + label {
        padding: 0.625rem;
        border: 1px solid var(--theme-border-grey);
        cursor: pointer;
        flex-direction: row;
        display: flex;
        box-shadow: 0 2px 4px 0 var(--theme-background-grey);
        background-color: var(--theme-secondary-background);
        margin: 0.625rem 1.25rem 0 0;
        height: auto;
      }
    }
    &.v-item--active > label {
      border-color: var(--theme-primary);
    }
  }
</style>

<style scoped lang="scss">
  .theme_icon--bg {
    border: solid 1px var(--theme-border-grey);
    width: 100%;
  }
  .theme_icon--list {
    width: 6.375rem;
    height: 3.56rem;
    margin-right: .375rem;
  }

  .current_color {
    width: 1.25rem;
    height: 1.25rem;
    &:first-child {
      margin-right: .625rem;
    }
  }
</style>
