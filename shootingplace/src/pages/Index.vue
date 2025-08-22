<template>
  <q-page :id="mobile?'layout':''">
    <div class="row">
      <main-list>
      </main-list>
    <div class="col flex flex-center full-width q-pa-xl">
    <img v-if="!mobile && shootingPlace === 'prod'" draggable="false" class="fun col" style="border-radius: 50%" alt="logo" src="~assets/logo.jpg">
    <img v-if="!mobile && shootingPlace === 'test'" draggable="false" class="fun col" style="border-radius: 50%" alt="logo" src="~assets/logo1.jpg">
    <img v-if="!mobile && shootingPlace === 'rcs'" draggable="false" class="fun col" style="border-radius: 50%" alt="logo" src="~assets/logo2.jpg">
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
export default {
  name: 'PageIndex',
  data () {
    return {
      shootingPlace: window.localStorage.getItem('shootingPlace'),
      mobile: App.mobile
    }
  },
  components: {
    MainList: lazyLoadComponent({
      componentFactory: () => import('src/components/MainList.vue'),
      loading: SkeletonBox
    })
  }
}
</script>
