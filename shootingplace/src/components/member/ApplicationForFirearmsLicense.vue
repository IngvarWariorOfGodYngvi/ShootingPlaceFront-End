<template>
  <div class="full-width rounded">
    <q-btn class="full-width" :disable="disable" @click="dialog=true" color="secondary">Pobierz wniosek o pozwolenie na broń
    </q-btn>
    <q-dialog v-model="dialog">
      <q-card style="width: 400px;" class="bg-dark text-positive">
        <q-card-section class="row items-center">
          <div class="q-ml-sm full-width text-h5 text-bold text-center">Uzupełnij dane aby wygenerować wniosek</div>
        </q-card-section>
        <q-card-section class="row items-center">
          <q-select class="full-width" dense v-model="city" filled input-class="text-positive"
                    use-input hide-selected fill-input :options="cities" label-color="positive" popup-content-class="bg-dark text-positive"
                    label="wybierz miasto"></q-select>
          <q-input v-model="thirdName" class="full width" dense label="Drugie Imię (jeśli posiada)" label-color="positive" input-class="text-positive"></q-input>
          <q-input v-model="birthPlace" class="full width" dense label="Miejsce urodzenia" label-color="positive" input-class="text-positive"></q-input>
          <q-input v-model="fatherName" class="full width" dense label="Imię Ojca" label-color="positive" input-class="text-positive"></q-input>
          <q-input v-model="motherName" class="full width" dense label="Imię Matki" label-color="positive" input-class="text-positive"></q-input>
          <q-input v-model="motherMaidenName" class="full width" dense label="Nazwisko Rodowe Matki" label-color="positive" input-class="text-positive"></q-input>
          <q-input v-model="issuingAuthority" class="full width" dense label="Organ Wydający Dowód Osobisty" label-color="positive" input-class="text-positive"></q-input>
          <q-input v-model="IDDate" class="full width" dense label="Data Wydania Dowodu Osobistego" label-color="positive" input-class="text-positive">
            <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer" color="positive">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="IDDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
          </q-input>
          <q-input v-model="licenseDate" class="full width" dense label="Data Wydania Aktualnej Licencji Zawodniczej" label-color="positive" input-class="text-positive">
            <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer" color="positive">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="licenseDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
          </q-input>

        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn color="primary" :disable="disable" label="pobierz" @click="getApplicationForFirearmsLicense (thirdName, birthPlace, fatherName, motherName, motherMaidenName, issuingAuthority, IDDate, licenseDate,city)"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="download">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano Wniosek</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App'
import axios from 'axios'

export default {
  name: 'ApplicationForFirearmsLicense.vue',
  data () {
    return {
      download: false,
      thirdName: null,
      birthPlace: '',
      fatherName: '',
      motherName: '',
      motherMaidenName: '',
      issuingAuthority: '',
      IDDate: null,
      licenseDate: null,
      dialog: false,
      shootingPlace: App.shootingPlace,
      city: 'Łódź',
      cities: ['Białystok', 'Bydgoszcz', 'Gdańsk', 'Gorzów Wielkopolski', 'Katowice', 'Kielce', 'Kraków', 'Lublin', 'Łódź', 'Olsztyn', 'Opole', 'Poznań', 'Rzeszów', 'Szczecin', 'Warszawa', 'Wrocław'],
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
    getApplicationForFirearmsLicense (thirdName, birthPlace, fatherName, motherName, motherMaidenName, issuingAuthority, IDDate, licenseDate, city) {
      axios({
        url: `http://${this.local}/files/ApplicationForFirearmsLicense/${this.uuid}`,
        method: 'GET',
        params: {
          thirdName: thirdName,
          birthPlace: birthPlace,
          fatherName: fatherName,
          motherName: motherName,
          motherMaidenName: motherMaidenName,
          issuingAuthority: issuingAuthority,
          IDDate: IDDate,
          licenseDate: licenseDate,
          city: city
        },
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Wniosek o pozwolenie na broń ${this.name}.pdf`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.download = true
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
