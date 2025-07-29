<template>
  <div class="bg-dark">
    <q-btn glossy color="primary" :loading="loading[0]" :disable="dis" label="Zmień tryb działania"
      @click="dialog = true" />
    <q-dialog v-model="dialog">
      <q-card>
        <q-card-actions align="right">
          <div class="text-bold text-h6 text-center col">Zmien Tryb Działania Programu na tym urządzeniu</div>
          <q-btn dense color="primary" round icon="close" @click="mode='none'" v-close-popup/>
        </q-card-actions>
        <q-card-section>
          <q-radio v-model="mode" :val="true" label="Główny - pełne możliwości programu" />
          <q-icon size="1em" name="info">
            <q-tooltip :offset="[30,30]" anchor="top middle" content-class="text-body2">Pełne możliwości programu są dostępne na komputerze</q-tooltip>
          </q-icon>
          <q-radio v-model="mode" :val="false" label="Podrzędny - ograniczone możliwości programu"/>
          <q-icon size="1em" name="info">
            <q-tooltip :offset="[30,30]" anchor="top middle" content-class="text-body2">Program ograniczony do podstawowych funkcji odczytywania informacji oraz wprowadzania wyników podczas zawodów</q-tooltip>
          </q-icon>
          <q-radio v-model="mode" :val="null" label="Książka Rejestru Pobytu Na Strzelnicy - Program ograniczony tylko do Książki" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn glossy dense color="secondary" label="anuluj" @click="mode='none'" v-close-popup />
          <q-btn glossy :disable="mode == 'none'" dense color="primary" label="zmien tryb" @click="acceptCode = true"
            v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="acceptCode" persistent>
      <q-card class="bg-green-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter=" simulateProgress(); acceptCode = false" autofocus type="password" v-model="code"
            filled color="Yellow" class="bg-yellow text-bold" inputmode="numeric" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn glossy label="anuluj" color="black" v-close-popup @click=" code = null" />
          <q-btn glossy label="zmien tryb" color="black" v-close-popup @click=" simulateProgress(); code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import App from 'src/App'
import { ref } from 'vue'
export default {
  setup () {
    const loading = ref([
      false
    ])
    function simulateProgress () {
      loading.value[0] = true
      this.changeProgramMode()
      setTimeout(() => {
        loading.value[0] = false
      }, 0)
    }

    return {
      loading,
      simulateProgress
    }
  },
  data () {
    return {
      mode: 'none',
      dis: false,
      dialog: false,
      acceptCode: false,
      success: false,
      failure: false,
      code: null,
      message: null,
      shootingPlace: App.shootingPlace,
      local: App.host
    }
  },
  methods: {
    changeProgramMode () {
      this.dis = true
      fetch(`${this.local}/settings/changeMode?pinCode=${this.code}`, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            window.localStorage.setItem('main', this.mode)
            this.message = response
            this.success = true
            this.autoClose()
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.autoClose()
          })
        }
      }).catch(() => {
        this.message = 'coś poszło nie tak'
        this.failure = true
        this.autoClose()
      })
    },
    autoClose () {
      setTimeout(() => {
        this.dis = false
        this.message = null
        this.success = false
        this.failure = false
      }, 2000)
    }
  }
}
</script>
