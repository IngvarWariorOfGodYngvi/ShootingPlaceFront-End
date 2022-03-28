import App from 'src/App.vue'
export default {
  name: 'membersQuantities',

  created () {
    this.check()
  },
  data () {
    return {
      quantities: [],
      members: null,
      local: App.host
    }
  },
  methods: {
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
      this.getMembersQuantity()
      this.getActualYearMemberCounts()
      setInterval(() => {
        this.getMembersQuantity()
        this.getActualYearMemberCounts()
      }, 30000)
    }
  }
}
