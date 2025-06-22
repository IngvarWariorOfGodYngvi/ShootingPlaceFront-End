<template>
  <div class="full-width rounded">
    <q-btn class="full-width" :disable="disable" @click="dialog=true" color="secondary">Pobierz Wniosek o przedłużenie licencji
    </q-btn>
    <q-dialog v-model="dialog" @keypress.enter="dialog=false;getApplicationForExtensionOfTheCompetitorsLicense()">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row items-center">
          <span class="text-h6">Czy na pewno chcesz pobrać wniosek o przedłużenie licencji?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup />
          <q-btn text-color="white" label="Pobierz" color="primary" v-close-popup @click="getApplicationForExtensionOfTheCompetitorsLicense()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="download">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano wniosek o przedłużenie licencji</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App'
import axios from 'axios'

export default {
  name: 'ExtensionApplicationFile.vue',
  data () {
    return {
      download: false,
      dialog: false,
      local: App.host
    }
  },
  props: {
    uuid: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    disable: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  methods: {
    getApplicationForExtensionOfTheCompetitorsLicense () {
      axios({
        url: `${this.local}/files/downloadApplication/${this.uuid}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Wniosek ${this.name}.pdf`)
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

<style scoped>

</style>
