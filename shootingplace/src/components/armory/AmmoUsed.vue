<template>
  <div>
    <div class="text-body2 bg-dark text-positive" style="border: 0">
      <div :class="mobile?'col':'row'">
        <q-card-section class="col-4 bg-dark">
          <q-item class="col text-positive">
            <q-input dense class="full-width" label-color="positive" input-class="text-positive" color="positive"
              mask="####-##-##" filled v-model="firstDate" label="Data początkowa">
              <template v-slot:append>
                <q-icon name="event" color="positive" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date no-unset @input=" getSum()" v-model="firstDate" mask="YYYY-MM-DD"
                      class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
          <q-item class="col">
            <q-input dense class="full-width" label-color="positive" input-class="text-positive" color="positive"
              mask="####-##-##" filled v-model="secondDate" label="Data końcowa">
              <template v-slot:append>
                <q-icon name="event" color="positive" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date @input=" getSum()" v-model="secondDate" no-unset mask="YYYY-MM-DD"
                      class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
          <div @click=" getSum()" class="q-pa-md" align="right">
            <q-btn color="primary">Wyszukaj</q-btn>
          </div>
        </q-card-section>
        <q-card-section class="col-8 bg-dark text-positive">
          <div class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6"
            v-if="quantitySum.length < 1">Brak wyników - Wybierz daty</div>
          <div class="q-pa-md self-center col full-width no-outline text-bold text-center">
            <div v-if="quantitySum.length > 0" color="positive"
              class="row text-bold text-left">
              <div class="self-center col">kaliber</div>
              <div class="self-center col">ilość zużytej amunicji</div>
            </div>
            <p v-if="quantitySum.length > 0"></p>
            <div v-for="(      ammo, id      ) in       quantitySum      " :key="id">
              <div class="row text-bold text-left hover1">
                <div class="self-center col">{{ ammo.name }}</div>
                <div class="self-center col">{{ ammo.quantity }}</div>
            </div>
            </div>
          </div>
        </q-card-section>
      </div>
    </div>
  </div>

  </template>
  <style src="src/style/style.scss" lang="scss">
  </style>
<script>
import App from 'src/App'

export default {
  name: 'contributions.vue',
  data () {
    return {
      firstDate: null,
      secondDate: this.createTodayDate(),
      quantitySum: [],
      mobile: App.mobile,
      local: App.host
    }
  },
  methods: {
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
      const today = date.getFullYear() + '/' + month + '/' + day
      return today
    },
    getSum () {
      fetch(`${this.local}/armory/quantitySum?firstDate=${this.firstDate.replace(/\//gi, '-')}&secondDate=${this.secondDate.replace(/\//gi, '-')}`, {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantitySum = response
        })
      })
    }
  }
}
</script>
