<template>
  <div class="bg-dark">
    <q-card class="bg-dark text-positive">
      <q-card-section class="col row items-center text-bold">
            <div class="col text-left">KALIBER</div>
            <div class="col text-center">
              <div>ILOŚĆ NA STANIE<q-icon name="info"><q-tooltip anchor="top middle" content-style="width: 15vw;"
                    content-class="bg-primary text-caption">Ilość na stanie jest wyliczana na podstawie amunicji
                    wprowadzonej na stan i zejścia na podstawie list amunicyjnych</q-tooltip></q-icon></div>
              <div class="items-center text-center q-pa-md">
                <div class="col">Dziś: {{ createTodayDate() }}</div>
                <q-btn @click="refresh = !refresh" color="blue" class="col text-positive full-width"><q-tooltip
                    anchor="top middle" content-class="bg-blue text-caption">odśwież</q-tooltip><q-icon name="sync"
                    class="rotate"></q-icon></q-btn>
              </div>
            </div>
            <div class="col text-center">
              <div>STAN NA DZIEŃ</div>
              <div class="items-center text-center q-pa-md">
                <div class="col">{{ quantityOnDate }}</div>
                <q-btn class="col full-width" icon="event" color="primary">
                  <q-tooltip anchor="top middle" content-class="bg-primary text-caption">wybierz datę</q-tooltip>
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date no-unset v-model="quantityOnDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-btn>
              </div>
            </div>
            <div class="col-3"></div>
          </q-card-section>
            <div class="col-4 text-center"></div>
            <div class="text-positive text-body1 col" v-for="(item, id) in calibers" :key="id">
              <hr />
              <div class="self-center">
                <div @dblclick="caliberUUID = item.uuid; temp = item; caliberInfo = true"
                  class="row items-center text-bold hover1" :class="!item.active?'bg-warning': ''">
                  <div class="col text-bold">
                    <div>{{ item.name }}</div>
                    <div v-if="!item.active">Kaliber wyłączony z użycia</div>
                  </div>
                  <QuantityOnDate :uuid="item.uuid" :date="quantityTodayDate" :refresh="refresh" class="col">
                  </QuantityOnDate>
                  <QuantityOnDate :uuid="item.uuid" :date="quantityOnDate" :refresh="refresh" class="col">
                  </QuantityOnDate>
                  <div class="col row">
                  </div>
                </div>
              </div>
        </div>
      </q-card>
      <q-dialog v-model="caliberInfo" @keypress.enter=" caliberInfo = false">
      <q-card class="bg-dark text-positive" style="min-width: 50vw;">
        <q-card-actions align="right">
          <div class="text-h6 col text-bold text-center">Edytuj Kaliber</div>
          <q-btn color="primary" dense round icon="close" v-close-popup></q-btn>
        </q-card-actions>
        <q-card-section>
          <div>Identyfikator: {{ caliberUUID }}</div>
          <div class="text-bold">Wprowadź cenę dla klubowicza (aktualnie: {{ viewCurrency(temp.unitPrice)
            }})</div>
          <div class="row col">
            <q-input v-model="unitPrice" class="col" dense input-class="text-positive" label="tylko cyfry"
            label-color="positive" onkeypress="return (event.charCode > 44 && event.charCode < 58)"></q-input>
            <q-btn glossy color="primary" dense label="zapisz" @click="acceptCodePrice = true"></q-btn>
          </div>
          <div class="text-bold">Wprowadź cenę dla pozostałych (aktualnie: {{
            viewCurrency(temp.unitPriceForNotMember) }})</div>
            <div class="row col">
              <q-input v-model="unitPriceForNotMember" class="col" dense
              input-class="text-positive" label="tylko cyfry" label-color="positive"
              onkeypress="return (event.charCode > 44 && event.charCode < 58)"></q-input>
              <q-btn glossy color="primary" dense
              label="zapisz" @click="acceptCodePriceForNotMember = true"></q-btn>
            </div>
        </q-card-section>
        <q-card-section>
          <div class="line"></div>
          <div class="text-bold text-center text-h6">Dezaktywuj Kaiber</div>
          <div>Dezaktywacja spowoduje trawałe usunięcie wybranego kalibru z list wyboru<br/>Dezaktywacja nie usunie kalibru z Ewidencji Amunicji </div>
          <div class="row q-pa-md">
            <div class="col items-center text-center text-bold text-h6">Wybrany Kaliber: {{ temp.name }}</div>
            <q-btn glossy @click="acceptDeactivate=true" dense color="primary" :label="temp.active?'dezaktywuj':'aktywuj'"/>
          </div>
          <div class="line"></div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="acceptDeactivate" persistent
      @keypress.enter="activateOrDeactivateCaliber(caliberUUID, code); acceptDeactivate = false, code = null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####" inputmode="numeric"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null" />
          <q-btn label="usuń" color="black" v-close-popup
            @click="activateOrDeactivateCaliber(caliberUUID, code); acceptDeactivate = false, code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="acceptCodePrice" persistent
      @keypress.enter=" changeCaliberUnitPrice(caliberUUID, unitPrice, code); acceptCodePrice = false, code = null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####" inputmode="numeric"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null" />
          <q-btn label="usuń" color="black" v-close-popup
            @click=" changeCaliberUnitPrice(caliberUUID, unitPrice, code); code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="acceptCodePrice" persistent
      @keypress.enter=" changeCaliberUnitPrice(caliberUUID, unitPrice, code); acceptCodePrice = false, code = null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####" inputmode="numeric"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null" />
          <q-btn label="usuń" color="black" v-close-popup
            @click=" changeCaliberUnitPrice(caliberUUID, unitPrice, code); code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="acceptCodePriceForNotMember" persistent
      @keypress.enter=" changeCaliberUnitPriceForNotMember(caliberUUID, unitPriceForNotMember, code); acceptCodePriceForNotMember = false, code = null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####" inputmode="numeric"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null" />
          <q-btn label="usuń" color="black" v-close-popup
            @click=" changeCaliberUnitPriceForNotMember(caliberUUID, unitPriceForNotMember, code); code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    </div>
