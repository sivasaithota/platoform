<!--Component used for displaying the uploaded folder info, its state and errors if any-->

<template>
  <v-layout
    justify-space-between
    align-center
    class="folder-state"
  >
    <!--Folder image with info-->
    <v-layout
      align-center
      class="folder-state-info"
    >
      <img :src="showScriptIcon ? scriptIcon : folderIcon" alt="folder"/>
      <div>
        <h4>{{ title }}</h4>
        <span> {{ text }} </span>
      </div>
    </v-layout>

    <!--Pending and success icons-->
    <div
      v-if="state === 'pending'"
      class="pending-state"
    ></div>
    <opex-icon
      v-if="state !== 'pending' && !errors.length"
      name="success-fill"
    />

    <!--Error icon with a tooltip containing all the errors-->
    <opex-tooltip
      v-if="state !== 'pending' && errors.length"
      color="error"
      icon="info-fill"
      title="ERROR"
      right
    >
      <template #activator>
        <opex-icon name="info-fill"/>
      </template>
      <p
        v-for="(error, index) in errors"
        :key="index"
      >
        {{ error }}
      </p>
    </opex-tooltip>
  </v-layout>
</template>

<script>
import scriptIcon from '@/assets/svg/script-file-icon.svg';
import folderIcon from '@/assets/svg/folder.svg';

export default {
  name: 'folder-state',

  props: {
    title: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      default: 'pending',
    },

    text: String,
    errors: Array,
    showScriptIcon: Boolean,
  },
  data() {
    return {
      scriptIcon,
      folderIcon,
    };
  },
};
</script>

<style scoped lang="scss">
  .folder-state {
    padding: 1rem;
  }

  .folder-state-info {
    min-height: 2.6rem;

    img {
      width: 3rem;
      margin-right: .8rem;
    }

    div {
      line-height: 1;
    }

    h4 {
      font-size: 1rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--theme-text);
    }

    span {
      font-size: .8rem;
      color: var(--theme-text);
      opacity: .6;
    }
  }

  .pending-state {
    width: 1.6rem;
    height: 1.6rem;
    margin: .2rem;
    border: .2rem solid var(--theme-border);
    border-radius: 50%;
  }

  i {
    font-size: 2.2rem;

    &.icon-info-fill {
      color: var(--theme-error);
    }

    &.icon-success-fill {
      color: var(--theme-success);
    }
  }

  p {
    margin-bottom: .3rem;
    font-size: .8rem;
    line-height: 1.5;
  }
</style>
