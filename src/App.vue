<template>
  <v-app id="app" :style="cssProps">
    <router-view/>

    <!--Customized Vuetify snackbar component.
        Used only once, should NOT be used anywhere else.
        Snackbar itself should be called only using the vuex module snackbar-->
    <opex-snackbar/>
  </v-app>
</template>

<script>
import _ from 'lodash';
import { mapState, mapActions } from 'vuex';
import OpexSnackbar from '@/components/OpexSnackbar';

export default {
  name: 'App',
  components: { OpexSnackbar },

  computed: mapState({
    cssProps: state => _.mapKeys(state.theme.colors, (val, key) => `--theme-${key}`),
  }),
  methods: {
    ...mapActions({
      initTheme: 'theme/initTheme',
    }),
  },
  mounted() {
    this.initTheme();
  },
};
</script>

<style lang="scss">
  @import 'styles/main';
</style>
