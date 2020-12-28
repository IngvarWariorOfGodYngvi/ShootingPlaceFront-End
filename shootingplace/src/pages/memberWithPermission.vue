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
      </q-item-section>
      </q-card>
    </div>
  <div>
      <div v-for="members in members" :key="members.uuid">
        <q-card v-if="(shootingLeader&&members.memberPermissions.shootingLeaderNumber!=null)
          ||(arbiter&&members.memberPermissions.arbiterNumber)||(instructor&&members.memberPermissions.instructorNumber)" class="row">
          <q-card-section class="col-4">
            <q-item-section>
              <q-field v-if="shootingLeader&&members.memberPermissions.shootingLeaderNumber!=null" class="col" label="Nazwisko i imię" standout stack-label>
                <template v-slot:control>
                  <div class="self-center col full-width no-outline" tabindex="0">{{members.secondName}} {{members.firstName}}</div>
                </template>
              </q-field>
            </q-item-section>
          </q-card-section>
          <q-card-section v-if="(shootingLeader&&members.memberPermissions.shootingLeaderNumber!=null)
          ||(arbiter&&members.memberPermissions.arbiterNumber!=null)||(instructor&&members.memberPermissions.instructorNumber!=null)" class="col-6">
            <q-item-section>
              <q-field v-if="shootingLeader&&members.memberPermissions.shootingLeaderNumber!=null" class="col" label="Numer Uprawnień Prowadzącego" standout stack-label>
                <template v-slot:control>
                  <div class="self-center col full-width no-outline" tabindex="0">{{members.memberPermissions.shootingLeaderNumber}}</div>
                </template>
              </q-field>
              <q-field v-if="instructor&&members.memberPermissions.instructorNumber!=null" class="col" label="Numer Uprawnień Instruktorskich" standout stack-label>
                <template v-slot:control>
                  <div class="self-center col full-width no-outline" tabindex="0">{{members.memberPermissions.instructorNumber}}</div>
                </template>
              </q-field>
              <q-field v-if="arbiter&&members.memberPermissions.arbiterNumber!=null" class="col" label="Uprawnienia sędziowskie" standout stack-label>
                <template v-slot:control>
                  <q-field class="col" label="Numer" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center col full-width no-outline" tabindex="0">{{members.memberPermissions.arbiterNumber}}</div>
                    </template>
                  </q-field>
                  <q-field class="col" label="Klasa" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center col full-width no-outline" tabindex="0">{{members.memberPermissions.arbiterClass}}</div>
                    </template>
                  </q-field>
                  <q-field class="col" label="Ważne do" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center col full-width no-outline" tabindex="0">{{members.memberPermissions.arbiterPermissionValidThru}}</div>
                    </template>
                  </q-field>
                </template>
              </q-field>
            </q-item-section>
          </q-card-section>
          <q-card-section v-if="(shootingLeader&&members.memberPermissions.shootingLeaderNumber!=null)
          ||(arbiter&&members.memberPermissions.arbiterNumber)||(instructor&&members.memberPermissions.instructorNumber)" class="col-2">
            <q-item-section>
                <q-item><q-btn label="Pobierz kartę Członkowską" @click="uuid=members.uuid,name=members.firstName,name2=members.secondName,personalCardDownloadConfirm=true"/></q-item>
            </q-item-section>
          </q-card-section>
          </q-card>
      </div>
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
