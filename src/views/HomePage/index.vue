<!--Home page component-->

<template>
  <app-wrapper>
    <app-header/>
    <app-sidebar/>
    <router-view/>
  </app-wrapper>

</template>

<script>
import AppHeader from '@/components/AppHeader';
import AppWrapper from '@/components/AppWrapper';
import AppSidebar from './AppSidebar';

export default {
  name: 'HomePage',

  components: { AppHeader, AppSidebar, AppWrapper },
};
</script>

<style lang="scss">
  .sidebar-menu {
    padding: 1rem 0;
    .sidebar-title {
      padding-left: $sidebar-padding;
      margin-bottom: .5rem;
      color: var(--theme-secondary-text);
      opacity: .5;
      text-transform: uppercase;
      font-weight: 800;
      font-size: .8rem;
    }
  }
  .sidebar-container {
    padding: 1rem $sidebar-padding;
    position: relative;
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-color: rgba(var(--theme-primary-text-rgb), 0.1);
  }
</style>
