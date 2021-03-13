<template>
  <q-page padding>
    <div>
      <q-item>
        <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">USTAWIENIA</div>
      </q-item>
    </div>
    <q-card >
      <q-card-section>
          <div>tutaj będą ustawienia w formie steppera</div>
          <div>muszą się tu znaleźć takie rzeczy jak : </div>
          <div class="q-pa-md">PIERWSZY SUPER-UŻYTKOWNIK</div>
          <div class="q-pa-md">
              <div>nazwa usera</div>
              <div>pinCode usera</div>
              <div>superuser = true</div>
          </div>
          <div class="q-pa-md">PRZYDZIELANIE NOWYCH UŻYTKOWNIKÓW</div>
          <div class="q-pa-md">
              <div>nazwa usera</div>
              <div>pinCode usera</div>
          </div>
          <div class="q-pa-md">KLUB</div>
          <div class="q-pa-md">
              <div>nazwa / adres / numer licencji / strona itd</div>
          </div>
          <div class="q-pa-md">SKŁADKI</div>
          <div class="q-pa-md">
            <div>ustawienie wysokości składki dla dorosłych</div>
            <div>ustawienie wysokości składki dla młodzieży</div>
            <div>ustawienie składek : miesięczna / 2-miesięczna / kwartalna / półroczna / roczna</div>
            <div>do kiedy są ważne</div>
          </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>

import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
      local: 'localhost:8080/shootingplace',
      local1: 'localhost:8080/shootingplace-1.0'
    }
  },
  created () {

  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    }
  },
  name: 'settings'
}
</script>
