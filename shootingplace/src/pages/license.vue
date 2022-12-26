<template>
  <q-page padding>
    <div>
      <q-item>
        <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">Licencje</div>
      </q-item>
    </div>
    <div class="q-pa-md">
      <DownloadBtn/>
    </div>
    <q-expansion-item label="Licencje nieważne" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
      <NotValidLicense ></NotValidLicense>
    </q-expansion-item>
    <p></p>
    <q-expansion-item label="Licencje ważne" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
      <ValidLicense></ValidLicense>
    </q-expansion-item>
    <p/>
    <q-expansion-item label="Licencje do opłacenia w PZSS" dense class="text-left text-h6 text-bold bg-grey-3"
                      group="list">
      <AllLicensePayment></AllLicensePayment>
    </q-expansion-item>
  </q-page>
</template>

<script>
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'

export default {
  components: {
    DownloadBtn: lazyLoadComponent({
      componentFactory: () => import('components/DownloadLicense.vue'),
      loading: SkeletonBox
    }),
    NotValidLicense: lazyLoadComponent({
      componentFactory: () => import('components/NotValidLicense.vue'),
      loading: SkeletonBox
    }),
    ValidLicense: lazyLoadComponent({
      componentFactory: () => import('components/ValidLicense.vue'),
      loading: SkeletonBox
    }),
    AllLicensePayment: lazyLoadComponent({
      componentFactory: () => import('components/AllLicensePayment.vue'),
      loading: SkeletonBox
    })
  },
  name: 'license'
}
</script>
