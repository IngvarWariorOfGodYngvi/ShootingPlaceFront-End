<template>
  <div>
    <q-btn color="secondary" :loading="loading[0]" class="col full-width full-height" @click="simulateProgress(0);showloading();getAmmoListPDF(uuid, date)" icon="file_download">
      <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Pobierz listę
      </q-tooltip>
    </q-btn>
    <q-dialog position="top" v-model="download">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano listę z dnia {{ date }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import App from 'src/App'
import { ref } from 'vue'

export default {
  name: 'ammoListDownloadBtn.vue',
  data () {
    return {
      download: false,
      local: App.host
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
    }
  },
  setup () {
    const loading = ref([
      false
    ])
    const progress = ref(false)
    function simulateProgress (number) {
      loading.value[number] = true
      setTimeout(() => {
        loading.value[number] = false
      }, 500)
    }

    return {
      loading,
      progress,
      simulateProgress
    }
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    getAmmoListPDF (uuid, date) {
      axios({
        url: `${this.local}/files/downloadAmmunitionList/${uuid}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Lista_Rozliczenia_Amunicji_${date}.pdf`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.download = true
        this.autoClose()
      })
    },
    autoClose () {
      setTimeout(() => {
        this.download = false
      }, 2000)
    }
  }
}
</script>

<style>

</style>
