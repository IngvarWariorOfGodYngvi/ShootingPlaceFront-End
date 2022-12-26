import { scroll } from 'quasar'
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'

const { getScrollTarget, setScrollPosition } = scroll

export default {
  data () {
    return {
      temp: null,
      memberName: '',
      sortLicense: false,
      sortLegitimation: false,
      sortName: false,
      sortDate: false,
      filters: [],
      options: [],
      active: null,
      adult: null,
      erase: false,
      failure: false,
      success: false,
      message: null,
      barcode: null,
      memberDTOArg: [],
      memberDTOArgRearrangeTable: [],
      quantities: [],
      allMember: true,
      local: App.host
    }
  },
  async created () {
    this.getMembersNames()
    this.getMembersQuantity()
    this.getAllMemberDTO()
  },
  components: {
    Member: lazyLoadComponent({
      componentFactory: () => import('components/Member.vue'),
      loading: SkeletonBox
    })
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    convertDate (date) {
      const current = new Date(date)
      let month = current.getMonth() + 1
      let day = current.getDate()
      if (day < 10) {
        day = '0' + day
      }
      if (month < 10) {
        month = '0' + (month)
      }
      return day + '-' + (month) + '-' + current.getFullYear()
    },
    handleScroll (search) {
      const word = search.split(' ')
      const ele = document.getElementById(word[0])
      const target = getScrollTarget(ele)
      const offset = ele.offsetTop - ele.scrollHeight
      const duration = 500
      setScrollPosition(target, offset, duration)
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
    getMembersNames () {
      fetch('http://' + this.local + '/member/getAllNames', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filters = response
        })
    },
    getAllMemberDTOWithArgs () {
      const active = this.active
      const adult = this.adult
      const erase = this.erase
      fetch('http://' + this.local + '/member/getAllMemberDTOWithArgs?active=' + active + '&adult=' + adult + '&erase=' + erase, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.memberDTOArg = response.sort()
          this.memberDTOArgRearrangeTable = response
        })
    },
    getAllMemberDTO () {
      fetch('http://' + this.local + '/member/getAllMemberDTO', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.memberDTOArg = response
          this.memberDTOArgRearrangeTable = response
        })
    },
    findMemberByBarCode () {
      fetch('http://' + this.local + '/member/findByBarCode?barcode=' + this.barcode, {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.member = response
              this.showloading()
              this.barcode = null
              this.memberUUID = response.uuid
            }
          )
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    filter (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.filters.filter(v => v.secondName.toLowerCase().indexOf(needle) > -1)
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filters.filter(v => v.secondName.toLowerCase().indexOf(needle) > -1)
      })
    },
    reload () {
      window.location.reload()
    },
    onRejected () {
      this.failure = true
      this.message = 'Nie można dodać, sprawdź rozmiar pliku i jego typ'
      this.autoClose()
    },
    /**
    * @param {string} type - The string
    */
    sortF (type) {
      if (type === 'numberLeg') {
        if (!this.sortLegitimation) {
          this.memberDTOArgRearrangeTable.sort((a, b) => b.legitimationNumber - a.legitimationNumber)
          this.sortLegitimation = !this.sortLegitimation
        } else {
          this.memberDTOArgRearrangeTable.sort((a, b) => a.legitimationNumber - b.legitimationNumber)
          this.sortLegitimation = !this.sortLegitimation
        }
      }
      if (type === 'name') {
        if (!this.sortName) {
          this.memberDTOArgRearrangeTable.sort((a, b) => ('' + b.secondName).localeCompare(a.secondName))
          this.sortName = !this.sortName
        } else {
          this.memberDTOArgRearrangeTable.sort((a, b) => ('' + a.secondName).localeCompare(b.secondName))
          this.sortName = !this.sortName
        }
      }
      if (type === 'numberLicense') {
        if (!this.sortLicense) {
          this.memberDTOArg.sort((a, b) => b.license.number - a.license.number)
          this.memberDTOArgRearrangeTable.sort((a, b) => b.license.number - a.license.number)
          this.sortLicense = !this.sortLicense
        } else {
          this.memberDTOArg.sort((a, b) => a.license.number - b.license.number)
          this.memberDTOArgRearrangeTable.sort((a, b) => a.license.number - b.license.number)
          this.sortLicense = !this.sortLicense
        }
      }
      if (type === 'date') {
        console.log('sortuję')
        if (!this.sortDate) {
          this.memberDTOArg.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
          this.memberDTOArgRearrangeTable.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
          this.sortDate = !this.sortDate
        } else {
          this.memberDTOArg.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate))
          this.memberDTOArgRearrangeTable.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate))
          this.sortDate = !this.sortDate
        }
      }
    },
    rearrangeMemberDTO () {
      const arr = this.memberDTOArg
      const arr1 = []
      if (this.adult !== null && this.active === null) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].adult === this.adult) {
            arr1.push(arr[i])
          }
        }
      }
      if (this.active !== null && this.adult === null) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].active === this.active) {
            arr1.push(arr[i])
          }
        }
      }
      if (this.active !== null && this.adult !== null) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].active === this.active && arr[i].adult === this.adult) {
            arr1.push(arr[i])
          }
        }
      }
      this.memberDTOArgRearrangeTable = arr1
    },
    autoClose () {
      setTimeout(() => {
        this.failure = false
        this.success = false
        this.forbidden = false
        this.message = null
        this.barcode = null
        this.code = null
      }, 2000)
    }
  },
  name: 'member'
}
