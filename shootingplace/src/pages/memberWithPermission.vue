<template>
  <q-page padding>
      <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">Lista Osób z Uprawnieniami</div>
        </q-item>
      </div>
    <div>
      <q-card class="row">
      <q-checkbox v-model="shootingLeader" :val="true" label="Prowadzący Strzelanie"></q-checkbox>
      <q-checkbox v-model="arbiter" :val="true" label="Sędziowie" @input="otherArbiter=false"></q-checkbox>
      <q-checkbox v-if="arbiter" v-model="otherArbiter" :val="true" label="Sędziowie spoza klubu"></q-checkbox>
      <q-checkbox v-model="instructor" :val="true" label="Instruktorzy"></q-checkbox>
      <q-item-section class="col">
      </q-item-section>
      <q-item-section side top>
      </q-item-section>
      </q-card>
    </div>
  <div>
      <q-card v-if="shootingLeader && !arbiter && !instructor" class="text-h5 q-pa-md text-center">Prowadzący Strzelanie</q-card>
      <q-card v-if="shootingLeader && !arbiter && instructor" class="text-h5 q-pa-md text-center">Prowadzący Strzelanie + Instruktorzy</q-card>
      <q-card v-if="shootingLeader && arbiter && !instructor" class="text-h5 q-pa-md text-center">Prowadzący Strzelanie + Sędziowie</q-card>
      <q-card v-if="shootingLeader && arbiter && instructor" class="text-h5 q-pa-md text-center">Prowadzący Strzelanie + Sędziowie + Instruktorzy</q-card>
      <q-card v-if="arbiter && !shootingLeader && !instructor" class="text-h5 q-pa-md text-center">Sędziowie</q-card>
      <q-card v-if="arbiter && !shootingLeader && instructor" class="text-h5 q-pa-md text-center">Sędziowie + Instruktorzy</q-card>
      <q-card v-if="instructor && !arbiter && !shootingLeader" class="text-h5 q-pa-md text-center">Instruktorzy</q-card>
      <div v-for="members in members" :key="members.uuid">
        <q-card v-if="(shootingLeader&&members.memberPermissions.shootingLeaderNumber!=null)
          ||(arbiter&&members.memberPermissions.arbiterNumber)||(instructor&&members.memberPermissions.instructorNumber)" class="row">
          <q-card-section class="col-3">
            <div class="q-pa-none">
              <q-field v-if="shootingLeader&&members.memberPermissions.shootingLeaderNumber!=null
          ||(arbiter&&members.memberPermissions.arbiterNumber)||(instructor&&members.memberPermissions.instructorNumber)" label="Nazwisko i imię" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{members.secondName}} {{members.firstName}}</div>
              </q-field>
            </div>
          </q-card-section>
          <div class="col">
          <q-card-section class="col">
              <q-field class="col" label="email" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{members.email}}</div>
              </q-field>
              <q-field class="col" label="telefon" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{members.phoneNumber}}</div>
              </q-field>
          </q-card-section>
          <q-card-section>
          </q-card-section>
          </div>
          <q-card-section v-if="(shootingLeader&&members.memberPermissions.shootingLeaderNumber!=null)
          ||(arbiter&&members.memberPermissions.arbiterNumber!=null)||(instructor&&members.memberPermissions.instructorNumber!=null)" class="col-5">
            <q-item-section>
              <q-field v-if="shootingLeader&&members.memberPermissions.shootingLeaderNumber!=null" class="col" label="Numer Uprawnień Prowadzącego" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{members.memberPermissions.shootingLeaderNumber}}</div>
              </q-field>
              <q-field v-if="instructor&&members.memberPermissions.instructorNumber!=null" class="col" label="Numer Uprawnień Instruktorskich" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{members.memberPermissions.instructorNumber}}</div>
              </q-field>
              <q-field v-if="arbiter&&members.memberPermissions.arbiterNumber!=null" class="col" label="Numer Uprawnień Sędziowskich" standout="bg-accent text-black" color="black" stack-label>
                      <div class="self-center col full-width no-outline text-left text-black">{{members.memberPermissions.arbiterNumber}}</div>
              </q-field>
              <q-field v-if="arbiter&&members.memberPermissions.arbiterNumber!=null" class="col" label="Klasa i Ważność Uprawnień Sędziowskich" standout="bg-accent text-black" color="black" stack-label>
                      <div class="self-center col full-width no-outline text-left text-black">{{members.memberPermissions.arbiterClass}}</div>
                      <div class="self-center col full-width no-outline text-left text-black">{{members.memberPermissions.arbiterPermissionValidThru}}</div>
              </q-field>
            </q-item-section>
          </q-card-section>
          </q-card>
          </div>
          <q-card v-if="otherArbiter" class="text-h5 q-pa-md text-center">Sędziowie spoza klubu</q-card>
          <q-card v-for="others in others" :key="others.id">
            <div v-if="otherArbiter&&others.permissionsEntity!=null" class="row">
            <q-card-section class="col">
            <q-item-section>
              <q-field class="col" label="Nazwisko i imię" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{others.secondName}} {{others.firstName}}</div>
              </q-field>
            </q-item-section>
          </q-card-section>
          <div class="col-2">
          <q-card-section >
            <q-item-section>
              <q-field class="col" label="email" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{others.email}}</div>
              </q-field>
            </q-item-section>
          </q-card-section>
          <q-card-section>
            <q-item-section>
              <q-field class="col" label="Numer telefonu" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{others.phoneNumber}}</div>
              </q-field>
            </q-item-section>
          </q-card-section>
          </div>
          <q-card-section class="col-5">
              <q-field class="col" label="Uprawnienia sędziowskie" borderless color="black" stack-label>
                <q-field class="col" borderless color="black" label="Numer">
                    <div class="self-center full-width no-outline text-left text-black" tabindex="0">{{others.permissionsEntity.arbiterNumber}}</div>
                </q-field>
                <q-field class="col" label="Klasa" color="black" standout="bg-accent text-black" stack-label>
                    <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{others.permissionsEntity.arbiterClass}}</div>
                </q-field>
                <q-field class="col" label="Ważne do" color="black" standout="bg-accent text-black" stack-label>
                    <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{others.permissionsEntity.arbiterPermissionValidThru}}</div>
                </q-field>
              </q-field>
              </q-card-section>
              </div>
          </q-card>
  </div>
  </q-page>
</template>

<script>

import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
import Vue from 'vue'
import axios from 'axios'
import App from 'src/App.vue'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
      shootingLeader: true,
      arbiter: false,
      otherArbiter: false,
      instructor: false,
      members: [],
      others: [],
      local: App.host
    }
  },
  created () {
    this.getListMembers()
    this.getListOthers()
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
      fetch('http://' + this.local + '/member/membersWithPermissions', {
        method: 'GET'
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
    },
    getListOthers () {
      fetch('http://' + this.local + '/other/all', {
        method: 'GET'
      }).then(response => response.json())
        .then(others => {
          this.others = others
        })
    }
  },
  name: 'memberswithpermission'
}
</script>
