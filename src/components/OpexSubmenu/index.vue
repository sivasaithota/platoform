<!--Submenu component
    Expects the required items property, which should be an array of objects with
    1. 'icon' and 'name' properties
    Binds v-model to the selected item index
 -->

<template>
  <aside class="opex-submenu left-bar">
    <v-layout
      class="opex-submenu-header"
      align-center
      justify-space-between
    >
      <h2 class="text-capitalize">{{ title }}</h2>

      <v-btn
        v-if="buttonName"
        small
        color="secondary"
        @click="$emit('buttonClick')"
      >
        {{ buttonName }}
      </v-btn>
    </v-layout>

    <v-layout
      align-center
      justify-space-between
      class="opex-submenu-item"
      :class="{ selected: selectedItemIndex === index }"
      v-for="(item, index) in items"
      :key="index"
      @click="itemClick(item, index)"
    >
      <!--Icon with item name-->
      <v-layout align-center>
        <opex-icon
          v-if="item.icon"
          :name="item.icon"
        />
        <img
          v-if="item.img"
          :src="item.img"
          class="menu_icon"
          alt="config file"
        >
        <div class="submenu-item-name">
          {{ item.name }}
        </div>
      </v-layout>

      <!--Arrow when item is selected-->
      <transition name="fade">
        <span
          v-if="selectedItemIndex === index"
          class="arrow"
        >&#8594;</span>
      </transition>
    </v-layout>
  </aside>
</template>

<script>

export default {
  name: 'OpexSubmenu',

  props: {
    // v-model value
    value: {
      type: Number,
      default: 0,
    },

    title: String,
    buttonName: String,

    items: {
      type: Array,
      required: true,

      // Validating the passed items
      validator: items => {
        if (!items.length) return true;

        // Checking if each item has the required properties for the items list
        return items.every(item => {
          return ((item.icon || item.img) && item.name);
        });
      },
    },
  },

  computed: {
    selectedItemIndex: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },

  methods: {
    itemClick(item, index) {
      this.selectedItemIndex = index;
      // Redirecting to the route if provided
      if (item.route) this.$router.push({ name: item.route });
    },
  },
};
</script>

<style scoped lang="scss">
  .opex-submenu {
    width: 20rem;
    max-height: calc(100vh - #{$header-height});
    padding: 1rem;
    background-color: var(--theme-background-light);
    overflow-y: auto;
    border-right: 1px solid var(--theme-border-light);
    .opex-submenu-header {
      margin-bottom: 1.6rem;
    }

    .v-btn {
      margin: 0;
    }

    h2 {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--theme-text);
      line-height: 1;
    }

    .opex-submenu-item {
      margin: .8rem 0;
      padding: .6rem;
      color: var(--theme-text);
      border: 1px solid var(--theme-border-light);
      border-radius: .2rem;
      cursor: pointer;
      transition: border-color .3s;

      &:hover, &.selected {
        background-color: rgba(51, 51, 51, 0.05);
      }

      &.selected {
        // color: var(--theme-secondary);
        border-color: rgb(242, 121, 33);
        .arrow {
          color: var(--theme-accent);
        }
      }

      i {
        margin: 0.2rem 0.6rem 0.2rem 0.2rem;
        font-size: 2rem;
      }

      .submenu-item-name {
        font-size: 1rem;
        font-weight: 600;
      }

      .v-icon {
        width: 1.6rem;
        margin-right: .4rem;
        font-size: 1.2rem;
      }

      div {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .arrow {
        font-family: monospace;
        font-size: 1.8rem;
        line-height: 1rem;
      }
    }
  }

  .handle {
    margin-right: .8rem;
    cursor: grabbing;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .menu_icon {
    width: 2rem;
    height: 2rem;
    margin-right: .71rem;
  }
</style>
