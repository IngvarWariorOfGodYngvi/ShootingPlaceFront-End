<template>
    <div>
  <q-btn label="pobierz listę osób z licencją" color="primary" @click="download()">
    </q-btn>
<!--  <q-btn label="przykładowy docx" @click="download1()">-->
<!--    </q-btn>-->
    </div>
</template>

<script>
import axios from 'axios'
import App from 'src/App.vue'
import { isWindows } from 'mobile-device-detect'
export default {
  name: 'downloadBtn',
  data () {
    return {
      mobile: !isWindows,
      main: App.main,
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
    },
    download1 () {
      axios({
        url: 'http://' + this.local + '/files/simpleDocx',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'simpleDocx.docx')
        document.body.appendChild(fileLink)
        fileLink.click()
        // this.downloaded = true
        // this.autoClose()
      })
    }
  }
}
</script>
