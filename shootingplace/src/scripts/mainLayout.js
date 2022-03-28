import EssentialLink from 'components/EssentialLink.vue'
import MembersQuantities from 'components/MembersQuantities.vue'
import App from 'src/App.vue'
export default {
  name: 'MainLayout',

  components: {
    EssentialLink,
    MembersQuantities
  },
  created () {
    // this.clockTimer()
    this.getNumber()
    this.getMembersQuantity()
    this.getActualYearMemberCounts()
    this.check()
  },
  data () {
    return {
      leftDrawerOpen: false,
      interval: false,
      interval2: null,
      intervalTime: 1200000,
      distance: 1200000,
      number: null,
      members: null,
      barcode: null,
      color: 'primary',
      tournamentCheck: false,
      quantities: [],
      hrefTarget: 'http://' + App.prod,
      local: App.host,
      essentialLinks: [
        {
          title: 'Lista Klubowiczów',
          icon: 'perm_identity',
          link: 'http://' + App.prod + 'member'
        },
        {
          title: 'Licencje',
          icon: 'perm_identity',
          link: 'http://' + App.prod + 'license'
        },
        {
          title: 'Dodaj Nowego Klubowicza',
          icon: 'add',
          link: 'http://' + App.prod + 'member/adding'
        },
        {
          title: 'Lista Amunicyjna',
          icon: 'book',
          link: 'http://' + App.prod + 'ammolist'
        },
        {
          title: 'Zawody',
          icon: 'book',
          link: 'http://' + App.prod + 'competition'
        },
        {
          title: 'Lista Osób z Uprawnieniami',
          icon: 'book',
          link: 'http://' + App.prod + 'memberwithpermission'
        },
        {
          title: 'Zbrojownia',
          icon: 'book',
          link: 'http://' + App.prod + 'armory'
        },
        {
          title: 'Statystyki',
          icon: 'book',
          link: 'http://' + App.prod + 'statistics'
        },
        {
          title: 'Pozostałe Funkcje',
          icon: 'menu',
          link: 'http://' + App.prod + 'otherFunctions'
        },
        {
          title: 'Ustawienia',
          icon: 'settings',
          link: 'http://' + App.prod + 'settings'
        }
      ],
      programName: 'Program'
    }
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 500)
    },
    redirectToAmmoList () {
      window.location.href = 'http://' + App.prod + 'ammolist'
    },
    redirectToCompetitionList () {
      window.location.href = 'http://' + App.prod + 'competition'
    },
    redirectToMembersList () {
      window.location.href = 'http://' + App.prod + 'member'
    },
    onClick () {
      console.log('Clicked on a fab action')
    },
    getNumber () {
      fetch('http://' + this.local + '/statistics/maxLegNumber', {
        method: 'GET'
      }).then(response => response.json()).then(response => {
        this.number = response
      })
    },
    getMembersQuantity () {
      fetch('http://' + this.local + '/member/membersQuantity', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.quantities = response
        })
    },
    getActualYearMemberCounts () {
      fetch('http://' + this.local + '/statistics/actualYearMemberCounts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.members = response
        })
    },
    check () {
      this.checkAnyOpenAmmoList()
      this.checkTournament()
      this.getMembersQuantity()
      setInterval(() => {
        this.checkAnyOpenAmmoList()
        this.checkTournament()
        this.getMembersQuantity()
      }, 30000)
    },
    // checkAnyOpenAmmoList () {
    //   fetch('http://' + this.local + '/ammoEvidence/checkAnyOpenEvidence', {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   }).then(response => response.json())
    //     .then(response => {
    //       this.color = response
    //     })
    // },
    // checkTournament () {
    //   fetch('http://' + this.local + '/tournament/check', {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   }).then(response => response.json())
    //     .then(response => {
    //       this.tournamentCheck = response
    //     })
    // },
    // logout () {
    //   this.$keycloak.keycloak.logout()
    // },
    clear () {
      this.interval = true
      this.distance = 1200000
    }
    // clockTimer () {
    //   setInterval(() => {
    //     const minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60))
    //     const seconds = Math.floor((this.distance % (1000 * 60)) / 1000)
    //     document.getElementById('timer').innerHTML = 'Wylogowanie za: ' + minutes + 'm ' + seconds + 's '
    //     this.distance = this.distance - 1000
    //     if (this.distance < 0) {
    //       document.getElementById('timer').innerHTML = 'Wylogowywanie'
    //       this.logout()
    //     }
    //   }, 1000)
    // }
  }
}
