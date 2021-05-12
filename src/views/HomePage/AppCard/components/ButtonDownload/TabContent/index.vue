<!--Content for Scenario Data/Reports in download app window-->

<template>
  <v-layout
    class="body-list"
    column
  >
    <v-layout
      justify-space-between
      align-center
      class="select-header"
    >
      <v-layout align-center>
        <v-checkbox
          class="select-checkbox small-checkbox"
          :class="!selectedAll && 'select-checkbox-secondary-text'"
          :disabled="type === $constant.downloadOptions[2].tab"
          color="secondary-text"
          v-model="selectedAll"
        />
        <div>Select All</div>
      </v-layout>
      <div
        class="select-title"
        v-html="`${selectedData.length} ${$constant.downloadOptions[activeIndex].selectTitle}`"
      />
    </v-layout>

    <div class="select-body">
      <v-layout
        v-for="item in dataList"
        :key="item.key"
        align-center
        class="select-item"
        :class="{
          'select-item-report': type === $constant.downloadOptions[2].tab
        }"
      >
        <v-checkbox
          class="small-checkbox"
          v-model="selectedValues"
          :label="item.title"
          :value="item.key"
          :disabled="type === $constant.downloadOptions[2].tab"
          @change="$emit('selectItem', item.key)"
        />
        <img
          v-if="type === $constant.downloadOptions[2].tab"
          :src="tableauLogo"
          alt="Tableau"
        />
      </v-layout>
    </div>
  </v-layout>
</template>

<script>
import tableauLogo from '@/assets/images/Tableau_Logo.svg';

export default {
  name: 'TabContent',
  props: {
    type: String,
    activeIndex: Number,
    selectedData: Array,
    selectedAllData: Boolean,
    dataList: Array,
  },
  data() {
    return {
      tableauLogo,
    };
  },
  computed: {
    selectedAll: {
      get() {
        return this.selectedAllData;
      },
      set(newValue) {
        this.$emit('selectAll', newValue);
      },
    },
    selectedValues: {
      get() {
        return [...this.selectedData];
      },
      set() {},
    },
  },
};
</script>

<style lang="scss" scoped>
.body-list {
  max-height: 70%;
}
.select-header {
  padding: 0 1.5rem;
  font-size: 1.17rem;
  height: 3.2rem;
  background-color: var(--theme-primary);
  color: var(--theme-primary-text);
  .select-title {
    font-weight: 500;
  }
}
.select-checkbox {
  padding: 0;
  margin-right: 1rem !important;
  .v-icon {
    color: var(--theme-primary-text) !important;
  }
  .v-label {
    color: var(--theme-primary-text);
  }
}
.select-checkbox-secondary-text {
  background-color: var(--theme-secondary-text);
}
.select-body {
  background-color: rgba(0, 0, 0, .04);
  height: 100%;
  padding: 2rem;
  overflow-y: scroll;
}
.select-item {
  background-color: var(--theme-background-light);
  padding: .7rem;
  margin-bottom: 2px !important;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, .05);
  .v-icon {
    color: var(--theme-primary) !important;
  }
  .v-label {
    color: var(--theme-primary);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block !important;
    width: 40rem !important;
  }
}
</style>

<style lang="scss">
.small-checkbox {
  margin: 0;
  label {
    padding-left: 1rem;
  }
  .v-messages {
    display: none;
  }
  .v-input__slot {
    margin: 0 !important;
    .v-input--selection-controls__ripple {
      height: 2rem;
      width: 2rem;
      left: - .5rem;
      top: calc(50% - 1rem);
      margin: 0;
    }
    .v-icon {
      font-size: 1.2rem;
    }
    .v-label {
      font-weight: 500;
      font-size: 1rem;
      height: auto;
    }
  }
}
</style>
