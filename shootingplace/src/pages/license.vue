<template>
  <q-page padding>
    <div>
      <q-item>
        <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">Licencje</div>
      </q-item>
    </div>
    <div class="q-pa-md">
      <downloadBtn/>
    </div>
    <q-expansion-item label="Licencje nieważne" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
      <NotValidLicense></NotValidLicense>
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
import downloadBtn from 'components/DownloadLicense.vue'
import NotValidLicense from 'components/NotValidLicense.vue'
import ValidLicense from 'components/ValidLicense.vue'
import AllLicensePayment from 'components/AllLicensePayment.vue'

export default {
  components: {
    downloadBtn,
    NotValidLicense,
    ValidLicense,
    AllLicensePayment
  },
  name: 'license'
}
</script>
