<template>
  <div>
    <q-card class="bg-dark text-positive" >
      <div class="q-pa-md text-center full-width no-outline text-h5 text-bold">Lista Pakietów
      </div>
      <div class="row col">
        <div class="col-4 self-center">Lp Nazwa Pakietu</div>
        <div class="col text-center">cena</div>
      </div>
      <p></p>
      <q-scroll-area dense class="full-width q-pa-none" style="height: 70vh;">
        <div v-for="(item, index) in packets" :key="index" class="col hover1 q-mb-xs" @dblclick="uuid = item.uuid; packet = item;getListCalibers(); editPacket = true;">
            <div class="row">
              <Tooltip2clickTip/>
              <div class="col-4 self-center">{{ index + 1 }} {{ item.name }}</div>
              <div class="col self-center text-center">{{ item.price }}</div>
            </div>
          </div>
      </q-scroll-area>
    </q-card>
    <q-dialog v-model="editPacket">
      <q-card class="bg-dark text-positive" style="width: 60vw;">
        <q-card-section class="text-bold text-center text-h6">
          Edytuj Pakiet
        </q-card-section>
        <q-card-section class="text-bold">
          {{packet.name}}
        </q-card-section>
        <q-card-section class="text-bold">
          <div>ID: {{ packet.uuid }}</div>
          <div>nazwa: {{ packet.name }}</div>
          <div>cena: {{ packet.price }}</div>
          <div>Kalibry:</div>
          <div v-for="(caliber,index) in packet.calibers" :key="index">
            <q-card-section>
              <div>ID: {{ caliber.caliberUUID }}</div>
              <div>nazwa: {{ caliber.caliberName }}</div>
              <div>ilość: {{ caliber.quantity }}</div>
            </q-card-section>
          </div>
        </q-card-section>
        <hr class="q-ma-md">
        <q-card-section class="text-bold">
          <q-input class="q-pa-xs" v-model="newPacketName" dense label="Nowa nazwa pakietu" bg-color="primary" rounded standout="" label-color="positive"/>
          <q-input class="q-pa-xs" v-model="newPacketPrice" onkeypress="return (event.charCode > 47 && event.charCode < 58)" dense label="Nowa cena pakietu" bg-color="primary" rounded standout="" label-color="positive" suffix="zł"/>
          <q-item dense v-for="(item, uuid) in calibers" :key="uuid" :val="item.uuid" style="">
            <div><q-checkbox v-model="item.active" class="text-white" color="primary" keep-color></q-checkbox></div>
            <div class="text-positive text-center col" style="display: flex;justify-content: center;align-content: center;flex-direction: column;">{{ item.name }}</div>
            <q-input :disable="!item.active" v-model="item.counter" class="col" label-color="positive"
          input-class="text-positive" dense filled label="ilość amunicji w pakiecie"
          onkeypress="return (event.charCode > 44 && event.charCode < 58)" type="number" :max="item.quantity"/>
          </q-item>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="usuń" color="primary" @click="deletePacket = true" v-close-popup />
          <q-btn label="zapisz" color="primary" @click="addNewPacketCode = true" v-close-popup />
          <q-btn label="zamknij" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" addNewPacketCode ">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter=" updatePacket(uuid, newPacketName, mapCalibers (calibers),newPacketPrice,code); code = null; addNewPacketCode = false " autofocus
              type="password" v-model=" code " filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null " />
          <q-btn id="3" label="Wprowadź zmiany" color="black" v-close-popup
            @click="updatePacket(uuid, newPacketName, mapCalibers (calibers),newPacketPrice,code); code = null " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="deletePacket"
      @keypress.enter="deletePacketCode = true; deletePacket = false">
      <q-card class="bg-dark text-positive">
        <q-card-section class="items-center">
          <p class="q-ml-sm text-h6 text-center col">Czy na pewno chcesz usunąć pakiet?</p>
          <p class="q-ml-sm text-h6 text-center col">Zmiana będzie nieodwracalna!</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup />
          <q-btn text-color="white" label="usuń" color="primary" v-close-popup
            @click="deletePacketCode=true" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" deletePacketCode ">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter=" deleteShootingPacket(uuid, code); code = null; deletePacketCode = false " autofocus
              type="password" v-model=" code " filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null " />
          <q-btn id="3" label="Wprowadź zmiany" color="black" v-close-popup
            @click="deleteShootingPacket(uuid, code); code = null; deletePacketCode = false; code = null " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<style src="../../style/style.scss" lang="scss">
</style>
<script>
import App from 'src/App'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
export default {
  name: 'PacketEdit.vue',
  created () {
    this.getPackets()
  },
  components: {
    Tooltip2clickTip: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickTip.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      code: null,
      uuid: '',
      packets: [],
      calibers: [],
      active: false,
      packet: '',
      newPacketName: '',
      newPacketPrice: '',
      deletePacket: false,
      addNewPacketCode: false,
      deletePacketCode: false,
      editPacket: false,
      success: false,
      failure: false,
      message: null,
      local: App.host
    }
  },
  methods: {
    getPackets () {
      fetch(`${this.local}/armory/getAllShootingPacketEntities`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.packets = response
        })
    },
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
    updatePacket (uuid, name, map, price, code) {
      fetch(`${this.local}/armory/updateShootingPacket?uuid=${uuid}&name=${name}&price=${price}&pinCode=${code}`, {
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
            this.getPackets()
            this.autoClose()
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.getPackets()
            this.autoClose()
          })
        }
      }).catch(() => {
        this.message = 'coś jest nie tak'
        this.failure = true
        this.autoClose()
      })
    },
    deleteShootingPacket (uuid, code) {
      fetch(`${this.local}/armory/deleteShootingPacket?uuid=${uuid}&pinCode=${code}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.message = response
            this.success = true
            this.getPackets()
            this.autoClose()
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.getPackets()
            this.autoClose()
          })
        }
      }).catch(() => {
        this.message = 'coś poszło nie tak'
        this.failure = true
        this.autoClose()
      })
    },
    autoClose () {
      setTimeout(() => {
        this.code = null
        this.success = false
        this.failure = false
        this.message = null
      }, 2000)
    }
  }
}
</script>
