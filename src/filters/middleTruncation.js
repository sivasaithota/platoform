// Filter for truncation text value

import Vue from 'vue';
import constant from '@/services/constant';

Vue.filter('middleTruncation', (value) => {
  const { startStrLength, endStrLength, minIndentValue } = constant.middleTruncationProps;
  return value.length <= (startStrLength + endStrLength + minIndentValue)
    ? value
    : `${value.substring(0, startStrLength)}...${value.substring(value.length - endStrLength)}`;
});
