<!--Drawer component based on the Vuetify Navigation Drawer-->
<!--IMPORTANT! This drawer will be shown inside the closest relatively positioned parent element-->

<template>
  <div>
    <!--Drawer background-->
    <transition name="background-fade">
      <div
        v-if="model"
        class="opex-drawer-background"
        @click="close"
      ></div>
    </transition>

    <v-navigation-drawer
      v-model="model"
      absolute
      right
    >
      <!--Drawer header consists of icon, title and subtitle-->
      <v-layout align-center class="opex-drawer-header">
        <opex-icon :name="icon"/>
        <div>
          <h3>{{ title }}</h3>
          <h5>{{ subtitle }}</h5>
        </div>
        <v-spacer></v-spacer>

        <!--Close drawer icon-->
        <opex-icon
          v-ripple
          class="close-icon-btn"
          name="close"
          @click.native="close"
        />
      </v-layout>

      <!--Drawer content passed from the parent component-->
      <div class="opex-drawer-content">
        <slot></slot>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: 'opex-drawer',

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    icon: {
      type: String,
      default: 'parameters',
    },

    title: {
      type: String,
      required: true,
    },

    subtitle: {
      type: String,
    },
  },

  computed: {
    // Controls drawer visibility
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
        if (!value) this.$emit('close');
      },
    },
  },

  created() {
    window.addEventListener('keyup', event => {
      if (event.keyCode === 27) this.close();
    });
  },

  destroyed() {
    window.removeEventListener('keyup', this.close);
  },

  methods: {
    // Close icon click handler
    close() {
      this.model = false;
    },
  },
};
</script>

<style scoped lang="scss">
  .background-fade-enter-active, .background-fade-leave-active {
    transition: opacity .3s;
  }

  .background-fade-enter, .background-fade-leave-to {
    opacity: 0;
  }

  .opex-drawer-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .opex-drawer-header {
    padding: 0.5rem;
    line-height: 1.2;
    color: var(--theme-primary-text);
    background-color: var(--theme-secondary);
    box-shadow: 0 0.05rem 0.3rem 0 rgba(45, 62, 80, 0.1);

    i {
      margin-right: 0.6rem;
      font-size: 2rem;
    }

    h3 {
      font-size: 1.2rem;
      font-weight: bold;
      text-transform: uppercase;
    }

    h5 {
      font-size: 0.8rem;
      opacity: 0.6;
      text-transform: capitalize;
    }

    i.close-icon-btn {
      font-size: 1rem;
      color: var(--theme-primary-text);
      background-color: rgba(0, 0, 0, 0.3);
    }
  }

  .opex-drawer-content {
    padding: $drawer-indent;
  }

  // Rewriting Vuetify Navigation Drawer styles
  aside.v-navigation-drawer {
    width: $drawer-width !important;
    transform: translateX($drawer-width) !important;
    z-index: 3;

    &.v-navigation-drawer--open {
      transform: translateX(0) !important;
      box-shadow: -0.6rem 0 0.9rem 0 rgba(45, 62, 80, 0.1);
    }
  }
</style>
