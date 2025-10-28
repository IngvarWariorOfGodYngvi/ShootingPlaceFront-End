<template>
  <q-page padding>
    <q-page-sticky position="top-right" :offset="[0, 0]" style="z-index: 11;" v-if="visible">
      <div style="min-height: 10vh;" @click="visible = false">
        <q-img :src="url" spinner-color="primary" contain height="20vh" width="15vw" />
      </div>
    </q-page-sticky>
    <q-card :class="mobile ? 'col bg-dark' : 'row bg-dark'" flat>
      <div class="col-4">
        <q-select v-if="!erase" label="Wybierz osobę" color="primary" input-class="text-white" label-color="white"
          popup-content-class="bg-dark text-positive" rounded standout=""
          :option-value="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : ''"
          :option-label="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : ''"
          emit-value map-options options-dense options-selected-class="bg-negative text-positive" v-model="memberName"
          bg-color="primary" dense use-input hide-selected fill-input :options="options" @filter="filter"
          @input="allMember = false">
          <template v-slot:option="option">
            <q-item class="rounded" dense style="padding: 0; margin: 0;" v-bind="option['itemProps']"
              v-on="option.itemEvents">
              <q-item-section style="padding: 0.5em; margin: 0;" :class="option.opt.active ? '' : 'bg-warning rounded'"
                @click="allMember = false; memberName = option.opt.secondName + ' ' + option.opt.firstName + ' ' + option.opt.legitimationNumber; temp = option.opt.legitimationNumber; visible = false">
                <div class="container">
                  <div class="background text-caption text-right">{{ !option.opt.declarationLOK &&
                    shootingPlace === 'prod' ? 'Brak Podpisanej Deklaracji LOK' : '' }}</div>
                  {{ option.opt.secondName }} {{ option.opt.firstName }}
                  {{ option.opt.legitimationNumber }} {{ option.opt.adult ? 'Ogólna' : 'Młodzież' }} {{
                    option.opt.active
                      ? '' : ' - BRAK SKŁADEK' }}
                </div>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Brak wyników - sprawdź w skreślonych
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select v-if="erase" label="Wybierz osobę ze skreślonych" color="primary" input-class="text-white"
          label-color="white" popup-content-class="bg-dark text-positive" rounded standout=""
          :option-value="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : ''"
          :option-label="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : ''"
          emit-value map-options options-dense options-selected-class="bg-negative text-positive" v-model="memberName"
          bg-color="primary" dense use-input hide-selected fill-input :options="options" @filter="filterErased"
          @input="allMember = false">
          <template v-slot:option="option">
            <q-item class="rounded bg-red-5" dense style="padding: 0; margin: 0;" v-bind="option['itemProps']"
              v-on="option.itemEvents">
              <q-item-section style="padding: 0.5em; margin: 0;"
                @click="allMember = false; memberName = option.opt.secondName + ' ' + option.opt.firstName + ' ' + option.opt.legitimationNumber; temp = option.opt.legitimationNumber; visible = false">
                <div>
                  {{ option.opt.secondName }} {{ option.opt.firstName }}
                  {{ option.opt.legitimationNumber }} {{ option.opt.adult ? 'Ogólna' : 'Młodzież' }}
                </div>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Brak wyników - sprawdź w skreślonych
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <div class="col">
          <q-checkbox :disable="!allMember || erase" class="text-positive full-width" v-model="advancedSearch" dense
            keep-color color="primary">szukanie niestandardowe</q-checkbox>
          <q-checkbox :disable="!allMember || erase" class="text-positive full-width" v-model="emailCheckBox" dense
            keep-color color="primary">wyślij wiadomość e-mail</q-checkbox>
        </div>
      </div>
      <div v-if="!mobile" class=" col-8">
        <q-card class="bg-accent q-pa-xs row rounded">
          <div class="col">
            <div class="row">
              <div class="col q-ml-md">
                <q-checkbox dense class="full-width"
                  @input="memberName = ''; temp = null; adult = null; active = null; erase = false; erase=!allMember; getMembersNames(); getAllMemberDTO()"
                  v-model="allMember" label="Zapisani" />
                <q-checkbox dense class="full-width"
                  @input="memberDTOArgRearrangeTable = []; memberName = ''; temp = null; allMember = !erase; active = false; getMembersNames(); getAllMemberDTOWithArgs(); erasedType = erasedTypes[0]"
                  color="red" v-model="erase" :val="false" label="Skreśleni" />
              </div>
              <div class="col"></div>
            </div>
            <div class="row text-bold text-center text-caption">
              <q-item dense v-if="!erase">
                Zapisani Ogółem : {{ quantities[0] + quantities[3] }}
              </q-item>
              <q-item dense v-if="!erase">
                Aktywni : {{ quantities[10] + quantities[4] }}
                ({{ quantities[10] }} + {{ quantities[4] }})
              </q-item>
              <q-item dense v-if="!erase">
                Nieaktywni : {{ quantities[11] + quantities[5] }}
                ({{ quantities[11] }} + {{ quantities[5] }})
              </q-item>
              <q-item dense v-if="erase">
                Skreśleni ogółem : {{ quantities[6] + quantities[7] }}
              </q-item>
              <q-item dense v-if="erase">
                Skreśleni Gr. Ogólna : {{ quantities[6] }}
              </q-item>
              <q-item dense v-if="erase">
                Skreśleni Gr. Młodzieżowa : {{ quantities[7] }}
              </q-item>
            </div>
          </div>
        </q-card>
      </div>
      <q-card v-if="advancedSearch" class="bg-dark row full-width text-positive items-center">
        <div class="col flex">
          <q-radio class="col" dense v-model="advancedSearchChoice" :val="advancedSearchRadio[0]" color="primary"
            keep-color label="numer telefonu"></q-radio>
          <q-radio class="col" dense v-model="advancedSearchChoice" :val="advancedSearchRadio[1]" color="primary"
            keep-color label="numer licencji"></q-radio>
          <q-radio class="col" dense v-model="advancedSearchChoice" :val="advancedSearchRadio[2]" color="primary"
            keep-color label="e-mail"></q-radio>
          <q-radio class="col" dense v-model="advancedSearchChoice" :val="advancedSearchRadio[3]" color="primary"
            keep-color label="PESEL"></q-radio>
          <q-radio class="col" dense v-model="advancedSearchChoice" :val="advancedSearchRadio[4]" color="primary"
            keep-color label="numer dokumentu"></q-radio>
        </div>
        <div class="col-4 q-pa-xs">
          <q-input debounce="1000" v-model="advancedSearchInput"
            @keypress.enter="getAdvancedSearch(erase, advancedSearchChoice, advancedSearchInput)"
            @input="getAdvancedSearch(erase, advancedSearchChoice, advancedSearchInput)" label="wyszukaj" color="white"
            bg-color="primary" input-class="text-white" label-color="white" dense rounded standout="">
            <template v-slot:append>
              <q-icon v-if="advancedSearchInput != ''" name="close" @click="advancedSearchInput = ''"
                class="cursor-pointer text-white" />
              <q-icon name="search" class="text-white"
                @click="getAdvancedSearch(erase, advancedSearchChoice, advancedSearchInput)" />
            </template>
          </q-input>
        </div>
      </q-card>
    </q-card>
    <Member v-if="temp != null" :member-number-legitimation="temp" />
    <div v-if="temp === null" class="full-width">
      <div v-if="memberDTOArg.length < 1" class="text-center text-bold text-h5 text-positive">
        <CircularLoadingBox></CircularLoadingBox>
      </div>
      <q-virtual-scroll v-else :virtual-scroll-item-size="48" :virtual-scroll-sticky-size-start="48"
        :virtual-scroll-sticky-size-end="32" dense :items="memberDTOArgRearrangeTable" type="table"
        class="row full-width q-pa-none bg-dark text-positive" style="height: 74vh;" @mouseleave="visible = false">
        <template v-slot:before>
          <thead class="thead-sticky text-left">
            <tr class="bg-primary text-white">
              <th v-if="emailCheckBox && !erase">
                <q-icon name="mail" size="2em"/>
              </th>
              <th class="text-left" @click="sortF('name')">
                <q-icon size="2em" :name="sortName ? 'arrow_drop_up' : 'arrow_drop_down'" />
                Imię i nazwisko
              </th>
              <th class="text-left" @click="sortF('date')">
                <q-icon size="2em" :name="sortDate ? 'arrow_drop_up' : 'arrow_drop_down'" />
                Data zapisu
              </th>
              <th v-if="!erase" class="text-left" @click="sortF('PZSS')">
                <div class="col text-center">
                  <div><q-icon size="2em" :name="sortPZSS ? 'arrow_drop_up' : 'arrow_drop_down'" />Wpis</div>
                  <div>do portalu PZSS</div>
                </div>
              </th>
              <th v-if="!erase" class="text-center" @click="sortF('image')">
                <q-icon size="2em" :name="sortImage ? 'arrow_drop_up' : 'arrow_drop_down'" />
                Zdjęcie
              </th>
              <th class="text-left" @click="sortF('numberLeg')">
                <q-icon size="2em" :name="sortLegitimation ? 'arrow_drop_up' : 'arrow_drop_down'" />
                Numer Legitymacji
              </th>
              <th class="text-center" @click="sortF('numberLicense')">
                <q-icon size="2em" :name="sortLicense ? 'arrow_drop_up' : 'arrow_drop_down'" />
                Licencja
              </th>
              <th v-if="!erase" class="text-center" @click="sortF('adult')">
                <q-icon size="2em" :name="sortAdult ? 'arrow_drop_up' : 'arrow_drop_down'" />
                Grupa
              </th>
              <th v-if="!erase" class="text-center" @click="sortF('active')">
                <q-icon size="2em" :name="sortActive ? 'arrow_drop_up' : 'arrow_drop_down'" />
                Status
              </th>
              <th v-else class="text-center">
                podstawa skreślenia
              </th>
            </tr>
          </thead>
        </template>
        <template v-slot="{ item, index }" class="row items-center">
          <tr v-if="!item.erased" :key="index" class="rounded bg-dark text-positive" style="cursor:pointer"
            @mouseenter="item.image != null ? getUrl(item.image) : visible = false">
            <td v-if="emailCheckBox && !item.erased">
              <q-checkbox class="col" v-model="mailingList" value="" :val="item.email" dense color="primary" keep-color
                @input="pushOrRemove(item.email)" />
            </td>
            <td class="rounded xyz" style="width:25%;" @click="atClickOn(item)"
              :class="item.club.id === 1 && (!item.declarationLOK && (shootingPlace === 'prod' || shootingPlace === 'test')) ? 'bg-warning text-white' : item.club.id === 1 && (item.declarationLOK && (shootingPlace === 'prod' || shootingPlace === 'test')) ? '' : item.club.id != 1 ? 'bg-secondary text-white' : 'text-positive'">
              <div>
                <b>{{ index + 1 + ' ' }}</b>{{ item.fullName }} {{ !item.declarationLOK && (shootingPlace === 'prod' || shootingPlace === 'test') ? '- Brak Deklaracji LOK' : ''}}
              </div>
              <div v-if="item.club.id != 1">{{ item.club.name }}</div>
            </td>
            <td style="width:10%;" class="text-center" @click="atClickOn(item)">
              {{ convertDate(item.joinDate) }}
            </td>
            <td style="width:5%;" class="rounded" @click="atClickOn(item)"
              :class="item.pzss ? 'bg-green-3 text-center text-black' : 'bg-warning text-center text-black'">
              <q-icon :name="item.pzss ? 'done' : 'cancel'" :color="item.pzss ? '' : 'primary'" size="1rem" />
            </td>
            <td style="width:5%;" class="rounded" @click="atClickOn(item)"
              :class="item.image != null ? 'bg-green-3 text-center text-black' : 'text-center text-black'">
              <q-icon :name="item.image != null ? 'done' : 'cancel'" :color="item.image != null ? '' : 'primary'"
                size="1rem" />
            </td>
            <td style="width:10%;" class="text-center text-bold" @click="atClickOn(item)">
              {{ item.legitimationNumber }}
            </td>
            <td style="width:15%;" class="rounded text-center" @click="atClickOn(item)"
              :class="item.license.number != null ? item.license.valid ? 'bg-green-3 text-black' : 'bg-warning text-black' : ''">
              <div v-if="item.license.number != null">{{ item.license.number }}</div>
              <div v-if="item.license.number == null" class="text-center"><q-icon v-for="i in 5" :key="i"
                  name="density_large">{{ i }}</q-icon></div>
              <q-tooltip v-if="item.license.number != null" anchor="top middle" :offset="[35, 35]"
                content-class="text-body1 bg-secondary">
                {{ item.license.valid ? 'Aktualna' : `Nieakutalna - ważna do: ${convertDate(item.license.validThru)}` }}
              </q-tooltip>
            </td>
            <td style="width: 15%" class="text-center" @click="atClickOn(item)">
              {{ item.adult ? 'Ogólna' : 'Młodzieżowa' }}
            </td>
            <td :class="item.active ? 'bg-green-3 text-center text-black' : 'bg-red-3 text-center text-black'"
              class="rounded" @click="atClickOn(item)">
              {{ item.active ? 'Klubowicz Aktywny' : 'Klubowicz Nieaktywny' }}
            </td>
          </tr>
          <tr v-if="item.erased" :key="index" style="cursor:pointer" class="full-width bg-dark text-positive rounded"
            @click="atClickOn(item)">
            <td style="width:25%;" class="xyz">
              <b>{{ index + 1 }}</b> {{ item.secondName }} {{ item.firstName }}
            </td>
            <td style="width:10%;" class="text-center">
              {{ convertDate(item.joinDate) }}
            </td>
            <td style="width:10%;" class="text-center text-bold">
              {{ item.legitimationNumber }}
            </td>
            <td style="width:15%;" class="rounded text-center text-positive"
              :class="item.license.number != null ? item.license.valid ? 'bg-green-3 text-black' : 'bg-warning text-black' : ''">
              <div v-if="item.license.number != null">{{ item.license.number }}</div>
              <div v-if="item.license.number == null" class="text-center"><q-icon v-for="i in 5" :key="i"
                  name="density_large">{{ i }}</q-icon></div>
              <q-tooltip v-if="item.license.number != null" anchor="top middle" :offset="[35, 35]"
                content-class="text-body1 bg-secondary">
                {{ item.license.valid ? 'Aktualna' : `Nieakutalna - ważna do: ${convertDate(item.license.validThru)}` }}
              </q-tooltip>
            </td>
            <td>
              <div class="self-center full-width text-center">
                {{ item.erasedEntity.erasedType }} {{ convertDate(item.erasedEntity.date) }}
              </div>
              <q-tooltip v-if="item.erasedEntity.additionalDescription != null" anchor="top middle" :offset="[35, 35]"
                content-class="text-body1 bg-secondary">
                {{ item.erasedEntity.additionalDescription }}
              </q-tooltip>
            </td>
          </tr>
        </template>
      </q-virtual-scroll>
    </div>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">
            {{ message }}
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model=" failure ">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if=" message != null " class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss">
#container {
  position: relative;
}

