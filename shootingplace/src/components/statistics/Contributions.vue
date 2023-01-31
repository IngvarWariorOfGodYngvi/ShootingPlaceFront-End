<template>
<div>
  <div class="text-body2 bg-white" style="border: 0">
    <div class="row">
      <q-card-section class="col-3">
        <q-item class="col">
          <q-input class="full-width" color="black" dense filled v-model="firstDate" mask="####-##-##" label="Data początkowa">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date no-unset @input="getSum()" v-model="firstDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item>
        <q-item class="col">
          <q-input class="full-width" color="black" dense filled v-model="secondDate" mask="####-##-##" label="Data końcowa">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date @input="getSum()" v-model="secondDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item>
        <div class="row-reverse">
          <div class="row-reverse">
            <q-radio @input="rearrangeSumTable ()" class="q-pa-md" v-model="adultCondition" :val="false">
              młodzież
            </q-radio>
            <q-radio @input="rearrangeSumTable ()" class="q-pa-md" v-model="adultCondition" :val="true">
              dorośli
            </q-radio>
          </div>
          <q-btn align=right @click="getSum();rearrangeSumTable ()">Wyszukaj</q-btn>
        </div>
      </q-card-section>
      <q-card-section class="col">
        <div v-if="quantitySumRearrangeTable.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">Ilość Składek : {{quantitySumRearrangeTable.length}}</div>
        <q-virtual-scroll v-if="quantitySumRearrangeTable.length >0" :items="quantitySumRearrangeTable" type="table" dense class="q-pa-none" style="height: 40vh;">
          <template v-slot:before>
            <thead class="thead-sticky text-left">
            <tr>
              <th class="text-left" ><div>{{quantitySumRearrangeTable.length}} Nazwisko i Imię</div></th>
              <th class="text-left" style="width: 20%"><div>Numer</div><div>Legitymacji</div></th>
              <th class="text-left" style="width: 20%"><div>Numer</div><div>Licencji</div></th>
              <th class="text-left" style="width: 20%">Status</th>
            </tr>
            </thead>
          </template>
          <template v-slot="{ item, index }">
            <tr :key="index" class="rounded" style="cursor:pointer" @dblclick="legitimationNumber = item.legitimationNumber; memberDial=true">
              <q-tooltip content-class="text-subtitle2" anchor="top middle">kliknij dwa razy aby wyświetlić podgląd
              </q-tooltip>
              <td class="xyz"><b>{{index+1}}</b> {{item.secondName}} {{item.firstName}}</td>
              <td>nr. leg {{item.legitimationNumber}}</td>
              <td v-if="item.license.number != null" class="text-left">{{item.license.number}}</td>
              <td v-if="item.license.number == null" class="text-left text-grey-8"><div>Brak Licencji</div></td>
              <td v-if="item.active" class="bg-green-3 text-left"><div>Aktywny</div></td>
              <td v-if="!item.active" class="bg-warning text-left"><div>Nieaktywny</div></td>
            </tr>
          </template>
        </q-virtual-scroll>
      </q-card-section>
    </div>
  </div>
  <q-dialog v-model="memberDial" style="min-width: 80vw">
    <q-card style="min-width: 80vw">
      <q-card-section class="flex-center">
        <Member :member-number-legitimation="legitimationNumber"></Member>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="zamknij" color="black" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</div>

</template>

<script>
import App from 'src/App'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'

export default {
  name: 'contributions.vue',
  data () {
    return {
      memberDial: false,
      firstDate: null,
      secondDate: this.createTodayDate(),
      adultCondition: null,
      quantitySumRearrangeTable: [],
      legitimationNumber: null,
      local: App.host
    }
  },
  components: {
    Member: lazyLoadComponent({
      componentFactory: () => import('components/member/Member.vue'),
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
