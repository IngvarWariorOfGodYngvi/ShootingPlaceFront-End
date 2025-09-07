<template>
  <div class="full-width rounded">
    <q-btn glossy class="full-width" rounded :disable="dis" :loading="loading[0]" @click="dialog=true" color="secondary" label="Pobierz Zaświadczenie o przynależności"/>
    <q-dialog v-model="dialog">
      <q-card style="width: 60vw;" class="bg-dark text-positive">
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
            <q-checkbox v-if="certificateChoice!==certificateChoices[0]&&certificateChoice!==null" dense value="" v-model="toggleEnlargement" label="rozszerzenie" class="col"></q-checkbox>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn glossy label="anuluj" color="primary" v-close-popup @click="certificateChoice = null"/>
          <q-btn glossy color="primary" label="pobierz" @click="certificateDownload = true"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="certificateDownload"
              @keypress.enter="dis=true;simulateProgress();certificateDownload=false">
      <q-card class="bg-dark text-positive">
        <q-card-section class="col items-center">
          <p class="q-ml-sm text-h6 text-bold">Pobrać zaświadczenie dla Klubowicza?</p>
          <p class="q-ml-sm text-h6 text-bold">Pamiętaj aby sprawdzić składki</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn glossy text-color="white" label="anuluj" color="primary" v-close-popup @click="certificateChoice = null"/>
          <q-btn glossy text-color="white" label="Pobierz" color="primary" v-close-popup
                 @click="dis=true;simulateProgress();dialog=false"/>
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
import App from 'src/App'
import axios from 'axios'

export default {
  name: 'CertificateClub.vue',
  data () {
    return {
      dialog: false,
      dis: false,
      failure: false,
      success: false,
      message: null,
      loading: [false],
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
  setup () {
    function simulateProgress () {
      this.loading[0] = true
      if (this.dis) {
        this.getDownloadCertificateOfClubMembership()
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
    }
  },
  methods: {
    getDownloadCertificateOfClubMembership () {
      axios({
        url: `${this.local}/files/downloadCertificateOfClubMembership/${this.uuid}?reason=${this.certificateChoice.label}&city=${this.city}&enlargement=${this.toggleEnlargement}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Zaświadczenie ${this.certificateChoice.label} - ${this.name}.pdf`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.message = `Pobrano Zaświadczenie ${this.certificateChoice.label} ${this.name}`
        this.success = true
        this.toggleEnlargement = false
        this.certificateChoice = null
        this.autoClose()
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
    },
    darkSet () {
      return JSON.parse(window.localStorage.getItem('BackgroundDark'))
    }
  }
}
</script>

<style scoped>

</style>
