<template>
  <div>
    <q-btn-dropdown class="full-width" label="pakiety" color="primary" content-class="bg-dark" :menu-offset="[40,0]">
      <div style="min-width: 40vw;">
        <q-item>
          <q-btn label="wydaj pakiet" @click="packet = true" color="primary" class="full-width"/>
        </q-item>
        <q-item v-if="main">
        <q-btn @click="createNewPacket = true" label="konfiguruj nowy pakiet" color="primary"
            class="full-width"/>
            </q-item>
      </div>
    </q-btn-dropdown>
    <q-dialog v-model="createNewPacket" style="min-width: 80vw">
      <AddNewShootingPacket></AddNewShootingPacket>
    </q-dialog>
        <q-dialog v-model="packet">
      <AddShootingPacket
      :nameMember="{ firstName: '0', secondName: '0', legitimationNumber: '0' }"
      :nameOther="{ firstName: '0', secondName: '0', id: '0' }"></AddShootingPacket>
    </q-dialog>
  </div>
</template>
<script>

import { ref } from 'vue'
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
// import { isWindows } from 'mobile-device-detect'
export default {
  name: 'ShootingPackets',
  created () {
    this.getPacketList()
    this.getMembersNames()
    this.getOther()
  },
  components: {
    AddNewShootingPacket: lazyLoadComponent({
      componentFactory: () => import('components/ammoList/AddNewShootingPacket.vue'),
      loading: SkeletonBox
    }),
    AddShootingPacket: lazyLoadComponent({
      componentFactory: () => import('components/ammoList/AddShootingPacket.vue'),
      loading: SkeletonBox
    })
  },
  props: {
    nameMember: {
      type: Object,
      required: false
    },
    nameOther: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      memberName: this.nameMember,
      otherName: this.nameOther,
      createNewPacket: false,
      filters: [],
      filtersOther: [],
      options: [],
      options1: [],
      packets: [],
      singlePacket: {},
      dis: false,
      packet: false,
      message: null,
      success: false,
      failure: false,
      mobile: App.mobile,
      shootingPlace: App.shootingPlace,
      main: App.main,
      local: App.host
    }
  },
  setup () {
    const loading = ref([
      false
    ])
    const progress = ref(false)

    function simulateProgress (number, memberNumberLegitimation, otherID) {
      loading.value[number] = true
      if (this.dis || !this.memberName === '' || !this.otherName === '') {
        this.addMemberAndAmmoToCaliber(this.mapCalibers(this.singlePacket.calibers), memberNumberLegitimation, otherID)
      }
      setTimeout(() => {
        loading.value[number] = false
      }, 0)
    }
    function simulateProgressGun (number, evidenceUUID, barcode) {
      loading.value[number] = true
      this.addGunToList(evidenceUUID, barcode)
      setTimeout(() => {
        loading.value[number] = false
      }, 0)
    }
    return {
      loading,
      progress,
      simulateProgress,
      simulateProgressGun
    }
  },
  methods: {
    getPacketList () {
      fetch(`${this.local}/armory/getAllShootingPacket`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.packets = response
        })
    },
    getMembersNames () {
      fetch(`${this.local}/member/getAllNames`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filters = response
        })
    },
    getOther () {
      fetch(`${this.local}/other/all`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filtersOther = response
        })
    },
    mapCalibers (calibersObject) {
      const map = new Map()
      for (let i = 0; i < calibersObject.length; i++) {
        map.set(calibersObject[i].caliberUUID, Number(calibersObject[i].quantity))
      }
      return map
    },
    viewCurrency (money) {
      if (money === undefined) { money = '0' }
      const formatterPL = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })
      const cash = formatterPL.format(money)
      return cash
    },
    addMemberAndAmmoToCaliber (map, memberNumberLegitimation, otherID) {
      fetch(`${this.local}/ammoEvidence/listOfAmmo?legitimationNumber=${memberNumberLegitimation}&otherID=${otherID}`, {
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
            this.$root.$on('ammoList', () => {
              this.getAmmoData()
            })
            this.$emit('addMemberAndAmmoToCaliber')
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
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.filters.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filters.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterOther (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options1 = this.filtersOther.filter(v => v.fullName.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options1 = this.filtersOther.filter(v => v.fullName.toLowerCase().indexOf(needle) > -1)
      })
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
