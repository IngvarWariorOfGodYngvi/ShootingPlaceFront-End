<template>
  <div class="full-width">
    <q-btn class="full-width round" :disable="disable" @click="dialog=true" color="secondary" label="Pobierz deklarację członkowską LOK">
      &nbsp;&nbsp;<q-avatar>
        <div v-if="loading " class="text-center"><q-circular-progress color="white" indeterminate><img src="~assets/logo_LOK.png"></q-circular-progress></div>
        <img v-else src="~assets/logo_LOK.png">
      </q-avatar></q-btn>
    <q-dialog v-model="dialog" @keypress.enter="dialog=false;membershipDeclarationLOKPDF()">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row items-center">
          <span class="text-h6">Czy na pewno chcesz pobrać Deklarację LOK?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup />
          <q-btn text-color="white" label="Pobierz" color="primary" v-close-popup @click="loading=true;membershipDeclarationLOKPDF()" />
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
import axios from 'axios'
import App from 'src/App.vue'

export default {
  name: 'DeklaracjaLOK.vue',
  data () {
    return {
      dialog: false,
      download: false,
      failure: false,
      success: false,
      message: null,
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
      required: false,
      default: false
    }
  },
  methods: {
    membershipDeclarationLOKPDF () {
      console.log(this.uuid)
      axios({
        url: `${this.local}/files/membershipDeclarationLOK?uuid=${this.uuid}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Deklaracja Członkowska LOK ${this.name}.pdf`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.download = true
        this.autoClose()
        this.$emit('membershipDeclarationLOKPDF')
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
