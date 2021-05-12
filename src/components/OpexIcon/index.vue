<!--Opex icon font-->

<template>
  <i :class="['icon-'+name]"></i>
</template>

<script>
export default {
  name: 'opex-icon',

  props: {
    name: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
  $fontPathIcons: "../../assets/fonts/OpexIcon/";
  $fontPathIcons-v2: "../../assets/fonts/OpexIcon/v2/";
  $fontPathIcons-v10: "../../assets/fonts/OpexIcon/v10/";

  @font-face {
    font-family: 'OpexIcon';
    src: url($fontPathIcons + 'platform-icon-library.eot');
    src: url($fontPathIcons + 'platform-icon-library.eot#iefix') format('embedded-opentype'),
      url($fontPathIcons + 'platform-icon-library.woff') format('woff'),
      url($fontPathIcons + 'platform-icon-library.ttf') format('truetype'),
      url($fontPathIcons + 'platform-icon-library.svg#OpexIcon') format('svg');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'OpexIcon-v2';
    src: url($fontPathIcons-v2 + 'platform-icon-library.eot');
    src: url($fontPathIcons-v2 + 'platform-icon-library.eot#iefix') format('embedded-opentype'),
      url($fontPathIcons-v2 + 'platform-icon-library.woff') format('woff'),
      url($fontPathIcons-v2 + 'platform-icon-library.ttf') format('truetype'),
      url($fontPathIcons-v2 + 'platform-icon-library.svg#OpexIcon') format('svg');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
  font-family: 'OpexIcon-v10';
  src:  url($fontPathIcons-v10 + 'platform-icon-library.eot?fyqtid');
  src:  url($fontPathIcons-v10 + 'platform-icon-library.eot?fyqtid#iefix') format('embedded-opentype'),
    url($fontPathIcons-v10 + 'platform-icon-library.ttf?fyqtid') format('truetype'),
    url($fontPathIcons-v10 + 'platform-icon-library.woff?fyqtid') format('woff'),
    url($fontPathIcons-v10 + 'platform-icon-library.svg?fyqtid#platform-icon-library') format('svg');
  font-weight: normal;
  font-style: normal;
  // font-display: block;
}

  @import "./v1.css";
  @import "./v2.css";
  @import "./v10.css";
</style>
