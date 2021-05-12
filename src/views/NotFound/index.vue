<!--Not found page-->

<template>
  <v-layout
    class="not-found-page"
    justify-space-between
    align-center
  >
    <div class="not-found-content">
      <h4 class="not-found-code">{{ $message.notFoundPage.code }}</h4>
      <h1 class="not-found-header">{{ $message.notFoundPage.header }}</h1>
      <p class="not-found-text">{{ $message.notFoundPage.text }}</p>

      <v-btn
        large
        color="secondary"
        to="/"
      >
        {{ $message.notFoundPage.toHome }}
      </v-btn>

      <v-btn
        text
        large
        color="secondary"
        @click="$router.go(-1)"
      >
        {{ $message.notFoundPage.toPrevPage }}
      </v-btn>
    </div>

    <img
      class="not-found-image"
      src="@/assets/svg/404.svg"
      alt="404"
    >
  </v-layout>
</template>

<style scoped lang="scss">
  .not-found-page {
    height: 100vh;
    width: 70%;
    margin: auto;

    // 50em ~= 800px
    @media (max-width: 50em) {
      width: 90%;
    }
  }

  .not-found-content {
    margin-right: 3rem;
    width: 70%;
  }

  .not-found-code {
    margin: 0;
    font-size: 1.2rem;
    font-weight: normal;
  }

  .not-found-header {
    margin: 1.8rem 0;
    font-size: 2.4rem;
  }

  .not-found-text {
    font-size: 1.4rem;
    margin: 1.8rem 0;
  }

  .not-found-image {
    width: 18rem;
  }

  .v-btn {
    margin: 0 1rem 0 0;
    text-transform: none;
  }
</style>
