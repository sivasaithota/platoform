<!--Input and Output data pages component-->

<template>
  <div class="input-output-data">

    <!--Tables list skeleton loader-->
    <div
      v-if="loading"
      class="tables-skeleton-container left-bar"
    >
      <h2 class="table-skeleton-title">{{ submenuTitle }}</h2>
      <v-skeleton-loader
        v-for="n in 3"
        :key="n"
        class="card-skeleton tables-skeleton"
        type="list-item-two-line"
      />
    </div>

    <!--Submenu with the list of tables-->
    <tags-sidebar
      v-if="!loading && tagList"
      :title="submenuTitle"
      @selectTable="changeSelectedTable"
      @buttonClick="addTable"
    />

    <!--Add/edit column drawer-->
    <opex-drawer
      v-if="!loading"
      v-model="columnDrawerVisible"
      :title="selectedColumnIndex === null ? 'add column' : 'edit column'"
      :subtitle="columnDrawerSubtitle"
      :icon="`v2-${type}-data`"
      @close="selectedColumnIndex = null"
    >
      <edit-column
        v-if="columnDrawerVisible"
        :column-index="selectedColumnIndex"
        :tag-index="selectedTable.tagIndex"
        :table-index="selectedTable.tableIndex"
        @close="closeDrawer"
      />
    </opex-drawer>

    <!--Add/edit table drawer-->
    <opex-drawer
      v-if="!loading && tagList"
      v-model="tableDrawerVisible"
      :title="tableDrawerAdding ? 'add table' : 'edit table'"
      :subtitle="tableDrawerAdding ? 'New Table' : selectedTableName"
      :icon="`v2-${type}-data`"
    >
      <edit-table
        v-if="tableDrawerVisible"
        :addTable="tableDrawerAdding"
        @close="closeDrawer"
      />
    </opex-drawer>

    <!--Table columns skeleton loader-->
    <div
      v-if="loading || loadingColumns"
      class="app-content table-skeleton-container"
    >
      <v-skeleton-loader
        class="table-header-skeleton"
        type="heading"
      />

      <opex-card
        disabled
        class="wrap justify-space-between"
      >
        <v-skeleton-loader
          v-for="n in 9"
          :key="n"
          class="card-skeleton card-skeleton-darkened table-skeleton"
          type="list-item-two-line"
        />
      </opex-card>
    </div>

    <section
      v-if="!loading && !loadingColumns && selectedTable"
      class="app-content"
    >
      <v-layout
        class="app-content-header"
        align-center
      >
        <!--Selected table name with edit button-->
        <h3>
          {{ selectedTableName }}
        </h3>
        <v-btn
          fab
          color="secondary"
          @click="editTable"
        >
          <opex-icon name="edit"/>
        </v-btn>

        <!--Delete table button with confirm popup-->
        <opex-popup
          title="Delete table"
          :message="$message.inputOutput.deleteTable(selectedTableName)"
          button-name="delete"
          @confirm="deleteTableConfirm"
        >
          <v-btn
            fab
            color="secondary"
          >
            <opex-icon name="delete"/>
          </v-btn>
        </opex-popup>

        <v-spacer/>
        <v-btn
          color="secondary"
          @click="addColumn"
        >
          add column
        </v-btn>
      </v-layout>

      <!--  Header of table  -->
      <v-layout justify-space-between class="table-row header">
        <div class="handle-space"></div>
        <v-layout justify-space-between align-center>
          <div class="column-text-data">
            <span class="opex-label">column name</span>
          </div>
          <div class="column-text-data">
            <span class="opex-label">display name</span>
          </div>
          <div class="column-text-data">
            <span class="opex-label">data type</span>
          </div>
          <div class="status-buttons"></div>
        </v-layout>
        <div class="menu-space"></div>
      </v-layout>

      <draggable
        tag="div"
        v-model="columns"
        handle=".handle"
        @change="columnMoved"
      >
        <v-layout
          align-center
          justify-space-between
          class="table-row"
          v-for="(column, index) in columns"
          :class="{ selected: selectedColumnIndex === index }"
          :key="index"
        >
          <!--     Draggable icon     -->
          <img
            src="@/assets/svg/sort-icon.svg"
            alt="sort element"
            class="handle"
          />

          <v-layout justify-space-between align-center>

            <div class="column-text-data">
              <edit-name-cell
                :column-data="column"
                :column-index="index"
                :tag-index="selectedTable.tagIndex"
                :table-index="selectedTable.tableIndex"
                field-name="name"
                placeholder="Enter Name"
                unique
              />
            </div>

            <div class="column-text-data">
              <edit-name-cell
                :column-data="column"
                :column-index="index"
                :tag-index="selectedTable.tagIndex"
                :table-index="selectedTable.tableIndex"
                field-name="displayName"
                placeholder="Enter Display Name"
              />
            </div>

            <div class="column-text-data">
              <edit-data-type
                :column-data="column"
                :key="column"
                :column-index="index"
                :tag-index="selectedTable.tagIndex"
                :table-index="selectedTable.tableIndex"
              />
            </div>

            <!--Column boolean data-->
            <div class="status-buttons">
              <opex-tooltip
                bottom
                :message="$message.inputOutput.visibilityTooltip"
              >
                <template #activator>
                  <v-btn
                    fab
                    color="secondary"
                    :class="{'disabled': !column.isVisible}"
                    @click="changeBooleanData('isVisible', column, index)"
                  >
                    <opex-icon name="v2-eye" />
                  </v-btn>
                </template>
              </opex-tooltip>

              <opex-tooltip
                bottom
                :message="$message.inputOutput.editableTooltip"
              >
                <template #activator>
                  <v-btn
                    fab
                    color="secondary"
                    :class="{'disabled': !column.isEditable}"
                    @click="changeBooleanData('isEditable', column, index)"
                  >
                    <opex-icon name="v2-pencil" />
                  </v-btn>
                </template>
              </opex-tooltip>

              <opex-tooltip
                bottom
                :message="$message.inputOutput.quickFilterTooltip"
              >
                <template #activator>
                  <v-btn
                    fab
                    color="secondary"
                    :class="{'disabled': !column.hasFilter}"
                    @click="changeFilter( column, index)"
                  >
                    <opex-icon name="v2-np-filter" />
                  </v-btn>
                </template>
              </opex-tooltip>
            </div>
          </v-layout>

          <!--      menu button        -->
          <v-menu
            offset-y
            transition="slide-y-transition"
          >
            <template #activator="{ on }">
              <!--       Menu Icon       -->
              <div v-on="on" class="menu-btn">
                <opex-icon name="v2-more"/>
              </div>
            </template>

            <!--       Menu Body       -->
            <v-list>
              <v-list-item
                class="menu-item"
                @click="editColumn(index)"
              >
                <v-list-item-title>
                  Edit
                </v-list-item-title>
              </v-list-item>

              <v-list-item @click="showDeleteColumnPopup(index)">
                <v-list-item-title>
                  Delete
                </v-list-item-title>
              </v-list-item>
            </v-list>

          </v-menu>

          <!--Delete column popup-->
          <opex-popup
            left
            :ref="`delete-column-${index}`"
            title="Delete column"
            :message="$message.inputOutput.deleteColumn(column.displayName)"
            button-name="delete"
            @confirm="deleteColumnConfirm(index)"
          />
        </v-layout>
       </draggable>
    </section>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { capitalize, cloneDeep } from 'lodash';

