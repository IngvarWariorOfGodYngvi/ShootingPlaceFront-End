<template>
  <div class="q-pt-md">
    <q-input v-model="code" label-color="white" style="border: 1px solid white; border-radius: 3em;" label="wpisz pin" color="primary" mask="####" type="password" inputmode="numeric"  rounded standout="" bg-color="primary" dense @keypress.enter="getPermissionsFromCode (code)"></q-input>
    <div class="text-bold text-h6">{{ clock }}</div>
  </div>
</template>
<script>
import App from 'src/App.vue'
export default {
  name: 'signInByPin',
  data () {
    return {
      time: null,
      clock: '',
      code: null,
      message: null,
      failure: false,
      success: false,
      local: App.host
    }
  },
  created () {
    this.getTime()
  },
  methods: {
    getPermissionsFromCode (code) {
      fetch(`${this.local}/users/permissionsByPin?pinCode=${code}`, {
        method: 'GET'
      }).then(response => response.text())
        .then(response => {
          const date = new Date()
          const time = this.addMinutes(date, 30).getTime()
          this.time = time
          if (window.localStorage.getItem('usrPerm') === '' || window.localStorage.getItem('usrPerm') == null) {
            window.localStorage.setItem('usrPerm', response)
            window.localStorage.setItem('usrPermTime', time)
            this.countTime()
            this.goToWork(code)
            window.location.reload()
          } else {
            const usr = JSON.parse(window.localStorage.getItem('usrPerm'))
            if (usr.Hash !== response.Hash) {
              window.localStorage.setItem('usrPerm', response)
              window.localStorage.setItem('usrPermTime', time)
              this.countTime()
              this.goToWork(code)
              window.location.reload()
            }
          }
        })
    },
    goToWork (code) {
      fetch(`${this.local}/work/byPin?pinCode=${code}`, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            setTimeout(() => {
              this.getAllUsersInWork()
              this.message = response
              this.success = true
              this.autoClose()
            }, 1500)
          })
        }
        if (response.status === 400) {
          response.text().then(response => {
            setTimeout(() => {
              this.visible = false
              this.message = response
              this.failure = true
              this.dis = false
              this.autoClose()
            }, 1500)
          })
        }
      }).catch(() => {
        setTimeout(() => {
          this.visible = false
          this.message = 'błąd'
          this.failure = true
          this.dis = false
          this.autoClose()
        }, 1500)
      })
    },
    addMinutes (date, minutes) {
      return new Date(date.getTime() + minutes * 60000)
    },
    getTime () {
      this.countTime()
      setInterval(() => {
        this.countTime()
      }, 1000)
    },
    countTime () {
      if (window.localStorage.getItem('usrPerm') != null) {
        const time = new Date().getTime()
        this.time = (JSON.parse(window.localStorage.getItem('usrPermTime')) - time)
        let minutes = new Date(this.time).getMinutes()
        let seconds = new Date(this.time).getSeconds()
        if (minutes < 10) {
          minutes = '0' + minutes
        }
        if (seconds < 10) {
          seconds = '0' + seconds
        }
        this.clock = minutes + ':' + seconds
      }
    }
  }
}
</script>
