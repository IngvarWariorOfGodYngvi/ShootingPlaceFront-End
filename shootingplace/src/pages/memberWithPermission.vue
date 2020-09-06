<template>
  <q-page padding>
    <div>
      <q-card class="row">
      <q-checkbox v-model="shootingLeader" :val="true" label="Prowadzący Strzelanie"></q-checkbox>
      <q-checkbox v-model="arbiter" :val="true" label="Sędziowie"></q-checkbox>
      <q-checkbox v-model="instructor" :val="true" label="Instruktorzy"></q-checkbox>
      <q-item-section class="col">
      </q-item-section>
      <q-item-section side top>
      <q-item><q-btn color="primary" label="Wybierz" @click="showloading(),getListMembers()"/></q-item>
      </q-item-section>
      </q-card>
    </div>
  <div class="q-pa-md">
    <q-list>
      <q-item v-for="members in members" :key="members.uuid" group="somegroup" :id="members.secondName">
        <q-card v-if="(shootingLeader&&members.memberPermissions.shootingLeaderNumber!=null)
          ||(arbiter&&members.memberPermissions.arbiterNumber)||(instructor&&members.memberPermissions.instructorNumber)" class="col">
          <q-card-section>
            <q-item-section>
                <q-item>{{members.secondName}} {{members.firstName}}</q-item>
            </q-item-section>
          </q-card-section>
          </q-card>
        <q-card v-if="(shootingLeader&&members.memberPermissions.shootingLeaderNumber!=null)
          ||(arbiter&&members.memberPermissions.arbiterNumber!=null)||(instructor&&members.memberPermissions.instructorNumber!=null)" class="col">
          <q-card-section>
            <q-item-section>
                <q-item v-if="shootingLeader&&members.memberPermissions.shootingLeaderNumber!=null">Numer Uprawnień Prowadzącego : {{members.memberPermissions.shootingLeaderNumber}}</q-item>
                <q-item v-if="arbiter&&members.memberPermissions.arbiterNumber!=null">Numer Licejcji Sędziowskiej {{members.memberPermissions.arbiterNumber}}</q-item>
                <q-item v-if="arbiter&&members.memberPermissions.arbiterNumber!=null">{{members.memberPermissions.arbiterClass}}</q-item>
                <q-item v-if="arbiter&&members.memberPermissions.arbiterNumber!=null">{{members.memberPermissions.arbiterPermissionValidThru}}</q-item>
                <q-item v-if="instructor&&members.memberPermissions.instructorNumber!=null">Numer Uprawnień Instruktorskich {{members.memberPermissions.instructorNumber}}</q-item>
            </q-item-section>
          </q-card-section>
          </q-card>
        <q-card v-if="(shootingLeader&&members.memberPermissions.shootingLeaderNumber!=null)
          ||(arbiter&&members.memberPermissions.arbiterNumber)||(instructor&&members.memberPermissions.instructorNumber)">
          <q-card-section>
            <q-item-section>
                <q-item><q-btn label="Pobierz kartę Członkowską" color="secondary" @click="uuid=members.uuid,name=members.firstName,name2=members.secondName,personalCardDownloadConfirm=true"/></q-item>
            </q-item-section>
          </q-card-section>
          </q-card>
      </q-item>
    </q-list>
  </div>
<q-dialog v-model="personalCardDownloadConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy napewno chcesz pobrać kartę Klubowicza?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Pobierz" color="primary" v-close-popup @click="getPersonalCardPDF(),personalCardDownloadAlert=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="personalCardDownloadAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano kartę Klubowicza</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
  </q-page>
</template>

<script>

import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
      shootingLeader: true,
      arbiter: false,
      instructor: false,
      personalCardDownloadConfirm: false,
      personalCardDownloadAlert: false,
      addressConfirm: false,
      HistoryContributionRecord: null,
      contributionRecordConfirm: false,
      contributionRecordAlert: false,
      members: [],
      uuid: null,
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: 0.2
      }
    }
  },
  created () {
    this.getListMembers()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    handleScroll (search) {
      const ele = document.getElementById(search)
      const target = getScrollTarget(ele)
      const offset = ele.offsetTop - ele.scrollHeight
      const duration = 500
      setScrollPosition(target, offset, duration)
    },
    getListMembers () {
      fetch('http://localhost:8080/member/memberswithpermissions', {
        method: 'GET'
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
    },
    getPersonalCardPDF () {
      axios({
        url: 'http://localhost:8080/files/downloadPersonalCard/' + this.uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Karta_Członkowska_' + this.name + '_' + this.name2 + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    }
  },
  name: 'memberswithpermission'
}
</script>