</template>
<style src="src/style/style.scss" lang="scss"></style>
<script>
import App from 'src/App'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
export default {
  components: {
    QuantityOnDate: lazyLoadComponent({
      componentFactory: () => import('components/armory/QuantityOnDate.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      calibers: [],
      temp: {},
      refresh: true,
      caliberInfo: false,
      acceptDeactivate: false,
      code: null,
      caliberUUID: null,
      unitPrice: null,
      unitPriceForNotMember: null,
      acceptCodePrice: false,
      acceptCodePriceForNotMember: false,
      quantityOnDate: this.createTodayDate(),
      quantityTodayDate: this.createTodayDate(),
      local: App.host,
      prod: App.prod
    }
  },
  created () {
    this.getListCalibers()
  },
  methods: {
    getListCalibers () {
      fetch(`${this.local}/armory/calibersForEvidence`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.calibers = response
        })
    },
    activateOrDeactivateCaliber (caliberUUID, code) {
      fetch(`${this.local}/armory/activateOrDeactivateCaliber?caliberUUID=${caliberUUID}&pinCode=${code}`, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.getListCalibers()
            this.message = response
            this.success = true
            this.autoClose()
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.autoClose()
          })
        }
      })
    },
    viewCurrency (money) {
      if (money === undefined) { money = '0' }
      const formatterPL = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })
      const cash = formatterPL.format(money)
      return cash
    },
    createTodayDate () {
      const date = new Date()
      let month = 0
      let day = 0
      if ((date.getMonth() + 1) < 10) {
        month = '0' + (date.getMonth() + 1)
      } else {
        month = (date.getMonth() + 1)
      }
      if (date.getDate() < 10) {
        day = '0' + (date.getDate())
      } else {
        day = (date.getDate())
      }
      return date.getFullYear() + '-' + month + '-' + day
    },
    changeCaliberUnitPrice (caliberUUID, price, pinCode) {
      fetch(`${this.local}/armory/changeCaliberUnitPrice?caliberUUID=${caliberUUID}&price=${price}&pinCode=${pinCode}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.getListCalibers()
            this.message = response
            this.success = true
            this.autoClose()
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.autoClose()
          })
        }
      })
    },
    changeCaliberUnitPriceForNotMember (caliberUUID, price, pinCode) {
      fetch(`${this.local}/armory/changeCaliberUnitPriceForNotMember?caliberUUID=${caliberUUID}&price=${price}&pinCode=${pinCode}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.getListCalibers()
            this.message = response
            this.success = true
            this.autoClose()
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.autoClose()
          })
        }
      })
    },
    autoClose () {
      setTimeout(() => {
        this.message = null
        this.success = false
        this.failure = false
      }, 2000)
    }
  }
}
</script>
