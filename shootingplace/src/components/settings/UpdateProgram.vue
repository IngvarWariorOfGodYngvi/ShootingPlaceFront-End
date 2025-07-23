<template>
  <div class="bg-dark">
    <q-btn glossy label="aktualizuj program" color="primary" @click="updatingDialog = true" :loading="loading[0]"></q-btn>
    <q-dialog v-model="updatingDialog">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div class="text-h6 text-center">Aktualizacja Programu</div>
        </q-card-section>
        <q-card-section>
          <div>
            Aby zaktualizować program będzie potrzebny kod administracyjny<br/>
            W trakcie aktualizacji zostaną pobrane niezbędne pliki.<br/>
            - Do czasu pobrania plików program będzie funkcjonował, ale nie zaleca się używania/wprowadzania zmian.<br/>
            - W trakcie aktualizacji plików program przestanie działać.<br/>
            - Po pomyślnym zainstalowaniu plików strona zostanie zrestartowana.<br/>
            - W razie problemów z aktualizacją skontaktuj się z twórcą programu.<br/>
          </div>
        </q-card-section>
        <q-card-actions class="full-width">
          <q-btn glossy class="col" color="primary" label="kontynuuj aktualizację" @click="updating = true" v-close-popup></q-btn>
          <q-btn glossy class="text-right" color="secondary" label="anuluj" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="updating">
      <q-card class="bg-green-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter="progressUpdate(code); code = null; updating = false" autofocus type="password"
              v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn glossy label="anuluj" color="black" v-close-popup @click=" code = null" />
          <q-btn glossy label="Aktualizuj Program" color="black" v-close-popup
            @click="progressUpdate(code); code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="progress" persistent>
      <q-card :class="changeColor" style="min-width: 30vw;" class="text-center">
        <q-card-section>
          <div class="text-h6 text-center">{{ message }}</div>
          <CircularLoadingBox :color="color" class="col text-center"></CircularLoadingBox>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<style src="src\style\style.scss" lang="scss"></style>
<script>

import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'
import { ref } from 'vue'
export default {
  components: {
    CircularLoadingBox: lazyLoadComponent({
      componentFactory: () => import('src/utils/CircularLoadingBox.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      changeColor: '',
      color: 'primary',
      updatingDialog: false,
      networkStatusvar: true,
      updating: false,
      progress: false,
      code: null,
      message: null,
      success: false,
      failure: false,
      local: App.host,
      main: App.main
    }
  },
  setup () {
    const loading = ref([
      false
    ])
    function progressUpdate (code) {
      loading.value[0] = true
      this.updateProgram(code)
      setTimeout(() => {
        loading.value[0] = false
      }, 0)
    }
    return {
      progressUpdate,
      loading
    }
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    updateProgram (code) {
      fetch(`${this.local}/settings/update?pinCode=${code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.progress = true
          this.message = 'Rozpoczęto aktualizację programu - trwa pobieranie plików. Może to potrwać kilka minut.'
          this.checkingResponse()
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
    checkingResponse () {
      const time = 5000
      let val = 500
      const i1 = setInterval(() => {
        if (this.networkStatusvar) {
          this.networkStatusFunction()
        } else {
          this.message = 'Kończenie pobierania plików'
          clearInterval(i1)
          setInterval(() => {
            this.message = 'Aktualizowanie plików'
            val = val + (time / 10)
            this.changeColor = val % 1000 === 0 ? 'bg-primary text-white' : 'bg-secondary text-white'
            this.color = 'white'
            if (this.networkStatusvar === false) {
              this.networkStatusFunction()
            } else {
              this.progress = false
              this.message = 'Program został zaktualizowany'
              setTimeout(window.location.reload(), 10000)
            }
          }, time)
        }
      }, time)
    },
    networkStatusFunction () {
      fetch(`${this.local}/conf/ping`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            () => {
              this.networkStatusvar = true
            })
        } else {
          this.networkStatusvar = false
        }
      }).catch(() => {
        this.networkStatusvar = false
      })
    },
    autoClose () {
      setTimeout(() => {
        this.message = null
        this.failure = false
        this.success = false
        this.accept = false
      }, 2000)
    }
  },
  name: 'updateProgram'
}
</script>
