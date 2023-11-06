<template>
<div>
  <div class="text-body2 bg-dark text-positive" style="border: 0">
    <div :class="mobile?'col':'row'">
      <q-card-section class="col-3">
        <q-item class="col">
          <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled v-model="firstDate" mask="####-##-##" label="Data początkowa">
            <template v-slot:append>
              <q-icon name="event" color="positive" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date no-unset @input="getSum()" v-model="firstDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary"/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item>
        <q-item class="col">
          <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled v-model="secondDate" mask="####-##-##" label="Data końcowa">
            <template v-slot:append>
              <q-icon name="event" color="positive" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date @input="getSum()" v-model="secondDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary"/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item>
        <div class="row-reverse">
          <div class="row-reverse">
            <q-radio color="primary" @input="rearrangeSumTable ()" class="q-pa-md text-positive" v-model="adultCondition" :val="false">
              młodzież
            </q-radio>
            <q-radio color="primary" @input="rearrangeSumTable ()" class="q-pa-md text-positive" v-model="adultCondition" :val="true">
              dorośli
            </q-radio>
          </div>
          <q-btn color="primary" text-color="white" align=right @click="getSum();rearrangeSumTable ()">Wyszukaj</q-btn>
        </div>
      </q-card-section>
      <q-card-section class="col">
        <div v-if="quantitySumRearrangeTable.length >0" class="q-pa-md col text-bold text-center text-h6">Ilość Składek : {{quantitySumRearrangeTable.length}}</div>
        <q-virtual-scroll v-if="quantitySumRearrangeTable.length >0"
           :items="quantitySumRearrangeTable"
           :virtual-scroll-item-size="48"
                        :virtual-scroll-sticky-size-start="48"
                        :virtual-scroll-sticky-size-end="32"
            type="table"
             dense
              class="row full-width q-pa-none bg-dark"
               style="height: 40vh;">
          <template v-slot:before>
            <thead class="thead-sticky text-left">
            <tr class="bg-primary text-white">
              <th class="text-left">{{quantitySumRearrangeTable.length}} Nazwisko i Imię</th>
              <th class="text-left" style="width: 20%">Numer<br/>Legitymacji</th>
              <th class="text-left" style="width: 20%">Data</th>
              <th class="text-center" style="width: 20%">Status</th>
            </tr>
            </thead>
          </template>
          <template v-slot="{ item, index }">
            <tr :key="index" class="rounded text-positive" style="cursor:pointer" @dblclick="legitimationNumber = item.member.legitimation_number; memberDial=true">
              <Tooltip2clickToShow></Tooltip2clickToShow>
              <td class="xyz"><b>{{index+1}}</b> {{item.member.second_name}} {{item.member.first_name}}</td>
              <td>nr. leg {{item.member.legitimation_number}}</td>
              <td class="text-left">{{item.contribution.paymentDay}}</td>
              <td class="text-center text-black" :class="item.member.active?'bg-green-3':'bg-red'">{{item.member.active?'Aktywny':'Nieaktywny'}}</td>
            </tr>
          </template>
        </q-virtual-scroll>
      </q-card-section>
    </div>
  </div>
  <q-dialog v-model="memberDial" style="min-width: 80vw">
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
<style src="src/style/style.scss" lang="scss">
</style>
<script>
import App from 'src/App'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'

export default {
  name: 'contributions.vue',
  data () {
    return {
      memberDial: false,
      legitimationNumber: null,
      firstDate: null,
      secondDate: this.createTodayDate(),
      adultCondition: null,
      quantitySumRearrangeTable: [],
      mobile: App.mobile,
      local: App.host
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
  methods: {
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
      return date.getFullYear() + '/' + month + '/' + day
    },
    getSum () {
      fetch('http://' + this.local + '/statistics/contributionSum?firstDate=' + this.firstDate.replace(/\//gi, '-') + '&secondDate=' + this.secondDate.replace(/\//gi, '-'), {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantitySum = response
          this.quantitySumRearrangeTable = response
        })
      })
    },
    rearrangeSumTable () {
      const arr = this.quantitySum
      const arr1 = []
      if (this.adultCondition !== null) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].adult === this.adultCondition) {
            arr1.push(arr[i])
          }
        }
      }
      this.quantitySumRearrangeTable = arr1
    }
  }
}
</script>
