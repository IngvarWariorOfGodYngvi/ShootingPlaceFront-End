<template>
  <div>
    <div v-if="!access">
      <q-input color="positive" label-color="positive" input-class="text-positive" dense v-model="accessCode" label="wprowadź kod" type="password" mask="####"
               @keypress.enter="getAccess(accessCode)" filled></q-input>
      <q-item dense>{{ accessMessage }}</q-item>
      <q-btn color="primary" text-color="white" dense label="wprowadź" @click="getAccess(accessCode)"></q-btn>
    </div>
    <div v-if="access">
      <div class="q-pa-md">
        <q-uploader multiple style="max-width: 400px" method="POST" :url="(`${local}/files/upload`)"
                    label="Dodaj plik" accept=".jpg, image/*" @rejected="onRejected" field-name="file"
                    @added="file_selected"/>
      </div>
      <div class="row reverse"><q-btn dense style="size: 2em;" @click="showloading();pageNumber=selectedPage-1;getAllFiles(pageNumber)" label="wybierz"/><q-input v-model="selectedPage" type="number" min="1" :max="pagesMaxNumber"  dense label="idź do:" stack-label/></div>
      <div class="self-center text-bold text-center bg-grey-5 text-h6">STRONA {{ pageNumber + 1 }} z {{ pagesMaxNumber }}</div>
      <div class="row full-width bg-grey-5">
        <div class="self-center text-center col-1">
          <q-btn icon="arrow_left" :disable="pageNumber===0" @click="showloading();pageNumber=pageNumber-1;getAllFiles(pageNumber)"
                 class="full-width text-black" color="white"></q-btn>
        </div>
        <div class="self-center text-bold text-center row col-3">
          <q-btn class="text-black col" color="white" @click="pageNumber=0,showloading(),getAllFiles(0)" label="1"/>
          <q-btn class="text-black col" color="white" @click="pageNumber=4,showloading(),getAllFiles(4)" label="5"/>
          <q-btn class="text-black col" color="white" @click="pageNumber=14,showloading(),getAllFiles(14)" label="15"/>
        </div>
        <div class="self-center text-bold text-center col"><q-btn class="text-black full-width" color="white" @click="pageNumber=Math.ceil(pagesMaxNumber/2)-1,showloading(),getAllFiles(Math.ceil(pagesMaxNumber/2))" :label="Math.ceil(pagesMaxNumber/2)"/></div>
        <div class="self-center text-bold text-center row col-3">
          <q-btn class="text-black col" color="white" @click="pageNumber=pagesMaxNumber-16,showloading(),getAllFiles(pagesMaxNumber-16)" :label="pagesMaxNumber-15"/>
          <q-btn class="text-black col" color="white" @click="pageNumber=pagesMaxNumber-6,showloading(),getAllFiles(pagesMaxNumber-6)" :label="pagesMaxNumber-5"/>
          <q-btn class="text-black col" color="white" @click="pageNumber=pagesMaxNumber-1,showloading(),getAllFiles(pagesMaxNumber-1)" :label="pagesMaxNumber"/>
        </div>
        <div class="self-center text-center col-1">
          <q-btn icon="arrow_right"
                 @click="showloading();pageNumber=files.length===50?pageNumber+1:pageNumber;getAllFiles(pageNumber)"
                 :disabled="files.length!==50" class="full-width text-black" color="white"></q-btn>
        </div>
      </div>
      <div class="row text-positive q-pa-md">
        <div color="positive" class="self-center col row text-bold text-center">
          <div class="col-5 self-center text-bold text-left">Nazwa pliku</div>
          <div class="col-1 self-center text-bold text-center">Data utworzenia</div>
          <div class="col-1 self-center text-bold text-center">Godzina utworzenia</div>
          <div class="col-1 self-center text-bold text-center">Rozmiar KB</div>
          <div class="col-2 self-center text-bold text-center">Typ</div>
          <div class="col-2 self-center text-center">
            <div>Pobierz plik</div>
          </div>
        </div>
      </div>
      <q-virtual-scroll :items="files" dense visible class="full-width text-positive" style="height: 80vh;">
        <template v-slot="{ item, index }">
          <div :key="index">
            <div class="self-center col text-bold text-center q-pa-xs row hover1">
              <q-tooltip v-if="item.type.includes('image')" :delay="750" @hide="url = ''"
                         @before-show="getUrl (item.uuid)" anchor="center middle" self="center middle"
                         transition-show="scale"
                         transition-hide="scale" content-style="width: 30%; height: 70%">
                <q-img :src="url" spinner-color="white" style="height: 100%; width: 100%"/>
              </q-tooltip>
              <div class="col-5 self-center text-bold text-justify">{{ (index + 1) + ((pageNumber)*50) }} {{ item.name }}</div>
              <div class="col-1 self-center text-bold text-center">{{ item.date }}</div>
              <div class="col-1 self-center text-bold text-center">{{ item.time }}</div>
              <div class="col-1 self-center text-bold text-center">{{ Math.round((item.size / 1024)).toFixed(0) }}</div>
              <div class="col-2 self-center text-bold text-center">{{ item.type }}</div>
              <div class="col-2 q-pa-xs self-center text-center">
                <q-btn color="primary" dense @click="showloading();fileName = item.name;getFile (item.uuid)">pobierz plik</q-btn>
              </div>
            </div>
          </div>
        </template>
      </q-virtual-scroll>
      <q-dialog position="top" v-model="success" @keypress.enter="success=false">
        <q-card>
          <q-card-section>
            <div v-if="message!=null" class="text-h6">{{ message }}</div>
          </q-card-section>

        </q-card>
      </q-dialog>
      <q-dialog v-model="failure" position="standard" @keypress.enter="failure=false">
        <q-card class="bg-warning">
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
    this.countPages()
  },
  data () {
    return {
      access: false,
      accessCode: '',
      files: [],
      pageNumber: 0,
      selectedPage: 1,
      url: '',
      fileName: '',
      accessMessage: '',
      selected_file: '',
      pagesMaxNumber: 0,
      message: null,
      failure: false,
      success: false,
      visible: false,
      local: App.host
    }
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      let time = 200
      this.timer = setTimeout(() => {
        if (!this.visible) {
          this.$q.loading.hide()
          this.timer = 0
        } else {
          time = 200
        }
      }, time)
    },
    countPages () {
      fetch(`${this.local}/files/countPages`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.pagesMaxNumber = response
        })
    },
    getAccess (accessCode) {
      fetch(`${this.local}/users/getAccess?pinCode=${accessCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.getAllFiles(this.pageNumber)
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
      fetch(`${this.local}/files/getAllFiles?page=${pageNumber}&size=50`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.files = response
          this.visible = false
        })
    },
    getFile (uuid) {
      axios({
        url: `${this.local}/files/getFile?uuid=${uuid}`,
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
      fetch(`${this.local}/files/deleteFile?uuid=${uuid}`, {
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
        url: `${this.local}/files/getFile?uuid=${uuid}`,
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
