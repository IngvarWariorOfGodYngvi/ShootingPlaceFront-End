<template>
  <div class="full-width rounded">
    <q-btn glossy class="full-width" rounded :disable="dis" :loading="loading[0]" @click="dialog=true" color="secondary" label="Pobierz Plik .csv"><q-tooltip v-if="dis">Wyłączone tymczasowo przez zmiany w SOZ</q-tooltip></q-btn>
    <q-dialog v-model="dialog" @keypress.enter="dis = true;dialog = false; simulateProgress()">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row items-center">
          <span class="text-h6">Czy na pewno chcesz pobrać Plik?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn glossy text-color="white" label="anuluj" color="secondary" v-close-popup />
          <q-btn glossy text-color="white" label="Pobierz" color="primary" v-close-popup @click="dis = true; simulateProgress()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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

<script>
import App from 'src/App'
import axios from 'axios'
export default {
  name: 'MemberCSVFile.vue',
  data () {
    return {
      dialog: false,
      dis: true,
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
        this.getCSVFile()
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
    getCSVFile () {
      axios({
        url: `${this.local}/files/downloadCSVFile/${this.uuid}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        this.message = 'Pobrano plik .csv'
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', this.name + '.csv')
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
      }, 2000)
    }
  }
}
</script>

<style scoped></style>
