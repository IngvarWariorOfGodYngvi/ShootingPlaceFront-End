<template>
  <q-page padding>
    <div>
      <q-page-sticky v-if="mailingList.length>0" position="top-right" expand :offset="[6,6]" style="z-index: 10;">
        <q-tooltip anchor="center start" :hide-delay="200" class="bg-primary" content-class="bg-primary">
          <div class="text-h6 text-center">LISTA MAILINGOWA</div>
        </q-tooltip>
      <q-fab
          v-model="mailing"
          label-position="bottom"
          color="secondary"
          icon="email"
          direction="down"
          style="border: 2px solid white;"
        >
          <div v-if="mailingList.length>0" class="bg-secondary text-white"
               style="border-radius: 5% 5% 0 0; margin-right: 15vw; font-size: small; width: 18vw">
            <q-btn dense class="text-caption full-width" align="center" label="wyczyść listę" color="primary"
                   icon="delete" rounded @click="clearMailingList()"></q-btn>
            <q-btn dense class="text-caption full-width" align="center" :label="'kopiuj ' + mailingList.length + ' do schowka'" color="primary"
                   icon="content_copy" rounded @click="unsecuredCopyToClipboard(mailingList)"></q-btn>
            <q-virtual-scroll :items="mailingList" class="text-center" style="height: auto;max-height: 40vh;width: auto">
              <template v-slot="{item, index}">
                <q-item dense style="padding: 0 10px 0 10px;margin: 0">{{index+1}} {{ item }}</q-item>
              </template>
            </q-virtual-scroll>
          </div>
        </q-fab>
      </q-page-sticky>
      <q-item>
        <div class="text-center col full-width no-outline text-h4 text-bold text-positive" tabindex="0">Lista
          Klubowiczów
        </div>
      </q-item>
    </div>
    <q-card :class="mobile?'col bg-dark':'row bg-dark'" :style="mobile?'':'height:20vh;'">
      <div class="col-4">
        <q-select class="full-width rounded text-positive q-pb-md"
                  label="Wybierz osobę"
                  color="white"
                  input-class="text-white" label-color="white" popup-content-class="bg-dark text-positive"
                  :option-value="opt => opt!==''? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : ''"
                  :option-label="opt => opt!==''? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : ''"
                  emit-value
                  map-options
                  options-dense
                  options-selected-class="bg-negative text-positive"
                  v-model="memberName"
                  bg-color="primary" filled dense use-input hide-selected fill-input
                  :options="options" @filter="filter" @input="allMember = false">
          <template v-slot:option="option">
            <q-item class="rounded" dense style="padding: 0; margin: 0;" v-bind="option['itemProps']"
                    v-on="option.itemEvents">
              <q-item-section v-if="option['opt'].active" style="padding: 0.5em; margin: 0;"
                              @click="memberName = option.opt.secondName+' '+option.opt.firstName+' '+ option.opt.legitimationNumber;temp = option.opt.legitimationNumber;temp = option.opt.legitimationNumber">
                <div v-if="option.opt.adult">{{ option.opt.secondName }} {{ option.opt.firstName }}
                  {{ option.opt.legitimationNumber }} Ogólna
                </div>
                <div v-else>{{ option.opt.secondName }} {{ option.opt.firstName }} {{ option.opt.legitimationNumber }}
                  Młodzież
                </div>
              </q-item-section>
              <q-item-section v-else style="padding: 0.5em; margin: 0;" class="bg-warning rounded"
                              @click="memberName = option.opt.secondName+' '+option.opt.firstName+' '+ option.opt.legitimationNumber;temp = option.opt.legitimationNumber">
                <div v-if="option.opt.adult">{{ option.opt.secondName }} {{ option.opt.firstName }}
                  {{ option.opt.legitimationNumber }} Ogólna - BRAK SKŁADEK
                </div>
                <div v-else>{{ option.opt.secondName }} {{ option.opt.firstName }} {{ option.opt.legitimationNumber }}
                  Młodzież - BRAK SKŁADEK
                </div>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Brak wyników - sprawdź w nieaktywnych
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <!--          <q-item>-->
        <!--            <div class="col-9 bg-grey-1"><q-input type="password" v-model="barcode" dense class="full-width" filled label="numer karty" @keypress.enter="findMemberByBarCode();allMember = false;memberName=null"></q-input></div>-->
        <!--            <div class="col-3 text-grey"><q-btn class="text-black full-width full-height" label="wyszukaj" @click="findMemberByBarCode();allMember = false;memberName=null"/></div>-->
        <!--          </q-item>-->
      </div>
      <div class=" col-8">
        <q-card class="bg-accent q-pa-xs col">
          <div class="row">
            <q-checkbox dense
                        @input="memberName=null; temp=null;adult=null;active=null;erase=false;getMembersNames ();getAllMemberDTO()"
                        v-model="allMember" label="Wyświetl wszystkich"></q-checkbox>
            <div class="col full-width">
              <div class="row flex flex-left full-width">
                <q-radio @input="member=null;allMember=false;getMembersNames ();rearrangeMemberDTO ()" color="green"
                         v-model="adult" :val="true" label="Grupa Ogólna"></q-radio>
                <q-radio @input="member=null;allMember=false;getMembersNames ();rearrangeMemberDTO ()" color="warning"
                         v-model="adult" :val="false" label="Grupa Młodzieżowa"></q-radio>
              </div>
              <div class="row flex flex-left full-width">
                <q-radio @input="member=null;allMember=false;erase=false; getMembersNames ();rearrangeMemberDTO ()"
                         color="green" v-model="active" :val="true" label="Aktywni"></q-radio>
                <q-radio @input="member=null;allMember=false;getMembersNames ();rearrangeMemberDTO ()" color="warning"
                         v-model="active" :val="false" label="Nieaktywni"></q-radio>
              </div>
            </div>
          </div>
          <div class="row">
            <q-checkbox dense
                        @input="memberName=null; temp=null;allMember=!erase;active = false; getMembersNames ();getAllMemberDTOWithArgs();erasedType = erasedTypes[0]"
                        color="red" v-model="erase" :val="false" label="Skreśleni"></q-checkbox>
          </div>
        </q-card>
        <q-card>
          <div class="row text-bold text-center text-caption text-positive bg-dark">
            <q-item dense v-if="allMember||allMember==null">Ogółem : {{ quantities[0] + quantities[3] }}
              ({{ quantities[0] }} + {{ quantities[3] }})
            </q-item>
            <q-item dense v-if="allMember||allMember==null">Aktywni : {{ quantities[10] + quantities[4] }}
              ({{ quantities[10] }} + {{ quantities[4] }})
            </q-item>
            <q-item dense v-if="allMember||allMember==null">Nieaktywni : {{ quantities[11] + quantities[5] }}
              ({{ quantities[11] }} + {{ quantities[5] }})
            </q-item>
            <q-item dense v-if="(adult!=null&&adult)&&!erase">Gr. Ogólna ogółem : {{ quantities[0] }}</q-item>
            <q-item dense v-if="(adult!=null&&adult)&&!erase">Aktywni : {{ quantities[10] }}</q-item>
            <q-item dense v-if="(adult!=null&&adult)&&!erase">Nieaktywni : {{ quantities[11] }}</q-item>
            <q-item dense v-if="(adult!=null&&!adult)&&!erase">Gr. Młodzieżowa ogółem : {{ quantities[3] }}</q-item>
            <q-item dense v-if="(adult!=null&&!adult)&&!erase">Aktywni : {{ quantities[4] }}</q-item>
            <q-item dense v-if="(adult!=null&&!adult)&&!erase">Nieaktywni : {{ quantities[5] }}</q-item>
            <q-item dense v-if="erase">Skreśleni ogółem : {{ quantities[6] + quantities[7] }}</q-item>
            <q-item dense v-if="adult&&erase">Skreśleni Gr. Ogólna : {{ quantities[6] }}</q-item>
            <q-item dense v-if="!adult&&erase">Skreśleni Gr. Młodzieżowa : {{ quantities[7] }}</q-item>
          </div>
        </q-card>
      </div>
    </q-card>
    <q-item></q-item>
    <Member v-if="temp!=null" :member-number-legitimation="temp"></Member>
    <div v-if="temp==null" class="full-width">
      <div v-if="memberDTOArg.length<1" class="text-center text-bold text-h5 text-positive">
        Brak Wyników
      </div>
      <q-virtual-scroll :virtual-scroll-item-size="48"
                        :virtual-scroll-sticky-size-start="48"
                        :virtual-scroll-sticky-size-end="32" dense :items="memberDTOArgRearrangeTable" type="table"
                        visible class="row full-width q-pa-none round bg-dark" style="height: 90vh;">
        <template v-slot:before>
          <thead class="thead-sticky text-left">
          <tr class="bg-primary text-white">
            <th class="text-left" @click="sort='name';sortF (sort)">{{ memberDTOArgRearrangeTable.length }}
              <q-icon size="2em" :name="sortName?'arrow_drop_up':'arrow_drop_down'"/>
              Imię i nazwisko
            </th>
            <th class="text-left" @click="sort='date';sortF (sort)">
              <q-icon size="2em" :name="sortDate?'arrow_drop_up':'arrow_drop_down'"/>
              Data zapisu
            </th>
            <th v-if="!erase" class="text-left">Wpis do portalu PZSS</th>
            <th v-if="!erase" class="text-center">Zdjęcie</th>
            <th class="text-left" @click="sort='numberLeg';sortF (sort)">
              <q-icon size="2em" :name="sortLegitimation?'arrow_drop_up':'arrow_drop_down'"/>
              Numer Legitymacji
            </th>
            <th class="text-center" @click="sort='numberLicense';sortF (sort)">
              <q-icon size="2em" :name="sortLicense?'arrow_drop_up':'arrow_drop_down'"/>
              Licencja
            </th>
            <th v-if="!erase" class="text-center">Status</th>
            <th v-else class="text-center">podstawa skreślenia</th>
          </tr>
          </thead>
        </template>
        <template v-slot="{ item, index }">
          <tr v-if="!item.erased" :key="index" class="rounded bg-dark text-positive" style="cursor:pointer"
              @click.ctrl="pushOrRemoveEmailToList(item.legitimationNumber)"
              @click.exact="showloading();allMember=false;memberName =item.secondName + ' '+item.firstName+' leg. '+item.legitimationNumber;temp = item.legitimationNumber;">
            <td style="width:25%;" :class="item.club.id===1?'xyz':'xyz bg-secondary text-white'">
              <b>{{
                  index + 1 + ' '
                }}</b>{{
                item.club.id === 1 ? item.secondName + ' ' + item.firstName : item.secondName + ' ' + item.firstName + ' ' + item.club.name
              }}
            </td>
            <td style="width:10%;" class="text-center">{{ convertDate(item.joinDate) }}</td>
            <td style="width:5%;"
                :class="item.pzss?'bg-green-3 text-center text-black':'bg-warning text-center text-black'">
              <q-icon :name="item.pzss?'done':'cancel'" :color="item.pzss?'':'primary'" size="1rem"/>
            </td>
            <td style="width:5%;"
                :class="item.image!=null?'bg-green-3 text-center text-black':'text-center text-black'">
              <q-icon :name="item.image!=null?'done':'cancel'" :color="item.image!=null?'':'primary'" size="1rem"/>
            </td>
            <td style="width:10%;" class="text-center text-bold">{{ item.legitimationNumber }}</td>
            <td style="width:15%;" v-if="item.license.number!=null && item.license.valid"
                class="bg-green-3 text-center text-black">
              <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Aktualna
              </q-tooltip>
              <div>{{ item.license.number }}</div>
            </td>
            <td style="width:15%;" v-if="item.license.number!=null && !item.license.valid"
                class="bg-warning text-center text-black">
              <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Nieaktualna -
                ważna do: {{ convertDate(item.license.validThru) }}
              </q-tooltip>
              <div>{{ item.license.number }}</div>
            </td>
            <td style="width:15%;" v-if="item.license.number==null" class="text-center">
              <q-icon name="density_large"/>
              <q-icon name="density_large"/>
              <q-icon name="density_large"/>
              <q-icon name="density_large"/>
              <q-icon name="density_large"/>
            </td>
            <td :class="item.active?'bg-green-3 text-center text-black':'bg-red-3 text-center text-black'">
              {{ item.active ? 'Klubowicz Aktywny' : 'Klubowicz Nieaktywny' }}
            </td>
          </tr>
          <tr v-if="item.erased" :key="index" style="cursor:pointer" class="full-width bg-dark text-positive rounded"
              @click="showloading();allMember=false;memberName =item.secondName + ' '+item.firstName+' leg. '+item.legitimationNumber;temp = item.legitimationNumber">
            <td style="width:25%;" class="xyz"><b>{{ index + 1 }}</b> {{ item.secondName }} {{ item.firstName }}</td>
            <td style="width:10%;" class="text-center">{{ convertDate(item.joinDate) }}</td>
            <td style="width:10%;" class="text-center text-bold">{{ item.legitimationNumber }}</td>
            <td v-if="item.license.number!=null && item.license.valid" class="bg-green-3 text-center">
              <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Aktualna
              </q-tooltip>
              <div>{{ item.license.number }}</div>
            </td>
            <td v-if="item.license.number!=null && !item.license.valid" class="bg-warning text-center">
              <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Nieaktualna -
                ważna do: {{ convertDate(item.license.validThru) }}
              </q-tooltip>
              <div>{{ item.license.number }}</div>
            </td>
            <td v-if="item.license.number==null" class="text-center">
              <q-icon name="density_large"/>
              <q-icon name="density_large"/>
              <q-icon name="density_large"/>
              <q-icon name="density_large"/>
              <q-icon name="density_large"/>
            </td>
            <td class="bg-grey-3">
              <div class="self-center full-width no-outline text-center text-black" tabindex="0">
                {{ item.erasedEntity.erasedType }} {{ convertDate(item.erasedEntity.date) }}
              </div>
              <q-tooltip v-if="item.erasedEntity.additionalDescription!=null" anchor="top middle" :offset="[35, 35]"
                         content-class="text-body1 bg-secondary">{{ item.erasedEntity.additionalDescription }}
              </q-tooltip>
            </td>
          </tr>
        </template>
      </q-virtual-scroll>
    </div>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss">

