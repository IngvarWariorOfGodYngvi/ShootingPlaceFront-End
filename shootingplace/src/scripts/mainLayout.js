import EssentialLink from 'components/EssentialLink.vue'
import membersQuantities from 'components/MembersQuantities.vue'
import WorkTimeList from 'components/WorkTimeList.vue'
import App from 'src/App.vue'
export default {
  name: 'MainLayout',

  components: {
    EssentialLink,
    membersQuantities,
    WorkTimeList
  },
  created () {
    this.getActualYearMemberCounts()
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
          icon: 'person',
          link: 'http://' + App.prod + 'member'
        },
        {
          title: 'Licencje',
          icon: 'person',
          link: 'http://' + App.prod + 'license'
        },
        {
          title: 'Dodaj Nowego Klubowicza',
          icon: 'person_add',
          link: 'http://' + App.prod + 'member/adding'
        },
        {
          title: 'Lista Amunicyjna',
          icon: 'list_alt',
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
          icon: 'storage',
          link: 'http://' + App.prod + 'armory'
        },
        {
          title: 'Statystyki',
          icon: 'bar_chart',
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
        // {
        //   title: 'Faktury STRONA GŁÓWNA',
        //   icon: 'receipt',
        //   link: 'http://' + App.friend
        // }
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
    clear () {
      this.interval = true
      this.distance = 1200000
    }
  }
}
