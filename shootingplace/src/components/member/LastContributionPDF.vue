<template>
  <div class="full-width rounded">
    <q-btn glossy class="full-width" @click="dialog=true" color="secondary" :label="title">
      <div v-if="loading " class="text-center"><q-circular-progress color="white" indeterminate/></div>
      <q-tooltip v-if="disable" content-class="text-h6 bg-red" anchor="top middle" self="bottom middle" :offset="[12, 12]">BRAK
        SKŁADEK
      </q-tooltip>
    </q-btn>
    <q-dialog v-model="dialog" @keypress.enter="dialog=false;getContributionPDF()">
      <q-card class="bg-dark text-positive">
        <q-card-section class="col items-center">
          <div class="text-h6">Czy na pewno chcesz pobrać potwierdzenie składki?</div>
          <q-checkbox val="" v-model="a5rotate" label="rozmiar A5"></q-checkbox>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn glossy text-color="white" label="anuluj" color="secondary" v-close-popup />
          <q-btn glossy text-color="white" label="Pobierz" color="primary" v-close-popup @click="loading=true;getContributionPDF()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="download">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano składkę {{name}}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App'
import axios from 'axios'

export default {
  name: 'LastContributionPDF.vue',
  data () {
    return {
      a5rotate: true,
      dialog: false,
      download: false,
      loading: false,
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
    },
    title: {
      type: String,
      required: false,
      dafault: 'Pobierz ostatnie potwierdzenie składki'
    }
  },
  methods: {
    getContributionPDF () {
      axios({
        url: `${this.local}/files/downloadContribution/${this.uuid}?contributionUUID=null&a5rotate=${this.a5rotate}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Składka ${this.name}.pdf`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.download = true
        this.autoClose()
      })
    },
    autoClose () {
      setTimeout(() => {
        this.download = false
        this.loading = false
      }, 2000)
    }
  }
}
</script>
