<template>
  <div>
    <q-card class="bg-dark text-positive row">
      <q-card-section class="col-7 border-primary" style="border-right: 2px solid;">
        <div class="full-width text-center">Ustaw nowe połączenie</div>
        <q-form>
          <div class="row items-center">
            <q-input v-model="host" class="col" input-class="text-positive" dense label="host" label-color="positive"
              filled />
            <div class="col">Nazwa hosta - np. smtp.domena.pl</div>
          </div>
          <div class="row items-center">
            <q-input v-model="port" class="col" input-class="text-positive" dense label="numer portu"
              label-color="positive" filled />
            <div class="col">Numer portu - np. 587</div>
          </div>
          <div class="row items-center">
            <q-input v-model="username" class="col" input-class="text-positive" dense label="nazwa użytkownika (e-mail)"
              label-color="positive" filled />
            <div class="col">Nazwa użytkownika - np. automat@domena.pl</div>
          </div>
          <div class="row items-center">
            <q-input v-model="password" class="col" input-class="text-positive" type="password" dense label="hasło"
              label-color="positive" filled />
            <div class="col">Hasło do poczty e-mail</div>
          </div>
          <div class="row items-center">
            <q-input v-model="connectionName" class="col" input-class="text-positive" dense label="Nazwa połączenia"
              label-color="positive" filled />
            <div class="col">Nazwa do celów identyfikacyjnych</div>
          </div>
          <div align="right" class="q-pa-md">
            <q-btn glossy label="zapisz połącznenie" color="primary" rounded @click="dis = true; save = true" />
          </div>
        </q-form>
      </q-card-section>
      <q-card-section class="col-5">
        <div class="full-width text-center">Zapisane połączenia</div>
        <div v-for="(item, index) in connectionList" :key="index" class="col items-center">
          <q-btn glossy class="q-ma-xs full-width" dense rounded color="primary" :label="item.connectionName"
            @click="temp = item; connection = true" />
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="connection">
      <q-card v-if="temp != null" class="bg-dark text-positive" style="min-width: 50vw;">
        <q-card-actions align="right" class="q-pa-xs q-ma-xs">
          <div class="text-h6 text-bold text-center col">Informacje o połączeniu: {{ temp.connectionName }}</div>
          <q-btn icon="close" color="primary" round dense v-close-popup/>
        </q-card-actions>
        <q-card-section class="row">
          <div class="col">
            <div>nazwa: {{ temp.connectionName }}</div>
            <div>identyfikator: {{ temp.uuid }}</div>
            <div>host: {{ temp.host }}</div>
            <div>port: {{ temp.port }}</div>
            <div>nazwa użytkownika: {{ temp.username }}</div>
          </div>
          <div class="col">
            <q-toggle v-for="(index, item) in emailSendList" :key="item" class="full-width" :value="index" @input="setMailingConfigList(item)">{{item }}</q-toggle>
          </div>
        </q-card-section>
        <q-card-section>
          <q-btn glossy class="q-mr-md" label="testuj" color="primary" rounded @click="testConnection = true"/>
          <q-btn glossy class="q-mr-md" label="Edytuj" color="primary" rounded @click="editConnection = true"/>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="testConnection">
      <q-card v-if="temp!=null" class="bg-dark text-positive" style="min-width: 50vw;">
        <q-card-actions align="right" class="q-pa-xs q-ma-xs">
          <div class="text-h6 text-bold text-center col">Test połączenia: {{ temp.connectionName }}</div>
          <q-btn icon="close" color="primary" round dense v-close-popup/>
        </q-card-actions>
        <q-card-section>
          <q-input v-model="testEmail" label="adres e-mail" class="q-ma-md border-secondary" style="border: 2px solid" label-color="positive" input-class="text-positive" dense filled/>
          <q-btn glossy color="primary" class="q-ma-md" rounded :label="`wyślij test na adres: ${testEmail}`" @click="sendTestEmail()"/>
          <q-btn glossy color="primary" class="q-ma-md" rounded :label="`wyślij przypomnienie o składce dla nieaktywnych`" @click="sendManualRemindersForNonActive()"/>
          <q-btn glossy color="primary" class="q-ma-md" rounded :label="`wyślij przypomnienie o składce dla aktywnych`" @click="manualRemindersForActive()"/>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editConnection">
      <q-card v-if="temp!=null" class="bg-dark text-positive" style="min-width: 50vw;">
        <q-card-actions align="right" class="q-pa-xs q-ma-xs">
          <div class="text-h6 text-bold text-center col">Edytuj połączenie: {{ temp.connectionName }}</div>
          <q-btn icon="close" color="primary" round dense v-close-popup/>
        </q-card-actions>
        <q-card-section>
        <q-form>
          <div class="row items-center">
            <q-input v-model="hostEdit" class="col" input-class="text-positive" dense label="host" label-color="positive"
              filled />
            <div class="col">Nazwa hosta - np. smtp.domena.pl</div>
          </div>
          <div class="row items-center">
            <q-input v-model="portEdit" class="col" input-class="text-positive" dense label="numer portu"
              label-color="positive" filled />
            <div class="col">Numer portu - np. 587</div>
          </div>
          <div class="row items-center">
            <q-input v-model="usernameEdit" class="col" input-class="text-positive" dense label="nazwa użytkownika (e-mail)"
              label-color="positive" filled />
            <div class="col">Nazwa użytkownika - np. automat@domena.pl</div>
          </div>
          <div class="row items-center">
            <q-input v-model="passwordEdit" class="col" input-class="text-positive" type="password" dense label="hasło"
              label-color="positive" filled />
            <div class="col">Hasło do poczty e-mail</div>
          </div>
          <div class="row items-center">
            <q-input v-model="connectionNameEdit" class="col" input-class="text-positive" dense label="Nazwa połączenia"
              label-color="positive" filled />
            <div class="col">Nazwa do celów identyfikacyjnych</div>
          </div>
          <div align="right" class="q-pa-md">
            <q-btn glossy label="zapisz połącznenie" color="primary" rounded @click="dis = true; saveEdit = true" />
          </div>
        </q-form>
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
    <q-dialog v-model="save" persistent>
      <q-card class="bg-green-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter="simulateProgress(); save = false" autofocus type="password" v-model="code" filled
              color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn glossy label="anuluj" color="black" v-close-popup @click="code = null" />
          <q-btn glossy label="zapisz" color="black" v-close-popup @click="simulateProgress()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="saveEdit" persistent>
      <q-card class="bg-green-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter="simulateProgressEdit(); saveEdit = false" autofocus type="password" v-model="code" filled
              color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn glossy label="anuluj" color="black" v-close-popup @click="code = null" />
          <q-btn glossy label="zapisz" color="black" v-close-popup @click="simulateProgressEdit()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import App from 'src/App.vue'
