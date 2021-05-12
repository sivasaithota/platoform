// Service for common functions used across the app

import Vue from 'vue';
import constant from '@/services/constant';

// Injecting this module as a dependency to the Vue instance, so in the Vue components it can be used as $common
Vue.mixin({
  beforeCreate() {
    const options = this.$options;
    if (options.common) this.$common = options.common;
    else if (options.parent && options.parent.$common) this.$common = options.parent.$common;
  },
});

export default {
  // Reading the contents of the file
  readFile: file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = fileContent => resolve(fileContent.target.result);
      reader.onerror = error => reject(error);

      reader.readAsText(file);
    });
  },

  // Checking if file size exceeds the allowed limit of Megabytes
  checkFileSize(file, limit) {
    return (file.size / (1024 * 1024)) < limit;
  },

  // Generating new parameter data structure
  // Expects parameter type
  createEmptyParameter(type) {
    const newParameter = {
      name: null,
      defaultValue: '',
      type,
      tooltip: null,
      isHovered: false,
      isPickerOpen: false,
      isRequired: false,
    };
    if (type === constant.parameterTypes.text) newParameter.isNumeric = false;
    if (type === constant.parameterTypes.checkbox
      || type === constant.parameterTypes.radio) newParameter.dropdownValues = [];
    return newParameter;
  },

  // Scroll animation function
  // Expects element, postion, duration of the animation
  scrollTo(element, to, duration) {
    const start = element.scrollTop; // current scroll postion
    const change = to - start; // differents between current postion and destination postion
    let currentTime = 0;
    const increment = 20;
    const easeInOutQuad = (t, b, c, d) => { // function for calculating easeInout animation
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t -= 1;
      return -(c / 2) * (t * (t - 2) - 1) + b;
    };
    const animateScroll = () => { // actual function to scrolling
      currentTime += increment;
      element.scrollTop = easeInOutQuad(currentTime, start, change, duration);
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  },
  isIframe() {
    return window.self !== window.top;
  },
};
