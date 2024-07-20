<template>
  <div class="bg-dark text-positive">
    <q-card-actions align="right" class="q-pa-xs q-ma-xs">
      <div class="text-h5 text-bold text-center col">Wydaj Pakiet</div>
<q-btn icon="close" color="primary" round dense v-close-popup @click="memberName = ''; otherName = ''"/>
</q-card-actions>
        <div class="row col">
          <q-select label="Wybierz osobę z Klubu" popup-content-class="bg-dark text-positive"
            :option-value="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : ''"
            :option-label="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : ''"
            emit-value map-options options-dense color="positive" input-class="text-positive" label-color="positive" dark
            v-model="memberName" fill-input filled dense use-input hide-selected input-debounce="0" :options="options"
            @input="otherName = '0 0'" @filter="filterFn" class="col">
            <template v-slot:option="option">
              <q-item class="rounded bg-dark text-positive" dense style="padding: 0; margin: 0;" v-bind="option.itemProps"
                v-on="option.itemEvents">
                <div class="container">
                  <div class="background text-caption text-right">{{ !option.opt.declarationLOK && shootingPlace==='prod'?'Brak Podpisanej Deklaracji LOK':'' }}</div>
                <q-item-section dense style="padding: 0.5em; margin: 0;"
                  :class="option.opt.active ? '' : 'bg-warning rounded'"
                  @click="otherName = '0 0'; memberName = option.opt.secondName + ' ' + option.opt.firstName + ' ' + option.opt.legitimationNumber">
                    <div>{{ option.opt.secondName }} {{ option.opt.firstName }}
                      {{ option.opt.legitimationNumber }} {{ option.opt.adult ? 'Ogólna' : 'Młodzież' }} {{
                        option.opt.active ? '' : ' - BRAK SKŁADEK' }}
                  </div>
                </q-item-section>
              </div>
              </q-item>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Brak wyników
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select @popup-show="getOther()" @popup-hide="getOther()" options-dense class="col" dense filled
            v-model="otherName" use-input hide-selected fill-input input-debounce="0" color="positive"
            input-class="text-positive" label-color="positive" popup-content-class="bg-dark text-positive"
            :options="options1" @input="memberName = '0 0'" @filter="filterOther" label="Dodaj osobę spoza klubu">
            <template v-slot:no-option>
              <div class="bg-dark text-center text-bold text-positive">
                <div class="q-pa-md bg-dark text-center text-bold text-positive">Brak wyników - możesz dodać nową
                  osobę
                </div>
                <AddNewOtherPerson></AddNewOtherPerson>
              </div>
            </template>
          </q-select>
        </div>
        <div class="col">
          <div v-for="(item,uuid) in packets" :key="uuid">
            <q-item>
              <div class=" col">
                <q-btn class="full-width" @click="dis=true; singlePacket = item; simulateProgress(0)" :disable="dis" :loading="loading[0]" color="primary" :label="item.name">
                  <q-tooltip v-if="!mobile" content-class="bg-secondary text-body1" transition-hide="none" content-style="opacity: 95%;">
                    <div v-for="(item1,index) in item.calibers" :key="index" class="row" style="min-width: 30vw">
                      <div class="col text-right q-pa-xs">{{ item1.caliberName }}</div>
                      <div class="col text-left  q-pa-xs">{{ item1.quantity }} sztuk</div>
                    </div>
                    <div class="col text-left q-pa-xs text-right">cena: {{ viewCurrency (item.price) }}</div>
                  </q-tooltip>
                </q-btn>
              </div>
            </q-item>
          </div>
        </div>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
      </div>
</template>
<style src="src\style\style.scss" lang="scss">
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
import { ref } from 'vue'
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
// import { isWindows } from 'mobile-device-detect'
export default {
  created () {
    this.getPacketList()
    this.getMembersNames()
    this.getOther()
  },
  components: {
    AddNewOtherPerson: lazyLoadComponent({
      componentFactory: () => import('src/components/otherPerson/AddNewOtherPerson.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      filters: [],
      filtersOther: [],
      options: [],
      options1: [],
      packets: [],
      singlePacket: {},
      dis: false,
      memberName: '',
      otherName: '',
      message: null,
      success: false,
      failure: false,
      mobile: App.mobile,
      shootingPlace: App.shootingPlace,
      local: App.host
    }
  },
  setup () {
    const loading = ref([
      false
    ])
    const progress = ref(false)

    function simulateProgress (number) {
      loading.value[number] = true
      if (this.dis || !this.memberName === '' || !this.otherName === '') {
        this.addMemberAndAmmoToCaliber(this.mapCalibers(this.singlePacket.calibers))
      }
      setTimeout(() => {
        loading.value[number] = false
      }, 0)
    }
    function simulateProgressGun (number, evidenceUUID, barcode) {
      loading.value[number] = true
      this.addGunToList(evidenceUUID, barcode)
      setTimeout(() => {
        loading.value[number] = false
      }, 0)
    }
    return {
      loading,
      progress,
      simulateProgress,
      simulateProgressGun
    }
  },
  methods: {
    getPacketList () {
      fetch(`${this.local}/armory/getAllShootingPacket`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.packets = response
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
    getOther () {
      fetch(`${this.local}/other/`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filtersOther = response
        })
    },
    mapCalibers (calibersObject) {
      const map = new Map()
      for (let i = 0; i < calibersObject.length; i++) {
        map.set(calibersObject[i].caliberUUID, Number(calibersObject[i].quantity))
      }
      return map
    },
    viewCurrency (money) {
      if (money === undefined) { money = '0' }
      const formatterPL = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })
      const cash = formatterPL.format(money)
      return cash
    },
    addMemberAndAmmoToCaliber (map) {
      const memberNameWord = this.memberName.split(' ')
      const legNumber = memberNameWord.length
      const memberNameUUID = memberNameWord[legNumber - 1]
      const otherNameWord = this.otherName.split(' ')
      const idNumber = otherNameWord.length
      const otherNameID = otherNameWord[idNumber - 1]
      fetch(`${this.local}/ammoEvidence/listOfAmmo?legitimationNumber=${memberNameUUID}&otherID=${otherNameID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(map))
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.message = response
            this.success = true
            this.dis = false
            this.$root.$on('ammoEvidence', () => {
              this.getAmmoData()
            })
            this.autoClose()
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.dis = false
            this.autoClose()
          })
        }
      }).catch(() => {
        this.message = 'coś jest nie tak'
        this.failure = true
        this.dis = false
        this.autoClose()
      })
    },
    filterFn (val, update) {
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
    filterOther (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options1 = this.filtersOther.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options1 = this.filtersOther.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    autoClose () {
      setTimeout(() => {
        this.success = false
        this.failure = false
        this.message = null
      }, 2000)
    }
  }
}
</script>
