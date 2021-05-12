<!--List item component with for editing and deleting actions-->
<!--isDraggable property shows icon for changing item position inside the list-->
<!--isEditable property shows Input field component by clicking on item with autofocus and control btn-->

<template>
  <div>
    <v-layout
      v-if="!isEditing"
      class="opex-list-item"
      align-center
      @click="setFocus"
    >
      <!--Image and text-->
      <img
        v-if="img"
        :src="imgs[img]"
        class="icon"
        alt="icon"
      >
      <opex-icon
        v-if="icon"
        :name="icon"
      />
      <img
        v-if="isDraggable"
        src="@/assets/svg/sort-icon.svg"
        alt="sort element"
        class="handle"
      />
      <span>{{ text }}</span>
      <v-spacer/>

      <v-btn
        text
        fab
        color="primary"
        class="text-capitalize"
        @click.stop="$emit('delete')"
      >
        <opex-icon name="delete-fill"/>
      </v-btn>
    </v-layout>

    <!--Edit mode-->
    <opex-input
      v-else
      v-model="text"
      autofocus
      controls
      required
      @save="saveValue"
      @cancel="cancelEditing"
      @editingMode="$emit('editingMode', $event)"
      :validation-rules="validationRules"
    />
  </div>
</template>

<script>
import script from '@/assets/svg/script-file.svg';
import table from '@/assets/svg/table-file.svg';

export default {
  name: 'OpexListItem',

  props: {
    icon: String,
    img: String,
    value: String,
    isDraggable: Boolean,
    isEditable: Boolean,
    validationRules: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      imgs: {
        script,
        table,
      },
      isEditing: false,
    };
  },

  computed: {
    text: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val, this.value);
      },
    },
  },

  methods: {
    // Save new option value click handler
    saveValue() {
      setTimeout(() => {
        this.isEditing = false;
      });
    },

    // Edit option click handler
    setFocus() {
      if (this.isEditable) this.isEditing = true;
    },

    cancelEditing() {
      setTimeout(() => {
        this.$emit('cancel');
        this.isEditing = false;
      });
    },
  },

  // Show input field after clicking Add option btn
  created() {
    if (!this.value && this.isEditable) this.isEditing = true;
  },
};
</script>

<style scoped lang="scss">
  .opex-list-item {
    margin-bottom: 0.8rem;
    padding: 0.2rem 0.2rem 0.2rem 0.8rem;
    background-color: var(--theme-background);
    border: 1px solid var(--theme-border-light);
    border-radius: 0.2rem;

    img.icon {
      width: 1rem;
      margin-right: 0.6rem;
    }

    span {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--theme-text);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .v-btn {
      margin: 0 0 0 0.6rem;
    }

    .handle {
      margin-right: 1rem;
      cursor: grabbing;
    }
  }
</style>
