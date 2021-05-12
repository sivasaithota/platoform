<!--Customized Vuetify snackbar. Called using vuex module snackbar-->

<template>
  <v-snackbar
    top
    multi-line
    vertical
    color="white"
    v-model="snackbar"
    :timeout="timeout"
  >
    <!--Snackbar content consists of the icon, title, message and close icon-->
    <v-layout
      align-start
      justify-start
      class="opex-snackbar"
      :style="{'border-top': `0.3rem solid var(--theme-${type})`}"
    >
      <opex-icon
        :name="icon"
        :style="{color: `var(--theme-${type})`}"
      />

      <div class="opex-snackbar-content">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
      </div>

      <v-spacer/>
      <opex-icon
        class="close-icon-btn"
        name="close"
        :style="{'background-color': `var(--theme-${type})`}"
        @click.native="snackbar = false"
      />
    </v-layout>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'opex-snackbar',

  computed: {
    // Computed property snackbar from vuex with getter and setter for managing the visibility of
    // the snackbar
    snackbar: {
      get() {
        return this.$store.state.snackbar.isVisible;
      },
      set() {
        this.$store.commit('snackbar/hide');
      },
    },

    // Snackbar details from vuex
    ...mapState('snackbar', {
      type: state => state.type,
      title: state => state.title,
      message: state => state.message,
      timeout: state => state.timeout,
    }),

    // Icon type depends on the snackbar type
    icon() {
      return this.type === this.$constant.snackbarTypes.success ? 'success-fill' : 'info-fill';
    },
  },
};
</script>

<style scoped lang="scss">
  .opex-snackbar {
    color: var(--theme-secondary-text);
    padding: 0.8rem;

    i {
      font-size: 1.8rem;

      &.close-icon-btn {
        margin-top: 0.3rem;
        padding: 0.1rem;
        opacity: 0.6;
        color: var(--theme-primary-text);
      }
    }

    .opex-snackbar-content {
      max-width: 20rem;

      h3 {
        margin: 0 0.8rem 0.6rem 0.4rem;
      }
    }

    h3 {
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
      font-weight: bold;
  }

    p {
      margin: 0;
      font-size: 1rem;
      white-space: pre-line;
      word-wrap: break-word;
    }
  }
</style>

<!--Rewriting vuetify snackbar styles-->
<style lang="scss">
  .v-snack {
    &.v-snack--top {
      transform: translateY(2rem);
    }

    .v-sheet.v-snack__wrapper {
      min-width: 15rem;
      max-width: 25rem;
      border-radius: 0;
    }

    div.v-snack__content {
      padding: 0;
    }
  }
</style>
