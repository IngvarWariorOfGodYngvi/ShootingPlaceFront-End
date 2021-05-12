<template>
  <div id='q-app'>
    <router-view />
  </div>
</template>

<script>
import Keycloak from '@dsb-norge/vue-keycloak-js'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
Vue.prototype.$axios = axios
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

const config = {
  url: 'http://localhost:8180/auth', realm: 'ShootingPlace', clientId: 'Klub Strzelecki Dziesiątka LOK Łódź'
}

Vue.use(Keycloak, {
  config: config,
  onLoad: 'login-required',
  onReady: () => {
    new Vue({
      router,
      render: h => h(App)
    }).$mount('App')
  }
})
function tokenInterceptor () {
  axios.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${Vue.prototype.$Keycloak.token}`
    return config
  }, error => {
    return Promise.reject(error)
  })
}

Vue.use(Keycloak, {
  onReady: (Keycloak) => {
    tokenInterceptor()
    /* eslint-disable no-new */
    new Vue({
      el: 'App',
      router,
      template: '<App/>',
      render: h => h(App)
    })
  }
})
export default {
  name: 'App',
  // prod: 'localhost:8081/#/',
  prod: 'localhost:8080/strzelnica/#/',
  // host: 'localhost:8080/shootingplace'
  host: 'localhost:8080/shootingplace-1.0'
}
</script>
