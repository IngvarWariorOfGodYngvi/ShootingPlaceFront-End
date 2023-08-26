<template>
<div>
  <div class="text-body2 bg-dark text-positive" style="border: 0">
    <div :class="mobile?'col':'row'">
      <q-card-section class="col-3">
        <q-item class="col">
          <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled v-model="firstDateJoinDate" mask="####-##-##" label="Data początkowa">
            <template v-slot:append>
              <q-icon name="event" color="positive" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date @input="getSumJoinDate ()" v-model="firstDateJoinDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
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
          <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled v-model="secondDateJoinDate" mask="####-##-##" label="Data końcowa">
            <template v-slot:append>
              <q-icon name="event" color="positive" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date @input="getSumJoinDate ()" v-model="secondDateJoinDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary"/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item>
        <div class="q-pa-md">
          <q-btn color="primary" text-color="positive" @click="getSumJoinDate()" label="Wyszukaj"></q-btn>
          <p></p>
          <q-btn v-if="firstDateJoinDate!=null&&secondDateJoinDate!=null" @click="getSumJoinDateXLSXFile()" label="pobierz plik xlsx" color="green-3" text-color="black"></q-btn>
          <q-btn v-else-if="!mobile" label="pobierz plik xlsx" color="green-3" disabled text-color="black"></q-btn>
        </div>
      </q-card-section>
      <q-card-section class="col">
        <div v-if="quantitySumJoinDateRearrangeTable.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">Brak wyników zapisów - Wybierz daty</div>
        <div v-if="quantitySumJoinDateRearrangeTable.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">Ilość Zapisów : {{quantitySumJoinDateRearrangeTable.length}}</div>
        <q-virtual-scroll v-if="quantitySumJoinDateRearrangeTable.length >0" :items="quantitySumJoinDateRearrangeTable" type="table" dense class="row full-width q-pa-none bg-dark" style="height: 50vh;">
          <template v-slot:before>
            <thead class="thead-sticky text-left">
            <tr class="bg-primary text-white">
              <th class="text-left">{{quantitySumJoinDateRearrangeTable.length}} Nazwisko i Imię</th>
              <th class="text-left" style="width: 15%">Numer<br/>Legitymacji</th>
              <th class="text-left" style="width: 15%">Data dołączenia do<br/>Klubu</th>
              <th class="text-left" style="width: 15%">Grupa</th>
              <th class="text-left" style="width: 15%">Status</th>
            </tr>
            </thead>
          </template>
          <template v-slot="{ item, index }">
            <tr :key="index" class="rounded text-positive" style="cursor:pointer" @dblclick="legitimationNumber = item.legitimation_number; memberDial=true">
              <q-tooltip content-class="text-subtitle2" anchor="top middle">kliknij dwa razy aby wyświetlić podgląd
              </q-tooltip>
              <td class="text-left xyz"><b>{{index+1}}</b> {{item.second_name}} {{item.first_name}}</td>
              <td class="text-left">nr leg. {{item.legitimation_number}}</td>
              <td class="text-left">{{convertDate(item.join_date)}}</td>
              <td class="text-left"><div>{{item.adult? 'Ogólna' : 'Młodzieżowa'}}</div></td>
              <td class="text-center text-black" :class="item.active?'bg-green-3':'bg-red'">{{item.active?'Aktywny':'Nieaktywny'}}</td>
            </tr>
          </template>
        </q-virtual-scroll>
      </q-card-section>
    </div>
  </div>
  <q-dialog v-model="memberDial" style="min-width: 80vw">
    <q-card class="bg-dark" style="min-width: 80vw">
      <q-card-section class="flex-center">
        <Member :member-number-legitimation="legitimationNumber"></Member>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn text-color="white" label="zamknij" color="primary" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</div>
</template>
<style src="src/style/style.scss" lang="scss">
</style>
<script>
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'
import axios from 'axios'
import App from 'src/App'

export default {
  name: 'SignUps.vue',
  components: {
    Member: lazyLoadComponent({
      componentFactory: () => import('components/member/Member.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      memberDial: false,
      firstDateJoinDate: null,
      legitimationNumber: null,
      secondDateJoinDate: this.createTodayDate(),
      quantitySumJoinDate: [],
      quantitySumJoinDateRearrangeTable: [],
      mobile: App.mobile,
      local: App.host
    }
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
    getSumJoinDate () {
      fetch('http://' + this.local + '/statistics/joinDateSum?firstDate=' + this.firstDateJoinDate.replace(/\//gi, '-') + '&secondDate=' + this.secondDateJoinDate.replace(/\//gi, '-'), {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantitySumJoinDate = response
          this.quantitySumJoinDateRearrangeTable = response
        })
      })
    },
    getSumJoinDateXLSXFile () {
      axios({
        url: 'http://' + this.local + '/files/joinDateSum?firstDate=' + this.firstDateJoinDate.replace(/\//gi, '-') + '&secondDate=' + this.secondDateJoinDate.replace(/\//gi, '-'),
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'lista zapisów.xlsx')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    convertDate (date) {
      const current = new Date(date)
      let month = current.getMonth() + 1
      let day = current.getDate()
      if (day < 10) {
        day = '0' + day
      }
      if (month < 10) {
        month = '0' + (month)
      }
      return day + '-' + (month) + '-' + current.getFullYear()
    }
  }
}
</script>

<style scoped>

</style>
