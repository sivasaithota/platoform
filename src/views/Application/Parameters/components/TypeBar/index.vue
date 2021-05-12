<!--Component with control bar action to create new group and parameters on the Parameters page-->

<template>
  <ul
    :style="{ left: barPosition }"
    class="types-container"
  >
    <!--Add new Group btn-->
    <v-layout
      tag="li"
      class="content menu"
      align-center
      justify-center
      fill-height
      @click="$emit('createParameterGroup')"
    >
      <opex-tooltip left message="Add new group">
        <template #activator>
          <img
            src="@/assets/svg/parameters/add-group.svg"
            alt="add group"
          >
        </template>
      </opex-tooltip>
    </v-layout>

    <!--List of parameter types-->
    <draggable
      v-model="types"
      :group="{ name: 'parameter', pull: 'clone', put: false }"
      :clone="cloneParam"
      @end="finishDragging"
    >
      <v-layout
        tag="li"
        class="content type"
        align-center
        justify-center
        fill-height
        v-for="element in types"
        :key="element.typeName"
        :id="element.typeName"
        @click="$emit('createParameter', { type: element.typeName })"
      >
        <opex-tooltip
          left
          :message="'Add ' + element.displayName"
        >
          <template #activator>
            <img
              :src="icons[element.typeName]"
              alt="type"
            >
          </template>
        </opex-tooltip>
      </v-layout>
    </draggable>
  </ul>
</template>

<script>
import textType from '@/assets/svg/parameters/add-text-box.svg';
import radioType from '@/assets/svg/parameters/add-dropdown.svg';
import checkboxType from '@/assets/svg/parameters/add-multi-dropdown.svg';
import dateType from '@/assets/svg/parameters/add-date.svg';
import switchType from '@/assets/svg/parameters/add-switch.svg';

export default {
  name: 'TypeBar',

  props: {
    position: Number,
  },

  data() {
    return {
      types: [],
      icons: {
        inputBox: textType,
        dropdownSingle: radioType,
        dropdownMultiple: checkboxType,
        dateField: dateType,
        switch: switchType,
      },
      dragging: false,
    };
  },

  created() {
    // Fetching parameter types data from Vuex
    this.types = this.$store.state.parameters.paramTypes;
  },

  computed: {
    // Calculate bar position
    barPosition() {
      const menuWidth = '4.3rem';
      const menuMargin = '2rem';
      return `calc(${this.position}px - ${menuWidth} - ${menuMargin})`;
    },
  },

  methods: {

    // Create new parameters by dragging type
    cloneParam() {
      this.dragging = true;
    },

    finishDragging({ to, item, newIndex }) {
      this.dragging = false;
      this.$emit('createParameter', {
        type: item.id,
        position: newIndex,
        groupId: to.id,
      });
    },
  },
};
</script>

<style scoped lang="scss">
  .types-container {
    list-style: none;
    box-shadow: 0.1rem 0.1rem 0.5rem -0.1rem rgba(0, 0, 0, .09);
    border: solid 1px var(--theme-border-light);
    background-color: var(--theme-background-primary);
    padding-left: 0;
    position: absolute;
    li.content {
      height: 4.3rem;
      width: 4.3rem;
      border-bottom: 1px solid var(--theme-border-light);
      &:hover {
        background-color: rgba(var(--theme-secondary-rgb), 0.07);
        cursor: pointer;
      }
    }
  }
</style>
