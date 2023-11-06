<template>
  <div class="full-width rounded">
    <q-btn class="full-width" @click="dialog=true" color="secondary">Pobierz Zaświadczenie o przynależności
    </q-btn>
    <q-dialog v-model="dialog">
      <q-card style="width: 400px;" class="bg-dark text-positive">
        <q-card-section class="row items-center">
          <div class="q-ml-sm full-width text-h5 text-bold text-center">Wybierz zaświadczenie</div>
        </q-card-section>
        <q-card-section>
          <q-select class="full-width" options-dense :dark="darkSet()" filled label-color="positive" color="positive" input-class="text-positive"
                    fill-input popup-content-class="bg-dark text-positive" options-selected-class="bg-dark text-positive" :options-dark="darkSet()"
                    label="Wybierz rodzaj zaświadczenia" :options="certificateChoices" v-model="certificateChoice">
          </q-select>
        </q-card-section>
        <q-card-section class="row items-center" v-if="shootingPlace==='prod'">
          <q-select v-if="certificateChoice!==certificateChoices[0]&&certificateChoice!==null" class="full-width" v-model="city" filled color="positive" input-class="text-positive"
                    use-input hide-selected fill-input :options="cities" label-color="positive" popup-content-class="bg-dark text-positive"
                    label="wybierz miasto"></q-select>
          <div v-if="certificateChoice!=null" class="q-pa-md row full-width">
            <q-checkbox v-if="certificateChoice!==certificateChoices[0&&certificateChoice!==null]" dense value="" v-model="toggleEnlargement" label="rozszerzenie" class="col"></q-checkbox>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="primary" v-close-popup @click="certificateChoice = null"/>
          <q-tooltip v-if="certificateChoice===certificateChoices[0]" content-class="text-h6 bg-red" anchor="top middle" self="bottom middle" :offset="[12, 12]">Brak Możliwości wystawienie zaświadczenia
          </q-tooltip>
          <q-btn color="primary" :disable="certificateChoice===certificateChoices[0]" label="pobierz" @click="certificateDownload = true"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="certificateDownload"
              @keypress.enter="getDownloadCertificateOfClubMembership();certificateDownload=false">
      <q-card class="bg-dark text-positive">
        <q-card-section class="col items-center">
          <p class="q-ml-sm text-h6 text-bold">Pobrać zaświadczenie dla Klubowicza?</p>
          <p class="q-ml-sm text-h6 text-bold">Pamiętaj aby sprawdzić składki</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="primary" v-close-popup @click="certificateChoice = null"/>
          <q-btn text-color="white" label="Pobierz" color="primary" v-close-popup
                 @click="getDownloadCertificateOfClubMembership();dialog=false"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="download">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano Zaświadczenie</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App'
import axios from 'axios'

export default {
  name: 'CertificateClub.vue',
  data () {
    return {
      download: false,
      dialog: false,
      shootingPlace: App.shootingPlace,
      certificateDownload: false,
      certificateChoices: App.shootingPlace === 'prod' ? [{ label: 'ZAŚWIADCZENIE ZWYKŁE', disable: false }, { label: 'BROŃ SPORTOWA DO CELÓW SPORTOWYCH', disable: false }, { label: 'BROŃ SPORTOWA DO CELÓW KOLEKCJONERSKICH', disable: false }, { label: 'BROŃ CIĘCIWOWA W POSTACI KUSZ', disable: false }] : [{ label: 'ZAŚWIADCZENIE ZWYKŁE', disable: false }, { label: 'ZAŚWIADCZENIE DO WPA', disable: false }],
      certificateChoice: null,
      city: 'Łódź',
      cities: ['Białystok', 'Bydgoszcz', 'Gdańsk', 'Gorzów Wielkopolski', 'Katowice', 'Kielce', 'Kraków', 'Lublin', 'Łódź', 'Olsztyn', 'Opole', 'Poznań', 'Rzeszów', 'Szczecin', 'Warszawa', 'Wrocław'],
      toggleEnlargement: false,
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
    getDownloadCertificateOfClubMembership () {
      axios({
        url: 'http://' + this.local + '/files/downloadCertificateOfClubMembership/' + this.uuid + '?reason=' + this.certificateChoice.label + '&city=' + this.city + '&enlargement=' + this.toggleEnlargement,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Zaświadczenie ' + this.certificateChoice.label + ' ' + this.name + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.certificateChoice = null
        this.download = true
        this.toggleEnlargement = false
        this.autoClose()
      })
    },
    darkSet () {
      return JSON.parse(window.localStorage.getItem('BackgroundDark'))
    },
    autoClose () {
      setTimeout(() => {
        this.download = false
      }, 2000)
    }
  }
}
</script>

<style scoped>

</style>
