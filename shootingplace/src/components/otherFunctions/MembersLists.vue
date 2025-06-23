<template>
  <div>
    <div class="text-body2 bg-dark text-positive" style="height: 50vh">
      <div>
        <q-radio label="dorośli" v-model="condition" :val="true" />
        <q-radio label="młodzież" v-model="condition" :val="false" />
      </div>
      <q-btn color="primary"
        :label="condition ? 'pobierz listę wszystkich klubowiczów dorosłych PDF' : 'pobierz listę wszystkich klubowiczów młodzieżowych PDF'"
        @click=" showloading(); getAllMembersList()" />
      <p></p>
      <q-btn color="green-3" text-color="black"
        :label="condition ? 'pobierz listę wszystkich klubowiczów dorosłych XLSX' : 'pobierz listę wszystkich klubowiczów młodzieżowych XLSX'"
        @click=" showloading(); getAllMembersListXLSXFile()" />
    </div>
    <q-dialog position="top" v-model="listDownload">
      <q-card>
        <q-card-section class="col">
          <div class="self-center col full-width no-outline text-center text-h5 text-bold">Pobrano Listę</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

</template>
<style src="src/style/style.scss" lang="scss"></style>
<script>
import App from 'src/App'
import axios from 'axios'

export default {
  name: 'contributions.vue',
  data () {
    return {
      condition: true,
      nowDate: this.createTodayDate(),
      listDownload: false,
      message: null,
      local: App.host
    }
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 2000)
    },
    createTodayDate () {
      const date = new Date()
      let month = 0
      let day = 0
      if ((date.getMonth() + 1) < 10) {
        month = '0' + (date.getMonth() + 1)
      } else {
        month = (date.getMonth() + 1)
      }
      if (date.getDate() < 10) {
        day = '0' + (date.getDate())
      } else {
        day = (date.getDate())
      }
      return date.getFullYear() + '/' + month + '/' + day
    },
    getAllMembersListXLSXFile () {
      axios({
        url: `${this.local}/files/downloadAllMembersXLSXFile/?condition=${this.condition}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Lista_klubowiczów_na_dzień ${this.nowDate}.xlsx`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getAllMembersList () {
      axios({
        url: `${this.local}/files/downloadAllMembers/?condition=${this.condition}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Lista_klubowiczów_na_dzień ${this.nowDate}.pdf`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    autoClose () {
      setTimeout(() => {
        this.listDownload = false
      }, 2000)
    }
  }
}
</script>
