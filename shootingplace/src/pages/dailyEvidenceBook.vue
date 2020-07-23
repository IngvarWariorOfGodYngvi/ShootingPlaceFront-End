<template>
  <q-page padding class="q-pa-md">
    <div>
      <q-item><q-input v-model="evidenceDate" label="Ustaw datę dla Listy" placeholder="YYYY-MM-DD"></q-input></q-item>
      <q-item><q-btn label="Zmień Datę" color="green" @click="showloading(),setEvidenceDate(evidenceDate),reload()"/></q-item>
    </div>
      <div class="full-width row no-wrap justify-between">
        <q-card class="full-width">
          <q-card-section>
            <q-item><q-item-label>Nazwisko i Imię</q-item-label></q-item>
          </q-card-section>
        </q-card>
        <q-card class="flex flex-center full-width">
          <q-card-section>
            <q-item><q-item-label>Numer pozwolenia albo licencji Klubowej</q-item-label></q-item>
          </q-card-section>
        </q-card>
        <q-card class="full-width flex flex-center">
          <q-card-section>
            <q-item><q-item-label>Data</q-item-label></q-item>
          </q-card-section>
        </q-card>
      </div>
      <div v-for="members in members" :key="members.uuid" class="full-width row no-wrap justify-between">
        <q-card class="full-width">
          <q-card-section>
            <q-item><q-item-label>{{members.secondName}} {{members.firstName}}</q-item-label></q-item>
          </q-card-section>
        </q-card>
        <q-card class="flex flex-center full-width">
          <q-card-section>
            <q-item v-if="members.weaponPermission.isExist"><q-item-label>{{members.weaponPermission.number}}</q-item-label></q-item>
            <q-item v-if="!members.weaponPermission.isExist"><q-item-label>1233/2020</q-item-label></q-item>
          </q-card-section>
        </q-card>
        <q-card class="full-width flex flex-center">
          <q-card-section>
            <q-item><q-item-label>{{evidence.date}}</q-item-label></q-item>
          </q-card-section>
        </q-card>
      </div>
      <div>
        <q-item><q-btn label="Wyczyść Listę" color="red" @click="showloading(),clearEvidence()"/></q-item>
        <q-item><q-btn label="Drukuj" color="primary" @click="showloading()"/></q-item>
      </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      members: [],
      evidence: [],
      evidenceDate: ''
    }
  },
  created () {
    this.getMembersInEvidence()
    this.getEvidence()
  },
  methods: {
    getMembersInEvidence () {
      fetch('http://localhost:8080/evidence/members', {
        method: 'GET'
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
    },
    reload () {
      window.location.reload()
    },
    getEvidence () {
      fetch('http://localhost:8080/evidence/evidence', {
        method: 'GET'
      }).then(response => response.json())
        .then(evidence => {
          this.evidence = evidence
        })
    },
    setEvidenceDate (evidenceDate) {
      fetch('http://localhost:8080/evidence/setdate' + '?date=' + evidenceDate, {
        method: 'PUT'
      }).then(response => response.json())
        .then(evidence => {
          this.evidence = evidence
        })
    },
    clearEvidence () {
      if (confirm('Na pewno wyczyścić listę?')) {
        fetch('http://localhost:8080/evidence/clear', {
          method: 'PATCH'
        }).then(response => response.json())
          .then(evidence => {
            this.evidence = evidence
            this.reload()
          })
      }
    },
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    }
  },
  name: 'EvidenceBook'
}
</script>
