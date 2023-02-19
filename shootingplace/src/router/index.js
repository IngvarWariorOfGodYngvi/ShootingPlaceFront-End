import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

// import App from 'src/App.vue'
Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 *
 * The function below can be async too either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  // const local = App.host
  // let userLicense = null
  // Router.beforeResolve((to, from, next) => {
  //   fetch('http://' + local + '/settings/termsAndLicense', {
  //     method: 'GET'
  //   }).then(
  //     response => {
  //       if (response.status === 200) {
  //         response.text().then(() => {
  //           userLicense = true
  //         })
  //       } else {
  //         userLicense = false
  //       }

  //       if ((to.name === 'dodawanie' || to.name === 'zawody' || to.name === 'amunicja' || to.name === 'zbrojownia' || to.name === 'statystyki' || to.name === 'pozostałe funkcje' || to.name === 'licencje') && !userLicense) {
  //         next({
  //           path: '/licenseend',
  //           replace: true
  //         })
  //       } else {
  //         next()
  //       }
  //     }
  //   )
  // })
  return new VueRouter({
    scrollBehavior: () => ({
      x: 0,
      y: 0
    }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })
}
