<!--Tooltip component based on the Vuetify tooltip
    Tooltip content can be passed via message property or as a content of the default slot-->
<!--IMPORTANT! Should wrap an activator element with property slot="activator"-->

<template>
  <v-tooltip
    transition="slide-y-transition"
    open-delay="200"
    :color="color"
    :top="top"
    :right="right"
    :bottom="bottom"
    :left="left"
  >
    <!--Using the passed slot content as the activator-->
    <template #activator="{ on }">
      <span v-on="on">
        <slot name="activator"/>
      </span>
    </template>

    <!--Tooltip header consists of an icon and title-->
    <v-layout
      v-if="title"
      align-center
      class="opex-tooltip-header"
      :style="{color: `var(--theme-${fontColor}`}"
    >
      <opex-icon
        class="opex-tooltip-icon"
        v-if="icon"
        :name="icon"
      />
      {{ title }}
    </v-layout>

    <!--Tooltip content - message or/and content of the default slot-->
    <p
      v-if="message"
      class="opex-tooltip-message"
      :style="{color: fontColor}"
    >
      {{ message }}
    </p>

    <slot></slot>
  </v-tooltip>
</template>

<script>
export default {
  name: 'opex-tooltip',

  props: {
    color: {
      type: String,
      default: 'info',
    },
    fontColor: {
      type: String,
      default: 'white',
    },

    icon: String,
    title: String,
    message: String,

    top: Boolean,
    right: Boolean,
    bottom: Boolean,
    left: Boolean,
  },
};
</script>

<style scoped lang="scss">
  .opex-tooltip-header {
    font-size: 1rem;
    font-weight: bold;

    .opex-tooltip-icon {
      font-size: 1.8rem;
      margin: 0 0.2rem 0.2rem 0;
    }
  }

  .opex-tooltip-message {
    font-size: 1rem;
    line-height: 1.5;
    margin: 0;
  }

  // Rewriting Vuetify tooltip styles
  div.v-tooltip__content {
    border-radius: 0;
    padding: 0.6rem;
    max-width: 25rem;
    box-shadow: 0 0.15rem 0.05rem -0.1rem rgba(0,0,0,0.2),
      0 0.1rem 0.1rem 0 rgba(0,0,0,0.14),
      0 0.05rem 0.3rem 0 rgba(0,0,0,0.12);

    &.menuable__content__active {
      opacity: 1 !important;
    }
  }
</style>
