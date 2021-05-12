<!--Spinner until the required data is fetched from the server-->

<template>
  <v-progress-circular
    v-if="visible"
    class="fetching-data-spinner"
    indeterminate
    color="secondary"
    style="width: 3rem; height: 3rem"
  />
</template>

<script>
export default {
  name: 'FetchingDataSpinner',

  props: {
    visible: Boolean,
  },
};
</script>

<style scoped lang="scss">
  .fetching-data-spinner {
    grid-area: main-content;
    margin: 2rem auto;
  }
</style>
