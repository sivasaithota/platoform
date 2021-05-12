<!--Navigation drawer component-->

<template>
  <v-navigation-drawer class="opex-drawer" permanent>
    <v-list dense>
      <div
        v-for="(menu, index) in itemList"
        :key="index"
      >
        <v-subheader inset>{{ menu.title }}</v-subheader>

        <div
          v-for="item in menu.items"
          :key="item.name"
        >
          <router-link
            :to="item.url"
            class="documentation-link"
          >
            <v-list-item
              v-if="item.visible"
              :class="{'active': $route.path === item.url}"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </router-link>
        </div>
        <v-divider v-if="(index + 1) !== itemList.length"></v-divider>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'OpexNavDrawer',

  props: {
    itemList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {};
  },
};
</script>

<style lang="scss">
  .opex-drawer.v-navigation-drawer {
    height: fit-content !important;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
    .v-navigation-drawer__border {
      display: none;
    }
    .v-subheader--inset {
      margin: 0;
      opacity: .6;
      font-size: 1rem;
      font-weight: bold;
      letter-spacing: .07rem;
      color: var(--theme-text);
      text-transform: uppercase;
      padding: 0 1rem 0 1rem;
    }
    .v-list-item {
      font-size: 1rem;
      font-weight: 600;
      border-left: .31rem solid transparent;
      .v-list-item__title {
        font-size: 1rem;
        padding: 2px 0px;
      }
      &.active {
        background-color: rgba(51, 51, 51, 0.05);
        border-left-color: var(--theme-accent);
      }
      &:hover {
        background-color: rgba(51, 51, 51, 0.05);
      }
    }
    .documentation-link {
      text-decoration: none;
    }
  }
</style>
