<template>
  <div class="full-width">
    <q-btn glossy class="full-width" rounded :disable="dis" :loading="loading[0]" @click="dialog=true" color="secondary" label="Pobierz deklarację członkowską LOK"/>
    <q-dialog v-model="dialog" @keypress.enter="dis = true;dialog=false;simulateProgress()">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row items-center">
          <span class="text-h6">Czy na pewno chcesz pobrać Deklarację LOK?</span>
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
import App from 'src/App.vue'

export default {
  name: 'DeklaracjaLOK.vue',
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
        this.membershipDeclarationLOKPDF()
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
    },
    disable: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    membershipDeclarationLOKPDF () {
      axios({
        url: `${this.local}/files/membershipDeclarationLOK?uuid=${this.uuid}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Deklaracja Członkowska LOK - ${this.name}.pdf`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.message = `Pobrano Deklarację ${this.name}`
        this.success = true
        this.autoClose()
        this.$emit('membershipDeclarationLOKPDF')
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
