<template>

  <v-row
    no-gutters
    align="center"
    justify="space-between"
    class="opex-submenu-item"
    :class="{ selected }"
    @click="$emit('selectItem')"
  >
    <!-- Dragging icon, table tag, and name if showing list of tables -->
    <v-row no-gutters>
      <img
        src="@/assets/svg/sort-icon.svg"
        alt="sort element"
        class="handle"
      />

      <div>
        <div class="submenu-item-name table-name">
          {{ item.displayName }}
        </div>

        <v-row
          no-gutters
          class="submenu-table-details"
          align="center"
        >
          <opex-tooltip
            right
            :message="$message.inputOutput.tableVisibility"
          >
            <template #activator>
              <opex-icon
                :class="item.isVisible ? '' : 'support--text'"
                :name="item.isVisible ? 'v2-eye' : 'v2-eye-blocked'"
                @click.native.stop.prevent="$emit('changeTableVisibility')"
              />
            </template>
          </opex-tooltip>
        </v-row>
      </div>
    </v-row>

    <!--Arrow when item is selected-->
    <transition name="fade">
      <span
        v-if="selected"
        class="arrow"
      >
        &#8594;
      </span>
    </transition>
  </v-row>
</template>

<script>
export default {
  name: 'TagDraggableItem',
  props: {
    selected: Boolean,
    item: Object,
  },
};
</script>

<style scoped lang="scss">
  .opex-submenu-item {
    margin: .8rem 0;
    padding: .6rem;
    color: var(--theme-text);
    border: 1px solid var(--theme-border-light);
    border-radius: .2rem;
    cursor: pointer;
    transition: border-color .3s;
    background-color: var(--theme-background-light);

    &:hover, &.selected {
      // color: var(--theme-secondary);
    }

    &.selected {
      // color: var(--theme-secondary);
      border-color: rgb(242, 121, 33);
      background-color: rgba(51, 51, 51, 0.05);
      .arrow {
        color: var(--theme-accent);
      }
    }

    i {
      font-size: 1.5rem;
      &:hover {
        opacity: .7;
      }
    }

    .submenu-item-name {
      font-size: 1rem;
      font-weight: 600;
    }

    .submenu-table-details {
      margin-top: .4rem;
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

    .handle {
      margin-right: .8rem;
      cursor: grabbing;
    }
  }

</style>
