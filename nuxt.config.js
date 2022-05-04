import webpack from 'webpack'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Morepoke гавайские боулы',
    htmlAttrs: {
      lang: 'ru'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
			{ name: 'facebook-domain-verification', content: 'yporx1r23fzwa6jz5t3ek9gamdes24' },
			{ property: 'fb:app_id', content: '257953674358265' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/img/favicon/favicon.ico' }
    ],
    script: [
			{ src: 'https://widget.cloudpayments.ru/bundles/cloudpayments', mode: 'client' }
    ]
  },

	loading: {
		color: '#F9B0A0',
		height: '5px'
	},

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.css',
    '@/assets/sass/main.sass'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
		{ src: '~/plugins/axios.js', mode: 'client' },
		{ src: '~/plugins/logEventAnalytics.js', mode: 'client' },
		{ src: '~/plugins/ymapPlugin.js',  mode: 'client' },
		{ src: '~/plugins/jquery-fancybox.js',  mode: 'client' },
		'@plugins/v-mask.js',
  ],

	//pageTransition: 'fade',

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
		'cookie-universal-nuxt',
    '@nuxtjs/axios',
		'@nuxtjs/toast',
		'@nuxtjs/dotenv',
		'nuxt-lazy-load',
		'nuxt-facebook-pixel-module',
		'@nuxtjs/sentry',
    [
      '@rkaliev/nuxtjs-yandex-metrika',
      {
        id: process.env.METRIKA,
        webvisor: true,
        clickmap: true,
        debug: false,
        noJS: false,
        disabled: false,
      },
    ],
		[
			'@nuxtjs/firebase',
			{
				config: {
					apiKey: "AIzaSyCNJSvGxVoVnicK9PIpKIY8SCxfRRj62mw",
					authDomain: "more-poke.firebaseapp.com",
					projectId: "more-poke",
					storageBucket: "more-poke.appspot.com",
					messagingSenderId: "164743210987",
					appId: "1:164743210987:web:e1ebd3950908050bd11bae",
					measurementId: "G-7HKS6KF5PL"
				},
				services: {
					analytics: true
				}
			}
		]
  ],
	facebook: {
		track: 'PageView',
		pixelId: process.env.PIXEL,
		autoPageView: true,
		disabled: false
	},
	toast: {
		position: 'bottom-right',
		duration: 4000
	},
  axios: {
    headers: {
      'x-api-token': process.env.API_TOKEN
    },
		proxy: true,
		credentials: true,
  },
  proxy: {
		'/api': process.env.API_HOST
	},
	server: {
		port: process.env.SERVER_PORT, // default: 3000
		host: process.env.SERVER_HOST, // default: localhost,
		timing: false
	},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    plugins: [
      new webpack.ProvidePlugin({
        // global modules
        $: 'jquery',
        jQuery: 'jquery',
        'window.jquery': 'jquery',
        _: 'lodash'
      })
    ]
  }
}
