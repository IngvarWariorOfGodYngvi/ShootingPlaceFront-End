<template>
  <div>
    <q-btn-dropdown glossy class="full-width" label="pakiety" color="primary" content-class="bg-dark">
      <div style="min-width: 30vw;">
        <q-item>
          <AddShootingPacket/>
        </q-item>
        <q-item v-if="main">
          <AddNewShootingPacket />
        </q-item>
      </div>
    </q-btn-dropdown>
  </div>
</template>
<script>

import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
export default {
  name: 'ShootingPackets',
  components: {
    AddNewShootingPacket: lazyLoadComponent({
      componentFactory: () => import('components/ammoList/AddNewShootingPacket.vue'),
      loading: SkeletonBox
    }),
    AddShootingPacket: lazyLoadComponent({
      componentFactory: () => import('components/ammoList/AddShootingPacket.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      main: App.main
    }
  }
}
</script>
