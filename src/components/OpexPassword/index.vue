<!--Password Input component with a popup containing a list of requirements for a valid password
    Can be readonly if an appropriate property is passed
-->

<!--Events:
    @input: on the input value change. Payload - updated input value, string
    @error: on the validation state change. Payload - error existence, boolean
-->

<template>
  <div class="opex-password">
    <!--Popup with the list of requirements for the password-->
    <v-menu
      bottom
      offset-y
      input-activator
      nudge-top="20"
      transition="slide-y-transition"
      v-model="popupVisible"
      :content-class="readonly || !requirements.length ? 'password-popup-invisible' : ''"
      :close-on-content-click="false"
      :close-on-click="false"
    >
      <!--Password input field, activator for the popup-->
      <template #activator="{ on }">
        <v-text-field
          class="opex-password-input"
          color="secondary"
          ref="password"
          v-on="on"
          v-model="password"
          :label="label"
          :placeholder="placeholder"
          :type="lettersVisible ? 'text' : 'password'"
          :readonly="readonly"
          :hide-details="readonly"
          :rules="readonly ? [] : rules"
          validate-on-blur
          @input="validateInput"
          @blur="popupVisible = false"
          @update:error="$emit('error', $event)"
        >
          <template #append>
            <button
              type="button"
              class="v-icon v-icon--link support--text"
              @click="lettersVisible = !lettersVisible"
            >
              <opex-icon
                v-if="!lettersVisible"
                name="v2-eye"
              />
              <opex-icon
                v-else
                name="v2-eye-blocked"
              />
            </button>
          </template>
        </v-text-field>
      </template>

      <!--Popup content-->
      <div
        v-if="!readonly && requirements.length"
        class="opex-password-popup"
      >
        <span>password requirements</span>
        <v-layout
          align-center
          class="password-rule"
          v-for="(rule, index) in passwordRequirements"
          :key="index"
        >
          <!--Icon indicating if each particular rule has passed the validation-->
          <opex-icon
            v-if="rule.valid"
            name="success-fill"
          />
          <opex-icon
            v-else
            name="info-fill"
          />

          {{ rule.text }}
        </v-layout>
      </div>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'OpexPassword',

  props: {
    value: String,
    readonly: Boolean,

    // List of requirements for the valid password
    requirements: {
      type: Array,
      default() {
        return [];
      },
    },

    placeholder: {
      type: String,
      default: ' ', // without a placeholder the label will be positioned incorrectly
    },
    label: {
      type: String,
      default: 'password',
    },
  },

  data() {
    return {
      lettersVisible: false, // Visibility of the typed letters
      popupVisible: false, // Visibility of the popups with password rules

      // Validation rule checking if password meets all the requirements
      rules: [
        () => this.passwordRequirements.every(requirement => requirement.valid)
          || this.$message.common.passwordAllRules,
      ],
    };
  },

  computed: {
    password: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },

    passwordRequirements() {
      // Adding flag indicating if each particular requirement is met
      this.requirements.forEach(requirement => {
        requirement.valid = false;
      });
      return this.requirements;
    },
  },

  methods: {
    // Validating the input value
    validateInput(value) {
      this.passwordRequirements.forEach(requirement => {
        requirement.valid = requirement.rule(value);
      });
    },
  },

  mounted() {
    // Manually validating the initial value on component mount
    this.validateInput(this.value);
    this.$refs.password.validate();
  },
};
</script>

<style scoped lang="scss">
  .v-menu__content {
    background-color: var(--theme-background-light);
    border-radius: 0.3rem;
    box-shadow: 0 0.2rem 0.5rem 0 var(--theme-background-grey);
  }

  .password-popup-invisible {
    display: none;
  }

  .opex-password-popup {
    padding: 0.6rem 1rem 0 0.6rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--theme-text);
    border: solid 1px var(--theme-border-light);
    border-radius: 0.3rem;

    span {
      display: block;
      margin-bottom: 0.4rem;
      opacity: 0.4;
      font-weight: 700;
      text-transform: uppercase;
    }

    .password-rule {
      margin-bottom: 0.6rem;

      i {
        margin-right: 0.2rem;
        font-size: 1.4rem;
        color: var(--theme-support);

        &.icon-success-fill {
          color: var(--theme-success);
        }
      }
    }
  }
</style>

<style lang="scss">
  div.opex-password-input.v-text-field {
    cursor: default;

    .v-input__slot, .v-messages {
      cursor: default;
    }

    input {
      cursor: text;
    }

    div.v-input__icon--append i.v-icon--link.fa {
      color: var(--theme-text) !important;

      &:before {
        font-size: 1rem;
      }
    }
  }

  div.opex-password-input.v-text-field.v-input--is-readonly {
    div.v-input__control  div.v-input__slot {
      background-color: transparent;
      border-color: transparent;

      input {
        padding: 0;
        cursor: text;
      }
    }

    .v-input__append-inner {
      margin: 0;
    }

    div.v-text-field__slot .v-label {
      font-size: 0.93rem;
    }
  }
</style>
