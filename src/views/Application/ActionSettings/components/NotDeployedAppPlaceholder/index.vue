<!--Layout with info for the not deployed apps-->

<template>
  <v-layout
    column
    align-center
    justify-center
    class="not-deployed-app-placeholder"
  >
    <img
      class="not-deployed-image"
      src="@/assets/svg/rocket.svg"
      alt="rocket"
    />

    <h3 class="not-deployed-title">{{ $message.schedules.appNotDeployedTitle }}</h3>
    <p class="not-deployed-message">{{ $message.schedules.appNotDeployedMessage(item) }}</p>

    <router-link
      :to="{ name: 'app deployment' }"
      class="not-deployed-link"
    >
      {{ $message.schedules.appNotDeployedLink }}
    </router-link>
  </v-layout>
</template>

<script>
export default {
  name: 'NotDeployedAppPlaceholder',
  props: {
    item: String,
  },
};
</script>

<style scoped lang="scss">
  .not-deployed-app-placeholder {
    margin: 10rem auto;
    overflow: visible;
    max-width: 60%;
  }

  .not-deployed-image {
    width: 10rem;
    margin-bottom: 1.8rem;
  }

  .not-deployed-title {
    margin-bottom: .6rem;
    font-size: 2rem;
    font-weight: 600;
    opacity: .3;
  }

  .not-deployed-message {
    margin-bottom: 1.6rem;
    font-size: 1.2rem;
    font-weight: 500;
    text-align: center;
    opacity: .3;
  }

  .not-deployed-link {
    font-size: 1.2rem;
    font-weight: 500;
    text-decoration: none;
    color: var(--theme-secondary);

    &:hover {
      opacity: .7;
      text-decoration: underline;
    }
  }
</style>
