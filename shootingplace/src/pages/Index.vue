<template>
  <q-page>
    <div class="row">
      <main-list>
      </main-list>
    <div class="col flex flex-center full-width q-pa-xl">
    <img draggable="false" class="fun" alt="logo" src="~assets/logo.jpg">
    </div>
    </div>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss">
</style>
<script>
import App from 'src/App.vue'
import MainList from 'src/components/MainList.vue'
export default {
  name: 'PageIndex',
  data () {
    return {
      app: 'http://' + App.prod
    }
  },
  components: {
    MainList
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 500)
    }
  }
}
</script>