</style>

<script>
import { scroll } from 'quasar'
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import { isWindows } from 'mobile-device-detect'

const {
  getScrollTarget,
  setScrollPosition
} = scroll

export default {
  data () {
    return {
      mailing: true,
      mailingList: JSON.parse(window.localStorage.getItem('mailingList')),
      mobile: !isWindows,
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
      componentFactory: () => import('components/member/Member.vue'),
      loading: SkeletonBox
    })
  },
  methods: {
    log (item) {
      console.log(item)
    },
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    pushOrRemoveEmailToList (number) {
      fetch('http://' + this.local + '/member/getMemberEmail?number=' + number, {
        method: 'GET'
      }).then(response => response.text())
        .then(response => {
          console.log(response)
          const parse = JSON.parse(window.localStorage.getItem('mailingList'))
          if (!parse.includes(response)) {
            parse.push(response)
          } else {
            const number1 = this.mailingList.indexOf(response)
            parse.splice(number1, number1 + 1)
          }
          window.localStorage.setItem('mailingList', JSON.stringify(parse))
          this.mailingList = parse
        })
    },
    clearMailingList () {
      window.localStorage.setItem('mailingList', JSON.stringify([]))
      this.mailingList = []
    },
    copyClipboard (arr) {
      let s = arr[0]
      if (arr.length > 1) {
        for (let i = 1; i < arr.length; i++) {
          s = s + ';' + arr[i]
        }
      }
      console.log(s)
      window.isSecureContext = false
      navigator.clipboard.writeText(s)
      this.message = 'Skopiowano listę do schowka'
      this.success = true
      this.autoClose()
    },
    unsecuredCopyToClipboard (arr) {
      const textArea = document.createElement('textarea')
      let s = arr[0]
      if (arr.length > 1) {
        for (let i = 1; i < arr.length; i++) {
          s = s + ';' + arr[i]
        }
      }
      console.log(s)
      textArea.value = arr
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
      } catch (err) {
        console.error('Unable to copy to clipboard', err)
      }
      document.body.removeChild(textArea)
      this.message = 'Skopiowano listę do schowka'
      this.success = true
      this.autoClose()
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
    // findMemberByBarCode () {
    //   fetch('http://' + this.local + '/member/findByBarCode?barcode=' + this.barcode, {
    //     method: 'GET'
    //   }).then(response => {
    //     if (response.status === 200) {
    //       response.json().then(
    //         response => {
    //           this.member = response
    //           this.showloading()
    //           this.barcode = null
    //           this.memberUUID = response.uuid
    //         }
    //       )
    //     } else {
    //       response.text().then(
    //         response => {
    //           this.message = response
    //           this.failure = true
    //           this.autoClose()
    //         }
    //       )
    //     }
    //   })
    // },
    filter (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.filters.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filters.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    },
    reload () {
      window.location.reload()
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
        this.message = null
        this.barcode = null
        this.code = null
      }, 2000)
    }
  },
  name: 'member'
}

</script>