import EditDataType from './components/EditDataType';
import EditNameCell from './components/EditNameCell';
import EditColumn from './components/EditColumn';
import EditTable from './components/EditTable';
import TagsSidebar from './components/TagsSidebar';

export default {
  name: 'InputOutput',
  components: {
    EditTable, EditColumn, EditNameCell, EditDataType, TagsSidebar,
  },

  data() {
    return {
      appId: 0,
      type: '', // input or output
      loading: true,
      loadingColumns: false,
      selectedColumnIndex: null,
      columnDrawerVisible: false,
      tableDrawerVisible: false,
      tableDrawerAdding: false, // State of the table drawer - adding or editing table
      reorderedColumns: null, // Column list after moving any column
    };
  },

  computed: {
    ...mapState({
      tagList: state => state.tables.tagList,
      selectedTag: state => state.tables.selectedTag,
      selectedTableIndex: state => state.tables.selectedTableIndex,
    }),

    // List of table columns
    columns: {
      get() {
        return this.$store.state.tables.columns;
      },
      // Saving list of columns after changing their order
      set(value) {
        this.reorderedColumns = value;
      },
    },

    selectedTable() {
      return this.$store.getters['tables/getSelectedTable'];
    },

    submenuTitle() {
      return `${capitalize(this.type)} Data`;
    },

    selectedTableName() {
      return this.selectedTable
        ? this.selectedTable.displayName
        : '';
    },

    columnDrawerSubtitle() {
      const column = this.selectedColumnIndex !== null
        ? this.columns[this.selectedColumnIndex].displayName
        : 'New column';

      return `${this.selectedTableName} / ${column}`;
    },
  },

  methods: {
    ...mapActions('tables', {
      getDataTypes: 'getDataTypes',
      getTables: 'getTables',
      getColumns: 'getColumns',
      getTags: 'getTags',
      deleteTable: 'deleteTable',
      deleteColumn: 'deleteColumn',
      moveColumn: 'moveColumn',
      updateColumn: 'updateColumn',
    }),

    ...mapActions({
      showSnackbar: 'snackbar/show',
    }),

    ...mapMutations('tables', {
      updateColumnsOrder: 'updateColumnsOrder',
      resetSelectedTable: 'resetSelectedTable',
    }),

    changeFilter(rowData, index) {
      const result = this.columns.filter(item => item.hasFilter);
      if (!rowData.hasFilter && result.length === 3) { // 3 - maximum selected filters
        this.showSnackbar({
          type: this.$constant.snackbarTypes.error,
          title: this.$message.inputOutput.errorUpdatingTable,
          message: this.$message.inputOutput.filterLimitErrorMessage,
        });
      } else {
        this.changeBooleanData('hasFilter', rowData, index);
      }
    },

    changeBooleanData(filed, rowData, index) {
      const newRowData = cloneDeep(rowData);
      newRowData[filed] = !newRowData[filed];
      this.updateColumn({
        tagIndex: this.selectedTable.tagIndex,
        tableIndex: this.selectedTable.tableIndex,
        columnIndex: index,
        columnData: newRowData,
      });
    },

    // Fetching list of tables and list of columns of a particular table from the server
    fetchTablesColumnsData() {
      return this.getTables({
        appId: this.appId,
        type: this.type,
      });
    },

    getSelectedTableColumnData() {
      if (this.selectedTable) {
        return this.getColumns({
          appId: this.appId,
          tableId: this.selectedTable._id,
        });
      }
    },

    // Fetching columns for the selected table
    fetchColumnsData() {
      this.loadingColumns = true;
      return this.getColumns({
        appId: this.appId,
        tableId: this.selectedTable._id,
      }).then(() => {
        this.loadingColumns = false;
      });
    },

    // Submenu table click handler
    changeSelectedTable() {
      this.closeDrawer();
      this.fetchColumnsData();
    },

    // Column drag and drop event handler
    columnMoved({ moved }) {
      this.moveColumn({
        tableId: this.selectedTable._id,
        columnId: moved.element._id,
        newColumnIndex: moved.newIndex,
        newColumnsOrder: this.reorderedColumns,
      });
    },

    // Add table button click handler
    addTable() {
      this.tableDrawerAdding = true;
      this.tableDrawerVisible = true;
    },

    // Edit table button click handler
    editTable() {
      this.tableDrawerAdding = false;
      this.tableDrawerVisible = true;
    },

    // Add column button click handler
    addColumn() {
      this.selectedColumnIndex = null;
      this.columnDrawerVisible = true;
    },

    // Column card click handler
    editColumn(columnIndex) {
      // Opening the edit column drawer
      this.selectedColumnIndex = columnIndex;
      this.columnDrawerVisible = true;
    },

    showDeleteColumnPopup(index) {
      // Changing popup visibility directly, activator slot approach doesn't work for the popup in menu
      this.$refs[`delete-column-${index}`][0].isVisible = true;
    },

    // Delete table confirm button click handler
    deleteTableConfirm() {
      this.closeDrawer();

      this.loadingColumns = true;
      this.deleteTable({
        tableId: this.selectedTable._id,
      }).then(() => {
        // Fetching columns for new selected table
        if (this.selectedTable) {
          return this.getColumns({
            appId: this.appId,
            tableId: this.selectedTable._id,
          });
        }
      }).then(() => {
        this.loadingColumns = false;
      });
    },

    // Delete column confirm button click handler
    deleteColumnConfirm(columnIndex) {
      this.deleteColumn({
        tableId: this.selectedTable._id,
        columnId: this.columns[columnIndex]._id,
        columnIndex,
      });
    },

    // Closing the drawers and clearing the selected column index
    closeDrawer() {
      this.tableDrawerVisible = false;
      this.columnDrawerVisible = false;
      this.selectedColumnIndex = null;
    },
  },

  watch: {
    // Watching the route change to reset selections, close drawers and fetch tables data
    // when switching between sections (input/output)
    $route() {
      this.type = this.$route.name;
      this.resetSelectedTable();
      this.closeDrawer();

      this.loading = true;
      this.fetchTablesColumnsData()
        .then(() => {
          this.getSelectedTableColumnData();
          this.loading = false;
        });
    },
  },

  mounted() {
    this.appId = this.$route.params.id;
    this.type = this.$route.name;

    // Fetching inputs/outputs tables data and the first table column data from the server
    // Fetching tags list from the server
    // Fetching table columns data types from the server
    Promise.all([
      this.fetchTablesColumnsData(),
      this.getDataTypes(),
    ]).then(() => {
      this.resetSelectedTable();
      this.getSelectedTableColumnData();
      this.getTags(this.appId);
      this.loading = false;
    });
  },
};
</script>

