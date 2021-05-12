<!--Banner with info that updates made on the page will be reflected in the app immediately-->

<template>
  <v-layout
    justify-center
    class="immediate-update-banner"
  >
    <v-layout class="immediate-update-text">
      <opex-icon name="v2-app-info"/>
      {{ $message.common.immediateUpdate }}
    </v-layout>
  </v-layout>
</template>

<style scoped lang="scss">
  .immediate-update-banner {
    margin-top: 2rem;

    .immediate-update-text {
      flex-grow: 0;
      padding: 0.8rem 1.6rem;
      border-radius: 0.4rem;
      font-weight: 600;
      background-color: rgba(var(--theme-secondary-rgb), 0.1);
      color: var(--theme-secondary);
    }

    .icon-v2-app-info {
      margin-right: 0.8rem;
      font-size: 1.4rem;
    }
  }
</style>
