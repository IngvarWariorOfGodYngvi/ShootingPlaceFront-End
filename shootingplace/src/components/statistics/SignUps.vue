<template>
<div>
  <div class="text-body2  bg-white">
    <div class="row">
      <q-card-section class="col-3">
        <q-item class="col">
          <q-input class="full-width" color="black" dense filled v-model="firstDateJoinDate" mask="####-##-##" label="Data początkowa">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date @input="getSumJoinDate ()" v-model="firstDateJoinDate">
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
          <q-input class="full-width" color="black" dense filled v-model="secondDateJoinDate" mask="####-##-##" label="Data końcowa">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date @input="getSumJoinDate ()" v-model="secondDateJoinDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item>
        <div class="q-pa-md">
          <q-btn @click="getSumJoinDate()" label="Wyszukaj"></q-btn>
          <p></p>
          <q-btn v-if="firstDateJoinDate!=null&&secondDateJoinDate!=null" @click="getSumJoinDateXLSXFile()" label="pobierz plik xlsx" color="green-3" text-color="black"></q-btn>
          <q-btn v-else label="pobierz plik xlsx" color="green-3" disabled text-color="black"></q-btn>
        </div>
      </q-card-section>
      <q-card-section class="col">
        <div v-if="quantitySumJoinDateRearrangeTable.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">^ Brak wyników zapisów - Wybierz daty ^</div>
        <div v-if="quantitySumJoinDateRearrangeTable.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">Ilość Zapisów : {{quantitySumJoinDateRearrangeTable.length}}</div>
        <q-virtual-scroll v-if="quantitySumJoinDateRearrangeTable.length >0" :items="quantitySumJoinDateRearrangeTable" type="table" dense class="row full-width" style="height: 50vh;">
          <template v-slot:before>
            <thead class="thead-sticky text-left">
            <tr>
              <th class="text-left"><div>{{quantitySumJoinDateRearrangeTable.length}} Nazwisko i Imię</div></th>
              <th class="text-left" style="width: 15%"><div>Numer</div><div>Legitymacji</div></th>
              <th class="text-left" style="width: 15%"><div>Data dołączenia do</div><div>Klubu</div></th>
              <th class="text-left" style="width: 15%">Grupa</th>
              <th class="text-left" style="width: 15%">Status</th>
            </tr>
            </thead>
          </template>
          <template v-slot="{ item, index }">
            <tr :key="index" class="rounded" style="cursor:pointer" @dblclick="legitimationNumber = item.legitimationNumber; memberDial=true">
              <q-tooltip content-class="text-subtitle2" anchor="top middle">kliknij dwa razy aby wyświetlić podgląd
              </q-tooltip>
              <td class="text-left xyz"><b>{{index+1}}</b> {{item.secondName}} {{item.firstName}}</td>
              <td class="text-left">nr leg. {{item.legitimationNumber}}</td>
              <td class="text-left">{{item.joinDate}}</td>
              <td v-if="item.adult" class="text-left"><div>Ogólna</div></td>
              <td v-if="!item.adult" class="text-left"><div>Młodzieżowa</div></td>
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
    }
  }
}
</script>

<style scoped>

</style>
