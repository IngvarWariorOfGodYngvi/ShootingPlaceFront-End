<template>
  <div class="bg-dark text-positive">
    <q-card class="bg-dark text-positive">
      <q-card-section>
          <q-item>
            <q-input dense label-color="positive" rounded standout="" bg-color="primary" input-class="text-positive" class="col q-pa-xs" v-model="firstDate"
              mask="####-##-##" label="Data początkowa">
              <template v-slot:append>
                <q-icon color="positive" name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date @input="getAllGunUsed()" v-model="firstDate" no-unset mask="YYYY-MM-DD" class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input dense v-model="secondDate" rounded standout="" bg-color="secondary" label="Data końcowa" class="col q-pa-xs" input-class="text-positive"
              label-color="positive">
              <template v-slot:append>
                <q-icon color="positive" name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date @input="getAllGunUsed()" v-model="secondDate" no-unset mask="YYYY-MM-DD" class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-btn dense label="wyszukaj" color="primary" class="q-pa-xs" rounded @click="getAllGunUsed()"></q-btn>
          </q-item>
      </q-card-section>
      <q-card-section>
        <div class="row col">
          <div class="row items-center col text-positive text-bold text-body2 q-pa-xs">
            <div style="width: 3%;">Lp</div>
            <div class="col">Data i<br />Godzina Wydania</div>
            <div class="col">Marka i Model</div>
            <div class="col">Numer i Seria</div>
            <div class="col">Numer<br />Świadectwa Broni</div>
            <div class="col">Imię i Nazwisko<br />Pobierającego Broń</div>
            <div class="col">Imię i Nazwisko<br />Wydającego Broń</div>
            <div class="col">Podpis Zdającego Broń</div>
            <div class="col">Podpis Przyjmującego Broń</div>
            <div class="col">Data i<br />Godzina Przyjęcia</div>
          </div>
        </div>
        <div class="row col xyz1 items-center text-bold" v-for="(item, index) in gunsInUsed" :key="index"
          @dblclick="gunUsedUUID = item.uuid; temp = item; gunUsedInfo = true">
          <Tooltip2clickToShow />
          <div style="width: 3%;" class="text-center">{{ index + 1 }}</div>
          <div class="col">
            <div>{{ item.issuanceDate }}</div>
            <div>{{ item.issuanceTime }}</div>
          </div>
          <div class="col">{{ item.gun.modelName }}</div>
          <div class="col">{{ item.gun.serialNumber }}</div>
          <div class="col">{{ item.gun.gunCertificateSerialNumber }}</div>
          <div class="col">{{ item.gunTakerName }}</div>
          <div class="col">{{ item.issuanceBy }}</div>
          <div class="col">{{ item.gunReturnerName }}</div>
          <div class="col">{{ item.acceptanceBy }}</div>
          <div class="col">
              <div>{{ item.acceptanceDate }}</div>
              <div>{{ item.acceptanceTime }}</div>
            </div>
          <div class="line"></div>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="gunUsedInfo">
      <GunUsedInfo :uuid="gunUsedUUID"/>
    </q-dialog>
  </div>
</template>
<style src="src/style/style.scss" lang="scss"></style>
<script>
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
export default {
  props: {
    load: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    load (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getAllGunUsed()
      }
    }
  },
  components: {
    Tooltip2clickToShow: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickToShow.vue'),
      loading: SkeletonBox
    }),
    GunUsedInfo: lazyLoadComponent({
      componentFactory: () => import('./GunUsedInfo.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      temp: null,
      gunUsedUUID: null,
      firstDate: null,
      secondDate: this.createTodayDate(),
      gunsInUsed: null,
      gunUsedInfo: false,
      local: App.host,
      prod: App.prod
    }
  },
  methods: {
    getAllGunUsed () {
      fetch(`${this.local}/armory/getAllGunUsed?firstDate=${this.firstDate}&secondDate=${this.secondDate}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.gunsInUsed = response
        })
    },
    createTodayDate () {
      const date = new Date()
      let month = 0
      let day = 0
      if ((date.getMonth() + 1) < 10) {
        month = '0' + (date.getMonth() + 1)
      } else {
        month = (date.getMonth() + 1)
      }
      if (date.getDate() < 10) {
        day = '0' + (date.getDate())
      } else {
        day = (date.getDate())
      }
      return date.getFullYear() + '-' + month + '-' + day
    }
  }
}
</script>
