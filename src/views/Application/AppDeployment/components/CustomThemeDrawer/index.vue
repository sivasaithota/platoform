<!--Contents of the custom theme constructor drawer-->

<template>
  <div class="custom-theme-drawer drawer-form">
    <!--Custom theme name input-->
    <opex-input
      v-model="themeName"
      label="theme name"
      placeholder="Enter theme name"
      required
    />

    <!--Color pickers for primary and secondary theme colors-->
    <span class="opex-label">color theme</span>
    <v-layout
      class="theme-color-picker"
      justify-space-between
      align-center
    >
      <v-layout
        v-for="(color, index) in colors"
        :key="index"
        align-center
      >
        <!--Popup with color picker-->
        <v-menu
          offset-y
          transition="slide-y-transition"
          :close-on-content-click="false"
        >
          <template #activator="{ on }">
            <span v-on="on">
              <opex-icon
                v-ripple
                name="edit"
                :style="{ 'background-color': color.value }"
              />
            </span>
          </template>

          <v-color-picker
            :value="color.value"
            v-model="color.value"
            mode="hexa"
            hide-mode-switch
            width="250"></v-color-picker>
        </v-menu>

        <!--Picked color-->
        <v-layout column>
          <span class="opex-label">
            {{ color.name }}
          </span>
          <span class="selected-color">
            {{ color.value }}
          </span>
        </v-layout>
      </v-layout>
    </v-layout>

    <!--Theme background image upload area-->
    <span class="opex-label">background image</span>
    <div class="img-description">
      {{ $message.customTheme.backgroundImgDescription }}
    </div>
    <opex-upload-area
      v-if="!image.dataURL"
      vertical
      text="Click to upload image"
      restrictions="2MB max"
      :icon="$constant.uploadAreaIcons.image"
      :extensions="imageExtensions"
      :state="image.uploadState"
      @files="imageUpload"
    />

    <div
      v-else
      class="custom-theme-image"
    >
      <!--Uploaded background image-->
      <img
        alt="background"
        :src="image.dataURL"
      >

      <!--Delete background btn-->
      <v-btn
        fab
        color="background-light"
        @click="deleteImage('image')"
      >
        <opex-icon name="delete-fill"/>
      </v-btn>
    </div>

    <!--Theme logo image upload area-->
    <span class="opex-label">client logo</span>
    <div class="img-description">
      {{ $message.customTheme.clientLogoImgDescription }}
    </div>
    <opex-upload-area
      v-if="!logo.dataURL"
      text="Click to upload logo"
      restrictions="500KB max"
      :icon="$constant.uploadAreaIcons.image"
      :extensions="logoExtensions"
      :state="logo.uploadState"
      @files="logoUpload"
    />

    <div
      v-else
      class="custom-theme-image"
    >
      <!--Uploaded logo image-->
      <img
        class="custom-theme-logo"
        alt="logo"
        :src="logo.dataURL"
      >

      <!--Delete logo btn-->
      <v-btn
        fab
        @click="deleteImage('logo')"
      >
        <opex-icon name="delete-fill"/>
      </v-btn>
    </div>

    <!-- removed by task https://opexanalytics.atlassian.net/browse/NFR-1510 -->
    <!--Theme logo image upload area-->
<!--    <span class="opex-label">client icon</span>-->
<!--    <div class="img-description">-->
<!--      {{ $message.customTheme.clientIconDescription }}-->
<!--    </div>-->
<!--    <opex-upload-area-->
<!--      v-if="!icon.dataURL"-->
<!--      text="Click to upload logo"-->
<!--      restrictions="500KB max"-->
<!--      :icon="$constant.uploadAreaIcons.image"-->
<!--      :extensions="iconExtensions"-->
<!--      :state="icon.uploadState"-->
<!--      @files="iconUpload"-->
<!--    />-->

<!--    <div-->
<!--      v-else-->
<!--      class="custom-theme-image"-->
<!--    >-->
<!--      &lt;!&ndash;Uploaded logo image&ndash;&gt;-->
<!--      <img-->
<!--        class="custom-theme-logo"-->
<!--        alt="logo"-->
<!--        :src="icon.dataURL"-->
<!--      >-->

<!--      &lt;!&ndash;Delete logo btn&ndash;&gt;-->
<!--      <v-btn-->
<!--        fab-->
<!--        @click="deleteImage('icon')"-->
<!--      >-->
<!--        <opex-icon name="delete-fill"/>-->
<!--      </v-btn>-->
<!--    </div>-->

