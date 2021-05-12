<!--Page for developments purposes-->

<template>
  <div>
    <opex-submenu
      title="Development"
      :items="submenuItems"
      v-model="submenuSelectedItem"
      @input="submenuItemSelected"
    />

    <div class="development app-content">
      <!--Snackbars-->
      <div>
        <v-btn
          color="success"
          @click="showSnackbar({type: st.success, title: 'Success', message: 'all good'})"
        >
          success snackbar
        </v-btn>
        <v-btn
          color="error"
          @click="showSnackbar({type: st.error, title: 'error', message: 'smth went wrong'})"
        >
          error snackbar
        </v-btn>
        <v-btn
          color="info"
          @click="showSnackbar({type: st.info, title: 'info', message: 'FYI', timeout: 1000})"
        >
          info snackbar
        </v-btn>
      </div>

      <!--Popup-->
      <opex-popup
        title="Delete? Rly?"
        message="You are taking the whole responsibility by confirming this action."
        button-name="kill it"
        @confirm="popupConfirm"
      >
        <v-btn color="primary">popup</v-btn>
      </opex-popup>

      <!--Buttons-->
      <div>
        <v-btn
          small
          color="success"
        >
          small button
        </v-btn>

        <v-btn
          color="primary"
        >
          normal button
        </v-btn>

        <v-btn
          large
          color="secondary"
        >
          large button
        </v-btn>

        <v-btn
          fab
          small
          color="success"
        >
          <opex-icon name="success"/>
        </v-btn>

        <v-btn
          fab
          color="primary"
        >
          <opex-icon name="delete"/>
        </v-btn>

        <v-btn
          fab
          large
          color="secondary"
        >
          <opex-icon name="actions"/>
        </v-btn>

        <v-btn
          text
          small
          color="primary"
          class="text-capitalize"
        >
          text button
        </v-btn>

        <v-btn
          text
          fab
          large
          color="primary"
        >
          <opex-icon name="config-upload"/>
        </v-btn>

        <v-btn
          small
          disabled
          color="primary"
        >
          disabled button
        </v-btn>

        <v-btn
          fab
          disabled
          color="secondary"
        >
          <opex-icon name="edit"/>
        </v-btn>

        <opex-link
          plus-sign
          color="secondary"
        >
          link
        </opex-link>
      </div>

      <!--Switch-->
      <opex-switch
        v-model="switchModel"
        :label="'switch ' + switchModel"
        description="Description"
      />

      <!--Tags-->
      <div>
        <opex-tag class="tag-blue">
          tag
        </opex-tag>
        <opex-tag class="tag-orange">
          another tag
        </opex-tag>
        <opex-tag class="tag-violet" minimized>
          minimized tag
        </opex-tag>
        <opex-tag class="tag-green" minimized>
          another minimized tag
        </opex-tag>
      </div>

      <!--Toogle-->
      <opex-toggle
        v-model="toggleValue"
        :radio-items="radioItems"
        item-value="value"
        item-text="icon"
      />

      <!--Drawer with tabs and items list-->
      <div>
        <v-btn
          color="secondary"
          @click="drawerModel = true"
        >
          drawer with tabs and items list
        </v-btn>
        <opex-drawer
          v-model="drawerModel"
          title="title"
          subtitle="subtitle"
          icon="v2-bug"
        >
          <opex-drawer-tabs :tabs="drawerTabs">
            <div :slot="drawerTabs[0]">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Accusamus ad aperiam architecto assumenda, exercitationem illum iure voluptate?
              Amet dolorem, ducimus et ipsam maxime molestias necessitatibus nemo quis,
              quod temporibus ullam!
            </div>

            <div :slot="drawerTabs[1]">
              <opex-list-item
                v-for="(item, index) in itemsList"
                img="script"
                :key="item"
                :text="item"
                @delete="itemsList.splice(index, 1)"
              />
            </div>

            <div :slot="drawerTabs[2]">
              <img
                src="https://welovecatsandkittens.com/wp-content/uploads/2013/09/Hi.jpg"
                width="100%"
                alt="hi"
              >
            </div>
          </opex-drawer-tabs>
        </opex-drawer>
      </div>

      <!--Tooltips-->
      <div>
        <opex-tooltip bottom message="I'm a simple tooltip">
          <template #activator>
            <span class="text-uppercase">simple tooltip</span>
          </template>
        </opex-tooltip>
        <span>--</span>

        <opex-tooltip
          top
          color="success"
          icon="app-info"
          title="Tooltip Title"
        >
          <template #activator>
            <span class="text-uppercase">complex tooltip</span>
          </template>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus ad aperiam architecto
          assumenda, exercitationem illum iure voluptate?
        </opex-tooltip>
      </div>

      <!--Upload areas-->
      <v-layout>
        <opex-upload-area
          :icon="$constant.uploadAreaIcons.table"
          text="Upload your files"
          :extensions="$constant.allowedTableFileExtensions"
          multiple
          :state="uploadState"
          @files="onUpload"
        />
        <opex-upload-area
          :icon="$constant.uploadAreaIcons.folder"
          text="Upload a folder"
          folder
          @files="uploadedFiles = $event"
        />
        <ul>
          <li v-for="file in uploadedFiles" :key="file.id">{{ file.name }}</li>
        </ul>
      </v-layout>

      <!--Form with inputs and textarea-->
      <v-form
        class="example-form"
        v-model="formValid"
      >
        <opex-input
          v-model="inputValue"
          label="input field"
          placeholder="placeholder"
          max-length="10"
          required
        />

        <opex-input
          v-model="controlsInputValue"
          label="input with controls"
          controls
          :validation-rules="validationRules"
          @save="inputSavedLabel = true"
        >
          <opex-saved-label v-model="inputSavedLabel"/>
        </opex-input>

        <opex-input
          type="number"
          label="number field"
          placeholder="numbers only"
          required
          :min="1"
          :max="5"
          :validation-rules="numberFieldRules"
        />

        <opex-input
          :autocomplete-items="autocompleteItems"
          v-model="autocompleteValue"
          label="autocomplete"
          placeholder="start typing"
          required
        />

        <opex-password
          v-model="password"
          :requirements="passwordRules"
        />

        <opex-password
          v-model="password"
          label="readonly password"
          readonly
        />

        <opex-input
          textarea
          v-model="textAreaValue"
          label="textarea"
          placeholder="what's up?"
          controls
          required
          :validation-rules="validationRules"
          @save="textAreaSavedLabel = true"
        >
          <opex-saved-label v-model="textAreaSavedLabel"/>
        </opex-input>

        <span>Form valid: {{ formValid }}</span>
      </v-form>

      <!--Cards-->
      <div class="example-cards">
        <draggable
          tag="div"
          class="table-columns"
          v-model="cards"
          handle=".handle"
        >
          <opex-card
            class="justify-space-between"
            v-for="(card, index) in cards"
            :key="index"
            :is-draggable="card.isDraggable"
          >
            <div>
              <span class="opex-label">column name</span>
              <span class="opex-card-value">{{card.columnName}}</span>
            </div>
            <div>
              <span class="opex-label">display name</span>
              <span class="opex-card-value">{{card.displayName}}</span>
            </div>
            <div>
              <span class="opex-label">data type</span>
              <span class="opex-card-value">{{card.dataType}}</span>
            </div>

            <div>
              <v-btn
                fab
                small
                color="secondary"
              >
                <opex-icon name="edit"/>
              </v-btn>
              <span class="opex-card-value">{{card.isEditable}}</span>
            </div>

            <v-btn
              text
              fab
              color="primary"
            >
              <opex-icon name="delete-fill"/>
            </v-btn>
          </opex-card>
        </draggable>

        <opex-card class="justify-space-between">
          <v-layout>
            <img src="@/assets/svg/config-file.svg" alt="config file">
            <div>
              <span class="opex-label">configuration file</span>
              <span class="opex-card-value">ParameterConfig.json</span>
            </div>
          </v-layout>

          <v-spacer/>

          <v-btn
            text
            fab
            color="primary"
          >
            <opex-icon name="delete-fill"/>
          </v-btn>
        </opex-card>
      </div>

      <!--Change theme-->
      <v-btn color="secondary" @click="changeTheme($constant.appThemes.default)">
        Change theme to default
      </v-btn>
      <v-btn color="secondary" @click="changeTheme($constant.appThemes.alternative)">
        Change theme to default 2
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import OpexToggle from '@/components/OpexToggle';
import OpexListItem from '@/components/OpexListItem/index';
import OpexPassword from '@/components/OpexPassword/index';