<style scoped lang="scss">
  .input-output-data {
    position: relative;
  }

  .tables-skeleton-container {
    width: 22rem;
    background-color: var(--theme-background-light);

    .table-skeleton-title {
      margin: 1rem;
      font-size: 1.6rem;
      font-weight: 700;
      line-height: 1.3;
    }
  }

  aside.opex-submenu {
    width: 22rem;
    border-right: 1px solid var(--theme-border-light);
  }

  .menu-item {
    cursor: pointer;
  }
  .table-row {
    width: 100%;
    padding: 1rem;
    background-color: var(--theme-background-primary);
    border: 1px solid rgba(var(--theme-primary-rgb), 0.1);
    border-left: none;
    border-right: none;
    .opex-label {
      color: var(--theme-secondary);
    }
    .handle {
      margin-right: 1rem;
      cursor: grabbing;
    }
    .handle-space {
      width: 1.5rem;
    }
    .menu-btn {
      cursor: pointer;
      width: 1rem;
      opacity: .4;
    }
    .menu-space {
      width: 1rem;
    }

    .status-buttons {
      width: 13rem;
      button.v-btn i {
        color: var(--theme-primary-text);
        font-size: .8rem;
      }
      .menu-btn {
        vertical-align: middle;
        padding-left: 2rem;
      }
      .disabled {
        opacity: .3;
      }
    }

    .column-text-data {
      width: 20%;
      font-weight: 500;
      padding-right: 1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      :hover {
        color: var(--theme-secondary);
      }
    }
  }
</style>

<style lang="scss">
  .card-skeleton.tables-skeleton {
    width: 80%;

    .v-skeleton-loader__list-item-two-line {
      padding: 1.2rem 1.4rem;

      .v-skeleton-loader__text:nth-child(1) {
        margin-bottom: 0.8rem;
      }
    }
  }

  .card-skeleton.table-skeleton {
    width: 30%;

    .v-skeleton-loader__list-item-two-line {
      padding: 2rem 6rem 2rem 1rem;
    }
  }

  div.v-skeleton-loader.table-header-skeleton {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--theme-border);
    border-radius: 0;

    div.v-skeleton-loader__heading {
      height: 1.6rem;
      width: 40%;
      margin: 0.8rem 0;
      background: var(--theme-secondary);
      opacity: .16;
    }
  }
</style>
