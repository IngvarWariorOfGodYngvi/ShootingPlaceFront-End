<template>
  <div class="full-width">
    <q-btn class="full-width" @click="dialog=true" color="secondary">Pobierz kartę Członkowską Klubu
    </q-btn>
    <q-dialog v-model="dialog" @keypress.enter="dialog=false;getPersonalCardPDF()">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row items-center">
          <span class="text-h6">Czy na pewno chcesz pobrać kartę Klubowicza?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="primary" v-close-popup />
          <q-btn text-color="white" label="Pobierz" color="primary" v-close-popup @click="getPersonalCardPDF()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="download">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano kartę {{name}}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import App from 'src/App'

export default {
  name: 'PersonalCardPDF.vue',
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
    }
  },
  methods: {
    getPersonalCardPDF () {
      axios({
        url: 'http://' + this.local + '/files/downloadPersonalCard/' + this.uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Karta Członkowska ' + this.name + '.pdf')
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
