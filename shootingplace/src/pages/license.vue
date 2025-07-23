<template>
  <q-page padding>
    <!-- <div v-if="!mobile&&main" class="q-pa-md row">
      <DownloadBtn class="q-pa-xs"/>
      <licenseXLSX class="q-pa-xs"/>
    </div> -->
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
    <q-expansion-item label="Osoby z opłatą i bez licencji (nowe)" dense class="text-left text-h6 text-bold bg-dark text-positive round"
                      group="list">
      <NotLicenseWithPayment></NotLicenseWithPayment>
    </q-expansion-item>
    <p></p>
    <q-expansion-item label="Osoby kwalifikujące się do przedłużenia licencji" dense class="text-left text-h6 text-bold bg-dark text-positive round"
                      group="list">
      <LicensesQualifyingToProlong></LicensesQualifyingToProlong>
    </q-expansion-item>
    <p></p>
    <q-expansion-item label="Osoby niekwalifikujące się do przedłużenia licencji" dense class="text-left text-h6 text-bold bg-dark text-positive round"
                      group="list">
      <LicensesNotQualifyingToProlong></LicensesNotQualifyingToProlong>
    </q-expansion-item>
    <p></p>
    <q-expansion-item label="Osoby bez patentu strzeleckiego" dense class="text-left text-h6 text-bold bg-dark text-positive round"
                      group="list">
      <MembersWithNoShootingPatent></MembersWithNoShootingPatent>
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
    // DownloadBtn: lazyLoadComponent({
    //   componentFactory: () => import('components/license/DownloadLicense.vue'),
    //   loading: SkeletonBox
    // }),
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
    }),
    LicensesQualifyingToProlong: lazyLoadComponent({
      componentFactory: () => import('components/license/LicensesQualifyingToProlong.vue'),
      loading: SkeletonBox
    }),
    // LicenseXLSX: lazyLoadComponent({
    //   componentFactory: () => import('components/license/LicenseXLSX.vue'),
    //   loading: SkeletonBox
    // }),
    LicensesNotQualifyingToProlong: lazyLoadComponent({
      componentFactory: () => import('components/license/LicensesNotQualifyingToProlong.vue'),
      loading: SkeletonBox
    }),
    MembersWithNoShootingPatent: lazyLoadComponent({
      componentFactory: () => import('components/license/MembersWithNoShootingPatent.vue'),
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
