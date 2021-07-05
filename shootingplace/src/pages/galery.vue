<template>
  <q-page padding>
      <q-card>
        <div class="col" align="right">
          <q-btn color="grey-3" class="text-black" type="a" :href="('http://' + prod + 'armory')" target="_self" >Zamknij pokaz</q-btn>
        </div>
        <div class="row">
        <div v-for="(gunImage,id) in images" :key="id" class="col-4 q-pa-xl flex flex-center">
        <q-img
          :src="('http://' + local + '/files/getFile?uuid=' + gunImage.uuid)"
          style="height: 100%; width: 100%" class="q-pa-md flex flex-center">
          <q-tooltip :delay="500" anchor="center middle" self="center middle" transition-show="scale"
          transition-hide="scale" content-style="height: 800px; width: 800px"><q-img
          contain
          :ratio="1"
          :src="('http://' + local + '/files/getFile?uuid=' + gunImage.uuid)"
          style="height: 100%; width: 100%" class="q-pa-md"/>
          <div v-if="gunImage.gun!=null" class="absolute-top text-center text-black text-bold text-h3 bg-white disabled">
            <p>{{gunImage.gun.modelName}}</p>
            <p>{{gunImage.gun.caliber}}</p>
          </div></q-tooltip>
        </q-img>
      </div>
      </div>
      </q-card>
  </q-page>
</template>
<style>
</style>
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
      url: '',
      images: [],
      local: App.host,
      prod: App.prod
    }
  },
  created () {
    this.getAllImages()
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
    getAllImages () {
      fetch('http://' + this.local + '/files/getAllImages', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.images = response
        })
    }
  },
  name: 'galery'
}
</script>
