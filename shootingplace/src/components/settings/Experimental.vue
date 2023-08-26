<template>
  <div>
    <div class="col">
      <div>
        <q-toggle dense v-model="AddShootingPacket" @input="toggleAddShootingPacket()">
          <div class="text-positive">{{ !AddShootingPacket ? 'włącz Pakiety Strzeleckie w Liście Amunicji' : 'wyłącz Pakiety Strzeleckie w Liście Amunicji'}}</div>
        </q-toggle>
      </div>
      <div>
        <q-toggle dense v-model="AddGroupAmmo" @input="toggleAddGroupAmmo()">
          <div class="text-positive">{{ !AddGroupAmmo ? 'włącz Dodawanie wielu kalibrów w Liście Amunicji' : 'wyłącz Dodawanie wielu kalibrów w Liście Amunicji'}}</div>
        </q-toggle>
      </div>
      <div>
        <q-toggle dense v-model="AddSingleAmmo" @input="toggleAddSingleAmmo()">
          <div class="text-positive">{{ !AddSingleAmmo ? 'włącz Pojedyńcze dodawanie w Liście Amunicji' : 'wyłącz Pojedyńcze dodawanie wielu kalibrów w Liście Amunicji'}}</div>
        </q-toggle>
      </div>
      <div>
        <q-toggle dense v-model="GunList" @input="toggleGunList()">
          <div class="text-positive">{{ !GunList ? 'włącz Listę Broni w Liście Amunicji' : 'wyłącz Listę Broni w Liście Amunicji'}}</div>
        </q-toggle>
      </div>
      <div>
        <q-toggle dense v-model="TopTenTab" @input="toggleTopTenTab()">
          <div class="text-positive">{{ !TopTenTab ? 'włącz zakładki TOP 10' : 'wyłącz zakładki TOP 10'}}</div>
        </q-toggle>
      </div>
    </div>
  </div>
</template>

<script>
import App from 'src/App.vue'
export default {
  data () {
    return {
      AddShootingPacket: JSON.parse(window.localStorage.getItem('AddShootingPacket')),
      AddGroupAmmo: JSON.parse(window.localStorage.getItem('AddGroupAmmo')),
      AddSingleAmmo: JSON.parse(window.localStorage.getItem('AddSingleAmmo')),
      GunList: JSON.parse(window.localStorage.getItem('GunList')),
      TopTenTab: JSON.parse(window.localStorage.getItem('TopTenTab')),
      local: App.host
    }
  },
  setup () {
    if (JSON.parse(window.localStorage.getItem('AddShootingPacket')) == null) {
      window.localStorage.setItem('AddShootingPacket', 'true')
    }
    if (JSON.parse(window.localStorage.getItem('AddGroupAmmo')) == null) {
      window.localStorage.setItem('AddGroupAmmo', 'true')
    }
    if (JSON.parse(window.localStorage.getItem('AddSingleAmmo')) == null) {
      window.localStorage.setItem('AddSingleAmmo', 'true')
    }
    if (JSON.parse(window.localStorage.getItem('GunList')) == null) {
      window.localStorage.setItem('GunList', 'true')
    }
    if (JSON.parse(window.localStorage.getItem('TopTenTab')) == null) {
      window.localStorage.setItem('TopTenTab', 'true')
    }
  },
  methods: {
    toggleAddShootingPacket () {
      if (JSON.parse(window.localStorage.getItem('AddShootingPacket')) == null) {
        window.localStorage.setItem('AddShootingPacket', 'true')
      }
      window.localStorage.setItem('AddShootingPacket', !JSON.parse(window.localStorage.getItem('AddShootingPacket')))
      window.location.reload()
    },
    toggleAddGroupAmmo () {
      if (JSON.parse(window.localStorage.getItem('AddGroupAmmo')) == null) {
        window.localStorage.setItem('AddGroupAmmo', 'true')
      }
      window.localStorage.setItem('AddGroupAmmo', !JSON.parse(window.localStorage.getItem('AddGroupAmmo')))
      if (JSON.parse(window.localStorage.getItem('AddSingleAmmo')) === 'false') {
        window.localStorage.setItem('AddSingleAmmo', 'true')
      }
      window.location.reload()
    },
    toggleAddSingleAmmo () {
      if (JSON.parse(window.localStorage.getItem('AddSingleAmmo')) == null) {
        window.localStorage.setItem('AddSingleAmmo', 'true')
      }
      window.localStorage.setItem('AddSingleAmmo', !JSON.parse(window.localStorage.getItem('AddSingleAmmo')))
      window.location.reload()
    },
    toggleGunList () {
      if (JSON.parse(window.localStorage.getItem('GunList')) == null) {
        window.localStorage.setItem('GunList', 'true')
      }
      window.localStorage.setItem('GunList', !JSON.parse(window.localStorage.getItem('GunList')))
      window.location.reload()
    },
    toggleTopTenTab () {
      if (JSON.parse(window.localStorage.getItem('TopTenTab')) == null) {
        window.localStorage.setItem('TopTenTab', 'true')
      }
      window.localStorage.setItem('TopTenTab', !JSON.parse(window.localStorage.getItem('TopTenTab')))
      window.location.reload()
    }
  }
}
</script>
