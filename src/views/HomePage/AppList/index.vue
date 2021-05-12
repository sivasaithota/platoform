<!--List of apps on Home page-->

<template>
  <div class="app-container">
    <div class="left-bar">

      <!--Sort block-->
      <v-layout
        align-center
        class="sort-by"
      >
        <v-layout>
          <div class="sort-by-title">Sort by: </div>
          <v-menu offset-y>
            <template #activator="{ on }">
              <v-layout v-on="on" class="sort-by-current">
                <div>{{ sortByTitle }}</div>
                <opex-icon name="v2-np-arrow" />
              </v-layout>
            </template>
            <div class="sort-by-items">
              <div
                v-for="sortItem in listOfSort"
                :key="sortItem.key"
                @click="sortBy(sortItem)"
              >
                {{ sortItem.title }}
              </div>
            </div>
          </v-menu>
        </v-layout>

        <!--Btn group for changing sort type-->
        <opex-tooltip bottom message="Sort by ascending order">
          <template #activator>
            <v-btn
              text
              fab
              class="sort-btn"
              color="secondary"
              :disabled="sortIndex === $constant.sortIndex.asc"
              @click="changeSortType($constant.sortIndex.asc)"
            >
              <img src="@/assets/svg/ascending-icon.svg" alt="ascending"/>
            </v-btn>
          </template>
        </opex-tooltip>

        <opex-tooltip bottom message="Sort by descending order">
          <template #activator>
            <v-btn
              text
              fab
              class="sort-btn"
              color="primary"
              :disabled="sortIndex === $constant.sortIndex.desc"
              @click="changeSortType($constant.sortIndex.desc)"
            >
              <img src="@/assets/svg/descending-icon.svg" alt="descending"/>
            </v-btn>
          </template>
        </opex-tooltip>
      </v-layout>

      <!--Search block-->
      <div class="search-content">
        <input
          :value="filter"
          @input="searchApp"
          :placeholder="$message.appList.searchPlaceholder"
        />
        <opex-icon
          name="v2-np-magnifying-glass"
          class="search-icon"
        />
      </div>

      <!--List of Apps-->
      <div
        class="left-bar-container"
        @scroll="appsListScroll"
      >
        <template v-if="!fetchingByFilter && appList.length">
          <apps-list-item
            v-for="app in appList"
            :key="app._id"
            :appData="app"
            :is-active="app._id === selectedAppId"
            @click.native="selectApp(app)"
            @dblclick.native="editApp"
          />
        </template>

        <!--Skeleton loader placeholder when loading apps-->
        <template v-if="fetchingApps || fetchingByFilter">
          <v-skeleton-loader
            v-for="n in 5"
            :key="n"
            class="card-skeleton list-app-skeleton"
            type="list-item-two-line"
          />
        </template>

        <h3
          v-if="!fetchingApps && !appList.length"
          class="empty-list">
          No Apps found
        </h3>
      </div>
    </div>
    <div class="app-content">
      <app-card
        v-if="selectedAppId"
        @delete="onDelete"
      />
    </div>
  </div>
</template>

<script>
import { debounce, findIndex, get } from 'lodash';
import { mapState, mapActions, mapMutations } from 'vuex';
import AppsListItem from './components/AppsListItem';
import AppCard from '../AppCard';

