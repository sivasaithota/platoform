<!--Confirm popup component. Should be used as a wrapper for the activator element
    Activator is an element, which shows popup on clicking it-->

<template>
  <!--Vuetify menu is used as a base element for the popup-->
  <v-menu
    offset-y
    :left="left"
    transition="slide-y-transition"
    :close-on-content-click="false"
    v-model="isVisible"
    @click.native.stop
  >
    <!--Using the passed slot content as the activator-->
    <template #activator="{ on }">
      <span v-on="on">
        <slot/>
      </span>
    </template>

    <!--Popup content consists of the icon, title, message, confirm and cancel buttons-->
    <v-card
      class="opex-popup"
      color="white"
    >
      <div
        class="opex-popup-top"
        :style="{backgroundColor: `var(--theme-${color})`}"
      />
      <v-layout color="primary">
        <opex-icon
          class="opex-popup-icon"
          :name="icon"
          :style="{backgroundColor: `var(--theme-${color})`}"
        />

        <div>
          <v-layout justify-space-between>
            <h3 class="opex-popup-title">{{ title }}</h3>
            <!--Small cancel button-->
            <button
              class="opex-popup-button-cross"
              @click="close"
            >
              <opex-icon
                class="opex-popup-icon-close"
                name="close"
              />
            </button>
          </v-layout>
          <p class="opex-popup-message">{{ message }}</p>

          <slot name="message"></slot>

          <v-layout
            v-if="isActionBlock"
            justify-end
          >
            <!--Confirm button-->
            <v-btn
              :depressed="confirmMain"
              :text="!confirmMain"
              small
              :color="color"
              @click="confirmClicked"
            >
              {{ buttonName }}
            </v-btn>

            <!--Cancel button-->
            <v-btn
              :depressed="!confirmMain"
              :text="confirmMain"
              small
              :color="color"
              @click="close"
            >
              cancel
            </v-btn>
          </v-layout>
        </div>
      </v-layout>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'opex-popup',

  data() {
    return {
      // Controls popup visibility
      isVisible: false,
    };
  },

  props: {
    title: {
      type: String,
      default: 'Confirm action',
    },

    color: {
      type: String,
      default: 'secondary',
    },

    icon: {
      type: String,
      default: 'delete',
    },

    buttonName: {
      type: String,
      default: 'delete',
    },

    isActionBlock: {
      type: Boolean,
      default: true,
    },

    message: String,
    left: Boolean,
    confirmMain: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    // Confirm button click handler
    confirmClicked() {
      // Emitting event to the parent component and closing the popup
      this.$emit('confirm');
      this.isVisible = false;
    },
    close() {
      this.$emit('close');
      this.isVisible = false;
    },
  },
};
</script>

<style scoped lang="scss">
  div.v-card.opex-popup {
    border-radius: 0;
    h3 {
      font-size: 1.1rem;
    }
    div.opex-popup-top {
      width: 100%;
      height: 0.36rem;
    }

    div.layout.color {
      padding: 0.8rem;
      min-width: 15rem;
      max-width: 25rem;
    }

    .opex-popup-icon {
      margin: 0.4rem 0.6rem 0rem 0rem;
      height: 0.9rem;
      width: 1.1rem;
      padding-top: 0.1rem;
      border-radius: 0.45rem;
      color: var(--theme-background-light);
      font-size: 0.5rem;
      line-height: 0.5rem;
      text-align: center;
      vertical-align: middle;
      &:before {
        top: 0.2rem;

      }
    }

    .opex-popup-button-cross {
      outline: none;
      height: 0.86rem;
    }

    .opex-popup-icon-close {
      font-size: 0.86rem;
      height: 0.86rem;
      opacity: 0.5;
      color: var(--theme-background-light);
      background-color: var(--theme-secondary);
    }

    .opex-popup-title {
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .opex-popup-message {
      margin: 0;
      font-size: 1rem;
    }

    button.v-btn.v-size--small {
      text-transform: capitalize;
      height: auto;
      min-width: 6rem;
      margin: 0.8rem 0 0.2rem 0;
      padding: 0.5rem;
      font-size: 1rem;
      line-height: 1.5rem;
      border-radius: 0;

      &.v-btn--text {
        opacity: 0.5;
      }
    }
  }

  // Rewriting Vuetify menu styles
  .v-menu__content {
    box-shadow: 0 0.3rem 0.3rem -0.15rem rgba(0, 0, 0, 0.2),
      0 0.5rem 0.6rem 0.05rem rgba(0, 0, 0, 0.14), 0px 0.15rem 0.9rem 0.1rem rgba(0, 0, 0, 0.12);
    border-radius: 0;
  }
</style>
