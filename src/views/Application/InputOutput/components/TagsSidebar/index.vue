<template>
  <aside class="opex-submenu left-bar">
    <v-row
      class="opex-submenu-header"
      align="center"
      justify="space-between"
      no-gutters
    >
      <h2>{{ title }}</h2>

      <v-btn
        small
        color="secondary"
        @click="$emit('buttonClick')"
      >
        add table
      </v-btn>
    </v-row>

    <draggable
      tag="div"
      class="table-columns"
      :class="loading && 'draggable-loading'"
      v-bind="dragOptionsTags"
      v-model="draggableItems"
      handle=".tag-handle"
      @start="startTagDragging"
      @end="dragOptionsTables.disabled = false"
    >
      <div
        class="tag-container"
        v-for="(tagData, tagIndex) in tagList"
        :key="tagIndex"
      >
        <img
          src="@/assets/svg/sort-icon.svg"
          alt="sort element"
          class="tag-handle"
        />
        <span class="tag-label">{{tagData.name}}</span>

        <draggable
          tag="div"
          class="table-columns"
          v-bind="dragOptionsTables"
          :value="tagData.tables"
          handle=".handle"
          @change="onTableMoved($event, tagIndex)"
          @start="dragOptionsTags.disabled = true"
          @end="endOfDragging"
        >
          <tag-draggable-item
            v-for="(table, tableIndex) in tagData.tables"
            :key="table._id"
            :item="table"
            :selected="selectedTable && table._id === selectedTable._id"
            @selectItem="selectItem(tagIndex, tableIndex)"
            @changeTableVisibility="changeTableVisibility(table, tagIndex, tableIndex)"
          />
        </draggable>
      </div>
    </draggable>

    <!--Submenu items-->

  </aside>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import { cloneDeep } from 'lodash';
import TagDraggableItem from '../TagDraggableItem';

export default {
  name: 'TagsSidebar',
  components: { TagDraggableItem },
  props: {
    title: String,
  },

  data() {
    return {
      draggingTagIndex: null,
      dragOptionsTables: {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      },
      dragOptionsTags: {
        animation: 200,
        group: 'description',
        disabled: this.loading || false,
        ghostClass: 'ghost',
      },
      eventList: [],
      loading: false,
    };
  },

  computed: {
    ...mapState({
      tagList: state => state.tables.tagList,
    }),

    selectedTable() {
      return this.$store.getters['tables/getSelectedTable'];
    },

    draggableItems: {
      get() {
        return this.tagList;
      },
      set(newTagList) {
        this.setLoading(true);
        const newTagIndex = newTagList.findIndex(tag => tag.name === this.tagList[this.selectedTable.tagIndex].name);
        const { tables, ...newTag } = this.tagList[this.draggingTagIndex];
        const tableIds = this.tagList[this.draggingTagIndex].tables.map(table => table._id);
        const movedElements = {
          newTag,
          tableIds,
        };
        this.updateTagList({
          tagList: newTagList,
          tagIndex: newTagIndex,
          movedElements,
        }).finally(() => {
          this.setLoading(false);
        });
      },
    },
  },

  methods: {
    ...mapActions('tables', {
      updateTable: 'updateTable',
      moveTable: 'moveTable',
      updateTagList: 'updateTagList',
    }),

    ...mapMutations({
      updateSelectedTagIndex: 'tables/updateSelectedTagIndex',
      updateSelectedTableIndex: 'tables/updateSelectedTableIndex',
    }),

    startTagDragging({ oldDraggableIndex }) {
      this.dragOptionsTables.disabled = true;
      this.draggingTagIndex = oldDraggableIndex;
    },

    setLoading(value) {
      this.loading = value;
      this.dragOptionsTags.disabled = value;
      this.dragOptionsTables.disabled = value;
    },

    endOfDragging() {
      let newTagIndex = null;
      let newTableIndex = null;
      const movedElements = {};

      const newTagList = this.eventList.reduce((prevValue, { event, tagIndex }) => {
        const { added, removed, moved } = event;
        const { tables } = prevValue[tagIndex];
        if (moved) tables.splice(moved.newIndex, 0, tables.splice(moved.oldIndex, 1)[0]);
        if (added) tables.splice(added.newIndex, 0, added.element);
        if (removed) tables.splice(removed.oldIndex, 1);

        if (!removed || removed.oldIndex !== this.selectedTable.tableIndex) {
          // checking if exist in this tag a table that was selected
          const tableIndex = tables.findIndex(table => table._id === this.selectedTable._id);
          if (tableIndex !== -1) {
            newTagIndex = tagIndex;
            newTableIndex = tableIndex;
          }
        }

        if (moved || added) {
          const { tables: _tables, ...newTag } = prevValue[tagIndex];
          movedElements.tableIds = [(moved || added).element._id];
          movedElements.newTag = newTag;
        }
        return prevValue;
      }, cloneDeep(this.tagList));

      // reset list of events
      this.eventList = [];
      // updating data in store and in server
      this.setLoading(true);
      this.updateTagList({
        tagList: newTagList,
        tagIndex: newTagIndex,
        tableIndex: newTableIndex,
        movedElements,
      }).finally(() => {
        this.setLoading(false);
      });
    },

    onTableMoved(event, tagIndex) {
      this.eventList = [...this.eventList, { event, tagIndex }];
    },

    selectItem(tagIndex, tableIndex, withoutEmit) {
      if (this.selectedTable && (this.selectedTable.tagIndex === tagIndex && this.selectedTable.tableIndex === tableIndex)) return;
      this.updateSelectedTagIndex(tagIndex);
      this.updateSelectedTableIndex(tableIndex);
      if (!withoutEmit) this.$emit('selectTable');
    },

    // Sending request to the server to change table visibility
    changeTableVisibility(item, tagIndex, tableIndex) {
      this.updateTable({
        tableData: { ...item, isVisible: !item.isVisible },
        tableIndex,
        tagIndex,
        changedVisibility: true,
      });
    },
  },
};
</script>

<style scoped lang="scss">
  .opex-submenu {
    width: 20rem;
    padding: 1rem;
    background-color: var(--theme-background-light);
    overflow-y: auto;

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

  .tag-container {
    padding: 1rem;
    border-radius: .2rem;
    position: relative;
    .tag-label {
      font-size: 1rem;
      font-weight: 800;
      color: var(--theme-support);
      text-transform: uppercase;
    }
    .tag-handle {
      cursor: grabbing;
      opacity: 0;
      position: absolute;
      transform: rotate(90deg);
      width: .5rem;
      left: calc(50% - 0.5rem);
      top: 0;
    }
    &:hover {
      background-color: rgba(var(--theme-secondary-rgb), 0.07);
      transition: background-color .2s;
      cursor: pointer;
      .tag-handle {
        transition: opacity .2s;
        opacity: 1;
      }
    }
  }

  .table-columns.draggable-loading {
    .tag-container, .row, img, button {
      cursor: progress;
    }
  }
</style>
