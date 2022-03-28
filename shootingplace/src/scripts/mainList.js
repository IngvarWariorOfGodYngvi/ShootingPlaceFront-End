import App from 'src/App.vue'
export default {
  name: 'PageIndex',
  data () {
    return {
      app: 'http://' + App.prod,
      color: 'primary',
      tournamentCheck: false,
      local: App.host
    }
  },
  created () {
    this.check()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 500)
    },
    checkAnyOpenAmmoList () {
      fetch('http://' + this.local + '/ammoEvidence/checkAnyOpenEvidence', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.color = response
        })
    },
    checkTournament () {
      fetch('http://' + this.local + '/tournament/check', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.tournamentCheck = response
        })
    },
    check () {
      console.log(this.local)
      this.checkAnyOpenAmmoList()
      this.checkTournament()
      setInterval(() => {
        this.checkAnyOpenAmmoList()
        this.checkTournament()
      }, 30000)
    }
  }
}
