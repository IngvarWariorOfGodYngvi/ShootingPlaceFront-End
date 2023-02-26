<template>
  <q-page :id="mobile?'layout':''">
    <div class="row">
      <main-list>
      </main-list>
    <div class="col flex flex-center full-width q-pa-xl">
    <img v-if="!mobile" draggable="false" class="fun" alt="logo" src="~assets/logo.jpg">
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
import { isWindows } from 'mobile-device-detect'
export default {
  name: 'PageIndex',
  data () {
    return {
      mobile: !isWindows,
      app: 'http://' + App.prod
    }
  },
  components: {
    MainList: lazyLoadComponent({
      componentFactory: () => import('components/MainList.vue'),
      loading: SkeletonBox
    })
  },
  // computed: {
  //   backgroundImageInlineStyle () {
  //     return `background-image: url("./assets/${this.news.img}");`;
  //   }
  // },
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
