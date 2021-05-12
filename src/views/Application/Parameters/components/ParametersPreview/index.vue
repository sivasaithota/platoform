<!--Component with list of parameter to manage them on the Parameters page-->

<template>
  <v-layout
    class="parameters_form"
    wrap
  >
    <v-flex
      v-for="(group, index) in paramData"
      :key="index"
      :class="group.class"
    >
      <v-layout
        v-if="group.parameters.length"
        class="parameters_form__content"
        column
      >
        <p class="group_name">
          {{ group.name }}
        </p>
        <v-layout wrap>
          <v-flex
            v-for="(parameter, key) in group.parameters"
            :key="key"
            class="parameter_box"
          >
            <!--Type is Text-->
            <opex-input
              v-if="parameter.type === $constant.parameterTypes.text && !parameter.isNumeric"
              :value="parameter.defaultValue"
              :placeholder="$message.parameters.enterPlaceholder"
              :label="parameter.name"
              class="parameter_field"
            />
            <!--Type is Numeric-->
            <opex-input
              v-else-if="parameter.type === $constant.parameterTypes.text && parameter.isNumeric"
              :value="parameter.defaultValue"
              type="number"
              :placeholder="$message.parameters.enterPlaceholder"
              :label="parameter.name"
              class="parameter_field"
            />
            <!--Type is Date-->
            <v-menu
              v-else-if="parameter.type === $constant.parameterTypes.date"
              :value="parameter.isPickerOpen"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template #activator="{ on }">
                <opex-input
                  v-on="on"
                  :value="parameter.defaultValue"
                  :placeholder="$message.parameters.enterPlaceholder"
                  readonly
                  style="width: 100%"
                  icon="actions"
                  :label="parameter.name"
                  class="parameter_field"
                />
              </template>
              <v-date-picker
                color="primary"
                next-icon="icon-v2-arrow-right2"
                prev-icon="icon-v2-arrow-left2"
                :value="parseDate(parameter.defaultValue)"
              />
            </v-menu>
            <!--Type is Dropdown-->
            <opex-input
              v-else-if="parameter.type === $constant.parameterTypes.checkbox"
              :autocomplete-items="parameter.dropdownValues"
              :value="parameter.defaultValue"
              multiple
              chips
              :placeholder="$message.parameters.selectPlaceholder"
              :label="parameter.name"
              class="parameter_field"
            />
            <!--Type is Radio-->
            <opex-input
              v-else-if="parameter.type === $constant.parameterTypes.radio"
              :autocomplete-items="parameter.dropdownValues"
              :value="parameter.defaultValue"
              :placeholder="$message.parameters.selectPlaceholder"
              :label="parameter.name"
              class="parameter_field"
            />
            <!--Type is Switch-->
            <v-layout
              column
              class="preview-switch-title"
              v-else-if="parameter.type === $constant.parameterTypes.switch"
            >
              <p>{{ parameter.name }}</p>
              <opex-switch :value="parameter.defaultValue"/>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment';

export default {
  name: 'ParametersPreview',

  computed: {
    paramData() {
      return this.$store.getters['parameters/getPreviewData'];
    },
  },

  methods: {
    // Convert date to ISO format for datepicker
    parseDate(date) {
      return date ? moment(date).format('YYYY-MM-DD') : '';
    },
  },
};
</script>

<style scoped lang="scss">
  .preview-switch-title{
    p {
      top: .1rem;
      font-size: .65rem;
      font-weight: bold;
      text-transform: uppercase;
      color: var(--theme-secondary);
      margin: 0;
    }
    div {
      padding-top: .5rem;
    }
  }
  .parameters_form__content {
    box-shadow: 1px 1px 2px 0 var(--theme-background-grey);
    margin-bottom: .625rem;
    margin-right: .625rem;
    padding: .625rem 0;
    background-color: var(--theme-background-light);
    .parameter_box {
      padding-left: 0.625rem;
      padding-right: 0.625rem;
      min-height: 4rem;
    }
  }
  .group_name {
    font-size: .875rem;
    font-weight: 600;
    line-height: normal;
    color: var(--theme-secondary);
    margin: 0 .625rem .875rem .625rem;
  }
  .xs12 .parameter_box {
    max-width: 25%;
  }
  .xs3 .parameter_box {
    max-width: 100%;
  }
  .xs9 .parameter_box {
    max-width: 33.33333%;
  }
  .xs6 .parameter_box {
    max-width: 50%;
  }
</style>

<style lang="scss">
  div.v-input.parameter_field {
    &.v-input--is-focused > .v-input__control > .v-input__slot:after {
      transform: scaleX(0);
    }
    &:not(.v-input--has-state) > .v-input__control > .v-input__slot {
      &:hover:before,
      &:before {
        border-color: var(--theme-secondary);
      }
    }
    .v-label {
      font-weight: 600;
      color: var(--theme-text);
    }
  }
</style>
