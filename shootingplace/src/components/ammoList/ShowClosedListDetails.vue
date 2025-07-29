<template>
  <div class="col">
    <q-btn glossy color="secondary" icon="list_alt" @click="getEvidence();open=!open" class="full-width">
      <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Sprawdź szczegóły
      </q-tooltip>
    </q-btn>
    <q-dialog v-model="open" v-if="evidence!=null">
      <q-card class="bg-dark text-positive" style="min-width: 60vw; height: 75vh">
        <q-card-actions align="right">
          <div class="text-center text-h6 text-bold col">Szczegóły dotyczące listy {{ evidence.number }}</div>
          <q-btn icon="close" round dense color="primary" v-close-popup/>
        </q-card-actions>
        <q-card-section>
          <div v-for="(item, index) in evidence.ammoInEvidenceDTOList" :key="index">
            <div>
              <div class="text-center text-bold">
            {{ item.caliberName }}
              </div>
              <div class="line"></div>
              <div v-for="(item1, index1) in item.ammoUsedToEvidenceDTOList" :key="index1" class="row xyz1 bg-primary" @dblclick="temp=item1.legitimationNumber;memberDial = true">
                <Tooltip2clickToShow/>
                <div class="col q-pl-md">
                  {{ item1.name }}
                </div>
                <div class="col text-right q-pr-md">
                  {{ item1.counter }}
                </div>
              </div>
              <div class="text-right text-bold q-pr-md">suma: {{item.quantity}}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="memberDial">
      <Member v-if="temp!=null" :member-number-legitimation="temp"/>
    </q-dialog>
  </div>
</template>
<style src="src\style\style.scss" lang="scss">
</style>
<script>
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
export default {
  name: 'ShowClosedListDetails',
  props: {
    uuid: {
      type: String,
      require: true
    }
  },
  components: {
    Member: lazyLoadComponent({
      componentFactory: () => import('components/member/Member.vue'),
      loading: SkeletonBox
    }),
    Tooltip2clickToShow: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickToShow.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      evidence: null,
      temp: null,
      memberDial: false,
      open: false,
      local: App.host
    }
  },
  methods: {
    getEvidence () {
      fetch(`${this.local}/ammoEvidence/oneEvidence?uuid=${this.uuid}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.evidence = response
        })
    }
  }
}
</script>
