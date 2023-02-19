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
export default {
  name: 'App',
  prod: location.hostname + ':8081/#/', // test //
  // prod: '192.168.1.30:8080/strzelnica/#/', // test //
  // prod: '192.168.100.2:8080/strzelnica/#/', // prod //
  host: location.hostname + ':8080/shootingplace-1.0/' // test + prod //
  // prod: location.hostname + ':8080' + '/strzelnica/#/',
  // host: location.hostname + ':8080' + '/shootingplace-1.0/'
}

</script>
