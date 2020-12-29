<template>
  <q-page padding class="row">
    <q-card class="col-10">
      <div class="text-h5 text-bold" v-if="ammoList.length < 1">
        <q-item>
          <q-item-section>
            Brak aktywnej listy amunicji
          </q-item-section>
        </q-item>
      </div>
    <div v-if="ammoList.length >= 1" class="col">
      <q-item class="col">
        <q-item-section class="text-h5 text-bold">
          Lista Amunicji {{ammoList[0].date}} numer {{ammoList[0].number}}
        </q-item-section>
      <q-item-section side top>
      <q-btn color="primary" label="Zamknij listę" @click="uuid=ammoList[0].uuid,showloading(),closeEvidence (),getAmmoData(),getCLosedEvidence()"/>
      </q-item-section>
      <q-item-section side top>
      <q-btn color="primary" label="Pobierz listę" @click=" date = ammoList[0].date,uuid=ammoList[0].uuid,showloading(),getAmmoListPDF(),getAmmoData(),getCLosedEvidence()"/>
      </q-item-section>
      </q-item>
      <div v-for="(ammoList, uuid) in ammoList" :key="uuid">
            <div v-for="(ammoInEvidenceEntityList,uuid) in ammoList.ammoInEvidenceEntityList" :key="uuid">
              <q-item>
                <q-item-label class="text-h6">
                  kaliber{{ammoInEvidenceEntityList.caliberName}}
                </q-item-label>
              </q-item>
                <div class="col">
                  <div class="row" v-for="(ammoUsedToEvidenceEntityList,uuid) in ammoInEvidenceEntityList.ammoUsedToEvidenceEntityList" :key="uuid">
                    <q-field color="black" class="col-10" standout label="osoba" stack-label>
                      <template v-sloc:control>
                        <div class="row">{{ammoUsedToEvidenceEntityList.memberEntity.secondName}} {{ammoUsedToEvidenceEntityList.memberEntity.firstName}}</div>
                      </template>
                    </q-field>
                    <q-field class="col-2" standout label="ilość" stack-label>
                      <template v-slot:control>
                        <div class="row">{{ammoUsedToEvidenceEntityList.counter}}</div>
                      </template>
                    </q-field>
                  </div>
                  <div class="row reverse">
                    <q-field class="col-2 bg-grey-4" standout label="suma" stack-label>
                      <template v-slot:control>
                        <div>{{ammoInEvidenceEntityList.quantity}}</div>
                      </template>
                    </q-field>
                  </div>
                </div>
            </div>
      </div>
    </div>
    </q-card>
    <q-card class="col-2">
      <div>
        <q-item>
          <q-item-label class="text-h5 text-bold">
            Zamknięte listy
          </q-item-label>
        </q-item>
        <div v-for="(ammoListClose,id) in ammoListClose" :key="id">
          <q-item>
            <q-btn :label="ammoListClose.date" @click="date = ammoListClose.date,uuid= ammoListClose.evidenceUUID,getAmmoListPDF()"></q-btn>
          </q-item>
        </div>
      </div>
    </q-card>
<q-dialog v-model="ammunitionListAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano listę {{date}}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="fail">
      <q-card>
        <q-card-section>
          <div class="text-h6">Wystąpił jakiś problem</div>
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
      ammoList: [],
      ammoListClose: [],
      date: '',
      fail: false
    }
  },
  created () {
    this.getAmmoData()
    this.getCLosedEvidence()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    getAmmoData () {
      fetch('http://localhost:8080/ammoEvidence/evidence?state=true', {
        method: 'GET'
      }).then(response => {
        response.json().then(ammoList => {
          this.ammoList = ammoList
        })
      })
    },
    getCLosedEvidence () {
      fetch('http://localhost:8080/ammoEvidence/closedEvidences', {
        method: 'GET'
      }).then(response => {
        response.json().then(ammoListClose => {
          this.ammoListClose = ammoListClose
        })
      })
    },
    closeEvidence () {
      fetch('http://localhost:8080/ammoEvidence/ammo?evidenceUUID=' + this.uuid, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          this.getAmmoData()
          this.getCLosedEvidence()
        } else { this.fail = true }
      })
    },
    getAmmoListPDF () {
      axios({
        url: 'http://localhost:8080/files/downloadAmmunitionList/' + this.uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        this.ammunitionListAlert = true
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_Rozliczenia_Amunicji_' + this.date + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    }
  }
}
</script>
