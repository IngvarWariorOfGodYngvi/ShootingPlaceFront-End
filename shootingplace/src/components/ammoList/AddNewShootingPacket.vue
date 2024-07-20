<template>
  <div  style="min-width: 50%;">
    <q-card class="bg-dark">
      <q-card-actions align="right" class="q-pa-xs q-ma-xs">
        <div class="text-h5 text-bold text-center col">Stwórz nowy pakiet strzelecki</div>
        <q-btn icon="close" color="primary" round dense v-close-popup @click=" code = null "/>
      </q-card-actions>
      <q-card-section class="flex-center text-positive">
        <div>
          <q-item>
            <q-input v-model="packetName" label="Nazwa Pakietu" class="col" label-color="positive"
          input-class="text-positive" dense filled/>
            <q-input v-model="price" label="Cena" type="number" onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="col" label-color="positive"
          input-class="text-positive" dense filled suffix="zł"/>
          </q-item>
          <q-item dense v-for="(item, uuid) in calibers" :key="uuid" :val="item.uuid" style="">
            <div><q-checkbox v-model="item.active" class="text-white" color="primary" keep-color></q-checkbox></div>
            <div class="text-positive text-center col" style="display: flex;justify-content: center;align-content: center;flex-direction: column;">{{ item.name }}</div>
            <q-input :disable="!item.active" v-model="item.counter" class="col" color="positive" label-color="positive"
          input-class="text-positive" dense filled label="ilość amunicji w pakiecie"
          onkeypress="return (event.charCode > 44 && event.charCode < 58)" type="number" :max="item.quantity"/>
          </q-item>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn :disable="packetName==''||price==''" text-color="white" label="zapisz" color="primary" @click="code = null;addNewPacketCode=true" />
        <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup @click="code = null" />
      </q-card-actions>
    </q-card>
    <q-dialog v-model=" addNewPacketCode " persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter=" addNewPacket(packetName, mapCalibers (calibers),price,code); code = null; addNewPacketCode = false " autofocus
              type="password" v-model=" code " filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null " />
          <q-btn :disable="dis" id="3" label="Wprowadź zmiany" color="black" v-close-popup
            @click="dis=true; addNewPacket(packetName, mapCalibers (calibers),price,code); code = null " />
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
<script>
import App from 'src/App.vue'
export default {
  created () {
    this.getListCalibers()
  },
  data () {
    return {
      code: null,
      calibers: [],
      active: false,
      dis: false,
      addNewPacketCode: false,
      packetName: '',
      price: '',
      message: null,
      success: false,
      failure: false,
      local: App.host
    }
  },
  methods: {
    getListCalibers () {
      fetch(`${this.local}/armory/calibers`, {
        method: 'GET'
      }).then((response) => {
        response.json().then((response) => {
          let temp = []
          this.calibers = []
          if (response.length > 0) {
            temp = response.slice(0, response.length)
            for (let i = 0; i < temp.length; i++) {
              this.calibers.push({
                uuid: temp[i].uuid,
                counter: '0',
                active: false,
                name: temp[i].name
              })
            }
          }
        })
      })
    },
    mapCalibers (calibersObject) {
      const map = new Map()
      for (let i = 0; i < calibersObject.length; i++) {
        if (calibersObject[i].active) {
          map.set(calibersObject[i].uuid, Number(calibersObject[i].counter))
        }
      }
      return map
    },
    addNewPacket (name, map, price, code) {
      fetch(`${this.local}/armory/addShootingPacket?name=${name}&price=${price}&pinCode=${code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(map))
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.message = response
            this.success = true
            this.dis = false
            this.getListCalibers()
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
      }).catch(() => {
        this.message = 'coś jest nie tak'
        this.failure = true
        this.dis = false
        this.autoClose()
      })
    },
    autoClose () {
      setTimeout(() => {
        this.success = false
        this.failure = false
        this.message = null
        this.code = null
      }, 2000)
    }
  }
}
</script>