export default {
  name: 'AppList',

  components: { AppsListItem, AppCard },

  data() {
    return {
      fetchingByFilter: false,
    };
  },

  methods: {
    ...mapActions({
      getAllApps: 'applicationList/getAllApps',
      getUsers: 'applicationList/getUsers',
      showSnackbar: 'snackbar/show',
    }),

    ...mapMutations({
      updateSelectedAppId: 'applicationList/updateSelectedAppId',
      updateFilter: 'applicationList/updateFilter',
      updateUsers: 'applicationList/updateUsers',
      updateSortIndex: 'applicationList/updateSortIndex',
      updateSortBy: 'applicationList/updateSortBy',
    }),

    selectAppByKeyboard(ev) {
      if (ev.code === 'ArrowDown' || ev.code === 'ArrowUp') {
        ev.view.event.preventDefault();
        const oldIndex = findIndex(this.appList, app => app._id === this.selectedAppId);
        const newIndex = ev.code === 'ArrowDown' ? oldIndex + 1 : oldIndex - 1;
        const nextApp = this.appList[newIndex];
        if (nextApp) {
          this.selectApp(nextApp);
          setTimeout(() => {
            const ele = document.querySelector('#app-wrapper > div > div.left-bar > .left-bar-container');
            const activeEle = ele.querySelector('.active');
            const position = activeEle.offsetTop - (ele.offsetHeight / 2);
            this.$common.scrollTo(ele, position, 200);
          }, 50);
        }
      }

      if (ev.code === 'Enter') {
        this.editApp();
      }
    },

    editApp() {
      if (!this.selectedAppId) return;
      if (!this.appList.find(app => app._id === this.selectedAppId).isEditable) return;
      this.$router.push({ path: `/application/${this.selectedAppId}/details` });
    },

    selectApp(app) {
      this.updateSelectedAppId(get(app, '_id'));
    },
    sortBy(value) {
      this.updateSortBy(value);
      this.getAllAppsAndSelectFirst(true);
    },

    changeSortType(type) {
      this.updateSortIndex(type);
      this.getAllAppsAndSelectFirst(true);
    },

    // Filtering apps with 500ms debounce and search value limit in min 3 letters
    // eslint-disable-next-line func-names
    searchApp: debounce(function ({ target }) {
      if (target.value.length > 0 && target.value.length < 3) return;
      this.updateFilter(target.value);
      this.getAllAppsAndSelectFirst(true);
    }, 500),

    getAllAppsAndSelectFirst(firstRequest) {
      // passing firstRequest param in the case when we changing sort type, filter or order
      this.fetchingByFilter = true;
      this.getAllApps({ firstRequest }).finally(() => {
        this.fetchingByFilter = false;
        this.selectApp(this.appList[0]);
      });
    },

    onDelete() {
      // if this was the last app from the list we refresh filter
      if (!this.appList[0]) this.updateFilter('');
      this.selectApp(this.appList[0]);
    },

    // infinity scroll function - loading more apps on scrolling to the bottom of the apps list with 100ms debounce
    // eslint-disable-next-line
    appsListScroll: debounce(function ({ target }) {
      const { scrollTop, clientHeight, scrollHeight, firstElementChild } = target; // eslint-disable-line
      // apps list is scrolled to its scroll height minus height of 5 child elements
      const loadingHeight = scrollTop + clientHeight >= scrollHeight - firstElementChild.offsetHeight * 5;
      const appListCount = this.appList.length;

      if (!this.fetchingApps && loadingHeight) {
        this.getAllApps({ skip: appListCount });
      }
    }, 100),
  },

  computed: {
    ...mapState({
      appList: state => state.applicationList.allAppsList,
      fetchingApps: state => state.applicationList.fetchingApps,
      filter: state => state.applicationList.filter,
      sortIndex: state => state.applicationList.sortIndex,
      listOfSort: state => state.applicationList.listOfSort,
      sortByTitle: state => state.applicationList.sortBy.title,
      selectedAppId: state => state.applicationList.selectedApp._id,
    }),
  },

  mounted() {
    this.getAllApps({ firstRequest: true })
      .then(() => this.selectApp(this.appList[0]));

    document.onkeydown = this.selectAppByKeyboard;
  },
  beforeDestroy() {
    document.onkeydown = null;
  },
};
</script>

<style scoped lang="scss">
  $sort-height: 4.5rem;
  $search-height: 4rem;
  .empty-list {
    text-align: center;
    text-transform: uppercase;
    margin-top: .7rem;
    color: rgba(var(--theme-primary-rgb), 0.3);
    font-size: 1.86rem;
  }
  .left-bar {
    background-color: var(--theme-background-light);
    width: 28rem;
    border-right: 2px solid $light-border-color;
  }
  .left-bar-container {
    overflow-y: auto;
    height: calc(100vh - #{$header-height} - #{$search-height} - #{$search-height});
  }
  .app-content {
    background-color: #f3f4f6;
    padding: 5rem 3rem 0 3rem;
  }
  .sort-by {
    height: $sort-height;
    padding: 1rem;
    border-bottom: 2px solid $light-border-color;
  }
  .v-btn.sort-btn {
    margin: 0;
    &:not(.v-btn--disabled) {
      opacity: .4;
    }
  }
  .sort-by-title {
    color: var(--theme-secondary-text);
    padding-right: .4rem;
    opacity: .6;
  }
  .sort-by-current {
    color: var(--theme-secondary);
    font-weight: 800;
    cursor: pointer;
    i {
      font-size: .9rem;
      font-weight: 700;
      padding-left: .3rem;
      margin-top: .4rem;
      color: var(--theme-secondary);
    }
  }
  .sort-by-items {
    background-color: var(--theme-background-light);
    div {
      cursor: pointer;
      padding: .9rem;
      &:hover {
        background-color: var(--theme-primary);
        color: var(--theme-primary-text);
      }
    }
  }
  .search-content {
    position: relative;
    input {
      width: 100%;
      height: $search-height;
      padding: 1rem 2.5rem 1rem 1rem;
      box-shadow: 0 1rem 1.5rem rgba(0, 0, 0, 0.05);
      outline: none;
    }
    .search-icon {
      opacity: .8;
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
    }
  }
</style>

<style lang="scss">
  .v-skeleton-loader.list-app-skeleton {
    border-bottom: 2px solid $light-border-color;

    &>.v-skeleton-loader__bone {
      height: 6rem;

      .v-skeleton-loader__text:nth-child(1) {
        margin-bottom: 1.5rem;
      }
    }
  }
</style>
