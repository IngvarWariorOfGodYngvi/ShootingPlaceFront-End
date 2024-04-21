<template>
  <div>
    <div class="text-center">
      <q-circular-progress v-if="q=='przeliczanie'" color="primary" indeterminate/>
      <!-- <q-linear-progress v-if="q=='przeliczanie'" indeterminate color="primary" size="2px"/> -->
      <div v-else>{{ q }}</div>
    </div>
  </div>

  </template>
  <style src="src/style/style.scss" lang="scss">
  </style>
<script>
import App from 'src/App'

export default {
  name: 'contributions.vue',
  data () {
    return {
      quantityOnDate: this.createTodayDate(),
      q: 0,
      local: App.host
    }
  },
  props: {
    uuid: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    refresh: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    date (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getCaliberQuantityOnDate(this.uuid, newValue)
      }
    },
    refresh (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getCaliberQuantityOnDate(this.uuid, this.date)
      }
    }
  },
  created () {
    this.getCaliberQuantityOnDate(this.uuid, this.quantityOnDate)
  },
  methods: {
    getCaliberQuantityOnDate (caliberUUID, date) {
      this.q = 'przeliczanie'
      fetch(`http://${this.local}/armory/caliberQuantity?uuid=${caliberUUID}&date=${date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.q = response
          })
        } else {
          this.q = 'błąd'
        }
      }).catch(() => {
        this.q = 'błąd'
      })
    },
    createTodayDate () {
      const date = new Date()
      let month = 0
      let day = 0
      if ((date.getMonth() + 1) < 10) {
        month = '0' + (date.getMonth() + 1)
      } else {
        month = (date.getMonth() + 1)
      }
      if (date.getDate() < 10) {
        day = '0' + (date.getDate())
      } else {
        day = (date.getDate())
      }
      return date.getFullYear() + '-' + month + '-' + day
    }
  }
}
</script>
