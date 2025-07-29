<template>
  <div>
    <q-btn glossy v-if="GunListExp" :class="mobile ? 'col-6' : 'col-3'" label="Dodaj broń do listy" color="primary"
      @click="addGun = true">
    </q-btn>
    <q-dialog v-model="addGun" @hide="temp = null; gun = null"
      @show="getGunList(); gunDate = createTodayDate(); gunTime = createTodayTime()"
      @keypress.enter="simulateProgressGun(gun, gunDate, gunTime)">
      <q-card class="bg-dark text-positive" style="min-width: 50vw">
          <q-card-actions class="row" align="right">
            <div class="self-center col text-center text-h6 text-bold">Dodaj broń do listy</div>
            <q-btn color="primary" dense round icon="close" v-close-popup/>
          </q-card-actions>
        <q-card-section class="col">
          <q-select label="Wybierz broń" popup-content-class="bg-primary text-positive"
            :option-label="opt => opt !== '' ? (Object(opt.modelName + ' ' + opt.serialNumber).toString()) : ''"
            emit-value map-options options-dense bg-color="primary" rounded standout="" input-class="text-white" label-color="white"
            dark v-model="gun" fill-input dense use-input hide-selected input-debounce="0" :options="options"
            @input="temp = gun" @filter="filterFn" class="bg-dark text-positive col">
          </q-select>
        </q-card-section>
        <q-card-section class="row col q-pl-md q-pr-md text-bold" v-if="temp != null">
          <div class="col">Rodzaj</div>
          <div class="col">Nazwa Modelu</div>
          <div class="col">Kaliber</div>
          <div class="col">Numer Seryjny</div>
        </q-card-section>
        <q-card-section class="row col q-pa-md" v-if="temp != null">
          <div class="col">{{ temp.gunType }}</div>
          <div class="col">{{ temp.modelName }}</div>
          <div class="col">{{ temp.caliber }}</div>
          <div class="col">{{ temp.serialNumber }}</div>
        </q-card-section>
          <q-card-actions class="row" align="right">
            <q-btn glossy color="secondary" label="anuluj" v-close-popup @click="temp = null"></q-btn>
            <q-btn glossy color="primary" :loading="loading[0]" label="wydaj broń" :disable="dis"
              @click="dis = true; simulateProgressGun(gun, gunDate, gunTime);"></q-btn>
          </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<style src="src\style\style.scss" lang="scss"></style>
<script>
import App from 'src/App.vue'
import { ref } from 'vue'

export default {
  setup () {
    const loading = ref([
      false
    ])
    function simulateProgressGun (gun, date, time) {
      loading.value[0] = true
      const gunUUIDList = []
      gunUUIDList.push(gun.uuid)
      this.addGunToList(gunUUIDList, date, time)
      setTimeout(() => {
        loading.value[0] = false
      }, 0)
    }

    return {
      loading,
      simulateProgressGun
    }
  },
  data () {
    return {
      addGun: false,
      temp: null,
      GunListExp: JSON.parse(window.localStorage.getItem('GunList')),
      gunList: [],
      options: [],
      gunDate: this.createTodayDate(),
      gunTime: this.createTodayTime(),
      gun: null,
      dis: false,
      mobile: App.mobile,
      message: null,
      success: false,
      failure: false,
      main: App.main,
      local: App.host
    }
  },
  methods: {
    log (item) {
      console.log(item)
    },
    getGunList () {
      fetch(`${this.local}/armory/getGunList`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.gunList = response
        })
    },
    addGunToList (gunUUIDList, date, time) {
      const data = gunUUIDList
      fetch(`${this.local}/armory/addGunToList?date=${date}&time=${time}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.message = response
            this.success = true
            this.dis = false
            this.$emit('addGunToList')
            this.autoClose()
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.dis = false
            this.autoClose()
          })
        }
      })
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.gunList.filter(v => v.modelName.toLowerCase().indexOf(needle) > -1)
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.gunList.filter(v => v.modelName.toLowerCase().indexOf(needle) > -1)
      })
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
    createTodayTime () {
      const date = new Date()
      let hours = date.getHours()
      hours = hours < 10 ? hours = '0' + hours : hours
      let minutes = date.getMinutes()
      minutes = minutes < 10 ? minutes = '0' + minutes : minutes
      let seconds = date.getSeconds()
      seconds = seconds < 10 ? seconds = '0' + seconds : seconds
      return `${hours}:${minutes}:${seconds}`
    },
    autoClose () {
      setTimeout(() => {
        this.success = false
        this.failure = false
        this.message = null
      }, 2000)
    }
  }
}
</script>
