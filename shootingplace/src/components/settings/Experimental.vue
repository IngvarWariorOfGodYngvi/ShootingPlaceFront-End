<template>
  <div>
    <div class="col">
      <div>
        <q-expansion-item dense label="Lista Amunicyjna" class="q-pa-xs text-positive bg-dark">
          <div class="q-pa-xs">
            <q-toggle dense v-model="AddShootingPacket" @input="toggleAddShootingPacket()">
              <div class="text-positive">{{ AddShootingPacket ? 'włączone' : 'wyłączone' }} Pakiety Strzeleckie w Liście
                Amunicji</div>
            </q-toggle>
          </div>
          <div class="q-pa-xs">
            <q-toggle dense v-model="AddGroupAmmo" @input="toggleAddGroupAmmo()">
              <div class="text-positive">{{ AddGroupAmmo ? 'włączone' : 'wyłączone' }} Dodawanie wielu kalibrów w Liście
                Amunicji</div>
            </q-toggle>
          </div>
          <div class="q-pa-xs">
            <q-toggle dense v-model="AddSingleAmmo" @input="toggleAddSingleAmmo()">
              <div class="text-positive">{{ AddSingleAmmo ? 'włączone' : 'wyłączone' }} Pojedyńcze dodawanie w Liście Amunicji
              </div>
            </q-toggle>
          </div>
          <div class="q-pa-xs">
            <q-toggle dense v-model="GunList" @input="toggleGunList()">
              <div class="text-positive">{{ GunList ? 'włączone' : 'wyłączone' }} Listę Broni w Liście Amunicji</div>
            </q-toggle>
          </div>
        </q-expansion-item>
      </div>
      <q-expansion-item dense v-if="!mobile" label="Górna belka" class="q-pa-xs text-positive bg-dark">
        <div>
          <q-toggle dense v-model="TopTenTab" @input="toggleTopTenTab()">
            <div class="text-positive">{{ TopTenTab ? 'włączone' : 'wyłączone' }} Zakładki TOP 10</div>
          </q-toggle>
        </div>
      </q-expansion-item>
      <q-expansion-item dense v-if="!mobile && main" label="Panel boczny" class="q-pa-xs text-positive bg-dark">
        <div>
          <q-toggle dense v-model="MembersBirthday" @input="toggleMembersBirthday()">
            <div class="text-positive">{{ MembersBirthday ? 'włączone' : 'wyłączone' }} Urodziny Klubowiczów w tym tygodniu</div>
          </q-toggle>
        </div>
        <div>
          <q-toggle dense v-model="MembersCounter" @input="toggleMembersCounter()">
            <div class="text-positive">{{ MembersCounter ? 'włączone' : 'wyłączone' }} Licznik klubowiczów</div>
          </q-toggle>
        </div>
      </q-expansion-item>
      <q-expansion-item dense v-if="!mobile" label="Zawody" class="q-pa-xs text-positive bg-dark">
        <div class="q-pa-xs">
          <q-toggle dense v-model="ClosedCompetitionTab" @input="toggleClosedCompetitionTab()">
            <div class="text-positive">{{ ClosedCompetitionTab ? 'włączone' : 'wyłączone' }} Listę zamkniętych zawodów</div>
          </q-toggle>
        </div>
        <div class="q-pa-xs">
          <q-toggle dense v-model="DialogWindowAfterAddPlayer" @input="toggleDialogWindowAfterAddPlayer()">
            <div class="text-positive">{{ DialogWindowAfterAddPlayer ? 'włączone' : 'wyłączone' }} Okno drukowania metryk po dodaniu zawodnika</div>
          </q-toggle>
        </div>
      </q-expansion-item>
      <q-expansion-item dense label="Panel sędziego" class="q-pa-xs text-positive bg-dark">
        <div class="q-pa-xs row">
          <q-radio v-model="JuryPanelCompetitionInExpansionItem" @input="toggleJuryPanelCompetitionInExpansionItem()"
            :val="false" label="rozwijane listy"></q-radio>
          <q-radio v-model="JuryPanelCompetitionInExpansionItem" @input="toggleJuryPanelCompetitionInExpansionItem()"
            :val="true" label="Kafelki"></q-radio>
        </div>
      </q-expansion-item>
    </div>
  </div>
</template>

<script>
import App from 'src/App.vue'
import { scripts } from 'src/scripts/SetLocalStorageVariables.js'
export default {
  data () {
    return {
      AddShootingPacket: JSON.parse(window.localStorage.getItem('AddShootingPacket')),
      AddGroupAmmo: JSON.parse(window.localStorage.getItem('AddGroupAmmo')),
      AddSingleAmmo: JSON.parse(window.localStorage.getItem('AddSingleAmmo')),
      GunList: JSON.parse(window.localStorage.getItem('GunList')),
      TopTenTab: JSON.parse(window.localStorage.getItem('TopTenTab')),
      ClosedCompetitionTab: JSON.parse(window.localStorage.getItem('ClosedCompetitionTab')),
      DialogWindowAfterAddPlayer: JSON.parse(window.localStorage.getItem('DialogWindowAfterAddPlayer')),
      JuryPanelCompetitionInExpansionItem: JSON.parse(window.localStorage.getItem('JuryPanelCompetitionInExpansionItem')),
      MembersBirthday: JSON.parse(window.localStorage.getItem('MembersBirthday')),
      MembersCounter: JSON.parse(window.localStorage.getItem('MembersCounter')),
      main: App.main,
      mobile: App.mobile,
      local: App.host
    }
  },
  setup () {
    scripts()
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
    },
    toggleClosedCompetitionTab () {
      if (JSON.parse(window.localStorage.getItem('ClosedCompetitionTab')) == null) {
        window.localStorage.setItem('ClosedCompetitionTab', 'true')
      }
      window.localStorage.setItem('ClosedCompetitionTab', !JSON.parse(window.localStorage.getItem('ClosedCompetitionTab')))
      window.location.reload()
    },
    toggleDialogWindowAfterAddPlayer () {
      if (JSON.parse(window.localStorage.getItem('DialogWindowAfterAddPlayer')) == null) {
        window.localStorage.setItem('DialogWindowAfterAddPlayer', 'true')
      }
      window.localStorage.setItem('DialogWindowAfterAddPlayer', !JSON.parse(window.localStorage.getItem('DialogWindowAfterAddPlayer')))
      window.location.reload()
    },
    toggleJuryPanelCompetitionInExpansionItem () {
      if (JSON.parse(window.localStorage.getItem('JuryPanelCompetitionInExpansionItem')) == null) {
        window.localStorage.setItem('JuryPanelCompetitionInExpansionItem', 'true')
      }
      window.localStorage.setItem('JuryPanelCompetitionInExpansionItem', !JSON.parse(window.localStorage.getItem('JuryPanelCompetitionInExpansionItem')))
      window.location.reload()
    },
    toggleMembersBirthday () {
      if (JSON.parse(window.localStorage.getItem('MembersBirthday')) == null) {
        window.localStorage.setItem('MembersBirthday', 'true')
      }
      window.localStorage.setItem('MembersBirthday', !JSON.parse(window.localStorage.getItem('MembersBirthday')))
      window.location.reload()
    },
    toggleMembersCounter () {
      if (JSON.parse(window.localStorage.getItem('MembersCounter')) == null) {
        window.localStorage.setItem('MembersCounter', 'true')
      }
      window.localStorage.setItem('MembersCounter', !JSON.parse(window.localStorage.getItem('MembersCounter')))
      window.location.reload()
    }
  }
}
</script>
