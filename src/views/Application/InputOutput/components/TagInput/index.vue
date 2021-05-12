<template>
  <v-autocomplete
    color="secondary"
    label="tag"
    placeholder="Enter or Search for Tags"
    v-model="selectedTag"
    hide-no-data
    :items="tagsList"
    item-text="name"
    return-object
    :filter="filter"
    @change="tagChange"
    @update:search-input="text = $event"
  >
    <!--Slot with tag color-->
    <template
      #prepend-inner
      v-if="selectedTag.name && selectedTag.name !== 'untagged'"
    >
      <div class="tag-color" :class="selectedTag.class"></div>
    </template>

    <!--Slot with each autocomplete item-->
    <template #item="{ item }">
      <!--Item to add new tag-->
      <div
        v-if="item.class === $constant.tagSupportClasses.new"
        class="tag-input-item create-new-tag"
      >
        + create new tag
        <span class="new-tag-name">{{ text }}</span>
      </div>

      <!--Item for existing tag-->
      <div
        v-else
        class="tag-input-item"
      >
        {{ item.name }}
      </div>
    </template>
  </v-autocomplete>
</template>

<script>
import { mapMutations } from 'vuex';
import { cloneDeep } from 'lodash';

export default {
  name: 'TagInput',

  props: {
    tag: Object,
  },

  data() {
    return {
      tagsList: [],
      selectedTag: this.tag,
      text: '',

      // The function called when searching for an autocomplete item
      filter: (item, queryText, itemText) => {
        // Always returning the item to create new tag
        if (item.class === this.$constant.tagSupportClasses.new) return true;

        // Filtering the other items basing on the entered text and the item text
        return itemText.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1;
      },
    };
  },

  methods: {
    ...mapMutations('tables', {
      addTag: 'addTag',
    }),

    tagChange(tag) {
      if (tag.class === this.$constant.tagSupportClasses.new) {
        // A new tag with the next class from the tagClasses list
        const newTag = {
          name: this.text,
          class: this.$constant.tagClasses[(this.tagsList.length - 2) % this.$constant.tagClasses.length],
        };

        // Adding to the tags list
        this.tagsList.unshift(newTag);
        this.addTag(newTag);

        // Updating the selected tag on the next DOM update cycle
        // to overwrite the default autocomplete behaviour
        this.$nextTick(() => {
          this.selectedTag = newTag;
        });

        this.$emit('select', newTag);
      } else {
        this.$emit('select', tag);
      }
    },
  },

  created() {
    // List of existing tags from Vuex
    this.tagsList = cloneDeep(this.$store.state.tables.tagList);

    // Adding untagged item, if it not in the list yet
    const untagged = this.tagsList.find(tag => tag.class === this.$constant.tagSupportClasses.none);
    if (!untagged) {
      this.tagsList.push({
        name: 'untagged',
        class: this.$constant.tagSupportClasses.none,
      });
    }

    // Item for the adding a new tag
    this.tagsList.push({
      name: '',
      class: this.$constant.tagSupportClasses.new,
    });
  },
};
</script>

<style scoped lang="scss">
  .create-new-tag {
    font-weight: 600;
    font-style: italic;
  }

  .new-tag-name {
    color: var(--theme-secondary);
  }
</style>

<style lang="scss">
  .tag-color {
    width: 1.4rem;
    height: 1.4rem;
  }

  .tag-input-item {
    line-height: 2;
  }
</style>
