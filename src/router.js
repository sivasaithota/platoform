import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';
// import { getCookie, removeCookie } from 'tiny-cookie';

import Login from '@/views/Login/index.vue';
import HomePage from '@/views/HomePage/index.vue';
import NotFound from '@/views/NotFound';
import Application from '@/views/Application';
import NewApplication from '@/views/NewApplication';
import AppList from '@/views/HomePage/AppList';
import AppDetails from '@/views/Application/AppDetails';
import InputOutput from '@/views/Application/InputOutput';
import ActionSettings from '@/views/Application/ActionSettings';
import Visualization from '@/views/Application/Visualization';
import Development from '@/views/Application/Development';
import ConfigUpload from '@/views/Application/ConfigUpload';
import AppDeployment from '@/views/Application/AppDeployment';
import DeploymentOptions from '@/views/Application/DeploymentOptions';
import Parameters from '@/views/Application/Parameters';
import AppSharing from '@/views/Application/AppSharing';
import PrimaryAction from '@/views/Application/ActionSettings/PrimaryAction';
import SecondaryAction from '@/views/Application/ActionSettings/SecondaryAction';
import Workflows from '@/views/Application/ActionSettings/Workflows';
import Scheduler from '@/views/Application/ActionSettings/Scheduler';
import Settings from '@/views/EnframeSettings';
import PowerBISettings from '@/views/EnframeSettings/components/PowerBISettings';
import TableauSettings from '@/views/EnframeSettings/components/TableauSettings';
import SecuritySettings from '@/views/EnframeSettings/components/SecuritySettings';
import EnvironmentManagement from '@/views/EnframeSettings/components/EnvironmentManagement';
import UserManagementSettings from '@/views/EnframeSettings/components/UserManagementSettings';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/login', component: Login, meta: { requiresAuth: false } },

    {
      path: '/',
      redirect: '/all-apps',
      component: HomePage,
      meta: { requiresAuth: true },
      children: [
        { path: 'pinned-apps', component: AppList },
        { path: 'my-apps', component: AppList },
        { path: 'shared-apps', component: AppList },
        { path: 'all-apps', component: AppList },
      ],
    },

    {
      path: '/settings',
      redirect: '/settings/user-management',
      component: Settings,
      meta: { requiresAuth: true },
      children: [
        { path: 'session', component: Settings },
        { path: 'security', component: SecuritySettings },
        { path: 'tableau', component: TableauSettings },
        { path: 'powerbi', component: PowerBISettings },
        { path: 'user-management', component: UserManagementSettings },
        { path: 'environment-management', component: EnvironmentManagement },
      ],
    },

    {
      path: '/new-application',
      component: NewApplication,
      meta: { requiresAuth: true },
    },

    {
      path: '/application/:id',
      component: Application,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'details',
          name: 'app details',
          component: AppDetails,
        },
        {
          path: 'input',
          name: 'input',
          component: InputOutput,
        },
        {
          path: 'output',
          name: 'output',
          component: InputOutput,
        },
        {
          path: 'parameters',
          name: 'parameters',
          component: Parameters,
        },
        {
          path: 'action-settings',
          name: 'action settings',
          component: ActionSettings,
          children: [
            {
              path: 'primary-action',
              name: 'primary action',
              component: PrimaryAction,
            },
            {
              path: 'secondary-actions',
              name: 'secondary actions',
              component: SecondaryAction,
            },
            {
              path: 'workflows',
              name: 'workflows',
              component: Workflows,
            },
            {
              path: 'scheduler',
              name: 'scheduler',
              component: Scheduler,
            },
          ],
        },
        {
          path: 'visualization',
          name: 'visualization',
          component: Visualization,
        },
        {
          path: 'config',
          name: 'configuration upload',
          component: ConfigUpload,
        },
        {
          path: 'app-permissions',
          name: 'app permissions',
          component: AppSharing,
        },
        {
          path: 'deployment-options',
          component: DeploymentOptions,
        },
        {
          path: 'app-deployment',
          name: 'app deployment',
          component: AppDeployment,
          children: [
            {
              path: 'immediate',
              name: 'immediate deployment',
            },
            {
              path: 'restore',
              name: 'immediate deployment',
            },
          ],
        },
        {
          path: 'dev',
          component: Development,
        },
        {
          path: '*',
          redirect: '/application/:id/details',
        },
      ],
    },

    { path: '*', component: NotFound, meta: { requiresAuth: true } },
  ],
});

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Sairam --- TODO
// Common handler for the Unauthorised error coming from the server
// axios.interceptors.response.use(null, error => {
//   if (error.response && error.response.status === 401) {
//     // Clearing auth info and redirecting to the login page
//     removeCookie('sessionId');
//     const redirect = router.currentRoute.path;
//     router.push({ path: '/login', query: { redirect } });
//   }

//   throw error;
// });

// router.beforeEach((to, from, next) => {
//   const userSession = getCookie('sessionId');
//   // Secure routes
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     // this route requires auth, check if logged in
//     // if not, redirect to login page.
//     if (!userSession) {
//       next({
//         path: '/login',
//         query: { redirect: to.fullPath },
//       });
//     }
//     next();
//   } else {
//     // make sure to always call next()
//     if (userSession) {
//       next({
//         path: '/all-apps',
//       });
//     }
//     next();
//   }
// });

export default router;
