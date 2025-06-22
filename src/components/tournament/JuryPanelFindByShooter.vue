<template>
  <div class="q-pa-none">
    <div>
      <q-select :options="shootersList" input-debounce="1000" v-model="searchInput" label="wyszukaj po imieniu, nazwisku lub numerze startowym" color="white" bg-color="primary"
        @keypress.enter="list = []; getShooterStarts(searchInput)" @input="list = []; getShooterStarts(searchInput)"
        input-class="text-white" label-color="white" dense rounded standout=""
          popup-content-class="bg-dark text-positive" class="q-pb-md"
          :option-value="opt => opt !== '' ? Number(opt.metricNumber).toString() : ''"
          :option-label="opt => opt !== '' ? Object(opt.name + ' ' + opt.metricNumber).toString() : ''"
          map-options fill-input emit-value options-dense options-selected-class="bg-negative text-positive"
          use-input hide-selected @filter="filter">
      </q-select>
    </div>
    <div v-if="list.length > 0">
      <div v-for="(item, index) in list" :key="index">
        <SingleCompetitionStart :uuid="item.competitionMembersListEntityUUID" :startNumber="Number(searchInput)" />
      </div>
    </div>
  </div>
</template>
<script>
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
export default {
  components: {
    SingleCompetitionStart: lazyLoadComponent({
      componentFactory: () => import('components/tournament/SingleCompetitionStart.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      searchInput: '',
      list: [],
      shootersList: [],
      filters: [],
      failure: false,
      success: false,
      message: null,
      main: App.main,
      local: App.host
    }
  },
  props: {
    tournamentUUID: {
      type: String,
      required: true
    }
  },
  created () {
    this.getShootersNamesList(this.tournamentUUID)
  },
  methods: {
    getShooterStarts (startNumber) {
      this.list = []
      if (startNumber !== '') {
        fetch(`${this.local}/competitionMembersList/getShooterStarts?startNumber=${startNumber}&tournamentUUID=${this.tournamentUUID}`, {
          method: 'GET'
        }).then(response => response.json())
          .then(response => {
            this.list = response
          }).catch(() => {
            this.message = 'coś poszło nie tak123'
            this.failure = true
            this.autoClose()
          })
      }
    },
    getShootersNamesList (tournamentUUID) {
      fetch(`${this.local}/tournament/getShootersNamesList?tournamentUUID=${tournamentUUID}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filters = response
        }).catch(() => {
          this.message = 'coś poszło nie tak'
          this.failure = true
          this.autoCLose()
        })
    },
    filter (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.shootersList = this.filters.filter(v => v.full.toLowerCase().indexOf(needle) > -1)
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.shootersList = this.filters.filter(v => v.full.toLowerCase().indexOf(needle) > -1)
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
