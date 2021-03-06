import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin';
import pkg from './package';

const routerBase =
  process.env.DEPLOY_ENV === 'GH_PAGES'
    ? {
        router: {
          base: '/spirit-to-hp/'
        }
      }
    : {};

export default {
  ...routerBase,
  mode: 'spa',
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },
  loading: { color: '#fff' },
  css: ['~/assets/style/app.styl'],
  plugins: ['@/plugins/vuetify'],
  modules: [
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-140385477-1'
      }
    ]
  ],
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    }
  }
};
