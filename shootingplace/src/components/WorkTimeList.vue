<template>
  <div class="q-pa-sm text-white bg-secondary">
    <div class="bg-secondary">
      <div>
        <q-inner-loading
                :showing="visible"
                label="Przetwarzanie..."
                color="primary"/>
        <q-input id="workTime" name="workTime" v-model="number" class="text-white" :disable="dis" type="password" dense label-color="white"
        label="Czas pracy - zeskanuj swoją kartę tutaj" input-class="text-white" filled
        @keypress.enter="dis=true;goToWork(number)"/>
        <div v-for="(item, index) in usersInWork" :key="index" class="full-width" style="height: auto">
          <q-item dense style="padding:0 0 0 5%;font-size:small;font-weight: 500;">
            {{ item }}
          </q-item>
      </div>
    </div>
    </div>
    <div>
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
  </div>
</template>

<script>
import App from 'src/App.vue'

export default {
  name: 'WorkTimeList',
  created () {
    this.getAllUsersInWork()
  },
  data () {
    return {
      color: 'primary',
      number: '',
      usersInWork: [],
      success: false,
      failure: false,
      dis: false,
      visible: false,
      message: '',
      local: App.host
    }
  },
  methods: {
    goToWork (number) {
      this.visible = true
      fetch(`http://${this.local}/work/?number=${number}`, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            setTimeout(() => {
              this.visible = false
              this.getAllUsersInWork()
              this.message = response
              this.success = true
              this.dis = false
              this.autoClose()
            }, 1500)
          })
        }
        if (response.status === 400) {
          response.text().then(response => {
            setTimeout(() => {
              this.visible = false
              this.message = response
              this.failure = true
              this.dis = false
              this.autoClose()
            }, 1500)
          })
        }
      }).catch(() => {
        setTimeout(() => {
          this.visible = false
          this.message = 'błąd'
          this.failure = true
          this.dis = false
          this.autoClose()
        }, 1500)
      })
    },
    getAllUsersInWork () {
      fetch(`http://${this.local}/work/`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.usersInWork = response
        })
    },
    autoClose () {
      setTimeout(() => {
        this.failure = false
        this.success = false
        this.message = null
        this.number = ''
      }, 2000)
    }
  }
}

</script>
