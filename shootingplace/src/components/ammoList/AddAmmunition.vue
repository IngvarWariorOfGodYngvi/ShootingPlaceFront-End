<template>
  <div style="min-width: 60%;" v-if="open1">
      <div class="bg-dark text-positive" >
        <div class="row">
          <q-select label="Wybierz osobę z Klubu" popup-content-class="bg-dark text-positive"
            :option-label="opt => opt.secondName!== '0' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : ''"
            :class="memberName.secondName!=='0'?'bg-primary':'bg-secondary'" style="transition: 0.6s ease-in-out;"
            emit-value map-options options-dense color="positive" input-class="text-white" label-color="white"
            v-model="memberName" fill-input filled dense use-input hide-selected input-debounce="0" :options="options"
            @input="otherName = Object({secondName:'0', firstName: '0',id: '0'})"  @filter="filterFn" class="col">
            <template v-slot:option="option">
              <q-item class="rounded bg-dark text-positive" dense style="padding: 0; margin: 0;" v-bind="option.itemProps"
                v-on="option.itemEvents">
                <div class="container">
                  <div class="background text-caption text-right">{{ !option.opt.declarationLOK && shootingPlace==='prod'?'Brak Podpisanej Deklaracji LOK':'' }}</div>
                  <q-item-section dense style="padding: 0.5em; margin: 0;"
                    :class="option.opt.active ? '' : 'bg-warning rounded'"
                    @click="otherName = Object({secondName:'0', firstName: '0',id: '0'})">
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
            input-class="text-white" label-color="white" popup-content-class="bg-dark text-positive"
            :option-label="opt => opt.secondName !== '0' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.id).toString() : ''"
            emit-value map-options
            :class="otherName.secondName!=='0'?'bg-primary':'bg-secondary'"
            :options="options1" @input="memberName = Object({secondName:'0', firstName: '0',legitimationNumber: '0'})" @filter="filterOther" label="Dodaj osobę spoza klubu">
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
          <q-item dense v-for="(item, uuid) in calibers" :key="uuid" :val="item.uuid" style="">
            <div class="text-positive text-center col" style="display: flex;justify-content: center;align-content: center;flex-direction: column;">{{ item.name }}</div>
            <q-input v-model="item.counter" class="col" color="positive" label-color="positive" @focus="item.counter.startsWith('0')?item.counter='':item.counter=item.counter"
          input-class="text-positive" dense filled :label="'max: ' + item.quantity" @input="item.counter===''?item.counter='0':item.counter=item.counter;onInput(item,item.counter)" @keypress.enter="dis = true,simulateProgress(0,memberName.legitimationNumber,otherName.id)"
          onkeypress="return (event.charCode > 44 && event.charCode < 58)" type="number" :max="item.quantity"></q-input>
          <div class="col text-center" style="display: flex;justify-content: center;align-content: center;flex-direction: column;"> * {{ viewCurrency(item.unitPrice) }} = {{ viewCurrency(item.counter * item.unitPrice) }} </div>
          <div class="col text-center" style="display: flex;justify-content: center;align-content: center;flex-direction: column;"> * {{ viewCurrency(item.unitPriceForNotMember) }} = {{ viewCurrency(item.counter * item.unitPriceForNotMember) }}</div>
          </q-item>
        <q-item dense>
          <div class="col"></div>
          <q-input class="col-3" v-model="discount" type="number" min="-23" max="100" dense filled label="rabat w %" @focus="String(discount).startsWith('0')?discount='':discount=discount" onkeypress="return (event.charCode > 47 && event.charCode < 58)" label-color="positive" input-class="text-positive" suffix="%"></q-input>
          <div class="col-3 text-center"><div>dla klubowicza: <div class="text-bold" style="border: solid 3px black">{{ viewCurrency(sum(memberCostSum)) }}</div></div><div>po rabacie: <div class="text-bold text-primary" style="border: solid 3px black">{{ viewCurrency(sum(memberCostSum) - (sum(memberCostSum)/100)*discount) }}</div></div></div>
          <div class="col-3 text-center"><div>pozostali: <div class="text-bold" style="border: solid 3px black">{{ viewCurrency(sum(notMemberCostSum)) }}</div></div><div>po rabacie: <div class="text-bold text-primary" style="border: solid 3px black">{{ viewCurrency(sum(notMemberCostSum) - (sum(notMemberCostSum)/100)*discount) }}</div></div></div>
        </q-item>
        <div class="col">
          <q-card-actions class="row" align="right">
            <q-item>
              <q-btn class="full-width col" color="primary" icon="close" @click="memberName = ''; otherName = ''"
                v-close-popup></q-btn>
            </q-item>
            <q-item>
              <q-btn class="full-width col" color="primary" :loading="loading[0]" icon="done"
                :disable="dis || memberName === '' || otherName === ''"
                @click="dis = true; simulateProgress(0, memberName.legitimationNumber, otherName.id)"
                ></q-btn>
            </q-item>
          </q-card-actions>
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
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  components: {
    AddNewOtherPerson: lazyLoadComponent({
      componentFactory: () => import('src/components/otherPerson/AddNewOtherPerson.vue'),
      loading: SkeletonBox
    })
  },
  created () {
    this.getListCalibers()
    this.getMembersNames()
    this.getOther()
  },
  setup () {
    const loading = ref([
      false
    ])
    const progress = ref(false)

    function simulateProgress (number, memberNumberLegitimation, otherID) {
      loading.value[number] = true
      this.addMemberAndAmmoToCaliber(this.mapCalibers(this.calibers), memberNumberLegitimation, otherID)
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
  data () {
    return {
      dis: false,
      memberName: {
        firstName: '0',
        secondName: '0',
        legitimationNumber: 0
      },
      otherName: {
        firstName: '0',
        secondName: '0',
        id: 0
      },
      open1: open,
      calibers: [],
      options: [],
      options1: [],
      filters: [],
      filtersOther: [],
      counter: '',
      discount: 0,
      memberCostSum: [],
      notMemberCostSum: [],
      map: null,
      message: null,
      success: false,
      failure: false,
      shootingPlace: App.shootingPlace,
      local: App.host
    }
  },
  methods: {
    sum (arr) {
      const sum = arr.reduce(function (a, b) {
        return a + b
      }, 0)
      return sum
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
      fetch(`${this.local}/other/all`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filtersOther = response
        })
    },
    getListCalibers () {
      fetch(`${this.local}/armory/calibers`, {
        method: 'GET'
      }).then((response) => {
        response.json().then((response) => {
          let temp = []
          this.calibers = []
          if (response.length > 0) {
            temp = response.slice(0, response.length)
            for (let i = 0; i < temp.length; i++) {
              this.calibers.push({ uuid: temp[i].uuid, counter: '0', unitPrice: temp[i].unitPrice, unitPriceForNotMember: temp[i].unitPriceForNotMember, name: temp[i].name, quantity: temp[i].quantity })
            }
          }
        })
      })
    },
    onInput (item, counter) {
      const fe = this.calibers.find(function e (element) {
        return element.uuid === item.uuid
      })
      fe.counter = counter
      const fi = this.calibers.findIndex(function e (element) {
        return element.uuid === item.uuid
      })
      if (fe.counter >= 0) {
        this.memberCostSum[fi] = fe.unitPrice * fe.counter
        this.notMemberCostSum[fi] = fe.unitPriceForNotMember * fe.counter
      }
      this.calibers[fi] = fe
      this.counter = ''
    },
    viewCurrency (money) {
      if (money === undefined) { money = '0' }
      const formatterPL = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })
      const cash = formatterPL.format(money)
      return cash
    },
    mapCalibers (calibersObject) {
      const map = new Map()
      for (let i = 0; i < calibersObject.length; i++) {
        if (calibersObject[i].counter !== '0' && calibersObject[i].counter !== '') {
          map.set(calibersObject[i].uuid, Number(calibersObject[i].counter))
        }
      }
      return map
    },
    addMemberAndAmmoToCaliber (map, memberNumberLegitimation, otherID) {
      fetch(`${this.local}/ammoEvidence/listOfAmmo?legitimationNumber=${memberNumberLegitimation}&otherID=${otherID}`, {
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
            this.getListCalibers()
            this.memberCostSum = []
            this.notMemberCostSum = []
            this.$emit('addMemberAndAmmoToCaliber')
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
          this.options1 = this.filtersOther.filter(v => v.fullName.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options1 = this.filtersOther.filter(v => v.fullName.toLowerCase().indexOf(needle) > -1)
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
