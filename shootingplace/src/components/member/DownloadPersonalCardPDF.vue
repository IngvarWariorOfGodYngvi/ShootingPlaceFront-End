<template>
  <div class="full-width">
    <q-btn glossy class="full-width" rounded :disable="dis" :loading="loading[0]" @click="dialog=true" color="secondary" label="Pobierz kartę członkowską Klubowicza"/>
    <q-dialog v-model="dialog" @keypress.enter="dis = true;dialog=false;simulateProgress()">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row items-center">
          <span class="text-h6">Czy na pewno chcesz pobrać kartę Klubowicza?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn glossy text-color="white" label="anuluj" color="secondary" v-close-popup />
          <q-btn glossy text-color="white" label="Pobierz" color="primary" v-close-popup @click="dis=true;simulateProgress()" />
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
    <q-dialog position="top" v-model="failure" class="bg-warning">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
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
      dialog: false,
      dis: false,
      failure: false,
      success: false,
      message: null,
      loading: [false],
      local: App.host
    }
  },
  setup () {
    function simulateProgress () {
      this.loading[0] = true
      if (this.dis) {
        this.getPersonalCardPDF()
      }
      setTimeout(() => {
        this.loading[0] = false
      }, 1000)
    }
    return {
      simulateProgress
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
        url: `${this.local}/files/downloadPersonalCard/${this.uuid}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Karta Członkowska - ${this.name}.pdf`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.message = `Pobrano Kartę Członkowską ${this.name}`
        this.success = true
        this.autoClose()
      }).catch(() => {
        this.message = 'coś poszło nie tak'
        this.failure = true
        this.autoClose()
      })
    },
    autoClose () {
      setTimeout(() => {
        this.dis = false
        this.failure = false
        this.success = false
        this.loading = [false]
      }, 2000)
    }
  }
}
</script>

<style scoped>

</style>
