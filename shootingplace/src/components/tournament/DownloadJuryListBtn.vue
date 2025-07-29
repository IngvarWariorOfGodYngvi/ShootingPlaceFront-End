<template>
  <div>
    <q-item>
      <q-btn glossy @click="dis = true; simulationGetJudgeFromTournament()" :loading="loading[0]"
        :disable="dis" class="full-width ghover1" label="pobierz listę sędziów" color="primary" />
    </q-item>
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<style src="src/style/style.scss" lang="scss"></style>
<script>
import axios from 'axios'
import App from 'src/App.vue'
import { ref } from 'vue'
export default {
  name: 'DownloadJuryListBtn',
  setup () {
    const loading = ref([
      false
    ])
    function simulationGetJudgeFromTournament () {
      loading.value[0] = true
      this.getJudgeFromTournament()
      setTimeout(() => {
        loading.value[0] = false
      }, 0)
    }

    return {
      loading,
      simulationGetJudgeFromTournament
    }
  },
  props: {
    uuid: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  watch: {
    uuid (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.simulationGetJudgeFromTournament()
      }
    }
  },
  data () {
    return {
      dis: false,
      message: null,
      success: false,
      failure: false,
      shootingPlace: App.shootingPlace,
      local: App.host
    }
  },
  methods: {
    getJudgeFromTournament () {
      axios({
        url: `${this.local}/files/downloadJudge/${this.uuid}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        this.message = 'Pobrano Dokument'
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Lista sędziów na zawodach ${this.name} ${this.date}.pdf`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.success = true
        this.autoClose()
      })
    },
    autoClose () {
      setTimeout(() => {
        this.dis = false
        this.message = null
        this.success = false
        this.failure = false
      }, 2000)
    }
  }
}
</script>
