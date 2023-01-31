import EssentialLink from 'components/EssentialLink.vue'
import membersQuantities from 'components/MembersQuantities.vue'
import WorkTimeList from 'components/WorkTimeList.vue'
import App from 'src/App.vue'
export default {
  name: 'MainLayout',
  visible2: false,
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
      visible1: true,
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
      hrefTarget: 'http://' + location.hostname + ':8080/strzelnica/#/',
      local: App.host,
      essentialLinks: [
        {
          title: 'Lista Klubowiczów',
          icon: 'person',
          link: 'http://' + App.prod + 'member',
          visible: this.visible2
        },
        {
          title: 'Licencje',
          icon: 'person',
          link: 'http://' + App.prod + 'license',
          visible: this.visible2
        },
        {
          title: 'Dodaj Nowego Klubowicza',
          icon: 'person_add',
          link: 'http://' + App.prod + 'member/adding',
          visible: this.visible2
        },
        {
          title: 'Lista Amunicyjna',
          icon: 'list_alt',
          link: 'http://' + App.prod + 'ammolist',
          visible: this.visible2
        },
        {
          title: 'Zawody',
          icon: 'book',
          link: 'http://' + App.prod + 'competition',
          visible: this.visible2
        },
        {
          title: 'Lista Osób z Uprawnieniami',
          icon: 'book',
          link: 'http://' + App.prod + 'memberwithpermission',
          visible: this.visible2
        },
        {
          title: 'Zbrojownia',
          icon: 'storage',
          link: 'http://' + App.prod + 'armory',
          visible: this.visible2
        },
        {
          title: 'Statystyki',
          icon: 'bar_chart',
          link: 'http://' + App.prod + 'statistics',
          visible: this.visible2
        },
        {
          title: 'Pozostałe Funkcje',
          icon: 'menu',
          link: 'http://' + App.prod + 'otherFunctions',
          visible: this.visible2
        },
        {
          title: 'Ustawienia',
          icon: 'settings',
          link: 'http://' + App.prod + 'settings',
          visible: this.visible2
        },
        {
          title: 'Pliki',
          icon: 'download',
          link: 'http://' + App.prod + 'files',
          visible: this.visible2
        },
        {
          title: 'Panel Sędziego',
          icon: 'done',
          link: 'http://' + App.prod + 'juryPanel',
          visible: true
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
    }
  }
}
