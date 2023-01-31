<template>
  <div class="full-width">
    <q-btn class="full-width" @click="membershipDeclarationLOKPDF()" color="secondary">Pobierz deklarację członkowską LOK
    </q-btn>
  </div>
</template>

<script>

import axios from 'axios'
import App from 'src/App.vue'

export default {
  name: 'DeklaracjaLOK.vue',
  data () {
    return {
      local: App.host
    }
  },
  props: {
    uuid: {
      type: String,
      required: true
    }
  },
  methods: {
    membershipDeclarationLOKPDF () {
      axios({
        url: 'http://' + this.local + '/files/membershipDeclarationLOK?uuid=' + this.uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Deklaracja_Członkowska_LOK.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    }
  }
}
</script>
