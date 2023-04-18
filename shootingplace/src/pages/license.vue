<template>
  <q-page padding>
    <div>
      <q-item>
        <div class="text-center col full-width no-outline text-h4 text-bold text-positive" tabindex="0">Licencje</div>
      </q-item>
    </div>
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
    <p/>
    <q-expansion-item label="Licencje do opłacenia w PZSS" dense class="text-left text-h6 text-bold bg-dark text-positive round"
                      group="list">
      <AllLicensePayment></AllLicensePayment>
    </q-expansion-item>
    <Canva style="width: 50vw;height: 50%;max-width: 50vw;max-height: 50vh;"></Canva>
  </q-page>
</template>

<script>
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import { isWindows } from 'mobile-device-detect'
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
    Canva: lazyLoadComponent({
      componentFactory: () => import('components/signature/canvas.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      mobile: !isWindows,
      main: App.main
    }
  },
  name: 'license'
}
</script>
