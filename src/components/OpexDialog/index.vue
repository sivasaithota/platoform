<!--Dialog component based on the Vuetify dialog-->

<template>
  <v-dialog
    persistent
    v-model="model"
    :width="width"
    :content-class="contentClass"
    :disabled="disabled"
  >
    <!--Using the passed slot content as the activator-->
    <template #activator="{ on }">
      <span v-on="on">
        <slot name="activator"/>
      </span>
    </template>

    <!--Dialog content-->
    <v-card>
      <v-card-title class="opex-dialog-header">
        <v-layout
          align-center
          justify-space-between
        >
          <v-layout
            align-center
          >
            <div :class="{'opex-dialog-header-title': useTitleLowercase}">
              {{ title }}
            </div>
            <v-progress-circular
              v-if="!hideHeaderCircular"
              indeterminate
              color="secondary"
              width="4"
              style="height: 1.8rem; width: 1.8rem;"
            />
          </v-layout>
          <opex-icon
            v-if="!hideCloseBtn"
            v-ripple
            class="close-icon-btn"
            name="close"
            @click.native="cancel"
          />
        </v-layout>
      </v-card-title>
      <v-divider/>

      <slot/>

      <!--Action buttons-->
      <v-divider v-if="!hideFooter"/>
      <v-card-actions
        class="opex-dialog-footer"
        v-if="!hideFooter"
      >
        <slot name="footerInfo"/>
        <v-spacer/>
        <!-- progress indication -->
        <v-progress-circular
          v-if="inProgressStatus"
          indeterminate
          color="secondary"
          width="2"
          class="progress-bar"
          style="height: 1.8rem; width: 1.8rem;"
        />

        <div
          class="in-progress-text"
          v-if="inProgressStatus">
          {{inProgressText}}
        </div>

        <!-- buttons -->
        <v-btn
          v-if="!inProgressStatus"
          class="text-capitalize"
          :text="!isCancelFlat"
          :color="confirmColor"
          :disabled="isConfirmDisabled"
          @click="confirm"
        >
          {{ confirmText }}
        </v-btn>

        <v-btn
          class="text-capitalize"
          :text="isCancelFlat"
          :color="cancelColor"
          @click="cancel"
          :disabled="inProgressStatus"
        >
          {{ cancelText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'OpexDialog',

  props: {
    value: Boolean,
    title: String,
    contentClass: String,
    disabled: Boolean,
    inProgressStatus: Boolean,
    inProgressText: {
      type: String,
      default: '',
    },
    hideFooter: Boolean,
    hideCloseBtn: Boolean,
    hideHeaderCircular: {
      type: Boolean,
      default: true,
    },
    useTitleLowercase: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: '50rem',
    },
    confirmText: {
      type: String,
      default: 'Confirm',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
    confirmColor: {
      type: String,
      default: 'secondary',
    },
    cancelColor: {
      type: String,
      default: 'primary',
    },
    isCancelFlat: {
      type: Boolean,
      default: true,
    },
    isConfirmDisabled: {
      type: Boolean,
    },
  },

  data() {
    return {
      enterHandler: null,
    };
  },

  computed: {
    // Controls dialog visibility
    model: {
      get() {
        return this.value;
      },
      set(value) {
        if (value) {
          this.enterHandler = document.onkeydown;
          document.onkeydown = this.keyboardAction;
        } else {
          document.onkeydown = this.enterHandler;
        }
        this.$emit('input', value);
      },
    },
  },

  methods: {
    confirm() {
      this.$emit('confirm');
      this.model = false;
    },

    cancel() {
      this.$emit('cancel');
      if (!this.inProgressStatus) {
        this.model = false;
      }
    },

    keyboardAction(ev) {
      // Handle ESCAPE btn
      if (ev.code === 'Escape') {
        this.cancel();
        return;
      }
      // Handle ENTER btn
      if (ev.code === 'Enter') {
        const action = this.isCancelFlat ? this.confirm : this.cancel;
        action();
      }
    },
    resetForm() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style scoped lang="scss">
  .opex-dialog-header, .opex-dialog-footer {
    padding: 1rem 1.3rem;
    font-size: 2rem;
    font-weight: bold;
    .v-progress-circular {
      margin-left: 1rem;
    }
  }
  .opex-dialog-footer {
    .in-progress-text {
      font-size: 1rem;
    }
    .progress-bar {
      margin-right: 1rem;
    }
  }
  .opex-dialog-header-title {
    text-transform: lowercase;
    &::first-letter {
      text-transform: uppercase;
    }
  }

</style>
