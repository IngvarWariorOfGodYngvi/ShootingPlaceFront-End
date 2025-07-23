<template>
  <div>
    <q-card-section class="bg-dark text-positive">
      <div class="row col text-bold q-pa-xs items-center">
        <div style="width: 5%">LP</div>
        <div class="col">Podpisane przez</div>
        <div class="col">Data</div>
        <div class="col">Godzina</div>
        <div class="col">Ilość</div>
      </div>
      <div class="row col q-pa-xs hover1 items-center" v-for="(item, index) in ammoInEvidence" :key="index"
        @dblclick="temp = item; recordInfo = true">
        <Tooltip2clickToShow/>
        <div style="width: 5%">{{ index + 1 }}</div>
        <div class="col">{{ item.signedBy }}</div>
        <div class="col">{{ item.date }}</div>
        <div class="col">{{ item.time.split('.')[0] }}</div>
        <div class="col">{{ item.quantity }}</div>
      </div>
    </q-card-section>
    <q-dialog v-model="recordInfo">
      <q-card class="bg-dark text-positive" style="min-width: 60vw" v-if="temp != null">
        <q-card-actions align="right">
          <div class="self-center col text-center text-h6 text-bold">Szczegóły wpisu</div>
          <q-btn color="primary" dense round icon="close" v-close-popup></q-btn>
        </q-card-actions>
        <q-card-section class="q-pb-md">
          <div class="row col text-bold">
            <div class="col-4">Nazwa<br/>Identyfikator</div>
            <div class="col">Ilość</div>
            <div class="col">Podpisane przez</div>
            <div class="col">Data</div>
            <div class="col">Godzina</div>
          </div>
          <div class="row col items-center">
            <div class="col-4">Kaliber {{temp.caliberName }}<br/><div class="text-caption text-grey">{{ temp.uuid }}</div></div>
            <div class="col">{{ temp.quantity }}</div>
            <div class="col">{{ temp.signedBy }}</div>
            <div class="col">{{ temp.date }}</div>
            <div class="col">{{ temp.time.split('.')[0] }}</div>
          </div>
          <div class="line"></div>
        </q-card-section>
        <q-card-section class="q-pt-md">
          <div class="row col text-bold">
            <div class="col">Nazwisko i imię</div>
            <div class="col">Numer Legitymacji / Identyfikator</div>
            <div class="col">Ilość</div>
          </div>
          <div class="row col" v-for="(item1, index1) in temp.ammoUsedToEvidenceDTOList" :key="index1">
            <div class="col">{{ item1.name }}</div>
            <div class="col" v-if="item1.legitimationNumber != null">{{ item1.legitimationNumber }}</div>
            <div class="col" v-else>{{ item1.idnumber }}</div>
            <div class="col">{{ item1.counter }}</div>
          </div>
          <div class="line"></div>
          <div>Podpis osoby uprawnionej</div>
          <q-img contain fit=none style="max-height: 40vh; border-radius: 5px" class="col bg-white"
          alt="podpis" :src="(`${local}/files/getFile?uuid=${temp.imageUUID}`)" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import App from 'src/App'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
export default {
  components: {
    Tooltip2clickToShow: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickToShow.vue'),
      loading: SkeletonBox
    })
  },
  created () {
    this.getAmmoInEvidece(this.uuid)
  },
  props: {
    uuid: {
      type: String,
      required: true
    }
  },
  watch: {
    uuid (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getAmmoInEvidece(this.uuid)
      }
    }
  },
  data () {
    return {
      ammoInEvidence: {},
      recordInfo: {},
      temp: null,
      failure: false,
      success: false,
      message: null,
      local: App.host,
      prod: App.prod
    }
  },
  methods: {
    getAmmoInEvidece (uuid) {
      fetch(`${this.local}/ammoEvidence/getAmmoInEvidece?caliberUUID=${uuid}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.ammoInEvidence = response
        })
    }
  }
}
</script>
