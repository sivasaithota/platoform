<template>
  <v-menu
    offset-y
    content-class="v-menu-container"
  >
    <template v-slot:activator="{ on }">
      <div
        v-on="on"
        class="d-flex justify-center align-center"
        :class="{'iframe-menu': isIframe, 'menu-icon': !isIframe}"
      >

        <img
          :src="waffleMenu"
          alt="Products menu"
          v-if="!isIframe"
        >
        <svg width="15px" height="14px" viewBox="0 0 15 14" version="1.1"
          xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" v-else>
          <title>Group 85</title>
          <g id="FINAL_Coupa-Branding_v1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="openx-Coupa-UI---Edit-App" transform="translate(-32.000000, -224.000000)" fill="#333333">
                  <g id="Group-85" transform="translate(32.000000, 224.000000)">
                      <rect id="Rectangle" x="0" y="0" width="15" height="2"></rect>
                      <rect id="Rectangle" x="0" y="12" width="15" height="2"></rect>
                      <rect id="Rectangle" x="0" y="6" width="15" height="2"></rect>
                  </g>
              </g>
          </g>
      </svg>
      </div>
    </template>
    <v-card class="products-container d-flex justify-center align-center" tile>
      <a
        class="product d-flex flex-column justify-center align-center"
        href="http://llama.ai/"
        target="_blank"
      >
        <svg width="47" height="47" viewBox="0 0 47 47">
          <g fill="#268ECD" id="supply-chain" fill-rule="nonzero">
            <path d="M23.5 0A23.5 23.5 0 0 1 47 23.5 23.5 23.5 0 0 1 23.5 47 23.5 23.5 0 0 1 0 23.5 23.5 23.5 0 0 1 23.5 0z"></path>
            <path fill="#fff" d="M-141.496,-306.35c0.256,-0.381 0.767,-0.466 1.151,
            -0.17c2.303,1.738 5.032,2.628 7.889,2.628s5.586,-0.932 7.888,-2.628c0.341,
            -0.254 0.853,-0.17 1.151,0.17c0.256,0.339 0.214,0.848 -0.17,1.144c-2.559,
            1.95 -5.671,2.967 -8.87,2.967c-3.197,0 -6.31,-1.017 -8.869,-2.967c-0.383,
            -0.254 -0.469,-0.763 -0.17,-1.144zm-3.157,-5.984c1.105,0 2,0.896 2,2c0,1.105 -0.895,
            2 -2,2c-1.104,0 -2,-0.895 -2,-2c0,-1.104 0.896,-2 2,-2zm24.178,0c1.104,0 2,0.896 2,
            2c0,1.105 -0.896,2 -2,2c-1.105,0 -2,-0.895 -2,-2c0,-1.104 0.895,-2 2,-2zm-5.208,
            -7.877c0.128,-0.043 0.256,0.042 0.256,0.17l0,6.695c0,0.085 -0.043,0.127 -0.128,
            0.17l-5.672,2.373c-0.128,0.042 -0.256,-0.043 -0.256,-0.17l0,-6.696c0,-0.084 0.043,
            -0.127 0.128,-0.17l5.672,-2.372zm-13.006,0.54l0.055,0.01l5.116,1.738c0.086,0 0.128,
            0.085 0.128,0.17l0,6.738c0,0.127 -0.128,0.212 -0.255,0.17l-5.117,-1.78c-0.086,0 -0.128,
            -0.085 -0.128,-0.17l0,-6.696c0,-0.127 0.128,-0.212 0.256,-0.17l-0.055,-0.01zm10.88,
            -10.326c0.213,-0.424 0.682,-0.593 1.108,-0.424c5.458,2.331 8.997,7.629 8.997,13.52c0,
            0.593 -0.042,1.186 -0.128,1.78c-0.042,0.423 -0.383,0.72 -0.81,0.72l-0.085,0c-0.469,
            -0.043 -0.768,-0.466 -0.725,-0.933c0.043,-0.55 0.085,-1.059 0.085,-1.568c0,-5.212 -3.112,
            -9.916 -7.973,-11.993c-0.427,-0.17 -0.597,-0.678 -0.47,-1.102l0.001,0zm-10.49,
            -0.424c0.426,-0.212 0.938,0 1.108,0.424c0.214,0.424 0,0.933 -0.426,1.102c-4.861,
            2.077 -7.974,6.78 -7.974,11.993c0,0.509 0,1.018 0.085,1.568c0.043,0.467 -0.255,0.89 -0.724,
            0.933l-0.086,0c-0.426,0 -0.767,-0.297 -0.853,-0.72c-0.085,-0.636 -0.127,-1.187 -0.127,
            -1.78c0,-5.891 3.539,-11.189 8.997,-13.52zm5.756,6.53c0.17,-0.085 0.384,-0.085 0.555,
            -0.042l5.841,1.78c0.171,0.084 0.171,0.296 0,0.381l-5.97,2.458c-0.17,0.085 -0.34,0.085 -0.511,
            0.042l-5.542,-1.949c-0.17,-0.085 -0.17,-0.297 0,-0.381l5.627,-2.289zm0.086,-8.87c1.104,0 2,
            0.896 2,2c0,1.105 -0.896,2 -2,2c-1.105,0 -2,-0.895 -2,-2c0,-1.104 0.895,-2 2,-2z"
            transform="translate(121,324) translate(35,17) "></path>
          </g>
        </svg>
        <span>Supply Chain</span>
      </a>
    </v-card>
  </v-menu>
</template>

<script>
import waffleMenu from '@/assets/svg/waffle-menu.svg';

export default {
  name: 'Products menu',

  data() {
    return {
      waffleMenu,
      isIframe: this.$common.isIframe(),
    };
  },
};
</script>

<style scoped lang="scss">
  .v-menu-container {
    border-radius: 0;
    left: 0 !important;
  }
  .menu-icon {
    width: $header-height;
    height: $header-height;
    cursor: pointer;
    &:hover {
      background-color: var(--theme-secondary);
    }
  }
  .iframe-menu {
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    &:hover {
      border: 1px solid var(--theme-accent);
      #openx-Coupa-UI---Edit-App {
        fill: var(--theme-accent);
      }
    }
  }
  .products-container {
    padding: 1.5rem;
    .product {
      width: 8rem;
      height: 8rem;
      background-color: transparent;
      color: var(--theme-secondary-text);
      transition: background-color 0.2s;
      cursor: pointer;
      text-decoration: none;
      &:hover {
        transition: background-color 0.2s;
        background-color: rgba(var(--theme-primary-rgb), 0.1);
        border-radius: 4px;
        border: 1px solid var(--theme-accent);
        color: var(--theme-accent);
        #supply-chain {
          fill: var(--theme-accent);
        }
      }
      &:active {
        transition: box-shadow 0.1s;
        box-shadow: 0 0 0.7rem rgba(0, 0, 0, 0.1) inset;
      }
      span {
        padding-top: 0.3rem;
        font-size: 1.2rem;
        font-weight: 400;
      }
    }
  }
</style>
