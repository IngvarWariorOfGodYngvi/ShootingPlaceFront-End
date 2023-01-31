<template>
  <div class="full-width">
    <q-btn class="full-width" @click="getPersonalCardPDF()" color="secondary">Pobierz kartę Członkowską Klubu
    </q-btn>
  </div>
</template>

<script>
import axios from 'axios'
import App from 'src/App'

export default {
  name: 'PersonalCardPDF.vue',
  data () {
    return {
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
        fileLink.setAttribute('download', 'Karta_Członkowska_' + this.name + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.downloaded = true
        this.autoClose()
      })
    }
  }
}
</script>

<style scoped>

</style>
