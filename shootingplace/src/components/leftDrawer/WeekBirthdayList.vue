<template>
  <div v-if="!mobile && list.length > 0" class="q-pa-sm text-white text-bold">
    <div class="text-center">Urodziny w tym tygodniu obchodzą:</div>
    <q-item-label class="text-white text-bold text-positive hover3 round q-pl-xs" caption  v-for="(item,index) in list" :key="index" @dblclick="legitimationNumber = item.legitimationNumber;memberDial=true">
      <Tooltip2clickToShow></Tooltip2clickToShow>
      {{ index +1 }}  {{ item.secondName }} {{ item.firstName }} {{ item.legitimationNumber }} {{ item.adult?'ogólna':'młodzież' }}
    </q-item-label>
    <q-dialog v-model="memberDial" >
    <q-card style="min-width: 80vw" class="bg-dark">
      <q-card-section class="flex-center">
        <Member :member-number-legitimation="legitimationNumber"></Member>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="zamknij" color="primary" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
  </div>
</template>

<script>
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'
export default {
  name: 'membersQuantities',
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
  created () {
    this.getWeekBirthdayList()
  },
  data () {
    return {
      list: ['ktoś', 'tam', 'ma', 'urodziny'],
      memberDial: false,
      legitimationNumber: null,
      mobile: App.mobile,
      local: App.host
    }
  },
  methods: {
    getWeekBirthdayList () {
      fetch(`${this.local}/statistics/weekBirthdayList`, {
        method: 'GET'
      }).then(response => response.json()).then(response => {
        this.list = response
      }).catch(() => { this.list = [] })
    }
  }
}

</script>
