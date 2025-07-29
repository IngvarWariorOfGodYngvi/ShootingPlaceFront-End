<template>
  <div id="q-app" class="bg-dark">
    <router-view />
  </div>
</template>
<script src="src/scripts/SetLocalStorageVariables.js"></script>
<script>
import { isWindows, isMacOs }  from 'mobile-device-detect'
import { scripts } from 'src/scripts/SetLocalStorageVariables.js'

export default {
  created () {
  },
  beforeMount () {
    this.getEnv()
    this.createMain()
  },
  methods: {
    createMain () {
      if (window.localStorage.getItem('shootingPlace') == null) {
        window.localStorage.setItem('shootingPlace', this.getEnv())
      }
      if (window.localStorage.getItem('main') == null) {
        window.localStorage.setItem('main', false)
      }
      scripts()
    },
    getEnv () {
      import('src/App.vue').then(App => {
        const local = App.default.host
        fetch(`${local}/conf/env`, {
          method: 'GET'
        }).then(response => {
          if (response.status === 200) {
            response.text().then(response => {
              window.localStorage.setItem('shootingPlace', response)
            })
          }
        })
      })
    }
  },
  name: 'App',
  siteName: window.sessionStorage.getItem('SiteName'),
  shootingPlace: window.localStorage.getItem('shootingPlace'),
  mobile: isWindows || isMacOs ? false : true,
  main: JSON.parse(window.localStorage.getItem('main')), // dev //
  // prod: '192.168.1.30:8080/strzelnica/#/', // test //
  prod: `http://${location.hostname}:8081/#/`, // dev //
  host: `http://${location.hostname}:8080//` // test + dev //
  // prod: '192.168.1.30:8080/strzelnica/#/', // prod dom //
  // prod: 'http://192.168.1.46:8080/strzelnica/#/', // rcs //
  // prod: 'http://192.168.100.2:8080/strzelnica/#/', // prod //
  // prod: `http://${location.hostname}:8080/strzelnica/#/`, // prod //
  // host: `http://${location.hostname}:8080/shootingplace-1.0/` // test + prod + dev + rcs //

}

</script>
