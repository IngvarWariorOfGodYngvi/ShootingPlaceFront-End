<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30em">
        !!! 404 !!!
      </div>

      <div class="text-h2" style="opacity:.4">
        Uuups. Nic tu nie ma...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        :to="fs ? '/firstStart' : '/'"
        label="Strona główna"
        no-caps
      />
    </div>
  </div>
</template>

<script >
import App from 'src/App'

export default {
  name: 'Error404',
  data () {
    return {
      fs: null
    }
  },
  created () {
    this.getFs()
  },
  methods: {
    getFs () {
      fetch(`${App.host}/conf/fs`, {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.fs = JSON.parse(response)
            console.log(this.fs)
          })
        }
      })
    }
  }
}
</script>
