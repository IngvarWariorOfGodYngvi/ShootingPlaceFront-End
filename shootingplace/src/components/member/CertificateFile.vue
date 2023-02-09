<template>
  <div class="full-width">
    <q-btn class="full-width" @click="dialog=true" color="secondary">Pobierz Zaświadczenie o przynależności
    </q-btn>
    <q-dialog v-model="dialog">
      <q-card style="width: 400px;" class="bg-dark text-positive">
        <q-card-section class="row items-center">
          <div class="q-ml-sm full-width text-h5 text-bold text-center">Wybierz zaświadczenie</div>
        </q-card-section>
        <q-card-section>
          <q-select class="full-width" filled v-model="certificateChoice" label-color="positive" color="positive" input-class="text-positive"
                    label="Wybierz rodzaj zaświadczenia" use-input hide-selected fill-input popup-content-class="bg-dark text-positive"
                    :options="certificateChoices">
          </q-select>
        </q-card-section>
        <q-card-section class="row items-center">
          <q-select v-if="certificateChoice==='ZAŚWIADCZENIE DO POLICJI'" class="full-width" v-model="city" filled color="positive" input-class="text-positive"
                    use-input hide-selected fill-input :options="cities" label-color="positive" popup-content-class="bg-dark text-positive"
                    label="wybierz miasto"></q-select>
          <div v-if="certificateChoice!=null" class="q-pa-md row full-width">
            <q-checkbox v-if="certificateChoice==='ZAŚWIADCZENIE DO POLICJI'" dense value="" v-model="toggleEnlargement" label="rozszerzenie" class="col"></q-checkbox>
<!--            <q-btn color="primary" class="items-center col" :disable="disable&&certificateChoice===certificateChoices[0]" :label="certificateChoice" @click="certificateDownload = true"></q-btn>-->
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="primary" v-close-popup @click="certificateChoice = null"/>
          <q-tooltip v-if="disable&&certificateChoice===certificateChoices[0]" content-class="text-h6 bg-red" anchor="top middle" self="bottom middle" :offset="[12, 12]">Brak Możliwości wystawienie zaświadczenia
          </q-tooltip>
          <q-btn color="primary" :disable="disable&&certificateChoice===certificateChoices[0]" label="pobierz" @click="certificateDownload = true"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="certificateDownload" persistent
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
    <q-dialog :position="'top'" v-model="download">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano Zaświadczenia</div>
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
      certificateDownload: false,
      certificateChoices: ['ZAŚWIADCZENIE DO POLICJI', 'ZAŚWIADCZENIE ZWYKŁE'],
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
    },
    disable: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  methods: {
    getDownloadCertificateOfClubMembership () {
      axios({
        url: 'http://' + this.local + '/files/downloadCertificateOfClubMembership/' + this.uuid + '?reason=' + this.certificateChoice + '&city=' + this.city + '&enlargement=' + this.toggleEnlargement,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Zaświadczenie ' + this.name + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.certificateChoice = null
        this.download = true
        this.toggleEnlargement = false
        this.autoClose()
      })
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
