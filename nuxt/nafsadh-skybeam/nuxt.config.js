const pkg = require('./package');

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href:'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.3.5/tiny-slider.css'},
      { rel: 'stylesheet', href:'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
        integrity:'sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU',
        crossorigin:'anonymous' },
      ],
    script:[
      // { src: '@/assets/js/bulma-carousel.min.js' }
      // { src: 'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.8.6/min/tiny-slider.js' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    // CSS file in the project
    '@/assets/css/styles.css',
    '@/assets/css/bg.css',
    'bulma-carousel/dist/css/bulma-carousel.min.css',
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src:'~/plugins/v-tiny-slider.js', ssr:false},
    '~/plugins/vue-tippy.js'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy'
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    vendor: ['tiny-slider'],
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          // enforce: 'pre',
          // test: /\.(js|vue)$/,
          // loader: 'eslint-loader',
          // exclude: /(node_modules)/
        });
      }
    }
  }
};
