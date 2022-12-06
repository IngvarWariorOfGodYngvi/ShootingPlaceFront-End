<template>
    <q-btn label="pobierz listę osób z licencją" @click="download()">
    </q-btn>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import App from 'src/App.vue'
Vue.prototype.$axios = axios
export default {
  name: 'downloadBtn',
  data () {
    return {
      local: App.host
    }
  },
  methods: {
    download () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllMembersWithLicense',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_z_licencją.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        // this.downloaded = true
        // this.autoClose()
      })
    }
  }
}
</script>
