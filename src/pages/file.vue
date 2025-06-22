<template>
  <q-page padding>
    <Files></Files>
  </q-page>
</template>

<script>
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'
export default {
  name: 'File',
  components: {
    Files: lazyLoadComponent({
      componentFactory: () => import('components/Files.vue'),
      loading: SkeletonBox
    })
  }
}
</script>

<style scoped>

</style>
