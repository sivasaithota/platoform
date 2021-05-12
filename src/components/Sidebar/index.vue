<template>
  <aside>
    <app-info v-if="!isIframe"></app-info>

    <div class="prime-bar">
      <ul class="menu">
        <template v-for="item in menuItems">
          <li
            v-if="item.visible"
            :key="item.menu"
          >
            <span class="menu">{{item.menu}}</span>
            <ul class="sub-menu">
              <li v-for="menu in item.submenu" :key="menu.name">
                <menu-item
                  v-if="menu.visible"
                  :url="generateUrl(menu.url)"
                  :name="menu.name"
                  :icon="menu.icon"
                />
              </li>
            </ul>
          </li>
        </template>
      </ul>
    </div>
  </aside>

</template>

<script>
import AppInfo from './components/AppInfo';
import MenuItem from './components/MenuItem';

export default {
  name: 'Sidebar',
  components: { AppInfo, MenuItem },

  data() {
    return {
      menuItems: [
        {
          menu: 'app management',
          visible: true,
          submenu: [{
            name: 'App Details',
            icon: 'v2-app-info',
            url: '/details',
            visible: true,
          }, {
            name: 'Input Data',
            icon: 'v2-input-data',
            url: '/input',
            visible: true,
          }, {
            name: 'Output Data',
            icon: 'v2-output-data',
            url: '/output',
            visible: true,
          }, {
            name: 'Parameters',
            icon: 'v2-parameters',
            url: '/parameters',
            visible: true,
          }, {
            name: 'Action Settings',
            icon: 'v2-primary-action',
            url: '/action-settings',
            visible: true,
          }, {
            name: 'App Permissions',
            icon: 'v2-enframe-admins',
            url: '/app-permissions',
            visible: true,
          }],
        },

        {
          menu: 'reporting',
          visible: true,
          submenu: [{
            name: 'Visualization',
            icon: 'v2-visualization',
            url: '/visualization',
            visible: true,
          }],
        },

        {
          menu: 'Deployment',
          visible: true,
          submenu: [{
            name: 'Deployment Options',
            icon: 'v2-deployment-options',
            url: '/deployment-options',
            visible: true,
          }, {
            name: 'Config File Upload',
            icon: 'v2-config-file',
            url: '/config',
            visible: true,
          }, {
            name: 'Enframe Admins',
            icon: 'v2-enframe-admins',
            url: '/admins',
            visible: false,
          }, {
            name: 'App Deployment',
            icon: 'v2-app-deployment',
            url: '/app-deployment',
            visible: true,
          }, {
            name: 'Development',
            icon: 'v2-bug',
            url: '/dev',
            visible: process.env.NODE_ENV === 'development',
          }],
        },
      ],
      isIframe: this.$common.isIframe(),
    };
  },

  methods: {
    generateUrl(path) {
      const { id } = this.$router.history.current.params;
      return `/application/${id + path}`;
    },
  },
};
</script>

<style scoped lang="scss">
  %menu {
    list-style-type: none;
    padding-left: 0;
  }

  ul.menu {
    @extend %menu;
    margin-top: 2rem;

    .menu {
      margin-left: 1rem;
      font-size: 1rem;
      font-weight: 700;
      color: rgba(51, 51, 51, 0.5);
      text-transform: uppercase;
    }
  }

  ul.sub-menu {
    @extend %menu;
    margin: 0.6rem 0 2rem 0;
  }
</style>
