<template>
  <div id="q-app" class="bg-dark">
    <router-view />
  </div>
</template>
<script>
// import keycloak from '@dsb-norge/vue-keycloak-js'
// import Vue from 'vue'
// import router from './router'
// import store from './store'
// Vue.config.productionTip = false
// Vue.use(keycloak, {
//   init: {
//     onLoad: 'login-required'
//   },
//   config: {
//     url: 'http://localhost:8180/auth',
//     clientId: 'Klub Strzelecki Dziesiątka LOK Łódź',
//     realm: 'ShootingPlace'
//   }
// })
// new Vue({
//   router,
//   render: h => h(App)
// }).$mount('#app')

// const config = {
//   url: 'http://localhost:8180/auth', realm: 'ShootingPlace', clientId: 'Klub Strzelecki Dziesiątka LOK Łódź', onLoad: 'login-required'
// }

// Vue.use(keycloak, {
//   config: config,
//   onReady: () => {
//     new Vue({
//       router,
//       render: h => h(App)
//     }).$mount('App')
//   }
// })
import { isWindows } from 'mobile-device-detect'
export default {
  created () {
    this.createMain()
  },
  methods: {
    createMain () {
      if (window.localStorage.getItem('main') == null) {
        window.localStorage.setItem('main', 'false')
      }
    }
  },
  name: 'App',
  mobile: !isWindows,
  main: JSON.parse(window.localStorage.getItem('main')), // dev //
  // ip: '192.168.100.2:8080', // prod //
  // prod: location.hostname + ':8081/#/', // dev //
  // prod: '192.168.1.30:8080/strzelnica/#/', // test //
  prod: '192.168.100.2:8080/strzelnica/#/', // prod //
  host: location.hostname + ':8080/shootingplace-1.0/' // test + prod + dev //
  // host: location.hostname + ':8080/' // test + prod + dev //

}

</script>
