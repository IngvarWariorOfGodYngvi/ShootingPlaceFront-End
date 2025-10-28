<template>
  <q-page :id="mobile?'layout':''">
    <div class="row">
      <main-list>
      </main-list>
    <div class="col flex flex-center full-width q-pa-xl">
    <img draggable="false" class="fun col" style="border-radius: 50%" alt="logo" :src="change(shootingPlace)">
    <!-- <img v-if="!mobile && shootingPlace === 'test'" draggable="false" class="fun col" style="border-radius: 50%" alt="logo" src="~assets/logo1.jpg"> -->
    <!-- <img v-if="!mobile && shootingPlace === 'rcs'" draggable="false" class="fun col" style="border-radius: 50%" alt="logo" src="~assets/logo2.jpg"> -->
    <!-- <img v-if="!mobile && shootingPlace === 'uks'" draggable="false" class="fun col" style="border-radius: 50%" alt="logo" src="~assets/logo3.jpg"> -->
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
import { changeImage } from 'src/scripts/ChangeImages'
export default {
  name: 'PageIndex',
  data () {
    return {
      // shootingPlace: window.localStorage.getItem('shootingPlace'),
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
    change (shootingPlace) {
      const ret = changeImage(shootingPlace)
      console.log(ret)
      return changeImage(shootingPlace)
    }
  }
}
</script>
