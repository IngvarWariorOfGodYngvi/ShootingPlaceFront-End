<template>
  <div class="full-width">
    <q-btn class="full-width" @click="getContributionPDF()" color="secondary">Pobierz ostatnie potwierdzenie składki
      <q-tooltip v-if="disable" content-class="text-h6 bg-red" anchor="top middle" self="bottom middle" :offset="[12, 12]">BRAK
        SKŁADEK
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
import App from 'src/App'
import axios from 'axios'

export default {
  name: 'LastContributionPDF.vue',
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
    },
    disable: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  methods: {
    getContributionPDF () {
      axios({
        url: 'http://' + this.local + '/files/downloadContribution/' + this.uuid + '?contributionUUID=null',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Składka_' + this.name + '_' + this.name2 + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    }
  }
}
</script>

<style scoped>

</style>
