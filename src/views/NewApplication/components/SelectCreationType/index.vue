<template>
  <div
    class="select-type-card"
    @click="$emit('click')"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <v-layout align-center>
      <v-layout
        align-center
        justify-center
        class="select-type-img"
      >
        <img :src="imgSrc" alt="create application"/>
      </v-layout>
      <div class="select-type-text">
        <h3>{{ title }}</h3>
        <span> {{ description }} </span>
      </div>
    </v-layout>
    <v-btn
      color="secondary"
      :disabled="!isHovered"
    >
      Continue
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    description: String,
    imgSrc: {
      type: String,
      required: true,
    },
  },
  name: 'SelectCreationType',
  data() {
    return {
      isHovered: false,
    };
  },
};
</script>

<style scoped lang="scss">
  $fullWidth: 32rem;
  $logoWidth: 4rem;
  $textWidth: $fullWidth - $logoWidth;
  $textPadding: 1rem;

  .select-type-card {
    padding: 1.5rem;
    border: 1px solid transparent;
    transition: all .3s;
    &:hover {
      cursor: pointer;
      box-shadow: 0 .5rem 1rem 0 rgba(0, 0, 0, 0.1);
      border: solid 1px rgba(151, 151, 151, 0.1);
    }
    button {
      margin-left: $logoWidth + $textPadding;
    }
    .select-type-text {
      line-height: 1;
      padding-left: $textPadding;
      width: $textWidth;
      h3 {
        color: var(--theme-secondary);
        padding-bottom: .4rem;
      }
      span {
        line-height: 1.5rem;
        font-size: .8rem;
        font-weight: 400;
      }
    }
    .select-type-img {
      width: $logoWidth;
      height: $logoWidth;
      background-color: var(--theme-support);
      border-radius: 50%;
      opacity: .3;
      img {
        max-width: 2rem;
        max-height: 2rem;
      }
    }
  }
</style>