<!--    <opex-switch-->
<!--      v-model="disableFooter"-->
<!--      label="disable footer"-->
<!--      :description="$message.customTheme.disableFooter"-->
<!--    />-->

    <!--Spinner and buttons-->
    <v-divider/>
    <v-layout
      justify-end
      align-center
    >
      <v-progress-circular
        v-if="uploading"
        indeterminate
        color="secondary"
      />

      <v-btn
        color="secondary"
        small
        @click="updatingTheme ? updateCustomTheme() : createCustomTheme()"
        :disabled="uploading || !image.dataURL || !themeName"
      >
        {{ updatingTheme ? 'update': 'create' }}
      </v-btn>

      <v-btn
        text
        small
        color="primary"
        class="text-capitalize"
        @click="$emit('close')"
      >
        cancel
      </v-btn>
    </v-layout>
    <v-divider/>
  </div>
</template>

<script>
import JSZip from 'jszip';
import { mapActions, mapState } from 'vuex';

import defaultColors from '@/assets/themes/default';

export default {
  name: 'CustomThemeDrawer',

  data() {
    return {
      updatingTheme: false,
      themeName: '',
      disableFooter: false,

      image: {
        uploadState: this.$constant.uploadAreaStates.pending,
        file: null,
        dataURL: null,
      },

      logo: {
        uploadState: this.$constant.uploadAreaStates.pending,
        file: null,
        dataURL: null,
      },

      icon: {
        uploadState: this.$constant.uploadAreaStates.pending,
        file: null,
        dataURL: null,
      },

      colors: {
        primary: {
          name: 'primary color',
          value: defaultColors.primary,
        },
        secondary: {
          name: 'secondary color',
          value: defaultColors.secondary,
        },
      },

      imageExtensions: ['jpeg', 'png'],
      logoExtensions: ['png'],
      iconExtensions: ['png'],
      uploading: false,
    };
  },

  computed: {
    ...mapState({
      appTheme: state => state.application.appTheme,
    }),
  },

  methods: {
    ...mapActions({
      showSnackbar: 'snackbar/show',
      createTheme: 'application/createTheme',
      updateTheme: 'application/updateTheme',
      updateThemeImage: 'application/updateThemeImage',
    }),

    showFileSizeError() {
      this.showSnackbar({
        type: this.$constant.snackbarTypes.error,
        title: this.$message.common.errorUploadingFile,
        message: this.$message.common.fileSizeRestriction,
      });
    },

    // Background image upload handler
    imageUpload([file]) {
      // Validating image size
      if (!this.$common.checkFileSize(file, 2)) {
        this.showFileSizeError();
        this.image.uploadState = this.$constant.uploadAreaStates.error;
        return;
      }

      this.image.file = file;
      this.image.dataURL = URL.createObjectURL(file); // creating URL to the uploaded image
    },

    // Logo image upload handler
    logoUpload([file]) {
      // Validating logo size
      if (!this.$common.checkFileSize(file, 0.5)) {
        this.showFileSizeError();
        this.logo.uploadState = this.$constant.uploadAreaStates.error;
        return;
      }

      this.logo.file = file;
      this.logo.dataURL = URL.createObjectURL(file); // creating URL to the uploaded logo
    },

    // Icon image upload handler
    iconUpload([file]) {
      // Validating icon size
      if (!this.$common.checkFileSize(file, 0.5)) {
        this.showFileSizeError();
        this.icon.uploadState = this.$constant.uploadAreaStates.error;
        return;
      }

      this.icon.file = file;
      this.icon.dataURL = URL.createObjectURL(file); // creating URL to the uploaded logo
    },

    // Background/logo image delete btn handler
    deleteImage(type) {
      this[type].uploadState = this.$constant.uploadAreaStates.pending;
      this[type].dataURL = null;
      this[type].file = null;
    },

    // Create theme btn click handler
    createCustomTheme() {
      this.uploading = true;

      // Combining JSON data
      const details = {
        name: this.themeName,
        images: {
          background: this.image.file.name,
        },
        colorSchemes: [{
          mainColor: this.colors.primary.value,
          extraColor: this.colors.secondary.value,
        }],
        disableFooter: this.disableFooter,
      };

      // Creating zip file with uploaded background image
      const zip = new JSZip();
      zip.file(this.image.file.name, this.image.file);

      // Adding logo if uploaded
      if (this.logo.file) {
        details.images.logo = this.logo.file.name;
        zip.file(this.logo.file.name, this.logo.file);
      }

      // Adding logo if uploaded
      if (this.icon.file) {
        details.images.icon = this.icon.file.name;
        zip.file(this.icon.file.name, this.icon.file);
      }

      // Generating zip file without compression
      return zip.generateAsync({
        type: 'blob',
      }).then(archive => {
        return this.createTheme({
          details,
          archive,
          images: {
            backgroundUrl: this.image.dataURL,
            logoUrl: this.logo.dataURL,
            iconUrl: this.icon.dataURL,
          },
        });
      }).then(() => {
        this.uploading = false;
        this.$emit('close');
      });
    },

    // Update theme btn click handler
    updateCustomTheme() {
      const promises = [];

      // If theme name or any color was changed
      if (this.themeName !== this.appTheme.name
        || this.colors.primary.value !== this.appTheme.colorSchemes[0].mainColor
        || this.colors.secondary.value !== this.appTheme.colorSchemes[0].extraColor
        || this.disableFooter !== this.appTheme.disableFooter) {
        // Sending a request to update theme data
        promises.push(this.updateTheme({
          themeId: this.appTheme._id,
          data: {
            name: this.themeName,
            colorSchemes: [{
              mainColor: this.colors.primary.value,
              extraColor: this.colors.secondary.value,
            }],
            disableFooter: this.disableFooter,
          },
        }));
      }

      // Request to update background image if uploaded
      if (this.image.file) {
        promises.push(this.updateThemeImage({
          themeId: this.appTheme._id,
          file: this.image.file,
          image: this.image.dataURL,
          type: this.$constant.themeImageTypes.background,
        }));
      }

      // Request to update logo image if uploaded
      if (this.logo.file) {
        promises.push(this.updateThemeImage({
          themeId: this.appTheme._id,
          file: this.logo.file,
          image: this.logo.dataURL,
          type: this.$constant.themeImageTypes.logo,
        }));
      }

      // Request to update icon image if uploaded
      if (this.icon.file) {
        promises.push(this.updateThemeImage({
          themeId: this.appTheme._id,
          file: this.icon.file,
          image: this.icon.dataURL,
          type: this.$constant.themeImageTypes.icon,
        }));
      }

      this.uploading = true;
      Promise.all(promises)
        .then(() => {
          this.uploading = false;
          this.$emit('close');

          this.showSnackbar({
            type: this.$constant.snackbarTypes.success,
            title: this.$constant.snackbarTypes.success,
            message: this.$message.customTheme.themeUpdated,
          });
        });
    },
  },

  mounted() {
    // If the app theme is a custom one, taking initial values for images and colors from it for updating
    if (this.appTheme.group === this.$constant.themeGroups.custom) {
      this.updatingTheme = true;
      this.themeName = this.appTheme.name;
      this.image.dataURL = this.appTheme.images.backgroundUrl;
      this.logo.dataURL = this.appTheme.images.logoUrl;
      this.icon.dataURL = this.appTheme.images.iconUrl;
      this.colors.primary.value = this.appTheme.colorSchemes[0].mainColor;
      this.colors.secondary.value = this.appTheme.colorSchemes[0].extraColor;
      this.disableFooter = this.appTheme.disableFooter;
    }
  },
};
</script>

