<template>
  <div id="q-app" class="bg-dark">
    <router-view />
  </div>
</template>
<script src="src/scripts/SetLocalStorageVariables.js"></script>
<script>
// import { isWindows } from 'mobile-device-detect'
import { scripts } from 'src/scripts/SetLocalStorageVariables.js'

export default {
  created () {
  },
  beforeMount () {
    // this.getFs()
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
    // getFs () {
    //   import('src/App.vue').then(App => {
    //     const local = App.default.host
    //     fetch(`${local}/conf/fs`, {
    //       method: 'GET'
    //     }).then(response => {
    //       if (response.status === 200) {
    //         response.text().then(() => {
    //           console.log('coś')
    //           window.location.reload(`${this.prod}firstStart`)
    //         })
    //       }
    //     })
    //   })
    // }
  },
  name: 'App',
  shootingPlace: window.localStorage.getItem('shootingPlace'),
  mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  // mobile: isMobile(),
  main: JSON.parse(window.localStorage.getItem('main')), // dev //
  // prod: '192.168.1.30:8080/strzelnica/#/', // test //
  prod: `http://${location.hostname}:8081/#/`, // dev //
  host: `http://${location.hostname}:8080/` // test + dev //
  // prod: '192.168.1.30:8080/strzelnica/#/', // prod dom //
  // prod: 'http://192.168.100.2:8080/strzelnica/#/', // prod //
  // prod: 'http://192.168.1.44:8080/strzelnica/#/', // rcs //
  // host: `http://${location.hostname}:8080/shootingplace-1.0/` // test + prod + dev + rcs //

}

</script>
