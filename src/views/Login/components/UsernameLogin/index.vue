<!--Component with sign in button to login to Enframe using normal username/password on the Login page-->

<template>
  <v-layout column>
    <v-layout
      v-if="isFieldsVisible"
      column
    >
      <!--User name field-->
      <v-text-field
        v-model="username"
        label="User name"
        class="input"
        solo
      >
        <!--TODO add icon-->
        <template v-if="false" #prepend-inner>
          <opex-icon name="profile-page"/>
        </template>
      </v-text-field>

      <!--User name field-->
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        class="input"
        solo
      >
        <!--TODO add icon-->
        <template v-if="false" #prepend-inner>
          <opex-icon name="log-off"/>
        </template>
      </v-text-field>
    </v-layout>

    <!--Show form and login to the app-->
    <v-btn
      large
      color="secondary"
      @click="login"
    >
      Login with username
    </v-btn>

    <!--Form control block-->
    <v-layout>
      <!--Hide login form-->
      <v-btn
        v-if="isFieldsVisible"
        text
        color="primary-text"
        class="text-capitalize"
        @click="activateForms"
      >
        <v-layout
          row
          justify-center
          align-center
        >
          <!--TODO add icon-->
          <span>Back</span>
        </v-layout>
      </v-btn>


      <!--Forgot password block-->
      <v-layout
        row
        align-center
        :justify-center="!isFieldsVisible"
        :justify-end="isFieldsVisible"
        fill-height
        class="help-content"
      >
        <h4 class="help-text">Forgot Password</h4>
        <!--Popup with password recovery instructions-->
        <opex-popup
          title="FORGOT PASSWORD"
          icon="info-fill"
          :is-action-block="false"
          right
        >
          <!--TODO add icon-->
          <opex-icon
            name="info-fill"
            class="opex-icon info-icon"
          ></opex-icon>
          <template #message>
            <p>No issues! Kindly contact
              <a href="mailto:support@opexanalytics.com">support@opexanalytics.com</a>.
              We will send you the credentials.
            </p>
          </template>
        </opex-popup>
      </v-layout>
    </v-layout>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'UsernameLogin',

  data() {
    return {
      isFieldsVisible: false,
      username: '',
      password: '',
    };
  },

  methods: {
    ...mapActions('user', {
      userLogin: 'userLogin',
    }),

    login() {
      if (this.isFieldsVisible) {
        this.userLogin({
          username: this.username,
          password: this.password,
        });
      } else {
        this.activateForms();
      }
    },

    activateForms() {
      this.isFieldsVisible = !this.isFieldsVisible;
      this.$emit('visibility', !this.isFieldsVisible);
    },
  },
};
</script>

<style scoped lang="scss">
  button.v-btn.v-size--large.v-btn--contained {
    padding: 1.32rem 1.2rem;
    margin: 0.4rem 0;
  }

  .help-content {
    margin: 1.2rem 0 0;
    i {
      color: var(--theme-primary-text);
      font-size: 1.43rem;
    }
    .help-text {
      color: var(--theme-primary-text);
      font-size: 1.14rem;
      font-weight: bold;
    }
    .input.v-text-field {
      margin: 0 0.5rem;
      font-size: 1.2rem;
      i {
        font-size: 1.43rem;
      }
    }
  }

  .v-btn.v-btn--text {
    margin: 0.7rem 0;
    font-size: 1.14rem;
  }
</style>
