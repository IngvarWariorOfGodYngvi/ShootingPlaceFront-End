<template>
  <q-page padding>
    <div v-if="!mobile&&main" class="q-pa-md">
      <DownloadBtn/>
    </div>
    <q-expansion-item label="Licencje nieważne" dense class="text-left text-h6 text-bold bg-dark text-positive round" group="list">
      <NotValidLicense></NotValidLicense>
    </q-expansion-item>
    <p></p>
    <q-expansion-item label="Licencje ważne" dense class="text-left text-h6 text-bold bg-dark text-positive round" group="list">
      <ValidLicense></ValidLicense>
    </q-expansion-item>
    <p></p>
    <q-expansion-item label="Licencje do opłacenia w PZSS" dense class="text-left text-h6 text-bold bg-dark text-positive round"
                      group="list">
      <AllLicensePayment></AllLicensePayment>
    </q-expansion-item>
    <p></p>
    <q-expansion-item label="Osoby z opłatą i bez licencji" dense class="text-left text-h6 text-bold bg-dark text-positive round"
                      group="list">
      <NotLicenseWithPayment></NotLicenseWithPayment>
    </q-expansion-item>
  </q-page>
</template>

<script>
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
// import { isWindows } from 'mobile-device-detect'
import App from 'src/App'

export default {
  components: {
    DownloadBtn: lazyLoadComponent({
      componentFactory: () => import('components/license/DownloadLicense.vue'),
      loading: SkeletonBox
    }),
    NotValidLicense: lazyLoadComponent({
      componentFactory: () => import('components/license/NotValidLicense.vue'),
      loading: SkeletonBox
    }),
    ValidLicense: lazyLoadComponent({
      componentFactory: () => import('components/license/ValidLicense.vue'),
      loading: SkeletonBox
    }),
    AllLicensePayment: lazyLoadComponent({
      componentFactory: () => import('components/license/AllLicensePayment.vue'),
      loading: SkeletonBox
    }),
    NotLicenseWithPayment: lazyLoadComponent({
      componentFactory: () => import('components/license/NotLicenseWithPayment.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      mobile: App.mobile,
      main: App.main
    }
  },
  name: 'license'
}
</script>
