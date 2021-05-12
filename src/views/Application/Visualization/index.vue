<!--Visualization page component-->

<template>
  <div class="visualization-page position-relative">
    <!--Drawer with form to edit HTML report-->
    <opex-drawer
      v-if="!loading && report"
      v-model="drawerVisible"
      :title="$route.name"
      subtitle="HTML report"
      icon="v2-visualization"
    >
      <edit-html-report
        v-if="drawerVisible"
        @close="drawerVisible = false"
      />
    </opex-drawer>

    <section
      v-if="report"
      class="app-content"
    >
      <!--Header with edit/add report button-->
      <v-layout
        class="app-content-header"
        align-center
      >
        <h3>
          {{ $route.name }}
        </h3>

        <v-spacer/>
        <v-btn
          v-if="!loading && !report.type"
          color="secondary"
          @click="drawerVisible = true"
        >
          create report
        </v-btn>
      </v-layout>

      <!--Skeleton loader card-->
      <opex-card
        disabled
        v-if="loading"
      >
        <v-skeleton-loader
          v-for="n in 2"
          :key="n"
          class="card-skeleton card-skeleton-darkened visualisation-skeleton"
          type="list-item-two-line"
        />
      </opex-card>

      <!--Card with report info-->
      <opex-card
        v-if="!loading && report.type"
        is-deletable
        popup-title="Delete report"
        :popup-message="$message.common.deleteItem('report')"
        @click.native="drawerVisible = true"
        @deleteConfirm="deleteReport(report._id)"
      >
        <!--Report type-->
        <div>
          <span class="opex-label">
            {{ $constant.htmlReportLabels.type }}
          </span>
          <span class="opex-card-value">
            {{ reportTypes[report.type].displayName }}
          </span>
        </div>

        <!--Report URL-->
        <v-spacer/>
        <v-layout
          v-if="report.url"
          class="html-report-url"
          align-center
        >
          <div>
            <span class="opex-label">
              {{ $constant.htmlReportLabels.url }}
            </span>
            <div class="opex-card-value">
              {{ report.type === reportTypes.shiny.typeName ? `${report.type}/${report.url}` : report.url }}
            </div>
          </div>

          <!--Button to open the report URL-->
          <v-btn
            fab
            small
            color="secondary"
            @click.native.stop
            @click="openUrl"
          >
            <opex-icon name="actions"/>
          </v-btn>
        </v-layout>

        <!--Download ShinyR app logs button-->
        <v-layout
          v-if="reportTypes.shiny && report.type === reportTypes.shiny.typeName"
          class="download-logs"
          align-center
        >
          <v-btn
            fab
            small
            color="secondary"
            @click.native.stop
            @click="downloadShinyLogs"
          >
            <opex-icon name="success"/>
          </v-btn>
          <div class="text-capitalize">
            download logs
          </div>
        </v-layout>
      </opex-card>
    </section>
  </div>
</template>

<script>
import { saveAs } from 'file-saver';
import { mapActions, mapState } from 'vuex';

import EditHtmlReport from './components/EditHtmlReport/index';

export default {
  name: 'VisualisationPage',
  components: { EditHtmlReport },

  data() {
    return {
      appId: this.$route.params.id,
      loading: true,
      drawerVisible: false,
    };
  },

  computed: {
    ...mapState({
      report: state => state.visualization.report,
      reportTypes: state => state.visualization.reportTypes,
    }),
  },

  methods: {
    ...mapActions('visualization', {
      getReports: 'getReports',
      getReportTypes: 'getReportTypes',
      deleteReport: 'deleteReport',
      getLogs: 'getLogs',
    }),

    openUrl() {
      const url = this.report.type === this.reportTypes.shiny.typeName
        ? `${window.location.origin}/${this.report.type}/${this.report.url}/`
        : this.report.url;
      window.open(url);
    },

    // Downloading ShinyR app logs from the server
    downloadShinyLogs() {
      this.getLogs(this.report._id)
        .then((data) => {
          // Saving the downloaded log in a file
          saveAs(
            new Blob([data]),
            `${this.report.url}.log`,
          );
        });
    },
  },

  mounted() {
    // Fetching reports and report types from the server
    Promise.all([
      this.getReports(this.appId),
      this.getReportTypes(),
    ]).then(() => {
      this.loading = false;
    });
  },
};

</script>

<style scoped lang="scss">
  .visualization-page {
    .app-content-header {
      min-height: 4.4rem;
    }

    .html-report-url {
      flex-grow: 0;
      max-width: 30rem;
      margin-right: 4rem;

      .opex-card-value {
        max-width: 30rem;
        font-family: monospace;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: 400;
      }
    }

    .download-logs {
      flex-grow: 0;
      margin-right: 2rem;
      font-size: 1rem;
    }
  }
</style>

<style lang="scss">
  .card-skeleton.visualisation-skeleton {
    width: 20%;
    margin: 0.1rem 10% 0.1rem 0;

    .v-skeleton-loader__list-item-two-line {
      padding: 0;
    }
  }
</style>
