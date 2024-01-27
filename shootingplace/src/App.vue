<template>
  <div id="q-app" class="bg-dark">
    <router-view />
  </div>
</template>
<script>
import { isWindows } from 'mobile-device-detect'
export default {
  created () {
    this.getEnv()
  },
  beforeMount () {
    this.createMain()
  },
  methods: {
    createMain () {
      // if (window.localStorage.getItem('shootingPlace') == null) {
      //   window.localStorage.setItem('shootingPlace', this.getEnv())
      // }
      if (isWindows) {
        if (window.localStorage.getItem('main') == null) {
          window.localStorage.setItem('main', 'false')
        }
      } else {
        window.localStorage.setItem('main', 'false')
      }
      if (window.localStorage.getItem('mailingList') == null) {
        window.localStorage.setItem('mailingList', JSON.stringify([]))
      }
      if (window.localStorage.getItem('drawer') == null) {
        window.localStorage.setItem('drawer', this.mobile ? 'false' : 'true')
      }
      if (window.localStorage.getItem('arbiter') == null) {
        window.localStorage.setItem('arbiter', '')
      }
      if (window.localStorage.getItem('arbiter').length < 4) {
        window.localStorage.setItem('arbiter', '000')
      }
    },
    getEnv () {
      import('src/App.vue').then(App => {
        fetch(`http://${App.default.host}/conf/env`, {
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
  shootingPlace: window.localStorage.getItem('shootingPlace'),
  mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  // mobile: isMobile(),
  main: JSON.parse(window.localStorage.getItem('main')), // dev //
  // prod: '192.168.1.30:8080/strzelnica/#/', // test //
  prod: `${location.hostname}:8081/#/`, // dev //
  host: `${location.hostname}:8080/` // test + dev //
  // prod: '192.168.1.30:8080/strzelnica/#/', // prod dom //
  // prod: '192.168.100.2:8080/strzelnica/#/', // prod //
  // prod: '192.168.1.150:8080/strzelnica/#/', // rcs //
  // host: `${location.hostname}:8080/shootingplace-1.0/` // test + prod + dev + rcs //

}

</script>
