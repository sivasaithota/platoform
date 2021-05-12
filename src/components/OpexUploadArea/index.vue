<!--Upload area component-->

<template>
  <v-layout
    :column="vertical"
    :style="{ height: height }"
    justify-center
    align-center
    tag="label"
    class="opex-upload-area"
  >
    <!--Input for uploading a folder-->
    <input
      v-if="folder"
      type="file"
      directory
      webkitdirectory
      multiple
      @input="onInput"
    >

    <!--Input for uploading files-->
    <input
      v-else
      type="file"
      :accept="accept"
      :multiple="multiple"
      @input="onInput"
    >

    <!--Area content-->
    <v-layout
      :column="vertical"
      align-center
    >
      <img
        :src="icons[icon]"
        :style="imageStyle"
        alt="upload"
      >
      <div v-if="state === 'uploading'">
        Uploading...
      </div>
    </v-layout>

    <v-layout
      column
      :align-center="vertical"
      v-if="state !== 'uploading'"
      class="upload-area-text"
    >
      <!--States-->
      <span
        v-if="state === $constant.uploadAreaStates.error"
        class="upload-error"
      >
        upload error
      </span>
      <span
        v-if="state === $constant.uploadAreaStates.success"
        class="upload-success"
      >
        upload success
      </span>

      <p>{{ message }}</p>

      <!--Hint or restrictions-->
      <span
        class="upload-restrictions"
        v-if="hint"
      >
        {{ hint }}
      </span>

      <span
        class="upload-restrictions"
        v-if="folder"
      >
        (folder only)
      </span>

      <span
        class="upload-restrictions"
        v-if="extensions && extensions.length || restrictions"
      >
        {{ secondaryMessage }}
      </span>
    </v-layout>
  </v-layout>
</template>

<script>
import cloud from '@/assets/svg/cloud-upload.svg';
import config from '@/assets/svg/config-file.svg';
import folder from '@/assets/svg/folder.svg';
import script from '@/assets/svg/script-file.svg';
import table from '@/assets/svg/table-file.svg';
import image from '@/assets/svg/image-file.svg';

import constant from '@/services/constant';

export default {
  name: 'opex-upload-area',

  props: {
    icon: {
      type: String,
      default: constant.uploadAreaIcons.cloud,
      validator(value) {
        return constant.uploadAreaIcons[value];
      },
    },

    state: {
      type: String,
      default: constant.uploadAreaStates.pending,
      validator(value) {
        return constant.uploadAreaStates[value];
      },
    },

    text: String,
    hint: String,
    restrictions: String,
    folder: Boolean, // Folder upload. If passed, extensions will be ignored
    multiple: Boolean,
    vertical: Boolean, // Position elements vertically
    // Array of allowed file extensions, e.g. ['csv', 'xls']
    extensions: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      files: [],
      icons: {
        cloud,
        config,
        folder,
        script,
        table,
        image,
      },
    };
  },

  computed: {
    // Allowed files for upload in the format expected by the file input element
    accept() {
      return this.extensions ? `.${this.extensions.join(',.')}` : '';
    },

    // Upload area height
    height() {
      return this.vertical ? '12rem' : '7rem';
    },

    imageStyle() {
      return {
        height: this.vertical ? '5rem' : '3.5rem',
        'margin-top': this.vertical ? 0 : '1rem',
      };
    },

    // Main message text
    message() {
      return this.state === this.$constant.uploadAreaStates.error || this.state === this.$constant.uploadAreaStates.success
        ? 'Click to upload again'
        : this.text;
    },

    // Secondary message text
    secondaryMessage() {
      let message = '(';
      if (this.extensions) message += `${this.extensions.join(', ')} only`;
      if (this.extensions && this.restrictions) message += '. ';
      if (this.restrictions) message += `${this.restrictions}`;
      message += ')';
      return message;
    },
  },

  methods: {
    // Emitting list of selected files to the parent component and clearing the input
    onInput(event) {
      this.$emit('files', Array.from(event.target.files));
      event.target.value = '';
    },
  },
};
</script>

<style scoped lang="scss">
  .opex-upload-area {
    min-width: 20rem;
    padding: 0.8rem;
    font-size: 1rem;
    font-weight: bold;
    border: 1px dashed var(--theme-border);
    border-radius: 0.2rem;
    cursor: pointer;

    input {
      display: none;
    }

    label {
      display: block;
      width: 100%;
      height: 100%;
    }

    div.layout {
      flex: 0 0 auto;

      div {
        color: var(--theme-text);
        opacity: 0.5;
      }
    }

    img {
      width: auto;
      margin: 0 0.8rem 1rem 0;
    }

    .upload-area-text {
      max-width: 70%;
      line-height: 1.2;

      .upload-error {
        text-transform: uppercase;
        color: var(--theme-error);
      }

      .upload-success {
        text-transform: uppercase;
        color: var(--theme-success);
      }

      p {
        margin: 0;
        color: var(--theme-text);
      }

      .upload-restrictions {
        font-size: 0.8rem;
        color: var(--theme-text);
        opacity: 0.5;
      }
    }
  }
</style>
