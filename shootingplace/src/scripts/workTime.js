import App from 'src/App.vue'
export default {
  name: 'WorkTimeList',
  created () {
    this.getAllUsersInWork()
  },
  data () {
    return {
      app: 'http://' + App.prod,
      friend: 'http://' + App.friend,
      color: 'primary',
      number: '',
      usersInWork: [],
      success: false,
      failure: false,
      forbidden: false,
      message: '',
      local: App.host
    }
  },
  methods: {
    goToWork (number) {
      fetch('http://' + this.local + '/work/?number=' + number, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.getAllUsersInWork()
            this.message = response
            this.success = true
            this.autoClose()
          })
        }
        if (response.status === 400) {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.autoClose()
          })
        }
      })
    },
    getAllUsersInWork () {
      fetch('http://' + this.local + '/work/', {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(response => {
            this.usersInWork = response
          })
        }
        if (response.status === 400) {
          response.json().then(response => {
            this.usersInWork = response
          })
        }
      })
    },
    autoClose () {
      setTimeout(() => {
        this.failure = false
        this.success = false
        this.forbidden = false
        this.message = null
        this.number = ''
      }, 2000)
    }
  }

}