export default {
  name: 'Development',
  components: { OpexPassword, OpexListItem, OpexToggle },

  data() {
    return {
      st: this.$constant.snackbarTypes,

      submenuItems: [
        {
          icon: 'v2-visualization',
          name: 'Visualization',
        },
        {
          icon: 'v2-app-info',
          name: 'Info',
        },
        {
          icon: 'v2-app-settings',
          name: 'Settings',
        },
      ],
      submenuSelectedItem: 0,

      switchModel: false,
      drawerModel: false,

      uploadedFiles: [],
      uploadState: null,

      radioItems: [
        {
          value: 'slider',
          icon: 'range-slider',
        },
        {
          value: 'calendar',
          icon: 'calendar',
        },
        {
          value: 'switch',
          icon: 'switch',
        },
      ],
      toggleValue: 'calendar',

      inputValue: '',
      controlsInputValue: 'text',
      textAreaValue: '',
      autocompleteValue: '',
      password: '',
      inputSavedLabel: false,
      textAreaSavedLabel: false,
      validationRules: [
        value => value.length > 3 || 'Value length must be at least 4 characters',
        value => value.indexOf('\'') < 0 || 'Value must not contain the quote character',
      ],
      numberFieldRules: [value => (value > 0 && value < 6) || 'min 1, max 5'],
      formValid: false,
      passwordRules: [
        this.$constant.passwordRequirements.minLength,
        this.$constant.passwordRequirements.lowercaseLetter,
        this.$constant.passwordRequirements.uppercaseLetter,
        this.$constant.passwordRequirements.specialLetter,
        this.$constant.passwordRequirements.numericLetter,
      ],

      autocompleteItems: [
        'integer',
        'double precision',
        'varchar',
        'date',
        'text',
        'boolean',
        'timestamp',
        'bigint',
        'numeric',
      ],

      cards: [{
        columnName: 'customer_id',
        displayName: 'Customer ID',
        dataType: 'integer',
        isEditable: true,
        isDraggable: true,
      }, {
        columnName: 'customer_name',
        displayName: 'Customer Name',
        dataType: 'text',
        isEditable: false,
        isDraggable: false,
      }],

      drawerTabs: ['text', 'list', 'image'],
      itemsList: ['execute.py', 'TABLEAU_EXTRACT_UPDATE.R', 'run_schedule.js'],
    };
  },

  methods: {
    ...mapActions({
      showSnackbar: 'snackbar/show',
      changeTheme: 'theme/changeTheme',
    }),

    popupConfirm() {
      this.showSnackbar({
        type: 'success',
        title: 'Deleted',
        message: 'Now the world will never be the same',
      });
    },

    // Imitating sending files to the server
    onUpload() {
      this.uploadState = this.$constant.uploadAreaStates.uploading;
      setTimeout(() => {
        this.uploadState = [
          this.$constant.uploadAreaStates.error,
          this.$constant.uploadAreaStates.success,
        ][Math.floor(Math.random() * 2)];
      }, 1000);
    },

    submenuItemSelected(index) {
      this.showSnackbar({
        type: this.st.info,
        title: 'Item select event',
        message: `${this.submenuItems[index].name} item is selected`,
      });
    },
  },
};
</script>

<style scoped lang="scss">
  .development {
    position: relative;
    padding: 2rem 1rem;

    &>div {
      margin-bottom: 1rem;
    }

    .opex-upload-area {
      width: 100px;
    }

    .example-form {
      width: 20rem;
      margin-bottom: 2rem;
    }

    .example-cards {
      width: 60%;

      button:not(.v-btn--small) {
        margin: 0;
      }

      img {
        margin-right: 0.6rem;
      }
    }
  }
</style>
