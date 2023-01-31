<template>
  <div>
    <div v-if="!access">
      <q-input dense v-model="accessCode" label="wprowadź kod" type="password" mask="####"
               @keypress.enter="getAccess(accessCode)" filled></q-input>
      <q-item dense>{{ accessMessage }}</q-item>
      <q-btn dense label="wprowadź" @click="getAccess(accessCode)"></q-btn>
    </div>
    <div v-if="access">
      <div class="q-pa-md">
        <q-uploader multiple style="max-width: 400px" method="POST" :url="('http://' + local + '/files/upload')"
                    label="Dodaj plik" accept=".jpg, image/*" @rejected="onRejected" field-name="file"
                    @added="file_selected"/>
      </div>
      <div class="row full-width bg-grey-5">
        <div class="self-center text-center col-1">
          <q-btn icon="arrow_left" :disable="pageNumber===0" @click="pageNumber=pageNumber-1;getAllFiles(pageNumber)"
                 class="full-width text-black" color="white"></q-btn>
        </div>
        <div class="self-center text-bold text-center col-10">STRONA {{ pageNumber + 1 }}</div>
        <div class="self-center text-center col-1">
          <q-btn icon="arrow_right"
                 @click="pageNumber=files.length===50?pageNumber+1:pageNumber;getAllFiles(pageNumber)"
                 :disabled="files.length!==50" class="full-width text-black" color="white"></q-btn>
        </div>
      </div>
      <div class="row">
        <q-field color="black" class="self-center col full-width no-outline text-bold text-center" dense
                 standout="bg-accent text-black" stack-label>
          <div class="col-5 self-center text-bold text-left">Nazwa pliku</div>
          <div class="col-1 self-center text-bold text-center">Data utworzenia</div>
          <div class="col-1 self-center text-bold text-center">Godzina utworzenia</div>
          <div class="col-1 self-center text-bold text-center">Rozmiar</div>
          <div class="col-2 self-center text-bold text-center">Typ</div>
          <div class="col-2 self-center text-center">
            <div>Pobierz plik</div>
          </div>
        </q-field>
      </div>
      <q-virtual-scroll :items="files" dense visible class="full-width" style="height: 80vh;">
        <template v-slot="{ item, index }">
          <div :key="index">
            <q-field color="black" dense
                     class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black"
                     stack-label>
              <q-tooltip v-if="item.type.includes('image')" :delay="750" @hide="url = ''"
                         @before-show="getUrl (item.uuid)" anchor="center middle" self="center middle"
                         transition-show="scale"
                         transition-hide="scale" content-style="width: 30%; height: 70%">
                <q-img :src="url" spinner-color="white" style="height: 100%; width: 100%"/>
              </q-tooltip>
              <div class="col-5 self-center text-bold text-justify">{{ index + 1 }} {{ item.name }}</div>
              <div class="col-1 self-center text-bold text-center">{{ item.date }}</div>
              <div class="col-1 self-center text-bold text-center">{{ item.time }}</div>
              <div class="col-1 self-center text-bold text-center">{{ item.size }}</div>
              <div class="col-2 self-center text-bold text-center">{{ item.type }}</div>
              <div class="col-2 q-pa-xs self-center text-center">
                <q-btn color="primary" dense @click="fileName = item.name;getFile (item.uuid)">pobierz plik</q-btn>
              </div>
            </q-field>
          </div>
        </template>
      </q-virtual-scroll>
      <q-dialog :position="'top'" v-model="success" @keypress.enter="success=false">
        <q-card>
          <q-card-section>
            <div v-if="message!=null" class="text-h6">{{ message }}</div>
          </q-card-section>

        </q-card>
      </q-dialog>
      <q-dialog v-model="failure" :position="'top'" @keypress.enter="failure=false">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ message }}</div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import App from 'src/App'

export default {
  name: 'Files.vue',
  created () {
    this.getAllFiles(this.pageNumber)
  },
  data () {
    return {
      access: false,
      accessCode: '',
      files: [],
      pageNumber: 0,
      url: '',
      fileName: '',
      accessMessage: '',
      selected_file: '',
      message: null,
      failure: false,
      success: false,
      local: App.host
    }
  },
  methods: {
    getAccess (accessCode) {
      fetch('http://' + this.local + '/users/getAccess?pinCode=' + accessCode, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.accessMessage = response
              this.access = true
            }
          )
        } else {
          response.text().then(
            response => {
              this.message = response
              this.accessMessage = response
            }
          )
        }
      }
      )
    },
    getAllFiles (pageNumber) {
      if (pageNumber < 0) {
        this.pageNumber = 0
      }
      fetch('http://' + this.local + '/files/getAllFiles?page=' + pageNumber + '&size=50', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.files = response
        })
    },
    getFile (uuid) {
      axios({
        url: 'http://' + this.local + '/files/getFile?uuid=' + uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', this.fileName)
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
    deleteFile (uuid) {
      fetch('http://' + this.local + '/files/deleteFile?uuid=' + uuid, {
        method: 'DELETE'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.getAllFiles()
              this.autoClose()
            }
          )
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    getUrl (uuid) {
      axios({
        url: 'http://' + this.local + '/files/getFile?uuid=' + uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        this.url = window.URL.createObjectURL(new Blob([response.data]))
      })
    },
    onRejected () {
      this.message = 'Coś poszło nie tak'
      this.failure = true
      this.autoClose()
    },
    file_selected (file) {
      this.selected_file = file[0]
    },
    autoClose () {
      setTimeout(() => {
        this.failure = false
        this.message = null
        this.success = false
      }, 1500)
    }
  }
}
</script>

<style scoped>

</style>
