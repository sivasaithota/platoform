<!--Input field component based on the Vuetify TextField component-->
<!--Textarea component based on the Vuetify Textarea component
    when 'textarea' property is passed-->
<!--Input with autocomplete based on the Vuetify Autocomplete component
    when 'autocompleteItems' array property is passed-->

<!--Saved label if needed should be passed through the default slot-->
<!--Append slot is used for passing in any markup which will be appended
    inside the input to the right end. E.g. icon with tooltip-->

<!--Events:
    @input: on the input value change. Payload - updated input value, string
    @valid: on the validation state change. Payload - validation state, boolean
    @save: on the save button click. No payload
-->

<template>
  <div class="opex-input">

    <!-----Textarea----->
    <v-textarea
      color="secondary"
      auto-grow
      v-if="textarea"
      v-model="text"
      :rows="rows"
      :class="{'input-controls': controls, 'input-controls-editing': editing}"
      :label="label"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :counter="maxLength"
      :hide-details="hideDetails"
      :rules="rules"
      @focus="onFocus"
      @update:error="onValidation"
    >
      <template #append>
        <!--Edit icon-->
        <opex-icon
          name="edit"
          :class="{visible: controls && !editing}"
        />

        <!--Textarea controls if appropriate prop is passed-->
        <v-scroll-x-reverse-transition v-if="controls">
          <v-layout v-show="editing">
            <!--Save button-->
            <v-btn
              fab
              small
              color="secondary"
              :disabled="!valid || (!text && required)"
              @click="onSave"
            >
              <opex-icon name="success"/>
            </v-btn>

            <!--Cancel button-->
            <v-btn
              fab
              small
              color="primary"
              @click="onCancel"
            >
              <opex-icon name="close"/>
            </v-btn>
          </v-layout>
        </v-scroll-x-reverse-transition>
      </template>
    </v-textarea>

    <!-----Autocomplete----->
    <v-autocomplete
      color="secondary"
      v-if="autocompleteItems"
      v-model="text"
      :items="autocompleteItems"
      :item-text="itemText"
      :item-value="itemValue"
      :return-object="returnObject"
      :label="label"
      :placeholder="placeholder"
      :rules="rules"
      :multiple="multiple"
      :chips="chips"
      :menu-props="menuProps"
      @update:error="onValidation"
      @change="$emit('change', $event)"></v-autocomplete>

    <!-----Input field----->
    <v-text-field
      color="secondary"
      v-if="!textarea && !autocompleteItems"
      v-model="text"
      :type="type"
      :min="min"
      :max="max"
      :class="{'input-controls': controls, 'input-controls-editing': editing}"
      :label="label"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :counter="maxLength"
      :rules="rules"
      :error-messages="errorMessages"
      :autofocus="autofocus"
      :readonly="readonly"
      :hide-details="hideDetails"
      @focus="onFocus"
      @update:error="onValidation"
      @change="$emit('change', $event)"
      @blur="$emit('blur', $event)"
      @click="$emit('click', $event)"
      @keydown.enter="onSave"
    >
      <template #prepend>
        <slot name="prepend"></slot>
      </template>
      <template #append>
        <!--Edit icon-->
        <opex-icon
          name="edit"
          :class="{visible: controls && !editing}"
        />

        <!--Info icon-->
        <opex-icon
          v-if="icon"
          :name="icon"
          :class="{visible: icon}"
          :style="{'color': iconColor ? `var(--theme-${iconColor})` : 'inherit'}"
        />

        <!--Slot for the append icon. E.g for icon with tooltip-->
        <slot
          name="append"
          v-if="!controls"
        ></slot>

        <!--Input field controls if appropriate prop is passed-->
        <v-scroll-x-reverse-transition v-if="controls">
          <v-layout v-show="editing">
            <!--Save button-->
            <v-btn
              fab
              small
              color="secondary"
              :disabled="!valid || (!text && required)"
              @click="onSave"
            >
              <opex-icon name="success"/>
            </v-btn>

            <!--Cancel button-->
            <v-btn
              fab
              small
              color="primary"
              @click="onCancel"
            >
              <opex-icon name="close"/>
            </v-btn>
          </v-layout>
        </v-scroll-x-reverse-transition>
      </template>
    </v-text-field>

    <!--Slot for the SAVED label-->
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'opex-input',

  props: {
    type: String,
    label: String,
    textarea: Boolean,
    controls: Boolean, // Whether to show buttons to save/cancel the value
    maxLength: String,
    required: Boolean,
    min: Number,
    max: Number,
    autocompleteItems: Array,
    errorMessages: Array,
    itemText: String, // Text to show for item if autocomplete items are objects
    itemValue: String, // Value to use for item if autocomplete items are objects
    returnObject: Boolean, // Returning the object if autocomplete items are objects
    multiple: Boolean, // To allow select several values from autocomplete
    chips: Boolean,
    icon: String,
    iconColor: String,
    autofocus: Boolean,
    readonly: Boolean,
    hideDetails: Boolean,
    menuProps: [String, Array, Object], // Pass props through to the v-menu component

    value: [String, Number, Array, Object],

    // Array of validation rules functions
    // The validation function receives the current input value as a parameter
    // Should return true if validation passed or an error message
    validationRules: {
      type: Array,
      default: () => [],
    },

    placeholder: {
      type: String,
      default: ' ', // without a placeholder the label will be positioned incorrectly
    },

    // Number of rows in textarea
    rows: {
      type: Number,
      default: 3,
    },
  },

  data() {
    return {
      srcInput: null, // The source input element
      editing: false, // Showing/hiding the controls
      lastSavedValue: null, // The last saved value for the input with controls
      valid: true, // validation state
    };
  },

  computed: {
    text: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },

    // Custom validation rules merged with required rule if an appropriate prop is passed
    rules() {
      if (this.required) {
        return [
          (value => (value !== undefined && value !== null && value !== '')
            || this.$message.common.mandatoryField),
          ...this.validationRules,
        ];
      }

      return this.validationRules;
    },
  },

  methods: {
    // Saving the validation state and emitting it to the parent component
    onValidation(error) {
      this.valid = !error;
      this.$emit('valid', this.valid);
    },

    // Input focus event handler
    onFocus(event) {
      // No action required if the input doesn't have the controls
      if (!this.controls) return;

      // Saving the HTML input element and showing the controls
      this.srcInput = event.target;
      this.editing = true;

      // Initializing the last saved value if it is not initialized yet
      if (this.lastSavedValue === null) this.lastSavedValue = this.text;

      this.$emit('editingMode', this.editing);
    },

    // Cancel btn click handler
    onCancel() {
      // Reverting the input value to the last saved one and blurring the input
      this.text = this.lastSavedValue;
      this.blurInput();
      this.$emit('cancel');
    },

    // Save btn click handler
    onSave() {
      // Check if field valid
      let isValid = true;
      this.rules.forEach((rule) => {
        if (rule(this.text) !== true) isValid = false;
      });
      if (!isValid) return;
      // Updating the last saved value, blurring the input
      // and emitting event to the parent component
      this.lastSavedValue = this.text;
      this.blurInput();
      this.$emit('save');
    },

    // Hiding the controls and removing focus from the input
    blurInput() {
      this.editing = false;
      this.$emit('editingMode', this.editing);

      // Need to wait for the next tick to call the native DOM function
      setTimeout(() => {
        this.srcInput.blur();
      });
    },
  },
};
</script>

<!--Global input styles are defined in the /src/styles/redefine.scss-->

<style scoped lang="scss">
  .opex-input {
    position: relative;
    .icon-edit {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 0;
      height: 0;
      font-size: 1.3rem;
      text-align: center;
      background-color: var(--theme-text);
      color: var(--theme-background);
      opacity: 0;
      border-radius: 50%;
      transition: none;

      &.visible {
        height: 1.4rem;
        width: 1.4rem;
        opacity: 0.2;
        transition: opacity 0.2s, width 0.01s, height 0.01s;
        transition-delay: 0.3s;
      }
    }

    .v-btn {
      height: 1.2rem;
      width: 1.2rem;
      margin: 0 0.4rem 0 0;
      border-radius: 0.2rem;

      &:nth-child(2) {
        margin-right: 0;
      }
    }
  }

  .opex-saved-label {
    position: absolute;
    top: 0;
    right: 0;
  }

  .input-tooltip-label {
    position: absolute;
    top: -0.1rem;
    right: 0;
    font-size: 0.7rem;
    font-weight: bold;
    color: var(--theme-text);
    text-decoration: underline;
    cursor: pointer;
  }
</style>
