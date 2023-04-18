<template>
  <div>
    <Canva style="height: 100%;width: 100%; max-width: 100%; max-height: 100%"></Canva>
  </div>
</template>

<script>
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import { isWindows } from 'mobile-device-detect'
export default {
  name: 'SignatuePage.vue',
  data () {
    return {
      mobile: !isWindows,
      app: 'http://' + App.prod
    }
  },
  components: {
    Canva: lazyLoadComponent({
      componentFactory: () => import('components/signature/canvas.vue'),
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

<style scoped>

</style>
