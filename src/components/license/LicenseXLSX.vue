<template>
  <div>
<q-btn label="pobierz .xlsx osób z licencją" color="green" @click="download()">
  </q-btn>
  </div>
</template>

<script>
import axios from 'axios'
import App from 'src/App.vue'
// import { isWindows } from 'mobile-device-detect'
export default {
  name: 'downloadBtn',
  data () {
    return {
      mobile: App.mobile,
      main: App.main,
      local: App.host
    }
  },
  methods: {
    download () {
      axios({
        url: `${this.local}/files/downloadAllMembersWithLicenseXlsx`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_z_licencją_do_Katowic.xlsx')
        document.body.appendChild(fileLink)
        fileLink.click()
      // this.downloaded = true
      // this.autoClose()
      })
    }
  }
}
</script>
