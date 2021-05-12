const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const config = require('./configs/config.json');

module.exports = {
  transpileDependencies: [
    'vuetify',
  ],

  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/styles/variables.scss";',
      },
    },
  },

  configureWebpack: {
    plugins: [
      new CopyPlugin([
        {
          from: 'src/assets/images/theme/',
          to: 'theme/',
          ignore: ['thumbnails/*'],
        },
      ]),
    ],
    resolve: {
      mainFiles: ['index', 'Index'],
      alias: {
        '~': path.resolve(__dirname, 'src/'),
      },
    },
  },

  outputDir: 'public/dist/',
  assetsDir: 'src/',
  productionSourceMap: false,

  devServer: {
    host: config.server.host,
    port: config.server.port,
    https: false,
    hotOnly: false,
    proxy: {
      'api/v1/': {
        target: config.server.devProxyTarget,
      },
      auth: {
        target: config.server.devProxyTarget,
      },
      'socket_shaft/': {
        target: `http://${config.socket.hostname}:${config.socket.port}`,
        pathRewrite: { '^/socket_shaft': '' },
        ws: true,
      },
    },
  },
};
