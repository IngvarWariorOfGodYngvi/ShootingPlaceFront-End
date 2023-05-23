<template>
  <q-page padding>
    <q-expansion-item label="Składki" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
      <Contributions></Contributions>
    </q-expansion-item>
    <p></p>
    <q-expansion-item label="Zapisy do klubu" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
      <SignUps></SignUps>
    </q-expansion-item>
    <p></p>
    <q-expansion-item label="Opłaty za licencje" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
      <LicensePayments></LicensePayments>
    </q-expansion-item>
    <p></p>
    <q-expansion-item label="Osoby skreślone" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
      <ErasedMembers></ErasedMembers>
    </q-expansion-item>
    <p></p>
    <q-expansion-item label="Klubowicze i amunicja" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
      <MembersAndAmmo></MembersAndAmmo>
    </q-expansion-item>
    <p></p>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss">

</style>
<script>

import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'

export default {
  components: {
    Contributions: lazyLoadComponent({
      componentFactory: () => import('components/statistics/Contributions.vue'),
      loading: SkeletonBox
    }),
    ErasedMembers: lazyLoadComponent({
      componentFactory: () => import('components/statistics/ErasedMembers.vue'),
      loading: SkeletonBox
    }),
    SignUps: lazyLoadComponent({
      componentFactory: () => import('components/statistics/SignUps.vue'),
      loading: SkeletonBox
    }),
    LicensePayments: lazyLoadComponent({
      componentFactory: () => import('components/statistics/LicensePayments.vue'),
      loading: SkeletonBox
    }),
    MembersAndAmmo: lazyLoadComponent({
      componentFactory: () => import('components/statistics/MembersAndAmmo.vue'),
      loading: SkeletonBox
    })
  },
  name: 'statistics'
}
</script>
