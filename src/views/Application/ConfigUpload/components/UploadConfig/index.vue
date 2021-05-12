<!--Component with area for uploading config files drawer on the config file upload page-->

<template>
  <opex-upload-area
    :icon="$constant.uploadAreaIcons.config"
    text="Click to upload Config files"
    :extensions="[$constant.allowedConfigFileExtension]"
    :state="uploadStatus"
    multiple
    @files="onUpload($event)"
  />
</template>

<script>
import { mapActions } from 'vuex';
import { map } from 'lodash';

import validator from '@/services/validator';

export default {
  name: 'UploadConfig',

  data() {
    return {
      unacceptedConfigs: [
        'InputTableConfig.json',
        'OutputTableConfig.json',
      ],
      uploadStatus: null,
    };
  },

  methods: {
    ...mapActions({
      uploadConfig: 'application/uploadConfig',
      showSnackbar: 'snackbar/show',
    }),

    // Upload selected config file
    onUpload(files) {
      this.uploadStatus = this.$constant.uploadAreaStates.uploading;
      return this.validateConfigFiles(files).then(() => {
        return this.uploadConfig({
          appId: this.$route.params.id,
          folder: 'config',
          files,
        });
      }).then(() => {
        this.uploadStatus = this.$constant.uploadAreaStates.success;
        // Send uploaded file info to the list of configs
        this.$emit('uploaded', map(files, 'name'));
      }).catch(() => {
        this.uploadStatus = this.$constant.uploadAreaStates.error;
      });
    },

    validateConfigFiles(files) {
      const promises = [];
      files.forEach(file => {
        let promise;
        // Check permission uploading such config with such name
        if (this.unacceptedConfigs.indexOf(file.name) !== -1) {
          promise = Promise.reject(new Error(this.$message.common.unacceptableFile));
        } else {
          promise = new Promise((resolve, reject) => {
            // Check structure and content of uploaded file
            validator.validateConfig(file).then(result => {
              promise = result !== true
                ? reject(new Error(`${file.name}: ${result}`))
                : resolve();
            });
          });
        }
        promises.push(promise);
      });

      return Promise.all(promises);
    },
  },
};
</script>
