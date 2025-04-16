<template>
  <q-page :id="mobile?'layout':''">
    <div class="row">
      <main-list>
      </main-list>
    <div class="col flex flex-center full-width q-pa-xl">
    <img v-if="!mobile && shootingPlace === 'prod'" draggable="false" class="fun col" style="border-radius: 50%" alt="logo" src="~assets/logo.jpg" loading="lazy">
    <img v-if="!mobile && shootingPlace === 'rcs'" draggable="false" class="fun col" style="border-radius: 50%" alt="logo" src="~assets/logo-panaszew.jpg" loading="lazy">
    </div>
    </div>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss">
</style>
<script>
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
// import { isWindows } from 'mobile-device-detect'
export default {
  name: 'PageIndex',
  data () {
    return {
      shootingPlace: App.shootingPlace,
      mobile: App.mobile
    }
  },
  components: {
    MainList: lazyLoadComponent({
      componentFactory: () => import('src/components/MainList.vue'),
      loading: SkeletonBox
    })
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