<style lang="scss" scoped>
  .custom-theme-drawer {
    .opex-label {
      font-size: .7rem;
      color: var(--theme-secondary);
    }

    .img-description {
      font-size: .8rem;
      font-weight: 500;
      color: rgba(var(--theme-primary-rgb), 0.5);
      width: 90%;
      margin-bottom: .3rem;
    }

    .opex-upload-area {
      margin-bottom: 1.4rem;
      background-color: var(--theme-secondary-background);
    }

    .custom-theme-image {
      position: relative;

      img {
        margin-bottom: 1.4rem;
        display: block;
        width: 100%;
      }

      .custom-theme-logo {
        padding: 1.2rem;
        background-color: var(--theme-background-grey);
      }

      .v-btn {
        position: absolute;
        top: 0;
        right: 0;
      }

      .icon-delete-fill {
        color: var(--theme-secondary);
      }
    }

    .theme-color-picker {
      margin-bottom: 2rem;
    }

    .icon-edit {
      display: block;
      height: 2rem;
      width: 2rem;
      margin-right: .4rem;
      font-size: 2rem;
      border-radius: 0.3rem;
      color: var(--theme-primary-text);
      cursor: pointer;
    }

    .selected-color {
      font-size: .8rem;
      font-weight: 600;
    }

    .v-progress-circular {
      width: 1.8rem;
      height: 1.8rem;
      margin-right: 1rem;
    }
  }
</style>
