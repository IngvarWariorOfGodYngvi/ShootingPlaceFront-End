<template>
  <div v-if="!mobile && main" class="q-pa-sm">
    <q-item-label v-if="quantities[8]>0" class="text-bold text-white self-center text-center" dense caption>
      Nieopłaconych licencji : <b class="pulse">{{ quantities[8] }}</b>
    </q-item-label>
    <q-item-label class="text-bold text-white xyz1" dense caption @dblclick="legitimationNumber = number;memberDial=true" style="cursor: pointer;">
      <Tooltip2clickToShow></Tooltip2clickToShow>
      Najwyższy numer legitymacji : {{ number }}
    </q-item-label>
    <q-item-label class="text-bold text-white" dense caption>Licencje ważne : {{ quantities[1] }}
    </q-item-label>
    <q-item-label class="text-bold text-white" dense caption>Licencje nieważne : {{ quantities[2] }}
    </q-item-label>
    <q-item-label class="text-bold text-white" dense caption>Klubowiczów ogółem :
      {{ quantities[0] + quantities[3] }} ({{ quantities[0] }} + {{ quantities[3] }})
    </q-item-label>
    <q-item-label class="text-bold text-white" dense caption>Zapisów w aktualnym roku : {{ members }}
    </q-item-label>
    <q-item-label class="text-bold text-white" dense caption>Nowych licencji w aktualnym roku :
      {{ quantities[9] }}
    </q-item-label>
    <q-item-label v-if="visible" class="text-bold text-white" dense caption>Program ważny do :
      {{ date }}
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

  created () {
    this.check()
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
      quantities: [],
      date: null,
      visible: false,
      members: '',
      number: '',
      memberDial: false,
      legitimationNumber: null,
      main: App.main,
      mobile: App.mobile,
      local: App.host
    }
  },
  methods: {
    getNumber () {
      fetch(`${this.local}/statistics/maxLegNumber`, {
        method: 'GET'
      }).then(response => response.json()).then(response => {
        this.number = response
      })
    },
    getMembersQuantity () {
      fetch(`${this.local}/statistics/membersQuantity`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.quantities = response
        })
    },
    getActualYearMemberCounts () {
      fetch(`${this.local}/statistics/actualYearMemberCounts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.members = response
        })
    },
    check () {
      this.getMembersQuantity()
      this.getActualYearMemberCounts()
      this.getNumber()
      this.date = window.localStorage.getItem('licenseDate')
      const date2 = new Date(this.date)
      const dateNow = new Date()
      date2.setMonth(date2.getMonth() - 3)
      this.visible = dateNow.getTime() > date2.getTime()
      setInterval(() => {
        this.getNumber()
        this.getMembersQuantity()
        this.getActualYearMemberCounts()
        this.date = window.localStorage.getItem('licenseDate')
      }, 300000)
    }
  }
}

</script>
