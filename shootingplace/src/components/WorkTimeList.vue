<template>
  <div class="q-pa-sm text-white bg-secondary">
    <div class="bg-secondary">
        <q-input v-model="number" class="text-white" type="password" dense label-color="white"
                 label="Czas pracy - zeskanuj swoją kartę tutaj" filled @keypress.enter="goToWork(number)"></q-input>
      <div v-for="(item,index) in usersInWork" :key="index" class="full-width" style="height: auto">
          <q-item :key="index" dense style="padding:0 0 0 5%;font-size:small;font-weight: 500;">
            {{ item }}
          </q-item>
      </div>
    </div>
    <div>
      <q-dialog position="top" v-model="failure">
        <q-card>
          <q-card-section>
            <div v-if="message!=null" class="text-h6">{{ message }}</div>
          </q-card-section>

        </q-card>
      </q-dialog>
      <q-dialog position="top" v-model="success">
        <q-card>
          <q-card-section>
            <div v-if="message!=null" class="text-h6">{{ message }}</div>
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
      message: '',
      local: App.host
    }
  },
  methods: {
    goToWork (number) {
      fetch('http://' + this.local + '/work/?number=' + number, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.getAllUsersInWork()
            this.message = response
            this.success = true
            this.autoClose()
          })
        }
        if (response.status === 400) {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.autoClose()
          })
        }
      })
    },
    getAllUsersInWork () {
      fetch('http://' + this.local + '/work/', {
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