export default {
  name: 'EmailConnectManage.vue',
  data () {
    return {
      temp: null,
      testEmail: '',
      testConnection: false,
      editConnection: false,
      connection: false,
      save: false,
      saveEdit: false,
      connectionList: [],
      emailSendList: [],
      connectionName: null,
      host: null,
      port: null,
      username: null,
      password: null,
      connectionNameEdit: null,
      hostEdit: null,
      portEdit: null,
      usernameEdit: null,
      passwordEdit: null,
      code: null,
      dis: false,
      failure: false,
      success: false,
      message: null,
      loading: [false],
      local: App.host
    }
  },
  created () {
    this.getConnections()
    this.getMailingConfigList()
  },
  setup () {
    function simulateProgress () {
      this.loading[0] = true
      if (this.dis) {
        this.saveConnection()
      }
      setTimeout(() => {
        this.loading[0] = false
      }, 1000)
    }
    function simulateProgressEdit () {
      this.loading[0] = true
      if (this.dis) {
        this.saveEditConnection()
      }
      setTimeout(() => {
        this.loading[0] = false
      }, 1000)
    }
    return {
      simulateProgress,
      simulateProgressEdit
    }
  },
  methods: {
    getConnections () {
      fetch(`${this.local}/email`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.connectionList = response
        })
    },
    setMailingConfigList (key) {
      this.emailSendList[key] = !this.emailSendList[key]
      fetch(`${this.local}/email/mailingConfigList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.emailSendList)
      }).then(response => {
        if (response.status === 200) {
          response.text().then(() => {
            this.autoClose()
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.autoClose()
          })
        }
      }).catch(() => {
        this.message = 'coś jest nie tak'
        this.failure = true
        this.autoClose()
      })
    },
    getMailingConfigList () {
      fetch(`${this.local}/email/mailingConfigList`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.emailSendList = response
        })
    },
    sendTestEmail () {
      const data = {
        to: this.testEmail,
        subject: 'test',
        htmlContent: 'test',
        attachments: [],
        inlineImages: []
      }
      fetch(`${this.local}/email/test`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
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
    sendManualRemindersForNonActive () {
      fetch(`${this.local}/email/manualRemindersForNonActive`, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
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
    manualRemindersForActive () {
      fetch(`${this.local}/email/manualRemindersForActive`, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
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
    saveConnection () {
      const data = {
        connectionName: this.connectionName,
        host: this.host,
        port: this.port,
        username: this.username,
        password: this.password,
        auth: true,
        starttls: true,
        sslTrust: '*'
      }
      fetch(`${this.local}/email?pinCode=${this.code}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
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
    saveEditConnection () {
      const data = {
        connectionName: this.connectionNameEdit,
        host: this.hostEdit,
        port: this.portEdit,
        username: this.usernameEdit,
        password: this.passwordEdit,
        auth: true,
        starttls: true,
        sslTrust: '*'
      }
      fetch(`${this.local}/email/edit?pinCode=${this.code}&uuid=${this.temp.uuid}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.getConnections()
              this.message = response
              this.success = true
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
    autoClose () {
      setTimeout(() => {
        this.dis = false
        this.failure = false
        this.success = false
        this.loading = [false]
      }, 2000)
    }
  }
}

</script>
