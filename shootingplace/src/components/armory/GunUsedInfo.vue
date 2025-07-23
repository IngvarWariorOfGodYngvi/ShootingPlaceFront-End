<template>
  <div style="min-width: 75vw;">
    <q-card class="bg-dark text-positive" v-if="gunUsed != null">
      <q-card-actions align="right">
        <div class="text-bold text-h6 text-center col">Szczegóły wpisu</div>
        <q-btn dense color="primary" icon="close" round v-close-popup></q-btn>
      </q-card-actions>
      <q-card-section>
        <div>
          <div class="row items-center col text-positive text-bold text-body2 q-pa-xs">
            <div class="col">Data i<br />Godzina Wydania</div>
            <div class="col">Marka i Model</div>
            <div class="col">Kaliber /<br />rok produkcji</div>
            <div class="col">Numer i Seria</div>
            <div class="col">Ilość Magazynków</div>
            <div class="col">Numer<br />Świadectwa Broni</div>
            <div class="col">Data i<br />Godzina Przyjęcia</div>
          </div>
          <div class="row items-center col text-bold text-body2 q-pa-xs">
            <div class="col">
              <div>{{ gunUsed.issuanceDate }}</div>
              <div>{{ gunUsed.issuanceTime }}</div>
            </div>
            <div class="col">{{ gunUsed.gun.modelName }}</div>
            <div class="col">
              <div>{{ gunUsed.gun.caliber }}</div>
              <div>{{ gunUsed.gun.productionYear }}</div>
            </div>
            <div class="col">{{ gunUsed.gun.serialNumber }}</div>
            <div class="col">{{ gunUsed.gun.numberOfMagazines }}</div>
            <div class="col">{{ gunUsed.gun.gunCertificateSerialNumber }}</div>
            <div class="col">
              <div>{{ gunUsed.acceptanceDate }}</div>
              <div>{{ gunUsed.acceptanceTime }}</div>
            </div>
          </div>
          <div class="line q-mb-xs"></div>
        </div>
        <div class=" row col text-bold">
          <div class="col-2">Uwagi:</div>
          <div class="col">{{ gunUsed.adnotation }}</div>
          <div class="col"></div>
        </div>
        <div class="row col items-center text-bold">
          <div class="col-2">Imię i Nazwisko<br />Pobierającego Broń</div>
          <div class="col">{{ gunUsed.gunTakerName }}</div>
          <q-img contain style="max-height: 10vh; border-radius: 5px; border: 1px solid black; " class="col-4 bg-white"
            alt="zdjęcie osoby pobierającej broń" :src="(`${local}/files/getFile?uuid=${gunUsed.gunTakerSign}`)" />
        </div>
        <div class="row col items-center text-bold">
          <div class="col-2">Imię i Nazwisko<br />Wydającego Broń</div>
          <div class="col">{{ gunUsed.issuanceBy }}</div>
          <q-img contain style="max-height: 10vh; border-radius: 5px; border: 1px solid black; " class="col-4 bg-white"
            alt="zdjęcie osoby pobierającej broń" :src="(`${local}/files/getFile?uuid=${gunUsed.issuanceSign}`)" />
        </div>
        <div class="row col items-center text-bold">
          <div class="col-2">Imię i Nazwisko<br />Zdającego Broń</div>
          <div class="col">{{ gunUsed.gunReturnerName }}</div>
          <q-img contain style="max-height: 10vh; border-radius: 5px; border: 1px solid black; " class="col-4 bg-white"
            alt="zdjęcie osoby pobierającej broń" :src="(`${local}/files/getFile?uuid=${gunUsed.gunReturnerSign}`)" />
        </div>
        <div class="row col items-center text-bold">
          <div class="col-2">Imię i Nazwisko<br />Odbierającego Broń</div>
          <div class="col">{{ gunUsed.acceptanceBy }}</div>
          <q-img contain style="max-height: 10vh; border-radius: 5px; border: 1px solid black; " class="col-4 bg-white"
            alt="zdjęcie osoby odbierającej broń" :src="(`${local}/files/getFile?uuid=${gunUsed.acceptanceSign}`)" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<style src="src/style/style.scss" lang="scss"></style>
<script>
import App from 'src/App.vue'
export default {
  created () {
    this.getGunUsedByUUID(this.uuid)
  },
  data () {
    return {
      gunUsed: null,
      main: App.main,
      local: App.host
    }
  },
  props: {
    uuid: {
      type: String,
      required: true
    },
    load: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    uuid (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getGunUsedByUUID(this.uuid)
      }
    },
    load (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getGunUsedByUUID(this.uuid)
      }
    }
  },
  methods: {
    getGunUsedByUUID (uuid) {
      fetch(`${this.local}/armory/getGunUsedByUUID?gunUsedUUID=${uuid}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.gunUsed = response
        })
    }
  }
}
</script>
