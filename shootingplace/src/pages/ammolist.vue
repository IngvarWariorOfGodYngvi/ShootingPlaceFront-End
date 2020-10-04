<template>
  <q-page padding>
    <div>
    <q-item-section>
      <h6>Data listy {{ammoList.date}}</h6>
      <q-item><q-input filled v-model="listDate" mask="date" label="Wybierz datę" hint="użyj kalendarza">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="listDate">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Zamknij" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input></q-item>
      <q-item><q-btn label="zmień datę" color="primary"></q-btn></q-item>
    </q-item-section>
    <div v-for="caliberList in ammoList.caliberList" :key="caliberList.uuid" class="row">
    <q-card v-if="caliberList.ammoUsed!=null"  class="col">
      <q-card-section>
        <q-item-section>
          <q-item><h6>Kaliber {{caliberList.name}}</h6></q-item>
          <q-item-section>
            <q-item v-for="members in caliberList.members" :key="members.uuid">{{members.secondName}} {{members.firstName}} leg. {{members.legitimationNumber}}</q-item>
          </q-item-section>
        </q-item-section>
      </q-card-section>
    </q-card>
    <q-card v-if="caliberList.ammoUsed!=null">
      <q-card-section>
        <q-item-section>
          <q-item><h6>Ilość</h6></q-item>
          <q-item v-for="ammoUsed in caliberList.ammoUsed" :key="ammoUsed">{{ammoUsed}} szt.</q-item>
        </q-item-section>
      </q-card-section>
      <q-item>suma : {{caliberList.quantity}} szt.</q-item>
    </q-card>
    <!-- <q-item v-for="caliberList in ammoList.caliberList" :key="caliberList.uuid" class="row"></q-item> -->
    </div>
    <div>
      <q-item>
        <q-btn label="wydrukuj" color="primary" @click="uuid=ammoList.uuid,ammunitionListConfirm=true"></q-btn>
      </q-item>
    </div>
    </div>
<q-dialog v-model="ammunitionListConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy pobrać kartę rozliczenia aunicji? .replace(/\//gi, '-')</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Pobierz" color="primary" v-close-popup @click="getAmmoListPDF(),ammunitionListAlert=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="ammunitionListAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano listę</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
  </q-page>
</template>

<script>

import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
      uuid: null,
      ammunitionListAlert: false,
      listDate: null,
      ammunitionListConfirm: false,
      ammoList: [],
      inc: 0
    }
  },
  created () {
    this.getAmmoData()
  },
  methods: {
    getAmmoData () {
      fetch('http://localhost:8080/ammoEvidence/', {
        method: 'GET'
      }).then(response => response.json())
        .then(ammoList => {
          this.ammoList = ammoList
        })
    },
    increment () {
      this.inc++
    },
    getAmmoListPDF () {
      axios({
        url: 'http://localhost:8080/files//downloadAmmunitionList/' + this.uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_Rozliczenia_Amunicji.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    }
  },
  name: 'EvidenceBook'
}
</script>