#background {
  position: absolute;
  padding: 50%;
  margin: 50%;
  z-index: -1;
  overflow: hidden;
}
</style>

<script>
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import axios from 'axios'
import { pushOrRemoveEmailFromList } from 'src/scripts/pushOrRemoveEmailFromList.js'
import EventBus from 'src/event-bus.js'

export default {
  data () {
    return {
      mailing: true,
      emailCheckBox: false,
      checkAllmails: false,
      advancedSearch: false,
      advancedSearchChoice: false,
      advancedSearchInput: '',
      advancedSearchRadio: [1, 2, 3, 4, 5],
      visible: false,
      url: '',
      mailingList: JSON.parse(window.localStorage.getItem('mailingList')),
      mobile: App.mobile,
      temp: null,
      memberName: '',
      sortLicense: false,
      sortAdult: false,
      sortLegitimation: false,
      sortName: false,
      sortDate: false,
      sortPZSS: false,
      sortActive: false,
      sortImage: false,
      filters: [],
      filtersErased: [],
      options: [],
      erasedTypes: [],
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
      shootingPlace: App.shootingPlace,
      allMember: true,
      local: App.host
    }
  },
  created () {
    EventBus.$on('clearMailingList', this.clearMailingList)
    this.getMembersQuantity()
    this.getAllMemberDTO()
    this.getMembersNames()
    this.getMembersNamesErased()
  },
  components: {
    Member: lazyLoadComponent({
      componentFactory: () => import('components/member/Member.vue'),
      loading: SkeletonBox
    }),
    CircularLoadingBox: lazyLoadComponent({
      componentFactory: () => import('src/utils/CircularLoadingBox.vue'),
      loading: SkeletonBox
    })
  },
  methods: {
    getUrl (uuid) {
      axios({
        url: `${this.local}/files/getFile?uuid=${uuid}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        this.url = window.URL.createObjectURL(new Blob([response.data]))
        this.visible = true
      })
    },
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    atClickOn (item) {
      this.showloading()
      this.allMember = false
      this.memberName = item
      this.temp = item.legitimationNumber
      this.visible = false
    },
    pushOrRemove (email) {
      pushOrRemoveEmailFromList(email)
    },
    clearMailingList () {
      this.mailingList = []
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
    getAdvancedSearch (isErased, searchType, inputText) {
      fetch(`${this.local}/member/getAdvancedSearch?isErased=${isErased}&searchType=${searchType}&inputText=${inputText}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.memberDTOArgRearrangeTable = response
        })
    },
    getMembersQuantity () {
      fetch(`${this.local}/statistics/membersQuantity`, {
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
      fetch(`${this.local}/member/getAllNames`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filters = response
        })
    },
    getMembersNamesErased () {
      fetch(`${this.local}/member/getAllNamesErased`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filtersErased = response
        })
    },
    getAllMemberDTOWithArgs () {
      const active = this.active
      const adult = this.adult
      const erase = this.erase
      fetch(`${this.local}/member/getAllMemberDTOWithArgs?active=${active}&adult=${adult}&erase=${erase}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.memberDTOArg = response.sort()
          this.memberDTOArgRearrangeTable = response
        })
    },
    getAllMemberDTO () {
      fetch(`${this.local}/member/getAllMemberDTO`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.memberDTOArg = response
          this.memberDTOArgRearrangeTable = response
        })
    },
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
    filterErased (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.filtersErased.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filtersErased.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
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
      if (type === 'adult') {
        if (!this.sortAdult) {
          this.memberDTOArg.sort((a, b) => b.adult - a.adult)
          this.memberDTOArgRearrangeTable.sort((a, b) => b.adult - a.adult)
          this.sortAdult = !this.sortAdult
        } else {
          this.memberDTOArg.sort((a, b) => a.adult - b.adult)
          this.memberDTOArgRearrangeTable.sort((a, b) => a.adult - b.adult)
          this.sortAdult = !this.sortAdult
        }
      }
      if (type === 'date') {
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
      if (type === 'PZSS') {
        if (!this.sortPZSS) {
          this.memberDTOArg.sort((a, b) => b.pzss - a.pzss)
          this.memberDTOArgRearrangeTable.sort((a, b) => b.pzss - a.pzss)
          this.sortPZSS = !this.sortPZSS
        } else {
          this.memberDTOArg.sort((a, b) => a.pzss - b.pzss)
          this.memberDTOArgRearrangeTable.sort((a, b) => a.pzss - b.pzss)
          this.sortPZSS = !this.sortPZSS
        }
      }
      if (type === 'active') {
        if (!this.sortActive) {
          this.memberDTOArg.sort((a, b) => b.active - a.active)
          this.memberDTOArgRearrangeTable.sort((a, b) => b.active - a.active)
          this.sortActive = !this.sortActive
        } else {
          this.memberDTOArg.sort((a, b) => a.active - b.active)
          this.memberDTOArgRearrangeTable.sort((a, b) => a.active - b.active)
          this.sortActive = !this.sortActive
        }
      }
      if (type === 'image') {
        if (!this.sortImage) {
          this.memberDTOArg.sort((a, b) => String(b.image).length - String(a.image).length)
          this.memberDTOArgRearrangeTable.sort((a, b) => String(b.image).length - String(a.image).length)
          this.sortImage = !this.sortImage
        } else {
          this.memberDTOArg.sort((a, b) => String(a.image).length - String(b.image).length)
          this.memberDTOArgRearrangeTable.sort((a, b) => String(a.image).length - String(b.image).length)
          this.sortImage = !this.sortImage
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
